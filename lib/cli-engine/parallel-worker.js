"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const fs = require("fs");
const util = require("util");
const { parentPort, threadId, workerData } = require("worker_threads"); // eslint-disable-line node/no-missing-require, node/no-unsupported-features/node-builtins
const debug = require("debug")("eslint:parallel-worker");
const { CLIEngine, getCLIEngineInternalSlots, verifyText } = require("./cli-engine");

//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------

debug("<%d> Initializing CLIEngine", threadId);

const readFile = util.promisify(fs.readFile);
const { cliOptions, files: initialFiles } = workerData;
const engine = new CLIEngine(cliOptions);
const {
    configArrayFactory,
    fileEnumerator,
    linter,
    options: {
        allowInlineConfig,
        cwd,
        fix,
        reportUnusedDisableDirectives
    }
} = getCLIEngineInternalSlots(engine);
const { extensionRegExp } = fileEnumerator;
let count = 0;

debug("<%d> Linting started (micro-threads=%d)", threadId, initialFiles.length);

parentPort.setMaxListeners(initialFiles.length);

/**
 * Send a lint result to the master.
 * And wait for the command from the master.
 * @param {number} senderId The micro-thread number.
 * @param {LintResult} result The lint result.
 * @returns {Promise<string>} The file path of the next target file.
 */
function sendResult(senderId, result) {
    return new Promise(resolve => {
        parentPort.on("message", function listener(msg) {
            if (msg.senderId === senderId) {
                parentPort.removeListener("message", listener);
                resolve(msg.next);
            }
        });
        parentPort.postMessage({ senderId, result });
    });
}

/**
 * Lint files.
 * This repeats the following steps until the next file is nothing.
 *
 * 1. Lint a file.
 * 2. Send the lint result to the master.
 * 3. Receive the next file from the master.
 *
 * The steps contain much waiting for IO. Therefore, it runs multiple in parallel
 * in the worker. The second argument `index` is the number in the multiple loops.
 *
 * @param {string} initialFilePath The path to the first target file.
 * @param {number} index The micro-thread number.
 * @returns {Promise<void>} void.
 */
async function lint(initialFilePath, index) {
    debug("<%d:%d> Start", threadId, index);
    let filePath = initialFilePath;

    while (filePath) {
        debug("<%d:%d> Lint %s", threadId, index, filePath);
        const result = verifyText({
            text: await readFile(filePath, "utf8"),
            filePath,
            config: configArrayFactory.getConfigArrayForFile(filePath),
            cwd,
            fix,
            allowInlineConfig,
            reportUnusedDisableDirectives,
            extensionRegExp,
            linter
        });

        count += 1;
        filePath = await sendResult(index, result);
    }

    debug("<%d:%d> Finish", threadId, index);
}

// Lint files in I/O parallel.
Promise.all(initialFiles.map(lint))
    .then(() => {
        debug("<%d> Linting completed (linted %d files)", threadId, count);
    })
    .catch(error => {
        debug(error.stack);
        process.exitCode = 1;
    });
