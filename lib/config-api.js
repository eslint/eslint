/**
 * @fileoverview exports for config helpers
 * @author Nicholas C. Zakas
 */

"use strict";

const {
	defineConfig,
	globalIgnores,
	// TODO - this won't actually work until config-helpers is updated and published
	includeIgnoreFile,
} = require("@eslint/config-helpers");

module.exports = {
	defineConfig,
	globalIgnores,
	includeIgnoreFile,
};
