/**
 * @fileoverview Common utils for strings.
 */
"use strict";
//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------
const LETTER_PATTERN = /\p{L}/u;
/**
 * Checks if the given string contains a letter.
 * @param {string} string The string to test.
 * @returns {boolean} `true` if the string contains a letter.
 */
function containsLetter(string) {
	return LETTER_PATTERN.test(string);
}

module.exports = {
	LETTER_PATTERN,
	containsLetter,
};
