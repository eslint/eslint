/**
 * @fileoverview Tests for no-loop-func rule.
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

var RULE_ID = "no-loop-func";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({
    "when evaluating 'for (var i=0; i<l; i++) { (function() {}) }'": {
        topic: "for (var i=0; i<l; i++) { (function() {}) }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Don't make functions within a loop");
            assert.include(messages[0].node.type, "FunctionExpression");
        }
    },

    "when evaluating 'for (var i=0; i<l; i++) { var a = function() {} }'": {
        topic: "for (var i=0; i<l; i++) { var a = function() {} }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Don't make functions within a loop");
            assert.include(messages[0].node.type, "FunctionExpression");
        }
    },

    "when evaluating 'for (var i=0; i<l; i++) { function a() {}; a(); }'": {
        topic: "for (var i=0; i<l; i++) { function a() {}; a(); }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Don't make functions within a loop");
            assert.include(messages[0].node.type, "FunctionDeclaration");
        }
    },

    "when evaluating 'while(i) { (function() {}) }'": {
        topic: "while(i) { (function() {}) }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Don't make functions within a loop");
            assert.include(messages[0].node.type, "FunctionExpression");
        }
    },

    "when evaluating 'do { (function() {}) } while (i)'": {
        topic: "do { (function() {}) } while (i)",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "Don't make functions within a loop");
            assert.include(messages[0].node.type, "FunctionExpression");
        }
    },


    "when evaluating 'function a() {}'": {

        topic: "string = 'function a() {}';",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'for (var i=0; i<l; i++) { } var a = function() { };'": {
        topic: "for (var i=0; i<l; i++) { } var a = function() { };",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    }
}).export(module);
