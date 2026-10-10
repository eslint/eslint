/**
 * @fileoverview Coverage-guided fuzz target for `Linter.verify`.
 * @author Dexter K.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { FuzzedDataProvider } = require("@jazzer.js/core");
const { Linter } = require("../../lib/linter");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const linter = new Linter();

const ECMA_VERSIONS = [3, 5, 2015, 2018, 2020, 2022, 2024, "latest"];
const SOURCE_TYPES = ["script", "module", "commonjs"];

/*
 * A representative cross-section of rules covering parser-touching rules,
 * scope analysis, AST shape, and rules with non-trivial state (control-flow,
 * autofix, suggestions). Enabling all rules at once dilutes coverage signal,
 * so the fuzzer picks a small subset on each iteration.
 */
const RULE_POOL = [
	"no-cond-assign",
	"no-constant-condition",
	"no-dupe-args",
	"no-dupe-keys",
	"no-empty",
	"no-extra-boolean-cast",
	"no-irregular-whitespace",
	"no-redeclare",
	"no-undef",
	"no-unreachable",
	"no-unused-vars",
	"no-use-before-define",
	"complexity",
	"max-depth",
	"max-nested-callbacks",
	"max-params",
	"prefer-const",
	"semi",
	"quotes",
	"eqeqeq",
	"curly",
	"no-var",
	"no-multi-spaces",
	"no-trailing-spaces",
];

/**
 * Pick a small random subset of rules to enable.
 * @param {FuzzedDataProvider} provider The fuzzer-provided data source.
 * @returns {Object} A `rules` object suitable for the linter config.
 */
function pickRules(provider) {
	const rules = {};
	const count = provider.consumeIntegralInRange(0, 8);

	for (let i = 0; i < count; i++) {
		const idx = provider.consumeIntegralInRange(0, RULE_POOL.length - 1);

		rules[RULE_POOL[idx]] = "error";
	}
	return rules;
}

/**
 * Filter out errors caused by the fuzzer-generated configuration rather than
 * the source code under test, so they don't drown out real bugs.
 * @param {Error} e The error thrown by the linter.
 * @returns {boolean} `true` when the error is a known config-shape rejection.
 */
function isExpectedConfigurationError(e) {
	if (!e || typeof e.message !== "string") {
		return false;
	}
	const msg = e.message;

	return (
		msg.includes('Key "languageOptions":') ||
		msg.includes('Key "linterOptions":') ||
		msg.includes('Key "rules":') ||
		msg.includes("ecmaVersion must be") ||
		msg.includes("sourceType must be")
	);
}

//------------------------------------------------------------------------------
// Public API
//------------------------------------------------------------------------------

/**
 * Fuzz entry point invoked by Jazzer.js for each input.
 * @param {Buffer} data The fuzzer-provided input bytes.
 * @returns {void}
 * @throws {Error} Any unexpected error from `Linter.verify`.
 */
module.exports.fuzz = function (data) {
	const provider = new FuzzedDataProvider(data);

	const ecmaVersion =
		ECMA_VERSIONS[
			provider.consumeIntegralInRange(0, ECMA_VERSIONS.length - 1)
		];
	const sourceType =
		SOURCE_TYPES[
			provider.consumeIntegralInRange(0, SOURCE_TYPES.length - 1)
		];
	const allowInlineConfig = provider.consumeBoolean();
	const reportUnusedDisableDirectives = provider.consumeBoolean();

	const config = {
		languageOptions: {
			ecmaVersion,
			sourceType,
			parserOptions: {
				ecmaFeatures: {
					jsx: provider.consumeBoolean(),
					globalReturn: provider.consumeBoolean(),
				},
			},
		},
		linterOptions: {
			reportUnusedDisableDirectives,
		},
		rules: pickRules(provider),
	};

	const code = provider.consumeRemainingAsString();

	try {
		linter.verify(code, config, { allowInlineConfig });
	} catch (e) {
		/*
		 * ESLint surfaces parser errors as lint messages, so any thrown error
		 * here is unexpected and worth reporting unless it's a known config
		 * rejection from the fuzzer-generated options.
		 */
		if (isExpectedConfigurationError(e)) {
			return;
		}
		throw e;
	}
};
