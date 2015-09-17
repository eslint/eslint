/**
 * @fileoverview Comma spacing - validates spacing before and after comma
 * @author Vignesh Anand aka vegetableman.
 * @copyright 2014 Vignesh Anand. All rights reserved.
 */
"use strict";

var astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var sourceCode = context.getSourceCode();

    var options = {
        before: context.options[0] ? !!context.options[0].before : false,
        after: context.options[0] ? !!context.options[0].after : true
    };

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    // the index of the last comment that was checked
    var lastCommentIndex = 0;
    var allComments;

    // list of comma tokens to ignore for the check of leading whitespace
    var commaTokensToIgnore = [];

    /**
     * Determines if a given token is a comma operator.
     * @param {ASTNode} token The token to check.
     * @returns {boolean} True if the token is a comma, false if not.
     * @private
     */
    function isComma(token) {
        return !!token && (token.type === "Punctuator") && (token.value === ",");
    }

    /**
     * Reports a spacing error with an appropriate message.
     * @param {ASTNode} node The binary expression node to report.
     * @param {string} dir Is the error "before" or "after" the comma?
     * @returns {void}
     * @private
     */
    function report(node, dir) {
        context.report(node, options[dir] ?
            "A space is required " + dir + " ','." :
            "There should be no space " + dir + " ','.");
    }

    /**
     * Validates the spacing around a comma token.
     * @param {Object} tokens - The tokens to be validated.
     * @param {Token} tokens.comma The token representing the comma.
     * @param {Token} [tokens.left] The last token before the comma.
     * @param {Token} [tokens.right] The first token after the comma.
     * @param {Token|ASTNode} reportItem The item to use when reporting an error.
     * @returns {void}
     * @private
     */
    function validateCommaItemSpacing(tokens, reportItem) {
        if (tokens.left && astUtils.isTokenOnSameLine(tokens.left, tokens.comma) &&
                (options.before !== sourceCode.isSpaceBetweenTokens(tokens.left, tokens.comma))
        ) {
            report(reportItem, "before");
        }
        if (tokens.right && astUtils.isTokenOnSameLine(tokens.comma, tokens.right) &&
                (options.after !== sourceCode.isSpaceBetweenTokens(tokens.comma, tokens.right))
        ) {
            report(reportItem, "after");
        }
    }

    /**
     * Determines if a given source index is in a comment or not by checking
     * the index against the comment range. Since the check goes straight
     * through the file, once an index is passed a certain comment, we can
     * go to the next comment to check that.
     * @param {int} index The source index to check.
     * @param {ASTNode[]} comments An array of comment nodes.
     * @returns {boolean} True if the index is within a comment, false if not.
     * @private
     */
    function isIndexInComment(index, comments) {

        var comment;

        while (lastCommentIndex < comments.length) {

            comment = comments[lastCommentIndex];

            if (comment.range[0] <= index && index < comment.range[1]) {
                return true;
            } else if (index > comment.range[1]) {
                lastCommentIndex++;
            } else {
                break;
            }

        }

        return false;
    }

    /**
     * Adds null elements of the given ArrayExpression or ArrayPattern node to the ignore list.
     * @param {ASTNode} node An ArrayExpression or ArrayPattern node.
     * @returns {void}
     */
    function addNullElementsToIgnoreList(node) {
        var previousToken = context.getFirstToken(node);

        node.elements.forEach(function(element) {
            var token;

            if (element === null) {
                token = context.getTokenAfter(previousToken);

                if (isComma(token)) {
                    commaTokensToIgnore.push(token);
                }
            } else {
                token = context.getTokenAfter(element);
            }

            previousToken = token;
        });
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        "Program:exit": function() {

            var source = context.getSource(),
                pattern = /,/g,
                commaToken,
                previousToken,
                nextToken;

            allComments = context.getAllComments();
            while (pattern.test(source)) {

                // do not flag anything inside of comments
                if (!isIndexInComment(pattern.lastIndex, allComments)) {
                    commaToken = context.getTokenByRangeStart(pattern.lastIndex - 1);

                    if (commaToken && commaToken.type !== "JSXText") {
                        previousToken = context.getTokenBefore(commaToken);
                        nextToken = context.getTokenAfter(commaToken);
                        validateCommaItemSpacing({
                            comma: commaToken,
                            left: isComma(previousToken) || commaTokensToIgnore.indexOf(commaToken) > -1 ? null : previousToken,
                            right: isComma(nextToken) ? null : nextToken
                        }, commaToken);
                    }
                }
            }
        },
        "ArrayExpression": addNullElementsToIgnoreList,
        "ArrayPattern": addNullElementsToIgnoreList

    };

};

module.exports.schema = [
    {
        "type": "object",
        "properties": {
            "before": {
                "type": "boolean"
            },
            "after": {
                "type": "boolean"
            }
        },
        "additionalProperties": false
    }
];
