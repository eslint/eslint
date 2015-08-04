/**
 * @fileoverview Common utils for AST.
 * @author Gyandeep Singh
 * @copyright 2015 Gyandeep Singh. All rights reserved.
 */

"use strict";

/**
 * Finds a JSDoc comment node in an array of comment nodes.
 * @param {ASTNode[]} comments The array of comment nodes to search.
 * @param {int} line Line number to look around
 * @returns {ASTNode} The node if found, null if not.
 * @private
 */
function findJSDocComment(comments, line) {

    if (comments) {
        for (var i = comments.length - 1; i >= 0; i--) {
            if (comments[i].type === "Block" && comments[i].value.charAt(0) === "*") {

                if (line - comments[i].loc.end.line <= 1) {
                    return comments[i];
                } else {
                    break;
                }
            }
        }
    }

    return null;
}

/**
 * Check to see if its a ES6 export declaration
 * @param {ASTNode} astNode - any node
 * @returns {boolean} whether the given node represents a export declaration
 * @private
 */
function looksLikeExport(astNode) {
    return astNode.type === "ExportDefaultDeclaration" || astNode.type === "ExportNamedDeclaration" ||
        astNode.type === "ExportAllDeclaration" || astNode.type === "ExportSpecifier";
}

/**
 * Checks reference if is non initializer and writable.
 * @param {Reference} reference - A reference to check.
 * @param {int} index - The index of the reference in the references.
 * @param {Reference[]} references - The array that the reference belongs to.
 * @returns {boolean} Success/Failure
 * @private
 */
function isModifyingReference(reference, index, references) {
    var identifier = reference.identifier;

    return (identifier != null &&
        reference.init === false &&
        reference.isWrite() &&
            // Destructuring assignments can have multiple default value,
            // so possibly there are multiple writeable references for the same identifier.
        (index === 0 || references[index - 1].identifier !== identifier)
    );
}

module.exports = {

    /**
     * Gets all comments for the given node.
     * @param {ASTNode} node The AST node to get the comments for.
     * @returns {Object} The list of comments indexed by their position.
     * @public
     */
    getComments: function(node) {

        var leadingComments = node.leadingComments || [],
            trailingComments = node.trailingComments || [];

        /*
         * espree adds a "comments" array on Program nodes rather than
         * leadingComments/trailingComments. Comments are only left in the
         * Program node comments array if there is no executable code.
         */
        if (node.type === "Program") {
            if (node.body.length === 0) {
                leadingComments = node.comments;
            }
        }

        return {
            leading: leadingComments,
            trailing: trailingComments
        };
    },

    /**
     * Retrieves the JSDoc comment for a given node.
     * @param {ASTNode} node The AST node to get the comment for.
     * @returns {ASTNode} The BlockComment node containing the JSDoc for the
     *      given node or null if not found.
     * @public
     */
    getJSDocComment: function(node) {

        var parent = node.parent,
            line = node.loc.start.line;

        switch (node.type) {
            case "FunctionDeclaration":
                if (looksLikeExport(parent)) {
                    return findJSDocComment(parent.leadingComments, line);
                } else {
                    return findJSDocComment(node.leadingComments, line);
                }
                break;

            case "ArrowFunctionExpression":
            case "FunctionExpression":

                if (parent.type !== "CallExpression") {
                    while (parent && !parent.leadingComments && !/Function/.test(parent.type)) {
                        parent = parent.parent;
                    }

                    return parent && (parent.type !== "FunctionDeclaration") ? findJSDocComment(parent.leadingComments, line) : null;
                }

            // falls through

            default:
                return null;
        }
    },

    /**
     * Determines whether two adjacent tokens are have whitespace between them.
     * @param {Object} left - The left token object.
     * @param {Object} right - The right token object.
     * @returns {boolean} Whether or not there is space between the tokens.
     * @public
     */
    isTokenSpaced: function(left, right) {
        return left.range[1] < right.range[0];
    },

    /**
     * Determines whether two adjacent tokens are on the same line.
     * @param {Object} left - The left token object.
     * @param {Object} right - The right token object.
     * @returns {boolean} Whether or not the tokens are on the same line.
     * @public
     */
    isTokenOnSameLine: function(left, right) {
        return left.loc.end.line === right.loc.start.line;
    },

    /**
     * Checks whether or not a node is `null` or `undefined`.
     * @param {ASTNode} node - A node to check.
     * @returns {boolean} Whether or not the node is a `null` or `undefined`.
     * @public
     */
    isNullOrUndefined: function(node) {
        return (
            (node.type === "Literal" && node.value === null) ||
            (node.type === "Identifier" && node.name === "undefined") ||
            (node.type === "UnaryExpression" && node.operator === "void")
        );
    },

    /**
     * Gets references which are non initializer and writable.
     * @param {Reference[]} references - An array of references.
     * @returns {Reference[]} An array of only references which are non initializer and writable.
     * @public
     */
    getModifyingReferences: function(references) {
        return references.filter(isModifyingReference);
    }
};
