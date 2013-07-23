/**
 * @fileoverview Tests for semi rule.
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

var RULE_ID = "semi";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'var x = 5'": {

        topic: "var x = 5",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Missing semicolon.");
            assert.include(messages[0].node.type, "VariableDeclaration");
        }
    },

    "when evaluating 'var x = 5, y'": {

        topic: "var x = 5, y",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Missing semicolon.");
            assert.include(messages[0].node.type, "VariableDeclaration");
        }
    },

    "when evaluating 'foo()'": {

        topic: "foo()",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Missing semicolon.");
            assert.include(messages[0].node.type, "ExpressionStatement");
        }
    },

    "when evaluating 'x = foo()'": {

        topic: "x = foo()",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Missing semicolon.");
            assert.include(messages[0].node.type, "ExpressionStatement");
        }
    },

    "when evaluating 'var x = 5;'": {

        topic: "var x = 5;",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var x = 5, y;'": {

        topic: "var x = 5, y;",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'foo();'": {

        topic: "foo();",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'x = foo();'": {

        topic: "x = foo();",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluation 'setTimeout(function() {foo = \"bar\"; });'": {

        topic: "setTimeout(function() {foo = \"bar\"; });",

        "should not report and violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }

    },

    "when evaluation 'setTimeout(function() {foo = \"bar\";});'": {

        topic: "setTimeout(function() {foo = \"bar\";});",

        "should not report and violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }

    }

}).export(module);
