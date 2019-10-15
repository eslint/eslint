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
 * Read text from stdin.
 * 
 * Note: See
 * - https://github.com/nodejs/node/blob/master/doc/api/process.md#processstdin
 * - https://github.com/nodejs/node/blob/master/doc/api/process.md#a-note-on-process-io
 * - https://lists.gnu.org/archive/html/bug-gnu-emacs/2016-01/msg00419.html
 * - https://github.com/nodejs/node/issues/7439 (historical)
 *
 * On Windows using `fs.readFileSync(STDIN_FILE_DESCRIPTOR, "utf8")` seems
 * to read 4096 bytes before blocking and never drains to read further data.
 *
 * The investigation on the Emacs thread indicates:
 *
 * > Emacs on MS-Windows uses pipes to communicate with subprocesses; a
 * > pipe on Windows has a 4K buffer. So as soon as Emacs writes more than
 * > 4096 bytes to the pipe, the pipe becomes full, and Emacs then waits for
 * > the subprocess to read its end of the pipe, at which time Emacs will
 * > write the rest of the stuff.
 *
 * Using the nodejs code example for reading from stdin.
 * 
 * @returns {Promise<string>} The text.
 */
function readStdIn() {
    return new Promise((resolve, reject) => {
        const chunks = [];

        process.stdin
            .on("data", chunk => chunks.push(chunk))
            .on("end", () => resolve(Buffer.concat(chunks).toString()))
            .on("error", reject)
    })
}

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
        return cli.execute(process.argv, await readStdIn());
    }
    return cli.execute(process.argv);
}

main().then(exitCode => {
    process.exitCode = exitCode;
}, handleError);
