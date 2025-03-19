"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { readFile } = require("node:fs").promises;
const { glob } = require("glob");
const matter = require("gray-matter");
const markdownIt = require("markdown-it");
const markdownItContainer = require("markdown-it-container");
const markdownItRuleExample = require("../docs/tools/markdown-it-rule-example");
const { ConfigCommentParser } = require("@eslint/plugin-kit");
const tsParser = require("@typescript-eslint/parser");
const rules = require("../lib/rules");
const { LATEST_ECMA_VERSION } = require("../conf/ecma-version");
const { Linter } = require("../lib/linter");

//------------------------------------------------------------------------------
// Typedefs
//------------------------------------------------------------------------------

/** @typedef {import("../lib/shared/types").LintMessage} LintMessage */
/** @typedef {import("../lib/shared/types").LintResult} LintResult */
/** @typedef {import("../lib/shared/types").LanguageOptions} LanguageOptions */

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const TYPESCRIPT_LANGUAGE_TAGS = new Set(["ts", "tsx"]);
const STANDARD_LANGUAGE_TAGS = new Set([
	"javascript",
	"js",
	"jsx",
	...TYPESCRIPT_LANGUAGE_TAGS,
]);

const VALID_ECMA_VERSIONS = new Set([
	3,
	5,
	...Array.from(
		{ length: LATEST_ECMA_VERSION - 2015 + 1 },
		(_, index) => index + 2015,
	), // 2015, 2016, ..., LATEST_ECMA_VERSION
]);

const commentParser = new ConfigCommentParser();

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
		open({ code, type, languageOptions = {}, codeBlockToken }) {
			const languageTag = codeBlockToken.info;

			if (!STANDARD_LANGUAGE_TAGS.has(languageTag)) {
				/*
				 * Missing language tags are also reported by Markdownlint rule MD040 for all code blocks,
				 * but the message we output here is more specific.
				 */
				const message = `${
					languageTag
						? `Nonstandard language tag '${languageTag}'`
						: "Missing language tag"
				}: use one of 'javascript', 'js', 'jsx', 'ts', or 'tsx'`;

				problems.push({
					fatal: false,
					severity: 2,
					message,
					line: codeBlockToken.map[0] + 1,
					column: codeBlockToken.markup.length + 1,
				});
			}

			if (typeof languageOptions?.ecmaVersion !== "undefined") {
				const { ecmaVersion } = languageOptions;
				let ecmaVersionErrorMessage;

				if (ecmaVersion === "latest") {
					ecmaVersionErrorMessage =
						'Remove unnecessary "ecmaVersion":"latest".';
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
						column: 1,
					});

					return;
				}
			}

			if (TYPESCRIPT_LANGUAGE_TAGS.has(languageTag)) {
				languageOptions.parser = tsParser;
			}

			const linter = new Linter();
			let lintMessages;

			try {
				lintMessages = linter.verify(code, { languageOptions });
			} catch (error) {
				problems.push({
					fatal: true,
					severity: 2,
					message: `Configuration error: ${error.message}`,
					line: codeBlockToken.map[0] - 1,
					column: 1,
				});

				return;
			}

			// for removed rules, leave only parsing errors
			if (isRuleRemoved) {
				lintMessages = lintMessages.filter(
					lintMessage => lintMessage.fatal,
				);
			} else {
				if (type === "incorrect") {
					const { length } = lintMessages;

					// filter out errors reported by the rule as they are expected in incorrect examples
					lintMessages = lintMessages.filter(
						lintMessage =>
							lintMessage.ruleId !== title ||
							lintMessage.fatal ||
							lintMessage.message.includes(
								`Inline configuration for rule "${title}" is invalid`,
							),
					);

					if (
						lintMessages.length === length &&
						!lintMessages.some(lintMessage => lintMessage.fatal)
					) {
						problems.push({
							fatal: false,
							severity: 2,
							message:
								"Incorrect examples should have at least one error reported by the rule.",
							line: codeBlockToken.map[0] + 2,
							column: 1,
						});
					}
				}
			}

			problems.push(
				...lintMessages.map(lintMessage => ({
					...lintMessage,
					message: `Unexpected lint error found: ${lintMessage.message}`,
					line: codeBlockToken.map[0] + 1 + lintMessage.line,
				})),
			);

			const sourceCode = linter.getSourceCode();

			if (sourceCode) {
				const { ast } = sourceCode;
				let hasRuleConfigComment = false;

				for (const comment of ast.comments) {
					if (
						comment.type === "Block" &&
						/^\s*eslint-env(?!\S)/u.test(comment.value)
					) {
						problems.push({
							fatal: false,
							severity: 2,
							message:
								"/* eslint-env */ comments are no longer supported. Remove the comment.",
							line:
								codeBlockToken.map[0] +
								1 +
								comment.loc.start.line,
							column: comment.loc.start.column + 1,
						});
					}

					if (
						comment.type !== "Block" ||
						!/^\s*eslint(?!\S)/u.test(comment.value)
					) {
						continue;
					}
					const { value } = commentParser.parseDirective(
						comment.value,
					);
					const parseResult =
						commentParser.parseJSONLikeConfig(value);

					if (
						parseResult.ok &&
						Object.hasOwn(parseResult.config, title)
					) {
						if (hasRuleConfigComment) {
							problems.push({
								fatal: false,
								severity: 2,
								message: `Duplicate /* eslint ${title} */ configuration comment. Each example should contain only one. Split this example into multiple examples.`,
								line:
									codeBlockToken.map[0] +
									1 +
									comment.loc.start.line,
								column: comment.loc.start.column + 1,
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
						column: 1,
					});
				}
			}
		},
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
		problems = [
			{
				fatal: true,
				severity: 2,
				message: `Error checking file: ${error.message}`,
			},
		];
	}
	return {
		filePath: filename,
		errorCount: problems.length,
		warningCount: 0,
		fatalErrorCount,
		messages: problems,
	};
}

//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------

const patterns = process.argv.slice(2);

(async function () {
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
})();
