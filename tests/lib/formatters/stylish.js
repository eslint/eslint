/**
 * @fileoverview Tests for options.
 * @author Sindre Sorhus
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    formatter = require("../../../lib/formatters/stylish");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("formatter:stylish", function() {
    describe("when passed no messages", function() {
        var code = [{
            filePath: "foo.js",
            messages: []
        }];

        it("should return message", function() {
            var config = {
                rules: { foo: 2 }
            };

            var result = formatter(code, config);
            assert.equal("", result);
        });
    });

    describe("when passed a single message", function() {
        var code = [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }];

        it("should return a string in the correct format for errors", function() {
            var config = {
                rules: { foo: 2 }
            };

            var result = formatter(code, config);
            assert.equal("\nfoo.js\n  5:10  error  Unexpected foo  foo\n\n\u2716 1 problem\n", result);
        });

        it("should return a string in the correct format for warnings", function() {
            var config = {
                rules: { foo: 1 }
            };

            var result = formatter(code, config);
            assert.equal("\nfoo.js\n  5:10  warning  Unexpected foo  foo\n\n\u2716 1 problem\n", result);
        });

        it("should return a string in the correct format for errors with options config", function() {
            var config = {
                rules: { foo: [2, "option"] }
            };

            var result = formatter(code, config);
            assert.equal("\nfoo.js\n  5:10  error  Unexpected foo  foo\n\n\u2716 1 problem\n", result);
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

        it("should return a string in the correct format", function() {
            var config = {};    // doesn't matter what's in the config for this test

            var result = formatter(code, config);
            assert.equal("\nfoo.js\n  5:10  error  Unexpected foo  foo\n\n\u2716 1 problem\n", result);
        });
    });

    describe("when passed multiple messages", function() {
        var code = [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                line: 5,
                column: 10,
                ruleId: "foo"
            }, {
                message: "Unexpected bar.",
                line: 6,
                column: 11,
                ruleId: "bar"
            }]
        }];

        it("should return a string with multiple entries", function() {
            var config = {
                rules: { foo: 2, bar: 1 }
            };

            var result = formatter(code, config);
            assert.equal("\nfoo.js\n  5:10  error    Unexpected foo  foo\n  6:11  warning  Unexpected bar  bar\n\n\u2716 2 problems\n", result);
        });
    });

    describe("when passed multiple files with 1 message each", function() {
        var code = [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }, {
            filePath: "bar.js",
            messages: [{
                message: "Unexpected bar.",
                line: 6,
                column: 11,
                ruleId: "bar"
            }]
        }];

        it("should return a string with multiple entries", function() {
            var config = {
                rules: { foo: 2, bar: 1 }
            };

            var result = formatter(code, config);
            assert.equal("\nfoo.js\n  5:10  error  Unexpected foo  foo\n\nbar.js\n  6:11  warning  Unexpected bar  bar\n\n\u2716 2 problems\n", result);
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
            var config = {
                rules: { foo: 2, bar: 1 }
            };

            var result = formatter(code, config);
            assert.equal("\nfoo.js\n  0:0  error  Couldn't find foo.js\n\n\u2716 1 problem\n", result);
        });
    });
});
