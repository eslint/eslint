"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const debug = require("debug");
const { getCLIEngineInternalSlots } = require("../cli-engine/cli-engine");
const { LintResultGenerator } = require("./lint-result-generator");
const {
    ConcurrencyInWorker,
    isThreadSupported,
    runConcurrently
} = require("./util");

const WorkerPath = require.resolve("./worker-main");
const log = debug("eslint:verify-files-in-workers");

log.enabled = true;

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/** @typedef {import("../cli-engine/cli-engine").CLIEngineOptions} CLIEngineOptions */
/** @typedef {import("../cli-engine/cli-engine").ConfigArray} ConfigArray */
/** @typedef {import("../cli-engine/cli-engine").LintResult} LintResult */

/**
 * @typedef {Object} LintingContext
 * @property {number} cursor The index of the next target file.
 * @property {string[]} files The target files.
 * @property {CLIEngineOptions} options The options for CLIEngine.
 * @property {Set<import("worker_threads").Worker>} runningWorkers The running workers.
 * @property {function(LintResult):void} yield The function to yield results.
 */

/**
 * Define the function that create a new thread worker.
 * @returns {Worker} The thread worker.
 */
function defineCreateThreadWorker() {
    log("Use worker_threads.");
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
    log("Use child_process.");
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

/**
 * Run a worker thread.
 * @param {LintingContext} context The target files.
 * @returns {Promise<void>} The promise object that will be fulfilled after the worker exited.
 */
function runWorker(context) {
    return new Promise((resolve, reject) => {
        const worker = createWorker();
        const start = context.cursor;
        const end = (context.cursor += ConcurrencyInWorker);

        // Store the worker to terminate when an error hannpened in another worker.
        context.runningWorkers.add(worker);

        // Catch the end of this worker.
        worker.on("error", error => {
            context.runningWorkers.delete(worker);
            reject(error);
        });
        worker.on("exit", exitCode => {
            context.runningWorkers.delete(worker);
            if (exitCode) {
                reject(new Error(`Worker stopped with exit code ${exitCode}`));
            } else {
                resolve();
            }
        });

        // Set up communication.
        worker.on("message", ({ error, result, senderId }) => {
            if (error) {
                reject(error);
                return;
            }
            worker.postMessage({
                senderId,
                next: context.cursor < context.files.length
                    ? context.files[context.cursor++]
                    : null
            });
            context.yield(result);
        });

        // Send the initial data.
        worker.postMessage({
            cliOptions: context.options,
            files: context.files.slice(start, end)
        });
    });
}

//------------------------------------------------------------------------------
// Public
//------------------------------------------------------------------------------

/**
 * Verify files in worker threads.
 * @param {Object} context The execution context.
 * @param {CLIEngine} context.engine The CLI engine.
 * @param {function():void} context.onEnd The function that is called after linted all files. (it doesn't wait for `next()` calls)
 * @param {function(LintResult): void} context.onResult The function that is called on linted a file immediately. (it doesn't wait for `next()` calls)
 * @param {{config:ConfigArray, filePath:string}[]} context.targets The lint targets.
 * @param {number} context.concurrency The number of worker threads.
 * @returns {AsyncIterableIterator<LintResult>} The lint results.
 */
function verifyFilesInWorkers({ concurrency, engine, onEnd, onResult, targets }) {
    log("Verify %d files in %d worker threads.", targets.length, concurrency);
    const { options } = getCLIEngineInternalSlots(engine);
    const context = {
        cursor: 0,
        files: targets.map(t => t.filePath),
        options,
        runningWorkers: new Set(),
        yield: null
    };

    /**
     * Terminate all running workers.
     * @returns {Promise<void>} The promise object that will be fulfilled after terminated.
     */
    async function terminateWorkers() {
        if (context.runningWorkers.size === 0) {
            return;
        }
        log("Terminate %d running workers (%d files were left).", context.runningWorkers.size, context.files.length - context.cursor);
        try {
            context.cursor = context.files.length;
            await Promise.all(
                Array.from(context.runningWorkers, w => new Promise(resolve => {
                    w.on("exit", resolve);
                }))
            );
        } catch (error) {
            log("Failed to terminate workers: %O", error);
        }
    }

    /**
     * Run workers to verify files.
     * @param {function(LintResult):void} yieldResult The function to yield results.
     * @returns {Promise<void>} The promise object that will be fulfilled after done.
     */
    async function main(yieldResult) {
        context.yield = yieldResult;
        try {
            await runConcurrently(concurrency, () => runWorker(context));
        } finally {
            await terminateWorkers();
        }
    }

    return new LintResultGenerator({
        main,
        onAbort: terminateWorkers,
        onEnd,
        onResult
    });
}

module.exports = { verifyFilesInWorkers };
