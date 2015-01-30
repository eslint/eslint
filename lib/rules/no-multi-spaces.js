/**
 * @fileoverview Disallow use of multiple spaces.
 * @author Nicholas C. Zakas
 * @copyright 2015 Nicholas C. Zakas. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    // the index of the last comment that was checked
    var lastCommentIndex = 0;

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

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        "Program": function() {

            var source = context.getSource(),
                allComments = context.getAllComments(),
                pattern = /[^\n\r\u2028\u2029 ] {2,}/g,  // note: repeating space
                token;

            while (pattern.test(source)) {

                // do not flag anything inside of comments
                if (!isIndexInComment(pattern.lastIndex, allComments)) {

                    token = context.getTokenByRangeStart(pattern.lastIndex);

                    if (token) {
                        context.report(token, token.loc.start,
                            "Multiple spaces found before '{{value}}'.",
                            { value: token.value });
                    }

                }
            }
        }
    };

};
