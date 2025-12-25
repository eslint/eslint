/**
 * @fileoverview Translates CLI options into ESLint constructor options.
 * @author Nicholas C. Zakas
 * @author Francesco Trotta
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { normalizeSeverityToString } = require("./severity");
const { getShorthandName, normalizePackageName } = require("./naming");
const { ModuleImporter } = require("@humanwhocodes/module-importer");

//------------------------------------------------------------------------------
// Types
//------------------------------------------------------------------------------

/** @typedef {import("../types").ESLint.Options} ESLintOptions */
/** @typedef {import("../types").Linter.LintMessage} LintMessage */
/** @typedef {import("../options").ParsedCLIOptions} ParsedCLIOptions */
/** @typedef {import("../types").ESLint.Plugin} Plugin */

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Loads plugins with the specified names.
 * @param {{ "import": (name: string) => Promise<any> }} importer An object with an `import` method called once for each plugin.
 * @param {string[]} pluginNames The names of the plugins to be loaded, with or without the "eslint-plugin-" prefix.
 * @returns {Promise<Record<string, Plugin>>} A mapping of plugin short names to implementations.
 */
async function loadPlugins(importer, pluginNames) {
	const plugins = {};

	await Promise.all(
		pluginNames.map(async pluginName => {
			const longName = normalizePackageName(pluginName, "eslint-plugin");
			const module = await importer.import(longName);

			if (!("default" in module)) {
				throw new Error(
					`"${longName}" cannot be used with the \`--plugin\` option because its default module does not provide a \`default\` export`,
				);
			}

			const shortName = getShorthandName(pluginName, "eslint-plugin");

			plugins[shortName] = module.default;
		}),
	);

	return plugins;
}

/**
 * Predicate function for whether or not to apply fixes in quiet mode.
 * If a message is a warning, do not apply a fix.
 * @param {LintMessage} message The lint result.
 * @returns {boolean} True if the lint message is an error (and thus should be
 * autofixed), false otherwise.
 */
function quietFixPredicate(message) {
	return message.severity === 2;
}

/**
 * Predicate function for whether or not to run a rule in quiet mode.
 * If a rule is set to warning, do not run it.
 * @param {{ ruleId: string; severity: number; }} rule The rule id and severity.
 * @returns {boolean} True if the lint rule should run, false otherwise.
 */
function quietRuleFilter(rule) {
	return rule.severity === 2;
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Translates the CLI options into the options expected by the ESLint constructor.
 * @param {ParsedCLIOptions} cliOptions The CLI options to translate.
 * @returns {Promise<ESLintOptions>} The options object for the ESLint constructor.
 */
async function translateOptions({
	cache,
	cacheFile,
	cacheLocation,
	cacheStrategy,
	concurrency,
	config,
	configLookup,
	errorOnUnmatchedPattern,
	ext,
	fix,
	fixDryRun,
	fixType,
	flag,
	global,
	ignore,
	ignorePattern,
	inlineConfig,
	parser,
	parserOptions,
	plugin,
	quiet,
	reportUnusedDisableDirectives,
	reportUnusedDisableDirectivesSeverity,
	reportUnusedInlineConfigs,
	rule,
	stats,
	warnIgnored,
	passOnNoPatterns,
	maxWarnings,
}) {
	const importer = new ModuleImporter();

	let overrideConfigFile =
		typeof config === "string" ? config : !configLookup;
	if (overrideConfigFile === false) {
		overrideConfigFile = void 0;
	}

	const languageOptions = {};

	if (global) {
		languageOptions.globals = global.reduce((obj, name) => {
			if (name.endsWith(":true")) {
				obj[name.slice(0, -5)] = "writable";
			} else {
				obj[name] = "readonly";
			}
			return obj;
		}, {});
	}

	if (parserOptions) {
		languageOptions.parserOptions = parserOptions;
	}

	if (parser) {
		languageOptions.parser = await importer.import(parser);
	}

	const overrideConfig = [
		{
			...(Object.keys(languageOptions).length > 0
				? { languageOptions }
				: {}),
			rules: rule ? rule : {},
		},
	];

	if (
		reportUnusedDisableDirectives ||
		reportUnusedDisableDirectivesSeverity !== void 0
	) {
		overrideConfig[0].linterOptions = {
			reportUnusedDisableDirectives: reportUnusedDisableDirectives
				? "error"
				: normalizeSeverityToString(
						reportUnusedDisableDirectivesSeverity,
					),
		};
	}

	if (reportUnusedInlineConfigs !== void 0) {
		overrideConfig[0].linterOptions = {
			...overrideConfig[0].linterOptions,
			reportUnusedInlineConfigs: normalizeSeverityToString(
				reportUnusedInlineConfigs,
			),
		};
	}

	if (plugin) {
		overrideConfig[0].plugins = await loadPlugins(importer, plugin);
	}

	if (ext) {
		overrideConfig.push({
			files: ext.map(
				extension =>
					`**/*${extension.startsWith(".") ? "" : "."}${extension}`,
			),
		});
	}

	/*
	 * For performance reasons rules not marked as 'error' are filtered out in quiet mode. As maxWarnings
	 * requires rules set to 'warn' to be run, we only filter out 'warn' rules if maxWarnings is not specified.
	 */
	const ruleFilter =
		quiet && maxWarnings === -1 ? quietRuleFilter : () => true;

	const options = {
		allowInlineConfig: inlineConfig,
		cache,
		cacheLocation: cacheLocation || cacheFile,
		cacheStrategy,
		concurrency,
		errorOnUnmatchedPattern,
		fix: (fix || fixDryRun) && (quiet ? quietFixPredicate : true),
		fixTypes: fixType,
		flags: flag,
		ignore,
		ignorePatterns: ignorePattern,
		overrideConfig,
		overrideConfigFile,
		passOnNoPatterns,
		ruleFilter,
		stats,
		warnIgnored,
	};

	return options;
}

module.exports = translateOptions;
