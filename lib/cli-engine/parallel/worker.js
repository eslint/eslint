"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const fs = require("fs");
const util = require("util");
const { isThreadSupported } = require("./shared");
const readFile = util.promisify(fs.readFile);

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Get the parent port.
 * @returns {{workerId:number, parentPort:MessagePort}} The parent port.
 */
function getThreadParentPort() {
    const { parentPort, threadId, workerData } = require("worker_threads"); //eslint-disable-line

    // https://github.com/nodejs/node/issues/26946
    require("debug").inspectOpts.colors = workerData.colors;

    return { workerId: threadId, parentPort };
}

/**
 * Get the parent port.
 * @returns {{workerId:number, parentPort:NodeJS.Process}} The parent port.
 */
function getProcessParentPort() {
    process.postMessage = process.send;
    return { workerId: process.pid, parentPort: process };
}

// Select the implementation.
const { parentPort, workerId } =
    isThreadSupported ? getThreadParentPort() : getProcessParentPort();

/**
 * Load the initial data.
 * @returns {Promise<{cliOptions:CLIEngineOptions,files:string[]}>} The loaded initial data.
 */
function loadInitialData() {
    return new Promise(resolve => {
        parentPort.once("message", resolve);
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
        parentPort.on("message", function listener(msg) {
            if (msg.senderId === senderId) {
                parentPort.removeListener("message", listener);
                resolve(msg.next);
            }
        });
        parentPort.postMessage({ senderId, result });
    });
}

// To use colors, initialize `debug` after `getThreadParentPort()`.
const debug = require("debug")("eslint:parallel-worker");
const { CLIEngine, verifyText } = require("../cli-engine");

//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------

(async function main() {
    debug("<%d> Waiting the initial data", workerId);
    const { cliOptions, files: initialFiles } = await loadInitialData();

    // Prevent false positive of memory-leak detection.
    parentPort.setMaxListeners(initialFiles.length);

    debug("<%d> Initializing CLIEngine", workerId);
    const engine = new CLIEngine(cliOptions);
    let count = 0;

    debug("<%d> Linting started", workerId);

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
        debug("<%d:%d> Start", workerId, index);
        let filePath = initialFilePath;

        while (filePath) {
            debug("<%d:%d> Lint %O", workerId, index, filePath);
            const result = verifyText(
                engine,
                void 0,
                filePath,
                await readFile(filePath, "utf8")
            );

            count += 1;
            filePath = await sendResult(index, result);
        }

        debug("<%d:%d> Finish", workerId, index);
    }));

    debug("<%d> Linting completed (linted %d files)", workerId, count);
}()).catch(error => {
    debug(error);
    process.exitCode = 1;
});
