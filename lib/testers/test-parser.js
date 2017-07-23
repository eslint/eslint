/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 */
"use strict";

const espree = require("espree");
const Traverser = require("../util/traverser");

/**
 * Remove `start`/`end` properties from the given node.
 * @param {ASTNode} node The node to remove.
 * @returns {void}
 */
function removeStartEnd(node) {
    Object.defineProperty(node, "start", {
        get() {
            throw new Error("Use node.range[0] instead of node.start");
        },
        configurable: true,
        enumerable: false
    });
    Object.defineProperty(node, "end", {
        get() {
            throw new Error("Use node.range[1] instead of node.end");
        },
        configurable: true,
        enumerable: false
    });
}

/**
 * Remove `start`/`end` properties from all nodes of the given AST.
 * @param {ASTNode} ast The root node to remove `start`/`end` properties.
 * @returns {void}
 */
function removeStartEndInTree(ast) {
    new Traverser().traverse(ast, {
        enter: removeStartEnd
    });

    for (const token of ast.tokens) {
        removeStartEnd(token);
    }
    for (const comment of ast.comments) {
        removeStartEnd(comment);
    }
}

module.exports.parse = (code, options) => {
    const ret = espree.parse(code, options);

    removeStartEndInTree(ret.ast || ret);

    return ret;
};
