/**
 * @fileoverview Tests for no-redeclare rule.
 * @author Ilya Volodin
 */

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

var RULE_ID = "no-redeclare";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'var a = 3; var a = 10;'": {

        topic: "var a = 3; var a = 10;",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "a is already defined");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating 'var a = {}; var a = [];'": {

        topic: "var a = {}; var a = [];",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "a is already defined");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating 'var a = function() { }; var a = function() { }'": {

        topic: "var a = function() { }; var a = function() { }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "a is already defined");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating 'var a = function() { }; var a = new Date();'": {

        topic: "var a = function() { }; var a = new Date();",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "a is already defined");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating 'var a = 3; var a = 10; var a = 15;'": {

        topic: "var a = 3; var a = 10; var a = 15;",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 2);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "a is already defined");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating 'var a = 3; var b = function() { var a = 10; };'": {

        topic: "var a = 3; var b = function() { var a = 10; };",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var a = 3; a = 10;'": {

        topic: "var a = 3; a = 10;",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }
}).export(module);
