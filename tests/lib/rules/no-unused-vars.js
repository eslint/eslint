/**
 * @fileoverview Tests for no-unused-vars rule.
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

var RULE_ID = "no-unused-vars";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({
    "when evaluating 'var a=10;'": {

        topic: "var a=10;",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "a is defined but never used");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating a string 'var a=10; a=20;'": {

        topic: "var a=10; a=20;",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "a is defined but never used");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating a string 'var a=10; alert(a);'": {

        topic: "var a=10; alert(a);",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating a string 'var a=10; (function() { alert(a); })()'": {

        topic: "var a=10; (function() { alert(a); })();",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating a string 'var a=10; (function() { setTimeout(function() { alert(a); }, 0); })()'": {

        topic: "var a=10; (function() { setTimeout(function() { alert(a); }, 0); })();",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating a string 'var a=10; (function() { var a = 1; alert(a); })()'": {

        topic: "var a=10; (function() { var a = 1; alert(a); })();",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "a is defined but never used");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating a string 'var a=10, b=0, c=null; alert(a+b)": {

        topic: "var a=10, b=0, c=null; alert(a+b)",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "c is defined but never used");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating a string 'var a=10, b=0, c=null; setTimeout(function() { var b=2; alert(a+b+c); }, 0);": {

        topic: "var a=10, b=0, c=null; setTimeout(function() { var b=2; alert(a+b+c); }, 0);",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "b is defined but never used");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating a string 'var a=10, b=0, c=null; setTimeout(function() { var b=2; var c=2; alert(a+b+c); }, 0);": {

        topic: "var a=10, b=0, c=null; setTimeout(function() { var b=2; var c=2; alert(a+b+c); }, 0);",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 2);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "b is defined but never used");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating a string 'var a=10; d[a] = 0;": {

        topic: "var a=10; d[a] = 0;",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating a string '(function() { var a=10; return a; })();": {

        topic: "(function() { var a=10; return a; })();",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating a string 'function f(){var a=[];return a.map(function(){});}'": {
        topic: [
            "function f() {",
            "    var a = [];",
            "    return a.map(function() {});",
            "}"
        ].join("\n"),

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "f is defined but never used");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating a string 'function f(){var a=[];return a.map(function g(){});}'": {
        topic: [
            "function f() {",
            "    var a = [];",
            "    return a.map(function g() {});",
            "}"
        ].join("\n"),

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "f is defined but never used");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating a string '(function g() {})()'": {
        topic: "(function g() {})()",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating a string 'function f(){var x;function a(){x=42;}function b(){alert(x);}}'": {
        topic: [
            "function f() {",
            "   var x;",
            "   function a() { x = 42; }",
            "   function b() { alert(x); }",
            "}"
        ].join("\n"),

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 4);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "f is defined but never used");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating a string 'function f(a){}; f();'": {
        topic:  "function f(a) {}; f();",

        "should report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "a is defined but never used");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating a string 'function f(a){alert(a);}; f();'": {
        topic:  "function f(a) {alert(a);}; f();",

        "should not report a violation": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = 1;
            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    }
}).export(module);
