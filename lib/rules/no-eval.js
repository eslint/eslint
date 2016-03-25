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
     * Reports accesses of `eval` via the global object.
     *
     * @param {escope.Scope} globalScope - The global scope.
     * @returns {void}
     */
    function reportAccessingEvalViaGlobalObject(globalScope) {
        for (var i = 0; i < candidatesOfGlobalObject.length; ++i) {
            var name = candidatesOfGlobalObject[i];
            var variable = astUtils.getVariableByName(globalScope, name);
            if (!variable) {
                continue;
            }

            var references = variable.references;
            for (var j = 0; j < references.length; ++j) {
                var identifier = references[j].identifier;
                var node = identifier.parent;

                // To detect code like `window.window.eval`.
                while (isMember(node, name)) {
                    node = node.parent;
                }

                // Reports.
                if (isMember(node, "eval")) {
                    report(node);
                }
            }
        }
    }

    /**
     * Reports all accesses of `eval` (excludes direct calls to eval).
     *
     * @param {escope.Scope} globalScope - The global scope.
     * @returns {void}
     */
    function reportAccessingEval(globalScope) {
        var variable = astUtils.getVariableByName(globalScope, "eval");
        if (!variable) {
            return;
        }

        var references = variable.references;
        for (var i = 0; i < references.length; ++i) {
            var reference = references[i];
            var id = reference.identifier;

            if (id.name === "eval" && !astUtils.isCallee(id)) {

                // Is accessing to eval (excludes direct calls to eval)
                report(id);
            }
        }
    }

    if (allowIndirect) {

        // Checks only direct calls to eval. It's simple!
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
            var scope = context.getScope(),
                features = context.parserOptions.ecmaFeatures || {},
                strict =
                    scope.isStrict ||
                    node.sourceType === "module" ||
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
            var globalScope = context.getScope();

            exitVarScope();
            reportAccessingEval(globalScope);
            reportAccessingEvalViaGlobalObject(globalScope);
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

            /*
             * `this.eval` is found.
             * Checks whether or not the value of `this` is the global object.
             */
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
