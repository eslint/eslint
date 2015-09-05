/**
 * @fileoverview Responsible for loading config files
 * @author Seth McLaughlin
 * @copyright 2014 Nicholas C. Zakas. All rights reserved.
 * @copyright 2013 Seth McLaughlin. All rights reserved.
 * @copyright 2014 Michael McLaughlin. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var fs = require("fs"),
    path = require("path"),
    environments = require("../conf/environments"),
    util = require("./util"),
    FileFinder = require("./file-finder"),
    stripComments = require("strip-json-comments"),
    assign = require("object-assign"),
    debug = require("debug"),
    yaml = require("js-yaml"),
    userHome = require("user-home"),
    isAbsolutePath = require("path-is-absolute"),
    isResolvable = require("is-resolvable"),
    validator = require("./config-validator"),
    pathIsInside = require("path-is-inside");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var LOCAL_CONFIG_FILENAME = ".eslintrc",
    PACKAGE_CONFIG_FILENAME = "package.json",
    PACKAGE_CONFIG_FIELD_NAME = "eslintConfig",
    PERSONAL_CONFIG_PATH = userHome ? path.join(userHome, LOCAL_CONFIG_FILENAME) : null;

//------------------------------------------------------------------------------
// Private
//------------------------------------------------------------------------------

var loadedPlugins = Object.create(null);

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
function readConfigFromFile(filePath) {
    var config = {};

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

        config = util.mergeConfigs(config, require(filePath));
    }
    return config;
}

/**
 * Load and parse a JSON config object from a file.
 * @param {string|Object} configToLoad the path to the JSON config file or the config object itself.
 * @returns {Object} the parsed config object (empty object if there was a parse error)
 * @private
 */
function loadConfig(configToLoad) {
    var config = {};
    var filePath = "";

    if (configToLoad) {

        if (isObject(configToLoad)) {
            config = configToLoad;
        } else {
            filePath = configToLoad;
            config = readConfigFromFile(filePath);
        }

        validator.validate(config, filePath);

        // If an `extends` property is defined, it represents a configuration file to use as
        // a "parent". Load the referenced file and merge the configuration recursively.
        if (config.extends) {
            var configExtends = config.extends;

            if (!Array.isArray(config.extends)) {
                configExtends = [config.extends];
            }

            // Make the last element in an array take the highest precedence
            config = configExtends.reduceRight(function(previousValue, parentPath) {

                if (parentPath === "eslint:recommended") {
                    // Add an explicit substitution for eslint:recommended to conf/eslint.json
                    // this lets us use the eslint.json file as the recommended rules
                    parentPath = path.resolve(__dirname, "../conf/eslint.json");
                } else if (isFilePath(parentPath)) {
                    // If the `extends` path is relative, use the directory of the current configuration
                    // file as the reference point. Otherwise, use as-is.
                    parentPath = (!isAbsolutePath(parentPath) ?
                        path.join(path.dirname(filePath), parentPath) :
                        parentPath
                    );
                }

                try {
                    return util.mergeConfigs(loadConfig(parentPath), previousValue);
                } catch (e) {
                    // If the file referenced by `extends` failed to load, add the path to the
                    // configuration file that referenced it to the error message so the user is
                    // able to see where it was referenced from, then re-throw
                    e.message += "\nReferenced from: " + filePath;
                    throw e;
                }

            }, config);

        }


    }


    return config;
}

/**
 * Load configuration for all plugins provided.
 * @param {string[]} pluginNames An array of plugin names which should be loaded.
 * @returns {Object} all plugin configurations merged together
 */
function getPluginsConfig(pluginNames) {
    var pluginConfig = {};

    pluginNames.forEach(function(pluginName) {
        var pluginNamespace = util.getNamespace(pluginName),
            pluginNameWithoutNamespace = util.removeNameSpace(pluginName),
            pluginNameWithoutPrefix = util.removePluginPrefix(pluginNameWithoutNamespace),
            plugin = {},
            rules = {};

        if (!loadedPlugins[pluginNameWithoutPrefix]) {
            try {
                plugin = require(pluginNamespace + util.PLUGIN_NAME_PREFIX + pluginNameWithoutPrefix);
                loadedPlugins[pluginNameWithoutPrefix] = plugin;
            } catch (err) {
                debug("Failed to load plugin configuration for " + pluginNameWithoutPrefix + ". Proceeding without it.");
                plugin = { rulesConfig: {}};
            }
        } else {
            plugin = loadedPlugins[pluginNameWithoutPrefix];
        }

        if (!plugin.rulesConfig) {
            plugin.rulesConfig = {};
        }

        Object.keys(plugin.rulesConfig).forEach(function(item) {
            rules[pluginNameWithoutPrefix + "/" + item] = plugin.rulesConfig[item];
        });

        pluginConfig = util.mergeConfigs(pluginConfig, rules);
    });

    return {rules: pluginConfig};
}

/**
 * Get personal config object from ~/.eslintrc.
 * @returns {Object} the personal config object (empty object if there is no personal config)
 * @private
 */
function getPersonalConfig() {
    var config = {};

    if (PERSONAL_CONFIG_PATH && fs.existsSync(PERSONAL_CONFIG_PATH)) {
        debug("Using personal config");
        config = loadConfig(PERSONAL_CONFIG_PATH);
    }

    return config;
}

/**
 * Get a local config object.
 * @param {Object} thisConfig A Config object.
 * @param {string} directory The directory to start looking in for a local config file.
 * @returns {Object} The local config object, or an empty object if there is no local config.
 */
function getLocalConfig(thisConfig, directory) {
    var found,
        i,
        localConfig,
        localConfigFile,
        config = {},
        localConfigFiles = thisConfig.findLocalConfigFiles(directory),
        numFiles = localConfigFiles.length,
        rootPath;

    for (i = 0; i < numFiles; i++) {

        localConfigFile = localConfigFiles[i];

        // Don't consider the personal config file in the home directory.
        if (localConfigFile === PERSONAL_CONFIG_PATH) {
            continue;
        }

        // If root flag is set, don't consider file if it is above root
        if (rootPath && !pathIsInside(path.dirname(localConfigFile), rootPath)) {
            continue;
        }

        debug("Loading " + localConfigFile);
        localConfig = loadConfig(localConfigFile);

        // Don't consider a local config file found if the config is empty.
        if (!Object.keys(localConfig).length) {
            continue;
        }

        // Check for root flag
        if (localConfig.root === true) {
            rootPath = path.dirname(localConfigFile);
        }

        found = true;
        debug("Using " + localConfigFile);
        config = util.mergeConfigs(localConfig, config);
    }

    // Use the personal config file if there are no other local config files found.
    return found ? config : util.mergeConfigs(config, getPersonalConfig());
}

/**
 * Creates an environment config based on the specified environments.
 * @param {Object<string,boolean>} envs The environment settings.
 * @returns {Object} A configuration object with the appropriate rules and globals
 *      set.
 * @private
 */
function createEnvironmentConfig(envs) {

    var envConfig = {
        globals: {},
        env: envs || {},
        rules: {},
        ecmaFeatures: {}
    };

    if (envs) {
        Object.keys(envs).filter(function(name) {
            return envs[name];
        }).forEach(function(name) {
            var environment = environments[name];

            if (environment) {

                if (environment.globals) {
                    assign(envConfig.globals, environment.globals);
                }

                if (environment.ecmaFeatures) {
                    assign(envConfig.ecmaFeatures, environment.ecmaFeatures);
                }
            }
        });
    }

    return envConfig;
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

    this.ignore = options.ignore;
    this.ignorePath = options.ignorePath;
    this.cache = {};
    this.parser = options.parser;

    this.baseConfig = options.baseConfig ? loadConfig(options.baseConfig) : { rules: {} };

    this.useEslintrc = (options.useEslintrc !== false);

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

    useConfig = options.configFile;
    this.options = options;

    if (useConfig) {
        debug("Using command line config " + useConfig);
        if (isResolvable(useConfig) || isResolvable("eslint-config-" + useConfig) || useConfig.charAt(0) === "@") {
            this.useSpecificConfig = loadConfig(useConfig);
        } else {
            this.useSpecificConfig = loadConfig(path.resolve(process.cwd(), useConfig));
        }
    }
}

/**
 * Build a config object merging the base config (conf/eslint.json), the
 * environments config (conf/environments.js) and eventually the user config.
 * @param {string} filePath a file in whose directory we start looking for a local config
 * @returns {Object} config object
 */
Config.prototype.getConfig = function(filePath) {
    var config,
        userConfig,
        directory = filePath ? path.dirname(filePath) : process.cwd(),
        pluginConfig;

    debug("Constructing config for " + (filePath ? filePath : "text"));

    config = this.cache[directory];

    if (config) {
        debug("Using config from cache");
        return config;
    }

    // Step 1: Determine user-specified config from .eslintrc and package.json files
    if (this.useEslintrc) {
        debug("Using .eslintrc and package.json files");
        userConfig = getLocalConfig(this, directory);
    } else {
        debug("Not using .eslintrc or package.json files");
        userConfig = {};
    }

    // Step 2: Create a copy of the baseConfig
    config = util.mergeConfigs({parser: this.parser}, this.baseConfig);

    // Step 3: Merge in environment-specific globals and rules from .eslintrc files
    config = util.mergeConfigs(config, createEnvironmentConfig(userConfig.env));

    // Step 4: Merge in the user-specified configuration from .eslintrc and package.json
    config = util.mergeConfigs(config, userConfig);

    // Step 5: Merge in command line config file
    if (this.useSpecificConfig) {
        debug("Merging command line config file");

        if (this.useSpecificConfig.env) {
            config = util.mergeConfigs(config, createEnvironmentConfig(this.useSpecificConfig.env));
        }

        config = util.mergeConfigs(config, this.useSpecificConfig);
    }

    // Step 6: Merge in command line environments
    debug("Merging command line environment settings");
    config = util.mergeConfigs(config, createEnvironmentConfig(this.env));

    // Step 7: Merge in command line rules
    if (this.options.rules) {
        debug("Merging command line rules");
        config = util.mergeConfigs(config, { rules: this.options.rules });
    }

    // Step 8: Merge in command line globals
    config = util.mergeConfigs(config, { globals: this.globals });

    // Step 9: Merge in command line plugins
    if (this.options.plugins) {
        debug("Merging command line plugins");
        pluginConfig = getPluginsConfig(this.options.plugins);
        config = util.mergeConfigs(config, { plugins: this.options.plugins });
    }

    // Step 10: Merge in plugin specific rules in reverse
    if (config.plugins) {
        pluginConfig = getPluginsConfig(config.plugins);
        config = util.mergeConfigs(pluginConfig, config);
    }

    this.cache[directory] = config;

    return config;
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
