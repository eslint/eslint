/**
 * @fileoverview Rule to count multiple spaces in regular expressions
 * @author Matt DuVall <http://www.mattduvall.com/>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");
const regexpp = require("regexpp");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const regExpParser = new regexpp.RegExpParser();

/**
 * Check if node is a string
 * @param {ASTNode} node node to evaluate
 * @returns {boolean} True if its a string
 * @private
 */
function isString(node) {
    return node && node.type === "Literal" && typeof node.value === "string";
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow multiple spaces in regular expressions",
            category: "Possible Errors",
            recommended: true,
            url: "https://eslint.org/docs/rules/no-regex-spaces"
        },

        schema: [],
        fixable: "code"
    },

    create(context) {

        /**
         * Validate regular expression
         *
         * @param {ASTNode} nodeToReport Node to report.
         * @param {string} pattern Regular expression pattern to validate.
         * @param {string} rawPattern Raw representation of the pattern in the source code.
         * @param {number} rawPatternStartRange Start range of the pattern in the source code.
         * @param {string} flags Regular expression flags.
         * @returns {void}
         * @private
         */
        function checkRegex(nodeToReport, pattern, rawPattern, rawPatternStartRange, flags) {

            // Skip if there are no consecutive spaces in the source code
            if (!/ {2}/u.test(rawPattern)) {
                return;
            }

            let ast;

            try {
                ast = regExpParser.parsePattern(pattern, 0, pattern.length, flags.includes("u"));
            } catch (e) {

                // Ignore regular expressions with syntax errors
                return;
            }

            const spaces = [];

            regexpp.visitRegExpAST(ast, {
                onCharacterEnter(character) {
                    if (
                        character.parent.type === "Alternative" &&
                        (character.raw === " " || character.raw === "\\ ")
                    ) {
                        spaces.push(character);
                    }
                }
            });

            for (let i = 0; i < spaces.length - 1; i++) {
                let j = i;

                while (
                    j < spaces.length - 1 &&
                    spaces[j].end === spaces[j + 1].start &&
                    spaces[j + 1].raw === " "
                ) {
                    j++;
                }

                if (j > i) {
                    const count = j - i + 1;

                    context.report({
                        node: nodeToReport,
                        message: "Spaces are hard to count. Use {{{count}}}.",
                        data: { count },
                        fix(fixer) {
                            if (pattern !== rawPattern) {
                                return null;
                            }
                            return fixer.replaceTextRange(
                                [rawPatternStartRange + spaces[i + 1].start, rawPatternStartRange + spaces[j].end],
                                `{${count}}`
                            );
                        }
                    });

                    // Report only the first occurence of consecutive spaces
                    return;
                }
            }

            /*
             * TODO: (platinumazure) Fix message to use rule message
             * substitution when api.report is fixed in lib/eslint.js.
             */
        }

        /**
         * Validate regular expression literals
         * @param {ASTNode} node node to validate
         * @returns {void}
         * @private
         */
        function checkLiteral(node) {
            if (node.regex) {
                const pattern = node.regex.pattern;
                const rawPattern = node.raw.slice(1, node.raw.lastIndexOf("/"));
                const rawPatternStartRange = node.range[0] + 1;
                const flags = node.regex.flags;

                checkRegex(
                    node,
                    pattern,
                    rawPattern,
                    rawPatternStartRange,
                    flags
                );
            }
        }

        /**
         * Validate strings passed to the RegExp constructor
         * @param {ASTNode} node node to validate
         * @returns {void}
         * @private
         */
        function checkFunction(node) {
            const scope = context.getScope();
            const regExpVar = astUtils.getVariableByName(scope, "RegExp");
            const shadowed = regExpVar && regExpVar.defs.length > 0;
            const patternNode = node.arguments[0];
            const flagsNode = node.arguments[1];

            if (node.callee.type === "Identifier" && node.callee.name === "RegExp" && isString(patternNode) && !shadowed) {
                const pattern = patternNode.value;
                const rawPattern = patternNode.raw.slice(1, -1);
                const rawPatternStartRange = patternNode.range[0] + 1;
                const flags = isString(flagsNode) ? flagsNode.value : "";

                checkRegex(
                    node,
                    pattern,
                    rawPattern,
                    rawPatternStartRange,
                    flags
                );
            }
        }

        return {
            Literal: checkLiteral,
            CallExpression: checkFunction,
            NewExpression: checkFunction
        };
    }
};
