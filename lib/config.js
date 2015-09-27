/**
 * @fileoverview Responsible for loading config files
 * @author Seth McLaughlin
 * @copyright 2014 Nicholas C. Zakas. All rights reserved.
 * @copyright 2013 Seth McLaughlin. All rights reserved.
 * @copyright 2014 Michael McLaughlin. All rights reserved.
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var fs = require("fs"),
    path = require("path"),
    FileFinder = require("./file-finder"),
    stripComments = require("strip-json-comments"),
    assign = require("object-assign"),
    debug = require("debug"),
    yaml = require("js-yaml"),
    userHome = require("user-home"),
    isAbsolutePath = require("path-is-absolute"),
    isResolvable = require("is-resolvable"),
    validator = require("./config-validator"),
    pathIsInside = require("path-is-inside"),
    CascadingConfigData = require("./cascading-config-data");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var LOCAL_CONFIG_FILENAME = ".eslintrc",
    PACKAGE_CONFIG_FILENAME = "package.json",
    PACKAGE_CONFIG_FIELD_NAME = "eslintConfig",
    PERSONAL_CONFIG_PATH = userHome ? path.join(userHome, LOCAL_CONFIG_FILENAME) : null;

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

debug = debug("eslint:config");

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
 * Check if item is an javascript object
 * @param {*} item object to check for
 * @returns {boolean} True if its an object
 * @private
 */
function isObject(item) {
    return typeof item === "object" && !Array.isArray(item) && item !== null;
}

/**
 * Read the config from the config JSON file
 * @param {string} filePath the path to the JSON config file
 * @returns {Object} config object
 * @private
 */
function loadRawConfigData(filePath) {
    var config;

    if (isFilePath(filePath)) {
        try {
            config = yaml.safeLoad(stripComments(fs.readFileSync(filePath, "utf8"))) || {};
        } catch (e) {
            debug("Error reading YAML file: " + filePath);
            e.message = "Cannot read config file: " + filePath + "\nError: " + e.message;
            throw e;
        }

        if (path.basename(filePath) === PACKAGE_CONFIG_FILENAME) {
            config = config[PACKAGE_CONFIG_FIELD_NAME] || {};
        }
    } else {
        // it's a package

        if (filePath.charAt(0) === "@") {
            // it's a scoped package

            // package name is "eslint-config", or just a username
            var scopedPackageShortcutRegex = /^(@[^\/]+)(?:\/(?:eslint-config)?)?$/;
            if (scopedPackageShortcutRegex.test(filePath)) {
                filePath = filePath.replace(scopedPackageShortcutRegex, "$1/eslint-config");
            } else if (filePath.split("/")[1].indexOf("eslint-config-") !== 0) {
                // for scoped packages, insert the eslint-config after the first /
                filePath = filePath.replace(/^@([^\/]+)\/(.*)$/, "@$1/eslint-config-$2");
            }
        } else if (filePath.indexOf("eslint-config-") !== 0) {
            filePath = "eslint-config-" + filePath;
        }

        config = require(filePath);
    }

    validator.validate(config, filePath);

    return Object.freeze(assign({}, config, {filePath: filePath}));
}

/**
 * The type of a loader to handle "extends" option.
 * @typedef {{load: function(filePath: string): CascadingConfigData}} Loader
 */

/**
 * Load and parse a JSON config object from a file.
 *
 * @param {Loader|CascadingConfigData} loaderOrUpperCascadingConfigData -
 *      A loader or parent CascadingConfigData object.
 * @param {string|object} configToLoad - the path to the JSON config file or
 *      the config object itself.
 * @returns {CascadingConfigData} the loaded CascadingConfigData object.
 * @private
 */
function loadCascadingConfigData(
    loaderOrUpperCascadingConfigData,
    configToLoad
) {
    if (!configToLoad) {
        return null;
    }

    // Resolves overloading.
    var loader, upperCascadingConfigData, userSpecificConfig, terminalConfig;
    if (typeof loaderOrUpperCascadingConfigData.load === "function") {
        upperCascadingConfigData = null;
        loader = loaderOrUpperCascadingConfigData;
        userSpecificConfig = null;
        terminalConfig = null;
    } else {
        upperCascadingConfigData = loaderOrUpperCascadingConfigData;
        loader = upperCascadingConfigData.loader;
        userSpecificConfig = upperCascadingConfigData.userSpecificConfig;
        terminalConfig = upperCascadingConfigData.terminalConfig;
    }

    // Decides a raw config.
    var config;
    if (isObject(configToLoad)) {
        config = configToLoad;
        validator.validate(config, config.filePath || "");
    } else {
        config = loadRawConfigData(configToLoad);
    }

    // Creates a config object which has inheritance information.
    var cascadingConfigData = new CascadingConfigData(
        loader,
        upperCascadingConfigData,
        config,
        userSpecificConfig,
        terminalConfig);

    // Done!
    return cascadingConfigData;
}

/**
 * Load and parse a JSON config object from a file.
 *
 * @param {object} cache - A string-CascadingConfigData map to cache.
 * @param {Loader|CascadingConfigData} loaderOrUpperCascadingConfigData -
 *      A loader or parent CascadingConfigData object.
 * @param {string} filePath - the path to the JSON config file.
 * @returns {CascadingConfigData} the loaded CascadingConfigData object.
 * @private
 */
function getOrLoadCascadingConfigData(
    cache,
    loaderOrUpperCascadingConfigData,
    filePath
) {
    if (cache[filePath]) {
        debug("Cache Hit " + filePath);
        return cache[filePath];
    }

    debug("Store Cache " + filePath);
    cache[filePath] = loadCascadingConfigData(
        loaderOrUpperCascadingConfigData,
        filePath);

    return cache[filePath];
}

/**
 * Creates a loader object.
 * This object is used to load "extends" option.
 * @param {object} cache - A string-CascadingConfigData map to cache.
 * @returns {Loader} The created loader object.
 */
function createLoader(cache) {
    var loader = {};
    loader.load = getOrLoadCascadingConfigData.bind(loader, cache, loader);

    return loader;
}

/**
 * Get personal config object from ~/.eslintrc.
 * @param {Object} thisConfig A Config object.
 * @returns {Object|null} the personal config object
 * @private
 */
function getPersonalConfig(thisConfig) {
    if (PERSONAL_CONFIG_PATH && fs.existsSync(PERSONAL_CONFIG_PATH)) {
        debug("Using personal config");

        return getOrLoadCascadingConfigData(
            thisConfig.cache,
            thisConfig.baseConfig,
            PERSONAL_CONFIG_PATH
        );
    }

    return null;
}

/**
 * Get a local config object.
 * @param {Config} thisConfig - A Config object.
 * @param {string} directory - The directory to start looking in for a local
 *      config file.
 * @returns {CascadingConfigData} The local config object.
 */
function getLocalConfig(thisConfig, directory) {
    var cache = thisConfig.cache;
    var localConfigFiles = thisConfig.findLocalConfigFiles(directory);
    var projectConfigPath = path.join(process.cwd(), LOCAL_CONFIG_FILENAME);
    var rootPath = null;
    var baseConfigData = thisConfig.baseConfig;
    var stackToLoad = [];
    var rawData = null;

    // Detects the config file this should use.
    for (var i = 0; i < localConfigFiles.length; ++i) {
        var localConfigFilePath = localConfigFiles[i];

        // Don't consider the personal config file in the home directory,
        // except if the home directory is the same as the current working
        // directory
        if (localConfigFilePath === PERSONAL_CONFIG_PATH &&
            localConfigFilePath !== projectConfigPath
        ) {
            continue;
        }

        // If root flag is set, don't consider file if it is above root
        if (rootPath &&
            !pathIsInside(path.dirname(localConfigFilePath), rootPath)
        ) {
            break;
        }

        // Checks cache.
        if (cache[localConfigFilePath]) {
            debug("Cache Hit " + localConfigFilePath);
            if (stackToLoad.length === 0) {
                return cache[localConfigFilePath];
            }
            baseConfigData = cache[localConfigFilePath];
            break;
        }

        debug("Loading " + localConfigFilePath);
        rawData = loadRawConfigData(localConfigFilePath);

        // Don't consider a local config file found if the config is empty.
        // (there is a proeprty "rawData.filePath" always)
        if (Object.keys(rawData).length >= 2) {
            stackToLoad.push(rawData);

            // Check for root flag
            if (rawData.root === true) {
                rootPath = path.dirname(localConfigFilePath);
            }
        }
    }

    if (stackToLoad.length > 0) {
        // Constructs CascadingConfigData.
        do {
            rawData = stackToLoad.pop();

            debug("Store cache " + rawData.filePath);
            baseConfigData = cache[rawData.filePath] =
                loadCascadingConfigData(baseConfigData, rawData);
        } while (stackToLoad.length > 0);

        return baseConfigData;
    }

    // Use the personal config file if there are no other local config files
    // found.
    return getPersonalConfig(thisConfig) || baseConfigData;
}

//------------------------------------------------------------------------------
// API
//------------------------------------------------------------------------------

/**
 * Config
 * @constructor
 * @class Config
 * @param {Object} options Options to be passed in
 */
function Config(options) {
    this.options = options = options || {};
    this.ignore = options.ignore;
    this.ignorePath = options.ignorePath;
    this.parser = options.parser;
    this.useEslintrc = (options.useEslintrc !== false);

    // Converts the array to a map. (why aren't these local variables?)
    this.env = (options.envs || []).reduce(function(envs, name) {
        envs[name] = true;
        return envs;
    }, {});
    this.globals = (options.globals || []).reduce(function(globals, def) {
        // Default "foo" to false and handle "foo:false" and "foo:true"
        var parts = def.split(":");
        globals[parts[0]] = (parts.length > 1 && parts[1] === "true");
        return globals;
    }, {});

    // Reads a config raw data for the `--config` option.
    var configFile = options.configFile;
    if (configFile) {
        debug("Using command line config " + configFile);

        if (!isResolvable(configFile) &&
            !isResolvable("eslint-config-" + configFile) &&
            configFile.charAt(0) !== "@"
        ) {
            configFile = path.resolve(process.cwd(), configFile);
        }

        this.useSpecificConfig = loadRawConfigData(configFile);
    } else {
        this.useSpecificConfig = null;
    }

    // Makes a config raw data for CLI options.
    if (options.parser ||
        options.plugins ||
        options.envs ||
        options.rules ||
        options.globals
    ) {
        this.terminalConfig = {
            filePath: "",
            parser: options.parser,
            plugins: options.plugins,
            env: this.env,
            rules: options.rules,
            globals: this.globals
        };
        validator.validate(this.terminalConfig, "CLI Options");
    } else {
        this.terminalConfig = null;
    }

    // Creates the root Cascading config data.
    this.cache = Object.create(null);
    this.baseConfig = loadCascadingConfigData(
        createLoader(this.cache),
        options.baseConfig || {}
    );
    this.baseConfig.userSpecificConfig = this.useSpecificConfig;
    this.baseConfig.terminalConfig = this.terminalConfig;
}

/**
 * Build a config object merging the base config (conf/eslint.json), the
 * environments config (conf/environments.js) and eventually the user config.
 * @param {string} filePath a file in whose directory we start looking for a local config
 * @returns {Object} config object
 */
Config.prototype.getConfig = function(filePath) {
    debug("Constructing config for " + (filePath ? filePath : "text"));

    var directory = filePath ? path.dirname(filePath) : process.cwd();
    var config = this.cache[directory];

    if (config) {
        debug("Using config from cache");
    } else if (this.useEslintrc) {
        debug("Using config from local");
        config = this.cache[directory] = getLocalConfig(this, directory);
    } else {
        debug("Using base config");
        config = this.baseConfig;
    }

    return assign({}, config.value);
};

/**
 * Find local config files from directory and parent directories.
 * @param {string} directory The directory to start searching from.
 * @returns {string[]} The paths of local config files found.
 */
Config.prototype.findLocalConfigFiles = function(directory) {
    if (!this.localConfigFinder) {
        this.localConfigFinder = new FileFinder(LOCAL_CONFIG_FILENAME, PACKAGE_CONFIG_FILENAME);
    }

    return this.localConfigFinder.findAllInDirectoryAndParents(directory);
};

module.exports = Config;
