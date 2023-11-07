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
        ["--no-deprecation", "tools/check-rule-examples.js", ...filenames]
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
                "\n" +
                "tests/fixtures/bad-examples.md\n" +
                "  11:4  error  Missing language tag: use one of 'javascript', 'js' or 'jsx'\n" +
                "  12:1  error  Syntax error: 'import' and 'export' may appear only with 'sourceType: module'\n" +
                "  20:5  error  Nonstandard language tag 'ts': use one of 'javascript', 'js' or 'jsx'\n" +
                "  23:7  error  Syntax error: Identifier 'foo' has already been declared\n" +
                "\n" +
                "✖ 4 problems (4 errors, 0 warnings)\n" +
                "\n"
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
                "\n" +
                "tests/fixtures/non-existing-examples.md\n" +
                "  0:0  error  Error checking file: ENOENT: no such file or directory, open <FILE>\n" +
                "\n" +
                "✖ 1 problem (1 error, 0 warnings)\n" +
                "\n";

                // Replace filename as it's OS-dependent.
                const normalizedStderr = stderr.replace(/'.+'/u, "<FILE>");

                assert.strictEqual(normalizedStderr, expectedStderr);
                return true;
            }
        );
    });
});
