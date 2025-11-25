/**
 * @fileoverview A modified version of the `multiline-comment-style` rule that ignores banner comments.
 * @author Teddy Katz
 */

"use strict";

const ruleExtender = require("eslint-rule-extender");
const multilineCommentStyle = require("../../lib/rules/multiline-comment-style");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

// The `no-invalid-meta` internal rule has a false positive here.
// eslint-disable-next-line internal-rules/no-invalid-meta -- Using `ruleExtender`
module.exports = ruleExtender(multilineCommentStyle, {
	reportOverrides(meta, context) {
		const sourceCode = context.sourceCode;
		const problemIndex = sourceCode.getIndexFromLoc(meta.loc.start);
		const reportedToken = sourceCode.getTokenByRangeStart(problemIndex, {
			includeComments: true,
		});

		if (
			reportedToken &&
			reportedToken.type === "Line" &&
			/^-{2,}$/u.test(reportedToken.value)
		) {
			return false; // filter out banner comments
		}

		return true;
	},
});
