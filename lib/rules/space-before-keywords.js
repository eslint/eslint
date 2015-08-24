/**
 * @fileoverview Require or disallow spaces before keywords
 * @author Marko Raatikka
 * @copyright 2015 Marko Raatikka. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

var astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var ERROR_MSG_SPACE_EXPECTED = "Missing space before keyword \"{{keyword}}\".";
var ERROR_MSG_NO_SPACE_EXPECTED = "Unexpected space before keyword \"{{keyword}}\".";

module.exports = function(context) {

    var SPACE_REQUIRED = context.options[0] !== "never";

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    /**
     * Check if a token meets the criteria
     *
     * @param   {ASTNode} node    The node to check
     * @param   {Object}  left    The left-hand side token of the node
     * @param   {Object}  right   The right-hand side token of the node
     * @param   {Object}  options See check()
     * @returns {void}
     */
    function checkTokens(node, left, right, options) {

        if (!left) {
            return;
        }

        if (left.type === "Keyword") {
            return;
        }

        if (!SPACE_REQUIRED && typeof options.requireSpace === "undefined") {
            return;
        }

        options = options || {};
        options.allowedPrecedingChars = options.allowedPrecedingChars || [];
        options.requireSpace = typeof options.requireSpace === "undefined" ? SPACE_REQUIRED : options.requireSpace;

        var hasSpace = astUtils.isTokenSpaced(left, right);
        var spaceOk = hasSpace === options.requireSpace;

        if (spaceOk) {
            return;
        }

        if (!astUtils.isTokenOnSameLine(left, right)) {
            if (!options.requireSpace) {
                context.report(node, ERROR_MSG_NO_SPACE_EXPECTED, { keyword: right.value });
            }
            return;
        }

        if (!options.requireSpace) {
            context.report(node, ERROR_MSG_NO_SPACE_EXPECTED, { keyword: right.value });
            return;
        }

        if (options.allowedPrecedingChars.indexOf(left.value) !== -1) {
            return;
        }

        context.report(node, ERROR_MSG_SPACE_EXPECTED, { keyword: right.value });

    }

    /**
     * Get right and left tokens of a node and check to see if they meet the given criteria
     *
     * @param   {ASTNode}  node                          The node to check
     * @param   {Object}   options                       Options to validate the node against
     * @param   {Array}    options.allowedPrecedingChars Characters that can precede the right token
     * @param   {Boolean}  options.requireSpace          Whether or not the right token needs to be
     *                                                   preceded by a space
     * @returns {void}
     */
    function check(node, options) {

        options = options || {};

        var left = context.getTokenBefore(node);
        var right = context.getFirstToken(node);

        checkTokens(node, left, right, options);

    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {

        "IfStatement": function(node) {
            // if
            check(node);
            // else
            if (node.alternate) {
                check(context.getTokenBefore(node.alternate), { requireSpace: SPACE_REQUIRED });
            }
        },
        "ForStatement": check,
        "ForInStatement": check,
        "WhileStatement": check,
        "DoWhileStatement": function(node) {
            var whileNode = context.getTokenAfter(node.body);
            // do
            check(node);
            // while
            check(whileNode, { requireSpace: SPACE_REQUIRED });
        },
        "SwitchStatement": function(node) {
            // switch
            check(node);
            // case/default
            node.cases.forEach(function(caseNode) {
                check(caseNode);
            });
        },
        ThrowStatement: check,
        "TryStatement": function(node) {
            // try
            check(node);
            // finally
            if (node.finalizer) {
                check(context.getTokenBefore(node.finalizer), { requireSpace: SPACE_REQUIRED });
            }
        },
        "CatchClause": function(node) {
            check(node, { requireSpace: SPACE_REQUIRED });
        },
        "WithStatement": check,
        "VariableDeclaration": function(node) {
            check(node, { allowedPrecedingChars: [ "(" ] });
        },
        "ReturnStatement": check,
        "BreakStatement": check,
        "LabeledStatement": check,
        "ContinueStatement": check,
        "FunctionDeclaration": check,
        "FunctionExpression": function(node) {

            var left = context.getTokenBefore(node);
            var right = null;

            if (left.type === "Identifier") {
                right = left;
                left = context.getTokenBefore(node, 1);
            } else {
                right = context.getFirstToken(node);
            }

            checkTokens(node, left, right, { allowedPrecedingChars: [ "(" ] });
        },
        "YieldExpression": function(node) {
            check(node, { allowedPrecedingChars: [ "(" ] });
        },
        "ForOfStatement": check,
        "ClassBody": function(node) {
            check(context.getTokenBefore(node, 1));
        },
        "Super": check

    };

};

module.exports.schema = [
    {
        "enum": ["always", "never"]
    }
];
