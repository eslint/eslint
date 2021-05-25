/**
 * @fileoverview A fuzzer that runs eslint on randomly-generated code samples to detect bugs
 * @author Teddy Katz
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("assert");
const eslump = require("eslump");
const espree = require("espree");
const SourceCodeFixer = require("../lib/linter/source-code-fixer");
const ruleConfigs = require("../lib/init/config-rule").createCoreRuleConfigs(true);
const sampleMinimizer = require("./code-sample-minimizer");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Gets a random item from an array
 * @param {any[]} array The array to sample
 * @returns {any} The random item
 */
function sample(array) {
    return array[Math.floor(Math.random() * array.length)];
}

//------------------------------------------------------------------------------
// Public API
//------------------------------------------------------------------------------

/**
 * Generates random JS code, runs ESLint on it, and returns a list of detected crashes or autofix bugs
 * @param {Object} options Config options for fuzzing
 * @param {number} options.count The number of fuzz iterations.
 * @param {Object} options.linter The linter object to test with.
 * @param {function(Object): string} [options.codeGenerator=eslump.generateRandomJS] A function to use to generate random
 * code. Accepts an object argument with a `sourceType` key, indicating the source type of the generated code. The object
 * might also be passed other keys.
 * @param {boolean} [options.checkAutofixes=true] `true` if the fuzzer should check for autofix bugs. The fuzzer runs
 * roughly 4 times slower with autofix checking enabled.
 * @param {function(number)} [options.progressCallback] A function that gets called once for each code sample, with the total number of errors found so far
 * @returns {Object[]} A list of problems found. Each problem has the following properties:
 * type (string): The type of problem. This is either "crash" (a rule crashes) or "autofix" (an autofix produces a syntax error)
 * text (string): The text that ESLint should be run on to reproduce the problem
 * config (object): The config object that should be used to reproduce the problem. The fuzzer will try to return a minimal
 *     config (that only has one rule enabled), but this isn't always possible.
 * error (*) The problem that occurred. For crashes, this will be the error stack. For autofix bugs, this will be
 *     the parsing error object that was thrown when parsing the autofixed code.
 */
function fuzz(options) {
    assert.strictEqual(typeof options, "object", "An options object must be provided");
    assert.strictEqual(typeof options.count, "number", "The number of iterations (options.count) must be provided");
    assert.strictEqual(typeof options.linter, "object", "An linter object (options.linter) must be provided");

    const linter = options.linter;
    const codeGenerator = options.codeGenerator || (genOptions => eslump.generateRandomJS(Object.assign({ comments: true, whitespace: true }, genOptions)));
    const checkAutofixes = options.checkAutofixes !== false;
    const progressCallback = options.progressCallback || (() => {});

    /**
     * Tries to isolate the smallest config that reproduces a problem
     * @param {string} text The source text to lint
     * @param {Object} config A config object that causes a crash or autofix error
     * @param {("crash"|"autofix")} problemType The type of problem that occurred
     * @returns {Object} A config object with only one rule enabled that produces the same crash or autofix error, if possible.
     * Otherwise, the same as `config`
     */
    function isolateBadConfig(text, config, problemType) {
        for (const ruleId of Object.keys(config.rules)) {
            const reducedConfig = Object.assign({}, config, { rules: { [ruleId]: config.rules[ruleId] } });
            let fixResult;

            try {
                fixResult = linter.verifyAndFix(text, reducedConfig, {});
            } catch {
                return reducedConfig;
            }

            if (fixResult.messages.length === 1 && fixResult.messages[0].fatal && problemType === "autofix") {
                return reducedConfig;
            }
        }
        return config;
    }

    /**
     * Runs multipass autofix one pass at a time to find the last good source text before a fatal error occurs
     * @param {string} originalText Syntactically valid source code that results in a syntax error or crash when autofixing with `config`
     * @param {Object} config The config to lint with
     * @returns {string} A possibly-modified version of originalText that results in the same syntax error or crash after only one pass
     */
    function isolateBadAutofixPass(originalText, config) {
        let previousText = originalText;
        let currentText = originalText;

        do {
            let messages;

            try {
                messages = linter.verify(currentText, config);
            } catch {
                return currentText;
            }

            if (messages.length === 1 && messages[0].fatal) {
                return previousText;
            }

            previousText = currentText;
            currentText = SourceCodeFixer.applyFixes(currentText, messages).output;
        } while (previousText !== currentText);

        return currentText;
    }

    const problems = [];

    /**
     * Creates a version of espree that always runs with the specified options
     * @param {ConfigData} config The config used
     * @returns {Parser} a parser
     */
    function getParser({ parserOptions }) {
        return sourceText => espree.parse(sourceText, {
            ...parserOptions,
            loc: true,
            range: true,
            raw: true,
            tokens: true,
            comment: true
        });
    }

    for (let i = 0; i < options.count; progressCallback(problems.length), i++) {
        const rules = {};

        for (const [id, configs] of Object.entries(ruleConfigs)) {
            rules[id] = sample(configs);
        }

        const sourceType = sample(["script", "module"]);
        const text = codeGenerator({ sourceType });
        const config = {
            rules,
            parserOptions: {
                sourceType,
                ecmaVersion: espree.latestEcmaVersion
            }
        };

        let autofixResult;

        try {
            if (checkAutofixes) {
                autofixResult = linter.verifyAndFix(text, config, {});
            } else {
                linter.verify(text, config);
            }
        } catch (err) {
            const lastGoodText = checkAutofixes ? isolateBadAutofixPass(text, config) : text;
            const smallConfig = isolateBadConfig(lastGoodText, config, "crash");
            const smallText = sampleMinimizer({
                sourceText: lastGoodText,
                parser: { parse: getParser(smallConfig) },
                predicate(reducedText) {
                    try {
                        linter.verify(reducedText, smallConfig);
                        return false;
                    } catch {
                        return true;
                    }
                }
            });

            problems.push({ type: "crash", text: smallText, config: smallConfig, error: err.stack });

            continue;
        }

        if (checkAutofixes && autofixResult.fixed && autofixResult.messages.length === 1 && autofixResult.messages[0].fatal) {
            const lastGoodText = isolateBadAutofixPass(text, config);
            const smallConfig = isolateBadConfig(lastGoodText, config, "autofix");
            const smallText = sampleMinimizer({
                sourceText: lastGoodText,
                parser: { parse: getParser(smallConfig) },
                predicate(reducedText) {
                    try {
                        const smallFixResult = linter.verifyAndFix(reducedText, smallConfig);

                        return smallFixResult.fixed && smallFixResult.messages.length === 1 && smallFixResult.messages[0].fatal;
                    } catch {
                        return false;
                    }
                }
            });

            problems.push({
                type: "autofix",
                text: smallText,
                config: smallConfig,
                error: autofixResult.messages[0]
            });
        }
    }

    return problems;
}

module.exports = fuzz;
