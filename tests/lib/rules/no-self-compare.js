/**
 * @fileoverview Tests for no-self-compare rule.
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

var RULE_ID = "no-self-compare";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'if (x===x) { }": {

        topic: "if (x === x) { }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Comparing to itself is potentially pointless");
            assert.include(messages[0].node.type, "BinaryExpression");
        }
    },

    "when evaluating 'if (x!==x) { }": {

        topic: "if (x !== x) { }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Comparing to itself is potentially pointless");
            assert.include(messages[0].node.type, "BinaryExpression");
        }
    },

    "when evaluating 'if (x > x) { }": {

        topic: "if (x > x) { }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Comparing to itself is potentially pointless");
            assert.include(messages[0].node.type, "BinaryExpression");
        }
    },

    "when evaluating 'if (\"x\" > \"x\") { }": {

        topic: "if ('x' > 'x') { }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Comparing to itself is potentially pointless");
            assert.include(messages[0].node.type, "BinaryExpression");
        }
    },

    "when evaluating 'do {} while (x === x)": {

        topic: "do {} while (x === x)",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Comparing to itself is potentially pointless");
            assert.include(messages[0].node.type, "BinaryExpression");
        }
    },

    "when evaluating 'if (x === y) { }": {

        topic: "if (x === y) { }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'if (f() === f()) { }": {

        topic: "if (f() === f()) { }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'if (a[1] === a[1]) { }": {

        topic: "if (a[1] === a[1]) { }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'if (1 === 2) { }": {

        topic: "if (1 === 2) { }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }


}).export(module);