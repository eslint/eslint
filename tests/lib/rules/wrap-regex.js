/**
 * @fileoverview Tests for wrap-regex rule.
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

var RULE_ID = "wrap-regex";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'var f = function() { return /foo/.test(bar); };'": {

        topic: "var f = function() { return /foo/.test(bar); };",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Wrap the /regexp/ literal in parens to disambiguate the slash operator.");
            assert.include(messages[0].node.type, "Literal");
        }
    },

    "when evaluating 'var f = function() { return /foo/ig.test(bar); };'": {

        topic: "var f = function() { return /foo/ig.test(bar); };",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Wrap the /regexp/ literal in parens to disambiguate the slash operator.");
            assert.include(messages[0].node.type, "Literal");
        }
    },

    "when evaluating 'var f = function() { return (/foo/).test(bar); };'": {

        topic: "var f = function() { return (/foo/).test(bar); };",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },


    "when evaluating 'var f = function() { return (/foo/ig).test(bar); };'": {

        topic: "var f = function() { return (/foo/ig).test(bar); };",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var f = function() { return /foo/; };'": {

        topic: "var f = function() { return /foo/; };",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }
}).export(module);

