/**
 * @fileoverview Config to disable all rules.
 * @author Dave Lunny
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const builtInRules = require("../lib/rules");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const allRules = {};

for (const [ruleId, rule] of builtInRules) {
    if (!rule.meta.deprecated) {
        allRules[ruleId] = "off";
    }
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/** @type {import("../lib/shared/types").ConfigData} */
module.exports = { rules: allRules };
