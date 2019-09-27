"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const os = require("os");
const { Worker } = require("worker_threads"); // eslint-disable-line node/no-missing-require, node/no-unsupported-features/node-builtins

//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------

const WorkerPath = require.resolve("./parallel-worker");
const MaxWorkers = os.cpus().length;
const ConcurrencyInWorker = 16;

class Context {
    constructor(cliOptions, files) {
        this.cliOptions = cliOptions;
        this.files = files;
        this.results = [];
        this.cursor = 0;
    }

    createWorkerData() {
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

/**
 * Run a worker.
 * @param {Context} context The linting context.
 * @returns {Promise<void>} The promise that will be fulfilled after the worker finished.
 */
function runWorker(context) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(WorkerPath, {
            workerData: context.createWorkerData()
        });

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
    });
}

/**
 * Lint files in parallel.
 *
 * @param {Object} cliOptions The options for CLIEngine.
 * @param {string[]} files The list of target files.
 * @returns {Promise<LintResult[]>} The lint results.
 */
async function lintInParallel(cliOptions, files) {
    const context = new Context(cliOptions, files);
    const numWorkers = Math.min(MaxWorkers, Math.ceil(files.length / ConcurrencyInWorker));
    const promises = Array.from({ length: numWorkers }, () => runWorker(context));

    await Promise.all(promises);

    return context.results;
}

module.exports = { lintInParallel };
