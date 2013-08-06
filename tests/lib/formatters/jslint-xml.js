/**
 * @fileoverview Tests for JSLint XML reporter.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
    assert = require("assert"),
    formatter = require("../../../lib/formatters/jslint-xml");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe("formatter:jslint-xml").addBatch({

    "when passed a single message": {

        topic: [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                line: 5,
                column: 10,
                ruleId: "foo",
                source: "foo"
            }]
        }],

        "should return a string in JSLint XML format with 1 issue in 1 file": function(topic) {
            var config = {
                rules: { foo: 2 }
            };

            var result = formatter(topic, config);
            assert.equal("<?xml version=\"1.0\" encoding=\"utf-8\"?><jslint><file name=\"foo.js\"><issue line=\"5\" char=\"10\" evidence=\"foo\" reason=\"Unexpected foo.\" /></file></jslint>", result);
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
                ruleId: "foo",
                source: "foo"
            }]
        }],

        "should return a string in JSLint XML format with 1 issue in 1 file": function(topic) {
            var config = {};    // doesn't matter what's in the config for this test

            var result = formatter(topic, config);
            assert.equal("<?xml version=\"1.0\" encoding=\"utf-8\"?><jslint><file name=\"foo.js\"><issue line=\"5\" char=\"10\" evidence=\"foo\" reason=\"Unexpected foo.\" /></file></jslint>", result);
        }
    },

    "when passed multiple messages": {
        topic: [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                line: 5,
                column: 10,
                ruleId: "foo",
                source: "foo"
            }, {
                message: "Unexpected bar.",
                line: 6,
                column: 11,
                ruleId: "bar",
                source: "bar"
            }]
        }],

        "should return a string in JSLint XML format with 2 issues in 1 file": function(topic) {
            var config = {
                rules: { foo: 2, bar: 1 }
            };

            var result = formatter(topic, config);
            assert.equal("<?xml version=\"1.0\" encoding=\"utf-8\"?><jslint><file name=\"foo.js\"><issue line=\"5\" char=\"10\" evidence=\"foo\" reason=\"Unexpected foo.\" /><issue line=\"6\" char=\"11\" evidence=\"bar\" reason=\"Unexpected bar.\" /></file></jslint>", result);
        }

    },

    "when passed multiple files with 1 message each": {
        topic: [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                line: 5,
                column: 10,
                ruleId: "foo",
                source: "foo"
            }]
        }, {
            filePath: "bar.js",
            messages: [{
                message: "Unexpected bar.",
                line: 6,
                column: 11,
                ruleId: "bar",
                source: "bar"
            }]
        }],

        "should return a string in JSLint XML format with 2 issues in 2 files": function(topic) {
            var config = {
                rules: { foo: 2, bar: 1 }
            };

            var result = formatter(topic, config);
            assert.equal("<?xml version=\"1.0\" encoding=\"utf-8\"?><jslint><file name=\"foo.js\"><issue line=\"5\" char=\"10\" evidence=\"foo\" reason=\"Unexpected foo.\" /></file><file name=\"bar.js\"><issue line=\"6\" char=\"11\" evidence=\"bar\" reason=\"Unexpected bar.\" /></file></jslint>", result);
        }
    }

    }).export(module);
