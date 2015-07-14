/**
 * @fileoverview Tests for jUnit Formatter.
 * @author Jamund Ferguson
 */

/* jshint node:true */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    formatter = require("../../../lib/formatters/junit");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("formatter:junit", function() {
    describe("when there are no problems", function() {
        var code = [];

        it("should not complain about anything", function() {
            var result = formatter(code);
            assert.equal(result.replace(/\n/g, ""), "<?xml version=\"1.0\" encoding=\"utf-8\"?><testsuites></testsuites>");
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

        it("should return a single <testcase> with a message and the line and col number in the body (error)", function() {
            var result = formatter(code);
            assert.equal(result.replace(/\n/g, ""), "<?xml version=\"1.0\" encoding=\"utf-8\"?><testsuites><testsuite package=\"org.eslint\" time=\"0\" tests=\"1\" errors=\"1\" name=\"foo.js\"><testcase time=\"0\" name=\"org.eslint.foo\"><failure message=\"Unexpected foo.\"><![CDATA[line 5, col 10, Error - Unexpected foo. (foo)]]></failure></testcase></testsuite></testsuites>");
        });

        it("should return a single <testcase> with a message and the line and col number in the body (warning)", function() {
            code[0].messages[0].severity = 1;
            var result = formatter(code);
            assert.equal(result.replace(/\n/g, ""), "<?xml version=\"1.0\" encoding=\"utf-8\"?><testsuites><testsuite package=\"org.eslint\" time=\"0\" tests=\"1\" errors=\"1\" name=\"foo.js\"><testcase time=\"0\" name=\"org.eslint.foo\"><failure message=\"Unexpected foo.\"><![CDATA[line 5, col 10, Warning - Unexpected foo. (foo)]]></failure></testcase></testsuite></testsuites>");
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

        it("should return a single <testcase> and an <error>", function() {
            var result = formatter(code);
            assert.equal(result.replace(/\n/g, ""), "<?xml version=\"1.0\" encoding=\"utf-8\"?><testsuites><testsuite package=\"org.eslint\" time=\"0\" tests=\"1\" errors=\"1\" name=\"foo.js\"><testcase time=\"0\" name=\"org.eslint.foo\"><error message=\"Unexpected foo.\"><![CDATA[line 5, col 10, Error - Unexpected foo. (foo)]]></error></testcase></testsuite></testsuites>");
        });
    });

    describe("when passed a fatal error message with no line or column", function() {
        var code = [{
            filePath: "foo.js",
            messages: [{
                fatal: true,
                message: "Unexpected foo."
            }]
        }];

        it("should return a single <testcase> and an <error>", function() {
            var result = formatter(code);
            assert.equal(result.replace(/\n/g, ""), "<?xml version=\"1.0\" encoding=\"utf-8\"?><testsuites><testsuite package=\"org.eslint\" time=\"0\" tests=\"1\" errors=\"1\" name=\"foo.js\"><testcase time=\"0\" name=\"org.eslint.unknown\"><error message=\"Unexpected foo.\"><![CDATA[line 0, col 0, Error - Unexpected foo.]]></error></testcase></testsuite></testsuites>");
        });
    });

    describe("when passed a fatal error message with no line, column, or message text", function() {
        var code = [{
            filePath: "foo.js",
            messages: [{
                fatal: true
            }]
        }];

        it("should return a single <testcase> and an <error>", function() {
            var result = formatter(code);
            assert.equal(result.replace(/\n/g, ""), "<?xml version=\"1.0\" encoding=\"utf-8\"?><testsuites><testsuite package=\"org.eslint\" time=\"0\" tests=\"1\" errors=\"1\" name=\"foo.js\"><testcase time=\"0\" name=\"org.eslint.unknown\"><error message=\"\"><![CDATA[line 0, col 0, Error - ]]></error></testcase></testsuite></testsuites>");
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

        it("should return a multiple <testcase>'s", function() {
            var result = formatter(code);
            assert.equal(result.replace(/\n/g, ""), "<?xml version=\"1.0\" encoding=\"utf-8\"?><testsuites><testsuite package=\"org.eslint\" time=\"0\" tests=\"2\" errors=\"2\" name=\"foo.js\"><testcase time=\"0\" name=\"org.eslint.foo\"><failure message=\"Unexpected foo.\"><![CDATA[line 5, col 10, Error - Unexpected foo. (foo)]]></failure></testcase><testcase time=\"0\" name=\"org.eslint.bar\"><failure message=\"Unexpected bar.\"><![CDATA[line 6, col 11, Warning - Unexpected bar. (bar)]]></failure></testcase></testsuite></testsuites>");
        });
    });

    describe("when passed special characters", function() {
        var code = [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected <foo></foo>.",
                severity: 1,
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }];

        it("should make them go away", function() {
            var result = formatter(code);
            assert.equal(result.replace(/\n/g, ""), "<?xml version=\"1.0\" encoding=\"utf-8\"?><testsuites><testsuite package=\"org.eslint\" time=\"0\" tests=\"1\" errors=\"1\" name=\"foo.js\"><testcase time=\"0\" name=\"org.eslint.foo\"><failure message=\"Unexpected &lt;foo&gt;&lt;/foo&gt;.\"><![CDATA[line 5, col 10, Warning - Unexpected &lt;foo&gt;&lt;/foo&gt;. (foo)]]></failure></testcase></testsuite></testsuites>");
        });
    });

    describe("when passed multiple files with 1 message each", function() {
        var code = [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                severity: 1,
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }, {
            filePath: "bar.js",
            messages: [{
                message: "Unexpected bar.",
                severity: 2,
                line: 6,
                column: 11,
                ruleId: "bar"
            }]
        }];

        it("should return 2 <testsuite>'s", function() {
            var result = formatter(code);
            assert.equal(result.replace(/\n/g, ""), "<?xml version=\"1.0\" encoding=\"utf-8\"?><testsuites><testsuite package=\"org.eslint\" time=\"0\" tests=\"1\" errors=\"1\" name=\"foo.js\"><testcase time=\"0\" name=\"org.eslint.foo\"><failure message=\"Unexpected foo.\"><![CDATA[line 5, col 10, Warning - Unexpected foo. (foo)]]></failure></testcase></testsuite><testsuite package=\"org.eslint\" time=\"0\" tests=\"1\" errors=\"1\" name=\"bar.js\"><testcase time=\"0\" name=\"org.eslint.bar\"><failure message=\"Unexpected bar.\"><![CDATA[line 6, col 11, Error - Unexpected bar. (bar)]]></failure></testcase></testsuite></testsuites>");
        });
    });

    describe("when passed multiple files with total 1 failure", function() {
        var code = [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                severity: 1,
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }, {
            filePath: "bar.js",
            messages: []
        }];

        it("should return 1 <testsuite>", function() {
            var result = formatter(code);
            assert.equal(result.replace(/\n/g, ""), "<?xml version=\"1.0\" encoding=\"utf-8\"?><testsuites><testsuite package=\"org.eslint\" time=\"0\" tests=\"1\" errors=\"1\" name=\"foo.js\"><testcase time=\"0\" name=\"org.eslint.foo\"><failure message=\"Unexpected foo.\"><![CDATA[line 5, col 10, Warning - Unexpected foo. (foo)]]></failure></testcase></testsuite></testsuites>");
        });
    });
});
