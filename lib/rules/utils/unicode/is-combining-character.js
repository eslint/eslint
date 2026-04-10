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
const COMBINING_CHAR_RANGES = require("../../../shared/combining-ranges.generated");

/**
 * Check whether a given character is a combining mark or not.
 * Covers Unicode categories Mc (Mark, Spacing Combining), Me (Mark, Enclosing), and Mn (Mark, Nonspacing).
 * @param {number} codePoint The character code to check.
 * @returns {boolean} `true` if the character has the General Category of Combining Mark (M), consisting of `Mc`, `Me`, and `Mn`.
 */
module.exports = function isCombiningCharacter(codePoint) {
	if (codePoint < 0x80) {
		return false;
	}

	let lo = 0;
	let hi = COMBINING_CHAR_RANGES.length - 1;

	while (lo <= hi) {
		const mid = (lo + hi) >>> 1;
		const range = COMBINING_CHAR_RANGES[mid];

		if (codePoint < range[0]) {
			hi = mid - 1;
		} else if (codePoint > range[1]) {
			lo = mid + 1;
		} else {
			return true;
		}
	}

	return false;
};
