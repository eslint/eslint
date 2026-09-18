/**
 * @fileoverview Test rule that throws when option "throw" is passed (for fatal test cases).
 */

"use strict";

module.exports = {
	meta: {
		type: "problem",
		schema: [
			{
				enum: ["strict", "loose", "throw"],
			},
		],
	},
	create(context) {
		const option = context.options[0];

		if (option === "throw") {
			const err = new Error("Intentional throw for testing");
			err.name = "CustomRuleError";
			throw err;
		}

		return {
			Program() {},
		};
	},
};
