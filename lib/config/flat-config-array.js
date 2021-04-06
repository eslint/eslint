/**
 * @fileoverview Flat Config Array
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const { ConfigArray, ConfigArraySymbol } = require("@humanwhocodes/config-array");
const { flatConfigSchema } = require("./flat-config-schema");
const { RuleValidator } = require("./rule-validator");
const { defaultConfig } = require("./default-config");

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const ruleValidator = new RuleValidator();

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

class FlatConfigArray extends ConfigArray {

    constructor(configs, { basePath, baseConfig = defaultConfig }) {
        super(configs, {
            basePath,
            schema: flatConfigSchema
        });

        this.unshift(baseConfig);
    }

    /**
     * Finalizes the config by replacing plugin references with their objects
     * and validating rule option schemas.
     * @param {Object} config The config to finalize.
     * @returns {Object} The finalized config.
     * @throws {TypeError} If the config is invalid. 
     */
    [ConfigArraySymbol.finalizeConfig](config) {
        
        const { plugins, languageOptions, processor } = config;

        // Check parser value
        if (languageOptions && languageOptions.parser && typeof languageOptions.parser === "string") {
            const [pluginName, parserName] = languageOptions.parser.split("/");

            if (!plugins || !plugins[pluginName] || !plugins[pluginName].parsers || !plugins[pluginName].parsers[parserName]) {
                throw new TypeError(`Key "parser": Could not find "${ parserName }" in plugin "${pluginName}".`);
            }

            languageOptions.parser = plugins[pluginName].parsers[parserName];
        }

        // Check processor value
        if (processor && typeof processor === "string") {
            const [pluginName, processorName] = processor.split("/");

            if (!plugins || !plugins[pluginName] || !plugins[pluginName].processors || !plugins[pluginName].processors[processorName]) {
                throw new TypeError(`Key "processor": Could not find "${processorName}" in plugin "${pluginName}".`);
            }

            config.processor = plugins[pluginName].processors[processorName];
        }

        ruleValidator.validate(config);

        return config;
    }

}

exports.FlatConfigArray = FlatConfigArray;
