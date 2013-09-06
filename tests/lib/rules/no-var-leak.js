/**
 * @fileoverview Tests for no-var-leak rule.
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

var RULE_ID = "no-var-leak";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'var x = y = \"example\";'": {

        topic: "var x = y = \"example\";",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "You might be leaking a variable (y) here.");
            assert.include(messages[0].node.type, "AssignmentExpression");
        }
    },

    "when evaluating 'var x = y = z = \"example\";'": {

        topic: "var x = y = z = \"example\";",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "You might be leaking a variable (y) here.");
            assert.include(messages[0].node.type, "AssignmentExpression");
        }
    },

    "when evaluating 'var w = x = y = z = \"example\";'": {

        topic: "var w = x = y = z = \"example\";",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "You might be leaking a variable (x) here.");
            assert.include(messages[0].node.type, "AssignmentExpression");
        }
    },

    "when evaluating 'var w = x = y, q = z = \"example\";'": {

        topic: "var w = x = y, q = z = \"example\";",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 2);

            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "You might be leaking a variable (x) here.");
            assert.include(messages[0].node.type, "AssignmentExpression");

            assert.equal(messages[1].ruleId, RULE_ID);
            assert.equal(messages[1].message, "You might be leaking a variable (z) here.");
            assert.include(messages[1].node.type, "AssignmentExpression");
        }
    },

    "when evaluating 'var x = y.z = \"example\";'": {

        topic: "var x = y.z = \"example\";",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'x = y = \"example\";'": {

        topic: "x = y = \"example\";",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var w = x >= y;'": {

        topic: "var w = x >= y;",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

}).export(module);
