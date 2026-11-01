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
 * Checks if a relative path or any of its ancestor directories matches a glob matcher.
 * @param {Minimatch} matcher The minimatch instance.
 * @param {string} relPath The relative POSIX path.
 * @returns {boolean} True if matched.
 */
function matchesGlob(matcher, relPath) {
	if (matcher.match(relPath)) {
		return true;
	}

	let current = path.dirname(relPath);

	while (current && current !== "." && current !== "/") {
		if (matcher.match(normalize(current))) {
			return true;
		}

		const parent = path.dirname(current);

		if (parent === current) {
			break;
		}

		current = parent;
	}

	return false;
}

/**
 * Captures staged changes and filters them without inspecting working files.
 * @param {Object} options Discovery options.
 * @param {string[]} options.patterns File, directory, or glob filters.
 * @param {boolean} options.globInputPaths Whether glob filters are enabled.
 * @param {string} options.cwd The working directory.
 * @param {Object} [options.configLoader] The configuration loader.
 * @returns {Promise<import("../file-source").FileInput[]>} Captured inputs.
 */
async function selectFiles({ patterns, globInputPaths, cwd, configLoader }) {
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
			pattern,
			absolute,
			matcher: globInputPaths
				? new Minimatch(relative, { dot: true })
				: null,
		};
	});

	const candidates = [];

	for (const { filePath, blobId, repository: repo } of entries.values()) {
		let isExplicit = false;
		let isMatched = false;
		const relPath = normalize(path.relative(cwd, filePath));

		for (const { absolute, matcher } of filters) {
			if (filePath === absolute) {
				isExplicit = true;
				isMatched = true;
				break;
			}
			if (filePath.startsWith(`${absolute}${path.sep}`)) {
				isMatched = true;
			} else if (
				!entries.has(absolute) &&
				matcher &&
				matchesGlob(matcher, relPath)
			) {
				isMatched = true;
			}
		}

		if (isMatched) {
			candidates.push({
				input: { filePath, blobId, repository: repo },
				isExplicit,
			});
		}
	}

	if (
		!configLoader ||
		typeof configLoader.loadConfigArrayForFile !== "function"
	) {
		return candidates.map(candidate => candidate.input);
	}

	const selected = await Promise.all(
		candidates.map(async candidate => {
			if (candidate.isExplicit) {
				return candidate.input;
			}

			const configs = await configLoader.loadConfigArrayForFile(
				candidate.input.filePath,
			);

			if (configs && typeof configs.getConfig === "function") {
				const config = configs.getConfig(candidate.input.filePath);

				if (config === void 0) {
					return null;
				}
			}

			return candidate.input;
		}),
	);

	return selected.filter(Boolean);
}

module.exports = { selectFiles };
