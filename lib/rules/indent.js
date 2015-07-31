/**
 * @fileoverview This option sets a specific tab width for your code

 * This rule has been ported and modified from nodeca.
 * @author Vitaly Puzrin
 * @author Gyandeep Singh
 * @copyright 2015 Vitaly Puzrin. All rights reserved.
 * @copyright 2015 Gyandeep Singh. All rights reserved.
 Copyright (C) 2014 by Vitaly Puzrin

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
var util = require("util");
var assign = require("object-assign");

module.exports = function(context) {

    var MESSAGE = "Expected indentation of {{needed}} characters but found {{gotten}}.";

    var extraColumnStart = 0;
    var indentType = "spaces";
    var indentSize = 4;
    var options = {
        SwitchCase: 0,
        VariableDeclarator: 1
    };

    if (context.options.length) {
        if (context.options[0] === "tab") {
            indentSize = 1;
            indentType = "tab";
        } else /* istanbul ignore else : this will be caught by options validation */ if (typeof context.options[0] === "number") {
            indentSize = context.options[0];
            indentType = "spaces";
        }

        if (context.options[1]) {
            var opts = context.options[1];
            assign(options, opts);
        }
    }

    var caseIndentStore = {};

    /**
     * Get node indent
     * @param {ASTNode} node Node to examine
     * @param {boolean} byLastLine get indent of node's last line
     * @param {boolean} excludeCommas skip comma on start of line
     * @returns {int} Indent
     */
    function getNodeIndent(node, byLastLine, excludeCommas) {
        byLastLine = byLastLine || false;
        excludeCommas = excludeCommas || false;

        var src = context.getSource(node, node.loc.start.column + extraColumnStart);
        var lines = src.split("\n");
        if (byLastLine) {
            src = lines[lines.length - 1];
        } else {
            src = lines[0];
        }

        var skip = excludeCommas ? "," : "";

        var regExp;
        if (indentType === "spaces") {
            regExp = new RegExp("^[ " + skip + "]+");
        } else {
            regExp = new RegExp("^[\t" + skip + "]+");
        }

        var indent = regExp.exec(src);
        return indent ? indent[0].length : 0;
    }

    /**
     * Check indent for nodes list
     * @param {ASTNode[]} nodes list of node objects
     * @param {int} indent needed indent
     * @param {boolean} excludeCommas skip comma on start of line
     * @returns {void}
     */
    function checkNodesIndent(nodes, indent, excludeCommas) {
        nodes.forEach(function(node) {
            var nodeIndent = getNodeIndent(node, false, excludeCommas);
            if (nodeIndent !== indent) {
                context.report(node, MESSAGE, { gotten: nodeIndent, needed: indent });
            }
        });
    }

    /**
     * Check last node line indent this detects, that block closed correctly
     * @param {ASTNode} node Node to examine
     * @param {int} lastLineIndent needed indent
     * @returns {void}
     */
    function checkLastNodeLineIndent(node, lastLineIndent) {
        var endIndent = getNodeIndent(node, true);
        if (endIndent !== lastLineIndent) {
            context.report(
                node,
                { line: node.loc.end.line, column: node.loc.end.column },
                MESSAGE,
                { gotten: endIndent, needed: lastLineIndent }
            );
        }
    }

    /**
     * Check indent for function block content
     * @param {ASTNode} node node to examine
     * @returns {void}
     */
    function checkIndentInFunctionBlock(node) {

        // Search first caller in chain.
        // Ex.:
        //
        // Models <- Identifier
        //   .User
        //   .find()
        //   .exec(function() {
        //   // function body
        // });
        //
        // Looks for 'Models'
        var calleeNode = node.parent; // FunctionExpression
        while (calleeNode.parent &&
        calleeNode.parent.type === "CallExpression") {
            calleeNode = calleeNode.parent;
        }

        var indent;

        if (calleeNode.parent &&
            (calleeNode.parent.type === "Property" ||
            calleeNode.parent.type === "ArrayExpression")) {
            // If function is part of array or object, comma can be put at left
            indent = getNodeIndent(calleeNode, false, true);
        } else {
            // If function is standalone, simple calculate indent
            indent = getNodeIndent(calleeNode);
        }

        indent += indentSize;
        // If function content is not empty
        if (node.body.length > 0) {
            // Calculate left shift position don't require strict indent
            // allow function body allign to (indentSize * X)
            while (getNodeIndent(node.body[0]) > indent) {
                indent += indentSize;
            }
        }

        checkNodesIndent(node.body, indent);

        checkLastNodeLineIndent(node, indent - indentSize);
    }


    /**
     * Checks if the given node starts and ends on the same line
     * @param {ASTNode} node The node to check
     * @returns {boolean} Whether or not the block starts and ends on the same line.
     */
    function isSingleLineNode(node) {
        var lastToken = context.getLastToken(node),
            startLine = node.loc.start.line,
            endLine = lastToken.loc.end.line;

        return startLine === endLine;
    }

    /**
     * Check indent for array block content or object block content
     * @param {ASTNode} node node to examine
     * @returns {void}
     */
    function checkIndentInArrayOrObjectBlock(node) {
        // Skip inline
        if (isSingleLineNode(node)) {
            return;
        }

        var elements = (node.type === "ArrayExpression") ? node.elements : node.properties;

        // Skip if first element is in same line with this node
        if (elements.length > 0 && elements[0].loc.start.line === node.loc.start.line) {
            return;
        }

        var nodeIndent = getNodeIndent(node);

        var elementsIndent = nodeIndent + indentSize;
        // Elements can have double indent (detected by first item)
        if (elements.length > 0 &&
            getNodeIndent(elements[0]) === elementsIndent + indentSize) {
            elementsIndent = elementsIndent + indentSize;
        }

        // Comma can be placed before property name
        checkNodesIndent(elements, elementsIndent, true);

        if (elements.length > 0) {
            // Skip last block line check if last item in same line
            if (elements[elements.length - 1].loc.end.line === node.loc.end.line) {
                return;
            }
        }

        checkLastNodeLineIndent(node, elementsIndent - indentSize);
    }

    /**
     * Check indentation for blocks
     * @param {ASTNode} node node to check
     * @returns {void}
     */
    function blockIndentationCheck(node) {
        // Skip inline blocks
        if (isSingleLineNode(node)) {
            return;
        }

        if (node.parent && (node.parent.type === "FunctionExpression")) {
            checkIndentInFunctionBlock(node);
            return;
        }

        var indent;
        var nodesToCheck = [];

        // For this statements we should check indent from statement begin
        // (not from block begin)
        var statementsWithProperties = [
            "IfStatement", "WhileStatement", "ForStatement", "ForInStatement", "ForOfStatement", "DoWhileStatement"
        ];

        if (node.parent && statementsWithProperties.indexOf(node.parent.type) !== -1) {
            indent = getNodeIndent(node.parent);
        } else {
            indent = getNodeIndent(node);
        }

        if (node.type === "IfStatement" && node.consequent.type !== "BlockStatement") {
            nodesToCheck = [node.consequent];
        } else if (util.isArray(node.body)) {
            nodesToCheck = node.body;
        } else {
            nodesToCheck = [node.body];
        }

        if (nodesToCheck.length > 0) {
            checkNodesIndent(nodesToCheck, indent + indentSize);
        }

        if (node.type === "BlockStatement") {
            checkLastNodeLineIndent(node, indent);
        }
    }

    /**
     * Filter out the elements which are on the same line of each other or the node.
     * basically have only 1 elements from each line except the variable declaration line.
     * @param {ASTNodes} node Variable declaration node
     * @returns {ASTNodes[]} Filtered elements
     */
    function filterOutSameLineVars(node) {
        return node.declarations.reduce(function(finalCollection, elem) {
            var lastElem = finalCollection[finalCollection.length - 1];

            if ((elem.loc.start.line !== node.loc.start.line && !lastElem) ||
                (lastElem && lastElem.loc.start.line !== elem.loc.start.line)) {
                finalCollection.push(elem);
            }

            return finalCollection;
        }, []);
    }

    /**
     * Check indentation for variable declarations
     * @param {ASTNode} node node to examine
     * @returns {void}
     */
    function checkIndentInVariableDeclarations(node) {
        var elements = filterOutSameLineVars(node);
        var nodeIndent = getNodeIndent(node);
        var elementsIndent = nodeIndent + (indentSize * options.VariableDeclarator);

        // Comma can be placed before decalartion
        checkNodesIndent(elements, elementsIndent, true);

        if (elements.length > 0) {
            // Skip last block line check if last item in same line
            if (elements[elements.length - 1].loc.end.line === node.loc.end.line) {
                return;
            }
        }

        checkLastNodeLineIndent(node, elementsIndent - indentSize);
    }

    /**
     * Check and decide wheteher to check for indentation for blockless nodes
     * Scenarios are for or while statements without brances around them
     * @param {ASTNode} node node to examine
     * @returns {void}
     */
    function blockLessNodes(node) {
        if (node.body.type !== "BlockStatement") {
            blockIndentationCheck(node);
        }
    }

    /**
     * Returns the expected indentation for the case statement
     * @param {ASTNode} node node to examine
     * @param {int} switchIndent indent for switch statement
     * @returns {int} indent size
     */
    function expectedCaseIndent(node, switchIndent) {
        var switchNode = (node.type === "SwitchStatement") ? node : node.parent;
        var caseIndent;

        if (caseIndentStore[switchNode.loc.start.line]) {
            return caseIndentStore[switchNode.loc.start.line];
        } else {
            if (typeof switchIndent === "undefined") {
                switchIndent = getNodeIndent(switchNode);
            }

            if (switchNode.cases.length > 0 && options.SwitchCase === 0) {
                caseIndent = switchIndent;
            } else {
                caseIndent = switchIndent + (indentSize * options.SwitchCase);
            }

            caseIndentStore[switchNode.loc.start.line] = caseIndent;
            return caseIndent;
        }
    }

    return {
        "Program": function(node) {
            var nodeIndent = getNodeIndent(node);

            // Root nodes should have no indent
            checkNodesIndent(node.body, nodeIndent);
        },

        "BlockStatement": blockIndentationCheck,

        "WhileStatement": blockLessNodes,

        "ForStatement": blockLessNodes,

        "ForInStatement": blockLessNodes,

        "ForOfStatement": blockLessNodes,

        "DoWhileStatement": blockLessNodes,

        "IfStatement": function(node) {
            if (node.consequent.type !== "BlockStatement" && node.consequent.loc.start.line > node.loc.start.line) {
                blockIndentationCheck(node);
            }
        },

        "VariableDeclaration": function(node) {
            if (node.declarations[node.declarations.length - 1].loc.start.line > node.declarations[0].loc.start.line) {
                checkIndentInVariableDeclarations(node);
            }
        },

        "ObjectExpression": function(node) {
            checkIndentInArrayOrObjectBlock(node);
        },

        "ArrayExpression": function(node) {
            checkIndentInArrayOrObjectBlock(node);
        },

        "SwitchStatement": function(node) {
            // Switch is not a 'BlockStatement'
            var switchIndent = getNodeIndent(node);
            var caseIndent = expectedCaseIndent(node, switchIndent);
            checkNodesIndent(node.cases, caseIndent);


            checkLastNodeLineIndent(node, switchIndent);
        },

        "SwitchCase": function(node) {
            // Skip inline cases
            if (isSingleLineNode(node)) {
                return;
            }
            var caseIndent = expectedCaseIndent(node);
            checkNodesIndent(node.consequent, caseIndent + indentSize);
        }
    };

};

module.exports.schema = [
    {
        "oneOf": [
            {
                "enum": ["tab"]
            },
            {
                "type": "integer"
            }
        ]
    },
    {
        "type": "object",
        "properties": {
            "SwitchCase": {
                "type": "integer"
            },
            "VariableDeclarator": {
                "type": "integer"
            }
        },
        "additionalProperties": false
    }
];
