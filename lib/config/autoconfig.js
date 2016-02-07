/**
 * @fileoverview Used for creating a suggested configuration based on project code.
 * @author Ian VanSchooten
 * @copyright 2015 Ian VanSchooten. All rights reserved.
 * See LICENSE in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assign = require("object-assign"),
    debug = require("debug"),
    isEqual = require("lodash.isequal"),
    eslint = require("../eslint"),
    configRule = require("./config-rule"),
    recConfig = require("../../conf/eslint.json");

//------------------------------------------------------------------------------
// Data
//------------------------------------------------------------------------------

var MAX_CONFIG_COMBINATIONS = 17, // 16 combinations + 1 for severity only
    RECOMMENDED_CONFIG_NAME = "eslint:recommended";

//------------------------------------------------------------------------------
// Private
//------------------------------------------------------------------------------

debug = debug("eslint:autoconfig");

/**
 * Information about a rule configuration, in the context of a Registry.
 *
 * @typedef {Object}     registryItem
 * @param   {ruleConfig} config        A valid configuration for the rule
 * @param   {number}     specificity   The number of elements in the ruleConfig array
 * @param   {number}     errorCount    The number of errors encountered when linting with the config
 */

 /**
  * This callback is used to measure execution status in a progress bar
  * @callback progressCallback
  * @param {number} The total number of times the callback will be called.
  */

/**
 * Create registryItems for rules
 * @param   {rulesConfig} rulesConfig Hash of rule names and arrays of ruleConfig items
 * @returns {Object}                  registryItems for each rule in provided rulesConfig
 */
function makeRegistryItems(rulesConfig) {
    return Object.keys(rulesConfig).reduce(function(accumulator, ruleId) {
        accumulator[ruleId] = rulesConfig[ruleId].map(function(config) {
            return {
                config: config,
                specificity: config.length || 1,
                errorCount: void 0
            };
        });
        return accumulator;
    }, {});
}

/**
* Creates an object in which to store rule configs and error counts
*
* Unless a rulesConfig is provided at construction, the registry will not contain
* any rules, only methods.  This will be useful for building up registries manually.
*
* @constructor
* @class   Registry
* @param   {rulesConfig} [rulesConfig] Hash of rule names and arrays of possible configurations
*/
function Registry(rulesConfig) {
    this.rules = (rulesConfig) ? makeRegistryItems(rulesConfig) : {};
}

Registry.prototype = {

    constructor: Registry,

    /**
     * Populate the registry with core rule configs.
     *
     * It will set the registry's `rule` property to an object having rule names
     * as keys and an array of registryItems as values.
     *
     * @returns {void}
     */
    populateFromCoreRules: function() {
        var rulesConfig = configRule.createCoreRuleConfigs();
        this.rules = makeRegistryItems(rulesConfig);
    },

    /**
     * Creates sets of rule configurations which can be used for linting
     * and initializes registry errors to zero for those configurations (side effect).
     *
     * This combines as many rules together as possible, such that the first sets
     * in the array will have the highest number of rules configured, and later sets
     * will have fewer and fewer, as not all rules have the same number of possible
     * configurations.
     *
     * The length of the returned array will be <= MAX_CONFIG_COMBINATIONS.
     *
     * @param   {Object}   registry The autoconfig registry
     * @returns {Object[]}          "rules" configurations to use for linting
     */
    buildRuleSets: function() {
        var idx = 0,
            ruleIds = Object.keys(this.rules),
            ruleSets = [];

        /**
         * Add a rule configuration from the registry to the ruleSets
         *
         * This is broken out into its own function so that it doesn't need to be
         * created inside of the while loop.
         *
         * @param   {string} rule The ruleId to add.
         * @returns {void}
         */
        var addRuleToRuleSet = function(rule) {
            // This check ensures that there is a rule configuration, and that
            // it either has fewer than the max cominbations allowed, or if it has
            // too many configs, we will only use the most basic of them.
            var hasFewCombos = (this.rules[rule].length <= MAX_CONFIG_COMBINATIONS);
            if (this.rules[rule][idx] && (hasFewCombos || this.rules[rule][idx].specificity <= 2)) {
                // If the rule has too many possible combinations, only take simple ones, avoiding objects.
                if (!hasFewCombos && typeof this.rules[rule][idx].config[1] === "object") {
                    return;
                }
                ruleSets[idx] = ruleSets[idx] || {};
                ruleSets[idx][rule] = this.rules[rule][idx].config;
                // Initialize errorCount to zero, since this is a config which will be linted
                this.rules[rule][idx].errorCount = 0;
            }
        }.bind(this);

        while (ruleSets.length === idx) {
            ruleIds.forEach(addRuleToRuleSet);
            idx += 1;
        }

        return ruleSets;
    },

    /**
     * Remove all items from the registry with a non-zero number of errors
     *
     * Note: this also removes rule configurations which were not linted
     * (meaning, they have an undefined errorCount).
     *
     * @returns {void}
     */
    stripFailingConfigs: function() {
        var ruleIds = Object.keys(this.rules),
            newRegistry = new Registry();

        newRegistry.rules = assign({}, this.rules);
        ruleIds.forEach(function(ruleId) {
            var errorFreeItems = newRegistry.rules[ruleId].filter(function(registryItem) {
                return (registryItem.errorCount === 0);
            });
            if (errorFreeItems.length > 0) {
                newRegistry.rules[ruleId] = errorFreeItems;
            } else {
                delete newRegistry.rules[ruleId];
            }
        });

        return newRegistry;
    },

    /**
     * Removes rule configurations which were not included in a ruleSet
     *
     * @returns {void}
     */
    stripExtraConfigs: function() {
        var ruleIds = Object.keys(this.rules),
            newRegistry = new Registry();

        newRegistry.rules = assign({}, this.rules);
        ruleIds.forEach(function(ruleId) {
            newRegistry.rules[ruleId] = newRegistry.rules[ruleId].filter(function(registryItem) {
                return (typeof registryItem.errorCount !== "undefined");
            });
        });

        return newRegistry;
    },

    /**
     * Creates a registry of rules which had no error-free configs.
     * The new registry is intended to be analyzed to determine whether its rules
     * should be disabled or set to warning.
     *
     * @returns {Registry}  A registry of failing rules.
     */
    getFailingRulesRegistry: function() {
        var ruleIds = Object.keys(this.rules),
            failingRegistry = new Registry();

        ruleIds.forEach(function(ruleId) {
            var failingConfigs = this.rules[ruleId].filter(function(registryItem) {
                return (registryItem.errorCount > 0);
            });
            if (failingConfigs && failingConfigs.length === this.rules[ruleId].length) {
                failingRegistry.rules[ruleId] = failingConfigs;
            }
        }.bind(this));

        return failingRegistry;
    },

    /**
     * Create an eslint config for any rules which only have one configuration
     * in the registry.
     *
     * @returns {Object} An eslint config with rules section populated
     */
    createConfig: function() {
        var ruleIds = Object.keys(this.rules),
            config = {rules: {}};

        ruleIds.forEach(function(ruleId) {
            if (this.rules[ruleId].length === 1) {
                config.rules[ruleId] = this.rules[ruleId][0].config;
            }
        }.bind(this));

        return config;
    },

    /**
     * Return a cloned registry containing only configs with a desired specificity
     *
     * @param   {number} specificity Only keep configs with this specificity
     * @returns {Registry}           A registry of rules
     */
    filterBySpecificity: function(specificity) {
        var ruleIds = Object.keys(this.rules),
            newRegistry = new Registry();

        newRegistry.rules = assign({}, this.rules);
        ruleIds.forEach(function(ruleId) {
            newRegistry.rules[ruleId] = this.rules[ruleId].filter(function(registryItem) {
                return (registryItem.specificity === specificity);
            });
        }.bind(this));

        return newRegistry;
    },

    /**
     * Lint SourceCodes against all configurations in the registry, and record results
     *
     * @param   {Object[]} sourceCodes  SourceCode objects for each filename
     * @param   {Object}   config       ESLint config object
     * @param   {progressCallback} [cb] Optional callback for reporting execution status
     * @returns {Registry}              New registry with errorCount populated
     */
    lintSourceCode: function(sourceCodes, config, cb) {
        var totalFilesLinting,
            lintConfig,
            ruleSets,
            ruleSetIdx,
            filenames,
            lintedRegistry;

        lintedRegistry = new Registry();
        lintedRegistry.rules = assign({}, this.rules);
        ruleSets = lintedRegistry.buildRuleSets();
        lintedRegistry = lintedRegistry.stripExtraConfigs();

        debug("Linting with all possible rule combinations");
        filenames = Object.keys(sourceCodes);
        totalFilesLinting = filenames.length * ruleSets.length;
        filenames.forEach(function(filename) {
            debug("Linting file: " + filename);
            ruleSetIdx = 0;
            ruleSets.forEach(function(ruleSet) {
                lintConfig = assign({}, config, {rules: ruleSet});
                var lintResults = eslint.verify(sourceCodes[filename], lintConfig);
                lintResults.forEach(function(result) {
                    lintedRegistry.rules[result.ruleId][ruleSetIdx].errorCount += 1;
                });

                ruleSetIdx += 1;
                if (cb) {
                    cb(totalFilesLinting);  // eslint-disable-line callback-return
                }
            });
            // Deallocate for GC
            sourceCodes[filename] = null;
        });

        return lintedRegistry;
    }
};

/**
 * Extract rule configuration into eslint:recommended where possible.
 *
 * This will return a new config with `"extends": "eslint:recommended"` and
 * only the rules which have configurations different from the recommended config.
 *
 * @param   {Object} config config object
 * @returns {Object}        config object using `"extends": "eslint:recommended"`
 */
function extendFromRecommended(config) {
    var newConfig = assign({}, config);
    var recRules = Object.keys(recConfig.rules).filter(function(ruleId) {
        return (recConfig.rules[ruleId] === 2 || recConfig.rules[ruleId][0] === 2);
    });

    recRules.forEach(function(ruleId) {
        if (isEqual(recConfig.rules[ruleId], newConfig.rules[ruleId])) {
            delete newConfig.rules[ruleId];
        }
    });
    newConfig.extends = RECOMMENDED_CONFIG_NAME;
    return newConfig;
}


//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = {
    Registry: Registry,
    extendFromRecommended: extendFromRecommended
};
