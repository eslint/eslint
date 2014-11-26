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
     * Simple validation for a node that determines whether or not the node
     * is valid in the AST. This doesn't check for unsupported properties,
     * just for unknown node types.
     * @param {ASTNode} node The node to check.
     * @returns {boolean} True if the node is allowed, false if not.
     */
    isValid: function(node) {
        var nodeInfo = nodeTypes[node.type];

        if (nodeInfo && "version" in nodeInfo) {
            if (typeof nodeInfo.version === "number") {
                return nodeInfo.version <= this._options.ecmascript;
            } else if (nodeInfo.version === "jsx") {
                return this._options.jsx;
            }
        }

        return false;
    },

    /**
     * Returns validation information for a given node. The information contains
     * any error message that is appropriate based on not just the node type,
     * but also the properties of the object.
     * @param {ASTNode} node The node to check.
     * @returns {Object} Information about the validity of the node.,
     */
    validate: function(node) {

        var valid = this.isValid(node),
            nodeInfo = nodeTypes[node.type],
            message,
            line,
            column;

        if (valid) {

            // double check for special cases
            if (/^Function/.test(node.type)) {

                // ES6 generators are just FunctionDeclaration/FunctionExpression nodes
                if (this._options.ecmascript < 6 && node.generator) {
                    valid = false;
                    message = "Unexpected token \"*\".";
                    line = node.loc.start.line;
                    column = node.loc.start.column + 8;
                }
            }

        } else {
            message = nodeInfo.message;
            line = node.loc.start.line;
            column = node.loc.start.column;
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
