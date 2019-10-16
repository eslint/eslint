"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const fs = require("fs");
const util = require("util");
const debug = require("debug");
const { verifyText } = require("../cli-engine/cli-engine");
const { LintResultGenerator } = require("./lint-result-generator");
const { ConcurrencyInWorker, runConcurrently } = require("./util");

const readFile = util.promisify(fs.readFile);
const log = debug("eslint:verify-files-in-master");

log.enabled = true;

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/** @typedef {import("../cli-engine/cli-engine").ConfigArray} ConfigArray */
/** @typedef {import("../cli-engine/cli-engine").LintResult} LintResult */

//------------------------------------------------------------------------------
// Public
//------------------------------------------------------------------------------

/**
 * Verify files in this thread.
 * @param {Object} context The execution context.
 * @param {CLIEngine} context.engine The CLI engine.
 * @param {LintResult[]} context.knownResults The known results to yield at first.
 * @param {() => void} context.onEnd The function that is called after linted all files. (it doesn't wait for `next()` calls)
 * @param {(result:LintResult) => void} context.onResult The function that is called on linted a file immediately. (it doesn't wait for `next()` calls)
 * @param {{config:ConfigArray, filePath:string}[]} context.targets The lint targets.
 * @returns {LintResultGenerator} The lint result.
 */
function verifyFilesInMaster({
    engine,
    knownResults,
    onEnd,
    onResult,
    targets
}) {
    log("Lint %d files in the main thread.", targets.length);
    const concurrency = Math.min(ConcurrencyInWorker, targets.length);
    const end = targets.length;
    let cursor = 0;

    /**
     * Terminate linting.
     * @returns {void}
     */
    function terminateLinting() {
        if (cursor >= end) {
            return;
        }
        log("Terminate linting (%d files were left).", end - cursor);
        cursor = end;
    }

    return new LintResultGenerator({
        knownResults,

        /**
         * Verify files.
         * @param {function(LintResult):void} yieldResult The function to yield results.
         * @returns {Promise<void>} The promise object that will be fulfilled after done.
         */
        async main(yieldResult) {
            try {
                await runConcurrently(concurrency, async() => {
                    while (cursor < end) {
                        const { config, filePath } = targets[cursor++];
                        const text = await readFile(filePath, "utf8");
                        const result = verifyText(engine, config, filePath, text);

                        yieldResult(result);
                    }
                });
            } catch (error) {
                terminateLinting();
                throw error;
            }
        },

        onEnd() {
            terminateLinting();
            onEnd();
        },

        onResult
    });
}

module.exports = { verifyFilesInMaster };
