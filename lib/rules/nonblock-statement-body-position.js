/**
 * @fileoverview enforce the location of single-line statements
 * @author Teddy Katz
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const POSITION_SCHEMA = { enum: ["beside", "below", "any"] };

module.exports = {
    meta: {
        type: "layout",

        docs: {
            description: "enforce the location of single-line statements",
            recommended: false,
            url: "https://eslint.org/docs/rules/nonblock-statement-body-position"
        },

        fixable: "whitespace",

        schema: [
            POSITION_SCHEMA,
            {
                properties: {
                    overrides: {
                        properties: {
                            if: POSITION_SCHEMA,
                            else: POSITION_SCHEMA,
                            while: POSITION_SCHEMA,
                            do: POSITION_SCHEMA,
                            for: POSITION_SCHEMA
                        },
                        additionalProperties: false
                    }
                },
                additionalProperties: false
            }
        ],

        messages: {
            expectNoLinebreak: "Expected no linebreak before this statement.",
            expectLinebreak: "Expected a linebreak before this statement."
        }
    },

    create(context) {
        const sourceCode = context.getSourceCode();

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        /**
         * Gets the applicable preference for a particular keyword
         * @param {string} keywordName The name of a keyword, e.g. 'if'
         * @returns {string} The applicable option for the keyword, e.g. 'beside'
         */
        function getOption(keywordName) {
            return context.options[1] && context.options[1].overrides && context.options[1].overrides[keywordName] ||
                context.options[0] ||
                "beside";
        }

        /**
         * Validates the location of a single-line statement
         * @param {ASTNode} node The single-line statement
         * @param {string} keywordName The applicable keyword name for the single-line statement
         * @returns {void}
         */
        function validateStatement(node, keywordName) {
            const option = getOption(keywordName);

            if (node.type === "BlockStatement" || option === "any") {
                return;
            }

            const tokenBefore = sourceCode.getTokenBefore(node);

            if (tokenBefore.loc.end.line === node.loc.start.line && option === "below") {
                context.report({
                    node,
                    messageId: "expectLinebreak",
                    fix: fixer => fixer.insertTextBefore(node, "\n")
                });
            } else if (tokenBefore.loc.end.line !== node.loc.start.line && option === "beside") {
                context.report({
                    node,
                    messageId: "expectNoLinebreak",
                    fix(fixer) {
                        if (sourceCode.getText().slice(tokenBefore.range[1], node.range[0]).trim()) {
                            return null;
                        }
                        return fixer.replaceTextRange([tokenBefore.range[1], node.range[0]], " ");
                    }
                });
            }
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            IfStatement(node) {
                validateStatement(node.consequent, "if");

                // Check the `else` node, but don't check 'else if' statements.
                if (node.alternate && node.alternate.type !== "IfStatement") {
                    validateStatement(node.alternate, "else");
                }
            },
            WhileStatement: node => validateStatement(node.body, "while"),
            DoWhileStatement: node => validateStatement(node.body, "do"),
            ForStatement: node => validateStatement(node.body, "for"),
            ForInStatement: node => validateStatement(node.body, "for"),
            ForOfStatement: node => validateStatement(node.body, "for")
        };
    }
};
