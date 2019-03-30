/**
 * @fileoverview Tests for ast utils.
 * @author Gyandeep Singh
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    espree = require("espree"),
    astUtils = require("../../../lib/util/ast-utils"),
    Linter = require("../../../lib/linter"),
    SourceCode = require("../../../lib/util/source-code");

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
const linter = new Linter();

describe("ast-utils", () => {
    let callCounts;

    beforeEach(() => {
        callCounts = new Map();
    });

    /**
     * Asserts that a given function is called at least once during a test
     * @param {Function} func The function that must be called at least once
     * @returns {Function} A wrapper around the same function
     */
    function mustCall(func) {
        callCounts.set(func, 0);
        return function Wrapper(...args) {
            callCounts.set(func, callCounts.get(func) + 1);

            return func.call(this, ...args);
        };
    }

    afterEach(() => {
        callCounts.forEach((callCount, func) => {
            assert(
                callCount > 0,
                `Expected ${func.toString()} to be called at least once but it was not called`
            );
        });
    });

    describe("isTokenOnSameLine", () => {
        it("should return false if the tokens are not on the same line", () => {
            linter.defineRule("checker", mustCall(context => ({
                BlockStatement: mustCall(node => {
                    assert.isFalse(astUtils.isTokenOnSameLine(context.getTokenBefore(node), node));
                })
            })));

            linter.verify("if(a)\n{}", { rules: { checker: "error" } });
        });

        it("should return true if the tokens are on the same line", () => {

            linter.defineRule("checker", mustCall(context => ({
                BlockStatement: mustCall(node => {
                    assert.isTrue(astUtils.isTokenOnSameLine(context.getTokenBefore(node), node));
                })
            })));

            linter.verify("if(a){}", { rules: { checker: "error" } });
        });
    });

    describe("isNullOrUndefined", () => {
        it("should return true if the argument is null", () => {
            assert.isTrue(astUtils.isNullOrUndefined(espree.parse("null").body[0].expression));
        });

        it("should return true if the argument is undefined", () => {
            assert.isTrue(astUtils.isNullOrUndefined(espree.parse("undefined").body[0].expression));
        });

        it("should return false if the argument is a number", () => {
            assert.isFalse(astUtils.isNullOrUndefined(espree.parse("1").body[0].expression));
        });

        it("should return false if the argument is a string", () => {
            assert.isFalse(astUtils.isNullOrUndefined(espree.parse("'test'").body[0].expression));
        });

        it("should return false if the argument is a boolean", () => {
            assert.isFalse(astUtils.isNullOrUndefined(espree.parse("true").body[0].expression));
        });

        it("should return false if the argument is an object", () => {
            assert.isFalse(astUtils.isNullOrUndefined(espree.parse("({})").body[0].expression));
        });

        it("should return false if the argument is a unicode regex", () => {
            assert.isFalse(astUtils.isNullOrUndefined(espree.parse("/abc/u", { ecmaVersion: 6 }).body[0].expression));
        });
    });

    describe("checkReference", () => {

        // catch
        it("should return true if reference is assigned for catch", () => {
            linter.defineRule("checker", mustCall(context => ({
                CatchClause: mustCall(node => {
                    const variables = context.getDeclaredVariables(node);

                    assert.lengthOf(astUtils.getModifyingReferences(variables[0].references), 1);
                })
            })));

            linter.verify("try { } catch (e) { e = 10; }", { rules: { checker: "error" } });
        });

        // const
        it("should return true if reference is assigned for const", () => {
            linter.defineRule("checker", mustCall(context => ({
                VariableDeclaration: mustCall(node => {
                    const variables = context.getDeclaredVariables(node);

                    assert.lengthOf(astUtils.getModifyingReferences(variables[0].references), 1);
                })
            })));

            linter.verify("const a = 1; a = 2;", { rules: { checker: "error" }, parserOptions: { ecmaVersion: 6 } });
        });

        it("should return false if reference is not assigned for const", () => {
            linter.defineRule("checker", mustCall(context => ({
                VariableDeclaration: mustCall(node => {
                    const variables = context.getDeclaredVariables(node);

                    assert.lengthOf(astUtils.getModifyingReferences(variables[0].references), 0);
                })
            })));

            linter.verify("const a = 1; c = 2;", { rules: { checker: "error" }, parserOptions: { ecmaVersion: 6 } });
        });

        // class
        it("should return true if reference is assigned for class", () => {
            linter.defineRule("checker", mustCall(context => ({
                ClassDeclaration: mustCall(node => {
                    const variables = context.getDeclaredVariables(node);

                    assert.lengthOf(astUtils.getModifyingReferences(variables[0].references), 1);
                    assert.lengthOf(astUtils.getModifyingReferences(variables[1].references), 0);
                })
            })));

            linter.verify("class A { }\n A = 1;", { rules: { checker: "error" }, parserOptions: { ecmaVersion: 6 } });
        });

        it("should return false if reference is not assigned for class", () => {
            linter.defineRule("checker", mustCall(context => ({
                ClassDeclaration: mustCall(node => {
                    const variables = context.getDeclaredVariables(node);

                    assert.lengthOf(astUtils.getModifyingReferences(variables[0].references), 0);
                })
            })));

            linter.verify("class A { } foo(A);", { rules: { checker: "error" }, parserOptions: { ecmaVersion: 6 } });
        });
    });

    describe("isDirectiveComment", () => {

        /**
         * Asserts the node is NOT a directive comment
         * @param {ASTNode} node node to assert
         * @returns {void}
         *
         */
        function assertFalse(node) {
            assert.isFalse(astUtils.isDirectiveComment(node));
        }

        /**
         * Asserts the node is a directive comment
         * @param {ASTNode} node node to assert
         * @returns {void}
         *
         */
        function assertTrue(node) {
            assert.isTrue(astUtils.isDirectiveComment(node));
        }

        it("should return false if it is not a directive line comment", () => {
            const code = [
                "// lalala I'm a normal comment",
                "// trying to confuse eslint ",
                "//trying to confuse eslint-directive-detection",
                "//eslint is awesome"
            ].join("\n");
            const ast = espree.parse(code, ESPREE_CONFIG);
            const sourceCode = new SourceCode(code, ast);
            const comments = sourceCode.getAllComments();

            comments.forEach(assertFalse);
        });

        it("should return false if it is not a directive block comment", () => {
            const code = [
                "/* lalala I'm a normal comment */",
                "/* trying to confuse eslint */",
                "/* trying to confuse eslint-directive-detection */",
                "/*eSlInT is awesome*/"
            ].join("\n");
            const ast = espree.parse(code, ESPREE_CONFIG);
            const sourceCode = new SourceCode(code, ast);
            const comments = sourceCode.getAllComments();

            comments.forEach(assertFalse);
        });

        it("should return true if it is a directive line comment", () => {
            const code = [
                "// eslint-disable-line no-undef",
                "// eslint-secret-directive 4 8 15 16 23 42   ",
                "// eslint-directive-without-argument",
                "//eslint-directive-without-padding"
            ].join("\n");
            const ast = espree.parse(code, ESPREE_CONFIG);
            const sourceCode = new SourceCode(code, ast);
            const comments = sourceCode.getAllComments();

            comments.forEach(assertTrue);
        });

        it("should return true if it is a directive block comment", () => {
            const code = [
                "/* eslint-disable no-undef */",
                "/*eslint-enable no-undef*/",
                "/* eslint-env {\"es6\": true} */",
                "/* eslint foo */",
                "/*eslint bar*/"
            ].join("\n");
            const ast = espree.parse(code, ESPREE_CONFIG);
            const sourceCode = new SourceCode(code, ast);
            const comments = sourceCode.getAllComments();

            comments.forEach(assertTrue);
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

            linter.defineRule("checker", mustCall(() => ({
                [nodeType]: mustCall(node => {
                    results.push(astUtils.isInLoop(node));
                })
            })));
            linter.verify(code, { rules: { checker: "error" }, parserOptions: { ecmaVersion: 6 } });

            assert.lengthOf(results, 1);
            assert.strictEqual(results[0], expectedInLoop);
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

            assert.deepStrictEqual(astUtils.getDirectivePrologue(node), []);
        });

        it("should return empty array if node is a braceless ArrowFunctionExpression node", () => {
            const ast = espree.parse("var foo = () => 'use strict';", { ecmaVersion: 6 });
            const node = ast.body[0].declarations[0].init;

            assert.deepStrictEqual(astUtils.getDirectivePrologue(node), []);
        });

        it("should return empty array if there are no directives in Program body", () => {
            const ast = espree.parse("var foo;");
            const node = ast;

            assert.deepStrictEqual(astUtils.getDirectivePrologue(node), []);
        });

        it("should return empty array if there are no directives in FunctionDeclaration body", () => {
            const ast = espree.parse("function foo() { return bar; }");
            const node = ast.body[0];

            assert.deepStrictEqual(astUtils.getDirectivePrologue(node), []);
        });

        it("should return empty array if there are no directives in FunctionExpression body", () => {
            const ast = espree.parse("var foo = function() { return bar; }");
            const node = ast.body[0].declarations[0].init;

            assert.deepStrictEqual(astUtils.getDirectivePrologue(node), []);
        });

        it("should return empty array if there are no directives in ArrowFunctionExpression body", () => {
            const ast = espree.parse("var foo = () => { return bar; };", { ecmaVersion: 6 });
            const node = ast.body[0].declarations[0].init;

            assert.deepStrictEqual(astUtils.getDirectivePrologue(node), []);
        });

        it("should return directives in Program body", () => {
            const ast = espree.parse("'use strict'; 'use asm'; var foo;");
            const result = astUtils.getDirectivePrologue(ast);

            assert.strictEqual(result.length, 2);
            assert.strictEqual(result[0].expression.value, "use strict");
            assert.strictEqual(result[1].expression.value, "use asm");
        });

        it("should return directives in FunctionDeclaration body", () => {
            const ast = espree.parse("function foo() { 'use strict'; 'use asm'; return bar; }");
            const result = astUtils.getDirectivePrologue(ast.body[0]);

            assert.strictEqual(result.length, 2);
            assert.strictEqual(result[0].expression.value, "use strict");
            assert.strictEqual(result[1].expression.value, "use asm");
        });

        it("should return directives in FunctionExpression body", () => {
            const ast = espree.parse("var foo = function() { 'use strict'; 'use asm'; return bar; }");
            const result = astUtils.getDirectivePrologue(ast.body[0].declarations[0].init);

            assert.strictEqual(result.length, 2);
            assert.strictEqual(result[0].expression.value, "use strict");
            assert.strictEqual(result[1].expression.value, "use asm");
        });

        it("should return directives in ArrowFunctionExpression body", () => {
            const ast = espree.parse("var foo = () => { 'use strict'; 'use asm'; return bar; };", { ecmaVersion: 6 });
            const result = astUtils.getDirectivePrologue(ast.body[0].declarations[0].init);

            assert.strictEqual(result.length, 2);
            assert.strictEqual(result[0].expression.value, "use strict");
            assert.strictEqual(result[1].expression.value, "use asm");
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
            "class A { static set foo(a) {} }": "static setter 'foo'"
        };

        Object.keys(expectedResults).forEach(key => {
            it(`should return "${expectedResults[key]}" for "${key}".`, () => {
                linter.defineRule("checker", mustCall(() => ({
                    ":function": mustCall(node => {
                        assert.strictEqual(
                            astUtils.getFunctionNameWithKind(node),
                            expectedResults[key]
                        );
                    })
                })));

                linter.verify(key, { rules: { checker: "error" }, parserOptions: { ecmaVersion: 8 } });
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
            "class A { static set foo(a) {} }": [10, 24]
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
                linter.defineRule("checker", mustCall(() => ({
                    ":function": mustCall(node => {
                        assert.deepStrictEqual(
                            astUtils.getFunctionHeadLoc(node, linter.getSourceCode()),
                            expectedLoc
                        );
                    })
                })));

                linter.verify(key, { rules: { checker: "error" }, parserOptions: { ecmaVersion: 8 } }, "test.js", true);
            });
        });
    });

    describe("isEmptyBlock", () => {
        const expectedResults = {
            "{}": true,
            "{ a }": false,
            a: false
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
            "(a) => a": false
        };

        Object.keys(expectedResults).forEach(key => {
            it(`should return ${expectedResults[key]} for ${key}`, () => {
                const ast = espree.parse(key, { ecmaVersion: 6 });

                assert.strictEqual(astUtils.isEmptyFunction(ast.body[0].expression), expectedResults[key]);
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

    describe("couldBeError", () => {
        const EXPECTED_RESULTS = {
            5: false,
            null: false,
            true: false,
            "'foo'": false,
            "`foo`": false,
            foo: true,
            "new Foo": true,
            "Foo()": true,
            "foo`bar`": true,
            "foo.bar": true,
            "(foo = bar)": true,
            "(foo = 1)": false,
            "(1, 2, 3)": false,
            "(foo, 2, 3)": false,
            "(1, 2, foo)": true,
            "1 && 2": false,
            "1 && foo": true,
            "foo && 2": true,
            "foo ? 1 : 2": false,
            "foo ? bar : 2": true,
            "foo ? 1 : bar": true,
            "[1, 2, 3]": false,
            "({ foo: 1 })": false
        };

        Object.keys(EXPECTED_RESULTS).forEach(key => {
            it(`returns ${EXPECTED_RESULTS[key]} for ${key}`, () => {
                const ast = espree.parse(key, { ecmaVersion: 6 });

                assert.strictEqual(astUtils.couldBeError(ast.body[0].expression), EXPECTED_RESULTS[key]);
            });
        });
    });

    describe("isArrowToken", () => {
        const code = "() => 5";
        const tokens = espree.parse(code, { ecmaVersion: 6, tokens: true }).tokens;
        const expected = [false, false, true, false];

        tokens.forEach((token, index) => {
            it(`should return ${expected[index]} for '${token.value}'.`, () => {
                assert.strictEqual(astUtils.isArrowToken(token), expected[index]);
            });
        });
    });

    {
        const code = "if (obj && foo) { obj[foo](); }";
        const tokens = espree.parse(code, { ecmaVersion: 6, tokens: true }).tokens;
        const expected = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, true];

        describe("isClosingBraceToken", () => {
            tokens.forEach((token, index) => {
                it(`should return ${expected[index]} for '${token.value}'.`, () => {
                    assert.strictEqual(astUtils.isClosingBraceToken(token), expected[index]);
                });
            });
        });

        describe("isNotClosingBraceToken", () => {
            tokens.forEach((token, index) => {
                it(`should return ${expected[index]} for '${token.value}'.`, () => {
                    assert.strictEqual(astUtils.isNotClosingBraceToken(token), !expected[index]);
                });
            });
        });
    }

    {
        const code = "if (obj && foo) { obj[foo](); }";
        const tokens = espree.parse(code, { ecmaVersion: 6, tokens: true }).tokens;
        const expected = [false, false, false, false, false, false, false, false, false, false, true, false, false, false, false];

        describe("isClosingBracketToken", () => {
            tokens.forEach((token, index) => {
                it(`should return ${expected[index]} for '${token.value}'.`, () => {
                    assert.strictEqual(astUtils.isClosingBracketToken(token), expected[index]);
                });
            });
        });

        describe("isNotClosingBracketToken", () => {
            tokens.forEach((token, index) => {
                it(`should return ${expected[index]} for '${token.value}'.`, () => {
                    assert.strictEqual(astUtils.isNotClosingBracketToken(token), !expected[index]);
                });
            });
        });
    }

    {
        const code = "if (obj && foo) { obj[foo](); }";
        const tokens = espree.parse(code, { ecmaVersion: 6, tokens: true }).tokens;
        const expected = [false, false, false, false, false, true, false, false, false, false, false, false, true, false, false];

        describe("isClosingParenToken", () => {
            tokens.forEach((token, index) => {
                it(`should return ${expected[index]} for '${token.value}'.`, () => {
                    assert.strictEqual(astUtils.isClosingParenToken(token), expected[index]);
                });
            });
        });

        describe("isNotClosingParenToken", () => {
            tokens.forEach((token, index) => {
                it(`should return ${expected[index]} for '${token.value}'.`, () => {
                    assert.strictEqual(astUtils.isNotClosingParenToken(token), !expected[index]);
                });
            });
        });
    }

    {
        const code = "const obj = {foo: 1, bar: 2};";
        const tokens = espree.parse(code, { ecmaVersion: 6, tokens: true }).tokens;
        const expected = [false, false, false, false, false, true, false, false, false, true, false, false, false];

        describe("isColonToken", () => {
            tokens.forEach((token, index) => {
                it(`should return ${expected[index]} for '${token.value}'.`, () => {
                    assert.strictEqual(astUtils.isColonToken(token), expected[index]);
                });
            });
        });

        describe("isNotColonToken", () => {
            tokens.forEach((token, index) => {
                it(`should return ${expected[index]} for '${token.value}'.`, () => {
                    assert.strictEqual(astUtils.isNotColonToken(token), !expected[index]);
                });
            });
        });
    }

    {
        const code = "const obj = {foo: 1, bar: 2};";
        const tokens = espree.parse(code, { ecmaVersion: 6, tokens: true }).tokens;
        const expected = [false, false, false, false, false, false, false, true, false, false, false, false, false];

        describe("isCommaToken", () => {
            tokens.forEach((token, index) => {
                it(`should return ${expected[index]} for '${token.value}'.`, () => {
                    assert.strictEqual(astUtils.isCommaToken(token), expected[index]);
                });
            });
        });

        describe("isNotCommaToken", () => {
            tokens.forEach((token, index) => {
                it(`should return ${expected[index]} for '${token.value}'.`, () => {
                    assert.strictEqual(astUtils.isNotCommaToken(token), !expected[index]);
                });
            });
        });
    }

    describe("isCommentToken", () => {
        const code = "const obj = /*block*/ {foo: 1, bar: 2}; //line";
        const ast = espree.parse(code, { ecmaVersion: 6, tokens: true, comment: true });

        ast.tokens.forEach(token => {
            it(`should return false for '${token.value}'.`, () => {
                assert.strictEqual(astUtils.isCommentToken(token), false);
            });
        });
        ast.comments.forEach(comment => {
            it(`should return true for '${comment.value}'.`, () => {
                assert.strictEqual(astUtils.isCommentToken(comment), true);
            });
        });
    });

    describe("isKeywordToken", () => {
        const code = "const obj = {foo: 1, bar: 2};";
        const tokens = espree.parse(code, { ecmaVersion: 6, tokens: true }).tokens;
        const expected = [true, false, false, false, false, false, false, false, false, false, false, false, false];

        tokens.forEach((token, index) => {
            it(`should return ${expected[index]} for '${token.value}'.`, () => {
                assert.strictEqual(astUtils.isKeywordToken(token), expected[index]);
            });
        });
    });

    {
        const code = "if (obj && foo) { obj[foo](); }";
        const tokens = espree.parse(code, { ecmaVersion: 6, tokens: true }).tokens;
        const expected = [false, false, false, false, false, false, true, false, false, false, false, false, false, false, false];

        describe("isOpeningBraceToken", () => {
            tokens.forEach((token, index) => {
                it(`should return ${expected[index]} for '${token.value}'.`, () => {
                    assert.strictEqual(astUtils.isOpeningBraceToken(token), expected[index]);
                });
            });
        });

        describe("isNotOpeningBraceToken", () => {
            tokens.forEach((token, index) => {
                it(`should return ${expected[index]} for '${token.value}'.`, () => {
                    assert.strictEqual(astUtils.isNotOpeningBraceToken(token), !expected[index]);
                });
            });
        });
    }

    {
        const code = "if (obj && foo) { obj[foo](); }";
        const tokens = espree.parse(code, { ecmaVersion: 6, tokens: true }).tokens;
        const expected = [false, false, false, false, false, false, false, false, true, false, false, false, false, false, false];

        describe("isOpeningBracketToken", () => {
            tokens.forEach((token, index) => {
                it(`should return ${expected[index]} for '${token.value}'.`, () => {
                    assert.strictEqual(astUtils.isOpeningBracketToken(token), expected[index]);
                });
            });
        });

        describe("isNotOpeningBracketToken", () => {
            tokens.forEach((token, index) => {
                it(`should return ${expected[index]} for '${token.value}'.`, () => {
                    assert.strictEqual(astUtils.isNotOpeningBracketToken(token), !expected[index]);
                });
            });
        });
    }

    {
        const code = "if (obj && foo) { obj[foo](); }";
        const tokens = espree.parse(code, { ecmaVersion: 6, tokens: true }).tokens;
        const expected = [false, true, false, false, false, false, false, false, false, false, false, true, false, false, false];

        describe("isOpeningParenToken", () => {
            tokens.forEach((token, index) => {
                it(`should return ${expected[index]} for '${token.value}'.`, () => {
                    assert.strictEqual(astUtils.isOpeningParenToken(token), expected[index]);
                });
            });
        });

        describe("isNotOpeningParenToken", () => {
            tokens.forEach((token, index) => {
                it(`should return ${expected[index]} for '${token.value}'.`, () => {
                    assert.strictEqual(astUtils.isNotOpeningParenToken(token), !expected[index]);
                });
            });
        });
    }

    {
        const code = "if (obj && foo) { obj[foo](); }";
        const tokens = espree.parse(code, { ecmaVersion: 6, tokens: true }).tokens;
        const expected = [false, false, false, false, false, false, false, false, false, false, false, false, false, true, false];

        describe("isSemicolonToken", () => {
            tokens.forEach((token, index) => {
                it(`should return ${expected[index]} for '${token.value}'.`, () => {
                    assert.strictEqual(astUtils.isSemicolonToken(token), expected[index]);
                });
            });
        });

        describe("isNotSemicolonToken", () => {
            tokens.forEach((token, index) => {
                it(`should return ${expected[index]} for '${token.value}'.`, () => {
                    assert.strictEqual(astUtils.isNotSemicolonToken(token), !expected[index]);
                });
            });
        });
    }

    describe("isNullLiteral", () => {
        const EXPECTED_RESULTS = {
            null: true,
            "/abc/u": false,
            5: false,
            true: false,
            "'null'": false,
            foo: false
        };

        Object.keys(EXPECTED_RESULTS).forEach(key => {
            it(`returns ${EXPECTED_RESULTS[key]} for ${key}`, () => {
                const ast = espree.parse(key, { ecmaVersion: 6 });

                assert.strictEqual(astUtils.isNullLiteral(ast.body[0].expression), EXPECTED_RESULTS[key]);
            });
        });
    });

    describe("createGlobalLinebreakMatcher", () => {
        it("returns a regular expression with the g flag", () => {
            assert.instanceOf(astUtils.createGlobalLinebreakMatcher(), RegExp);
            assert(astUtils.createGlobalLinebreakMatcher().toString().endsWith("/gu"));
        });
        it("returns unique objects on each call", () => {
            const firstObject = astUtils.createGlobalLinebreakMatcher();
            const secondObject = astUtils.createGlobalLinebreakMatcher();

            assert.notStrictEqual(firstObject, secondObject);
        });
        describe("correctly matches linebreaks", () => {
            const LINE_COUNTS = {
                foo: 1,
                "foo\rbar": 2,
                "foo\n": 2,
                "foo\nbar": 2,
                "foo\r\nbar": 2,
                "foo\r\u2028bar": 3,
                "foo\u2029bar": 2
            };

            Object.keys(LINE_COUNTS).forEach(text => {
                it(text, () => {
                    assert.strictEqual(text.split(astUtils.createGlobalLinebreakMatcher()).length, LINE_COUNTS[text]);
                });
            });
        });
    });

    describe("canTokensBeAdjacent", () => {
        const CASES = new Map([
            [["foo", "bar"], false],
            [[";foo", "bar"], false],
            [[";", "bar"], true],
            [[")", "bar"], true],
            [["foo0", "bar"], false],
            [["foo;", "bar"], true],
            [["foo", "0"], false],
            [["of", ".2"], true],
            [["2", ".2"], false],
            [["of", "'foo'"], true],
            [["foo", "`bar`"], true],
            [["`foo`", "in"], true],
            [["of", "0.2"], false],
            [["of", "0."], false],
            [[".2", "foo"], false],
            [["2.", "foo"], false],
            [["+", "-"], true],
            [["++", "-"], true],
            [["+", "--"], true],
            [["++", "--"], true],
            [["-", "+"], true],
            [["--", "+"], true],
            [["-", "++"], true],
            [["--", "++"], true],
            [["+", "+"], false],
            [["-", "-"], false],
            [["++", "+"], false],
            [["--", "-"], false],
            [["+", "++"], false],
            [["-", "--"], false]
        ]);

        CASES.forEach((expectedResult, tokenStrings) => {
            it(tokenStrings.join(", "), () => {
                assert.strictEqual(astUtils.canTokensBeAdjacent(tokenStrings[0], tokenStrings[1]), expectedResult);
            });
        });
    });

    describe("equalTokens", () => {
        it("should return true if tokens are equal", () => {
            const code = "a=0;a=0;";
            const ast = espree.parse(code, ESPREE_CONFIG);
            const sourceCode = new SourceCode(code, ast);

            assert.strictEqual(astUtils.equalTokens(ast.body[0], ast.body[1], sourceCode), true);
        });

        it("should return false if tokens are not equal", () => {
            const code = "a=0;a=1;";
            const ast = espree.parse(code, ESPREE_CONFIG);
            const sourceCode = new SourceCode(code, ast);

            assert.strictEqual(astUtils.equalTokens(ast.body[0], ast.body[1], sourceCode), false);
        });
    });
});
