/**
 * @fileoverview Helper to locate and load configuration files.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const fs = require("fs"),
    path = require("path"),
    ConfigOps = require("./config-ops"),
    validator = require("./config-validator"),
    relativeModuleResolver = require("../util/relative-module-resolver"),
    naming = require("../util/naming"),
    stripComments = require("strip-json-comments"),
    stringify = require("json-stable-stringify-without-jsonify"),
    importFresh = require("import-fresh"),
    Plugins = require("./plugins");

const debug = require("debug")("eslint:config-file");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Determines sort order for object keys for json-stable-stringify
 *
 * see: https://github.com/samn/json-stable-stringify#cmp
 *
 * @param   {Object} a The first comparison object ({key: akey, value: avalue})
 * @param   {Object} b The second comparison object ({key: bkey, value: bvalue})
 * @returns {number}   1 or -1, used in stringify cmp method
 */
function sortByKey(a, b) {
    return a.key > b.key ? 1 : -1;
}

//------------------------------------------------------------------------------
// Private
//------------------------------------------------------------------------------

const CONFIG_FILES = [
    ".eslintrc.js",
    ".eslintrc.yaml",
    ".eslintrc.yml",
    ".eslintrc.json",
    ".eslintrc",
    "package.json"
];

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
 * Determines if a given string represents a filepath or not using the same
 * conventions as require(), meaning that the first character must be nonalphanumeric
 * and not the @ sign which is used for scoped packages to be considered a file path.
 * @param {string} filePath The string to check.
 * @returns {boolean} True if it's a filepath, false if not.
 * @private
 */
function isFilePath(filePath) {
    return path.isAbsolute(filePath) || !/\w|@/u.test(filePath.charAt(0));
}

/**
 * Loads a YAML configuration from a file.
 * @param {string} filePath The filename to load.
 * @returns {Object} The configuration object from the file.
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
 * @returns {Object} The configuration object from the file.
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
 * @returns {Object} The configuration object from the file.
 * @throws {Error} If the file cannot be read.
 * @private
 */
function loadLegacyConfigFile(filePath) {
    debug(`Loading config file: ${filePath}`);

    // lazy load YAML to improve performance when not used
    const yaml = require("js-yaml");

    try {
        return yaml.safeLoad(stripComments(readFile(filePath))) || /* istanbul ignore next */ {};
    } catch (e) {
        debug(`Error reading YAML file: ${filePath}`);
        e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`;
        throw e;
    }
}

/**
 * Loads a JavaScript configuration from a file.
 * @param {string} filePath The filename to load.
 * @returns {Object} The configuration object from the file.
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
 * @returns {Object} The configuration object from the file.
 * @throws {Error} If the file cannot be read.
 * @private
 */
function loadPackageJSONConfigFile(filePath) {
    debug(`Loading package.json config file: ${filePath}`);
    try {
        return loadJSONConfigFile(filePath).eslintConfig || null;
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
    const error = new Error(`Failed to load config "${configName}" to extend from.`);

    error.messageTemplate = "extend-config-missing";
    error.messageData = {
        configName
    };
    return error;
}

/**
 * Loads a configuration file regardless of the source. Inspects the file path
 * to determine the correctly way to load the config file.
 * @param {Object} configInfo The path to the configuration.
 * @returns {Object} The configuration information.
 * @private
 */
function loadConfigFile(configInfo) {
    const { filePath } = configInfo;
    let config;

    switch (path.extname(filePath)) {
        case ".js":
            config = loadJSConfigFile(filePath);
            if (configInfo.configName) {
                config = config.configs[configInfo.configName];
                if (!config) {
                    throw configMissingError(configInfo.configFullName);
                }
            }
            break;

        case ".json":
            if (path.basename(filePath) === "package.json") {
                config = loadPackageJSONConfigFile(filePath);
                if (config === null) {
                    return null;
                }
            } else {
                config = loadJSONConfigFile(filePath);
            }
            break;

        case ".yaml":
        case ".yml":
            config = loadYAMLConfigFile(filePath);
            break;

        default:
            config = loadLegacyConfigFile(filePath);
    }

    return ConfigOps.merge(ConfigOps.createEmptyConfig(), config);
}

/**
 * Writes a configuration file in JSON format.
 * @param {Object} config The configuration object to write.
 * @param {string} filePath The filename to write to.
 * @returns {void}
 * @private
 */
function writeJSONConfigFile(config, filePath) {
    debug(`Writing JSON config file: ${filePath}`);

    const content = stringify(config, { cmp: sortByKey, space: 4 });

    fs.writeFileSync(filePath, content, "utf8");
}

/**
 * Writes a configuration file in YAML format.
 * @param {Object} config The configuration object to write.
 * @param {string} filePath The filename to write to.
 * @returns {void}
 * @private
 */
function writeYAMLConfigFile(config, filePath) {
    debug(`Writing YAML config file: ${filePath}`);

    // lazy load YAML to improve performance when not used
    const yaml = require("js-yaml");

    const content = yaml.safeDump(config, { sortKeys: true });

    fs.writeFileSync(filePath, content, "utf8");
}

/**
 * Writes a configuration file in JavaScript format.
 * @param {Object} config The configuration object to write.
 * @param {string} filePath The filename to write to.
 * @throws {Error} If an error occurs linting the config file contents.
 * @returns {void}
 * @private
 */
function writeJSConfigFile(config, filePath) {
    debug(`Writing JS config file: ${filePath}`);

    let contentToWrite;
    const stringifiedContent = `module.exports = ${stringify(config, { cmp: sortByKey, space: 4 })};`;

    try {
        const CLIEngine = require("../cli-engine");
        const linter = new CLIEngine({
            baseConfig: config,
            fix: true,
            useEslintrc: false
        });
        const report = linter.executeOnText(stringifiedContent);

        contentToWrite = report.results[0].output || stringifiedContent;
    } catch (e) {
        debug("Error linting JavaScript config file, writing unlinted version");
        const errorMessage = e.message;

        contentToWrite = stringifiedContent;
        e.message = "An error occurred while generating your JavaScript config file. ";
        e.message += "A config file was still generated, but the config file itself may not follow your linting rules.";
        e.message += `\nError: ${errorMessage}`;
        throw e;
    } finally {
        fs.writeFileSync(filePath, contentToWrite, "utf8");
    }
}

/**
 * Writes a configuration file.
 * @param {Object} config The configuration object to write.
 * @param {string} filePath The filename to write to.
 * @returns {void}
 * @throws {Error} When an unknown file type is specified.
 * @private
 */
function write(config, filePath) {
    switch (path.extname(filePath)) {
        case ".js":
            writeJSConfigFile(config, filePath);
            break;

        case ".json":
            writeJSONConfigFile(config, filePath);
            break;

        case ".yaml":
        case ".yml":
            writeYAMLConfigFile(config, filePath);
            break;

        default:
            throw new Error("Can't write to unknown file type.");
    }
}

/**
 * Resolves a eslint core config path
 * @param {string} name The eslint config name.
 * @returns {string} The resolved path of the config.
 * @private
 */
function getEslintCoreConfigPath(name) {
    if (name === "eslint:recommended") {

        /*
         * Add an explicit substitution for eslint:recommended to
         * conf/eslint-recommended.js.
         */
        return path.resolve(__dirname, "../../conf/eslint-recommended.js");
    }

    if (name === "eslint:all") {

        /*
         * Add an explicit substitution for eslint:all to conf/eslint-all.js
         */
        return path.resolve(__dirname, "../../conf/eslint-all.js");
    }

    throw configMissingError(name);
}

/**
 * Applies values from the "extends" field in a configuration file.
 * @param {Object} config The configuration information.
 * @param {Config} configContext Plugin context for the config instance
 * @param {string} filePath The file path from which the configuration information
 *      was loaded.
 * @returns {Object} A new configuration object with all of the "extends" fields
 *      loaded and merged.
 * @private
 */
function applyExtends(config, configContext, filePath) {
    const extendsList = Array.isArray(config.extends) ? config.extends : [config.extends];

    // Make the last element in an array take the highest precedence
    const flattenedConfig = extendsList.reduceRight((previousValue, extendedConfigReference) => {
        try {
            debug(`Loading ${extendedConfigReference}`);

            // eslint-disable-next-line no-use-before-define
            return ConfigOps.merge(load(extendedConfigReference, configContext, filePath), previousValue);
        } catch (err) {

            /*
             * If the file referenced by `extends` failed to load, add the path
             * to the configuration file that referenced it to the error
             * message so the user is able to see where it was referenced from,
             * then re-throw.
             */
            err.message += `\nReferenced from: ${filePath}`;

            if (err.messageTemplate === "plugin-missing") {
                err.messageData.configStack.push(filePath);
            }

            throw err;
        }

    }, Object.assign({}, config));

    delete flattenedConfig.extends;
    return flattenedConfig;
}

/**
 * Resolves a configuration file path into the fully-formed path, whether filename
 * or package name.
 * @param {string} extendedConfigReference The config to extend, as it appears in a config file
 * @param {string} referencedFromPath The path to the config file that contains `extendedConfigReference`
 * @param {string} pluginRootPath The absolute path to the directory where plugins should be resolved from
 * @returns {Object} An object containing 3 properties:
 * - 'filePath' (required) the resolved path that can be used directly to load the configuration.
 * - 'configName' the name of the configuration inside the plugin, if this is a plugin config.
 * - 'configFullName' (required) the name of the configuration as used in the eslint config(e.g. 'plugin:node/recommended'),
 *     or the absolute path to a config file. This should uniquely identify a config.
 * @private
 */
function resolve(extendedConfigReference, referencedFromPath, pluginRootPath) {
    if (extendedConfigReference.startsWith("eslint:")) {
        return {
            filePath: getEslintCoreConfigPath(extendedConfigReference),
            configFullName: extendedConfigReference
        };
    }

    if (extendedConfigReference.startsWith("plugin:")) {
        const configFullName = extendedConfigReference;
        const pluginName = extendedConfigReference.slice(7, extendedConfigReference.lastIndexOf("/"));
        const configName = extendedConfigReference.slice(extendedConfigReference.lastIndexOf("/") + 1);

        return {
            filePath: Plugins.resolve(pluginName, pluginRootPath),
            configName,
            configFullName
        };
    }

    if (isFilePath(extendedConfigReference)) {
        const resolvedConfigPath = path.resolve(path.dirname(referencedFromPath), extendedConfigReference);

        return {
            filePath: resolvedConfigPath,
            configFullName: resolvedConfigPath
        };
    }

    const normalizedConfigName = naming.normalizePackageName(extendedConfigReference, "eslint-config");

    return {
        filePath: relativeModuleResolver(normalizedConfigName, referencedFromPath),
        configFullName: extendedConfigReference
    };
}


/**
 * Loads a config object, applying extends/parser/plugins if present.
 * @param {Config} configContext Context for the config instance
 * @param {Object} options.config a config object to load
 * @param {string} options.filePath The path where `extends` and parsers should be resolved from (usually the path where the config was located from)
 * @param {string} options.configFullName The full name of the config, for use in error messages
 * @returns {Object} the config object with extends applied if present, or the passed config if not
 * @private
 */
function loadObject(configContext, { config: configObject, filePath, configFullName }) {
    const config = Object.assign({}, configObject);

    // ensure plugins are properly loaded first
    if (config.plugins) {
        try {
            configContext.plugins.loadAll(config.plugins);
        } catch (pluginLoadErr) {
            if (pluginLoadErr.messageTemplate === "plugin-missing") {
                pluginLoadErr.messageData.configStack.push(filePath);
            }
            throw pluginLoadErr;
        }
    }

    // include full path of parser if present
    if (config.parser) {
        try {
            config.parser = relativeModuleResolver(config.parser, filePath);
        } catch (err) {
            if (err.code === "MODULE_NOT_FOUND" && config.parser === "espree") {
                config.parser = require.resolve("espree");
            } else {
                err.message += `\nFailed to resolve parser '${config.parser}' declared in '${filePath}'.`;
                throw err;
            }
        }
    }

    const ruleMap = configContext.ruleMap;

    // validate the configuration before continuing
    validator.validate(config, ruleMap.get.bind(ruleMap), configContext.linterContext.environments, configFullName);

    /*
     * If an `extends` property is defined, it represents a configuration file to use as
     * a "parent". Load the referenced file and merge the configuration recursively.
     */
    if (config.extends) {
        return applyExtends(config, configContext, filePath);
    }

    return config;
}

/**
 * Loads a configuration file from the given file path.
 * @param {Object} configInfo The value from calling resolve() on a filename or package name.
 * @param {Config} configContext Config context
 * @returns {Object} The configuration information.
 */
function loadFromDisk(configInfo, configContext) {
    const config = loadConfigFile(configInfo);

    // loadConfigFile will return null for a `package.json` file that does not have an `eslintConfig` property.
    if (config) {
        return loadObject(configContext, { config, filePath: configInfo.filePath, configFullName: configInfo.configFullName });
    }

    return null;
}

/**
 * Loads a config object from the config cache based on its filename, falling back to the disk if the file is not yet
 * cached.
 * @param {string} extendedConfigReference The config to extend, as it appears in a config file
 * @param {Config} configContext Context for the config instance
 * @param {string} referencedFromPath The path to the config file that contains `extendedConfigReference` (or where
 * the `extendedConfigReference` should be resolved from, if it doesn't appear in a config file)
 * @returns {Object} the parsed config object (empty object if there was a parse error)
 * @private
 */
function load(extendedConfigReference, configContext, referencedFromPath) {
    const resolvedPath = resolve(extendedConfigReference, referencedFromPath, configContext.getPluginRootPath());

    const cachedConfig = configContext.configCache.getConfig(resolvedPath.configFullName);

    if (cachedConfig) {
        return cachedConfig;
    }

    const config = loadFromDisk(resolvedPath, configContext);

    if (config) {
        configContext.configCache.setConfig(resolvedPath.configFullName, config);
    }

    return config;
}

/**
 * Checks whether the given filename points to a file
 * @param {string} filename A path to a file
 * @returns {boolean} `true` if a file exists at the given location
 */
function isExistingFile(filename) {
    try {
        return fs.statSync(filename).isFile();
    } catch (err) {
        if (err.code === "ENOENT") {
            return false;
        }
        throw err;
    }
}


//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = {
    load,
    loadObject,
    resolve,
    write,
    applyExtends,
    CONFIG_FILES,

    /**
     * Retrieves the configuration filename for a given directory. It loops over all
     * of the valid configuration filenames in order to find the first one that exists.
     * @param {string} directory The directory to check for a config file.
     * @returns {?string} The filename of the configuration file for the directory
     *      or null if there is no configuration file in the directory.
     */
    getFilenameForDirectory(directory) {
        return CONFIG_FILES.map(filename => path.join(directory, filename)).find(isExistingFile) || null;
    }
};
