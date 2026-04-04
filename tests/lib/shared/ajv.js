/**
 * @fileoverview Tests for Ajv.
 * @author Milos Djermanovic
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// With default options, as used by the ESLint core for rule schema validations
const ajv = require("../../../lib/shared/ajv")();

const {
	validateSchema: ruleTesterValidateSchema,
} = require("../../../lib/rule-tester");

const assert = require("node:assert");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Compiles a JSON Schema definition (a schema).
 * Also validates whether the schema passes RuleTester validation.
 * This helper should only be used with schemas that pass all validations.
 * For invalid schemas, check RuleTester's validation and `ajv.compile()` separately.
 * @param {Object} schema The schema to compile.
 * @returns {Function} Validator function.
 */
function compileValidSchema(schema) {
	ruleTesterValidateSchema(schema);
	return ajv.compile(schema);
}

/**
 * Formats Ajv validaton errors.
 * @param {Array<Object>} errors Ajv validaton errors to format.
 * @returns {string} Formatted errors.
 */
function formatValidatonErrors(errors) {
	return errors
		.map(error => `Value ${JSON.stringify(error.data)} ${error.message}.`)
		.join("\n");
}

/**
 * Asserts that data passes schema validation.
 * @param {Function} validator Ajv validator function.
 * @param {Object} data The data to check.
 * @returns {void}
 * @throws {Error} If the data doesn't pass schema validation.
 */
function assertValidData(validator, data) {
	validator(data);

	if (validator.errors) {
		throw new Error(formatValidatonErrors(validator.errors));
	}
}

/**
 * Asserts that data does not pass schema validation.
 * @param {Function} validator Ajv validator function.
 * @param {Object} data The data to check.
 * @param {RegExp} regexp A regular expression to match errors.
 * @param {string} [description] Additional text to include in the thrown error.
 * @returns {void}
 * @throws {Error} If the data does pass schema validation or errors don't match the given regexp.
 */
function assertInvalidData(validator, data, regexp, description) {
	validator(data);

	if (!validator.errors) {
		throw new Error(
			`Expected validation to fail${description ? ` (${description})` : ""}`,
		);
	}

	assert.match(formatValidatonErrors(validator.errors), regexp);
}

// Primitive types as defined by the json-schema-04 specification
const primitiveTypes = [
	{
		type: "array",
		example: [42],
	},
	{
		type: "boolean",
		example: true,
	},
	{
		type: "integer",
		example: 3,
	},
	{
		type: "number",
		example: 3.14,
	},
	{
		type: "null",
		example: null,
	},
	{
		type: "object",
		example: { foo: "bar" },
	},
	{
		type: "string",
		example: "hello",
	},
];

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("Ajv", () => {
	describe("valid schemas", () => {
		describe("`type` property", () => {
			let primitiveTypesWithValidators;
			before(() => {
				primitiveTypesWithValidators = primitiveTypes.map(
					primitiveType => ({
						...primitiveType,
						validator: compileValidSchema({
							type: primitiveType.type,
						}),
					}),
				);
			});

			it("should accept corresponding values", () => {
				for (const primitiveType of primitiveTypesWithValidators) {
					assertValidData(
						primitiveType.validator,
						primitiveType.example,
					);
				}
			});

			it("should reject invalid values", () => {
				for (const primitiveType1 of primitiveTypesWithValidators) {
					for (const primitiveType2 of primitiveTypesWithValidators) {
						if (
							primitiveType1 !== primitiveType2 &&
							// Integers pass as numbers
							!(
								primitiveType1.type === "number" &&
								primitiveType2.type === "integer"
							)
						) {
							assertInvalidData(
								primitiveType1.validator,
								primitiveType2.example,
								new RegExp(
									`should be ${primitiveType1.type}`,
									"u",
								),
								`type: "${primitiveType1.type}", passed: example of "${primitiveType2.type}"`,
							);
						}
					}
				}
			});

			it("should be invalid for RuleTester but ignored by core when set to an invalid value", () => {
				["invalid", null, true, 5, {}].forEach(type => {
					const schema = { type };

					assert.throws(() => {
						ruleTesterValidateSchema(schema);
					}, /type: should be equal to one of the allowed values/u);

					const validator = ajv.compile(schema);

					// all types of values should pass
					for (const { example } of primitiveTypes) {
						assertValidData(validator, example);
					}
				});
			});

			it("should be invalid for RuleTester but ignored by core and not affect other validations when set to an invalid value", () => {
				["invalid", null, true, 5, {}].forEach(type => {
					const schema = {
						type,
						properties: {
							functions: {
								enum: ["always", "never"],
							},
						},
					};

					assert.throws(() => {
						ruleTesterValidateSchema(schema);
					}, /type: should be equal to one of the allowed values/u);

					const validator = ajv.compile(schema);

					// all types of values should pass
					for (const { example } of primitiveTypes) {
						assertValidData(validator, example);
					}

					assertValidData(validator, { functions: "never" });
					assertInvalidData(
						validator,
						{ functions: "baz" },
						/Value "baz" should be equal to one of the allowed values/u,
					);
				});
			});
		});
	});
});
