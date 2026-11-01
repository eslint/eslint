/**
 * @fileoverview Selects staged Git inputs with captured blob IDs.
 * @author GitHub Copilot
 */

"use strict";

const path = require("node:path");
const { Minimatch } = require("minimatch");
const { runGit } = require("../git");

/**
 * Normalizes separators for glob matching.
 * @param {string} filename A platform-native path.
 * @returns {string} A POSIX-style path.
 */
function normalize(filename) {
	return filename.split(path.sep).join("/");
}

/**
 * Captures staged changes and filters them without inspecting working files.
 * @param {Object} options Discovery options.
 * @param {string[]} options.patterns File, directory, or glob filters.
 * @param {boolean} options.globInputPaths Whether glob filters are enabled.
 * @param {string} options.cwd The working directory.
 * @returns {Promise<import("../file-source").FileInput[]>} Captured inputs.
 */
async function selectFiles({ patterns, globInputPaths, cwd }) {
	const repository = (await runGit(cwd, ["rev-parse", "--show-toplevel"]))
		.toString("utf8")
		.replace(/\r?\n$/u, "");
	const output = await runGit(repository, [
		"diff",
		"--cached",
		"--raw",
		"-z",
		"--no-renames",
		"--abbrev=64",
		"--no-ext-diff",
		"--no-textconv",
		"--ita-invisible-in-index",
		"--",
	]);
	const text = output.toString("utf8");

	if (!Buffer.from(text).equals(output)) {
		throw new Error("Git file source requires UTF-8 Git paths.");
	}

	const records = text.split("\0");
	const entries = new Map();

	for (let index = 0; index < records.length - 1; index += 2) {
		const [, mode, , blobId, status] = records[index].split(" ");
		const filename = records[index + 1];

		if (status === "U") {
			throw new Error(`Cannot lint an unmerged Git index: ${filename}`);
		}
		if (status !== "D" && (mode === "100644" || mode === "100755")) {
			if (!/^[a-f\d]{40,64}$/u.test(blobId) || /^0+$/u.test(blobId)) {
				throw new Error(`Invalid staged Git blob: ${filename}`);
			}
			const filePath = path.resolve(repository, filename);

			entries.set(filePath, { filePath, blobId, repository });
		}
	}

	const filters = patterns.map(pattern => {
		const absolute = path.resolve(cwd, pattern);
		const relative = normalize(path.relative(cwd, absolute));

		return {
			absolute,
			matcher: globInputPaths
				? new Minimatch(relative, { dot: true })
				: null,
		};
	});

	return [...entries.values()].filter(({ filePath }) =>
		filters.some(
			({ absolute, matcher }) =>
				filePath === absolute ||
				filePath.startsWith(`${absolute}${path.sep}`) ||
				(!entries.has(absolute) &&
					matcher?.match(normalize(path.relative(cwd, filePath)))),
		),
	);
}

module.exports = { selectFiles };
