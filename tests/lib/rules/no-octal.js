/**
 * @fileoverview Tests for no-octal rule.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
    assert = require("assert"),
    eslint = require("../../../lib/eslint");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var RULE_ID = "no-octal";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({
    "when evaluating a string": {
        topic: "var a = 'hello world';",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var a = 01234'": {

        topic: "var a = 01234;",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Octal literals should not be used.");
            assert.include(messages[0].node.type, "Literal");
        }
    },

    "when evaluating 'var a = 0x1234'": {

        topic: "var a = 0x1234;",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'a = 1 + 01234'": {

        topic: "a = 1 + 01234;",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Octal literals should not be used.");
            assert.include(messages[0].node.type, "Literal");
        }
    },
}).export(module);
