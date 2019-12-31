/**
 * @fileoverview Rule to flag numbers that will lose significant figure precision at runtime
 * @author Jacob Moore
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "problem",

        docs: {
            description: "disallow literal numbers that lose precision",
            category: "Possible Errors",
            recommended: true,
            url: "https://eslint.org/docs/rules/no-loss-of-precision"
        },
        schema: [],
        messages: {
            noLossOfPrecision: "This number will lose precision when stored as a Number type."
        }
    },

    create(context) {

        /**
         * Returns whether the node is number literal
         * @param {Node} node the node literal being evaluated
         * @returns {boolean} true if the node is a number literal
         */
        function isNumber(node) {
            return typeof node.value === "number";
        }

        /**
         * Returns the number stripped of sign and exponential
         * @param {string} numberAsString the string representation of the number
         * @returns {string} the stripped string
         */
        function getNumericPortionOfRepresentation(numberAsString) {
            return numberAsString.replace("-", "").replace("E", "e").split("e")[0];
        }


        /**
         * Returns the number stripped of leading zeros
         * @param {string} numberAsString the string representation of the number
         * @returns {string} the stripped string
         */
        function removeLeadingZeros(numberAsString) {
            return numberAsString.replace(/^0?\.0*/u, "");
        }

        /**
         * Returns the number stripped of trailing zeros
         * @param {string} numberAsString the string representation of the number
         * @returns {string} the stripped string
         */
        function removeTrailingZeros(numberAsString) {
            return numberAsString.replace(/0*$/u, "");
        }

        /**
         * Returns the number stripped of non-significant digits
         * @param {string} numberAsString the string representation of the number
         * @returns {string} the stripped string
         */
        function stripToSignificantDigits(numberAsString) {
            const numericPortion = getNumericPortionOfRepresentation(numberAsString);

            if (numericPortion.includes(".")) {
                return removeLeadingZeros(numericPortion).replace(".", "");
            }
            return removeTrailingZeros(numericPortion);
        }

        /**
         * Returns the requested precision calculated as the number of sig-figs supplied
         * @param {Node} node tne node being evaluated
         * @returns {number} requested precision level
         */
        function getRequestedLevelOfPrecision(node) {
            return stripToSignificantDigits(node.raw).length;
        }

        /**
         * Returns the smallest value that could be added to the number while keeping the same level of precision
         * @param {Node} node the node literal being evaluated
         * @returns {number} number the smallest value stored as a number
         */
        function getSmallestUnitOfRequestedPrecision(node) {
            const numericPortion = getNumericPortionOfRepresentation(node.raw);
            const increment = numericPortion.includes(".")
                ? `.${"0".repeat(numericPortion.split(".")[1].length - 1)}1`
                : `1${"0".repeat(Math.max(0, numericPortion.length - numericPortion.replace(/0*$/u, "").length - 1))}`;

            const nonNumericPortion = node.raw.replace(numericPortion, "");

            return Number(increment + nonNumericPortion);
        }

        /**
         * Returns the string representation of the most precise digit
         * @param {string} numberAsString the number being evaluated
         * @returns {string} the value of the most precise digit
         */
        function getMostPreciseDigit(numberAsString) {
            const numericPortion = getNumericPortionOfRepresentation(numberAsString);

            return numericPortion.includes(".") ? numericPortion.split(".")[1].slice(-1)
                : removeTrailingZeros(numericPortion).slice(-1);
        }

        /**
         * Checks that the string representation of the evaluated number matches the raw value
         * @param {Node} node the node being evaluated
         * @returns {boolean} true if they match
         */
        function checkRawMatchesValue(node) {
            const requestedPrecision = getRequestedLevelOfPrecision(node);

            return getMostPreciseDigit(node.raw) === getMostPreciseDigit(node.value.toPrecision(requestedPrecision));
        }


        /**
         * Returns whether the number will retain accuracy at the requested level of precision
         * @param {Node} node the node literal being evaluated
         * @returns {boolean} true if the number will retain accuracy at tjerequested level of precision
         */
        function checkNumericValue(node) {
            const mostPreciseValue = getSmallestUnitOfRequestedPrecision(node);

            return !checkRawMatchesValue(node) || node.value === node.value + mostPreciseValue || node.value === node.value - mostPreciseValue;
        }


        return {
            Literal(node) {
                if (isNumber(node) && checkNumericValue(node)) {
                    context.report({
                        messageId: "noLossOfPrecision",
                        node
                    });
                }
            }
        };
    }
};
