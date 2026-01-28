/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 */
"use strict";

/**
 * Combining character ranges covering Unicode categories Mc, Me, and Mn.
 * Each entry is [start, end] inclusive.
 * Uses explicit ranges for compatibility with Node.js built with --with-intl=none.
 * @type {[number, number][]}
 */
const COMBINING_CHAR_RANGES = require("./combining-ranges.generated");

/**
 * Check whether a given character is a combining mark or not.
 * Covers Unicode categories Mc (Mark, Spacing Combining), Me (Mark, Enclosing), and Mn (Mark, Nonspacing).
 * @param {number} codePoint The character code to check.
 * @returns {boolean} `true` if the character belongs to the category, any of `Mc`, `Me`, and `Mn`.
 */
module.exports = function isCombiningCharacter(codePoint) {
	return COMBINING_CHAR_RANGES.some(
		([start, end]) => codePoint >= start && codePoint <= end,
	);
};
