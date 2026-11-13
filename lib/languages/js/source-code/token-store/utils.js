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
 * Reads the entry of a location in an index map.
 * @param {Int32Array} indexMap The map from locations to indices. Each element holds the index plus one.
 * @param {number} location The location to look up.
 * @returns {number} The index plus one, or `0` if the location has no entry.
 */
function lookup(indexMap, location) {
	return location >= 0 && location < indexMap.length ? indexMap[location] : 0;
}

/**
 * Gets the index of the `startLoc` in `tokens`.
 * `startLoc` can be the value of `node.range[1]`, so this checks about `startLoc - 1` as well.
 * @param {(Token|Comment)[]} tokens The tokens to find an index.
 * @param {Int32Array} indexMap The map from locations to indices.
 * @param {number} startLoc The location to get an index.
 * @returns {number} The index.
 */
function getFirstIndex(tokens, indexMap, startLoc) {
	if (startLoc === -1) {
		return 0;
	}

	let entry = lookup(indexMap, startLoc);

	if (entry > 0) {
		return entry - 1;
	}

	entry = lookup(indexMap, startLoc - 1);

	if (entry > 0) {
		const index = entry - 1;
		const token = tokens[index];

		// If the mapped index is out of bounds, the returned cursor index will point after the end of the tokens array.
		if (!token) {
			return tokens.length;
		}

		/*
		 * For the map of "comment's location -> token's index", it points the next token of a comment.
		 * In that case, +1 is unnecessary.
		 */
		if (token.range[0] >= startLoc) {
			return index;
		}
		return index + 1;
	}

	// Program node that doesn't start/end with a token or comment
	if (startLoc === 0) {
		return 0;
	}
	return tokens.length;
}
/**
 * Gets the index of the `endLoc` in `tokens`.
 * The information of end locations are recorded at `endLoc - 1` in `indexMap`, so this checks about `endLoc - 1` as well.
 * @param {(Token|Comment)[]} tokens The tokens to find an index.
 * @param {Int32Array} indexMap The map from locations to indices.
 * @param {number} endLoc The location to get an index.
 * @returns {number} The index.
 */
function getLastIndex(tokens, indexMap, endLoc) {
	if (endLoc === -1) {
		return tokens.length - 1;
	}

	let entry = lookup(indexMap, endLoc);

	if (entry > 0) {
		return entry - 2;
	}

	entry = lookup(indexMap, endLoc - 1);

	if (entry > 0) {
		const index = entry - 1;
		const token = tokens[index];

		// If the mapped index is out of bounds, the returned cursor index will point before the end of the tokens array.
		if (!token) {
			return tokens.length - 1;
		}

		/*
		 * For the map of "comment's location -> token's index", it points the next token of a comment.
		 * In that case, -1 is necessary.
		 */
		if (token.range[1] > endLoc) {
			return index - 1;
		}
		return index;
	}

	// Program node that doesn't start/end with a token or comment
	if (endLoc === 0) {
		return -1;
	}
	return tokens.length - 1;
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

module.exports = { search, getFirstIndex, getLastIndex };
