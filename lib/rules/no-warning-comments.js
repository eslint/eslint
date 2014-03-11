/**
 * @fileoverview Rule that warns about used warning comments
 * @author Alexander Schmidt <https://github.com/lxanders>
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {
    "use strict";

    var configuration = context.options[0] || {},
        warningTerms = configuration.terms || ["todo", "fixme", "xxx"],
        location = configuration.location || "start";

    /**
     * Prepares a specified comment for being checked.
     * @param {String} comment The comment to prepare.
     * @returns {String} The specified comment prepared for being checked.
     */
    function prepareCommentForChecking(comment) {
        var commentToCheck;

        commentToCheck = comment.toLowerCase();
        commentToCheck = commentToCheck.trim();

        return commentToCheck;
    }

    /**
     * Checks if the specified comment starts with a specified term.
     * @param {String} commentToCheck The comment to check.
     * @param {String} lowerCaseTerm The term to search for.
     * @returns {Boolean} True if the comment started with the specified term, else false.
     */
    function commentStartsWithTerm(commentToCheck, lowerCaseTerm) {
        return commentToCheck.indexOf(lowerCaseTerm) === 0;
    }

    /**
     * Checks if the specified comment contains a specified term at any location.
     * @param {String} commentToCheck The comment to check.
     * @param {String} lowerCaseTerm The term to search for.
     * @returns {Boolean} True if the term was contained in the comment, else false.
     */
    function commentContainsTerm(commentToCheck, lowerCaseTerm) {
        return commentToCheck.indexOf(lowerCaseTerm) !== -1;
    }


    /**
     * Checks the specified comment for matches of the configured warning terms and returns the matches.
     * @param {String} comment The comment which is checked.
     * @returns {Array} All matched warning terms for this comment.
     */
    function commentContainsWarningTerm(comment) {
        var matches = [];

        warningTerms.forEach(function (term) {
            var lowerCaseTerm = term.toLowerCase(),
                commentToCheck = prepareCommentForChecking(comment);

            if (location === "start") {
                if (commentStartsWithTerm(commentToCheck, lowerCaseTerm)) {
                    matches.push(term);
                }
            } else if (location === "anywhere") {
                if (commentContainsTerm(commentToCheck, lowerCaseTerm)) {
                    matches.push(term);
                }
            }
        });

        return matches;
    }

    /**
     * Checks the specified node for matching warning comments and reports them.
     * @param {ASTNode} node The AST node being checked.
     * @returns {void} undefined.
     */
    function checkComment(node) {
        var matches = commentContainsWarningTerm(node.value);

        matches.forEach(function (matchedTerm) {
            context.report(node, "Unexpected " + matchedTerm + " comment.");
        });
    }

    return {
        "BlockComment": checkComment,
        "LineComment": checkComment
    };
};
