/**
 * @fileoverview Tests for eslint object.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Helper
//------------------------------------------------------------------------------

/**
 * To make sure this works in both browsers and Node.js
 */
function compatRequire(name, windowName) {
    if (typeof require === "function") {
        return require(name);
    } else {
        return window[windowName || name];
    }
}

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = compatRequire("chai").assert,
    sinon = compatRequire("sinon"),
    eslint = compatRequire("../../lib/eslint", "eslint");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var TEST_CODE = "var answer = 6 * 7;",
    BROKEN_TEST_CODE = "var;";

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

describe("eslint", function() {
    describe("when using events", function() {
        var code = TEST_CODE,
            sandbox;

        it("an error should be thrown when an error occurs inside of an event handler", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                throw new Error("Intentional error.");
            });

            assert.throws(function() {
                eslint.verify(code, config, true);
            }, Error);
        });
    });

    describe("when calling toSource()", function() {
        var code = TEST_CODE;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.verifyAndRestore();
        });

        it("should retrieve all text when used without parameters", function() {
            function handler() {
                var source = eslint.getSource();
                assert.equal(source, TEST_CODE);
            }

            var config = { rules: {} },
                spy = sandbox.spy(handler);

            eslint.reset();
            eslint.on("Program", spy);

            eslint.verify(code, config, true);
            assert(spy.calledOnce);
        });

        it("should retrieve all text for root node", function() {
            function handler(node) {
                var source = eslint.getSource(node);
                assert.equal(source, TEST_CODE);
            }

            var config = { rules: {} },
                spy = sandbox.spy(handler);

            eslint.reset();
            eslint.on("Program", spy);

            eslint.verify(code, config, true);
            assert(spy.calledOnce);
        });

        it("should retrieve all text for binary expression", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var source = eslint.getSource(node);
                assert.equal(source, "6 * 7");
            });

            eslint.verify(code, config, true);
        });

        it("should retrieve all text plus two characters before for binary expression", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var source = eslint.getSource(node, 2);
                assert.equal(source, "= 6 * 7");
            });

            eslint.verify(code, config, true);
        });

        it("should retrieve all text plus one character after for binary expression", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var source = eslint.getSource(node, 0, 1);
                assert.equal(source, "6 * 7;");
            });

            eslint.verify(code, config, true);
        });

        it("should retrieve all text plus two characters before and one character after for binary expression", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var source = eslint.getSource(node, 2, 1);
                assert.equal(source, "= 6 * 7;");
            });

            eslint.verify(code, config, true);
        });
    });

    describe("when calling getTokens", function() {
        var code = TEST_CODE;

        it("should retrieve all tokens for root node", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function(node) {
                var tokens = eslint.getTokens(node);
                assert.equal(tokens.length, 7);
            });

            eslint.verify(code, config, true);
        });

        it("should retrieve all tokens for binary expression", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getTokens(node);
                assert.equal(tokens.length, 3);
            });

            eslint.verify(code, config, true);
        });

        it("should retrieve all tokens plus equals sign for binary expression", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getTokens(node, 1);
                assert.equal(tokens.length, 4);
            });

            eslint.verify(code, config, true);
        });

        it("should retrieve all tokens plus one after for binary expression", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getTokens(node, 0, 1);
                assert.equal(tokens.length, 4);
            });

            eslint.verify(code, config, true);
        });

        it("should retrieve all tokens plus two before and one after for binary expression", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getTokens(node, 2, 1);
                assert.equal(tokens.length, 6);
            });

            eslint.verify(code, config, true);
        });
    });

    describe("getJSDocComment()", function() {

        beforeEach(function() {
            eslint.reset();
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.verifyAndRestore();
        });

        it("should get JSDoc comment for node when the node is a FunctionDeclaration", function() {

            var code = [
                "/** Desc*/",
                "function Foo(){}"
            ].join("\n");

            function assertJSDoc(node) {
                var jsdoc = eslint.getJSDocComment(node);
                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Desc");
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionDeclaration", spy);
            eslint.verify(code, { rules: {}}, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });

        it("should not get JSDoc comment for node when the node is a FunctionDeclaration inside of an IIFE without a JSDoc comment", function() {

            var code = [
                "/** Desc*/",
                "(function(){",
                "function Foo(){}",
                "}())"
            ].join("\n");

            function assertJSDoc(node) {
                var jsdoc = eslint.getJSDocComment(node);
                assert.isNull(jsdoc);
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionDeclaration", spy);
            eslint.verify(code, { rules: {}}, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });

        it("should get JSDoc comment for node when the node is a FunctionDeclaration and there are multiple comments", function() {

            var code = [
                "/* Code is good */",
                "/** Desc*/",
                "function Foo(){}"
            ].join("\n");

            function assertJSDoc(node) {
                var jsdoc = eslint.getJSDocComment(node);
                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Desc");
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionDeclaration", spy);
            eslint.verify(code, { rules: {}}, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });

        it("should get JSDoc comment for node when the node is a FunctionDeclaration inside of an IIFE", function() {

            var code = [
                "/** Code is good */",
                "(function() {",
                "/** Desc*/",
                "function Foo(){}",
                "}())"
            ].join("\n");

            function assertJSDoc(node) {
                var jsdoc = eslint.getJSDocComment(node);
                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Desc");
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionDeclaration", spy);
            eslint.verify(code, { rules: {}}, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a FunctionExpression inside of an object literal", function() {

            var code = [
                "/** Code is good */",
                "var o = {",
                "/** Desc*/",
                "foo: function (){}",
                "};"
            ].join("\n");

            function assertJSDoc(node) {
                var jsdoc = eslint.getJSDocComment(node);
                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Desc");
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a FunctionExpression in an assignment", function() {

            var code = [
                "/** Code is good */",
                "/** Desc*/",
                "Foo.bar = function (){}",
            ].join("\n");

            function assertJSDoc(node) {
                var jsdoc = eslint.getJSDocComment(node);
                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Desc");
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a FunctionExpression in an assignment inside an IIFE", function() {

            var code = [
                "/** Code is good */",
                "(function iife() {",
                "/** Desc*/",
                "Foo.bar = function (){}",
                "}());"
            ].join("\n");

            function assertJSDoc(node) {
                if (!node.id) {
                    var jsdoc = eslint.getJSDocComment(node);
                    assert.equal(jsdoc.type, "Block");
                    assert.equal(jsdoc.value, "* Desc");
                }
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, true);
            assert.isTrue(spy.calledTwice, "Event handler should be called.");
        });

        it("should not get JSDoc comment for node when the node is a FunctionExpression in an assignment inside an IIFE without a JSDoc comment", function() {

            var code = [
                "/** Code is good */",
                "(function iife() {",
                "//* whatever",
                "Foo.bar = function (){}",
                "}());"
            ].join("\n");

            function assertJSDoc(node) {
                if (!node.id) {
                    var jsdoc = eslint.getJSDocComment(node);
                    assert.isNull(jsdoc);
                }
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, true);
            assert.isTrue(spy.calledTwice, "Event handler should be called.");
        });

        it("should not get JSDoc comment for node when the node is a FunctionExpression inside of a CallExpression", function() {

            var code = [
                "/** Code is good */",
                "module.exports = (function() {",
                "}());"
            ].join("\n");

            function assertJSDoc(node) {
                if (!node.id) {
                    var jsdoc = eslint.getJSDocComment(node);
                    assert.isNull(jsdoc);
                }
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should not get JSDoc comment for node when the node is a FunctionExpression in an assignment inside an IIFE without a JSDoc comment", function() {

            var code = [
                "/**",
                " * Merges two objects together.",
                " * @param {Object} target of the cloning operation",
                " * @param {Object} [source] object",
                " * @returns {void}",
                " */",
                "exports.mixin = function(target, source) {",
                "    Object.keys(source).forEach(function forEach(key) {",
                "        target[key] = source[key];",
                "    });",
                "};"
            ].join("\n");

            function assertJSDoc(node) {
                if (node.id) {
                    var jsdoc = eslint.getJSDocComment(node);
                    assert.isNull(jsdoc);
                }
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, true);
            assert.isTrue(spy.calledTwice, "Event handler should be called.");
        });

    });

    describe("getLine()", function() {

        beforeEach(function() {
            eslint.reset();
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.verifyAndRestore();
        });

        it("should get a line of text when called on \\n separated lines", function() {

            var lines = [
                    "/** Desc*/",
                    "function Foo(){}"
                ],
                code = lines.join("\n");

            eslint.verify(code, { rules: {}}, true);

            var line1 = eslint.getLine(1),
                line2 = eslint.getLine(2),
                line3 = eslint.getLine(3);

            assert.equal(line1, lines[0]);
            assert.equal(line2, lines[1]);
            assert.isNull(line3);
        });

        it("should get a line of text when called on \\r\\n separated lines", function() {

            var lines = [
                    "/** Desc*/",
                    "function Foo(){}"
                ],
                code = lines.join("\r\n");

            eslint.verify(code, { rules: {}}, true);

            var line1 = eslint.getLine(1),
                line2 = eslint.getLine(2),
                line3 = eslint.getLine(3);

            assert.equal(line1, lines[0]);
            assert.equal(line2, lines[1]);
            assert.isNull(line3);
        });

    });

    describe("getIndent()", function() {

        beforeEach(function() {
            eslint.reset();
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.verifyAndRestore();
        });

        it("should retrieve the indent when called on a node with an indent", function() {

            var lines = [
                    "if (foo) {",
                    "    doSomething()",
                    "}"
                ],
                code = lines.join("\n");

            function assertIndent(node) {
                var indent = eslint.getIndent(node);
                assert.equal(indent, "    ");
            }

            var spy = sandbox.spy(assertIndent);

            eslint.on("CallExpression", spy);
            eslint.verify(code, { rules: {}}, true);

            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should return null when called on a node without an indent", function() {

            var lines = [
                    "if (foo) {",
                    "doSomething()",
                    "}"
                ],
                code = lines.join("\n");

            function assertIndent(node) {
                var indent = eslint.getIndent(node);
                assert.isNull(indent);
            }

            var spy = sandbox.spy(assertIndent);

            eslint.on("CallExpression", spy);
            eslint.verify(code, { rules: {}}, true);

            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should return null when called on a node that isn't the outermost on an indented line", function() {

            var lines = [
                    "if (foo) {",
                    "   doSomething(5)",
                    "}"
                ],
                code = lines.join("\n");

            function assertIndent(node) {
                var indent = eslint.getIndent(node);
                assert.isNull(indent);
            }

            var spy = sandbox.spy(assertIndent);

            eslint.on("Literal", spy);
            eslint.verify(code, { rules: {}}, true);

            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

    });

    describe("when retrieving comments", function() {
        var sandbox,
            code = [
                "// my line comment",
                "var a = 42;",
                "/* my block comment */"
            ].join("\n");

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.verifyAndRestore();
        });

        it("should attach them to all nodes", function() {
            function assertCommentCount(leading, trailing) {
                return function (node) {
                    var comments = eslint.getComments(node);
                    assert.equal(comments.leading.length, leading);
                    assert.equal(comments.trailing.length, trailing);
                };
            }

            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", assertCommentCount(1, 0));
            eslint.on("VariableDeclaration", assertCommentCount(0, 1));
            eslint.on("VariableDeclarator", assertCommentCount(0, 0));
            eslint.on("Identifier", assertCommentCount(0, 0));
            eslint.on("Literal", assertCommentCount(0, 0));

            eslint.verify(code, config, true);
        });

        it("should fire LineComment event", function() {

            function handler(node) {
                var code = eslint.getSource(node);
                assert.equal(node.value, " my line comment");
                assert.equal(code, "// my line comment");
            }

            var config = { rules: {} },
                spy = sandbox.spy(handler);

            eslint.reset();
            eslint.on("LineComment", spy);

            eslint.verify(code, config, true);
            assert(spy.calledOnce, "Handler should be called.");
        });

        it("should fire LineComment and LineComment:exit events", function() {

            function handler(node) {
                var code = eslint.getSource(node);
                assert.equal(node.value, " my line comment");
                assert.equal(code, "// my line comment");
            }

            var config = { rules: {} },
                spy = sandbox.spy(handler);

            eslint.reset();
            eslint.on("LineComment", spy);
            eslint.on("LineComment:exit", spy);

            eslint.verify(code, config, true);
            assert(spy.calledTwice, "Handler should be called.");
        });

        it("should fire BlockComment event", function() {

            function handler(node) {
                var code = eslint.getSource(node);
                assert.equal(node.value, " my block comment ");
                assert.equal(code, "/* my block comment */");
            }

            var config = { rules: {} },
                spy = sandbox.spy(handler);

            eslint.reset();
            eslint.on("BlockComment", spy);

            eslint.verify(code, config, true);
            assert(spy.calledOnce, "Handler should be called.");
        });

        it("should fire BlockComment:exit event", function() {

            function handler(node) {
                var code = eslint.getSource(node);
                assert.equal(node.value, " my block comment ");
                assert.equal(code, "/* my block comment */");
            }

            var config = { rules: {} },
                spy = sandbox.spy(handler);

            eslint.reset();
            eslint.on("BlockComment", spy);
            eslint.on("BlockComment:exit", spy);

            eslint.verify(code, config, true);
            assert(spy.calledTwice, "Handler should be called.");
        });

    });

    describe("when calling getAncestors", function() {
        var code = TEST_CODE;

        it("should retrieve all ancestors when used", function() {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function() {
                var ancestors = eslint.getAncestors();
                assert.equal(ancestors.length, 3);
            });

            eslint.verify(code, config, true);
        });

        it("should retrieve empty ancestors for root node", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var ancestors = eslint.getAncestors();
                assert.equal(ancestors.length, 0);
            });

            eslint.verify(code, config, true);
        });
    });

    describe("when calling getScope", function() {
        var code = "function foo() { q: for(;;) { break q; } } function bar () { var q = t; }";

        it("should retrieve the global scope correctly from a Program", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var scope = eslint.getScope();
                assert.equal(scope.type, "global");
            });

            eslint.verify(code, config, true);
        });

        it("should retrieve the function scope correctly from a FunctionDeclaration", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("FunctionDeclaration", function() {
                var scope = eslint.getScope();
                assert.equal(scope.type, "function");
            });

            eslint.verify(code, config, true);
        });

        it("should retrieve the function scope correctly from a LabeledStatement", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("LabeledStatement", function() {
                var scope = eslint.getScope();
                assert.equal(scope.type, "function");
                assert.equal(scope.block.id.name, "foo");
            });

            eslint.verify(code, config, true);
        });
    });

    describe("when evaluating code", function() {
        var code = TEST_CODE;

        it("events for each node type should fire", function() {
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

            var messages = eslint.verify(code, config, true);

            assert.equal(messages.length, 0);
            sinon.assert.calledOnce(spyVariableDeclaration);
            sinon.assert.calledOnce(spyVariableDeclarator);
            sinon.assert.calledOnce(spyIdentifier);
            sinon.assert.calledTwice(spyLiteral);
            sinon.assert.calledOnce(spyBinaryExpression);
        });
    });

    describe("when passing in configuration values for rules", function() {
        var code = "var answer = 6 * 7";

        it("should be configurable by only setting the boolean value", function() {
            var rule = "semi",
                config = { rules: {} };

            config.rules[rule] = 1;
            eslint.reset();

            var messages = eslint.verify(code, config, true);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, rule);
        });

        it("should be configurable by passing in values as an array", function() {
            var rule = "semi",
                config = { rules: {} };

            config.rules[rule] = [1];
            eslint.reset();

            var messages = eslint.verify(code, config, true);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, rule);
        });
    });

    describe("after calling reset()", function() {
        var code = TEST_CODE;

        it("previously registered event handlers should not be called", function() {

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

            var messages = eslint.verify(code, config, true);

            assert.equal(messages.length, 0);
            sinon.assert.notCalled(spyVariableDeclaration);
            sinon.assert.notCalled(spyVariableDeclarator);
            sinon.assert.notCalled(spyIdentifier);
            sinon.assert.notCalled(spyLiteral);
            sinon.assert.notCalled(spyBinaryExpression);
        });

        it("text should not be available", function() {
            var config = { rules: {} };

            eslint.reset();
            var messages = eslint.verify(code, config, true);
            eslint.reset();

            assert.equal(messages.length, 0);
            assert.isNull(eslint.getSource());
        });

        it("source for nodes should not be available", function() {
            var config = { rules: {} };

            eslint.reset();
            var messages = eslint.verify(code, config, true);
            eslint.reset();

            assert.equal(messages.length, 0);
            assert.isNull(eslint.getSource({}));
        });
    });

    describe("when evaluating code containing /*global */ and /*globals */ blocks", function() {
        var code = "/*global a b:true c:false*/ function foo() {} /*globals d:true*/";

        it("variables should be available in global scope", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
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

            eslint.verify(code, config, true);
        });
    });

    describe("when evaluating code containing a /*global */ block with sloppy whitespace", function() {
        var code = "/* global  a b  : true   c:  false*/";

        it("variables should be available in global scope", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
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

            eslint.verify(code, config, true);
        });
    });

    describe("when evaluating code containing /*jshint */ block", function() {
        var code = "/*jslint node:true*/ function f() {} /*jshint browser:true foo:bar*/";

        it("variables should be available in global scope", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var scope = eslint.getScope(),
                    exports = getVariable(scope, "exports"),
                    window = getVariable(scope, "window");

                assert.equal(exports.writeable, true);
                assert.equal(window.writeable, false);
            });
            eslint.verify(code, config, true);
        });
    });

    describe("when evaluating code containing a /*jshint */ block with sloppy whitespace", function() {
        var code = "/* jshint node  : true browser     : false*/";

        it("variables should be available in global scope", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var scope = eslint.getScope(),
                    exports = getVariable(scope, "exports"),
                    window = getVariable(scope, "window");

                assert.equal(exports.writeable, true);
                assert.equal(window, null);
            });
            eslint.verify(code, config, true);
        });
    });

    describe("when evaluating code containing a line comment", function() {
        var code = "//global a \n function f() {}";

        it("should not introduce a global variable", function() {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var scope = eslint.getScope();

                assert.equal(getVariable(scope, "a"), null);
            });
            eslint.verify(code, config, true);
        });
    });

    describe("when evaluating code containing normal block comments", function() {
        var code = "/**/  /*a*/  /*b:true*/  /*foo c:false*/";

        it("should not introduce a global variable", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var scope = eslint.getScope();

                assert.equal(getVariable(scope, "a"), null);
                assert.equal(getVariable(scope, "b"), null);
                assert.equal(getVariable(scope, "foo"), null);
                assert.equal(getVariable(scope, "c"), null);
            });
            eslint.verify(code, config, true);
        });
    });

    describe("when evaluating any code", function() {
        var code = "";

        it("builtin global variables should be available in the global scope", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var scope = eslint.getScope();

                assert.notEqual(getVariable(scope, "Object"), null);
                assert.notEqual(getVariable(scope, "Array"), null);
                assert.notEqual(getVariable(scope, "undefined"), null);
            });
            eslint.verify(code, config, true);
        });
    });

    describe("when evaluating empty code", function() {
        var code = "", config = { rules: {} };

        it("getSource() should return an empty string", function() {
            eslint.reset();
            eslint.verify(code, config, true);
            assert.equal(eslint.getSource(), "");
        });
    });

    describe("at any time", function() {
        var code = "new-rule";

        it("can add a rule dynamically", function() {
            eslint.reset();
            eslint.defineRule(code, function(context) {
                return {"Literal": function(node) { context.report(node, "message"); }};
            });

            var config = { rules: {} };
            config.rules[code] = 1;

            var messages = eslint.verify("0", config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, code);
            assert.equal(messages[0].node.type, "Literal");
        });
    });

    describe("at any time", function() {
        var code = ["new-rule-0", "new-rule-1"];

        it("can add multiple rules dynamically", function() {
            eslint.reset();
            var config = { rules: {} };
            var newRules = {};
            code.forEach(function(item){
                config.rules[item] = 1;
                newRules[item] = function(context) {
                    return {"Literal": function(node) { context.report(node, "message"); }};
                };
            });
            eslint.defineRules(newRules);

            var messages = eslint.verify("0", config);

            assert.equal(messages.length, code.length);
            code.forEach(function(item){
                assert.ok(messages.some(function(message){ return message.ruleId === item; }));
            });
            messages.forEach(function(message){ assert.equal(message.node.type, "Literal"); });
        });
    });

    describe("when evaluating code with comments to enable rules", function() {
        var code = "/*eslint no-alert:1*/ alert('test');";

        it("should report a violation", function() {
            var config = { rules: {} };

            var messages = eslint.verify(code, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].node.type, "CallExpression");
        });
    });

    describe("when evaluating code with invalid comments to enable rules", function() {
        var code = "/*eslint no-alert:true*/ alert('test');";

        it("should not report a violation", function() {
            var config = { rules: {} };

            var messages = eslint.verify(code, config);
            assert.equal(messages.length, 0);
        });
    });

    describe("when evaluating code with comments to disable rules", function() {
        var code = "/*eslint no-alert:0*/ alert('test');";

        it("should not report a violation", function() {
            var config = { rules: { "no-alert" : 1 } };

            var messages = eslint.verify(code, config);
            assert.equal(messages.length, 0);
        });
    });

    describe("when evaluating code with comments to enable multiple rules", function() {
        var code = "/*eslint no-alert:1 no-console:1*/ alert('test'); console.log('test');";

        it("should report a violation", function() {
            var config = { rules: {} };

            var messages = eslint.verify(code, config);
            assert.equal(messages.length, 2);
            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].node.type, "CallExpression");
            assert.equal(messages[1].ruleId, "no-console");
        });
    });

    describe("when evaluating code with comments to enable and disable multiple rules", function() {
        var code = "/*eslint no-alert:1 no-console:0*/ alert('test'); console.log('test');";
        it("should report a violation", function() {
            var config = { rules: { "no-console" : 1, "no-alert" : 0 } };

            var messages = eslint.verify(code, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].node.type, "CallExpression");
        });
    });

    describe("when evaluating code with comments to enable and disable multiple comma separated rules", function() {
        var code = "/*eslint no-alert:1, no-console:0*/ alert('test'); console.log('test');";

        it("should report a violation", function() {
            var config = { rules: { "no-console" : 1, "no-alert" : 0 } };

            var messages = eslint.verify(code, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].node.type, "CallExpression");
        });
    });

    describe("when evaluating code with comments to enable configurable rule", function() {
        var code = "/*eslint quotes:[2, \"double\"]*/ alert('test');";

        it("should report a violation", function() {
            var config = { rules: { "quotes" : [2, "single"] } };

            var messages = eslint.verify(code, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "quotes");
            assert.equal(messages[0].message, "Strings must use doublequote.");
            assert.include(messages[0].node.type, "Literal");
        });
    });

    describe("when evaluating code with incorrectly formatted comments to disable rule", function() {
        it("should report a violation", function() {
            var code = "/*eslint no-alert:'1'*/ alert('test');";

            var config = { rules: { "no-alert" : 1} };

            var messages = eslint.verify(code, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].node.type, "CallExpression");
        });

        it("should report a violation", function() {
            var code = "/*eslint no-alert:abc*/ alert('test');";

            var config = { rules: { "no-alert" : 1} };

            var messages = eslint.verify(code, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].node.type, "CallExpression");
        });

        it("should report a violation", function() {
            var code = "/*eslint no-alert:0 2*/ alert('test');";

            var config = { rules: { "no-alert" : 1} };

            var messages = eslint.verify(code, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].node.type, "CallExpression");
        });
    });

    describe("when evaluating broken code", function() {
        var code = BROKEN_TEST_CODE;

        it("should report a violation", function() {
            var messages = eslint.verify(code);
            assert.equal(messages.length, 1);
            assert.isTrue(messages[0].fatal);
        });
    });

    describe("when using an invalid rule", function() {
        var code = TEST_CODE;

        it("should throw an error", function() {
            assert.throws(function() {
                eslint.verify(code, { rules: {foobar: 2 } });
            }, /Definition for rule 'foobar' was not found\./);
        });
    });

    describe("when calling defaults", function() {
        it("should return back config object", function() {
            var config = eslint.defaults();

            assert.isNotNull(config.rules);
        });
    });
});
