/**
 * @fileoverview Reads selected filesystem inputs.
 * @author GitHub Copilot
 */

"use strict";

const fs = require("node:fs/promises");

/**
 * Reads a selected input as UTF-8.
 * @param {import("../file-source").FileInput} input Selected input.
 * @param {{signal?: AbortSignal}} [options] Read options.
 * @returns {Promise<string>} Source text.
 */
function readFile(input, { signal } = {}) {
	return fs.readFile(input.filePath, { encoding: "utf8", signal });
}

module.exports = { readFile };
