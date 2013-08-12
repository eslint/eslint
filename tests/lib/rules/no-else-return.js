/**
 * @fileoverview Tests for no-else-return rule.
 * @author Ian Christian Myers
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

var RULE_ID = "no-else-return";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'function foo() { if (true) { return x; } else { return y; } }": {

        topic: "function foo() { if (true) { return x; } else { return y; } }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected 'else' after 'return'​.");
            assert.include(messages[0].node.type, "BlockStatement");
        }
    },

    "when evaluating 'function foo() { if (true) { if (false) { return x; } } else { return y; } }": {

        topic: "function foo() { if (true) { if (false) { return x; } } else { return y; } }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'function foo() { if (true) { return x; } return y; }": {

        topic: "function foo() { if (true) { return x; } return y; }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'function foo() { if (true) { var x = bar; return x; } else { var y = baz; return y; } }": {

        topic: "function foo() { if (true) { var x = bar; return x; } else { var y = baz; return y; } }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected 'else' after 'return'​.");
            assert.include(messages[0].node.type, "BlockStatement");
        }
    },

    "when evaluating 'function foo() { if (true) return x; else return y; }": {

        topic: "function foo() { if (true) return x; else return y; }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Unexpected 'else' after 'return'​.");
            assert.include(messages[0].node.type, "ReturnStatement");
        }
    },

    "when evaluating 'function foo() { if (true) { for (;;) { return x; } } else { return y; } }": {

        topic: "function foo() { if (true) { for (;;) { return x; } } else { return y; } }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'function foo() { if (true) notAReturn(); else return y; }": {

        topic: "function foo() { if (true) notAReturn(); else return y; }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    }


}).export(module);
