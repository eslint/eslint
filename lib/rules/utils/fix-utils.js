/**
 * @fileoverview Common utils for fixes.
 * @author Pixel998
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./ast-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Checks whether the given node is an identifier, `this`, `super`, a meta property, or a chain
 * of property accesses starting from one of them, which can be repeated without side effects.
 * @param {ASTNode} node The node to check.
 * @returns {boolean} `true` if the node is a simple reference.
 */
function isSimpleReference(node) {
	switch (node.type) {
		case "Identifier":
		case "MetaProperty":
		case "Super":
		case "ThisExpression":
			return true;

		case "ChainExpression":
			return isSimpleReference(node.expression);

		case "MemberExpression":
			return (
				isSimpleReference(node.object) &&
				(!node.computed ||
					node.property.type === "Literal" ||
					isSimpleReference(node.property))
			);

		default:
			return false;
	}
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Creates fixes that turn a loose comparison with `null` into strict comparisons with both `null` and `undefined`.
 * @param {RuleFixer} fixer The fixer object.
 * @param {SourceCode} sourceCode The source code object.
 * @param {ASTNode} node The `BinaryExpression` node to fix.
 * @returns {Iterable<Fix>} The fixes, or none if the node is not a loose comparison with `null` or cannot be safely fixed.
 */
function* addUndefinedComparison(fixer, sourceCode, node) {
	const isNullOnRight = astUtils.isNullLiteral(node.right);

	if (
		(node.operator !== "==" && node.operator !== "!=") ||
		(!isNullOnRight && !astUtils.isNullLiteral(node.left))
	) {
		return;
	}

	const operand = isNullOnRight ? node.left : node.right;
	const isUndefinedGlobal =
		astUtils.getVariableByName(sourceCode.getScope(node), "undefined")?.defs
			.length === 0;

	if (!isSimpleReference(operand) || !isUndefinedGlobal) {
		return;
	}

	const expectedOperator = `${node.operator}=`;
	const operatorToken = sourceCode.getFirstTokenBetween(
		node.left,
		node.right,
		token => token.value === node.operator,
	);
	const logicalOperator = node.operator === "==" ? "||" : "&&";
	const operandText = sourceCode.getText(operand);
	const undefinedComparison = isNullOnRight
		? `${operandText} ${expectedOperator} undefined`
		: `undefined ${expectedOperator} ${operandText}`;
	const needsParens =
		!astUtils.isParenthesised(sourceCode, node) &&
		(node.parent.type === "BinaryExpression" ||
			(node.parent.type === "LogicalExpression" &&
				node.parent.operator !== logicalOperator));

	if (needsParens) {
		yield fixer.insertTextBefore(
			node,
			astUtils.isStartOfExpressionStatement(node) &&
				astUtils.needsPrecedingSemicolon(sourceCode, node)
				? ";("
				: "(",
		);
	}

	yield fixer.replaceText(operatorToken, expectedOperator);
	yield fixer.insertTextAfter(
		node,
		` ${logicalOperator} ${undefinedComparison}${needsParens ? ")" : ""}`,
	);
}

module.exports = { addUndefinedComparison };
