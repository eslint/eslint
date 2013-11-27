/**
 * @fileoverview Responsible for loading config files
 * @author Seth McLaughlin
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var fs = require("fs"),
    path = require("path"),
    environments = require("../conf/environments.json"),
    util = require("./util");


//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var LOCAL_CONFIG_FILENAME = ".eslintrc";


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------


/**
 * Get a local config object.
 * @param {string} directory the directory to start looking for a local config
 * @return {object} the local config object (empty object if there is no local config)
 */
function getLocalConfig(helper, directory) {
    var localConfigFile = helper.findLocalConfigFile(directory),
        config = {};

    if (localConfigFile) {
        try {
            config = JSON.parse(fs.readFileSync(localConfigFile));
        } catch (e) {
            console.error("Cannot read config file:", localConfigFile);
            console.error("Error: ", e.message);
        }
    }

    return config;
}

//------------------------------------------------------------------------------
// API
//------------------------------------------------------------------------------

/**
 * Config
 * @constructor
 * @class Confi
 * @param {Object} options
 * @param {string} [cwd] current working directory. Defaults to process.cwd()
 */
function Config(options) {
    var useConfig;
    options = options || {};

    this.cache = {};
    this.baseConfig = require(path.resolve(__dirname, "..", "conf", "eslint.json"));
    this.baseConfig.format = options.format;
    useConfig = options.c || options.config;

    if (useConfig) {
        this.useSpecificConfig = require(path.resolve(process.cwd(), useConfig));
    }
}

/**
 * Build a config object merging the base config (conf/eslint.json), the
 * environments config (conf/environments.json) and eventually the user config.
 * @param {string} directory the directory to start looking for a local config
 * @return {object} config object
 */
Config.prototype.getConfig = function (directory) {
    var config,
        userConfig,
        envConfig = {};

    directory = path.dirname(directory);
    config    = this.cache[directory];

    if (config) {
        return config;
    }

    if (this.useSpecificConfig) {
        userConfig = this.useSpecificConfig;
    } else {
        userConfig = getLocalConfig(this, directory);
    }

    if (userConfig.env) {
        envConfig.rules = {};

        Object.keys(userConfig.env).forEach(function (name) {
            var environment = environments[name].rules;
            if (userConfig.env[name] && environment) {
                Object.keys(environment).forEach(function(name) {
                    envConfig.rules[name] = environment[name];
                });
            }
        });
    }

    config = this.mergeConfigs(Object.create(this.baseConfig), envConfig);
    config = this.mergeConfigs(config, userConfig);

    this.cache[directory] = config;

    return config;
};

/**
 * Merge a base config with a custom config object. This allows for overriding base config values without needing to
 * specify all options in a custom config.
 * @param {object} base the base config
 * @param {object} custom the custom config
 * @return {object} the merged config
 */
Config.prototype.mergeConfigs = function (base, custom) {
    return util.mergeConfigs(base, custom);
};


/**
 * Find a local config file, relative to a specified directory.
 * @param {string} directory the directory to start searching from
 * @return {string|boolean} returns path of config file if found, or false if no config is found
 */
Config.prototype.findLocalConfigFile = function (directory) {
    var lookInDirectory = directory || process.eslintCwd || process.cwd(),
        lookFor = LOCAL_CONFIG_FILENAME,
        files = fs.readdirSync(lookInDirectory),
        parentDirectory;

    if (files.indexOf(lookFor) !== -1) {
        return path.resolve(lookInDirectory, lookFor);
    }

    parentDirectory = path.resolve(lookInDirectory, "..");

    if (parentDirectory === lookInDirectory) {
        return false;
    }

    return this.findLocalConfigFile(parentDirectory);
};


module.exports = Config;
