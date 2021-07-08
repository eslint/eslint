/**
 * @fileoverview Restrict usage of specified globals.
 * @author Benoît Zugmeyer
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow specified global variables",
            category: "Variables",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-restricted-globals"
        },

        schema: {
            type: "array",
            items: {
                oneOf: [
                    {
                        type: "string"
                    },
                    {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                            message: { type: "string" },
                            isFullMessage: { type: "boolean" }
                        },
                        required: ["name"],
                        additionalProperties: false
                    }
                ]
            },
            uniqueItems: true,
            minItems: 0
        },

        messages: {
            defaultMessage: "Unexpected use of '{{name}}'.",
            // eslint-disable-next-line eslint-plugin/report-message-format
            customMessage: "Unexpected use of '{{name}}'. {{customMessage}}",
            // eslint-disable-next-line eslint-plugin/report-message-format
            fullCustomMessage: "{{customMessage}}"
        }
    },

    create(context) {

        // If no globals are restricted, we don't need to do anything
        if (context.options.length === 0) {
            return {};
        }

        const restrictedGlobalOptions = context.options.reduce((memo, option) => {
            if (typeof option === "string") {
                memo[option] = { name: option };
            } else {
                memo[option.name] = option;
            }

            return memo;
        }, {});

        /**
         * Report a variable to be used as a restricted global.
         * @param {Reference} reference the variable reference
         * @returns {void}
         * @private
         */
        function reportReference(reference) {
            const name = reference.identifier.name;
            const option = restrictedGlobalOptions[name];

            /* eslint-disable */
            const messageId =
                !option.message ? "defaultMessage" :
                !option.isFullMessage ? "customMessage" :
                "fullCustomMessage";
            /* eslint-enable */

            context.report({
                node: reference.identifier,
                messageId,
                data: {
                    name,
                    customMessage: option.message
                }
            });
        }

        /**
         * Check if the given name is a restricted global name.
         * @param {string} name name of a variable
         * @returns {boolean} whether the variable is a restricted global or not
         * @private
         */
        function isRestricted(name) {
            return Object.prototype.hasOwnProperty.call(restrictedGlobalOptions, name);
        }

        return {
            Program() {
                const scope = context.getScope();

                // Report variables declared elsewhere (ex: variables defined as "global" by eslint)
                scope.variables.forEach(variable => {
                    if (!variable.defs.length && isRestricted(variable.name)) {
                        variable.references.forEach(reportReference);
                    }
                });

                // Report variables not declared at all
                scope.through.forEach(reference => {
                    if (isRestricted(reference.identifier.name)) {
                        reportReference(reference);
                    }
                });

            }
        };
    }
};
