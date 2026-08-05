/**
 * @fileoverview Tests for is-regional-indicator-symbol utility.
 * @author Manish Chaudhary
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
	isRegionalIndicatorSymbol = require("../../../../../lib/rules/utils/unicode/is-regional-indicator-symbol");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("isRegionalIndicatorSymbol", () => {
	it("should return true for regional indicator symbols (U+1F1E6 to U+1F1FF)", () => {
		assert.strictEqual(isRegionalIndicatorSymbol(0x1f1e6), true); // Regional Indicator Symbol Letter A
		assert.strictEqual(isRegionalIndicatorSymbol(0x1f1f0), true); // Regional Indicator Symbol Letter K
		assert.strictEqual(isRegionalIndicatorSymbol(0x1f1ff), true); // Regional Indicator Symbol Letter Z
	});

	it("should return false for characters outside the range", () => {
		assert.strictEqual(isRegionalIndicatorSymbol(0x1f1e5), false);
		assert.strictEqual(isRegionalIndicatorSymbol(0x1f200), false);
		assert.strictEqual(isRegionalIndicatorSymbol(0x0041), false); // Letter A
	});
});
