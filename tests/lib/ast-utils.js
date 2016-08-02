/**
 * @fileoverview Tests for ast utils.
 * @author Gyandeep Singh
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    sinon = require("sinon"),
    espree = require("espree"),
    astUtils = require("../../lib/ast-utils"),
    eslint = require("../../lib/eslint"),
    SourceCode = require("../../lib/util/source-code");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ast-utils", function() {
    const filename = "filename.js";
    let sandbox;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
        eslint.reset();
        sandbox.verifyAndRestore();
    });

    describe("isTokenOnSameLine", function() {
        it("should return false if its not on sameline", function() {

            /**
             * Check the node for tokens
             * @param {ASTNode} node node to examine
             * @returns {void}
             */
            function checker(node) {
                assert.isFalse(astUtils.isTokenOnSameLine(eslint.getTokenBefore(node), node));
            }

            eslint.reset();
            eslint.on("BlockStatement", checker);
            eslint.verify("if(a)\n{}", {}, filename, true);
        });

        it("should return true if its on sameline", function() {

            /**
             * Check the node for tokens
             * @param {ASTNode} node node to examine
             * @returns {void}
             */
            function checker(node) {
                assert.isTrue(astUtils.isTokenOnSameLine(eslint.getTokenBefore(node), node));
            }

            eslint.reset();
            eslint.on("BlockStatement", checker);
            eslint.verify("if(a){}", {}, filename, true);
        });
    });

    describe("isNullOrUndefined", function() {
        it("should return true if its null", function() {

            /**
             * Check the node for tokens
             * @param {ASTNode} node node to examine
             * @returns {void}
             */
            function checker(node) {
                assert.isTrue(astUtils.isNullOrUndefined(node.arguments[0]));
            }

            eslint.reset();
            eslint.on("CallExpression", checker);
            eslint.verify("foo.apply(null, a, b);", {}, filename, true);
        });

        it("should return true if its undefined", function() {

            /**
             * Check the node for tokens
             * @param {ASTNode} node node to examine
             * @returns {void}
             */
            function checker(node) {
                assert.isTrue(astUtils.isNullOrUndefined(node.arguments[0]));
            }

            eslint.reset();
            eslint.on("CallExpression", checker);
            eslint.verify("foo.apply(undefined, a, b);", {}, filename, true);
        });

        it("should return false if its a number", function() {

            /**
             * Check the node for tokens
             * @param {ASTNode} node node to examine
             * @returns {void}
             */
            function checker(node) {
                assert.isFalse(astUtils.isNullOrUndefined(node.arguments[0]));
            }

            eslint.reset();
            eslint.on("CallExpression", checker);
            eslint.verify("foo.apply(1, a, b);", {}, filename, true);
        });

        it("should return false if its a string", function() {

            /**
             * Check the node for tokens
             * @param {ASTNode} node node to examine
             * @returns {void}
             */
            function checker(node) {
                assert.isFalse(astUtils.isNullOrUndefined(node.arguments[0]));
            }

            eslint.reset();
            eslint.on("CallExpression", checker);
            eslint.verify("foo.apply(`test`, a, b);", {}, filename, true);
        });

        it("should return false if its a boolean", function() {

            /**
             * Check the node for tokens
             * @param {ASTNode} node node to examine
             * @returns {void}
             */
            function checker(node) {
                assert.isFalse(astUtils.isNullOrUndefined(node.arguments[0]));
            }

            eslint.reset();
            eslint.on("CallExpression", checker);
            eslint.verify("foo.apply(false, a, b);", {}, filename, true);
        });

        it("should return false if its an object", function() {

            /**
             * Check the node for tokens
             * @param {ASTNode} node node to examine
             * @returns {void}
             */
            function checker(node) {
                assert.isFalse(astUtils.isNullOrUndefined(node.arguments[0]));
            }

            eslint.reset();
            eslint.on("CallExpression", checker);
            eslint.verify("foo.apply({}, a, b);", {}, filename, true);
        });
    });

    describe("checkReference", function() {

        // catch
        it("should return true if reference is assigned for catch", function() {

            /**
             * Check the node for tokens
             * @param {ASTNode} node node to examine
             * @returns {void}
             */
            function checker(node) {
                const variables = eslint.getDeclaredVariables(node);

                assert.lengthOf(astUtils.getModifyingReferences(variables[0].references), 1);
            }

            eslint.reset();
            eslint.on("CatchClause", checker);
            eslint.verify("try { } catch (e) { e = 10; }", { rules: {} }, filename, true);
        });

        // const
        it("should return true if reference is assigned for const", function() {

            /**
             * Check the node for tokens
             * @param {ASTNode} node node to examine
             * @returns {void}
             */
            function checker(node) {
                const variables = eslint.getDeclaredVariables(node);

                assert.lengthOf(astUtils.getModifyingReferences(variables[0].references), 1);
            }

            eslint.reset();
            eslint.on("VariableDeclaration", checker);
            eslint.verify("const a = 1; a = 2;", {ecmaFeatures: {blockBindings: true}}, filename, true);
        });

        it("should return false if reference is not assigned for const", function() {

            /**
             * Check the node for tokens
             * @param {ASTNode} node node to examine
             * @returns {void}
             */
            function checker(node) {
                const variables = eslint.getDeclaredVariables(node);

                assert.lengthOf(astUtils.getModifyingReferences(variables[0].references), 0);
            }

            eslint.reset();
            eslint.on("VariableDeclaration", checker);
            eslint.verify("const a = 1; c = 2;", {ecmaFeatures: {blockBindings: true}}, filename, true);
        });

        // class
        it("should return true if reference is assigned for class", function() {

            /**
             * Check the node for tokens
             * @param {ASTNode} node node to examine
             * @returns {void}
             */
            function checker(node) {
                const variables = eslint.getDeclaredVariables(node);

                assert.lengthOf(astUtils.getModifyingReferences(variables[0].references), 1);
                assert.lengthOf(astUtils.getModifyingReferences(variables[1].references), 0);
            }

            eslint.reset();
            eslint.on("ClassDeclaration", checker);
            eslint.verify("class A { }\n A = 1;", {ecmaFeatures: {classes: true}}, filename, true);
        });

        it("should return false if reference is not assigned for class", function() {

            /**
             * Check the node for tokens
             * @param {ASTNode} node node to examine
             * @returns {void}
             */
            function checker(node) {
                const variables = eslint.getDeclaredVariables(node);

                assert.lengthOf(astUtils.getModifyingReferences(variables[0].references), 0);
            }

            eslint.reset();
            eslint.on("ClassDeclaration", checker);
            eslint.verify("class A { } foo(A);", {ecmaFeatures: {classes: true}}, filename, true);
        });
    });

    describe("isDirectiveComment", function() {

        /**
         * Asserts the node is NOT a directive comment
         * @param {ASTNode} node node to assert
         * @returns {void}
         * */
        function assertFalse(node) {
            assert.isFalse(astUtils.isDirectiveComment(node));
        }

        /**
         * Asserts the node is a directive comment
         * @param {ASTNode} node node to assert
         * @returns {void}
         * */
        function assertTrue(node) {
            assert.isTrue(astUtils.isDirectiveComment(node));
        }

        it("should return false if it is not a directive line comment", function() {
            eslint.reset();
            eslint.on("LineComment", assertFalse);
            eslint.verify("// lalala I'm a normal comment", {}, filename, true);
            eslint.verify("// trying to confuse eslint ", {}, filename, true);
            eslint.verify("//trying to confuse eslint-directive-detection", {}, filename, true);
            eslint.verify("//eslint is awesome", {}, filename, true);
        });

        it("should return false if it is not a directive block comment", function() {
            eslint.reset();
            eslint.on("BlockComment", assertFalse);
            eslint.verify("/* lalala I'm a normal comment */", {}, filename, true);
            eslint.verify("/* trying to confuse eslint */", {}, filename, true);
            eslint.verify("/* trying to confuse eslint-directive-detection */", {}, filename, true);
            eslint.verify("/*eSlInT is awesome*/", {}, filename, true);
        });

        it("should return true if it is a directive line comment", function() {
            eslint.reset();
            eslint.on("LineComment", assertTrue);
            eslint.verify("// eslint-disable-line no-undef", {}, filename, true);
            eslint.verify("// eslint-secret-directive 4 8 15 16 23 42   ", {}, filename, true);
            eslint.verify("// eslint-directive-without-argument", {}, filename, true);
            eslint.verify("//eslint-directive-without-padding", {}, filename, true);
        });

        it("should return true if it is a directive block comment", function() {
            eslint.reset();
            eslint.on("BlockComment", assertTrue);
            eslint.verify("/* eslint-disable no-undef", {}, filename, true);
            eslint.verify("/*eslint-enable no-undef", {}, filename, true);
            eslint.verify("/* eslint-env {\"es6\": true}", {}, filename, true);
            eslint.verify("/* eslint foo", {}, filename, true);
            eslint.verify("/*eslint bar", {}, filename, true);
        });
    });

    describe("isParenthesised", function() {
        const ESPREE_CONFIG = {
            ecmaVersion: 6,
            comment: true,
            tokens: true,
            range: true,
            loc: true
        };

        it("should return false for not parenthesised nodes", function() {
            const code = "condition ? 1 : 2";
            const ast = espree.parse(code, ESPREE_CONFIG);
            const sourceCode = new SourceCode(code, ast);

            assert.isFalse(astUtils.isParenthesised(sourceCode, ast.body[0].expression));
        });

        it("should return true for not parenthesised nodes", function() {
            const code = "(condition ? 1 : 2)";
            const ast = espree.parse(code, ESPREE_CONFIG);
            const sourceCode = new SourceCode(code, ast);

            assert.isTrue(astUtils.isParenthesised(sourceCode, ast.body[0].expression));
        });
    });

    describe("isFunction", function() {
        it("should return true for FunctionDeclaration", function() {
            const ast = espree.parse("function a() {}");
            const node = ast.body[0];

            assert(astUtils.isFunction(node));
        });

        it("should return true for FunctionExpression", function() {
            const ast = espree.parse("(function a() {})");
            const node = ast.body[0].expression;

            assert(astUtils.isFunction(node));
        });

        it("should return true for AllowFunctionExpression", function() {
            const ast = espree.parse("(() => {})", {ecmaVersion: 6});
            const node = ast.body[0].expression;

            assert(astUtils.isFunction(node));
        });

        it("should return false for Program, VariableDeclaration, BlockStatement", function() {
            const ast = espree.parse("var a; { }");

            assert(!astUtils.isFunction(ast));
            assert(!astUtils.isFunction(ast.body[0]));
            assert(!astUtils.isFunction(ast.body[1]));
        });
    });

    describe("isLoop", function() {
        it("should return true for DoWhileStatement", function() {
            const ast = espree.parse("do {} while (a)");
            const node = ast.body[0];

            assert(astUtils.isLoop(node));
        });

        it("should return true for ForInStatement", function() {
            const ast = espree.parse("for (var k in obj) {}");
            const node = ast.body[0];

            assert(astUtils.isLoop(node));
        });

        it("should return true for ForOfStatement", function() {
            const ast = espree.parse("for (var x of list) {}", {ecmaVersion: 6});
            const node = ast.body[0];

            assert(astUtils.isLoop(node));
        });

        it("should return true for ForStatement", function() {
            const ast = espree.parse("for (var i = 0; i < 10; ++i) {}");
            const node = ast.body[0];

            assert(astUtils.isLoop(node));
        });

        it("should return true for WhileStatement", function() {
            const ast = espree.parse("while (a) {}");
            const node = ast.body[0];

            assert(astUtils.isLoop(node));
        });

        it("should return false for Program, VariableDeclaration, BlockStatement", function() {
            const ast = espree.parse("var a; { }");

            assert(!astUtils.isLoop(ast));
            assert(!astUtils.isLoop(ast.body[0]));
            assert(!astUtils.isLoop(ast.body[1]));
        });
    });
});
