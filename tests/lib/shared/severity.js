/**
 * @fileoverview Tests for severity util
 * @author Kuldeep Kumar <https://github.com/Kuldeep2822k>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { assert } = require("chai");
const {
	normalizeSeverityToString,
	normalizeSeverityToNumber,
} = require("../../../lib/shared/severity");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("severity", () => {
	describe("normalizeSeverityToString()", () => {
		[
			[2, "error"],
			["2", "error"],
			["error", "error"],
			[1, "warn"],
			["1", "warn"],
			["warn", "warn"],
			[0, "off"],
			["0", "off"],
			["off", "off"],
		].forEach(([input, expected]) => {
			it(`should return "${expected}" when passed ${JSON.stringify(input)}`, () => {
				assert.strictEqual(normalizeSeverityToString(input), expected);
			});
		});

		it("should throw an error when passed an invalid severity value", () => {
			assert.throws(
				() => normalizeSeverityToString("invalid"),
				/Invalid severity value/u,
			);
		});
	});

	describe("normalizeSeverityToNumber()", () => {
		[
			[2, 2],
			["2", 2],
			["error", 2],
			[1, 1],
			["1", 1],
			["warn", 1],
			[0, 0],
			["0", 0],
			["off", 0],
		].forEach(([input, expected]) => {
			it(`should return ${expected} when passed ${JSON.stringify(input)}`, () => {
				assert.strictEqual(normalizeSeverityToNumber(input), expected);
			});
		});

		it("should throw an error when passed an invalid severity value", () => {
			assert.throws(
				() => normalizeSeverityToNumber("invalid"),
				/Invalid severity value/u,
			);
		});
	});
});
