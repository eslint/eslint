/**
 * @fileoverview Responsible for loading config files
 * @author Seth McLaughlin
 * @copyright 2014 Nicholas C. Zakas. All rights reserved.
 * @copyright 2013 Seth McLaughlin. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var fs = require("fs"),
    path = require("path"),
    environments = require("../conf/environments.json"),
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

var CONFIG_FILENAME = ".eslintrc",
    PERSONAL_CONFIG_PATH = path.join(userHome, CONFIG_FILENAME);

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
 * Load configuration for all plugins provided.
 * @param {string[]} pluginNames An array of plugin names which should be loaded.
 * @returns {Object} all plugin configurations merged together
 */
function getPluginsConfig(pluginNames) {
    var pluginConfig = {};
    if (pluginNames) {
        pluginNames.forEach(function (pluginName) {
            var pluginNameWithoutPrefix = util.removePluginPrefix(pluginName),
                plugin = {},
                rules = {};
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
 * Get personal config object from ~/.eslintrc.
 * @returns {Object} the personal config object (empty object if there is no personal config)
 * @private
 */
function getPersonalConfig() {
    var config = {};

    if (fs.existsSync(PERSONAL_CONFIG_PATH)) {
        debug("Using personal config");
        config = loadConfig(PERSONAL_CONFIG_PATH);
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
    var localConfigFile,
        config = {},
        parentDirectory,
        found = false;

    while ((localConfigFile = helper.findLocalConfigFile(directory))) {
        // don't automatically merge the personal config settings
        if (localConfigFile === PERSONAL_CONFIG_PATH) {
            break;
        }

        found = true;

        debug("Using " + localConfigFile);
        config = util.mergeConfigs(loadConfig(localConfigFile), config);

        parentDirectory = path.dirname(directory);
        if (directory === parentDirectory) {
            break;
        }

        directory = parentDirectory;
    }

    if (!found) {
        config = util.mergeConfigs(config, getPersonalConfig());
    }

    return config;
}

/**
 * Creates an environment config based on the specified environments.
 * @param {Object<string,boolean>} envs The environment settings.
 * @param {boolean} reset The value of the command line reset option. If true,
 *      rules are not automatically merged into the config.
 * @returns {Object} A configuration object with the appropriate rules and globals
 *      set.
 * @private
 */
function createEnvironmentConfig(envs, reset) {

    var envConfig = {
        globals: {},
        env: envs || {},
        rules: {}
    };

    if (envs) {
        Object.keys(envs).filter(function (name) {
            return envs[name];
        }).forEach(function(name) {
            var environment = environments[name];
            if (environment) {
                if (!reset && environment.rules) {
                    assign(envConfig.rules, environment.rules);
                }

                if (environment.globals) {
                    assign(envConfig.globals, environment.globals);
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
 * environments config (conf/environments.json) and eventually the user config.
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

    // Step 1: Determine user-specified config from .eslintrc files
    if (this.useEslintrc) {
        debug("Using .eslintrc files");
        userConfig = getLocalConfig(this, directory);
    } else {
        debug("Not using .eslintrc files");
        userConfig = {};
    }

    // Step 2: Create a copy of the baseConfig
    config = util.mergeConfigs({}, this.baseConfig);

    // Step 3: Merge in environment-specific globals and rules from .eslintrc files
    config = util.mergeConfigs(config, createEnvironmentConfig(userConfig.env, this.options.reset));

    // Step 4: Merge in the user-specified configuration from .eslintrc files
    config = util.mergeConfigs(config, userConfig);

    // Step 5: Merge in command line config file
    if (this.useSpecificConfig) {
        debug("Merging command line config file");
        config = util.mergeConfigs(config, this.useSpecificConfig);

        if (this.useSpecificConfig.env) {
            config = util.mergeConfigs(config, createEnvironmentConfig(this.useSpecificConfig.env, this.options.reset));
        }
    }

    // Step 6: Merge in command line environments
    if (this.env) {
        debug("Merging command line environment settings");
        config = util.mergeConfigs(config, createEnvironmentConfig(this.env, this.options.reset));
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
 * Find a local config file, relative to a specified directory.
 * @param {string} directory the directory to start searching from
 * @returns {string|boolean} path of config file if found, or false if no config is found
 */
Config.prototype.findLocalConfigFile = function (directory) {
    if (!this.localConfigFinder) {
        this.localConfigFinder = new FileFinder(CONFIG_FILENAME);
    }
    return this.localConfigFinder.findInDirectory(directory);
};


module.exports = Config;
