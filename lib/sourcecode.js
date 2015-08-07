/**
 * @fileoverview Encapsulate parser results together with the original source code.
 * @author Tom Clarkson
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * A SourceCode object as used by verify.
 * @class
 * @param {string} text The original source text
 * @param {object|Error} parseResult The output from an esprima compatible parser or an error if parsing failed. Note that the result must
 *      contain token and comment arrays as well as the standard syntax tree.
 */
function SourceCode(text, parseResult) {
    this.text = text;
    this.parseResult = parseResult;
}

/**
 * Verify that a SourceCode object was parsed well enough to apply linting.
 * @memberof SourceCode
 * @returns {Message[]} Any errors as an array of messages.
 */
SourceCode.prototype.validate = function() {
    var result = [];
    if (this.parseResult && this.parseResult.message) {
        // parsing failed - report it
        result.push({
            fatal: true,
            severity: 2,
            // If the message includes a leading line number, strip it:
            message: this.parseResult.message.replace(/^line \d+:/i, "").trim(),
            // use line/column if available, or 0:0 for a more general error
            line: this.parseResult.lineNumber || 0,
            column: this.parseResult.lineNumber ? this.parseResult.column + 1 : 0
        });
    } else if (!this.parseResult && this.text && this.text.trim()) {
        result.push({
            fatal: true,
            severity: 2,
            message: "Parse result not provided",
            line: 0,
            column: 0
        });
    } else if (this.parseResult && !this.text) {
        result.push({
            fatal: true,
            severity: 2,
            message: "Original source text not provided",
            line: 0,
            column: 0
        });
    } else if (this.parseResult && (!this.parseResult.body || !this.parseResult.tokens || !this.parseResult.comments)) {
        result.push({
            fatal: true,
            severity: 2,
            message: "Parse result must include AST, tokens and comments",
            line: 0,
            column: 0
        });
    }

    return result;
};

module.exports = SourceCode;
