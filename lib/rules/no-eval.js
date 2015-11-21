/**
 * @fileoverview Rule to flag use of eval() statement
 * @author Nicholas C. Zakas
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * @copyright 2015 Mathias Schreck. All rights reserved.
 * @copyright 2013 Nicholas C. Zakas. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var candidatesOfGlobalObject = Object.freeze([
    "global",
    "window"
]);

/**
 * Gets a map to check whether or not a name is the global object's.
 *
 * @param {Map<string, escope.Variable>} globals
 *      A map which contains all global variables.
 * @returns {object} A map. Keys are names of the global object.
 */
function getGlobalObjectNames(globals) {
    return candidatesOfGlobalObject.reduce(
        function(retv, name) {
            var variable = globals.get(name);
            if (variable && variable.eslintExplicitGlobal === false) {
                retv[name] = true;
            }
            return retv;
        },
        Object.create(null)
    );
}

/**
 * Checks a given node is a Identifier node of the specified name.
 *
 * @param {ASTNode} node - A node to check.
 * @param {string} name - A name to check.
 * @returns {boolean} `true` if the node is a Identifier node of the name.
 */
function isIdentifier(node, name) {
    return node.type === "Identifier" && node.name === name;
}

/**
 * Checks a given node is a Literal node of the specified string value.
 *
 * @param {ASTNode} node - A node to check.
 * @param {string} name - A name to check.
 * @returns {boolean} `true` if the node is a Literal node of the name.
 */
function isConstant(node, name) {
    switch (node.type) {
        case "Literal":
            return node.value === name;

        case "TemplateLiteral":
            return (
                node.expressions.length === 0 &&
                node.quasis[0].value.cooked === name
            );

        default:
            return false;
    }
}

/**
 * Checks a given node is a MemberExpression node which has the specified name's
 * property.
 *
 * @param {ASTNode} node - A node to check.
 * @param {string} name - A name to check.
 * @returns {boolean} `true` if the node is a MemberExpression node which has
 *      the specified name's property
 */
function isMember(node, name) {
    return (
        node.type === "MemberExpression" &&
        (node.computed ? isConstant : isIdentifier)(node.property, name)
    );
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var allowIndirect = Boolean(
        context.options[0] &&
        context.options[0].allowIndirect
    );
    var sourceCode = context.getSourceCode();
    var funcInfo = null;

    /**
     * Pushs a variable scope (Program or Function) information to the stack.
     *
     * This is used in order to check whether or not `this` binding is a
     * reference to the global object.
     *
     * @param {ASTNode} node - A node of the scope. This is one of Program,
     *      FunctionDeclaration, FunctionExpression, and ArrowFunctionExpression.
     * @returns {void}
     */
    function enterVarScope(node) {
        var strict = context.getScope().isStrict;

        funcInfo = {
            upper: funcInfo,
            node: node,
            strict: strict,
            defaultThis: false,
            initialized: strict
        };
    }

    /**
     * Pops a variable scope from the stack.
     *
     * @returns {void}
     */
    function exitVarScope() {
        funcInfo = funcInfo.upper;
    }

    /**
     * Reports a given node.
     *
     * `node` is `Identifier` or `MemberExpression`.
     * The parent of `node` might be `CallExpression`.
     *
     * The location of the report is always `eval` `Identifier` (or possibly
     * `Literal`). The type of the report is `CallExpression` if the parent is
     * `CallExpression`. Otherwise, it's the given node type.
     *
     * @param {ASTNode} node - A node to report.
     * @returns {void}
     */
    function report(node) {
        var locationNode = node;
        var parent = node.parent;

        if (node.type === "MemberExpression") {
            locationNode = node.property;
        }
        if (parent.type === "CallExpression" && parent.callee === node) {
            node = parent;
        }

        context.report({
            node: node,
            loc: locationNode.loc.start,
            message: "eval can be harmful."
        });
    }

    /**
     * Reports an access of `eval` of the global object.
     *
     * @param {ASTNode} id - An `Identifier` node of the global object.
     * @returns {void}
     */
    function reportAccessingEvalOfGlobalObject(id) {
        var name = id.name;
        var node = id.parent;
        for (;;) {
            // To detect code like `window.window.eval`.
            if (isMember(node, name)) {
                node = node.parent;
                continue;
            }

            if (isMember(node, "eval")) {
                report(node);
            }
            return;
        }
    }

    /**
     * Reports all accesses of `eval` (excludes direct calls to eval).
     *
     * @returns {void}
     */
    function reportAccessingEval() {
        var globalScope = context.getScope();
        var globals = getGlobalObjectNames(globalScope.set);
        var references = globalScope.through;

        for (var i = 0; i < references.length; ++i) {
            var reference = references[i];
            var id = reference.identifier;

            if (id.name === "eval" && !astUtils.isCallee(id)) {
                // Is accessing to eval (excludes direct calls to eval)
                report(id);

            } else if (globals[id.name]) {
                // This is the global object.
                reportAccessingEvalOfGlobalObject(id);
            }
        }
    }

    if (allowIndirect) {
        // Checks only direct calls to eval.
        // It's simple!
        return {
            "CallExpression:exit": function(node) {
                var callee = node.callee;
                if (isIdentifier(callee, "eval")) {
                    report(callee);
                }
            }
        };
    }

    return {
        "CallExpression:exit": function(node) {
            var callee = node.callee;
            if (isIdentifier(callee, "eval")) {
                report(callee);
            }
        },

        "Program": function(node) {
            var scope = context.getScope();
            var features = context.ecmaFeatures;
            var strict =
                scope.isStrict ||
                features.modules ||
                (features.globalReturn && scope.childScopes[0].isStrict);

            funcInfo = {
                upper: null,
                node: node,
                strict: strict,
                defaultThis: true,
                initialized: true
            };
        },

        "Program:exit": function() {
            exitVarScope();
            reportAccessingEval();
        },

        "FunctionDeclaration": enterVarScope,
        "FunctionDeclaration:exit": exitVarScope,
        "FunctionExpression": enterVarScope,
        "FunctionExpression:exit": exitVarScope,
        "ArrowFunctionExpression": enterVarScope,
        "ArrowFunctionExpression:exit": exitVarScope,

        "ThisExpression": function(node) {
            if (!isMember(node.parent, "eval")) {
                return;
            }

            // `this.eval` is found.
            // Checks whether or not the value of `this` is the global object.
            if (!funcInfo.initialized) {
                funcInfo.initialized = true;
                funcInfo.defaultThis = astUtils.isDefaultThisBinding(
                    funcInfo.node,
                    sourceCode
                );
            }
            if (!funcInfo.strict && funcInfo.defaultThis) {
                // `this.eval` is possible built-in `eval`.
                report(node.parent);
            }
        }
    };

};

module.exports.schema = [
    {
        "type": "object",
        "properties": {
            "allowIndirect": {"type": "boolean"}
        },
        "additionalProperties": false
    }
];
