#!/usr/bin/env node

/**
 * @fileoverview Main CLI that is run via the eslint command.
 * @author Nicholas C. Zakas
 */

/* eslint no-console:off -- CLI */

"use strict";

// must do this initialization *before* other requires in order to work
if (process.argv.includes("--debug")) {
    require("debug").enable("eslint:*,-eslint:code-path,eslintrc:*");
}

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { onFatalError } = require("../lib/shared/error-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Read data from stdin til the end.
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
 * @returns {Promise<string>} The read text.
 */
function readStdin() {
    return new Promise((resolve, reject) => {
        let content = "";
        let chunk = "";

        process.stdin
            .setEncoding("utf8")
            .on("readable", () => {
                while ((chunk = process.stdin.read()) !== null) {
                    content += chunk;
                }
            })
            .on("end", () => resolve(content))
            .on("error", reject);
    });
}

/**
 * Tracks whether an unexpected error was caught
 * @type {boolean}
 */
let hadFatalError = false;


//------------------------------------------------------------------------------
// Execution
//------------------------------------------------------------------------------

(async function main() {
    process.on("uncaughtException", error => {
        hadFatalError = true;
        onFatalError(error);
    });
    process.on("unhandledRejection", error => {
        hadFatalError = true;
        onFatalError(error);
    });

    // Call the config initializer if `--init` is present.
    if (process.argv.includes("--init")) {

        // `eslint --init` has been moved to `@eslint/create-config`
        console.warn("You can also run this command directly using 'npm init @eslint/config'.");

        const spawn = require("cross-spawn");

        spawn.sync("npm", ["init", "@eslint/config"], { encoding: "utf8", stdio: "inherit" });
        return;
    }

    // Otherwise, call the CLI.
    const exitCode = await require("../lib/cli").execute(
        process.argv,
        process.argv.includes("--stdin") ? await readStdin() : null,
        true
    );

    /*
     * If an uncaught exception or unhandled rejection was detected in the meantime,
     * keep the fatal exit code 2 that is already assigned to `process.exitCode`.
     * Without this condition, exit code 2 (unsuccessful execution) could be overwritten with
     * 1 (successful execution, lint problems found) or even 0 (successful execution, no lint problems found).
     * This ensures that unexpected errors that seemingly don't affect the success
     * of the execution will still cause a non-zero exit code, as it's a common
     * practice and the default behavior of Node.js to exit with non-zero
     * in case of an uncaught exception or unhandled rejection.
     *
     * Otherwise, assign the exit code returned from CLI.
     */
    if (!hadFatalError) {
        process.exitCode = exitCode;
    }
}()).catch(error => {
    hadFatalError = true;
    onFatalError(error);
});
