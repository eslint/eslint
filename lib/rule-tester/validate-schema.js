/**
 * @fileoverview RuleTester's JSON Schema validation
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const ajv = require("../shared/ajv")({ strictDefaults: true });

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * Validates JSON Schema definition for a rule.
 * @param {Object} schema The schema to validate.
 * @param {Object} ruleName The rule name.
 * @returns {void}
 * @throws {Error} If the schema is invalid.
 */
function validateSchema(schema, ruleName) {
	ajv.validateSchema(schema);

	if (ajv.errors) {
		const errors = ajv.errors
			.map(error => {
				const field =
					error.dataPath[0] === "."
						? error.dataPath.slice(1)
						: error.dataPath;

				return `\t${field}: ${error.message}`;
			})
			.join("\n");

		throw new Error([`Schema for rule ${ruleName} is invalid:`, errors]);
	}

	/*
	 * `ajv.validateSchema` checks for errors in the structure of the schema (by comparing the schema against a "meta-schema"),
	 * and it reports those errors individually. However, there are other types of schema errors that only occur when compiling
	 * the schema (e.g. using invalid defaults in a schema), and only one of these errors can be reported at a time. As a result,
	 * the schema is compiled here separately from checking for `validateSchema` errors.
	 */
	try {
		ajv.compile(schema);
	} catch (err) {
		throw new Error(
			`Schema for rule ${ruleName} is invalid: ${err.message}`,
			{
				cause: err,
			},
		);
	}
}

module.exports = validateSchema;
