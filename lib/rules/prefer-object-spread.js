/**
 * @fileoverview Prefers object spread property over Object.assign
 * @author Sharmila Jesupaul
 * See LICENSE file in root directory for full license.
 */

"use strict";
let globalContext;

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
 * Autofixes the Object.assign call to use an object spread instead.
 * @param {ASTNode|null} node - The node that the rule warns on, i.e. the Object.assign call
 * @param {string} sourceCode - sourceCode of the Object.assign call
 * @returns {Function} autofixer - replaces the Object.assign with a spread object.
 */
function autofixSpread(node, sourceCode) {
    return fixer => {
        const args = node.arguments;
        const firstArg = args[0];
        const lastToken = tail(globalContext.getTokens(firstArg));
        const spreadArgs = args.map((arg, i) => {
            const name = arg.name || sourceCode.getText(arg);

            if (i === 0) {
                return "";
            }

            if (args.length - 1 === i) {
                return `...${name}`;
            }

            return `...${name},`;
        });

        const insertSpreads = fixer.insertTextBefore(lastToken, `${
            node.arguments[0].properties && node.arguments[0].properties.length
                ? ","
                : ""
        }${spreadArgs.join("")}`);

        const removeObjectAssignStart = fixer.removeRange(
            [node.range[0], firstArg.range[0]],
            ""
        );

        const allOtherArgumentsRange = [firstArg.range[1], node.range[1]];
        const removeRemainingArguments = fixer.removeRange(allOtherArgumentsRange, "");

        return [
            removeObjectAssignStart,
            insertSpreads,
            removeRemainingArguments
        ];
    };
}

/**
 * Autofixes the Object.assign call with a single object literal as an argument
 * @param {ASTNode|null} node - The node that the rule warns on, i.e. the Object.assign call
 * @param {string} sourceCode - sourceCode of the Object.assign call
 * @returns {Function} autofixer - replaces the Object.assign with a object literal.
 */
function autofixObjectLiteral(node, sourceCode) {
    return fixer => {
        const argument = node.arguments[0];

        return fixer.replaceText(node, sourceCode.text.slice(argument.range[0], argument.range[1]));
    };
}


module.exports = {
    meta: {
        docs: {
            description:
                "disallow using Object.assign with an object literal as the first argument and prefer the use of object spread instead.",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/prefer-object-spread"
        },
        schema: [],
        fixable: "code",
        messages: {
            useSpreadMessage: "Use an object spread instead of `Object.assign()` eg: `{ ...foo }`",
            useLiteralMessage: "Use an object literal instead of `Object.assign`."
        }
    },

    create: function rule(context) {
        globalContext = context;
        return {
            CallExpression(node) {
                const sourceCode = context.getSourceCode();
                const hasSpreadElement = node.arguments.length &&
                    node.arguments.some(x => x.type === "SpreadElement");

                /*
                 * The condition below is cases where Object.assign has a single argument and
                 * that argument is an object literal. e.g. `Object.assign({ foo: bar })`.
                 * For now, we will warn on this case and autofix it.
                 */
                if (
                    node.arguments.length === 1 &&
                    node.arguments[0].type === "ObjectExpression"
                ) {
                    context.report({
                        node,
                        messageId: "useLiteralMessage",
                        fix: autofixObjectLiteral(node, sourceCode)
                    });
                }

                /*
                 * The condition below warns on `Object.assign` calls that that have
                 * an object literal as the first argument and have a second argument
                 * that can be spread. e.g `Object.assign({ foo: bar }, baz)`
                 */
                if (
                    node.arguments.length > 1 &&
                    node.arguments[0].type === "ObjectExpression" &&
                    isObjectAssign &&
                    !hasSpreadElement
                ) {
                    context.report({
                        node,
                        messageId: "useSpreadMessage",
                        fix: autofixSpread(node, sourceCode)
                    });
                }
            }
        };
    }
};
