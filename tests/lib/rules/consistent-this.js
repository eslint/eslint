/**
 * @fileoverview Tests for consistent-this rule.
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

var RULE_ID = "consistent-this";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'var context = this' with expected name 'that'": {

        topic: "var context = this",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, "that"];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(
                messages[0].message,
                "Unexpected alias 'context' for 'this'."
            );
            assert.include(messages[0].node.type, "VariableDeclaration");
        }
    },

    "when evaluating 'var that = this' with expected name 'self'": {

        topic: "var that = this",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, "self"];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(
                messages[0].message,
                "Unexpected alias 'that' for 'this'."
            );
            assert.include(messages[0].node.type, "VariableDeclaration");
        }
    },

    "when evaluating 'var foo = 42, self = this' with expected name 'that'": {

        topic: "var foo = 42, self = this",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, "that"];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(
                messages[0].message,
                "Unexpected alias 'self' for 'this'."
            );
            assert.include(messages[0].node.type, "VariableDeclaration");
        }
    },

    "when evaluating 'var foo = 42, self = this' with expected name 'self'": {

        topic: "var foo = 42, self = this",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, "self"];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var self = 42' with expected name 'that'": {

        topic: "var self = 42",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, "that"];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var self = 42' with expected name 'self'": {

        topic: "var self = 42",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, "self"];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(
                messages[0].message,
                "Designated 'this' alias 'self' is not assigned " +
                "to the current execution context."
            );
            assert.include(messages[0].node.type, "VariableDeclaration");
        }
    },

    "when evaluating 'var self' with expected name 'that'": {

        topic: "var self",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, "that"];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var self' with expected name 'self'": {

        topic: "var self",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, "self"];

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(
                messages[0].message,
                "Designated 'this' alias 'self' is not assigned " +
                "to the current execution context."
            );
            assert.include(messages[0].node.type, "VariableDeclaration");
        }
    }

}).export(module);
