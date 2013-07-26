/**
 * @fileoverview Tests for no-new-date rule.
 * @author Jacob Gable
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

var RULE_ID = "no-new-date";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({
    "when evaluating new Date()": {
        topic: "var a = new Date();",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "The Date constructor is not timezone friendly.");
            assert.include(messages[0].node.type, "NewExpression");
        }
    },

    "when evaluating new Date(timestamp)": {
        topic: "var a = new Date(14987129487);",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "The Date constructor is not timezone friendly.");
            assert.include(messages[0].node.type, "NewExpression");
        }
    },

    "when evaluating new Date(year, month, date)": {
        topic: "var a = new Date(14987129487);",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "The Date constructor is not timezone friendly.");
            assert.include(messages[0].node.type, "NewExpression");
        }
    },

    "when evaluating new SpecialDate(\"Timezone\", timestamp)": {

        topic: "var a = new SpecialDate(\"America/Chicago\", 12312987124);",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }

}).export(module);
