/**
 * @fileoverview The instance of Ajv validator.
 * @author Evgeny Poberezkin
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const Ajv = require("ajv");

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = (additionalOptions = {}) => {
	const ajv = new Ajv({
		useDefaults: true,
		validateSchema: false,
		verbose: true,
		strict: false, // Disable strict mode to avoid breaking existing schemas
		...additionalOptions,
	});

	// Draft-07 is the default meta schema in AJV v8, no need to explicitly add it

	return ajv;
};
