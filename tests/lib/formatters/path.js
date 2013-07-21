/**
 * @fileoverview Tests for path formatter.
 * @author Bart van der Schoor
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
    assert = require("assert"),
    sinon = require("sinon"),
    path = require("path"),
    formatter = require("../../../lib/formatters/path");

var debugWhiteSpace = function(str) {
    return str.replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t").replace(/ /g, "\\s");
};

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe("formatter:path").addBatch({

    "when passed a simple message": {

        topic: [{
            filePath: "foo.js",
            messages: [{
                filePath: "foo.js",
                message: "Unexpected foo.",
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }],

        "should return a string in the format ERROR at filePath[line,col]\\n[ruleId] message": function(topic) {
            var config = {
                rules: { foo: 2 }
            };

            var result = formatter(topic, config);
            assert.equal(">> foo.js\nERROR at " + path.resolve("foo.js") + "[5,10]\n[foo] Unexpected foo.\n\n1 problem", result);
        },

        "should return a string in the format WARNING at filePath[line,col]\\n[ruleId] message": function(topic) {
            var config = {
                rules: { foo: 1 }
            };

            var result = formatter(topic, config);
            assert.equal(">> foo.js\nWARNING at " + path.resolve("foo.js") + "[5,10]\n[foo] Unexpected foo.\n\n1 problem", result);
        }

    },

    "when passed a fatal error message with filePath": {

        topic: [{
            filePath: "foo.js",
            messages: [{
                filePath: "foo.js",
                fatal: true,
                message: "Unexpected foo.",
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }],

        "should return a string in the format ERROR at filePath[line,col]\\n[ruleId] message": function(topic) {
            var config = {};    // doesn't matter what's in the config for this test

            var result = formatter(topic, config);
            assert.equal(">> foo.js\nERROR at " + path.resolve("foo.js") + "[5,10]\n[foo] Unexpected foo.\n\n1 problem", result);
        }
    },

    "when passed multiple messages with filePath": {
        topic: [{
            filePath: "path/to/foo.js",
            messages: [{
                message: "Unexpected foo.",
                filePath: "path/to/foo.js",
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }, {
            filePath: "path/for/bar.js",
            messages: [{
                message: "Unexpected bar.",
                filePath: "path/for/bar.js",
                line: 6,
                column: 11,
                ruleId: "bar"
            }]
        }],

        "should return a string with multiple formatted entries": function(topic) {
            var config = {
                rules: { foo: 2, bar: 1 }
            };

            var result = formatter(topic, config);

            var foo = 'path/to/foo.js';
            var bar = 'path/for/bar.js';
            var expected = ">> " + foo + "\nERROR at " + path.resolve(foo) + "[5,10]\n[foo] Unexpected foo."
            expected += "\n\n>> " + bar + "\nWARNING at " + path.resolve(bar) + "[6,11]\n[bar] Unexpected bar.\n\n2 problems"

            assert.equal(debugWhiteSpace(expected), debugWhiteSpace(result));
            assert.equal(expected.length, result.length);
        }

    }

}).export(module);
