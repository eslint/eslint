"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("assert");
const { execFile } = require("child_process");
const { promisify } = require("util");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Runs check-rule-examples on the specified files.
 * @param {...string} filenames Files to be passed to check-rule-examples.
 * @returns {Promise<ChildProcess>} An object with properties `stdout` and `stderr` on success.
 * @throws An object with properties `code`, `stdout` and `stderr` on success.
 */
async function runCheckRuleExamples(...filenames) {
    return await promisify(execFile)(
        process.execPath,
        ["--no-deprecation", "tools/check-rule-examples.js", ...filenames],
        { env: { FORCE_COLOR: "3" } } // 24-bit color mode
    );
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("check-rule-examples", () => {

    it("succeeds when not passed any files", async () => {
        const childProcess = await runCheckRuleExamples();

        assert.strictEqual(childProcess.stdout, "");
        assert.strictEqual(childProcess.stderr, "");
    });

    it("succeeds when passed a syntax error free file", async () => {
        const childProcess = await runCheckRuleExamples("tests/fixtures/good-examples.md");

        assert.strictEqual(childProcess.stdout, "");
        assert.strictEqual(childProcess.stderr, "");
    });

    it("fails when passed a file with a syntax error", async () => {
        const promise = runCheckRuleExamples("tests/fixtures/good-examples.md", "tests/fixtures/bad-examples.md");

        await assert.rejects(
            promise,
            {
                code: 1,
                stdout: "",
                stderr:
                "\x1B[0m\x1B[0m\n" +
                "\x1B[0m\x1B[4mtests/fixtures/bad-examples.md\x1B[24m\x1B[0m\n" +
                "\x1B[0m  \x1B[2m11:4\x1B[22m  \x1B[31merror\x1B[39m  Missing language tag: use one of 'javascript', 'js' or 'jsx'\x1B[0m\n" +
                "\x1B[0m  \x1B[2m12:1\x1B[22m  \x1B[31merror\x1B[39m  Syntax error: 'import' and 'export' may appear only with 'sourceType: module'\x1B[0m\n" +
                "\x1B[0m  \x1B[2m20:5\x1B[22m  \x1B[31merror\x1B[39m  Nonstandard language tag 'ts': use one of 'javascript', 'js' or 'jsx'\x1B[0m\n" +
                "\x1B[0m  \x1B[2m23:7\x1B[22m  \x1B[31merror\x1B[39m  Syntax error: Identifier 'foo' has already been declared\x1B[0m\n" +
                "\x1B[0m  \x1B[2m31:1\x1B[22m  \x1B[31merror\x1B[39m  Example code should contain a configuration comment like /* eslint no-restricted-syntax: \"error\" */\x1B[0m\n" +
                "\x1B[0m\x1B[0m\n" +
                "\x1B[0m\x1B[31m\x1B[1m✖ 5 problems (5 errors, 0 warnings)\x1B[22m\x1B[39m\x1B[0m\n" +
                "\x1B[0m\x1B[31m\x1B[1m\x1B[22m\x1B[39m\x1B[0m\n"
            }
        );
    });

    it("fails when a file cannot be processed", async () => {
        const promise = runCheckRuleExamples("tests/fixtures/non-existing-examples.md");

        await assert.rejects(
            promise,
            ({ code, stdout, stderr }) => {
                assert.strictEqual(code, 1);
                assert.strictEqual(stdout, "");
                const expectedStderr =
                "\x1B[0m\x1B[0m\n" +
                "\x1B[0m\x1B[4mtests/fixtures/non-existing-examples.md\x1B[24m\x1B[0m\n" +
                "\x1B[0m  \x1B[2m0:0\x1B[22m  \x1B[31merror\x1B[39m  Error checking file: ENOENT: no such file or directory, open <FILE>\x1B[0m\n" +
                "\x1B[0m\x1B[0m\n" +
                "\x1B[0m\x1B[31m\x1B[1m✖ 1 problem (1 error, 0 warnings)\x1B[22m\x1B[39m\x1B[0m\n" +
                "\x1B[0m\x1B[31m\x1B[1m\x1B[22m\x1B[39m\x1B[0m\n";

                // Replace filename as it's OS-dependent.
                const normalizedStderr = stderr.replace(/'.+'/u, "<FILE>");

                assert.strictEqual(normalizedStderr, expectedStderr);
                return true;
            }
        );
    });
});
