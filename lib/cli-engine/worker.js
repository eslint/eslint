"use strict";

const workerpool = require("workerpool");
const { CLIEngine } = require("./cli-engine");

async function verifyChunkOnWorker({ // eslint-disable-line jsdoc/require-jsdoc
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
