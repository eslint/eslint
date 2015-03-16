/**
 * @fileoverview Rule to flag references to undeclared variables.
 * @author Mark Macdonald
 * @copyright 2015 Nicholas C. Zakas. All rights reserved.
 * @copyright 2013 Mark Macdonald. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var escope = require("escope");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function isImplicitGlobal(variable) {
    return variable.defs.every(function(def) {
        return def.type === "ImplicitGlobalVariable";
    });
}

/**
 * Gets the declared variable, defined in `scope`, that `ref` refers to.
 * @param {Scope} scope The scope in which to search.
 * @param {Reference} ref The reference to find in the scope.
 * @returns {Variable} The variable, or null if ref refers to an undeclared variable.
 */
function getDeclaredGlobalVariable(scope, ref) {
    var declaredGlobal = null;
    scope.variables.some(function(variable) {
        if (variable.name === ref.identifier.name) {
            // If it's an implicit global, it must have a `writeable` field (indicating it was declared)
            if (!isImplicitGlobal(variable) || {}.hasOwnProperty.call(variable, "writeable")) {
                declaredGlobal = variable;
                return true;
            }
        }
        return false;
    });
    return declaredGlobal;
}

/**
 * Checks if the given node is the argument of a typeof operator.
 * @param {ASTNode} node The AST node being checked.
 * @returns {boolean} Whether or not the node is the argument of a typeof operator.
 */
function hasTypeOfOperator(node) {
    var parent = node.parent;
    return parent.type === "UnaryExpression" && parent.operator === "typeof";
}

/**
 * Checks if a node name match the JSX tag convention.
 * @param {String} name - Name of the node to check.
 * @returns {boolean} Whether or not the node name match the JSX tag convention.
 */
var tagConvention = /^[a-z]|\-/;
function isTagName(name) {
    return tagConvention.test(name);
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var NOT_DEFINED_MESSAGE = "'{{name}}' is not defined.",
        READ_ONLY_MESSAGE = "'{{name}}' is read only.";

    // TODO: Remove once escope is updated
    var hackedImports = [];

    /**
     * Compare an identifier with the variables declared in the scope
     * @param {ASTNode} node - Identifier or JSXIdentifier node
     * @returns {void}
     */
    function checkIdentifierInJSX(node) {
        var scope = context.getScope(),
            variables = scope.variables,
            i,
            len;

        while (scope.type !== "global") {
            scope = scope.upper;
            variables = scope.variables.concat(variables);
        }

        for (i = 0, len = variables.length; i < len; i++) {

            if (variables[i].name === node.name) {
                return;
            }
        }

        context.report(node, NOT_DEFINED_MESSAGE, { name: node.name });
    }

    /**
     * Temporary function to fix escope issue. Remove once we upgrade to
     * escope 3.x.
     * @param {ASTNode} node The import specifier node.
     * @returns {void}
     * @private
     */
    function fixImport(node) {
        var scope = context.getScope(),
            variable = new escope.Variable(node.local.name, scope);
        variable.defs.push(node);
        scope.variables.push(variable);
        hackedImports.push(variable);
    }

    return {

        // TODO: Remove once escope is updated
        "ImportSpecifier": fixImport,
        "ImportNamespaceSpecifier": fixImport,
        "ImportDefaultSpecifier": fixImport,

        "Program:exit": function(/*node*/) {

            var globalScope = context.getScope();

            globalScope.through.forEach(function(ref) {
                var variable = getDeclaredGlobalVariable(globalScope, ref),
                    name = ref.identifier.name;

                if (hasTypeOfOperator(ref.identifier)) {
                    return;
                }

                // hack until https://github.com/eslint/eslint/issues/1968 is properly fixed
                if (name === "super") {
                    return;
                }

                if (!variable) {
                    context.report(ref.identifier, NOT_DEFINED_MESSAGE, { name: name });
                } else if (ref.isWrite() && variable.writeable === false) {
                    context.report(ref.identifier, READ_ONLY_MESSAGE, { name: name });
                }
            });

            // TODO: Remove once escope is updated
            globalScope.variables = globalScope.variables.filter(function (variable) {
                return hackedImports.indexOf(variable) < 0;
            });
        },

        "JSXOpeningElement": function(node) {
            if (!isTagName(node.name.name)) {
                checkIdentifierInJSX(node.name);
            }
        }

    };

};
