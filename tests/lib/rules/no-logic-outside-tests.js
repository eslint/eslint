/**
 * @fileoverview Tests for no-logic-outside-tests rule.
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

var RULE_ID = "no-logic-outside-tests";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({
    "when evaluating 'v && arr.push(v);'": {

        topic: "v && arr.push(v);",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Expected an assignment or function call and instead saw an expression");
            assert.include(messages[0].node.type, "LogicalExpression");
        }
    },

    "when evaluating a string 'if (v && arr.push(v)) { }": {

        topic: "if (v && arr.push(v)) { }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating a string 'while (v && arr.push(v)) { }": {

        topic: "while (v && arr.push(v)) { }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating a string 'for (var v=0; v && arr.push(v); v++) { }": {

        topic: "for (var v=0; v && arr.push(v); v++) { }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating a string 'do {} while (v && arr.push(v))": {

        topic: "do {} while (v && arr.push(v))",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating a string 'var test = v && arr.push(v) ? v : arr[0];": {

        topic: "var test = v && arr.push(v) ? v : arr[0];",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating a string 'if (a && b && c) { alert(a); }": {

        topic: "if (a && b && c) { alert(a); }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    }
}).export(module);
