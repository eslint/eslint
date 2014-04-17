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
 * Load and parse exclusions from the file
 * @param {string} filePath The path to ignore file.
 * @returns {string[]} An array of paths to exclude or an empty array.
 */
function loadIgnoreFile(filePath) {
    var exclusions = [],
        text;

    if (filePath) {

        // Read .eslintignore file
        try {
            text = fs.readFileSync(filePath, "utf8");
            try {

                // Attempt to parse as JSON (deprecated)
                exclusions = JSON.parse(text);
            } catch (e) {

                // Prefer plain text, one path per line
                exclusions = text.split("\n");
            }
        } catch (e) {
            /* istanbul ignore next Error handling doesn't need tests*/
            throw new Error("Could not load local " + ESLINT_IGNORE_FILENAME + " file: " + filePath);
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

/**
 * Get an exclusions list
 * @param  {Config} helper    The configuration helper to use.
 * @param  {string} directory The directory to start looking for ignore file
 * @returns {string[]}         An array of paths to exclude
 */
function getExclusions(helper, directory) {
    var file = helper.findIgnoreFile(directory),
        exclusions = [];
    /* istanbul ignore else Too complicated to create unittest*/
    if (file) {
        exclusions = loadIgnoreFile(file);
    }

    return exclusions;
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

    config = this.mergeConfigs(Object.create(this.baseConfig), envConfig);
    config = this.mergeConfigs(config, userConfig);
    config = this.mergeConfigs(config, { globals: this.globals });

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
        exclusions = getExclusions(this, directory);
        if (exclusions.length > 0) {
            //resolve globs and cache them
            me.exclusionsCache[directory] = exclusions.reduce(function(cache, pattern) {
                if (pattern) {
                    var matches = glob.sync(pattern, { cwd: directory });
                    if (matches) {
                        cache = cache.concat(matches.map(function(match) { return path.resolve(directory, match); }));
                    }
                }
                return cache;
            }, []);
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
    if (!this.localConfigFinder) {
        this.localConfigFinder = new FileFinder(LOCAL_CONFIG_FILENAME);
    }
    return this.localConfigFinder.findInDirectory(directory);
};

/**
 * Find a ignore file, relative to a specified directory.
 * @param {string} directory the directory to start searching from
 * @returns {string|boolean} returns path of ignore file if found, or false if no ignore is found
 */
Config.prototype.findIgnoreFile = function (directory) {
    if (!this.ignoreFileFinder) {
        this.ignoreFileFinder = new FileFinder(ESLINT_IGNORE_FILENAME);
    }
    return this.ignoreFileFinder.findInDirectory(directory);
};


module.exports = Config;
