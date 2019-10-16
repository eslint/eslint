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
    findTargetFiles,
    getCLIEngineInternalSlots
} = require("../cli-engine/cli-engine");
const { LintResultGenerator } = require("./lint-result-generator");
const { isThreadSupported } = require("./util");
const { verifyFilesInMaster } = require("./verify-files-in-master");
const { verifyFilesInWorkers } = require("./verify-files-in-workers");

const writeFile = util.promisify(fs.writeFile);
const log = debug("eslint:eslint");

log.enabled = true;

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
 * @property {number|"auto"} [concurrency] The number of threads. If `1` is present then ESLint doesn't make worker threads. If `"auto"` is present then ESLint estimates the best value from the number of target files. Defaults to `1`.
 */

/**
 * @typedef {Object} ESLintInternalSlots
 * @property {number|"auto"} concurrency The number of threads. If `1` is present then ESLint doesn't make worker threads. If `"auto"` is present then ESLint estimates the best value from the number of target files.
 * @property {CLIEngine} engine The CLI engine.
 * @property {boolean} isExecutingOnFiles The flag that is `true` if `executeOnFiles()` method is executing. This flag does fail-fast before the cache file is broken.
 */

/**
 * @typedef {Object} ExecuteOnFilesInternalSlots
 * @property {ESLintInternalSlots} eslintSlots The ESLint internal slots.
 * @property {string[]} patterns T
 */

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/** @type {WeakMap<ESLint, ESLintInternalSlots>} */
const internalSlotsMap = new WeakMap();

/**
 * Estimate the best concurrency.
 * @param {number} count The number of target files.
 * @returns {number} The estimated concurrency.
 */
function estimateBestConcurrency(count) {
    const min = 1;
    const max = os.cpus().length | 0;
    const isWinProcess = process.platform === "win32" && !isThreadSupported();
    const denominator = isWinProcess ? 256 : 128;
    const rough = Math.ceil(count / denominator) | 0;

    if (rough < min) {
        return min;
    }
    if (rough > max) {
        return max;
    }
    return rough;
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
        concurrency = 1,
        ...cliOptions
    } = {}) {
        if (concurrency !== "auto" && !(Number.isSafeInteger(concurrency) && concurrency >= 1)) {
            throw new TypeError("'concurrency' should be a positive integer or \"auto\".");
        }

        internalSlotsMap.set(this, {
            concurrency,
            engine: new CLIEngine(cliOptions),
            isExecutingOnFiles: false
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
     * @param {AsyncIterableIterator<LintResult>} results The results to filter.
     * @returns {AsyncIterableIterator<LintResult>} The filtered results.
     */
    static async *getErrorResults(results) {
        for await (const result of results) {
            const messages = result.messages.filter(m => m.severity === 2);

            if (messages.length === result.messages.length) {
                yield result;
            } else {
                yield {
                    ...result,
                    messages,
                    warningCount: 0,
                    fixableWarningCount: 0
                };
            }
        }
    }

    /**
     * Returns the formatter representing the given format or null if no formatter
     * with the given name can be found.
     * @param {string} [format] The name of the format to load or the path to a
     *      custom formatter.
     * @returns {Promise<Function>} The formatter function or null if not found.
     */
    static getFormatter(format) {
        return new ESLint().getFormatter(format);
    }

    /**
     * Outputs fixes from the given results to files.
     * @param {AsyncIterableIterator<LintResult>} results The report object created by CLIEngine.
     * @returns {AsyncIterableIterator<LintResult>} The promise object that will be fulfilled after the update of files completed.
     */
    static async *outputFixes(results) {
        const promises = [];
        let completed = false;

        try {
            for await (const result of results) {
                if (Object.hasOwnProperty.call(result, "output")) {
                    promises.push(writeFile(result.filePath, result.output));
                }
                yield result;
            }
            completed = true;
        } finally {
            if (completed) {
                await Promise.all(promises);
            } else {

                /*
                 * If the iteration was not completed, it means an error was thrown.
                 * To prevent hide the original error, catch and abandon the IO error.
                 */
                await Promise.all(promises).catch(error => {
                    log("Failed to output fixes: %O", error);
                });
            }
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
     * Executes the current configuration on an array of file and directory names.
     * @param {string[]} patterns An array of file and directory names.
     * @returns {LintResultGenerator} The results for all files that were linted.
     */
    executeOnFiles(patterns) {
        const startTime = Date.now();
        const slots = internalSlotsMap.get(this);
        const { concurrency, engine } = slots;
        const {
            configArrayFactory,
            lintResultCache
        } = getCLIEngineInternalSlots(engine);

        if (slots.isExecutingOnFiles) {
            throw new Error("'executeOnFiles()' cannot run in parallel. Please wait for the previous call finished.");
        }
        slots.isExecutingOnFiles = true;

        try {
            const { cachedResults, targets } = findTargetFiles(engine, patterns);
            const context = {
                concurrency: concurrency === "auto"
                    ? estimateBestConcurrency(targets.length)
                    : concurrency,
                engine,
                knownResults: cachedResults,
                targets,

                /*
                 * Called after all targets are linted.
                 * This doesn't wait `next()` method calls.
                 */
                onEnd() {
                    slots.isExecutingOnFiles = false;
                    if (lintResultCache) {
                        lintResultCache.reconcile();
                    }
                    log(`Linting complete in: ${Date.now() - startTime}ms`);
                },

                /*
                 * Called on each target is linted.
                 * This doesn't wait `next()` method calls.
                 */
                onResult(result) {
                    if (lintResultCache) {
                        lintResultCache.setCachedLintResults(
                            result.filePath,
                            configArrayFactory.getConfigArrayForFile(result.filePath),
                            result
                        );
                    }
                }
            };

            return context.concurrency === 1
                ? verifyFilesInMaster(context)
                : verifyFilesInWorkers(context);
        } catch (error) {
            slots.isExecutingOnFiles = false;
            throw error;
        }
    }

    /**
     * Executes the current configuration on text.
     * @param {string} text A string of JavaScript code to lint.
     * @param {string} [filename] An optional string representing the texts filename.
     * @param {boolean} [warnIgnored] Always warn when a file is ignored
     * @returns {LintResultGenerator} The results for the linting.
     */
    executeOnText(text, filename, warnIgnored) {
        let results, thrownError;

        try {
            const { engine } = internalSlotsMap.get(this);

            results = engine.executeOnText(text, filename, warnIgnored).results;
        } catch (error) {
            thrownError = error;
        }

        return new LintResultGenerator({
            knownResults: results,
            async main() {
                if (thrownError) {
                    throw thrownError;
                }
            }
        });
    }

    /**
     * Returns a configuration object for the given file based on the CLI options.
     * This is the same logic used by the ESLint CLI executable to determine
     * configuration for each file it processes.
     * @param {string} filePath The path of the file to retrieve a config object for.
     * @returns {Promise<ConfigData>} A configuration object for the file.
     */
    getConfigForFile(filePath) {
        const { engine } = internalSlotsMap.get(this);

        return Promise.resolve(engine.getConfigForFile(filePath));
    }

    /**
     * Checks if a given path is ignored by ESLint.
     * @param {string} filePath The path of the file to check.
     * @returns {Promise<boolean>} Whether or not the given path is ignored.
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
     * @returns {Promise<Function>} The formatter function or null if not found.
     */
    async getFormatter(format) {
        const { engine } = internalSlotsMap.get(this);
        const formatter = engine.getFormatter(format);

        return async function *adapter(resultIterator) {

            // Collect the results.
            const results = [];

            for await (const result of resultIterator) {
                results.push(result);
            }
            results.sort((a, b) => {
                if (a.filePath < b.filePath) {
                    return -1;
                }
                if (a.filePath > b.filePath) {
                    return +1;
                }
                return 0;
            });

            // Make metadata.
            let rulesMeta;
            const metadata = {
                get rulesMeta() {
                    if (!rulesMeta) {
                        rulesMeta = {};
                        for (const [ruleId, rule] of engine.getRules()) {
                            rulesMeta[ruleId] = rule.meta;
                        }
                    }
                    return rulesMeta;
                }
            };

            yield formatter(results, metadata);
        };
    }
}


module.exports = { ESLint };
