/**
 * @fileoverview Rule to flag declared but unused private class members
 * @author Tim van der Lippe
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "problem",
		hasSuggestions: true,

		docs: {
			description: "Disallow unused private class members",
			recommended: true,
			url: "https://eslint.org/docs/latest/rules/no-unused-private-class-members",
		},

		schema: [],

		messages: {
			unusedPrivateClassMember:
				"'{{classMemberName}}' is defined but never used.",
			removeUnusedPrivateClassMember:
				"Remove unused private class member '{{classMemberName}}'.",
		},
	},

	create(context) {
		const sourceCode = context.sourceCode;
		const trackedClasses = [];

		/**
		 * Gets the start index of the line that contains a given token or node.
		 * @param {ASTNode|Token|Comment} nodeOrToken The token or node to check
		 * @returns {number} The line start index
		 */
		function getLineStartIndex(nodeOrToken) {
			return nodeOrToken.range[0] - nodeOrToken.loc.start.column;
		}

		/**
		 * Checks whether a token or node starts on its own line, preceded only by whitespace.
		 * @param {ASTNode|Token|Comment} nodeOrToken The token or node to check
		 * @returns {boolean} Whether the token or node starts on its own line
		 */
		function startsOnOwnLine(nodeOrToken) {
			return (
				sourceCode.getTokenBefore(nodeOrToken, {
					includeComments: true,
				}).loc.end.line !== nodeOrToken.loc.start.line
			);
		}

		/**
		 * Gets leading comments that are directly attached to a class member.
		 * @param {ASTNode} classMemberNode The class member node
		 * @returns {Comment[]} Leading comments to remove with the member
		 */
		function getLeadingComments(classMemberNode) {
			const commentsBefore =
				sourceCode.getCommentsBefore(classMemberNode);
			const lastNonLeadingCommentIndex = commentsBefore.findLastIndex(
				(comment, index, self) => {
					const next =
						index < self.length - 1
							? self[index + 1]
							: classMemberNode;

					return (
						!startsOnOwnLine(comment) ||
						next.loc.start.line - comment.loc.end.line > 1
					);
				},
			);

			return commentsBefore.slice(lastNonLeadingCommentIndex + 1);
		}

		/**
		 * Checks whether a class member shares its line with another token.
		 * @param {ASTNode} classMemberNode The class member node
		 * @returns {boolean} Whether the member shares its line with another token
		 */
		function sharesLineWithAnotherToken(classMemberNode) {
			const previousToken = sourceCode.getTokenBefore(classMemberNode);
			const nextToken = sourceCode.getTokenAfter(classMemberNode);

			return (
				previousToken.loc.end.line === classMemberNode.loc.start.line ||
				nextToken.loc.start.line === classMemberNode.loc.end.line
			);
		}

		/**
		 * Gets trailing comments that are directly attached to a class member.
		 * Same-line trailing comments are preserved when another token shares
		 * the line, because the comment might describe the remaining code rather
		 * than the unused member alone.
		 * @param {ASTNode} classMemberNode The class member node
		 * @returns {Comment[]} Trailing comments to remove with the member
		 */
		function getTrailingComments(classMemberNode) {
			if (sharesLineWithAnotherToken(classMemberNode)) {
				return [];
			}

			return sourceCode
				.getCommentsAfter(classMemberNode)
				.filter(
					comment =>
						comment.loc.start.line === classMemberNode.loc.end.line,
				);
		}

		/**
		 * Gets the token after which a semicolon should be inserted when removing a class member.
		 * @param {ASTNode} classMemberNode The member that would be removed
		 * @returns {Token|null} The token after which a semicolon should be inserted, or null if no semicolon is needed
		 */
		function getSemicolonInsertionToken(classMemberNode) {
			const nextToken = sourceCode.getTokenAfter(classMemberNode);

			if (
				astUtils.canContinueExpressionInClassBody(nextToken) &&
				astUtils.needsPrecedingSemicolon(sourceCode, classMemberNode)
			) {
				return sourceCode.getTokenBefore(classMemberNode);
			}

			return null;
		}

		/**
		 * Gets the replacement range for removing an unused class member.
		 * @param {ASTNode} classMemberNode The member that would be removed
		 * @returns {number[]} The text range to remove
		 */
		function getMemberRemovalRange(classMemberNode) {
			const leadingComments = getLeadingComments(classMemberNode);
			const trailingComments = getTrailingComments(classMemberNode);
			const shouldRemoveLeadingComments =
				leadingComments.length > 0 &&
				!sharesLineWithAnotherToken(classMemberNode);
			const lastItemToRemove =
				trailingComments.length > 0
					? trailingComments.at(-1)
					: classMemberNode;

			const previousToken = sourceCode.getTokenBefore(classMemberNode);
			const nextToken = sourceCode.getTokenAfter(lastItemToRemove, {
				includeComments: true,
			});
			const nextTokenStartsOnNewLine =
				nextToken.loc.start.line > lastItemToRemove.loc.end.line;
			const shouldRemoveOwnLine =
				!shouldRemoveLeadingComments &&
				startsOnOwnLine(classMemberNode) &&
				nextTokenStartsOnNewLine;
			let start = classMemberNode.range[0];
			let end = lastItemToRemove.range[1];

			if (shouldRemoveLeadingComments) {
				start = nextTokenStartsOnNewLine
					? getLineStartIndex(leadingComments[0])
					: leadingComments[0].range[0];
				end = nextTokenStartsOnNewLine
					? getLineStartIndex(nextToken)
					: nextToken.range[0];
			} else if (shouldRemoveOwnLine) {
				start = getLineStartIndex(classMemberNode);
				end = getLineStartIndex(nextToken);
			} else if (
				previousToken.loc.end.line === classMemberNode.loc.start.line
			) {
				start = previousToken.range[1];
			} else if (
				nextToken.loc.start.line === lastItemToRemove.loc.end.line
			) {
				end = nextToken.range[0];
			}

			return [start, end];
		}

		/**
		 * Check whether the current node is in a write only assignment.
		 * @param {ASTNode} privateIdentifierNode Node referring to a private identifier
		 * @returns {boolean} Whether the node is in a write only assignment
		 * @private
		 */
		function isWriteOnlyAssignment(privateIdentifierNode) {
			const parentStatement = privateIdentifierNode.parent.parent;
			const isAssignmentExpression =
				parentStatement.type === "AssignmentExpression";

			if (
				!isAssignmentExpression &&
				parentStatement.type !== "ForInStatement" &&
				parentStatement.type !== "ForOfStatement" &&
				parentStatement.type !== "AssignmentPattern"
			) {
				return false;
			}

			// It is a write-only usage, since we still allow usages on the right for reads
			if (parentStatement.left !== privateIdentifierNode.parent) {
				return false;
			}

			// For any other operator (such as '+=') we still consider it a read operation
			if (isAssignmentExpression && parentStatement.operator !== "=") {
				/*
				 * However, if the read operation is "discarded" in an empty statement, then
				 * we consider it write only.
				 */
				return parentStatement.parent.type === "ExpressionStatement";
			}

			return true;
		}

		//--------------------------------------------------------------------------
		// Public
		//--------------------------------------------------------------------------

		return {
			// Collect all declared members up front and assume they are all unused
			ClassBody(classBodyNode) {
				const privateMembers = new Map();

				trackedClasses.unshift(privateMembers);
				for (const bodyMember of classBodyNode.body) {
					if (
						bodyMember.type === "PropertyDefinition" ||
						bodyMember.type === "MethodDefinition"
					) {
						if (bodyMember.key.type === "PrivateIdentifier") {
							privateMembers.set(bodyMember.key.name, {
								declaredNode: bodyMember,
								hasReference: false,
								isAccessor:
									bodyMember.type === "MethodDefinition" &&
									(bodyMember.kind === "set" ||
										bodyMember.kind === "get"),
							});
						}
					}
				}
			},

			/*
			 * Process all usages of the private identifier and remove a member from
			 * `declaredAndUnusedPrivateMembers` if we deem it used.
			 */
			PrivateIdentifier(privateIdentifierNode) {
				const classBody = trackedClasses.find(classProperties =>
					classProperties.has(privateIdentifierNode.name),
				);

				// Can't happen, as it is a parser to have a missing class body, but let's code defensively here.
				if (!classBody) {
					return;
				}

				// In case any other usage was already detected, we can short circuit the logic here.
				const memberDefinition = classBody.get(
					privateIdentifierNode.name,
				);

				if (memberDefinition.isUsed) {
					return;
				}

				// The definition of the class member itself
				if (
					privateIdentifierNode.parent.type ===
						"PropertyDefinition" ||
					privateIdentifierNode.parent.type === "MethodDefinition"
				) {
					return;
				}

				memberDefinition.hasReference = true;

				/*
				 * Any usage of an accessor is considered a read, as the getter/setter can have
				 * side-effects in its definition.
				 */
				if (memberDefinition.isAccessor) {
					memberDefinition.isUsed = true;
					return;
				}

				// Any assignments to this member, except for assignments that also read
				if (isWriteOnlyAssignment(privateIdentifierNode)) {
					return;
				}

				const wrappingExpressionType =
					privateIdentifierNode.parent.parent.type;
				const parentOfWrappingExpressionType =
					privateIdentifierNode.parent.parent.parent.type;

				// A statement which only increments (`this.#x++;`)
				if (
					wrappingExpressionType === "UpdateExpression" &&
					parentOfWrappingExpressionType === "ExpressionStatement"
				) {
					return;
				}

				/*
				 * ({ x: this.#usedInDestructuring } = bar);
				 *
				 * But should treat the following as a read:
				 * ({ [this.#x]: a } = foo);
				 */
				if (
					wrappingExpressionType === "Property" &&
					parentOfWrappingExpressionType === "ObjectPattern" &&
					privateIdentifierNode.parent.parent.value ===
						privateIdentifierNode.parent
				) {
					return;
				}

				// [...this.#unusedInRestPattern] = bar;
				if (wrappingExpressionType === "RestElement") {
					return;
				}

				// [this.#unusedInAssignmentPattern] = bar;
				if (wrappingExpressionType === "ArrayPattern") {
					return;
				}

				/*
				 * We can't delete the memberDefinition, as we need to keep track of which member we are marking as used.
				 * In the case of nested classes, we only mark the first member we encounter as used. If you were to delete
				 * the member, then any subsequent usage could incorrectly mark the member of an encapsulating parent class
				 * as used, which is incorrect.
				 */
				memberDefinition.isUsed = true;
			},

			/*
			 * Post-process the class members and report any remaining members.
			 * Since private members can only be accessed in the current class context,
			 * we can safely assume that all usages are within the current class body.
			 */
			"ClassBody:exit"() {
				const unusedPrivateMembers = trackedClasses.shift();

				for (const [
					classMemberName,
					{ declaredNode, hasReference, isUsed },
				] of unusedPrivateMembers.entries()) {
					if (isUsed) {
						continue;
					}

					context.report({
						node: declaredNode,
						loc: declaredNode.key.loc,
						messageId: "unusedPrivateClassMember",
						data: {
							classMemberName: `#${classMemberName}`,
						},
						suggest: [
							{
								messageId: "removeUnusedPrivateClassMember",
								data: {
									classMemberName: `#${classMemberName}`,
								},
								*fix(fixer) {
									if (hasReference) {
										return;
									}

									const removalRange =
										getMemberRemovalRange(declaredNode);
									const semicolonInsertionToken =
										getSemicolonInsertionToken(
											declaredNode,
										);
									const removalFix = fixer.replaceTextRange(
										removalRange,
										"",
									);

									yield removalFix;

									if (semicolonInsertionToken) {
										yield fixer.insertTextAfter(
											semicolonInsertionToken,
											";",
										);
									}
								},
							},
						],
					});
				}
			},
		};
	},
};
