/**
 * @fileoverview Rule to flag use of console object
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Helper Functions
//------------------------------------------------------------------------------

/**
 * Checks whether a given variable is shadowed or not.
 *
 * @param {escope.Variable} variable - A variable to check.
 * @returns {boolean} `true` if the variable is shadowed.
 */
function isShadowed(variable) {
    if (variable) {
        return variable.defs.length >= 1;
    }

    return false;
}

/**
 * Reports the given node and identifier name.
 * @param {RuleContext} context The ESLint rule context.
 * @param {ASTNode} node The node to report on.
 * @param {string} identifierName The name of the identifier.
 * @returns {void}
 */
function report(context, node, identifierName) {
    if (identifierName) {
        context.report(node, "Unexpected console statement. '" + identifierName + "' global is not allowed.");
    } else {
        context.report(node, "Unexpected console statement.");
    }
}

/**
 * Returns the property name of a MemberExpression.
 * @param {ASTNode} memberExpressionNode The MemberExpression node.
 * @returns {string|null} Returns the property name if available, null else.
 */
function getPropertyName(memberExpressionNode) {
    if (memberExpressionNode.computed) {
        if (memberExpressionNode.property.type === "Literal") {
            return memberExpressionNode.property.value;
        }
    } else if (memberExpressionNode.property) {
        return memberExpressionNode.property.name;
    }
    return null;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow the use of `console`",
            category: "Possible Errors",
            recommended: true
        },

        schema: [
            {
                type: "object",
                properties: {
                    allow: {
                        type: "array",
                        items: {
                            type: "string"
                        },
                        minItems: 1,
                        uniqueItems: true
                    },
                    disallowGlobals: {
                        type: "array",
                        items: {
                            type: "string"
                        },
                        minItems: 1,
                        uniqueItems: true
                    }
                },
                additionalProperties: false
            }
        ]
    },

    create: function(context) {

        return {

            MemberExpression: function(node) {
                var scope = context.getScope();
                var passedProperty = getPropertyName(node);
                var passedMemberExpressionProperty = getPropertyName(node.object);
                var variable;
                var propertyIsAllowed;

                if (context.options.length > 0 && context.options[0].allow) {
                    propertyIsAllowed = (context.options[0].allow.indexOf(passedProperty) > -1);
                }

                // checks console.*() [* means any console method]
                if (node.object.name === "console") {
                    variable = astUtils.getVariableByName(scope, "console");

                    if (!isShadowed(variable) && !propertyIsAllowed) {
                        report(context, node);
                    }

                // checks window.console.*(), self.console.*(), && this.console.*()
                } else if (passedMemberExpressionProperty === "console") {
                    if (context.options.length && context.options[0].disallowGlobals) {
                        var passedObject = node.object.object;
                        var disallowedGlobals = context.options[0].disallowGlobals;

                        switch (passedObject.name) {
                            case "window":
                                variable = astUtils.getVariableByName(scope, "window");
                                if (!isShadowed(variable) && disallowedGlobals.indexOf("window") > -1) {
                                    report(context, node, passedObject.name);
                                }
                                break;
                            case "self":
                                variable = astUtils.getVariableByName(scope, "self");
                                if (!isShadowed(variable) && disallowedGlobals.indexOf("self") > -1) {
                                    report(context, node, passedObject.name);
                                }
                                break;
                            default:
                                if (passedObject.type === "ThisExpression" && scope.type === "global" && disallowedGlobals.indexOf("this") > -1) {
                                    report(context, node, "this");
                                }
                                break;
                        }
                    }
                }
            }
        };
    }
};
