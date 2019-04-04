/**
 * @fileoverview Responsible for loading config files
 * @author Seth McLaughlin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const path = require("path"),
    os = require("os"),
    ConfigOps = require("./config/config-ops"),
    ConfigFile = require("./config/config-file"),
    ConfigCache = require("./config/config-cache"),
    Plugins = require("./config/plugins"),
    FileFinder = require("./util/file-finder"),
    relativeModuleResolver = require("./util/relative-module-resolver");

const debug = require("debug")("eslint:config");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

const PERSONAL_CONFIG_DIR = os.homedir();
const SUBCONFIG_SEP = ":";

// A string which is not a valid config filepath, used to index a `baseConfig` object in the cache.
const BASE_CONFIG_FILEPATH_CACHE_KEY = "";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Determines if any rules were explicitly passed in as options.
 * @param {Object} options The options used to create our configuration.
 * @returns {boolean} True if rules were passed in as options, false otherwise.
 * @private
 */
function hasRules(options) {
    return options.rules && Object.keys(options.rules).length > 0;
}

//------------------------------------------------------------------------------
// API
//------------------------------------------------------------------------------

/**
 * Configuration class
 */
class Config {

    /**
     * @param {Object} providedOptions Options to be passed in
     * @param {Linter} linterContext Linter instance object
     */
    constructor(providedOptions, linterContext) {
        const options = providedOptions || {};

        this.linterContext = linterContext;
        this.options = options;

        /*
         * `Linter#getRules` is slow, but a rule map is needed for every config file processed.
         * Cache the rule map and keep it up to date.
         */
        this.ruleMap = new Map(linterContext.getRules());
        this.plugins = new Plugins(linterContext.environments, {
            defineRule: (ruleId, rule) => {
                linterContext.defineRule(ruleId, rule);
                this.ruleMap.set(ruleId, rule);
            },
            pluginRootPath: this.options.cwd
        });
        this.ignore = options.ignore;
        this.ignorePath = options.ignorePath;
        this.parser = options.parser;
        this.parserOptions = options.parserOptions || {};

        this.configCache = new ConfigCache();
        this._rootConfigReferencePath = path.join(this.options.cwd, "__placeholder__.js");

        this.baseConfig = options.baseConfig
            ? ConfigFile.loadObject(this, {
                config: options.baseConfig,
                filePath: path.join(this.options.cwd, "__baseConfig_placeholder_filename__.js"),
                configFullName: "(Provided base config)"
            })
            : { rules: {} };
        this.configCache.setConfig(BASE_CONFIG_FILEPATH_CACHE_KEY, this.baseConfig);

        this.useEslintrc = (options.useEslintrc !== false);

        this.env = (options.envs || []).reduce((envs, name) => {
            envs[name] = true;
            return envs;
        }, {});

        /*
         * Handle declared globals.
         * For global variable foo, handle "foo:false" and "foo:true" to set
         * whether global is writable.
         * If user declares "foo", convert to "foo:false".
         */
        this.globals = (options.globals || []).reduce((globals, def) => {
            const parts = def.split(SUBCONFIG_SEP);

            globals[parts[0]] = (parts.length > 1 && parts[1] === "true");

            return globals;
        }, {});

        this.loadSpecificConfig(options.configFile);

        // Empty values in configs don't merge properly
        const cliConfigOptions = {
            env: this.env,
            rules: this.options.rules,
            globals: this.globals,
            parserOptions: this.parserOptions,
            plugins: this.options.plugins
        };

        this.cliConfig = {};
        Object.keys(cliConfigOptions).forEach(configKey => {
            const value = cliConfigOptions[configKey];

            if (value) {
                this.cliConfig[configKey] = value;
            }
        });
    }

    getPluginRootPath() {
        return this.options.cwd;
    }

    /**
     * Loads the config options from a config specified on the command line, relative to the CWD.
     * @param {string} [config] A shareable named config or path to a config file.
     * @returns {void}
     */
    loadSpecificConfig(config) {
        if (config) {
            debug(`Using command line config ${config}`);
            const resolvedPath = path.resolve(this.options.cwd, config);

            this.specificConfigInfo = {
                filePath: resolvedPath,
                config: ConfigFile.load(
                    resolvedPath,
                    this,
                    this._rootConfigReferencePath
                )
            };
        }
    }

    /**
     * Gets the personal config object from user's home directory.
     * @returns {Object} the personal config object (null if there is no personal config)
     * @private
     */
    getPersonalConfig() {
        if (typeof this.personalConfig === "undefined") {
            let config;
            const filename = ConfigFile.getFilenameForDirectory(PERSONAL_CONFIG_DIR);

            if (filename) {
                debug("Using personal config");
                config = ConfigFile.load(filename, this, this._rootConfigReferencePath);
            }

            this.personalConfig = config ? { config, filePath: filename } : null;
        }

        return this.personalConfig;
    }

    /**
     * Builds a hierarchy of config objects, including the base config, all local configs from the directory tree,
     * and a config file specified on the command line, if applicable.
     * @param {string} directory a file in whose directory we start looking for a local config
     * @returns {{filePath: (string|null), config: Config}[]} The config objects, in ascending order of precedence
     * @private
     */
    getConfigHierarchy(directory) {
        debug(`Constructing config file hierarchy for ${directory}`);

        // Step 1: Always include baseConfig
        let configs = [{ filePath: BASE_CONFIG_FILEPATH_CACHE_KEY, config: this.baseConfig }];

        // Step 2: Add user-specified config from .eslintrc.* and package.json files
        if (this.useEslintrc) {
            debug("Using .eslintrc and package.json files");
            configs = configs.concat(this.getLocalConfigHierarchy(directory));
        } else {
            debug("Not using .eslintrc or package.json files");
        }

        // Step 3: Merge in command line config file
        if (this.specificConfigInfo) {
            debug("Using command line config file");
            configs.push(this.specificConfigInfo);
        }

        return configs;
    }

    /**
     * Gets a list of config objects extracted from local config files that apply to the current directory, in
     * descending order, beginning with the config that is highest in the directory tree.
     * @param {string} directory The directory to start looking in for local config files.
     * @returns {Object[]} The shallow local config objects, in ascending order of precedence (closest to the current
     * directory at the end), or an empty array if there are no local configs.
     * @private
     */
    getLocalConfigHierarchy(directory) {
        const localConfigFiles = this.findLocalConfigFiles(directory),
            projectConfigPath = ConfigFile.getFilenameForDirectory(this.options.cwd),
            searched = [],
            configs = [];

        for (const localConfigFile of localConfigFiles) {
            const localConfigDirectory = path.dirname(localConfigFile);
            const localConfigHierarchyCache = this.configCache.getHierarchyLocalConfigs(localConfigDirectory);

            if (localConfigHierarchyCache) {
                const localConfigHierarchy = localConfigHierarchyCache.concat(configs);

                this.configCache.setHierarchyLocalConfigs(searched, localConfigHierarchy);
                return localConfigHierarchy;
            }

            /*
             * Don't consider the personal config file in the home directory,
             * except if the home directory is the same as the current working directory
             */
            if (localConfigDirectory === PERSONAL_CONFIG_DIR && localConfigFile !== projectConfigPath) {
                continue;
            }

            debug(`Loading ${localConfigFile}`);
            const localConfig = ConfigFile.load(localConfigFile, this, this._rootConfigReferencePath);

            // Ignore empty config files
            if (!localConfig) {
                continue;
            }

            debug(`Using ${localConfigFile}`);
            configs.unshift({ filePath: localConfigFile, config: localConfig });
            searched.push(localConfigDirectory);

            // Stop traversing if a config is found with the root flag set
            if (localConfig.root) {
                break;
            }
        }

        if (!configs.length && !this.specificConfigInfo) {

            // Fall back on the personal config from ~/.eslintrc
            debug("Using personal config file");
            const personalConfig = this.getPersonalConfig();

            if (personalConfig) {
                configs.unshift(personalConfig);
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

        // Set the caches for the parent directories
        this.configCache.setHierarchyLocalConfigs(searched, configs);

        return configs;
    }

    /**
     * Gets the vector of applicable configs and subconfigs from the hierarchy for a given file. A vector is an array of
     * entries, each of which in an object specifying a config file path and an array of override indices corresponding
     * to entries in the config file's overrides section whose glob patterns match the specified file path; e.g., the
     * vector entry { configFile: '/home/john/app/.eslintrc', matchingOverrides: [0, 2] } would indicate that the main
     * project .eslintrc file and its first and third override blocks apply to the current file.
     * @param {string} sourceFilePath The file path for which to build the hierarchy and config vector.
     * @returns {Array<Object>} config vector applicable to the specified path
     * @private
     */
    getConfigVector(sourceFilePath) {
        const directory = sourceFilePath ? path.dirname(sourceFilePath) : this.options.cwd;

        return this.getConfigHierarchy(directory).map(({ config, filePath }) => {
            const vectorEntry = {
                filePath,
                matchingOverrides: []
            };

            if (config.overrides) {
                const relativePath = path.relative(
                    filePath
                        ? path.dirname(filePath)
                        : this.options.cwd,
                    sourceFilePath || directory
                );

                config.overrides.forEach((override, i) => {
                    if (ConfigOps.pathMatchesGlobs(relativePath, override.files, override.excludedFiles)) {
                        vectorEntry.matchingOverrides.push(i);
                    }
                });
            }

            return vectorEntry;
        });
    }

    /**
     * Finds local config files from the specified directory and its parent directories.
     * @param {string} directory The directory to start searching from.
     * @returns {GeneratorFunction} The paths of local config files found.
     */
    findLocalConfigFiles(directory) {
        if (!this.localConfigFinder) {
            this.localConfigFinder = new FileFinder(ConfigFile.CONFIG_FILES, this.options.cwd);
        }

        return this.localConfigFinder.findAllInDirectoryAndParents(directory);
    }

    /**
     * Builds the authoritative config object for the specified file path by merging the hierarchy of config objects
     * that apply to the current file, including the base config (conf/eslint-recommended), the user's personal config
     * from their homedir, all local configs from the directory tree, any specific config file passed on the command
     * line, any configuration overrides set directly on the command line, and finally the environment configs
     * (conf/environments).
     * @param {string} filePath a file in whose directory we start looking for a local config
     * @returns {Object} config object
     */
    getConfig(filePath) {
        const vector = this.getConfigVector(filePath);
        let config = this.configCache.getMergedConfig(vector);

        if (config) {
            debug("Using config from cache");
            return config;
        }

        // Step 1: Merge in the filesystem configurations (base, local, and personal)
        config = ConfigOps.getConfigFromVector(vector, this.configCache);

        // Step 2: Merge in command line configurations
        config = ConfigOps.merge(config, this.cliConfig);

        if (this.cliConfig.plugins) {
            this.plugins.loadAll(this.cliConfig.plugins);
        }

        /*
         * Step 3: Override parser only if it is passed explicitly through the command line
         */
        if (this.parser) {
            config = ConfigOps.merge(config, { parser: relativeModuleResolver(this.parser, this._rootConfigReferencePath) });
        }

        // Step 4: Apply environments to the config
        config = ConfigOps.applyEnvironments(config, this.linterContext.environments);

        this.configCache.setMergedConfig(vector, config);

        return config;
    }
}

module.exports = Config;
