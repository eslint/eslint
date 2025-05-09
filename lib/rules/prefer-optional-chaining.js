/**
 * @fileoverview Rule to prefer optional chaining over &&, || or ?. operators
 * @author GitHub Copilot
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Checks if the expression is a member expression with the same identifier as base
 * @param {ASTNode} expression The expression to check
 * @param {string} identifierName The identifier name to match against
 * @returns {boolean} True if it's a matching member expression
 */
function isMatchingMemberExpression(expression, identifierName) {
	return (
		expression.type === "MemberExpression" &&
		expression.object.type === "Identifier" &&
		expression.object.name === identifierName
	);
}

/**
 * Checks if the expression is a call expression with the same identifier as callee
 * @param {ASTNode} expression The expression to check
 * @param {string} identifierName The identifier name to match against
 * @returns {boolean} True if it's a matching call expression
 */
function isMatchingCallExpression(expression, identifierName) {
	return (
		expression.type === "CallExpression" &&
		expression.callee.type === "Identifier" &&
		expression.callee.name === identifierName
	);
}

/**
 * Checks if a value is nullish (null or undefined)
 * @param {ASTNode} node The node to check
 * @returns {boolean} True if the node represents null or undefined
 */
function isNullish(node) {
	return (
		(node.type === "Literal" && node.value === null) ||
		(node.type === "Identifier" && node.name === "undefined")
	);
}

/**
 * Gets the root object of a member expression chain
 * @param {ASTNode} node The node to check
 * @returns {ASTNode} The root object node
 */
function getRootObject(node) {
	if (node.type !== "MemberExpression") {
		return node;
	}

	return getRootObject(node.object);
}

/**
 * Determines whether a node is a nullish check (using && or != null)
 * @param {ASTNode} node The node to check
 * @returns {boolean} `true` if the node is a nullish check
 */
function isNullishCheck(node) {
	if (node.type === "LogicalExpression" && node.operator === "&&") {
		// Skip non-identifier left sides
		if (node.left.type !== "Identifier") {
			// Valid cases: obj.prop && obj.prop.subprop, a && a.b.c
			if (node.left.type === "MemberExpression") {
				if (node.right.type === "MemberExpression") {
					// Don't consider different property paths like obj.prop && obj.other.prop
					const leftRoot = getRootObject(node.left);
					const rightRoot = getRootObject(node.right);

					// Different root objects, can't be optional chained
					if (
						leftRoot.type !== rightRoot.type ||
						leftRoot.name !== rightRoot.name
					) {
						return false;
					}

					// Skip different property paths
					return false;
				}
			}
			return false;
		}

		const identifierName = node.left.name;

		// Check for obj && obj.prop or obj && obj[key] or obj && obj()
		return (
			isMatchingMemberExpression(node.right, identifierName) ||
			isMatchingCallExpression(node.right, identifierName)
		);
	}

	if (node.type === "ConditionalExpression") {
		// Handle obj != null ? obj.prop : undefined pattern
		if (
			node.test.type !== "BinaryExpression" ||
			(node.test.operator !== "!=" && node.test.operator !== "!==") ||
			node.alternate.type !== "Identifier" ||
			node.alternate.name !== "undefined"
		) {
			return false;
		}

		const { left, right } = node.test;
		let identifier;

		// Find which side is the identifier and ensure the other is a nullish value
		if (left.type === "Identifier" && isNullish(right)) {
			identifier = left;
		} else if (right.type === "Identifier" && isNullish(left)) {
			identifier = right;
		} else {
			return false;
		}

		// Ensure consequent is a property/method call on the same identifier
		if (node.consequent.type === "MemberExpression") {
			return isMatchingMemberExpression(node.consequent, identifier.name);
		}
		if (node.consequent.type === "CallExpression") {
			return isMatchingCallExpression(node.consequent, identifier.name);
		}
	}

	return false;
}

/**
 * Gets the expression from an if statement's consequent body
 * @param {ASTNode} node The if statement node
 * @returns {ASTNode|null} The expression node or null
 */
function getExpressionFromIfConsequent(node) {
	if (node.consequent.type === "ExpressionStatement") {
		return node.consequent.expression;
	}
	if (
		node.consequent.type === "BlockStatement" &&
		node.consequent.body.length === 1 &&
		node.consequent.body[0].type === "ExpressionStatement"
	) {
		return node.consequent.body[0].expression;
	}

	return null;
}

/**
 * Determines whether a node is a conditional check using if statements
 * @param {ASTNode} node The node to check
 * @returns {boolean} `true` if the node is an if statement with a nullish check
 */
function isIfStatementNullishCheck(node) {
	if (node.type !== "IfStatement" || node.test.type !== "Identifier") {
		return false;
	}

	const identifierName = node.test.name;
	const expression = getExpressionFromIfConsequent(node);

	if (!expression) {
		return false;
	}

	// Check if the if statement follows the pattern if(obj) obj.prop or if(obj) obj()
	return (
		isMatchingMemberExpression(expression, identifierName) ||
		isMatchingCallExpression(expression, identifierName)
	);
}

/**
 * Creates a fixer that replaces a logical expression with optional chaining
 * @param {ASTNode} node The node to be fixed
 * @param {SourceCode} sourceCode The source code object
 * @returns {Function} Fixer function
 */
function createFixer(node, sourceCode) {
	/**
	 * Generates the optional chain syntax for a member expression
	 * @param {string} base The base identifier
	 * @param {ASTNode} memberExpr The member expression
	 * @param {Object} fixer The fixer object
	 * @returns {Object} Fix command
	 */
	function fixMemberExpression(base, memberExpr, fixer) {
		const computed = memberExpr.computed;
		const property =
			memberExpr.property.name || sourceCode.getText(memberExpr.property);

		if (computed) {
			return fixer.replaceText(
				node,
				`${base}?.[${property}]${node.type === "IfStatement" ? ";" : ""}`,
			);
		}
		return fixer.replaceText(
			node,
			`${base}?.${property}${node.type === "IfStatement" ? ";" : ""}`,
		);
	}

	/**
	 * Generates the optional chain syntax for a call expression
	 * @param {string} base The base identifier
	 * @param {ASTNode} callExpr The call expression
	 * @param {Object} fixer The fixer object
	 * @returns {Object} Fix command
	 */
	function fixCallExpression(base, callExpr, fixer) {
		const callText = sourceCode.getText(callExpr);
		const callArgs = callText.slice(callText.indexOf("("));
		return fixer.replaceText(
			node,
			`${base}?.${callArgs}${node.type === "IfStatement" ? ";" : ""}`,
		);
	}

	return function (fixer) {
		// Handle logical AND expressions: obj && obj.prop
		if (node.type === "LogicalExpression" && node.operator === "&&") {
			const base = sourceCode.getText(node.left);

			if (node.right.type === "MemberExpression") {
				return fixMemberExpression(base, node.right, fixer);
			}
			if (node.right.type === "CallExpression") {
				return fixCallExpression(base, node.right, fixer);
			}
		}
		// Handle conditional expressions: obj != null ? obj.prop : undefined
		else if (node.type === "ConditionalExpression") {
			const base =
				node.test.left.type === "Identifier"
					? node.test.left.name
					: node.test.right.name;

			if (node.consequent.type === "MemberExpression") {
				return fixMemberExpression(base, node.consequent, fixer);
			}
			if (node.consequent.type === "CallExpression") {
				return fixCallExpression(base, node.consequent, fixer);
			}
		}
		// Handle if statements: if (obj) obj.prop
		else if (node.type === "IfStatement") {
			const base = sourceCode.getText(node.test);
			const expression = getExpressionFromIfConsequent(node);

			if (expression.type === "MemberExpression") {
				return fixMemberExpression(base, expression, fixer);
			}
			if (expression.type === "CallExpression") {
				return fixCallExpression(base, expression, fixer);
			}
		}

		return null;
	};
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "suggestion",

		docs: {
			description:
				"Require using optional chaining instead of &&, || or ternary operators",
			recommended: false,
			frozen: true,
			url: "https://eslint.org/docs/latest/rules/prefer-optional-chaining",
		},

		schema: [],
		fixable: "code",

		messages: {
			preferOptionalChain:
				"Use optional chaining '?.' instead of logical chaining.",
		},
	},

	create(context) {
		const sourceCode = context.sourceCode;

		return {
			LogicalExpression(node) {
				if (isNullishCheck(node)) {
					context.report({
						node,
						messageId: "preferOptionalChain",
						fix: createFixer(node, sourceCode),
					});
				}
			},
			ConditionalExpression(node) {
				if (isNullishCheck(node)) {
					context.report({
						node,
						messageId: "preferOptionalChain",
						fix: createFixer(node, sourceCode),
					});
				}
			},
			IfStatement(node) {
				if (isIfStatementNullishCheck(node)) {
					context.report({
						node,
						messageId: "preferOptionalChain",
						fix: createFixer(node, sourceCode),
					});
				}
			},
		};
	},
};
