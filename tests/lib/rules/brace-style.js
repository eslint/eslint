/**
 * @fileoverview Tests for one-true-brace rule.
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

var RULE_ID = "brace-style";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating function declaration without one true brace style": {

        topic: "function foo() \n { \n return; }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Opening curly brace does not appear on the same line as the block identifier.");
            assert.include(messages[0].node.type, "FunctionDeclaration");
        }
    },

    "when evaluating function declaration with one true brace style": {

        topic: "function foo () { return; }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating if statement without one true brace style": {

        topic: "if (foo) \n { \n bar(); }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Opening curly brace does not appear on the same line as the block identifier.");
            assert.include(messages[0].node.type, "IfStatement");
        }
    },

    "when evaluating if statement with one true brace style": {

        topic: "if (foo) { \n bar(); }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating while statement without one true brace style": {

        topic: "while (foo) \n { \n bar(); }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Opening curly brace does not appear on the same line as the block identifier.");
            assert.include(messages[0].node.type, "WhileStatement");
        }
    },

    "when evaluating while statement with one true brace style": {

        topic: "while (foo) { \n bar(); }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating for statement without one true brace style": {

        topic: "for (;;) \n { \n bar(); }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Opening curly brace does not appear on the same line as the block identifier.");
            assert.include(messages[0].node.type, "ForStatement");
        }
    },

    "when evaluating for statement with one true brace style": {

        topic: "for (;;) { \n bar(); }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating with statement without one true brace style": {

        topic: "with (foo) \n { \n bar(); }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Opening curly brace does not appear on the same line as the block identifier.");
            assert.include(messages[0].node.type, "WithStatement");
        }
    },

    "when evaluating with statement with one true brace style": {

        topic: "with (foo) { \n bar(); }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating switch statement without one true brace style": {

        topic: "switch (foo) \n { \n case \"bar\": break; }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Opening curly brace does not appear on the same line as the block identifier.");
            assert.include(messages[0].node.type, "SwitchStatement");
        }
    },

    "when evaluating switch statement with one true brace style": {

        topic: "switch (foo) { \n case \"bar\": break; }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating try statement without one true brace style": {

        topic: "try \n { \n bar(); \n } catch (e) {}",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Opening curly brace does not appear on the same line as the block identifier.");
            assert.include(messages[0].node.type, "TryStatement");
        }
    },

    "when evaluating try/catch statement with one true brace style": {

        topic: "try { \n bar();\n } catch (e) {\n baz(); \n }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating do/while statement without one true brace style": {

        topic: "do \n { \n bar(); \n} while (true)",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Opening curly brace does not appear on the same line as the block identifier.");
            assert.include(messages[0].node.type, "DoWhileStatement");
        }
    },

    "when evaluating do/while statement with one true brace style": {

        topic: "do { \n bar();\n } while (true)",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating for/in statement without one true brace style": {

        topic: "for (foo in bar) \n { \n baz(); \n }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Opening curly brace does not appear on the same line as the block identifier.");
            assert.include(messages[0].node.type, "ForInStatement");
        }
    },

    "when evaluating for/in statement with one true brace style": {

        topic: "for (foo in bar) { \n baz(); \n }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

}).export(module);
