/**
 * @fileoverview Prefers object spread property over Object.assign
 * @author Sharmila Jesupaul
 * See LICENSE file in root directory for full license.
 */

"use strict";

// Helpers
/**
 * Helper that returns the last element in an array
 * @param {array} arr - array that you are searching in
 * @returns {string} - Returns the last element in an array of string arguments
 */
function tail(arr) {
    return arr[arr.length - 1];
}

/**
 * Helper that strips the curlie braces from a stringified object, returning only the contents
 * @param {string} objectString - Source code of an object literal
 * @returns {string} - Returns the object with the curly braces stripped
 */
function stripCurlies(objectString) {
    return objectString.slice(1, -1);
}

/**
 * Helper that checks if the node is an Object.assign call
 * @param {ASTNode} node - The node that the rule warns on
 * @returns {boolean} - Returns true if the node is an Object.assign call
 */
function isObjectAssign(node) {
    return (
        node.callee &&
        node.callee.type === "MemberExpression" &&
        node.callee.object.name === "Object" &&
        node.callee.property.name === "assign"
    );
}

/**
 * Autofixer that parses arguments that are passed into the Object.assign call, and returns a formatted object spread.
 * @param {array} args - The node that the rule warns on, i.e. the Object.assign call
 * @param {string} sourceCode - sourceCode of the Object.assign call
 * @returns {array} formatted args - replaces the Object.assign with a spread object.
 */
function parseArgs(args, sourceCode) {
    const mapped = args.map((arg, i) => {

        // If the the argument is an empty object
        if (arg.type === "ObjectExpression" && arg.properties.length === 0) {
            return "";
        }

        // if the argument is another object.assign call run this function for all of it's arguments
        if (isObjectAssign(arg)) {
            return parseArgs(arg.arguments, sourceCode);
        }

        const next = args[i + 1] || {};

        // if the argument is an object with properties
        if (arg.type === "ObjectExpression") {
            const trimmedObject = stripCurlies(sourceCode.getText(arg)).trim();

            return next.range && next.range[0] ? `${trimmedObject}, ` : trimmedObject;
        }

        return next.range && next.range[0]
            ? `...${sourceCode.getText(arg)}, `
            : `...${sourceCode.getText(arg)}`;
    });

    return [].concat.apply([], mapped);
}

/**
 * Autofixes the Object.assign call to use an object spread instead.
 * @param {ASTNode|null} node - The node that the rule warns on, i.e. the Object.assign call
 * @param {string} sourceCode - sourceCode of the Object.assign call
 * @returns {Function} autofixer - replaces the Object.assign with a spread object.
 */
function autofixSpread(node, sourceCode) {
    return fixer => {
        const args = node.arguments;

        const processedArgs = parseArgs(args, sourceCode).join("");

        const lastArg = tail(args);
        const firstArg = args[0];

        const funcEnd = sourceCode.text
            .slice(lastArg.range[1], node.range[1])
            .split(")")[0];
        const funcStart = tail(
            sourceCode.text.slice(node.range[0], firstArg.range[0]).split("(")
        );

        return fixer.replaceText(
            node,
            `{${funcStart}${processedArgs}${funcEnd}}`
        );
    };
}

module.exports = {
    meta: {
        docs: {
            description:
                "disallow using Object.assign with an object literal as the first argument and prefer the use of object spread instead.",
            category: "ECMAScript 6",
            recommended: false,
            url: "https://eslint.org/docs/rules/prefer-object-spread"
        },
        schema: [],
        fixable: "code"
    },

    create: function rule(context) {
        return {
            CallExpression: node => {
                const message = "Use an object spread instead of `Object.assign()` eg: `{ ...foo }`";
                const sourceCode = context.getSourceCode();
                const hasSpreadElement = node.arguments.length &&
                    node.arguments.some(x => x.type === "SpreadElement");

                if (
                    node.arguments.length > 1 &&
                    node.arguments[0].type === "ObjectExpression" &&
                    isObjectAssign &&
                    !hasSpreadElement
                ) {
                    context.report({
                        node,
                        message,
                        fix: autofixSpread(node, sourceCode)
                    });
                }
            }
        };
    }
};
