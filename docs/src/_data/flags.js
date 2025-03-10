/**
 * @fileoverview Convenience helper for feature flags.
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Determines whether the flag is used for test purposes only.
 * @param {string} name The flag name to check.
 * @returns {boolean} `true` if the flag is used for test purposes only.
 */
function isTestOnlyFlag(name) {
	return name.startsWith("test_only");
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

module.exports = function () {
	const {
		activeFlags,
		inactiveFlags,
		getInactivityReasonMessage,
	} = require("../../../lib/shared/flags");

	return {
		active: Object.fromEntries(
			[...activeFlags].filter(([name]) => !isTestOnlyFlag(name)),
		),
		inactive: Object.fromEntries(
			[...inactiveFlags]
				.filter(([name]) => !isTestOnlyFlag(name))
				.map(([name, inactiveFlagData]) => [
					name,
					{
						...inactiveFlagData,
						inactivityReason:
							getInactivityReasonMessage(inactiveFlagData),
					},
				]),
		),
	};
};
