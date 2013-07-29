/**
 * @fileoverview Tests for curly rule.
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

var RULE_ID = "curly";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'if (foo) bar()'": {

        topic: "if (foo) bar()",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Expected { after 'if' condition.");
            assert.include(messages[0].node.type, "IfStatement");
        }
    },

    "when evaluating 'if (foo) { bar() }'": {

        topic: "if (foo) { bar() }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'if (foo) { bar() } else baz()'": {

        topic: "if (foo) { bar() } else baz()",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Expected { after 'else'.");
            assert.include(messages[0].node.type, "IfStatement");
        }
    },

    "when evaluating 'if (foo) { bar() } else if (foo2) { baz() }'": {

        topic: "if (foo) { bar() } else if (foo2) { baz() }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },


    "when evaluating 'while (foo) bar()'": {

        topic: "while (foo) bar()",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Expected { after 'while' condition.");
            assert.include(messages[0].node.type, "WhileStatement");
        }
    },

    "when evaluating 'while (foo) { bar() }'": {

        topic: "while (foo) { bar() }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'do bar(); while (foo)'": {

        topic: "do bar(); while (foo)",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Expected { after 'do'.");
            assert.include(messages[0].node.type, "DoWhileStatement");
        }
    },

    "when evaluating 'do { bar(); } while (foo)'": {

        topic: "do { bar(); } while (foo)",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'for (;foo;) bar()'": {

        topic: "for (;foo;) bar()",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Expected { after 'for' condition.");
            assert.include(messages[0].node.type, "ForStatement");
        }
    },

    "when evaluating 'for (;foo;) { bar() }'": {

        topic: "for (;foo;) { bar() }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }

}).export(module);
