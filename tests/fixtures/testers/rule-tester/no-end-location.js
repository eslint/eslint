/**
 * @fileoverview Rule to report an a location without end line and column
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
	meta: {
		type: "problem",
		schema: [],
		messages: {
			evalSucks: "eval sucks.",
		},
	},
	create(context) {
		return {
			CallExpression: function (node) {
				if (node.callee.name === "eval") {
					const loc = {
						column: 0,
						line: 1,
					}
					context.report({ node, loc, messageId: "evalSucks" });
				}
			},
		};
	},
};
