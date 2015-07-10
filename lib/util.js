/**
 * @fileoverview Common utilities.
 */
"use strict";

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var PLUGIN_NAME_PREFIX = "eslint-plugin-",
    NAMESPACE_REGEX = /^@.*\//i;

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Merges two config objects. This will not only add missing keys, but will also modify values to match.
 * @param {Object} target config object
 * @param {Object} src config object. Overrides in this config object will take priority over base.
 * @param {boolean} [combine] Whether to combine arrays or not
 * @returns {Object} merged config object.
 */
exports.mergeConfigs = function deepmerge(target, src, combine) {
    /*
     The MIT License (MIT)

     Copyright (c) 2012 Nicholas Fisher

     Permission is hereby granted, free of charge, to any person obtaining a copy
     of this software and associated documentation files (the "Software"), to deal
     in the Software without restriction, including without limitation the rights
     to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     copies of the Software, and to permit persons to whom the Software is
     furnished to do so, subject to the following conditions:

     The above copyright notice and this permission notice shall be included in
     all copies or substantial portions of the Software.

     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     THE SOFTWARE.
     */
    // This code is taken from deepmerge repo (https://github.com/KyleAMathews/deepmerge) and modified to meet our needs.
    var array = Array.isArray(src) || Array.isArray(target);
    var dst = array && [] || {};

    combine = !!combine;
    if (array) {
        target = target || [];
        dst = dst.concat(target);
        if (typeof src !== "object" && !Array.isArray(src)) {
            src = [src];
        }
        Object.keys(src).forEach(function(e, i) {
            e = src[i];
            if (typeof dst[i] === "undefined") {
                dst[i] = e;
            } else if (typeof e === "object") {
                dst[i] = deepmerge(target[i], e);
            } else {
                if (!combine) {
                    dst[i] = e;
                } else {
                    if (dst.indexOf(e) === -1) {
                        dst.push(e);
                    }
                }
            }
        });
    } else {
        if (target && typeof target === "object") {
            Object.keys(target).forEach(function (key) {
                dst[key] = target[key];
            });
        }
        Object.keys(src).forEach(function (key) {
            if (Array.isArray(src[key]) || Array.isArray(target[key])) {
                dst[key] = deepmerge(target[key], src[key], key === "plugins");
            } else if (typeof src[key] !== "object" || !src[key]) {
                dst[key] = src[key];
            } else {
                if (!target[key]) {
                    dst[key] = src[key];
                } else {
                    dst[key] = deepmerge(target[key], src[key]);
                }
            }
        });
    }

    return dst;
};

/**
 * Removes the prefix `eslint-plugin-` from a plugin name.
 * @param {string} pluginName The name of the plugin which may have the prefix.
 * @returns {string} The name of the plugin without prefix.
 */
exports.removePluginPrefix = function removePluginPrefix(pluginName) {
    return pluginName.indexOf(PLUGIN_NAME_PREFIX) === 0 ? pluginName.substring(PLUGIN_NAME_PREFIX.length) : pluginName;
};

/**
 * @param {string} pluginName The name of the plugin which may have the prefix.
 * @returns {string} The name of the plugins namepace if it has one.
 */
exports.getNamespace = function getNamespace(pluginName) {
    return pluginName.match(NAMESPACE_REGEX) ? pluginName.match(NAMESPACE_REGEX)[0] : "";
};

/**
 * Removes the namespace from a plugin name.
 * @param {string} pluginName The name of the plugin which may have the prefix.
 * @returns {string} The name of the plugin without the namespace.
 */
exports.removeNameSpace = function removeNameSpace(pluginName) {
    return pluginName.replace(NAMESPACE_REGEX, "");
};

exports.PLUGIN_NAME_PREFIX = PLUGIN_NAME_PREFIX;
