/**
 * @fileoverview Emits warnings for ESLint.
 * @author Francesco Trotta
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const { LinterWarningService } = require("./linter-warning-service");

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * A service that emits warnings ESLint.
 */
class WarningService extends LinterWarningService {
	/**
	 * Emits a warning when an empty config file has been loaded.
	 * @param {string} configFilePath The path to the config file.
	 * @returns {void}
	 */
	emitEmptyConfigWarning(configFilePath) {
		this._emitWarning(
			`Running ESLint with an empty config (from ${configFilePath}). Please double-check that this is what you want. If you want to run ESLint with an empty config, export [{}] to remove this warning.`,
			"ESLintEmptyConfigWarning",
		);
	}

	/**
	 * Emits a warning when an ".eslintignore" file is found.
	 * @returns {void}
	 */
	emitESLintIgnoreWarning() {
		this._emitWarning(
			'The ".eslintignore" file is no longer supported. Switch to using the "ignores" property in "eslint.config.js": https://eslint.org/docs/latest/use/configure/migration-guide#ignoring-files',
			"ESLintIgnoreWarning",
		);
	}

	/**
	 * Emits a warning when the ESLINT_USE_FLAT_CONFIG environment variable is set to "false".
	 * @returns {void}
	 */
	emitESLintRCWarning() {
		this._emitWarning(
			"You are using an eslintrc configuration file, which is deprecated and support will be removed in v10.0.0. Please migrate to an eslint.config.js file. See https://eslint.org/docs/latest/use/configure/migration-guide for details. An eslintrc configuration file is used because you have the ESLINT_USE_FLAT_CONFIG environment variable set to false. If you want to use an eslint.config.js file, remove the environment variable. If you want to find the location of the eslintrc configuration file, use the --debug flag.",
			"ESLintRCWarning",
		);
	}
}

module.exports = { WarningService };
