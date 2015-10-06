/**
 * @fileoverview A class for config data.
 *
 * CascadingConfigData has responsibility to construct final configuration from
 * hierarchy configuration data.
 *
 * We need to note "globals" and "ecmaFeatures" especially.
 * These data can be set directly and come from "env" setting also.
 * We should handle overwriting "globals", "ecmaFeatures", and "env" carefully.
 *
 * CascadingConfigData manages overwriting of "globals" and "ecmaFeatures" as
 * the singly linked list.
 * See Also: `getSnapshot(chains, env)`
 *
 * Also, we need to note "rules" especially.
 * The "rules" contains a reporting level and options.
 * The overwriting way is different between a reporting level and options.
 *
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var path = require("path"),
    environments = require("../conf/environments"),
    util = require("./util"),
    assign = require("object-assign"),
    debug = require("debug"),
    isAbsolutePath = require("path-is-absolute");

//------------------------------------------------------------------------------
// Private
//------------------------------------------------------------------------------

var loadedPlugins = Object.create(null),
    hasOwnProperty = Function.call.bind({}.hasOwnProperty),
    pushAll = Function.apply.bind([].push);

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

debug = debug("eslint:cascading-config-data");

/**
 * Determines if a given string represents a filepath or not using the same
 * conventions as require(), meaning that the first character must be nonalphanumeric
 * and not the @ sign which is used for scoped packages to be considered a file path.
 * @param {string} filePath The string to check.
 * @returns {boolean} True if it's a filepath, false if not.
 * @private
 */
function isFilePath(filePath) {
    return isAbsolutePath(filePath) || !/\w|@/.test(filePath.charAt(0));
}

/**
 * Checks a given object is empty or not.
 * @param {any} x - An object to check.
 * @returns {boolean} `true` if the object is empty.
 */
function isEmptyObject(x) {
    if (typeof x === "object" && x !== null) {
        for (var key in x) {
            if (hasOwnProperty(x, key)) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Load configuration for all plugins provided.
 * @param {string[]} pluginNames An array of plugin names which should be loaded.
 * @returns {Object} all plugin configurations merged together
 */
function getPluginsConfig(pluginNames) {
    var pluginConfig = {};

    pluginNames.forEach(function(pluginName) {
        var pluginNamespace = util.getNamespace(pluginName),
            pluginNameWithoutNamespace = util.removeNameSpace(pluginName),
            pluginNameWithoutPrefix = util.removePluginPrefix(pluginNameWithoutNamespace),
            plugin = {},
            rules = {};

        if (!loadedPlugins[pluginNameWithoutPrefix]) {
            try {
                plugin = require(pluginNamespace + util.PLUGIN_NAME_PREFIX + pluginNameWithoutPrefix);
                loadedPlugins[pluginNameWithoutPrefix] = plugin;
            } catch (err) {
                debug("Failed to load plugin configuration for " + pluginNameWithoutPrefix + ". Proceeding without it.");
                plugin = { rulesConfig: {}};
            }
        } else {
            plugin = loadedPlugins[pluginNameWithoutPrefix];
        }

        if (!plugin.rulesConfig) {
            plugin.rulesConfig = {};
        }

        Object.keys(plugin.rulesConfig).forEach(function(item) {
            rules[pluginNameWithoutPrefix + "/" + item] = plugin.rulesConfig[item];
        });

        pluginConfig = util.mergeConfigs(pluginConfig, rules, false, true);
    });

    return pluginConfig;
}

/**
 * Merges two chains object.
 *
 * This modifies the first argument `chains` directly.
 * Each property value of chains object is a singly linked list.
 * This connects those lists for each property.
 *
 * @param {object} chains - A chains object. It requires being mutable.
 * @param {object} otherChains - A chains object to merge.
 * @returns {void}
 */
function mergeChains(chains, otherChains) {
    for (var key in otherChains) {
        if (!hasOwnProperty(otherChains, key)) {
            continue;
        }

        if (chains[key]) {
            var headElement = {
                env: otherChains[key].env,
                value: otherChains[key].value,
                next: otherChains[key].next
            };

            // Clone otherChains
            var element = headElement;
            while (element.next) {
                element.next = {
                    env: element.next.env,
                    value: element.next.value,
                    next: element.next.next
                };
                Object.freeze(element);

                element = element.next;
            }

            // Connect chains to next of otherChains.
            element.next = chains[key];
            Object.freeze(element);

            chains[key] = headElement;
        } else {
            chains[key] = otherChains[key];
        }
    }
}

/**
 * Makes chain elements for given values.
 * `chains` is an object. Each property is a chain element.
 * `values` is an object. This function creates a chain element for each
 * property of `values`, and this adds the element to the head of the chain
 * which is at the property of the same key.
 *
 * @param {object} chains - An object which is destination.
 * @param {object} values - An object which is source.
 * @param {string} envName - An environment name for the created chain element.
 * @returns {void}
 */
function makeChains(chains, values, envName) {
    for (var key in values) {
        if (!hasOwnProperty(values, key)) {
            continue;
        }

        // A chain is singly linked list.
        chains[key] = Object.freeze({
            env: envName,
            value: Boolean(values[key]),
            next: chains[key]
        });
    }
}

/**
 * Decides the value of a given chain object.
 *
 * Each property value of chains object is a singly linked list.
 * This searches the first valid element for each property.
 * The valid is that its `env` property is `null` or an environment
 * which has the `true` setting.
 *
 * @example
 *
 *     var chains = {
 *         globalReturn: {
 *             env: "commonjs",
 *             value: true,
 *             next: {
 *                 env: "node",
 *                 value: true,
 *                 next: {
 *                     env: null,
 *                     value: false,
 *                     next: null
 *                 }
 *             }
 *         }
 *     };
 *     var env = {node: true, commonjs: false};
 *
 *     // 1. Skipped by `env: "commonjs"` is `false`.
 *     // 2. Adopted by `env: "node"` is `true`.
 *     var result = {globalReturn: true};
 *
 * @param {object} chains - A chains object to get.
 * @param {object} env - The environment setting. A String-Boolean map.
 * @returns {object} The decided values.
 */
function getSnapshot(chains, env) {
    var retv = {};

    for (var key in chains) {
        if (!hasOwnProperty(chains, key)) {
            continue;
        }

        var element = chains[key];
        while (element) {
            // Skip if element's env is overwritten with `false`.
            if (element.env === null || env[element.env] === true) {
                retv[key] = element.value;
                break;
            }

            element = element.next;
        }
    }

    return Object.freeze(retv);
}

/**
 * If an `extends` property is defined, it represents a configuration file
 * to use as a "parent". Load the referenced file and merge the configuration
 * recursively.
 *
 * @param {object} config - A config object to load the `extends` option.
 * @param {{load: function(filePath: string): CascadingConfigData}} loader -
 *      A loader object.
 * @returns {CascadingConfigData[]} An array of loaded config data.
 */
function loadExtendsOption(config, loader) {
    var uppers = [];

    if (!config.extends) {
        return uppers;
    }

    var configExtends =
        Array.isArray(config.extends) ? config.extends : [config.extends];

    for (var i = 0; i < configExtends.length; ++i) {
        var parentPath = configExtends[i];

        if (parentPath === "eslint:recommended") {
            // Add an explicit substitution for eslint:recommended to
            // conf/eslint.json
            // this lets us use the eslint.json file as the recommended rules
            parentPath = path.resolve(__dirname, "../conf/eslint.json");
        } else if (isFilePath(parentPath)) {
            // If the `extends` path is relative, use the directory of the
            // current configuration file as the reference point. Otherwise,
            // use as-is.
            parentPath = (!isAbsolutePath(parentPath) ?
                path.join(path.dirname(config.filePath), parentPath) :
                parentPath
            );
        }

        try {
            uppers.push(loader.load(parentPath));
        } catch (e) {
            // If the file referenced by `extends` failed to load, add the path
            // to the configuration file that referenced it to the error message
            // so the user is able to see where it was referenced from, then
            // re-throw
            e.message += "\nReferenced from: " + config.filePath;
            throw e;
        }
    }

    return uppers;
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Cascading config data.
 *
 * @constructor
 * @param {{load: function(filePath: string): CascadingConfigData}} loader -
 *      A loader object. This is used to load configs of the "extends" option.
 * @param {CascadingConfigData|null} upperCascadingConfigData - Base config.
 *      This is the parent directory's config.
 * @param {object} config - A config object.
 * @param {object|null|undefined} userSpecificConfig - A config object of the
 *      `--config` option. This overwrites config before "terminalConfig".
 * @param {object|null|undefined} terminalConfig - A config object coming from
 *      CLI options (--parser, --plugin, --env, --rule, --global).
 *      This overwrites config finally.
 */
function CascadingConfigData(
    loader,
    upperCascadingConfigData,
    config,
    userSpecificConfig,
    terminalConfig
) {
    var empty = true;
    var raw = this.raw = {
        parser: "espree",
        plugins: [],
        env: {},
        rules: {},
        ecmaFeatures: {},
        globals: {}
    };
    this.loader = loader;
    this.userSpecificConfig = userSpecificConfig || null;
    this.terminalConfig = terminalConfig || null;
    this.resultCache = null;

    //--------------------------------------------------------------------------
    // Load "extends" option.
    var uppers = loadExtendsOption(config, loader);
    if (upperCascadingConfigData) {
        uppers.unshift(upperCascadingConfigData);
    }

    //--------------------------------------------------------------------------
    // Inherits upper's config.
    for (var i = 0; i < uppers.length; ++i) {
        var upper = uppers[i].raw;
        if (upper.empty) {
            continue;
        }

        if (upper.parser) {
            raw.parser = upper.parser;
        }
        if (upper.plugins.length > 0) {
            pushAll(raw.plugins, upper.plugins);
        }
        if (!isEmptyObject(upper.env)) {
            assign(raw.env, upper.env);
        }
        if (!isEmptyObject(upper.rules)) {
            raw.rules = util.mergeConfigs(raw.rules, upper.rules, false, true);
        }
        if (!isEmptyObject(upper.ecmaFeatures)) {
            mergeChains(raw.ecmaFeatures, upper.ecmaFeatures);
        }
        if (!isEmptyObject(upper.globals)) {
            mergeChains(raw.globals, upper.globals);
        }
    }

    //--------------------------------------------------------------------------
    // Overwrite with the current config.
    if (config.parser) {
        raw.parser = config.parser;
        empty = false;
    }
    if (config.plugins && config.plugins.length > 0) {
        pushAll(raw.plugins, config.plugins);
        empty = false;
    }
    if (config.env && !isEmptyObject(config.env)) {
        assign(raw.env, config.env);
        empty = false;

        // Apply ecmaFeatures and globals of the envs.
        for (var envName in config.env) {
            if (!hasOwnProperty(config.env, envName) || !environments[envName]) {
                continue;
            }
            var env = environments[envName];

            if (env.ecmaFeatures) {
                makeChains(raw.ecmaFeatures, env.ecmaFeatures, envName);
            }
            if (env.globals) {
                makeChains(raw.globals, env.globals, envName);
            }
        }
    }
    if (config.rules && !isEmptyObject(config.rules)) {
        raw.rules = util.mergeConfigs(raw.rules, config.rules, false, true);
        empty = false;
    }
    if (config.ecmaFeatures && !isEmptyObject(config.ecmaFeatures)) {
        makeChains(raw.ecmaFeatures, config.ecmaFeatures, null);
        empty = false;
    }
    if (config.globals && !isEmptyObject(config.globals)) {
        makeChains(raw.globals, config.globals, null);
        empty = false;
    }

    //--------------------------------------------------------------------------
    this.empty = empty;
    Object.freeze(raw.plugins);
    Object.freeze(raw.env);
    Object.freeze(raw.rules);
    Object.freeze(raw.ecmaFeatures);
    Object.freeze(raw.globals);
    Object.freeze(raw);
}

CascadingConfigData.prototype = {
    constructor: CascadingConfigData,

    /**
     * The config object which merged with cascading configs and CLI options.
     *
     * @type {object}
     */
    get value() {
        // Lazy merging.
        if (!this.resultCache) {
            if (this.userSpecificConfig) {
                // Overwrites with the user specified config (--config option).
                this.resultCache = new CascadingConfigData(
                    this.loader,
                    this,
                    this.userSpecificConfig,
                    null,
                    this.terminalConfig
                ).value;

            } else if (this.terminalConfig) {
                // Overwrites with the terminal config.
                // (--parser, --plugin, --env, --rule, and--global options).
                this.resultCache = new CascadingConfigData(
                    this.loader,
                    this,
                    this.terminalConfig
                ).value;

            } else {
                // Merges plugins' default rules.
                // ecmaFeatures and globals are determined.
                this.resultCache = {
                    parser: this.raw.parser,
                    plugins: this.raw.plugins,
                    env: this.raw.env,
                    rules: Object.freeze(util.mergeConfigs(
                        getPluginsConfig(this.raw.plugins),
                        this.raw.rules,
                        false,
                        true
                    )),
                    ecmaFeatures: getSnapshot(
                        this.raw.ecmaFeatures,
                        this.raw.env
                    ),
                    globals: getSnapshot(
                        this.raw.globals,
                        this.raw.env
                    )
                };
            }

            Object.freeze(this.resultCache);
        }

        return this.resultCache;
    }
};

module.exports = CascadingConfigData;
