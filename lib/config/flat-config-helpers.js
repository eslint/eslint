/**
 * @fileoverview Shared functions to work with configs.
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Functions
//-----------------------------------------------------------------------------

/**
 * Parses a ruleId into its plugin and rule parts.
 * @param {string} ruleId The rule ID to parse.
 * @returns {{pluginName:string,ruleName:string}} The plugin and rule
 *      parts of the ruleId;
 */
function parseRuleId(ruleId) {
    let pluginName, ruleName;

    // distinguish between core rules and plugin rules
    if (ruleId.includes("/")) {

        // mimic scoped npm packages
        if (ruleId.startsWith("@")) {
            pluginName = ruleId.slice(0, ruleId.lastIndexOf("/"));
        } else {
            pluginName = ruleId.slice(0, ruleId.indexOf("/"));
        }

        ruleName = ruleId.slice(pluginName.length + 1);
    } else {
        pluginName = "@";
        ruleName = ruleId;
    }

    return {
        pluginName,
        ruleName
    };
}

/**
 * Retrieves a rule instance from a given config based on the ruleId.
 * @param {string} ruleId The rule ID to look for.
 * @param {FlatConfig} config The config to search.
 * @returns {import("../shared/types").Rule|undefined} The rule if found
 *      or undefined if not.
 */
function getRuleFromConfig(ruleId, config) {

    const { pluginName, ruleName } = parseRuleId(ruleId);

    const plugin = config.plugins && config.plugins[pluginName];
    const rule = plugin && plugin.rules && plugin.rules[ruleName];

    return rule;
}

const SCHEMA_NO_OPTIONS = {
    type: "array",
    minItems: 0,
    maxItems: 0
};

Object.freeze(SCHEMA_NO_OPTIONS);

/**
 * Gets a complete options schema for a rule.
 * @param {{create: Function, schema: (Array|null)}} rule A new-style rule object
 * @returns {Object} JSON Schema for the rule's options.
 */
function getRuleOptionsSchema(rule) {

    if (!rule) {
        return null;
    }

    const schema = rule.meta && rule.meta.schema;

    if (Array.isArray(schema)) {
        if (schema.length) {
            return {
                type: "array",
                items: schema,
                minItems: 0,
                maxItems: schema.length
            };
        }
        return SCHEMA_NO_OPTIONS;

    }

    // Given a full schema, leave it alone
    return schema || SCHEMA_NO_OPTIONS;
}


//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

module.exports = {
    parseRuleId,
    getRuleFromConfig,
    getRuleOptionsSchema
};
