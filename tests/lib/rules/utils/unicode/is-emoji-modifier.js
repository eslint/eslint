/**
 * @fileoverview Tests for is-emoji-modifier utility.
 * @author Manish Chaudhary
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
	isEmojiModifier = require("../../../../../lib/rules/utils/unicode/is-emoji-modifier");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("isEmojiModifier", () => {
	it("should return true for emoji modifiers (U+1F3FB to U+1F3FF)", () => {
		assert.strictEqual(isEmojiModifier(0x1f3fb), true); // Emoji Modifier Fitzpatrick Type-1-2
		assert.strictEqual(isEmojiModifier(0x1f3fd), true); // Emoji Modifier Fitzpatrick Type-4
		assert.strictEqual(isEmojiModifier(0x1f3ff), true); // Emoji Modifier Fitzpatrick Type-6
	});

	it("should return false for characters outside the range", () => {
		assert.strictEqual(isEmojiModifier(0x1f3fa), false);
		assert.strictEqual(isEmojiModifier(0x1f400), false);
		assert.strictEqual(isEmojiModifier(0x2705), false); // White Heavy Check Mark
	});
});
