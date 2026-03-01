/**
 * @fileoverview Test rule to flag if the settings var `test` is missing;
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "problem",
        schema: [],
    },
    create(context) {
        return {
            Program: function (node) {
                if (!context.settings || !context.settings.test) {
                    context.report(
                        node,
                        "Global settings test was not defined."
                    );
                }
            },
        };
    },
};
