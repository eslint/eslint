/**
 * @fileoverview A rule to choose between single and double quote marks
 * @author Matt DuVall <http://www.mattduvall.com/>, Brandon Payton
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

const QUOTE_SETTINGS = {
    double: {
        quote: "\"",
        alternateQuote: "'",
        description: "doublequote"
    },
    single: {
        quote: "'",
        alternateQuote: "\"",
        description: "singlequote"
    },
    backtick: {
        quote: "`",
        alternateQuote: "\"",
        description: "backtick"
    }
};

// An unescaped newline is a newline preceded by an even number of backslashes.
const UNESCAPED_LINEBREAK_PATTERN = new RegExp(String.raw`(^|[^\\])(\\\\)*[${Array.from(astUtils.LINEBREAKS).join("")}]`, "u");

/**
 * Switches quoting of javascript string between ' " and `
 * escaping and unescaping as necessary.
 * Only escaping of the minimal set of characters is changed.
 * Note: escaping of newlines when switching from backtick to other quotes is not handled.
 * @param {string} str A string to convert.
 * @returns {string} The string with changed quotes.
 * @private
 */
QUOTE_SETTINGS.double.convert =
QUOTE_SETTINGS.single.convert =
QUOTE_SETTINGS.backtick.convert = function(str) {
    const newQuote = this.quote;
    const oldQuote = str[0];

    if (newQuote === oldQuote) {
        return str;
    }
    return newQuote + str.slice(1, -1).replace(/\\(\$\{|\r\n?|\n|.)|["'`]|\$\{|(\r\n?|\n)/gu, (match, escaped, newline) => {
        if (escaped === oldQuote || oldQuote === "`" && escaped === "${") {
            return escaped; // unescape
        }
        if (match === newQuote || newQuote === "`" && match === "${") {
            return `\\${match}`; // escape
        }
        if (newline && oldQuote === "`") {
            return "\\n"; // escape newlines
        }
        return match;
    }) + newQuote;
};

/**
 * Normalize options from old syntax to new syntax
 * @param {Array} options context.options
 * @returns {Array} new syntax options
 * @private
 */
function normalizeOptions(options) {
    const [firstOption, secondOption] = options;
    const newOptions = {};

    if (typeof firstOption === "object") {
        return options;
    }

    if (typeof firstOption === "string") {
        newOptions.precedence = [firstOption];
    }

    if (
        (typeof secondOption === "string" && secondOption === "avoid-escape") ||
     (typeof secondOption === "object" && secondOption.avoidEscape)
    ) {
        newOptions.avoidEscape = true;
    }

    if (typeof secondOption === "object" && secondOption.allowTemplateLiterals) {
        newOptions.precedence.push("backtick");
    }

    return [newOptions];
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "layout",

        docs: {
            description: "enforce the consistent use of either backticks, double, or single quotes",
            recommended: false,
            url: "https://eslint.org/docs/rules/quotes"
        },

        fixable: "code",
        schema: [
            {
                anyOf: [
                    {
                        enum: ["single", "double", "backtick"]
                    },
                    {
                        type: "object",
                        properties: {
                            precedence: {
                                type: "array",
                                minItems: 1,
                                items: {
                                    enum: ["single", "double", "backtick"]
                                }
                            },
                            avoidEscape: {
                                type: "boolean"
                            }
                        }
                    }
                ]
            },
            {
                anyOf: [
                    {
                        enum: ["avoid-escape"]
                    },
                    {
                        type: "object",
                        properties: {
                            avoidEscape: {
                                type: "boolean"
                            },
                            allowTemplateLiterals: {
                                type: "boolean"
                            }
                        },
                        additionalProperties: false
                    }
                ]
            }
        ],
        messages: {
            wrongQuotes: "Strings must use {{description}}."
        }
    },

    create(context) {

        // TODO: remove support for old syntax in v9
        const newSyntaxOptions = normalizeOptions(context.options);

        const quoteOption = newSyntaxOptions[0] && newSyntaxOptions[0].precedence || ["double"],
            settings = QUOTE_SETTINGS[quoteOption[0]],
            options = newSyntaxOptions[0],
            avoidEscape = options && options.avoidEscape === true,
            sourceCode = context.getSourceCode();

        /**
         * Determines if a given node is part of JSX syntax.
         *
         * This function returns `true` in the following cases:
         *
         * - `<div className="foo"></div>` ... If the literal is an attribute value, the parent of the literal is `JSXAttribute`.
         * - `<div>foo</div>` ... If the literal is a text content, the parent of the literal is `JSXElement`.
         * - `<>foo</>` ... If the literal is a text content, the parent of the literal is `JSXFragment`.
         *
         * In particular, this function returns `false` in the following cases:
         *
         * - `<div className={"foo"}></div>`
         * - `<div>{"foo"}</div>`
         *
         * In both cases, inside of the braces is handled as normal JavaScript.
         * The braces are `JSXExpressionContainer` nodes.
         * @param {ASTNode} node The Literal node to check.
         * @returns {boolean} True if the node is a part of JSX, false if not.
         * @private
         */
        function isJSXLiteral(node) {
            return node.parent.type === "JSXAttribute" || node.parent.type === "JSXElement" || node.parent.type === "JSXFragment";
        }

        /**
         * Checks whether or not a given node is a directive.
         * The directive is a `ExpressionStatement` which has only a string literal.
         * @param {ASTNode} node A node to check.
         * @returns {boolean} Whether or not the node is a directive.
         * @private
         */
        function isDirective(node) {
            return (
                node.type === "ExpressionStatement" &&
                node.expression.type === "Literal" &&
                typeof node.expression.value === "string"
            );
        }

        /**
         * Checks whether or not a given node is a part of directive prologues.
         * See also: http://www.ecma-international.org/ecma-262/6.0/#sec-directive-prologues-and-the-use-strict-directive
         * @param {ASTNode} node A node to check.
         * @returns {boolean} Whether or not the node is a part of directive prologues.
         * @private
         */
        function isPartOfDirectivePrologue(node) {
            const block = node.parent.parent;

            if (block.type !== "Program" && (block.type !== "BlockStatement" || !astUtils.isFunction(block.parent))) {
                return false;
            }

            // Check the node is at a prologue.
            for (let i = 0; i < block.body.length; ++i) {
                const statement = block.body[i];

                if (statement === node.parent) {
                    return true;
                }
                if (!isDirective(statement)) {
                    break;
                }
            }

            return false;
        }

        /**
         * Checks whether or not a given node is allowed as non backtick.
         * @param {ASTNode} node A node to check.
         * @returns {boolean} Whether or not the node is allowed as non backtick.
         * @private
         */
        function isAllowedAsNonBacktick(node) {
            const parent = node.parent;

            switch (parent.type) {

                // Directive Prologues.
                case "ExpressionStatement":
                    return isPartOfDirectivePrologue(node);

                // LiteralPropertyName.
                case "Property":
                case "PropertyDefinition":
                case "MethodDefinition":
                    return parent.key === node && !parent.computed;

                // ModuleSpecifier.
                case "ImportDeclaration":
                case "ExportNamedDeclaration":
                case "ExportAllDeclaration":
                    return parent.source === node;

                // Others don't allow.
                default:
                    return false;
            }
        }

        /**
         * Checks whether or not a given TemplateLiteral node is actually using any of the special features provided by template literal strings.
         * @param {ASTNode} node A TemplateLiteral node to check.
         * @returns {boolean} Whether or not the TemplateLiteral node is using any of the special features provided by template literal strings.
         * @private
         */
        function isUsingFeatureOfTemplateLiteral(node) {
            const hasTag = node.parent.type === "TaggedTemplateExpression" && node === node.parent.quasi;

            if (hasTag) {
                return true;
            }

            const hasStringInterpolation = node.expressions.length > 0;

            if (hasStringInterpolation) {
                return true;
            }

            const isMultilineString = node.quasis.length >= 1 && UNESCAPED_LINEBREAK_PATTERN.test(node.quasis[0].value.raw);

            if (isMultilineString) {
                return true;
            }

            return false;
        }

        return {

            Literal(node) {
                const val = node.value,
                    rawVal = node.raw;

                if (settings && typeof val === "string") {
                    let isValid = (quoteOption.includes("backtick") && isAllowedAsNonBacktick(node)) ||
                        isJSXLiteral(node) ||
                        astUtils.isSurroundedBy(rawVal, settings.quote);

                    if (!isValid && avoidEscape) {
                        isValid = astUtils.isSurroundedBy(rawVal, settings.alternateQuote) && rawVal.indexOf(settings.quote) >= 0;
                    }

                    if (!isValid) {
                        context.report({
                            node,
                            messageId: "wrongQuotes",
                            data: {
                                description: settings.description
                            },
                            fix(fixer) {
                                if (quoteOption.includes("backtick") && astUtils.hasOctalOrNonOctalDecimalEscapeSequence(rawVal)) {

                                    /*
                                     * An octal or non-octal decimal escape sequence in a template literal would
                                     * produce syntax error, even in non-strict mode.
                                     */
                                    return null;
                                }

                                return fixer.replaceText(node, settings.convert(node.raw));
                            }
                        });
                    }
                }
            },

            TemplateLiteral(node) {

                // Don't throw an error if backticks are expected or a template literal feature is in use.
                if (
                    quoteOption.includes("backtick") ||
                    isUsingFeatureOfTemplateLiteral(node)
                ) {
                    return;
                }

                context.report({
                    node,
                    messageId: "wrongQuotes",
                    data: {
                        description: settings.description
                    },
                    fix(fixer) {
                        if (isPartOfDirectivePrologue(node)) {

                            /*
                             * TemplateLiterals in a directive prologue aren't actually directives, but if they're
                             * in the directive prologue, then fixing them might turn them into directives and change
                             * the behavior of the code.
                             */
                            return null;
                        }
                        return fixer.replaceText(node, settings.convert(sourceCode.getText(node)));
                    }
                });
            }
        };

    }
};
