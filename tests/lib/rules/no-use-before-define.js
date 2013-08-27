/**
 * @fileoverview Tests for no-use-before-define rule.
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

var RULE_ID = "no-use-before-define";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating 'a++; var a=19;'": {

        topic: "a++; var a=19;",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "a was used before it was defined");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating 'a(); var a=function() {};'": {

        topic: "a(); var a=function() {};",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "a was used before it was defined");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating 'alert(a[1]); var a=[1,3]'": {

        topic: "alert(a[1]); var a=[1,3];",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "a was used before it was defined");
            assert.include(messages[0].node.type, "Identifier");
        }
    },    

    "when evaluating 'a(); function a() { alert(b); var b=10; a(); }'": {

        topic: "a(); function a() { alert(b); var b=10; a(); }",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 2);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "a was used before it was defined");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating 'var a=10; alert(a);'": {

        topic: "var a=10; alert(a);",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'function b(a) { alert(a); }'": {

        topic: "function b(a) { alert(a); }",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'Object.hasOwnProperty.call(a);'": {

        topic: "Object.hasOwnProperty.call(a);",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating 'function a() { alert(arguments);}'": {

        topic: "function a() { alert(arguments);}",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    }
}).export(module);
