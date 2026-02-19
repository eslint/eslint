/**
 * @fileoverview The instance of Ajv validator.
 * @author Evgeny Poberezkin
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const Ajv = require("ajv-draft-04");

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = (additionalOptions = {}) => {
	/*
	 * In Ajv v8, strictDefaults option was replaced by strict mode
	 * Remove strictDefaults if passed, as it's no longer supported
	 */
	const { strictDefaults, ...options } = additionalOptions;

	const ajv = new Ajv({
		useDefaults: true,
		validateSchema: false,
		verbose: true,
		/*
		 * Enable strict mode if strictDefaults was requested
		 * strictSchema must be true (not 'log') to throw errors for invalid defaults
		 */
		strictSchema: !!strictDefaults,
		// Other strict mode checks disabled for ESLint compatibility
		strictNumbers: false,
		strictTypes: false,
		strictTuples: false, // ESLint uses tuple schemas (array with items as array)
		strictRequired: false,
		...options,
	});

	return ajv;
};
