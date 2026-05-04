/**
 * @fileoverview Tests for shared AST utils.
 * @author Kuldeep Kumar <https://github.com/Kuldeep2822k>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert;
const astUtils = require("../../../lib/shared/ast-utils.js");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("shared ast-utils", () => {
	describe("breakableTypePattern", () => {
		[
			"DoWhileStatement",
			"WhileStatement",
			"ForStatement",
			"ForInStatement",
			"ForOfStatement",
			"SwitchStatement",
		].forEach(type => {
			it(`should match ${type}`, () => {
				assert.isTrue(astUtils.breakableTypePattern.test(type));
			});
		});

		["IfStatement", "TryStatement", "Program", "LabeledStatement"].forEach(
			type => {
				it(`should not match ${type}`, () => {
					assert.isFalse(astUtils.breakableTypePattern.test(type));
				});
			},
		);
	});

	describe("lineBreakPattern", () => {
		["\n", "\r", "\r\n", "\u2028", "\u2029"].forEach(linebreak => {
			it(`should match ${JSON.stringify(linebreak)}`, () => {
				const match = astUtils.lineBreakPattern.exec(`a${linebreak}b`);

				assert.isNotNull(match);
				assert.strictEqual(match[0], linebreak);
			});
		});

		it("should not be global", () => {
			assert.isFalse(astUtils.lineBreakPattern.global);
		});
	});

	describe("createGlobalLinebreakMatcher()", () => {
		it("should return a global regular expression", () => {
			const matcher = astUtils.createGlobalLinebreakMatcher();

			assert.instanceOf(matcher, RegExp);
			assert.isTrue(matcher.global);
			assert.isTrue(matcher.unicode);
		});

		it("should return a new regex each time", () => {
			const firstMatcher = astUtils.createGlobalLinebreakMatcher();
			const secondMatcher = astUtils.createGlobalLinebreakMatcher();

			assert.notStrictEqual(firstMatcher, secondMatcher);
		});

		it("should split all supported line breaks", () => {
			const text = "a\r\nb\nc\rd\u2028e\u2029f";
			const matcher = astUtils.createGlobalLinebreakMatcher();

			assert.deepStrictEqual(text.split(matcher), [
				"a",
				"b",
				"c",
				"d",
				"e",
				"f",
			]);
		});

		it("should not match non-linebreak characters", () => {
			const matcher = astUtils.createGlobalLinebreakMatcher();

			assert.isNull(matcher.exec("hello world"));
		});
	});

	describe("shebangPattern", () => {
		it("should match a shebang at the beginning", () => {
			const match = astUtils.shebangPattern.exec(
				"#!/usr/bin/env node\nconst x = 1;",
			);

			assert.isNotNull(match);
			assert.strictEqual(match[1], "/usr/bin/env node");
		});

		it("should not match when text does not start with shebang", () => {
			assert.isNull(
				astUtils.shebangPattern.exec(
					"const x = 1;\n#!/usr/bin/env node",
				),
			);
		});

		it("should match a shebang-only file with no newline", () => {
			const match = astUtils.shebangPattern.exec("#!/usr/bin/env node");

			assert.isNotNull(match);
			assert.strictEqual(match[1], "/usr/bin/env node");
		});
	});
});
