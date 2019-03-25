/**
 * @fileoverview JSON reporter
 * @author Burak Yigit Kaya aka BYK
 */
"use strict";

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function(results, data) {
    return JSON.stringify({
        results,
        rulesMeta: data.rulesMeta
    });
};
