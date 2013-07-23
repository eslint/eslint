/**
 * @fileoverview Tests for no-obj-calls rule.
 * @author James Allardice
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

var RULE_ID = "no-obj-calls";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'var x = Math();'": {

        topic: "var x = Math();",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "'Math' is not a function.");
            assert.include(messages[0].node.type, "CallExpression");
        }
    },

    "when evaluating 'var x = JSON();'": {

        topic: "var x = JSON();",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "'JSON' is not a function.");
            assert.include(messages[0].node.type, "CallExpression");
        }
    },

    "when evaluating 'var x = Math.random();'": {

        topic: "var x = Math.random();",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }

}).export(module);
