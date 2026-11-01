/**
 * @fileoverview Combines file selectors with content providers.
 * @author GitHub Copilot
 */

"use strict";

const filesystemSelector = require("./file-selectors/filesystem");
const gitSelector = require("./file-selectors/git");
const filesystemProvider = require("./file-providers/filesystem");
const gitProvider = require("./file-providers/git");

/**
 * @typedef {Object} FileInput
 * @property {string} filePath Absolute reporting and configuration path.
 * @property {string} [blobId] Captured Git blob ID.
 * @property {string} [repository] Repository containing the captured blob.
 */

/**
 * @typedef {Object} FileSource
 * @property {{selectFiles: (options: Object) => Promise<FileInput[]>}} selector Input selector.
 * @property {{readFile: (input: FileInput, options?: {signal?: AbortSignal}) => Promise<string>}} provider Content provider.
 */

/**
 * Creates a selector/provider combination.
 * @param {"filesystem"|"git"} name Source name.
 * @returns {FileSource} File selection and content provision.
 * @throws {Error} If the source is unknown.
 */
function createFileSource(name) {
	if (name === "filesystem") {
		return { selector: filesystemSelector, provider: filesystemProvider };
	}
	if (name === "git") {
		return {
			selector: gitSelector,
			provider:
				typeof gitProvider.createGitProvider === "function"
					? gitProvider.createGitProvider()
					: gitProvider,
		};
	}
	throw new Error(`Unknown file source: ${name}`);
}

module.exports = { createFileSource };
