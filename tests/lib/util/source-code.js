/**
 * @fileoverview Abstraction of JavaScript source code.
 * @author Nicholas C. Zakas
 * @copyright 2015 Nicholas C. Zakas. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    espree = require("espree"),
    sinon = require("sinon"),
    leche = require("leche"),
    eslint = require("../../../lib/eslint"),
    SourceCode = require("../../../lib/util/source-code");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var DEFAULT_CONFIG = {
    ecmaVersion: 6,
    comment: true,
    tokens: true,
    range: true,
    loc: true
};

var AST = espree.parse("let foo = bar;", DEFAULT_CONFIG),
    TEST_CODE = "var answer = 6 * 7;";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("SourceCode", function() {

    describe("new SourceCode()", function() {

        it("should create a new instance when called with valid data", function() {
            var ast = { comments: [], tokens: [], loc: {}, range: [] };
            var sourceCode = new SourceCode("foo;", ast);

            assert.isObject(sourceCode);
            assert.equal(sourceCode.text, "foo;");
            assert.equal(sourceCode.ast, ast);
        });

        it("should split text into lines when called with valid data", function() {
            var ast = { comments: [], tokens: [], loc: {}, range: [] };
            var sourceCode = new SourceCode("foo;\nbar;", ast);

            assert.isObject(sourceCode);
            assert.equal(sourceCode.lines.length, 2);
            assert.equal(sourceCode.lines[0], "foo;");
            assert.equal(sourceCode.lines[1], "bar;");
        });

        /* eslint-disable no-new */

        it("should throw an error when called with an AST that's missing tokens", function() {

            assert.throws(function() {
                new SourceCode("foo;", { comments: [], loc: {}, range: [] });
            }, /missing the tokens array/);

        });

        it("should throw an error when called with an AST that's missing comments", function() {

            assert.throws(function() {
                new SourceCode("foo;", { tokens: [], loc: {}, range: [] });
            }, /missing the comments array/);

        });

        it("should throw an error when called with an AST that's missing comments", function() {

            assert.throws(function() {
                new SourceCode("foo;", { comments: [], tokens: [], range: [] });
            }, /missing location information/);

        });

        it("should throw an error when called with an AST that's missing comments", function() {

            assert.throws(function() {
                new SourceCode("foo;", { comments: [], tokens: [], loc: {} });
            }, /missing range information/);
        });

        it("should store all tokens and comments sorted by range", function() {
            var comments = [
                { range: [0, 2] },
                { range: [10, 12] }
            ];
            var tokens = [
                { range: [3, 8] },
                { range: [8, 10] },
                { range: [12, 20] }
            ];
            var sourceCode = new SourceCode("", { comments: comments, tokens: tokens, loc: {}, range: [] });

            var actual = sourceCode.tokensAndComments;
            var expected = [comments[0], tokens[0], tokens[1], comments[1], tokens[2]];
            assert.deepEqual(actual, expected);
        });
    });


    describe("getJSDocComment()", function() {

        var sandbox = sinon.sandbox.create(),
            filename = "foo.js";

        beforeEach(function() {
            eslint.reset();
        });

        afterEach(function() {
            sandbox.verifyAndRestore();
        });

        it("should not take a JSDoc comment from a FunctionDeclaration parent node when the node is a FunctionExpression", function() {

            var code = [
                "/** Desc*/",
                "function Foo(){var t = function(){}}"
            ].join("\n");

            /**
             * Check jsdoc presence
             * @param {ASTNode} node not to check
             * @returns {void}
             * @private
             */
            function assertJSDoc(node) {
                var sourceCode = eslint.getSourceCode();
                var jsdoc = sourceCode.getJSDocComment(node);
                assert.equal(jsdoc, null);
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });

        it("should not take a JSDoc comment from a VariableDeclaration parent node when the node is a FunctionExpression inside a NewExpression", function() {

            var code = [
                "/** Desc*/",
                "var x = new Foo(function(){});"
            ].join("\n");

            /**
             * Check jsdoc presence
             * @param {ASTNode} node not to check
             * @returns {void}
             * @private
             */
            function assertJSDoc(node) {
                var sourceCode = eslint.getSourceCode();
                var jsdoc = sourceCode.getJSDocComment(node);
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

            /**
             * Check jsdoc presence
             * @param {ASTNode} node not to check
             * @returns {void}
             * @private
             */
            function assertJSDoc(node) {
                if (node.params.length === 1) {
                    var sourceCode = eslint.getSourceCode();
                    var jsdoc = sourceCode.getJSDocComment(node);
                    assert.equal(jsdoc, null);
                }
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledTwice, "Event handler should be called twice.");

        });

        it("should get JSDoc comment for FunctionExpression in a CallExpression", function() {
            var code = [
                "call(",
                "  /** Documentation. */",
                "  function(argName) {",
                "    return 'the return';",
                "  }",
                ");"
            ].join("\n");

            /**
             * Check jsdoc presence
             * @param {ASTNode} node not to check
             * @returns {void}
             * @private
             */
            function assertJSDoc(node) {
                var sourceCode = eslint.getSourceCode();
                var jsdoc = sourceCode.getJSDocComment(node);
                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Documentation. ");
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, {rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a FunctionDeclaration", function() {

            var code = [
                "/** Desc*/",
                "function Foo(){}"
            ].join("\n");

            /**
             * Check jsdoc presence
             * @param {ASTNode} node not to check
             * @returns {void}
             * @private
             */
            function assertJSDoc(node) {
                var sourceCode = eslint.getSourceCode();
                var jsdoc = sourceCode.getJSDocComment(node);
                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Desc");
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionDeclaration", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });

        it("should get JSDoc comment for node when the node is a FunctionDeclaration but its parent is an export", function() {

            var code = [
                "/** Desc*/",
                "export function Foo(){}"
            ].join("\n");

            /**
             * Check jsdoc presence
             * @param {ASTNode} node not to check
             * @returns {void}
             * @private
             */
            function assertJSDoc(node) {
                var sourceCode = eslint.getSourceCode();
                var jsdoc = sourceCode.getJSDocComment(node);
                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Desc");
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionDeclaration", spy);
            eslint.verify(code, { parserOptions: { sourceType: "module" }, rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });


        it("should get JSDoc comment for node when the node is a FunctionDeclaration but not the first statement", function() {

            var code = [
                "'use strict';",
                "/** Desc*/",
                "function Foo(){}"
            ].join("\n");

            /**
             * Check jsdoc presence
             * @param {ASTNode} node not to check
             * @returns {void}
             * @private
             */
            function assertJSDoc(node) {
                var sourceCode = eslint.getSourceCode();
                var jsdoc = sourceCode.getJSDocComment(node);
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

            /**
             * Check jsdoc presence
             * @param {ASTNode} node not to check
             * @returns {void}
             * @private
             */
            function assertJSDoc(node) {
                var sourceCode = eslint.getSourceCode();
                var jsdoc = sourceCode.getJSDocComment(node);
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

            /**
             * Check jsdoc presence
             * @param {ASTNode} node not to check
             * @returns {void}
             * @private
             */
            function assertJSDoc(node) {
                var sourceCode = eslint.getSourceCode();
                var jsdoc = sourceCode.getJSDocComment(node);
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

            /**
             * Check jsdoc presence
             * @param {ASTNode} node not to check
             * @returns {void}
             * @private
             */
            function assertJSDoc(node) {
                var sourceCode = eslint.getSourceCode();
                var jsdoc = sourceCode.getJSDocComment(node);
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
                "foo: function(){}",
                "};"
            ].join("\n");

            /**
             * Check jsdoc presence
             * @param {ASTNode} node not to check
             * @returns {void}
             * @private
             */
            function assertJSDoc(node) {
                var sourceCode = eslint.getSourceCode();
                var jsdoc = sourceCode.getJSDocComment(node);
                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Desc");
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a ArrowFunctionExpression inside of an object literal", function() {

            var code = [
                "/** Code is good */",
                "var o = {",
                "/** Desc*/",
                "foo: () => {}",
                "};"
            ].join("\n");

            /**
             * Check jsdoc presence
             * @param {ASTNode} node not to check
             * @returns {void}
             * @private
             */
            function assertJSDoc(node) {
                var sourceCode = eslint.getSourceCode();
                var jsdoc = sourceCode.getJSDocComment(node);
                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Desc");
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("ArrowFunctionExpression", spy);
            eslint.verify(code, { parserOptions: { ecmaVersion: 6 }, rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a FunctionExpression in an assignment", function() {

            var code = [
                "/** Code is good */",
                "/** Desc*/",
                "Foo.bar = function(){}"
            ].join("\n");

            /**
             * Check jsdoc presence
             * @param {ASTNode} node not to check
             * @returns {void}
             * @private
             */
            function assertJSDoc(node) {
                var sourceCode = eslint.getSourceCode();
                var jsdoc = sourceCode.getJSDocComment(node);
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
                "Foo.bar = function(){}",
                "}());"
            ].join("\n");

            /**
             * Check jsdoc presence
             * @param {ASTNode} node not to check
             * @returns {void}
             * @private
             */
            function assertJSDoc(node) {
                if (!node.id) {
                    var sourceCode = eslint.getSourceCode();
                    var jsdoc = sourceCode.getJSDocComment(node);
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
                "Foo.bar = function(){}",
                "}());"
            ].join("\n");

            /**
             * Check jsdoc presence
             * @param {ASTNode} node not to check
             * @returns {void}
             * @private
             */
            function assertJSDoc(node) {
                if (!node.id) {
                    var sourceCode = eslint.getSourceCode();
                    var jsdoc = sourceCode.getJSDocComment(node);
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

            /**
             * Check jsdoc presence
             * @param {ASTNode} node not to check
             * @returns {void}
             * @private
             */
            function assertJSDoc(node) {
                if (!node.id) {
                    var sourceCode = eslint.getSourceCode();
                    var jsdoc = sourceCode.getJSDocComment(node);
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

            /**
             * Check jsdoc presence
             * @param {ASTNode} node not to check
             * @returns {void}
             * @private
             */
            function assertJSDoc(node) {
                if (node.id) {
                    var sourceCode = eslint.getSourceCode();
                    var jsdoc = sourceCode.getJSDocComment(node);
                    assert.isNull(jsdoc);
                }
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledTwice, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a ClassExpression", function() {

            var code = [
                "/** Merges two objects together.*/",
                "var A = class {",
                "};"
            ].join("\n");

            /**
             * Check jsdoc presence
             * @param {ASTNode} node not to check
             * @returns {void}
             * @private
             */
            function assertJSDoc(node) {
                var sourceCode = eslint.getSourceCode();
                var jsdoc = sourceCode.getJSDocComment(node);
                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Merges two objects together.");
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("ClassExpression", spy);
            eslint.verify(code, { rules: {}, parserOptions: { ecmaVersion: 6 }}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a ClassDeclaration", function() {

            var code = [
                "/** Merges two objects together.*/",
                "class A {",
                "};"
            ].join("\n");

            /**
             * Check jsdoc presence
             * @param {ASTNode} node not to check
             * @returns {void}
             * @private
             */
            function assertJSDoc(node) {
                var sourceCode = eslint.getSourceCode();
                var jsdoc = sourceCode.getJSDocComment(node);
                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Merges two objects together.");
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("ClassDeclaration", spy);
            eslint.verify(code, { rules: {}, parserOptions: { ecmaVersion: 6 }}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should not get JSDoc comment for class method even if the class has jsdoc present", function() {

            var code = [
                "/** Merges two objects together.*/",
                "var A = class {",
                "    constructor(xs) {}",
                "};"
            ].join("\n");

            /**
             * Check jsdoc presence
             * @param {ASTNode} node not to check
             * @returns {void}
             * @private
             */
            function assertJSDoc(node) {
                var sourceCode = eslint.getSourceCode();
                var jsdoc = sourceCode.getJSDocComment(node);
                assert.isNull(jsdoc);
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}, parserOptions: { ecmaVersion: 6 }}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for function expression even if function has blank lines on top", function() {

            var code = [
                "/** Merges two objects together.*/",
                "var A = ",
                " ",
                " ",
                " ",
                "     function() {",
                "};"
            ].join("\n");

            /**
             * Check jsdoc presence
             * @param {ASTNode} node not to check
             * @returns {void}
             * @private
             */
            function assertJSDoc(node) {
                var sourceCode = eslint.getSourceCode();
                var jsdoc = sourceCode.getJSDocComment(node);
                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Merges two objects together.");
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}, parserOptions: { ecmaVersion: 6 }}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should not get JSDoc comment for function declaration when the function has blank lines on top", function() {

            var code = [
                "/** Merges two objects together.*/",
                " ",
                " ",
                " ",
                "function test() {",
                "};"
            ].join("\n");

            /**
             * Check jsdoc presence
             * @param {ASTNode} node not to check
             * @returns {void}
             * @private
             */
            function assertJSDoc(node) {
                var sourceCode = eslint.getSourceCode();
                var jsdoc = sourceCode.getJSDocComment(node);
                assert.isNull(jsdoc);
            }

            var spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionDeclaration", spy);
            eslint.verify(code, { rules: {}, parserOptions: { ecmaVersion: 6 }}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

    });

    describe("getComments()", function() {
        var code = [
            "// my line comment",
            "var a = 42;",
            "/* my block comment */"
        ].join("\n");

        it("should attach them to all nodes", function() {
            /**
             * Check comment count
             * @param {int} leading Leading comment count
             * @param {int} trailing Trailing comment count
             * @returns {Function} function to execute
             * @private
             */
            function assertCommentCount(leading, trailing) {
                return function(node) {
                    var sourceCode = eslint.getSourceCode();
                    var comments = sourceCode.getComments(node);
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

            eslint.verify(code, config, "", true);
        });

    });

    describe("getLines()", function() {

        it("should get proper lines when using \\n as a line break", function() {
            var code = "a;\nb;",
                ast = espree.parse(code, DEFAULT_CONFIG),
                sourceCode = new SourceCode(code, ast);

            var lines = sourceCode.getLines();
            assert.equal(lines[0], "a;");
            assert.equal(lines[1], "b;");
        });

        it("should get proper lines when using \\r\\n as a line break", function() {
            var code = "a;\r\nb;",
                ast = espree.parse(code, DEFAULT_CONFIG),
                sourceCode = new SourceCode(code, ast);

            var lines = sourceCode.getLines();
            assert.equal(lines[0], "a;");
            assert.equal(lines[1], "b;");
        });

        it("should get proper lines when using \\r as a line break", function() {
            var code = "a;\rb;",
                ast = espree.parse(code, DEFAULT_CONFIG),
                sourceCode = new SourceCode(code, ast);

            var lines = sourceCode.getLines();
            assert.equal(lines[0], "a;");
            assert.equal(lines[1], "b;");
        });

        it("should get proper lines when using \\u2028 as a line break", function() {
            var code = "a;\u2028b;",
                ast = espree.parse(code, DEFAULT_CONFIG),
                sourceCode = new SourceCode(code, ast);

            var lines = sourceCode.getLines();
            assert.equal(lines[0], "a;");
            assert.equal(lines[1], "b;");
        });

        it("should get proper lines when using \\u2029 as a line break", function() {
            var code = "a;\u2029b;",
                ast = espree.parse(code, DEFAULT_CONFIG),
                sourceCode = new SourceCode(code, ast);

            var lines = sourceCode.getLines();
            assert.equal(lines[0], "a;");
            assert.equal(lines[1], "b;");
        });

    });

    describe("getText()", function() {

        var sourceCode,
            ast;

        beforeEach(function() {
            ast = espree.parse(TEST_CODE, DEFAULT_CONFIG);
            sourceCode = new SourceCode(TEST_CODE, ast);
        });

        it("should retrieve all text when used without parameters", function() {
            var text = sourceCode.getText();
            assert.equal(text, TEST_CODE);
        });

        it("should retrieve all text for root node", function() {
            var text = sourceCode.getText(ast);
            assert.equal(text, TEST_CODE);
        });

        it("should clamp to valid range when retrieving characters before start of source", function() {
            var text = sourceCode.getText(ast, 2, 0);
            assert.equal(text, TEST_CODE);
        });

        it("should retrieve all text for binary expression", function() {

            var node = ast.body[0].declarations[0].init;
            var text = sourceCode.getText(node);
            assert.equal(text, "6 * 7");
        });

        it("should retrieve all text plus two characters before for binary expression", function() {

            var node = ast.body[0].declarations[0].init;
            var text = sourceCode.getText(node, 2);
            assert.equal(text, "= 6 * 7");
        });

        it("should retrieve all text plus one character after for binary expression", function() {
            var node = ast.body[0].declarations[0].init;
            var text = sourceCode.getText(node, 0, 1);
            assert.equal(text, "6 * 7;");
        });

        it("should retrieve all text plus two characters before and one character after for binary expression", function() {
            var node = ast.body[0].declarations[0].init;
            var text = sourceCode.getText(node, 2, 1);
            assert.equal(text, "= 6 * 7;");
        });

    });


    describe("getNodeByRangeIndex()", function() {

        var sourceCode,
            ast;

        beforeEach(function() {
            ast = espree.parse(TEST_CODE, DEFAULT_CONFIG);
            sourceCode = new SourceCode(TEST_CODE, ast);
        });

        it("should retrieve a node starting at the given index", function() {
            var node = sourceCode.getNodeByRangeIndex(4);
            assert.equal(node.type, "Identifier");
        });

        it("should retrieve a node containing the given index", function() {
            var node = sourceCode.getNodeByRangeIndex(6);
            assert.equal(node.type, "Identifier");
        });

        it("should retrieve a node that is exactly the given index", function() {
            var node = sourceCode.getNodeByRangeIndex(13);
            assert.equal(node.type, "Literal");
            assert.equal(node.value, 6);
        });

        it("should retrieve a node ending with the given index", function() {
            var node = sourceCode.getNodeByRangeIndex(9);
            assert.equal(node.type, "Identifier");
        });

        it("should retrieve the deepest node containing the given index", function() {
            var node = sourceCode.getNodeByRangeIndex(14);
            assert.equal(node.type, "BinaryExpression");
            node = sourceCode.getNodeByRangeIndex(3);
            assert.equal(node.type, "VariableDeclaration");
        });

        it("should return null if the index is outside the range of any node", function() {
            var node = sourceCode.getNodeByRangeIndex(-1);
            assert.isNull(node);
            node = sourceCode.getNodeByRangeIndex(-99);
            assert.isNull(node);
        });

        it("should attach the node's parent", function() {
            var node = sourceCode.getNodeByRangeIndex(14);
            assert.property(node, "parent");
            assert.equal(node.parent.type, "VariableDeclarator");
        });

        it("should not modify the node when attaching the parent", function() {
            var node = sourceCode.getNodeByRangeIndex(10);
            assert.equal(node.type, "VariableDeclarator");
            node = sourceCode.getNodeByRangeIndex(4);
            assert.equal(node.type, "Identifier");
            assert.property(node, "parent");
            assert.equal(node.parent.type, "VariableDeclarator");
            assert.notProperty(node.parent, "parent");
        });

    });

    describe("isSpaceBetweenTokens()", function() {

        leche.withData([
            ["let foo = bar;", true],
            ["let  foo = bar;", true],
            ["let /**/ foo = bar;", true],
            ["let/**/foo = bar;", false],
            ["a+b", false],
            ["a/**/+b", false],
            ["a/* */+b", false],
            ["a/**/ +b", true],
            ["a/**/ /**/+b", true],
            ["a/**/\n/**/+b", true],
            ["a +b", true]
        ], function(code, expected) {

            it("should return true when there is one space between tokens", function() {
                var ast = espree.parse(code, DEFAULT_CONFIG),
                    sourceCode = new SourceCode(code, ast);

                assert.equal(
                    sourceCode.isSpaceBetweenTokens(
                        sourceCode.ast.tokens[0], sourceCode.ast.tokens[1]
                    ),
                    expected
                );
            });
        });
    });

    // need to check that eslint.verify() works with SourceCode

    describe("eslint.verify()", function() {

        var CONFIG = {
            parserOptions: { ecmaVersion: 6 }
        };

        it("should work when passed a SourceCode object without a config", function() {
            var ast = espree.parse(TEST_CODE, DEFAULT_CONFIG);

            var sourceCode = new SourceCode(TEST_CODE, ast),
                messages = eslint.verify(sourceCode);

            assert.equal(messages.length, 0);
        });

        it("should work when passed a SourceCode object containing ES6 syntax and config", function() {
            var sourceCode = new SourceCode("let foo = bar;", AST),
                messages = eslint.verify(sourceCode, CONFIG);

            assert.equal(messages.length, 0);
        });

        it("should report an error when using let and blockBindings is false", function() {
            var sourceCode = new SourceCode("let foo = bar;", AST),
                messages = eslint.verify(sourceCode, {
                    parserOptions: { ecmaVersion: 6 },
                    rules: { "no-unused-vars": 2 }
                });

            assert.equal(messages.length, 1);
            assert.equal(messages[0].message, "'foo' is defined but never used");
        });
    });
});
