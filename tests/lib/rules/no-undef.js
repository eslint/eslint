/**
 * @fileoverview Tests for no-undef rule.
 * @author Mark Macdonald
 */
/*global module require*/

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
    assert = require("assert"),
    eslint = require("../../../lib/eslint");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var RULE_ID = "no-undef";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    //------------------------------------------------------------------------------
    // Test undeclared globals
    //------------------------------------------------------------------------------

    "when evaluating write to undeclared global": {
        topic: "a = 1;",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "'a' is not defined.");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating read of undeclared global": {
        topic: "var a = b;",

        "should report a violation (undeclared global)": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "'b' is not defined.");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating reference to variable defined in global scope": {
        topic: "var a = 1, b = 2; a;",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating reference to undeclared global from function scope": {
        topic: "function f() { b; }",

        "should report a violation (undeclared global)": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "'b' is not defined.");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating reference to declared global from function scope": {
        topic: "/*global b*/ function f() { b; }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating references to several declared globals": {
        topic: "/*global b a:false*/  a;  function f() { b; a; }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },


    "when evaluating call to function declared at global scope": {
        topic: "function a(){}  a();",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating reference to parameter": {
        topic: "function f(b) { b; }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    //------------------------------------------------------------------------------
    // Test readonly
    //------------------------------------------------------------------------------

    "when evaluating write to an explicitly declared variable in global scope": {
        topic: "var a; a = 1; a++;",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating write to to an explicitly declared variable in global scope from function scope": {
        topic: "var a; function f() { a = 1; }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating write to a declared writeable global": {
        topic: "/*global b:true*/ b++;",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating write to a declared readonly global": {
        topic: "/*global b:false*/ function f() { b = 1; }",

        "should report a violation (readonly)": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "'b' is read only.");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating read+write to a declared readonly global": {
        topic: "/*global b:false*/ function f() { b++; }",

        "should report a violation (readonly)": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "'b' is read only.");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating write to a declared global that is readonly by default": {
        topic: "/*global b*/ b = 1;",

        "should report a violation (readonly)": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "'b' is read only.");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating write to a redefined global that is readonly": {
        topic: "/*global b:false*/ var b = 1;",

        "should report a violation (readonly)": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "'b' is read only.");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    //------------------------------------------------------------------------------
    // Test browser:true flags
    //------------------------------------------------------------------------------

    "when evaluating reference to a browser global": {
        topic: "window;",

        "should report a violation (undeclared global)": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "'window' is not defined.");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating reference to a browser global with 'jslint browser:true'": {
        topic: "/*jslint browser:true*/ window;",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating reference to a browser global with 'jshint browser:true'": {
        topic: "/*jshint browser:true*/ window;",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating reference to a browser global with 'jshint browser:false'": {
        topic: "/*jshint browser:false*/ window;",

        "should report a violation (undeclared global)": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "'window' is not defined.");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    //------------------------------------------------------------------------------
    // Test node:true flags
    //------------------------------------------------------------------------------
    "when evaluating reference to a node global": {
        topic: "require(\"a\");",

        "should report a violation (undeclared global)": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "'require' is not defined.");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    "when evaluating reference to a node global with 'jshint node:true'": {
        topic: "/*jshint node:true*/ require(\"a\");",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating reference to a node global with 'jshint node:false'": {
        topic: "/*jshint node:false*/ require(\"a\");",

        "should report a violation (undeclared global)": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "'require' is not defined.");
            assert.include(messages[0].node.type, "Identifier");
        }
    },

    //------------------------------------------------------------------------------
    // Test references to builtins
    //------------------------------------------------------------------------------
    "when evaluating reference to a builtin": {
        topic: "Object; isNaN();",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "when evaluating write to a builtin": {
        topic: "Array = 1;",

        "should report a violation (readonly)": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "'Array' is read only.");
            assert.include(messages[0].node.type, "Identifier");
        }
    }

}).export(module);
