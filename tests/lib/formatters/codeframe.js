/**
 * @fileoverview Tests for codeframe reporter.
 * @author Vitor Balocco
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert;
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const chalk = require("chalk");
const path = require("path");

// Chalk protects its methods so we need to inherit from it for Sinon to work.
const chalkStub = Object.create(chalk, {
    yellow: {
        value(str) {
            return chalk.yellow(str);
        },
        writable: true
    },
    red: {
        value(str) {
            return chalk.red(str);
        },
        writable: true
    }
});

chalkStub.yellow.bold = chalk.yellow.bold;
chalkStub.red.bold = chalk.red.bold;

const formatter = proxyquire("../../../lib/formatters/codeframe", { chalk: chalkStub });

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("formatter:codeframe", () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe("when passed no messages", () => {
        const code = [{
            filePath: "foo.js",
            messages: []
        }];

        it("should return nothing", () => {
            const result = formatter(code);

            assert.equal(result, "");
        });
    });

    describe("when passed a single message", () => {
        const code = [{
            filePath: path.join(process.cwd(), "lib", "foo.js"),
            source: "var foo = 1;\n var bar = 2;\n",
            messages: [{
                message: "Unexpected foo.",
                severity: 2,
                line: 1,
                column: 5,
                ruleId: "foo"
            }]
        }];

        it("should return a string in the correct format for errors", () => {
            const result = formatter(code);

            assert.equal(chalk.stripColor(result), [
                `error: Unexpected foo (foo) at ${path.join("lib", "foo.js")}:1:5:`,
                "> 1 | var foo = 1;",
                "    |     ^",
                "  2 |  var bar = 2;",
                "  3 | ",
                "\n",
                "1 error found."
            ].join("\n"));
        });

        it("should return a string in the correct format for warnings", () => {
            code[0].messages[0].severity = 1;

            const result = formatter(code);

            assert.equal(chalk.stripColor(result), [
                `warning: Unexpected foo (foo) at ${path.join("lib", "foo.js")}:1:5:`,
                "> 1 | var foo = 1;",
                "    |     ^",
                "  2 |  var bar = 2;",
                "  3 | ",
                "\n",
                "1 warning found."
            ].join("\n"));
        });

        it("should return bold red summary when there are errors", () => {
            sandbox.spy(chalkStub.yellow, "bold");
            sandbox.spy(chalkStub.red, "bold");
            code[0].messages[0].severity = 2;

            formatter(code);

            assert.equal(chalkStub.yellow.bold.callCount, 0);
            assert.equal(chalkStub.red.bold.callCount, 1);
        });

        it("should return bold yellow summary when there are only warnings", () => {
            sandbox.spy(chalkStub.yellow, "bold");
            sandbox.spy(chalkStub.red, "bold");
            code[0].messages[0].severity = 1;

            formatter(code);

            assert.equal(chalkStub.yellow.bold.callCount, 1);
            assert.equal(chalkStub.red.bold.callCount, 0);
        });
    });

    describe("when passed multiple messages", () => {
        const code = [{
            filePath: "foo.js",
            source: "const foo = 1\n",
            messages: [{
                message: "Missing semicolon.",
                severity: 2,
                line: 1,
                column: 14,
                ruleId: "semi"
            }, {
                message: "'foo' is assigned a value but never used.",
                severity: 2,
                line: 1,
                column: 7,
                ruleId: "no-unused-vars"
            }],
        }];

        it("should return a string with multiple entries", () => {
            const result = formatter(code);

            assert.equal(chalk.stripColor(result), [
                "error: Missing semicolon (semi) at foo.js:1:14:",
                "> 1 | const foo = 1",
                "    |              ^",
                "  2 | ",
                "\n",
                "error: 'foo' is assigned a value but never used (no-unused-vars) at foo.js:1:7:",
                "> 1 | const foo = 1",
                "    |       ^",
                "  2 | ",
                "\n",
                "2 errors found."
            ].join("\n"));
        });

        it("should return bold red summary when at least 1 of the messages is an error", () => {
            sandbox.spy(chalkStub.yellow, "bold");
            sandbox.spy(chalkStub.red, "bold");
            code[0].messages[0].severity = 1;

            formatter(code);

            assert.equal(chalkStub.yellow.bold.callCount, 0);
            assert.equal(chalkStub.red.bold.callCount, 1);
        });
    });

    describe("when passed one file with 1 message and fixes applied", () => {
        const code = [{
            filePath: "foo.js",
            messages: [{
                ruleId: "no-unused-vars",
                severity: 2,
                message: "'foo' is assigned a value but never used.",
                line: 4,
                column: 11,
                source: "    const foo = 1;"
            }],
            output: "function foo() {\n\n    // a comment\n    const foo = 1;\n}\n\n"
        }];

        it("should return a string with code preview pointing to the correct location after fixes", () => {
            const result = formatter(code);

            assert.equal(chalk.stripColor(result), [
                "error: 'foo' is assigned a value but never used (no-unused-vars) at foo.js:4:11:",
                "  2 | ",
                "  3 |     // a comment",
                "> 4 |     const foo = 1;",
                "    |           ^",
                "  5 | }",
                "  6 | ",
                "  7 | ",
                "\n",
                "1 error found."
            ].join("\n"));
        });
    });

    describe("when passed multiple files with 1 message each", () => {
        const code = [{
            filePath: "foo.js",
            source: "const foo = 1\n",
            messages: [{
                message: "Missing semicolon.",
                severity: 2,
                line: 1,
                column: 14,
                ruleId: "semi"
            }]
        }, {
            filePath: "bar.js",
            source: "const bar = 2\n",
            messages: [{
                message: "Missing semicolon.",
                severity: 2,
                line: 1,
                column: 14,
                ruleId: "semi"
            }]
        }];

        it("should return a string with multiple entries", () => {
            const result = formatter(code);

            assert.equal(chalk.stripColor(result), [
                "error: Missing semicolon (semi) at foo.js:1:14:",
                "> 1 | const foo = 1",
                "    |              ^",
                "  2 | ",
                "\n",
                "error: Missing semicolon (semi) at bar.js:1:14:",
                "> 1 | const bar = 2",
                "    |              ^",
                "  2 | ",
                "\n",
                "2 errors found."
            ].join("\n"));
        });
    });

    describe("when passed a fatal error message", () => {
        const code = [{
            filePath: "foo.js",
            source: "e{}\n",
            messages: [{
                ruleId: null,
                fatal: true,
                severity: 2,
                source: "e{}",
                message: "Parsing error: Unexpected token {",
                line: 1,
                column: 2
            }]
        }];

        it("should return a string in the correct format", () => {
            const result = formatter(code);

            assert.equal(chalk.stripColor(result), [
                "error: Parsing error: Unexpected token { at foo.js:1:2:",
                "> 1 | e{}",
                "    |  ^",
                "  2 | ",
                "\n",
                "1 error found."
            ].join("\n"));
        });
    });

    describe("when passed one file not found message", () => {
        const code = [{
            filePath: "foo.js",
            messages: [{
                fatal: true,
                message: "Couldn't find foo.js."
            }]
        }];

        it("should return a string without code preview (codeframe)", () => {
            const result = formatter(code);

            assert.equal(chalk.stripColor(result), "error: Couldn't find foo.js at foo.js\n\n\n1 error found.");
        });
    });

    describe("when passed a single message with no line or column", () => {
        const code = [{
            filePath: "foo.js",
            messages: [{
                ruleId: "foo",
                message: "Unexpected foo.",
                severity: 2,
                source: "foo"
            }]
        }];

        it("should return a string without code preview (codeframe)", () => {
            const result = formatter(code);

            assert.equal(chalk.stripColor(result), "error: Unexpected foo (foo) at foo.js\n\n\n1 error found.");
        });

        it("should output filepath but without 'line:column' appended", () => {
            const result = formatter(code);

            assert.equal(chalk.stripColor(result), "error: Unexpected foo (foo) at foo.js\n\n\n1 error found.");
        });
    });
});
