/**
 * @fileoverview Integration tests for the eslint.js executable.
 * @author Teddy Katz
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const childProcess = require("child_process");
const fs = require("fs");
const assert = require("chai").assert;
const path = require("path");

//------------------------------------------------------------------------------
// Data
//------------------------------------------------------------------------------

const EXECUTABLE_PATH = path.resolve(path.join(__dirname, "../../bin/eslint.js"));

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Returns a Promise for when a child process exits
 * @param {ChildProcess} exitingProcess The child process
 * @returns {Promise<number>} A Promise that fulfills with the exit code when the child process exits
 */
function awaitExit(exitingProcess) {
    return new Promise(resolve => exitingProcess.once("exit", resolve));
}

/**
 * Asserts that the exit code of a given child process will equal the given value.
 * @param {ChildProcess} exitingProcess The child process
 * @param {number} expectedExitCode The expected exit code of the child process
 * @returns {Promise<void>} A Promise that fulfills if the exit code ends up matching, and rejects otherwise.
 */
function assertExitCode(exitingProcess, expectedExitCode) {
    return awaitExit(exitingProcess).then(exitCode => {
        assert.strictEqual(exitCode, expectedExitCode, `Expected an exit code of ${expectedExitCode} but got ${exitCode}.`);
    });
}

/**
 * Returns a Promise for the stdout of a process.
 * @param {ChildProcess} runningProcess The child process
 * @returns {Promise<{stdout: string, stderr: string}>} A Promise that fulfills with all of the
 * stdout and stderr output produced by the process when it exits.
 */
function getOutput(runningProcess) {
    let stdout = "";
    let stderr = "";

    runningProcess.stdout.on("data", data => (stdout += data));
    runningProcess.stderr.on("data", data => (stderr += data));
    return awaitExit(runningProcess).then(() => ({ stdout, stderr }));
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("bin/eslint.js", () => {
    const forkedProcesses = new Set();

    /**
     * Forks the process to run an instance of ESLint.
     * @param {string[]} [args] An array of arguments
     * @param {Object} [options] An object containing options for the resulting child process
     * @returns {ChildProcess} The resulting child process
     */
    function runESLint(args, options) {
        const newProcess = childProcess.fork(EXECUTABLE_PATH, args, Object.assign({ silent: true }, options));

        forkedProcesses.add(newProcess);
        return newProcess;
    }

    describe("reading from stdin", () => {
        it("has exit code 0 if no linting errors are reported", () => {
            const child = runESLint(["--stdin", "--no-config-lookup"]);

            child.stdin.write("var foo = bar;\n");
            child.stdin.end();
            return assertExitCode(child, 0);
        });

        it("has exit code 0 if no linting errors are reported", () => {
            const child = runESLint([
                "--stdin",
                "--no-config-lookup",
                "--rule",
                "{'no-extra-semi': 2}",
                "--fix-dry-run",
                "--format",
                "json"
            ]);

            const expectedOutput = JSON.stringify([
                {
                    filePath: "<text>",
                    messages: [],
                    suppressedMessages: [],
                    errorCount: 0,
                    fatalErrorCount: 0,
                    warningCount: 0,
                    fixableErrorCount: 0,
                    fixableWarningCount: 0,
                    output: "var foo = bar;\n",
                    usedDeprecatedRules: []
                }
            ]);

            const exitCodePromise = assertExitCode(child, 0);
            const stdoutPromise = getOutput(child).then(output => {
                assert.strictEqual(output.stdout.trim(), expectedOutput);
                assert.strictEqual(output.stderr, "");
            });

            child.stdin.write("var foo = bar;;\n");
            child.stdin.end();

            return Promise.all([exitCodePromise, stdoutPromise]);
        });

        it("has exit code 1 if a syntax error is thrown", () => {
            const child = runESLint(["--stdin", "--no-config-lookup"]);

            child.stdin.write("This is not valid JS syntax.\n");
            child.stdin.end();
            return assertExitCode(child, 1);
        });

        it("has exit code 2 if a syntax error is thrown when exit-on-fatal-error is true", () => {
            const child = runESLint(["--stdin", "--no-config-lookup", "--exit-on-fatal-error"]);

            child.stdin.write("This is not valid JS syntax.\n");
            child.stdin.end();
            return assertExitCode(child, 2);
        });

        it("has exit code 1 if a linting error occurs", () => {
            const child = runESLint(["--stdin", "--no-config-lookup", "--rule", "semi:2"]);

            child.stdin.write("var foo = bar // <-- no semicolon\n");
            child.stdin.end();
            return assertExitCode(child, 1);
        });

        it(
            "gives a detailed error message if no config file is found in /",
            () => {
                if (
                    fs.readdirSync("/").some(
                        fileName =>
                            /^\.eslintrc(?:\.(?:js|yaml|yml|json))?$/u
                                .test(fileName)
                    )
                ) {
                    return Promise.resolve(true);
                }
                const child = runESLint(
                    ["--stdin"], { cwd: "/", env: { HOME: "/" } }
                );

                const exitCodePromise = assertExitCode(child, 2);
                const stderrPromise = getOutput(child).then(output => {
                    assert.match(
                        output.stderr,
                        /ESLint couldn't find a configuration file/u
                    );
                });

                child.stdin.write("1 < 3;\n");
                child.stdin.end();
                return Promise.all([exitCodePromise, stderrPromise]);
            }
        );

        it("successfully reads from an asynchronous pipe", () => {
            const child = runESLint(["--stdin", "--no-config-lookup"]);

            child.stdin.write("var foo = bar;\n");
            return new Promise(resolve => setTimeout(resolve, 300)).then(() => {
                child.stdin.write("var baz = qux;\n");
                child.stdin.end();

                return assertExitCode(child, 0);
            });
        });

        it("successfully handles more than 4k data via stdin", () => {
            const child = runESLint(["--stdin", "--no-config-lookup"]);
            const large = fs.createReadStream(path.join(__dirname, "../bench/large.js"), "utf8");

            large.pipe(child.stdin);

            return assertExitCode(child, 0);
        });
    });

    describe("running on files", () => {
        it("has exit code 0 if no linting errors occur", () => assertExitCode(runESLint(["bin/eslint.js", "--no-config-lookup"]), 0));
        it("has exit code 0 if a linting warning is reported", () => assertExitCode(runESLint(["bin/eslint.js", "--no-config-lookup", "--rule", "semi: [1, never]"]), 0));
        it("has exit code 1 if a linting error is reported", () => assertExitCode(runESLint(["bin/eslint.js", "--no-config-lookup", "--rule", "semi: [2, never]"]), 1));
        it("has exit code 1 if a syntax error is thrown", () => assertExitCode(runESLint(["tests/fixtures/exit-on-fatal-error/fatal-error.js", "--no-config-lookup"]), 1));
    });

    describe("automatically fixing files", () => {
        const fixturesPath = path.join(__dirname, "../fixtures/autofix-integration");
        const tempFilePath = `${fixturesPath}/temp.js`;
        const startingText = fs.readFileSync(`${fixturesPath}/left-pad.js`).toString();
        const expectedFixedText = fs.readFileSync(`${fixturesPath}/left-pad-expected.js`).toString();
        const expectedFixedTextQuiet = fs.readFileSync(`${fixturesPath}/left-pad-expected-quiet.js`).toString();

        beforeEach(() => {
            fs.writeFileSync(tempFilePath, startingText);
        });

        it("has exit code 0 and fixes a file if all rules can be fixed", () => {
            const child = runESLint(["--fix", "--no-config-lookup", "--no-ignore", tempFilePath]);
            const exitCodeAssertion = assertExitCode(child, 0);
            const outputFileAssertion = awaitExit(child).then(() => {
                assert.strictEqual(fs.readFileSync(tempFilePath).toString(), expectedFixedText);
            });

            return Promise.all([exitCodeAssertion, outputFileAssertion]);
        });

        it("has exit code 0, fixes errors in a file, and does not report or fix warnings if --quiet and --fix are used", () => {
            const child = runESLint(["--fix", "--quiet", "--no-config-lookup", "--no-ignore", tempFilePath]);
            const exitCodeAssertion = assertExitCode(child, 0);
            const stdoutAssertion = getOutput(child).then(output => assert.strictEqual(output.stdout, ""));
            const outputFileAssertion = awaitExit(child).then(() => {
                assert.strictEqual(fs.readFileSync(tempFilePath).toString(), expectedFixedTextQuiet);
            });

            return Promise.all([exitCodeAssertion, stdoutAssertion, outputFileAssertion]);
        });

        it("has exit code 1 and fixes a file if not all rules can be fixed", () => {
            const child = runESLint(["--fix", "--no-config-lookup", "--no-ignore", "--rule", "max-len: [2, 10]", tempFilePath]);
            const exitCodeAssertion = assertExitCode(child, 1);
            const outputFileAssertion = awaitExit(child).then(() => {
                assert.strictEqual(fs.readFileSync(tempFilePath).toString(), expectedFixedText);
            });

            return Promise.all([exitCodeAssertion, outputFileAssertion]);
        });

        afterEach(() => {
            fs.unlinkSync(tempFilePath);
        });
    });

    describe("cache files", () => {
        const CACHE_PATH = ".temp-eslintcache";
        const SOURCE_PATH = "tests/fixtures/cache/src/test-file.js";
        const ARGS_WITHOUT_CACHE = ["--no-config-lookup", "--no-ignore", SOURCE_PATH, "--cache-location", CACHE_PATH];
        const ARGS_WITH_CACHE = ARGS_WITHOUT_CACHE.concat("--cache");

        describe("when no cache file exists", () => {
            it("creates a cache file when the --cache flag is used", () => {
                const child = runESLint(ARGS_WITH_CACHE);

                return assertExitCode(child, 0).then(() => {
                    assert.isTrue(fs.existsSync(CACHE_PATH), "Cache file should exist at the given location");

                    // Cache file should contain valid JSON
                    JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
                });
            });
        });

        describe("when a valid cache file already exists", () => {
            beforeEach(() => {
                const child = runESLint(ARGS_WITH_CACHE);

                return assertExitCode(child, 0).then(() => {
                    assert.isTrue(fs.existsSync(CACHE_PATH), "Cache file should exist at the given location");
                });
            });
            it("can lint with an existing cache file and the --cache flag", () => {
                const child = runESLint(ARGS_WITH_CACHE);

                return assertExitCode(child, 0).then(() => {

                    // Note: This doesn't actually verify that the cache file is used for anything.
                    assert.isTrue(fs.existsSync(CACHE_PATH), "Cache file should still exist after linting with --cache");
                });
            });
            it("updates the cache file when the source file is modified", () => {
                const initialCacheContent = fs.readFileSync(CACHE_PATH, "utf8");

                // Update the file to change its mtime
                fs.writeFileSync(SOURCE_PATH, fs.readFileSync(SOURCE_PATH, "utf8"));

                const child = runESLint(ARGS_WITH_CACHE);

                return assertExitCode(child, 0).then(() => {
                    const newCacheContent = fs.readFileSync(CACHE_PATH, "utf8");

                    assert.notStrictEqual(initialCacheContent, newCacheContent, "Cache file should change after source is modified");
                });
            });
            it("deletes the cache file when run without the --cache argument", () => {
                const child = runESLint(ARGS_WITHOUT_CACHE);

                return assertExitCode(child, 0).then(() => {
                    assert.isFalse(fs.existsSync(CACHE_PATH), "Cache file should be deleted after running ESLint without the --cache argument");
                });
            });
        });

        // https://github.com/eslint/eslint/issues/7748
        describe("when an invalid cache file already exists", () => {
            beforeEach(() => {
                fs.writeFileSync(CACHE_PATH, "This is not valid JSON.");

                // Sanity check
                assert.throws(
                    () => JSON.parse(fs.readFileSync(CACHE_PATH, "utf8")),
                    SyntaxError,
                    /Unexpected token/u,
                    "Cache file should not contain valid JSON at the start"
                );
            });

            it("overwrites the invalid cache file with a valid one when the --cache argument is used", () => {
                const child = runESLint(ARGS_WITH_CACHE);

                return assertExitCode(child, 0).then(() => {
                    assert.isTrue(fs.existsSync(CACHE_PATH), "Cache file should exist at the given location");

                    // Cache file should contain valid JSON
                    JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
                });
            });

            it("deletes the invalid cache file when the --cache argument is not used", () => {
                const child = runESLint(ARGS_WITHOUT_CACHE);

                return assertExitCode(child, 0).then(() => {
                    assert.isFalse(fs.existsSync(CACHE_PATH), "Cache file should be deleted after running ESLint without the --cache argument");
                });
            });
        });

        afterEach(() => {
            if (fs.existsSync(CACHE_PATH)) {
                fs.unlinkSync(CACHE_PATH);
            }
        });
    });

    describe("handling crashes", () => {
        it("prints the error message to stderr in the event of a crash", () => {
            const child = runESLint(["--rule=no-restricted-syntax:[error, 'Invalid Selector [[[']", "--no-config-lookup", "Makefile.js"]);
            const exitCodeAssertion = assertExitCode(child, 2);
            const outputAssertion = getOutput(child).then(output => {
                const expectedSubstring = "Syntax error in selector";

                assert.strictEqual(output.stdout, "");
                assert.include(output.stderr, expectedSubstring);
            });

            return Promise.all([exitCodeAssertion, outputAssertion]);
        });

        it("prints the error message exactly once to stderr in the event of a crash", () => {
            const child = runESLint(["--rule=no-restricted-syntax:[error, 'Invalid Selector [[[']", "--no-config-lookup", "Makefile.js"]);
            const exitCodeAssertion = assertExitCode(child, 2);
            const outputAssertion = getOutput(child).then(output => {
                const expectedSubstring = "Syntax error in selector";

                assert.strictEqual(output.stdout, "");
                assert.include(output.stderr, expectedSubstring);

                // The message should appear exactly once in stderr
                assert.strictEqual(output.stderr.indexOf(expectedSubstring), output.stderr.lastIndexOf(expectedSubstring));
            });

            return Promise.all([exitCodeAssertion, outputAssertion]);
        });

        // https://github.com/eslint/eslint/issues/17560
        describe("does not print duplicate errors in the event of a crash", () => {

            it("when there is an invalid config read from a config file", () => {
                const config = path.join(__dirname, "../fixtures/bin/eslint.config-invalid.js");
                const child = runESLint(["--config", config, "conf", "tools"]);
                const exitCodeAssertion = assertExitCode(child, 2);
                const outputAssertion = getOutput(child).then(output => {

                    // The error text should appear exactly once in stderr
                    assert.strictEqual(output.stderr.match(/A config object is using the "globals" key/gu).length, 1);
                });

                return Promise.all([exitCodeAssertion, outputAssertion]);
            });

            it("when there is an error in the next tick", () => {
                const config = path.join(__dirname, "../fixtures/bin/eslint.config-tick-throws.js");
                const child = runESLint(["--config", config, "Makefile.js"]);
                const exitCodeAssertion = assertExitCode(child, 2);
                const outputAssertion = getOutput(child).then(output => {

                    // The error text should appear exactly once in stderr
                    assert.strictEqual(output.stderr.match(/test_error_stack/gu).length, 1);
                });

                return Promise.all([exitCodeAssertion, outputAssertion]);
            });
        });

        it("prints the error message pointing to line of code", () => {
            const invalidConfig = path.join(__dirname, "../fixtures/bin/eslint.config.js");
            const child = runESLint(["--no-ignore", "-c", invalidConfig]);

            return assertExitCode(child, 2);
        });
    });

    afterEach(() => {

        // Clean up all the processes after every test.
        forkedProcesses.forEach(child => child.kill());
        forkedProcesses.clear();
    });
});
