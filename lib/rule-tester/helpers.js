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

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Validates the structure of a rule and its associated tests.
 * @param {string} ruleName The name of the rule to run.
 * @param {RuleDefinition} rule The rule to test.
 * @param {{
 *   valid: (ValidTestCase | string)[],
 *   invalid: InvalidTestCase[]
 * }} test The collection of tests to run.
 * @throws {TypeError|Error} If `rule` is not an object with a `create` method,
 * or if non-object `test`, or if a required scenario of the given type is missing.
 * @returns {void}
 */
exports.validateTests = function validateTests(ruleName, rule, test) {
	const requiredScenarios = ["valid", "invalid"];
	const scenarioErrors = [];

	if (
		!rule ||
		typeof rule !== "object" ||
		typeof rule.create !== "function"
	) {
		throw new TypeError("Rule must be an object with a `create` method");
	}

	if (!test || typeof test !== "object") {
		throw new TypeError(
			`Test Scenarios for rule ${ruleName} : Could not find test scenario object`,
		);
	}

	requiredScenarios.forEach(scenarioType => {
		if (!test[scenarioType]) {
			scenarioErrors.push(
				`Could not find any ${scenarioType} test scenarios`,
			);
		}
	});

	if (scenarioErrors.length > 0) {
		throw new Error(
			[`Test Scenarios for rule ${ruleName} is invalid:`]
				.concat(scenarioErrors)
				.join("\n"),
		);
	}
};

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
