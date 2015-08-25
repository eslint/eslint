/**
 * @fileoverview Common utils for AST.
 * @author Gyandeep Singh
 * @copyright 2015 Gyandeep Singh. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = {

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
