/**
 * @fileoverview Applies default rule options
 * @author JoshuaKGoldberg
 */

"use strict";

const { deepMerge } = require("./deep-merge");

/**
 * Creates rule options by merging a user config on top of any default options.
 * @param {Array|undefined} defaultOptions Default options from a rule's meta.
 * @param {Array} ruleConfig User-specified rule configuration.
 * @returns {Array} Rule options, factoring in user config and any defaults.
 */
function getMergedRuleOptions(defaultOptions, ruleConfig) {
    if (!defaultOptions) {
        return ruleConfig;
    }

    const options = [];
    const sharedLength = Math.min(defaultOptions.length, ruleConfig.length);
    let i;

    for (i = 0; i < sharedLength; i += 1) {
        options.push(deepMerge(defaultOptions[i], ruleConfig[i]));
    }

    options.push(...defaultOptions.slice(i));
    options.push(...ruleConfig.slice(i));

    return options;
}

/**
 * Get the options for a rule (not including severity), if any, factoring in defaults
 * @param {Array|undefined} defaultOptions default options from rule's meta.
 * @param {Array|number} ruleConfig rule configuration
 * @returns {Array} of rule options, empty Array if none
 */
function getRuleOptions(defaultOptions, ruleConfig) {
    if (Array.isArray(ruleConfig)) {
        return getMergedRuleOptions(defaultOptions, ruleConfig.slice(1));
    }
    return defaultOptions || [];
}

/**
 * Get the raw (non-defaulted) options for a rule (not including severity), if any
 * @param {Array|number} ruleConfig rule configuration
 * @returns {Array} of rule options, empty Array if none
 */
function getRuleOptionsRaw(ruleConfig) {
    if (Array.isArray(ruleConfig)) {
        return ruleConfig.slice(1);
    }
    return [];
}

module.exports = { getRuleOptions, getRuleOptionsRaw };
