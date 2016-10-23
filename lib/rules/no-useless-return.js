/**
 * @fileoverview Disallow redundant return statements
 * @author Teddy Katz
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow redundant return statements",
            category: "Best Practices",
            recommended: false
        },
        fixable: "code",
        schema: []
    },

    create(context) {

        const returnPaths = new Map();
        let currentPathSegment;

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {

            // FIXME: This implementation currently does not work.
            onCodePathSegmentStart(pathSegment) {
                currentPathSegment = pathSegment;
            },
            ReturnStatement(node) {
                if (!node.argument) {
                    returnPaths.set(currentPathSegment, node);
                }
            },
            onCodePathEnd(path) {
                path.returnedSegments.forEach(segment => {
                    if (returnPaths.has(segment)) {
                        const returnStatement = returnPaths.get(segment);

                        context.report({
                            node: returnStatement,
                            message: "Unnecessary return statement.",
                            fix: fixer => fixer.remove(returnStatement)
                        });
                    }
                });
            }
        };
    }
};
