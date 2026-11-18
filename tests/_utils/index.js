/**
 * @fileoverview Utilities used in tests
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const fs = require("node:fs/promises");
const path = require("node:path");

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Prevents leading spaces in a multiline template literal from appearing in the resulting string
 * @param {string[]} strings The strings in the template literal
 * @param {any[]} values The interpolation values in the template literal.
 * @returns {string} The template literal, with spaces removed from all lines
 */
function unIndent(strings, ...values) {
	const text = strings
		.map((s, i) => (i === 0 ? s : values[i - 1] + s))
		.join("");
	const lines = text
		.replace(/^\n/u, "")
		.replace(/\n\s*$/u, "")
		.split("\n");
	const lineIndents = lines
		.filter(line => line.trim())
		.map(line => line.match(/ */u)[0].length);
	const minLineIndent = Math.min(...lineIndents);

	return lines.map(line => line.slice(minLineIndent)).join("\n");
}

/**
 * @typedef {Object} Teardown
 * @property {(...segments: string[]) => string} getPath Resolves a path.
 * @property {() => Promise<void>} prepare Creates the filesystem volume.
 * @property {() => Promise<void>} cleanup Removes the filesystem volume.
 */

/**
 * Creates a new filesystem volume at the given location with the given files.
 * @param {Object} desc A description of the filesystem volume to create.
 * @param {string} desc.cwd The current working directory ESLint is using.
 * @param {Record<string, string>} desc.files A map of filename to file contents to create.
 * @returns {Teardown} An object with prepare(), cleanup(), and getPath()
 *      methods.
 */
function createCustomTeardown({ cwd, files }) {
	const rootDir = path.resolve(cwd);

	return {
		getPath: (...segments) => path.resolve(rootDir, ...segments),
		async prepare() {
			await Promise.all(
				Object.entries(files).map(async ([filename, contents]) => {
					const filePath = path.resolve(rootDir, filename);
					const stats = await fs.stat(filePath).catch(() => null);

					if (!stats?.isFile()) {
						await fs.mkdir(path.dirname(filePath), {
							recursive: true,
						});
						await fs.writeFile(filePath, "");
					}

					if (contents) {
						await fs.writeFile(filePath, contents);
					}
				}),
			);
		},
		cleanup: () => fs.rm(rootDir, { recursive: true, force: true }),
	};
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

module.exports = {
	unIndent,
	createCustomTeardown,
};
