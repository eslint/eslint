/**
 * @fileoverview Tests for options.
 * @author Jonathan Kingston
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    formatter = require("../../../lib/formatters/tap");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("formatter:tap", function() {
    describe("when passed no messages", function() {
        const code = [{
            filePath: "foo.js",
            messages: []
        }];

        it("should return nothing", function() {
            const result = formatter(code);

            assert.equal(result, "TAP version 13\n1..1\nok 1 - foo.js\n");
        });
    });

    describe("when passed a single message", function() {
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

        it("should return a string with YAML severity, line and column", function() {
            const result = formatter(code);

            assert.equal(result, "TAP version 13\n1..1\nnot ok 1 - foo.js\n  ---\n  message: Unexpected foo.\n  severity: error\n  data:\n    line: 5\n    column: 10\n    ruleId: foo\n  ...\n");
        });

        it("should return a string with line: x, column: y, severity: warning for warnings", function() {
            code[0].messages[0].severity = 1;
            const result = formatter(code);

            assert.include(result, "line: 5");
            assert.include(result, "column: 10");
            assert.include(result, "ruleId: foo");
            assert.include(result, "severity: warning");
            assert.include(result, "1..1");
        });
    });

    describe("when passed a fatal error message", function() {
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

        it("should return a an error string", function() {
            const result = formatter(code);

            assert.include(result, "not ok");
            assert.include(result, "error");
        });
    });

    describe("when passed multiple messages", function() {
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
            }, {
                message: "Unexpected baz.",
                severity: 1,
                line: 7,
                column: 12,
                ruleId: "baz"
            }]
        }];

        it("should return a string with multiple entries", function() {
            const result = formatter(code);

            assert.include(result, "not ok");
            assert.include(result, "messages");
            assert.include(result, "Unexpected foo.");
            assert.include(result, "line: 5");
            assert.include(result, "column: 10");
            assert.include(result, "Unexpected bar.");
            assert.include(result, "line: 6");
            assert.include(result, "column: 11");
            assert.include(result, "Unexpected baz.");
            assert.include(result, "line: 7");
            assert.include(result, "column: 12");
        });
    });

    describe("when passed multiple files with 1 message each", function() {
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

        it("should return a string with multiple entries", function() {
            const result = formatter(code);

            assert.include(result, "not ok 1");
            assert.include(result, "not ok 2");
        });
    });

    describe("when passed one file not found message", function() {
        const code = [{
            filePath: "foo.js",
            messages: [{
                fatal: true,
                message: "Couldn't find foo.js."
            }]
        }];

        it("should return a string without line and column", function() {
            const result = formatter(code);

            assert.include(result, "line: 0");
            assert.include(result, "column: 0");
            assert.include(result, "severity: error");
            assert.include(result, "1..1");
        });
    });
});
