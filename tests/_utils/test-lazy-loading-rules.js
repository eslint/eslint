/**
 * @fileoverview Tests lazy-loading of core rules
 * @author Milos Djermanovic
 */

/*
 * This module should be run as a child process, with `fork()`,
 * because it is important to run this test with a separate, clean Node process
 * in order to add hooks before any of the ESLint modules is loaded.
 */

"use strict";

const path = require("path");
const assert = require("assert");
const { addHook } = require("pirates");

const {
    dir: rulesDirectoryPath,
    name: rulesDirectoryIndexFilename
} = path.parse(require.resolve("../../lib/rules"));

// Show full stack trace. The default 10 is usually not enough to find the root cause of this problem.
Error.stackTraceLimit = Infinity;

const [cwd, pattern, usedRulesCommaSeparated] = process.argv.slice(2);

assert.ok(cwd, "cwd argument isn't provided");
assert.ok(pattern, "pattern argument isn't provided");
assert.ok(usedRulesCommaSeparated, "used rules argument isn't provided");

const usedRules = usedRulesCommaSeparated.split(",");

// `require()` hook
addHook(
    (_code, filename) => {
        throw new Error(`Unexpected attempt to load unused rule ${filename}`);
    },
    {

        // returns `true` if the hook (the function passed in as the first argument) should be called for this filename
        matcher(filename) {
            const { dir, name } = path.parse(filename);

            if (dir === rulesDirectoryPath && ![rulesDirectoryIndexFilename, ...usedRules].includes(name)) {
                return true;
            }

            return false;
        }

    }
);

/*
 * Everything related to loading any ESLint modules should be in this IIFE
 */
(async () => {
    const { ESLint } = require("../..");
    const eslint = new ESLint({ cwd });

    await eslint.lintFiles([pattern]);
})().catch(({ message, stack }) => {
    process.send({ message, stack });
    process.exit(1);
});
