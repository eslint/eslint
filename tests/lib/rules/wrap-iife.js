/**
 * @fileoverview Tests for wrap-iife rule.
 * @author Ilya Volodin
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

var RULE_ID = "wrap-iife";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'var x = function () { return { y: 1 };}();'": {

        topic: "var x = function () { return { y: 1 };}();",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Wrap an immediate function invocation in parentheses");
            assert.include(messages[0].node.type, "CallExpression");
        }
    },

    "when evaluating 'var x = [function () { return { y: 1 };}()]'": {

        topic: "var x = [function () { return { y: 1 };}()];",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Wrap an immediate function invocation in parentheses");
            assert.include(messages[0].node.type, "CallExpression");
        }
    },

    "when evaluating 'var x = (function () { return { y: 1 };})();'": {

        topic: "var x = (function () { return { y: 1 };})();",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var x = test(function () { return { y: 1 };})();'": {

        topic: "var x = test(function () { return { y: 1 };})();",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }
}).export(module);