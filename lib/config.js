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
    userHome = require("user-home");

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
 * Load and parse a JSON config object from a file.
 * @param {string} filePath the path to the JSON config file
 * @returns {Object} the parsed config object (empty object if there was a parse error)
 */
function loadConfig(filePath) {
    var config = {};

    if (filePath) {
        try {
            config = yaml.safeLoad(stripComments(fs.readFileSync(filePath, "utf8"))) || {};
        } catch (e) {
            e.message = "Cannot read config file: " + filePath + "\nError: " + e.message;
            throw e;
        }
    }

    return config;
}

/**
 * Loads plugin from node_modules or cache
 * @param {string} pluginNameWithoutPrefix Name of the plugin without prefix
 * @returns {Object} Plugin definition
 */
function loadPlugin(pluginNameWithoutPrefix) {
    var plugin;
    if (!loadedPlugins[pluginNameWithoutPrefix]) {
        try {
            plugin = require(util.PLUGIN_NAME_PREFIX + pluginNameWithoutPrefix);
            loadedPlugins[pluginNameWithoutPrefix] = plugin;
        } catch(err) {
            debug("Failed to load plugin configuration for " + pluginNameWithoutPrefix + ". Proceeding without it.");
            plugin = { rulesConfig: {}};
        }
    } else {
        plugin = loadedPlugins[pluginNameWithoutPrefix];
    }
    return plugin;
}

/**
 * Load configuration for all plugins provided.
 * @param {string[]} pluginNames An array of plugin names which should be loaded.
 * @returns {Object} All plugin configurations merged together
 */
function getPluginsConfig(pluginNames) {
    var pluginConfig = {};

    if (pluginNames) {
        pluginNames.forEach(function(pluginName) {
            var pluginNameWithoutPrefix = util.removePluginPrefix(pluginName),
                plugin = {},
                rules = {};

            plugin = loadPlugin(pluginNameWithoutPrefix);

            if (!plugin.rulesConfig) {
                plugin.rulesConfig = {};
            }

            Object.keys(plugin.rulesConfig).forEach(function(item) {
                rules[pluginNameWithoutPrefix + "/" + item] = plugin.rulesConfig[item];
            });

            pluginConfig = util.mergeConfigs(pluginConfig, rules);
        });
    }

    return {rules: pluginConfig};
}

/**
 * Load environments for all plugins provided.
 * @param {string[]} pluginNames An array of plugin names with should be loaded.
 * @returns {Object} All plugin environments merged together
 */
function getPluginsEnvironments(pluginNames) {
    var pluginEnvironments = {};

    if (pluginNames) {
        pluginNames.forEach(function(pluginName) {
            var pluginNameWithoutPrefix = util.removePluginPrefix(pluginName),
                plugin = {},
                customEnvironments = {};

            plugin = loadPlugin(pluginNameWithoutPrefix);

            if (!plugin.environments) {
                plugin.environments = {};
            }

            Object.keys(plugin.environments).forEach(function(item) {
                customEnvironments[pluginNameWithoutPrefix + "/" + item] = plugin.environments[item];
            });

            pluginEnvironments = util.mergeConfigs(pluginEnvironments, customEnvironments);
        });
    }

    return pluginEnvironments;
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
        numFiles = localConfigFiles.length;

    for (i = 0; i < numFiles; i++) {
        localConfigFile = localConfigFiles[i];
        localConfig = loadConfig(localConfigFile);

        if (path.basename(localConfigFile) !== LOCAL_CONFIG_FILENAME) {

            // Don't consider a local config file found if the package.json doesn't have the eslintConfig field.
            if (!localConfig.hasOwnProperty(PACKAGE_CONFIG_FIELD_NAME)) {
                continue;
            }
            localConfig = localConfig[PACKAGE_CONFIG_FIELD_NAME] || {};
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
 * @param {boolean} reset The value of the command line reset option. If true,
 *      rules are not automatically merged into the config.
 * @param {string[]} plugins A list of plugins to load.
 * @returns {Object} A configuration object with the appropriate rules and globals
 *      set.
 * @private
 */
function createEnvironmentConfig(envs, reset, plugins) {

    var envConfig = {
            globals: {},
            env: envs || {},
            rules: {},
            ecmaFeatures: {}
        },
        environmentsCopy = util.mergeConfigs({}, environments);

    if (plugins) {
        environmentsCopy = util.mergeConfigs(environmentsCopy, getPluginsEnvironments(plugins));
    }

    if (envs) {
        Object.keys(envs).filter(function (name) {
            return envs[name];
        }).forEach(function(name) {
            var environment = environmentsCopy[name];

            if (environment) {

                if (!reset && environment.rules) {
                    assign(envConfig.rules, environment.rules);
                }

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

    this.baseConfig = options.reset ? { rules: {} } :
            require(path.resolve(__dirname, "..", "conf", "eslint.json"));

    this.baseConfig.format = options.format;
    this.useEslintrc = (options.useEslintrc !== false);

    this.env = (options.envs || []).reduce(function (envs, name) {
        envs[name] = true;
        return envs;
    }, {});

    this.globals = (options.globals || []).reduce(function (globals, def) {
        // Default "foo" to false and handle "foo:false" and "foo:true"
        var parts = def.split(":");
        globals[parts[0]] = (parts.length > 1 && parts[1] === "true");
        return globals;
    }, {});

    useConfig = options.configFile;
    this.options = options;

    if (useConfig) {
        debug("Using command line config " + useConfig);
        this.useSpecificConfig = loadConfig(path.resolve(process.cwd(), useConfig));
    }
}

/**
 * Build a config object merging the base config (conf/eslint.json), the
 * environments config (conf/environments.js) and eventually the user config.
 * @param {string} filePath a file in whose directory we start looking for a local config
 * @returns {Object} config object
 */
Config.prototype.getConfig = function (filePath) {
    var config,
        userConfig,
        directory = filePath ? path.dirname(filePath) : process.cwd(),
        pluginConfig;

    debug("Constructing config for " + filePath);

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
    config = util.mergeConfigs({}, this.baseConfig);

    // Step 3: Merge in environment-specific globals and rules from .eslintrc files
    config = util.mergeConfigs(config, createEnvironmentConfig(userConfig.env, this.options.reset, userConfig.plugins));

    // Step 4: Merge in the user-specified configuration from .eslintrc and package.json
    config = util.mergeConfigs(config, userConfig);

    // Step 5: Merge in command line config file
    if (this.useSpecificConfig) {
        debug("Merging command line config file");

        if (this.useSpecificConfig.env) {
            config = util.mergeConfigs(config, createEnvironmentConfig(this.useSpecificConfig.env, this.options.reset, this.useSpecificConfig.plugins));
        }

        config = util.mergeConfigs(config, this.useSpecificConfig);
    }

    // Step 6: Merge in command line environments
    if (this.env) {
        debug("Merging command line environment settings");
        config = util.mergeConfigs(config, createEnvironmentConfig(this.env, this.options.reset, this.plugins));
    }

    // Step 7: Merge in command line rules
    if (this.options.rules) {
        debug("Merging command line rules");
        config = util.mergeConfigs(config, { rules: this.options.rules });
    }

    // Step 8: Merge in command line globals
    config = util.mergeConfigs(config, { globals: this.globals });


    // Step 9: Merge in plugin specific rules in reverse
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
Config.prototype.findLocalConfigFiles = function (directory) {

    if (!this.localConfigFinder) {
        this.localConfigFinder = new FileFinder(LOCAL_CONFIG_FILENAME, PACKAGE_CONFIG_FILENAME);
    }

    return this.localConfigFinder.findAllInDirectoryAndParents(directory);
};

module.exports = Config;
