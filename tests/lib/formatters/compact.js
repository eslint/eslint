/**
 * @fileoverview Tests for options.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    formatter = require("../../../lib/formatters/compact");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("formatter:compact", function() {
    describe("when passed no messages", function() {
        var code = [{
            filePath: "foo.js",
            messages: []
        }];

        it("should return nothing", function() {
            var result = formatter(code);
            assert.equal(result, "");
        });
    });

    describe("when passed a single message", function() {
        var code = [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                severity: 2,
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }];

        it("should return a string in the format filename: line x, col y, Error - z for errors", function() {
            var result = formatter(code);
            assert.equal(result, "foo.js: line 5, col 10, Error - Unexpected foo. (foo)\n\n1 problem");
        });

        it("should return a string in the format filename: line x, col y, Warning - z for warnings", function() {
            code[0].messages[0].severity = 1;
            var result = formatter(code);
            assert.equal(result, "foo.js: line 5, col 10, Warning - Unexpected foo. (foo)\n\n1 problem");
        });
    });

    describe("when passed a fatal error message", function() {
        var code = [{
            filePath: "foo.js",
            messages: [{
                fatal: true,
                message: "Unexpected foo.",
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }];

        it("should return a string in the format filename: line x, col y, Error - z", function() {
            var result = formatter(code);
            assert.equal(result, "foo.js: line 5, col 10, Error - Unexpected foo. (foo)\n\n1 problem");
        });
    });

    describe("when passed multiple messages", function() {
        var code = [{
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

        it("should return a string with multiple entries", function() {
            var result = formatter(code);
            assert.equal(result, "foo.js: line 5, col 10, Error - Unexpected foo. (foo)\nfoo.js: line 6, col 11, Warning - Unexpected bar. (bar)\n\n2 problems");
        });
    });

    describe("when passed multiple files with 1 message each", function() {
        var code = [{
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
            var result = formatter(code);
            assert.equal(result, "foo.js: line 5, col 10, Error - Unexpected foo. (foo)\nbar.js: line 6, col 11, Warning - Unexpected bar. (bar)\n\n2 problems");
        });
    });

    describe("when passed one file not found message", function() {
        var code = [{
            filePath: "foo.js",
            messages: [{
                fatal: true,
                message: "Couldn't find foo.js."
            }]
        }];

        it("should return a string without line and column", function() {
            var result = formatter(code);
            assert.equal(result, "foo.js: line 0, col 0, Error - Couldn't find foo.js.\n\n1 problem");
        });
    });
});
