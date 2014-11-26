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
     * @param {string} txt  Text to scan
     * @returns {boolean}   False iff txt contains a non-whitespace character
     */
    function isEmpty(txt) {
        return txt.trim() === "";
    }

    /**
     * True iff a string contains a non-whitespace character.
     *
     * @param {string} txt  Text to scan
     * @returns {boolean}   True iff txt contains a non-whitespace character
     */
    function isNotEmpty(txt) {
        return !isEmpty(txt);
    }

    return {
        "LineComment": function (node) {
            // Ignore end-of-line comments
            var before = getLineUntil(node);
            if (before.trim() !== "") {
                return;
            }
            // Esprina line indexes are 1-offset
            lines[node.loc.start.line - 1].isLineComment = true;
        },

        "BlockComment": function (node) {
            // Ignore inline comments
            var rest = getLineUntil(node) + getLineFrom(node);
            if (rest.trim() !== "") {
                return;
            }
            // Correct for 1-offset
            var startidx = node.loc.start.line - 1;
            var endidx = node.loc.end.line - 1;
            for (var i = startidx; i <= endidx; i++) {
                lines[i].isBlockComment = true;
            }
        },

        "Program": function () {
            lines = context.getSourceLines().map(function (src) {
                return {src: src};
            });
        },

        "Program:exit": function (node) {
            // Default behaviour for all rules is to accept
            var opts = context.options[0] || {};
            // Pre-index all lines following comments
            var afterLineIdxs = [];
            var afterBlockIdxs = [];
            for (var i = 1; i < lines.length; i++) {
                var line = lines[i];
                var prevLine = lines[i - 1];
                if (!line.isLineComment && prevLine.isLineComment) {
                    afterLineIdxs.push(i);
                } else if (!line.isBlockComment && prevLine.isBlockComment) {
                    afterBlockIdxs.push(i);
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
             * The line numbers in idxs should be at 0 offset (they are indices
             * into an array of lines), but %s will be substituted for
             * human-readable, 1 offset line numbers.
             *
             * @param {number[]} idxs  Line indexes to test for conformance
             * @param {function} rule  Callback to test every line (string) with
             * @param {string} fmt     Format string for error message
             * @returns {void}
             */
            function forbid(idxs, rule, fmt) {
                idxs.forEach(function (idx) {
                    if (rule(lines[idx].src)) {
                        // Human line numbers start at 1
                        context.report(node, fmt.replace("%s", idx + 1));
                    }
                });
            }

            // Single line comments
            switch (opts.afterLineComment) {
                case true:
                    forbid(afterLineIdxs, isNotEmpty,
                           "Line comment must be followed by empty line (line %s)");
                    break;
                case false:
                    forbid(afterLineIdxs, isEmpty,
                           "Line comment cannot be followed by empty line (line %s)");
                    break;
                // no default
            }

            // Block comments
            switch (opts.afterBlockComment) {
                case true:
                    forbid(afterBlockIdxs, isNotEmpty,
                           "Block comment must be followed by empty line (line %s)");
                    break;
                case false:
                    forbid(afterBlockIdxs, isEmpty,
                           "Block comment cannot be followed by empty line (line %s)");
                    break;
                // no default
            }
        }
    };
};
