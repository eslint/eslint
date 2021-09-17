/**
 * @fileoverview Rule to disallow use of the `RegExp` constructor in favor of regular expression literals
 * @author Milos Djermanovic
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");
const { CALL, CONSTRUCT, ReferenceTracker, findVariable, getStaticValue } = require("eslint-utils");
const { validateRegExpLiteral } = require("regexpp");
const { canTokensBeAdjacent } = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

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
    "await",
    "yield",
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
    "throw",
    "of",
    ")"
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

        fixable: "code",

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
         * @param {Scope} [scope] The scope
         * @returns {string} The value of the node.
         */
        function getStringValue(node, scope) {
            const result = getStaticValue(node, scope);

            if (result && typeof result.value === "string") {
                return result.value;
            }
            return null;
        }

        /**
         * Determines whether the arguments of the given node indicate that a regex literal is unnecessarily wrapped.
         * @param {ASTNode} node Node to check.
         * @param {Scope} scope The scope passed to getStringValue
         * @returns {boolean} True if the node already contains a regex literal argument.
         */
        function isUnnecessarilyWrappedRegexLiteral(node, scope) {
            const args = node.arguments;

            if (args.length === 1 && isRegexLiteral(args[0])) {
                return true;
            }

            if (args.length === 2 && isRegexLiteral(args[0]) && getStringValue(args[1], scope)) {
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
            if (ecmaVersion === 3 || ecmaVersion === 5) {
                return 5;
            }
            return ecmaVersion + 2009;
        }

        /**
         * Ensures that String is the only variable present in all child scopes
         * @param {Scope} scope The scope to go within and remove variables from
         * @param {boolean} [children] Whether to iterate over children or not and if false iterate through parents
         * @returns {Scope} The newer scope with only String present
         */
        function noStringScope(scope, children = true) {
            scope.variables.filter(variable => variable.name !== "String").forEach(definedVariable => scope.set.delete(definedVariable.name));
            if (children) {
                for (const childScopeIndex in scope.childScopes) {
                    if (!isNaN(+childScopeIndex)) {
                        scope.childScopes[childScopeIndex] = noStringScope(scope.childScopes[childScopeIndex]);
                    }
                }
                if (scope.childScopes.length === 0 && scope.upper) {
                    scope.upper = noStringScope(scope.upper, false);
                }
            } else if (scope.upper) {
                scope.upper = noStringScope(scope.upper, false);
            }
            return scope;
        }

        return {
            Program() {
                let scope = context.getScope();

                const tracker = new ReferenceTracker(scope);
                const traceMap = {
                    RegExp: {
                        [CALL]: true,
                        [CONSTRUCT]: true
                    }
                };

                for (const { node } of tracker.iterateGlobalReferences(traceMap)) {
                    scope = noStringScope(scope);

                    if (disallowRedundantWrapping && isUnnecessarilyWrappedRegexLiteral(node, scope)) {
                        if (node.arguments.length === 2) {
                            context.report({
                                node,
                                messageId: "unexpectedRedundantRegExpWithFlags",
                                // eslint-disable-next-line no-loop-func -- scope value won't change
                                fix(fixer) {
                                    return fixer.replaceTextRange(node.range, node.arguments[0].raw + getStringValue(node.arguments[1], scope));
                                }
                            });
                        } else {
                            context.report({
                                node,
                                messageId: "unexpectedRedundantRegExp",
                                fix(fixer) {
                                    return fixer.replaceTextRange(node.range, node.arguments[0].raw);
                                }
                            });
                        }
                    } else if (
                        (getStringValue(node.arguments[0], scope) !== null) &&
                        (!node.arguments[1] || getStringValue(node.arguments[1], scope) !== null) &&
                        (node.arguments.length === 1 || node.arguments.length === 2)
                    ) {
                        let regexContent = getStringValue(node.arguments[0], scope);

                        if (regexContent && !isStringRawTaggedStaticTemplateLiteral(node.arguments[0])) {
                            regexContent = regexContent.replace(/\r/gu, "\\r").replace(/\n/gu, "\\n").replace(/\t/gu, "\\t").replace(/\f/gu, "\\f").replace(/\v/gu, "\\v");
                        }

                        const newRegExpValue = `/${regexContent || "(?:)"}/${getStringValue(node.arguments[1], scope) || ""}`;

                        let noFix = false;

                        try {
                            validateRegExpLiteral(
                                newRegExpValue,
                                { ecmaVersion: getRegexppEcmaVersion(context.parserOptions.ecmaVersion) }
                            );
                        } catch {
                            noFix = true;
                        }

                        const tokenBefore = sourceCode.getTokenBefore(node);

                        if (tokenBefore && !validPrecedingTokens.includes(tokenBefore.value)) {
                            noFix = true;
                        }

                        context.report({
                            node,
                            messageId: "unexpectedRegExp",
                            ...(noFix ? {} : {
                                fix(fixer) {
                                    const tokenAfter = sourceCode.getTokenAfter(node);

                                    return fixer.replaceTextRange(
                                        node.range,
                                        (tokenBefore && !canTokensBeAdjacent(tokenBefore, newRegExpValue) && /\S/u.test(text[node.range[0] - 1]) ? " " : "") +
                                            newRegExpValue +
                                            (tokenAfter && !canTokensBeAdjacent(newRegExpValue, tokenAfter) && /\S/u.test(text[node.range[1]]) ? " " : "")
                                    );
                                }
                            })
                        });
                    }
                }
            }
        };
    }
};
