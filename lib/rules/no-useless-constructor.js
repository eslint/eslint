/**
 * @fileoverview Rule to flag the use of redundant constructors in classes.
 * @author Alberto Rodríguez
 * @copyright 2015 Alberto Rodríguez. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    /**
     * Checks whether the constructor body is a redundant super call.
     * @param {Array} body - constructor body content.
     * @param {Array} ctorParams - The params to check against super call.
     * @returns {boolean} true if the construtor body is redundant
     */
    function isRedundantSuperCall(body, ctorParams) {
        if (body.length !== 1 ||
            body[0].type !== "ExpressionStatement" ||
            body[0].expression.callee.type !== "Super") {
            return false;
        }

        var superArgs = body[0].expression.arguments;
        var firstSuperArg = superArgs[0];
        var lastSuperArgIndex = superArgs.length - 1;
        var lastSuperArg = superArgs[lastSuperArgIndex];
        var isSimpleParameterList = ctorParams.every(function(param) {
            return param.type === "Identifier" || param.type === "RestElement";
        });

        /**
         * Checks if a super argument is the same with constructor argument
         * @param {ASTNode} arg argument node
         * @param {number} index argument index
         * @returns {boolean} true if the arguments are same, false otherwise
         */
        function isSameIdentifier(arg, index) {
            return (
                arg.type === "Identifier" &&
                arg.name === ctorParams[index].name
            );
        }

        var spreadsArguments =
            superArgs.length === 1 &&
            firstSuperArg.type === "SpreadElement" &&
            firstSuperArg.argument.name === "arguments";

        var passesParamsAsArgs =
            superArgs.length === ctorParams.length &&
            superArgs.every(isSameIdentifier) ||
            superArgs.length <= ctorParams.length &&
            superArgs.slice(0, -1).every(isSameIdentifier) &&
            lastSuperArg.type === "SpreadElement" &&
            ctorParams[lastSuperArgIndex].type === "RestElement" &&
            lastSuperArg.argument.name === ctorParams[lastSuperArgIndex].argument.name;

        return isSimpleParameterList && (spreadsArguments || passesParamsAsArgs);
    }

    /**
     * Checks whether a node is a redundant constructor
     * @param {ASTNode} node - node to check
     * @returns {void}
     */
    function checkForConstructor(node) {
        if (node.kind !== "constructor") {
            return;
        }

        var body = node.value.body.body;

        if (!node.parent.parent.superClass && body.length === 0 ||
            node.parent.parent.superClass && isRedundantSuperCall(body, node.value.params)) {
            context.report(node, "Useless constructor.");
        }
    }


    return {
        "MethodDefinition": checkForConstructor
    };
};

module.exports.schema = [];
