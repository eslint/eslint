/**
 * @fileoverview Tests for options.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
    assert = require("assert"),
    formatter = require("../../../lib/formatters/compact");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe("formatter:compact").addBatch({

    "when passed a message": {

        topic: [{
            message: "Unexpected foo.",
            line: 5,
            column: 10,
            ruleId: "foo"
        }],

        "should return a string in the format filename: line x, col y, Error - z for errors": function(topic) {
            var config = {
                rules: { foo: 2 }
            };

            var result = formatter(topic, "foo.js", config);
            assert.equal("foo.js: line 5, col 10, Error - Unexpected foo.\n\n1 problems", result);
        },

        "should return a string in the format filename: line x, col y, Warning - z for warnings": function(topic) {
            var config = {
                rules: { foo: 1 }
            };

            var result = formatter(topic, "foo.js", config);
            assert.equal("foo.js: line 5, col 10, Warning - Unexpected foo.\n\n1 problems", result);
        }

    },

    "when passed a fatal error message": {

        topic: [{
            fatal: true,
            message: "Unexpected foo.",
            line: 5,
            column: 10,
            ruleId: "foo"
        }],

        "should return a string in the format filename: line x, col y, Error - z": function(topic) {
            var config = {};    // doesn't matter what's in the config for this test

            var result = formatter(topic, "foo.js", config);
            assert.equal("foo.js: line 5, col 10, Error - Unexpected foo.\n\n1 problems", result);
        }
    },

    "when passed multiple messages": {
        topic: [{
            message: "Unexpected foo.",
            line: 5,
            column: 10,
            ruleId: "foo"
        }, {
            message: "Unexpected bar.",
            line: 6,
            column: 11,
            ruleId: "bar"

        }],

        "should return a string with multiple entries": function(topic) {
            var config = {
                rules: { foo: 2, bar: 1 }
            };

            var result = formatter(topic, "foo.js", config);
            assert.equal("foo.js: line 5, col 10, Error - Unexpected foo.\nfoo.js: line 6, col 11, Warning - Unexpected bar.\n\n2 problems", result);
        }

    }

}).export(module);
