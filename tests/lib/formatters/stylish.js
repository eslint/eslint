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
            messages: [],
            errorCount: 0,
            warningCount: 0
        }];

        it("should not return message", () => {
            const result = formatter(code);

            assert.equal(result, "");
            assert.equal(chalkStub.yellow.bold.callCount, 0);
            assert.equal(chalkStub.red.bold.callCount, 0);
        });
    });

    describe("when passed a single error message", () => {
        const code = [{
            filePath: "foo.js",
            errorCount: 1,
            warningCount: 0,
            fixableErrorCount: 0,
            fixableWarningCount: 0,
            messages: [{
                message: "Unexpected foo.",
                severity: 2,
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

        describe("when the error is fixable", () => {
            beforeEach(() => {
                code[0].fixableErrorCount = 1;
            });

            it("should return a string in the correct format", () => {
                const result = formatter(code);

                assert.equal(result, "\nfoo.js\n  5:10  error  Unexpected foo  foo\n\n\u2716 1 problem (1 error, 0 warnings)\n  1 error, 0 warnings can potentially be fixed by running eslint with the `--fix` option.\n");
                assert.equal(chalkStub.yellow.bold.callCount, 0);
                assert.equal(chalkStub.red.bold.callCount, 2);
            });
        });
    });

    describe("when passed a single warning message", () => {
        const code = [{
            filePath: "foo.js",
            errorCount: 0,
            warningCount: 1,
            fixableErrorCount: 0,
            fixableWarningCount: 0,
            messages: [{
                message: "Unexpected foo.",
                severity: 1,
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }];

        it("should return a string in the correct format", () => {
            const result = formatter(code);

            assert.equal(result, "\nfoo.js\n  5:10  warning  Unexpected foo  foo\n\n\u2716 1 problem (0 errors, 1 warning)\n");
            assert.equal(chalkStub.yellow.bold.callCount, 1);
            assert.equal(chalkStub.red.bold.callCount, 0);
        });

        describe("when the error is fixable", () => {
            beforeEach(() => {
                code[0].fixableWarningCount = 1;
            });

            it("should return a string in the correct format", () => {
                const result = formatter(code);

                assert.equal(result, "\nfoo.js\n  5:10  warning  Unexpected foo  foo\n\n\u2716 1 problem (0 errors, 1 warning)\n  0 errors, 1 warning can potentially be fixed by running eslint with the `--fix` option.\n");
                assert.equal(chalkStub.yellow.bold.callCount, 2);
                assert.equal(chalkStub.red.bold.callCount, 0);
            });

        });
    });

    describe("when passed a fatal error message", () => {
        const code = [{
            filePath: "foo.js",
            errorCount: 1,
            warningCount: 0,
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
            errorCount: 1,
            warningCount: 1,
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
            errorCount: 1,
            warningCount: 0,
            messages: [{
                message: "Unexpected foo.",
                severity: 2,
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }, {
            errorCount: 0,
            warningCount: 1,
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

        it("should add errorCount", () => {
            code.forEach(c => {
                c.errorCount = 1;
                c.warningCount = 0;
            });

            const result = formatter(code);

            assert.equal(result, "\nfoo.js\n  5:10  error  Unexpected foo  foo\n\nbar.js\n  6:11  warning  Unexpected bar  bar\n\n\u2716 2 problems (2 errors, 0 warnings)\n");
            assert.equal(chalkStub.yellow.bold.callCount, 0);
            assert.equal(chalkStub.red.bold.callCount, 1);
        });

        it("should add warningCount", () => {
            code.forEach(c => {
                c.errorCount = 0;
                c.warningCount = 1;
            });

            const result = formatter(code);

            assert.equal(result, "\nfoo.js\n  5:10  error  Unexpected foo  foo\n\nbar.js\n  6:11  warning  Unexpected bar  bar\n\n\u2716 2 problems (0 errors, 2 warnings)\n");
            assert.equal(chalkStub.yellow.bold.callCount, 0);
            assert.equal(chalkStub.red.bold.callCount, 1);
        });
    });

    describe("when passed one file not found message", () => {
        const code = [{
            filePath: "foo.js",
            errorCount: 1,
            warningCount: 0,
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

    describe("fixable problems", () => {
        it("should not output fixable problems message when no errors or warnings are fixable", () => {
            const code = [{
                filePath: "foo.js",
                errorCount: 1,
                warningCount: 0,
                fixableErrorCount: 0,
                fixableWarningCount: 0,
                messages: [{
                    message: "Unexpected foo.",
                    severity: 2,
                    line: 5,
                    column: 10,
                    ruleId: "foo"
                }]
            }];

            const result = formatter(code);

            assert.notInclude(result, "can potentially be fixed");
        });

        it("should output the fixable problems message when errors are fixable", () => {
            const code = [{
                filePath: "foo.js",
                errorCount: 1,
                warningCount: 0,
                fixableErrorCount: 1,
                fixableWarningCount: 0,
                messages: [{
                    message: "Unexpected foo.",
                    severity: 2,
                    line: 5,
                    column: 10,
                    ruleId: "foo"
                }]
            }];

            const result = formatter(code);

            assert.include(result, "  1 error, 0 warnings can potentially be fixed by running eslint with the `--fix` option.\n");
        });

        it("should output fixable problems message when warnings are fixable", () => {
            const code = [{
                filePath: "foo.js",
                errorCount: 0,
                warningCount: 3,
                fixableErrorCount: 0,
                fixableWarningCount: 2,
                messages: [{
                    message: "Unexpected foo."
                }]
            }];

            const result = formatter(code);

            assert.include(result, "  0 errors, 2 warnings can potentially be fixed by running eslint with the `--fix` option.\n");
        });

        it("should output the total number of fixable errors and warnings", () => {
            const code = [{
                errorCount: 5,
                warningCount: 3,
                fixableErrorCount: 5,
                fixableWarningCount: 2,
                messages: [{
                    message: "Unexpected foo."
                }]
            }, {
                errorCount: 4,
                warningCount: 2,
                fixableErrorCount: 4,
                fixableWarningCount: 1,
                messages: [{
                    message: "Unexpected bar."
                }]
            }];

            const result = formatter(code);

            assert.include(result, "  9 errors, 3 warnings can potentially be fixed by running eslint with the `--fix` option.\n");
        });
    });
});
