/**
 * @fileoverview Enforces or disallows inline comments.
 * @author Greg Cochard
 */
"use strict";

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow inline comments after code",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-inline-comments"
        },

        schema: []
    },

    create(context) {
        const sourceCode = context.getSourceCode();

        /**
         * Will check that comments are not on lines starting with or ending with code
         * @param {ASTNode} node The comment node to check
         * @private
         * @returns {void}
         */
        function testCodeAroundComment(node) {

            const startLine = String(sourceCode.lines[node.loc.start.line - 1]),
                endLine = String(sourceCode.lines[node.loc.end.line - 1]),
                preamble = startLine.slice(0, node.loc.start.column).trim(),
                postamble = endLine.slice(node.loc.end.column).trim(),
                isPreambleEmpty = !preamble,
                isPostambleEmpty = !postamble;

            // Nothing on both sides
            if (isPreambleEmpty && isPostambleEmpty) {
                return;
            }

            // JSX Exception
            if (
                (isPreambleEmpty || preamble === "{") &&
                (isPostambleEmpty || postamble === "}")
            ) {
                const enclosingNode = sourceCode.getNodeByRangeIndex(node.range[0]);

                if (enclosingNode && enclosingNode.type === "JSXEmptyExpression") {
                    return;
                }
            }

            // Don't report ESLint directive comments
            if (astUtils.isDirectiveComment(node)) {
                return;
            }

            context.report({ node, message: "Unexpected comment inline with code." });
        }

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {
            Program() {
                const comments = sourceCode.getAllComments();

                comments.filter(token => token.type !== "Shebang").forEach(testCodeAroundComment);
            }
        };
    }
};
