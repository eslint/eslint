/**
 * @fileoverview Tests for one-var.
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

var RULE_ID = "one-var";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "multiple VariableDeclarations in a FunctionDeclaration": {

        topic: "function foo() { var bar = true; var baz = false; }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Combine this with the previous 'var' statement.");
            assert.include(messages[0].node.type, "VariableDeclaration");
        }
    },

    "single variable declaration in a FunctionDeclaration": {

        topic: "function foo() { var bar = true; }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "single VariableDeclaration with multiple declarations in a FunctionDeclaration": {

        topic: "function foo() { var bar = true, baz = 1; if (qux) { bar = false; } }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "multiple VariableDeclarations nested in an IfStatement in a FunctionDeclaration": {

        topic: "function foo() { var bar = true; if (qux) { var baz = false; } else { var quxx = 42; } }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 2);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Combine this with the previous 'var' statement.");
            assert.include(messages[0].node.type, "VariableDeclaration");
        }
    },

    "multiple VariableDeclarations in a FunctionExpression": {

        topic: "var foo = function () { var bar = true; var baz = false; }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Combine this with the previous 'var' statement.");
            assert.include(messages[0].node.type, "VariableDeclaration");
        }
    },

    "single VariableDeclaration in a FunctionExpression": {

        topic: "var foo = function () { var bar = true; baz(); }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "multiple VariableDeclarations nested in an IfStatement in a FunctionExpression": {

        topic: "var foo = function () { var bar = true; if (qux) { var baz = false; } }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Combine this with the previous 'var' statement.");
            assert.include(messages[0].node.type, "VariableDeclaration");
        }
    },

    "multiple VariableDeclarations the global scope": {

        topic: "var foo; var bar;",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Combine this with the previous 'var' statement.");
            assert.include(messages[0].node.type, "VariableDeclaration");
        }
    }

}).export(module);
