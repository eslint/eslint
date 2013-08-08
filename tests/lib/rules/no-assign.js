/**
 * @fileoverview Tests for no-assign rule.
 * @author Matt DuVall <http://www.mattduvall.com>
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

var RULE_ID = "no-assign";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'if (a=1) {}'": {

        topic: "if (a=1) {}",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected assignment expression.");
            assert.include(messages[0].node.type, "IfStatement");
        }
    },

    "when evaluating 'while (a+=1) {}'": {

        topic: "while (a+=1) {}",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected assignment expression.");
            assert.include(messages[0].node.type, "WhileStatement");
        }
    },

    "when evaluating 'for (;a+=1;) {}'": {

        topic: "for (;a+=1;) {}",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected assignment expression.");
            assert.include(messages[0].node.type, "ForStatement");
        }
    }
}).export(module);