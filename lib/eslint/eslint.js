/**
 * @fileoverview Main API Class
 * @author Kai Cataldo
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const path = require("path");
const { CLIEngine, getCLIEngineInternalSlots } = require("../cli-engine/cli-engine");
const BuiltinRules = require("../rules");
const { getRuleSeverity } = require("../shared/config-ops");

//------------------------------------------------------------------------------
// Typedefs
//------------------------------------------------------------------------------

/** @typedef {InstanceType<import("../cli-engine/cascading-config-array-factory")["CascadingConfigArrayFactory"]>} CascadingConfigArrayFactory */
/** @typedef {import("../cli-engine/cli-engine").LintReport} CLIEngineLintReport */
/** @typedef {import("../shared/types").DeprecatedRuleInfo} DeprecatedRuleInfo */
/** @typedef {import("../shared/types").Rule} Rule */

/**
 * The options with which to configure the ESLint instance.
 * @typedef {Object} ESLintOptions
 * @property {boolean} allowInlineConfig Enable or disable inline configuration comments.
 * @property {ConfigData} baseConfig Base config object, extended by all configs used with this instance
 * @property {boolean} cache Enable result caching.
 * @property {string} cacheLocation The cache file to use instead of .eslintcache.
 * @property {string} configFile The configuration file to use.
 * @property {string} cwd The value to use for the current working directory.
 * @property {string[]} envs An array of environments to load.
 * @property {string[]} extensions An array of file extensions to check.
 * @property {boolean|Function} fix Execute in autofix mode. If a function, should return a boolean.
 * @property {string[]} fixTypes Array of rule types to apply fixes for.
 * @property {string[]} globals An array of global variables to declare.
 * @property {boolean} globInputPaths Set to false to skip glob resolution of input file paths to lint (default: true). If false, each input file paths is assumed to be a non-glob path to an existing file.
 * @property {boolean} ignore False disables use of .eslintignore.
 * @property {string} ignorePath The ignore file to use instead of .eslintignore.
 * @property {string|string[]} ignorePattern One or more glob patterns to ignore.
 * @property {string} parser The name of the parser to use.
 * @property {ParserOptions} parserOptions An object of parserOption settings to use.
 * @property {string[]} plugins An array of plugins to load.
 * @property {boolean} reportUnusedDisableDirectives `true` adds reports for unused eslint-disable directives.
 * @property {string} resolvePluginsRelativeTo The folder where plugins should be resolved from, defaulting to the CWD.
 * @property {string[]} rulePaths An array of directories to load custom rules from.
 * @property {Record<string,RuleConf>} rules An object of rules to use.
 * @property {boolean} useEslintrc False disables looking for .eslintrc.* files.
 */

/**
 * A plugin object.
 * @typedef {Object} PluginElement
 * @property {string} id The plugin ID.
 * @property {Object} definition The plugin definition.
 */

/**
 * A rules metadata object.
 * @typedef {Object} RulesMeta
 * @property {string} id The plugin ID.
 * @property {Object} definition The plugin definition.
 */

/**
 * A linting result.
 * @typedef {Object} LintResult
 * @property {string} filePath The path to the file that was linted.
 * @property {LintMessage[]} messages All of the messages for the result.
 * @property {number} errorCount Number of errors for the result.
 * @property {number} warningCount Number of warnings for the result.
 * @property {number} fixableErrorCount Number of fixable errors for the result.
 * @property {number} fixableWarningCount Number of fixable warnings for the result.
 * @property {string} [source] The source code of the file that was linted.
 * @property {string} [output] The source code of the file that was linted, with as many fixes applied as possible.
 * @property {DeprecatedRuleInfo[]} usedDeprecatedRules The list of used deprecated rules.
 */

/**
 * A formatter object.
 * @typedef {Object} Formatter
 * @property {(results: LintResult[]) => string} format The main formatter method.
 */

/**
 * Private members for the `ESLint` instance.
 * @typedef {Object} ESLintPrivateMembers
 * @property {CLIEngine} cliEngine The wrapped CLIEngine instance.
 * @property {ESLintOptions} options The options used to instantiate the ESLint instance.
 */

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * The map with which to store private class members.
 * @type {WeakMap<ESLint, ESLintPrivateMembers>}
 */
const privateMembersMap = new WeakMap();

/**
 * Checks if a plugin object is valid.
 * @param {PluginElement} plugin The plugin to check.
 * @returns {boolean} Whether te plugin is valid or not.
 */
function isValidPluginObject(plugin) {
    return typeof plugin === "object" && !Array.isArray(plugin) && plugin !== null && plugin.id && plugin.definition;
}

/**
 * Normalizes an array of plugins to their respective IDs.
 * @param {string[]|PluginElement[]} plugins An array of plugins to normalize.
 * @returns {string[]} The normalized array of plugins.
 */
function normalizePluginIds(plugins) {
    return plugins.map(p => (typeof p === "string" ? p : p.id));
}

/**
 * Validates and normalizes options for the wrapped CLIEngine instance.
 * @param {ESLintOptions} options The options to process.
 * @returns {ESLintOptions} The normalized options.
 */
function processOptions({
    allowInlineConfig = true,
    baseConfig = null,
    cache = false,
    cacheLocation = ".eslintcache",
    configFile = null,
    cwd = process.cwd(),
    envs = [],
    extensions = null, // TODO: Should we update the CLIEngine check to account for empty arrays?
    fix = false,
    fixTypes = [], // TODO: We don't currently set a default value for this. Doing so changes the behavior.
    globals = [],
    globInputPaths = true,
    ignore = true,
    ignorePath = null,
    ignorePattern = [],
    parser = null, // Question: if this is set to a default value it ends up overriding the value set in the config. That seems like unexpected behavior to me.
    parserOptions = {}, // TODO: Is this correct?
    plugins = [],
    reportUnusedDisableDirectives = null,
    resolvePluginsRelativeTo = cwd,
    rulePaths = [],
    rules = {}, // TODO: Is this correct?
    useEslintrc = true,
    ...unknownOptions
}) {
    const unknownOptionKeys = Object.keys(unknownOptions);

    if (unknownOptionKeys.length >= 1) {
        throw new Error(`${
            unknownOptionKeys.includes("cacheFile")
                ? "cacheFile has been deprecated. Please use the cacheLocation option instead. "
                : ""
        }Unknown options given: ${unknownOptionKeys.join(", ")}.`);
    }

    if (typeof allowInlineConfig !== "boolean") {
        throw new Error("allowInlineConfig must be a boolean.");
    }

    if (typeof baseConfig !== "object") {
        throw new Error("baseConfig must be an object or null.");
    }

    if (typeof cache !== "boolean") {
        throw new Error("cache must be a boolean.");
    }

    if (typeof cacheLocation !== "string") {
        throw new Error("cacheLocation must be a string.");
    }

    if (typeof configFile !== "string" && configFile !== null) {
        throw new Error("configFile must be a string or null.");
    }

    if (typeof cwd !== "string") {
        throw new Error("cwd must be a string.");
    }

    if (!Array.isArray(envs)) {
        throw new Error("envs must be an array.");
    }

    if (!Array.isArray(extensions) && extensions !== null) {
        throw new Error("extensions must be an array or null.");
    }

    if (typeof fix !== "boolean") {
        throw new Error("fix must be a boolean.");
    }

    if (!Array.isArray(fixTypes)) {
        throw new Error("fixTypes must be an array.");
    }

    if (!Array.isArray(globals)) {
        throw new Error("globals must be an array.");
    }

    if (typeof globInputPaths !== "boolean") {
        throw new Error("globInputPaths must be a boolean.");
    }

    if (typeof ignore !== "boolean") {
        throw new Error("globInputPaths must be a boolean.");
    }

    if (typeof ignorePath !== "string" && ignorePath !== null) {
        throw new Error("ignorePath must be a string or null.");
    }

    if (typeof ignorePattern !== "string" && !Array.isArray(ignorePattern)) {
        throw new Error("ignorePattern must be a string or an array of strings.");
    }

    if (typeof parser !== "string" && parser !== null) {
        throw new Error("parser must be a string or null.");
    }

    if (typeof parserOptions !== "object" && parserOptions !== null) {
        throw new Error("parserOptions must be an object or null.");
    }

    if (!Array.isArray(plugins)) {
        throw new Error("plugins must be an array.");
    }

    if (typeof reportUnusedDisableDirectives !== "boolean" && reportUnusedDisableDirectives !== null) {
        throw new Error("reportUnusedDisableDirectives must be a boolean or null.");
    }

    if (typeof resolvePluginsRelativeTo !== "string") {
        throw new Error("resolvePluginsRelativeTo must be a string.");
    }

    if (!Array.isArray(rulePaths)) {
        throw new Error("plugins must be an array.");
    }

    if (typeof rules !== "object") {
        throw new Error("rules must be an object or null.");
    }

    if (typeof useEslintrc !== "boolean") {
        throw new Error("useElintrc must be a boolean.");
    }

    return {
        allowInlineConfig,
        baseConfig,
        cache,
        cacheLocation,
        configFile,
        cwd,
        envs,
        extensions,
        fix,
        fixTypes,
        globals,
        globInputPaths,
        ignore,
        ignorePath,
        ignorePattern,
        parser,
        parserOptions,
        plugins: normalizePluginIds(plugins),
        reportUnusedDisableDirectives,
        resolvePluginsRelativeTo,
        rulePaths,
        rules,
        useEslintrc
    };
}

/**
 * Create rulesMeta object.
 * @param {Map<string,Rule>} rules a map of rules from which to generate the object.
 * @returns {Object} metadata for all enabled rules.
 */
function createRulesMeta(rules) {
    return Array.from(rules).reduce((retVal, [id, rule]) => {
        retVal.rulesMeta[id] = rule.meta;
        return retVal;
    }, { rulesMeta: {} });
}

/** @type {WeakMap<ExtractedConfig, DeprecatedRuleInfo[]>} */
const usedDeprecatedRulesCache = new WeakMap();

/**
 * Create used deprecated rule list.
 * @param {CascadingConfigArrayFactory} factory The config array factory.
 * @param {string} filePath The path to a lint target file.
 * @returns {DeprecatedRuleInfo[]} The used deprecated rule list.
 */
function calculateUsedDeprecatedRules(factory, filePath) {
    const configArray = factory.getConfigArrayForFile(filePath);
    const config = configArray.extractConfig(filePath);

    // Most files use the same config, so cache it.
    if (!usedDeprecatedRulesCache.has(config)) {
        const pluginRules = configArray.pluginRules;
        const retv = [];

        for (const [ruleId, ruleConf] of Object.entries(config.rules)) {
            if (getRuleSeverity(ruleConf) === 0) {
                continue;
            }
            const rule = pluginRules.get(ruleId) || BuiltinRules.get(ruleId);
            const meta = rule && rule.meta;

            if (meta && meta.deprecated) {
                retv.push({ ruleId, replacedBy: meta.replacedBy || [] });
            }
        }

        usedDeprecatedRulesCache.set(config, Object.freeze(retv));
    }

    return usedDeprecatedRulesCache.get(config);
}

/**
 * Processes the linting results generated by a CLIEngine linting report to
 * match the ESLint class's API.
 * @param {CascadingConfigArrayFactory} factory The config array factory.
 * @param {CLIEngineLintReport} report The CLIEngine linting report to process.
 * @returns {LintResult[]} The processed linting results.
 */
function processCLIEngineLintReport(factory, { results }) {
    const descriptor = {
        configurable: true,
        enumerable: true,
        get() {
            const filePath =
                path.isAbsolute(this.filePath) ? this.filePath : null;

            return calculateUsedDeprecatedRules(factory, filePath);
        }
    };

    for (const result of results) {
        Object.defineProperty(result, "usedDeprecatedRules", descriptor);
    }

    return results;
}

class ESLint {

    /**
     * Creates a new instance of the main ESLint API.
     * @param {ESLintOptions} options The options for this instance.
     */
    constructor(options = {}) {
        const processedOptions = processOptions(options);
        const cliEngine = new CLIEngine(processedOptions);

        if (options.plugins && options.plugins.length) {
            for (const plugin of options.plugins) {
                if (isValidPluginObject(plugin)) {
                    cliEngine.addPlugin(plugin.id, plugin.definition);
                } else if (typeof plugin !== "string") {
                    throw new Error("Invalid plugin. Plugins must be specified as a string (e.g., \"eslint-plugin-example\") or as an object (e.g., { id: string; definition: Object }).");
                }
            }
        }

        // Initialize private properties.
        privateMembersMap.set(this, {
            cliEngine,
            options: processedOptions
        });
    }

    /**
     * Outputs fixes from the given results to files.
     * @param {LintReport} report The report object created by CLIEngine.
     * @returns {Promise<void>} Returns a promise that is used to track side effects.
     */
    static async outputFixes(report) {
        CLIEngine.outputFixes(report);
    }

    /**
     * An Array.prototype.sort() compatible compare function to order results by their file path.
     * @param {LintResult} a The first lint result.
     * @param {LintResult} b The second lint result.
     * @returns {number} An integer representing the order in which the two results should occur.
     */
    static compareResultsByFilePath(a, b) {
        if (a.filePath < b.filePath) {
            return -1;
        }

        if (a.filePath > b.filePath) {
            return 1;
        }

        return 0;
    }

    /**
     * Returns results that only contains errors.
     * @param {LintResult[]} results The results to filter.
     * @returns {LintResult[]} The filtered results.
     */
    static getErrorResults(results) {
        return CLIEngine.getErrorResults(results);
    }

    /**
     * Executes the current configuration on an array of file and directory names.
     * @param {string[]} patterns An array of file and directory names.
     * @returns {Promise<LintResult[]>} The results of linting the file patterns given.
     */
    async lintFiles(patterns) {
        const { cliEngine } = privateMembersMap.get(this);
        const { configArrayFactory } = getCLIEngineInternalSlots(cliEngine);

        return processCLIEngineLintReport(
            configArrayFactory,
            cliEngine.executeOnFiles(patterns)
        );
    }

    /**
     * Executes the current configuration on text.
     * @param {string} code A string of JavaScript code to lint.
     * @param {Object} [options] The options.
     * @param {string} [options.filePath] The path to the file of the source code.
     * @param {boolean} [options.warnIgnored] When set to true, warn if given filePath is an ignored path.
     * @returns {Promise<LintResult[]>} The results of linting the string of code given.
     */
    async lintText(code, { filePath = null, warnIgnored = false } = {}) {
        const { cliEngine } = privateMembersMap.get(this);
        const { configArrayFactory } = getCLIEngineInternalSlots(cliEngine);

        return processCLIEngineLintReport(
            configArrayFactory,
            cliEngine.executeOnText(code, filePath, warnIgnored)
        );
    }

    /**
     * Returns the formatter representing the given formatter or null if no formatter
     * with the given name can be found.
     * @param {string} name The name of the formattter to load or the path to a
     *      custom formatter.
     * @returns {Promise<Formatter|null>} A promise resolving to the formatter object or null if not found.
     */
    async loadFormatter(name) {
        const { cliEngine } = privateMembersMap.get(this);
        const formatter = cliEngine.getFormatter(name);

        if (formatter === null) {
            return null;
        }

        return {

            /**
             * The main formatter method.
             * @param {LintResults[]} results The lint results to format.
             * @returns {any} The formatted lint results.
             */
            format(results) {
                let rulesMeta = null;

                results.sort(ESLint.compareResultsByFilePath);

                return formatter(results, {
                    get rulesMeta() {
                        if (!rulesMeta) {
                            rulesMeta = createRulesMeta(cliEngine.getRules());
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
     * @returns {Promise<ConfigData>} A configuration object for the file.
     */
    async calculateConfigForFile(filePath) {
        const { cliEngine } = privateMembersMap.get(this);

        return cliEngine.getConfigForFile(filePath);
    }

    /**
     * Checks if a given path is ignored by ESLint.
     * @param {string} filePath The path of the file to check.
     * @returns {boolean} Whether or not the given path is ignored.
     */
    async isPathIgnored(filePath) {
        const { cliEngine } = privateMembersMap.get(this);

        return cliEngine.isPathIgnored(filePath);
    }
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = {
    ESLint,

    /**
     * Get the private class members of a given ESLint instance for tests.
     * @param {ESLint} instance The ESLint instance to get.
     * @returns {ESLintPrivateMembers} The instance's private class members.
     */
    getESLintPrivateMembers(instance) {
        return privateMembersMap.get(instance);
    }
};
