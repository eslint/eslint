/**
 * @fileoverview Tests for no-ternary.
 * @author Ian Christian Myers
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

var RULE_ID = "no-ternary";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating ternary assignment": {

        topic: "var foo = true ? thing : stuff;",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Ternary operator used.");
            assert.include(messages[0].node.type, "ConditionalExpression");
        }
    },

    "when evaluating ternary function call": {

        topic: "true ? thing() : stuff();",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Ternary operator used.");
            assert.include(messages[0].node.type, "ConditionalExpression");
        }
    },

    "when evaluating ternary return statement": {

        topic: "function foo(bar) { return bar ? baz : qux; }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Ternary operator used.");
            assert.include(messages[0].node.type, "ConditionalExpression");
        }
    }

}).export(module);
