/**
 * @fileoverview Disallow mixed spaces and tabs for indentation
 * @author Jary Niebur
 * @copyright 2014 Nicholas C. Zakas. All rights reserved.
 * @copyright 2014 Jary Niebur. All rights reserved.
 * See LICENSE in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var smartTabs,
        templateLocs = [],
        lastTemplateLocIndex = 0,
        lastCommentLocIndex = 0;

    switch (context.options[0]) {
        case true: // Support old syntax, maybe add deprecation warning here
        case "smart-tabs":
            smartTabs = true;
            break;
        default:
            smartTabs = false;
    }

    /**
     * Determines if a given line and column are before a location.
     * @param {Location} loc The location object from an AST node.
     * @param {int} line The line to check.
     * @param {int} column The column to check.
     * @returns {boolean} True if the line and column are before the location, false if not.
     * @private
     */
    function beforeLoc(loc, line, column) {
        if (line < loc.start.line) {
            return true;
        }
        return line === loc.start.line && column < loc.start.column;
    }

    /**
     * Determines if a given line and column are after a location.
     * @param {Location} loc The location object from an AST node.
     * @param {int} line The line to check.
     * @param {int} column The column to check.
     * @returns {boolean} True if the line and column are after the location, false if not.
     * @private
     */
    function afterLoc(loc, line, column) {
        if (line > loc.end.line) {
            return true;
        }
        return line === loc.end.line && column > loc.end.column;
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {

        "TemplateElement": function(node) {
            templateLocs.push(node.loc);
        },

        "Program:exit": function(node) {
            /*
             * At least one space followed by a tab
             * or the reverse before non-tab/-space
             * characters begin.
             */
            var regex = /^(?=[\t ]*(\t | \t))/,
                match,
                lines = context.getSourceLines(),
                comments = context.getAllComments();

            if (smartTabs) {
                /*
                 * At least one space followed by a tab
                 * before non-tab/-space characters begin.
                 */
                regex = /^(?=[\t ]* \t)/;
            }

            lines.forEach(function(line, i) {
                match = regex.exec(line);

                if (match) {
                    var lineNumber = i + 1,
                        column = match.index + 1;

                    for (; lastCommentLocIndex < comments.length; lastCommentLocIndex++) {
                        if (beforeLoc(comments[lastCommentLocIndex].loc, lineNumber, column)) {
                            continue;
                        }
                        if (afterLoc(comments[lastCommentLocIndex].loc, lineNumber, column)) {
                            break;
                        }
                        return;
                    }

                    // make sure this isn't inside of a template element
                    for (; lastTemplateLocIndex < templateLocs.length; lastTemplateLocIndex++) {
                        if (beforeLoc(templateLocs[lastTemplateLocIndex], lineNumber, column)) {
                            continue;
                        }
                        if (afterLoc(templateLocs[lastTemplateLocIndex], lineNumber, column)) {
                            break;
                        }
                        return;
                    }

                    context.report(node, { line: i + 1, column: column }, "Mixed spaces and tabs.");
                }
            });
        }

    };

};

module.exports.schema = [
    {
        "enum": ["smart-tabs", true, false]
    }
];
