/**
 * Utility for resolving a module relative to another module
 * @author Teddy Katz
 */

"use strict";

const Module = require("module");
const path = require("path");

// Polyfill Node's `Module.createRequireFromPath` if not present (added in Node v10.12.0)
const createRequireFromPath = Module.createRequireFromPath || (filename => {
    const mod = new Module(filename, null);

    mod.filename = filename;
    mod.paths = Module._nodeModulePaths(path.dirname(filename)); // eslint-disable-line no-underscore-dangle
    mod._compile("module.exports = require;", filename); // eslint-disable-line no-underscore-dangle
    return mod.exports;
});

module.exports = {

    /**
     * Resolves a Node module relative to another module
     * @param {string} moduleName The name of a Node module, or a path to a Node module.
     *
     * @param {string} relativeToPath An absolute path indicating the module that `moduleName` should be resolved relative to. This must be
     * a file rather than a directory, but the file need not actually exist.
     * @returns {string} The absolute path that would result from calling `require.resolve(moduleName)` in a file located at `relativeToPath`
     */
    resolve(moduleName, relativeToPath) {
        try {
            return createRequireFromPath(relativeToPath).resolve(moduleName);
        } catch (error) {
            if (error && error.code === "MODULE_NOT_FOUND" && error.message.includes(moduleName)) {
                error.message += ` relative to '${relativeToPath}'`;
            }
            throw error;
        }
    }
};
