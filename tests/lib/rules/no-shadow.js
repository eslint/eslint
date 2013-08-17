/**
 * @fileoverview Tests for no-shadow rule.
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

var RULE_ID = "no-shadow";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({
    "when evaluating 'var a=3; function b() { var a=10; }": {
        topic: "var a=3; function b() { var a=10; }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "a is already declared in the upper scope.");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating 'var a=3; function b() { var a=10; }; setTimeout(function() { b(); }, 0);": {
        topic: "var a=3; function b() { var a=10; }; setTimeout(function() { b(); }, 0);",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "a is already declared in the upper scope.");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating 'var a=3; function b() { var a=10; var b=0; }; setTimeout(function() { b(); }, 0);": {
        topic: "var a=3; function b() { var a=10; var b=0; }; setTimeout(function() { b(); }, 0);",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 2);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "a is already declared in the upper scope.");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating 'var a=3; function b(a) { a++; return a; }; setTimeout(function() { b(a); }, 0);": {
        topic: "var a=3; function b(a) { a++; return a; }; setTimeout(function() { b(a); }, 0);",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }
}).export(module);
