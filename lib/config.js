/**
 * @fileoverview Responsible for loading config files
 * @author Seth McLaughlin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const path = require("path"),
    ConfigOps = require("./config/config-ops"),
    ConfigFile = require("./config/config-file"),
    Plugins = require("./config/plugins"),
    FileFinder = require("./file-finder"),
    userHome = require("user-home"),
    isResolvable = require("is-resolvable"),
    pathIsInside = require("path-is-inside"),
    minimatch = require("minimatch");

const debug = require("debug")("eslint:config");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

const PERSONAL_CONFIG_DIR = userHome || null;
const VECTOR_SEP = ",";
const SUBCONFIG_SEP = ":";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

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
 * Load and parse a JSON config object from a file.
 * @param {string|Object} configToLoad the path to the JSON config file or the config object itself.
 * @returns {Object} the parsed config object (empty object if there was a parse error)
 * @private
 */
function loadConfig(configToLoad) {
    let config = {},
        filePath = "";

    if (configToLoad) {

        if (isObject(configToLoad)) {
            config = configToLoad;

            if (config.extends) {
                config = ConfigFile.applyExtends(config, filePath);
            }
        } else {
            filePath = configToLoad;
            config = ConfigFile.load(filePath);
            if (config) {
                config.filePath = filePath;
                config.baseDirectory = path.dirname(filePath);
            }
        }

    }

    return config;
}

/**
 * Determine if rules were explicitly passed in as options.
 * @param {Object} options The options used to create our configuration.
 * @returns {boolean} True if rules were passed in as options, false otherwise.
 * @private
 */
function hasRules(options) {
    return options.rules && Object.keys(options.rules).length > 0;
}


/**
 * Helper to run iterative glob matching.
 * @param {string|string[]} filePaths The file paths to test patterns against
 * @param {string|string[]} patterns Glob patterns, match against results of previous pattern
 * @returns {string[]|null} The matching filePaths, null otherwise.
 * @private
 */
function matchFiles(filePaths, patterns) {
    filePaths = [].concat(filePaths);
    patterns = [].concat(patterns);
    for (const pattern of patterns) {
        filePaths = minimatch.match(filePaths, pattern, {matchBase: true});
        if (!filePaths.length) {
            return null;
        }
    }
    return filePaths;
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
    options = options || {};

    this.options = options;
    this.ignore = options.ignore;
    this.ignorePath = options.ignorePath;
    this.cache = {};
    this.mergedCache = {};
    this.vectorConfigCache = {};
    this.fileHierarchyCache = {};
    this.localHierarchyCache = {};
    this.parser = options.parser;
    this.parserOptions = options.parserOptions || {};

    this.baseConfig = options.baseConfig ? ConfigOps.merge({}, this.loadConfig(options.baseConfig)) : { rules: {} };
    this.baseConfig.filePath = "";
    this.baseConfig.baseDirectory = this.options.cwd;
    this.cache[this.baseConfig.filePath] = this.baseConfig;
    this.vectorConfigCache[this.baseConfig.filePath] = this.baseConfig;

    this.useEslintrc = (options.useEslintrc !== false);

    this.env = (options.envs || []).reduce(function(envs, name) {
        envs[name] = true;
        return envs;
    }, {});

    /*
     * Handle declared globals.
     * For global variable foo, handle "foo:false" and "foo:true" to set
     * whether global is writable.
     * If user declares "foo", convert to "foo:false".
     */
    this.globals = (options.globals || []).reduce(function(globals, def) {
        const parts = def.split(SUBCONFIG_SEP);

        globals[parts[0]] = (parts.length > 1 && parts[1] === "true");

        return globals;
    }, {});

    let useConfig = options.configFile;

    if (useConfig) {
        debug("Using command line config " + useConfig);
        if (!(isResolvable(useConfig) || isResolvable("eslint-config-" + useConfig) || useConfig.charAt(0) === "@")) {
            useConfig = path.resolve(this.options.cwd, useConfig);
        }
        this.useSpecificConfig = this.loadConfig(useConfig);
    }

    if (this.options.plugins) {
        Plugins.loadAll(this.options.plugins);
    }

    // Empty values in configs don't merge properly
    const cliConfigOptions = {
        env: this.env,
        rules: this.options.rules,
        globals: this.globals,
        parserOptions: this.parserOptions,
        plugins: this.options.plugins
    };

    this.cliConfig = {};
    Object.keys(cliConfigOptions).forEach(function(configKey) {
        const value = cliConfigOptions[configKey];

        if (value) {
            this.cliConfig[configKey] = value;
        }
    }, this);
}

/**
 * Cached version of loadConfig helper that caches when a path is passed.
 * @param {string|Object} configToLoad the path to the JSON config file or the config object itself.
 * @returns {Object} the parsed config object loaded from cache (empty object if there was a parse error)
 * @private
 */
Config.prototype.loadConfig = function(configToLoad) {
    if (typeof configToLoad !== "string") {
        return loadConfig(configToLoad);
    }

    const filePath = configToLoad;
    let config = this.cache[filePath];

    if (!config) {
        config = this.cache[filePath] = loadConfig(filePath);
    }
    return config;
};

/**
 * Get personal config object from user's home directory
 * @returns {Object} the personal config object (null if there is no personal config)
 * @private
 */
Config.prototype.getPersonalConfig = function() {
    if (typeof this.personalConfig === "undefined") {
        let config;

        if (PERSONAL_CONFIG_DIR) {
            const filename = ConfigFile.getFilenameForDirectory(PERSONAL_CONFIG_DIR);

            if (filename) {
                debug("Using personal config");
                config = this.loadConfig(filename);
            }
        }
        this.personalConfig = config || null;
    }

    return this.personalConfig;
};

/**
 * Build a config hierarchy including the base config (conf/eslint.json), the
 * environments config (conf/environments.js) and eventually the user config.
 * @param {string} directory a file in whose directory we start looking for a local config
 * @returns {Object[]} The config objects
 * @private
 */
Config.prototype.getConfigHierarchy = function(directory) {
    let configs;

    debug("Constructing config file hierarchy for " + directory);

    // Step 1: Always include baseConfig
    configs = [ this.baseConfig ];

    // Step 2: Add user-specified config from .eslintrc.* and package.json files
    if (this.useEslintrc) {
        debug("Using .eslintrc and package.json files");
        configs = configs.concat(this.getLocalConfigHierarchy(directory));
    } else {
        debug("Not using .eslintrc or package.json files");
    }

    // Step 3: Merge in command line config file
    if (this.useSpecificConfig) {
        debug("Using command line config file");
        configs.push(this.useSpecificConfig);
    }

    return configs;
};

/**
 * Get the local config hierarchy for a given directory.
 * @param {string} directory The directory to start looking in for a local config file.
 * @returns {Object[]} The shallow local config objects, or an empty array if there are no local config.
 * @private
 */
Config.prototype.getLocalConfigHierarchy = function(directory) {
    const localConfigFiles = this.findLocalConfigFiles(directory),
        projectConfigPath = ConfigFile.getFilenameForDirectory(this.options.cwd),
        searched = [],
        configs = [];
    let rootPath,
        cache;

    for (let i = 0; i < localConfigFiles.length; i++) {
        const localConfigFile = localConfigFiles[i];
        const localConfigDirectory = path.dirname(localConfigFile);

        cache = this.localHierarchyCache[localConfigDirectory];
        if (cache) {
            break;
        }

        // Don't consider the personal config file in the home directory,
        // except if the home directory is the same as the current working directory
        if (localConfigDirectory === PERSONAL_CONFIG_DIR && localConfigFile !== projectConfigPath) {
            continue;
        }

        // If root flag is set, don't consider file if it is above root
        if (rootPath && !pathIsInside(path.dirname(localConfigFile), rootPath)) {
            continue;
        }

        debug("Loading " + localConfigFile);
        const localConfig = this.loadConfig(localConfigFile);

        // Ignore empty config files
        if (!localConfig) {
            continue;
        }

        // Check for root flag
        if (localConfig.root === true) {
            rootPath = path.dirname(localConfigFile);
        }

        debug("Using " + localConfigFile);
        configs.push(localConfig);
        searched.push(localConfigDirectory);
    }


    if (!configs.length && !cache && !this.useSpecificConfig) {

        // Fall back on the personal config from ~/.eslintrc
        debug("Using personal config file");
        const personalConfig = this.getPersonalConfig();

        if (personalConfig) {
            configs.push(personalConfig);
        } else if (!hasRules(this.options) && !this.options.baseConfig) {

            // No config file, no manual configuration, and no rules, so error.
            const noConfigError = new Error("No ESLint configuration found.");

            noConfigError.messageTemplate = "no-config-found";
            noConfigError.messageData = {
                directory,
                filesExamined: localConfigFiles
            };

            throw noConfigError;
        }
    }

    // Merged with any cached portion
    configs.reverse();
    cache = cache ? cache.concat(configs) : configs;

    // Set the caches for the parent directories
    for (let i = 0; i < searched.length; i++) {
        const localConfigDirectory = searched[i],
            subCache = cache.slice(0, cache.length - i);

        this.localHierarchyCache[localConfigDirectory] = subCache;
    }

    return cache;
};



/**
 * Get the vector of applicable configs from the hierarchy for a given file (glob matching occurs here).
 * @param {string} filePath The file path for which to build the hierarchy and config vector.
 * @returns {Array<number|string>} array of config file paths or nested override indices
 * @private
 */
Config.prototype.getConfigVector = function(filePath) {
    const directory = filePath ? path.dirname(filePath) : this.options.cwd,
        configs = this.getConfigHierarchy(directory),
        vector = [];

    for (const config of configs) {
        const overrides = config.overrides;

        vector.push(config.filePath);

        if (!overrides) {
            continue;
        }

        const relativePath = (filePath || directory).substr(config.baseDirectory.length + 1);

        for (let j = 0; j < overrides.length; j++) {
            if (matchFiles(relativePath, overrides[j].files)) {
                vector.push(j);
            }
        }
    }
    return vector;
};


/**
 * Merges all configurations for a given config vector
 * @param {Array} vector array of config file paths or relative override indices
 * @returns {Object} config object
 * @private
 */
Config.prototype.getConfigFromVector = function(vector) {

    // Extract matching configs
    let hash = vector.join(VECTOR_SEP),
        config,
        subConfigs,
        nearestCacheIndex = vector.length - 1;

    for (; nearestCacheIndex >= 0; nearestCacheIndex--) {
        config = this.vectorConfigCache[hash];
        if (config) {
            break;
        }
        hash = hash.substr(0, hash.length - String(vector[nearestCacheIndex]).length - 1);
    }

    if (config) {
        if (nearestCacheIndex === vector.length - 1) {
            return config;
        }
        debug("Using config from partial cache");

        // Get parent config if configKey is an override index
        if (typeof vector[nearestCacheIndex + 1] === "number") {

            // If the first non-cached vector is an override index, subConfigs needs to be set
            let parentConfigKey = vector[nearestCacheIndex];

            for (let i = nearestCacheIndex - 1; i >= 0 && typeof parentConfigKey !== "string"; i--) {
                parentConfigKey = vector[i];
            }
            subConfigs = this.cache[parentConfigKey].overrides;
        }
        hash += VECTOR_SEP;
    } else {
        config = {};
    }


    // Start from index of nearest cached config
    for (let i = nearestCacheIndex + 1; i < vector.length; i++) {
        const configKey = vector[i];
        let shallowConfig;

        hash += configKey;
        if (typeof configKey === "string") {
            shallowConfig = this.cache[configKey];
            subConfigs = shallowConfig.overrides;
        } else {
            shallowConfig = subConfigs[configKey];
        }
        config = ConfigOps.merge(config, shallowConfig);
        if (config.filePath) {
            delete config.filePath;
            delete config.baseDirectory;
        } else if (config.files) {
            delete config.files;
        }
        this.vectorConfigCache[hash] = config;
        hash += VECTOR_SEP;
    }

    return config;
};

/**
 * Find local config files from directory and parent directories.
 * @param {string} directory The directory to start searching from.
 * @returns {string[]} The paths of local config files found.
 * @private
 */
Config.prototype.findLocalConfigFiles = function(directory) {

    if (!this.localConfigFinder) {
        this.localConfigFinder = new FileFinder(ConfigFile.CONFIG_FILES, this.options.cwd);
    }

    return this.localConfigFinder.findAllInDirectoryAndParents(directory);
};

/**
 * Build a config object merging the base config (conf/eslint.json), the
 * environments config (conf/environments.js) and eventually the user config.
 * @param {string} filePath a file in whose directory we start looking for a local config
 * @returns {Object} config object
 */
Config.prototype.getConfig = function(filePath) {
    const vector = this.getConfigVector(filePath);
    const hash = vector.join(VECTOR_SEP);
    let config = this.mergedCache[hash];

    if (config) {
        debug("Using config from cache");
        return config;
    }

    // Step 1: Merge in the file configurations (base, local, personal & cli-specified)
    config = this.getConfigFromVector(vector);

    // Step 2: Merge in command line configurations
    config = ConfigOps.merge(config, this.cliConfig);

    // Step 3: Override parser only if it is passed explicitly through the command line
    // or if it's not defined yet (because the final object will at least have the parser key)
    if (this.parser || !config.parser) {
        config = ConfigOps.merge(config, {
            parser: this.parser
        });
    }

    // Step 4: Apply environments to the config if present
    if (config.env) {
        config = ConfigOps.applyEnvironments(config);
    }

    this.mergedCache[hash] = config;


    return config;
};

module.exports = Config;
