/**
 * @fileoverview Configuration applied when a user configuration extends from
 * eslint:recommended.
 * @author Nicholas C. Zakas
 */

"use strict";

const builtInRules = require("../lib/built-in-rules-index");

module.exports = {
    rules: Object.assign(
        {},
        ...Object.keys(builtInRules)
            .filter(ruleId => builtInRules[ruleId].meta.docs.recommended)
            .map(ruleId => ({ [ruleId]: "error" }))
    )
};
