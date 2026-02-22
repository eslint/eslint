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

/**
 * Checks if a code point is a Regional Indicator (used for flag emoji).
 * @param {number} cp The code point to check.
 * @returns {boolean} True if the code point is a regional indicator.
 */
function isRegionalIndicator(cp) {
	return cp >= 0x1f1e6 && cp <= 0x1f1ff;
}

/**
 * Checks if a code point is a variation selector.
 * @param {number} cp The code point to check.
 * @returns {boolean} True if the code point is a variation selector.
 */
function isVariationSelector(cp) {
	return (cp >= 0xfe00 && cp <= 0xfe0f) || (cp >= 0xe0100 && cp <= 0xe01ef);
}

/**
 * Checks if a code point is a combining mark.
 * @param {number} cp The code point to check.
 * @returns {boolean} True if the code point is a combining mark.
 */
function isCombiningMark(cp) {
	return (
		(cp >= 0x0300 && cp <= 0x036f) || // Combining Diacritical Marks
		(cp >= 0x1ab0 && cp <= 0x1aff) || // Combining Diacritical Marks Extended
		(cp >= 0x1dc0 && cp <= 0x1dff) || // Combining Diacritical Marks Supplement
		(cp >= 0x20d0 && cp <= 0x20ff) || // Combining Diacritical Marks for Symbols
		(cp >= 0xfe20 && cp <= 0xfe2f)
	); // Combining Half Marks
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
 * @param {number} cp The code point to check.
 * @returns {boolean} True if the code point should be skipped.
 */
function isGraphemeExtend(cp) {
	return (
		isCombiningMark(cp) || isVariationSelector(cp) || isEmojiModifier(cp)
	);
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

	const codePoints = [...value];
	let count = 0;
	let i = 0;

	while (i < codePoints.length) {
		const cp = codePoints[i].codePointAt(0);

		// Regional indicator pairs (flags like 🇮🇳)
		if (isRegionalIndicator(cp)) {
			count++;
			i++;
			// Skip the second regional indicator if present
			if (
				i < codePoints.length &&
				isRegionalIndicator(codePoints[i].codePointAt(0))
			) {
				i++;
			}
			continue;
		}

		// Count as one grapheme
		count++;
		i++;

		// Skip any following combining marks, variation selectors, emoji modifiers, and ZWJ sequences
		while (i < codePoints.length) {
			const nextCp = codePoints[i].codePointAt(0);

			if (isGraphemeExtend(nextCp)) {
				i++;
			} else if (isZWJ(nextCp) && i + 1 < codePoints.length) {
				// ZWJ sequence - skip ZWJ and the next character
				i += 2;
				// Also skip any modifiers/selectors after the joined character
				while (
					i < codePoints.length &&
					isGraphemeExtend(codePoints[i].codePointAt(0))
				) {
					i++;
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
