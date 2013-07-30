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

/**
 * Parses a list of JS[HL]int-style "option:value" options from a string and invokes the callback
 * on each option-value pair.
 * @param {string} string
 * @param {function} callback
 * @returns {void}
 */
function forEachOption(string, callback) {
    // Collapse whitespace around : to make parsing easier
    string = string.replace(/\s*:\s*/g, ":");
    string.split(/\s+/).forEach(function(name) {
        if (!name) {
            return;
        }
        var pos = name.indexOf(":"),
            value;
        if (pos !== -1) {
            value = name.substring(pos + 1, name.length);
            name = name.substring(0, pos);
        }
        callback(name, value);
    });
}

function parseBoolean(str) {
    return str === "true" ? true : false;
}

/**
 * Parses global info from a block comment and puts them in the globals map.
 * @param {ASTNode} comment
 * @param {Object} globals
 * @returns {void}
 */
function parseGlobals(comment, globals) {
    if (comment.type !== "Block") {
        return;
    }
    var text = comment.value;
    var match;
    if ((match = /^\s*(globals?)/.exec(text))) {
        forEachOption(text.substring(match.index + match[1].length), function(name, value) {
            globals[name] = parseBoolean(value);
        });
        return true;
    } else if ((match = /^\s*(js[lh]int)/.exec(text))) {
        forEachOption(text.substring(match.index + match[1].length), function(name, value) {
            if (parseBoolean(value) && Object.hasOwnProperty.call(environments, name)) {
                util.mixin(globals, environments[name]);
            }
        });
    }
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

        "Program": function(node) {
            // Maps a global identifier name to {boolean} writeability
            var declaredGlobals = {};

            node.comments.forEach(function(comment) {
                parseGlobals(comment, declaredGlobals);
            });

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
