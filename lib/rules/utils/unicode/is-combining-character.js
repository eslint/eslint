/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 */
"use strict";

/**
 * Check whether a given character is a combining mark or not.
 * @param {number} codePoint The character code to check.
 * @returns {boolean} `true` if the character has the General Category of Combining Mark (M), consisting of `Mc`, `Me`, and `Mn`.
 */
module.exports = function isCombiningCharacter(codePoint) {
	return /^[\p{M}]$/u.test(String.fromCodePoint(codePoint));
};
