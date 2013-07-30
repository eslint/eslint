/**
 * @fileoverview Rule to flag references to undeclared variables that are not
 * explicitly mentioned in a JS[LH]int-style *global* block comment.
 * @author Mark Macdonald
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var environments = require("../../conf/environments.json"),
    util = require("../util");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function parseBoolean(str) {
    return str === "true" ? true : false;
}

/**
 * Computes the set of declared globals from the `global` and `lint` options.
 * @param {object} blockOptions
 * @returns {object} An object that maps a global identifier name to {boolean} writebility.
 */
function getDeclaredGlobals(blockOptions) {
    var declaredGlobals = {};

    util.mixin(declaredGlobals, blockOptions.global);

    var lintOptions = blockOptions.lint;
    Object.keys(lintOptions).forEach(function(name) {
        var value = lintOptions[name];
        if (parseBoolean(value) && Object.hasOwnProperty.call(environments, name)) {
            util.mixin(declaredGlobals, environments[name]);
        }
    });
    return declaredGlobals;
}

/**
 * @param {Scope} scope
 * @param {Reference} ref
 * @returns {boolean} Whether ref refers to a variable (that is not an implicit global) defined in scope.
 */
function isExplicitlyDeclaredInScope(scope, ref) {
    return scope.variables.some(function(variable) {
        return variable.name === ref.identifier.name &&
            variable.defs.every(function(def) {
                return def.type !== "ImplicitGlobalVariable";
            });
    });
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {

        "Program": function(/*node*/) {
            var declaredGlobals = getDeclaredGlobals(context.getBlockOptions());
            var globalScope = context.getScope();

            globalScope.through.forEach(function(ref) {
                if (isExplicitlyDeclaredInScope(globalScope, ref)) {
                    return;
                }

                var name = ref.identifier.name;
                if (!Object.hasOwnProperty.call(declaredGlobals, name)) {
                    context.report(ref.identifier, "'{{name}}' is not defined.", { name: name });
                } else if (ref.isWrite() && declaredGlobals[name] !== true) {
                    context.report(ref.identifier, "'{{name}}' is read only.", { name: name });
                }
            });
        }
    };

};
