/**
 * @fileoverview Tests for FixTracker.
 * @author Alan Pierce
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    espree = require("espree"),
    FixTracker = require("../../../lib/util/fix-tracker"),
    ruleFixer = require("../../../lib/util/rule-fixer"),
    SourceCode = require("../../../lib/util/source-code"),
    Traverser = require("../../../lib/util/traverser");

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

/**
 * Create a SourceCode instance from the given code. Also add parent pointers in
 * the AST so that parent traversals will work.
 *
 * @param {string} text The text of the code.
 * @returns {SourceCode} The SourceCode.
 */
function createSourceCode(text) {
    const ast = espree.parse(text, DEFAULT_CONFIG);

    Traverser.traverse(ast, {
        enter(node, parent) {
            node.parent = parent;
        }
    });

    return new SourceCode(text, ast);
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("FixTracker", () => {
    describe("replaceTextRange", () => {
        it("should expand to include an explicitly retained range", () => {
            const sourceCode = createSourceCode("var foo = +bar;");
            const result = new FixTracker(ruleFixer, sourceCode)
                .retainRange([4, 14])
                .replaceTextRange([10, 11], "-");

            assert.deepStrictEqual(result, {
                range: [4, 14],
                text: "foo = -bar"
            });
        });

        it("ignores a retained range that's smaller than the replaced range", () => {
            const sourceCode = createSourceCode("abcdefghij");
            const result = new FixTracker(ruleFixer, sourceCode)
                .retainRange([5, 7])
                .replaceTextRange([4, 8], "123");

            assert.deepStrictEqual(result, {
                range: [4, 8],
                text: "123"
            });
        });

        it("allows an unspecified retained range", () => {
            const sourceCode = createSourceCode("abcdefghij");
            const result = new FixTracker(ruleFixer, sourceCode)
                .replaceTextRange([4, 8], "123");

            assert.deepStrictEqual(result, {
                range: [4, 8],
                text: "123"
            });
        });
    });

    describe("remove", () => {
        it("should expand to include an explicitly retained range", () => {
            const sourceCode = createSourceCode("a = b + +c");
            const result = new FixTracker(ruleFixer, sourceCode)
                .retainRange([4, 10])
                .remove(sourceCode.ast.tokens[4]);

            assert.deepStrictEqual(result, {
                range: [4, 10],
                text: "b + c"
            });
        });
    });

    describe("retainEnclosingFunction", () => {
        it("handles a normal enclosing function", () => {
            const sourceCode = createSourceCode("f = function() { return x; }");
            const xNode = sourceCode.ast.body[0].expression.right.body.body[0].argument;
            const result = new FixTracker(ruleFixer, sourceCode)
                .retainEnclosingFunction(xNode)
                .replaceTextRange(xNode.range, "y");

            assert.deepStrictEqual(result, {
                range: [4, 28],
                text: "function() { return y; }"
            });
        });

        it("handles the case when there is no enclosing function", () => {
            const sourceCode = createSourceCode("const a = b;");
            const bNode = sourceCode.ast.body[0].declarations[0].init;
            const result = new FixTracker(ruleFixer, sourceCode)
                .retainEnclosingFunction(bNode)
                .replaceTextRange(bNode.range, "c");

            assert.deepStrictEqual(result, {
                range: [0, 12],
                text: "const a = c;"
            });
        });
    });

    describe("retainSurroungingTokens", () => {
        it("handles a change to a binary operator", () => {
            const sourceCode = createSourceCode("const i = j + k;");
            const plusToken = sourceCode.ast.tokens[4];
            const result = new FixTracker(ruleFixer, sourceCode)
                .retainSurroundingTokens(plusToken)
                .replaceTextRange(plusToken.range, "*");

            assert.deepStrictEqual(result, {
                range: [10, 15],
                text: "j * k"
            });
        });
    });
});
