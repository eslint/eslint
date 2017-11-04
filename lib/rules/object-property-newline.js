/**
 * @fileoverview Rule to enforce placing object properties on separate lines.
 * @author Vitor Balocco
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce placing object properties on separate lines",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/object-property-newline"
        },

        schema: [
            {
                type: "object",
                properties: {
                    allowAllPropertiesOnSameLine: {
                        type: "boolean"
                    },
                    allowMultiplePropertiesPerLine: { // Deprecated
                        type: "boolean"
                    },
                    treatComputedPropertiesLikeJSCS: {
                        type: "boolean"
                    },
                    noCommaFirst: {
                        type: "boolean"
                    }
                },
                additionalProperties: false
            }
        ],

        fixable: "whitespace"
    },

    create(context) {
        const allowSameLine = context.options[0] && (
            Boolean(context.options[0].allowAllPropertiesOnSameLine) ||
            Boolean(context.options[0].allowMultiplePropertiesPerLine) // Deprecated
        );
        const allowOpenBracket = context.options[0] && Boolean(context.options[0].treatComputedPropertiesLikeJSCS);
        const denyCommaFirst = context.options[0] && Boolean(context.options[0].noCommaFirst);
        let errorMessage = allowSameLine
            ? "Object properties must go on a new line if they aren't all on the same line."
            : "Object properties must go on a new line.";

        if (allowOpenBracket) {
            errorMessage += " The opening bracket of a computed property name may end a line on which another property appears.";
        }

        if (denyCommaFirst) {
            errorMessage += " The comma delimiting two properties may not share a line with any of the second property.";
        }

        const sourceCode = context.getSourceCode();

        /**
         * Returns whether a property begins with a bracket that ends its line.
         * @param {token} myToken0 Current property’s first token.
         * @param {sourceCode} source Current property’s sourceCode.
         * @param {number} myLine Current property’s first token’s line.
         * @returns {boolean} Whether or not the property begins with a bracket that ends its line.
         */
        function validPerOpenBracket(myToken0, source, myLine) {
            return myToken0.type === "Punctuator" &&
                myToken0.value === "[" &&
                source.getTokenAfter(myToken0).loc.start.line > myLine;
        }

        /**
         * Returns whether a comma precedes a property on the same line.
         * @param {token} myToken0 Current property’s first token.
         * @param {sourceCode} source Current property’s sourceCode.
         * @param {number} myLine Current property’s first token’s line.
         * @returns {boolean} Whether or not a comma precedes the property on the same line.
         */
        function validPerLeadingComma(myToken0, source, myLine) {
            const tokenBeforeCurrentProperty = source.getTokenBefore(myToken0);

            return tokenBeforeCurrentProperty.type !== "Punctuator" ||
                tokenBeforeCurrentProperty.value !== "," ||
                tokenBeforeCurrentProperty.loc.end.line !== myLine;
        }

        return {
            ObjectExpression(node) {
                if (allowSameLine) {
                    if (node.properties.length > 1) {
                        const firstTokenOfFirstProperty = sourceCode.getFirstToken(node.properties[0]);
                        const lastTokenOfLastProperty = sourceCode.getLastToken(node.properties[node.properties.length - 1]);

                        if (firstTokenOfFirstProperty.loc.start.line === lastTokenOfLastProperty.loc.end.line) {

                            // All keys and values are on the same line
                            return;
                        }
                    }
                }

                for (let i = 1; i < node.properties.length; i++) {
                    const lastTokenOfPreviousProperty = sourceCode.getLastToken(node.properties[i - 1]),
                        firstTokenOfCurrentProperty = sourceCode.getFirstToken(node.properties[i]),
                        previousPropertyEndLine = lastTokenOfPreviousProperty.loc.end.line,
                        currentPropertyStartLine = firstTokenOfCurrentProperty.loc.start.line,
                        currentPropertyIsOnNewLine = previousPropertyEndLine < currentPropertyStartLine;
                    let currentPropertyIsValid;

                    if (!allowOpenBracket && !denyCommaFirst) {
                        currentPropertyIsValid = currentPropertyIsOnNewLine;
                    } else {

                        if (allowOpenBracket && !denyCommaFirst) {
                            currentPropertyIsValid =
                                currentPropertyIsOnNewLine ||
                                validPerOpenBracket(firstTokenOfCurrentProperty, sourceCode, currentPropertyStartLine);
                        } else if (!allowOpenBracket && denyCommaFirst) {
                            currentPropertyIsValid =
                                currentPropertyIsOnNewLine &&
                                validPerLeadingComma(firstTokenOfCurrentProperty, sourceCode, currentPropertyStartLine);
                        } else if (allowOpenBracket && denyCommaFirst) {

                            // A line containing only “, [” is valid here.
                            currentPropertyIsValid = validPerOpenBracket(firstTokenOfCurrentProperty, sourceCode, currentPropertyStartLine) || (
                                currentPropertyIsOnNewLine &&
                                validPerLeadingComma(firstTokenOfCurrentProperty, sourceCode, currentPropertyStartLine)
                            );
                        }
                    }

                    if (!currentPropertyIsValid) {
                        context.report({
                            node,
                            loc: firstTokenOfCurrentProperty.loc.start,
                            message: errorMessage,
                            fix(fixer) {
                                const comma = sourceCode.getTokenBefore(firstTokenOfCurrentProperty);
                                const rangeAfterComma = [comma.range[1], firstTokenOfCurrentProperty.range[0]];

                                // Don't perform a fix if there are any comments between the comma and the next property.
                                if (sourceCode.text.slice(rangeAfterComma[0], rangeAfterComma[1]).trim()) {
                                    return null;
                                }

                                return fixer.replaceTextRange(rangeAfterComma, "\n");
                            }
                        });
                    }
                }
            }
        };
    }
};
