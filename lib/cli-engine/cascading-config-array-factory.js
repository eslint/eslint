/**
 * @fileoverview `CascadingConfigArrayFactory` class.
 *
 * `CascadingConfigArrayFactory` class has a responsibility:
 *
 * 1. Handles cascading of config files.
 *
 * It provides two methods:
 *
 * - `getConfigArrayForFile(filePath)`
 *     Get the corresponded configuration of a given file. This method doesn't
 *     throw even if the given file didn't exist.
 * - `clearCache()`
 *     Clear the internal cache. You have to call this method when
 *     `additionalPluginPool` was updated if `baseConfig` or `cliConfig` depends
 *     on the additional plugins. (`CLIEngine#addPlugin()` method calls this.)
 *
 * @author Toru Nagashima <https://github.com/mysticatea>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const os = require("os");
const path = require("path");
const { validateConfigArray } = require("../shared/config-validator");
const { ConfigArrayFactory } = require("./config-array-factory");
const { ConfigArray, ConfigDependency } = require("./config-array");
const loadRules = require("./load-rules");
const debug = require("debug")("eslint:cascading-config-array-factory");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

// Define types for VSCode IntelliSense.
/** @typedef {import("../shared/types").ConfigData} ConfigData */
/** @typedef {import("../shared/types").Parser} Parser */
/** @typedef {import("../shared/types").Plugin} Plugin */
/** @typedef {ReturnType<ConfigArrayFactory["create"]>} ConfigArray */

/**
 * @typedef {Object} CascadingConfigArrayFactoryOptions
 * @property {Map<string,Plugin>} [additionalPluginPool] The map for additional plugins.
 * @property {ConfigData} [baseConfig] The config by `baseConfig` option.
 * @property {ConfigData} [cliConfig] The config by CLI options (`--env`, `--global`, `--parser`, `--parser-options`, `--plugin`, and `--rule`). CLI options overwrite the setting in config files.
 * @property {string} [cwd] The base directory to start lookup.
 * @property {string[]} [rulePaths] The value of `--rulesdir` option.
 * @property {string} [specificConfigPath] The value of `--config` option.
 * @property {boolean} [useEslintrc] if `false` then it doesn't load config files.
 */

/**
 * @typedef {Object} CascadingConfigArrayFactoryInternalSlots
 * @property {Map<string, ConfigArray>} baseConfigArrayCache The cache from the plugin base path to the config array of `baseConfig` option.
 * @property {ConfigData} baseConfigData The config data of `baseConfig` option.
 * @property {Map<string, ConfigArray>} cliConfigArrayCache The cache from the plugin base path to the config array of CLI options.
 * @property {ConfigData} cliConfigData The config data of CLI options.
 * @property {ConfigArrayFactory} configArrayFactory The factory for config arrays.
 * @property {Map<string, ConfigArray>} configCache The cache to config arrays. Each key is the concatenate of plugin base path and directory path.
 * @property {string} cwd The base directory to start lookup.
 * @property {WeakMap<ConfigArray, ConfigArray>} finalizeCache The cache from config arrays to finalized config arrays.
 * @property {Map<string, string>} pluginBasePathCache The cache from directory paths to plugin base paths.
 * @property {string[]|null} rulePaths The value of `--rulesdir` option.
 * @property {string|null} specificConfigPath The value of `--config` option.
 * @property {boolean} useEslintrc if `false` then it doesn't load config files.
 */

/** @type {WeakMap<CascadingConfigArrayFactory, CascadingConfigArrayFactoryInternalSlots>} */
const internalSlotsMap = new WeakMap();

/**
 * The error type when there are files matched by a glob, but all of them have been ignored.
 */
class ConfigurationNotFoundError extends Error {

    // eslint-disable-next-line jsdoc/require-description
    /**
     * @param {string} directoryPath The directory path.
     */
    constructor(directoryPath) {
        super(`No ESLint configuration found in ${directoryPath}.`);
        this.messageTemplate = "no-config-found";
        this.messageData = { directoryPath };
    }
}

/**
 * This class provides the functionality that enumerates every file which is
 * matched by given glob patterns and that configuration.
 */
class CascadingConfigArrayFactory {

    /**
     * Initialize this enumerator.
     * @param {CascadingConfigArrayFactoryOptions} options The options.
     */
    constructor({
        additionalPluginPool = new Map(),
        baseConfig: baseConfigData = null,
        cliConfig: cliConfigData = null,
        cwd = process.cwd(),
        resolvePluginsRelativeTo,
        rulePaths = [],
        specificConfigPath = null,
        useEslintrc = true
    } = {}) {
        const additionalPluginBasePaths = [
            resolvePluginsRelativeTo,
            specificConfigPath && path.dirname(specificConfigPath)
        ].filter(Boolean);

        internalSlotsMap.set(this, {
            baseConfigArrayCache: new Map(),
            baseConfigData,
            cliConfigArrayCache: new Map(),
            cliConfigData,
            configArrayFactory: new ConfigArrayFactory({
                additionalPluginBasePaths,
                additionalPluginPool,
                cwd
            }),
            configCache: new Map(),
            cwd,
            finalizeCache: new WeakMap(),
            pluginBasePathCache: new Map(),
            rulePaths,
            specificConfigPath,
            useEslintrc
        });
    }

    /**
     * The path to the current working directory.
     * This is used by tests.
     * @type {string}
     */
    get cwd() {
        const { cwd } = internalSlotsMap.get(this);

        return cwd;
    }

    /**
     * Get the config array of a given file.
     * If `filePath` was not given, it returns the config which contains only
     * `baseConfigData` and `cliConfigData`.
     * @param {string} [filePath] The file path to a file.
     * @returns {ConfigArray} The config array of the file.
     */
    getConfigArrayForFile(filePath) {
        const { cwd } = internalSlotsMap.get(this);

        if (!filePath) {
            return new ConfigArray(
                ...this._getBaseConfigArray(void 0),
                ...this._getCLIConfigArray(void 0)
            );
        }

        const directoryPath = path.dirname(path.resolve(cwd, filePath));

        debug("Load config files for %O.", directoryPath);
        return this._finalizeConfigArray(
            this._loadConfigInAncestors(directoryPath, void 0),
            directoryPath
        );
    }

    /**
     * Clear config cache.
     * @returns {void}
     */
    clearCache() {
        const {
            baseConfigArrayCache,
            cliConfigArrayCache,
            configCache,
            pluginBasePathCache
        } = internalSlotsMap.get(this);

        baseConfigArrayCache.clear();
        cliConfigArrayCache.clear();
        configCache.clear();
        pluginBasePathCache.clear();
    }

    /**
     * Load and normalize config files from the ancestor directories.
     * @param {string} directoryPath The path to a leaf directory.
     * @param {string|undefined} providedPluginBasePath The current base path to find plugins.
     * @returns {ConfigArray} The loaded config.
     * @private
     */
    _loadConfigInAncestors(directoryPath, providedPluginBasePath) {
        const {
            configArrayFactory,
            configCache,
            cwd,
            pluginBasePathCache,
            useEslintrc
        } = internalSlotsMap.get(this);

        if (!useEslintrc) {
            return this._getBaseConfigArray(void 0);
        }

        let pluginBasePath =
            providedPluginBasePath || pluginBasePathCache.get(directoryPath);
        let cacheKey = pluginBasePath && `${pluginBasePath};${directoryPath}`;
        let configArray = cacheKey && configCache.get(cacheKey);

        // Hit cache.
        if (configArray) {
            debug("Cache hit: %O", cacheKey);
            return configArray;
        }
        debug("No cache found: %O", cacheKey);

        const homePath = os.homedir();

        // Consider this is root.
        if (directoryPath === homePath && cwd !== homePath) {
            debug("Stop traversing because of considered root.");
            return this._cacheConfig(
                cacheKey,
                this._getBaseConfigArray(pluginBasePath)
            );
        }

        // Load the config on this directory.
        try {
            configArray = configArrayFactory.loadInDirectory(directoryPath, {
                pluginBasePath: pluginBasePath || directoryPath
            });
        } catch (error) {
            /* istanbul ignore next */
            if (error.code === "EACCES") {
                debug("Stop traversing because of 'EACCES' error.");
                return this._cacheConfig(
                    cacheKey,
                    this._getBaseConfigArray(pluginBasePath)
                );
            }
            throw error;
        }
        const configFileFound = configArray.length > 0;

        if (configFileFound) {
            debug("Config file found at %O.", directoryPath);
        }

        // Determine `pluginBasePath` if it's the first found.
        if (configFileFound && !pluginBasePath) {
            pluginBasePathCache.set(directoryPath, directoryPath);
            pluginBasePath = directoryPath;
            cacheKey = `${pluginBasePath};${directoryPath}`;
            debug("Determine the plugin base path %O.", pluginBasePath);
        }

        if (configFileFound && configArray.isRoot()) {
            debug("Stop traversing because of 'root:true'.");
            configArray.unshift(...this._getBaseConfigArray(pluginBasePath));
            return this._cacheConfig(cacheKey, configArray);
        }

        // Load from the ancestors and merge it.
        const parentPath = path.dirname(directoryPath);
        const parentConfigArray = parentPath && parentPath !== directoryPath
            ? this._loadConfigInAncestors(parentPath, pluginBasePath)
            : this._getBaseConfigArray(pluginBasePath);

        if (configFileFound) {
            configArray.unshift(...parentConfigArray);
        } else {
            configArray = parentConfigArray;
        }

        // Determine `pluginBasePath` if not yet.
        if (!pluginBasePath) {
            pluginBasePathCache.set(directoryPath, configArray.pluginBasePath);
            pluginBasePath = configArray.pluginBasePath;
            cacheKey = `${pluginBasePath};${directoryPath}`;
            debug("Determine the plugin base path %O.", pluginBasePath);
        }

        // Cache and return.
        return this._cacheConfig(cacheKey, configArray);
    }

    /**
     * Freeze and cache a given config.
     * @param {string|undefined} cacheKey The cache key. If this is undefined then doesn't cache the config array.
     * @param {ConfigArray} configArray The config array as a cache value.
     * @returns {ConfigArray} The `configArray` (frozen).
     */
    _cacheConfig(cacheKey, configArray) {
        if (cacheKey) {
            const { configCache } = internalSlotsMap.get(this);

            configCache.set(cacheKey, configArray);
            debug("Cached: %O", cacheKey);
        }

        Object.freeze(configArray);
        return configArray;
    }

    /**
     * Finalize a given config array.
     * Concatenate `--config` and other CLI options.
     * @param {ConfigArray} configArray The config array of config files.
     * @param {string} directoryPath The path to the leaf directory to find config files.
     * @returns {ConfigArray} The loaded config.
     * @private
     */
    _finalizeConfigArray(configArray, directoryPath) {
        const {
            configArrayFactory,
            finalizeCache,
            useEslintrc
        } = internalSlotsMap.get(this);

        let finalConfigArray = finalizeCache.get(configArray);

        if (!finalConfigArray) {
            finalConfigArray = configArray;

            const { pluginBasePath } = configArray;
            const cliConfigArray = this._getCLIConfigArray(pluginBasePath);

            // Load the personal config if there are no regular config files.
            if (
                useEslintrc &&
                configArray.every(c => !c.filePath) &&
                cliConfigArray.every(c => !c.filePath) // `--config` option can be a file.
            ) {
                debug("Loading the config file of the home directory.");
                const personalConfigArray = configArrayFactory.loadInDirectory(
                    os.homedir(),
                    { name: "PersonalConfig", pluginBasePath }
                );

                finalConfigArray = finalConfigArray.concat(personalConfigArray);
                finalConfigArray.pluginBasePath = pluginBasePath;
            }

            // Apply CLI options.
            if (cliConfigArray.length > 0) {
                finalConfigArray = finalConfigArray.concat(cliConfigArray);
                finalConfigArray.pluginBasePath = pluginBasePath;
            }

            // Validate rule settings and environments.
            validateConfigArray(finalConfigArray);

            // Cache it.
            Object.freeze(finalConfigArray);
            finalizeCache.set(configArray, finalConfigArray);

            debug(
                "Configuration was determined: %O on %O",
                finalConfigArray,
                directoryPath
            );
        }

        if (useEslintrc && finalConfigArray.length === 0) {
            throw new ConfigurationNotFoundError(directoryPath);
        }

        return finalConfigArray;
    }

    /**
     * Get or create the config array of the base config.
     * @param {string|undefined} pluginBasePath The base path to find plugins.
     * @returns {ConfigArray} The config array of the base config.
     */
    _getBaseConfigArray(pluginBasePath) {
        const {
            baseConfigArrayCache,
            baseConfigData,
            configArrayFactory,
            cwd,
            rulePaths
        } = internalSlotsMap.get(this);
        let baseConfigArray = baseConfigArrayCache.get(pluginBasePath);

        if (!baseConfigArray) {
            baseConfigArray = configArrayFactory.create(
                baseConfigData,
                { name: "BaseConfig", pluginBasePath }
            );

            if (rulePaths && rulePaths.length > 0) {

                /*
                 * Load rules `--rulesdir` option as a pseudo plugin.
                 * Use a pseudo plugin to define rules of `--rulesdir`, so we can
                 * validate the rule's options with only information in the config
                 * array.
                 */
                baseConfigArray.push({
                    name: "--rulesdir",
                    filePath: "",
                    plugins: {
                        "": new ConfigDependency({
                            definition: {
                                rules: rulePaths.reduce(
                                    (map, rulesPath) => Object.assign(
                                        map,
                                        loadRules(rulesPath, cwd)
                                    ),
                                    {}
                                )
                            },
                            filePath: "",
                            id: "",
                            importerName: "--rulesdir",
                            importerPath: ""
                        })
                    }
                });
            }

            Object.freeze(baseConfigArray);
            baseConfigArrayCache.set(pluginBasePath, baseConfigArray);
        }

        return baseConfigArray;
    }

    /**
     * Get or create the config array of CLI options.
     * @param {string|undefined} pluginBasePath The base path to find plugins.
     * @returns {ConfigArray} The config array of CLI options.
     */
    _getCLIConfigArray(pluginBasePath) {
        const {
            cliConfigArrayCache,
            cliConfigData,
            configArrayFactory,
            specificConfigPath
        } = internalSlotsMap.get(this);
        let cliConfigArray = cliConfigArrayCache.get(pluginBasePath);

        if (!cliConfigArray) {
            cliConfigArray = configArrayFactory.create(
                cliConfigData,
                { name: "CLIOptions", pluginBasePath }
            );

            if (specificConfigPath) {
                cliConfigArray.unshift(
                    ...configArrayFactory.loadFile(
                        specificConfigPath,
                        { name: "--config", pluginBasePath }
                    )
                );
            }

            Object.freeze(cliConfigArray);
            cliConfigArrayCache.set(pluginBasePath, cliConfigArray);
        }

        return cliConfigArray;
    }
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = { CascadingConfigArrayFactory };
