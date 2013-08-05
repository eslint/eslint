/**
 * @fileoverview Tests for eslint object.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
    assert = require("assert"),
    sinon = require("sinon"),
    eslint = require("../../lib/eslint");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var TEST_CODE = "var answer = 6 * 7;";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function getVariable(scope, name) {
    var variable = null;
    scope.variables.some(function(v) {
        if (v.name === name) {
            variable = v;
            return true;
        }
        return false;
    });
    return variable;
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe("eslint").addBatch({

    "when using events": {

        topic: TEST_CODE,

        "an error should be thrown when an error occurs inside of an event handler": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                throw new Error("Intentional error.");
            });

            assert.throws(function() {
                eslint.verify(topic, config, true);
            }, Error);

        }

    },

    "when calling toSource()": {

        topic: TEST_CODE,

        "should retrieve all text when used without parameters": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var source = eslint.getSource();
                assert.equal(source, TEST_CODE);
            });

            eslint.verify(topic, config, true);
        },

        "should retrieve all text for root node": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function(node) {
                var source = eslint.getSource(node);
                assert.equal(source, TEST_CODE);
            });

            eslint.verify(topic, config, true);
        },

        "should retrieve all text for binary expression": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var source = eslint.getSource(node);
                assert.equal(source, "6 * 7");
            });

            eslint.verify(topic, config, true);
        },

        "should retrieve all text plus two characters before for binary expression": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var source = eslint.getSource(node, 2);
                assert.equal(source, "= 6 * 7");
            });

            eslint.verify(topic, config, true);
        },

        "should retrieve all text plus one character after for binary expression": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var source = eslint.getSource(node, 0, 1);
                assert.equal(source, "6 * 7;");
            });

            eslint.verify(topic, config, true);
        },

        "should retrieve all text plus two characters before and one character after for binary expression": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var source = eslint.getSource(node, 2, 1);
                assert.equal(source, "= 6 * 7;");
            });

            eslint.verify(topic, config, true);
        }
    },

    "when calling getTokens": {

        topic: TEST_CODE,

        "should retrieve all tokens when used without parameters": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function(node) {
                var tokens = eslint.getTokens();
                assert.equal(tokens.length, 7);
            });

            eslint.verify(topic, config, true);
        },

        "should retrieve all tokens for root node": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function(node) {
                var tokens = eslint.getTokens(node);
                assert.equal(tokens.length, 7);
            });

            eslint.verify(topic, config, true);
        },

        "should retrieve all tokens for binary expression": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getTokens(node);
                assert.equal(tokens.length, 3);
            });

            eslint.verify(topic, config, true);
        },

        "should retrieve all tokens plus equals sign for binary expression": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getTokens(node, 2);
                assert.equal(tokens.length, 4);
            });

            eslint.verify(topic, config, true);
        },

        "should retrieve all tokens plus one character after for binary expression": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getTokens(node, 0, 1);
                assert.equal(tokens.length, 4);
            });

            eslint.verify(topic, config, true);
        },

        "should retrieve all tokens plus two characters before and one character after for binary expression": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getTokens(node, 2, 1);
                assert.equal(tokens.length, 5);
            });

            eslint.verify(topic, config, true);
        }
    },

    "when calling getAncestors": {

        topic: TEST_CODE,

        "should retrieve all ancestors when used": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var ancestors = eslint.getAncestors();
                assert.equal(ancestors.length, 3);
            });

            eslint.verify(topic, config, true);
        },

        "should retrieve empty ancestors for root node": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function(node) {
                var ancestors = eslint.getAncestors();
                assert.equal(ancestors.length, 0);
            });

            eslint.verify(topic, config, true);
        }

    },

    "when calling getScope": {

        topic: "function foo() { q: for(;;) { break q; } } function bar () { var q = t; }",

        "should retrieve the global scope correctly from a Program": function(topic) {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function(node) {
                var scope = eslint.getScope();
                assert.equal(scope.type, "global");
            });

            eslint.verify(topic, config, true);
        },

        "should retrieve the global scope correctly from a FunctionDeclaration": function(topic) {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("FunctionDeclaration", function(node) {
                var scope = eslint.getScope();
                assert.equal(scope.type, "global");
            });

            eslint.verify(topic, config, true);
        },

        "should retrieve the function scope correctly from a LabeledStatement": function(topic) {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("LabeledStatement", function(node) {
                var scope = eslint.getScope();
                assert.equal(scope.type, "function");
                assert.equal(scope.block.id.name, "foo");
            });

            eslint.verify(topic, config, true);
        }

    },

    "when evaluating code": {

        topic: TEST_CODE,

        "events for each node type should fire": function(topic) {

            var config = { rules: {} };

            // spies for various AST node types
            var spyLiteral = sinon.spy(),
                spyVariableDeclarator = sinon.spy(),
                spyVariableDeclaration = sinon.spy(),
                spyIdentifier = sinon.spy(),
                spyBinaryExpression = sinon.spy();

            eslint.reset();
            eslint.on("Literal", spyLiteral);
            eslint.on("VariableDeclarator", spyVariableDeclarator);
            eslint.on("VariableDeclaration", spyVariableDeclaration);
            eslint.on("Identifier", spyIdentifier);
            eslint.on("BinaryExpression", spyBinaryExpression);

            var messages = eslint.verify(topic, config, true);

            assert.equal(messages.length, 0);
            sinon.assert.calledOnce(spyVariableDeclaration);
            sinon.assert.calledOnce(spyVariableDeclarator);
            sinon.assert.calledOnce(spyIdentifier);
            sinon.assert.calledTwice(spyLiteral);
            sinon.assert.calledOnce(spyBinaryExpression);
        }
    },

    "when passing in configuration values for rules": {

        topic: "var answer = 6 * 7",

        "should be configurable by only setting the boolean value": function(topic) {
            var rule = "semi",
                config = { rules: {} };

            config.rules[rule] = 1;
            eslint.reset();

            var messages = eslint.verify(topic, config, true);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, rule);
        },

        "should be configurable by passing in values as an array": function(topic) {
            var rule = "semi",
                config = { rules: {} };

            config.rules[rule] = [1];
            eslint.reset();

            var messages = eslint.verify(topic, config, true);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, rule);
        }
    },

    "after calling reset()": {

        topic: TEST_CODE,

        "previously registered event handlers should not be called": function(topic) {

            var config = { rules: {} };

            // spies for various AST node types
            var spyLiteral = sinon.spy(),
                spyVariableDeclarator = sinon.spy(),
                spyVariableDeclaration = sinon.spy(),
                spyIdentifier = sinon.spy(),
                spyBinaryExpression = sinon.spy();

            eslint.reset();
            eslint.on("Literal", spyLiteral);
            eslint.on("VariableDeclarator", spyVariableDeclarator);
            eslint.on("VariableDeclaration", spyVariableDeclaration);
            eslint.on("Identifier", spyIdentifier);
            eslint.on("BinaryExpression", spyBinaryExpression);
            eslint.reset();

            var messages = eslint.verify(topic, config, true);

            assert.equal(messages.length, 0);
            sinon.assert.notCalled(spyVariableDeclaration);
            sinon.assert.notCalled(spyVariableDeclarator);
            sinon.assert.notCalled(spyIdentifier);
            sinon.assert.notCalled(spyLiteral);
            sinon.assert.notCalled(spyBinaryExpression);
        },

        "text should not be available": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            var messages = eslint.verify(topic, config, true);
            eslint.reset();

            assert.equal(messages.length, 0);
            assert.isNull(eslint.getSource());
        },

        "source for nodes should not be available": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            var messages = eslint.verify(topic, config, true);
            eslint.reset();

            assert.equal(messages.length, 0);
            assert.isNull(eslint.getSource({}));
        }



    },

    "when evaluating code containing /*global */ and /*globals */ blocks": {

        topic: "/*global a b:true c:false*/ function foo() {} /*globals d:true*/",

        "variables should be available in global scope": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function(node) {
                var scope = eslint.getScope();
                var a = getVariable(scope, "a"),
                    b = getVariable(scope, "b"),
                    c = getVariable(scope, "c"),
                    d = getVariable(scope, "d");

                assert.equal(a.name, "a");
                assert.equal(a.writeable, false);
                assert.equal(b.name, "b");
                assert.equal(b.writeable, true);
                assert.equal(c.name, "c");
                assert.equal(c.writeable, false);
                assert.equal(d.name, "d");
                assert.equal(d.writeable, true);
            });

            eslint.verify(topic, config, true);
        }

    },

    "when evaluating code containing a /*global */ block with sloppy whitespace": {

        topic: "/* global  a b  : true   c:  false*/",

        "variables should be available in global scope": function(topic) {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function(node) {
                var scope = eslint.getScope(),
                    a = getVariable(scope, "a"),
                    b = getVariable(scope, "b"),
                    c = getVariable(scope, "c");

                assert.equal(a.name, "a");
                assert.equal(a.writeable, false);
                assert.equal(b.name, "b");
                assert.equal(b.writeable, true);
                assert.equal(c.name, "c");
                assert.equal(c.writeable, false);
            });

            eslint.verify(topic, config, true);
        }
    },

    "when evaluating code containing /*jshint */ block": {

        topic: "/*jslint node:true*/ function f() {} /*jshint browser:true foo:bar*/",

        "variables should be available in global scope": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function(node) {
                var scope = eslint.getScope(),
                    exports = getVariable(scope, "exports"),
                    window = getVariable(scope, "window");

                assert.equal(exports.writeable, true);
                assert.equal(window.writeable, false);
            });
            eslint.verify(topic, config, true);
        }
    },

    "when evaluating code containing a /*jshint */ block with sloppy whitespace": {

        topic: "/* jshint node  : true browser     : false*/",

        "variables should be available in global scope": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function(node) {
                var scope = eslint.getScope(),
                    exports = getVariable(scope, "exports"),
                    window = getVariable(scope, "window");

                assert.equal(exports.writeable, true);
                assert.equal(window, null);
            });
            eslint.verify(topic, config, true);
        }
    },

    "when evaluating code containing a line comment": {

        topic: "//global a \n function f() {}",

        "should not introduce a global variable": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function(node) {
                var scope = eslint.getScope();

                assert.equal(getVariable(scope, "a"), null);
            });
            eslint.verify(topic, config, true);
        }
    },

    "when evaluating code containing normal block comments": {

        topic: "/**/  /*a*/  /*b:true*/  /*foo c:false*/",

        "should not introduce a global variable": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function(node) {
                var scope = eslint.getScope();

                assert.equal(getVariable(scope, "a"), null);
                assert.equal(getVariable(scope, "b"), null);
                assert.equal(getVariable(scope, "foo"), null);
                assert.equal(getVariable(scope, "c"), null);
            });
            eslint.verify(topic, config, true);
        }
    },

    "when evaluating any code": {

        topic: "",

        "builtin global variables should be available in the global scope": function(topic) {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function(node) {
                var scope = eslint.getScope();

                assert.notEqual(getVariable(scope, "Object"), null);
                assert.notEqual(getVariable(scope, "Array"), null);
                assert.notEqual(getVariable(scope, "undefined"), null);
            });
            eslint.verify(topic, config, true);
        }
    },

}).export(module);
