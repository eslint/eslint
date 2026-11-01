/**
 * @fileoverview Reads captured Git blobs without consulting the live index.
 * @author GitHub Copilot
 */

"use strict";

const { runGit } = require("../git");

/**
 * Reads the blob captured by a selector.
 * @param {import("../file-source").FileInput} input Selected input with Git metadata.
 * @param {{signal?: AbortSignal}} [options] Read options.
 * @returns {Promise<string>} Staged UTF-8 source text.
 */
async function readFile(input, { signal } = {}) {
	if (
		!input.blobId ||
		!/^[a-f\d]{40,64}$/u.test(input.blobId) ||
		!input.repository
	) {
		throw new Error(`Git input has no captured blob ID: ${input.filePath}`);
	}
	return (
		await runGit(
			input.repository,
			["cat-file", "blob", input.blobId],
			signal,
		)
	).toString("utf8");
}

module.exports = { readFile };
