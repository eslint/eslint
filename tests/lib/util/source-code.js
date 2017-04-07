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
    SourceCode = require("../../../lib/util/source-code"),
    astUtils = require("../../../lib/ast-utils");

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
    TEST_CODE = "var answer = 6 * 7;",
    SHEBANG_TEST_CODE = `#!/usr/bin/env node\n${TEST_CODE}`;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("SourceCode", () => {

    describe("new SourceCode()", () => {

        it("should create a new instance when called with valid data", () => {
            const ast = { comments: [], tokens: [], loc: {}, range: [] };
            const sourceCode = new SourceCode("foo;", ast);

            assert.isObject(sourceCode);
            assert.equal(sourceCode.text, "foo;");
            assert.equal(sourceCode.ast, ast);
        });

        it("should split text into lines when called with valid data", () => {
            const ast = { comments: [], tokens: [], loc: {}, range: [] };
            const sourceCode = new SourceCode("foo;\nbar;", ast);

            assert.isObject(sourceCode);
            assert.equal(sourceCode.lines.length, 2);
            assert.equal(sourceCode.lines[0], "foo;");
            assert.equal(sourceCode.lines[1], "bar;");
        });

        /* eslint-disable no-new */

        it("should throw an error when called with an AST that's missing tokens", () => {

            assert.throws(() => {
                new SourceCode("foo;", { comments: [], loc: {}, range: [] });
            }, /missing the tokens array/);

        });

        it("should throw an error when called with an AST that's missing comments", () => {

            assert.throws(() => {
                new SourceCode("foo;", { tokens: [], loc: {}, range: [] });
            }, /missing the comments array/);

        });

        it("should throw an error when called with an AST that's missing location", () => {

            assert.throws(() => {
                new SourceCode("foo;", { comments: [], tokens: [], range: [] });
            }, /missing location information/);

        });

        it("should throw an error when called with an AST that's missing range", () => {

            assert.throws(() => {
                new SourceCode("foo;", { comments: [], tokens: [], loc: {} });
            }, /missing range information/);
        });

        it("should store all tokens and comments sorted by range", () => {
            const comments = [
                { range: [0, 2] },
                { range: [10, 12] }
            ];
            const tokens = [
                { range: [3, 8] },
                { range: [8, 10] },
                { range: [12, 20] }
            ];
            const sourceCode = new SourceCode("", { comments, tokens, loc: {}, range: [] });

            const actual = sourceCode.tokensAndComments;
            const expected = [comments[0], tokens[0], tokens[1], comments[1], tokens[2]];

            assert.deepEqual(actual, expected);
        });

        describe("if a text has BOM,", () => {
            let sourceCode;

            beforeEach(() => {
                const ast = { comments: [], tokens: [], loc: {}, range: [] };

                sourceCode = new SourceCode("\uFEFFconsole.log('hello');", ast);
            });

            it("should has true at `hasBOM` property.", () => {
                assert.equal(sourceCode.hasBOM, true);
            });

            it("should not has BOM in `text` property.", () => {
                assert.equal(sourceCode.text, "console.log('hello');");
            });
        });

        describe("if a text doesn't have BOM,", () => {
            let sourceCode;

            beforeEach(() => {
                const ast = { comments: [], tokens: [], loc: {}, range: [] };

                sourceCode = new SourceCode("console.log('hello');", ast);
            });

            it("should has false at `hasBOM` property.", () => {
                assert.equal(sourceCode.hasBOM, false);
            });

            it("should not has BOM in `text` property.", () => {
                assert.equal(sourceCode.text, "console.log('hello');");
            });
        });

        describe("when a text has a shebang", () => {
            let sourceCode;

            beforeEach(() => {
                const ast = { comments: [{ type: "Line", value: "/usr/bin/env node", range: [0, 19] }], tokens: [], loc: {}, range: [] };

                sourceCode = new SourceCode(SHEBANG_TEST_CODE, ast);
            });

            it("should change the type of the first comment to \"Shebang\"", () => {
                const firstToken = sourceCode.getAllComments()[0];

                assert.equal(firstToken.type, "Shebang");
            });
        });

        describe("when a text does not have a shebang", () => {
            it("should not change the type of the first comment", () => {
                const ast = { comments: [{ type: "Line", value: "comment", range: [0, 9] }], tokens: [], loc: {}, range: [] };
                const sourceCode = new SourceCode("//comment\nconsole.log('hello');", ast);
                const firstToken = sourceCode.getAllComments()[0];

                assert.equal(firstToken.type, "Line");
            });
        });

        describe("when it read a UTF-8 file (has BOM), SourceCode", () => {
            const UTF8_FILE = path.resolve(__dirname, "../../fixtures/utf8-bom.js");
            const text = fs.readFileSync(
                UTF8_FILE,
                "utf8"
            ).replace(/\r\n/g, "\n"); // <-- For autocrlf of "git for Windows"
            let sourceCode;

            beforeEach(() => {
                const ast = { comments: [], tokens: [], loc: {}, range: [] };

                sourceCode = new SourceCode(text, ast);
            });

            it("to be clear, check the file has UTF-8 BOM.", () => {
                const buffer = fs.readFileSync(UTF8_FILE);

                assert.equal(buffer[0], 0xEF);
                assert.equal(buffer[1], 0xBB);
                assert.equal(buffer[2], 0xBF);
            });

            it("should has true at `hasBOM` property.", () => {
                assert.equal(sourceCode.hasBOM, true);
            });

            it("should not has BOM in `text` property.", () => {
                assert.equal(
                    sourceCode.text,
                    "\"use strict\";\n\nconsole.log(\"This file has [0xEF, 0xBB, 0xBF] as BOM.\");\n");
            });
        });
    });


    describe("getJSDocComment()", () => {

        const sandbox = sinon.sandbox.create(),
            filename = "foo.js";

        beforeEach(() => {
            eslint.reset();
        });

        afterEach(() => {
            sandbox.verifyAndRestore();
        });

        it("should not take a JSDoc comment from a FunctionDeclaration parent node when the node is a FunctionExpression", () => {

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
            eslint.verify(code, { rules: {} }, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });

        it("should not take a JSDoc comment from a VariableDeclaration parent node when the node is a FunctionExpression inside a NewExpression", () => {

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
            eslint.verify(code, { rules: {} }, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });

        it("should not take a JSDoc comment from a FunctionExpression parent node when the node is a FunctionExpression", () => {

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
            eslint.verify(code, { rules: {} }, filename, true);
            assert.isTrue(spy.calledTwice, "Event handler should be called twice.");

        });

        it("should get JSDoc comment for FunctionExpression in a CallExpression", () => {
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
            eslint.verify(code, { rules: {} }, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a FunctionDeclaration", () => {

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
            eslint.verify(code, { rules: {} }, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });

        it("should get JSDoc comment for node when the node is a FunctionDeclaration but its parent is an export", () => {

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
            eslint.verify(code, { parserOptions: { sourceType: "module" }, rules: {} }, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });


        it("should get JSDoc comment for node when the node is a FunctionDeclaration but not the first statement", () => {

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
            eslint.verify(code, { rules: {} }, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });


        it("should not get JSDoc comment for node when the node is a FunctionDeclaration inside of an IIFE without a JSDoc comment", () => {

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
            eslint.verify(code, { rules: {} }, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });

        it("should get JSDoc comment for node when the node is a FunctionDeclaration and there are multiple comments", () => {

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
            eslint.verify(code, { rules: {} }, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");

        });

        it("should get JSDoc comment for node when the node is a FunctionDeclaration inside of an IIFE", () => {

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
            eslint.verify(code, { rules: {} }, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a FunctionExpression inside of an object literal", () => {

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
            eslint.verify(code, { rules: {} }, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a ArrowFunctionExpression inside of an object literal", () => {

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
            eslint.verify(code, { parserOptions: { ecmaVersion: 6 }, rules: {} }, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a FunctionExpression in an assignment", () => {

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
            eslint.verify(code, { rules: {} }, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a FunctionExpression in an assignment inside an IIFE", () => {

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
            eslint.verify(code, { rules: {} }, filename, true);
            assert.isTrue(spy.calledTwice, "Event handler should be called.");
        });

        it("should not get JSDoc comment for node when the node is a FunctionExpression in an assignment inside an IIFE without a JSDoc comment", () => {

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
            eslint.verify(code, { rules: {} }, filename, true);
            assert.isTrue(spy.calledTwice, "Event handler should be called.");
        });

        it("should not get JSDoc comment for node when the node is a FunctionExpression inside of a CallExpression", () => {

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
            eslint.verify(code, { rules: {} }, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should not get JSDoc comment for node when the node is a FunctionExpression in an assignment inside an IIFE without a JSDoc comment", () => {

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
            eslint.verify(code, { rules: {} }, filename, true);
            assert.isTrue(spy.calledTwice, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a ClassExpression", () => {

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
            eslint.verify(code, { rules: {}, parserOptions: { ecmaVersion: 6 } }, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for node when the node is a ClassDeclaration", () => {

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
            eslint.verify(code, { rules: {}, parserOptions: { ecmaVersion: 6 } }, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should not get JSDoc comment for class method even if the class has jsdoc present", () => {

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
            eslint.verify(code, { rules: {}, parserOptions: { ecmaVersion: 6 } }, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should get JSDoc comment for function expression even if function has blank lines on top", () => {

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
            eslint.verify(code, { rules: {}, parserOptions: { ecmaVersion: 6 } }, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

        it("should not get JSDoc comment for function declaration when the function has blank lines on top", () => {

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
            eslint.verify(code, { rules: {}, parserOptions: { ecmaVersion: 6 } }, filename, true);
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

    });

    describe("getComments()", () => {
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

        beforeEach(() => {
            eslint.reset();
        });

        it("should return comments around nodes", () => {
            const code = [
                "// Leading comment for VariableDeclaration",
                "var a = 42;",
                "/* Trailing comment for VariableDeclaration */"
            ].join("\n");

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("VariableDeclaration", assertCommentCount(1, 1));
            eslint.on("VariableDeclarator", assertCommentCount(0, 0));
            eslint.on("Identifier", assertCommentCount(0, 0));
            eslint.on("Literal", assertCommentCount(0, 0));

            eslint.verify(code, config, "", true);
        });

        it("should return trailing comments inside a block", () => {
            const code = [
                "{",
                "    a();",
                "    // Trailing comment for ExpressionStatement",
                "}"
            ].join("\n");

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("BlockStatement", assertCommentCount(0, 0));
            eslint.on("ExpressionStatement", assertCommentCount(0, 1));
            eslint.on("CallExpression", assertCommentCount(0, 0));
            eslint.on("Identifier", assertCommentCount(0, 0));

            eslint.verify(code, config, "", true);
        });

        it("should return comments within a conditional", () => {
            const code = [
                "/* Leading comment for IfStatement */",
                "if (/* Leading comment for Identifier */ a) {}"
            ].join("\n");

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("IfStatement", assertCommentCount(1, 0));
            eslint.on("Identifier", assertCommentCount(1, 0));
            eslint.on("BlockStatement", assertCommentCount(0, 0));

            eslint.verify(code, config, "", true);
        });

        it("should not return comments within a previous node", () => {
            const code = [
                "function a() {",
                "    var b = {",
                "        // Trailing comment for ObjectExpression",
                "    };",
                "    return b;",
                "}"
            ].join("\n");

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("Identifier", assertCommentCount(0, 0));
            eslint.on("BlockStatement", assertCommentCount(0, 0));
            eslint.on("VariableDeclaration", assertCommentCount(0, 0));
            eslint.on("VariableDeclarator", assertCommentCount(0, 0));
            eslint.on("ObjectExpression", assertCommentCount(0, 1));
            eslint.on("ReturnStatement", assertCommentCount(0, 0));

            eslint.verify(code, config, "", true);
        });

        it("should return comments only for children of parent node", () => {
            const code = [
                "var foo = {",
                "    bar: 'bar'",
                "    // Trailing comment for Property",
                "};",
                "var baz;"
            ].join("\n");

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("VariableDeclaration", assertCommentCount(0, 0));
            eslint.on("VariableDeclerator", assertCommentCount(0, 0));
            eslint.on("Identifier", assertCommentCount(0, 0));
            eslint.on("ObjectExpression", assertCommentCount(0, 0));
            eslint.on("Property", assertCommentCount(0, 1));
            eslint.on("Literal", assertCommentCount(0, 0));

            eslint.verify(code, config, "", true);
        });

        it("should return comments for an export default anonymous class", () => {
            const code = [
                "/**",
                " * Leading comment for ExportDefaultDeclaration",
                " */",
                "export default class {",
                "    /**",
                "     * Leading comment for MethodDefinition",
                "     */",
                "    method1(){",
                "    }",
                "}"
            ].join("\n");

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("ExportDefaultDeclaration", assertCommentCount(1, 0));
            eslint.on("ClassDeclaration", assertCommentCount(0, 0));
            eslint.on("ClassBody", assertCommentCount(0, 0));
            eslint.on("MethodDefinition", assertCommentCount(1, 0));
            eslint.on("Identifier", assertCommentCount(0, 0));
            eslint.on("FunctionExpression", assertCommentCount(0, 0));
            eslint.on("BlockStatement", assertCommentCount(0, 0));

            eslint.verify(code, config, "", true);
        });

        it("should return leading comments", () => {
            const code = [
                "// Leading comment for first VariableDeclaration",
                "var a;",
                "// Leading comment for previous VariableDeclaration and trailing comment for next VariableDeclaration",
                "var b;"
            ].join("\n");
            let varDeclCount = 0;

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("VariableDeclaration", node => {
                if (varDeclCount === 0) {
                    assertCommentCount(1, 1)(node);
                } else {
                    assertCommentCount(1, 0)(node);
                }
                varDeclCount++;
            });
            eslint.on("VariableDeclarator", assertCommentCount(0, 0));
            eslint.on("Identifier", assertCommentCount(0, 0));

            eslint.verify(code, config, "", true);
        });

        it("should return shebang comments", () => {
            const code = [
                "#!/usr/bin/env node", // Leading comment for following VariableDeclaration
                "var a;",
                "// Leading comment for previous VariableDeclaration and trailing comment for next VariableDeclaration",
                "var b;"
            ].join("\n");
            let varDeclCount = 0;

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("VariableDeclaration", node => {
                if (varDeclCount === 0) {
                    assertCommentCount(1, 1)(node);
                } else {
                    assertCommentCount(1, 0)(node);
                }
                varDeclCount++;
            });
            eslint.on("VariableDeclarator", assertCommentCount(0, 0));
            eslint.on("Identifier", assertCommentCount(0, 0));

            eslint.verify(code, config, "", true);
        });

        it("should include shebang comment when program only contains shebang", () => {
            const code = "#!/usr/bin/env node";

            eslint.on("Program", assertCommentCount(1, 0));
            eslint.verify(code, config, "", true);
        });

        it("should return mixture of line and block comments", () => {
            const code = [
                "// Leading comment for VariableDeclaration",
                "var zzz /* Trailing comment for Identifier */ = 777;",
                "// Trailing comment for VariableDeclaration"
            ].join("\n");

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("VariableDeclaration", assertCommentCount(1, 1));
            eslint.on("VariableDeclarator", assertCommentCount(0, 0));
            eslint.on("Identifier", assertCommentCount(0, 1));
            eslint.on("Literal", assertCommentCount(0, 0));

            eslint.verify(code, config, "", true);
        });

        it("should return comments surrounding a call expression", () => {
            const code = [
                "function a() {",
                "    /* Leading comment for ExpressionStatement */",
                "    foo();",
                "    /* Trailing comment for ExpressionStatement */",
                "}"
            ].join("\n");

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("FunctionDeclaration", assertCommentCount(0, 0));
            eslint.on("Identifier", assertCommentCount(0, 0));
            eslint.on("BlockStatement", assertCommentCount(0, 0));
            eslint.on("ExpressionStatement", assertCommentCount(1, 1));
            eslint.on("CallExpression", assertCommentCount(0, 0));

            eslint.verify(code, config, "", true);
        });

        it("should return comments surrounding a debugger statement", () => {
            const code = [
                "function a() {",
                "    /* Leading comment for DebuggerStatement */",
                "    debugger;",
                "    /* Trailing comment for DebuggerStatement */",
                "}"
            ].join("\n");

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("FunctionDeclaration", assertCommentCount(0, 0));
            eslint.on("Identifier", assertCommentCount(0, 0));
            eslint.on("BlockStatement", assertCommentCount(0, 0));
            eslint.on("DebuggerStatement", assertCommentCount(1, 1));

            eslint.verify(code, config, "", true);
        });

        it("should return comments surrounding a return statement", () => {
            const code = [
                "function a() {",
                "    /* Leading comment for ReturnStatement */",
                "    return;",
                "    /* Trailing comment for ReturnStatement */",
                "}"
            ].join("\n");

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("FunctionDeclaration", assertCommentCount(0, 0));
            eslint.on("Identifier", assertCommentCount(0, 0));
            eslint.on("BlockStatement", assertCommentCount(0, 0));
            eslint.on("ReturnStatement", assertCommentCount(1, 1));

            eslint.verify(code, config, "", true);
        });

        it("should return comments surrounding a throw statement", () => {
            const code = [
                "function a() {",
                "    /* Leading comment for ThrowStatement */",
                "    throw 55;",
                "    /* Trailing comment for ThrowStatement */",
                "}"
            ].join("\n");

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("FunctionDeclaration", assertCommentCount(0, 0));
            eslint.on("Identifier", assertCommentCount(0, 0));
            eslint.on("BlockStatement", assertCommentCount(0, 0));
            eslint.on("ThrowStatement", assertCommentCount(1, 1));

            eslint.verify(code, config, "", true);
        });

        it("should return comments surrounding a while loop", () => {
            const code = [
                "function f() {",
                "    /* Leading comment for WhileStatement */",
                "    while (true) {}",
                "    /* Trailing comment for WhileStatement and leading comment for VariableDeclaration */",
                "    var each;",
                "}"
            ].join("\n");

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("FunctionDeclaration", assertCommentCount(0, 0));
            eslint.on("Identifier", assertCommentCount(0, 0));
            eslint.on("BlockStatement", assertCommentCount(0, 0));
            eslint.on("WhileStatement", assertCommentCount(1, 1));
            eslint.on("Literal", assertCommentCount(0, 0));
            eslint.on("VariableDeclaration", assertCommentCount(1, 0));
            eslint.on("VariableDeclarator", assertCommentCount(0, 0));

            eslint.verify(code, config, "", true);
        });

        it("should return switch case fallthrough comments in functions", () => {
            const code = [
                "function bar(foo) {",
                "    switch(foo) {",
                "    /* Leading comment for SwitchCase */",
                "    case 1:",
                "        // falls through", // Trailing comment for previous SwitchCase and leading comment for next SwitchCase
                "    case 2:",
                "        doIt();",
                "    }",
                "}"
            ].join("\n");
            let switchCaseCount = 0;

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("FunctionDeclaration", assertCommentCount(0, 0));
            eslint.on("Identifier", assertCommentCount(0, 0));
            eslint.on("BlockStatement", assertCommentCount(0, 0));
            eslint.on("SwitchStatement", assertCommentCount(0, 0));
            eslint.on("SwitchCase", node => {
                if (switchCaseCount === 0) {
                    assertCommentCount(1, 1)(node);
                } else {
                    assertCommentCount(1, 0)(node);
                }
                switchCaseCount++;
            });
            eslint.on("Literal", assertCommentCount(0, 0));
            eslint.on("ExpressionStatement", assertCommentCount(0, 0));
            eslint.on("CallExpression", assertCommentCount(0, 0));

            eslint.verify(code, config, "", true);
        });

        it("should return switch case fallthrough comments", () => {
            const code = [
                "switch(foo) {",
                "    /* Leading comment for SwitchCase */",
                "case 1:",
                "    // falls through", // Trailing comment for previous SwitchCase and leading comment for next SwitchCase
                "case 2:",
                "    doIt();",
                "}"
            ].join("\n");
            let switchCaseCount = 0;

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("SwitchStatement", assertCommentCount(0, 0));
            eslint.on("SwitchCase", node => {
                if (switchCaseCount === 0) {
                    assertCommentCount(1, 1)(node);
                } else {
                    assertCommentCount(1, 0)(node);
                }
                switchCaseCount++;
            });
            eslint.on("Literal", assertCommentCount(0, 0));
            eslint.on("ExpressionStatement", assertCommentCount(0, 0));
            eslint.on("CallExpression", assertCommentCount(0, 0));

            eslint.verify(code, config, "", true);
        });

        it("should return switch case no-default comments in functions", () => {
            const code = [
                "function bar(a) {",
                "    switch (a) {",
                "        case 2:",
                "            break;",
                "        case 1:",
                "            break;",
                "        // no default", // Trailing comment for SwitchCase
                "    }",
                "}"
            ].join("\n");
            let breakStatementCount = 0;

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("FunctionDeclaration", assertCommentCount(0, 0));
            eslint.on("Identifier", assertCommentCount(0, 0));
            eslint.on("BlockStatement", assertCommentCount(0, 0));
            eslint.on("SwitchStatement", assertCommentCount(0, 0));
            eslint.on("SwitchCase", node => {
                if (breakStatementCount === 0) {
                    assertCommentCount(0, 0)(node);
                } else {
                    assertCommentCount(0, 1)(node);
                }
                breakStatementCount++;
            });
            eslint.on("BreakStatement", assertCommentCount(0, 0));
            eslint.on("Literal", assertCommentCount(0, 0));

            eslint.verify(code, config, "", true);
        });

        it("should return switch case no-default comments", () => {
            const code = [
                "switch (a) {",
                "    case 1:",
                "        break;",
                "    // no default", // Trailing comment for SwitchCase
                "}"
            ].join("\n");

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("SwitchStatement", assertCommentCount(0, 0));
            eslint.on("Identifier", assertCommentCount(0, 0));
            eslint.on("SwitchCase", assertCommentCount(0, 1));
            eslint.on("BreakStatement", assertCommentCount(0, 0));
            eslint.on("Literal", assertCommentCount(0, 0));

            eslint.verify(code, config, "", true);
        });

        it("should return switch case no-default comments in nested functions", () => {
            const code = [
                "module.exports = function(context) {",
                "    function isConstant(node) {",
                "        switch (node.type) {",
                "            case 'SequenceExpression':",
                "                return isConstant(node.expressions[node.expressions.length - 1]);",
                "            // no default", // Trailing comment for SwitchCase
                "        }",
                "        return false;",
                "    }",
                "};"
            ].join("\n");

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("ExpressionStatement", assertCommentCount(0, 0));
            eslint.on("AssignmentExpression", assertCommentCount(0, 0));
            eslint.on("MemberExpression", assertCommentCount(0, 0));
            eslint.on("Identifier", assertCommentCount(0, 0));
            eslint.on("FunctionExpression", assertCommentCount(0, 0));
            eslint.on("BlockStatement", assertCommentCount(0, 0));
            eslint.on("FunctionDeclaration", assertCommentCount(0, 0));
            eslint.on("SwitchStatement", assertCommentCount(0, 0));
            eslint.on("SwitchCase", assertCommentCount(0, 1));
            eslint.on("ReturnStatement", assertCommentCount(0, 0));
            eslint.on("CallExpression", assertCommentCount(0, 0));
            eslint.on("BinaryExpression", assertCommentCount(0, 0));
            eslint.on("Literal", assertCommentCount(0, 0));

            eslint.verify(code, config, "", true);
        });

        it("should return leading comments if the code only contains comments", () => {
            const code = [
                "//comment",
                "/*another comment*/"
            ].join("\n");

            eslint.on("Program", assertCommentCount(2, 0));

            eslint.verify(code, config, "", true);
        });

        it("should return trailing comments if a block statement only contains comments", () => {
            const code = [
                "{",
                "    //comment",
                "    /*another comment*/",
                "}"
            ].join("\n");

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("BlockStatement", assertCommentCount(0, 2));

            eslint.verify(code, config, "", true);
        });

        it("should return trailing comments if a class body only contains comments", () => {
            const code = [
                "class Foo {",
                "    //comment",
                "    /*another comment*/",
                "}"
            ].join("\n");

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("ClassDeclaration", assertCommentCount(0, 0));
            eslint.on("ClassBody", assertCommentCount(0, 2));

            eslint.verify(code, config, "", true);
        });

        it("should return trailing comments if an object only contains comments", () => {
            const code = [
                "({",
                "    //comment",
                "    /*another comment*/",
                "})"
            ].join("\n");

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("ExpressionStatement", assertCommentCount(0, 0));
            eslint.on("ObjectExpression", assertCommentCount(0, 2));

            eslint.verify(code, config, "", true);
        });

        it("should return trailing comments if an array only contains comments", () => {
            const code = [
                "[",
                "    //comment",
                "    /*another comment*/",
                "]"
            ].join("\n");

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("ExpressionStatement", assertCommentCount(0, 0));
            eslint.on("ArrayExpression", assertCommentCount(0, 2));

            eslint.verify(code, config, "", true);
        });

        it("should return trailing comments if a switch statement only contains comments", () => {
            const code = [
                "switch (foo) {",
                "    //comment",
                "    /*another comment*/",
                "}"
            ].join("\n");

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("SwitchStatement", assertCommentCount(0, 2));
            eslint.on("Identifier", assertCommentCount(0, 0));

            eslint.verify(code, config, "", true);
        });

        it("should return comments for multiple declarations with a single variable", () => {
            const code = [
                "// Leading comment for VariableDeclaration",
                "var a, // Leading comment for next VariableDeclarator",
                "    b, // Leading comment for next VariableDeclarator",
                "    c; // Trailing comment for VariableDeclaration",
                "// Trailing comment for VariableDeclaration"
            ].join("\n");
            let varDeclCount = 0;

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("VariableDeclaration", assertCommentCount(1, 2));
            eslint.on("VariableDeclarator", node => {
                if (varDeclCount === 0) {
                    assertCommentCount(0, 0)(node);
                } else if (varDeclCount === 1) {
                    assertCommentCount(1, 0)(node);
                } else {
                    assertCommentCount(1, 0)(node);
                }
                varDeclCount++;
            });
            eslint.on("Identifier", assertCommentCount(0, 0));

            eslint.verify(code, config, "", true);
        });

        it("should return comments when comments exist between var keyword and VariableDeclarator", () => {
            const code = [
                "var // Leading comment for VariableDeclarator",
                "    // Leading comment for VariableDeclarator",
                "    a;"
            ].join("\n");

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("VariableDeclaration", assertCommentCount(0, 0));
            eslint.on("VariableDeclarator", assertCommentCount(2, 0));
            eslint.on("Identifier", assertCommentCount(0, 0));

            eslint.verify(code, config, "", true);
        });

        it("should return attached comments between tokens to the correct nodes for empty function declarations", () => {
            const code = "/* 1 */ function /* 2 */ foo(/* 3 */) /* 4 */ { /* 5 */ } /* 6 */";

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("FunctionDeclaration", assertCommentCount(1, 1));
            eslint.on("Identifier", assertCommentCount(1, 0));
            eslint.on("BlockStatement", assertCommentCount(1, 1));

            eslint.verify(code, config, "", true);
        });

        it("should return attached comments between tokens to the correct nodes for empty class declarations", () => {
            const code = "/* 1 */ class /* 2 */ Foo /* 3 */ extends /* 4 */ Bar /* 5 */ { /* 6 */ } /* 7 */";
            let idCount = 0;

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("ClassDeclaration", assertCommentCount(1, 1));
            eslint.on("Identifier", node => {
                if (idCount === 0) {
                    assertCommentCount(1, 1)(node);
                } else {
                    assertCommentCount(1, 1)(node);
                }
                idCount++;
            });
            eslint.on("ClassBody", assertCommentCount(1, 1));

            eslint.verify(code, config, "", true);
        });

        it("should return attached comments between tokens to the correct nodes for empty switch statements", () => {
            const code = "/* 1 */ switch /* 2 */ (/* 3 */ foo /* 4 */) /* 5 */ { /* 6 */ } /* 7 */";

            eslint.on("Program", assertCommentCount(0, 0));
            eslint.on("SwitchStatement", assertCommentCount(1, 6));
            eslint.on("Identifier", assertCommentCount(1, 1));

            eslint.verify(code, config, "", true);
        });
    });

    describe("getLines()", () => {

        it("should get proper lines when using \\n as a line break", () => {
            const code = "a;\nb;",
                ast = espree.parse(code, DEFAULT_CONFIG),
                sourceCode = new SourceCode(code, ast);

            const lines = sourceCode.getLines();

            assert.equal(lines[0], "a;");
            assert.equal(lines[1], "b;");
        });

        it("should get proper lines when using \\r\\n as a line break", () => {
            const code = "a;\r\nb;",
                ast = espree.parse(code, DEFAULT_CONFIG),
                sourceCode = new SourceCode(code, ast);

            const lines = sourceCode.getLines();

            assert.equal(lines[0], "a;");
            assert.equal(lines[1], "b;");
        });

        it("should get proper lines when using \\r as a line break", () => {
            const code = "a;\rb;",
                ast = espree.parse(code, DEFAULT_CONFIG),
                sourceCode = new SourceCode(code, ast);

            const lines = sourceCode.getLines();

            assert.equal(lines[0], "a;");
            assert.equal(lines[1], "b;");
        });

        it("should get proper lines when using \\u2028 as a line break", () => {
            const code = "a;\u2028b;",
                ast = espree.parse(code, DEFAULT_CONFIG),
                sourceCode = new SourceCode(code, ast);

            const lines = sourceCode.getLines();

            assert.equal(lines[0], "a;");
            assert.equal(lines[1], "b;");
        });

        it("should get proper lines when using \\u2029 as a line break", () => {
            const code = "a;\u2029b;",
                ast = espree.parse(code, DEFAULT_CONFIG),
                sourceCode = new SourceCode(code, ast);

            const lines = sourceCode.getLines();

            assert.equal(lines[0], "a;");
            assert.equal(lines[1], "b;");
        });
    });

    describe("getText()", () => {

        let sourceCode,
            ast;

        describe("when text begins with a shebang", () => {
            it("should retrieve unaltered shebang text", () => {

                // Shebangs are normalized to line comments before parsing.
                ast = espree.parse(SHEBANG_TEST_CODE.replace(astUtils.SHEBANG_MATCHER, (match, captured) => `//${captured}`), DEFAULT_CONFIG);
                sourceCode = new SourceCode(SHEBANG_TEST_CODE, ast);

                const shebangToken = sourceCode.getAllComments()[0];
                const shebangText = sourceCode.getText(shebangToken);

                assert.equal(shebangToken.type, "Shebang");
                assert.equal(shebangText, "#!/usr/bin/env node");
            });
        });

        beforeEach(() => {
            ast = espree.parse(TEST_CODE, DEFAULT_CONFIG);
            sourceCode = new SourceCode(TEST_CODE, ast);
        });

        it("should retrieve all text when used without parameters", () => {
            const text = sourceCode.getText();

            assert.equal(text, TEST_CODE);
        });

        it("should retrieve all text for root node", () => {
            const text = sourceCode.getText(ast);

            assert.equal(text, TEST_CODE);
        });

        it("should clamp to valid range when retrieving characters before start of source", () => {
            const text = sourceCode.getText(ast, 2, 0);

            assert.equal(text, TEST_CODE);
        });

        it("should retrieve all text for binary expression", () => {

            const node = ast.body[0].declarations[0].init;
            const text = sourceCode.getText(node);

            assert.equal(text, "6 * 7");
        });

        it("should retrieve all text plus two characters before for binary expression", () => {

            const node = ast.body[0].declarations[0].init;
            const text = sourceCode.getText(node, 2);

            assert.equal(text, "= 6 * 7");
        });

        it("should retrieve all text plus one character after for binary expression", () => {
            const node = ast.body[0].declarations[0].init;
            const text = sourceCode.getText(node, 0, 1);

            assert.equal(text, "6 * 7;");
        });

        it("should retrieve all text plus two characters before and one character after for binary expression", () => {
            const node = ast.body[0].declarations[0].init;
            const text = sourceCode.getText(node, 2, 1);

            assert.equal(text, "= 6 * 7;");
        });

    });


    describe("getNodeByRangeIndex()", () => {

        let sourceCode;

        beforeEach(() => {
            const ast = espree.parse(TEST_CODE, DEFAULT_CONFIG);

            sourceCode = new SourceCode(TEST_CODE, ast);
        });

        it("should retrieve a node starting at the given index", () => {
            const node = sourceCode.getNodeByRangeIndex(4);

            assert.equal(node.type, "Identifier");
        });

        it("should retrieve a node containing the given index", () => {
            const node = sourceCode.getNodeByRangeIndex(6);

            assert.equal(node.type, "Identifier");
        });

        it("should retrieve a node that is exactly the given index", () => {
            const node = sourceCode.getNodeByRangeIndex(13);

            assert.equal(node.type, "Literal");
            assert.equal(node.value, 6);
        });

        it("should retrieve a node ending with the given index", () => {
            const node = sourceCode.getNodeByRangeIndex(9);

            assert.equal(node.type, "Identifier");
        });

        it("should retrieve the deepest node containing the given index", () => {
            let node = sourceCode.getNodeByRangeIndex(14);

            assert.equal(node.type, "BinaryExpression");
            node = sourceCode.getNodeByRangeIndex(3);
            assert.equal(node.type, "VariableDeclaration");
        });

        it("should return null if the index is outside the range of any node", () => {
            let node = sourceCode.getNodeByRangeIndex(-1);

            assert.isNull(node);
            node = sourceCode.getNodeByRangeIndex(-99);
            assert.isNull(node);
        });

        it("should attach the node's parent", () => {
            const node = sourceCode.getNodeByRangeIndex(14);

            assert.property(node, "parent");
            assert.equal(node.parent.type, "VariableDeclarator");
        });

        it("should not modify the node when attaching the parent", () => {
            let node = sourceCode.getNodeByRangeIndex(10);

            assert.equal(node.type, "VariableDeclarator");
            node = sourceCode.getNodeByRangeIndex(4);
            assert.equal(node.type, "Identifier");
            assert.property(node, "parent");
            assert.equal(node.parent.type, "VariableDeclarator");
            assert.notProperty(node.parent, "parent");
        });

    });

    describe("isSpaceBetweenTokens()", () => {

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
        ], (code, expected) => {

            it("should return true when there is one space between tokens", () => {
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

    describe("eslint.verify()", () => {

        const CONFIG = {
            parserOptions: { ecmaVersion: 6 }
        };

        it("should work when passed a SourceCode object without a config", () => {
            const ast = espree.parse(TEST_CODE, DEFAULT_CONFIG);

            const sourceCode = new SourceCode(TEST_CODE, ast),
                messages = eslint.verify(sourceCode);

            assert.equal(messages.length, 0);
        });

        it("should work when passed a SourceCode object containing ES6 syntax and config", () => {
            const sourceCode = new SourceCode("let foo = bar;", AST),
                messages = eslint.verify(sourceCode, CONFIG);

            assert.equal(messages.length, 0);
        });

        it("should report an error when using let and blockBindings is false", () => {
            const sourceCode = new SourceCode("let foo = bar;", AST),
                messages = eslint.verify(sourceCode, {
                    parserOptions: { ecmaVersion: 6 },
                    rules: { "no-unused-vars": 2 }
                });

            assert.equal(messages.length, 1);
            assert.equal(messages[0].message, "'foo' is assigned a value but never used.");
        });
    });

    describe("getLocFromIndex()", () => {
        const CODE =
            "foo\n" +
            "bar\r\n" +
            "baz\r" +
            "qux\u2028" +
            "foo\u2029" +
            "\n" +
            "qux\n";

        let sourceCode;

        beforeEach(() => {
            sourceCode = new SourceCode(CODE, espree.parse(CODE, DEFAULT_CONFIG));
        });

        it("should return the location of a range index", () => {
            assert.deepEqual(sourceCode.getLocFromIndex(5), { line: 2, column: 1 });
            assert.deepEqual(sourceCode.getLocFromIndex(3), { line: 1, column: 3 });
            assert.deepEqual(sourceCode.getLocFromIndex(4), { line: 2, column: 0 });
            assert.deepEqual(sourceCode.getLocFromIndex(21), { line: 6, column: 0 });
        });

        it("should throw if given a bad input", () => {
            assert.throws(
                () => sourceCode.getLocFromIndex({ line: 1, column: 1 }),
                /Expected `index` to be a number\./
            );
        });

        it("should not throw if given sourceCode.text.length", () => {
            assert.deepEqual(sourceCode.getLocFromIndex(CODE.length), { line: 8, column: 0 });
        });

        it("should throw if given an out-of-range input", () => {
            assert.throws(
                () => sourceCode.getLocFromIndex(CODE.length + 1),
                /Index out of range \(requested index 27, but source text has length 26\)\./
            );
        });

        it("is symmetric with getIndexFromLoc()", () => {
            for (let index = 0; index <= CODE.length; index++) {
                assert.strictEqual(index, sourceCode.getIndexFromLoc(sourceCode.getLocFromIndex(index)));
            }
        });
    });

    describe("getIndexFromLoc()", () => {
        const CODE =
            "foo\n" +
            "bar\r\n" +
            "baz\r" +
            "qux\u2028" +
            "foo\u2029" +
            "\n" +
            "qux\n";

        let sourceCode;

        beforeEach(() => {
            sourceCode = new SourceCode(CODE, espree.parse(CODE, DEFAULT_CONFIG));
        });
        it("should return the range index of a location", () => {
            assert.strictEqual(sourceCode.getIndexFromLoc({ line: 2, column: 1 }), 5);
            assert.strictEqual(sourceCode.getIndexFromLoc({ line: 1, column: 3 }), 3);
            assert.strictEqual(sourceCode.getIndexFromLoc({ line: 2, column: 0 }), 4);
            assert.strictEqual(sourceCode.getIndexFromLoc({ line: 7, column: 0 }), 22);
            assert.strictEqual(sourceCode.getIndexFromLoc({ line: 7, column: 3 }), 25);
        });

        it("should throw a useful error if given a malformed location", () => {
            assert.throws(
                () => sourceCode.getIndexFromLoc(5),
                /Expected `loc` to be an object with numeric `line` and `column` properties\./
            );

            assert.throws(
                () => sourceCode.getIndexFromLoc({ line: "three", column: "four" }),
                /Expected `loc` to be an object with numeric `line` and `column` properties\./
            );
        });

        it("should throw a useful error if `line` is out of range", () => {
            assert.throws(
                () => sourceCode.getIndexFromLoc({ line: 9, column: 0 }),
                /Line number out of range \(line 9 requested, but only 8 lines present\)\./
            );

            assert.throws(
                () => sourceCode.getIndexFromLoc({ line: 50, column: 3 }),
                /Line number out of range \(line 50 requested, but only 8 lines present\)\./
            );

            assert.throws(
                () => sourceCode.getIndexFromLoc({ line: 0, column: 0 }),
                /Line number out of range \(line 0 requested\)\. Line numbers should be 1-based\./
            );
        });

        it("should throw a useful error if `column` is out of range", () => {
            assert.throws(
                () => sourceCode.getIndexFromLoc({ line: 3, column: 4 }),
                /Column number out of range \(column 4 requested, but the length of line 3 is 4\)\./
            );

            assert.throws(
                () => sourceCode.getIndexFromLoc({ line: 3, column: 50 }),
                /Column number out of range \(column 50 requested, but the length of line 3 is 4\)\./
            );

            assert.throws(
                () => sourceCode.getIndexFromLoc({ line: 8, column: 1 }),
                /Column number out of range \(column 1 requested, but the length of line 8 is 0\)\./
            );
        });

        it("should not throw if the location one spot past the last character is given", () => {
            assert.strictEqual(sourceCode.getIndexFromLoc({ line: 8, column: 0 }), CODE.length);
        });
    });
});
