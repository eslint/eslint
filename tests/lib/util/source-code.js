/**
 * @fileoverview Abstraction of JavaScript source code.
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const fs = require("fs"),
    path = require("path"),
    assert = require("chai").assert,
    espree = require("espree"),
    sinon = require("sinon"),
    leche = require("leche"),
    eslint = require("../../../lib/eslint"),
    SourceCode = require("../../../lib/util/source-code");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const DEFAULT_CONFIG = {
    ecmaVersion: 6,
    comment: true,
    tokens: true,
    range: true,
    loc: true
};

const AST = espree.parse("let foo = bar;", DEFAULT_CONFIG),
    TEST_CODE = "var answer = 6 * 7;";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("SourceCode", function() {

    describe("new SourceCode()", function() {

        it("should create a new instance when called with valid data", function() {
            const ast = { comments: [], tokens: [], loc: {}, range: [] };
            const sourceCode = new SourceCode("foo;", ast);

            assert.isObject(sourceCode);
            assert.equal(sourceCode.text, "foo;");
            assert.equal(sourceCode.ast, ast);
        });

        it("should split text into lines when called with valid data", function() {
            const ast = { comments: [], tokens: [], loc: {}, range: [] };
            const sourceCode = new SourceCode("foo;\nbar;", ast);

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
            const comments = [
                { range: [0, 2] },
                { range: [10, 12] }
            ];
            const tokens = [
                { range: [3, 8] },
                { range: [8, 10] },
                { range: [12, 20] }
            ];
            const sourceCode = new SourceCode("", { comments: comments, tokens: tokens, loc: {}, range: [] });

            const actual = sourceCode.tokensAndComments;
            const expected = [comments[0], tokens[0], tokens[1], comments[1], tokens[2]];

            assert.deepEqual(actual, expected);
        });

        describe("if a text has BOM,", function() {
            let sourceCode;

            beforeEach(function() {
                const ast = { comments: [], tokens: [], loc: {}, range: [] };

                sourceCode = new SourceCode("\uFEFFconsole.log('hello');", ast);
            });

            it("should has true at `hasBOM` property.", function() {
                assert.equal(sourceCode.hasBOM, true);
            });

            it("should not has BOM in `text` property.", function() {
                assert.equal(sourceCode.text, "console.log('hello');");
            });
        });

        describe("if a text doesn't have BOM,", function() {
            let sourceCode;

            beforeEach(function() {
                const ast = { comments: [], tokens: [], loc: {}, range: [] };

                sourceCode = new SourceCode("console.log('hello');", ast);
            });

            it("should has false at `hasBOM` property.", function() {
                assert.equal(sourceCode.hasBOM, false);
            });

            it("should not has BOM in `text` property.", function() {
                assert.equal(sourceCode.text, "console.log('hello');");
            });
        });

        describe("when it read a UTF-8 file (has BOM), SourceCode", function() {
            const UTF8_FILE = path.resolve(__dirname, "../../fixtures/utf8-bom.js");
            const text = fs.readFileSync(
                    UTF8_FILE,
                    "utf8"
                ).replace(/\r\n/g, "\n"); // <-- For autocrlf of "git for Windows"
            let sourceCode;

            beforeEach(function() {
                const ast = { comments: [], tokens: [], loc: {}, range: [] };

                sourceCode = new SourceCode(text, ast);
            });

            it("to be clear, check the file has UTF-8 BOM.", function() {
                const buffer = fs.readFileSync(UTF8_FILE);

                assert.equal(buffer[0], 0xEF);
                assert.equal(buffer[1], 0xBB);
                assert.equal(buffer[2], 0xBF);
            });

            it("should has true at `hasBOM` property.", function() {
                assert.equal(sourceCode.hasBOM, true);
            });

            it("should not has BOM in `text` property.", function() {
                assert.equal(
                    sourceCode.text,
                    "\"use strict\";\n\nconsole.log(\"This file has [0xEF, 0xBB, 0xBF] as BOM.\");\n");
            });
        });
    });


    describe("getJSDocComment()", function() {

        const sandbox = sinon.sandbox.create(),
            filename = "foo.js";

        beforeEach(function() {
            eslint.reset();
        });

        afterEach(function() {
            sandbox.verifyAndRestore();
        });

        it("should not take a JSDoc comment from a FunctionDeclaration parent node when the node is a FunctionExpression", function() {

            const code = [
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
                const sourceCode = eslint.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.equal(jsdoc, null);
            }

            const spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });

        it("should not take a JSDoc comment from a VariableDeclaration parent node when the node is a FunctionExpression inside a NewExpression", function() {

            const code = [
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
                const sourceCode = eslint.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.equal(jsdoc, null);
            }

            const spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });

        it("should not take a JSDoc comment from a FunctionExpression parent node when the node is a FunctionExpression", function() {

            const code = [
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
                    const sourceCode = eslint.getSourceCode();
                    const jsdoc = sourceCode.getJSDocComment(node);

                    assert.equal(jsdoc, null);
                }
            }

            const spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledTwice, "Event handler should be called twice.");

        });

        it("should get JSDoc comment for FunctionExpression in a CallExpression", function() {
            const code = [
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
                const sourceCode = eslint.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Documentation. ");
            }

            const spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, {rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a FunctionDeclaration", function() {

            const code = [
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
                const sourceCode = eslint.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Desc");
            }

            const spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionDeclaration", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });

        it("should get JSDoc comment for node when the node is a FunctionDeclaration but its parent is an export", function() {

            const code = [
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
                const sourceCode = eslint.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Desc");
            }

            const spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionDeclaration", spy);
            eslint.verify(code, { parserOptions: { sourceType: "module" }, rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });


        it("should get JSDoc comment for node when the node is a FunctionDeclaration but not the first statement", function() {

            const code = [
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
                const sourceCode = eslint.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Desc");
            }

            const spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionDeclaration", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });


        it("should not get JSDoc comment for node when the node is a FunctionDeclaration inside of an IIFE without a JSDoc comment", function() {

            const code = [
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
                const sourceCode = eslint.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.isNull(jsdoc);
            }

            const spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionDeclaration", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });

        it("should get JSDoc comment for node when the node is a FunctionDeclaration and there are multiple comments", function() {

            const code = [
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
                const sourceCode = eslint.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Desc");
            }

            const spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionDeclaration", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });

        it("should get JSDoc comment for node when the node is a FunctionDeclaration inside of an IIFE", function() {

            const code = [
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
                const sourceCode = eslint.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Desc");
            }

            const spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionDeclaration", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a FunctionExpression inside of an object literal", function() {

            const code = [
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
                const sourceCode = eslint.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Desc");
            }

            const spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a ArrowFunctionExpression inside of an object literal", function() {

            const code = [
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
                const sourceCode = eslint.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Desc");
            }

            const spy = sandbox.spy(assertJSDoc);

            eslint.on("ArrowFunctionExpression", spy);
            eslint.verify(code, { parserOptions: { ecmaVersion: 6 }, rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a FunctionExpression in an assignment", function() {

            const code = [
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
                const sourceCode = eslint.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Desc");
            }

            const spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a FunctionExpression in an assignment inside an IIFE", function() {

            const code = [
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
                    const sourceCode = eslint.getSourceCode();
                    const jsdoc = sourceCode.getJSDocComment(node);

                    assert.equal(jsdoc.type, "Block");
                    assert.equal(jsdoc.value, "* Desc");
                }
            }

            const spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledTwice, "Event handler should be called.");
        });

        it("should not get JSDoc comment for node when the node is a FunctionExpression in an assignment inside an IIFE without a JSDoc comment", function() {

            const code = [
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
                    const sourceCode = eslint.getSourceCode();
                    const jsdoc = sourceCode.getJSDocComment(node);

                    assert.isNull(jsdoc);
                }
            }

            const spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledTwice, "Event handler should be called.");
        });

        it("should not get JSDoc comment for node when the node is a FunctionExpression inside of a CallExpression", function() {

            const code = [
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
                    const sourceCode = eslint.getSourceCode();
                    const jsdoc = sourceCode.getJSDocComment(node);

                    assert.isNull(jsdoc);
                }
            }

            const spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should not get JSDoc comment for node when the node is a FunctionExpression in an assignment inside an IIFE without a JSDoc comment", function() {

            const code = [
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
                    const sourceCode = eslint.getSourceCode();
                    const jsdoc = sourceCode.getJSDocComment(node);

                    assert.isNull(jsdoc);
                }
            }

            const spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}}, filename, true);
            assert.isTrue(spy.calledTwice, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a ClassExpression", function() {

            const code = [
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
                const sourceCode = eslint.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Merges two objects together.");
            }

            const spy = sandbox.spy(assertJSDoc);

            eslint.on("ClassExpression", spy);
            eslint.verify(code, { rules: {}, parserOptions: { ecmaVersion: 6 }}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a ClassDeclaration", function() {

            const code = [
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
                const sourceCode = eslint.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Merges two objects together.");
            }

            const spy = sandbox.spy(assertJSDoc);

            eslint.on("ClassDeclaration", spy);
            eslint.verify(code, { rules: {}, parserOptions: { ecmaVersion: 6 }}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should not get JSDoc comment for class method even if the class has jsdoc present", function() {

            const code = [
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
                const sourceCode = eslint.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.isNull(jsdoc);
            }

            const spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}, parserOptions: { ecmaVersion: 6 }}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for function expression even if function has blank lines on top", function() {

            const code = [
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
                const sourceCode = eslint.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.equal(jsdoc.type, "Block");
                assert.equal(jsdoc.value, "* Merges two objects together.");
            }

            const spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionExpression", spy);
            eslint.verify(code, { rules: {}, parserOptions: { ecmaVersion: 6 }}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should not get JSDoc comment for function declaration when the function has blank lines on top", function() {

            const code = [
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
                const sourceCode = eslint.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.isNull(jsdoc);
            }

            const spy = sandbox.spy(assertJSDoc);

            eslint.on("FunctionDeclaration", spy);
            eslint.verify(code, { rules: {}, parserOptions: { ecmaVersion: 6 }}, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

    });

    describe("getComments()", function() {
        const config = { rules: {} };

        /**
         * Check comment count
         * @param {int} leading Leading comment count
         * @param {int} trailing Trailing comment count
         * @returns {Function} function to execute
         * @private
         */
        function assertCommentCount(leading, trailing) {
            return function(node) {
                const sourceCode = eslint.getSourceCode();
                const comments = sourceCode.getComments(node);

                assert.equal(comments.leading.length, leading);
                assert.equal(comments.trailing.length, trailing);
            };
        }

        it("should attach them to all nodes", function() {
            const code = [
                "// my line comment",
                "var a = 42;",
                "/* my block comment */"
            ].join("\n");

            eslint.reset();
            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("VariableDeclaration", assertCommentCount(1, 1));
            eslint.on("VariableDeclarator", assertCommentCount(0, 0));
            eslint.on("Identifier", assertCommentCount(0, 0));
            eslint.on("Literal", assertCommentCount(0, 0));

            eslint.verify(code, config, "", true);
        });

        it("should not attach leading comments from previous node", function() {
            const code = [
                "function a() {",
                "    var b = {",
                "        // comment",
                "    };",
                "    return b;",
                "}"
            ].join("\n");

            eslint.reset();
            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("Identifier", assertCommentCount(0, 0));
            eslint.on("BlockStatement", assertCommentCount(0, 0));
            eslint.on("VariableDeclaration", assertCommentCount(0, 0));
            eslint.on("VariableDeclarator", assertCommentCount(0, 0));
            eslint.on("ObjectExpression", assertCommentCount(0, 1));
            eslint.on("ReturnStatement", assertCommentCount(0, 0));

            eslint.verify(code, config, "", true);
        });

        it("should not attach duplicate leading comments from previous node", function() {
            const code = [
                "//foo",
                "var zzz /*aaa*/ = 777;",
                "//bar"
            ].join("\n");

            eslint.reset();
            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("VariableDeclaration", assertCommentCount(1, 1));
            eslint.on("VariableDeclarator", assertCommentCount(0, 0));
            eslint.on("Identifier", assertCommentCount(0, 1));
            eslint.on("Literal", assertCommentCount(1, 0));

            eslint.verify(code, config, "", true);
        });
    });

    describe("getLines()", function() {

        it("should get proper lines when using \\n as a line break", function() {
            const code = "a;\nb;",
                ast = espree.parse(code, DEFAULT_CONFIG),
                sourceCode = new SourceCode(code, ast);

            const lines = sourceCode.getLines();

            assert.equal(lines[0], "a;");
            assert.equal(lines[1], "b;");
        });

        it("should get proper lines when using \\r\\n as a line break", function() {
            const code = "a;\r\nb;",
                ast = espree.parse(code, DEFAULT_CONFIG),
                sourceCode = new SourceCode(code, ast);

            const lines = sourceCode.getLines();

            assert.equal(lines[0], "a;");
            assert.equal(lines[1], "b;");
        });

        it("should get proper lines when using \\r as a line break", function() {
            const code = "a;\rb;",
                ast = espree.parse(code, DEFAULT_CONFIG),
                sourceCode = new SourceCode(code, ast);

            const lines = sourceCode.getLines();

            assert.equal(lines[0], "a;");
            assert.equal(lines[1], "b;");
        });

        it("should get proper lines when using \\u2028 as a line break", function() {
            const code = "a;\u2028b;",
                ast = espree.parse(code, DEFAULT_CONFIG),
                sourceCode = new SourceCode(code, ast);

            const lines = sourceCode.getLines();

            assert.equal(lines[0], "a;");
            assert.equal(lines[1], "b;");
        });

        it("should get proper lines when using \\u2029 as a line break", function() {
            const code = "a;\u2029b;",
                ast = espree.parse(code, DEFAULT_CONFIG),
                sourceCode = new SourceCode(code, ast);

            const lines = sourceCode.getLines();

            assert.equal(lines[0], "a;");
            assert.equal(lines[1], "b;");
        });

    });

    describe("getText()", function() {

        let sourceCode,
            ast;

        beforeEach(function() {
            ast = espree.parse(TEST_CODE, DEFAULT_CONFIG);
            sourceCode = new SourceCode(TEST_CODE, ast);
        });

        it("should retrieve all text when used without parameters", function() {
            const text = sourceCode.getText();

            assert.equal(text, TEST_CODE);
        });

        it("should retrieve all text for root node", function() {
            const text = sourceCode.getText(ast);

            assert.equal(text, TEST_CODE);
        });

        it("should clamp to valid range when retrieving characters before start of source", function() {
            const text = sourceCode.getText(ast, 2, 0);

            assert.equal(text, TEST_CODE);
        });

        it("should retrieve all text for binary expression", function() {

            const node = ast.body[0].declarations[0].init;
            const text = sourceCode.getText(node);

            assert.equal(text, "6 * 7");
        });

        it("should retrieve all text plus two characters before for binary expression", function() {

            const node = ast.body[0].declarations[0].init;
            const text = sourceCode.getText(node, 2);

            assert.equal(text, "= 6 * 7");
        });

        it("should retrieve all text plus one character after for binary expression", function() {
            const node = ast.body[0].declarations[0].init;
            const text = sourceCode.getText(node, 0, 1);

            assert.equal(text, "6 * 7;");
        });

        it("should retrieve all text plus two characters before and one character after for binary expression", function() {
            const node = ast.body[0].declarations[0].init;
            const text = sourceCode.getText(node, 2, 1);

            assert.equal(text, "= 6 * 7;");
        });

    });


    describe("getNodeByRangeIndex()", function() {

        let sourceCode;

        beforeEach(function() {
            const ast = espree.parse(TEST_CODE, DEFAULT_CONFIG);

            sourceCode = new SourceCode(TEST_CODE, ast);
        });

        it("should retrieve a node starting at the given index", function() {
            const node = sourceCode.getNodeByRangeIndex(4);

            assert.equal(node.type, "Identifier");
        });

        it("should retrieve a node containing the given index", function() {
            const node = sourceCode.getNodeByRangeIndex(6);

            assert.equal(node.type, "Identifier");
        });

        it("should retrieve a node that is exactly the given index", function() {
            const node = sourceCode.getNodeByRangeIndex(13);

            assert.equal(node.type, "Literal");
            assert.equal(node.value, 6);
        });

        it("should retrieve a node ending with the given index", function() {
            const node = sourceCode.getNodeByRangeIndex(9);

            assert.equal(node.type, "Identifier");
        });

        it("should retrieve the deepest node containing the given index", function() {
            let node = sourceCode.getNodeByRangeIndex(14);

            assert.equal(node.type, "BinaryExpression");
            node = sourceCode.getNodeByRangeIndex(3);
            assert.equal(node.type, "VariableDeclaration");
        });

        it("should return null if the index is outside the range of any node", function() {
            let node = sourceCode.getNodeByRangeIndex(-1);

            assert.isNull(node);
            node = sourceCode.getNodeByRangeIndex(-99);
            assert.isNull(node);
        });

        it("should attach the node's parent", function() {
            const node = sourceCode.getNodeByRangeIndex(14);

            assert.property(node, "parent");
            assert.equal(node.parent.type, "VariableDeclarator");
        });

        it("should not modify the node when attaching the parent", function() {
            let node = sourceCode.getNodeByRangeIndex(10);

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
                const ast = espree.parse(code, DEFAULT_CONFIG),
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

        const CONFIG = {
            parserOptions: { ecmaVersion: 6 }
        };

        it("should work when passed a SourceCode object without a config", function() {
            const ast = espree.parse(TEST_CODE, DEFAULT_CONFIG);

            const sourceCode = new SourceCode(TEST_CODE, ast),
                messages = eslint.verify(sourceCode);

            assert.equal(messages.length, 0);
        });

        it("should work when passed a SourceCode object containing ES6 syntax and config", function() {
            const sourceCode = new SourceCode("let foo = bar;", AST),
                messages = eslint.verify(sourceCode, CONFIG);

            assert.equal(messages.length, 0);
        });

        it("should report an error when using let and blockBindings is false", function() {
            const sourceCode = new SourceCode("let foo = bar;", AST),
                messages = eslint.verify(sourceCode, {
                    parserOptions: { ecmaVersion: 6 },
                    rules: { "no-unused-vars": 2 }
                });

            assert.equal(messages.length, 1);
            assert.equal(messages[0].message, "'foo' is defined but never used.");
        });
    });
});
