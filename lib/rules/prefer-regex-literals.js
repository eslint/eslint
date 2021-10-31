/**
 * @fileoverview Rule to disallow use of the `RegExp` constructor in favor of regular expression literals
 * @author Milos Djermanovic
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");
const { CALL, CONSTRUCT, ReferenceTracker, findVariable } = require("eslint-utils");
const { RegExpValidator, visitRegExpAST, RegExpParser } = require("regexpp");
const { canTokensBeAdjacent } = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Determines whether the given node is a string literal.
 * @param {ASTNode} node Node to check.
 * @returns {boolean} True if the node is a string literal.
 */
function isStringLiteral(node) {
    return node.type === "Literal" && typeof node.value === "string";
}

/**
 * Determines whether the given node is a regex literal.
 * @param {ASTNode} node Node to check.
 * @returns {boolean} True if the node is a regex literal.
 */
function isRegexLiteral(node) {
    return node.type === "Literal" && Object.prototype.hasOwnProperty.call(node, "regex");
}

/**
 * Determines whether the given node is a template literal without expressions.
 * @param {ASTNode} node Node to check.
 * @returns {boolean} True if the node is a template literal without expressions.
 */
function isStaticTemplateLiteral(node) {
    return node.type === "TemplateLiteral" && node.expressions.length === 0;
}

const validPrecedingTokens = [
    "(",
    ";",
    "[",
    ",",
    "=",
    "+",
    "*",
    "-",
    "?",
    "~",
    "%",
    "**",
    "!",
    "typeof",
    "instanceof",
    "&&",
    "||",
    "??",
    "return",
    "...",
    "delete",
    "void",
    "in",
    "<",
    ">",
    "<=",
    ">=",
    "==",
    "===",
    "!=",
    "!==",
    "<<",
    ">>",
    ">>>",
    "&",
    "|",
    "^",
    ":",
    "{",
    "=>",
    "*=",
    "<<=",
    ">>=",
    ">>>=",
    "^=",
    "|=",
    "&=",
    "??=",
    "||=",
    "&&=",
    "**=",
    "+=",
    "-=",
    "/=",
    "%=",
    "/",
    "do",
    "break",
    "continue",
    "debugger",
    "case",
    "throw"
];


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow use of the `RegExp` constructor in favor of regular expression literals",
            recommended: false,
            url: "https://eslint.org/docs/rules/prefer-regex-literals"
        },

        hasSuggestions: true,

        schema: [
            {
                type: "object",
                properties: {
                    disallowRedundantWrapping: {
                        type: "boolean",
                        default: false
                    }
                },
                additionalProperties: false
            }
        ],

        messages: {
            unexpectedRegExp: "Use a regular expression literal instead of the 'RegExp' constructor.",
            unexpectedRedundantRegExp: "Regular expression literal is unnecessarily wrapped within a 'RegExp' constructor.",
            unexpectedRedundantRegExpWithFlags: "Use regular expression literal with flags instead of the 'RegExp' constructor."
        }
    },

    create(context) {
        const [{ disallowRedundantWrapping = false } = {}] = context.options;
        const sourceCode = context.getSourceCode();
        const text = sourceCode.getText();

        /**
         * Determines whether the given identifier node is a reference to a global variable.
         * @param {ASTNode} node `Identifier` node to check.
         * @returns {boolean} True if the identifier is a reference to a global variable.
         */
        function isGlobalReference(node) {
            const scope = context.getScope();
            const variable = findVariable(scope, node);

            return variable !== null && variable.scope.type === "global" && variable.defs.length === 0;
        }

        /**
         * Determines whether the given node is a String.raw`` tagged template expression
         * with a static template literal.
         * @param {ASTNode} node Node to check.
         * @returns {boolean} True if the node is String.raw`` with a static template.
         */
        function isStringRawTaggedStaticTemplateLiteral(node) {
            return node.type === "TaggedTemplateExpression" &&
                astUtils.isSpecificMemberAccess(node.tag, "String", "raw") &&
                isGlobalReference(astUtils.skipChainExpression(node.tag).object) &&
                isStaticTemplateLiteral(node.quasi);
        }

        /**
         * Gets the value of a string
         * @param {ASTNode} node The node to get the string of.
         * @returns {string|null} The value of the node.
         */
        function getStringValue(node) {
            if (isStringLiteral(node)) {
                return node.value;
            }

            if (isStaticTemplateLiteral(node)) {
                return node.quasis[0].value.cooked;
            }

            if (isStringRawTaggedStaticTemplateLiteral(node)) {
                return node.quasi.quasis[0].value.raw;
            }

            return null;
        }

        /**
         * Determines whether the given node is considered to be a static string by the logic of this rule.
         * @param {ASTNode} node Node to check.
         * @returns {boolean} True if the node is a static string.
         */
        function isStaticString(node) {
            return isStringLiteral(node) ||
                isStaticTemplateLiteral(node) ||
                isStringRawTaggedStaticTemplateLiteral(node);
        }

        /**
         * Determines whether the relevant arguments of the given are all static string literals.
         * @param {ASTNode} node Node to check.
         * @returns {boolean} True if all arguments are static strings.
         */
        function hasOnlyStaticStringArguments(node) {
            const args = node.arguments;

            if ((args.length === 1 || args.length === 2) && args.every(isStaticString)) {
                return true;
            }

            return false;
        }

        /**
         * Determines whether the arguments of the given node indicate that a regex literal is unnecessarily wrapped.
         * @param {ASTNode} node Node to check.
         * @returns {boolean} True if the node already contains a regex literal argument.
         */
        function isUnnecessarilyWrappedRegexLiteral(node) {
            const args = node.arguments;

            if (args.length === 1 && isRegexLiteral(args[0])) {
                return true;
            }

            if (args.length === 2 && isRegexLiteral(args[0]) && isStaticString(args[1])) {
                return true;
            }

            return false;
        }

        /* eslint-disable jsdoc/valid-types -- eslint-plugin-jsdoc's type parser doesn't support square brackets */
        /**
         * Returns a ecmaVersion compatible for regexpp.
         * @param {import("../linter/linter").ParserOptions["ecmaVersion"]} ecmaVersion The ecmaVersion to convert.
         * @returns {import("regexpp/ecma-versions").EcmaVersion} The resulting ecmaVersion compatible for regexpp.
         */
        function getRegexppEcmaVersion(ecmaVersion) {
            /* eslint-enable jsdoc/valid-types -- JSDoc is over, enable jsdoc/valid-types again */
            if (!ecmaVersion || ecmaVersion > 13 || ecmaVersion === 3 || ecmaVersion === 5) {
                return 5;
            }
            return ecmaVersion + 2009;
        }

        /**
         * Makes a character escaped or else returns null.
         * @param {string} character The character to escape.
         * @returns {string} The resulting escaped character.
         */
        function resolveEscapes(character) {
            switch (character) {
                case "\n":
                    return "\\n";

                case "\r":
                    return "\\r";

                case "\t":
                    return "\\t";

                case "\v":
                    return "\\v";

                case "\f":
                    return "\\f";

                case "/":
                    return "\\/";

                default:
                    return null;
            }
        }

        return {
            Program() {
                const scope = context.getScope();
                const tracker = new ReferenceTracker(scope);
                const traceMap = {
                    RegExp: {
                        [CALL]: true,
                        [CONSTRUCT]: true
                    }
                };

                for (const { node } of tracker.iterateGlobalReferences(traceMap)) {
                    if (disallowRedundantWrapping && isUnnecessarilyWrappedRegexLiteral(node)) {
                        if (node.arguments.length === 2) {
                            context.report({ node, messageId: "unexpectedRedundantRegExpWithFlags" });
                        } else {
                            context.report({ node, messageId: "unexpectedRedundantRegExp" });
                        }
                    } else if (hasOnlyStaticStringArguments(node)) {
                        let regexContent = getStringValue(node.arguments[0]);
                        let noFix = false;
                        let flags;

                        if (node.arguments[1]) {
                            flags = getStringValue(node.arguments[1]);
                        }

                        const regexppEcmaVersion = getRegexppEcmaVersion(context.parserOptions.ecmaVersion);
                        const RegExpValidatorInstance = new RegExpValidator({ ecmaVersion: regexppEcmaVersion });

                        try {
                            RegExpValidatorInstance.validatePattern(regexContent, 0, regexContent.length, flags ? flags.includes("u") : false);
                            if (flags) {
                                RegExpValidatorInstance.validateFlags(flags);
                            }
                        } catch {
                            noFix = true;
                        }

                        const tokenBefore = sourceCode.getTokenBefore(node);

                        if (tokenBefore && !validPrecedingTokens.includes(tokenBefore.value)) {
                            noFix = true;
                        }

                        if (!/^[-a-zA-Z0-9\\[\](){}\s!@#$%^&*+^_=/~`.><?,'"|:;]*$/u.test(regexContent)) {
                            noFix = true;
                        }

                        if (regexContent && !noFix) {
                            let charIncrease = 0;

                            const ast = new RegExpParser({ ecmaVersion: regexppEcmaVersion }).parsePattern(regexContent, 0, regexContent.length, flags ? flags.includes("u") : false);

                            visitRegExpAST(ast, {
                                onCharacterEnter(characterNode) {
                                    let changeCharIncrease = 0;
                                    let stringCodePointValue = String.fromCodePoint(characterNode.value);
                                    const escaped = resolveEscapes(stringCodePointValue);

                                    if (escaped) {
                                        stringCodePointValue = escaped;
                                        changeCharIncrease = characterNode.raw.length !== 1 ? 0 : 1;
                                    }

                                    regexContent =
                                            regexContent.slice(0, characterNode.start + charIncrease) +
                                            (escaped ? stringCodePointValue : characterNode.raw) +
                                            regexContent.slice(characterNode.end + charIncrease);

                                    if (changeCharIncrease !== 0) {
                                        charIncrease += changeCharIncrease;
                                    }
                                }
                            });
                        }

                        const newRegExpValue = `/${regexContent || "(?:)"}/${flags || ""}`;

                        context.report({
                            node,
                            messageId: "unexpectedRegExp",
                            suggest: noFix ? [] : [{
                                messageId: "unexpectedRegExp",
                                fix(fixer) {
                                    const tokenAfter = sourceCode.getTokenAfter(node);

                                    return fixer.replaceTextRange(
                                        node.range,
                                        (tokenBefore && !canTokensBeAdjacent(tokenBefore, newRegExpValue) && /\S/u.test(text[node.range[0] - 1]) ? " " : "") +
                                            newRegExpValue +
                                            (tokenAfter && !canTokensBeAdjacent(newRegExpValue, tokenAfter) && /\S/u.test(text[node.range[1]]) ? " " : "")
                                    );
                                }
                            }]
                        });
                    }
                }
            }
        };
    }
};
