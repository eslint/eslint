/**
 * @fileoverview Determines which features are supported in which ECMAScript environments.
 * @author Nicholas C. Zakas
 * @copyright 2014 Nicholas C. Zakas. All rights reserved.
 */
/*eslint no-underscore-dangle:0*/

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assign = require("object-assign"),
    debug = require("debug"),
    nodeTypes = require("../../conf/nodetypes.json");

//------------------------------------------------------------------------------
// Private
//------------------------------------------------------------------------------

debug = debug("eslint:validator");

var defaultOptions = {
    ecmascript: 5,
    jsx: false
};


/**
 * Simple validation for a node that determines whether or not the node
 * is valid in the AST. This doesn't check for unsupported properties,
 * just for unknown node types.
 * @param {ASTNode} node The node to check.
 * @param {Object} options The validator options.
 * @returns {boolean} True if the node is allowed, false if not.
 * @private
 */
function isValid(node, options) {
    var nodeInfo = nodeTypes[node.type];

    if (nodeInfo && "version" in nodeInfo) {
        if (typeof nodeInfo.version === "number") {
            return nodeInfo.version <= options.ecmascript;
        } else if (nodeInfo.version === "jsx") {
            return options.jsx;
        }
    }

    return false;
}


//------------------------------------------------------------------------------
// Public
//------------------------------------------------------------------------------

/**
 * Validates ECMAScript syntax against a known set of language options.
 * @param {Object} options The language options to check against.
 * @constructor
 */
function Validator(options) {

    /**
     * The language options to check against.
     * @type {Object}
     * @private
     */
    this._options = assign(Object.create(defaultOptions), options || {});
}

Validator.prototype = {

    constructor: Validator,


    /**
     * Returns validation information for a given node. The information contains
     * any error message that is appropriate based on not just the node type,
     * but also the properties of the object.
     * @param {ASTNode} node The node to check.
     * @returns {Object} Information about the validity of the node.,
     */
    validate: function(node) {

        var valid = isValid(node, this._options),
            nodeInfo = nodeTypes[node.type],
            ecmascript = this._options.ecmascript,
            // jsx = this._options.jsx,
            line = node.loc ? node.loc.start.line : 0,
            column = node.loc ? node.loc.start.column : 0,
            message;

        if (valid) {


            // double check for special cases
            switch (node.type) {
                case "VariableDeclaration":

                    // ES < 6 doesn't have let or const
                    if (ecmascript < 6 && node.kind !== "var") {
                        valid = false;
                        message = "Unexpected identifier \"" + node.kind + "\".";
                    }

                    break;

                case "FunctionDeclaration":
                case "FunctionExpression":
                case "ArrowFunctionExpression":

                    // ES6 generators are just FunctionDeclaration/FunctionExpression nodes
                    if (ecmascript < 6 && node.generator) {
                        valid = false;
                        message = "Unexpected token \"*\".";
                        column = column + 8;
                    }

                // no default
            }


        } else {
            message = nodeInfo ? nodeInfo.message : "Unexpected node \"" + node.type + "\".";
        }

        return {
            valid: valid,
            message: message,
            line: line,
            column: column
        };
    }

};

module.exports = Validator;
