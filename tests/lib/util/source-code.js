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
    Linter = require("../../../lib/linter"),
    SourceCode = require("../../../lib/util/source-code"),
    astUtils = require("../../../lib/util/ast-utils");

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
const linter = new Linter();
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
            assert.strictEqual(sourceCode.text, "foo;");
            assert.strictEqual(sourceCode.ast, ast);
        });

        it("should create a new instance when called with valid optional data", () => {
            const parserServices = {};
            const scopeManager = {};
            const visitorKeys = {};
            const ast = { comments: [], tokens: [], loc: {}, range: [] };
            const sourceCode = new SourceCode({ text: "foo;", ast, parserServices, scopeManager, visitorKeys });

            assert.isObject(sourceCode);
            assert.strictEqual(sourceCode.text, "foo;");
            assert.strictEqual(sourceCode.ast, ast);
            assert.strictEqual(sourceCode.parserServices, parserServices);
            assert.strictEqual(sourceCode.scopeManager, scopeManager);
            assert.strictEqual(sourceCode.visitorKeys, visitorKeys);
        });

        it("should split text into lines when called with valid data", () => {
            const ast = { comments: [], tokens: [], loc: {}, range: [] };
            const sourceCode = new SourceCode("foo;\nbar;", ast);

            assert.isObject(sourceCode);
            assert.strictEqual(sourceCode.lines.length, 2);
            assert.strictEqual(sourceCode.lines[0], "foo;");
            assert.strictEqual(sourceCode.lines[1], "bar;");
        });

        it("should throw an error when called with an AST that's missing tokens", () => {

            assert.throws(
                () => new SourceCode("foo;", { comments: [], loc: {}, range: [] }),
                /missing the tokens array/u
            );

        });

        it("should throw an error when called with an AST that's missing comments", () => {

            assert.throws(
                () => new SourceCode("foo;", { tokens: [], loc: {}, range: [] }),
                /missing the comments array/u
            );

        });

        it("should throw an error when called with an AST that's missing location", () => {

            assert.throws(
                () => new SourceCode("foo;", { comments: [], tokens: [], range: [] }),
                /missing location information/u
            );

        });

        it("should throw an error when called with an AST that's missing range", () => {

            assert.throws(
                () => new SourceCode("foo;", { comments: [], tokens: [], loc: {} }),
                /missing range information/u
            );
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

            assert.deepStrictEqual(actual, expected);
        });

        describe("if a text has BOM,", () => {
            let sourceCode;

            beforeEach(() => {
                const ast = { comments: [], tokens: [], loc: {}, range: [] };

                sourceCode = new SourceCode("\uFEFFconsole.log('hello');", ast);
            });

            it("should has true at `hasBOM` property.", () => {
                assert.strictEqual(sourceCode.hasBOM, true);
            });

            it("should not has BOM in `text` property.", () => {
                assert.strictEqual(sourceCode.text, "console.log('hello');");
            });
        });

        describe("if a text doesn't have BOM,", () => {
            let sourceCode;

            beforeEach(() => {
                const ast = { comments: [], tokens: [], loc: {}, range: [] };

                sourceCode = new SourceCode("console.log('hello');", ast);
            });

            it("should has false at `hasBOM` property.", () => {
                assert.strictEqual(sourceCode.hasBOM, false);
            });

            it("should not has BOM in `text` property.", () => {
                assert.strictEqual(sourceCode.text, "console.log('hello');");
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

                assert.strictEqual(firstToken.type, "Shebang");
            });
        });

        describe("when a text does not have a shebang", () => {
            it("should not change the type of the first comment", () => {
                const ast = { comments: [{ type: "Line", value: "comment", range: [0, 9] }], tokens: [], loc: {}, range: [] };
                const sourceCode = new SourceCode("//comment\nconsole.log('hello');", ast);
                const firstToken = sourceCode.getAllComments()[0];

                assert.strictEqual(firstToken.type, "Line");
            });
        });

        describe("when it read a UTF-8 file (has BOM), SourceCode", () => {
            const UTF8_FILE = path.resolve(__dirname, "../../fixtures/utf8-bom.js");
            const text = fs.readFileSync(
                UTF8_FILE,
                "utf8"
            ).replace(/\r\n/gu, "\n"); // <-- For autocrlf of "git for Windows"
            let sourceCode;

            beforeEach(() => {
                const ast = { comments: [], tokens: [], loc: {}, range: [] };

                sourceCode = new SourceCode(text, ast);
            });

            it("to be clear, check the file has UTF-8 BOM.", () => {
                const buffer = fs.readFileSync(UTF8_FILE);

                assert.strictEqual(buffer[0], 0xEF);
                assert.strictEqual(buffer[1], 0xBB);
                assert.strictEqual(buffer[2], 0xBF);
            });

            it("should has true at `hasBOM` property.", () => {
                assert.strictEqual(sourceCode.hasBOM, true);
            });

            it("should not has BOM in `text` property.", () => {
                assert.strictEqual(
                    sourceCode.text,
                    "\"use strict\";\n\nconsole.log(\"This file has [0xEF, 0xBB, 0xBF] as BOM.\");\n"
                );
            });
        });
    });


    describe("getJSDocComment()", () => {

        const sandbox = sinon.sandbox.create();

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
                const sourceCode = linter.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.strictEqual(jsdoc, null);
            }

            const spy = sandbox.spy(assertJSDoc);

            linter.defineRule("checker", () => ({ FunctionExpression: spy }));
            linter.verify(code, { rules: { checker: "error" } });
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
                const sourceCode = linter.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.strictEqual(jsdoc, null);
            }

            const spy = sandbox.spy(assertJSDoc);

            linter.defineRule("checker", () => ({ FunctionExpression: spy }));
            linter.verify(code, { rules: { checker: "error" } });
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
                    const sourceCode = linter.getSourceCode();
                    const jsdoc = sourceCode.getJSDocComment(node);

                    assert.strictEqual(jsdoc, null);
                }
            }

            const spy = sandbox.spy(assertJSDoc);

            linter.defineRule("checker", () => ({ FunctionExpression: spy }));
            linter.verify(code, { rules: { checker: "error" } });
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
                const sourceCode = linter.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.strictEqual(jsdoc.type, "Block");
                assert.strictEqual(jsdoc.value, "* Documentation. ");
            }

            const spy = sandbox.spy(assertJSDoc);

            linter.defineRule("checker", () => ({ FunctionExpression: spy }));
            linter.verify(code, { rules: { checker: "error" } });
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
                const sourceCode = linter.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.strictEqual(jsdoc.type, "Block");
                assert.strictEqual(jsdoc.value, "* Desc");
            }

            const spy = sandbox.spy(assertJSDoc);

            linter.defineRule("checker", () => ({ FunctionDeclaration: spy }));
            linter.verify(code, { rules: { checker: "error" } });
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
                const sourceCode = linter.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.strictEqual(jsdoc.type, "Block");
                assert.strictEqual(jsdoc.value, "* Desc");
            }

            const spy = sandbox.spy(assertJSDoc);

            linter.defineRule("checker", () => ({ FunctionDeclaration: spy }));
            linter.verify(code, { rules: { checker: "error" }, parserOptions: { sourceType: "module" } });
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
                const sourceCode = linter.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.strictEqual(jsdoc.type, "Block");
                assert.strictEqual(jsdoc.value, "* Desc");
            }

            const spy = sandbox.spy(assertJSDoc);

            linter.defineRule("checker", () => ({ FunctionDeclaration: spy }));
            linter.verify(code, { rules: { checker: "error" } });
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
                const sourceCode = linter.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.isNull(jsdoc);
            }

            const spy = sandbox.spy(assertJSDoc);

            linter.defineRule("checker", () => ({ FunctionDeclaration: spy }));
            linter.verify(code, { rules: { checker: "error" } });
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
                const sourceCode = linter.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.strictEqual(jsdoc.type, "Block");
                assert.strictEqual(jsdoc.value, "* Desc");
            }

            const spy = sandbox.spy(assertJSDoc);

            linter.defineRule("checker", () => ({ FunctionDeclaration: spy }));
            linter.verify(code, { rules: { checker: "error" } });
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
                const sourceCode = linter.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.strictEqual(jsdoc.type, "Block");
                assert.strictEqual(jsdoc.value, "* Desc");
            }

            const spy = sandbox.spy(assertJSDoc);

            linter.defineRule("checker", () => ({ FunctionDeclaration: spy }));
            linter.verify(code, { rules: { checker: "error" } });
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
                const sourceCode = linter.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.strictEqual(jsdoc.type, "Block");
                assert.strictEqual(jsdoc.value, "* Desc");
            }

            const spy = sandbox.spy(assertJSDoc);

            linter.defineRule("checker", () => ({ FunctionExpression: spy }));
            linter.verify(code, { rules: { checker: "error" } });
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
                const sourceCode = linter.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.strictEqual(jsdoc.type, "Block");
                assert.strictEqual(jsdoc.value, "* Desc");
            }

            const spy = sandbox.spy(assertJSDoc);

            linter.defineRule("checker", () => ({ ArrowFunctionExpression: spy }));
            linter.verify(code, { rules: { checker: "error" }, parserOptions: { ecmaVersion: 6 } });
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
                const sourceCode = linter.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.strictEqual(jsdoc.type, "Block");
                assert.strictEqual(jsdoc.value, "* Desc");
            }

            const spy = sandbox.spy(assertJSDoc);

            linter.defineRule("checker", () => ({ FunctionExpression: spy }));
            linter.verify(code, { rules: { checker: "error" } });
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
                    const sourceCode = linter.getSourceCode();
                    const jsdoc = sourceCode.getJSDocComment(node);

                    assert.strictEqual(jsdoc.type, "Block");
                    assert.strictEqual(jsdoc.value, "* Desc");
                }
            }

            const spy = sandbox.spy(assertJSDoc);

            linter.defineRule("checker", () => ({ FunctionExpression: spy }));
            linter.verify(code, { rules: { checker: "error" } });
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
                    const sourceCode = linter.getSourceCode();
                    const jsdoc = sourceCode.getJSDocComment(node);

                    assert.isNull(jsdoc);
                }
            }

            const spy = sandbox.spy(assertJSDoc);

            linter.defineRule("checker", () => ({ FunctionExpression: spy }));
            linter.verify(code, { rules: { checker: "error" } });
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
                    const sourceCode = linter.getSourceCode();
                    const jsdoc = sourceCode.getJSDocComment(node);

                    assert.isNull(jsdoc);
                }
            }

            const spy = sandbox.spy(assertJSDoc);

            linter.defineRule("checker", () => ({ FunctionExpression: spy }));
            linter.verify(code, { rules: { checker: "error" } });
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
                    const sourceCode = linter.getSourceCode();
                    const jsdoc = sourceCode.getJSDocComment(node);

                    assert.isNull(jsdoc);
                }
            }

            const spy = sandbox.spy(assertJSDoc);

            linter.defineRule("checker", () => ({ FunctionExpression: spy }));
            linter.verify(code, { rules: { checker: "error" } });
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
                const sourceCode = linter.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.strictEqual(jsdoc.type, "Block");
                assert.strictEqual(jsdoc.value, "* Merges two objects together.");
            }

            const spy = sandbox.spy(assertJSDoc);

            linter.defineRule("checker", () => ({ ClassExpression: spy }));
            linter.verify(code, { rules: { checker: "error" }, parserOptions: { ecmaVersion: 6 } });
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
                const sourceCode = linter.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.strictEqual(jsdoc.type, "Block");
                assert.strictEqual(jsdoc.value, "* Merges two objects together.");
            }

            const spy = sandbox.spy(assertJSDoc);

            linter.defineRule("checker", () => ({ ClassDeclaration: spy }));
            linter.verify(code, { rules: { checker: "error" }, parserOptions: { ecmaVersion: 6 } });
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
                const sourceCode = linter.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.isNull(jsdoc);
            }

            const spy = sandbox.spy(assertJSDoc);

            linter.defineRule("checker", () => ({ FunctionExpression: spy }));
            linter.verify(code, { rules: { checker: "error" }, parserOptions: { ecmaVersion: 6 } });
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
                const sourceCode = linter.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.strictEqual(jsdoc.type, "Block");
                assert.strictEqual(jsdoc.value, "* Merges two objects together.");
            }

            const spy = sandbox.spy(assertJSDoc);

            linter.defineRule("checker", () => ({ FunctionExpression: spy }));
            linter.verify(code, { rules: { checker: "error" }, parserOptions: { ecmaVersion: 6 } });
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
                const sourceCode = linter.getSourceCode();
                const jsdoc = sourceCode.getJSDocComment(node);

                assert.isNull(jsdoc);
            }

            const spy = sandbox.spy(assertJSDoc);

            linter.defineRule("checker", () => ({ FunctionDeclaration: spy }));
            linter.verify(code, { rules: { checker: "error" }, parserOptions: { ecmaVersion: 6 } });
            assert.isTrue(spy.calledOnce, "Event handler should be called.");
        });

    });

    describe("getComments()", () => {
        const config = { rules: { checker: "error" }, parserOptions: { sourceType: "module" } };
        let unusedAssertionFuncs;


        beforeEach(() => {
            unusedAssertionFuncs = new Set();
        });

        /**
         * Check comment count
         * @param {int} leading Leading comment count
         * @param {int} trailing Trailing comment count
         * @returns {Function} function to execute
         * @private
         */
        function assertCommentCount(leading, trailing) {

            /**
             * Asserts the comment count for a node
             * @param {ASTNode} node the node being traversed
             * @returns {void}
             */
            function assertionFunc(node) {
                unusedAssertionFuncs.delete(assertionFunc);
                const sourceCode = linter.getSourceCode();
                const comments = sourceCode.getComments(node);

                assert.strictEqual(comments.leading.length, leading);
                assert.strictEqual(comments.trailing.length, trailing);
            }
            unusedAssertionFuncs.add(assertionFunc);
            return assertionFunc;
        }

        afterEach(() => {
            assert.strictEqual(
                unusedAssertionFuncs.size,
                0,
                "An assertion function was created with assertCommentCount, but the function was not called."
            );
        });

        it("should return comments around nodes", () => {
            const code = [
                "// Leading comment for VariableDeclaration",
                "var a = 42;",
                "/* Trailing comment for VariableDeclaration */"
            ].join("\n");

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                VariableDeclaration: assertCommentCount(1, 1),
                VariableDeclarator: assertCommentCount(0, 0),
                Identifier: assertCommentCount(0, 0),
                Literal: assertCommentCount(0, 0)
            }));

            assert.isEmpty(linter.verify(code, config));
        });

        it("should return trailing comments inside a block", () => {
            const code = [
                "{",
                "    a();",
                "    // Trailing comment for ExpressionStatement",
                "}"
            ].join("\n");

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                BlockStatement: assertCommentCount(0, 0),
                ExpressionStatement: assertCommentCount(0, 1),
                CallExpression: assertCommentCount(0, 0),
                Identifier: assertCommentCount(0, 0)
            }));

            assert.isEmpty(linter.verify(code, config));
        });

        it("should return comments within a conditional", () => {
            const code = [
                "/* Leading comment for IfStatement */",
                "if (/* Leading comment for Identifier */ a) {}"
            ].join("\n");

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                IfStatement: assertCommentCount(1, 0),
                Identifier: assertCommentCount(1, 0),
                BlockStatement: assertCommentCount(0, 0)
            }));

            assert.isEmpty(linter.verify(code, config));
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

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                Identifier: assertCommentCount(0, 0),
                BlockStatement: assertCommentCount(0, 0),
                VariableDeclaration: assertCommentCount(0, 0),
                VariableDeclarator: assertCommentCount(0, 0),
                ObjectExpression: assertCommentCount(0, 1),
                ReturnStatement: assertCommentCount(0, 0)
            }));

            assert.isEmpty(linter.verify(code, config));
        });

        it("should return comments only for children of parent node", () => {
            const code = [
                "var foo = {",
                "    bar: 'bar'",
                "    // Trailing comment for Property",
                "};",
                "var baz;"
            ].join("\n");

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                VariableDeclaration: assertCommentCount(0, 0),
                VariableDeclarator: assertCommentCount(0, 0),
                Identifier: assertCommentCount(0, 0),
                ObjectExpression: assertCommentCount(0, 0),
                Property: assertCommentCount(0, 1),
                Literal: assertCommentCount(0, 0)
            }));

            assert.isEmpty(linter.verify(code, config));
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

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                ExportDefaultDeclaration: assertCommentCount(1, 0),
                ClassDeclaration: assertCommentCount(0, 0),
                ClassBody: assertCommentCount(0, 0),
                MethodDefinition: assertCommentCount(1, 0),
                Identifier: assertCommentCount(0, 0),
                FunctionExpression: assertCommentCount(0, 0),
                BlockStatement: assertCommentCount(0, 0)
            }));

            assert.isEmpty(linter.verify(code, config));
        });

        it("should return leading comments", () => {
            const code = [
                "// Leading comment for first VariableDeclaration",
                "var a;",
                "// Leading comment for previous VariableDeclaration and trailing comment for next VariableDeclaration",
                "var b;"
            ].join("\n");
            let varDeclCount = 0;

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                VariableDeclaration(node) {
                    if (varDeclCount === 0) {
                        assertCommentCount(1, 1)(node);
                    } else {
                        assertCommentCount(1, 0)(node);
                    }
                    varDeclCount++;
                },
                VariableDeclarator: assertCommentCount(0, 0),
                Identifier: assertCommentCount(0, 0)
            }));

            assert.isEmpty(linter.verify(code, config));
        });

        it("should return shebang comments", () => {
            const code = [
                "#!/usr/bin/env node", // Leading comment for following VariableDeclaration
                "var a;",
                "// Leading comment for previous VariableDeclaration and trailing comment for next VariableDeclaration",
                "var b;"
            ].join("\n");
            let varDeclCount = 0;

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                VariableDeclaration(node) {
                    if (varDeclCount === 0) {
                        assertCommentCount(1, 1)(node);
                    } else {
                        assertCommentCount(1, 0)(node);
                    }
                    varDeclCount++;
                },
                Identifier: assertCommentCount(0, 0)
            }));

            assert.isEmpty(linter.verify(code, config));
        });

        it("should include shebang comment when program only contains shebang", () => {
            const code = "#!/usr/bin/env node";

            linter.defineRule("checker", () => ({ Program: assertCommentCount(1, 0) }));

            assert.isEmpty(linter.verify(code, config));
        });

        it("should return mixture of line and block comments", () => {
            const code = [
                "// Leading comment for VariableDeclaration",
                "var zzz /* Trailing comment for Identifier */ = 777;",
                "// Trailing comment for VariableDeclaration"
            ].join("\n");

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                VariableDeclaration: assertCommentCount(1, 1),
                VariableDeclarator: assertCommentCount(0, 0),
                Identifier: assertCommentCount(0, 1),
                Literal: assertCommentCount(0, 0)
            }));

            assert.isEmpty(linter.verify(code, config));
        });

        it("should return comments surrounding a call expression", () => {
            const code = [
                "function a() {",
                "    /* Leading comment for ExpressionStatement */",
                "    foo();",
                "    /* Trailing comment for ExpressionStatement */",
                "}"
            ].join("\n");

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                FunctionDeclaration: assertCommentCount(0, 0),
                Identifier: assertCommentCount(0, 0),
                BlockStatement: assertCommentCount(0, 0),
                ExpressionStatement: assertCommentCount(1, 1),
                CallExpression: assertCommentCount(0, 0)
            }));

            assert.isEmpty(linter.verify(code, config));
        });

        it("should return comments surrounding a debugger statement", () => {
            const code = [
                "function a() {",
                "    /* Leading comment for DebuggerStatement */",
                "    debugger;",
                "    /* Trailing comment for DebuggerStatement */",
                "}"
            ].join("\n");

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                FunctionDeclaration: assertCommentCount(0, 0),
                Identifier: assertCommentCount(0, 0),
                BlockStatement: assertCommentCount(0, 0),
                DebuggerStatement: assertCommentCount(1, 1)
            }));

            assert.isEmpty(linter.verify(code, config));
        });

        it("should return comments surrounding a return statement", () => {
            const code = [
                "function a() {",
                "    /* Leading comment for ReturnStatement */",
                "    return;",
                "    /* Trailing comment for ReturnStatement */",
                "}"
            ].join("\n");

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                FunctionDeclaration: assertCommentCount(0, 0),
                Identifier: assertCommentCount(0, 0),
                BlockStatement: assertCommentCount(0, 0),
                ReturnStatement: assertCommentCount(1, 1)
            }));

            assert.isEmpty(linter.verify(code, config));
        });

        it("should return comments surrounding a throw statement", () => {
            const code = [
                "function a() {",
                "    /* Leading comment for ThrowStatement */",
                "    throw 55;",
                "    /* Trailing comment for ThrowStatement */",
                "}"
            ].join("\n");

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                FunctionDeclaration: assertCommentCount(0, 0),
                Identifier: assertCommentCount(0, 0),
                BlockStatement: assertCommentCount(0, 0),
                ThrowStatement: assertCommentCount(1, 1)
            }));

            assert.isEmpty(linter.verify(code, config));
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

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                FunctionDeclaration: assertCommentCount(0, 0),
                Identifier: assertCommentCount(0, 0),
                BlockStatement: assertCommentCount(0, 0),
                WhileStatement: assertCommentCount(1, 1),
                Literal: assertCommentCount(0, 0),
                VariableDeclaration: assertCommentCount(1, 0),
                VariableDeclarator: assertCommentCount(0, 0)
            }));

            assert.isEmpty(linter.verify(code, config));
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

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                FunctionDeclaration: assertCommentCount(0, 0),
                Identifier: assertCommentCount(0, 0),
                BlockStatement: assertCommentCount(0, 0),
                SwitchStatement: assertCommentCount(0, 0),
                SwitchCase: node => {
                    if (switchCaseCount === 0) {
                        assertCommentCount(1, 1)(node);
                    } else {
                        assertCommentCount(1, 0)(node);
                    }
                    switchCaseCount++;
                },
                Literal: assertCommentCount(0, 0),
                ExpressionStatement: assertCommentCount(0, 0),
                CallExpression: assertCommentCount(0, 0)
            }));

            assert.isEmpty(linter.verify(code, config));
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

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                SwitchStatement: assertCommentCount(0, 0),
                SwitchCase: node => {
                    if (switchCaseCount === 0) {
                        assertCommentCount(1, 1)(node);
                    } else {
                        assertCommentCount(1, 0)(node);
                    }
                    switchCaseCount++;
                },
                Literal: assertCommentCount(0, 0),
                ExpressionStatement: assertCommentCount(0, 0),
                CallExpression: assertCommentCount(0, 0)
            }));

            assert.isEmpty(linter.verify(code, config));
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

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                FunctionDeclaration: assertCommentCount(0, 0),
                Identifier: assertCommentCount(0, 0),
                BlockStatement: assertCommentCount(0, 0),
                SwitchStatement: assertCommentCount(0, 0),
                SwitchCase: node => {
                    if (breakStatementCount === 0) {
                        assertCommentCount(0, 0)(node);
                    } else {
                        assertCommentCount(0, 1)(node);
                    }
                    breakStatementCount++;
                },
                BreakStatement: assertCommentCount(0, 0),
                Literal: assertCommentCount(0, 0)
            }));

            assert.isEmpty(linter.verify(code, config));
        });

        it("should return switch case no-default comments", () => {
            const code = [
                "switch (a) {",
                "    case 1:",
                "        break;",
                "    // no default", // Trailing comment for SwitchCase
                "}"
            ].join("\n");

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                SwitchStatement: assertCommentCount(0, 0),
                Identifier: assertCommentCount(0, 0),
                SwitchCase: assertCommentCount(0, 1),
                BreakStatement: assertCommentCount(0, 0),
                Literal: assertCommentCount(0, 0)
            }));

            assert.isEmpty(linter.verify(code, config));
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

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                ExpressionStatement: assertCommentCount(0, 0),
                AssignmentExpression: assertCommentCount(0, 0),
                MemberExpression: assertCommentCount(0, 0),
                Identifier: assertCommentCount(0, 0),
                FunctionExpression: assertCommentCount(0, 0),
                BlockStatement: assertCommentCount(0, 0),
                FunctionDeclaration: assertCommentCount(0, 0),
                SwitchStatement: assertCommentCount(0, 0),
                SwitchCase: assertCommentCount(0, 1),
                ReturnStatement: assertCommentCount(0, 0),
                CallExpression: assertCommentCount(0, 0),
                BinaryExpression: assertCommentCount(0, 0),
                Literal: assertCommentCount(0, 0)
            }));

            assert.isEmpty(linter.verify(code, config));
        });

        it("should return leading comments if the code only contains comments", () => {
            const code = [
                "//comment",
                "/*another comment*/"
            ].join("\n");

            linter.defineRule("checker", () => ({ Program: assertCommentCount(2, 0) }));

            assert.isEmpty(linter.verify(code, config));
        });

        it("should return trailing comments if a block statement only contains comments", () => {
            const code = [
                "{",
                "    //comment",
                "    /*another comment*/",
                "}"
            ].join("\n");

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                BlockStatement: assertCommentCount(0, 2)
            }));

            assert.isEmpty(linter.verify(code, config));
        });

        it("should return trailing comments if a class body only contains comments", () => {
            const code = [
                "class Foo {",
                "    //comment",
                "    /*another comment*/",
                "}"
            ].join("\n");

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                ClassDeclaration: assertCommentCount(0, 0),
                ClassBody: assertCommentCount(0, 2)
            }));

            assert.isEmpty(linter.verify(code, config));
        });

        it("should return trailing comments if an object only contains comments", () => {
            const code = [
                "({",
                "    //comment",
                "    /*another comment*/",
                "})"
            ].join("\n");

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                ExpressionStatement: assertCommentCount(0, 0),
                ObjectExpression: assertCommentCount(0, 2)
            }));

            assert.isEmpty(linter.verify(code, config));
        });

        it("should return trailing comments if an array only contains comments", () => {
            const code = [
                "[",
                "    //comment",
                "    /*another comment*/",
                "]"
            ].join("\n");

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                ExpressionStatement: assertCommentCount(0, 0),
                ArrayExpression: assertCommentCount(0, 2)
            }));

            assert.isEmpty(linter.verify(code, config));
        });

        it("should return trailing comments if a switch statement only contains comments", () => {
            const code = [
                "switch (foo) {",
                "    //comment",
                "    /*another comment*/",
                "}"
            ].join("\n");

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                SwitchStatement: assertCommentCount(0, 2),
                Identifier: assertCommentCount(0, 0)
            }));

            assert.isEmpty(linter.verify(code, config));
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

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                VariableDeclaration: assertCommentCount(1, 2),
                VariableDeclarator: node => {
                    if (varDeclCount === 0) {
                        assertCommentCount(0, 0)(node);
                    } else if (varDeclCount === 1) {
                        assertCommentCount(1, 0)(node);
                    } else {
                        assertCommentCount(1, 0)(node);
                    }
                    varDeclCount++;
                },
                Identifier: assertCommentCount(0, 0)
            }));

            assert.isEmpty(linter.verify(code, config));
        });

        it("should return comments when comments exist between var keyword and VariableDeclarator", () => {
            const code = [
                "var // Leading comment for VariableDeclarator",
                "    // Leading comment for VariableDeclarator",
                "    a;"
            ].join("\n");

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                VariableDeclaration: assertCommentCount(0, 0),
                VariableDeclarator: assertCommentCount(2, 0),
                Identifier: assertCommentCount(0, 0)
            }));

            assert.isEmpty(linter.verify(code, config));
        });

        it("should return attached comments between tokens to the correct nodes for empty function declarations", () => {
            const code = "/* 1 */ function /* 2 */ foo(/* 3 */) /* 4 */ { /* 5 */ } /* 6 */";

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                FunctionDeclaration: assertCommentCount(1, 1),
                Identifier: assertCommentCount(1, 0),
                BlockStatement: assertCommentCount(1, 1)
            }));

            assert.isEmpty(linter.verify(code, config));
        });

        it("should return attached comments between tokens to the correct nodes for empty class declarations", () => {
            const code = "/* 1 */ class /* 2 */ Foo /* 3 */ extends /* 4 */ Bar /* 5 */ { /* 6 */ } /* 7 */";
            let idCount = 0;

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                ClassDeclaration: assertCommentCount(1, 1),
                Identifier: node => {
                    if (idCount === 0) {
                        assertCommentCount(1, 1)(node);
                    } else {
                        assertCommentCount(1, 1)(node);
                    }
                    idCount++;
                },
                ClassBody: assertCommentCount(1, 1)
            }));

            assert.isEmpty(linter.verify(code, config));
        });

        it("should return attached comments between tokens to the correct nodes for empty switch statements", () => {
            const code = "/* 1 */ switch /* 2 */ (/* 3 */ foo /* 4 */) /* 5 */ { /* 6 */ } /* 7 */";

            linter.defineRule("checker", () => ({
                Program: assertCommentCount(0, 0),
                SwitchStatement: assertCommentCount(1, 6),
                Identifier: assertCommentCount(1, 1)
            }));

            assert.isEmpty(linter.verify(code, config));
        });
    });

    describe("getLines()", () => {

        it("should get proper lines when using \\n as a line break", () => {
            const code = "a;\nb;",
                ast = espree.parse(code, DEFAULT_CONFIG),
                sourceCode = new SourceCode(code, ast);

            const lines = sourceCode.getLines();

            assert.strictEqual(lines[0], "a;");
            assert.strictEqual(lines[1], "b;");
        });

        it("should get proper lines when using \\r\\n as a line break", () => {
            const code = "a;\r\nb;",
                ast = espree.parse(code, DEFAULT_CONFIG),
                sourceCode = new SourceCode(code, ast);

            const lines = sourceCode.getLines();

            assert.strictEqual(lines[0], "a;");
            assert.strictEqual(lines[1], "b;");
        });

        it("should get proper lines when using \\r as a line break", () => {
            const code = "a;\rb;",
                ast = espree.parse(code, DEFAULT_CONFIG),
                sourceCode = new SourceCode(code, ast);

            const lines = sourceCode.getLines();

            assert.strictEqual(lines[0], "a;");
            assert.strictEqual(lines[1], "b;");
        });

        it("should get proper lines when using \\u2028 as a line break", () => {
            const code = "a;\u2028b;",
                ast = espree.parse(code, DEFAULT_CONFIG),
                sourceCode = new SourceCode(code, ast);

            const lines = sourceCode.getLines();

            assert.strictEqual(lines[0], "a;");
            assert.strictEqual(lines[1], "b;");
        });

        it("should get proper lines when using \\u2029 as a line break", () => {
            const code = "a;\u2029b;",
                ast = espree.parse(code, DEFAULT_CONFIG),
                sourceCode = new SourceCode(code, ast);

            const lines = sourceCode.getLines();

            assert.strictEqual(lines[0], "a;");
            assert.strictEqual(lines[1], "b;");
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

                assert.strictEqual(shebangToken.type, "Shebang");
                assert.strictEqual(shebangText, "#!/usr/bin/env node");
            });
        });

        beforeEach(() => {
            ast = espree.parse(TEST_CODE, DEFAULT_CONFIG);
            sourceCode = new SourceCode(TEST_CODE, ast);
        });

        it("should retrieve all text when used without parameters", () => {
            const text = sourceCode.getText();

            assert.strictEqual(text, TEST_CODE);
        });

        it("should retrieve all text for root node", () => {
            const text = sourceCode.getText(ast);

            assert.strictEqual(text, TEST_CODE);
        });

        it("should clamp to valid range when retrieving characters before start of source", () => {
            const text = sourceCode.getText(ast, 2, 0);

            assert.strictEqual(text, TEST_CODE);
        });

        it("should retrieve all text for binary expression", () => {

            const node = ast.body[0].declarations[0].init;
            const text = sourceCode.getText(node);

            assert.strictEqual(text, "6 * 7");
        });

        it("should retrieve all text plus two characters before for binary expression", () => {

            const node = ast.body[0].declarations[0].init;
            const text = sourceCode.getText(node, 2);

            assert.strictEqual(text, "= 6 * 7");
        });

        it("should retrieve all text plus one character after for binary expression", () => {
            const node = ast.body[0].declarations[0].init;
            const text = sourceCode.getText(node, 0, 1);

            assert.strictEqual(text, "6 * 7;");
        });

        it("should retrieve all text plus two characters before and one character after for binary expression", () => {
            const node = ast.body[0].declarations[0].init;
            const text = sourceCode.getText(node, 2, 1);

            assert.strictEqual(text, "= 6 * 7;");
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

            assert.strictEqual(node.type, "Identifier");
        });

        it("should retrieve a node containing the given index", () => {
            const node = sourceCode.getNodeByRangeIndex(6);

            assert.strictEqual(node.type, "Identifier");
        });

        it("should retrieve a node that is exactly the given index", () => {
            const node = sourceCode.getNodeByRangeIndex(13);

            assert.strictEqual(node.type, "Literal");
            assert.strictEqual(node.value, 6);
        });

        it("should retrieve a node ending with the given index", () => {
            const node = sourceCode.getNodeByRangeIndex(9);

            assert.strictEqual(node.type, "Identifier");
        });

        it("should retrieve the deepest node containing the given index", () => {
            let node = sourceCode.getNodeByRangeIndex(14);

            assert.strictEqual(node.type, "BinaryExpression");
            node = sourceCode.getNodeByRangeIndex(3);
            assert.strictEqual(node.type, "VariableDeclaration");
        });

        it("should return null if the index is outside the range of any node", () => {
            let node = sourceCode.getNodeByRangeIndex(-1);

            assert.isNull(node);
            node = sourceCode.getNodeByRangeIndex(-99);
            assert.isNull(node);
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

                assert.strictEqual(
                    sourceCode.isSpaceBetweenTokens(
                        sourceCode.ast.tokens[0], sourceCode.ast.tokens[1]
                    ),
                    expected
                );
            });
        });
    });

    // need to check that linter.verify() works with SourceCode

    describe("linter.verify()", () => {

        const CONFIG = {
            parserOptions: { ecmaVersion: 6 }
        };

        it("should work when passed a SourceCode object without a config", () => {
            const ast = espree.parse(TEST_CODE, DEFAULT_CONFIG);

            const sourceCode = new SourceCode(TEST_CODE, ast),
                messages = linter.verify(sourceCode);

            assert.strictEqual(messages.length, 0);
        });

        it("should work when passed a SourceCode object containing ES6 syntax and config", () => {
            const sourceCode = new SourceCode("let foo = bar;", AST),
                messages = linter.verify(sourceCode, CONFIG);

            assert.strictEqual(messages.length, 0);
        });

        it("should report an error when using let and ecmaVersion is 6", () => {
            const sourceCode = new SourceCode("let foo = bar;", AST),
                messages = linter.verify(sourceCode, {
                    parserOptions: { ecmaVersion: 6 },
                    rules: { "no-unused-vars": 2 }
                });

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].message, "'foo' is assigned a value but never used.");
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
            assert.deepStrictEqual(sourceCode.getLocFromIndex(5), { line: 2, column: 1 });
            assert.deepStrictEqual(sourceCode.getLocFromIndex(3), { line: 1, column: 3 });
            assert.deepStrictEqual(sourceCode.getLocFromIndex(4), { line: 2, column: 0 });
            assert.deepStrictEqual(sourceCode.getLocFromIndex(21), { line: 6, column: 0 });
        });

        it("should throw if given a bad input", () => {
            assert.throws(
                () => sourceCode.getLocFromIndex({ line: 1, column: 1 }),
                /Expected `index` to be a number\./u
            );
        });

        it("should not throw if given sourceCode.text.length", () => {
            assert.deepStrictEqual(sourceCode.getLocFromIndex(CODE.length), { line: 8, column: 0 });
        });

        it("should throw if given an out-of-range input", () => {
            assert.throws(
                () => sourceCode.getLocFromIndex(CODE.length + 1),
                /Index out of range \(requested index 27, but source text has length 26\)\./u
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
                /Expected `loc` to be an object with numeric `line` and `column` properties\./u
            );

            assert.throws(
                () => sourceCode.getIndexFromLoc({ line: "three", column: "four" }),
                /Expected `loc` to be an object with numeric `line` and `column` properties\./u
            );
        });

        it("should throw a useful error if `line` is out of range", () => {
            assert.throws(
                () => sourceCode.getIndexFromLoc({ line: 9, column: 0 }),
                /Line number out of range \(line 9 requested, but only 8 lines present\)\./u
            );

            assert.throws(
                () => sourceCode.getIndexFromLoc({ line: 50, column: 3 }),
                /Line number out of range \(line 50 requested, but only 8 lines present\)\./u
            );

            assert.throws(
                () => sourceCode.getIndexFromLoc({ line: 0, column: 0 }),
                /Line number out of range \(line 0 requested\)\. Line numbers should be 1-based\./u
            );
        });

        it("should throw a useful error if `column` is out of range", () => {
            assert.throws(
                () => sourceCode.getIndexFromLoc({ line: 3, column: 4 }),
                /Column number out of range \(column 4 requested, but the length of line 3 is 4\)\./u
            );

            assert.throws(
                () => sourceCode.getIndexFromLoc({ line: 3, column: 50 }),
                /Column number out of range \(column 50 requested, but the length of line 3 is 4\)\./u
            );

            assert.throws(
                () => sourceCode.getIndexFromLoc({ line: 8, column: 1 }),
                /Column number out of range \(column 1 requested, but the length of line 8 is 0\)\./u
            );
        });

        it("should not throw if the location one spot past the last character is given", () => {
            assert.strictEqual(sourceCode.getIndexFromLoc({ line: 8, column: 0 }), CODE.length);
        });
    });
});
