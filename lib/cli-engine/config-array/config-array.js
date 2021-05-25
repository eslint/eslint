/**
 * @fileoverview `ConfigArray` class.
 *
 * `ConfigArray` class expresses the full of a configuration. It has the entry
 * config file, base config files that were extended, loaded parsers, and loaded
 * plugins.
 *
 * `ConfigArray` class provies three properties and two methods.
 *
 * - `pluginEnvironments`
 * - `pluginProcessors`
 * - `pluginRules`
 *      The `Map` objects that contain the members of all plugins that this
 *      config array contains. Those map objects don't have mutation methods.
 *      Those keys are the member ID such as `pluginId/memberName`.
 * - `isRoot()`
 *      If `true` then this configuration has `root:true` property.
 * - `extractConfig(filePath)`
 *      Extract the final configuration for a given file. This means merging
 *      every config array element which that `criteria` property matched. The
 *      `filePath` argument must be an absolute path.
 *
 * `ConfigArrayFactory` provides the loading logic of config files.
 *
 * @author Toru Nagashima <https://github.com/mysticatea>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { ExtractedConfig } = require("./extracted-config");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

// Define types for VSCode IntelliSense.
/** @typedef {import("../../util/types").Environment} Environment */
/** @typedef {import("../../util/types").GlobalConf} GlobalConf */
/** @typedef {import("../../util/types").RuleConf} RuleConf */
/** @typedef {import("../../util/types").Rule} Rule */
/** @typedef {import("../../util/types").Plugin} Plugin */
/** @typedef {import("../../util/types").Processor} Processor */
/** @typedef {import("./config-dependency").DependentParser} DependentParser */
/** @typedef {import("./config-dependency").DependentPlugin} DependentPlugin */
/** @typedef {import("./override-tester")["OverrideTester"]} OverrideTester */

/**
 * @typedef {Object} ConfigArrayElement
 * @property {string} name The name of this config element.
 * @property {string} filePath The path to the source file of this config element.
 * @property {InstanceType<OverrideTester>|null} criteria The tester for the `files` and `excludedFiles` of this config element.
 * @property {Record<string, boolean>|undefined} env The environment settings.
 * @property {Record<string, GlobalConf>|undefined} globals The global variable settings.
 * @property {DependentParser|undefined} parser The parser loader.
 * @property {Object|undefined} parserOptions The parser options.
 * @property {Record<string, DependentPlugin>|undefined} plugins The plugin loaders.
 * @property {string|undefined} processor The processor name to refer plugin's processor.
 * @property {boolean|undefined} root The flag to express root.
 * @property {Record<string, RuleConf>|undefined} rules The rule settings
 * @property {Object|undefined} settings The shared settings.
 */

/**
 * @typedef {Object} ConfigArrayInternalSlots
 * @property {Map<string, ExtractedConfig>} cache The cache to extract configs.
 * @property {ReadonlyMap<string, Environment>|null} envMap The map from environment ID to environment definition.
 * @property {ReadonlyMap<string, Processor>|null} processorMap The map from processor ID to environment definition.
 * @property {ReadonlyMap<string, Rule>|null} ruleMap The map from rule ID to rule definition.
 */

/** @type {WeakMap<ConfigArray, ConfigArrayInternalSlots>} */
const internalSlotsMap = new class extends WeakMap {
    get(key) {
        let value = super.get(key);

        if (!value) {
            value = {
                cache: new Map(),
                envMap: null,
                processorMap: null,
                ruleMap: null
            };
            super.set(key, value);
        }

        return value;
    }
}();

/**
 * Get the indices which are matched to a given file.
 * @param {ConfigArrayElement[]} elements The elements.
 * @param {string} filePath The path to a target file.
 * @returns {number[]} The indices.
 */
function getMatchedIndices(elements, filePath) {
    const indices = [];

    for (let i = elements.length - 1; i >= 0; --i) {
        const element = elements[i];

        if (!element.criteria || element.criteria.test(filePath)) {
            indices.push(i);
        }
    }

    return indices;
}

/**
 * Check if a value is a non-null object.
 * @param {any} x The value to check.
 * @returns {boolean} `true` if the value is a non-null object.
 */
function isNonNullObject(x) {
    return typeof x === "object" && x !== null;
}

/**
 * Merge two objects.
 *
 * Assign every property values of `y` to `x` if `x` doesn't have the property.
 * If `x`'s property value is an object, it does recursive.
 *
 * @param {Object} target The destination to merge
 * @param {Object|undefined} source The source to merge.
 * @returns {void}
 */
function mergeWithoutOverwrite(target, source) {
    if (!isNonNullObject(source)) {
        return;
    }

    for (const key of Object.keys(source)) {
        if (key === "__proto__") {
            continue;
        }

        if (isNonNullObject(target[key])) {
            mergeWithoutOverwrite(target[key], source[key]);
        } else if (target[key] === void 0) {
            if (isNonNullObject(source[key])) {
                target[key] = Array.isArray(source[key]) ? [] : {};
                mergeWithoutOverwrite(target[key], source[key]);
            } else if (source[key] !== void 0) {
                target[key] = source[key];
            }
        }
    }
}

/**
 * Merge plugins.
 * `target`'s definition is prior to `source`'s.
 *
 * @param {Record<string, DependentPlugin>} target The destination to merge
 * @param {Record<string, DependentPlugin>|undefined} source The source to merge.
 * @returns {void}
 */
function mergePlugins(target, source) {
    if (!isNonNullObject(source)) {
        return;
    }

    for (const key of Object.keys(source)) {
        if (key === "__proto__") {
            continue;
        }
        const targetValue = target[key];
        const sourceValue = source[key];

        // Adopt the plugin which was found at first.
        if (targetValue === void 0) {
            if (sourceValue.error) {
                throw sourceValue.error;
            }
            target[key] = sourceValue;
        }
    }
}

/**
 * Merge rule configs.
 * `target`'s definition is prior to `source`'s.
 *
 * @param {Record<string, Array>} target The destination to merge
 * @param {Record<string, RuleConf>|undefined} source The source to merge.
 * @returns {void}
 */
function mergeRuleConfigs(target, source) {
    if (!isNonNullObject(source)) {
        return;
    }

    for (const key of Object.keys(source)) {
        if (key === "__proto__") {
            continue;
        }
        const targetDef = target[key];
        const sourceDef = source[key];

        // Adopt the rule config which was found at first.
        if (targetDef === void 0) {
            if (Array.isArray(sourceDef)) {
                target[key] = [...sourceDef];
            } else {
                target[key] = [sourceDef];
            }

        /*
         * If the first found rule config is severity only and the current rule
         * config has options, merge the severity and the options.
         */
        } else if (
            targetDef.length === 1 &&
            Array.isArray(sourceDef) &&
            sourceDef.length >= 2
        ) {
            targetDef.push(...sourceDef.slice(1));
        }
    }
}

/**
 * Create the extracted config.
 * @param {ConfigArray} instance The config elements.
 * @param {number[]} indices The indices to use.
 * @returns {ExtractedConfig} The extracted config.
 */
function createConfig(instance, indices) {
    const slots = internalSlotsMap.get(instance);
    const config = new ExtractedConfig();

    // Merge elements.
    for (const index of indices) {
        const element = instance[index];

        // Adopt the parser which was found at first.
        if (!config.parser && element.parser) {
            if (element.parser.error) {
                throw element.parser.error;
            }
            config.parser = element.parser;
        }

        // Adopt the processor which was found at first.
        if (!config.processor && element.processor) {
            config.processor = element.processor;
        }

        // Merge others.
        mergeWithoutOverwrite(config.env, element.env);
        mergeWithoutOverwrite(config.globals, element.globals);
        mergeWithoutOverwrite(config.parserOptions, element.parserOptions);
        mergeWithoutOverwrite(config.settings, element.settings);
        mergePlugins(config.plugins, element.plugins, slots);
        mergeRuleConfigs(config.rules, element.rules);
    }

    return config;
}

/**
 * Collect definitions.
 * @template T, U
 * @param {string} pluginId The plugin ID for prefix.
 * @param {Record<string,T>} defs The definitions to collect.
 * @param {Map<string, U>} map The map to output.
 * @param {function(T): U} [normalize] The normalize function for each value.
 * @returns {void}
 */
function collect(pluginId, defs, map, normalize) {
    if (defs) {
        const prefix = pluginId && `${pluginId}/`;

        for (const [key, value] of Object.entries(defs)) {
            map.set(
                `${prefix}${key}`,
                normalize ? normalize(value) : value
            );
        }
    }
}

/**
 * Normalize a rule definition.
 * @param {Function|Rule} rule The rule definition to normalize.
 * @returns {Rule} The normalized rule definition.
 */
function normalizePluginRule(rule) {
    return typeof rule === "function" ? { create: rule } : rule;
}

/**
 * Delete the mutation methods from a given map.
 * @param {Map<any, any>} map The map object to delete.
 * @returns {void}
 */
function deleteMutationMethods(map) {
    Object.defineProperties(map, {
        clear: { configurable: true, value: void 0 },
        delete: { configurable: true, value: void 0 },
        set: { configurable: true, value: void 0 }
    });
}

/**
 * Create `envMap`, `processorMap`, `ruleMap` with the plugins in the config array.
 * @param {ConfigArrayElement[]} elements The config elements.
 * @param {ConfigArrayInternalSlots} slots The internal slots.
 * @returns {void}
 */
function initPluginMemberMaps(elements, slots) {
    const processed = new Set();

    slots.envMap = new Map();
    slots.processorMap = new Map();
    slots.ruleMap = new Map();

    for (const element of elements) {
        if (!element.plugins) {
            continue;
        }

        for (const [pluginId, value] of Object.entries(element.plugins)) {
            const plugin = value.definition;

            if (!plugin || processed.has(pluginId)) {
                continue;
            }
            processed.add(pluginId);

            collect(pluginId, plugin.environments, slots.envMap);
            collect(pluginId, plugin.processors, slots.processorMap);
            collect(pluginId, plugin.rules, slots.ruleMap, normalizePluginRule);
        }
    }

    deleteMutationMethods(slots.envMap);
    deleteMutationMethods(slots.processorMap);
    deleteMutationMethods(slots.ruleMap);
}

/**
 * Create `envMap`, `processorMap`, `ruleMap` with the plugins in the config array.
 * @param {ConfigArray} instance The config elements.
 * @returns {ConfigArrayInternalSlots} The extracted config.
 */
function ensurePluginMemberMaps(instance) {
    const slots = internalSlotsMap.get(instance);

    if (!slots.ruleMap) {
        initPluginMemberMaps(instance, slots);
    }

    return slots;
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * The Config Array.
 *
 * `ConfigArray` instance contains all settings, parsers, and plugins.
 * You need to call `ConfigArray#extractConfig(filePath)` method in order to
 * extract, merge and get only the config data which is related to an arbitrary
 * file.
 *
 * @extends {Array<ConfigArrayElement>}
 */
class ConfigArray extends Array {

    /**
     * Get the plugin environments.
     * The returned map cannot be mutated.
     * @type {ReadonlyMap<string, Environment>} The plugin environments.
     */
    get pluginEnvironments() {
        return ensurePluginMemberMaps(this).envMap;
    }

    /**
     * Get the plugin processors.
     * The returned map cannot be mutated.
     * @type {ReadonlyMap<string, Processor>} The plugin processors.
     */
    get pluginProcessors() {
        return ensurePluginMemberMaps(this).processorMap;
    }

    /**
     * Get the plugin rules.
     * The returned map cannot be mutated.
     * @returns {ReadonlyMap<string, Rule>} The plugin rules.
     */
    get pluginRules() {
        return ensurePluginMemberMaps(this).ruleMap;
    }

    /**
     * Check if this config has `root` flag.
     * @returns {boolean} `true` if this config array is root.
     */
    isRoot() {
        for (let i = this.length - 1; i >= 0; --i) {
            const root = this[i].root;

            if (typeof root === "boolean") {
                return root;
            }
        }
        return false;
    }

    /**
     * Extract the config data which is related to a given file.
     * @param {string} filePath The absolute path to the target file.
     * @returns {ExtractedConfig} The extracted config data.
     */
    extractConfig(filePath) {
        const { cache } = internalSlotsMap.get(this);
        const indices = getMatchedIndices(this, filePath);
        const cacheKey = indices.join(",");

        if (!cache.has(cacheKey)) {
            cache.set(cacheKey, createConfig(this, indices));
        }

        return cache.get(cacheKey);
    }
}

const exportObject = {
    ConfigArray,

    /**
     * Get the used extracted configs.
     * CLIEngine will use this method to collect used deprecated rules.
     * @param {ConfigArray} instance The config array object to get.
     * @returns {ExtractedConfig[]} The used extracted configs.
     * @private
     */
    getUsedExtractedConfigs(instance) {
        const { cache } = internalSlotsMap.get(instance);

        return Array.from(cache.values());
    }
};

module.exports = exportObject;
