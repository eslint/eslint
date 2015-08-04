/**
 * @fileoverview Tests for unix-style formatter.
 * @author oshi-shinobu
 * @copyright 2015 oshi-shinobu. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    formatter = require("../../../lib/formatters/unix");

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

        it("should return a string in the format filename:line:column: error [Error/rule_id]", function() {
            var result = formatter(code);
            assert.equal(result, "foo.js:5:10: Unexpected foo. [Error/foo]\n\n1 problem");
        });

        it("should return a string in the format filename:line:column: warning [Warning/rule_id]", function() {
            code[0].messages[0].severity = 1;
            var result = formatter(code);
            assert.equal(result, "foo.js:5:10: Unexpected foo. [Warning/foo]\n\n1 problem");
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

        it("should return a string in the format filename:line:column: error [Error/rule_id]", function() {
            var result = formatter(code);
            assert.equal(result, "foo.js:5:10: Unexpected foo. [Error/foo]\n\n1 problem");
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
            assert.equal(result, "foo.js:5:10: Unexpected foo. [Error/foo]\nfoo.js:6:11: Unexpected bar. [Warning/bar]\n\n2 problems");
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
            assert.equal(result, "foo.js:5:10: Unexpected foo. [Error/foo]\nbar.js:6:11: Unexpected bar. [Warning/bar]\n\n2 problems");
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
            assert.equal(result, "foo.js:0:0: Couldn't find foo.js. [Error]\n\n1 problem");
        });
    });
});
