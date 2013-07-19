/**
 * @fileoverview Tests for no-implied-eval rule.
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

var RULE_ID = "no-implied-eval";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'setTimeout(\"x = 1;\");'": {

        topic: "setTimeout(\"x = 1;\");",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Implied eval. Consider passing a function instead of a string.");
            assert.include(messages[0].node.type, "CallExpression");
        }
    },

    "when evaluating 'setTimeout(\"x = 1;\", 100);'": {

        topic: "setTimeout(\"x = 1;\", 100);",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Implied eval. Consider passing a function instead of a string.");
            assert.include(messages[0].node.type, "CallExpression");
        }
    },

    "when evaluating 'setInterval(\"x = 1;\");'": {

        topic: "setInterval(\"x = 1;\");",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Implied eval. Consider passing a function instead of a string.");
            assert.include(messages[0].node.type, "CallExpression");
        }
    },

    "when evaluating 'setInterval(function () { x = 1; }, 100);'": {

        topic: "setInterval(function () { x = 1; }, 100);",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }

}).export(module);
