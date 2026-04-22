/**
 * @fileoverview Utilities for handling location information.
 * @author ESLint Contributors
 */
"use strict";

//------------------------------------------------------------------------------
// Typedefs
//------------------------------------------------------------------------------

/** @typedef {import("@eslint/core").Language} Language */

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Updates a given location based on the language offsets. This allows us to
 * change 0-based locations to 1-based locations. We always want ESLint
 * reporting lines and columns starting from 1.
 * @param {Object} location The location to update.
 * @param {number} location.line The starting line number.
 * @param {number} location.column The starting column number.
 * @param {number} [location.endLine] The ending line number.
 * @param {number} [location.endColumn] The ending column number.
 * @param {Language} language The language to use to adjust the location information.
 * @returns {Object} The updated location.
 */
function updateLocationInformation(
	{ line, column, endLine, endColumn },
	language,
) {
	const columnOffset = language.columnStart === 1 ? 0 : 1;
	const lineOffset = language.lineStart === 1 ? 0 : 1;

	// calculate separately to account for undefined
	const finalEndLine = endLine === void 0 ? endLine : endLine + lineOffset;
	const finalEndColumn =
		endColumn === void 0 ? endColumn : endColumn + columnOffset;

	return {
		line: line + lineOffset,
		column: column + columnOffset,
		endLine: finalEndLine,
		endColumn: finalEndColumn,
	};
}

module.exports = {
	updateLocationInformation,
};
