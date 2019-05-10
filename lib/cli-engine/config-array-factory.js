/**
 * @fileoverview The factory of `ConfigArray` objects.
 *
 * This class provides methods to create `ConfigArray` instance.
 *
 * - `create(configData, options)`
 *     Create a `ConfigArray` instance from a config data. This is to handle CLI
 *     options except `--config`.
 * - `loadFile(filePath, options)`
 *     Create a `ConfigArray` instance from a config file. This is to handle
 *     `--config` option. If the file was not found, throws the following error:
 *      - If the filename was `*.js`, a `MODULE_NOT_FOUND` error.
 *      - If the filename was `package.json`, an IO error or an
 *        `ESLINT_CONFIG_FIELD_NOT_FOUND` error.
 *      - Otherwise, an IO error such as `ENOENT`.
 * - `loadInDirectory(directoryPath, options)`
 *     Create a `ConfigArray` instance from a config file which is on a given
 *     directory. This tries to load `.eslintrc.*` or `package.json`. If not
 *     found, returns an empty `ConfigArray`.
 *
 * `ConfigArrayFactory` class has the responsibility that loads configuration
 * files, including loading `extends`, `parser`, and `plugins`. The created
 * `ConfigArray` instance has the loaded `extends`, `parser`, and `plugins`.
 *
 * But this class doesn't handle cascading. `CascadingConfigArrayFactory` class
 * handles cascading and hierarchy.
 *
 * @author Toru Nagashima <https://github.com/mysticatea>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const fs = require("fs");
const path = require("path");
const importFresh = require("import-fresh");
const stripComments = require("strip-json-comments");
const { validateConfigSchema } = require("../config/config-validator");
const { ConfigArray, ConfigDependency, OverrideTester } = require("./config-array");
const ModuleResolver = require("../util/relative-module-resolver");
const naming = require("../util/naming");
const debug = require("debug")("eslint:config-array-factory");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const eslintRecommendedPath = path.resolve(__dirname, "../../conf/eslint-recommended.js");
const eslintAllPath = path.resolve(__dirname, "../../conf/eslint-all.js");
const configFilenames = [
    ".eslintrc.js",
    ".eslintrc.yaml",
    ".eslintrc.yml",
    ".eslintrc.json",
    ".eslintrc",
    "package.json"
];

// Define types for VSCode IntelliSense.
/** @typedef {import("../util/types").ConfigData} ConfigData */
/** @typedef {import("../util/types").OverrideConfigData} OverrideConfigData */
/** @typedef {import("../util/types").Parser} Parser */
/** @typedef {import("../util/types").Plugin} Plugin */
/** @typedef {import("./config-array/config-dependency").DependentParser} DependentParser */
/** @typedef {import("./config-array/config-dependency").DependentPlugin} DependentPlugin */
/** @typedef {ConfigArray[0]} ConfigArrayElement */

/**
 * @typedef {Object} ConfigArrayFactoryOptions
 * @property {Map<string,Plugin>} [additionalPluginPool] The map for additional plugins.
 * @property {string} [cwd] The path to the current working directory.
 */

/**
 * @typedef {Object} ConfigArrayFactoryInternalSlots
 * @property {Map<string,Plugin>} additionalPluginPool The map for additional plugins.
 * @property {string} cwd The path to the current working directory.
 */

/** @type {WeakMap<ConfigArrayFactory, ConfigArrayFactoryInternalSlots>} */
const internalSlotsMap = new WeakMap();

/**
 * Check if a given string is a file path.
 * @param {string} nameOrPath A module name or file path.
 * @returns {boolean} `true` if the `nameOrPath` is a file path.
 */
function isFilePath(nameOrPath) {
    return (
        /^\.{1,2}[/\\]/u.test(nameOrPath) ||
        path.isAbsolute(nameOrPath)
    );
}

/**
 * Convenience wrapper for synchronously reading file contents.
 * @param {string} filePath The filename to read.
 * @returns {string} The file contents, with the BOM removed.
 * @private
 */
function readFile(filePath) {
    return fs.readFileSync(filePath, "utf8").replace(/^\ufeff/u, "");
}

/**
 * Loads a YAML configuration from a file.
 * @param {string} filePath The filename to load.
 * @returns {ConfigData} The configuration object from the file.
 * @throws {Error} If the file cannot be read.
 * @private
 */
function loadYAMLConfigFile(filePath) {
    debug(`Loading YAML config file: ${filePath}`);

    // lazy load YAML to improve performance when not used
    const yaml = require("js-yaml");

    try {

        // empty YAML file can be null, so always use
        return yaml.safeLoad(readFile(filePath)) || {};
    } catch (e) {
        debug(`Error reading YAML file: ${filePath}`);
        e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`;
        throw e;
    }
}

/**
 * Loads a JSON configuration from a file.
 * @param {string} filePath The filename to load.
 * @returns {ConfigData} The configuration object from the file.
 * @throws {Error} If the file cannot be read.
 * @private
 */
function loadJSONConfigFile(filePath) {
    debug(`Loading JSON config file: ${filePath}`);

    try {
        return JSON.parse(stripComments(readFile(filePath)));
    } catch (e) {
        debug(`Error reading JSON file: ${filePath}`);
        e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`;
        e.messageTemplate = "failed-to-read-json";
        e.messageData = {
            path: filePath,
            message: e.message
        };
        throw e;
    }
}

/**
 * Loads a legacy (.eslintrc) configuration from a file.
 * @param {string} filePath The filename to load.
 * @returns {ConfigData} The configuration object from the file.
 * @throws {Error} If the file cannot be read.
 * @private
 */
function loadLegacyConfigFile(filePath) {
    debug(`Loading legacy config file: ${filePath}`);

    // lazy load YAML to improve performance when not used
    const yaml = require("js-yaml");

    try {
        return yaml.safeLoad(stripComments(readFile(filePath))) || /* istanbul ignore next */ {};
    } catch (e) {
        debug("Error reading YAML file: %s\n%o", filePath, e);
        e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`;
        throw e;
    }
}

/**
 * Loads a JavaScript configuration from a file.
 * @param {string} filePath The filename to load.
 * @returns {ConfigData} The configuration object from the file.
 * @throws {Error} If the file cannot be read.
 * @private
 */
function loadJSConfigFile(filePath) {
    debug(`Loading JS config file: ${filePath}`);
    try {
        return importFresh(filePath);
    } catch (e) {
        debug(`Error reading JavaScript file: ${filePath}`);
        e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`;
        throw e;
    }
}

/**
 * Loads a configuration from a package.json file.
 * @param {string} filePath The filename to load.
 * @returns {ConfigData} The configuration object from the file.
 * @throws {Error} If the file cannot be read.
 * @private
 */
function loadPackageJSONConfigFile(filePath) {
    debug(`Loading package.json config file: ${filePath}`);
    try {
        const packageData = loadJSONConfigFile(filePath);

        if (!Object.hasOwnProperty.call(packageData, "eslintConfig")) {
            throw Object.assign(
                new Error("package.json file doesn't have 'eslintConfig' field."),
                { code: "ESLINT_CONFIG_FIELD_NOT_FOUND" }
            );
        }

        return packageData.eslintConfig;
    } catch (e) {
        debug(`Error reading package.json file: ${filePath}`);
        e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`;
        throw e;
    }
}

/**
 * Creates an error to notify about a missing config to extend from.
 * @param {string} configName The name of the missing config.
 * @returns {Error} The error object to throw
 * @private
 */
function configMissingError(configName) {
    return Object.assign(
        new Error(`Failed to load config "${configName}" to extend from.`),
        {
            messageTemplate: "extend-config-missing",
            messageData: { configName }
        }
    );
}

/**
 * Loads a configuration file regardless of the source. Inspects the file path
 * to determine the correctly way to load the config file.
 * @param {string} filePath The path to the configuration.
 * @returns {ConfigData|null} The configuration information.
 * @private
 */
function loadConfigFile(filePath) {
    switch (path.extname(filePath)) {
        case ".js":
            return loadJSConfigFile(filePath);

        case ".json":
            if (path.basename(filePath) === "package.json") {
                return loadPackageJSONConfigFile(filePath);
            }
            return loadJSONConfigFile(filePath);

        case ".yaml":
        case ".yml":
            return loadYAMLConfigFile(filePath);

        default:
            return loadLegacyConfigFile(filePath);
    }
}

/**
 * Write debug log.
 * @param {string} request The requested module name.
 * @param {string} relativeTo The file path to resolve the request relative to.
 * @param {string} filePath The resolved file path.
 * @returns {void}
 */
function writeDebugLogForLoading(request, relativeTo, filePath) {
    /* istanbul ignore next */
    if (debug.enabled) {
        let nameAndVersion = null;

        try {
            const packageJsonPath = ModuleResolver.resolve(
                `${request}/package.json`,
                relativeTo
            );
            const { version = "unknown" } = require(packageJsonPath);

            nameAndVersion = `${request}@${version}`;
        } catch (error) {
            debug("package.json was not found:", error.message);
            nameAndVersion = request;
        }

        debug("Loaded: %s (%s)", nameAndVersion, filePath);
    }
}

/**
 * Concatenate two config data.
 * @param {IterableIterator<ConfigArrayElement>|null} elements The config elements.
 * @param {ConfigArray|null} parentConfigArray The parent config array.
 * @returns {ConfigArray} The concatenated config array.
 */
function createConfigArray(elements, parentConfigArray) {
    if (!elements) {
        return parentConfigArray || new ConfigArray();
    }
    const configArray = new ConfigArray(...elements);

    if (parentConfigArray && !configArray.isRoot()) {
        configArray.unshift(...parentConfigArray);
    }
    return configArray;
}

/**
 * Normalize a given plugin.
 * - Ensure the object to have four properties: configs, environments, processors, and rules.
 * - Ensure the object to not have other properties.
 * @param {Plugin} plugin The plugin to normalize.
 * @returns {Plugin} The normalized plugin.
 */
function normalizePlugin(plugin) {
    return {
        configs: plugin.configs || {},
        environments: plugin.environments || {},
        processors: plugin.processors || {},
        rules: plugin.rules || {}
    };
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * The factory of `ConfigArray` objects.
 */
class ConfigArrayFactory {

    /**
     * Initialize this instance.
     * @param {ConfigArrayFactoryOptions} [options] The map for additional plugins.
     */
    constructor({
        additionalPluginPool = new Map(),
        cwd = process.cwd()
    } = {}) {
        internalSlotsMap.set(this, { additionalPluginPool, cwd });
    }

    /**
     * Create `ConfigArray` instance from a config data.
     * @param {ConfigData|null} configData The config data to create.
     * @param {Object} [options] The options.
     * @param {string} [options.filePath] The path to this config data.
     * @param {string} [options.name] The config name.
     * @param {ConfigArray} [options.parent] The parent config array.
     * @returns {ConfigArray} Loaded config.
     */
    create(configData, { filePath, name, parent } = {}) {
        return createConfigArray(
            configData
                ? this._normalizeConfigData(configData, filePath, name)
                : null,
            parent
        );
    }

    /**
     * Load a config file.
     * @param {string} filePath The path to a config file.
     * @param {Object} [options] The options.
     * @param {string} [options.name] The config name.
     * @param {ConfigArray} [options.parent] The parent config array.
     * @returns {ConfigArray} Loaded config.
     */
    loadFile(filePath, { name, parent } = {}) {
        const { cwd } = internalSlotsMap.get(this);
        const absolutePath = path.resolve(cwd, filePath);

        return createConfigArray(
            this._loadConfigData(absolutePath, name),
            parent
        );
    }

    /**
     * Load the config file on a given directory if exists.
     * @param {string} directoryPath The path to a directory.
     * @param {Object} [options] The options.
     * @param {string} [options.name] The config name.
     * @param {ConfigArray} [options.parent] The parent config array.
     * @returns {ConfigArray} Loaded config. An empty `ConfigArray` if any config doesn't exist.
     */
    loadInDirectory(directoryPath, { name, parent } = {}) {
        const { cwd } = internalSlotsMap.get(this);
        const absolutePath = path.resolve(cwd, directoryPath);

        return createConfigArray(
            this._loadConfigDataInDirectory(absolutePath, name),
            parent
        );
    }

    /**
     * Load a given config file.
     * @param {string} filePath The path to a config file.
     * @param {string} name The config name.
     * @returns {IterableIterator<ConfigArrayElement>} Loaded config.
     * @private
     */
    _loadConfigData(filePath, name) {
        return this._normalizeConfigData(
            loadConfigFile(filePath),
            filePath,
            name
        );
    }

    /**
     * Load the config file in a given directory if exists.
     * @param {string} directoryPath The path to a directory.
     * @param {string} name The config name.
     * @returns {IterableIterator<ConfigArrayElement> | null} Loaded config. `null` if any config doesn't exist.
     * @private
     */
    _loadConfigDataInDirectory(directoryPath, name) {
        for (const filename of configFilenames) {
            const filePath = path.join(directoryPath, filename);
            const originalDebugEnabled = debug.enabled;
            let configData;

            // Make silent temporary because of too verbose.
            debug.enabled = false;
            try {
                configData = loadConfigFile(filePath);
            } catch (error) {
                if (
                    error.code !== "ENOENT" &&
                    error.code !== "MODULE_NOT_FOUND" &&
                    error.code !== "ESLINT_CONFIG_FIELD_NOT_FOUND"
                ) {
                    throw error;
                }
            } finally {
                debug.enabled = originalDebugEnabled;
            }

            if (configData) {
                debug(`Config file found: ${filePath}`);
                return this._normalizeConfigData(configData, filePath, name);
            }
        }

        debug(`Config file not found on ${directoryPath}`);
        return null;
    }

    /**
     * Normalize a given config to an array.
     * @param {ConfigData} configData The config data to normalize.
     * @param {string|undefined} providedFilePath The file path of this config.
     * @param {string|undefined} providedName The name of this config.
     * @returns {IterableIterator<ConfigArrayElement>} The normalized config.
     * @private
     */
    _normalizeConfigData(configData, providedFilePath, providedName) {
        const { cwd } = internalSlotsMap.get(this);
        const filePath = providedFilePath
            ? path.resolve(cwd, providedFilePath)
            : "";
        const name = providedName || (filePath && path.relative(cwd, filePath));

        validateConfigSchema(configData, name || filePath);

        return this._normalizeObjectConfigData(configData, filePath, name);
    }

    /**
     * Normalize a given config to an array.
     * @param {ConfigData|OverrideConfigData} configData The config data to normalize.
     * @param {string} filePath The file path of this config.
     * @param {string} name The name of this config.
     * @returns {IterableIterator<ConfigArrayElement>} The normalized config.
     * @private
     */
    *_normalizeObjectConfigData(configData, filePath, name) {
        const { cwd } = internalSlotsMap.get(this);
        const { files, excludedFiles, ...configBody } = configData;
        const basePath = filePath ? path.dirname(filePath) : cwd;
        const criteria = OverrideTester.create(files, excludedFiles, basePath);
        const elements =
            this._normalizeObjectConfigDataBody(configBody, filePath, name);

        // Apply the criteria to every element.
        for (const element of elements) {

            // Adopt the base path of the entry file (the outermost base path).
            if (element.criteria) {
                element.criteria.basePath = basePath;
            }

            /*
             * Merge the criteria; this is for only file extension processors in
             * `overrides` section for now.
             */
            element.criteria = OverrideTester.and(criteria, element.criteria);

            yield element;
        }
    }

    /**
     * Normalize a given config to an array.
     * @param {ConfigData} configData The config data to normalize.
     * @param {string} filePath The file path of this config.
     * @param {string} name The name of this config.
     * @returns {IterableIterator<ConfigArrayElement>} The normalized config.
     * @private
     */
    *_normalizeObjectConfigDataBody(
        {
            env,
            extends: extend,
            globals,
            parser: parserName,
            parserOptions,
            plugins: pluginList,
            processor, // processor is only for file extension processors.
            root,
            rules,
            settings,
            overrides: overrideList = []
        },
        filePath,
        name
    ) {
        const extendList = Array.isArray(extend) ? extend : [extend];

        // Flatten `extends`.
        for (const extendName of extendList.filter(Boolean)) {
            yield* this._loadExtends(extendName, filePath, name);
        }

        // Load parser & plugins.
        const parser =
            parserName && this._loadParser(parserName, filePath, name);
        const plugins =
            pluginList && this._loadPlugins(pluginList, filePath, name);

        // Yield pseudo config data for file extension processors.
        if (plugins) {
            yield* this._takeFileExtensionProcessors(plugins, filePath, name);
        }

        // Yield the config data except `extends` and `overrides`.
        yield {

            // Debug information.
            name,
            filePath,

            // Config data.
            criteria: null,
            env,
            globals,
            parser,
            parserOptions,
            plugins,
            processor,
            root,
            rules,
            settings
        };

        // Flatten `overries`.
        for (let i = 0; i < overrideList.length; ++i) {
            yield* this._normalizeObjectConfigData(
                overrideList[i],
                filePath,
                `${name}#overrides[${i}]`
            );
        }
    }

    /**
     * Load configs of an element in `extends`.
     * @param {string} extendName The name of a base config.
     * @param {string} importerPath The file path which has the `extends` property.
     * @param {string} importerName The name of the config which has the `extends` property.
     * @returns {IterableIterator<ConfigArrayElement>} The normalized config.
     * @private
     */
    _loadExtends(extendName, importerPath, importerName) {
        debug("Loading {extends:%j} relative to %s", extendName, importerPath);
        try {
            if (extendName.startsWith("eslint:")) {
                return this._loadExtendedBuiltInConfig(
                    extendName,
                    importerName
                );
            }
            if (extendName.startsWith("plugin:")) {
                return this._loadExtendedPluginConfig(
                    extendName,
                    importerPath,
                    importerName
                );
            }
            return this._loadExtendedShareableConfig(
                extendName,
                importerPath,
                importerName
            );
        } catch (error) {
            error.message += `\nReferenced from: ${importerPath || importerName}`;
            throw error;
        }
    }

    /**
     * Load configs of an element in `extends`.
     * @param {string} extendName The name of a base config.
     * @param {string} importerName The name of the config which has the `extends` property.
     * @returns {IterableIterator<ConfigArrayElement>} The normalized config.
     * @private
     */
    _loadExtendedBuiltInConfig(extendName, importerName) {
        const name = `${importerName} » ${extendName}`;

        if (extendName === "eslint:recommended") {
            return this._loadConfigData(eslintRecommendedPath, name);
        }
        if (extendName === "eslint:all") {
            return this._loadConfigData(eslintAllPath, name);
        }

        throw configMissingError(extendName);
    }

    /**
     * Load configs of an element in `extends`.
     * @param {string} extendName The name of a base config.
     * @param {string} importerPath The file path which has the `extends` property.
     * @param {string} importerName The name of the config which has the `extends` property.
     * @returns {IterableIterator<ConfigArrayElement>} The normalized config.
     * @private
     */
    _loadExtendedPluginConfig(extendName, importerPath, importerName) {
        const slashIndex = extendName.lastIndexOf("/");
        const pluginName = extendName.slice("plugin:".length, slashIndex);
        const configName = extendName.slice(slashIndex + 1);

        if (isFilePath(pluginName)) {
            throw new Error("'extends' cannot use a file path for plugins.");
        }

        const plugin = this._loadPlugin(pluginName, importerPath, importerName);
        const configData =
            plugin.definition &&
            plugin.definition.configs[configName];

        if (configData) {
            return this._normalizeConfigData(
                configData,
                plugin.filePath,
                `${importerName} » plugin:${plugin.id}/${configName}`
            );
        }

        throw plugin.error || configMissingError(extendName);
    }

    /**
     * Load configs of an element in `extends`.
     * @param {string} extendName The name of a base config.
     * @param {string} importerPath The file path which has the `extends` property.
     * @param {string} importerName The name of the config which has the `extends` property.
     * @returns {IterableIterator<ConfigArrayElement>} The normalized config.
     * @private
     */
    _loadExtendedShareableConfig(extendName, importerPath, importerName) {
        const { cwd } = internalSlotsMap.get(this);
        const relativeTo = importerPath || path.join(cwd, "__placeholder__.js");
        let request;

        if (isFilePath(extendName)) {
            request = extendName;
        } else if (extendName.startsWith(".")) {
            request = `./${extendName}`; // For backward compatibility. A ton of tests depended on this behavior.
        } else {
            request = naming.normalizePackageName(
                extendName,
                "eslint-config"
            );
        }

        try {
            const filePath = ModuleResolver.resolve(request, relativeTo);

            writeDebugLogForLoading(request, relativeTo, filePath);

            return this._loadConfigData(filePath, `${importerName} » ${request}`);
        } catch (error) {
            /* istanbul ignore next */
            if (!error || error.code !== "MODULE_NOT_FOUND") {
                throw error;
            }
        }

        throw configMissingError(extendName);
    }

    /**
     * Load given plugins.
     * @param {string[]} names The plugin names to load.
     * @param {string} importerPath The path to a config file that imports it. This is just a debug info.
     * @param {string} importerName The name of a config file that imports it. This is just a debug info.
     * @returns {Record<string,DependentPlugin>} The loaded parser.
     * @private
     */
    _loadPlugins(names, importerPath, importerName) {
        return names.reduce((map, name) => {
            if (isFilePath(name)) {
                throw new Error("Plugins array cannot includes file paths.");
            }
            const plugin = this._loadPlugin(name, importerPath, importerName);

            map[plugin.id] = plugin;

            return map;
        }, {});
    }

    /**
     * Load a given parser.
     * @param {string} nameOrPath The package name or the path to a parser file.
     * @param {string} importerPath The path to a config file that imports it.
     * @param {string} importerName The name of a config file that imports it. This is just a debug info.
     * @returns {DependentParser} The loaded parser.
     */
    _loadParser(nameOrPath, importerPath, importerName) {
        debug("Loading parser %j from %s", nameOrPath, importerPath);

        const { cwd } = internalSlotsMap.get(this);
        const relativeTo = importerPath || path.join(cwd, "__placeholder__.js");

        try {
            const filePath = ModuleResolver.resolve(nameOrPath, relativeTo);

            writeDebugLogForLoading(nameOrPath, relativeTo, filePath);

            return new ConfigDependency({
                definition: require(filePath),
                filePath,
                id: nameOrPath,
                importerName,
                importerPath
            });
        } catch (error) {

            // If the parser name is "espree", load the espree of ESLint.
            if (nameOrPath === "espree") {
                debug("Fallback espree.");
                return new ConfigDependency({
                    definition: require("espree"),
                    filePath: require.resolve("espree"),
                    id: nameOrPath,
                    importerName,
                    importerPath
                });
            }

            debug("Failed to load parser '%s' declared in '%s'.", nameOrPath, importerName);
            error.message = `Failed to load parser '${nameOrPath}' declared in '${importerName}': ${error.message}`;

            return new ConfigDependency({
                error,
                id: nameOrPath,
                importerName,
                importerPath
            });
        }
    }

    /**
     * Load a given plugin.
     * @param {string} name The plugin name to load.
     * @param {string} importerPath The path to a config file that imports it. This is just a debug info.
     * @param {string} importerName The name of a config file that imports it. This is just a debug info.
     * @returns {DependentPlugin} The loaded plugin.
     * @private
     */
    _loadPlugin(name, importerPath, importerName) {
        debug("Loading plugin %j from %s", name, importerPath);

        const { additionalPluginPool, cwd } = internalSlotsMap.get(this);
        const request = naming.normalizePackageName(name, "eslint-plugin");
        const id = naming.getShorthandName(request, "eslint-plugin");

        if (name.match(/\s+/u)) {
            const error = Object.assign(
                new Error(`Whitespace found in plugin name '${name}'`),
                {
                    messageTemplate: "whitespace-found",
                    messageData: { pluginName: request }
                }
            );

            return new ConfigDependency({
                error,
                id,
                importerName,
                importerPath
            });
        }

        // Check for additional pool.
        const plugin =
            additionalPluginPool.get(request) ||
            additionalPluginPool.get(id);

        if (plugin) {
            return new ConfigDependency({
                definition: normalizePlugin(plugin),
                filePath: importerPath,
                id,
                importerName,
                importerPath
            });
        }

        try {

            // Resolve the plugin file relative to the project root.
            const relativeTo = path.join(cwd, "__placeholder__.js");
            const filePath = ModuleResolver.resolve(request, relativeTo);

            writeDebugLogForLoading(request, relativeTo, filePath);

            return new ConfigDependency({
                definition: normalizePlugin(require(filePath)),
                filePath,
                id,
                importerName,
                importerPath
            });
        } catch (error) {
            debug("Failed to load plugin '%s' declared in '%s'.", name, importerName);

            if (error && error.code === "MODULE_NOT_FOUND" && error.message.includes(request)) {
                error.messageTemplate = "plugin-missing";
                error.messageData = {
                    pluginName: request,
                    pluginRootPath: cwd,
                    importerName
                };
            }
            error.message = `Failed to load plugin '${name}' declared in '${importerName}': ${error.message}`;

            return new ConfigDependency({
                error,
                id,
                importerName,
                importerPath
            });
        }
    }

    /**
     * Take file expression processors as config array elements.
     * @param {Record<string,DependentPlugin>} plugins The plugin definitions.
     * @param {string} filePath The file path of this config.
     * @param {string} name The name of this config.
     * @returns {IterableIterator<ConfigArrayElement>} The config array elements of file expression processors.
     * @private
     */
    *_takeFileExtensionProcessors(plugins, filePath, name) {
        for (const pluginId of Object.keys(plugins)) {
            const processors =
                plugins[pluginId] &&
                plugins[pluginId].definition &&
                plugins[pluginId].definition.processors;

            if (!processors) {
                continue;
            }

            for (const processorId of Object.keys(processors)) {
                if (processorId.startsWith(".")) {
                    yield* this._normalizeObjectConfigData(
                        {
                            files: [`*${processorId}`],
                            processor: `${pluginId}/${processorId}`
                        },
                        filePath,
                        `${name}#processors["${pluginId}/${processorId}"]`
                    );
                }
            }
        }
    }
}

module.exports = { ConfigArrayFactory };
