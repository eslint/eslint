/**
 * @fileoverview Tests for CodePath.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("assert"),
    { Linter } = require("../../../../lib/linter");
const linter = new Linter({ configType: "eslintrc" });

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Gets the code path of a given source code.
 * @param {string} code A source code.
 * @returns {CodePath[]} A list of created code paths.
 */
function parseCodePaths(code) {
    const retv = [];

    linter.defineRule("test", {
        create: () => ({
            onCodePathStart(codePath) {
                retv.push(codePath);
            }
        })
    });

    linter.verify(code, {
        rules: { test: 2 },
        parserOptions: { ecmaVersion: "latest" }
    });

    return retv;
}

/**
 * Traverses a given code path then returns the order of traversing.
 * @param {CodePath} codePath A code path to traverse.
 * @param {Object|undefined} [options] The option object of
 *      `codePath.traverseSegments()` method.
 * @param {Function|undefined} [callback] The callback function of
 *      `codePath.traverseSegments()` method.
 * @returns {string[]} The list of segment's ids in the order traversed.
 */
function getOrderOfTraversing(codePath, options, callback) {
    const retv = [];

    codePath.traverseSegments(options, (segment, controller) => {
        retv.push(segment.id);
        if (callback) {
            callback(segment, controller); // eslint-disable-line n/callback-return -- At end of inner function
        }
    });

    return retv;
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("CodePathAnalyzer", () => {

    /*
     * If you need to output the code paths and DOT graph information for a
     * particular piece of code, update and uncomment the following test and
     * then run:
     * DEBUG=eslint:code-path npx mocha tests/lib/linter/code-path-analysis/
     *
     * All the information you need will be output to the console.
     */
    /*
     * it.only("test", () => {
     *     const codePaths = parseCodePaths("class Foo { a = () => b }");
     * });
     */

    describe("CodePath#origin", () => {

        it("should be 'program' when code path starts at root node", () => {
            const codePath = parseCodePaths("foo(); bar(); baz();")[0];

            assert.strictEqual(codePath.origin, "program");
        });

        it("should be 'function' when code path starts inside a function", () => {
            const codePath = parseCodePaths("function foo() {}")[1];

            assert.strictEqual(codePath.origin, "function");
        });

        it("should be 'function' when code path starts inside an arrow function", () => {
            const codePath = parseCodePaths("let foo = () => {}")[1];

            assert.strictEqual(codePath.origin, "function");
        });

        it("should be 'class-field-initializer' when code path starts inside a class field initializer", () => {
            const codePath = parseCodePaths("class Foo { a=1; }")[1];

            assert.strictEqual(codePath.origin, "class-field-initializer");
        });

        it("should be 'class-static-block' when code path starts inside a class static block", () => {
            const codePath = parseCodePaths("class Foo { static { this.a=1; } }")[1];

            assert.strictEqual(codePath.origin, "class-static-block");
        });
    });

    describe(".traverseSegments()", () => {

        describe("should traverse segments from the first to the end:", () => {
            /* eslint-disable internal-rules/multiline-comment-style -- Commenting out */
            it("simple", () => {
                const codePath = parseCodePaths("foo(); bar(); baz();")[0];
                const order = getOrderOfTraversing(codePath);

                assert.deepStrictEqual(order, ["s1_1"]);

                /*
                digraph {
                    node[shape=box,style="rounded,filled",fillcolor=white];
                    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
                    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
                    s1_1[label="Program\nExpressionStatement\nCallExpression\nIdentifier (foo)\nExpressionStatement\nCallExpression\nIdentifier (bar)\nExpressionStatement\nCallExpression\nIdentifier (baz)"];
                    initial->s1_1->final;
                }
                */
            });

            it("if", () => {
                const codePath = parseCodePaths("if (a) foo(); else bar(); baz();")[0];
                const order = getOrderOfTraversing(codePath);

                assert.deepStrictEqual(order, ["s1_1", "s1_2", "s1_3", "s1_4"]);

                /*
                digraph {
                    node[shape=box,style="rounded,filled",fillcolor=white];
                    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
                    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
                    s1_1[label="Program\nIfStatement\nIdentifier (a)"];
                    s1_2[label="ExpressionStatement\nCallExpression\nIdentifier (foo)"];
                    s1_4[label="ExpressionStatement\nCallExpression\nIdentifier (baz)"];
                    s1_3[label="ExpressionStatement\nCallExpression\nIdentifier (bar)"];
                    initial->s1_1->s1_2->s1_4;
                    s1_1->s1_3->s1_4->final;
                }
                */
            });

            it("switch", () => {
                const codePath = parseCodePaths("switch (a) { case 0: foo(); break; case 1: bar(); } baz();")[0];
                const order = getOrderOfTraversing(codePath);

                assert.deepStrictEqual(order, ["s1_1", "s1_2", "s1_4", "s1_5", "s1_6"]);

                /*
                digraph {
                    node[shape=box,style="rounded,filled",fillcolor=white];
                    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
                    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
                    s1_1[label="Program\nSwitchStatement\nIdentifier (a)\nSwitchCase\nLiteral (0)"];
                    s1_2[label="ExpressionStatement\nCallExpression\nIdentifier (foo)\nBreakStatement"];
                    s1_3[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nSwitchCase:exit"];
                    s1_5[label="ExpressionStatement\nCallExpression\nIdentifier (bar)"];
                    s1_6[label="ExpressionStatement\nCallExpression\nIdentifier (baz)"];
                    s1_4[label="SwitchCase\nLiteral (1)"];
                    initial->s1_1->s1_2->s1_3->s1_5->s1_6;
                    s1_1->s1_4->s1_5;
                    s1_2->s1_6;
                    s1_4->s1_6->final;
                }
                */
            });

            it("while", () => {
                const codePath = parseCodePaths("while (a) foo(); bar();")[0];
                const order = getOrderOfTraversing(codePath);

                assert.deepStrictEqual(order, ["s1_1", "s1_2", "s1_3", "s1_4"]);

                /*
                digraph {
                    node[shape=box,style="rounded,filled",fillcolor=white];
                    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
                    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
                    s1_1[label="Program\nWhileStatement"];
                    s1_2[label="Identifier (a)"];
                    s1_3[label="ExpressionStatement\nCallExpression\nIdentifier (foo)"];
                    s1_4[label="ExpressionStatement\nCallExpression\nIdentifier (bar)"];
                    initial->s1_1->s1_2->s1_3->s1_2->s1_4->final;
                }
                */
            });

            it("for", () => {
                const codePath = parseCodePaths("for (var i = 0; i < 10; ++i) foo(i); bar();")[0];
                const order = getOrderOfTraversing(codePath);

                assert.deepStrictEqual(order, ["s1_1", "s1_2", "s1_3", "s1_4", "s1_5"]);

                /*
                digraph {
                    node[shape=box,style="rounded,filled",fillcolor=white];
                    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
                    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
                    s1_1[label="Program\nForStatement\nVariableDeclaration\nVariableDeclarator\nIdentifier (i)\nLiteral (0)"];
                    s1_2[label="BinaryExpression\nIdentifier (i)\nLiteral (10)"];
                    s1_3[label="ExpressionStatement\nCallExpression\nIdentifier (foo)\nIdentifier (i)"];
                    s1_4[label="UpdateExpression\nIdentifier (i)"];
                    s1_5[label="ExpressionStatement\nCallExpression\nIdentifier (bar)"];
                    initial->s1_1->s1_2->s1_3->s1_4->s1_2->s1_5->final;
                }
                */
            });

            it("for-in", () => {
                const codePath = parseCodePaths("for (var key in obj) foo(key); bar();")[0];
                const order = getOrderOfTraversing(codePath);

                assert.deepStrictEqual(order, ["s1_1", "s1_3", "s1_2", "s1_4", "s1_5"]);

                /*
                digraph {
                    node[shape=box,style="rounded,filled",fillcolor=white];
                    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
                    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
                    s1_1[label="Program\nForInStatement"];
                    s1_3[label="Identifier (obj)"];
                    s1_2[label="VariableDeclaration\nVariableDeclarator\nIdentifier (key)"];
                    s1_4[label="ExpressionStatement\nCallExpression\nIdentifier (foo)\nIdentifier (key)"];
                    s1_5[label="ExpressionStatement\nCallExpression\nIdentifier (bar)"];
                    initial->s1_1->s1_3->s1_2->s1_4->s1_2;
                    s1_3->s1_5;
                    s1_4->s1_5->final;
                }
                */
            });

            it("try-catch", () => {
                const codePath = parseCodePaths("try { foo(); } catch (e) { bar(); } baz();")[0];
                const order = getOrderOfTraversing(codePath);

                assert.deepStrictEqual(order, ["s1_1", "s1_2", "s1_3", "s1_4"]);

                /*
                digraph {
                    node[shape=box,style="rounded,filled",fillcolor=white];
                    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
                    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
                    s1_1[label="Program\nTryStatement\nBlockStatement\nExpressionStatement\nCallExpression\nIdentifier (foo)"];
                    s1_2[label="CallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
                    s1_3[label="CatchClause\nIdentifier (e)\nBlockStatement\nExpressionStatement\nCallExpression\nIdentifier (bar)"];
                    s1_4[label="ExpressionStatement\nCallExpression\nIdentifier (baz)"];
                    initial->s1_1->s1_2->s1_3->s1_4;
                    s1_1->s1_3;
                    s1_2->s1_4->final;
                }
                */
            });
        });

        it("should traverse segments from `options.first` to `options.last`.", () => {
            const codePath = parseCodePaths("if (a) { if (b) { foo(); } bar(); } else { out1(); } out2();")[0];
            const order = getOrderOfTraversing(codePath, {
                first: codePath.initialSegment.nextSegments[0],
                last: codePath.initialSegment.nextSegments[0].nextSegments[1]
            });

            assert.deepStrictEqual(order, ["s1_2", "s1_3", "s1_4"]);

            /*
            digraph {
                node[shape=box,style="rounded,filled",fillcolor=white];
                initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
                final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
                s1_1[label="Program\nIfStatement\nIdentifier (a)"];
                s1_2[label="BlockStatement\nIfStatement\nIdentifier (b)"];
                s1_3[label="BlockStatement\nExpressionStatement\nCallExpression\nIdentifier (foo)"];
                s1_4[label="ExpressionStatement\nCallExpression\nIdentifier (bar)"];
                s1_6[label="ExpressionStatement\nCallExpression\nIdentifier (out2)"];
                s1_5[label="BlockStatement\nExpressionStatement\nCallExpression\nIdentifier (out1)"];
                initial->s1_1->s1_2->s1_3->s1_4->s1_6;
                s1_1->s1_5->s1_6;
                s1_2->s1_4;
                s1_6->final;
            }
            */
        });

        it("should stop immediately when 'controller.break()' was called.", () => {
            const codePath = parseCodePaths("if (a) { if (b) { foo(); } bar(); } else { out1(); } out2();")[0];
            const order = getOrderOfTraversing(codePath, null, (segment, controller) => {
                if (segment.id === "s1_2") {
                    controller.break();
                }
            });

            assert.deepStrictEqual(order, ["s1_1", "s1_2"]);

            /*
            digraph {
                node[shape=box,style="rounded,filled",fillcolor=white];
                initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
                final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
                s1_1[label="Program\nIfStatement\nIdentifier (a)"];
                s1_2[label="BlockStatement\nIfStatement\nIdentifier (b)"];
                s1_3[label="BlockStatement\nExpressionStatement\nCallExpression\nIdentifier (foo)"];
                s1_4[label="ExpressionStatement\nCallExpression\nIdentifier (bar)"];
                s1_6[label="ExpressionStatement\nCallExpression\nIdentifier (out2)"];
                s1_5[label="BlockStatement\nExpressionStatement\nCallExpression\nIdentifier (out1)"];
                initial->s1_1->s1_2->s1_3->s1_4->s1_6;
                s1_1->s1_5->s1_6;
                s1_2->s1_4;
                s1_6->final;
            }
            */
        });

        it("should skip the current branch when 'controller.skip()' was called.", () => {
            const codePath = parseCodePaths("if (a) { if (b) { foo(); } bar(); } else { out1(); } out2();")[0];
            const order = getOrderOfTraversing(codePath, null, (segment, controller) => {
                if (segment.id === "s1_2") {
                    controller.skip();
                }
            });

            assert.deepStrictEqual(order, ["s1_1", "s1_2", "s1_5", "s1_6"]);

            /*
            digraph {
                node[shape=box,style="rounded,filled",fillcolor=white];
                initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
                final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
                s1_1[label="Program\nIfStatement\nIdentifier (a)"];
                s1_2[label="BlockStatement\nIfStatement\nIdentifier (b)"];
                s1_3[label="BlockStatement\nExpressionStatement\nCallExpression\nIdentifier (foo)"];
                s1_4[label="ExpressionStatement\nCallExpression\nIdentifier (bar)"];
                s1_6[label="ExpressionStatement\nCallExpression\nIdentifier (out2)"];
                s1_5[label="BlockStatement\nExpressionStatement\nCallExpression\nIdentifier (out1)"];
                initial->s1_1->s1_2->s1_3->s1_4->s1_6;
                s1_1->s1_5->s1_6;
                s1_2->s1_4;
                s1_6->final;
            }
            */
        });

        it("should not skip the next branch when 'controller.skip()' was called.", () => {
            const codePath = parseCodePaths("if (a) { if (b) { foo(); } bar(); } out1();")[0];
            const order = getOrderOfTraversing(codePath, null, (segment, controller) => {
                if (segment.id === "s1_4") {
                    controller.skip(); // Since s1_5 is connected from s1_1, we expect it not to be skipped.
                }
            });

            assert.deepStrictEqual(order, ["s1_1", "s1_2", "s1_3", "s1_4", "s1_5"]);

            /*
            digraph {
                node[shape=box,style="rounded,filled",fillcolor=white];
                initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
                final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
                s1_1[label="Program:enter\nIfStatement:enter\nIdentifier (a)"];
                s1_2[label="BlockStatement:enter\nIfStatement:enter\nIdentifier (b)"];
                s1_3[label="BlockStatement:enter\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (foo)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
                s1_4[label="IfStatement:exit\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (bar)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
                s1_5[label="IfStatement:exit\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (out1)\nCallExpression:exit\nExpressionStatement:exit\nProgram:exit"];
                initial->s1_1->s1_2->s1_3->s1_4->s1_5;
                s1_1->s1_5;
                s1_2->s1_4;
                s1_5->final;
            }
            */
        });

        it("should skip the next branch when 'controller.skip()' was called at top segment.", () => {
            const codePath = parseCodePaths("a; while (b) { c; }")[0];

            const order = getOrderOfTraversing(codePath, null, (segment, controller) => {
                if (segment.id === "s1_1") {
                    controller.skip();
                }
            });

            assert.deepStrictEqual(order, ["s1_1"]);

            /*
            digraph {
                node[shape=box,style="rounded,filled",fillcolor=white];
                initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
                final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
                s1_1[label="Program:enter\nExpressionStatement:enter\nIdentifier (a)\nExpressionStatement:exit\nWhileStatement:enter"];
                s1_2[label="Identifier (b)"];
                s1_3[label="BlockStatement:enter\nExpressionStatement:enter\nIdentifier (c)\nExpressionStatement:exit\nBlockStatement:exit"];
                s1_4[label="WhileStatement:exit\nProgram:exit"];
                initial->s1_1->s1_2->s1_3->s1_2->s1_4->final;
            }
            */
        });
        /* eslint-enable internal-rules/multiline-comment-style -- Commenting out */
    });
});
