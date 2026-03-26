"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { assert } = require("chai");
const reduceBadExampleSize = require("../../tools/code-sample-minimizer");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("reduceBadExampleSize()", () => {
	it("extracts relevant part of deeply nested code", () => {
		const initialCode = `
            if (true) {
                while (false) {
                    for (let i = 1; i < 10; i++) {
                        let j = foo
                            ? bar
                            : THIS_EXPRESSION_CAUSES_A_BUG
                    }
                }
            }
        `;

		const expectedFinalCode = "THIS_EXPRESSION_CAUSES_A_BUG";

		assert.strictEqual(
			reduceBadExampleSize({
				sourceText: initialCode,
				predicate: code =>
					code.includes("THIS_EXPRESSION_CAUSES_A_BUG"),
			}),
			expectedFinalCode,
		);
	});

	it("removes irrelevant parts of AST nodes with many children", () => {
		const initialCode = `
            foo;
            bar;
            baz;
            let x = [
                1,
                2,
                ,
                3,
                THIS_EXPRESSION_CAUSES_A_BUG,
                4
            ]
            quux;
        `;

		const expectedFinalCode = "THIS_EXPRESSION_CAUSES_A_BUG";

		assert.strictEqual(
			reduceBadExampleSize({
				sourceText: initialCode,
				predicate: code =>
					code.includes("THIS_EXPRESSION_CAUSES_A_BUG"),
			}),
			expectedFinalCode,
		);
	});

	it("returns the original source text if recast fails to parse it", () => {
		// recast doesn't support all ESTree node types (e.g., PropertyDefinition from ES2022).
		// Code with both comments and class fields triggers an error in recast.
		const initialCode = "class Foo { /* comment */ x = 1 }";

		assert.strictEqual(
			reduceBadExampleSize({
				sourceText: initialCode,
				predicate: code => code.includes("x = 1"),
			}),
			initialCode,
		);
	});

	it("removes irrelevant comments from the source code", () => {
		const initialCode = `
        var /* aaa */foo = bar;
    `;

		const expectedFinalCode = "var foo = bar;";

		assert.strictEqual(
			reduceBadExampleSize({
				sourceText: initialCode,
				predicate: code =>
					code.includes("var") && code.includes("foo = bar"),
			}),
			expectedFinalCode,
		);
	});
});
