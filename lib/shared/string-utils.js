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

/** @type {Intl.Segmenter | undefined} */
let segmenter;

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
 * @param {string} value A string to count graphemes.
 * @returns {number} The number of graphemes in `value`.
 */
function getGraphemeCount(value) {
	if (ASCII_REGEX.test(value)) {
		return value.length;
	}

	segmenter ??= new Intl.Segmenter("en-US"); // en-US locale should be supported everywhere
	let graphemeCount = 0;

	// eslint-disable-next-line no-unused-vars -- for-of needs a variable
	for (const unused of segmenter.segment(value)) {
		graphemeCount++;
	}

	return graphemeCount;
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
