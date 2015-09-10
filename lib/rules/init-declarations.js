/**
 * @fileoverview A rule to control the style of variable initializations.
 * @author Colin Ihrig
 * @copyright 2015 Colin Ihrig. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Checks whether or not a given declarator node has its initializer.
 * @param {ASTNode} node - A declarator node to check.
 * @returns {boolean} `true` when the node has its initializer.
 */
function isInitialized(node) {
    var declaration = node.parent;
    var block = declaration.parent;

    if (block.type === "ForInStatement" || block.type === "ForOfStatement") {
        return block.left === declaration;
    }
    return Boolean(node.init);
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var MODE_ALWAYS = "always",
        MODE_NEVER = "never";

    var mode = context.options[0] || MODE_ALWAYS;

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {
        "VariableDeclaration:exit": function(node) {

            var kind = node.kind,
                declarations = node.declarations;

            for (var i = 0; i < declarations.length; ++i) {
                var declaration = declarations[i],
                    id = declaration.id,
                    initialized = isInitialized(declaration);

                if (id.type !== "Identifier") {
                    continue;
                }

                if (mode === MODE_ALWAYS && !initialized) {
                    context.report(declaration, "Variable '" + id.name + "' should be initialized on declaration.");
                } else if (mode === MODE_NEVER && kind !== "const" && initialized) {
                    context.report(declaration, "Variable '" + id.name + "' should not be initialized on declaration.");
                }
            }
        }
    };

};

module.exports.schema = [
    {
        "enum": ["always", "never"]
    }
];
