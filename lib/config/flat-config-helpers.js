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
    let rule = plugin && plugin.rules && plugin.rules[ruleName];


    // normalize function rules into objects
    if (rule && typeof rule === "function") {
        rule = {
            create: rule
        };
    }

    return rule;
}

/**
 * Builds a single options schema from an array of options schemas,
 * allowing 0 or more matches in order, ignoring any schemas that aren't
 * matched to elements in the configured options, and allowing
 * references between the schemas in the array.
 * @param {object[]} schemas The array of schemas to combine.
 * @returns {Object} A single JSON Schema matching one or more of the schemas in the array in order.
 */
function buildArraySchema(schemas) {

    if (schemas.length === 0) {
        return {
            type: "array",
            minItems: 0,
            maxItems: 0
        };
    }

    /*
     * Generate a random base URL for the embedded schemas so that rule writers can't
     * reference them absolutely or override them, and so that ajv doesn't generate
     * conflicts in its cache.
     */
    const ruleOptionsSchemaBase = `https://${Math.ceil(Math.random() * 1000000)}.eslint.org`;
    const embeddedSchemas = schemas.map((schema, i) => {
        if (schema.$id) {
            return schema;
        }

        return {
            $id: `${ruleOptionsSchemaBase}/${i}`,
            ...schema
        };
    });

    const embeddedSchemaRefs = schemas.map((schema, i) => schema.$id || `#/definitions/${i}`);

    return {
        type: "array",
        items: embeddedSchemaRefs.map(ref => ({ $ref: ref })),
        minItems: 0,
        maxItems: schemas.length,

        definitions: Object.fromEntries(embeddedSchemas.map((schema, i) => [i, schema]))
    };
}

/**
 * Gets a complete options schema for a rule.
 * @param {{schema?: (object[]|object|null), meta?: { schema?: (object[]|object|null)}}} rule A new-style rule object
 * @returns {Object} JSON Schema for the rule's options.
 */
function getRuleOptionsSchema(rule) {

    if (!rule) {
        return null;
    }

    const schema = rule.schema || rule.meta && rule.meta.schema;

    if (!schema) {
        return null;
    }

    return Array.isArray(schema)
        ? buildArraySchema(schema)
        : schema;
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

module.exports = {
    parseRuleId,
    getRuleFromConfig,
    getRuleOptionsSchema
};
