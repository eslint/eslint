/**
 * @fileoverview Tests for unicode index.
 * @author Manish Chaudhary
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
	unicode = require("../../../../../lib/rules/utils/unicode");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("unicode index", () => {
	it("should export isCombiningCharacter", () => {
		assert.strictEqual(typeof unicode.isCombiningCharacter, "function");
	});

	it("should export isEmojiModifier", () => {
		assert.strictEqual(typeof unicode.isEmojiModifier, "function");
	});

	it("should export isRegionalIndicatorSymbol", () => {
		assert.strictEqual(
			typeof unicode.isRegionalIndicatorSymbol,
			"function",
		);
	});

	it("should export isSurrogatePair", () => {
		assert.strictEqual(typeof unicode.isSurrogatePair, "function");
	});
});
