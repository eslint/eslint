/**
 * @fileoverview ConfigArray
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const ConfigOps = require("../config/config-ops"),
    path = require("path"),
    schema = require("./config-schema"),
    recommendedConfig = require("../../conf/eslint-recommended"),
    allConfig = require("../../conf/eslint-all");

const debug = require("debug")("eslint:config-array");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function flatten(items) {

    function *flatTraverse(array) {
        for (const item of array) {
            if (Array.isArray(item)) {
                yield* flatTraverse(item);
            } else {
                yield item;
            }
        }
    }

    return [...flatTraverse(items)];
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Represents an array of config objects and provides method for working with
 * those config objects.
 */
class ConfigArray extends Array {

    /**
     * Creates a new instance of ConfigArray.
     * @param {Iterable|Function|Object} configs An iterable yielding config
     *      objects, or a config function, or a config object.
     * @param {string} [options.basePath=""] The path of the config file
     *      containing the configs.
     */
    constructor(configs, { basePath = "" }) {
        super();

        // load the configs into this array
        if (Array.isArray(configs)) {
            this.push(...configs);
        } else {
            this.push(configs);
        }

        /**
         * The path of the config file that this array was loaded from.
         * This is used to calculate filename matches.
         * @property basePath
         * @type string
         */
        this.basePath = basePath;
    }

    /**
     * Normalizes a config array by flattening embedded arrays and executing
     * config functions.
     * @param {ConfigContext} context The context object for configs.
     * @returns {ConfigArray} A new ConfigArray instance that is normalized.
     */
    normalize(context) {
        return new ConfigArray(flatten(this).map(config => {
            if (config === "eslint:recommended") {
                return recommendedConfig;
            }

            if (config === "eslint:all") {
                return allConfig;
            }

            return config;
        }), { basePath: this.basePath });
    }

    /**
     * Returns the config object for a given file path.
     * @param {string} filePath The complete path of a file to get a config for.
     * @returns {Object} The config object for this file.
     */
    getConfig(filePath) {
        const matchingConfigs = [];
        const relativePath = path.relative(this.basePath, filePath);

        for (const config of this) {
            if (!config.files || ConfigOps.pathMatchesGlobs(relativePath, config.files, config.ignores || null)) {
                debug(`Matching config found for ${relativePath}`);
                matchingConfigs.push(config);
            } else {
                debug(`Config didn't match ${relativePath}`);
            }
        }

        return matchingConfigs.reduce((result, config, index) => {
            return schema.merge(result, config)
        }, {});
    }

}

module.exports = ConfigArray;
