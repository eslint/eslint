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

const ESPREE_CONFIG = {
    ecmaVersion: 6,
    comment: true,
    tokens: true,
    range: true,
    loc: true
};

describe("ast-utils", () => {
    const filename = "filename.js";
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        eslint.reset();
        sandbox.verifyAndRestore();
    });

    describe("isTokenOnSameLine", () => {
        it("should return false if its not on sameline", () => {

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

        it("should return true if its on sameline", () => {

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

    describe("isNullOrUndefined", () => {
        it("should return true if its null", () => {

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

        it("should return true if its undefined", () => {

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

        it("should return false if its a number", () => {

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

        it("should return false if its a string", () => {

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

        it("should return false if its a boolean", () => {

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

        it("should return false if its an object", () => {

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

    describe("checkReference", () => {

        // catch
        it("should return true if reference is assigned for catch", () => {

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
        it("should return true if reference is assigned for const", () => {

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
            eslint.verify("const a = 1; a = 2;", { ecmaFeatures: { blockBindings: true } }, filename, true);
        });

        it("should return false if reference is not assigned for const", () => {

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
            eslint.verify("const a = 1; c = 2;", { ecmaFeatures: { blockBindings: true } }, filename, true);
        });

        // class
        it("should return true if reference is assigned for class", () => {

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
            eslint.verify("class A { }\n A = 1;", { ecmaFeatures: { classes: true } }, filename, true);
        });

        it("should return false if reference is not assigned for class", () => {

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
            eslint.verify("class A { } foo(A);", { ecmaFeatures: { classes: true } }, filename, true);
        });
    });

    describe("isDirectiveComment", () => {

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

        it("should return false if it is not a directive line comment", () => {
            eslint.reset();
            eslint.on("LineComment", assertFalse);
            eslint.verify("// lalala I'm a normal comment", {}, filename, true);
            eslint.verify("// trying to confuse eslint ", {}, filename, true);
            eslint.verify("//trying to confuse eslint-directive-detection", {}, filename, true);
            eslint.verify("//eslint is awesome", {}, filename, true);
        });

        it("should return false if it is not a directive block comment", () => {
            eslint.reset();
            eslint.on("BlockComment", assertFalse);
            eslint.verify("/* lalala I'm a normal comment */", {}, filename, true);
            eslint.verify("/* trying to confuse eslint */", {}, filename, true);
            eslint.verify("/* trying to confuse eslint-directive-detection */", {}, filename, true);
            eslint.verify("/*eSlInT is awesome*/", {}, filename, true);
        });

        it("should return true if it is a directive line comment", () => {
            eslint.reset();
            eslint.on("LineComment", assertTrue);
            eslint.verify("// eslint-disable-line no-undef", {}, filename, true);
            eslint.verify("// eslint-secret-directive 4 8 15 16 23 42   ", {}, filename, true);
            eslint.verify("// eslint-directive-without-argument", {}, filename, true);
            eslint.verify("//eslint-directive-without-padding", {}, filename, true);
        });

        it("should return true if it is a directive block comment", () => {
            eslint.reset();
            eslint.on("BlockComment", assertTrue);
            eslint.verify("/* eslint-disable no-undef", {}, filename, true);
            eslint.verify("/*eslint-enable no-undef", {}, filename, true);
            eslint.verify("/* eslint-env {\"es6\": true}", {}, filename, true);
            eslint.verify("/* eslint foo", {}, filename, true);
            eslint.verify("/*eslint bar", {}, filename, true);
        });
    });

    describe("isParenthesised", () => {
        it("should return false for not parenthesised nodes", () => {
            const code = "condition ? 1 : 2";
            const ast = espree.parse(code, ESPREE_CONFIG);
            const sourceCode = new SourceCode(code, ast);

            assert.isFalse(astUtils.isParenthesised(sourceCode, ast.body[0].expression));
        });

        it("should return true for not parenthesised nodes", () => {
            const code = "(condition ? 1 : 2)";
            const ast = espree.parse(code, ESPREE_CONFIG);
            const sourceCode = new SourceCode(code, ast);

            assert.isTrue(astUtils.isParenthesised(sourceCode, ast.body[0].expression));
        });
    });

    describe("isFunction", () => {
        it("should return true for FunctionDeclaration", () => {
            const ast = espree.parse("function a() {}");
            const node = ast.body[0];

            assert(astUtils.isFunction(node));
        });

        it("should return true for FunctionExpression", () => {
            const ast = espree.parse("(function a() {})");
            const node = ast.body[0].expression;

            assert(astUtils.isFunction(node));
        });

        it("should return true for AllowFunctionExpression", () => {
            const ast = espree.parse("(() => {})", { ecmaVersion: 6 });
            const node = ast.body[0].expression;

            assert(astUtils.isFunction(node));
        });

        it("should return false for Program, VariableDeclaration, BlockStatement", () => {
            const ast = espree.parse("var a; { }");

            assert(!astUtils.isFunction(ast));
            assert(!astUtils.isFunction(ast.body[0]));
            assert(!astUtils.isFunction(ast.body[1]));
        });
    });

    describe("isLoop", () => {
        it("should return true for DoWhileStatement", () => {
            const ast = espree.parse("do {} while (a)");
            const node = ast.body[0];

            assert(astUtils.isLoop(node));
        });

        it("should return true for ForInStatement", () => {
            const ast = espree.parse("for (var k in obj) {}");
            const node = ast.body[0];

            assert(astUtils.isLoop(node));
        });

        it("should return true for ForOfStatement", () => {
            const ast = espree.parse("for (var x of list) {}", { ecmaVersion: 6 });
            const node = ast.body[0];

            assert(astUtils.isLoop(node));
        });

        it("should return true for ForStatement", () => {
            const ast = espree.parse("for (var i = 0; i < 10; ++i) {}");
            const node = ast.body[0];

            assert(astUtils.isLoop(node));
        });

        it("should return true for WhileStatement", () => {
            const ast = espree.parse("while (a) {}");
            const node = ast.body[0];

            assert(astUtils.isLoop(node));
        });

        it("should return false for Program, VariableDeclaration, BlockStatement", () => {
            const ast = espree.parse("var a; { }");

            assert(!astUtils.isLoop(ast));
            assert(!astUtils.isLoop(ast.body[0]));
            assert(!astUtils.isLoop(ast.body[1]));
        });
    });

    describe("isInLoop", () => {

        /**
         * Asserts that the unique node of the given type in the code is either
         * in a loop or not in a loop.
         *
         * @param {string} code the code to check.
         * @param {string} nodeType the type of the node to consider. The code
         *      must have exactly one node of ths type.
         * @param {boolean} expectedInLoop the expected result for whether the
         *      node is in a loop.
         * @returns {void}
         */
        function assertNodeTypeInLoop(code, nodeType, expectedInLoop) {
            const results = [];

            eslint.reset();
            eslint.on(nodeType, node => results.push(astUtils.isInLoop(node)));
            eslint.verify(code, { parserOptions: { ecmaVersion: 6 } }, filename, true);

            assert.lengthOf(results, 1);
            assert.equal(results[0], expectedInLoop);
        }

        it("should return true for a loop itself", () => {
            assertNodeTypeInLoop("while (a) {}", "WhileStatement", true);
        });

        it("should return true for a loop condition", () => {
            assertNodeTypeInLoop("while (a) {}", "Identifier", true);
        });

        it("should return true for a loop assignee", () => {
            assertNodeTypeInLoop("for (var a in b) {}", "VariableDeclaration", true);
        });

        it("should return true for a node within a loop body", () => {
            assertNodeTypeInLoop("for (var a of b) { console.log('Hello'); }", "Literal", true);
        });

        it("should return false for a node outside a loop body", () => {
            assertNodeTypeInLoop("while (true) {} a(b);", "CallExpression", false);
        });

        it("should return false when the loop is not in the current function", () => {
            assertNodeTypeInLoop("while (true) { funcs.push(() => { var a; }); }", "VariableDeclaration", false);
        });
    });

    describe("getStaticPropertyName", () => {
        it("should return 'b' for `a.b`", () => {
            const ast = espree.parse("a.b");
            const node = ast.body[0].expression;

            assert.strictEqual(astUtils.getStaticPropertyName(node), "b");
        });

        it("should return 'b' for `a['b']`", () => {
            const ast = espree.parse("a['b']");
            const node = ast.body[0].expression;

            assert.strictEqual(astUtils.getStaticPropertyName(node), "b");
        });

        it("should return 'b' for `a[`b`]`", () => {
            const ast = espree.parse("a[`b`]", { ecmaVersion: 6 });
            const node = ast.body[0].expression;

            assert.strictEqual(astUtils.getStaticPropertyName(node), "b");
        });

        it("should return '100' for `a[100]`", () => {
            const ast = espree.parse("a[100]");
            const node = ast.body[0].expression;

            assert.strictEqual(astUtils.getStaticPropertyName(node), "100");
        });

        it("should return null for `a[b]`", () => {
            const ast = espree.parse("a[b]");
            const node = ast.body[0].expression;

            assert.strictEqual(astUtils.getStaticPropertyName(node), null);
        });

        it("should return null for `a['a' + 'b']`", () => {
            const ast = espree.parse("a['a' + 'b']");
            const node = ast.body[0].expression;

            assert.strictEqual(astUtils.getStaticPropertyName(node), null);
        });

        it("should return null for `a[tag`b`]`", () => {
            const ast = espree.parse("a[tag`b`]", { ecmaVersion: 6 });
            const node = ast.body[0].expression;

            assert.strictEqual(astUtils.getStaticPropertyName(node), null);
        });

        it("should return null for `a[`${b}`]`", () => {
            const ast = espree.parse("a[`${b}`]", { ecmaVersion: 6 });
            const node = ast.body[0].expression;

            assert.strictEqual(astUtils.getStaticPropertyName(node), null);
        });

        it("should return 'b' for `b: 1`", () => {
            const ast = espree.parse("({b: 1})");
            const node = ast.body[0].expression.properties[0];

            assert.strictEqual(astUtils.getStaticPropertyName(node), "b");
        });

        it("should return 'b' for `b() {}`", () => {
            const ast = espree.parse("({b() {}})", { ecmaVersion: 6 });
            const node = ast.body[0].expression.properties[0];

            assert.strictEqual(astUtils.getStaticPropertyName(node), "b");
        });

        it("should return 'b' for `get b() {}`", () => {
            const ast = espree.parse("({get b() {}})", { ecmaVersion: 6 });
            const node = ast.body[0].expression.properties[0];

            assert.strictEqual(astUtils.getStaticPropertyName(node), "b");
        });

        it("should return 'b' for `['b']: 1`", () => {
            const ast = espree.parse("({['b']: 1})", { ecmaVersion: 6 });
            const node = ast.body[0].expression.properties[0];

            assert.strictEqual(astUtils.getStaticPropertyName(node), "b");
        });

        it("should return 'b' for `['b']() {}`", () => {
            const ast = espree.parse("({['b']() {}})", { ecmaVersion: 6 });
            const node = ast.body[0].expression.properties[0];

            assert.strictEqual(astUtils.getStaticPropertyName(node), "b");
        });

        it("should return 'b' for `[`b`]: 1`", () => {
            const ast = espree.parse("({[`b`]: 1})", { ecmaVersion: 6 });
            const node = ast.body[0].expression.properties[0];

            assert.strictEqual(astUtils.getStaticPropertyName(node), "b");
        });

        it("should return '100' for` [100]: 1`", () => {
            const ast = espree.parse("({[100]: 1})", { ecmaVersion: 6 });
            const node = ast.body[0].expression.properties[0];

            assert.strictEqual(astUtils.getStaticPropertyName(node), "100");
        });

        it("should return null for `[b]: 1`", () => {
            const ast = espree.parse("({[b]: 1})", { ecmaVersion: 6 });
            const node = ast.body[0].expression.properties[0];

            assert.strictEqual(astUtils.getStaticPropertyName(node), null);
        });

        it("should return null for `['a' + 'b']: 1`", () => {
            const ast = espree.parse("({['a' + 'b']: 1})", { ecmaVersion: 6 });
            const node = ast.body[0].expression.properties[0];

            assert.strictEqual(astUtils.getStaticPropertyName(node), null);
        });

        it("should return null for `[tag`b`]: 1`", () => {
            const ast = espree.parse("({[tag`b`]: 1})", { ecmaVersion: 6 });
            const node = ast.body[0].expression.properties[0];

            assert.strictEqual(astUtils.getStaticPropertyName(node), null);
        });

        it("should return null for `[`${b}`]: 1`", () => {
            const ast = espree.parse("({[`${b}`]: 1})", { ecmaVersion: 6 });
            const node = ast.body[0].expression.properties[0];

            assert.strictEqual(astUtils.getStaticPropertyName(node), null);
        });

        it("should return null for non member expressions", () => {
            const ast = espree.parse("foo()");

            assert.strictEqual(astUtils.getStaticPropertyName(ast.body[0].expression), null);
            assert.strictEqual(astUtils.getStaticPropertyName(ast.body[0]), null);
            assert.strictEqual(astUtils.getStaticPropertyName(ast.body), null);
            assert.strictEqual(astUtils.getStaticPropertyName(ast), null);
            assert.strictEqual(astUtils.getStaticPropertyName(null), null);
        });
    });

    describe("getDirectivePrologue", () => {
        it("should return empty array if node is not a Program, FunctionDeclaration, FunctionExpression, or ArrowFunctionExpression", () => {
            const ast = espree.parse("if (a) { b(); }");
            const node = ast.body[0];

            assert.deepEqual(astUtils.getDirectivePrologue(node), []);
        });

        it("should return empty array if node is a braceless ArrowFunctionExpression node", () => {
            const ast = espree.parse("var foo = () => 'use strict';", { ecmaVersion: 6 });
            const node = ast.body[0].declarations[0].init;

            assert.deepEqual(astUtils.getDirectivePrologue(node), []);
        });

        it("should return empty array if there are no directives in Program body", () => {
            const ast = espree.parse("var foo;");
            const node = ast;

            assert.deepEqual(astUtils.getDirectivePrologue(node), []);
        });

        it("should return empty array if there are no directives in FunctionDeclaration body", () => {
            const ast = espree.parse("function foo() { return bar; }");
            const node = ast.body[0];

            assert.deepEqual(astUtils.getDirectivePrologue(node), []);
        });

        it("should return empty array if there are no directives in FunctionExpression body", () => {
            const ast = espree.parse("var foo = function() { return bar; }");
            const node = ast.body[0].declarations[0].init;

            assert.deepEqual(astUtils.getDirectivePrologue(node), []);
        });

        it("should return empty array if there are no directives in ArrowFunctionExpression body", () => {
            const ast = espree.parse("var foo = () => { return bar; };", { ecmaVersion: 6 });
            const node = ast.body[0].declarations[0].init;

            assert.deepEqual(astUtils.getDirectivePrologue(node), []);
        });

        it("should return directives in Program body", () => {
            const ast = espree.parse("'use strict'; 'use asm'; var foo;");
            const result = astUtils.getDirectivePrologue(ast);

            assert.equal(result.length, 2);
            assert.equal(result[0].expression.value, "use strict");
            assert.equal(result[1].expression.value, "use asm");
        });

        it("should return directives in FunctionDeclaration body", () => {
            const ast = espree.parse("function foo() { 'use strict'; 'use asm'; return bar; }");
            const result = astUtils.getDirectivePrologue(ast.body[0]);

            assert.equal(result.length, 2);
            assert.equal(result[0].expression.value, "use strict");
            assert.equal(result[1].expression.value, "use asm");
        });

        it("should return directives in FunctionExpression body", () => {
            const ast = espree.parse("var foo = function() { 'use strict'; 'use asm'; return bar; }");
            const result = astUtils.getDirectivePrologue(ast.body[0].declarations[0].init);

            assert.equal(result.length, 2);
            assert.equal(result[0].expression.value, "use strict");
            assert.equal(result[1].expression.value, "use asm");
        });

        it("should return directives in ArrowFunctionExpression body", () => {
            const ast = espree.parse("var foo = () => { 'use strict'; 'use asm'; return bar; };", { ecmaVersion: 6 });
            const result = astUtils.getDirectivePrologue(ast.body[0].declarations[0].init);

            assert.equal(result.length, 2);
            assert.equal(result[0].expression.value, "use strict");
            assert.equal(result[1].expression.value, "use asm");
        });
    });

    describe("isDecimalInteger", () => {
        const expectedResults = {
            5: true,
            0: true,
            "5.": false,
            "5.0": false,
            "05": false,
            "0x5": false,
            "5e0": false,
            "5e-0": false,
            "'5'": false
        };

        Object.keys(expectedResults).forEach(key => {
            it(`should return ${expectedResults[key]} for ${key}`, () => {
                assert.strictEqual(astUtils.isDecimalInteger(espree.parse(key).body[0].expression), expectedResults[key]);
            });
        });
    });

    describe("getFunctionNameWithKind", () => {
        const expectedResults = {
            "function foo() {}": "function 'foo'",
            "(function foo() {})": "function 'foo'",
            "(function() {})": "function",
            "function* foo() {}": "generator function 'foo'",
            "(function* foo() {})": "generator function 'foo'",
            "(function*() {})": "generator function",
            "() => {}": "arrow function",
            "async () => {}": "async arrow function",
            "({ foo: function foo() {} })": "method 'foo'",
            "({ foo: function() {} })": "method 'foo'",
            "({ ['foo']: function() {} })": "method 'foo'",
            "({ [foo]: function() {} })": "method",
            "({ foo() {} })": "method 'foo'",
            "({ foo: function* foo() {} })": "generator method 'foo'",
            "({ foo: function*() {} })": "generator method 'foo'",
            "({ ['foo']: function*() {} })": "generator method 'foo'",
            "({ [foo]: function*() {} })": "generator method",
            "({ *foo() {} })": "generator method 'foo'",
            "({ foo: async function foo() {} })": "async method 'foo'",
            "({ foo: async function() {} })": "async method 'foo'",
            "({ ['foo']: async function() {} })": "async method 'foo'",
            "({ [foo]: async function() {} })": "async method",
            "({ async foo() {} })": "async method 'foo'",
            "({ get foo() {} })": "getter 'foo'",
            "({ set foo(a) {} })": "setter 'foo'",
            "class A { constructor() {} }": "constructor",
            "class A { foo() {} }": "method 'foo'",
            "class A { *foo() {} }": "generator method 'foo'",
            "class A { async foo() {} }": "async method 'foo'",
            "class A { ['foo']() {} }": "method 'foo'",
            "class A { *['foo']() {} }": "generator method 'foo'",
            "class A { async ['foo']() {} }": "async method 'foo'",
            "class A { [foo]() {} }": "method",
            "class A { *[foo]() {} }": "generator method",
            "class A { async [foo]() {} }": "async method",
            "class A { get foo() {} }": "getter 'foo'",
            "class A { set foo(a) {} }": "setter 'foo'",
            "class A { static foo() {} }": "static method 'foo'",
            "class A { static *foo() {} }": "static generator method 'foo'",
            "class A { static async foo() {} }": "static async method 'foo'",
            "class A { static get foo() {} }": "static getter 'foo'",
            "class A { static set foo(a) {} }": "static setter 'foo'",
        };

        Object.keys(expectedResults).forEach(key => {
            it(`should return "${expectedResults[key]}" for "${key}".`, () => {
                let called = false;

                /**
                 * Verify.
                 * @param {ASTNode} node - The function node to verify.
                 * @returns {void}
                 */
                function verify(node) {
                    assert.strictEqual(
                        astUtils.getFunctionNameWithKind(node),
                        expectedResults[key]
                    );
                    called = true;
                }

                eslint.on("FunctionDeclaration", verify);
                eslint.on("FunctionExpression", verify);
                eslint.on("ArrowFunctionExpression", verify);
                eslint.verify(key, { parserOptions: { ecmaVersion: 8 } }, "test.js", true);

                assert(called);
            });
        });
    });

    describe("getFunctionHeadLoc", () => {
        const expectedResults = {
            "function foo() {}": [0, 12],
            "(function foo() {})": [1, 13],
            "(function() {})": [1, 9],
            "function* foo() {}": [0, 13],
            "(function* foo() {})": [1, 14],
            "(function*() {})": [1, 10],
            "() => {}": [3, 5],
            "async () => {}": [9, 11],
            "({ foo: function foo() {} })": [3, 20],
            "({ foo: function() {} })": [3, 16],
            "({ ['foo']: function() {} })": [3, 20],
            "({ [foo]: function() {} })": [3, 18],
            "({ foo() {} })": [3, 6],
            "({ foo: function* foo() {} })": [3, 21],
            "({ foo: function*() {} })": [3, 17],
            "({ ['foo']: function*() {} })": [3, 21],
            "({ [foo]: function*() {} })": [3, 19],
            "({ *foo() {} })": [3, 7],
            "({ foo: async function foo() {} })": [3, 26],
            "({ foo: async function() {} })": [3, 22],
            "({ ['foo']: async function() {} })": [3, 26],
            "({ [foo]: async function() {} })": [3, 24],
            "({ async foo() {} })": [3, 12],
            "({ get foo() {} })": [3, 10],
            "({ set foo(a) {} })": [3, 10],
            "class A { constructor() {} }": [10, 21],
            "class A { foo() {} }": [10, 13],
            "class A { *foo() {} }": [10, 14],
            "class A { async foo() {} }": [10, 19],
            "class A { ['foo']() {} }": [10, 17],
            "class A { *['foo']() {} }": [10, 18],
            "class A { async ['foo']() {} }": [10, 23],
            "class A { [foo]() {} }": [10, 15],
            "class A { *[foo]() {} }": [10, 16],
            "class A { async [foo]() {} }": [10, 21],
            "class A { get foo() {} }": [10, 17],
            "class A { set foo(a) {} }": [10, 17],
            "class A { static foo() {} }": [10, 20],
            "class A { static *foo() {} }": [10, 21],
            "class A { static async foo() {} }": [10, 26],
            "class A { static get foo() {} }": [10, 24],
            "class A { static set foo(a) {} }": [10, 24],
        };

        Object.keys(expectedResults).forEach(key => {
            const expectedLoc = {
                start: {
                    line: 1,
                    column: expectedResults[key][0]
                },
                end: {
                    line: 1,
                    column: expectedResults[key][1]
                }
            };

            it(`should return "${JSON.stringify(expectedLoc)}" for "${key}".`, () => {
                let called = false;

                /**
                 * Verify.
                 * @param {ASTNode} node - The function node to verify.
                 * @returns {void}
                 */
                function verify(node) {
                    assert.deepEqual(
                        astUtils.getFunctionHeadLoc(node, eslint.getSourceCode()),
                        expectedLoc
                    );
                    called = true;
                }

                eslint.on("FunctionDeclaration", verify);
                eslint.on("FunctionExpression", verify);
                eslint.on("ArrowFunctionExpression", verify);
                eslint.verify(key, { parserOptions: { ecmaVersion: 8 } }, "test.js", true);

                assert(called);
            });
        });
    });

    describe("isEmptyBlock", () => {
        const expectedResults = {
            "{}": true,
            "{ a }": false,
            a: false,
        };

        Object.keys(expectedResults).forEach(key => {
            it(`should return ${expectedResults[key]} for ${key}`, () => {
                const ast = espree.parse(key);

                assert.strictEqual(astUtils.isEmptyBlock(ast.body[0]), expectedResults[key]);
            });
        });
    });

    describe("isEmptyFunction", () => {
        const expectedResults = {
            "(function foo() {})": true,
            "(function foo() { a })": false,
            "(a) => {}": true,
            "(a) => { a }": false,
            "(a) => a": false,
        };

        Object.keys(expectedResults).forEach(key => {
            it(`should return ${expectedResults[key]} for ${key}`, () => {
                const ast = espree.parse(key, { ecmaVersion: 6 });

                assert.strictEqual(astUtils.isEmptyFunction(ast.body[0].expression), expectedResults[key]);
            });
        });
    });

    describe("getLocationFromRangeIndex()", () => {
        it("should return the location of a range index", () => {

            const CODE =
                "foo\n" +
                "bar\r\n" +
                "baz\r" +
                "qux\u2028" +
                "foo\u2029" +
                "qux\n";
            const ast = espree.parse(CODE, ESPREE_CONFIG);
            const sourceCode = new SourceCode(CODE, ast);

            assert.deepEqual(astUtils.getLocationFromRangeIndex(sourceCode, 5), { line: 2, column: 1 });
            assert.deepEqual(astUtils.getLocationFromRangeIndex(sourceCode, 3), { line: 1, column: 3 });
            assert.deepEqual(astUtils.getLocationFromRangeIndex(sourceCode, 4), { line: 2, column: 0 });
            assert.deepEqual(astUtils.getLocationFromRangeIndex(sourceCode, 21), { line: 6, column: 0 });
        });

    });

    describe("getRangeIndexFromLocation()", () => {
        it("should return the range index of a location", () => {
            const CODE =
                "foo\n" +
                "bar\r\n" +
                "baz\r" +
                "qux\u2028" +
                "foo\u2029" +
                "qux\n";
            const ast = espree.parse(CODE, ESPREE_CONFIG);
            const sourceCode = new SourceCode(CODE, ast);

            assert.strictEqual(astUtils.getRangeIndexFromLocation(sourceCode, { line: 2, column: 1 }), 5);
            assert.strictEqual(astUtils.getRangeIndexFromLocation(sourceCode, { line: 1, column: 3 }), 3);
            assert.strictEqual(astUtils.getRangeIndexFromLocation(sourceCode, { line: 2, column: 0 }), 4);
            assert.strictEqual(astUtils.getRangeIndexFromLocation(sourceCode, { line: 6, column: 0 }), 21);

            sourceCode.lines.forEach((line, index) => {
                assert.strictEqual(
                    line[0],
                    sourceCode.text[astUtils.getRangeIndexFromLocation(sourceCode, { line: index + 1, column: 0 })]
                );
            });
        });
    });

    describe("getParenthesisedText", () => {
        const expectedResults = {
            "(((foo))); bar;": "(((foo)))",
            "(/* comment */(((foo.bar())))); baz();": "(/* comment */(((foo.bar()))))",
            "(foo, bar)": "(foo, bar)"
        };

        Object.keys(expectedResults).forEach(key => {
            it(`should return ${expectedResults[key]} for ${key}`, () => {
                const ast = espree.parse(key, { tokens: true, comment: true, range: true, loc: true });
                const sourceCode = new SourceCode(key, ast);

                assert.strictEqual(astUtils.getParenthesisedText(sourceCode, ast.body[0].expression), expectedResults[key]);
            });
        });
    });
});
