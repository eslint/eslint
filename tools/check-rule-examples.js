"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { parse } = require("espree");
const { readFile } = require("node:fs").promises;
const { glob } = require("glob");
const matter = require("gray-matter");
const markdownIt = require("markdown-it");
const markdownItContainer = require("markdown-it-container");
const markdownItRuleExample = require("../docs/tools/markdown-it-rule-example");
const { ConfigCommentParser } = require("@eslint/plugin-kit");
const rules = require("../lib/rules");
const { LATEST_ECMA_VERSION } = require("../conf/ecma-version");

//------------------------------------------------------------------------------
// Typedefs
//------------------------------------------------------------------------------

/** @typedef {import("../lib/shared/types").LintMessage} LintMessage */
/** @typedef {import("../lib/shared/types").LintResult} LintResult */
/** @typedef {import("../lib/shared/types").LanguageOptions} LanguageOptions */

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const STANDARD_LANGUAGE_TAGS = new Set(["javascript", "js", "jsx"]);

const VALID_ECMA_VERSIONS = new Set([
    3,
    5,
    ...Array.from({ length: LATEST_ECMA_VERSION - 2015 + 1 }, (_, index) => index + 2015) // 2015, 2016, ..., LATEST_ECMA_VERSION
]);

const commentParser = new ConfigCommentParser();

/**
 * Tries to parse a specified JavaScript code with Playground presets.
 * @param {string} code The JavaScript code to parse.
 * @param {LanguageOptions} [languageOptions] Explicitly specified language options.
 * @returns {{ ast: ASTNode } | { error: SyntaxError }} An AST with comments, or a `SyntaxError` object if the code cannot be parsed.
 */
function tryParseForPlayground(code, languageOptions) {
    try {
        const ast = parse(code, {
            ecmaVersion: languageOptions?.ecmaVersion ?? "latest",
            sourceType: languageOptions?.sourceType ?? "module",
            ...languageOptions?.parserOptions,
            comment: true,
            loc: true
        });

        return { ast };
    } catch (error) {
        return { error };
    }
}

/**
 * Checks the example code blocks in a rule documentation file.
 * @param {string} filename The file to be checked.
 * @returns {Promise<LintMessage[]>} A promise of problems found. The promise will be rejected if an error occurs.
 */
async function findProblems(filename) {
    const text = await readFile(filename, "UTF-8");
    const { title } = matter(text).data;
    const isRuleRemoved = !rules.has(title);
    const problems = [];
    const ruleExampleOptions = markdownItRuleExample({
        open({ code, languageOptions, codeBlockToken }) {
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

            if (typeof languageOptions?.ecmaVersion !== "undefined") {
                const { ecmaVersion } = languageOptions;
                let ecmaVersionErrorMessage;

                if (ecmaVersion === "latest") {
                    ecmaVersionErrorMessage = 'Remove unnecessary "ecmaVersion":"latest".';
                } else if (typeof ecmaVersion !== "number") {
                    ecmaVersionErrorMessage = '"ecmaVersion" must be a number.';
                } else if (!VALID_ECMA_VERSIONS.has(ecmaVersion)) {
                    ecmaVersionErrorMessage = `"ecmaVersion" must be one of ${[...VALID_ECMA_VERSIONS].join(", ")}.`;
                }

                if (ecmaVersionErrorMessage) {
                    problems.push({
                        fatal: false,
                        severity: 2,
                        message: ecmaVersionErrorMessage,
                        line: codeBlockToken.map[0] - 1,
                        column: 1
                    });
                }
            }

            const { ast, error } = tryParseForPlayground(code, languageOptions);

            if (ast) {
                let hasRuleConfigComment = false;

                for (const comment of ast.comments) {

                    if (comment.type === "Block" && /^\s*eslint-env(?!\S)/u.test(comment.value)) {
                        problems.push({
                            fatal: false,
                            severity: 2,
                            message: "/* eslint-env */ comments are no longer supported. Remove the comment.",
                            line: codeBlockToken.map[0] + 1 + comment.loc.start.line,
                            column: comment.loc.start.column + 1
                        });
                    }

                    if (comment.type !== "Block" || !/^\s*eslint(?!\S)/u.test(comment.value)) {
                        continue;
                    }
                    const { value } = commentParser.parseDirective(comment.value);
                    const parseResult = commentParser.parseJSONLikeConfig(value);
                    const parseError = parseResult.error;

                    if (parseError) {
                        problems.push({
                            fatal: true,
                            severity: 2,
                            message: parseError.message,
                            line: comment.loc.start.line + codeBlockToken.map[0] + 1,
                            column: comment.loc.start.column + 1
                        });
                    } else if (Object.hasOwn(parseResult.config, title)) {
                        if (hasRuleConfigComment) {
                            problems.push({
                                fatal: false,
                                severity: 2,
                                message: `Duplicate /* eslint ${title} */ configuration comment. Each example should contain only one. Split this example into multiple examples.`,
                                line: codeBlockToken.map[0] + 1 + comment.loc.start.line,
                                column: comment.loc.start.column + 1
                            });
                        }
                        hasRuleConfigComment = true;
                    }
                }

                if (!isRuleRemoved && !hasRuleConfigComment) {
                    const message = `Example code should contain a configuration comment like /* eslint ${title}: "error" */`;

                    problems.push({
                        fatal: false,
                        severity: 2,
                        message,
                        line: codeBlockToken.map[0] + 2,
                        column: 1
                    });
                }
            }

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

const patterns = process.argv.slice(2);

(async function() {

    // determine which files to check
    const filenames = await glob(patterns);

    if (patterns.length && !filenames.length) {
        console.error("No files found that match the specified patterns.");
        process.exitCode = 1;
        return;
    }
    const results = await Promise.all(filenames.map(checkFile));

    if (results.every(result => result.errorCount === 0)) {
        return;
    }

    const formatter = require("../lib/cli-engine/formatters/stylish");
    const output = formatter(results);

    console.error(output);
    process.exitCode = 1;
}());
