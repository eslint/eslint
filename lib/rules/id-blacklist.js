/**
 * @fileoverview Rule that warns when identifier names that are
 * blacklisted in the configuration are used.
 * @author Keith Cirkel (http://keithcirkel.co.uk)
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Checks whether the given node represents assignment target in a normal assignment or destructuring.
 * @param {ASTNode} node The node to check.
 * @returns {boolean} `true` if the node is assignment target.
 */
function isAssignmentTarget(node) {
    const parent = node.parent;

    return (

        // normal assignment
        (
            parent.type === "AssignmentExpression" &&
            parent.left === node
        ) ||

        // destructuring
        parent.type === "ArrayPattern" ||
        parent.type === "RestElement" ||
        (
            parent.type === "Property" &&
            parent.value === node &&
            parent.parent.type === "ObjectPattern"
        ) ||
        (
            parent.type === "AssignmentPattern" &&
            parent.left === node
        )
    );
}

/**
 * Checks whether the given node represents an imported name that is renamed in the same import/export specifier.
 *
 * Examples:
 * import { a as b } from 'mod'; // node `a` is renamed import
 * export { a as b } from 'mod'; // node `a` is renamed import
 * @param {ASTNode} node `Identifier` node to check.
 * @returns {boolean} `true` if the node is a renamed import.
 */
function isRenamedImport(node) {
    const parent = node.parent;

    return (
        (
            parent.type === "ImportSpecifier" &&
            parent.imported !== parent.local &&
            parent.imported === node
        ) ||
        (
            parent.type === "ExportSpecifier" &&
            parent.parent.source && // re-export
            parent.local !== parent.exported &&
            parent.local === node
        )
    );
}

/**
 * Checks whether the given node is a renamed identifier node in an ObjectPattern destructuring.
 *
 * Examples:
 * const { a : b } = foo; // node `a` is renamed node.
 * @param {ASTNode} node `Identifier` node to check.
 * @returns {boolean} `true` if the node is a renamed node in an ObjectPattern destructuring.
 */
function isRenamedInDestructuring(node) {
    const parent = node.parent;

    return (
        (
            !parent.computed &&
            parent.type === "Property" &&
            parent.parent.type === "ObjectPattern" &&
            parent.value !== node &&
            parent.key === node
        )
    );
}

/**
 * Checks whether the given node represents shorthand definition of a property in an object literal.
 * @param {ASTNode} node `Identifier` node to check.
 * @returns {boolean} `true` if the node is a shorthand property definition.
 */
function isShorthandPropertyDefinition(node) {
    const parent = node.parent;

    return (
        parent.type === "Property" &&
        parent.parent.type === "ObjectExpression" &&
        parent.shorthand
    );
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow specified identifiers",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/id-blacklist"
        },

        schema: {
            type: "array",
            items: {
                type: "string"
            },
            uniqueItems: true
        },
        messages: {
            blacklisted: "Identifier '{{name}}' is blacklisted."
        }
    },

    create(context) {

        const blacklist = new Set(context.options);
        const reportedNodes = new Set();

        let globalScope;

        /**
         * Checks whether the given name is blacklisted.
         * @param {string} name The name to check.
         * @returns {boolean} `true` if the name is blacklisted.
         * @private
         */
        function isBlacklisted(name) {
            return blacklist.has(name);
        }

        /**
         * Checks whether the given node represents a reference to a global variable that is not declared in the source code.
         * These identifiers will be allowed, as it is assumed that user has no control over the names of external global variables.
         * @param {ASTNode} node `Identifier` node to check.
         * @returns {boolean} `true` if the node is a reference to a global variable.
         */
        function isReferenceToGlobalVariable(node) {
            const variable = globalScope.set.get(node.name);

            return variable && variable.defs.length === 0 &&
                variable.references.some(ref => ref.identifier === node);
        }

        /**
         * Determines whether the given node should be checked.
         * @param {ASTNode} node `Identifier` node.
         * @returns {boolean} `true` if the node should be checked.
         */
        function shouldCheck(node) {
            const parent = node.parent;

            /*
             * Member access has special rules for checking property names.
             * Read access to a property with a blacklisted name is allowed, because it can be on an object that user has no control over.
             * Write access isn't allowed, because it potentially creates a new property with a blacklisted name.
             */
            if (
                parent.type === "MemberExpression" &&
                parent.property === node &&
                !parent.computed
            ) {
                return isAssignmentTarget(parent);
            }

            return (
                parent.type !== "CallExpression" &&
                parent.type !== "NewExpression" &&
                !isRenamedImport(node) &&
                !isRenamedInDestructuring(node) &&
                !(
                    isReferenceToGlobalVariable(node) &&
                    !isShorthandPropertyDefinition(node)
                )
            );
        }

        /**
         * Reports an AST node as a rule violation.
         * @param {ASTNode} node The node to report.
         * @returns {void}
         * @private
         */
        function report(node) {
            if (!reportedNodes.has(node)) {
                context.report({
                    node,
                    messageId: "blacklisted",
                    data: {
                        name: node.name
                    }
                });
                reportedNodes.add(node);
            }
        }

        return {

            Program() {
                globalScope = context.getScope();
            },

            Identifier(node) {
                if (isBlacklisted(node.name) && shouldCheck(node)) {
                    report(node);
                }
            }
        };
    }
};
