/**
 * @fileoverview Look for useless escapes in strings and regexes
 * @author Onur Temizkan
 */

"use strict";

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

const VALID_STRING_ESCAPES = [
    "\\",
    "n",
    "r",
    "v",
    "t",
    "b",
    "f",
    "u",
    "x",
    "\n",
    "\r"
];

const REGEX_GENERAL_ESCAPES = new Set([
    "\\",
    "/",
    "^",
    "b",
    "B",
    "c",
    "d",
    "D",
    "f",
    "n",
    "r",
    "s",
    "S",
    "t",
    "v",
    "w",
    "W",
    "x",
    "u"
]);
const REGEX_CHARCLASS_ESCAPES = union(REGEX_GENERAL_ESCAPES, new Set(["]"]));
const REGEX_NON_CHARCLASS_ESCAPES = union(REGEX_GENERAL_ESCAPES, new Set([
    ".",
    "$",
    "*",
    "+",
    "?",
    "[",
    "{",
    "}",
    "|",
    "(",
    ")",
]));

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
*   {text: 'a', index: 0, escaped: false, charClass: false},
*   {text: 'b', index: 2, escaped: true, charClass: false},
*   {text: 'c', index: 4, escaped: false, charClass: true},
*   {text: 'd', index: 5, escaped: false, charClass: true},
*   {text: '-', index: 6, escaped: false, charClass: true}
* ]
*/
function parseRegExp(regExpText) {
    return regExpText.split("").reduce((state, char, index) => {
        if (!state.escapeNextChar) {
            if (char === "\\") {
                return Object.assign({}, state, {escapeNextChar: true, index});
            }
            if (char === "[" && !state.inCharClass) {
                return Object.assign({}, state, {inCharClass: true, index});
            }
            if (char === "]" && state.inCharClass) {
                return Object.assign({}, state, {inCharClass: false, index});
            }
        }
        return {
            charList: state.charList.concat({text: char, escaped: state.escapeNextChar, inCharClass: state.inCharClass, index}),
            escapeNextChar: false,
            inCharClass: state.inCharClass
        };
    }, {charList: [], escapeNextChar: false, inCharClass: false}).charList;
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
                loc: {
                    line: node.loc.start.line,
                    column: node.loc.start.column + startOffset
                },
                message: "Unnecessary escape character: \\{{character}}.",
                data: {character}
            });
        }

        /**
         * Checks if the escape character in given string slice is unnecessary.
         *
         * @private
         * @param {string[]} escapes - list of valid escapes
         * @param {ASTNode} node - node to validate.
         * @param {string} match - string slice to validate.
         * @returns {void}
         */
        function validateString(escapes, node, match) {
            const isTemplateElement = node.type === "TemplateElement";
            const escapedChar = match[0][1];
            let isUnnecessaryEscape = escapes.indexOf(escapedChar) === -1;
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
                report(node, match.index, match[0].slice(1));
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
            const value = isTemplateElement ? node.value.raw : node.raw;
            const pattern = /\\[^\d]/g;

            if (isTemplateElement && node.parent && node.parent.parent && node.parent.parent.type === "TaggedTemplateExpression") {

                // Don't report tagged template literals, because the backslash character is accessible to the tag function.
                return;
            }

            if (typeof node.value === "string" || isTemplateElement) {

                /*
                 * JSXAttribute doesn't have any escape sequence: https://facebook.github.io/jsx/.
                 * In addition, backticks are not supported by JSX yet: https://github.com/facebook/jsx/issues/25.
                 */
                if (node.parent.type === "JSXAttribute") {
                    return;
                }

                let match;

                while ((match = pattern.exec(value))) {
                    validateString(VALID_STRING_ESCAPES, node, match);
                }
            } else if (node.regex) {
                parseRegExp(node.regex.pattern)

                    /*
                     * The '-' character is a special case, because it's only valid to escape it if it's in a character
                     * class, and is not at either edge of the character class. To account for this, don't consider '-'
                     * characters to be valid in general, and filter out '-' characters that appear in the middle of a
                     * character class.
                     */
                    .filter((charInfo, index, array) => charInfo.text !== "-" || !charInfo.inCharClass || index === 0 || index === array.length - 1 || !array[index - 1].inCharClass || !array[index + 1].inCharClass)

                    // Filter out characters that aren't escaped.
                    .filter(charInfo => charInfo.escaped)

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
