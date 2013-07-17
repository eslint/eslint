/**
 * @fileoverview Tests for no-alert rule.
 * @author Nicholas C. Zakas
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

var RULE_ID = "no-alert";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when attempting to lint a bracket notation MemberExpression": {
        topic: "a[o.k](1)",

        "should not report violation or crash": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'alert(foo)'": {

        topic: "alert(foo)",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].node.type, "CallExpression");
            assert.include(messages[0].node.callee.name, "alert");
        }
    },

    "when evaluating 'window.alert(foo)'": {

        topic: "window.alert(foo)",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].node.type, "CallExpression");
            assert.include(messages[0].node.callee.property.name, "alert");
        }
    },

    "when evaluating 'confirm(foo)'": {

        topic: "confirm(foo)",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected confirm.");
            assert.include(messages[0].node.type, "CallExpression");
            assert.include(messages[0].node.callee.name, "confirm");
        }
    },

    "when evaluating 'window.confirm(foo)'": {

        topic: "window.confirm(foo)",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected confirm.");
            assert.include(messages[0].node.type, "CallExpression");
            assert.include(messages[0].node.callee.property.name, "confirm");
        }
    },

    "when evaluating 'prompt(foo)'": {

        topic: "prompt(foo)",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected prompt.");
            assert.include(messages[0].node.type, "CallExpression");
            assert.include(messages[0].node.callee.name, "prompt");
        }
    },

    "when evaluating 'window.prompt(foo)'": {

        topic: "window.prompt(foo)",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected prompt.");
            assert.include(messages[0].node.type, "CallExpression");
            assert.include(messages[0].node.callee.property.name, "prompt");
        }
    },

    "when evaluating 'foo.alert(foo)'": {

        topic: "foo.alert(foo)",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'foo.confirm(foo)'": {

        topic: "foo.confirm(foo)",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'foo.prompt(foo)'": {

        topic: "foo.prompt(foo)",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }

}).export(module);
