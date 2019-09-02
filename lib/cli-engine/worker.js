"use strict";

const workerpool = require("workerpool");
const { CLIEngine } = require("./cli-engine");

// eslint-disable-next-line require-jsdoc
async function lintChunkInWorker({
    params,
    providedOptions
}) {

    const engine = new CLIEngine(providedOptions);

    return engine.lintChunkInWorker(params);
}

// create a worker and register functions
workerpool.worker({
    lintChunkInWorker
});
