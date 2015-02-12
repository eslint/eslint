/**
 * @fileoverview Common utilities.
 */
"use strict";

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var PLUGIN_NAME_PREFIX = "eslint-plugin-";
var LOADER_NAME_PREFIX = "eslint-loader-";

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------
/**
 * Merges two objects together and assigns the result to the initial object. Can be used for shallow cloning.
 * @param {Object} target of the cloning operation
 * @param {Object} source object
 * @returns {void}
 */
exports.mixin = function(target, source) {
    Object.keys(source).forEach(function(key) {
        target[key] = source[key];
    });
};

/**
 * Merges two config objects. This will not only add missing keys, but will also modify values to match.
 * @param {Object} base config object
 * @param {Object} custom config object. Overrides in this config object will take priority over base.
 * @returns {Object} merged config object.
 */
exports.mergeConfigs = function mergeConfigs(base, custom) {

    Object.keys(custom).forEach(function (key) {
        var property = custom[key];

        if (key === "plugins") {
            if (!base[key]) {
                base[key] = [];
            }

            property.forEach(function (plugin) {
                // skip duplicates
                if (base[key].indexOf(plugin) === -1) {
                    base[key].push(plugin);
                }
            });
            return;
        }

        if (Array.isArray(base[key]) && !Array.isArray(property) && typeof property === "number") {
            // assume that we are just overriding first attribute
            base[key][0] = custom[key];
            return;
        }

        if (typeof property === "object" && !Array.isArray(property)) {
            // base[key] might not exist, so be careful with recursion here
            base[key] = mergeConfigs(base[key] || {}, custom[key]);
        } else {
            base[key] = custom[key];
        }
    });

    return base;
};


/**
 * Removes prefix from a given name
 * @param {string} name Value to remove prefix from
 * @param {string} prefix Value of the prefix to be removed
 * @returns {string} Result name without prefix
 */
function removePrefix(name, prefix) {
    return name.indexOf(prefix) === 0 ? name.substring(prefix.length) : name;
}

/**
 * Removes the prefix `eslint-plugin-` from a plugin name.
 * @param {string} pluginName The name of the plugin which may have the prefix.
 * @returns {string} The name of the plugin without prefix.
 */
exports.removePluginPrefix = function removePluginPrefix(pluginName) {
    return removePrefix(pluginName, PLUGIN_NAME_PREFIX);
};

/**
 * Remove the prefix 'eslint-loader-' from a loader name.
 * @param {string} loaderName The name of the plugin which may have the prefix.
 * @returns {string} The name of the loader without prefix.
 */
exports.removeLoaderPrefix = function removeLoaderPrefix(loaderName) {
    return removePrefix(loaderName, LOADER_NAME_PREFIX);
};

exports.PLUGIN_NAME_PREFIX = PLUGIN_NAME_PREFIX;
exports.LOADER_NAME_PREFIX = LOADER_NAME_PREFIX;
