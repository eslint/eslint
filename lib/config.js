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
    FileFinder = require("./file-finder"),
    stripComments = require("strip-json-comments"),
    yaml = require("js-yaml");


//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var LOCAL_CONFIG_FILENAME = ".eslintrc";


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

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
            e.message = "Cannot read config file: " + filePath + "\nError: " + e.message;
            throw e;
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
    var localConfigFile,
        config = {},
        parentDirectory;

    while ((localConfigFile = helper.findLocalConfigFile(directory))) {
        config = util.mergeConfigs(loadConfig(localConfigFile), config);

        parentDirectory = path.dirname(directory);
        if (directory === parentDirectory) {
            break;
        }
        directory = parentDirectory;
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

    this.ignore = options.ignore;
    this.ignorePath = options.ignorePath;

    this.cache = {};
    this.baseConfig = options.reset ? { rules: {} } :
            require(path.resolve(__dirname, "..", "conf", "eslint.json"));
    this.baseConfig.format = options.format;
    this.useEslintrc = (options.eslintrc !== false);
    this.env = options.env;
    this.globals = (options.global || []).reduce(function (globals, def) {
        // Default "foo" to false and handle "foo:false" and "foo:true"
        var parts = def.split(":");
        globals[parts[0]] = (parts.length > 1 && parts[1] === "true");
        return globals;
    }, {});
    useConfig = options.config;
    this.options = options;

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
    } else if (this.useEslintrc) {
        userConfig = getLocalConfig(this, directory);
    } else {
        userConfig = {};
    }

    // Add cli-supplied environments
    if (this.env) {
        if (!userConfig.env) {
            userConfig.env = {};
        }
        this.env.forEach(function (env) {
            userConfig.env[env] = true;
        });
    }

    if (userConfig.env && !this.options.reset) {
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

    config = this.mergeConfigs({}, this.baseConfig);
    config = this.mergeConfigs(config, envConfig);
    config = this.mergeConfigs(config, userConfig);
    config = this.mergeConfigs(config, { globals: this.globals });

    if (this.options.rule) {
        config = this.mergeConfigs(config, { rules: this.options.rule });
    }

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
 * Find a local config file, relative to a specified directory.
 * @param {string} directory the directory to start searching from
 * @returns {string|boolean} path of config file if found, or false if no config is found
 */
Config.prototype.findLocalConfigFile = function (directory) {
    if (!this.localConfigFinder) {
        this.localConfigFinder = new FileFinder(LOCAL_CONFIG_FILENAME);
    }
    return this.localConfigFinder.findInDirectory(directory);
};


module.exports = Config;
