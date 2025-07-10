/**
 * @fileoverview Tests for esquery
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert;
const sinon = require("sinon");
const esquery = require("esquery");
const {
	parse,
	matches,
	ESQueryParsedSelector,
} = require("../../../lib/linter/esquery");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("esquery", () => {
	describe("ESQueryParsedSelector", () => {
		describe("constructor", () => {
			it("should store properties correctly", () => {
				const selector = new ESQueryParsedSelector(
					"Identifier",
					false,
					{ type: "identifier", value: "Identifier" },
					["Identifier"],
					1,
					2,
				);

				assert.strictEqual(selector.source, "Identifier");
				assert.strictEqual(selector.isExit, false);
				assert.deepStrictEqual(selector.root, {
					type: "identifier",
					value: "Identifier",
				});
				assert.deepStrictEqual(selector.nodeTypes, ["Identifier"]);
				assert.strictEqual(selector.attributeCount, 1);
				assert.strictEqual(selector.identifierCount, 2);
			});
		});

		describe("compare", () => {
			it("should compare based on attributeCount first", () => {
				const selector1 = new ESQueryParsedSelector(
					"",
					false,
					{},
					[],
					2,
					1,
				);
				const selector2 = new ESQueryParsedSelector(
					"",
					false,
					{},
					[],
					1,
					1,
				);

				assert.isAbove(selector1.compare(selector2), 0);
				assert.isBelow(selector2.compare(selector1), 0);
			});

			it("should compare based on identifierCount if attributeCount is equal", () => {
				const selector1 = new ESQueryParsedSelector(
					"",
					false,
					{},
					[],
					1,
					2,
				);
				const selector2 = new ESQueryParsedSelector(
					"",
					false,
					{},
					[],
					1,
					1,
				);

				assert.isAbove(selector1.compare(selector2), 0);
				assert.isBelow(selector2.compare(selector1), 0);
			});

			it("should compare based on source if attributeCount and identifierCount are equal", () => {
				const selector1 = new ESQueryParsedSelector(
					"B",
					false,
					{},
					[],
					1,
					1,
				);
				const selector2 = new ESQueryParsedSelector(
					"A",
					false,
					{},
					[],
					1,
					1,
				);

				assert.isAbove(selector1.compare(selector2), 0);
				assert.isBelow(selector2.compare(selector1), 0);
			});

			it("should return -1 if sources are equal", () => {
				const selector1 = new ESQueryParsedSelector(
					"A",
					false,
					{},
					[],
					1,
					1,
				);
				const selector2 = new ESQueryParsedSelector(
					"A",
					false,
					{},
					[],
					1,
					1,
				);

				assert.strictEqual(selector1.compare(selector2), -1);
			});
		});
	});

	describe("parse", () => {
		it("should parse a simple selector", () => {
			const result = parse("Identifier");

			assert.instanceOf(result, ESQueryParsedSelector);
			assert.strictEqual(result.source, "Identifier");
			assert.strictEqual(result.isExit, false);
			assert.deepStrictEqual(result.nodeTypes, ["Identifier"]);
			assert.strictEqual(result.attributeCount, 0);
			assert.strictEqual(result.identifierCount, 1);
		});

		it("should parse a wildcard selector", () => {
			const result = parse("*");
			assert.instanceOf(result, ESQueryParsedSelector);
			assert.strictEqual(result.source, "*");
			assert.strictEqual(result.isExit, false);
			assert.strictEqual(result.nodeTypes, null);
			assert.strictEqual(result.attributeCount, 0);
			assert.strictEqual(result.identifierCount, 0);
		});

		it("should recognize exit selectors", () => {
			const result = parse("Identifier:exit");

			assert.strictEqual(result.isExit, true);
			assert.deepStrictEqual(result.nodeTypes, ["Identifier"]);
			assert.strictEqual(result.attributeCount, 0);
			assert.strictEqual(result.identifierCount, 1);
		});

		it("should use cached results when parsing the same selector twice", () => {
			const result1 = parse("Identifier");
			const result2 = parse("Identifier");

			assert.strictEqual(result1, result2);
			assert.strictEqual(result1.attributeCount, 0);
			assert.strictEqual(result1.identifierCount, 1);
		});

		it("should throw a useful error when parsing fails", () => {
			assert.throws(
				() => parse("[invalid"),
				SyntaxError,
				/Syntax error in selector/u,
			);
		});

		it("should return null nodeTypes for selectors that match any type", () => {
			const result = parse("[attr]");
			assert.strictEqual(result.nodeTypes, null);
			assert.strictEqual(result.attributeCount, 1);
			assert.strictEqual(result.identifierCount, 0);
		});

		it("should handle compound selectors", () => {
			const result = parse("FunctionDeclaration[id.name='foo']");
			assert.deepStrictEqual(result.nodeTypes, ["FunctionDeclaration"]);
			assert.strictEqual(result.attributeCount, 1);
			assert.strictEqual(result.identifierCount, 1);
		});

		it("should handle class selectors for functions", () => {
			const result = parse(":function");
			assert.includeMembers(result.nodeTypes, [
				"FunctionDeclaration",
				"FunctionExpression",
				"ArrowFunctionExpression",
			]);
			assert.strictEqual(result.attributeCount, 0);
			assert.strictEqual(result.identifierCount, 0);
		});

		it("should handle class selectors for statements", () => {
			const result = parse(":statement");

			assert.strictEqual(result.nodeTypes, null);
			assert.strictEqual(result.attributeCount, 0);
			assert.strictEqual(result.identifierCount, 0);
		});

		it("should handle child selector with attribute selector", () => {
			const result = parse("BinaryExpression > *[name='foo']");

			assert.strictEqual(result.isExit, false);
			assert.strictEqual(result.nodeTypes, null);
			assert.strictEqual(result.attributeCount, 1);
			assert.strictEqual(result.identifierCount, 1);
		});

		it("should handle not selector", () => {
			const result = parse("*:not(ExpressionStatement)");

			assert.strictEqual(result.isExit, false);
			assert.strictEqual(result.nodeTypes, null);
			assert.strictEqual(result.attributeCount, 0);
			assert.strictEqual(result.identifierCount, 1);
		});

		it("should handle compound selector with matches", () => {
			const result = parse(
				":matches(Identifier[name='foo'], Identifier[name='bar'], Identifier[name='baz'])",
			);

			assert.strictEqual(result.isExit, false);
			assert.deepStrictEqual(result.nodeTypes, ["Identifier"]);
			assert.strictEqual(result.attributeCount, 3);
			assert.strictEqual(result.identifierCount, 3);
		});
	});

	describe("matches()", () => {
		it("should delegate to esquery.matches", () => {
			const matchesSpy = sinon.stub(esquery, "matches").returns(true);
			const node = { type: "Identifier", name: "foo" };
			const root = { type: "identifier", value: "Identifier" };
			const ancestry = [];
			const options = {};

			const result = matches(node, root, ancestry, options);

			assert.strictEqual(
				matchesSpy.calledOnceWith(node, root, ancestry, options),
				true,
			);
			assert.strictEqual(result, true);

			matchesSpy.restore();
		});
	});

	describe("compare()", () => {
		[
			["Identifier", "Identifier", -1],
			["Identifier", "Identifier:exit", -1],
			["Identifier:exit", "Identifier", 1],
			["Identifier:exit", "Identifier:exit", -1],
			["Identifier", "Literal", -1],
			["Literal", "Identifier", 1],
			["Literal[name='foo']", "Literal[name='bar']", 1],
			["Literal[name='bar']", "Literal[name='foo']", -1],
			["Literal[name='foo']", "Literal[name='foo']", -1],
			[
				"FunctionDeclaration[id.name='foo']",
				"FunctionDeclaration[id.name='bar']",
				1,
			],
			[
				"FunctionDeclaration[id.name='bar']",
				"FunctionDeclaration[id.name='foo']",
				-1,
			],
			[
				"FunctionDeclaration[id.name='foo']",
				"FunctionDeclaration[id.name='foo']",
				-1,
			],
			["Identifier", "[name]", -1],
			["Identifier", "Identifier[name]", -1],
		].forEach(([selectorA, selectorB, expected]) => {
			it(`compare "${selectorA}" to "${selectorB}" should return ${expected}`, () => {
				const parsedSelectorA = parse(selectorA);
				const parsedSelectorB = parse(selectorB);

				assert.strictEqual(
					parsedSelectorA.compare(parsedSelectorB),
					expected,
				);
			});
		});
	});
});
