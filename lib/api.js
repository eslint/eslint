/**
 * @fileoverview Expose out ESLint and CLI to require.
 * @author Ian Christian Myers
 */

"use strict";

//-----------------------------------------------------------------------------
// Functions
//-----------------------------------------------------------------------------

/**
 * Loads the correct `ESLint` constructor.
 * @returns {Promise<ESLint>} The ESLint constructor.
 */
async function loadESLint() {
	return require("./eslint/eslint").ESLint;
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/*
 * The exports are defined as lazy getters so that requiring this module
 * doesn't eagerly load the entire dependency graph of every export. This
 * significantly speeds up loading for consumers that use only some of the
 * exports (or none, such as type-only consumers).
 */
module.exports = {
	get Linter() {
		return require("./linter").Linter;
	},
	loadESLint,
	get ESLint() {
		return require("./eslint/eslint").ESLint;
	},
	get RuleTester() {
		return require("./rule-tester").RuleTester;
	},
	get SourceCode() {
		return require("./languages/js/source-code").SourceCode;
	},
};
