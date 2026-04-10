/**
 * @fileoverview Tests for string utils.
 * @author Stephen Wade
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert;

const {
	upperCaseFirst,
	getGraphemeCount,
	formatList,
} = require("../../../lib/shared/string-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Replaces raw control characters with the `\xXX` form.
 * @param {string} text The text to process.
 * @returns {string} `text` with escaped control characters.
 */
function escapeControlCharacters(text) {
	return text.replace(
		/[\u0000-\u001F\u007F-\u009F]/gu, // eslint-disable-line no-control-regex -- intentionally including control characters
		c => `\\x${c.codePointAt(0).toString(16).padStart(2, "0")}`,
	);
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("upperCaseFirst", () => {
	it("uppercases the first letter of a string", () => {
		assert(upperCaseFirst("e") === "E");
		assert(upperCaseFirst("alphabet") === "Alphabet");
		assert(upperCaseFirst("one two three") === "One two three");
	});

	it("only changes the case of the first letter", () => {
		assert(upperCaseFirst("alphaBet") === "AlphaBet");
		assert(upperCaseFirst("one TWO three") === "One TWO three");
	});

	it("does not change the case if the first letter is already uppercase", () => {
		assert(upperCaseFirst("E") === "E");
		assert(upperCaseFirst("Alphabet") === "Alphabet");
		assert(upperCaseFirst("One Two Three") === "One Two Three");
	});

	it("properly handles an empty string", () => {
		assert(upperCaseFirst("") === "");
	});
});

describe("getGraphemeCount", () => {
	const expectedResults = {
		"": 0,
		a: 1,
		ab: 2,
		aa: 2,
		123: 3,
		cccc: 4,
		[Array.from({ length: 128 }, (_, i) => String.fromCharCode(i)).join(
			"",
		)]: 128, // all ASCII characters
		"👍": 1, // 1 grapheme, 1 code point, 2 code units
		"👍👍": 2,
		"👍9👍": 3,
		"a👍b": 3,
		"👶🏽": 1, // 1 grapheme, 2 code points, 4 code units
		"👨‍👩‍👦": 1, // 1 grapheme, 5 code points, 8 code units
		"👨‍👩‍👦👨‍👩‍👦": 2,
		"👨‍👩‍👦a👨‍👩‍👦": 3,
		"a👨‍👩‍👦b👨‍👩‍👦c": 5,
		"👨‍👩‍👦👍": 2,
		"👶🏽👨‍👩‍👦": 2,
		"👩‍🦰👩‍👩‍👦‍👦🏳️‍🌈": 3, // 3 grapheme, 14 code points, 22 code units
	};

	Object.entries(expectedResults).forEach(([key, value]) => {
		it(`should return ${value} for ${escapeControlCharacters(key)}`, () => {
			assert.strictEqual(getGraphemeCount(key), value);
		});
	});

	/*
	 * Combining diacritical marks: base character + combining mark(s) = 1 grapheme.
	 * These exercise the non-ICU fallback path in getGraphemeCount, which uses
	 * hardcoded combining mark ranges instead of Intl.Segmenter or \p{M} regex.
	 */
	describe("combining diacritical marks", () => {
		it("should count base + single combining mark as 1 grapheme", () => {
			assert.strictEqual(getGraphemeCount("e\u0301"), 1); // e + combining acute accent → é
			assert.strictEqual(getGraphemeCount("n\u0303"), 1); // n + combining tilde → ñ
			assert.strictEqual(getGraphemeCount("a\u0300"), 1); // a + combining grave accent → à
			assert.strictEqual(getGraphemeCount("u\u0308"), 1); // u + combining diaeresis → ü
			assert.strictEqual(getGraphemeCount("o\u0302"), 1); // o + combining circumflex → ô
		});

		it("should count base + multiple combining marks as 1 grapheme", () => {
			assert.strictEqual(getGraphemeCount("a\u0300\u0301"), 1); // a + grave + acute
			assert.strictEqual(getGraphemeCount("o\u0308\u0304"), 1); // o + diaeresis + macron
			assert.strictEqual(getGraphemeCount("e\u0301\u0327"), 1); // e + acute + cedilla
		});

		it("should count strings mixing ASCII and combining marks", () => {
			assert.strictEqual(getGraphemeCount("caf\u0065\u0301"), 4); // c-a-f-é (é as e + combining acute)
			assert.strictEqual(getGraphemeCount("re\u0301sume\u0301"), 6); // r-é-s-u-m-é
			assert.strictEqual(getGraphemeCount("na\u0308ive"), 5); // n-ä-i-v-e
		});

		it("should handle combining marks from the Extended block (U+1AB0-U+1AFF)", () => {
			assert.strictEqual(getGraphemeCount("a\u1ab0"), 1); // a + COMBINING DOUBLED CIRCUMFLEX ACCENT
		});

		it("should handle combining marks from the Supplement block (U+1DC0-U+1DFF)", () => {
			assert.strictEqual(getGraphemeCount("a\u1dc0"), 1); // a + COMBINING DOTTED GRAVE ACCENT
		});

		it("should handle combining marks for symbols (U+20D0-U+20FF)", () => {
			assert.strictEqual(getGraphemeCount("x\u20d0"), 1); // x + COMBINING LEFT HARPOON ABOVE
		});

		it("should handle combining half marks (U+FE20-U+FE2F)", () => {
			assert.strictEqual(getGraphemeCount("a\ufe20"), 1); // a + COMBINING LIGATURE LEFT HALF
		});
	});
});

describe("formatList", () => {
	it("formats a list of strings into a comma-separated list with the last item joined by 'and'", () => {
		assert(formatList(["a"]) === "a");
		assert(formatList(["a", "b"]) === "a and b");
		assert(formatList(["a", "b", "c"]) === "a, b, and c");
		assert(formatList(["a", "b", "c", "d"]) === "a, b, c, and d");
	});
});
