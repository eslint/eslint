/**
 * @fileoverview A modified version of the `multiline-comment-style` rule that ignores banner comments.
 * @author Teddy Katz
 */

"use strict";

const ruleComposer = require("eslint-rule-composer");
const multilineCommentStyle = require("../../lib/rules/multiline-comment-style");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

// The `no-invalid-meta` internal rule has a false positive here.
// eslint-disable-next-line internal-rules/no-invalid-meta
module.exports = ruleComposer.filterReports(
    multilineCommentStyle,
    (problem, metadata) => {
        const problemIndex = metadata.sourceCode.getIndexFromLoc(problem.loc.start);
        const reportedToken = metadata.sourceCode.getTokenByRangeStart(problemIndex, { includeComments: true });

        return !(reportedToken && reportedToken.type === "Line" && /^-{2,}$/u.test(reportedToken.value));
    }
);
