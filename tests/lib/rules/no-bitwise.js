/**
 * @fileoverview Tests for no-bitwise rule.
 * @author Nicholas C. Zakas
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

var RULE_ID = "no-bitwise";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'a ^ b'": {

        topic: "a ^ b",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected use of ^ found.");
            assert.include(messages[0].node.type, "BinaryExpression");
            assert.include(messages[0].node.operator, "^");
        }
    },

    "when evaluating 'a | b": {

        topic: "a | b",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected use of | found.");
            assert.include(messages[0].node.type, "BinaryExpression");
            assert.include(messages[0].node.operator, "|");
        }
    },

    "when evaluating '&": {

        topic: "a & b",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected use of & found.");
            assert.include(messages[0].node.type, "BinaryExpression");
            assert.include(messages[0].node.operator, "&");
        }
    },

    "when evaluating '<<": {

        topic: "a << b",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected use of << found.");
            assert.include(messages[0].node.type, "BinaryExpression");
            assert.include(messages[0].node.operator, "<<");
        }
    },

    "when evaluating '>>": {

        topic: "a >> b",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected use of >> found.");
            assert.include(messages[0].node.type, "BinaryExpression");
            assert.include(messages[0].node.operator, ">>");
        }
    },

    "when evaluating '>>>": {

        topic: "a >>> b",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected use of >>> found.");
            assert.include(messages[0].node.type, "BinaryExpression");
            assert.include(messages[0].node.operator, ">>>");
        }
    },

    "when evaluating '+": {

        topic: "a + b",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating '~": {

        topic: "~a",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected use of ~ found.");
            assert.include(messages[0].node.type, "UnaryExpression");
            assert.include(messages[0].node.operator, "~");
        }
    },

    "when evaluating '!": {

        topic: "!a",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },



}).export(module);
