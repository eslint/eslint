/**
 * @fileoverview Applies default rule options
 * @author JoshuaKGoldberg
 */

"use strict";

const { deepMergeArrays } = require("./deep-merge-arrays");

/**
 * Get the options for a rule (not including severity), if any, factoring in defaults
 * @param {Array|undefined} defaultOptions default options from rule's meta.
 * @param {Array|number} ruleConfig rule configuration
 * @returns {Array} of rule options, empty Array if none
 */
function getRuleOptions(defaultOptions, ruleConfig) {
    if (Array.isArray(ruleConfig)) {
        return deepMergeArrays(defaultOptions, ruleConfig.slice(1));
    }
    return defaultOptions || [];
}

module.exports = { getRuleOptions };
