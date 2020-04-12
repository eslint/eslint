/**
 * @fileoverview Main API Class
 * @author Kai Cataldo
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const { CLIEngine, getCLIEngineInternalSlots } = require("../cli-engine/cli-engine");
const BuiltinRules = require("../rules");
const { getRuleSeverity } = require("../shared/config-ops");

//------------------------------------------------------------------------------
// Typedefs
//------------------------------------------------------------------------------

/** @typedef {import("../cli-engine/cli-engine").LintReport} CLIEngineLintReport */
/** @typedef {import("../shared/types").DeprecatedRuleInfo} DeprecatedRuleInfo */
/** @typedef {import("../shared/types").Rule} Rule */

/**
 * The options with which to configure the ESLint instance.
 * @typedef {Object} ESLintOptions
 * @property {boolean} [allowInlineConfig] Enable or disable inline configuration comments.
 * @property {ConfigData} [baseConfig] Base config object, extended by all configs used with this instance
 * @property {boolean} [cache] Enable result caching.
 * @property {string} [cacheLocation] The cache file to use instead of .eslintcache.
 * @property {string} [configFile] The configuration file to use.
 * @property {string} [cwd] The value to use for the current working directory.
 * @property {string[]} [envs] An array of environments to load.
 * @property {string[]} [extensions] An array of file extensions to check.
 * @property {boolean|Function} [fix] Execute in autofix mode. If a function, should return a boolean.
 * @property {string[]} [fixTypes] Array of rule types to apply fixes for.
 * @property {string[]} [globals] An array of global variables to declare.
 * @property {boolean} [globInputPaths] Set to false to skip glob resolution of input file paths to lint (default: true). If false, each input file paths is assumed to be a non-glob path to an existing file.
 * @property {boolean} [ignore] False disables use of .eslintignore.
 * @property {string} [ignorePath] The ignore file to use instead of .eslintignore.
 * @property {string|string[]} [ignorePattern] One or more glob patterns to ignore.
 * @property {string} [parser] The name of the parser to use.
 * @property {ParserOptions} [parserOptions] An object of parserOption settings to use.
 * @property {string[]} [plugins] An array of plugins to load.
 * @property {boolean} [reportUnusedDisableDirectives] `true` adds reports for unused eslint-disable directives.
 * @property {string} [resolvePluginsRelativeTo] The folder where plugins should be resolved from, defaulting to the CWD.
 * @property {string[]} [rulePaths] An array of directories to load custom rules from.
 * @property {Record<string,RuleConf>} [rules] An object of rules to use.
 * @property {boolean} [useEslintrc] False disables looking for .eslintrc.* files.
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

const writeFile = promisify(fs.writeFile);

/**
 * The map with which to store private class members.
 * @type {WeakMap<ESLint, ESLintPrivateMembers>}
 */
const privateMembersMap = new WeakMap();

/**
 * Normalizes an array of plugins to their respective IDs.
 * @param {string[]|PluginElement[]} plugins An array of plugins to normalize.
 * @returns {string[]} The normalized array of plugins.
 */
function normalizePluginIds(plugins) {
    return plugins.map(p => (typeof p === "string" ? p : p.id));
}

/**
 * Check if a given value is a non-empty string or not.
 * @param {any} x The value to check.
 * @returns {boolean} `true` if `x` is a non-empty string.
 */
function isNonEmptyString(x) {
    return typeof x === "string" && x.trim() !== "";
}

/**
 * Check if a given value is an array of non-empty stringss or not.
 * @param {any} x The value to check.
 * @returns {boolean} `true` if `x` is an array of non-empty stringss.
 */
function isArrayOfNonEmptyString(x) {
    return Array.isArray(x) && x.every(isNonEmptyString);
}

/**
 * Check if a given value is a valid fix type or not.
 * @param {any} x The value to check.
 * @returns {boolean} `true` if `x` is valid fix type.
 */
function isFixType(x) {
    return x === "problem" || x === "suggestion" || x === "layout";
}

/**
 * Check if a given value is an array of fix types or not.
 * @param {any} x The value to check.
 * @returns {boolean} `true` if `x` is an array of fix types.
 */
function isFixTypeArray(x) {
    return Array.isArray(x) && x.every(isFixType);
}

/**
 * Check if a given value is a plugin object or not.
 * @param {any} x The value to check.
 * @returns {boolean} `true` if `x` is a plugin object.
 */
function isPluginObject(x) {
    return (
        typeof x === "object" &&
        x !== null &&
        typeof x.id === "string" &&
        x.id !== "" &&
        typeof x.definition === "object" &&
        x.definition !== null
    );
}

/**
 * Check if a given value is a valid plugin or not.
 * @param {any} x The value to check.
 * @returns {boolean} `true` if `x` is valid plugin.
 */
function isPlugin(x) {
    return isNonEmptyString(x) || isPluginObject(x);
}

/**
 * Check if a given value is an array of plugins or not.
 * @param {any} x The value to check.
 * @returns {boolean} `true` if `x` is an array of plugins.
 */
function isPluginArray(x) {
    return Array.isArray(x) && x.every(isPlugin);
}

/**
 * The error for invalid options.
 */
class ESLintInvalidOptionsError extends Error {
    constructor(messages) {
        super(`Invalid Options:\n- ${messages.join("\n- ")}`);
        this.code = "ESLINT_INVALID_OPTIONS";
        Error.captureStackTrace(this, ESLintInvalidOptionsError);
    }
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
    extensions = null, // ← should be null by default because if it's an array then it suppresses RFC20 feature.
    fix = false,
    fixTypes = ["problem", "suggestion", "layout"],
    globals = [],
    globInputPaths = true,
    ignore = true,
    ignorePath = null,
    ignorePattern = [],
    parser = null,
    parserOptions = {},
    plugins = [],
    reportUnusedDisableDirectives = null, // ← should be null by default because if it's a boolean then it overrides the 'reportUnusedDisableDirectives' setting in config files.
    resolvePluginsRelativeTo = null, // ← should be null by default because if it's a string then it suppresses RFC47 feature.
    rulePaths = [],
    rules = {},
    useEslintrc = true,
    ...unknownOptions
}) {
    const errors = [];
    const unknownOptionKeys = Object.keys(unknownOptions);

    if (unknownOptionKeys.length >= 1) {
        errors.push(`Unknown options: ${unknownOptionKeys.join(", ")}`);
        if (unknownOptionKeys.includes("cacheFile")) {
            errors.push("'cacheFile' has been deprecated. Please use the 'cacheLocation' option instead.");
        }
    }
    if (typeof allowInlineConfig !== "boolean") {
        errors.push("'allowInlineConfig' must be a boolean.");
    }
    if (typeof baseConfig !== "object") {
        errors.push("'baseConfig' must be an object or null.");
    }
    if (typeof cache !== "boolean") {
        errors.push("'cache' must be a boolean.");
    }
    if (!isNonEmptyString(cacheLocation)) {
        errors.push("'cacheLocation' must be a non-empty string.");
    }
    if (!isNonEmptyString(configFile) && configFile !== null) {
        errors.push("'configFile' must be a non-empty string or null.");
    }
    if (!isNonEmptyString(cwd) || !path.isAbsolute(cwd)) {
        errors.push("'cwd' must be an absolute path.");
    }
    if (!isArrayOfNonEmptyString(envs)) {
        errors.push("'envs' must be an array of non-empty strings.");
    }
    if (!isArrayOfNonEmptyString(extensions) && extensions !== null) {
        errors.push("'extensions' must be an array of non-empty strings or null.");
    }
    if (typeof fix !== "boolean" && typeof fix !== "function") {
        errors.push("'fix' must be a boolean or a function.");
    }
    if (!isFixTypeArray(fixTypes)) {
        errors.push("'fixTypes' must be an array of any of \"problem\", \"suggestion\", and \"layout\".");
    }
    if (!isArrayOfNonEmptyString(globals)) {
        errors.push("'globals' must be an array of non-empty strings.");
    }
    if (typeof globInputPaths !== "boolean") {
        errors.push("'globInputPaths' must be a boolean.");
    }
    if (typeof ignore !== "boolean") {
        errors.push("'ignore' must be a boolean.");
    }
    if (!isNonEmptyString(ignorePath) && ignorePath !== null) {
        errors.push("'ignorePath' must be a non-empty string or null.");
    }
    if (
        !isNonEmptyString(ignorePattern) &&
        !isArrayOfNonEmptyString(ignorePattern)
    ) {
        errors.push("'ignorePattern' must be a non-empty string or an array of non-empty strings.");
    }
    if (!isNonEmptyString(parser) && parser !== null) {
        errors.push("'parser' must be a non-empty string or null.");
    }
    if (typeof parserOptions !== "object") {
        errors.push("'parserOptions' must be an object or null.");
    }
    if (!isPluginArray(plugins)) {
        errors.push("'plugins' must be an array of either non-empty strings or the object '{ id: string; definition: Object }'.");
    } else {
        const ids = normalizePluginIds(plugins);

        if (new Set(ids).size !== ids.length) {
            errors.push("'plugins' array must not contain duplicated IDs.");
        }
    }
    if (
        typeof reportUnusedDisableDirectives !== "boolean" &&
        reportUnusedDisableDirectives !== null
    ) {
        errors.push("'reportUnusedDisableDirectives' must be a boolean or null.");
    }
    if (
        !isNonEmptyString(resolvePluginsRelativeTo) &&
        resolvePluginsRelativeTo !== null
    ) {
        errors.push("'resolvePluginsRelativeTo' must be a non-empty string or null.");
    }
    if (!isArrayOfNonEmptyString(rulePaths)) {
        errors.push("'rulePaths' must be an array of non-empty strings.");
    }
    if (typeof rules !== "object") {
        errors.push("'rules' must be an object or null.");
    }
    if (typeof useEslintrc !== "boolean") {
        errors.push("'useElintrc' must be a boolean.");
    }

    if (errors.length > 0) {
        throw new ESLintInvalidOptionsError(errors);
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
        retVal[id] = rule.meta;
        return retVal;
    }, {});
}

/** @type {WeakMap<ExtractedConfig, DeprecatedRuleInfo[]>} */
const usedDeprecatedRulesCache = new WeakMap();

/**
 * Create used deprecated rule list.
 * @param {CLIEngine} cliEngine The CLIEngine instance.
 * @param {string} maybeFilePath The absolute path to a lint target file or `"<text>"`.
 * @returns {DeprecatedRuleInfo[]} The used deprecated rule list.
 */
function getOrFindUsedDeprecatedRules(cliEngine, maybeFilePath) {
    const {
        configArrayFactory,
        options: { cwd }
    } = getCLIEngineInternalSlots(cliEngine);
    const filePath = path.isAbsolute(maybeFilePath)
        ? maybeFilePath
        : path.join(cwd, "__placeholder__.js");
    const configArray = configArrayFactory.getConfigArrayForFile(filePath);
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
 * @param {CLIEngine} cliEngine The CLIEngine instance.
 * @param {CLIEngineLintReport} report The CLIEngine linting report to process.
 * @returns {LintResult[]} The processed linting results.
 */
function processCLIEngineLintReport(cliEngine, { results }) {
    const descriptor = {
        configurable: true,
        enumerable: true,
        get() {
            return getOrFindUsedDeprecatedRules(cliEngine, this.filePath);
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

        if (options.plugins && options.plugins.length > 0) {
            for (const plugin of options.plugins) {
                if (typeof plugin !== "string") {
                    cliEngine.addPlugin(plugin.id, plugin.definition);
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
     * @param {LintResult[]} results The lint results.
     * @returns {Promise<void>} Returns a promise that is used to track side effects.
     */
    static async outputFixes(results) {
        await Promise.all(
            results
                .filter(r =>
                    typeof r.output === "string" &&
                    path.isAbsolute(r.filePath))
                .map(r => writeFile(r.filePath, r.output))
        );
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

        return processCLIEngineLintReport(
            cliEngine,
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

        return processCLIEngineLintReport(
            cliEngine,
            cliEngine.executeOnText(code, filePath, warnIgnored)
        );
    }

    /**
     * Returns the formatter representing the given formatter name.
     * @param {string} [name] The name of the formattter to load.
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
            throw new Error("Formatter name must be a string.");
        }

        const { cliEngine } = privateMembersMap.get(this);
        const formatter = cliEngine.getFormatter(name);

        if (typeof formatter !== "function") {
            throw new Error(`Formatter must be a function, but got a ${typeof formatter}.`);
        }

        return {

            /**
             * The main formatter method.
             * @param {LintResults[]} results The lint results to format.
             * @returns {string} The formatted lint results.
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
