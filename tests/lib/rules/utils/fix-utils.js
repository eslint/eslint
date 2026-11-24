/**
 * @fileoverview Tests for fix utils.
 * @author Pixel998
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
	{ Linter } = require("../../../../lib/linter"),
	{
		addUndefinedComparison,
	} = require("../../../../lib/rules/utils/fix-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const linter = new Linter();

/**
 * Applies the fixes that `addUndefinedComparison` creates for the binary expressions in the given code.
 * @param {string} code The code to fix.
 * @param {Object} [languageOptions] The language options to use.
 * @returns {string} The fixed code.
 */
function applyFixes(code, languageOptions = {}) {
	return linter.verifyAndFix(code, {
		plugins: {
			test: {
				rules: {
					fixer: {
						meta: { fixable: "code" },
						create(context) {
							return {
								BinaryExpression(node) {
									context.report({
										node,
										message: "Binary expression.",
										fix(fixer) {
											return addUndefinedComparison(
												fixer,
												context.sourceCode,
												node,
											);
										},
									});
								},
							};
						},
					},
				},
			},
		},
		languageOptions,
		rules: { "test/fixer": "error" },
	}).output;
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("fix-utils", () => {
	describe("addUndefinedComparison", () => {
		const expectedResults = {
			"if (x == null) { }": "if (x === null || x === undefined) { }",
			"if (x != null) { }": "if (x !== null && x !== undefined) { }",
			"do {} while (null == x)":
				"do {} while (null === x || undefined === x)",
			"foo.bar.baz == null":
				"foo.bar.baz === null || foo.bar.baz === undefined",
			"foo[0] != null": "foo[0] !== null && foo[0] !== undefined",
			"foo[bar] == null": "foo[bar] === null || foo[bar] === undefined",
			"foo?.bar[baz] == null":
				"foo?.bar[baz] === null || foo?.bar[baz] === undefined",
			"class C { #foo; bar() { return this.#foo == null; } }":
				"class C { #foo; bar() { return this.#foo === null || this.#foo === undefined; } }",
			"class A extends B { foo() { return super.foo == null; } }":
				"class A extends B { foo() { return super.foo === null || super.foo === undefined; } }",
			"import.meta.foo != null":
				"import.meta.foo !== null && import.meta.foo !== undefined",
			"(foo) == null": "(foo) === null || foo === undefined",
			"function foo(undefined) {} bar == null;":
				"function foo(undefined) {} bar === null || bar === undefined;",
			"x == null && y": "(x === null || x === undefined) && y",
			"y && x == null": "y && (x === null || x === undefined)",
			"x == null || y": "x === null || x === undefined || y",
			"x != null && y": "x !== null && x !== undefined && y",
			"x != null || y": "(x !== null && x !== undefined) || y",
			"x == null ?? y": "(x === null || x === undefined) ?? y",
			"y & x != null": "y & (x !== null && x !== undefined)",
			"(x == null) && y": "(x === null || x === undefined) && y",
			"x == null ? y : z": "x === null || x === undefined ? y : z",
			"x /* a */ == /* b */ null && y":
				"(x /* a */ === /* b */ null || x === undefined) && y",
			"foo()\nx == null && y()":
				"foo()\n;(x === null || x === undefined) && y()",
			"foo();\nx == null && y()":
				"foo();\n(x === null || x === undefined) && y()",
		};

		Object.keys(expectedResults).forEach(key => {
			it(`should turn "${key}" into "${expectedResults[key]}"`, () => {
				assert.strictEqual(applyFixes(key), expectedResults[key]);
			});
		});

		[
			"x === null",
			"x == y",
			"foo() == null",
			"foo().bar == null",
			"foo[bar()] != null",
			"foo?.bar() == null",
			"function foo(undefined) { return bar == null; }",
			"const undefined = 0; if (foo != null) { }",
		].forEach(code => {
			it(`should not create fixes for "${code}"`, () => {
				assert.strictEqual(applyFixes(code), code);
			});
		});

		it('should not create fixes for "x == null" when the `undefined` global is off', () => {
			assert.strictEqual(
				applyFixes("x == null", { globals: { undefined: "off" } }),
				"x == null",
			);
		});
	});
});
