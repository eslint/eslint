/**
 * @fileoverview Emits warnings for Linter-related events.
 * Similar to the WarningService, but kept in a separate module that only includes methods used by the Linter
 * to keep the browser bundle size small.
 * @author Francesco Trotta
 */

"use strict";

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * A service that emits warnings for Linter-related events.
 */
class LinterWarningService {
	/**
	 * A function called internally to emit warnings using the Node.js API, if available.
	 * @type {((warning: string, type: string) => void) | undefined}
	 * @protected
	 */
	_emitWarning = globalThis.process?.emitWarning;

	/**
	 * Emits a warning when circular fixes are detected while fixing a file.
	 * @param {string} filename The name of the file being fixed.
	 * @returns {void}
	 */
	emitCircularFixesWarning(filename) {
		this._emitWarning?.(
			`Circular fixes detected while fixing ${filename}. It is likely that you have conflicting rules in your configuration.`,
			"ESLintCircularFixesWarning",
		);
	}

	/**
	 * Emits a warning when an inactive flag is used.
	 * @param {string} flag The name of the flag.
	 * @param {string} inactivityReason The reason why the flag is inactive.
	 * @returns {void}
	 */
	emitInactiveFlagWarning(flag, inactivityReason) {
		this._emitWarning?.(
			`The flag '${flag}' is inactive: ${inactivityReason}`,
			`ESLintInactiveFlag_${flag}`,
		);
	}
}

module.exports = { LinterWarningService };
