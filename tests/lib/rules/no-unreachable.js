/**
 * @fileoverview Tests for no-unreachable rule.
 * @author Joel Feenstra
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
    assert = require("assert"),
    sinon = require("sinon"),
    eslint = require("../../../lib/eslint");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var RULE_ID = "no-unreachable";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluation 'function foo() { return; x = 1; }'": {
        topic: "function foo() { return; x = 1; }",

        "should return a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Found unexpected statement after a return.");
            assert.include(messages[0].node.type, "ExpressionStatement");
        }
    },

    "when evaluation 'function foo() { throw error; x = 1; }'": {
        topic: "function foo() { throw error; x = 1; }",

        "should return a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Found unexpected statement after a throw.");
            assert.include(messages[0].node.type, "ExpressionStatement");
        }
    },

    "when evaluation 'while (true) { break; x = 1; }'": {
        topic: "while (true) { break; x = 1; }",

        "should return a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Found unexpected statement after a break.");
            assert.include(messages[0].node.type, "ExpressionStatement");
        }
    },

    "when evaluation 'while (true) { continue; x = 1; }'": {
        topic: "while (true) { continue; x = 1; }",

        "should return a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Found unexpected statement after a continue.");
            assert.include(messages[0].node.type, "ExpressionStatement");
        }
    },

    "when evaluation 'function foo() { switch (foo) { case 1: return; x = 1; } }'": {
        topic: "function foo() { switch (foo) { case 1: return; x = 1; } }",

        "should return a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Found unexpected statement after a return.");
            assert.include(messages[0].node.type, "ExpressionStatement");
        }
    },

    "when evaluation 'function foo() { switch (foo) { case 1: throw e; x = 1; } }'": {
        topic: "function foo() { switch (foo) { case 1: throw e; x = 1; } }",

        "should return a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Found unexpected statement after a throw.");
            assert.include(messages[0].node.type, "ExpressionStatement");
        }
    },

    "when evaluation 'while (true) { switch (foo) { case 1: break; x = 1; } }'": {
        topic: "while (true) { switch (foo) { case 1: break; x = 1; } }",

        "should return a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Found unexpected statement after a break.");
            assert.include(messages[0].node.type, "ExpressionStatement");
        }
    },

    "when evaluation 'while (true) { switch (foo) { case 1: continue; x = 1; } }'": {
        topic: "while (true) { switch (foo) { case 1: continue; x = 1; } }",

        "should return a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Found unexpected statement after a continue.");
            assert.include(messages[0].node.type, "ExpressionStatement");
        }
    }

}).export(module);

