/**
 * @fileoverview Tests for no-dangle rule.
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

var RULE_ID = "no-dangle";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating object literal with a dangling comma": {

        topic: "var foo = { bar: \"baz\", }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Found trailing comma in object literal.");
            assert.include(messages[0].node.type, "ObjectExpression");
        }
    },

    "when evaluating object literal passed to a function with a dangling comma": {

        topic: "foo({ bar: \"baz\", qux: \"quux\", });",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Found trailing comma in object literal.");
            assert.include(messages[0].node.type, "ObjectExpression");
        }
    },


    "when evaluating object literal without a dangling comma": {

        topic: "var foo = { bar: \"baz\" }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating array literal with a dangling comma": {

        topic: "var foo = [ \"baz\", ]",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Found trailing comma in object literal.");
            assert.include(messages[0].node.type, "ArrayExpression");
        }
    },

    "when evaluating array literal without a dangling comma": {

        topic: "var foo = [ \"baz\" ]",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }

}).export(module);
