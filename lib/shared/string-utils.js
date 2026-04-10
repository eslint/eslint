/**
 * @fileoverview Utilities to operate on strings.
 * @author Stephen Wade
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

// eslint-disable-next-line no-control-regex -- intentionally including control characters
const ASCII_REGEX = /^[\u0000-\u007f]*$/u;

const COMBINING_CHAR_RANGES = require("./combining-ranges.generated");

/**
 * Checks if a code point is a Regional Indicator (used for flag emoji).
 * @param {number} cp The code point to check.
 * @returns {boolean} True if the code point is a regional indicator.
 */
function isRegionalIndicator(cp) {
	return cp >= 0x1f1e6 && cp <= 0x1f1ff;
}

/**
 * Checks if a code point is a combining mark (Unicode categories Mn, Mc, Me)
 * or a variation selector. Uses binary search over the generated ranges.
 * @param {number} cp The code point to check.
 * @returns {boolean} True if the code point is a combining mark or variation selector.
 */
function isCombiningMark(cp) {
	if (cp < 0x80) {
		return false;
	}

	let lo = 0;
	let hi = COMBINING_CHAR_RANGES.length - 1;

	while (lo <= hi) {
		const mid = (lo + hi) >>> 1;
		const range = COMBINING_CHAR_RANGES[mid];

		if (cp < range[0]) {
			hi = mid - 1;
		} else if (cp > range[1]) {
			lo = mid + 1;
		} else {
			return true;
		}
	}

	return false;
}

/**
 * Checks if a code point is an emoji modifier (skin tone).
 * @param {number} cp The code point to check.
 * @returns {boolean} True if the code point is an emoji modifier.
 */
function isEmojiModifier(cp) {
	return cp >= 0x1f3fb && cp <= 0x1f3ff;
}

/**
 * Checks if a code point is a Zero Width Joiner.
 * @param {number} cp The code point to check.
 * @returns {boolean} True if the code point is a ZWJ.
 */
function isZWJ(cp) {
	return cp === 0x200d;
}

/**
 * Checks if a code point should be skipped when counting graphemes
 * (combining marks, variation selectors, or emoji modifiers).
 * Combining marks and variation selectors are both covered by the
 * generated Mn/Mc/Me ranges (variation selectors are category Mn).
 * @param {number} cp The code point to check.
 * @returns {boolean} True if the code point should be skipped.
 */
function isGraphemeExtend(cp) {
	return isCombiningMark(cp) || isEmojiModifier(cp);
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Converts the first letter of a string to uppercase.
 * @param {string} string The string to operate on
 * @returns {string} The converted string
 */
function upperCaseFirst(string) {
	if (string.length <= 1) {
		return string.toUpperCase();
	}
	return string[0].toUpperCase() + string.slice(1);
}

/**
 * Counts graphemes in a given string.
 * Works without Unicode property escapes for Node.js built with --with-intl=none.
 * @param {string} value A string to count graphemes.
 * @returns {number} The number of graphemes in `value`.
 */
function getGraphemeCount(value) {
	if (ASCII_REGEX.test(value)) {
		return value.length;
	}

	const len = value.length;
	let count = 0;
	let i = 0;

	while (i < len) {
		const cp = value.codePointAt(i);
		const cpLen = cp > 0xffff ? 2 : 1;

		// Regional indicator pairs (flags like 🇮🇳)
		if (isRegionalIndicator(cp)) {
			count++;
			i += cpLen;
			// Skip the second regional indicator if present
			if (i < len && isRegionalIndicator(value.codePointAt(i))) {
				i += value.codePointAt(i) > 0xffff ? 2 : 1;
			}
			continue;
		}

		// Count as one grapheme
		count++;
		i += cpLen;

		// Skip any following combining marks, variation selectors, emoji modifiers, and ZWJ sequences
		while (i < len) {
			const nextCp = value.codePointAt(i);
			const nextLen = nextCp > 0xffff ? 2 : 1;

			if (isGraphemeExtend(nextCp)) {
				i += nextLen;
			} else if (isZWJ(nextCp) && i + 1 < len) {
				// ZWJ sequence - skip ZWJ and the next character
				i += 1; // ZWJ is U+200D (BMP, always 1 code unit)
				const joinedCp = value.codePointAt(i);

				i += joinedCp > 0xffff ? 2 : 1;
				// Also skip any modifiers/selectors after the joined character
				while (i < len && isGraphemeExtend(value.codePointAt(i))) {
					i += value.codePointAt(i) > 0xffff ? 2 : 1;
				}
			} else {
				break;
			}
		}
	}

	return count;
}

/**
 * Formats a list of strings into a comma-separated list with the last item joined by "and".
 * @param {string[]} list The list of strings to format.
 * @returns {string} The formatted list.
 */
function formatList(list) {
	if (list.length <= 1) {
		return list[0] ?? "";
	}
	if (list.length === 2) {
		return `${list[0]} and ${list[1]}`;
	}
	return `${list.slice(0, -1).join(", ")}, and ${list.at(-1)}`;
}

module.exports = {
	upperCaseFirst,
	getGraphemeCount,
	formatList,
};
