/**
 * @fileoverview Rule to flag use of variables before they are defined
 * @author Ilya Volodin
 * @copyright 2013 Ilya Volodin. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Parses a given value as options.
 *
 * @param {any} options - A value to parse.
 * @returns {object} The parsed options.
 */
function parseOptions(options) {
    var functions = true;
    var classes = true;

    if (typeof options === "string") {
        functions = (options !== "nofunc");
    } else if (typeof options === "object" && options !== null) {
        functions = options.functions !== false;
        classes = options.classes !== false;
    }

    return {functions: functions, classes: classes};
}

/**
 * @returns {boolean} `false`.
 */
function alwaysFalse() {
    return false;
}

/**
 * Checks whether or not a given variable is a function declaration.
 *
 * @param {escope.Variable} variable - A variable to check.
 * @returns {boolean} `true` if the variable is a function declaration.
 */
function isFunction(variable) {
    return variable.defs[0].type === "FunctionName";
}

/**
 * Checks whether or not a given variable is a class declaration in an upper function scope.
 *
 * @param {escope.Variable} variable - A variable to check.
 * @param {escope.Reference} reference - A reference to check.
 * @returns {boolean} `true` if the variable is a class declaration.
 */
function isOuterClass(variable, reference) {
    return (
        variable.defs[0].type === "ClassName" &&
        variable.scope.variableScope !== reference.from.variableScope
    );
}

/**
 * Checks whether or not a given variable is a function declaration or a class declaration in an upper function scope.
 *
 * @param {escope.Variable} variable - A variable to check.
 * @param {escope.Reference} reference - A reference to check.
 * @returns {boolean} `true` if the variable is a function declaration or a class declaration.
 */
function isFunctionOrOuterClass(variable, reference) {
    return isFunction(variable, reference) || isOuterClass(variable, reference);
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var options = parseOptions(context.options[0]);

    // Defines a function which checks whether or not a reference is allowed according to the option.
    var isAllowed;
    if (options.functions && options.classes) {
        isAllowed = alwaysFalse;
    } else if (options.functions) {
        isAllowed = isOuterClass;
    } else if (options.classes) {
        isAllowed = isFunction;
    } else {
        isAllowed = isFunctionOrOuterClass;
    }

    /**
     * Finds and validates all variables in a given scope.
     * @param {Scope} scope The scope object.
     * @returns {void}
     * @private
     */
    function findVariablesInScope(scope) {
        scope.references.forEach(function(reference) {
            var variable = (
                reference.resolved ||
                astUtils.getVariableByName(scope, reference.identifier.name)
            );

            // Skips when the reference is:
            // - referring to an undefined variable.
            // - referring to a global environment variable (there're no identifiers).
            // - located preceded by the variable.
            // - allowed by options.
            if (!variable ||
                variable.identifiers.length === 0 ||
                variable.identifiers[0].range[1] <= reference.identifier.range[1] ||
                isAllowed(variable, reference)
            ) {
                return;
            }

            // Reports.
            context.report({
                node: reference.identifier,
                message: "\"{{name}}\" was used before it was defined",
                data: reference.identifier
            });
        });
    }

    /**
     * Validates variables inside of a node's scope.
     * @param {ASTNode} node The node to check.
     * @returns {void}
     * @private
     */
    function findVariables() {
        var scope = context.getScope();
        findVariablesInScope(scope);
    }

    var ruleDefinition = {
        "Program": function() {
            var scope = context.getScope();
            findVariablesInScope(scope);

            // both Node.js and Modules have an extra scope
            if (context.ecmaFeatures.globalReturn || context.ecmaFeatures.modules) {
                findVariablesInScope(scope.childScopes[0]);
            }
        }
    };

    if (context.ecmaFeatures.blockBindings) {
        ruleDefinition.BlockStatement = ruleDefinition.SwitchStatement = findVariables;

        ruleDefinition.ArrowFunctionExpression = function(node) {
            if (node.body.type !== "BlockStatement") {
                findVariables(node);
            }
        };
    } else {
        ruleDefinition.FunctionExpression = ruleDefinition.FunctionDeclaration = ruleDefinition.ArrowFunctionExpression = findVariables;
    }

    return ruleDefinition;
};

module.exports.schema = [
    {
        "oneOf": [
            {
                "enum": ["nofunc"]
            },
            {
                "type": "object",
                "properties": {
                    "functions": {"type": "boolean"},
                    "classes": {"type": "boolean"}
                },
                "additionalProperties": false
            }
        ]
    }
];
