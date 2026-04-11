"use strict";

const fs = require("node:fs");
const path = require("node:path");

/**
 * Resolve an absolute path.
 * @param {string} input The path to resolve.
 * @param {string} root The base path.
 * @returns {string}
 */
function absolute(input, root) {
	return path.isAbsolute(input) ? input : path.resolve(root, input);
}

/**
 * Get all parent directories.
 * @param {string} cwd.
 * @returns {Array<Config>}
 */
function walk(cwd) {
	let tmp = absolute(cwd, cwd);
	const root = absolute("/", cwd);
	const arr = [];
	let prev;
	while (prev !== root) {
		arr.push(tmp);
		prev = tmp;
		tmp = path.dirname(tmp);
		if (tmp === prev) {
			break;
		};
	}
	return arr;
}

/**
 * Get the first path that matches any of the names provided.
 * @param names The files to search for.
 * @returns {string|undefined}
 */
function findFile(names, cwd) {
	for (const dir of walk(cwd)) {
		for (const name of names) {
			const file = path.join(dir, name);
			if (fs.existsSync(file)) {
				return file;
			};
		}
	}
	return undefined;
}

module.exports = findFile;
