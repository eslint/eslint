"use strict";

/** @typedef {import("../lib/types").Linter.Parser} Parser */

const evk = require("eslint-visitor-keys");
const espree = require("espree");
const assert = require("node:assert");

/**
 * Determines whether an AST node could be an expression, based on the type
 * @param {ASTNode} node The node
 * @returns {boolean} `true` if the node could be an expression
 */
function isMaybeExpression(node) {
	return (
		node.type.endsWith("Expression") ||
		node.type === "Identifier" ||
		node.type === "MetaProperty" ||
		node.type.endsWith("Literal")
	);
}

/**
 * Determines whether an AST node is a statement
 * @param {ASTNode} node The node
 * @returns {boolean} `true` if the node is a statement
 */
function isStatement(node) {
	return node.type.endsWith("Statement") || node.type.endsWith("Declaration");
}

/**
 * Given "bad" source text (e.g. an code sample that causes a rule to crash), tries to return a smaller
 * piece of source text which is also "bad", to make it easier for a human to figure out where the
 * problem is.
 * @param {Object} options Options to process
 * @param {string} options.sourceText Initial piece of "bad" source text
 * @param {function(string): boolean} options.predicate A predicate that returns `true` for bad source text and `false` for good source text
 * @param {Parser} [options.parser] The parser used to parse the source text. Defaults to a modified
 * version of espree that uses recent parser options.
 * @param {Object} [options.visitorKeys] The visitor keys of the AST. Defaults to eslint-visitor-keys.
 * @returns {string} Another piece of "bad" source text, which may or may not be smaller than the original source text.
 */
function reduceBadExampleSize({
	sourceText,
	predicate,
	parser = {
		parse: (code, options) =>
			espree.parse(code, {
				...options,
				loc: true,
				range: true,
				raw: true,
				tokens: true,
				comment: true,
				eslintVisitorKeys: true,
				eslintScopeManager: true,
				ecmaVersion: espree.latestEcmaVersion,
				sourceType: "script",
			}),
	},
	visitorKeys = evk.KEYS,
}) {
	let counter = 0;

	/**
	 * Returns a new unique identifier
	 * @returns {string} A name for a new identifier
	 */
	function generateNewIdentifierName() {
		return `$${counter++}`;
	}

	/**
	 * Determines whether a source text sample is "bad"
	 * @param {string} updatedSourceText The sample
	 * @returns {boolean} `true` if the sample is "bad"
	 */
	function reproducesBadCase(updatedSourceText) {
		try {
			parser.parse(updatedSourceText);
		} catch {
			return false;
		}

		return predicate(updatedSourceText);
	}

	assert(
		reproducesBadCase(sourceText),
		"Original source text should reproduce issue",
	);
	const ast = parser.parse(sourceText);

	/*
	 * Track committed source-text modifications as { start, end, replacement } objects.
	 * All modifications are non-overlapping — the algorithm only modifies a subtree after
	 * deciding not to remove its ancestor, so ranges at different recursion levels are disjoint.
	 */
	const modifications = [];

	/**
	 * Applies all committed modifications (plus an optional pending one) to the
	 * original source text and returns the result. Modifications are applied in
	 * reverse source order so that each offset remains valid when applied.
	 * @param {{ start: number, end: number, replacement: string } | null} [pendingMod] An uncommitted modification to include in this preview
	 * @returns {string} The modified source text
	 */
	function buildSource(pendingMod) {
		const allMods = pendingMod
			? [...modifications, pendingMod]
			: [...modifications];

		allMods.sort((a, b) => b.start - a.start);

		let result = sourceText;

		for (const { start, end, replacement } of allMods) {
			result = result.slice(0, start) + replacement + result.slice(end);
		}

		return result;
	}

	/**
	 * Recursively removes descendant subtrees of the given AST node and replaces
	 * them with simplified variants to produce simplified source which is still "bad".
	 * Committed modifications are recorded in {@link modifications}; the AST is also
	 * mutated so that traversal state stays consistent with the committed changes.
	 * @param {ASTNode} node An AST node to prune.
	 * @returns {void}
	 */
	function pruneIrrelevantSubtrees(node) {
		for (const key of visitorKeys[node.type] ?? []) {
			if (Array.isArray(node[key])) {
				for (let index = node[key].length - 1; index >= 0; index--) {
					const childNode = node[key][index];

					if (!childNode) {
						continue;
					}

					const mod = {
						start: childNode.range[0],
						end: childNode.range[1],
						replacement: "",
					};

					if (reproducesBadCase(buildSource(mod))) {
						modifications.push(mod);
						node[key].splice(index, 1);
					} else {
						pruneIrrelevantSubtrees(childNode);
					}
				}
			} else if (typeof node[key] === "object" && node[key] !== null) {
				const childNode = node[key];

				if (isMaybeExpression(childNode)) {
					const name = generateNewIdentifierName();
					const mod = {
						start: childNode.range[0],
						end: childNode.range[1],
						replacement: name,
					};

					if (reproducesBadCase(buildSource(mod))) {
						modifications.push(mod);
						node[key] = {
							type: "Identifier",
							name,
							range: childNode.range,
						};
					} else {
						pruneIrrelevantSubtrees(childNode);
					}
				} else if (isStatement(childNode)) {
					const mod = {
						start: childNode.range[0],
						end: childNode.range[1],
						replacement: ";",
					};

					if (reproducesBadCase(buildSource(mod))) {
						modifications.push(mod);
						node[key] = {
							type: "EmptyStatement",
							range: childNode.range,
						};
					} else {
						pruneIrrelevantSubtrees(childNode);
					}
				}
			}
		}
	}

	/**
	 * Recursively tries to extract a descendant node from the AST that is "bad" on its own.
	 * Uses source-range slicing instead of code generation, so it works for every node type.
	 * @param {ASTNode} node A node which produces "bad" source code
	 * @param {string} source The source text whose ranges match `node`
	 * @returns {ASTNode} A descendant of `node` which is also bad (or `node` itself)
	 */
	function extractRelevantChild(node, source) {
		const childNodes = (visitorKeys[node.type] ?? []).flatMap(key =>
			Array.isArray(node[key]) ? node[key] : [node[key]],
		);

		for (const childNode of childNodes) {
			if (!childNode) {
				continue;
			}

			if (isMaybeExpression(childNode) || isStatement(childNode)) {
				const childSource = source.slice(
					childNode.range[0],
					childNode.range[1],
				);

				if (reproducesBadCase(childSource)) {
					return extractRelevantChild(childNode, source);
				}
			} else {
				const childResult = extractRelevantChild(childNode, source);
				const childResultSource = source.slice(
					childResult.range[0],
					childResult.range[1],
				);

				if (reproducesBadCase(childResultSource)) {
					return childResult;
				}
			}
		}
		return node;
	}

	/**
	 * Removes and simplifies comments from the source text
	 * @param {string} text A piece of "bad" source text
	 * @returns {string} A piece of "bad" source text with fewer and/or simpler comments.
	 */
	function removeIrrelevantComments(text) {
		const textAst = parser.parse(text);

		if (textAst.comments) {
			for (const comment of textAst.comments) {
				for (const potentialSimplification of [
					// Try deleting the comment
					`${text.slice(0, comment.range[0])}${text.slice(comment.range[1])}`,

					// Try replacing the comment with a space
					`${text.slice(0, comment.range[0])} ${text.slice(comment.range[1])}`,

					// Try deleting the contents of the comment
					text.slice(0, comment.range[0] + 2) +
						text.slice(
							comment.type === "Block"
								? comment.range[1] - 2
								: comment.range[1],
						),
				]) {
					if (reproducesBadCase(potentialSimplification)) {
						return removeIrrelevantComments(
							potentialSimplification,
						);
					}
				}
			}
		}

		return text;
	}

	pruneIrrelevantSubtrees(ast);

	// Re-parse the pruned source so that node ranges match the pruned text.
	const prunedSource = buildSource();
	const prunedAst = parser.parse(prunedSource);
	const relevantNode = extractRelevantChild(prunedAst, prunedSource);
	const relevantChild = prunedSource.slice(
		relevantNode.range[0],
		relevantNode.range[1],
	);

	assert(
		reproducesBadCase(relevantChild),
		"Extracted relevant source text should reproduce issue",
	);
	const result = removeIrrelevantComments(relevantChild);

	assert(
		reproducesBadCase(result),
		"Source text with irrelevant comments removed should reproduce issue",
	);
	return result;
}

module.exports = reduceBadExampleSize;
