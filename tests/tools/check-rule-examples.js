"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("node:assert");
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");
const { LATEST_ECMA_VERSION } = require("../../conf/ecma-version");

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
            ({ code, stdout, stderr }) => {
                assert.strictEqual(code, 1);
                assert.strictEqual(stdout, "");

                /* eslint-disable no-control-regex -- escaping control characters */

                const normalizedStderr =
                stderr

                    // Remove OS-dependent path except base name.
                    .replace(/(?<=\x1B\[4m).*(?=bad-examples\.md)/u, "")

                    // Remove runtime-specific error message part (different in Node.js 18, 20 and 21).
                    .replace(/(?<=' doesn't allow this comment'):.*(?=\x1B\[0m)/u, "");

                /* eslint-enable no-control-regex -- re-enable rule */

                const expectedStderr =
                "\x1B[0m\x1B[0m\n" +
                "\x1B[0m\x1B[4mbad-examples.md\x1B[24m\x1B[0m\n" +
                "\x1B[0m  \x1B[2m11:4\x1B[22m  \x1B[31merror\x1B[39m  Missing language tag: use one of 'javascript', 'js' or 'jsx'\x1B[0m\n" +
                "\x1B[0m  \x1B[2m12:1\x1B[22m  \x1B[31merror\x1B[39m  Syntax error: 'import' and 'export' may appear only with 'sourceType: module'\x1B[0m\n" +
                "\x1B[0m  \x1B[2m20:5\x1B[22m  \x1B[31merror\x1B[39m  Nonstandard language tag 'ts': use one of 'javascript', 'js' or 'jsx'\x1B[0m\n" +
                "\x1B[0m  \x1B[2m23:7\x1B[22m  \x1B[31merror\x1B[39m  Syntax error: Identifier 'foo' has already been declared\x1B[0m\n" +
                "\x1B[0m  \x1B[2m31:1\x1B[22m  \x1B[31merror\x1B[39m  Example code should contain a configuration comment like /* eslint no-restricted-syntax: \"error\" */\x1B[0m\n" +
                "\x1B[0m  \x1B[2m41:1\x1B[22m  \x1B[31merror\x1B[39m  Failed to parse JSON from ' doesn't allow this comment'\x1B[0m\n" +
                "\x1B[0m  \x1B[2m51:1\x1B[22m  \x1B[31merror\x1B[39m  Duplicate /* eslint no-restricted-syntax */ configuration comment. Each example should contain only one. Split this example into multiple examples\x1B[0m\n" +
                "\x1B[0m  \x1B[2m56:1\x1B[22m  \x1B[31merror\x1B[39m  Remove unnecessary \"ecmaVersion\":\"latest\"\x1B[0m\n" +
                `\x1B[0m  \x1B[2m64:1\x1B[22m  \x1B[31merror\x1B[39m  "ecmaVersion" must be one of ${[3, 5, ...Array.from({ length: LATEST_ECMA_VERSION - 2015 + 1 }, (_, index) => index + 2015)].join(", ")}\x1B[0m\n` +
                "\x1B[0m  \x1B[2m76:1\x1B[22m  \x1B[31merror\x1B[39m  /* eslint-env */ comments are no longer supported. Remove the comment\x1B[0m\n" +
                "\x1B[0m  \x1B[2m78:1\x1B[22m  \x1B[31merror\x1B[39m  /* eslint-env */ comments are no longer supported. Remove the comment\x1B[0m\n" +
                "\x1B[0m  \x1B[2m79:1\x1B[22m  \x1B[31merror\x1B[39m  /* eslint-env */ comments are no longer supported. Remove the comment\x1B[0m\n" +
                "\x1B[0m\x1B[0m\n" +
                "\x1B[0m\x1B[31m\x1B[1m✖ 12 problems (12 errors, 0 warnings)\x1B[22m\x1B[39m\x1B[0m\n" +
                "\x1B[0m\x1B[31m\x1B[1m\x1B[22m\x1B[39m\x1B[0m\n";

                assert.strictEqual(normalizedStderr, expectedStderr);
                return true;
            }
        );
    });

    it("fails when a file cannot be processed", async () => {
        const promise = runCheckRuleExamples("tests/fixtures/non-existing-examples.md");

        await assert.rejects(
            promise,
            {
                code: 1,
                stdout: "",
                stderr: "No files found that match the specified patterns.\n"
            }
        );
    });
});
