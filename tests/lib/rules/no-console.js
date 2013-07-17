/**
 * @fileoverview Tests for no-console rule.
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

var RULE_ID = "no-console";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'console.log(foo)'": {

        topic: "console.log(foo)",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected console statement.");
            assert.include(messages[0].node.type, "MemberExpression");
            assert.include(messages[0].node.object.name, "console");
        }
    },

    "when evaluating 'console.error(foo)'": {

        topic: "console.error(foo)",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected console statement.");
            assert.include(messages[0].node.type, "MemberExpression");
            assert.include(messages[0].node.object.name, "console");
        }
    },

    "when evaluating 'console.info(foo)'": {

        topic: "console.info(foo)",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected console statement.");
            assert.include(messages[0].node.type, "MemberExpression");
            assert.include(messages[0].node.object.name, "console");
        }
    },

    "when evaluating 'Console.info(foo)'": {

        topic: "Console.info(foo)",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }




}).export(module);
