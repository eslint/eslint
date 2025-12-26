/**
 * @fileoverview Common utils for files.
 * @author Josh Goldberg
 */

"use strict";

/**
 * Checks if the current file is a TypeScript definition file
 * @param {string|undefined} filename The filename to check
 * @returns {boolean} `true` if the file is a .d.ts, .d.mts or .d.cts file
 */
function isDefinitionFile(filename) {
	// Matches .d.ts, .d.mts, .d.cts at the end of the filename
	return typeof filename === "string"
		? /\.d\.(?:ts|mts|cts)$/u.test(filename)
		: false;
}

module.exports = {
	isDefinitionFile,
};
