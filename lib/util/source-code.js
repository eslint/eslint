/**
 * @fileoverview Abstraction of JavaScript source code.
 * @author Nicholas C. Zakas
 * @copyright 2015 Nicholas C. Zakas. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Private
//------------------------------------------------------------------------------

/**
 * Validates that the given AST has the required information.
 * @param {ASTNode} ast The Program node of the AST to check.
 * @throws {Error} If the AST doesn't contain the correct information.
 * @returns {void}
 * @private
 */
function validate(ast) {

    if (!ast.tokens) {
        throw new Error("AST is missing the tokens array.");
    }

    if (!ast.comments) {
        throw new Error("AST is missing the comments array.");
    }

    if (!ast.loc) {
        throw new Error("AST is missing location information.");
    }

    if (!ast.range) {
        throw new Error("AST is missing range information");
    }
}


//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Represents parsed source code.
 * @param {string} text The source code text.
 * @param {ASTNode} ast The Program node of the AST representing the code.
 * @constructor
 */
function SourceCode(text, ast) {

    validate(ast);

    /**
     * The original text source code.
     * @type string
     */
    this.text = text;

    /**
     * The parsed AST for the source code.
     * @type ASTNode
     */
    this.ast = ast;

    /**
     * The source code split into lines according to ECMA-262 specification.
     * This is done to avoid each rule needing to do so separately.
     * @type string[]
     */
    this.lines = text.split(/\r\n|\r|\n|\u2028|\u2029/g);

    // don't allow modification of this object
    Object.freeze(this);
    Object.freeze(this.lines);
}

SourceCode.prototype = {
    constructor: SourceCode
};


module.exports = SourceCode;
