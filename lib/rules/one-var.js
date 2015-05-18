/**
 * @fileoverview A rule to control the use of single variable declarations.
 * @author Ian Christian Myers
 * @copyright 2015 Ian VanSchooten. All rights reserved.
 * @copyright 2015 Joey Baker. All rights reserved.
 * @copyright 2015 Danny Fritz. All rights reserved.
 * @copyright 2013 Ian Christian Myers. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var MODE_ALWAYS = "always",
        MODE_NEVER = "never";

    var mode = context.options[0];

    var options = {
    };

    if (typeof mode === "string") { // simple options configuration with just a string
        options.var = { uninitialized: mode, initialized: mode};
        options.let = { uninitialized: mode, initialized: mode};
        options.const = { uninitialized: mode, initialized: mode};
    } else if (typeof mode === "object") { // options configuration is an object
        if (mode.hasOwnProperty("var") && typeof mode.var === "string") {
            options.var = { uninitialized: mode.var, initialized: mode.var};
        }
        if (mode.hasOwnProperty("let") && typeof mode.let === "string") {
            options.let = { uninitialized: mode.let, initialized: mode.let};
        }
        if (mode.hasOwnProperty("const") && typeof mode.const === "string") {
            options.const = { uninitialized: mode.const, initialized: mode.const};
        }
        if (mode.hasOwnProperty("uninitialized")) {
            if (!options.var) {
                options.var = {};
            }
            if (!options.let) {
                options.let = {};
            }
            if (!options.const) {
                options.const = {};
            }
            options.var.uninitialized = mode.uninitialized;
            options.let.uninitialized = mode.uninitialized;
            options.const.uninitialized = mode.uninitialized;
        }
        if (mode.hasOwnProperty("initialized")) {
            if (!options.var) {
                options.var = {};
            }
            if (!options.let) {
                options.let = {};
            }
            if (!options.const) {
                options.const = {};
            }
            options.var.initialized = mode.initialized;
            options.let.initialized = mode.initialized;
            options.const.initialized = mode.initialized;
        }
    }

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    var functionStack = [];
    var blockStack = [];

    /**
     * Increments the blockStack counter.
     * @returns {void}
     * @private
     */
    function startBlock() {
        blockStack.push({
            let: {initialized: false, uninitialized: false},
            const: {initialized: false, uninitialized: false}
        });
    }

    /**
     * Increments the functionStack counter.
     * @returns {void}
     * @private
     */
    function startFunction() {
        functionStack.push({initialized: false, uninitialized: false});
        startBlock();
    }

    /**
     * Decrements the blockStack counter.
     * @returns {void}
     * @private
     */
    function endBlock() {
        blockStack.pop();
    }

    /**
     * Decrements the functionStack counter.
     * @returns {void}
     * @private
     */
    function endFunction() {
        functionStack.pop();
        endBlock();
    }

    /**
     * Records whether initialized or uninitialized variables are defined in current scope.
     * @param {string} statementType node.kind, one of: "var", "let", or "const"
     * @param {ASTNode[]} declarations List of declarations
     * @param {Object} currentScope The scope being investigated
     * @returns {void}
     * @private
     */
    function recordTypes(statementType, declarations, currentScope) {
        for (var i = 0; i < declarations.length; i++) {
            if (declarations[i].init === null) {
                if (options[statementType] && options[statementType].uninitialized === MODE_ALWAYS) {
                    currentScope.uninitialized = true;
                }
            } else {
                if (options[statementType] && options[statementType].initialized === MODE_ALWAYS) {
                    currentScope.initialized = true;
                }
            }
        }
    }

    /**
     * Counts the number of initialized and uninitialized declarations in a list of declarations
     * @param {ASTNode[]} declarations List of declarations
     * @returns {Object} Counts of 'uninitialized' and 'initialized' declarations
     * @private
     */
    function countDeclarations(declarations) {
        var counts = { uninitialized: 0, initialized: 0 };
        for (var i = 0; i < declarations.length; i++) {
            if (declarations[i].init === null) {
                counts.uninitialized++;
            } else {
                counts.initialized++;
            }
        }
        return counts;
    }

    /**
     * Determines if there is more than one var statement in the current scope.
     * @param {string} statementType node.kind, one of: "var", "let", or "const"
     * @param {ASTNode[]} declarations List of declarations
     * @returns {boolean} Returns true if it is the first var declaration, false if not.
     * @private
     */
    function hasOnlyOneStatement(statementType, declarations) {
        var currentScope;
        var declarationCounts = countDeclarations(declarations);

        if (statementType === "var") {
            currentScope = functionStack[functionStack.length - 1];
        } else if (statementType === "let") {
            currentScope = blockStack[blockStack.length - 1].let;
        } else if (statementType === "const") {
            currentScope = blockStack[blockStack.length - 1].const;
        }
        if (declarationCounts.uninitialized > 0) {
            if (options[statementType] && options[statementType].uninitialized === MODE_ALWAYS && currentScope.uninitialized) {
                return false;
            }
        }
        if (declarationCounts.initialized > 0) {
            if (options[statementType] && options[statementType].initialized === MODE_ALWAYS && currentScope.initialized) {
                return false;
            }
        }
        recordTypes(statementType, declarations, currentScope);
        return true;
    }


    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {
        "Program": startFunction,
        "FunctionDeclaration": startFunction,
        "FunctionExpression": startFunction,
        "ArrowFunctionExpression": startFunction,
        "BlockStatement": startBlock,
        "ForStatement": startBlock,
        "SwitchStatement": startBlock,

        "VariableDeclaration": function(node) {
            var parent = node.parent,
                type, declarations, declarationCounts;

            type = node.kind;
            if (!options[type]) {
                return;
            }

            declarations = node.declarations;
            declarationCounts = countDeclarations(declarations);

            // always
            if (!hasOnlyOneStatement(type, declarations)) {
                if (options[type].initialized === MODE_ALWAYS && options[type].uninitialized === MODE_ALWAYS) {
                    context.report(node, "Combine this with the previous '" + type + "' statement.");
                } else {
                    if (options[type].initialized === MODE_ALWAYS) {
                        context.report(node, "Combine this with the previous '" + type + "' statement with initialized variables.");
                    }
                    if (options[type].uninitialized === MODE_ALWAYS) {
                        context.report(node, "Combine this with the previous '" + type + "' statement with uninitialized variables.");
                    }
                }
            }
            // never
            if (parent.type !== "ForStatement" || parent.init !== node) {
                if (options[type].initialized === MODE_NEVER && options[type].uninitialized === MODE_NEVER) {
                    if ((declarationCounts.uninitialized + declarationCounts.initialized) > 1) {
                        context.report(node, "Split '" + type + "' declarations into multiple statements.");
                    }
                } else {
                    if (options[type].initialized === MODE_NEVER) {
                        if (declarationCounts.initialized > 1) {
                            context.report(node, "Split initialized '" + type + "' declarations into multiple statements.");
                        }
                    }
                    if (options[type].uninitialized === MODE_NEVER) {
                        if (declarationCounts.uninitialized > 1) {
                            context.report(node, "Split uninitialized '" + type + "' declarations into multiple statements.");
                        }
                    }
                }
            }
        },

        "ForStatement:exit": endBlock,
        "SwitchStatement:exit": endBlock,
        "BlockStatement:exit": endBlock,
        "Program:exit": endFunction,
        "FunctionDeclaration:exit": endFunction,
        "FunctionExpression:exit": endFunction,
        "ArrowFunctionExpression:exit": endFunction
    };

};
