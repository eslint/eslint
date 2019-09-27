#!/usr/bin/env node

/**
 * @fileoverview Main CLI that is run via the eslint command.
 * @author Nicholas C. Zakas
 */

/* eslint no-console:off */

"use strict";

// to use V8's code cache to speed up instantiation time
require("v8-compile-cache");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const useStdIn = process.argv.includes("--stdin"),
    init = process.argv.includes("--init"),
    debug = process.argv.includes("--debug");

// must do this initialization *before* other requires in order to work
if (debug) {
    require("debug").enable("eslint:*,-eslint:code-path");
}

/*
 * Note: `process.stdin.fd` is not used here due to https://github.com/nodejs/node/issues/7439.
 * Accessing the `process.stdin` property seems to modify the behavior of file descriptor 0, resulting
 * in an error when stdin is piped in asynchronously.
 */
const STDIN_FILE_DESCRIPTOR = 0;

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// now we can safely include the other modules that use debug
const path = require("path"),
    fs = require("fs"),
    util = require("util"),
    cli = require("../lib/cli");

const readFile = util.promisify(fs.readFile);

//------------------------------------------------------------------------------
// Execution
//------------------------------------------------------------------------------

/**
 * Capture uncaught errors.
 * @param {any} err The error object
 * @returns {void}
 */
function handleError(err) {
    process.removeListener("uncaughtException", handleError);
    process.removeListener("unhandledRejection", handleError);

    // lazy load
    const lodash = require("lodash");

    if (typeof err.messageTemplate === "string" && err.messageTemplate.length > 0) {
        const template = lodash.template(fs.readFileSync(path.resolve(__dirname, `../messages/${err.messageTemplate}.txt`), "utf-8"));
        const pkg = require("../package.json");

        console.error("\nOops! Something went wrong! :(");
        console.error(`\nESLint: ${pkg.version}.\n\n${template(err.messageData || {})}`);
    } else {
        console.error(err.stack);
    }

    process.exitCode = 2;
}

process.on("uncaughtException", handleError);
process.on("unhandledRejection", handleError);

/**
 * The main function.
 * @returns {Promise<number>} The exit code.
 */
async function main() {
    if (init) {
        await require("../lib/init/config-initializer").initializeConfig();
        return 0;
    }
    if (useStdIn) {
        return cli.execute(process.argv, await readFile(STDIN_FILE_DESCRIPTOR, "utf8"));
    }
    return cli.execute(process.argv);
}

main().then(exitCode => {
    process.exitCode = exitCode;
}, handleError);
