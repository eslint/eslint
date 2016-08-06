/**
 * @fileoverview Plugins manager
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const Environments = require("./environments"),
    resolve = require("resolve"),
    rules = require("../rules");

const debug = require("debug")("eslint:plugins");

//------------------------------------------------------------------------------
// Private
//------------------------------------------------------------------------------

let plugins = Object.create(null);

const PLUGIN_NAME_PREFIX = "eslint-plugin-",
    NAMESPACE_REGEX = /^@.*\//i;

/**
 * Removes the prefix `eslint-plugin-` from a plugin name.
 * @param {string} pluginName The name of the plugin which may have the prefix.
 * @returns {string} The name of the plugin without prefix.
 */
function removePrefix(pluginName) {
    return pluginName.indexOf(PLUGIN_NAME_PREFIX) === 0 ? pluginName.substring(PLUGIN_NAME_PREFIX.length) : pluginName;
}

/**
 * Gets the scope (namespace) of a plugin.
 * @param {string} pluginName The name of the plugin which may have the prefix.
 * @returns {string} The name of the plugins namepace if it has one.
 */
function getNamespace(pluginName) {
    return pluginName.match(NAMESPACE_REGEX) ? pluginName.match(NAMESPACE_REGEX)[0] : "";
}

/**
 * Removes the namespace from a plugin name.
 * @param {string} pluginName The name of the plugin which may have the prefix.
 * @returns {string} The name of the plugin without the namespace.
 */
function removeNamespace(pluginName) {
    return pluginName.replace(NAMESPACE_REGEX, "");
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = {

    removePrefix: removePrefix,
    getNamespace: getNamespace,
    removeNamespace: removeNamespace,

    /**
     * Defines a plugin with a given name rather than loading from disk.
     * @param {string} pluginName The name of the plugin to load.
     * @param {Object} plugin The plugin object.
     * @returns {void}
     */
    define: function(pluginName, plugin) {
        const pluginNameWithoutNamespace = removeNamespace(pluginName),
            pluginNameWithoutPrefix = removePrefix(pluginNameWithoutNamespace);

        plugins[pluginNameWithoutPrefix] = plugin;

        // load up environments and rules
        Environments.importPlugin(plugin, pluginNameWithoutPrefix);

        if (plugin.rules) {
            rules.import(plugin.rules, pluginNameWithoutPrefix);
        }
    },

    /**
     * Gets a plugin with the given name.
     * @param {string} pluginName The name of the plugin to retrieve.
     * @returns {Object} The plugin or null if not loaded.
     */
    get: function(pluginName) {
        return plugins[pluginName] || null;
    },

    /**
     * Returns all plugins that are loaded.
     * @returns {Object} The plugins cache.
     */
    getAll: function() {
        return plugins;
    },

    /**
     * Loads a plugin with the given name.
     * @param {string} pluginName The name of the plugin to load.
     * @param {string?} relativeTo Path to the config that included the plugins
     * @returns {void}
     * @throws {Error} If the plugin cannot be loaded.
     */
    load: function(pluginName, relativeTo) {
        const pluginNamespace = getNamespace(pluginName),
            pluginNameWithoutNamespace = removeNamespace(pluginName),
            pluginNameWithoutPrefix = removePrefix(pluginNameWithoutNamespace);
        let plugin = null;

        if (!plugins[pluginNameWithoutPrefix]) {
            try {
                let moduleName = pluginNamespace + PLUGIN_NAME_PREFIX + pluginNameWithoutPrefix;

                if (relativeTo) {
                    try {
                        moduleName = resolve.sync(moduleName, {
                            basedir: relativeTo
                        });
                    } catch (e) {

                        // resolve.sync throws an error when a module isn't
                        // found. That's not really what we want here.
                    }
                }

                plugin = require(moduleName);
            } catch (err) {
                debug("Failed to load plugin eslint-plugin-" + pluginNameWithoutPrefix + ". Proceeding without it.");
                err.message = "Failed to load plugin " + pluginName + ": " + err.message;
                err.messageTemplate = "plugin-missing";
                err.messageData = {
                    pluginName: pluginNameWithoutPrefix
                };
                throw err;
            }

            this.define(pluginName, plugin);
        }
    },

    /**
     * Loads all plugins from an array.
     * @param {string[]} pluginNames An array of plugins names.
     * @param {string?} relativeTo Path to the config that included the plugins
     * @returns {void}
     * @throws {Error} If a plugin cannot be loaded.
     */
    loadAll: function(pluginNames, relativeTo) {
        pluginNames.forEach(function(name) {
            this.load(name, relativeTo);
        }, this);
    },

    /**
     * Resets plugin information. Use for tests only.
     * @returns {void}
     */
    testReset: function() {
        plugins = Object.create(null);
    }
};
