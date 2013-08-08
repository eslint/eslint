/**
 * @fileoverview Tests for grouped-requires rule.
 * @author Raphael Pigulla
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

var RULE_ID = "grouped-requires";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'var fs = require('fs'), foo = 42'": {

        topic: "var fs = require('fs'), foo = 42",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(
                messages[0].message,
                "Do not mix 'require' and other declarations."
            );
            assert.include(messages[0].node.type, "VariableDeclaration");
        }
    },

    "when evaluating 'var fs = require('fs'), foo'": {

        topic: "var fs = require('fs'), foo",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(
                messages[0].message,
                "Do not mix 'require' and other declarations."
            );
            assert.include(messages[0].node.type, "VariableDeclaration");
        }
    },

    "when evaluating 'var fs = require('f' + 's')'": {

        topic: "var fs = require('f' + 's')",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(
                messages[0].message,
                "Only use string literals as parameters for require()."
            );
            assert.include(messages[0].node.type, "VariableDeclaration");
        },

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, { allowUnknown: true }];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var fs = require(getModuleName())'": {

        topic: "var fs = require(getModuleName())",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, false, false];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(
                messages[0].message,
                "Only use string literals as parameters for require()."
            );
            assert.include(messages[0].node.type, "VariableDeclaration");
        },

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, { allowUnknown: true }];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var fs = require('fs'), foo = require('foo')'": {

        topic: "var fs = require('fs'), foo = require('foo')",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(
                messages[0].message,
                "Do not mix core, module and file requires."
            );
            assert.include(messages[0].node.type, "VariableDeclaration");
        }
    },

    "when evaluating 'var fs = require('fs'), foo = require('./foo')'": {

        topic: "var fs = require('fs'), foo = require('./foo')",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(
                messages[0].message,
                "Do not mix core, module and file requires."
            );
            assert.include(messages[0].node.type, "VariableDeclaration");
        }
    },

    "when evaluating 'var fs = require('foo'), foo = require('./foo')'": {

        topic: "var fs = require('foo'), foo = require('./foo')",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(
                messages[0].message,
                "Do not mix core, module and file requires."
            );
            assert.include(messages[0].node.type, "VariableDeclaration");
        }
    },

    "when evaluating 'var foo = require('foo'), bar = require('bar')'": {

        topic: "var foo = require('foo'), bar = require('bar')",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, { enforceSorted: true }];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(
                messages[0].message,
                "The require statement 'bar' is not sorted alphabetically."
            );
            assert.include(messages[0].node.type, "VariableDeclaration");
        },

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var a = require('a'), b = require('b'), ab = require('a/b')'": {

        topic: "var a = require('a'), b = require('b'), ab = require('a/b')",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, { enforceSorted: true }];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(
                messages[0].message,
                "The require statement 'a/b' is not sorted alphabetically."
            );
            assert.include(messages[0].node.type, "VariableDeclaration");
        },

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var a = require('a'), ab = require('a/b'), foo = require('f' + 'oo'), abb = require('a/b/b')'": {

        topic: "var a = require('a'), ab = require('a/b'), foo = require('f' + 'oo'), abb = require('a/b/b')",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, { enforceSorted: true }];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(
                messages[0].message,
                "Only use string literals as parameters for require()."
            );
            assert.include(messages[0].node.type, "VariableDeclaration");
        },

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, {
                enforceSorted: true,
                allowUnknown: true
            }];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var a = require('a'), b = require('a/b').b'": {

        topic: "var a = require('a'), b = require('a/b').b",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, {
                enforceSorted: true,
                allowUnknown: true
            }];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var util = require('util'), eventEmitter = require('events').EventEmitter'": {

        topic: "var util = require('util'), eventEmitter = require('events').EventEmitter",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, {
                enforceSorted: false,
                allowUnknown: false
            }];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'function x() { var a = require('foo'), b = 42; }'": {

        topic: "function x() { var a = require('foo'), b = 42; }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, { enforceSorted: true, maxDepth: 2 }];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(
                messages[0].message,
                "Do not mix 'require' and other declarations."
            );
            assert.include(messages[0].node.type, "VariableDeclaration");
        },

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, {
                enforceSorted: true,
                allowUnknown: true,
                maxDepth: 1
            }];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }

}).export(module);
