"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const os = require("os");
const debug = require("debug")("eslint:parallel-master");
const { isThreadSupported } = require("./shared");
const WorkerPath = require.resolve("./worker");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Define the function that create a new thread worker.
 * @returns {Worker} The thread worker.
 */
function defineCreateThreadWorker() {
    debug("Use threads.");
    const { Worker } = require("worker_threads"); //eslint-disable-line

    // https://github.com/nodejs/node/issues/26946
    const workerData = { colors: debug.useColors };

    return () => new Worker(WorkerPath, { workerData });
}

/**
 * Define the function that create a new process worker.
 * @returns {ChildProcess} The process worker.
 */
function defineCreateProcessWorker() {
    debug("Use processes.");
    const { fork } = require("child_process");

    return () => {
        const worker = fork(WorkerPath);

        worker.postMessage = worker.send;
        return worker;
    };
}

// Select the implementation.
const createWorker = isThreadSupported
    ? defineCreateThreadWorker()
    : defineCreateProcessWorker();

// Constants.
const MaxWorkers = os.cpus().length;
const ConcurrencyInWorker = 16;

/**
 * The shared information for all workers.
 */
class Context {
    constructor(cliOptions, files) {
        this.cliOptions = cliOptions;
        this.files = files;
        this.results = [];
        this.cursor = 0;
    }

    createInitialData() {
        const start = this.cursor;
        const end = (this.cursor += ConcurrencyInWorker);

        return {
            cliOptions: this.cliOptions,
            files: this.files.slice(start, end)
        };
    }

    nextFile() {
        if (this.cursor < this.files.length) {
            return this.files[this.cursor++];
        }
        return null;
    }
}

//------------------------------------------------------------------------------
// Public
//------------------------------------------------------------------------------

/**
 * Lint files in parallel.
 * @param {Object} cliOptions The options for CLIEngine.
 * @param {string[]} files The list of target files.
 * @returns {Promise<LintResult[]>} The lint results.
 */
async function lintInParallel(cliOptions, files) {
    const context = new Context(cliOptions, files);
    const numWorkers = Math.min(
        MaxWorkers,
        Math.ceil(files.length / ConcurrencyInWorker)
    );

    debug("Spawn %d workers.", numWorkers);

    await Promise.all(Array.from(
        { length: numWorkers },
        () => new Promise((resolve, reject) => {
            const worker = createWorker();

            worker.on("error", reject);
            worker.on("message", ({ senderId, result }) => {
                worker.postMessage({ senderId, next: context.nextFile() });
                context.results.push(result);
            });
            worker.on("exit", exitCode => {
                if (exitCode) {
                    reject(new Error(`Worker stopped with exit code ${exitCode}`));
                } else {
                    resolve();
                }
            });

            worker.postMessage(context.createInitialData());
        })
    ));

    return context.results;
}

module.exports = { lintInParallel };
