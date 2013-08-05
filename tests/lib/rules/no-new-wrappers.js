/**
 * @fileoverview Tests for no-new-wrappers rule.
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

var RULE_ID = "no-new-wrappers";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'var a = new String(\"hello\")'": {

        topic: "var a = new String('hello');",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Do not use String as a constructor.");
            assert.include(messages[0].node.type, "NewExpression");
        }
    },

    "when evaluating 'var a = new Number(10)'": {

        topic: "var a = new Number(10);",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Do not use Number as a constructor.");
            assert.include(messages[0].node.type, "NewExpression");
        }
    },

    "when evaluating 'var a = new Boolean(false)'": {

        topic: "var a = new Boolean(false);",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Do not use Boolean as a constructor.");
            assert.include(messages[0].node.type, "NewExpression");
        }
    },

    "when evaluating 'var a = new Math()'": {

        topic: "var a = new Math();",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Do not use Math as a constructor.");
            assert.include(messages[0].node.type, "NewExpression");
        }
    },

    "when evaluating 'var a = new JSON({ myProp: 10 })'": {

        topic: "var a = new JSON({ myProp: 10 });",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Do not use JSON as a constructor.");
            assert.include(messages[0].node.type, "NewExpression");
        }
    },

    "when evaluating 'var a = new Object()'": {

        topic: "var a = new Object();",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'var a = String(\"test\"), b = String.fromCharCode(32);": {

        topic: "var a = String('test'), b = String.fromCharCode(32);",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }
}).export(module);
