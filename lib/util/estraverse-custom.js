/**
 * @fileoverview Node mapping for JSX nodes to feed to estraverse
 * @author Nicholas C. Zakas
 * @copyright 2015 Nicholas C. Zakas. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var estraverse = require("estraverse");

//------------------------------------------------------------------------------
// Setup
//------------------------------------------------------------------------------

var nodeTypes = {
    JSXIdentifier: [],
    JSXNamespacedName: ["namespace", "name"],
    JSXMemberExpression: ["object", "property"],
    JSXEmptyExpression: [],
    JSXExpressionContainer: ["expression"],
    JSXElement: ["openingElement", "closingElement", "children"],
    JSXClosingElement: ["name"],
    JSXOpeningElement: ["name", "attributes"],
    JSXAttribute: ["name", "value"],
    JSXSpreadAttribute: ["argument"],
    JSXText: null
};

// add node types to estraverse
Object.keys(nodeTypes).forEach(function(nodeType) {
    estraverse.Syntax[nodeType] = nodeType;
    estraverse.VisitorKeys[nodeType] = nodeTypes[nodeType];
});

//------------------------------------------------------------------------------
// Public
//------------------------------------------------------------------------------

module.exports = estraverse;
