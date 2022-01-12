"use strict";

const {
    Worker,
    isMainThread,
    parentPort,
    workerData
} = require("worker_threads");

/**
 * Lints all of the supplied `filesToLint` using the supplied worker in chunks.
 * @param {Worker} worker the worker to be used.
 * @param {string[]} filesToLint the files to be linted.
 * @param {number} chunkSize the size of the chunks to be sent to the worker.
 * @param {import('../cli-engine/cli-engine').LintResult[]} results the array the linting results are to be appended to.
 * @returns {void}
 */
async function lintInWorker(worker, filesToLint, chunkSize, results) {
    if (filesToLint.length < 1) {
        return;
    }

    const chunk = filesToLint.splice(0, chunkSize);

    const chunkResults = await new Promise((resolve, reject) => {

        /**
         * Called when the worker thread issues an error.
         * @param {unknown} error the error
         * @returns {void}
         */
        function errorListener(error) {
            reject(error);
        }

        /**
         * Called if the worker thread terminates.
         * @param {number} code the exit code (0 for OK)
         * @returns {void}
         */
        function exitListener(code) {
            if (code !== 0) {
                reject(
                    new Error(`ESLint worker stopped with exit code ${code}`)
                );
            }
        }

        worker.once("message", data => {
            worker.removeListener("error", errorListener);
            worker.removeListener("exit", exitListener);

            if (data.type === "ERROR") {
                const error = new Error(data.message);

                error.stack = data.stack;
                error.code = data.code;
                reject(error);
            } else {
                resolve(data.results);
            }
        });
        worker.on("error", errorListener);
        worker.on("exit", exitListener);
        worker.postMessage(chunk);
    });

    chunkResults.forEach(result => results.push(result));
    await lintInWorker(worker, filesToLint, chunkSize, results);
}

/**
 * Creates an array of Workers that can be used to lint files concurrently.
 * @param {Object} options worker pool options
 * @param {number} options.concurrency the worker pool size.
 * @param {import('./eslint').ESLintOptions} options.eslintOptions the ESLint options.
 * @returns {Worker[]} the worker pool.
 */
function createWorkers({ concurrency, eslintOptions }) {
    const pool = [];

    for (let i = 0; i < concurrency; i += 1) {
        pool.push(
            new Worker(__filename, {
                workerData: {
                    eslintOptions
                }
            })
        );
    }
    return pool;
}

/**
 * Concurrent linting class
 */
class ESLintConcurrent {

    /**
     * Creates a worker that lints files in a separate thread.
     * @param {import('./eslint').ESLintOptions} eslintOptions the ESLint options to use
     * @param {number} concurrency the size of the worker pool
     */
    constructor(eslintOptions, { concurrency, chunkSize }) {
        this.pool = null;
        this.eslintOptions = eslintOptions;
        this.concurrency = concurrency;
        this.chunkSize = chunkSize;
    }

    async lintFiles(filesToLint) {
        if (this.pool === null) {
            this.pool = createWorkers({
                concurrency: this.concurrency,
                eslintOptions: this.eslintOptions
            });
        }

        const results = [];

        await Promise.all(
            this.pool.map(worker =>
                lintInWorker(worker, filesToLint, this.chunkSize, results))
        );

        return results;
    }

    terminate() {
        if (this.pool === null) {
            return;
        }

        for (const worker of this.pool) {
            worker.removeAllListeners();
            worker.terminate();
        }
    }
}

module.exports = { ESLintConcurrent };

if (!isMainThread) {
    const { ESLint } = require("./eslint");

    const { eslintOptions } = workerData;

    const linter = new ESLint({
        ...eslintOptions,
        concurrency: 1
    });

    parentPort.on("message", filesToLint => {
        linter
            .lintFiles(filesToLint)
            .then(results =>
                parentPort.postMessage({
                    type: "DATA",
                    results
                }))
            .catch(error =>
                parentPort.postMessage({
                    type: "ERROR",
                    message: error.message,
                    stack: error.stack
                }));
    });
}
