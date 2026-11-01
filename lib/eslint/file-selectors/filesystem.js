/**
 * @fileoverview Selects filesystem inputs using ESLint's glob and ignore handling.
 * @author GitHub Copilot
 */

"use strict";

const { findFiles } = require("../eslint-helpers");

/**
 * Selects filesystem inputs.
 * @param {Object} options Discovery options.
 * @returns {Promise<import("../file-source").FileInput[]>} Selected inputs.
 */
async function selectFiles(options) {
	const paths = await findFiles(options);

	return paths.map(filePath => ({ filePath }));
}

module.exports = { selectFiles };
