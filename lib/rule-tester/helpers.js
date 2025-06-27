/**
 * @fileoverview Helper functions for the rule tester.
 * @author aladdin-add<weiran.zsd@outlook.com>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const stringify = require("json-stable-stringify-without-jsonify");
const assert = require("node:assert").strict;
const { isSerializable } = require("../shared/serialization");

//------------------------------------------------------------------------------
// Private Members
//------------------------------------------------------------------------------
/*
 * Ignored test case properties when checking for test case duplicates.
 */
const duplicationIgnoredParameters = new Set(["name", "errors", "output"]);

/**
 * Asserts that a value is a string or undefined.
 * If the value is not a string or undefined, it throws an assertion error
 * @param {any} value The value to check.
 * @param {string?} message The error message to display if the value is not a string or undefined.
 * @returns {void}
 */
function assertStringOrUndefined(
	value,
	message = "Value must be a string or undefined",
) {
	assert.ok(
		typeof value === "string" || typeof value === "undefined",
		message,
	);
}

/**
 * Asserts that a value is an object.
 * If the value is not an object, it throws an assertion error.
 * @param {any} value The value to check.
 * @param {string?} message The error message to display if the value is not an object.
 * @returns {void}
 */
function assertObject(value, message = "Value must be an object") {
	assert.ok(value && typeof value === "object", message);
}

/**
 * Asserts that a value is a string.
 * If the value is not a string, it throws an assertion error.
 * @param {any} value The value to check.
 * @param {string?} message The error message to display if the value is not a string.
 * @returns {void}
 */
function assertString(value, message = "Value must be a string") {
	assert.ok(typeof value === "string", message);
}
/**
 * Asserts that a value is undefined.
 * If the value is not undefined, it throws an assertion error.
 * @param {any} value The value to check.
 * @param {string?} message The error message to display if the value is not undefined.
 * @returns {void}
 */
function assertUndefined(value, message = "Value must be undefined") {
	assert.ok(typeof value === "undefined", message);
}

/**
 * Asserts that a value is a boolean or undefined.
 * If the value is not a boolean or undefined, it throws an assertion error.
 * @param {any} value The value to check.
 * @param {string?} message The error message to display if the value is not a boolean or undefined.
 * @returns {void}
 */
function assertBoolOrUndefined(
	value,
	message = "Value must be a boolean or undefined",
) {
	assert.ok(
		typeof value === "boolean" || typeof value === "undefined",
		message,
	);
}

/**
 * Asserts that a value is a function or undefined.
 * If the value is not a function or undefined, it throws an assertion error.
 * @param {any} value The value to check.
 * @param {string?} message The error message to display if the value is not a function or undefined.
 * @returns {void}
 */
function assertFunctionOrUndefined(
	value,
	message = "Value must be a function or undefined",
) {
	assert.ok(
		typeof value === "function" || typeof value === "undefined",
		message,
	);
}
/**
 * Asserts that a value is an array or undefined.
 * If the value is not an array or undefined, it throws an assertion error
 * @param {any} value The value to check
 * @param {string?} message The error message to display if the value is not an array or undefined.
 * @returns {void}
 */
function assertArrayOrUndefined(
	value,
	message = "Value must be an array or undefined",
) {
	assert.ok(Array.isArray(value) || typeof value === "undefined", message);
}

/**
 * Asserts that the `errors` property of an invalid test case is valid.
 * @param {number | string[]} errors The `errors` property of the invalid test case.
 * @param {string} ruleName The name of the rule being tested.
 * @returns {void}
 */
function asserErrorsProperty(errors, ruleName) {
	const isNumber = typeof errors === "number";
	const isArray = Array.isArray(errors);

	assert.ok(
		isNumber || isArray,
		`Did not specify errors for an invalid test of ${ruleName}`,
	);

	if (Array.isArray(errors)) {
		assert.ok(
			errors.length !== 0,
			"Invalid cases must have at least one error",
		);
	}

	if (typeof errors === "number") {
		assert.ok(
			errors > 0,
			"Invalid cases must have 'error' value greater than 0",
		);
	}
}

// TODO: Implement this function to validate the structure of an error item.
function assertErrorItem(error, ruleName) {
	throw new Error("to be implemented!");
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Asserts that a rule is valid.
 * A valid rule must be an object with a `create` method.
 * @param {Object} rule The rule to check.
 * @param {string} ruleName The name of the rule.
 * @returns {void}
 * @throws {AssertionError} If the rule is not valid.
 */
exports.assertRule = function assertRule(rule, ruleName) {
	assert.ok(
		rule && typeof rule === "object" && typeof rule.create === "function",
		`Rule ${ruleName} must be an object with a \`create\` method`,
	);
};

/**
 * Asserts that a test scenario object is valid.
 * A valid test scenario object must have `valid` and `invalid` properties, both of
 * which must be arrays.
 * @param {Object} test The test scenario object to check.
 * @param {string} ruleName The name of the rule being tested.
 * @returns {void}
 * @throws {AssertionError} If the test scenario object is not valid.
 */
exports.assertTest = function assertTest(test, ruleName) {
	assertObject(
		test,
		`Test Scenarios for rule ${ruleName} : Could not find test scenario object`,
	);

	const hasValid = Array.isArray(test.valid);
	const hasInvalid = Array.isArray(test.invalid);

	assert.ok(
		hasValid && hasInvalid,
		`Test Scenarios for rule ${ruleName} : No valid or invalid test scenarios found`,
	);
}

/**
 * Check if this test case is a duplicate of one we have seen before.
 * @param {string|Object} item test case object
 * @param {Set<string>} seenTestCases set of serialized test cases we have seen so far (managed by this function)
 * @returns {void}
 */
exports.checkDuplicateTestCase = function checkDuplicateTestCase(
	item,
	seenTestCases,
) {
	if (!isSerializable(item)) {
		/*
		 * If we can't serialize a test case (because it contains a function, RegExp, etc), skip the check.
		 * This might happen with properties like: options, plugins, settings, languageOptions.parser, languageOptions.parserOptions.
		 */
		return;
	}

	const normalizedItem = typeof item === "string" ? { code: item } : item;
	const serializedTestCase = stringify(normalizedItem, {
		replacer(key, value) {
			// "this" is the currently stringified object --> only ignore top-level properties
			return normalizedItem !== this ||
				!duplicationIgnoredParameters.has(key)
				? value
				: void 0;
		},
	});

	assert(
		!seenTestCases.has(serializedTestCase),
		"detected duplicate test case",
	);
	seenTestCases.add(serializedTestCase);
};

exports.assertValidTestCase = function assertValidTestCase(item, seenTestCases){
	// must have x properties
	assertString(
		item.code,
		"Test case must specify a string value for 'code'",
	);

	// optional properties
	assertStringOrUndefined(
		item.name,
		`Optional test case property 'name' must be a string`,
	);
	assertBoolOrUndefined(
		item.only,
		`Optional test case property 'only' must be a boolean`,
	);
	assertFunctionOrUndefined(
		item.before,
		`Optional test case property 'before' must be a function`,
	);
	assertFunctionOrUndefined(
		item.after,
		`Optional test case property 'after' must be a function`,
	);
	assertStringOrUndefined(
		item.filename,
		`Optional test case property 'filename' must be a string`,
	);
	assertArrayOrUndefined(
		item.options,
		`Optional test case property 'options' must be an array`,
	);

	// must not have x properties
	assertUndefined(
		item.errors,
		"Valid test case must not have 'errors' property`",
	);
	assertUndefined(
		item.output,
		"Valid test case must not have 'output' property`",
	);

	exports.checkDuplicateTestCase(item, seenTestCases);
}

exports.assertInvalidTestCase = function assertInvalidTestCase(item, seenTestCases, ruleName) {
		assertObject(item, "Invalid test case must be an object");

		// must have x properties
		assertString(
			item.code,
			"Test case must specify a string value for 'code'",
		);
		asserErrorsProperty(item.errors, ruleName);
		assert.ok(
			item.output === null ||
				item.ouput === void 0 ||
				typeof item.output === "string",
			"Invalid test case must specify a string value for 'output' or be null",
		);

		// optional properties
		assertStringOrUndefined(
			item.name,
			`Optional test case property 'name' must be a string`,
		);
		assertBoolOrUndefined(
			item.only,
			`Optional test case property 'only' must be a boolean`,
		);
		assertFunctionOrUndefined(
			item.before,
			`Optional test case property 'before' must be a function`,
		);
		assertFunctionOrUndefined(
			item.after,
			`Optional test case property 'after' must be a function`,
		);
		assertStringOrUndefined(
			item.filename,
			`Optional test case property 'filename' must be a string`,
		);
		assertArrayOrUndefined(
			item.options,
			`Optional test case property 'options' must be an array`,
		);

		exports.checkDuplicateTestCase(item, seenTestCases);
}