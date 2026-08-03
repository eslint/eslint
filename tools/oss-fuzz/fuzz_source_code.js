/**
 * @fileoverview Coverage-guided fuzz target for post-parse `SourceCode` helpers.
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
		msg.includes("ecmaVersion must be") ||
		msg.includes("sourceType must be")
	);
}

//------------------------------------------------------------------------------
// Public API
//------------------------------------------------------------------------------

/**
 * Fuzz entry point invoked by Jazzer.js for each input.
 *
 * `Linter.verify` parses the source and stashes the resulting `SourceCode` on
 * the linter; this target then exercises the read-only inspection helpers that
 * rules rely on. Bugs in token/comment indexing or location lookups tend to
 * surface here rather than in `verify` itself.
 * @param {Buffer} data The fuzzer-provided input bytes.
 * @returns {void}
 * @throws {Error} Any unexpected error from the linter or `SourceCode` helpers.
 */
module.exports.fuzz = function (data) {
	const provider = new FuzzedDataProvider(data);

	const ecmaVersion = provider.consumeIntegralInRange(2015, 2024);
	const sourceType = provider.consumeBoolean() ? "module" : "script";

	const config = {
		languageOptions: {
			ecmaVersion,
			sourceType,
		},
	};

	const code = provider.consumeRemainingAsString();

	try {
		linter.verify(code, config);
	} catch (e) {
		if (isExpectedConfigurationError(e)) {
			return;
		}
		throw e;
	}

	const sourceCode = linter.getSourceCode();

	if (!sourceCode || !sourceCode.ast) {
		/*
		 * Parsing failed - the parser error is surfaced as a lint message and
		 * no SourceCode is produced. Nothing more to fuzz on this input.
		 */
		return;
	}

	// Token APIs.
	const tokens = sourceCode.ast.tokens || [];

	if (tokens.length > 0) {
		const t = tokens[0];

		sourceCode.getTokenByRangeStart(t.range[0]);
		sourceCode.getTokenBefore(t);
		sourceCode.getTokenAfter(t);
		sourceCode.getFirstToken(sourceCode.ast);
		sourceCode.getLastToken(sourceCode.ast);
	}

	// Comment APIs.
	sourceCode.getAllComments();

	// Text/location APIs.
	const text = sourceCode.getText();

	sourceCode.getLines();
	if (text.length > 0) {
		const offset = provider.consumeIntegralInRange(0, text.length - 1);

		sourceCode.getLocFromIndex(offset);
	}

	// Scope and ancestor APIs (driven through the AST root).
	sourceCode.getScope(sourceCode.ast);
	sourceCode.getAncestors(sourceCode.ast);
};
