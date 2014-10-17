/**
 * @fileoverview Comma spacing - validates spacing before and after comma
 * @author Vignesh Anand aka vegetableman.
 * @copyright 2014 Vignesh Anand. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var options = {
        before: context.options[0] ? !!context.options[0].before : false,
        after: context.options[0] ? !!context.options[0].after : true
    };

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    /**
     * Determines whether two adjacent tokens have whitespace between them.
     * @param {Object} left - The left token object.
     * @param {Object} right - The right token object.
     * @returns {boolean} Whether or not there is space between the tokens.
     */
    function isSpaced(left, right) {
        return left.range[1] < right.range[0];
    }

    /**
     * Run report.
     * @param {ASTNode} node The binary expression node to check.
     * @param {string} msg The error msg to show.
     * @private
     * @returns {void}
     */
    function report(node, msg) {
        context.report(node, msg);
    }

    /**
     * Show space required message.
     * @param {string} dir The location of spacing.
     * @private
     * @returns {string} The spacing error msg.
     */
    function getSpaceReqMsg(dir) {
        return "A space is required " + dir + " ','.";
    }

    /**
     * Show no space message.
     * @param {string} dir The location of spacing
     * @private
     * @returns {string} The spacing error msg.
     */
    function getNoSpaceMsg(dir) {
        return "There should be no space " + dir + " ','.";
    }

    /**
     * Validates the spacing before and after commas.
     * @param {ASTNode} node The binary expression node to check.
     * @param {string} property The property of the node.
     * @private
     * @returns {void}
     */
    function validateCommaSpacing(node, property) {
        var items = node[property];

        if (items && items.length > 1) {
            items.forEach(function(item, index) {
                var tokenBefore = context.getTokenBefore(item),
                    itemBefore = items[index - 1],
                    tokenEndLine;

                if (tokenBefore && tokenBefore.value === ",") {
                    tokenEndLine = tokenBefore.loc.end.line;

                    // single line
                    if (tokenEndLine === itemBefore.loc.end.line &&
                        tokenEndLine === item.loc.start.line) {
                        if (options.before && options.after) {
                            if (!isSpaced(itemBefore, tokenBefore)) {
                                report(item, getSpaceReqMsg("before"));
                            }
                            if (!isSpaced(tokenBefore, item)) {
                                report(item, getSpaceReqMsg("after"));
                            }
                        } else if (options.before) {
                            if (!isSpaced(itemBefore, tokenBefore)) {
                                report(item, getSpaceReqMsg("before"));
                            }
                            if (isSpaced(tokenBefore, item)) {
                                report(item, getNoSpaceMsg("after"));
                            }
                        } else if (options.after) {
                            if (!isSpaced(tokenBefore, item)) {
                                report(item, getSpaceReqMsg("after"));
                            }
                            if (isSpaced(itemBefore, tokenBefore)) {
                                report(item, getNoSpaceMsg("before"));
                            }
                        } else {
                            if (isSpaced(itemBefore, tokenBefore)) {
                                report(item, getNoSpaceMsg("before"));
                            }
                            if (isSpaced(tokenBefore, item)) {
                                report(item, getNoSpaceMsg("after"));
                            }
                        }
                    }
                }
            });
        }
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        "VariableDeclaration": function(node) {
            validateCommaSpacing(node, "declarations");
        },
        "ObjectExpression": function(node) {
            validateCommaSpacing(node, "properties");
        },
        "ArrayExpression": function(node) {
            validateCommaSpacing(node, "elements");
        },
        "SequenceExpression": function(node) {
            validateCommaSpacing(node, "expressions");
        },
        "FunctionExpression": function(node) {
            validateCommaSpacing(node, "params");
        },
        "FunctionDeclaration": function(node) {
            validateCommaSpacing(node, "params");
        }
    };

};
