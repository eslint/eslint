/**
 * @fileoverview Coverage-guided fuzz target for `Linter.verifyAndFix`.
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

/*
 * Rules with autofixers. The verifyAndFix path runs the fixer in a loop until
 * convergence, so it stresses fixer composition and the overlapping-range
 * path that pure verify() doesn't reach.
 */
const FIXABLE_RULE_POOL = [
	"semi",
	"quotes",
	"no-extra-semi",
	"no-extra-boolean-cast",
	"no-trailing-spaces",
	"no-multi-spaces",
	"prefer-const",
	"no-var",
	"eqeqeq",
	"curly",
	"dot-notation",
	"object-shorthand",
	"prefer-arrow-callback",
	"prefer-template",
	"arrow-parens",
	"arrow-spacing",
	"comma-dangle",
	"comma-spacing",
	"indent",
	"key-spacing",
	"keyword-spacing",
	"no-extra-parens",
	"no-useless-rename",
	"no-useless-return",
	"yoda",
];

const ECMA_VERSIONS = [5, 2015, 2018, 2020, 2022, 2024, "latest"];
const SOURCE_TYPES = ["script", "module", "commonjs"];

/**
 * Pick a small random subset of fixable rules.
 * @param {FuzzedDataProvider} provider The fuzzer-provided data source.
 * @returns {Object} A `rules` object suitable for the linter config.
 */
function pickRules(provider) {
	const rules = {};
	const count = provider.consumeIntegralInRange(1, 6);

	for (let i = 0; i < count; i++) {
		const idx = provider.consumeIntegralInRange(
			0,
			FIXABLE_RULE_POOL.length - 1,
		);

		rules[FIXABLE_RULE_POOL[idx]] = "error";
	}
	return rules;
}

/**
 * Filter out errors caused by the fuzzer-generated configuration.
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
 * @throws {Error} Any unexpected error from `Linter.verifyAndFix`.
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
	const fix = provider.consumeBoolean();

	const config = {
		languageOptions: {
			ecmaVersion,
			sourceType,
		},
		rules: pickRules(provider),
	};

	const code = provider.consumeRemainingAsString();

	try {
		linter.verifyAndFix(code, config, { fix });
	} catch (e) {
		if (isExpectedConfigurationError(e)) {
			return;
		}
		throw e;
	}
};
