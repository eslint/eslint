/**
 * @fileoverview Tests for JSLint XML reporter.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    formatter = require("../../../lib/formatters/jslint-xml");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("formatter:jslint-xml", function() {
    describe("when passed a single message", function() {

        var code = [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                severity: 2,
                line: 5,
                column: 10,
                ruleId: "foo",
                source: "foo"
            }]
        }];

        it("should return a string in JSLint XML format with 1 issue in 1 file", function() {
            var result = formatter(code);
            assert.equal(result, "<?xml version=\"1.0\" encoding=\"utf-8\"?><jslint><file name=\"foo.js\"><issue line=\"5\" char=\"10\" evidence=\"foo\" reason=\"Unexpected foo. (foo)\" /></file></jslint>");
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
                ruleId: "foo",
                source: "foo"
            }]
        }];

        it("should return a string in JSLint XML format with 1 issue in 1 file", function() {
            var result = formatter(code);
            assert.equal(result, "<?xml version=\"1.0\" encoding=\"utf-8\"?><jslint><file name=\"foo.js\"><issue line=\"5\" char=\"10\" evidence=\"foo\" reason=\"Unexpected foo. (foo)\" /></file></jslint>");
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
                ruleId: "foo",
                source: "foo"
            }, {
                message: "Unexpected bar.",
                severity: 1,
                line: 6,
                column: 11,
                ruleId: "bar",
                source: "bar"
            }]
        }];

        it("should return a string in JSLint XML format with 2 issues in 1 file", function() {
            var result = formatter(code);
            assert.equal(result, "<?xml version=\"1.0\" encoding=\"utf-8\"?><jslint><file name=\"foo.js\"><issue line=\"5\" char=\"10\" evidence=\"foo\" reason=\"Unexpected foo. (foo)\" /><issue line=\"6\" char=\"11\" evidence=\"bar\" reason=\"Unexpected bar. (bar)\" /></file></jslint>");
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
                ruleId: "foo",
                source: "foo"
            }]
        }, {
            filePath: "bar.js",
            messages: [{
                message: "Unexpected bar.",
                severity: 1,
                line: 6,
                column: 11,
                ruleId: "bar",
                source: "bar"
            }]
        }];

        it("should return a string in JSLint XML format with 2 issues in 2 files", function() {
            var result = formatter(code);
            assert.equal(result, "<?xml version=\"1.0\" encoding=\"utf-8\"?><jslint><file name=\"foo.js\"><issue line=\"5\" char=\"10\" evidence=\"foo\" reason=\"Unexpected foo. (foo)\" /></file><file name=\"bar.js\"><issue line=\"6\" char=\"11\" evidence=\"bar\" reason=\"Unexpected bar. (bar)\" /></file></jslint>");
        });
    });

    describe("when passing a single message with illegal characters", function() {

        var code = [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected <&\"'> foo.",
                severity: 2,
                line: 5,
                column: 10,
                ruleId: "foo",
                source: "foo"
            }]
        }];

        it("should return a string in JSLint XML format with 1 issue in 1 file", function() {
            var result = formatter(code);
            assert.equal(result, "<?xml version=\"1.0\" encoding=\"utf-8\"?><jslint><file name=\"foo.js\"><issue line=\"5\" char=\"10\" evidence=\"foo\" reason=\"Unexpected &lt;&amp;&quot;&apos;&gt; foo. (foo)\" /></file></jslint>");
        });
    });

    describe("when passing a single message with no source", function() {

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

        it("should return a string in JSLint XML format with 1 issue in 1 file", function() {
            var result = formatter(code);
            assert.equal(result, "<?xml version=\"1.0\" encoding=\"utf-8\"?><jslint><file name=\"foo.js\"><issue line=\"5\" char=\"10\" evidence=\"\" reason=\"Unexpected foo. (foo)\" /></file></jslint>");
        });
    });
});
