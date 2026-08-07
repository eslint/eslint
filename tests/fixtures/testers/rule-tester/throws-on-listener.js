/**
 * @fileoverview Test rule that throws from a listener during AST traversal (for fatal test cases).
 */

"use strict";

module.exports = {
	meta: {
		type: "problem",
		schema: [],
	},
	create() {
		return {
			Program() {
				const err = new Error("Listener crash for testing");

				err.name = "ListenerError";
				throw err;
			},
		};
	},
};
