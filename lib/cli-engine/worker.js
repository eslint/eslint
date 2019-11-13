"use strict";

const workerpool = require("workerpool");
const { CLIEngine } = require("./cli-engine");

async function verifyChunkOnWorker({
    params,
    providedOptions
}) {

    const engine = new CLIEngine(providedOptions);

    return engine.verifyChunkOnWorker(params);
}

// create a worker and register functions
workerpool.worker({
    verifyChunkOnWorker
});
