"use strict";

const evk = require("eslint-visitor-keys");
const recast = require("recast");
const espree = require("espree");
const assert = require("assert");

/**
 * Determines whether an AST node could be an expression, based on the type
 * @param {ASTNode} node The node
 * @returns {boolean} `true` if the node could be an expression
 */
function isMaybeExpression(node) {
    return node.type.endsWith("Expression") ||
        node.type === "Identifier" ||
        node.type === "MetaProperty" ||
        node.type.endsWith("Literal");
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
                sourceType: "script"
            })
    },
    visitorKeys = evk.KEYS
}) {
    let counter = 0;

    /**
     * Returns a new unique identifier
     * @returns {string} A name for a new identifier
     */
    function generateNewIdentifierName() {
        return `$${(counter++)}`;
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

    assert(reproducesBadCase(sourceText), "Original source text should reproduce issue");
    const parseResult = recast.parse(sourceText, { parser });

    /**
     * Recursively removes descendant subtrees of the given AST node and replaces
     * them with simplified variants to produce a simplified AST which is still considered "bad".
     * @param {ASTNode} node An AST node to prune. May be mutated by this call, but the
     * resulting AST will still produce "bad" source code.
     * @returns {void}
     */
    function pruneIrrelevantSubtrees(node) {
        for (const key of visitorKeys[node.type]) {
            if (Array.isArray(node[key])) {
                for (let index = node[key].length - 1; index >= 0; index--) {
                    const [childNode] = node[key].splice(index, 1);

                    if (!reproducesBadCase(recast.print(parseResult).code)) {
                        node[key].splice(index, 0, childNode);
                        if (childNode) {
                            pruneIrrelevantSubtrees(childNode);
                        }
                    }
                }
            } else if (typeof node[key] === "object" && node[key] !== null) {

                const childNode = node[key];

                if (isMaybeExpression(childNode)) {
                    node[key] = { type: "Identifier", name: generateNewIdentifierName(), range: childNode.range };
                    if (!reproducesBadCase(recast.print(parseResult).code)) {
                        node[key] = childNode;
                        pruneIrrelevantSubtrees(childNode);
                    }
                } else if (isStatement(childNode)) {
                    node[key] = { type: "EmptyStatement", range: childNode.range };
                    if (!reproducesBadCase(recast.print(parseResult).code)) {
                        node[key] = childNode;
                        pruneIrrelevantSubtrees(childNode);
                    }
                }
            }
        }
    }

    /**
     * Recursively tries to extract a descendant node from the AST that is "bad" on its own
     * @param {ASTNode} node A node which produces "bad" source code
     * @returns {ASTNode} A descendent of `node` which is also bad
     */
    function extractRelevantChild(node) {
        const childNodes = visitorKeys[node.type]
            .flatMap(key => (Array.isArray(node[key]) ? node[key] : [node[key]]));

        for (const childNode of childNodes) {
            if (!childNode) {
                continue;
            }

            if (isMaybeExpression(childNode)) {
                if (reproducesBadCase(recast.print(childNode).code)) {
                    return extractRelevantChild(childNode);
                }

            } else if (isStatement(childNode)) {
                if (reproducesBadCase(recast.print(childNode).code)) {
                    return extractRelevantChild(childNode);
                }
            } else {
                const childResult = extractRelevantChild(childNode);

                if (reproducesBadCase(recast.print(childResult).code)) {
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
        const ast = parser.parse(text);

        if (ast.comments) {
            for (const comment of ast.comments) {
                for (const potentialSimplification of [

                    // Try deleting the comment
                    `${text.slice(0, comment.range[0])}${text.slice(comment.range[1])}`,

                    // Try replacing the comment with a space
                    `${text.slice(0, comment.range[0])} ${text.slice(comment.range[1])}`,

                    // Try deleting the contents of the comment
                    text.slice(0, comment.range[0] + 2) + text.slice(comment.type === "Block" ? comment.range[1] - 2 : comment.range[1])
                ]) {
                    if (reproducesBadCase(potentialSimplification)) {
                        return removeIrrelevantComments(potentialSimplification);
                    }
                }
            }
        }

        return text;
    }

    pruneIrrelevantSubtrees(parseResult.program);
    const relevantChild = recast.print(extractRelevantChild(parseResult.program)).code;

    assert(reproducesBadCase(relevantChild), "Extracted relevant source text should reproduce issue");
    const result = removeIrrelevantComments(relevantChild);

    assert(reproducesBadCase(result), "Source text with irrelevant comments removed should reproduce issue");
    return result;
}

module.exports = reduceBadExampleSize;
