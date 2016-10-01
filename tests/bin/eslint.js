/**
 * @fileoverview Tests for the eslint.js executable.
 * @author Teddy Katz
 */

"use strict";

const childProcess = require("child_process");
const assert = require("chai").assert;
const EXECUTABLE_PATH = require("path").resolve(`${__dirname}/../../bin/eslint.js`);

/**
* Asserts that the exit code of a given child process will equal the given value.
* @param {ChildProcess} exitingProcess The child process
* @param {number} expectedExitCode The expected exit code of the child process
* @returns {Promise} A Promise that fufills if the exit code ends up matching, and rejects otherwise.
*/
function assertExitCode(exitingProcess, expectedExitCode) {
    return new Promise((resolve, reject) => {
        exitingProcess.once("exit", exitCode => {
            if (exitCode === expectedExitCode) {
                resolve();
            } else {
                reject(new Error(`Expected an exit code of ${expectedExitCode} but got ${exitCode}.`));
            }
        });
    });
}

/**
* Returns a Promise for the stdout of a process.
* @param {ChildProcess} runningProcess The child process
* @returns {Promise<string>} A Promise that fulfills with all of the stdout output produced by the process when it exits.
*/
function getStdout(runningProcess) {
    let stdout = "";

    runningProcess.stdout.on("data", data => {
        stdout += data;
    });

    return new Promise(resolve => {
        runningProcess.once("exit", () => resolve(stdout));
    });
}

describe("bin/eslint.js", () => {
    const forkedProcesses = new Set();

    /**
    * Forks the process to run an instance of ESLint.
    * @param {string[]} [args] An array of arguments
    * @param {Object} [options] An object containing options for the resulting child process
    * @returns {ChildProcess} The resulting child process
    */
    function runESLint(args, options) {
        const newProcess = childProcess.fork(EXECUTABLE_PATH, args, Object.assign({silent: true}, options));

        forkedProcesses.add(newProcess);
        return newProcess;
    }

    describe("reading from stdin", () => {
        it("has exit code 0 if no linting errors are reported", () => {
            const child = runESLint(["--stdin", "--no-eslintrc"]);

            child.stdin.write("var foo = bar;\n");
            child.stdin.end();
            return assertExitCode(child, 0);
        });

        it("has exit code 1 if a syntax error is thrown", () => {
            const child = runESLint(["--stdin", "--no-eslintrc"]);

            child.stdin.write("This is not valid JS syntax.\n");
            child.stdin.end();
            return assertExitCode(child, 1);
        });

        it("has exit code 1 if a linting error occurs", () => {
            const child = runESLint(["--stdin", "--no-eslintrc", "--rule", "semi:2"]);

            child.stdin.write("var foo = bar // <-- no semicolon\n");
            child.stdin.end();
            return assertExitCode(child, 1);
        });

        it("gives a detailed error message if no config file is found", () => {
            const child = runESLint(["--stdin"], {cwd: "/"}); // Assumes the root directory has no .eslintrc file

            const exitCodePromise = assertExitCode(child, 1);
            const stdoutPromise = getStdout(child).then(stdout => {
                assert.match(stdout, /ESLint couldn't find a configuration file/);
            });

            child.stdin.write("var foo = bar\n");
            child.stdin.end();

            return Promise.all([exitCodePromise, stdoutPromise]);
        });

    });

    describe("running on files", () => {
        it("has exit code 0 if no linting errors occur", () => assertExitCode(runESLint(["bin/eslint.js"]), 0));
        it("has exit code 0 if a linting warning is reported", () => assertExitCode(runESLint(["bin/eslint.js", "--env", "es6", "--no-eslintrc", "--rule", "semi: [1, never]"]), 0));
        it("has exit code 1 if a linting error is reported", () => assertExitCode(runESLint(["bin/eslint.js", "--env", "es6", "--no-eslintrc", "--rule", "semi: [2, never]"]), 1));
        it("has exit code 1 if a syntax error is thrown", () => assertExitCode(runESLint(["README.md"]), 1));
    });

    afterEach(() => {

        // Clean up all the processes after every test.
        forkedProcesses.forEach(child => child.kill());
        forkedProcesses.clear();
    });
});
