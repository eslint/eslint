/**
 * @fileoverview Tests for unix-style formatter.
 * @author oshi-shinobu
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    formatter = require("../../../lib/formatters/unix");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("formatter:compact", () => {
    describe("when passed no messages", () => {
        const code = [{
            filePath: "foo.js",
            messages: []
        }];

        it("should return nothing", () => {
            const result = formatter(code);

            assert.strictEqual(result, "");
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

        it("should return a string in the format filename:line:column: error [Error/rule_id]", () => {
            const result = formatter(code);

            assert.strictEqual(result, "foo.js:5:10: Unexpected foo. [Error/foo]\n\n1 problem");
        });

        it("should return a string in the format filename:line:column: warning [Warning/rule_id]", () => {
            code[0].messages[0].severity = 1;
            const result = formatter(code);

            assert.strictEqual(result, "foo.js:5:10: Unexpected foo. [Warning/foo]\n\n1 problem");
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

        it("should return a string in the format filename:line:column: error [Error/rule_id]", () => {
            const result = formatter(code);

            assert.strictEqual(result, "foo.js:5:10: Unexpected foo. [Error/foo]\n\n1 problem");
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

            assert.strictEqual(result, "foo.js:5:10: Unexpected foo. [Error/foo]\nfoo.js:6:11: Unexpected bar. [Warning/bar]\n\n2 problems");
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

            assert.strictEqual(result, "foo.js:5:10: Unexpected foo. [Error/foo]\nbar.js:6:11: Unexpected bar. [Warning/bar]\n\n2 problems");
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

            assert.strictEqual(result, "foo.js:0:0: Couldn't find foo.js. [Error]\n\n1 problem");
        });
    });
});
