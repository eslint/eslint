/**
 * @fileoverview Rule to flag when the same variable is declared more then once.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var options = {
        builtinGlobals: Boolean(context.options[0] && context.options[0].builtinGlobals)
    };

    /**
     * Gets the names of writeable built-in variables.
     * @param {escope.Scope} scope - A scope to get.
     * @returns {object} A map that its key is a variable name.
     */
    function getBuiltinGlobals(scope) {
        return scope.variables.reduce(function(retv, variable) {
            if ("writeable" in variable && variable.name !== "__proto__") {
                retv[variable.name] = true;
            }
            return retv;
        }, Object.create(null));
    }

    /**
     * Find variables in a given scope and flag redeclared ones.
     * @param {Scope} scope - An escope scope object.
     * @param {object} builtins - A map that its key is a variable name.
     * @returns {void}
     * @private
     */
    function findVariablesInScope(scope, builtins) {
        scope.variables.forEach(function(variable) {
            var hasBuiltin = (
                options.builtinGlobals &&
                ("writeable" in variable || Boolean(builtins && builtins[variable.name]))
            );
            var count = (hasBuiltin ? 1 : 0) + variable.identifiers.length;

            if (count >= 2) {
                variable.identifiers.sort(function(a, b) {
                    return a.range[1] - b.range[1];
                });

                for (var i = (hasBuiltin ? 0 : 1), l = variable.identifiers.length; i < l; i++) {
                    context.report(
                        variable.identifiers[i],
                        "{{a}} is already defined",
                        {a: variable.name});
                }
            }
        });

    }

    /**
     * Find variables in the current scope.
     * @returns {void}
     * @private
     */
    function checkForGlobal() {
        var scope = context.getScope();

        // Nodejs env or modules has a special scope.
        // But built-in global variables are not there.
        if (context.ecmaFeatures.globalReturn || context.ecmaFeatures.modules) {
            var builtins = (options.builtinGlobals ? getBuiltinGlobals(scope) : null);
            findVariablesInScope(scope.childScopes[0], builtins);
        } else {
            findVariablesInScope(scope);
        }
    }

    /**
     * Find variables in the current scope.
     * @returns {void}
     * @private
     */
    function checkForBlock() {
        findVariablesInScope(context.getScope());
    }

    if (context.ecmaFeatures.blockBindings) {
        return {
            "Program": checkForGlobal,
            "BlockStatement": checkForBlock,
            "SwitchStatement": checkForBlock
        };
    } else {
        return {
            "Program": checkForGlobal,
            "FunctionDeclaration": checkForBlock,
            "FunctionExpression": checkForBlock,
            "ArrowFunctionExpression": checkForBlock
        };
    }
};

module.exports.schema = [
    {
        "type": "object",
        "properties": {
            "builtinGlobals": {"type": "boolean"}
        },
        "additionalProperties": false
    }
];
