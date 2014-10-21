/*globals window */
/**
 * @fileoverview Tests for eslint object.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Helper
//------------------------------------------------------------------------------

// To make sure this works in both browsers and Node.js
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
    var filename = "filename.js";

    describe("when using events", function() {
        var code = TEST_CODE;

        it("an error should be thrown when an error occurs inside of an event handler", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                throw new Error("Intentional error.");
            });

            assert.throws(function() {
                eslint.verify(code, config, filename, true);
            }, Error);
        });
    });

    describe("when calling toSource()", function() {
        var code = TEST_CODE,
            sandbox;

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

            eslint.verify(code, config, filename, true);
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

            eslint.verify(code, config, filename, true);
            assert(spy.calledOnce);
        });

        it("should retrieve all text for binary expression", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var source = eslint.getSource(node);
                assert.equal(source, "6 * 7");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve all text plus two characters before for binary expression", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var source = eslint.getSource(node, 2);
                assert.equal(source, "= 6 * 7");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve all text plus one character after for binary expression", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var source = eslint.getSource(node, 0, 1);
                assert.equal(source, "6 * 7;");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve all text plus two characters before and one character after for binary expression", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var source = eslint.getSource(node, 2, 1);
                assert.equal(source, "= 6 * 7;");
            });

            eslint.verify(code, config, filename, true);
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

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve all tokens for binary expression", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getTokens(node);
                assert.equal(tokens.length, 3);
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve all tokens plus one before for binary expression", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getTokens(node, 1);
                assert.equal(tokens.length, 4);
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve all tokens plus one after for binary expression", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getTokens(node, 0, 1);
                assert.equal(tokens.length, 4);
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve all tokens plus two before and one after for binary expression", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getTokens(node, 2, 1);
                assert.equal(tokens.length, 6);
            });

            eslint.verify(code, config, filename, true);
        });
    });

    describe("when calling getTokensBefore", function() {
        var code = TEST_CODE;

        it("should retrieve zero tokens before a node", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getTokensBefore(node, 0);
                assert.equal(tokens.length, 0);
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve one token before a node", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getTokensBefore(node, 1);
                assert.equal(tokens.length, 1);
				assert.equal(tokens[0].value, "=");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve more than one token before a node", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getTokensBefore(node, 2);
                assert.equal(tokens.length, 2);
				assert.equal(tokens[0].value, "answer");
				assert.equal(tokens[1].value, "=");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve all tokens before a node", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getTokensBefore(node, 9e9);
                assert.equal(tokens.length, 3);
				assert.equal(tokens[0].value, "var");
				assert.equal(tokens[1].value, "answer");
				assert.equal(tokens[2].value, "=");
            });

            eslint.verify(code, config, filename, true);
        });
    });

    describe("when calling getTokenBefore", function() {
        var code = TEST_CODE;

        it("should retrieve one token before a node", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var token = eslint.getTokenBefore(node);
				assert.equal(token.value, "=");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should skip a given number of tokens", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var token = eslint.getTokenBefore(node, 1);
				assert.equal(token.value, "answer");
            });
            eslint.on("BinaryExpression", function(node) {
                var token = eslint.getTokenBefore(node, 2);
				assert.equal(token.value, "var");
            });

            eslint.verify(code, config, filename, true);
        });
    });

    describe("when calling getTokensAfter", function() {
        var code = TEST_CODE;

        it("should retrieve zero tokens after a node", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Identifier", function(node) {
                var tokens = eslint.getTokensAfter(node, 0);
                assert.equal(tokens.length, 0);
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve one token after a node", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Identifier", function(node) {
                var tokens = eslint.getTokensAfter(node, 1);
                assert.equal(tokens.length, 1);
				assert.equal(tokens[0].value, "=");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve more than one token after a node", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Identifier", function(node) {
                var tokens = eslint.getTokensAfter(node, 2);
                assert.equal(tokens.length, 2);
				assert.equal(tokens[0].value, "=");
				assert.equal(tokens[1].value, "6");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve all tokens after a node", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Identifier", function(node) {
                var tokens = eslint.getTokensAfter(node, 9e9);
                assert.equal(tokens.length, 5);
				assert.equal(tokens[0].value, "=");
				assert.equal(tokens[1].value, "6");
				assert.equal(tokens[2].value, "*");
				assert.equal(tokens[3].value, "7");
				assert.equal(tokens[4].value, ";");
            });

            eslint.verify(code, config, filename, true);
        });
    });

    describe("when calling getTokenAfter", function() {
        var code = TEST_CODE;

        it("should retrieve one token after a node", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Identifier", function(node) {
                var token = eslint.getTokenAfter(node);
				assert.equal(token.value, "=");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should skip a given number of tokens", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Identifier", function(node) {
                var token = eslint.getTokenAfter(node, 1);
				assert.equal(token.value, "6");
            });
            eslint.on("Identifier", function(node) {
                var token = eslint.getTokenAfter(node, 2);
				assert.equal(token.value, "*");
            });

            eslint.verify(code, config, filename, true);
        });
    });

    describe("when calling getFirstTokens", function() {
        var code = TEST_CODE;

        it("should retrieve zero tokens from a node's token stream", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getFirstTokens(node, 0);
                assert.equal(tokens.length, 0);
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve one token from a node's token stream", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getFirstTokens(node, 1);
                assert.equal(tokens.length, 1);
				assert.equal(tokens[0].value, "6");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve more than one token from a node's token stream", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getFirstTokens(node, 2);
                assert.equal(tokens.length, 2);
				assert.equal(tokens[0].value, "6");
				assert.equal(tokens[1].value, "*");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve all tokens from a node's token stream", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getFirstTokens(node, 9e9);
                assert.equal(tokens.length, 3);
				assert.equal(tokens[0].value, "6");
				assert.equal(tokens[1].value, "*");
				assert.equal(tokens[2].value, "7");
            });

            eslint.verify(code, config, filename, true);
        });
    });

    describe("when calling getFirstToken", function() {
        var code = TEST_CODE;

        it("should retrieve the first token of a node's token stream", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var token = eslint.getFirstToken(node);
				assert.equal(token.value, "6");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should skip a given number of tokens", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var token = eslint.getFirstToken(node, 1);
				assert.equal(token.value, "*");
            });
            eslint.on("BinaryExpression", function(node) {
                var token = eslint.getFirstToken(node, 2);
				assert.equal(token.value, "7");
            });

            eslint.verify(code, config, filename, true);
        });
    });

    describe("when calling getLastTokens", function() {
        var code = TEST_CODE;

        it("should retrieve zero tokens from the end of a node's token stream", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getLastTokens(node, 0);
                assert.equal(tokens.length, 0);
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve one token from the end of a node's token stream", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getLastTokens(node, 1);
                assert.equal(tokens.length, 1);
				assert.equal(tokens[0].value, "7");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve more than one token from the end of a node's token stream", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getLastTokens(node, 2);
                assert.equal(tokens.length, 2);
				assert.equal(tokens[0].value, "*");
				assert.equal(tokens[1].value, "7");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve all tokens from the end of a node's token stream", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var tokens = eslint.getLastTokens(node, 9e9);
                assert.equal(tokens.length, 3);
				assert.equal(tokens[0].value, "6");
				assert.equal(tokens[1].value, "*");
				assert.equal(tokens[2].value, "7");
            });

            eslint.verify(code, config, filename, true);
        });
    });

    describe("when calling getLastToken", function() {
        var code = TEST_CODE;

        it("should retrieve the last token of a node's token stream", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var token = eslint.getLastToken(node);
                assert.equal(token.value, "7");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should skip a given number of tokens", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var token = eslint.getLastToken(node, 1);
                assert.equal(token.value, "*");
            });
            eslint.on("BinaryExpression", function(node) {
                var token = eslint.getLastToken(node, 2);
                assert.equal(token.value, "6");
            });

            eslint.verify(code, config, filename, true);
        });
    });

    describe("getJSDocComment()", function() {
        var sandbox;

        beforeEach(function() {
            eslint.reset();
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.verifyAndRestore();
        });

        it("should not take a JSDoc comment from a FunctionDeclaration parent node when the node is a FunctionExpression", function() {

            var code = [
                "/** Desc*/",
                "function Foo(){var t = function(){}}"
            ].join("\n");

            function assertJSDoc(node) {
                var jsdoc = eslint.getJSDocComment(node);
                assert.equal(jsdoc, null);
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });

        it("should not take a JSDoc comment from a FunctionExpression parent node when the node is a FunctionExpression", function() {

            var code = [
                "/** Desc*/",
                "var f = function(){var t = function(arg){}}"
            ].join("\n");

            function assertJSDoc(node) {
                if (node.params.length === 1) {
                    var jsdoc = eslint.getJSDocComment(node);
                    assert.equal(jsdoc, null);
                }
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledTwice, "Event handler should be called twice.");

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
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });


        it("should get JSDoc comment for node when the node is a FunctionDeclaration but not the first statement", function() {

            var code = [
                "'use strict';",
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
            eslint.verify(code, { rules: {}}, filename, true);
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
            eslint.verify(code, { rules: {}}, filename, true);
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
            eslint.verify(code, { rules: {}}, filename, true);
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
            eslint.verify(code, { rules: {}}, filename, true);
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
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a FunctionExpression in an assignment", function() {

            var code = [
                "/** Code is good */",
                "/** Desc*/",
                "Foo.bar = function (){}"
            ].join("\n");

            function assertJSDoc(node) {
                var jsdoc = eslint.getJSDocComment(node);
                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Desc");
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, filename, true);
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
            eslint.verify(code, { rules: {}}, filename, true);
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
            eslint.verify(code, { rules: {}}, filename, true);
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
            eslint.verify(code, { rules: {}}, filename, true);
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
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledTwice, "Event handler should be called.");
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
            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("VariableDeclaration", assertCommentCount(1, 1));
            eslint.on("VariableDeclarator", assertCommentCount(0, 0));
            eslint.on("Identifier", assertCommentCount(0, 0));
            eslint.on("Literal", assertCommentCount(0, 0));

            eslint.verify(code, config, filename, true);
        });

        it("should fire LineComment event", function() {

            function handler(node) {
                var sourceCode = eslint.getSource(node);
                assert.equal(node.value, " my line comment");
                assert.equal(sourceCode, "// my line comment");
            }

            var config = { rules: {} },
                spy = sandbox.spy(handler);

            eslint.reset();
            eslint.on("LineComment", spy);

            eslint.verify(code, config, filename, true);
            assert(spy.calledOnce, "Handler should be called.");
        });

        it("should fire LineComment and LineComment:exit events", function() {

            function handler(node) {
                var sourceCode = eslint.getSource(node);
                assert.equal(node.value, " my line comment");
                assert.equal(sourceCode, "// my line comment");
            }

            var config = { rules: {} },
                spy = sandbox.spy(handler);

            eslint.reset();
            eslint.on("LineComment", spy);
            eslint.on("LineComment:exit", spy);

            eslint.verify(code, config, filename, true);
            assert(spy.calledTwice, "Handler should be called.");
        });

        it("should fire BlockComment event", function() {

            function handler(node) {
                var sourceCode = eslint.getSource(node);
                assert.equal(node.value, " my block comment ");
                assert.equal(sourceCode, "/* my block comment */");
            }

            var config = { rules: {} },
                spy = sandbox.spy(handler);

            eslint.reset();
            eslint.on("BlockComment", spy);

            eslint.verify(code, config, filename, true);
            assert(spy.calledOnce, "Handler should be called.");
        });

        it("should fire LineComment event for top-level comment", function() {

            function handler(node) {
                var sourceCode = eslint.getSource(node);
                assert.equal(node.value, " fixme");
                assert.equal(sourceCode, "// fixme");
            }

            var config = { rules: {} },
                spy = sandbox.spy(handler);

            eslint.reset();
            eslint.on("LineComment", spy);

            eslint.verify("// fixme", config, filename, true);
            assert(spy.calledOnce, "Handler should be called.");
        });

        it("should fire BlockComment:exit event", function() {

            function handler(node) {
                var sourceCode = eslint.getSource(node);
                assert.equal(node.value, " my block comment ");
                assert.equal(sourceCode, "/* my block comment */");
            }

            var config = { rules: {} },
                spy = sandbox.spy(handler);

            eslint.reset();
            eslint.on("BlockComment", spy);
            eslint.on("BlockComment:exit", spy);

            eslint.verify(code, config, filename, true);
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

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve empty ancestors for root node", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var ancestors = eslint.getAncestors();
                assert.equal(ancestors.length, 0);
            });

            eslint.verify(code, config, filename, true);
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

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve the function scope correctly from a FunctionDeclaration", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("FunctionDeclaration", function() {
                var scope = eslint.getScope();
                assert.equal(scope.type, "function");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve the function scope correctly from a LabeledStatement", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("LabeledStatement", function() {
                var scope = eslint.getScope();
                assert.equal(scope.type, "function");
                assert.equal(scope.block.id.name, "foo");
            });

            eslint.verify(code, config, filename, true);
        });
    });

    describe("when calling report", function() {
        it("should correctly parse a message when being passed all options", function() {
            eslint.reset();
            eslint.defineRule("test-rule", function(context) {
                return {
                    "Literal": function(node) {
                        context.report(node, node.loc.end, "hello {{dynamic}}", {dynamic: node.type});
                    }
                };
            });

            var config = { rules: {} };
            config.rules["test-rule"] = 1;

            var messages = eslint.verify("0", config);
            assert.equal(messages[0].message, "hello Literal");
        });

        it("should use the report the provided location when given", function() {
            eslint.reset();
            eslint.defineRule("test-rule", function(context) {
                return {
                    "Literal": function(node) {
                        context.report(node, {line: 42, column: 13}, "hello world");
                    }
                };
            });

            var config = { rules: {} };
            config.rules["test-rule"] = 1;

            var messages = eslint.verify("0", config);
            assert.equal(messages[0].message, "hello world");
            assert.equal(messages[0].line, 42);
            assert.equal(messages[0].column, 13);
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

            var messages = eslint.verify(code, config, filename, true);

            assert.equal(messages.length, 0);
            sinon.assert.calledOnce(spyVariableDeclaration);
            sinon.assert.calledOnce(spyVariableDeclarator);
            sinon.assert.calledOnce(spyIdentifier);
            sinon.assert.calledTwice(spyLiteral);
            sinon.assert.calledOnce(spyBinaryExpression);
        });
    });

    describe("when config has shared settings for rules", function() {
        var code = "test-rule";

        it("should pass settings to all rules", function() {
            eslint.reset();
            eslint.defineRule(code, function(context) {
                return {
                    "Literal": function(node) {
                        context.report(node, context.settings.info);
                    }
                };
            });

            var config = { rules: {}, settings: { info: "Hello" } };
            config.rules[code] = 1;

            var messages = eslint.verify("0", config, filename);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].message, "Hello");
        });

        it("should not have any settings if they were not passed in", function() {
            eslint.reset();
            eslint.defineRule(code, function(context) {
                return {
                    "Literal": function(node) {
                        if (Object.getOwnPropertyNames(context.settings).length !== 0) {
                            context.report(node, "Settings should be empty");
                        }
                    }
                };
            });

            var config = { rules: {} };
            config.rules[code] = 1;

            var messages = eslint.verify("0", config, filename);

            assert.equal(messages.length, 0);
        });
    });

    describe("when passing in configuration values for rules", function() {
        var code = "var answer = 6 * 7";

        it("should be configurable by only setting the integer value", function() {
            var rule = "semi",
                config = { rules: {} };

            config.rules[rule] = 1;
            eslint.reset();

            var messages = eslint.verify(code, config, filename, true);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, rule);
        });

        it("should be configurable by passing in values as an array", function() {
            var rule = "semi",
                config = { rules: {} };

            config.rules[rule] = [1];
            eslint.reset();

            var messages = eslint.verify(code, config, filename, true);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, rule);
        });

        it("should not be configurable by setting other value", function() {
            var rule = "semi",
                config = { rules: {} };

            config.rules[rule] = "1";
            eslint.reset();

            var messages = eslint.verify(code, config, filename, true);

            assert.equal(messages.length, 0);
        });

        it("should process empty config", function() {
            var config = {};

            eslint.reset();
            var messages = eslint.verify(code, config, filename, true);
            assert.equal(messages.length, 0);
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

            var messages = eslint.verify(code, config, filename, true);

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
            var messages = eslint.verify(code, config, filename, true);
            eslint.reset();

            assert.equal(messages.length, 0);
            assert.isNull(eslint.getSource());
        });

        it("source for nodes should not be available", function() {
            var config = { rules: {} };

            eslint.reset();
            var messages = eslint.verify(code, config, filename, true);
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

            eslint.verify(code, config, filename, true);
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

            eslint.verify(code, config, filename, true);
        });
    });

    describe("when evaluating code containing /*eslint-env */ block", function() {
        var code = "/*eslint-env node*/ function f() {} /*eslint-env browser, foo*/";

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
            eslint.verify(code, config, filename, true);
        });
    });

    describe("when evaluating code containing /*eslint-env */ block with sloppy whitespace", function() {
        var code = "/* eslint-env ,, node  , no-browser ,,  */";

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
            eslint.verify(code, config, filename, true);
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
            eslint.verify(code, config, filename, true);
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
            eslint.verify(code, config, filename, true);
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
            eslint.verify(code, config, filename, true);
        });
    });

    describe("when evaluating empty code", function() {
        var code = "", config = { rules: {} };

        it("getSource() should return an empty string", function() {
            eslint.reset();
            eslint.verify(code, config, filename, true);
            assert.equal(eslint.getSource(), "");
        });
    });

    describe("at any time", function() {
        var code = "new-rule";

        it("can add a rule dynamically", function() {
            eslint.reset();
            eslint.defineRule(code, function(context) {
                return {
                    "Literal": function(node) {
                        context.report(node, "message");
                    }
                };
            });

            var config = { rules: {} };
            config.rules[code] = 1;

            var messages = eslint.verify("0", config, filename);

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
            code.forEach(function(item) {
                config.rules[item] = 1;
                newRules[item] = function(context) {
                    return {
                        "Literal": function(node) {
                            context.report(node, "message");
                        }
                    };
                };
            });
            eslint.defineRules(newRules);

            var messages = eslint.verify("0", config, filename);

            assert.equal(messages.length, code.length);
            code.forEach(function(item) {
                assert.ok(messages.some(function(message) {
                    return message.ruleId === item;
                }));
            });
            messages.forEach(function(message) {
                assert.equal(message.node.type, "Literal");
            });
        });
    });

    describe("at any time", function() {
        var code = "filename-rule";

        it("has access to the filename", function() {
            eslint.reset();
            eslint.defineRule(code, function(context) {
                return {
                    "Literal": function(node) {
                        context.report(node, context.getFilename());
                    }
                };
            });

            var config = { rules: {} };
            config.rules[code] = 1;

            var messages = eslint.verify("0", config, filename);

            assert.equal(messages[0].message, filename);
        });

        it("defaults filename to '<input>'", function() {
            eslint.reset();
            eslint.defineRule(code, function(context) {
                return {
                    "Literal": function(node) {
                        context.report(node, context.getFilename());
                    }
                };
            });

            var config = { rules: {} };
            config.rules[code] = 1;

            var messages = eslint.verify("0", config);

            assert.equal(messages[0].message, "<input>");
        });
    });

    describe("when evaluating code with comments to enable rules", function() {

        it("should report a violation", function() {
            var code = "/*eslint no-alert:1*/ alert('test');";
            var config = { rules: {} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].node.type, "CallExpression");
        });

        it("rules should not change initial config", function() {
            var config = { rules: {"strict": 2} };
            var codeA = "/*eslint strict: 0*/ function bar() { return 2; }";
            var codeB = "function foo() { return 1; }";

            eslint.reset();
            var messages = eslint.verify(codeA, config, filename, false);
            assert.equal(messages.length, 0);

            messages = eslint.verify(codeB, config, filename, false);
            assert.equal(messages.length, 1);
        });

        it("rules should not change initial config", function() {
            var config = { rules: {"quotes": [2, "double"]} };
            var codeA = "/*eslint quotes: 0*/ function bar() { return '2'; }";
            var codeB = "function foo() { return '1'; }";

            eslint.reset();
            var messages = eslint.verify(codeA, config, filename, false);
            assert.equal(messages.length, 0);

            messages = eslint.verify(codeB, config, filename, false);
            assert.equal(messages.length, 1);
        });

        it("rules should not change initial config", function() {
            var config = { rules: {"quotes": [2, "double"]} };
            var codeA = "/*eslint quotes: [0, \"single\"]*/ function bar() { return '2'; }";
            var codeB = "function foo() { return '1'; }";

            eslint.reset();
            var messages = eslint.verify(codeA, config, filename, false);
            assert.equal(messages.length, 0);

            messages = eslint.verify(codeB, config, filename, false);
            assert.equal(messages.length, 1);
        });

        it("rules should not change initial config", function() {
            var config = { rules: {"no-unused-vars": [2, {"vars": "all"}]} };
            var codeA = "/*eslint no-unused-vars: [0, {\"vars\": \"local\"}]*/ var a = 44;";
            var codeB = "var b = 55;";

            eslint.reset();
            var messages = eslint.verify(codeA, config, filename, false);
            assert.equal(messages.length, 0);

            messages = eslint.verify(codeB, config, filename, false);
            assert.equal(messages.length, 1);
        });
    });

    describe("when evaluating code with invalid comments to enable rules", function() {
        var code = "/*eslint no-alert:true*/ alert('test');";

        it("should not report a violation", function() {
            var config = { rules: {} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });
    });

    describe("when evaluating code with comments to disable rules", function() {
        var code = "/*eslint no-alert:0*/ alert('test');";

        it("should not report a violation", function() {
            var config = { rules: { "no-alert": 1 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });
    });

    describe("when evaluating code with comments to enable multiple rules", function() {
        var code = "/*eslint no-alert:1 no-console:1*/ alert('test'); console.log('test');";

        it("should report a violation", function() {
            var config = { rules: {} };

            var messages = eslint.verify(code, config, filename);
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
            var config = { rules: { "no-console": 1, "no-alert": 0 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].node.type, "CallExpression");
        });
    });

    describe("when evaluating code with comments to disable and enable configurable rule as part of plugin", function() {
        eslint.defineRule("test-plugin/test-rule", function(context) {
            return {
                "Literal": function(node) {
                    if (node.value === "trigger violation") {
                        context.report(node, "Reporting violation.");
                    }
                }
            };
        });

        it("should not report a violation", function() {
            var config = { rules: {} };
            var code = "/*eslint test-plugin/test-rule: 2*/ var a = \"no violation\";";

            eslint.reset();
            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });

        it("should not report a violation", function() {
            var code = "/*eslint test-plugin/test-rule:0*/ var a = \"trigger violation\"";
            var config = { rules: { "test-plugin/test-rule": 1 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });

        it("rules should not change initial config", function() {
            var config = { rules: {"test-plugin/test-rule": 2} };
            var codeA = "/*eslint test-plugin/test-rule: 0*/ var a = \"trigger violation\";";
            var codeB = "var a = \"trigger violation\";";

            eslint.reset();
            var messages = eslint.verify(codeA, config, filename, false);
            assert.equal(messages.length, 0);

            messages = eslint.verify(codeB, config, filename, false);
            assert.equal(messages.length, 1);
        });
    });

    describe("when evaluating code with comments to enable and disable all reporting", function() {
        it("should report a violation", function() {

            var code = [
                "/*eslint-disable */",
                "alert('test');",
                "/*eslint-enable */",
                "alert('test');"
            ].join("\n");
            var config = { rules: { "no-alert": 1 } };

            var messages = eslint.verify(code, config, filename);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].node.type, "CallExpression");
            assert.equal(messages[0].line, 4);
        });

        it("should not report a violation", function() {
            var code = [
                "/*eslint-disable */",
                "alert('test');",
                "alert('test');"
            ].join("\n");
            var config = { rules: { "no-alert": 1 } };

            var messages = eslint.verify(code, config, filename);

            assert.equal(messages.length, 0);
        });

        it("should not report a violation", function() {
            var code = [
                "                    alert('test1');/*eslint-disable */\n",
                "alert('test');",
                "                                         alert('test');\n",
                "/*eslint-enable */alert('test2');"
            ].join("");
            var config = { rules: { "no-alert": 1 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 2);
            assert.equal(messages[0].column, 20);
            assert.equal(messages[1].column, 18);
        });

        it("should not report a violation", function() {

            var code = [
                "/*eslint-disable */",
                "alert('test');",
                "/*eslint-disable */",
                "alert('test');",
                "/*eslint-enable*/",
                "alert('test');",
                "/*eslint-enable*/"
            ].join("\n");

            var config = { rules: { "no-alert": 1 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });


        it("should not report a violation", function() {
            var code = [
                "/*eslint-disable */",
                "(function (){ var b = 44;})()",
                "/*eslint-enable */;any();"
            ].join("\n");

            var config = { rules: { "no-unused-vars": 1 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });

        it("should not report a violation", function() {
            var code = [
                "(function (){ /*eslint-disable */ var b = 44;})()",
                "/*eslint-enable */;any();"
            ].join("\n");

            var config = { rules: { "no-unused-vars": 1 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });
    });

    describe("when evaluating code with comments to enable and disable reporting of specific rules", function() {

        it("should report a violation", function() {
            var code = [
                "/*eslint-disable no-alert */",
                    "alert('test');",
                    "console.log('test');" // here
            ].join("\n");
            var config = { rules: { "no-alert": 1, "no-console": 1 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 1);

            assert.equal(messages[0].ruleId, "no-console");
        });

        it("should report a violation", function() {
            var code = [
                "/*eslint-disable no-alert, no-console */",
                    "alert('test');",
                    "console.log('test');",
                "/*eslint-enable*/",

                "alert('test');", // here
                "console.log('test');" // here
            ].join("\n");
            var config = { rules: { "no-alert": 1, "no-console": 1 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 2);

            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].line, 5);
            assert.equal(messages[1].ruleId, "no-console");
            assert.equal(messages[1].line, 6);
        });

        it("should report a violation", function() {
            var code = [
                "/*eslint-disable no-alert */",
                    "alert('test');",
                    "console.log('test');",
                "/*eslint-enable no-console */",

                "alert('test');" // here
            ].join("\n");
            var config = { rules: { "no-alert": 1, "no-console": 1 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 1);

            assert.equal(messages[0].ruleId, "no-console");
        });


        it("should report a violation", function() {
            var code = [
                "/*eslint-disable no-alert, no-console */",
                    "alert('test');",
                    "console.log('test');",
                "/*eslint-enable no-alert*/",

                "alert('test');", // here
                "console.log('test');"
            ].join("\n");
            var config = { rules: { "no-alert": 1, "no-console": 1 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 1);

            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].line, 5);
        });


        it("should report a violation", function() {
            var code = [
                "/*eslint-disable no-alert */",

                    "/*eslint-disable no-console */",
                        "alert('test');",
                        "console.log('test');",
                    "/*eslint-enable */",

                    "alert('test');",
                    "console.log('test');", // here

                "/*eslint-enable */",

                "alert('test');", // here
                "console.log('test');", // here

                "/*eslint-enable*/"
            ].join("\n");
            var config = { rules: { "no-alert": 1, "no-console": 1 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 3);

            assert.equal(messages[0].ruleId, "no-console");
            assert.equal(messages[0].line, 7);

            assert.equal(messages[1].ruleId, "no-alert");
            assert.equal(messages[1].line, 9);

            assert.equal(messages[2].ruleId, "no-console");
            assert.equal(messages[2].line, 10);

        });

        it("should report a violation", function() {
            var code = [
                "/*eslint-disable no-alert, no-console */",
                    "alert('test');",
                    "console.log('test');",

                    "/*eslint-enable no-alert */",

                    "alert('test');", // here
                    "console.log('test');",

                    "/*eslint-enable no-console */",

                    "alert('test');", // here
                    "console.log('test');", // here
                "/*eslint-enable no-console */"
            ].join("\n");
            var config = { rules: { "no-alert": 1, "no-console": 1 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 3);

            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].line, 5);

            assert.equal(messages[1].ruleId, "no-alert");
            assert.equal(messages[1].line, 8);

            assert.equal(messages[2].ruleId, "no-console");
            assert.equal(messages[2].line, 9);

        });
    });

    describe("when evaluating code with comments to enable and disable multiple comma separated rules", function() {
        var code = "/*eslint no-alert:1, no-console:0*/ alert('test'); console.log('test');";

        it("should report a violation", function() {
            var config = { rules: { "no-console": 1, "no-alert": 0 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].node.type, "CallExpression");
        });
    });

    describe("when evaluating code with comments to enable configurable rule", function() {
        var code = "/*eslint quotes:[2, \"double\"]*/ alert('test');";

        it("should report a violation", function() {
            var config = { rules: { "quotes": [2, "single"] } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "quotes");
            assert.equal(messages[0].message, "Strings must use doublequote.");
            assert.include(messages[0].node.type, "Literal");
        });
    });

    describe("when evaluating code with incorrectly formatted comments to disable rule", function() {
        it("should report a violation", function() {
            var code = "/*eslint no-alert:'1'*/ alert('test');";

            var config = { rules: { "no-alert": 1} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].node.type, "CallExpression");
        });

        it("should report a violation", function() {
            var code = "/*eslint no-alert:abc*/ alert('test');";

            var config = { rules: { "no-alert": 1} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].node.type, "CallExpression");
        });

        it("should report a violation", function() {
            var code = "/*eslint no-alert:0 2*/ alert('test');";

            var config = { rules: { "no-alert": 1} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].node.type, "CallExpression");
        });
    });

    describe("when evaluating a file with a shebang", function() {
        var code = "#!bin/program\n\nvar foo;;",
            sandbox = sinon.sandbox.create();

        afterEach(function() {
            sandbox.verifyAndRestore();
        });

        it("should preserve line numbers", function() {
            var config = { rules: { "no-extra-semi": 1 } };
            var messages = eslint.verify(code, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-extra-semi");
            assert.equal(messages[0].node.type, "EmptyStatement");
            assert.equal(messages[0].line, 3);
            assert.equal(messages[0].line, messages[0].node.loc.start.line);
        });

        it("should not have a comment with the shebang in it", function() {
            var config = { rules: { "no-extra-semi": 1 } };
            eslint.reset();

            eslint.on("Program", function(node) {
                assert.equal(node.comments.length, 0);

                var comments = eslint.getComments(node);
                assert.equal(comments.leading.length, 0);
                assert.equal(comments.trailing.length, 0);

                comments = eslint.getComments(node.body[0]);
                assert.equal(comments.leading.length, 0);
                assert.equal(comments.trailing.length, 0);
            });
            eslint.verify(code, config, "foo.js", true);
        });

        it("should not fire a LineComment event for a comment with the shebang in it", function() {
            var config = { rules: { "no-extra-semi": 1 } };
            eslint.reset();

            eslint.on("LineComment", sandbox.mock().never());
            eslint.verify(code, config, "foo.js", true);
        });
    });

    describe("when evaluating broken code", function() {
        var code = BROKEN_TEST_CODE;

        it("should report a violation", function() {
            var messages = eslint.verify(code);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].severity, 2);
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

    describe("when evaluating code with comments to environment", function() {
        it("should not support legacy config", function() {
            var code = "/*jshint mocha:true */ describe();";

            var config = { rules: { "no-undef": 1} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-undef");
            assert.equal(messages[0].node.type, "Identifier");
            assert.equal(messages[0].line, 1);
            assert.equal(messages[0].line, messages[0].node.loc.start.line);
        });

        it("should not report a violation when using typed array", function() {
            var code = "var array = new Uint8Array();";

            var config = { rules: { "no-undef": 1} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });

        it("should not report a violation", function() {
            var code = "/*eslint-env mocha,node */ require();describe();";

            var config = { rules: { "no-undef": 1} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });

        it("should not report a violation", function() {
            var code = "/*eslint-env mocha */ suite();test();";

            var config = { rules: { "no-undef": 1} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });

        it("should not report a violation", function() {
            var code = "/*eslint-env amd */ define();require();";

            var config = { rules: { "no-undef": 1} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });

        it("should not report a violation", function() {
            var code = "/*eslint-env jasmine */ expect();spyOn();";

            var config = { rules: { "no-undef": 1} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });

        it("should not report a violation", function() {
            var code = "/*globals require: true */ /*eslint-env node */ require = 1;";

            var config = { rules: {"no-undef": 1} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });

        it("should report a violation", function() {
            var code = "/*eslint-env node */ process.exit();";

            var config = { rules: {} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-process-exit");
            assert.equal(messages[0].node.type, "CallExpression");
            assert.equal(messages[0].line, 1);
            assert.equal(messages[0].line, messages[0].node.loc.start.line);
        });

        it("should not report a violation", function() {
            var code = "/*eslint no-process-exit: 0 */ /*eslint-env node */ process.exit();";

            var config = { rules: {"no-undef": 1} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });
    });

    describe("when evaluating code with code comments", function() {
        var sandbox;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.verifyAndRestore();
        });

        it("should emit enter only once for each comment", function() {

            var code = "a; /*zz*/ b;";

            var config = { rules: {} },
                spy = sandbox.spy();

            eslint.reset();
            eslint.on("BlockComment", spy);

            eslint.verify(code, config, filename, true);
            assert.equal(spy.calledOnce, true);
        });

        it("should emit exit only once for each comment", function() {

            var code = "a; //zz\n b;";

            var config = { rules: {} },
                spy = sandbox.spy();

            eslint.reset();
            eslint.on("LineComment:exit", spy);

            eslint.verify(code, config, filename, true);
            assert.equal(spy.calledOnce, true);
        });

    });

    describe("when evaluating code with hashbang", function() {
        it("should comment hashbang without breaking offset", function() {

            var code = "#!/usr/bin/env node\n'123';";

            var config = { rules: {} };

            eslint.reset();
            eslint.on("ExpressionStatement", function(node) {
                assert.equal(eslint.getSource(node), "'123';");
            });

            eslint.verify(code, config, filename, true);
        });

    });

    describe("verify()", function() {
        var code = "foo()\n    alert('test')";

        it("should report warnings in order by line and column when called", function() {
            var config = { rules: { "no-mixed-spaces-and-tabs": 1, "eol-last": 1, "semi": [1, "always"] } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 3);
            assert.equal(messages[0].line, 1);
            assert.equal(messages[0].column, 5);
            assert.equal(messages[1].line, 2);
            assert.equal(messages[1].column, 1);
            assert.equal(messages[2].line, 2);
            assert.equal(messages[2].column, 17);


        });
    });
});
