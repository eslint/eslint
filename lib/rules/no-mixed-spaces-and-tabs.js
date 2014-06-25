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
            var regex = /^(?=[\t ]*(\t | \t))/;

            if (smartTabs) {
                /*
                 * At least one space followed by a tab 
                 * before non-tab/-space characters begin.
                 */
                regex = /^(?=[\t ]* \t)/;
            }

            context.getSource()
                .split(/\r?\n/g)
                .forEach(function(line, i) {
                    if (regex.exec(line)) {
                        context.report(node, { line: i + 1 }, "Line " + (i + 1) + " has mixed spaces and tabs.");
                    }
                });
        }

    };

};
