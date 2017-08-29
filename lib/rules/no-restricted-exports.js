/**
 * @fileoverview Restrict usage of specified export names.
 * @author Bradley Farias
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow usage of specified names when using `export`.",
            category: "ECMAScript 6",
            recommended: true
        },
    },

    create(context) {
        const sourceCode = context.getSourceCode();
        const names = new Set([
            "__defineGetter__",
            "__defineSetter__",
            "__lookupGetter__",
            "__lookupSetter__",
            "__proto__",
            "constructor",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "then",
            "toLocaleString",
            "toString",
            "valueOf"
        ]);

        /**
         * Checks and reports if a name was restricted.
         * @param {string} name The binding name that is being exported.
         * @param {ASTNode} node The node that provided the name.
         * @returns {void}
         */
        function checkRestrictedName(name, node) {
            if (names.has(name)) {
                context.report({
                    node,
                    message: "export '{{name}}' is restricted from being used.",
                    data: {
                        name
                    }
                });
            }
        }

        /**
         * Determines whether an export declaration is restricted
         * @param {ASTNode} node The export declaration node.
         * @returns {void}
         */
        function validate(node) {
            if (node.declaration) {
                node.declaration.declarations.forEach(function (declarator) {
                    checkRestrictedName(declarator.id.name, node);
                });
            }
            else {
                node.specifiers.forEach(function (specifier) {
                    const name = specifier.exported ? specifier.exported.name : specifier.local.name;
                    checkRestrictedName(name, specifier);
                });
            }
        }

        return {
            "ExportNamedDeclaration:exit": validate,
        };
    }
};
