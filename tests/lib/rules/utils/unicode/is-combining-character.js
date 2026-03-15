/**
 * @fileoverview Tests for is-combining-character utility.
 * @author Manish Chaudhary
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
	isCombiningCharacter = require("../../../../../lib/rules/utils/unicode/is-combining-character");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("isCombiningCharacter", () => {
	it("should return true for combining marks", () => {
		assert.strictEqual(isCombiningCharacter(0x0300), true); // Combining Grave Accent
		assert.strictEqual(isCombiningCharacter(0x0301), true); // Combining Acute Accent
		assert.strictEqual(isCombiningCharacter(0x0903), true); // Devanagari Sign Visarga
		assert.strictEqual(isCombiningCharacter(0x0591), true); // Hebrew Accent Etnahta
	});

	it("should return false for non-combining characters", () => {
		assert.strictEqual(isCombiningCharacter(0x0041), false); // Letter A
		assert.strictEqual(isCombiningCharacter(0x0020), false); // Space
	});
});
