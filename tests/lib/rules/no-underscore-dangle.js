/**
 * @fileoverview Test for no-underscore-dangle rule
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

var RULE_ID = "no-underscore-dangle";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating a variable declaration with a beginning dangling underscore": {

        topic: "var _foo = 1",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected dangling '_' in '_foo'.");
            assert.include(messages[0].node.type, "VariableDeclarator");
        }
    },

    "when evaluating a variable declaration with an ending dangling underscore": {

        topic: "var foo_ = 1",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected dangling '_' in 'foo_'.");
            assert.include(messages[0].node.type, "VariableDeclarator");
        }
    },

    "when evaluating a function declaration with a beginning dangling underscore": {

        topic: "function _foo() {}",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected dangling '_' in '_foo'.");
            assert.include(messages[0].node.type, "FunctionDeclaration");
        }
    },

    "when evaluating a function declaration with an ending dangling underscore": {

        topic: "function foo_() {}",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected dangling '_' in 'foo_'.");
            assert.include(messages[0].node.type, "FunctionDeclaration");
        }
    },

    "when evaluating a variable declaration with no dangling underscore": {

        topic: "var foo_bar = 1;",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating a function declaration with no dangling underscore": {

        topic: "function foo_bar() {}",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating a variable declaration with property __proto__": {

        topic: "foo.bar.__proto__;",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating a variable declaration with identifier as __proto__": {

        topic: "var __proto__ = 1;",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected dangling '_' in '__proto__'.");
            assert.include(messages[0].node.type, "VariableDeclarator");
        }
    },

    "when evaluating usage of __filename and __dirname": {

        topic: "console.log(__filename); console.log(__dirname);",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating usage of _ library": {

        topic: "var _ = require('underscore');",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating property _": {

        topic: "var a = b._;",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }


}).export(module);