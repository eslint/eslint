/**
 * @fileoverview A fuzzer that runs eslint on randomly-generated code samples to detect bugs
 * @author Teddy Katz
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("assert");
const lodash = require("lodash");

const fromDescriptor = Object.getOwnPropertyDescriptor(Array, "from");
const eslump = require("eslump");

// XXX: Remove this (see https://github.com/shapesecurity/shift-fuzzer-js/issues/15)
Object.defineProperty(Array, "from", fromDescriptor);

const SourceCodeFixer = require("../lib/util/source-code-fixer");
const ruleConfigs = require("../lib/config/config-rule").createCoreRuleConfigs();

//------------------------------------------------------------------------------
// Public API
//------------------------------------------------------------------------------

/**
 * Generates random JS code, runs ESLint on it, and returns a list of detected crashes or autofix bugs
 * @param {Object} options Config options for fuzzing
 * @param {number} options.count The number of fuzz iterations.
 * @param {Object} options.eslint The eslint object to test.
 * @param {function(Object): string} [options.codeGenerator=eslump.generateRandomJS] A function to use to generate random
 * code. Accepts an object argument with a `sourceType` key, indicating the source type of the generated code. The object
 * might also be passed other keys.
 * @param {boolean} [options.checkAutofixes=true] `true` if the fuzzer should check for autofix bugs. The fuzzer runs
 * roughly 4 times slower with autofix checking enabled.
 * @param {function()} [options.progressCallback] A function that gets called once for each code sample
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
    assert.strictEqual(typeof options.eslint, "object", "An eslint object (options.eslint) must be provided");

    const eslint = options.eslint;
    const codeGenerator = options.codeGenerator || (genOptions => eslump.generateRandomJS(Object.assign({ comments: true, whitespace: true }, genOptions)));
    const checkAutofixes = options.checkAutofixes !== false;
    const progressCallback = options.progressCallback || (() => {});

    /**
     * Tries to isolate the smallest config that reproduces a problem
     * @param {string} text The source text to lint
     * @param {Object} config A config object that causes a crash or autofix error
     * @returns {Object} A config object with only one rule enabled that produces the same crash or autofix error, if possible.
     * Otherwise, the same as `config`
     */
    function isolateBadConfig(text, config) {
        for (const ruleId of Object.keys(config.rules)) {
            const reducedConfig = Object.assign({}, config, { rules: { [ruleId]: config.rules[ruleId] } });
            const cliEngine = new eslint.CLIEngine(reducedConfig);
            let lintReport;

            try {
                lintReport = cliEngine.executeOnText(text);
            } catch (err) {
                return reducedConfig;
            }

            if (lintReport.results[0].messages.length === 1 && lintReport.results[0].messages[0].fatal) {
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
        let lastGoodText = originalText;
        let currentText = originalText;

        do {
            let messages;

            try {
                messages = eslint.linter.verify(currentText, config);
            } catch (err) {
                return lastGoodText;
            }

            if (messages.length === 1 && messages[0].fatal) {
                return lastGoodText;
            }

            lastGoodText = currentText;
            currentText = SourceCodeFixer.applyFixes(eslint.linter.getSourceCode(), messages).output;
        } while (lastGoodText !== currentText);

        return lastGoodText;
    }

    const problems = [];

    for (let i = 0; i < options.count; progressCallback(), i++) {
        const sourceType = lodash.sample(["script", "module"]);
        const text = codeGenerator({ sourceType });
        const config = {
            rules: lodash.mapValues(ruleConfigs, lodash.sample),
            parserOptions: { sourceType, ecmaVersion: 2017 }
        };

        let autofixResult;

        try {
            if (checkAutofixes) {
                const cliEngine = new eslint.CLIEngine(Object.assign(config, { useEslintrc: false, fix: true }));

                autofixResult = cliEngine.executeOnText(text).results[0];
            } else {
                eslint.linter.verify(text, config);
            }
        } catch (err) {
            problems.push({ type: "crash", text, config: isolateBadConfig(text, config), error: err.stack });
            continue;
        }

        if (checkAutofixes && autofixResult.output && autofixResult.messages.length === 1 && autofixResult.messages[0].fatal) {
            const lastGoodText = isolateBadAutofixPass(text, config);

            problems.push({ type: "autofix", text: lastGoodText, config: isolateBadConfig(lastGoodText, config), error: autofixResult.messages[0] });
        }
    }

    return problems;
}

module.exports = fuzz;
