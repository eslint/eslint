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
        lastTemplateLocIndex = 0;

    switch (context.options[0]) {
        case true: // Support old syntax, maybe add deprecation warning here
        case "smart-tabs":
            smartTabs = true;
            break;
        default:
            smartTabs = false;
    }

    var COMMENT_START = /^\s*\/\*/,
        MAYBE_COMMENT = /^\s*\*/;

    /**
     * Determines if a given line and column are contained within a location.
     * @param {Location} loc The location object from an AST node.
     * @param {int} line The line to check.
     * @param {int} column The column to check.
     * @returns {boolean} True if the line and column are inside the location, false if not.
     * @private
     */
    function inLoc(loc, line, column) {
        var start = loc.start,
            end = loc.end;

        if (start.line !== end.line) {

            // if it's after the start of the location on the same line
            if (start.line === line && column > start.column) {
                return true;
            }

            // if it's before the end of the location on the same line
            if (end.line === line && column < end.column) {
                return true;
            }

            // if the line is in between the start an end
            if (start.line < line && line < end.line) {
                return true;
            }

            return false;
        }

        // if location is on one line and the
        if (start.line === line && column > start.column && column < end.column) {
            return true;
        }

        return false;
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
                lines = context.getSourceLines();

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

                    if (MAYBE_COMMENT.test(line) || COMMENT_START.test(lines[i - 1])) {
                        return;
                    }

                    // make sure this isn't inside of a template element
                    for (; lastTemplateLocIndex < templateLocs.length; lastTemplateLocIndex++) {

                        if (inLoc(templateLocs[lastTemplateLocIndex], lineNumber, column)) {
                            return;
                        }
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
