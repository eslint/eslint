/**
 * @fileoverview Attaches comments to the AST in the spots that ESLint expects.
 *      This logic is based on code from estraverse(https://github.com/estools/estraverse)
 * @author Nicholas C. Zakas
 * @copyright 2014 Nicholas C. Zakas. All rights reserved.
 */
/*
  Copyright (C) 2012-2013 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*eslint no-underscore-dangle:0 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var estraverse = require("estraverse-fb"),
    deepCopy = require("deepcopy"),
    debug = require("debug");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

debug = debug("eslint:attach-comments");


// based on LLVM libc++ upper_bound / lower_bound
// MIT License
/**
 * Finds the last item in the array that matches a given condition.
 * Based on LLVM libc++ upper_bound/lower_bound (MIT License)
 * @param {Array} array The array to search.
 * @param {Function} func The function that indicates when an item is bounds.
 * @returns {int} The index in the array of the last matching item.
 * @private
 */
function upperBound(array, func) {
    var diff,
        len,
        i,
        current;

    len = array.length;
    i = 0;

    while (len) {
        diff = len >>> 1;
        current = i + diff;

        if (func(array[current])) {
            len = diff;
        } else {
            i = current + 1;
            len -= diff + 1;
        }
    }

    return i;
}

/**
 * Extends a comment's calculate range so that it takes the space between tokens.
 * This makes it easier for the traversal to know which comments belong to which
 * nodes.
 * @param {Object} comment The comment object.
 * @param {Object[]} tokens The array of tokens to search.
 * @returns {Object} The comment object.
 * @private
 */
function extendCommentRange(comment, tokens) {
    var target;

    target = upperBound(tokens, function search(token) {
        return token.range[0] > comment.range[0];
    });


    comment._blockBoundary = (!!tokens[target] && tokens[target].value === "}");

    comment.extendedRange = [comment.range[0], comment.range[1]];

    if (target !== tokens.length) {
        comment.extendedRange[1] = tokens[target].range[0];
    }


    target -= 1;
    if (target >= 0) {
        comment.extendedRange[0] = tokens[target].range[1];
    }

    return comment;
}

//------------------------------------------------------------------------------
// Public
//------------------------------------------------------------------------------

/**
 * Attaches comments to their appropriate locations in the AST. This follows the
 * attachment scheme as it was in Esprima 1.2.2.
 * @param {ASTNode} tree The root AST node for a program.
 * @param {Object[]} providedComments Array of comments found in the program.
 * @param {Object[]} tokens Array of tokens for the program.
 * @returns {ASTNode} The first argument.
 */
module.exports = function(tree, providedComments, tokens) {

    var controller = new estraverse.Controller(),
        comments = [],
        len,
        i,
        cursor;

    if (!tree.range) {
        throw new Error("attachComments needs range information");
    }

    if (providedComments.length === 0) {
        debug("No comments provided, exiting");
        return tree;
    }

    for (i = 0, len = providedComments.length; i < len; i += 1) {
        comments.push(extendCommentRange(deepCopy(providedComments[i]), tokens));
    }

    // This is based on John Freeman's implementation.
    cursor = 0;

    controller.traverse(tree, {
        enter: function (node) {
            var comment;

            debug("Evaluating " + node.type + " for leading comments");

            if (node.type === "Program" && node.body.length > 0) {
                debug("Non-empty program, skipping to next node");
                return;
            }

            while (cursor < comments.length) {
                comment = comments[cursor];

                // means the comment is after the node
                if (comment.extendedRange[1] > node.range[0]) {
                    debug("Exiting loop for " + node.type);
                    break;
                }

                if (comment.extendedRange[1] <= node.range[0] && !comment._blockBoundary) {

                    debug("Adding leading comments for " + node.type);

                    /*istanbul ignore else*/
                    if (!node.leadingComments) {
                        node.leadingComments = [];
                    }
                    node.leadingComments.push(comment);
                    comments.splice(cursor, 1);
                } else {
                    debug("Incrementing cursor");
                    cursor += 1;
                }
            }

            // already out of owned node
            if (cursor === comments.length) {
                debug("All comments have been assigned, exiting");
                this.skip();
                return;
            }

            if (comments[cursor].extendedRange[0] > node.range[1]) {
                debug("Skipping the subtree of " + node.type);
                this.skip();
            }
        },
        leave: function(node) {
            debug("LEAVE: " + node.type);
            /*
             * This is really messy. Esprima 1.2.2 always duplicated trailing
             * comments on SwitchCase nodes as leading comments on their next
             * sibling SwitchCase node.
             */
            if (node.type === "SwitchStatement") {

                debug("Special casing SwitchStatement");

                for (i = 1; i < node.cases.length; i++) {
                    if (node.cases[i].leadingComments) {
                        node.cases[i - 1].trailingComments = node.cases[i].leadingComments.concat();
                    }
                }
            }
        }
    });

    debug("Looking for trailing comments");
    cursor = 0;

    if (comments.length) {
        controller.traverse(tree, {
            leave: function (node, parent) {
                var comment;

                debug("Evaluating " + node.type + " for trailing comments");

                while (cursor < comments.length) {
                    debug("Looking at comments");

                    comment = comments[cursor];
                    if (node.range[1] < comment.extendedRange[0]) {
                        debug("Out of range");
                        break;
                    }

                    if (node.range[1] === comment.extendedRange[0]) {
                        debug("Range matches");

                        /*
                         * More special casing for SwitchCase. If a trailing comment
                         * exists for the last child of a SwitchCase, move it to
                         * the SwitchCase itself.
                         */
                        if (parent.type === "SwitchCase" && parent.consequent[parent.consequent.length - 1] === node) {

                            /*istanbul ignore else*/
                            if (!parent.trailingComments) {
                                parent.trailingComments = [];
                            }

                            parent.trailingComments.push(comment);

                        } else {

                            /*istanbul ignore else*/
                            if (!node.trailingComments) {
                                node.trailingComments = [];
                            }

                            node.trailingComments.push(comment);

                        }


                        comments.splice(cursor, 1);
                    } else {
                        debug("Incrementing cursor");
                        cursor += 1;
                    }
                }

                // already out of owned node
                if (cursor === comments.length) {
                    this.break();
                    return;
                }

                if (comments[cursor].extendedRange[0] > node.range[1]) {
                    this.skip();
                }
            }
        });

    }

    // anything that's left over needs to go onto Program
    if (comments.length) {
        if (tree.body.length) {

            var firstChild = tree.body[0];

            // NOTE: Not sure if this is needed, commenting out for now
            /*
             * Special case for SwitchStatement with trailing comments.
             * If there's at least one SwitchCase, attach the comments
             * to the last SwitchCase as trailingComments.
             */
            // if (firstChild.type === "SwitchStatement" && firstChild.cases.length) {
            //     debug("Special casing SwitchStatement trailing comments");
            //     firstChild.cases[firstChild.cases.length - 1].trailingComments = comments;
            // } else if (firstChild.type === "BlockStatement" && firstChild.body.length) {
            //     debug("Special casing BlockStatement trailing comments");
            //     firstChild.body[firstChild.body.length - 1].trailingComments = comments;
            // } else {
            firstChild.trailingComments = comments;

        }
    }

    return tree;
};
