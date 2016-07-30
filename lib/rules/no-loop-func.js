/**
 * @fileoverview Rule to flag creation of function inside a loop
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Gets the containing loop node of a specified node.
 *
 * We don't need to check nested functions, so this ignores those.
 * `Scope.through` contains references of nested functions.
 *
 * @param {ASTNode} node - An AST node to get.
 * @returns {ASTNode|null} The containing loop node of the specified node, or
 *      `null`.
 */
function getContainingLoopNode(node) {
    let parent = node.parent;

    while (parent) {
        switch (parent.type) {
            case "WhileStatement":
            case "DoWhileStatement":
                return parent;

            case "ForStatement":

                // `init` is outside of the loop.
                if (parent.init !== node) {
                    return parent;
                }
                break;

            case "ForInStatement":
            case "ForOfStatement":

                // `right` is outside of the loop.
                if (parent.right !== node) {
                    return parent;
                }
                break;

            case "ArrowFunctionExpression":
            case "FunctionExpression":
            case "FunctionDeclaration":

                // We don't need to check nested functions.
                return null;

            default:
                break;
        }

        node = parent;
        parent = node.parent;
    }

    return null;
}

/**
 * Gets the containing loop node of a given node.
 * If the loop was nested, this returns the most outer loop.
 *
 * @param {ASTNode} node - A node to get. This is a loop node.
 * @param {ASTNode|null} excludedNode - A node that the result node should not
 *      include.
 * @returns {ASTNode} The most outer loop node.
 */
function getTopLoopNode(node, excludedNode) {
    let retv = node;
    let border = excludedNode ? excludedNode.range[1] : 0;

    while (node && node.range[0] >= border) {
        retv = node;
        node = getContainingLoopNode(node);
    }

    return retv;
}

/**
 * Checks whether a given reference which refers to an upper scope's variable is
 * safe or not.
 *
 * @param {ASTNode} funcNode - A target function node.
 * @param {ASTNode} loopNode - A containing loop node.
 * @param {escope.Reference} reference - A reference to check.
 * @returns {boolean} `true` if the reference is safe or not.
 */
function isSafe(funcNode, loopNode, reference) {
    let variable = reference.resolved;
    let definition = variable && variable.defs[0];
    let declaration = definition && definition.parent;
    let kind = (declaration && declaration.type === "VariableDeclaration")
        ? declaration.kind
        : "";

    // Variables which are declared by `const` is safe.
    if (kind === "const") {
        return true;
    }

    // Variables which are declared by `let` in the loop is safe.
    // It's a different instance from the next loop step's.
    if (kind === "let" &&
        declaration.range[0] > loopNode.range[0] &&
        declaration.range[1] < loopNode.range[1]
    ) {
        return true;
    }

    // WriteReferences which exist after this border are unsafe because those
    // can modify the variable.
    let border = getTopLoopNode(
        loopNode,
        (kind === "let") ? declaration : null
    ).range[0];

    /**
     * Checks whether a given reference is safe or not.
     * The reference is every reference of the upper scope's variable we are
     * looking now.
     *
     * It's safeafe if the reference matches one of the following condition.
     * - is readonly.
     * - doesn't exist inside a local function and after the border.
     *
     * @param {escope.Reference} upperRef - A reference to check.
     * @returns {boolean} `true` if the reference is safe.
     */
    function isSafeReference(upperRef) {
        let id = upperRef.identifier;

        return (
            !upperRef.isWrite() ||
            variable.scope.variableScope === upperRef.from.variableScope &&
            id.range[0] < border
        );
    }

    return Boolean(variable) && variable.references.every(isSafeReference);
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow `function` declarations and expressions inside loop statements",
            category: "Best Practices",
            recommended: false
        },

        schema: []
    },

    create: function(context) {

        /**
         * Reports functions which match the following condition:
         *
         * - has a loop node in ancestors.
         * - has any references which refers to an unsafe variable.
         *
         * @param {ASTNode} node The AST node to check.
         * @returns {boolean} Whether or not the node is within a loop.
         */
        function checkForLoops(node) {
            let loopNode = getContainingLoopNode(node);

            if (!loopNode) {
                return;
            }

            let references = context.getScope().through;

            if (references.length > 0 &&
                !references.every(isSafe.bind(null, node, loopNode))
            ) {
                context.report(node, "Don't make functions within a loop.");
            }
        }

        return {
            ArrowFunctionExpression: checkForLoops,
            FunctionExpression: checkForLoops,
            FunctionDeclaration: checkForLoops
        };
    }
};
