/**
 * @fileoverview Main class using flat config
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const path = require("path");
const fs = require("fs/promises");
const { readFile } = require("fs/promises");
const { promisify } = require("util");
const findUp = require("find-up");
const ignore = require("ignore");
const { version } = require("../../package.json");
const { Linter } = require("../linter");
const { getRuleFromConfig } = require("../config/flat-config-helpers");
const hash = require("../cli-engine/hash");
const LintResultCache = require("../cli-engine/lint-result-cache");

const BuiltinRules = require("../rules");

const {
    Legacy: {
        ConfigOps: {
            getRuleSeverity
        },
        ModuleResolver,
        naming
    }
} = require("@eslint/eslintrc");

const {
    directoryExists,
    fileExists,

    isNonEmptyString,
    isArrayOfNonEmptyString,

    createIgnoreResult,
    isErrorMessage,
    validateFixTypes,

    processOptions
} = require("./eslint-helpers");
const { pathToFileURL } = require("url");
const { FlatConfigArray } = require("../config/flat-config-array");
const { fstat } = require("fs");

//------------------------------------------------------------------------------
// Typedefs
//------------------------------------------------------------------------------

// For VSCode IntelliSense
/** @typedef {import("../shared/types").ConfigData} ConfigData */
/** @typedef {import("../shared/types").DeprecatedRuleInfo} DeprecatedRuleInfo */
/** @typedef {import("../shared/types").LintMessage} LintMessage */
/** @typedef {import("../shared/types").ParserOptions} ParserOptions */
/** @typedef {import("../shared/types").Plugin} Plugin */
/** @typedef {import("../shared/types").RuleConf} RuleConf */
/** @typedef {import("../shared/types").Rule} Rule */
/** @typedef {ReturnType<ConfigArray.extractConfig>} ExtractedConfig */

/**
 * The options with which to configure the ESLint instance.
 * @typedef {Object} FlatESLintOptions
 * @property {boolean} [allowInlineConfig] Enable or disable inline configuration comments.
 * @property {ConfigData} [baseConfig] Base config object, extended by all configs used with this instance
 * @property {boolean} [cache] Enable result caching.
 * @property {string} [cacheLocation] The cache file to use instead of .eslintcache.
 * @property {"metadata" | "content"} [cacheStrategy] The strategy used to detect changed files.
 * @property {boolean|string} [configFile] Searches for default config file when `true`; 
 *      doesn't do any config file lookup when `false`; considered to be a config filename
 *      when a string.
 * @property {string} [cwd] The value to use for the current working directory.
 * @property {boolean} [errorOnUnmatchedPattern] If `false` then `ESLint#lintFiles()` doesn't throw even if no target files found. Defaults to `true`.
 * @property {string[]} [extensions] An array of file extensions to check.
 * @property {boolean|Function} [fix] Execute in autofix mode. If a function, should return a boolean.
 * @property {string[]} [fixTypes] Array of rule types to apply fixes for.
 * @property {boolean} [globInputPaths] Set to false to skip glob resolution of input file paths to lint (default: true). If false, each input file paths is assumed to be a non-glob path to an existing file.
 * @property {boolean} [ignore] False disables use of .eslintignore.
 * @property {string} [ignorePath] The ignore file to use instead of .eslintignore.
 * @property {string[]} [ignorePatterns] Ignore file patterns to use in addition to .eslintignore.
 * @property {ConfigData} [overrideConfig] Override config object, overrides all configs used with this instance
 * @property {Record<string,Plugin>} [plugins] An array of plugin implementations.
 * @property {"error" | "warn" | "off"} [reportUnusedDisableDirectives] the severity to report unused eslint-disable directives.
 */

// TODO

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const FLAT_CONFIG_FILENAME = "eslint.config.js";
const debug = require("debug")("eslint:flat-eslint");
const removedFormatters = new Set(["table", "codeframe"]);
const privateMembers = new WeakMap();

// TODO: Change to fs/promises and update associated tests
const writeFile = promisify(fs.writeFile);

/**
 * It will calculate the error and warning count for collection of messages per file
 * @param {LintMessage[]} messages Collection of messages
 * @returns {Object} Contains the stats
 * @private
 */
function calculateStatsPerFile(messages) {
    return messages.reduce((stat, message) => {
        if (message.fatal || message.severity === 2) {
            stat.errorCount++;
            if (message.fatal) {
                stat.fatalErrorCount++;
            }
            if (message.fix) {
                stat.fixableErrorCount++;
            }
        } else {
            stat.warningCount++;
            if (message.fix) {
                stat.fixableWarningCount++;
            }
        }
        return stat;
    }, {
        errorCount: 0,
        fatalErrorCount: 0,
        warningCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0
    });
}

/**
 * It will calculate the error and warning count for collection of results from all files
 * @param {LintResult[]} results Collection of messages from all the files
 * @returns {Object} Contains the stats
 * @private
 */
function calculateStatsPerRun(results) {
    return results.reduce((stat, result) => {
        stat.errorCount += result.errorCount;
        stat.fatalErrorCount += result.fatalErrorCount;
        stat.warningCount += result.warningCount;
        stat.fixableErrorCount += result.fixableErrorCount;
        stat.fixableWarningCount += result.fixableWarningCount;
        return stat;
    }, {
        errorCount: 0,
        fatalErrorCount: 0,
        warningCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0
    });
}

/**
 * Loads global ignore patterns from an ignore file (usually .eslintignore).
 * @param {string} filePath The filename to load.
 * @returns {ignore} A function encapsulating the ignore patterns.
 * @throws {Error} If the file cannot be read.
 * @private
 */
async function loadIgnoreFilePatterns(filePath) {
    debug(`Loading ignore file: ${filePath}`);

    try {
        const ignoreFileText = await readFile(filePath, { encoding: "utf8" });

        return ignoreFileText
            .split(/\r?\n/gu)
            .filter(line => line.trim() !== "" && !line.startsWith("#"));

    } catch (e) {
        debug(`Error reading ignore file: ${filePath}`);
        e.message = `Cannot read ignore file: ${filePath}\nError: ${e.message}`;
        throw e;
    }
}

/**
 * Create rulesMeta object.
 * @param {Map<string,Rule>} rules a map of rules from which to generate the object.
 * @returns {Object} metadata for all enabled rules.
 */
function createRulesMeta(rules) {
    return Array.from(rules).reduce((retVal, [id, rule]) => {
        retVal[id] = rule.meta;
        return retVal;
    }, {});
}

/** @type {WeakMap<ExtractedConfig, DeprecatedRuleInfo[]>} */
const usedDeprecatedRulesCache = new WeakMap();

/**
 * Create used deprecated rule list.
 * @param {CLIEngine} eslint The CLIEngine instance.
 * @param {string} maybeFilePath The absolute path to a lint target file or `"<text>"`.
 * @returns {DeprecatedRuleInfo[]} The used deprecated rule list.
 */
function getOrFindUsedDeprecatedRules(eslint, maybeFilePath) {
    const {
        configs,
        options: { cwd }
    } = privateMembers.get(eslint);
    const filePath = path.isAbsolute(maybeFilePath)
        ? maybeFilePath
        : path.join(cwd, "__placeholder__.js");
    const config = configs.getConfig(filePath);

    // Most files use the same config, so cache it.
    if (config && !usedDeprecatedRulesCache.has(config)) {
        const retv = [];

        if (config.rules) {
            for (const [ruleId, ruleConf] of Object.entries(config.rules)) {
                if (getRuleSeverity(ruleConf) === 0) {
                    continue;
                }
                const rule = getRuleFromConfig(ruleId, config);
                const meta = rule && rule.meta;

                if (meta && meta.deprecated) {
                    retv.push({ ruleId, replacedBy: meta.replacedBy || [] });
                }
            }
        }


        usedDeprecatedRulesCache.set(config, Object.freeze(retv));
    }

    return config ? usedDeprecatedRulesCache.get(config) : Object.freeze([]);
}

/**
 * Processes the linting results generated by a CLIEngine linting report to
 * match the ESLint class's API.
 * @param {CLIEngine} eslint The CLIEngine instance.
 * @param {CLIEngineLintReport} report The CLIEngine linting report to process.
 * @returns {LintResult[]} The processed linting results.
 */
function processLintReport(eslint, { results }) {
    const descriptor = {
        configurable: true,
        enumerable: true,
        get() {
            return getOrFindUsedDeprecatedRules(eslint, this.filePath);
        }
    };

    for (const result of results) {
        Object.defineProperty(result, "usedDeprecatedRules", descriptor);
    }

    return results;
}

/**
 * An Array.prototype.sort() compatible compare function to order results by their file path.
 * @param {LintResult} a The first lint result.
 * @param {LintResult} b The second lint result.
 * @returns {number} An integer representing the order in which the two results should occur.
 */
function compareResultsByFilePath(a, b) {
    if (a.filePath < b.filePath) {
        return -1;
    }

    if (a.filePath > b.filePath) {
        return 1;
    }

    return 0;
}

/**
 * Searches from the current working directory up until finding the
 * given flat config filename.
 * @param {string} cwd The current working directory to search from. 
 * @returns {Promise<string|null>} The filename if found or `null` if not.
 */
function findFlatConfigFile(cwd) {
    return findUp(
        FLAT_CONFIG_FILENAME,
        { cwd }
    );
}

/**
 * Load the config array from the given filename.
 * @param {string} filePath The filename to load from. 
 * @param {string} basePath The base path for the config array. 
 * @returns {Promise<FlatConfigArray>} The config array loaded from the config file.
 */
async function loadFlatConfigFile(filePath) {
    debug(`Loading config from ${filePath}`);

    const fileURL = pathToFileURL(filePath);

    debug(`Config file URL is ${fileURL}`);

    const module = await import(fileURL);

    return new FlatConfigArray(module.default, {
        basePath: path.dirname(filePath)
    });
}

async function calculateConfigArray(eslint, {
    cwd,
    overrideConfig,
    configFile,
    ignore: shouldUseIgnoreFile,
    ignorePath,
    ignorePatterns
}) {

    // check for cached instance
    const slots = privateMembers.get(eslint);

    if (slots.configs) {
        return slots.configs;
    }

    // determine where to load config file from
    let configFilePath;

    if (typeof configFile === "string") {
        configFilePath = configFile;
    } else if (configFile === true) {
        configFilePath = await findFlatConfigFile(cwd);

        if (!configFilePath) {
            throw new Error("Could not find config file.");
        }
    }

    // load config array
    let configs;

    if (configFilePath) {
        configs = await loadFlatConfigFile(configFilePath);
    } else {
        configs = new FlatConfigArray([], { basePath: cwd });
    }

    // add in any configured defaults
    configs.push(...slots.defaultConfigs);

    let allIgnorePatterns = [];
    let ignoreFilePath;

    // load ignore file if necessary
    if (shouldUseIgnoreFile) {
        if (ignorePath) {
            ignoreFilePath = path.resolve(cwd, ignorePath);
            allIgnorePatterns = await loadIgnoreFilePatterns(ignoreFilePath);
        } else {
            ignoreFilePath = path.resolve(cwd, ".eslintignore");

            // no error if .eslintignore doesn't exist`
            if (fileExists(ignoreFilePath)) {
                allIgnorePatterns = await loadIgnoreFilePatterns(ignoreFilePath);
            }
        }
    }

    // append command line ignore patterns
    if (ignorePatterns) {
        allIgnorePatterns.push(...ignorePatterns);
    }

    if (allIgnorePatterns.length) {
        const ig = ignore().add(allIgnorePatterns);

        // add the ignores to the front of the config array
        configs.unshift({
            ignores: [filePath => {
                const relativePath = path.relative(cwd, filePath);

                return ig.ignores(relativePath);
            }]
        });
    }

    if (overrideConfig) {
        configs.push(overrideConfig);
    }

    await configs.normalize();

    // cache the config array for this instance
    slots.configs = configs;

    return configs;
}

/**
 * Processes an source code using ESLint.
 * @param {Object} config The config object.
 * @param {string} config.text The source code to verify.
 * @param {string} config.cwd The path to the current working directory.
 * @param {string|undefined} config.filePath The path to the file of `text`. If this is undefined, it uses `<text>`.
 * @param {FlatConfigArray} config.configs The config.
 * @param {boolean} config.fix If `true` then it does fix.
 * @param {boolean} config.allowInlineConfig If `true` then it uses directive comments.
 * @param {boolean} config.reportUnusedDisableDirectives If `true` then it reports unused `eslint-disable` comments.
 * @param {Linter} config.linter The linter instance to verify.
 * @returns {LintResult} The result of linting.
 * @private
 */
function verifyText({
    text,
    cwd,
    filePath: providedFilePath,
    configs,
    fix,
    allowInlineConfig,
    reportUnusedDisableDirectives,
    linter
}) {
    const filePath = providedFilePath || "<text>";

    debug(`Lint ${filePath}`);
    
    /*
     * Verify.
     * `config.extractConfig(filePath)` requires an absolute path, but `linter`
     * doesn't know CWD, so it gives `linter` an absolute path always.
     */
    const filePathToVerify = filePath === "<text>" ? path.join(cwd, filePath) : filePath;
    const { fixed, messages, output } = linter.verifyAndFix(
        text,
        configs,
        {
            allowInlineConfig,
            filename: filePathToVerify,
            fix,
            reportUnusedDisableDirectives,

            /**
             * Check if the linter should adopt a given code block or not.
             * @param {string} blockFilename The virtual filename of a code block.
             * @returns {boolean} `true` if the linter should adopt the code block.
             */
            filterCodeBlock(blockFilename) {
                // TODO: What does this do?
                // return fileEnumerator.isTargetPath(blockFilename);
            }
        }
    );

    // Tweak and return.
    const result = {
        filePath,
        messages,
        ...calculateStatsPerFile(messages)
    };

    if (fixed) {
        result.output = output;
    }

    if (
        result.errorCount + result.warningCount > 0 &&
        typeof result.output === "undefined"
    ) {
        result.source = text;
    }

    return result;
}

/**
 * Checks whether a message's rule type should be fixed.
 * @param {LintMessage} message The message to check.
 * @param {ConfigArray[]} lastConfigArrays The list of config arrays that the last `executeOnFiles` or `executeOnText` used.
 * @param {string[]} fixTypes An array of fix types to check.
 * @returns {boolean} Whether the message should be fixed.
 */
function shouldMessageBeFixed(message, lastConfigArrays, fixTypes) {
    if (!message.ruleId) {
        return fixTypes.has("directive");
    }

    const rule = message.ruleId && getRule(message.ruleId, lastConfigArrays);

    return Boolean(rule && rule.meta && fixTypes.has(rule.meta.type));
}

/**
 * Collect used deprecated rules.
 * @param {FlatConfig} config The config to evaluate.
 * @returns {IterableIterator<DeprecatedRuleInfo>} Used deprecated rules.
 */
function *iterateRuleDeprecationWarnings(config) {
    const processedRuleIds = new Set();

    for (const [ruleId, ruleConfig] of Object.entries(config.rules)) {

        // Skip if it was processed.
        if (processedRuleIds.has(ruleId)) {
            continue;
        }
        processedRuleIds.add(ruleId);

        // Skip if it's not used.
        if (!getRuleSeverity(ruleConfig)) {
            continue;
        }
        const rule = getRuleFromConfig(ruleId, config);

        // Skip if it's not deprecated.
        if (!(rule && rule.meta && rule.meta.deprecated)) {
            continue;
        }

        // This rule was used and deprecated.
        yield {
            ruleId,
            replacedBy: rule.meta.replacedBy || []
        };
    }
}

/**
 * Convert a string array to a boolean map.
 * @param {string[]|null} keys The keys to assign true.
 * @param {boolean} defaultValue The default value for each property.
 * @param {string} displayName The property name which is used in error message.
 * @throws {Error} Requires array.
 * @returns {Record<string,boolean>} The boolean map.
 */
function toBooleanMap(keys, defaultValue, displayName) {
    if (keys && !Array.isArray(keys)) {
        throw new Error(`${displayName} must be an array.`);
    }
    if (keys && keys.length > 0) {
        return keys.reduce((map, def) => {
            const [key, value] = def.split(":");

            if (key !== "__proto__") {
                map[key] = value === void 0
                    ? defaultValue
                    : value === "true";
            }

            return map;
        }, {});
    }
    return void 0;
}

/**
 * Create a config data from CLI options.
 * @param {CLIEngineOptions} options The options
 * @returns {ConfigData|null} The created config data.
 */
function createConfigDataFromOptions(options) {
    const {
        ignorePattern,
        parser,
        parserOptions,
        plugins,
        rules
    } = options;
    const env = toBooleanMap(options.envs, true, "envs");
    const globals = toBooleanMap(options.globals, false, "globals");

    if (
        env === void 0 &&
        globals === void 0 &&
        (ignorePattern === void 0 || ignorePattern.length === 0) &&
        parser === void 0 &&
        parserOptions === void 0 &&
        plugins === void 0 &&
        rules === void 0
    ) {
        return null;
    }
    return {
        env,
        globals,
        ignorePatterns: ignorePattern,
        parser,
        parserOptions,
        plugins,
        rules
    };
}

//-----------------------------------------------------------------------------
// Main API
//-----------------------------------------------------------------------------

/**
 * Primary Node.js API for ESLint.
 */
class FlatESLint {

    /**
     * Creates a new instance of the main ESLint API.
     * @param {FlatESLintOptions} options The options for this instance.
     */
    constructor(options = {}) {

        const defaultConfigs = [];
        const processedOptions = processOptions(options);
        const linter = new Linter({
            cwd: processedOptions.cwd,
            configType: "flat"
        });

        privateMembers.set(this, {
            options: processedOptions,
            linter,
            defaultConfigs,
            defaultIgnores: () => false,
            configs: null
        });

        /**
         * If additional plugins are passed in, add that to the default
         * configs for this instance.
         */
        if (options.plugins) {

            const plugins = {};

            for (const [pluginName, plugin] of Object.entries(options.plugins)) {
                plugins[naming.getShorthandName(pluginName, "eslint-plugin")] = plugin;
            }

            defaultConfigs.push({
                plugins
            });
        }

    }

    /**
     * The version text.
     * @type {string}
     */
    static get version() {
        return version;
    }

    /**
     * Outputs fixes from the given results to files.
     * @param {LintResult[]} results The lint results.
     * @returns {Promise<void>} Returns a promise that is used to track side effects.
     */
    static async outputFixes(results) {
        if (!Array.isArray(results)) {
            throw new Error("'results' must be an array");
        }

        await Promise.all(
            results
                .filter(result => {
                    if (typeof result !== "object" || result === null) {
                        throw new Error("'results' must include only objects");
                    }
                    return (
                        typeof result.output === "string" &&
                        path.isAbsolute(result.filePath)
                    );
                })
                .map(r => writeFile(r.filePath, r.output))
        );
    }

    /**
     * Returns results that only contains errors.
     * @param {LintResult[]} results The results to filter.
     * @returns {LintResult[]} The filtered results.
     */
    static getErrorResults(results) {
        const filtered = [];

        results.forEach(result => {
            const filteredMessages = result.messages.filter(isErrorMessage);

            if (filteredMessages.length > 0) {
                filtered.push({
                    ...result,
                    messages: filteredMessages,
                    errorCount: filteredMessages.length,
                    warningCount: 0,
                    fixableErrorCount: result.fixableErrorCount,
                    fixableWarningCount: 0
                });
            }
        });

        return filtered;
    }

    /**
     * Returns meta objects for each rule represented in the lint results.
     * @param {LintResult[]} results The results to fetch rules meta for.
     * @returns {Object} A mapping of ruleIds to rule meta objects.
     * @throws {TypeError} When the results object wasn't created from this ESLint instance.
     * @throws {TypeError} When a plugin or rule is missing.
     */
    getRulesMetaForResults(results) {

        const resultRules = new Map();

        // short-circuit simple case
        if (results.length === 0) {
            return resultRules;
        }

        const { configs } = privateMembers.get(this);

        /*
         * We can only accurately return rules meta information for linting results if the
         * results were created by this instance. Otherwise, the necessary rules data is
         * not available. So if the config array doesn't already exist, just throw an error
         * to let the user know we can't do anything here.
         */
        if (!configs) {
            throw new TypeError("Results object was not created from this ESLint instance.");
        }

        for (const result of results) {

            /*
             * All of the plugin and rule information is contained within the
             * calculated config for the given file.
             */
            const config = configs.getConfig(result.filePath);

            for (const { ruleId } of result.messages) {
                const rule = getRuleFromConfig(ruleId, config);

                // ensure the rule exists exists
                if (!rule) {
                    throw new TypeError(`Could not find the rule "${ruleId}" in plugin "${pluginName}".`);
                }

                resultRules.set(ruleId, rule);
            }
        }

        return createRulesMeta(resultRules);
    }

    /**
     * Executes the current configuration on an array of file and directory names.
     * @param {string[]} patterns An array of file and directory names.
     * @returns {Promise<LintResult[]>} The results of linting the file patterns given.
     */
    async lintFiles(patterns) {
        if (!isNonEmptyString(patterns) && !isArrayOfNonEmptyString(patterns)) {
            throw new Error("'patterns' must be a non-empty string or an array of non-empty strings");
        }
        // const { cliEngine } = privateMembersMap.get(this);

        // return processCLIEngineLintReport(
        //     cliEngine,
        //     cliEngine.executeOnFiles(patterns)
        // );
    }

    /**
     * Executes the current configuration on text.
     * @param {string} code A string of JavaScript code to lint.
     * @param {Object} [options] The options.
     * @param {string} [options.filePath] The path to the file of the source code.
     * @param {boolean} [options.warnIgnored] When set to true, warn if given filePath is an ignored path.
     * @returns {Promise<LintResult[]>} The results of linting the string of code given.
     */
    async lintText(code, options = {}) {

        // Parameter validation

        if (typeof code !== "string") {
            throw new Error("'code' must be a string");
        }

        if (typeof options !== "object") {
            throw new Error("'options' must be an object, null, or undefined");
        }

        // Options validation

        const {
            filePath,
            warnIgnored = false,
            ...unknownOptions
        } = options || {};

        const unknownOptionKeys = Object.keys(unknownOptions);

        if (unknownOptionKeys.length > 0) {
            throw new Error(`'options' must not include the unknown option(s): ${unknownOptionKeys.join(", ")}`);
        }

        if (filePath !== void 0 && !isNonEmptyString(filePath)) {
            throw new Error("'options.filePath' must be a non-empty string or undefined");
        }

        if (typeof warnIgnored !== "boolean") {
            throw new Error("'options.warnIgnored' must be a boolean or undefined");
        }

        // Now we can get down to linting

        const {
            linter,
            options: eslintOptions
        } = privateMembers.get(this);
        const configs = await calculateConfigArray(this, eslintOptions);
        const {
            allowInlineConfig,
            cwd,
            fix,
            reportUnusedDisableDirectives
        } = eslintOptions;
        const results = [];
        const startTime = Date.now();
        const resolvedFilename = path.resolve(cwd, filePath || "__placeholder__.js");
        let config;

        // Clear the last used config arrays.
        if (resolvedFilename && await this.isPathIgnored(resolvedFilename)) {
            if (warnIgnored) {
                results.push(createIgnoreResult(resolvedFilename, cwd));
            }
        } else {

            // TODO: Needed?
            config = configs.getConfig(resolvedFilename);

            // Do lint.
            results.push(verifyText({
                text: code,
                filePath: resolvedFilename.endsWith("__placeholder__.js") ? "<text>" : resolvedFilename,
                configs,
                cwd,
                fix,
                allowInlineConfig,
                reportUnusedDisableDirectives,
                linter
            }));
        }

        debug(`Linting complete in: ${Date.now() - startTime}ms`);
        let usedDeprecatedRules;

        return processLintReport(this, {
            results,
            ...calculateStatsPerRun(results),

            // Initialize it lazily because CLI and `ESLint` API don't use it.
            get usedDeprecatedRules() {
                if (!usedDeprecatedRules) {
                    usedDeprecatedRules = Array.from(
                        iterateRuleDeprecationWarnings(config)
                    );
                }
                return usedDeprecatedRules;
            }
        });

    }

    /**
     * Returns the formatter representing the given formatter name.
     * @param {string} [name] The name of the formatter to load.
     * The following values are allowed:
     * - `undefined` ... Load `stylish` builtin formatter.
     * - A builtin formatter name ... Load the builtin formatter.
     * - A thirdparty formatter name:
     *   - `foo` → `eslint-formatter-foo`
     *   - `@foo` → `@foo/eslint-formatter`
     *   - `@foo/bar` → `@foo/eslint-formatter-bar`
     * - A file path ... Load the file.
     * @returns {Promise<Formatter>} A promise resolving to the formatter object.
     * This promise will be rejected if the given formatter was not found or not
     * a function.
     */
    async loadFormatter(name = "stylish") {
        if (typeof name !== "string") {
            throw new Error("'name' must be a string");
        }

        // replace \ with / for Windows compatibility
        const normalizedFormatName = name.replace(/\\/gu, "/");
        const namespace = naming.getNamespaceFromTerm(normalizedFormatName);

        // grab our options
        const { cwd } = privateMembers.get(this).options;


        let formatterPath;

        // if there's a slash, then it's a file (TODO: this check seems dubious for scoped npm packages)
        if (!namespace && normalizedFormatName.indexOf("/") > -1) {
            formatterPath = path.resolve(cwd, normalizedFormatName);
        } else {
            try {
                const npmFormat = naming.normalizePackageName(normalizedFormatName, "eslint-formatter");

                // TODO: This is pretty dirty...would be nice to clean up at some point.
                formatterPath = ModuleResolver.resolve(npmFormat, path.join(cwd, "__placeholder__.js"));
            } catch {
                formatterPath = path.resolve(__dirname, "../", "cli-engine", "formatters", `${normalizedFormatName}.js`);
            }
        }

        let formatter;

        try {
            formatter = (await import(pathToFileURL(formatterPath))).default;
        } catch (ex) {

            // check for formatters that have been removed
            if (removedFormatters.has(name)) {
                ex.message = `The ${name} formatter is no longer part of core ESLint. Install it manually with \`npm install -D eslint-formatter-${name}\``;
            } else {
                ex.message = `There was a problem loading formatter: ${formatterPath}\nError: ${ex.message}`;
            }

            throw ex;
        }


        if (typeof formatter !== "function") {
            throw new TypeError(`Formatter must be a function, but got a ${typeof formatter}.`);
        }

        const eslint = this;

        return {

            /**
             * The main formatter method.
             * @param {LintResults[]} results The lint results to format.
             * @returns {string} The formatted lint results.
             */
            format(results) {
                let rulesMeta = null;

                results.sort(compareResultsByFilePath);

                return formatter(results, {
                    get rulesMeta() {
                        if (!rulesMeta) {
                            rulesMeta = eslint.getRulesMetaForResults(results);
                        }

                        return rulesMeta;
                    }
                });
            }
        };
    }

    /**
     * Returns a configuration object for the given file based on the CLI options.
     * This is the same logic used by the ESLint CLI executable to determine
     * configuration for each file it processes.
     * @param {string} filePath The path of the file to retrieve a config object for.
     * @returns {Promise<ConfigData|undefined>} A configuration object for the file
     *      or `undefined` if there is no configuration data for the object.
     */
    async calculateConfigForFile(filePath) {
        if (!isNonEmptyString(filePath)) {
            throw new Error("'filePath' must be a non-empty string");
        }
        const options = privateMembers.get(this).options;
        const absolutePath = path.resolve(options.cwd, filePath);
        const configs = await calculateConfigArray(this, options);

        return configs.getConfig(absolutePath);
    }

    /**
     * Checks if a given path is ignored by ESLint.
     * @param {string} filePath The path of the file to check.
     * @returns {Promise<boolean>} Whether or not the given path is ignored.
     */
    async isPathIgnored(filePath) {
        const config = await this.calculateConfigForFile(filePath);

        return config === void 0;
    }
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = {
    FlatESLint
};
