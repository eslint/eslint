/**
 * @fileoverview Tests for checkstyle reporter.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    formatter = require("../../../lib/formatters/checkstyle");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("formatter:checkstyle", function() {
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
        it("should return a string in the format filename: line x, col y, Error - z for errors", function() {
            var config = { rules: { foo: 2 } };
            var result = formatter(code, config);

            assert.equal("<?xml version=\"1.0\" encoding=\"utf-8\"?><checkstyle version=\"4.3\"><file name=\"foo.js\"><error line=\"5\" column=\"10\" severity=\"error\" message=\"Unexpected foo.\" /></file></checkstyle>", result);
        });
        it("should return a string in the format filename: line x, col y, Warning - z for warnings", function() {
            var config = {
                rules: { foo: 1 }
            };

            var result = formatter(code, config);
            assert.equal("<?xml version=\"1.0\" encoding=\"utf-8\"?><checkstyle version=\"4.3\"><file name=\"foo.js\"><error line=\"5\" column=\"10\" severity=\"warning\" message=\"Unexpected foo.\" /></file></checkstyle>", result);
        });
        it("should return a string in the format filename: line x, col y, Error - z for errors with options config", function() {
            var config = {
                rules: { foo: [2, "option"] }
            };

            var result = formatter(code, config);
            assert.equal("<?xml version=\"1.0\" encoding=\"utf-8\"?><checkstyle version=\"4.3\"><file name=\"foo.js\"><error line=\"5\" column=\"10\" severity=\"error\" message=\"Unexpected foo.\" /></file></checkstyle>", result);
        });
    });

    describe("when passed a message with XML control characters", function() {
        var code = [{
            filePath: "<>&\"'.js",
            messages: [{
                fatal: true,
                message: "Unexpected <>&\"'.",
                line: '<',
                column: '>',
                ruleId: "rule-<>&\"'"
            }]
        }];

        it("should return a string in the format filename: line x, col y, Error - z", function() {
            var config = {};    // doesn't matter what's in the config for this test

            var result = formatter(code, config);
            assert.equal("<?xml version=\"1.0\" encoding=\"utf-8\"?><checkstyle version=\"4.3\"><file name=\"&lt;&gt;&amp;&quot;&apos;.js\"><error line=\"&lt;\" column=\"&gt;\" severity=\"error\" message=\"Unexpected &lt;&gt;&amp;&quot;&apos;.\" /></file></checkstyle>", result);
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
            var config = {};    // doesn't matter what's in the config for this test

            var result = formatter(code, config);
            assert.equal("<?xml version=\"1.0\" encoding=\"utf-8\"?><checkstyle version=\"4.3\"><file name=\"foo.js\"><error line=\"5\" column=\"10\" severity=\"error\" message=\"Unexpected foo.\" /></file></checkstyle>", result);
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
            assert.equal("<?xml version=\"1.0\" encoding=\"utf-8\"?><checkstyle version=\"4.3\"><file name=\"foo.js\"><error line=\"5\" column=\"10\" severity=\"error\" message=\"Unexpected foo.\" /><error line=\"6\" column=\"11\" severity=\"warning\" message=\"Unexpected bar.\" /></file></checkstyle>", result);
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
            assert.equal("<?xml version=\"1.0\" encoding=\"utf-8\"?><checkstyle version=\"4.3\"><file name=\"foo.js\"><error line=\"5\" column=\"10\" severity=\"error\" message=\"Unexpected foo.\" /></file><file name=\"bar.js\"><error line=\"6\" column=\"11\" severity=\"warning\" message=\"Unexpected bar.\" /></file></checkstyle>", result);
        });
    });
});
