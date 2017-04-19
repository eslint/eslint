"use strict";

const assert = require("chai").assert;
const Traverser = require("../../../lib/util/traverser");

/**
 * Traverses an AST and returns the traversal order (both for entering and leaving nodes).
 * @param {ASTNode} ast The Program node of the AST to check.
 * @returns {Object} An object containing an enteredNodes and exitedNodes array.
 * @private
 */
function traverseAst(ast) {
    const traverser = new Traverser();
    const enteredNodes = [];
    const exitedNodes = [];

    traverser.traverse(ast, {
        enter: node => enteredNodes.push(node),
        leave: node => exitedNodes.push(node)
    });

    return {
        enteredNodes,
        exitedNodes
    };
}

describe("Traverser", () => {
    it("traverses all keys except 'parent', 'leadingComments', and 'trailingComments'", () => {
        const fakeAst = {
            type: "Program",
            body: [
                {
                    type: "ExpressionStatement",
                    leadingComments: {
                        type: "Line"
                    },
                    trailingComments: {
                        type: "Block"
                    }
                },
                {
                    type: "FooStatement",
                    foo: {
                        type: "BarStatement"
                    }
                }
            ]
        };

        fakeAst.body[0].parent = fakeAst;

        const traversalResults = traverseAst(fakeAst);

        assert.deepEqual(traversalResults.enteredNodes, [fakeAst, fakeAst.body[0], fakeAst.body[1], fakeAst.body[1].foo]);
        assert.deepEqual(traversalResults.exitedNodes, [fakeAst.body[0], fakeAst.body[1].foo, fakeAst.body[1], fakeAst]);
    });

    describe("type annotations", () => {
        it("traverses type annotations in Identifiers", () => {
            const fakeAst = {
                type: "Program",
                body: [
                    {
                        type: "Identifier",
                        typeAnnotation: {
                            type: "foo"
                        }
                    }
                ]
            };
            const traversalResults = traverseAst(fakeAst);

            assert.deepEqual(traversalResults.enteredNodes, [fakeAst, fakeAst.body[0], fakeAst.body[0].typeAnnotation]);
            assert.deepEqual(traversalResults.exitedNodes, [fakeAst.body[0].typeAnnotation, fakeAst.body[0], fakeAst]);
        });

        it("traverses return types in FunctionDeclarations", () => {
            const fakeAst = {
                type: "Program",
                body: [
                    {
                        type: "FunctionDeclaration",
                        returnType: {
                            type: "foo"
                        }
                    }
                ]
            };
            const traversalResults = traverseAst(fakeAst);

            assert.deepEqual(traversalResults.enteredNodes, [fakeAst, fakeAst.body[0], fakeAst.body[0].returnType]);
            assert.deepEqual(traversalResults.exitedNodes, [fakeAst.body[0].returnType, fakeAst.body[0], fakeAst]);
        });

        it("traverses return types in FunctionExpressions", () => {
            const fakeAst = {
                type: "Program",
                body: [
                    {
                        type: "FunctionExpression",
                        returnType: {
                            type: "foo"
                        }
                    }
                ]
            };
            const traversalResults = traverseAst(fakeAst);

            assert.deepEqual(traversalResults.enteredNodes, [fakeAst, fakeAst.body[0], fakeAst.body[0].returnType]);
            assert.deepEqual(traversalResults.exitedNodes, [fakeAst.body[0].returnType, fakeAst.body[0], fakeAst]);
        });

        it("traverses return types in ArrowFunctionExpressions", () => {
            const fakeAst = {
                type: "Program",
                body: [
                    {
                        type: "ArrowFunctionExpression",
                        returnType: {
                            type: "foo"
                        }
                    }
                ]
            };
            const traversalResults = traverseAst(fakeAst);

            assert.deepEqual(traversalResults.enteredNodes, [fakeAst, fakeAst.body[0], fakeAst.body[0].returnType]);
            assert.deepEqual(traversalResults.exitedNodes, [fakeAst.body[0].returnType, fakeAst.body[0], fakeAst]);
        });

        it("traverses return types in MethodDefinitions", () => {
            const fakeAst = {
                type: "Program",
                body: [
                    {
                        type: "MethodDefinition",
                        returnType: {
                            type: "foo"
                        }
                    }
                ]
            };
            const traversalResults = traverseAst(fakeAst);

            assert.deepEqual(traversalResults.enteredNodes, [fakeAst, fakeAst.body[0], fakeAst.body[0].returnType]);
            assert.deepEqual(traversalResults.exitedNodes, [fakeAst.body[0].returnType, fakeAst.body[0], fakeAst]);
        });

        it("traverses type annotations in ObjectPatterns", () => {
            const fakeAst = {
                type: "Program",
                body: [
                    {
                        type: "ObjectPattern",
                        typeAnnotation: {
                            type: "foo"
                        }
                    }
                ]
            };
            const traversalResults = traverseAst(fakeAst);

            assert.deepEqual(traversalResults.enteredNodes, [fakeAst, fakeAst.body[0], fakeAst.body[0].typeAnnotation]);
            assert.deepEqual(traversalResults.exitedNodes, [fakeAst.body[0].typeAnnotation, fakeAst.body[0], fakeAst]);
        });

        it("traverses type annotations in ArrayPatterns", () => {
            const fakeAst = {
                type: "Program",
                body: [
                    {
                        type: "ArrayPattern",
                        typeAnnotation: {
                            type: "foo"
                        }
                    }
                ]
            };
            const traversalResults = traverseAst(fakeAst);

            assert.deepEqual(traversalResults.enteredNodes, [fakeAst, fakeAst.body[0], fakeAst.body[0].typeAnnotation]);
            assert.deepEqual(traversalResults.exitedNodes, [fakeAst.body[0].typeAnnotation, fakeAst.body[0], fakeAst]);
        });

        it("traverses type annotations in RestElements", () => {
            const fakeAst = {
                type: "Program",
                body: [
                    {
                        type: "RestElement",
                        typeAnnotation: {
                            type: "foo"
                        }
                    }
                ]
            };
            const traversalResults = traverseAst(fakeAst);

            assert.deepEqual(traversalResults.enteredNodes, [fakeAst, fakeAst.body[0], fakeAst.body[0].typeAnnotation]);
            assert.deepEqual(traversalResults.exitedNodes, [fakeAst.body[0].typeAnnotation, fakeAst.body[0], fakeAst]);
        });
    });
});
