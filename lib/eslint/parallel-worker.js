"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const fs = require("fs");
const util = require("util");
const debug = require("debug");
const { isThreadSupported } = require("./util");
const readFile = util.promisify(fs.readFile);

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Get the parent port.
 * @returns {{workerId:number, masterPort:MessagePort}} The parent port.
 */
function getThreadParentPort() {
    const { parentPort, threadId, workerData } = require("worker_threads"); //eslint-disable-line

    // https://github.com/nodejs/node/issues/26946
    debug.inspectOpts.colors = workerData.colors;

    return { workerId: threadId, masterPort: parentPort };
}

/**
 * Get the parent port.
 * @returns {{workerId:number, masterPort:NodeJS.Process}} The parent port.
 */
function getProcessParentPort() {
    process.postMessage = process.send;
    return { workerId: process.pid, masterPort: process };
}

// Select the implementation.
const { masterPort, workerId } = isThreadSupported()
    ? getThreadParentPort()
    : getProcessParentPort();

// To use colors, initialize `debug` after `getThreadParentPort()`.
const log = debug("eslint:parallel-worker");
const { CLIEngine, verifyText } = require("../cli-engine/cli-engine");

/**
 * Load the initial data.
 * @returns {Promise<{cliOptions:CLIEngineOptions,files:string[]}>} The loaded initial data.
 */
function loadInitialData() {
    return new Promise(resolve => {
        masterPort.once("message", resolve);
    });
}

/**
 * Send a lint result to the master.
 * And wait for the command from the master.
 * @param {number} senderId The micro-thread number.
 * @param {LintResult} result The lint result.
 * @returns {Promise<string>} The file path of the next target file.
 */
function sendResult(senderId, result) {
    return new Promise(resolve => {
        masterPort.on("message", function listener(msg) {
            if (msg.senderId === senderId) {
                masterPort.removeListener("message", listener);
                resolve(msg.next);
            }
        });
        masterPort.postMessage({ senderId, result });
    });
}

//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------

(async function main() {
    log("<%d> Waiting the initial data", workerId);
    const { cliOptions, files: initialFiles } = await loadInitialData();

    // Prevent false positive of memory-leak detection.
    masterPort.setMaxListeners(initialFiles.length);

    log("<%d> Initializing CLIEngine", workerId);
    const engine = new CLIEngine(cliOptions);
    let count = 0;

    log("<%d> Linting started", workerId);

    /*
     * Lint files.
     * This repeats the following steps until the next file is nothing.
     *
     * 1. Lint a file.
     * 2. Send the lint result to the master.
     * 3. Receive the next file from the master.
     *
     * The steps contain much waiting for IO. Therefore, it runs multiple in
     * parallel in the worker.
     */
    await Promise.all(initialFiles.map(async(initialFilePath, index) => {
        log("<%d:%d> Start", workerId, index);
        let filePath = initialFilePath;

        do {
            log("<%d:%d> Lint %O", workerId, index, filePath);
            const result = verifyText(
                engine,
                void 0,
                filePath,
                await readFile(filePath, "utf8")
            );

            count += 1;
            filePath = await sendResult(index, result);
        } while (filePath);

        log("<%d:%d> Finish", workerId, index);
    }));

    log("<%d> Linting completed (linted %d files)", workerId, count);
}()).catch(error => {
    log(error);
    process.exitCode = 1;

    // Send the error info to the main thread if possible.
    try {
        masterPort.postMessage({
            error: {
                message: error.message,
                stack: error.stack,
                messageTemplate: error.messageTemplate,
                messageData: error.messageData
            }
        });
    } catch (_) {

        // ignore.
    }
});
