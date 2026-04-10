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
	it("should return true for Mn (Mark, Nonspacing) characters", () => {
		assert.strictEqual(isCombiningCharacter(0x0300), true); // Combining Grave Accent
		assert.strictEqual(isCombiningCharacter(0x0301), true); // Combining Acute Accent
		assert.strictEqual(isCombiningCharacter(0x0302), true); // Combining Circumflex Accent
		assert.strictEqual(isCombiningCharacter(0x0308), true); // Combining Diaeresis
		assert.strictEqual(isCombiningCharacter(0x036f), true); // Combining Latin Small Letter X
		assert.strictEqual(isCombiningCharacter(0x0591), true); // Hebrew Accent Etnahta
		assert.strictEqual(isCombiningCharacter(0x05bf), true); // Hebrew Point Rafe
		assert.strictEqual(isCombiningCharacter(0x0670), true); // Arabic Letter Superscript Alef
		assert.strictEqual(isCombiningCharacter(0x0e31), true); // Thai Character Mai Han Akat
		assert.strictEqual(isCombiningCharacter(0x20d0), true); // Combining Left Harpoon Above
		assert.strictEqual(isCombiningCharacter(0xfe20), true); // Combining Ligature Left Half
	});

	it("should return true for Mc (Mark, Spacing Combining) characters", () => {
		assert.strictEqual(isCombiningCharacter(0x0903), true); // Devanagari Sign Visarga
		assert.strictEqual(isCombiningCharacter(0x0982), true); // Bengali Sign Anusvara
		assert.strictEqual(isCombiningCharacter(0x0bbe), true); // Tamil Vowel Sign Aa
		assert.strictEqual(isCombiningCharacter(0x0d02), true); // Malayalam Sign Anusvara
		assert.strictEqual(isCombiningCharacter(0x1031), true); // Myanmar Vowel Sign E
	});

	it("should return true for Me (Mark, Enclosing) characters", () => {
		assert.strictEqual(isCombiningCharacter(0x0488), true); // Combining Cyrillic-Old Slavic Hundred Thousands
		assert.strictEqual(isCombiningCharacter(0x0489), true); // Combining Cyrillic Millions Sign
		assert.strictEqual(isCombiningCharacter(0x20dd), true); // Combining Enclosing Circle
		assert.strictEqual(isCombiningCharacter(0x20de), true); // Combining Enclosing Square
		assert.strictEqual(isCombiningCharacter(0x20e0), true); // Combining Enclosing Circle Backslash
	});

	it("should return true for supplementary-plane combining marks", () => {
		assert.strictEqual(isCombiningCharacter(0x1d165), true); // Musical Symbol Combining Stem
		assert.strictEqual(isCombiningCharacter(0x1d167), true); // Musical Symbol Combining Tremolo-1
		assert.strictEqual(isCombiningCharacter(0xe0100), true); // Variation Selector-17
		assert.strictEqual(isCombiningCharacter(0xe01ef), true); // Variation Selector-256
	});

	it("should return false for non-combining characters", () => {
		assert.strictEqual(isCombiningCharacter(0x0041), false); // Letter A
		assert.strictEqual(isCombiningCharacter(0x0020), false); // Space
		assert.strictEqual(isCombiningCharacter(0x0000), false); // Null
		assert.strictEqual(isCombiningCharacter(0x007f), false); // Delete (last ASCII)
	});

	it("should return false for all ASCII code points", () => {
		for (let cp = 0; cp <= 0x7f; cp++) {
			assert.strictEqual(isCombiningCharacter(cp), false);
		}
	});

	it("should return false for precomposed characters with diacritics", () => {
		assert.strictEqual(isCombiningCharacter(0x00c0), false); // À (precomposed)
		assert.strictEqual(isCombiningCharacter(0x00e9), false); // é (precomposed)
		assert.strictEqual(isCombiningCharacter(0x00f1), false); // ñ (precomposed)
		assert.strictEqual(isCombiningCharacter(0x00fc), false); // ü (precomposed)
	});

	it("should return false for emoji and other non-mark code points", () => {
		assert.strictEqual(isCombiningCharacter(0x1f600), false); // Grinning Face
		assert.strictEqual(isCombiningCharacter(0x1f1e6), false); // Regional Indicator Symbol A
		assert.strictEqual(isCombiningCharacter(0x4e00), false); // CJK Unified Ideograph
		assert.strictEqual(isCombiningCharacter(0x2603), false); // Snowman
	});
});
