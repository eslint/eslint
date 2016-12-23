/**
 * @fileoverview Look for useless escapes in strings and regexes
 * @author Onur Temizkan
 */

"use strict";

const astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
* Returns the union of two sets.
* @param {Set} setA The first set
* @param {Set} setB The second set
* @returns {Set} The union of the two sets
*/
function union(setA, setB) {
    return new Set(function *() {
        yield* setA;
        yield* setB;
    }());
}

const VALID_STRING_ESCAPES = new Set("\\nrvtbfux\n\r\u2028\u2029");
const REGEX_GENERAL_ESCAPES = new Set("\\bcdDfnrsStvwWxu0123456789");
const REGEX_CHARCLASS_ESCAPES = union(REGEX_GENERAL_ESCAPES, new Set("]"));
const REGEX_NON_CHARCLASS_ESCAPES = union(REGEX_GENERAL_ESCAPES, new Set("^/.$*+?[|()B"));

/**
* Parses a regular expression into a list of characters with character class info.
* @param {string} regExpText The raw text used to create the regular expression
* @returns {Object[]} A list of characters, each with info on escaping and whether they're in a character class.
* @example
*
* parseRegExp('a\\b[cd-]')
*
* returns:
* [
*   {text: 'a', index: 0, escaped: false, inCharClass: false},
*   {text: 'b', index: 2, escaped: true, inCharClass: false},
*   {text: '[', index: 3, escaped: false, inCharClass: false},
*   {text: 'c', index: 4, escaped: false, inCharClass: true},
*   {text: 'd', index: 5, escaped: false, inCharClass: true},
*   {text: '-', index: 6, escaped: false, inCharClass: true},
*   {text: ']', index: 7, escaped: false, inCharClass: true}
* ]
*/
function parseRegExp(regExpText) {
    const charList = [];

    regExpText.split("").reduce((state, char, index) => {
        if (!state.escapeNextChar && char === "\\") {

            // Backslashes used in escapes should not be included in the output list.
            return Object.assign(state, { escapeNextChar: true });
        }
        charList.push({ text: char, index, escaped: state.escapeNextChar, inCharClass: state.inCharClass });
        if (!state.escapeNextChar && char === "[") {
            state.inCharClass = true;
        }
        if (!state.escapeNextChar && char === "]") {
            state.inCharClass = false;
        }
        return Object.assign(state, { escapeNextChar: false });
    }, { escapeNextChar: false, inCharClass: false });

    return charList;
}

/**
* Determines whether the character at a given index is the first element in a character class
* @param {Object[]} parsedRegExp A parsed regular expression, in the same format returned by parseRegExp
* @param {number} charIndex The index of the character in the list
* @returns {boolean} `true` if the character is the first element in a character class
*/
function startsCharClass(parsedRegExp, charIndex) {
    return parsedRegExp[charIndex].inCharClass &&
        !parsedRegExp[charIndex - 1].inCharClass &&
        (parsedRegExp[charIndex].escaped || parsedRegExp[charIndex].text !== "]");
}

/**
* Determines whether the character at a given index is the last element in a character class
* @param {Object[]} parsedRegExp A parsed regular expression, in the same format returned by parseRegExp
* @param {number} charIndex The index of the character in the list
* @returns {boolean} `true` if the character is the last element in a character class
*/
function endsCharClass(parsedRegExp, charIndex) {
    return parsedRegExp[charIndex].inCharClass &&
        parsedRegExp[charIndex + 1].inCharClass &&
        parsedRegExp[charIndex + 1].text === "]" &&
        !parsedRegExp[charIndex + 1].escaped;
}

/**
* Gets all matches of a regex on a string
* @param {string} string The string
* @param {RegExp} pattern A global regular expression
* @returns {Array[]} A list of matches of the regex
*/
function matchAll(string, pattern) {
    const matches = [];
    let match;

    while ((match = pattern.exec(string))) {
        matches.push(match);
    }

    return matches;
}

module.exports = {
    meta: {
        docs: {
            description: "disallow unnecessary escape characters",
            category: "Best Practices",
            recommended: false
        },

        schema: []
    },

    create(context) {
        const sourceCode = context.getSourceCode();

        /**
         * Reports a node
         * @param {ASTNode} node The node to report
         * @param {number} startOffset The backslash's offset from the start of the node
         * @param {string} character The uselessly escaped character (not including the backslash)
         * @returns {void}
         */
        function report(node, startOffset, character) {
            context.report({
                node,
                loc: astUtils.getLocationFromRangeIndex(sourceCode, astUtils.getRangeIndexFromLocation(sourceCode, node.loc.start) + startOffset),
                message: "Unnecessary escape character: \\{{character}}.",
                data: { character }
            });
        }

        /**
         * Checks if the escape character in given string slice is unnecessary.
         *
         * @private
         * @param {ASTNode} node - node to validate.
         * @param {string} match - string slice to validate.
         * @returns {void}
         */
        function validateString(node, match) {
            const isTemplateElement = node.type === "TemplateElement";
            const escapedChar = match[0][1];
            let isUnnecessaryEscape = !VALID_STRING_ESCAPES.has(escapedChar);
            let isQuoteEscape;

            if (isTemplateElement) {
                isQuoteEscape = escapedChar === "`";

                if (escapedChar === "$") {

                    // Warn if `\$` is not followed by `{`
                    isUnnecessaryEscape = match.input[match.index + 2] !== "{";
                } else if (escapedChar === "{") {

                    /* Warn if `\{` is not preceded by `$`. If preceded by `$`, escaping
                     * is necessary and the rule should not warn. If preceded by `/$`, the rule
                     * will warn for the `/$` instead, as it is the first unnecessarily escaped character.
                     */
                    isUnnecessaryEscape = match.input[match.index - 1] !== "$";
                }
            } else {
                isQuoteEscape = escapedChar === node.raw[0];
            }

            if (isUnnecessaryEscape && !isQuoteEscape) {
                report(node, match.index + 1, match[0].slice(1));
            }
        }

        /**
         * Checks if a node has an escape.
         *
         * @param {ASTNode} node - node to check.
         * @returns {void}
         */
        function check(node) {
            const isTemplateElement = node.type === "TemplateElement";

            if (isTemplateElement && node.parent && node.parent.parent && node.parent.parent.type === "TaggedTemplateExpression") {

                // Don't report tagged template literals, because the backslash character is accessible to the tag function.
                return;
            }

            if (typeof node.value === "string" || isTemplateElement) {

                /*
                 * JSXAttribute doesn't have any escape sequence: https://facebook.github.io/jsx/.
                 * In addition, backticks are not supported by JSX yet: https://github.com/facebook/jsx/issues/25.
                 */
                if (node.parent.type === "JSXAttribute" || node.parent.type === "JSXElement") {
                    return;
                }

                matchAll(isTemplateElement ? node.value.raw : node.raw.slice(1, -1), /\\[^\d]/g)
                    .forEach(match => validateString(node, match));
            } else if (node.regex) {
                const parsedRegExp = parseRegExp(node.regex.pattern);
                const specialAllowedEscapes = new WeakSet();

                parsedRegExp

                    // Don't report '-' if it's in the middle of a character class.
                    .filter((charInfo, index) => charInfo.text === "-" && charInfo.inCharClass && !startsCharClass(parsedRegExp, index) && !endsCharClass(parsedRegExp, index))
                    .forEach(charInfo => specialAllowedEscapes.add(charInfo));

                parsedRegExp

                    // Don't report '^' if it's at the start of a character class. (It is already considered legal outside of a character class.)
                    .filter((charInfo, index) => charInfo.text === "^" && startsCharClass(parsedRegExp, index))
                    .forEach(charInfo => specialAllowedEscapes.add(charInfo));

                // Detect quantifier groups such as `a{1,2}`
                matchAll(parsedRegExp.map(charInfo => charInfo.text).join(""), /{\d+(,\d*)?}/g)
                    .filter(match => !parsedRegExp[match.index].inCharClass)
                    .forEach(match => {

                        // Always allow the { to be escaped. If the { is not escaped, allow the } to be escaped.
                        specialAllowedEscapes.add(parsedRegExp[match.index]);
                        if (!parsedRegExp[match.index].escaped) {
                            specialAllowedEscapes.add(parsedRegExp[match.index + match[0].length - 1]);
                        }
                    });

                parsedRegExp

                    // Filter out characters that aren't escaped.
                    .filter(charInfo => charInfo.escaped)

                    // Filter out characters that are determined to be allowed in special cases
                    .filter(charInfo => !specialAllowedEscapes.has(charInfo))

                    // Filter out characters that are valid to escape, based on their position in the regular expression.
                    .filter(charInfo => !(charInfo.inCharClass ? REGEX_CHARCLASS_ESCAPES : REGEX_NON_CHARCLASS_ESCAPES).has(charInfo.text))

                    // Report all the remaining characters.
                    .forEach(charInfo => report(node, charInfo.index, charInfo.text));
            }

        }

        return {
            Literal: check,
            TemplateElement: check
        };
    }
};
