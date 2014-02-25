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
    util = require("./util"),
    glob = require("glob"),
    stripComments = require("strip-json-comments"),
    yaml = require("js-yaml");

var existsSync = fs.existsSync || path.existsSync;


//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var LOCAL_CONFIG_FILENAME = ".eslintrc";
var ESLINT_IGNORE_FILENAME = ".eslintignore";


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Check if a given directory contains .eslintignore
 * files and if so, load and parse them
 * @param {string} directory The path to load from.
 * @returns {string[]} An array of paths to exclude or an empty array.
 */
function loadIgnoreFile(directory) {
    var exclusions = [];
    if (existsSync(path.resolve(directory, ESLINT_IGNORE_FILENAME))) {
        //load .eslintignore file and JSON parse it
        try {
            exclusions = JSON.parse(fs.readFileSync(path.resolve(directory, ESLINT_IGNORE_FILENAME), "utf8"));
        } catch (e) {
            /* istanbul ignore next Error handling doesn't need tests*/
            throw new Error("Could not load local .eslintignore file: " + path.resolve(directory, ESLINT_IGNORE_FILENAME));
        }
    }

    return exclusions;
}

/**
 * Load and parse a JSON config object from a file.
 * @param {string} filePath the path to the JSON config file
 * @returns {Object} the parsed config object (empty object if there was a parse error)
 */
function loadConfig(filePath) {
    var config = {};

    if (filePath) {
        try {
            config = yaml.safeLoad(stripComments(fs.readFileSync(filePath, "utf8")));
        } catch (e) {
            console.error("Cannot read config file:", filePath);
            console.error("Error: ", e.message);
        }
    }

    return config;
}

/**
 * Get a local config object.
 * @param {Config} helper The configuration helper to use.
 * @param {string} directory the directory to start looking for a local config
 * @returns {Object} the local config object (empty object if there is no local config)
 */
function getLocalConfig(helper, directory) {
    var localConfigFile = helper.findLocalConfigFile(directory),
        config = {};

    /* istanbul ignore else Too complicated to create unittest*/
    if (localConfigFile) {
        config = loadConfig(localConfigFile);
    }

    return config;
}

//------------------------------------------------------------------------------
// API
//------------------------------------------------------------------------------

/**
 * Config
 * @constructor
 * @class Config
 * @param {Object} options Options to be passed in
 * @param {string} [cwd] current working directory. Defaults to process.cwd()
 */
function Config(options) {
    var useConfig;
    options = options || {};

    this.cache = {};
    this.exclusionsCache = {};
    this.baseConfig = require(path.resolve(__dirname, "..", "conf", "eslint.json"));
    this.baseConfig.format = options.format;
    useConfig = options.config;

    if (useConfig) {
        this.useSpecificConfig = loadConfig(path.resolve(process.cwd(), useConfig));
    }
}

/**
 * Build a config object merging the base config (conf/eslint.json), the
 * environments config (conf/environments.json) and eventually the user config.
 * @param {string} filePath a file in whose directory we start looking for a local config
 * @returns {Object} config object
 */
Config.prototype.getConfig = function (filePath) {
    var config,
        userConfig,
        envConfig = {},
        directory = filePath ? path.dirname(filePath) : process.eslintCwd || process.cwd();

    config = this.cache[directory];

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
 * @param {Object} base the base config
 * @param {Object} custom the custom config
 * @returns {Object} the merged config
 */
Config.prototype.mergeConfigs = function (base, custom) {
    return util.mergeConfigs(base, custom);
};

/**
 * Process given directory or file and cache ignore file if there's any
 * @param {string} directory The path to file or directory
 * @returns {void}
 */
Config.prototype.cacheExclusions = function(directory) {
    //check if there's an ignore file in the current directory and load it
    var exclusions = this.exclusionsCache[directory],
        me = this;

    if (!exclusions) {
        exclusions = loadIgnoreFile(directory);
        if (exclusions.length > 0) {
            //resolve globs and cache them
            exclusions.forEach(function(pattern) {
                if (pattern !== "") {
                    var matches = glob.sync(pattern, { cwd: directory });
                    if (matches) {
                        me.exclusionsCache[directory] = matches.map(function(match) { return path.resolve(directory, match); });
                    }
                }
            });
        }
    }
};

/**
 * Check if the current file should not be processed
 * @param {string} filePath file path
 * @returns {boolean} if the file should be excluded
 */
Config.prototype.checkForExclusion = function(filePath) {
    return Object.keys(this.exclusionsCache).some(function(directory) {
        return this.exclusionsCache[directory].some(function(file) {
            return file === filePath;
        });
    }, this);
};

/**
 * Find a local config file, relative to a specified directory.
 * @param {string} directory the directory to start searching from
 * @returns {string|boolean} returns path of config file if found, or false if no config is found
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
