"use strict";

const assert = require("chai").assert;
const Traverser = require("../../../lib/util/traverser");

describe("Traverser", () => {
    it("traverses all keys except 'parent', 'leadingComments', and 'trailingComments'", () => {
        const traverser = new Traverser();
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

        const enteredNodes = [];
        const exitedNodes = [];

        traverser.traverse(fakeAst, {
            enter: node => enteredNodes.push(node),
            leave: node => exitedNodes.push(node)
        });

        assert.deepEqual(enteredNodes, [fakeAst, fakeAst.body[0], fakeAst.body[1], fakeAst.body[1].foo]);
        assert.deepEqual(exitedNodes, [fakeAst.body[0], fakeAst.body[1].foo, fakeAst.body[1], fakeAst]);
    });
});
