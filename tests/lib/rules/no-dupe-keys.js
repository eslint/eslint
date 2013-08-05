/**
 * @fileoverview Tests for no-dupe-keys rule.
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

var RULE_ID = "no-dupe-keys";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'var x = { y: 1, y: 2 };'": {

        topic: "var x = { y: 1, y: 2 };",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Duplicate key 'y'.");
            assert.include(messages[0].node.type, "ObjectExpression");
        }
    },

    "when evaluating 'var foo = { 0x1: 1, 1: 2};'": {

        topic: "var foo = { 0x1: 1, 1: 2};",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Duplicate key '1'.");
            assert.include(messages[0].node.type, "ObjectExpression");
        }
    },

    "when evaluating 'var foo = { __proto__: 1, two: 2};'": {

        topic: "var foo = { __proto__: 1, two: 2};",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var x = { \"z\": 1, z: 2 };'": {

        topic: "var x = { \"z\": 1, z: 2 };",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Duplicate key 'z'.");
            assert.include(messages[0].node.type, "ObjectExpression");
        }
    },

    "when evaluating 'var x = { foo: 1, bar: 2 };'": {

        topic: "var x = { foo: 1, bar: 2 };",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }



}).export(module);
