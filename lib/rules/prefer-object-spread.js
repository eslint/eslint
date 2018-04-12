/**
 * @fileoverview Prefers object spread property over Object.assign
 * @author Sharmila Jesupaul
 * See LICENSE file in root directory for full license.
 */

"use strict";

const matchAll = require("string.prototype.matchall");

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
 * Helper that checks if the node needs parentheses to be valid JS.
 * The default is to wrap the node in parentheses to avoid parsing errors.
 * @param {ASTNode} node - The node that the rule warns on
 * @returns {boolean} - Returns true if the node needs parentheses
 */
function needsParens(node) {
    const parent = node.parent;

    if (!parent || !node.type) {
        return true;
    }

    switch (parent.type) {
        case "VariableDeclarator":
        case "ArrayExpression":
        case "ReturnStatement":
        case "CallExpression":
        case "Property":
            return false;
        default:
            return true;
    }
}

/**
 * Determines if an argument needs parentheses. The default is to not add parens.
 * @param {ASTNode} node - The node to be checked.
 * @returns {boolean} True if the node needs parentheses
 */
function argNeedsParens(node) {
    if (!node.type) {
        return false;
    }

    switch (node.type) {
        case "AssignmentExpression":
        case "ArrowFunctionExpression":
        case "ConditionalExpression":
            return true;
        default:
            return false;
    }
}

/**
 * Helper that adds a comma after the last non-whitespace character that is not a part of a comment.
 * @param {string} arg - String of argument text
 * @returns {string} - argument with comma at the end of it
 */
function addComma(arg) {
    const nonWhitespaceCharacterRegex = /[^\s\\]/g;
    const commentRegex = /(\/\*[\w'\s\r\n*]*\*\/)|(\/\/[\w\s']*)|(<![-\-\s\w>/]*>)/g;

    const commentMatches = Array.from(matchAll(arg, commentRegex));
    const nonWhitespaceCharacters = Array.from(matchAll(arg, nonWhitespaceCharacterRegex));
    const commentRanges = [];

    // Create a ranges of starting and ending indicies for comments found
    commentMatches.forEach(match => {
        const start = match.index;
        const end = start + match[0].length;

        commentRanges.push([start, end]);
    });

    const validWhitespaceMatches = [];

    // Create a list of indexes where non-whitespace characters exist.
    nonWhitespaceCharacters.forEach(match => {
        const insertIndex = match.index + match[0].length;

        if (!commentRanges.length) {
            validWhitespaceMatches.push(insertIndex);
        }

        // If comment ranges are found make sure that the non whitespace characters are not part of the comment.
        commentRanges.forEach(arr => {
            const commentStart = arr[0];
            const commentEnd = arr[1];

            if (insertIndex < commentStart || insertIndex > commentEnd) {
                validWhitespaceMatches.push(insertIndex);
            }
        });
    });
    const insertPos = Math.max.apply(Math, validWhitespaceMatches);
    const regex = new RegExp(`^((?:.|[^/s/S]){${insertPos}}) *`);

    return arg.replace(regex, "$1, ");
}

/**
 * Helper formats an argument by either removing curlies or adding a spread operator
 * @param {ASTNode|null} arg - ast node representing argument to format
 * @param {boolean} isLast - true if on the last element of the array
 * @param {Object} sourceCode - in context sourcecode object
 * @returns {string} - formatted argument
 */
function formatArg(arg, isLast, sourceCode) {
    const text = sourceCode.getText(arg);
    const parens = argNeedsParens(arg);

    if (arg.type === "ObjectExpression" && arg.properties.length === 0) {
        return "";
    }

    if (arg.type === "ObjectExpression") {

        /**
         * This regex finds the opening curly brace and any following spaces and replaces it with whatever
         * exists before the curly brace. It also does the same for the closing curly brace. This is to avoid
         * having multiple spaces around the object expression depending on how the object properties are spaced.
         */
        const formattedObjectLiteral = text.replace(/^(.*){ */, "$1").replace(/ *}([^}]*)$/, "$1");

        return isLast ? formattedObjectLiteral : addComma(formattedObjectLiteral);
    }

    if (isLast) {
        return parens ? `...(${text})` : `...${text}`;
    }

    return parens ? addComma(`...(${text})`) : `...${addComma(text)}`;
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
        const lastArg = args[args.length - 1];
        const parens = needsParens(node);
        const replaceObjectAssignStart = fixer.replaceTextRange(
            [node.range[0], firstArg.range[0]],
            `${parens ? "({" : "{"}`
        );

        const handleArgs = args
            .map((arg, i, arr) => formatArg(arg, i + 1 >= arr.length, sourceCode))
            .filter(arg => arg !== "," && arg !== "");

        const insertBody = fixer.replaceTextRange([firstArg.range[0], lastArg.range[1]], handleArgs.join(""));
        const replaceObjectAssignEnd = fixer.replaceTextRange([lastArg.range[1], node.range[1]], `${parens ? "})" : "}"}`);

        return [
            replaceObjectAssignStart,
            insertBody,
            replaceObjectAssignEnd
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
        const parens = needsParens(node);

        return fixer.replaceText(node, `${parens ? "(" : ""}${sourceCode.text.slice(argument.range[0], argument.range[1])}${parens ? ")" : ""}`);
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
