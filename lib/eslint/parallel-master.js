"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const debug = require("debug");
const {
    ConcurrencyInWorker,
    isThreadSupported,
    runConcurrently
} = require("./util");

const WorkerPath = require.resolve("./parallel-worker");
const log = debug("eslint:parallel-master");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Define the function that create a new thread worker.
 * @returns {Worker} The thread worker.
 */
function defineCreateThreadWorker() {
    log("Use threads.");
    const { Worker } = require("worker_threads"); //eslint-disable-line

    // https://github.com/nodejs/node/issues/26946
    const workerData = { colors: log.useColors };

    return () => new Worker(WorkerPath, { workerData });
}

/**
 * Define the function that create a new process worker.
 * @returns {ChildProcess} The process worker.
 */
function defineCreateProcessWorker() {
    log("Use processes.");
    const { fork } = require("child_process");

    return () => {
        const worker = fork(WorkerPath);

        worker.postMessage = worker.send;
        worker.terminate = worker.kill;
        return worker;
    };
}

// Select the implementation.
const createWorker = isThreadSupported()
    ? defineCreateThreadWorker()
    : defineCreateProcessWorker();

//------------------------------------------------------------------------------
// Public
//------------------------------------------------------------------------------

/**
 * Lint files in parallel.
 * @param {string[]} files The list of target files.
 * @param {Object} cliOptions The options for CLIEngine.
 * @param {number} concurrency The number of worker threads.
 * @returns {Promise<LintResult[]>} The lint results.
 */
async function lintInParallel(files, cliOptions, concurrency) {
    const results = [];
    const workers = [];
    let cursor = 0;
    let errorInWorker = null;

    /**
     * Create the initial data for the next worker.
     * @returns {{cliOptions:CLIOptions,files:string[]}} The initial data.
     */
    function createInitialData() {
        const start = cursor;
        const end = (cursor += ConcurrencyInWorker);

        return { cliOptions, files: files.slice(start, end) };
    }

    /**
     * Terminate all workers and store the error.
     * @param {Error} error The happend error.
     * @returns {void}
     */
    function handleError(error) {
        errorInWorker = errorInWorker || error;
        for (const worker of workers) {
            worker.terminate();
        }
        workers.length = 0;
    }

    log("Spawn %d workers.", concurrency);
    await runConcurrently(concurrency, () => new Promise(resolve => {
        const worker = createWorker();

        // Store the worker to terminate when errors hannpened.
        workers.push(worker);

        // Catch the end of this worker.
        worker.on("error", error => {
            handleError(error);
            resolve();
        });
        worker.on("exit", exitCode => {
            if (exitCode) {
                handleError(
                    new Error(`Worker stopped with exit code ${exitCode}`)
                );
            }
            resolve();
        });

        // Set up communication.
        worker.on("message", ({ error, result, senderId }) => {
            if (error) {
                handleError(error);
            } else {
                worker.postMessage({
                    senderId,
                    next: cursor < files.length ? files[cursor++] : null
                });
                results.push(result);
            }
        });

        // Send the initial data.
        worker.postMessage(createInitialData());
    }));

    if (errorInWorker) {
        throw errorInWorker;
    }
    return results;
}

module.exports = { lintInParallel };
