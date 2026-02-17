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
		strict: false,
		...additionalOptions,
	});

	return ajv;
};
