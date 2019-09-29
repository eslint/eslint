/**
 * @fileoverview The main class for Node.js API.
 * @author Toru Nagashima <http://github.com/mysticatea>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const fs = require("fs");
const os = require("os");
const util = require("util");
const debug = require("debug");
const {
    CLIEngine,
    executeOnFiles,
    getCLIEngineInternalSlots,
    verifyText
} = require("../cli-engine/cli-engine");
const { ConcurrencyInWorker, runConcurrently } = require("./util");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const log = debug("eslint:eslint");

//------------------------------------------------------------------------------
// Typedefs
//------------------------------------------------------------------------------

/** @typedef {import("../cli-engine/cli-engine").ConfigData} ConfigData */
/** @typedef {import("../cli-engine/cli-engine").LintReport} LintReport */
/** @typedef {import("../cli-engine/cli-engine").LintResult} LintResult */
/** @typedef {import("../cli-engine/cli-engine").Plugin} Plugin */
/** @typedef {import("../cli-engine/cli-engine").Rule} Rule */

/**
 * The options to configure a CLI engine with.
 * @typedef {Object} ESLintOptions
 * @property {boolean} [allowInlineConfig] Enable or disable inline configuration comments.
 * @property {ConfigData} [baseConfig] Base config object, extended by all configs used with this CLIEngine instance
 * @property {boolean} [cache] Enable result caching.
 * @property {string} [cacheLocation] The cache file to use instead of .eslintcache.
 * @property {string} [configFile] The configuration file to use.
 * @property {string} [cwd] The value to use for the current working directory.
 * @property {string[]} [envs] An array of environments to load.
 * @property {string[]} [extensions] An array of file extensions to check.
 * @property {boolean|Function} [fix] Execute in autofix mode. If a function, should return a boolean.
 * @property {string[]} [fixTypes] Array of rule types to apply fixes for.
 * @property {string[]} [globals] An array of global variables to declare.
 * @property {boolean} [ignore] False disables use of .eslintignore.
 * @property {string} [ignorePath] The ignore file to use instead of .eslintignore.
 * @property {string} [ignorePattern] A glob pattern of files to ignore.
 * @property {boolean} [useEslintrc] False disables looking for .eslintrc
 * @property {string} [parser] The name of the parser to use.
 * @property {ParserOptions} [parserOptions] An object of parserOption settings to use.
 * @property {string[]} [plugins] An array of plugins to load.
 * @property {Record<string,RuleConf>} [rules] An object of rules to use.
 * @property {string[]} [rulePaths] An array of directories to load custom rules from.
 * @property {boolean} [reportUnusedDisableDirectives] `true` adds reports for unused eslint-disable directives
 * @property {boolean} [globInputPaths] Set to false to skip glob resolution of input file paths to lint (default: true). If false, each input file paths is assumed to be a non-glob path to an existing file.
 * @property {string} [resolvePluginsRelativeTo] The folder where plugins should be resolved from, defaulting to the CWD
 * @property {number} [threshold] The number of files. ESLint runs linting with worker threads if the target files are more than this number. Defaults to `100`.
 * @property {number} [maxConcurrency] The maximum number of worker threads. If `1` is present then ESLint doesn't make worker threads. Defaults to `require("os").cpus().length`.
 */

/**
 * @typedef {Object} ESLintInternalSlots
 * @property {CLIEngine} engine The CLI engine.
 * @property {number} maxConcurrency The maximum number of worker threads. If `1` is present then ESLint doesn't make worker threads.
 * @property {number} threshold The number of files. ESLint runs linting with worker threads if the target files are more than this number.
 */

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/** @type {WeakMap<ESLint, ESLintInternalSlots>} */
const internalSlotsMap = new WeakMap();

/**
 * Verify files in this thread.
 * @param {CLIEngine} engine The CLI engine.
 * @param {{config:ConfigArray, filePath:string}[]} targets The lint targets.
 * @returns {Promise<LintResult[]>} The lint result.
 */
async function verifyFilesInMaster(engine, targets) {
    console.log("Lint files in the main thread.");
    const results = [];
    let cursor = 0;

    // Lint files concurrently by using non-blocking IO.
    await runConcurrently(ConcurrencyInWorker, async() => {
        while (cursor < targets.length) {
            const { config, filePath } = targets[cursor++];
            const text = await readFile(filePath, "utf8");
            const result = verifyText(engine, config, filePath, text);

            results.push(result);
        }
    });

    return results;
}

/**
 * Verify files in worker threads.
 * @param {CLIEngine} engine The CLI engine.
 * @param {{config:ConfigArray, filePath:string}[]} targets The lint targets.
 * @param {number} maxConcurrency The maximum number of worker threads.
 * @returns {Promise<LintResult[]>} The lint result.
 */
function verifyFilesInWorkers(engine, targets, maxConcurrency) {
    console.log("Lint files in worker threads.");
    const { lintInParallel } = require("./parallel-master");
    const { options } = getCLIEngineInternalSlots(engine);
    const files = targets.map(t => t.filePath);

    return lintInParallel(files, options, maxConcurrency);
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * The main class for Node.js API.
 */
class ESLint {

    /**
     * Initialize a new instance.
     * @param {ESLintOptions} [options] The options for this instance.
     */
    constructor({
        maxConcurrency = os.cpus().length,
        threshold = 100,
        ...cliOptions
    } = {}) {
        if (!(Number.isSafeInteger(maxConcurrency) && maxConcurrency >= 1)) {
            throw new TypeError("'maxConcurrency' should be a positive integer.");
        }
        if (!(Number.isSafeInteger(threshold) && threshold >= 1)) {
            throw new TypeError("'threshold' should be a positive integer.");
        }

        internalSlotsMap.set(this, {
            engine: new CLIEngine(cliOptions),
            maxConcurrency,
            threshold
        });
    }

    /**
     * The version text.
     * @type {string}
     */
    static get version() {
        return CLIEngine.version;
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
     * Returns the formatter representing the given format or null if no formatter
     * with the given name can be found.
     * @param {string} [format] The name of the format to load or the path to a
     *      custom formatter.
     * @returns {Promise<Function>} The formatter function or null if not found.
     */
    static getFormatter(format) {
        return Promise.resolve(CLIEngine.getFormatter(format));
    }

    /**
     * Outputs fixes from the given results to files.
     * @param {LintReport} report The report object created by CLIEngine.
     * @returns {Promise<void>} The promise object that will be fulfilled after the update of files completed.
     */
    static async outputFixes(report) {
        const errors = [];

        await Promise.all(
            report.results
                .filter(r => Object.hasOwnProperty.call(r, "output"))
                .map(r => writeFile(r.filePath, r.output))
                .map(p => p.catch(error => errors.push(error)))
        );

        if (errors.length > 0) {
            throw Object.assign(
                new Error([
                    "Failed to output fixes:",
                    ...errors.map(e => `- ${e.message}`)
                ].join("\n")),
                { errors }
            );
        }
    }

    /**
     * Returns the map that contains the rules the last `engine.executeOn***()` method call used.
     * @returns {Map<string, Rule>} The rules.
     */
    getRules() {
        const { engine } = internalSlotsMap.get(this);

        return engine.getRules();
    }

    /**
     * Add a plugin by passing its configuration
     * @param {string} name Name of the plugin.
     * @param {Plugin} pluginObject Plugin configuration object.
     * @returns {void}
     */
    addPlugin(name, pluginObject) {
        const { engine } = internalSlotsMap.get(this);

        return engine.addPlugin(name, pluginObject);
    }

    /**
     * Resolves the patterns passed into executeOnFiles() into glob-based patterns
     * for easier handling.
     * @param {string[]} patterns The file patterns passed on the command line.
     * @returns {string[]} The equivalent glob patterns.
     */
    resolveFileGlobPatterns(patterns) {
        const { engine } = internalSlotsMap.get(this);

        return engine.resolveFileGlobPatterns(patterns);
    }

    /**
     * Executes the current configuration on an array of file and directory names.
     * @param {string[]} patterns An array of file and directory names.
     * @returns {Promise<LintReport>} The results for all files that were linted.
     */
    async executeOnFiles(patterns) {
        const {
            engine,
            maxConcurrency,
            threshold
        } = internalSlotsMap.get(this);

        return executeOnFiles(
            engine,
            patterns,
            async(targets, postprocess) => {
                const shouldRunConcurrently =
                    maxConcurrency >= 2 && targets.length >= threshold;
                const results =
                    shouldRunConcurrently
                        ? await verifyFilesInWorkers(engine, targets, maxConcurrency)
                        : await verifyFilesInMaster(engine, targets);

                return postprocess(results);
            }
        );
    }

    /**
     * Executes the current configuration on text.
     * @param {string} text A string of JavaScript code to lint.
     * @param {string} [filename] An optional string representing the texts filename.
     * @param {boolean} [warnIgnored] Always warn when a file is ignored
     * @returns {Promise<LintReport>} The results for the linting.
     */
    executeOnText(text, filename, warnIgnored) {
        const { engine } = internalSlotsMap.get(this);

        return Promise.resolve(engine.executeOnText(text, filename, warnIgnored));
    }

    /**
     * Returns a configuration object for the given file based on the CLI options.
     * This is the same logic used by the ESLint CLI executable to determine
     * configuration for each file it processes.
     * @param {string} filePath The path of the file to retrieve a config object for.
     * @returns {ConfigData} A configuration object for the file.
     */
    getConfigForFile(filePath) {
        const { engine } = internalSlotsMap.get(this);

        return Promise.resolve(engine.getConfigForFile(filePath));
    }

    /**
     * Checks if a given path is ignored by ESLint.
     * @param {string} filePath The path of the file to check.
     * @returns {boolean} Whether or not the given path is ignored.
     */
    isPathIgnored(filePath) {
        const { engine } = internalSlotsMap.get(this);

        return Promise.resolve(engine.isPathIgnored(filePath));
    }

    /**
     * Returns the formatter representing the given format or null if no formatter
     * with the given name can be found.
     * @param {string} [format] The name of the format to load or the path to a
     *      custom formatter.
     * @returns {Function} The formatter function or null if not found.
     */
    getFormatter(format) {
        const { engine } = internalSlotsMap.get(this);

        return Promise.resolve(engine.getFormatter(format));
    }
}


module.exports = { ESLint };
