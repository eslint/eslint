/**
 * @fileoverview Options configuration for optionator.
 * @author George Zahariev
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const optionator = require("optionator");

//------------------------------------------------------------------------------
// Typedefs
//------------------------------------------------------------------------------

/**
 * The options object parsed by Optionator.
 * @typedef {Object} ParsedCLIOptions
 * @property {boolean} cache Only check changed files
 * @property {string} cacheFile Path to the cache file. Deprecated: use --cache-location
 * @property {string} [cacheLocation] Path to the cache file or directory
 * @property {"metadata" | "content"} cacheStrategy Strategy to use for detecting changed files in the cache
 * @property {boolean} [color] Force enabling/disabling of color
 * @property {number | "auto" | "off"} [concurrency] Number of linting threads, "auto" to choose automatically, "off" for no multithreading
 * @property {string} [config] Use this configuration, overriding eslint.config.* config options if present
 * @property {boolean} debug Output debugging information
 * @property {boolean} envInfo Output execution environment information
 * @property {boolean} errorOnUnmatchedPattern Prevent errors when pattern is unmatched
 * @property {string[]} [ext] Specify JavaScript file extensions
 * @property {string[]} [flag] Feature flags
 * @property {boolean} fix Automatically fix problems
 * @property {boolean} fixDryRun Automatically fix problems without saving the changes to the file system
 * @property {("directive" | "problem" | "suggestion" | "layout")[]} [fixType] Specify the types of fixes to apply (directive, problem, suggestion, layout)
 * @property {string} format Use a specific output format
 * @property {string[]} [global] Define global variables
 * @property {boolean} [help] Show help
 * @property {boolean} ignore Disable use of ignore files and patterns
 * @property {string[]} [ignorePattern] Patterns of files to ignore
 * @property {boolean} init Run config initialization wizard
 * @property {boolean} inlineConfig Prevent comments from changing config or rules
 * @property {number} maxWarnings Number of warnings to trigger nonzero exit code
 * @property {string} [outputFile] Specify file to write report to
 * @property {string} [parser] Specify the parser to be used
 * @property {Object} [parserOptions] Specify parser options
 * @property {boolean} [passOnNoPatterns=false] When set to true, missing patterns cause
 *      the linting operation to short circuit and not report any failures.
 * @property {boolean} [passOnUnprunedSuppressions] Ignore unused suppressions
 * @property {string[]} [plugin] Specify plugins
 * @property {string} [printConfig] Print the configuration for the given file
 * @property {boolean} [pruneSuppressions] Prune unused suppressions
 * @property {boolean} quiet Report errors only
 * @property {boolean | undefined} reportUnusedDisableDirectives Adds reported errors for unused eslint-disable and eslint-enable directives
 * @property {string | undefined} reportUnusedDisableDirectivesSeverity A severity string indicating if and how unused disable and enable directives should be tracked and reported.
 * @property {Object} [rule] Specify rules
 * @property {boolean} [stats] Report additional statistics
 * @property {boolean} stdin Lint code provided on <STDIN>
 * @property {string} [stdinFilename] Specify filename to process STDIN as
 * @property {boolean} [suppressAll] Suppress all error violations
 * @property {string} [suppressionsLocation] Path to the suppressions file or directory
 * @property {string[]} [suppressRule] Suppress specific rules
 * @property {boolean} [version] Output the version number
 * @property {boolean} warnIgnored Show warnings when the file list includes ignored files
 * @property {string[]} _ Positional filenames or patterns
 */

//------------------------------------------------------------------------------
// Initialization and Public Interface
//------------------------------------------------------------------------------

// exports "parse(args)", "generateHelp()", and "generateHelpForOption(optionName)"

/**
 * Creates the CLI options for ESLint.
 * @returns {Object} The optionator instance.
 */
module.exports = function () {
	return optionator({
		prepend: "eslint [options] file.js [file.js] [dir]",
		defaults: {
			concatRepeatedArrays: true,
			mergeRepeatedObjects: true,
		},
		options: [
			{
				heading: "Basic configuration",
			},
			{
				option: "config-lookup",
				type: "Boolean",
				default: "true",
				description: "Disable look up for eslint.config.js",
			},
			{
				option: "config",
				alias: "c",
				type: "path::String",
				description:
					"Use this configuration instead of eslint.config.js, eslint.config.mjs, or eslint.config.cjs",
			},
			{
				option: "inspect-config",
				type: "Boolean",
				description:
					"Open the config inspector with the current configuration",
			},
			{
				option: "ext",
				type: "[String]",
				description: "Specify additional file extensions to lint",
			},
			{
				option: "global",
				type: "[String]",
				description: "Define global variables",
			},
			{
				option: "parser",
				type: "String",
				description: "Specify the parser to be used",
			},
			{
				option: "parser-options",
				type: "Object",
				description: "Specify parser options",
			},
			{
				heading: "Specify Rules and Plugins",
			},
			{
				option: "plugin",
				type: "[String]",
				description: "Specify plugins",
			},
			{
				option: "rule",
				type: "Object",
				description: "Specify rules",
			},
			{
				heading: "Fix Problems",
			},
			{
				option: "fix",
				type: "Boolean",
				default: false,
				description: "Automatically fix problems",
			},
			{
				option: "fix-dry-run",
				type: "Boolean",
				default: false,
				description:
					"Automatically fix problems without saving the changes to the file system",
			},
			{
				option: "fix-type",
				type: "Array",
				description:
					"Specify the types of fixes to apply (directive, problem, suggestion, layout)",
			},
			{
				heading: "Ignore Files",
			},
			{
				option: "ignore",
				type: "Boolean",
				default: "true",
				description: "Disable use of ignore files and patterns",
			},
			{
				option: "ignore-pattern",
				type: "[String]",
				description: "Patterns of files to ignore",
				concatRepeatedArrays: [
					true,
					{
						oneValuePerFlag: true,
					},
				],
			},
			{
				heading: "Use stdin",
			},
			{
				option: "stdin",
				type: "Boolean",
				default: "false",
				description: "Lint code provided on <STDIN>",
			},
			{
				option: "stdin-filename",
				type: "String",
				description: "Specify filename to process STDIN as",
			},
			{
				heading: "Handle Warnings",
			},
			{
				option: "quiet",
				type: "Boolean",
				default: "false",
				description: "Report errors only",
			},
			{
				option: "max-warnings",
				type: "Int",
				default: "-1",
				description: "Number of warnings to trigger nonzero exit code",
			},
			{
				heading: "Output",
			},
			{
				option: "output-file",
				alias: "o",
				type: "path::String",
				description: "Specify file to write report to",
			},
			{
				option: "format",
				alias: "f",
				type: "String",
				default: "stylish",
				description: "Use a specific output format",
			},
			{
				option: "color",
				type: "Boolean",
				alias: "no-color",
				description: "Force enabling/disabling of color",
			},
			{
				heading: "Inline configuration comments",
			},
			{
				option: "inline-config",
				type: "Boolean",
				default: "true",
				description: "Prevent comments from changing config or rules",
			},
			{
				option: "report-unused-disable-directives",
				type: "Boolean",
				default: void 0,
				description:
					"Adds reported errors for unused eslint-disable and eslint-enable directives",
			},
			{
				option: "report-unused-disable-directives-severity",
				type: "String",
				default: void 0,
				description:
					"Chooses severity level for reporting unused eslint-disable and eslint-enable directives",
				enum: ["off", "warn", "error", "0", "1", "2"],
			},
			{
				option: "report-unused-inline-configs",
				type: "String",
				default: void 0,
				description:
					"Adds reported errors for unused eslint inline config comments",
				enum: ["off", "warn", "error", "0", "1", "2"],
			},
			{
				heading: "Caching",
			},
			{
				option: "cache",
				type: "Boolean",
				default: "false",
				description: "Only check changed files",
			},
			{
				option: "cache-file",
				type: "path::String",
				default: ".eslintcache",
				description:
					"Path to the cache file. Deprecated: use --cache-location",
			},
			{
				option: "cache-location",
				type: "path::String",
				description: "Path to the cache file or directory",
			},
			{
				option: "cache-strategy",
				dependsOn: ["cache"],
				type: "String",
				default: "metadata",
				enum: ["metadata", "content"],
				description:
					"Strategy to use for detecting changed files in the cache",
			},
			{
				heading: "Suppressing Violations",
			},
			{
				option: "suppress-all",
				type: "Boolean",
				default: "false",
				description: "Suppress all violations",
			},
			{
				option: "suppress-rule",
				type: "[String]",
				description: "Suppress specific rules",
			},
			{
				option: "suppressions-location",
				type: "path::String",
				description: "Specify the location of the suppressions file",
			},
			{
				option: "prune-suppressions",
				type: "Boolean",
				default: "false",
				description: "Prune unused suppressions",
			},
			{
				option: "pass-on-unpruned-suppressions",
				type: "Boolean",
				default: "false",
				description: "Ignore unused suppressions",
			},
			{
				heading: "Miscellaneous",
			},
			{
				option: "init",
				type: "Boolean",
				default: "false",
				description: "Run config initialization wizard",
			},
			{
				option: "env-info",
				type: "Boolean",
				default: "false",
				description: "Output execution environment information",
			},
			{
				option: "error-on-unmatched-pattern",
				type: "Boolean",
				default: "true",
				description: "Prevent errors when pattern is unmatched",
			},
			{
				option: "exit-on-fatal-error",
				type: "Boolean",
				default: "false",
				description: "Exit with exit code 2 in case of fatal error",
			},
			{
				option: "warn-ignored",
				type: "Boolean",
				default: "true",
				description:
					"Suppress warnings when the file list includes ignored files",
			},
			{
				option: "pass-on-no-patterns",
				type: "Boolean",
				default: false,
				description:
					"Exit with exit code 0 in case no file patterns are passed",
			},
			{
				option: "debug",
				type: "Boolean",
				default: false,
				description: "Output debugging information",
			},
			{
				option: "help",
				alias: "h",
				type: "Boolean",
				description: "Show help",
			},
			{
				option: "version",
				alias: "v",
				type: "Boolean",
				description: "Output the version number",
			},
			{
				option: "print-config",
				type: "path::String",
				description: "Print the configuration for the given file",
			},
			{
				option: "stats",
				type: "Boolean",
				default: "false",
				description: "Add statistics to the lint report",
			},
			{
				option: "flag",
				type: "[String]",
				description: "Enable a feature flag",
			},
			{
				option: "mcp",
				type: "Boolean",
				description: "Start the ESLint MCP server",
			},
			{
				option: "concurrency",
				type: "Int|String",
				default: "off",
				description:
					"Number of linting threads, auto to choose automatically, off for no multithreading",
			},
		],
	});
};
