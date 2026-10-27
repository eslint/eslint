/**
 * @fileoverview Shared rule filters for ESLint.
 */

"use strict";

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Predicate function for whether or not to run a rule in quiet mode.
 * If a rule is set to warning, do not run it.
 * @param {{ ruleId: string; severity: number; }} rule The rule id and severity.
 * @returns {boolean} `true` if the lint rule should run, `false` otherwise.
 */
function quietRuleFilter(rule) {
	return rule.severity === 2;
}

//-----------------------------------------------------------------------------
// Public Interface
//-----------------------------------------------------------------------------

module.exports = { quietRuleFilter };
