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

	it("handles ES2022+ syntax like class fields with comments", () => {
		/*
		 * Previously, recast would crash with "did not recognize object of type PropertyDefinition"
		 * when trying to attach comments to PropertyDefinition nodes (ES2022 class fields).
		 */
		const initialCode = `
            class Foo {
                /* irrelevant comment */
                x = THIS_EXPRESSION_CAUSES_A_BUG;
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
