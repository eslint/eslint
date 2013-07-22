/**
 * @fileoverview Tests for no-unreachable rule.
 * @author Joel Feenstra
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

var RULE_ID = "no-unreachable";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating a function which contains a function": {
        topic: "function foo() { function bar() { return 1; } return bar(); }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating a function with no return": {
        topic: "function foo() { var x = 1; var y = 2; }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating a function with return at end": {
        topic: "function foo() { var x = 1; var y = 2; return; }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'function foo() { return; x = 1; }'": {
        topic: "function foo() { return; x = 1; }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Found unexpected statement after a return.");
            assert.include(messages[0].node.type, "ExpressionStatement");
        }
    },

    "when evaluating 'function foo() { throw error; x = 1; }'": {
        topic: "function foo() { throw error; x = 1; }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Found unexpected statement after a throw.");
            assert.include(messages[0].node.type, "ExpressionStatement");
        }
    },

    "when evaluating 'while (true) { break; x = 1; }'": {
        topic: "while (true) { break; x = 1; }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Found unexpected statement after a break.");
            assert.include(messages[0].node.type, "ExpressionStatement");
        }
    },

    "when evaluating 'while (true) { continue; x = 1; }'": {
        topic: "while (true) { continue; x = 1; }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Found unexpected statement after a continue.");
            assert.include(messages[0].node.type, "ExpressionStatement");
        }
    },

    "when evaluating 'function foo() { switch (foo) { case 1: return; x = 1; } }'": {
        topic: "function foo() { switch (foo) { case 1: return; x = 1; } }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Found unexpected statement after a return.");
            assert.include(messages[0].node.type, "ExpressionStatement");
        }
    },

    "when evaluating 'function foo() { switch (foo) { case 1: throw e; x = 1; } }'": {
        topic: "function foo() { switch (foo) { case 1: throw e; x = 1; } }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Found unexpected statement after a throw.");
            assert.include(messages[0].node.type, "ExpressionStatement");
        }
    },

    "when evaluating 'while (true) { switch (foo) { case 1: break; x = 1; } }'": {
        topic: "while (true) { switch (foo) { case 1: break; x = 1; } }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Found unexpected statement after a break.");
            assert.include(messages[0].node.type, "ExpressionStatement");
        }
    },

    "when evaluating 'while (true) { switch (foo) { case 1: continue; x = 1; } }'": {
        topic: "while (true) { switch (foo) { case 1: continue; x = 1; } }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Found unexpected statement after a continue.");
            assert.include(messages[0].node.type, "ExpressionStatement");
        }
    },

    "when evaluating 'while (true) { switch (foo) { case 1: x = 1; } }'": {
        topic: "while (true) { switch (foo) { case 1: x = 1; x = 2;} }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }


}).export(module);

