/**
 * @fileoverview Rule to flag numbers that will lose significant figure precision at runtime
 * @author Jacob Moore
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/** Class representing a number in scientific notation. */
class ScientificNotation {
	/** @type {string} The digits of the coefficient. A decimal point is implied after the first digit. */
	coefficient;

	/** @type {number} The order of magnitude. */
	magnitude;

	constructor(coefficient, magnitude) {
		this.coefficient = coefficient;
		this.magnitude = magnitude;
	}

	/* c8 ignore start -- debug only */
	toString() {
		return `${this.coefficient[0]}${this.coefficient.length > 1 ? `.${this.coefficient.slice(1)}` : ""}e${this.magnitude}`;
	}
	/* c8 ignore stop */
}

/**
 * Returns whether the node is number literal
 * @param {Node} node the node literal being evaluated
 * @returns {boolean} true if the node is a number literal
 */
function isNumber(node) {
	return typeof node.value === "number";
}

/**
 * Gets the source code of the given number literal. Removes `_` numeric separators from the result.
 * @param {Node} node the number `Literal` node
 * @returns {string} raw source code of the literal, without numeric separators
 */
function getRaw(node) {
	return node.raw.replace(/_/gu, "");
}

/**
 * Checks whether the number is base ten
 * @param {ASTNode} node the node being evaluated
 * @returns {boolean} true if the node is in base ten
 */
function isBaseTen(node) {
	const prefixes = ["0x", "0X", "0b", "0B", "0o", "0O"];

	return (
		prefixes.every(prefix => !node.raw.startsWith(prefix)) &&
		!/^0[0-7]+$/u.test(node.raw)
	);
}

/**
 * Checks that the user-intended non-base ten number equals the actual number after is has been converted to the Number type
 * @param {Node} node the node being evaluated
 * @returns {boolean} true if they do not match
 */
function notBaseTenLosesPrecision(node) {
	const rawString = getRaw(node).toUpperCase();
	let base;

	if (rawString.startsWith("0B")) {
		base = 2;
	} else if (rawString.startsWith("0X")) {
		base = 16;
	} else {
		base = 8;
	}

	return !rawString.endsWith(node.value.toString(base).toUpperCase());
}

/**
 * Returns the number stripped of leading zeros
 * @param {string} numberAsString the string representation of the number
 * @returns {string} the stripped string
 */
function removeLeadingZeros(numberAsString) {
	for (let i = 0; i < numberAsString.length; i++) {
		if (numberAsString[i] !== "0") {
			return numberAsString.slice(i);
		}
	}
	return numberAsString;
}

/**
 * Returns the number stripped of trailing zeros
 * @param {string} numberAsString the string representation of the number
 * @returns {string} the stripped string
 */
function removeTrailingZeros(numberAsString) {
	for (let i = numberAsString.length - 1; i >= 0; i--) {
		if (numberAsString[i] !== "0") {
			return numberAsString.slice(0, i + 1);
		}
	}
	return numberAsString;
}

/**
 * Converts an integer to an object containing the integer's coefficient and order of magnitude
 * @param {string} stringInteger the string representation of the integer being converted
 * @param {boolean} preserveTrailingZeros if `true`, the decimal coefficient will have the same number of trailing zeros as the original integer
 * @returns {ScientificNotation} the object containing the integer's coefficient and order of magnitude
 */
function normalizeInteger(stringInteger, preserveTrailingZeros) {
	const trimmedInteger = removeLeadingZeros(stringInteger);
	const significantDigits = preserveTrailingZeros
		? trimmedInteger
		: removeTrailingZeros(trimmedInteger);

	return new ScientificNotation(significantDigits, trimmedInteger.length - 1);
}

/**
 * Converts a float to an object containing the float's coefficient and order of magnitude
 * @param {string} stringFloat the string representation of the float being converted
 * @returns {ScientificNotation} the object containing the float's coefficient and order of magnitude
 */
function normalizeFloat(stringFloat) {
	const trimmedFloat = removeLeadingZeros(stringFloat);

	if (trimmedFloat.startsWith(".")) {
		const decimalDigits = trimmedFloat.slice(1);
		const significantDigits = removeLeadingZeros(decimalDigits);

		return new ScientificNotation(
			significantDigits,
			significantDigits.length - decimalDigits.length - 1,
		);
	}
	return new ScientificNotation(
		trimmedFloat.replace(".", ""),
		trimmedFloat.indexOf(".") - 1,
	);
}

/**
 * Converts a base ten number to proper scientific notation
 * @param {string} stringNumber the string representation of the base ten number to be converted
 * @param {boolean} preserveTrailingZeros whether to always preserve trailing decimal zeros in the coefficient
 * @returns {ScientificNotation} the object containing the number's coefficient and order of magnitude
 */
function convertNumberToScientificNotation(
	stringNumber,
	preserveTrailingZeros,
) {
	const splitNumber = stringNumber.split("e");
	const originalCoefficient = splitNumber[0];
	const normalizedNumber = stringNumber.includes(".")
		? normalizeFloat(originalCoefficient)
		: normalizeInteger(originalCoefficient, preserveTrailingZeros);
	if (splitNumber.length > 1) {
		normalizedNumber.magnitude += parseInt(splitNumber[1], 10);
	}

	return normalizedNumber;
}

/**
 * Checks that the user-intended base ten number equals the actual number after is has been converted to the Number type
 * @param {Node} node the node being evaluated
 * @returns {boolean} true if they do not match
 */
function baseTenLosesPrecision(node) {
	const rawNumber = getRaw(node).toLowerCase();
	const normalizedRawNumber = convertNumberToScientificNotation(
		rawNumber,
		false,
	);
	const requestedPrecision = normalizedRawNumber.coefficient.length;

	if (requestedPrecision > 100) {
		return true;
	}
	const storedNumber = node.value.toPrecision(requestedPrecision);
	const normalizedStoredNumber = convertNumberToScientificNotation(
		storedNumber,
		true,
	);

	return (
		normalizedRawNumber.magnitude !== normalizedStoredNumber.magnitude ||
		normalizedRawNumber.coefficient !== normalizedStoredNumber.coefficient
	);
}

/**
 * Checks that the user-intended number equals the actual number after is has been converted to the Number type
 * @param {Node} node the node being evaluated
 * @returns {boolean} true if they do not match
 */
function losesPrecision(node) {
	return isBaseTen(node)
		? baseTenLosesPrecision(node)
		: notBaseTenLosesPrecision(node);
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "problem",
		dialects: ["typescript", "javascript"],
		language: "javascript",

		docs: {
			description: "Disallow literal numbers that lose precision",
			recommended: true,
			url: "https://eslint.org/docs/latest/rules/no-loss-of-precision",
		},
		schema: [],
		messages: {
			noLossOfPrecision:
				"This number literal will lose precision at runtime.",
		},
	},

	create(context) {
		return {
			Literal(node) {
				if (node.value && isNumber(node) && losesPrecision(node)) {
					context.report({
						messageId: "noLossOfPrecision",
						node,
					});
				}
			},
		};
	},
};
