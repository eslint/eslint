/**
 * @fileoverview Rule to flag comparisons to the value NaN
 * @author James Allardice
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "problem",

        docs: {
            description: "require calls to `isNaN()` when checking for `NaN`",
            category: "Possible Errors",
            recommended: true,
            url: "https://eslint.org/docs/rules/use-isnan"
        },

        schema: [
            {
                type: "object",
                properties: {
                    enforceForSwitchCase: {
                        type: "boolean",
                        default: false
                    }
                },
                additionalProperties: false
            }
        ],

        messages: {
            comparisonWithNaN: "Use the isNaN function to compare with NaN.",
            caseNaN: "'case NaN' can never match. Use Number.isNaN before the switch."
        }
    },

    create(context) {

        const enforceForSwitchCase = context.options[0] && context.options[0].enforceForSwitchCase;

        return {
            BinaryExpression(node) {
                if (/^(?:[<>]|[!=]=)=?$/u.test(node.operator) && (node.left.name === "NaN" || node.right.name === "NaN")) {
                    context.report({ node, messageId: "comparisonWithNaN" });
                }
            },
            SwitchCase(node) {
                if (enforceForSwitchCase) {
                    const test = node.test;

                    if (test && test.type === "Identifier" && test.name === "NaN") {
                        context.report({ node, messageId: "caseNaN" });
                    }
                }
            }
        };

    }
};
