/**
 * @fileoverview Tests for options.
 * @author Sindre Sorhus
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    chalk = require("chalk"),
    proxyquire = require("proxyquire"),
    sinon = require("sinon");

// Chalk protects its methods so we need to inherit from it
// for Sinon to work.
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

const formatter = proxyquire("../../../lib/formatters/stylish", { chalk: chalkStub });

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("formatter:stylish", () => {
    let sandbox;
    const colorsEnabled = chalk.enabled;

    beforeEach(() => {
        chalk.enabled = false;
        sandbox = sinon.sandbox.create();
        sandbox.spy(chalkStub.yellow, "bold");
        sandbox.spy(chalkStub.red, "bold");
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
        chalk.enabled = colorsEnabled;
    });

    describe("when passed no messages", () => {
        const code = [{
            filePath: "foo.js",
            messages: []
        }];

        it("should not return message", () => {
            const result = formatter(code);

            assert.equal(result, "");
            assert.equal(chalkStub.yellow.bold.callCount, 0);
            assert.equal(chalkStub.red.bold.callCount, 0);
        });
    });

    describe("when passed a single message", () => {
        const code = [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                severity: 2,
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }];

        it("should return a string in the correct format for errors", () => {
            const result = formatter(code);

            assert.equal(result, "\nfoo.js\n  5:10  error  Unexpected foo  foo\n\n\u2716 1 problem (1 error, 0 warnings)\n");
            assert.equal(chalkStub.yellow.bold.callCount, 0);
            assert.equal(chalkStub.red.bold.callCount, 1);
        });

        it("should return a string in the correct format for warnings", () => {
            code[0].messages[0].severity = 1;
            const result = formatter(code);

            assert.equal(result, "\nfoo.js\n  5:10  warning  Unexpected foo  foo\n\n\u2716 1 problem (0 errors, 1 warning)\n");
            assert.equal(chalkStub.yellow.bold.callCount, 1);
            assert.equal(chalkStub.red.bold.callCount, 0);
        });
    });

    describe("when passed a fatal error message", () => {
        const code = [{
            filePath: "foo.js",
            messages: [{
                fatal: true,
                message: "Unexpected foo.",
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }];

        it("should return a string in the correct format", () => {
            const result = formatter(code);

            assert.equal(result, "\nfoo.js\n  5:10  error  Unexpected foo  foo\n\n\u2716 1 problem (1 error, 0 warnings)\n");
            assert.equal(chalkStub.yellow.bold.callCount, 0);
            assert.equal(chalkStub.red.bold.callCount, 1);
        });
    });

    describe("when passed multiple messages", () => {
        const code = [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                severity: 2,
                line: 5,
                column: 10,
                ruleId: "foo"
            }, {
                message: "Unexpected bar.",
                severity: 1,
                line: 6,
                column: 11,
                ruleId: "bar"
            }]
        }];

        it("should return a string with multiple entries", () => {
            const result = formatter(code);

            assert.equal(result, "\nfoo.js\n  5:10  error    Unexpected foo  foo\n  6:11  warning  Unexpected bar  bar\n\n\u2716 2 problems (1 error, 1 warning)\n");
            assert.equal(chalkStub.yellow.bold.callCount, 0);
            assert.equal(chalkStub.red.bold.callCount, 1);
        });
    });

    describe("when passed multiple files with 1 message each", () => {
        const code = [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                severity: 2,
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }, {
            filePath: "bar.js",
            messages: [{
                message: "Unexpected bar.",
                severity: 1,
                line: 6,
                column: 11,
                ruleId: "bar"
            }]
        }];

        it("should return a string with multiple entries", () => {
            const result = formatter(code);

            assert.equal(result, "\nfoo.js\n  5:10  error  Unexpected foo  foo\n\nbar.js\n  6:11  warning  Unexpected bar  bar\n\n\u2716 2 problems (1 error, 1 warning)\n");
            assert.equal(chalkStub.yellow.bold.callCount, 0);
            assert.equal(chalkStub.red.bold.callCount, 1);
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

        it("should return a string without line and column", () => {
            const result = formatter(code);

            assert.equal(result, "\nfoo.js\n  0:0  error  Couldn't find foo.js\n\n\u2716 1 problem (1 error, 0 warnings)\n");
            assert.equal(chalkStub.yellow.bold.callCount, 0);
            assert.equal(chalkStub.red.bold.callCount, 1);
        });
    });
});
