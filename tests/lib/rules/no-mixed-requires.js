/**
 * @fileoverview Tests for the no-mixed-requires rule.
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

var RULE_ID = "no-mixed-requires";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ERR_MIXED_DECL = "Do not mix 'require' and other declarations.",
    ERR_MIXED_REQ = "Do not mix core, module, file and computed requires.";

vows.describe(RULE_ID).addBatch({
    "when evaluating 'var a, b = 42, c = doStuff()'": {

        topic: "var a, b = 42, c = doStuff()",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, false];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var fs = require('fs'), foo = 42'": {

        topic: "var fs = require('fs'), foo = 42",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, false];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, ERR_MIXED_DECL);
            assert.include(messages[0].node.type, "VariableDeclaration");
        }
    },

    "when evaluating 'var fs = require('fs'), foo'": {

        topic: "var fs = require('fs'), foo",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, false];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, ERR_MIXED_DECL);
            assert.include(messages[0].node.type, "VariableDeclaration");
        }
    },

    "when evaluating 'var a = require(42), b = require(), c = require('y'), d = require(doStuff())'": {

        topic: "var a = require(42), b = require(), c = require('y'), d = require(doStuff())",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, false];

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        },

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, true];

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, ERR_MIXED_REQ);
            assert.include(messages[0].node.type, "VariableDeclaration");
        }
    },

    "when evaluating 'var fs = require('fs'), foo = require('foo')'": {

        topic: "var fs = require('fs'), foo = require('foo')",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, true];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, ERR_MIXED_REQ);
            assert.include(messages[0].node.type, "VariableDeclaration");
        },

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, false];

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var exec = require('child_process').exec, foo = require('foo')'": {

        topic: "var exec = require('child_process').exec, foo = require('foo')",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, true];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, ERR_MIXED_REQ);
            assert.include(messages[0].node.type, "VariableDeclaration");
        },

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, false];

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var fs = require('fs'), foo = require('./foo')'": {

        topic: "var fs = require('fs'), foo = require('./foo')",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, true];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, ERR_MIXED_REQ);
            assert.include(messages[0].node.type, "VariableDeclaration");
        },


        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, false];

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var foo = require('foo'), foo2 = require('./foo')'": {

        topic: "var foo = require('foo'), foo2 = require('./foo')",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, true];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, ERR_MIXED_REQ);
            assert.include(messages[0].node.type, "VariableDeclaration");
        },

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, false];

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var emitter = require('events').EventEmitter, fs = require('fs')'": {

        topic: "var emitter = require('events').EventEmitter, fs = require('fs')",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, false];

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var foo = require(42), bar = require(getName())'": {

        topic: "var foo = require(42), bar = require(getName())",

        "should not report a violation (grouping off)": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, false];

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        },

        "should not report a violation (grouping on)": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, true];

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var foo = require('foo'), bar = require(getName())'": {

        topic: "var foo = require('foo'), bar = require(getName())",

        "should report a violation (grouping on)": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, true];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, ERR_MIXED_REQ);
            assert.include(messages[0].node.type, "VariableDeclaration");
        },

        "should not report a violation (grouping off)": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, false];

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    }
}).export(module);
