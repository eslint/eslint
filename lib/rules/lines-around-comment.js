/**
 * @fileoverview Rule to (dis)allow empty lines around comments
 * @author Hraban Luyat
 * @copyright 2014 Hraban Luyat. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    /**
     * List of line object for each line in the source code:
     *
     * {
     *     src: <string containing source code for this line>,
     *     isLineComment: <optional: true iff this is line comment>,
     *     isBlockComment: <optional: true iff block comment>
     * }
     *
     * The optional attributes are true if specified, otherwise they are just
     * not defined on this object.
     */
    var lines = {};

    /**
     * Get everything on the same line as this node, preceding it
     *
     * @param {Node} node  node up to which you want the source
     * @returns {string}   source code line leading up to node
     */
    function getLineUntil(node) {
        var src = lines[node.loc.start.line - 1].src;
        return src.slice(0, node.loc.start.column);
    }

    /**
     * Get everything on the same line as this node, following it
     *
     * @param {Node} node  node after which you want the source
     * @returns {string}   source code from this node to end of line
     */
    function getLineFrom(node) {
        var src = lines[node.loc.end.line - 1].src;
        return src.slice(node.loc.end.column);
    }

    /**
     * False iff a string contains a non-whitespace character.
     *
     * @param {string} text Text to scan
     * @returns {boolean}   False iff txt contains a non-whitespace character
     */
    function isEmpty(text) {
        return text.trim() === "";
    }

    /**
     * True iff a string contains a non-whitespace character.
     *
     * @param {string} text Text to scan
     * @returns {boolean}   True iff txt contains a non-whitespace character
     */
    function isNotEmpty(text) {
        return !isEmpty(text);
    }

    return {

        "LineComment": function (node) {

            // Ignore end-of-line comments
            var before = getLineUntil(node);
            if (before.trim() !== "") {
                return;
            }

            // Esprima line indexes are 1-offset
            lines[node.loc.start.line - 1].isLineComment = true;
        },

        "BlockComment": function (node) {

            // Ignore inline comments
            var rest = getLineUntil(node) + getLineFrom(node);
            if (rest.trim() !== "") {
                return;
            }

            // Correct for 1-offset
            var startIndex = node.loc.start.line - 1;
            var endIndex = node.loc.end.line - 1;
            for (var i = startIndex; i <= endIndex; i++) {
                lines[i].isBlockComment = true;
            }
        },

        "Program": function () {
            lines = context.getSourceLines().map(function (src) {
                return {src: src};
            });
        },

        "Program:exit": function (node) {

            // Default behavior for all rules is to accept
            var opts = context.options[0] || {};

            // Pre-index all lines surrounding comments
            var beforeLineIndexes = [];
            var beforeBlockIndexes = [];
            var afterLineIndexes = [];
            var afterBlockIndexes = [];

            for (var ia = 0, ib = 1; ib < lines.length; ia++, ib++) {
                var lineA = lines[ia];
                var lineB = lines[ib];

                // Check if line A is a line preceding a comment
                if (!lineA.isLineComment && lineB.isLineComment) {
                    beforeLineIndexes.push(ia);
                } else if (!lineA.isBlockComment && lineB.isBlockComment) {
                    beforeBlockIndexes.push(ia);
                }

                // Check if line B is a line following a comment
                else if (lineA.isLineComment && !lineB.isLineComment) {
                    afterLineIndexes.push(ib);
                } else if (lineA.isBlockComment && !lineB.isBlockComment) {
                    afterBlockIndexes.push(ib);
                }
            }

            /**
             * Scan all lines at these indexes for conformance to given rule.
             *
             * If one of the given lines does not adhere to the given rule,
             * generate an error message using the given format string. In that
             * string, "%s" is substituted for the line number that violates the
             * rule.
             *
             * The line numbers in indexes should be at 0 offset (they are
             * indices into an array of lines), but %s will be substituted for
             * human-readable, 1 offset line numbers.
             *
             * @param {number[]} indexes  Line indexes to test for conformance
             * @param {function} rule     Callback to test every line (string) with
             * @param {string} format     Format string for error message
             * @returns {void}
             */
            function forbid(indexes, rule, format) {
                indexes.forEach(function (index) {
                    if (rule(lines[index].src)) {

                        // Human line numbers start at 1
                        context.report(node, format.replace("%s", index + 1));
                    }
                });
            }

            // Single line comments
            switch (opts.beforeLineComment) {

                case true:
                    forbid(beforeLineIndexes, isNotEmpty,
                           "Line comment must be preceded by empty line (line %s)");
                    break;

                case false:
                    forbid(beforeLineIndexes, isEmpty,
                           "Line comment cannot be preceded by empty line (line %s)");
                    break;

                // no default
            }
            switch (opts.afterLineComment) {

                case true:
                    forbid(afterLineIndexes, isNotEmpty,
                           "Line comment must be followed by empty line (line %s)");
                    break;

                case false:
                    forbid(afterLineIndexes, isEmpty,
                           "Line comment cannot be followed by empty line (line %s)");
                    break;

                // no default
            }

            // Block comments
            switch (opts.beforeBlockComment) {

                case true:
                    forbid(beforeBlockIndexes, isNotEmpty,
                           "Block comment must be preceded by empty line (line %s)");
                    break;

                case false:
                    forbid(beforeBlockIndexes, isEmpty,
                           "Block comment cannot be preceded by empty line (line %s)");
                    break;

                // no default
            }
            switch (opts.afterBlockComment) {

                case true:
                    forbid(afterBlockIndexes, isNotEmpty,
                           "Block comment must be followed by empty line (line %s)");
                    break;

                case false:
                    forbid(afterBlockIndexes, isEmpty,
                           "Block comment cannot be followed by empty line (line %s)");
                    break;

                // no default
            }

        }

    };
};
