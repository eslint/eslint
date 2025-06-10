/**
 * Utility for resolving a module relative to another module
 * @author Teddy Katz
 */

"use strict";

const Module = require("node:module");

/*
 * `Module.createRequire` is added in v12.2.0. It supports URL as well.
 * We only support the case where the argument is a filepath, not a URL.
 */
const createRequire = Module.createRequire;

/**
 * Resolves a Node module relative to another module
 * @param {string} moduleName The name of a Node module, or a path to a Node module.
 * @param {string} relativeToPath An absolute path indicating the module that `moduleName` should be resolved relative to. This must be
 * a file rather than a directory, but the file need not actually exist.
 * @returns {string} The absolute path that would result from calling `require.resolve(moduleName)` in a file located at `relativeToPath`
 * @throws {Error} When the module cannot be resolved.
 */
function resolve(moduleName, relativeToPath) {
	return createRequire(relativeToPath).resolve(moduleName);
}

exports.resolve = resolve;
