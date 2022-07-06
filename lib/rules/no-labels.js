/**
 * @fileoverview Disallow Labeled Statements
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "Disallow labeled statements",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-labels"
        },

        schema: [
            {
                type: "object",
                properties: {
                    allowLoop: {
                        type: "boolean",
                        default: false
                    },
                    allowSwitch: {
                        type: "boolean",
                        default: false
                    }
                },
                additionalProperties: false
            }
        ],

        messages: {
            unexpectedLabel: "Unexpected labeled statement.",
            unexpectedLabelInBreak: "Unexpected label in break statement.",
            unexpectedLabelInContinue: "Unexpected label in continue statement."
        }
    },

    create(context) {
        const options = context.options[0];
        const allowLoop = options && options.allowLoop;
        const allowSwitch = options && options.allowSwitch;
        let scopeInfo = null;

        /**
         * Gets the kind of a given node.
         * @param {ASTNode} node A node to get.
         * @returns {string} The kind of the node.
         */
        function getBodyKind(node) {
            if (astUtils.isLoop(node)) {
                return "loop";
            }
            if (node.type === "SwitchStatement") {
                return "switch";
            }
            return "other";
        }

        /**
         * Checks whether the label of a given kind is allowed or not.
         * @param {string} kind A kind to check.
         * @returns {boolean} `true` if the kind is allowed.
         */
        function isAllowed(kind) {
            switch (kind) {
                case "loop": return allowLoop;
                case "switch": return allowSwitch;
                default: return false;
            }
        }

        /**
         * Checks whether a given name is a label of a loop or not.
         * @param {string} label A name of a label to check.
         * @returns {boolean} `true` if the name is a label of a loop.
         */
        function getKind(label) {
            let info = scopeInfo;

            while (info) {
                if (info.label === label) {
                    return info.kind;
                }
                info = info.upper;
            }

            /* istanbul ignore next: syntax error */
            return "other";
        }

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {
            LabeledStatement(node) {
                scopeInfo = {
                    label: node.label.name,
                    kind: getBodyKind(node.body),
                    upper: scopeInfo
                };
            },

            "LabeledStatement:exit"(node) {
                if (!isAllowed(scopeInfo.kind)) {
                    context.report({
                        node,
                        messageId: "unexpectedLabel"
                    });
                }

                scopeInfo = scopeInfo.upper;
            },

            BreakStatement(node) {
                if (node.label && !isAllowed(getKind(node.label.name))) {
                    context.report({
                        node,
                        messageId: "unexpectedLabelInBreak"
                    });
                }
            },

            ContinueStatement(node) {
                if (node.label && !isAllowed(getKind(node.label.name))) {
                    context.report({
                        node,
                        messageId: "unexpectedLabelInContinue"
                    });
                }
            }
        };

    }
};
