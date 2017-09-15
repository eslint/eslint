/**
 * @fileoverview Rule to flag references to undeclared variables.
 * @author Mark Macdonald
 */
"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Checks if the given node is the argument of a typeof operator.
 * @param {ASTNode} node The AST node being checked.
 * @returns {boolean} Whether or not the node is the argument of a typeof operator.
 */
function hasTypeOfOperator(node) {
    const parent = node.parent;

    return parent.type === "UnaryExpression" && parent.operator === "typeof";
}

/**
 * Checks if the expression represented by the provided node asserts that
 * the provided identifier is or isn't defined before using the identifier.
 *
 * @param {ASTNode} node The AST node being checked.
 * @param {string} identifierName The name of the identifier whose (lack of)
 *                                existence may be being asserted.
 * @param {boolearn} shouldBeDefined Whether to check that the expression asserts
 *                                   that the variable exists, or to check that
 *                                   it asserts that the variable does not exist.
 * @returns {boolean} Whether or not the expression asserts whether the
 *                               identifier is defined.
 */
function assertsOnExistence(node, identifierName, shouldBeDefined) {
    if (node.type === "LogicalExpression") {
        return node.operator === "&&"
            ? (assertsOnExistence(node.left, identifierName, shouldBeDefined) ||
                assertsOnExistence(node.right, identifierName, shouldBeDefined))
            : false;
    }

    const isBinaryExpression = node.type === "BinaryExpression";
    const checksTypeofIdentifierAgainstLiteral =
        node.left.type === "UnaryExpression" &&
        node.left.operator === "typeof" &&
        node.left.argument.type === "Identifier" &&
        node.left.argument.name === identifierName &&
        node.right.type === "Literal";

    const operator = node.operator;
    const value = node.right.value;

    return isBinaryExpression && checksTypeofIdentifierAgainstLiteral &&
        (shouldBeDefined
            ? (((operator === "==" || operator === "===") && value !== "undefined") ||
                ((operator === "!=" || operator === "!==") && value === "undefined"))
            : (operator === "==" || operator === "===") && value === "undefined");
}

/**
 * @param {ASTNode} node The AST node being checked, representing an indentifier.
 * @returns {boolean} Whether or not the code checks earlier in the expression that the identifier is defined.
 */
function isGuardedUsage(node) {
    const origIdentifierName = node.name;
    const expressionContainers = [
        "ExpressionStatement",
        "WithStatement",
        "ReturnStatement",
        "IfStatement",
        "SwitchStatement",
        "SwitchCase",
        "ThrowStatement",
        "WhileStatement",
        "DoWhileStatement",
        "ForStatement",
        "ForInStatement",
        "ForOfStatement",
        "VariableDeclarator"
    ];

    let prevNode = null;

    while (node.parent && expressionContainers.indexOf(node.parent.type) === -1) {
        prevNode = node;
        node = node.parent;

        if (node.type === "LogicalExpression") {
            const mayBeGuarded = node.operator === "&&" && node.right === prevNode;

            if (mayBeGuarded && assertsOnExistence(node.left, origIdentifierName, true)) {
                return true;
            }
        }

        if (node.type === "ConditionalExpression") {
            const assertsExists = assertsOnExistence(node.test, origIdentifierName, true);
            const assertsDoesntExist = assertsOnExistence(node.test, origIdentifierName, false);

            if ((assertsExists && node.consequent === prevNode) || (assertsDoesntExist && node.alternate === prevNode)) {
                return true;
            }
        }
    }

    return false;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow the use of undeclared variables unless mentioned in `/*global */` comments",
            category: "Variables",
            recommended: true
        },

        schema: [
            {
                type: "object",
                properties: {
                    typeof: {
                        type: "boolean"
                    }
                },
                additionalProperties: false
            }
        ]
    },

    create(context) {
        const options = context.options[0];
        const considerTypeOf = options && options.typeof === true || false;

        return {
            "Program:exit"(/* node */) {
                const globalScope = context.getScope();

                globalScope.through.forEach(ref => {
                    const identifier = ref.identifier;

                    if (!considerTypeOf && hasTypeOfOperator(identifier)) {
                        return;
                    }

                    if (!considerTypeOf && isGuardedUsage(identifier)) {
                        return;
                    }


                    context.report({
                        node: identifier,
                        message: "'{{name}}' is not defined.",
                        data: identifier
                    });
                });
            }
        };
    }
};
