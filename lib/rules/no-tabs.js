/**
 * @fileoverview Rule to check for tabs inside a file
 * @author Gyandeep Singh
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const tabRegex = /\t+/gu;
const anyNonWhitespaceRegex = /\S/u;

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "layout",

        docs: {
            description: "Disallow all tabs",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-tabs"
        },
        schema: [{
            type: "object",
            properties: {
                allowIndentationTabs: {
                    type: "boolean",
                    default: false
                },
                allowInComments: {
                    type: "boolean",
                    default: false
                },
                allowInStrings: {
                    type: "boolean",
                    default: false
                },
                allowInTemplates: {
                    type: "boolean",
                    default: false
                },
                allowInRegExps: {
                    type: "boolean",
                    default: false
                }
            },
            additionalProperties: false
        }],

        messages: {
            unexpectedTab: "Unexpected tab character."
        }
    },

    create(context) {
        const options = context.options[0] || {};
        const allowIndentationTabs = options.allowIndentationTabs || false;
        const allowInComments = options.allowInComments || false;
        const allowInStrings = options.allowInStrings || false;
        const allowInTemplates = options.allowInTemplates || false;
        const allowInRegExps = options.allowInRegExps || false;

        const sourceCode = context.getSourceCode();
        const sourceLines = sourceCode.getLines();
        const commentNodes = sourceCode.getAllComments();

        let errors = [];

        /**
         * A no-op function to act as placeholder.
         * @returns {void}
         * @private
         */
        function noop() {}

        /**
         * Checks if an error intersects with the given node
         * @param {{loc:{start: Location, end: Location}}} error The error
         * @param {ASTNode} node The program node
         * @returns {boolean} true if they intersect, false otherwise
         * @private
         */
        function intersects(error, node) {
            const locStart = node.loc.start;
            const locEnd = node.loc.end;

            return (
                error.loc.start.line < locStart.line ||
                error.loc.start.line === locStart.line && error.loc.start.column < locStart.column ||
                error.loc.start.line === locEnd.line && error.loc.start.column >= locEnd.column ||
                error.loc.start.line > locEnd.line
            );
        }

        /**
         * Removes errors from node if it is a string or regexp node
         * @param {ASTNode} node The program node
         * @returns {void}
         * @private
         */
        function removeNodeErrorsIfStringOrRegExp(node) {
            if (
                allowInStrings && typeof node.value === "string" && node.raw.includes("\t") ||
                allowInRegExps && Boolean(node.regex) && node.raw.includes("\t")
            ) {
                errors = errors.filter(error => intersects(error, node));
            }
        }

        /**
         * Removes errors from template node
         * @param {ASTNode} node The program node
         * @returns {void}
         * @private
         */
        function removeNodeErrorsInTemplate(node) {
            if (typeof node.value.raw === "string" && node.value.raw.includes("\t")) {
                errors = errors.filter(error => intersects(error, node));
            }
        }

        /**
         * Removes errors from comment node
         * @param {ASTNode} node The comment node
         * @returns {void}
         * @private
         */
        function removeNodeErrorsInComment(node) {
            if (typeof node.value === "string" && node.value.includes("\t") !== -1) {
                errors = errors.filter(error => intersects(error, node));
            }
        }

        const handleLiteral = allowInStrings || allowInRegExps ? removeNodeErrorsIfStringOrRegExp : noop;

        const handleTemplate = allowInTemplates ? removeNodeErrorsInTemplate : noop;

        const handleComment = allowInComments ? removeNodeErrorsInComment : noop;

        const nodes = {
            Program(node) {
                sourceLines.forEach((line, index) => {
                    let match;

                    while ((match = tabRegex.exec(line)) !== null) {
                        if (allowIndentationTabs && !anyNonWhitespaceRegex.test(line.slice(0, match.index))) {
                            continue;
                        }

                        errors.push({
                            node,
                            loc: {
                                start: {
                                    line: index + 1,
                                    column: match.index
                                },
                                end: {
                                    line: index + 1,
                                    column: match.index + match[0].length
                                }
                            },
                            messageId: "unexpectedTab"
                        });
                    }
                });
            }
        };

        nodes.Literal = handleLiteral;

        nodes.TemplateElement = handleTemplate;

        nodes["Program:exit"] = function() {
            commentNodes.forEach(handleComment);
            errors.forEach(error => context.report(error));
        };

        return nodes;
    }
};
