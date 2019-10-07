"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const semver = require("semver");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const ConcurrencyInWorker = 16;

/**
 * Check if this Node.js supports `worker_thread` module.
 * @returns {boolean} `true` if supported.
 */
function isThreadSupported() {
    return semver.gte(process.versions.node, "12.11.0");
}

/**
 * Run a given function concurrently.
 * @param {number} concurrency The concurrency.
 * @param {function():Promise<void>} func The runnable.
 * @returns {Promise<void>} The promise that will be fulfilled after all `func` call finished.
 */
async function runConcurrently(concurrency, func) {
    await Promise.all(Array.from({ length: concurrency }, (_, i) => func(i)));
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

module.exports = {
    ConcurrencyInWorker,
    isThreadSupported,
    runConcurrently
};
