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
            description: "disallow numbers that lose precision",
            category: "Possible Errors",
            recommended: true,
            url: "https://eslint.org/docs/rules/no-loss-of-precision"
        },

        schema: [],

        messages: {
            noLossOfPrecision: "Numbers only support 16 significant digit precision."
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
         * Returns whether the node will lose precision
         * @param {Node} node the node literal being evaluated
         * @returns {boolean} true if the node will lose precision
         */
        function willLosePrecision(node) {
            if (node.raw.startsWith("0x")) {
                return Math.abs(node.value) > Number.MAX_VALUE;
            }

            const strippedNumber = node.raw.split("e")[0].replace("-", "");

            return strippedNumber.includes(".")
                ? Number(strippedNumber.replace(".", "")) > Number.MAX_SAFE_INTEGER
                : Number(strippedNumber.replace(/0*$/u, "")) > Number.MAX_SAFE_INTEGER;
        }


        return {
            Literal(node) {
                if (isNumber(node) && willLosePrecision(node)) {
                    context.report({
                        messageId: "noLossOfPrecision",
                        node
                    });
                }
            }
        };
    }
};
