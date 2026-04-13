/**
 * @fileoverview Define utility functions for token store.
 * @author Toru Nagashima
 */
"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Finds the index of the first token which is after the given location.
 * If it was not found, this returns `tokens.length`.
 * @param {(Token|Comment)[]} tokens It searches the token in this list.
 * @param {number} location The location to search.
 * @returns {number} The found index or `tokens.length`.
 */
function search(tokens, location) {
	for (
		let minIndex = 0, maxIndex = tokens.length - 1;
		minIndex <= maxIndex;
	) {
		/*
		 * Calculate the index in the middle between minIndex and maxIndex.
		 * `| 0` is used to round a fractional value down to the nearest integer: this is similar to
		 * using `Math.trunc()` or `Math.floor()`, but performance tests have shown this method to
		 * be faster.
		 */
		const index = ((minIndex + maxIndex) / 2) | 0;
		const token = tokens[index];
		const tokenStartLocation = token.range[0];

		if (location <= tokenStartLocation) {
			if (index === minIndex) {
				return index;
			}
			maxIndex = index;
		} else {
			minIndex = index + 1;
		}
	}
	return tokens.length;
}

/**
 * Gets the index of the `startLoc` in `tokens`.
 * Uses binary search to find the first token at or after the given location.
 * @param {(Token|Comment)[]} tokens The tokens to find an index.
 * @param {Object} indexMap Unused, kept for API compatibility.
 * @param {number} startLoc The location to get an index.
 * @returns {number} The index.
 */
function getFirstIndex(tokens, indexMap, startLoc) {
	if (startLoc <= 0) {
		return 0;
	}
	return search(tokens, startLoc);
}
/**
 * Gets the index of the `endLoc` in `tokens`.
 * Uses binary search to find the last token at or before the given location.
 * @param {(Token|Comment)[]} tokens The tokens to find an index.
 * @param {Object} indexMap Unused, kept for API compatibility.
 * @param {number} endLoc The location to get an index.
 * @returns {number} The index.
 */
function getLastIndex(tokens, indexMap, endLoc) {
	if (endLoc === -1) {
		return tokens.length - 1;
	}
	if (endLoc === 0) {
		return -1;
	}
	return search(tokens, endLoc) - 1;
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

module.exports = { search, getFirstIndex, getLastIndex };
