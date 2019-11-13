"use strict";

const workerpool = require("workerpool");
const { CLIEngine } = require("./cli-engine");

/**
 *
 * verifies a chunk of the files on a worker process
 * @param {Object} options options
 * @param {VerifyFileChunk} options.chunk CLIEngine constructor options
 * @param {CLIEngineOptions} options.providedOptions CLIEngine constructor options
 * @returns {VerifyChunkResult[]} result
 */
async function verifyChunkOnWorker({
    chunk,
    providedOptions
}) {

    const engine = new CLIEngine(providedOptions);

    return engine.verifyChunkOnWorker(chunk);
}

// create a worker and register functions
workerpool.worker({
    verifyChunkOnWorker
});
