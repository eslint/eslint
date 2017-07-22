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
    delete node.start;
    delete node.end;
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
