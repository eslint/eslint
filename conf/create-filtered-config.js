/**
 * @fileoverview Helper to create a config based on a filter from the core rules
 * @author Teddy Katz
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const load = require("../lib/load-rules"),
    rules = require("../lib/rules");

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------


/**
 * Creates a config from a filtered list of core rules
 * @param {Function} ruleFilter A filter function for rules. This gets passed the rule object as the first argument, and
 * the rule id as the second argument. Returns a truthy value if the rule should be included, and a falsy value otherwise
 * @returns {Object} A frozen config with the given core rules enabled
 */
module.exports = function(ruleFilter) {
    return Object.freeze({
        rules: Object.freeze(Object.keys(load()).reduce((result, ruleId) => {
            if (ruleFilter(rules.get(ruleId), ruleId)) {
                result[ruleId] = "error";
            }
            return result;
        }, {}))
    });
};
