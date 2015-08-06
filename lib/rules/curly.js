/**
 * @fileoverview Rule to flag statements without curly braces
 * @author Nicholas C. Zakas
 * @copyright 2015 Ivan Nikulin. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var multiOnly = (context.options[0] === "multi");
    var multiLine = (context.options[0] === "multi-line");
    var multiOrNest = (context.options[0] === "multi-or-nest");

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    /**
     * Determines if a given node is a one-liner that's on the same line as it's preceding code.
     * @param {ASTNode} node The node to check.
     * @returns {boolean} True if the node is a one-liner that's on the same line as it's preceding code.
     * @private
     */
    function isCollapsedOneLiner(node) {
        var before = context.getTokenBefore(node),
            last = context.getLastToken(node);
        return before.loc.start.line === last.loc.end.line;
    }

    /**
     * Determines if a given node is a one-liner.
     * @param {ASTNode} node The node to check.
     * @returns {boolean} True if the node is a one-liner.
     * @private
     */
    function isOneLiner(node) {
        var first = context.getFirstToken(node),
            last = context.getLastToken(node);

        return first.loc.start.line === last.loc.end.line;
    }

    /**
     * Reports "Expected { after ..." error
     * @param {ASTNode} node The node to report.
     * @param {string} name The name to report.
     * @param {string} suffix Additional string to add to the end of a report.
     * @returns {void}
     * @private
     */
    function reportExpectedBraceError(node, name, suffix) {
        context.report(node, "Expected { after '{{name}}'{{suffix}}.",
            {
                name: name,
                suffix: (suffix ? " " + suffix : "")
            });
    }

    /**
     * Reports "Unnecessary { after ..." error
     * @param {ASTNode} node The node to report.
     * @param {string} name The name to report.
     * @param {string} suffix Additional string to add to the end of a report.
     * @returns {void}
     * @private
     */
    function reportUnnecessaryBraceError(node, name, suffix) {
        context.report(node, "Unnecessary { after '{{name}}'{{suffix}}.",
            {
                name: name,
                suffix: (suffix ? " " + suffix : "")
            }
        );
    }

    /**
     * Checks the body of a node to see if it's a block statement. Depending on
     * the rule options, reports the appropriate problems.
     * @param {ASTNode} node The node to report if there's a problem.
     * @param {ASTNode} body The body node to check for blocks.
     * @param {string} name The name to report if there's a problem.
     * @param {string} suffix Additional string to add to the end of a report.
     * @returns {void}
     */
    function checkBody(node, body, name, suffix) {
        var hasBlock = (body.type === "BlockStatement");

        if (multiOnly) {
            if (hasBlock && body.body.length === 1) {
                reportUnnecessaryBraceError(node, name, suffix);
            }
        } else if (multiLine) {
            if (!hasBlock && !isCollapsedOneLiner(body)) {
                reportExpectedBraceError(node, name, suffix);
            }
        } else if (multiOrNest) {
            if (hasBlock && body.body.length === 1 && isOneLiner(body.body[0])) {
                reportUnnecessaryBraceError(node, name, suffix);
            } else if (!hasBlock && !isOneLiner(body)) {
                reportExpectedBraceError(node, name, suffix);
            }
        } else {
            if (!hasBlock) {
                reportExpectedBraceError(node, name, suffix);
            }
        }
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {

        "IfStatement": function(node) {

            checkBody(node, node.consequent, "if", "condition");

            if (node.alternate && node.alternate.type !== "IfStatement") {
                checkBody(node, node.alternate, "else");
            }

        },

        "WhileStatement": function(node) {
            checkBody(node, node.body, "while", "condition");
        },

        "DoWhileStatement": function(node) {
            checkBody(node, node.body, "do");
        },

        "ForStatement": function(node) {
            checkBody(node, node.body, "for", "condition");
        }
    };

};

module.exports.schema = [
    {
        "enum": ["all", "multi", "multi-line", "multi-or-nest"]
    }
];
