/**
 * @fileoverview Rule to require braces in arrow function body.
 * @author Alberto Rodríguez
 * @copyright 2015 Alberto Rodríguez. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

var lodash = require("lodash");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    /**
     * Computes the length of an arrow function not including
     * leading or trailing whitespace.
     * @param {array} lines An array of source code lines, either including or excluding function declaration
     * @returns {int} The computed length of an arrow function
     * @private
     */
    function computeBodyLength(lines) {
        var body = lodash.reduce(lines, function(acc, line) {
            // trim whitespace and tabs
            return acc + line.trim().replace("\t", "");
        }, "");
        return body.length;
    }

    /**
     * Returns Included lines based on if the declaration should be included
     * in the restrictions
     * @param {array} lines An array of source code lines
     * @param {object} start starting line and column
     * @param {object} end ending line and column
     * @returns {array} lines without function declaration
     * @private
     */
    function getIncludedLines(lines, start, end) {
        // If the starting and ending lines are the same, simply return one line
        // with sliced at the starting and ending columns
        if (start.line === end.line) {
            return [lines[start.line - 1].slice(start.column, end.column)];
        }
        var first = lines[start.line - 1].slice(start.column);
        var last = lines[end.line - 1].slice(0, end.column);
        var rest = lines.slice(start.line, end.line - 1);
        return [first].concat(rest, last);
    }

    var always = context.options[0] === "always";
    var asNeeded = !context.options[0] || context.options[0] === "as-needed";
    var lengthRequirements = context.options[1] || false;

    /**
     * Determines whether a arrow function body needs braces
     * @param {ASTNode} node The arrow function node.
     * @returns {void}
     */
    function validate(node) {

        var arrowBody = node.body;
        // Arrow body is or is not a block statement
        var isBlock = arrowBody.type === "BlockStatement";
        // Immediate return if arrow body is not a block and always is applied
        if (!isBlock && always) {
            context.report({
                node: node,
                loc: arrowBody.loc.start,
                message: "Expected block statement surrounding arrow body."
            });
            return;
        }
        // Everything below this check applies only if asNeeded is applied
        // and the source's body is not an empty block
        var functionBody = arrowBody.body;
        if (!asNeeded || (isBlock && functionBody.length !== 1)) {
            return;
        }
        // If the first element of an arrow body is a return statement then it is unexpected
        // unless length requirements justify this return
        var functionBodyIsReturn = lodash.get(functionBody, "[0].type") === "ReturnStatement";
        var unexpectedBlock = isBlock && functionBodyIsReturn;
        if (unexpectedBlock && !lengthRequirements) {
            context.report({
                node: node,
                loc: arrowBody.loc.start,
                message: "Unexpected block statement surrounding arrow body."
            });
            return;
        }
        if (lengthRequirements) {
            // Get maxLen, maxLines and includeArgs from lengthRequirements, defaulting to undefined
            var maxLen = typeof lengthRequirements["max-len"] === "number"
                && lengthRequirements["max-len"];
            var maxLines = typeof lengthRequirements["max-lines"] === "number"
                && lengthRequirements["max-lines"];
            var includeArgs = lengthRequirements["include-args"] || false;
            var source = context.getSourceCode();
            // Start location of body based on if arguments should be included or not
            var start = (includeArgs && node.params)
                ? node.params[0].loc.start
                // Find the arrow token itself and use the end of it as a starting point
                : lodash.find(source.getTokens(node), { value: "=>" }).loc.end;
            var end = (arrowBody.type === "ArrowFunctionExpression" || arrowBody.type === "FunctionExpression")
                ? arrowBody.loc.start
                : arrowBody.loc.end;
            // Calculate lines from context
            var lines = source.getLines();
            var includedLines = getIncludedLines(lines, start, end);
            // Determine if the body or params + body are above the provided maximums
            var aboveMaxLen = maxLen && computeBodyLength(includedLines) > maxLen;
            var aboveMaxLines = maxLines && includedLines.length > maxLines;
            // Unexpected block check again, but now we know that the provided maximums
            // are not violated and that this block is indeed unexpected
            if (unexpectedBlock && !aboveMaxLen && !aboveMaxLines) {
                context.report({
                    node: node,
                    loc: start,
                    message: "Unexpected block statement surrounding arrow body."
                });
            } else if (!unexpectedBlock) {
                if (aboveMaxLen) {
                    context.report({
                        node: node,
                        loc: start,
                        message: "Arrow function exceeds maximum characters and requires block formatting."
                    });
                } else if (aboveMaxLines) {
                    context.report({
                        node: node,
                        loc: start,
                        message: "Arrow function exceeds maximum number of lines and requires block formatting."
                    });
                }
            }
        }
    }

    return {
        "ArrowFunctionExpression": validate
    };
};

module.exports.schema = [
    {
        "enum": ["always", "as-needed"]
    },
    {
        "type": "object",
        "properties": {
            "max-len": {
                "type": "number"
            },
            "max-lines": {
                "type": "number"
            },
            "include-args": {
                "type": "boolean"
            }
        }
    }
];
