/**
 * @fileoverview The `Config` class
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const { RuleValidator } = require("./rule-validator");
const { flatConfigSchema, hasMethod } = require("./flat-config-schema");
const { ObjectSchema } = require("@eslint/config-array");

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const ruleValidator = new RuleValidator();

const severities = new Map([
    [0, 0],
    [1, 1],
    [2, 2],
    ["off", 0],
    ["warn", 1],
    ["error", 2]
]);

/**
 * Splits a plugin identifier in the form a/b/c into two parts: a/b and c.
 * @param {string} identifier The identifier to parse.
 * @returns {{objectName: string, pluginName: string}} The parts of the plugin
 *      name.
 */
function splitPluginIdentifier(identifier) {
    const parts = identifier.split("/");

    return {
        objectName: parts.pop(),
        pluginName: parts.join("/")
    };
}

/**
 * Returns the name of an object in the config by reading its `meta` key.
 * @param {Object} object The object to check.
 * @returns {string?} The name of the object if found or `null` if there
 *      is no name.
 */
function getObjectId(object) {

    // first check old-style name
    let name = object.name;

    if (!name) {

        if (!object.meta) {
            return null;
        }

        name = object.meta.name;

        if (!name) {
            return null;
        }
    }

    // now check for old-style version
    let version = object.version;

    if (!version) {
        version = object.meta && object.meta.version;
    }

    // if there's a version then append that
    if (version) {
        return `${name}@${version}`;
    }

    return name;
}

/**
 * Converts a languageOptions object to a JSON representation.
 * @param {Record<string, any>} languageOptions The options to create a JSON
 *     representation of.
 * @param {string} objectKey The key of the object being converted.
 * @returns {Record<string, any>} The JSON representation of the languageOptions.
 * @throws {TypeError} If a function is found in the languageOptions.
 */
function languageOptionsToJSON(languageOptions, objectKey = "languageOptions") {

    const result = {};

    for (const [key, value] of Object.entries(languageOptions)) {
        if (value) {
            if (typeof value === "object") {
                const name = getObjectId(value);

                if (name && hasMethod(value)) {
                    result[key] = name;
                } else {
                    result[key] = languageOptionsToJSON(value, key);
                }
                continue;
            }

            if (typeof value === "function") {
                throw new TypeError(`Cannot serialize key "${key}" in ${objectKey}: Function values are not supported.`);
            }

        }

        result[key] = value;
    }

    return result;
}

/**
 * Normalizes the rules configuration. Ensure that each rule config is
 * an array and that the severity is a number. This function modifies the
 * rulesConfig.
 * @param {Record<string, any>} rulesConfig The rules configuration to normalize.
 * @returns {void}
 */
function normalizeRulesConfig(rulesConfig) {

    for (const [ruleId, ruleConfig] of Object.entries(rulesConfig)) {

        // ensure rule config is an array
        if (!Array.isArray(ruleConfig)) {
            rulesConfig[ruleId] = [ruleConfig];
        }

        // normalize severity
        rulesConfig[ruleId][0] = severities.get(rulesConfig[ruleId][0]);
    }

}


//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * Represents a normalized configuration object.
 */
class Config {

    /**
     * The name to use for the language when serializing to JSON.
     * @type {string|undefined}
     */
    #languageName;

    /**
     * The name to use for the processor when serializing to JSON.
     * @type {string|undefined}
     */
    #processorName;

    /**
     * Creates a new instance.
     * @param {Object} config The configuration object.
     */
    constructor(config) {

        const { plugins, language, languageOptions, processor, ...otherKeys } = config;

        // Validate config object
        const schema = new ObjectSchema(flatConfigSchema);

        schema.validate(config);

        // first, copy all the other keys over
        Object.assign(this, otherKeys);

        // ensure that a language is specified
        if (!language) {
            throw new TypeError("Key 'language' is required.");
        }

        // copy the rest over
        this.plugins = plugins;
        this.language = language;

        if (languageOptions) {
            this.languageOptions = languageOptions;
        }

        // Check language value
        const { pluginName: languagePluginName, objectName: localLanguageName } = splitPluginIdentifier(language);

        this.#languageName = language;

        if (!plugins || !plugins[languagePluginName] || !plugins[languagePluginName].languages || !plugins[languagePluginName].languages[localLanguageName]) {
            throw new TypeError(`Key "language": Could not find "${localLanguageName}" in plugin "${languagePluginName}".`);
        }

        this.language = plugins[languagePluginName].languages[localLanguageName];

        // Validate language options
        if (this.languageOptions) {
            try {
                this.language.validateLanguageOptions(this.languageOptions);
            } catch (error) {
                throw new TypeError(`Key "languageOptions": ${error.message}`, { cause: error });
            }
        }

        // Check processor value
        if (processor) {
            this.processor = processor;

            if (typeof processor === "string") {
                const { pluginName, objectName: localProcessorName } = splitPluginIdentifier(processor);

                this.#processorName = processor;

                if (!plugins || !plugins[pluginName] || !plugins[pluginName].processors || !plugins[pluginName].processors[localProcessorName]) {
                    throw new TypeError(`Key "processor": Could not find "${localProcessorName}" in plugin "${pluginName}".`);
                }

                this.processor = plugins[pluginName].processors[localProcessorName];
            } else if (typeof processor === "object") {
                this.#processorName = getObjectId(processor);
                this.processor = processor;
            } else {
                throw new TypeError("Key 'processor' must be a string or an object.");
            }
        }

        // Process the rules
        if (this.rules) {
            normalizeRulesConfig(this.rules);
            ruleValidator.validate(this);
        }
    }

    /**
     * Converts the configuration to a JSON representation.
     * @returns {Record<string, any>} The JSON representation of the configuration.
     * @throws {Error} If the configuration cannot be serialized.
     */
    toJSON() {

        if (this.processor && !this.#processorName) {
            throw new Error("Could not serialize processor object (missing 'meta' object).");
        }

        if (!this.#languageName) {
            throw new Error("Could not serialize language object (missing 'meta' object).");
        }

        return {
            ...this,
            plugins: Object.entries(this.plugins).map(([namespace, plugin]) => {

                const pluginId = getObjectId(plugin);

                if (!pluginId) {
                    return namespace;
                }

                return `${namespace}:${pluginId}`;
            }),
            language: this.#languageName,
            languageOptions: languageOptionsToJSON(this.languageOptions),
            processor: this.#processorName
        };
    }
}

module.exports = { Config };
