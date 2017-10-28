/**
 * @fileoverview Plugins manager
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const debug = require("debug")("eslint:plugins");
const naming = require("../util/naming");

//------------------------------------------------------------------------------
// Private
//------------------------------------------------------------------------------

const PLUGIN_NAME_PREFIX = "eslint-plugin-";

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Plugin class
 */
class Plugins {

    /**
     * Creates the plugins context
     * @param {Environments} envContext - env context
     * @param {Rules} rulesContext - rules context
     */
    constructor(envContext, rulesContext) {
        this._plugins = Object.create(null);
        this._environments = envContext;
        this._rules = rulesContext;
    }

    /**
     * Defines a plugin with a given name rather than loading from disk.
     * @param {string} pluginName The name of the plugin to load.
     * @param {Object} plugin The plugin object.
     * @returns {void}
     */
    define(pluginName, plugin) {
        const pluginNamespace = naming.getNamespaceFromTerm(pluginName),
            pluginNameWithoutNamespace = naming.removeNamespaceFromTerm(pluginName),
            pluginNameWithoutPrefix = naming.removePrefixFromTerm(PLUGIN_NAME_PREFIX, pluginNameWithoutNamespace),
            shortName = pluginNamespace + pluginNameWithoutPrefix;

        // load up environments and rules
        this._plugins[shortName] = plugin;
        this._environments.importPlugin(plugin, shortName);
        this._rules.importPlugin(plugin, shortName);
    }

    /**
     * Gets a plugin with the given name.
     * @param {string} pluginName The name of the plugin to retrieve.
     * @returns {Object} The plugin or null if not loaded.
     */
    get(pluginName) {
        return this._plugins[pluginName] || null;
    }

    /**
     * Returns all plugins that are loaded.
     * @returns {Object} The plugins cache.
     */
    getAll() {
        return this._plugins;
    }

    /**
     * Loads a plugin with the given name.
     * @param {string} pluginName The name of the plugin to load.
     * @returns {void}
     * @throws {Error} If the plugin cannot be loaded.
     */
    load(pluginName) {
        const pluginNamespace = naming.getNamespaceFromTerm(pluginName),
            pluginNameWithoutNamespace = naming.removeNamespaceFromTerm(pluginName),
            pluginNameWithoutPrefix = naming.removePrefixFromTerm(PLUGIN_NAME_PREFIX, pluginNameWithoutNamespace),
            shortName = pluginNamespace + pluginNameWithoutPrefix,
            longName = pluginNamespace + PLUGIN_NAME_PREFIX + pluginNameWithoutPrefix;
        let plugin = null;

        if (pluginName.match(/\s+/)) {
            const whitespaceError = new Error(`Whitespace found in plugin name '${pluginName}'`);

            whitespaceError.messageTemplate = "whitespace-found";
            whitespaceError.messageData = {
                pluginName: longName
            };
            throw whitespaceError;
        }

        if (!this._plugins[shortName]) {
            try {
                plugin = require(longName);
            } catch (pluginLoadErr) {
                try {

                    // Check whether the plugin exists
                    require.resolve(longName);
                } catch (missingPluginErr) {

                    // If the plugin can't be resolved, display the missing plugin error (usually a config or install error)
                    debug(`Failed to load plugin ${longName}.`);
                    missingPluginErr.message = `Failed to load plugin ${pluginName}: ${missingPluginErr.message}`;
                    missingPluginErr.messageTemplate = "plugin-missing";
                    missingPluginErr.messageData = {
                        pluginName: longName
                    };
                    throw missingPluginErr;
                }

                // Otherwise, the plugin exists and is throwing on module load for some reason, so print the stack trace.
                throw pluginLoadErr;
            }

            this.define(pluginName, plugin);
        }
    }

    /**
     * Loads all plugins from an array.
     * @param {string[]} pluginNames An array of plugins names.
     * @returns {void}
     * @throws {Error} If a plugin cannot be loaded.
     * @throws {Error} If "plugins" in config is not an array
     */
    loadAll(pluginNames) {

        // if "plugins" in config is not an array, throw an error so user can fix their config.
        if (!Array.isArray(pluginNames)) {
            const pluginNotArrayMessage = "ESLint configuration error: \"plugins\" value must be an array";

            debug(`${pluginNotArrayMessage}: ${JSON.stringify(pluginNames)}`);

            throw new Error(pluginNotArrayMessage);
        }

        // load each plugin by name
        pluginNames.forEach(this.load, this);
    }
}

module.exports = Plugins;
