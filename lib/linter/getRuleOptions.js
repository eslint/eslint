/* eslint-disable no-undefined -- `null` and `undefined` are different in options */
/**
 * @fileoverview Applies default rule options
 * @author JoshuaKGoldberg
 */

"use strict";

/**
 * Creates a "shallow" copy of an array or object's properties.
 * Other objects are returned directly.
 * @template Value
 * @param {Value} value Value to be copied.
 * @returns {Value} The shallow copied value.
 */
function cloneShallow(value) {
    if (Array.isArray(value)) {
        return [...value];
    }

    if (value && typeof value === "object") {
        return { ...value };
    }

    return value;
}

/**
 * Returns either a value, or the fallback if the value was undefined.
 * @template T Type of value or fallback.
 * @param {T | undefined} value Result to use by default.
 * @param {T} fallback Fallback if value was undefined.
 * @returns {T} value, or fallback if value was undefined.
 */
function valueOrFallback(value, fallback) {
    return value === undefined ? fallback : value;
}

/**
 * Finds the first defined value, or undefined.
 * @template T Types of values.
 * @param  {...(T | undefined)[]} values Values to choose from.
 * @returns {T | undefined} First defined value in values, or undefined.
 */
function firstDefined(...values) {
    for (const value of values) {
        if (value !== undefined) {
            return value;
        }
    }

    return undefined;
}

/**
 * Finds the last index in a schema that will need a recursive defaulting pass.
 * @param {Array} schema Schema for a rule.
 * @param {number} startIndex Start index to search after.
 * @returns {number} Last index of a schema with default or properties, or -1.
 */
function findSchemaSliceEnd(schema, startIndex) {
    for (let i = schema.length - 1; i >= startIndex; i -= 1) {
        if (
            Object.hasOwn(schema[i], "default") ||
            Object.hasOwn(schema[i], "properties")
        ) {
            return i + 1;
        }
    }

    return -1;
}

/**
 * Recursive worker to parse a rule config.
 * @param {Array|Object|null} ruleConfig Config for a rule.
 * @param {Array|Object|null} schema Option schema of the rule.
 * @returns {Array|Object|null} Resolved option(s) for the rule.
 */
function getRuleOptionsWorker(ruleConfig, schema) {
    if (ruleConfig === null || !schema) {
        return ruleConfig;
    }

    if (Array.isArray(schema)) {
        // eslint-disable-next-line no-use-before-define -- Recursive functions calling each other
        return getRuleOptionsArray(ruleConfig, schema);
    }

    const options = cloneShallow(
        valueOrFallback(
            firstDefined(ruleConfig, schema.default),
            schema.properties ? {} : undefined
        )
    );

    if (options && schema.properties) {
        for (const [key, value] of Object.entries(schema.properties)) {
            if (
                Object.hasOwn(value, "default") &&
                !Object.hasOwn(options, key)
            ) {
                if (value.type === "object") {
                    options[key] = getRuleOptionsWorker(
                        { ...value.default },
                        value
                    );
                } else {
                    options[key] = cloneShallow(value.default);
                }
            }

            if (value.type === "object") {
                options[key] = getRuleOptionsWorker({ ...options[key] }, value);
            }
        }
    }

    return options;
}

/**
 * Gets the resolved options of a rule's array config based on its schema array.
 * @param {Array} ruleConfig Rule config options array.
 * @param {Object} schema Schema elements for the rule.
 * @returns {Array} Resolved options for the rule.
 */
function getRuleOptionsArray(ruleConfig, schema) {
    const options = [];

    for (let i = 0; i < Math.min(ruleConfig.length, schema.length); i += 1) {
        options.push(getRuleOptionsWorker(ruleConfig[i], schema[i]));
    }

    if (ruleConfig.length > schema.length) {
        return [...options, ...ruleConfig.slice(schema.length)];
    }

    const schemaSliceEnd = findSchemaSliceEnd(schema, ruleConfig.length);

    return schemaSliceEnd === -1
        ? options
        : [
            ...options,
            ...schema
                .slice(ruleConfig.length, schemaSliceEnd)
                .map(item => getRuleOptionsWorker(undefined, item))
        ];
}

/**
 * Get the options for a rule (not including severity), if any.
 * @param {Array|number} ruleConfig Config for a rule.
 * @param {Object|undefined} schema Schema for a rule.
 * @returns {Array} Resolve option(s) for the rule, factoring in schema defaults.
 */
function getRuleOptions(ruleConfig, schema) {
    return Array.isArray(ruleConfig)
        ? getRuleOptionsWorker(ruleConfig.slice(1), schema)
        : getRuleOptionsWorker([], schema);
}

exports.getRuleOptions = getRuleOptions;

/* eslint-enable no-undefined -- `null` and `undefined` are different in options */
