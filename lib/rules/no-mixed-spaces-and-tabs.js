/**
 * @fileoverview Disallow mixed spaces and tabs for indentation
 * @author Jary Niebur
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var smartTabs = context.options[0];

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {

        "Program": function(node) {
            /* 
             * At least one space followed by a tab
             * or the reverse before non-tab/-space 
             * characters begin.
             */
            var regex = /^(?=[\t ]*(\t | \t))/,
                match;

            if (smartTabs) {
                /*
                 * At least one space followed by a tab 
                 * before non-tab/-space characters begin.
                 */
                regex = /^(?=[\t ]* \t)/;
            }

            context
                .getSourceLines()
                .forEach(function(line, i) {
                    match = regex.exec(line);
                    
                    if (match) {
                        context.report(node, { line: i + 1, column: match.index + 1 }, "Mixed spaces and tabs.");
                    }
                });
        }

    };

};
