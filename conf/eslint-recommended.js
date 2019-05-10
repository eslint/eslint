/**
 * @fileoverview Configuration applied when a user configuration extends from
 * eslint:recommended.
 * @author Nicholas C. Zakas
 */

"use strict";

const builtInRules = require("../lib/built-in-rules-index");
const recommendedRules = {};

for (const [ruleId, rule] of builtInRules) {
    if (rule.meta.docs.recommended) {
        recommendedRules[ruleId] = "error";
    }
}

/** @type {import("../lib/util/types").ConfigData} */
module.exports = { rules: recommendedRules };
