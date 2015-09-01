/**
 * @fileoverview Rule to check for jsdoc presence.
 * @author Gyandeep Singh
 * @copyright 2015 Gyandeep Singh. All rights reserved.
 */
"use strict";

module.exports = function(context) {
    var source = context.getSourceCode();

    /**
     * Report the error message
     * @param {ASTNode} node node to report
     * @returns {void}
     */
    function report(node) {
        context.report(node, "Missing JSDoc comment.");
    }

    /**
     * Check if the jsdoc comment is present or not.
     * @param {ASTNode} node node to examine
     * @returns {void}
     */
    function checkJsDoc(node) {
        var jsdocComment = source.getJSDocComment(node);

        if (!jsdocComment) {
            report(node);
        }
    }

    return {
        "FunctionDeclaration": checkJsDoc
    };
};

module.exports.schema = [];
