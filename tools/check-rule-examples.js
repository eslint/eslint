"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { parse } = require("espree");
const { readFile } = require("fs").promises;
const markdownIt = require("markdown-it");
const markdownItContainer = require("markdown-it-container");
const markdownItRuleExample = require("../docs/tools/markdown-it-rule-example");

//------------------------------------------------------------------------------
// Typedefs
//------------------------------------------------------------------------------

/** @typedef {import("../lib/shared/types").LintMessage} LintMessage */
/** @typedef {import("../lib/shared/types").LintResult} LintResult */
/** @typedef {import("../lib/shared/types").ParserOptions} ParserOptions */

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const STANDARD_LANGUAGE_TAGS = new Set(["javascript", "js", "jsx"]);

/**
 * Tries to parse a specified JavaScript code with Playground presets.
 * @param {string} code The JavaScript code to parse.
 * @param {ParserOptions} parserOptions Explicitly specified parser options.
 * @returns {SyntaxError | null} A `SyntaxError` object if the code cannot be parsed, or `null`.
 */
function tryParseForPlayground(code, parserOptions) {
    try {
        parse(code, { ecmaVersion: "latest", ...parserOptions });
    } catch (error) {
        return error;
    }
    return null;
}

/**
 * Checks the example code blocks in a rule documentation file.
 * @param {string} filename The file to be checked.
 * @returns {Promise<LintMessage[]>} A promise of problems found. The promise will be rejected if an error occurs.
 */
async function findProblems(filename) {
    const text = await readFile(filename, "UTF-8");
    const problems = [];
    const ruleExampleOptions = markdownItRuleExample({
        open(type, code, parserOptions, codeBlockToken) {
            const languageTag = codeBlockToken.info;

            if (!STANDARD_LANGUAGE_TAGS.has(languageTag)) {

                /*
                 * Missing language tags are also reported by Markdownlint rule MD040 for all code blocks,
                 * but the message we output here is more specific.
                 */
                const message = `${languageTag
                    ? `Nonstandard language tag '${languageTag}'`
                    : "Missing language tag"}: use one of 'javascript', 'js' or 'jsx'`;

                problems.push({
                    fatal: false,
                    severity: 2,
                    message,
                    line: codeBlockToken.map[0] + 1,
                    column: codeBlockToken.markup.length + 1
                });
            }

            const error = tryParseForPlayground(code, parserOptions);

            if (error) {
                const message = `Syntax error: ${error.message}`;
                const line = codeBlockToken.map[0] + 1 + error.lineNumber;
                const { column } = error;

                problems.push({
                    fatal: false,
                    severity: 2,
                    message,
                    line,
                    column
                });
            }
        }
    });

    // Run `markdown-it` to check rule examples in the current file.
    markdownIt({ html: true })
        .use(markdownItContainer, "rule-example", ruleExampleOptions)
        .render(text);
    return problems;
}

/**
 * Checks the example code blocks in a rule documentation file.
 * @param {string} filename The file to be checked.
 * @returns {Promise<LintResult>} The result of checking the file.
 */
async function checkFile(filename) {
    let fatalErrorCount = 0,
        problems;

    try {
        problems = await findProblems(filename);
    } catch (error) {
        fatalErrorCount = 1;
        problems = [{
            fatal: true,
            severity: 2,
            message: `Error checking file: ${error.message}`
        }];
    }
    return {
        filePath: filename,
        errorCount: problems.length,
        warningCount: 0,
        fatalErrorCount,
        messages: problems
    };
}

//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------

// determine which files to check
const filenames = process.argv.slice(2);

(async function() {
    const results = await Promise.all(filenames.map(checkFile));

    if (results.every(result => result.errorCount === 0)) {
        return;
    }

    const formatter = require("../lib/cli-engine/formatters/stylish");
    const output = formatter(results);

    console.error(output);
    process.exitCode = 1;
}());
