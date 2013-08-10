/**
 * @fileoverview Tests for checkstyle reporter.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
    assert = require("assert"),
    formatter = require("../../../lib/formatters/checkstyle");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe("formatter:checkstyle").addBatch({

    "when passed a single message": {

        topic: [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }],

        "should return a string in the format filename: line x, col y, Error - z for errors": function(topic) {
            var config = {
                rules: { foo: 2 }
            };

            var result = formatter(topic, config);
            assert.equal("<?xml version=\"1.0\" encoding=\"utf-8\"?><checkstyle version=\"4.3\"><file name=\"foo.js\"><error line=\"5\" column=\"10\" severity=\"error\" message=\"Unexpected foo.\" /></file></checkstyle>", result);
        },

        "should return a string in the format filename: line x, col y, Warning - z for warnings": function(topic) {
            var config = {
                rules: { foo: 1 }
            };

            var result = formatter(topic, config);
            assert.equal("<?xml version=\"1.0\" encoding=\"utf-8\"?><checkstyle version=\"4.3\"><file name=\"foo.js\"><error line=\"5\" column=\"10\" severity=\"warning\" message=\"Unexpected foo.\" /></file></checkstyle>", result);
        },

        "should return a string in the format filename: line x, col y, Error - z for errors with options config": function(topic) {
            var config = {
                rules: { foo: [2, "option"] }
            };

            var result = formatter(topic, config);
            assert.equal("<?xml version=\"1.0\" encoding=\"utf-8\"?><checkstyle version=\"4.3\"><file name=\"foo.js\"><error line=\"5\" column=\"10\" severity=\"error\" message=\"Unexpected foo.\" /></file></checkstyle>", result);
        }
    },

    "when passed a fatal error message": {

        topic: [{
            filePath: "foo.js",
            messages: [{
                fatal: true,
                message: "Unexpected foo.",
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }],

        "should return a string in the format filename: line x, col y, Error - z": function(topic) {
            var config = {};    // doesn't matter what's in the config for this test

            var result = formatter(topic, config);
            assert.equal("<?xml version=\"1.0\" encoding=\"utf-8\"?><checkstyle version=\"4.3\"><file name=\"foo.js\"><error line=\"5\" column=\"10\" severity=\"error\" message=\"Unexpected foo.\" /></file></checkstyle>", result);
        }
    },

    "when passed multiple messages": {
        topic: [{
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
        }],

        "should return a string with multiple entries": function(topic) {
            var config = {
                rules: { foo: 2, bar: 1 }
            };

            var result = formatter(topic, config);
            assert.equal("<?xml version=\"1.0\" encoding=\"utf-8\"?><checkstyle version=\"4.3\"><file name=\"foo.js\"><error line=\"5\" column=\"10\" severity=\"error\" message=\"Unexpected foo.\" /><error line=\"6\" column=\"11\" severity=\"warning\" message=\"Unexpected bar.\" /></file></checkstyle>", result);
        }

    },

    "when passed multiple files with 1 message each": {
        topic: [{
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
        }],

        "should return a string with multiple entries": function(topic) {
            var config = {
                rules: { foo: 2, bar: 1 }
            };

            var result = formatter(topic, config);
            assert.equal("<?xml version=\"1.0\" encoding=\"utf-8\"?><checkstyle version=\"4.3\"><file name=\"foo.js\"><error line=\"5\" column=\"10\" severity=\"error\" message=\"Unexpected foo.\" /></file><file name=\"bar.js\"><error line=\"6\" column=\"11\" severity=\"warning\" message=\"Unexpected bar.\" /></file></checkstyle>", result);
        }
    }

    }).export(module);
