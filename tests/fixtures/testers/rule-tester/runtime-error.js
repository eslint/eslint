/**
 * @fileoverview Rule fixture that throws a runtime error
 */
"use strict";

class CustomRuleError extends Error {
	constructor(message) {
		super(message);
		this.name = "CustomRuleError";
	}
}

module.exports = {
	meta: {
		type: "problem",
	},
	create() {
		return {
			Program() {
				throw new CustomRuleError(
					"Custom rule runtime error for testing.",
				);
			},
		};
	},
};

module.exports.CustomRuleError = CustomRuleError;
