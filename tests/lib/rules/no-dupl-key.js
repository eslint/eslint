/**
 * @fileoverview Tests for no-dupl-key rule.
 * @author Stephen Murray <spmurrayzzz>
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

var RULE_ID = "no-dupl-key";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'var x = { y: 10, y: 20 };'": {

        topic: "var x = { y: 10, y: 20 };",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Duplicate key in object expression.");
            assert.include(messages[0].node.type, "ObjectExpression");
        }
    },

    "when evaluating 'var x = { y: { a: 10, a: 20 } };'": {

        topic: "var x = { y: { a: 10, a: 20 } };",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Duplicate key in object expression.");
            assert.include(messages[0].node.type, "ObjectExpression");
        }
    },

    "when evaluating 'var x = { a: 10, b: 20 };'": {

        topic: "var x = { a: 10, b: 20 };",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var x = { y: { a: 10, b: 20 } };'": {

        topic: "var x = { y: { a: 10, b: 20 } };",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var x = { y: 10 }; x.y = 1;'": {

        topic: "var x = { y: 10 }; x.y = 1;",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }

}).export(module);