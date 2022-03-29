/**
 * @fileoverview XML character escaper
 * @author George Chung
 */
"use strict";

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Returns the escaped value for a character
 * @param {string} s string to examine
 * @returns {string} severity level
 * @private
 */
module.exports = function(s) {
    return (`${s}`).replace(/[<>&"'\u0000-\u001F\u007F\u0080-\uFFFF]/gu, c => { // eslint-disable-line no-control-regex -- Converting controls to entities
        switch (c) {
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case "&":
                return "&amp;";
            case "\"":
                return "&quot;";
            case "'":
                return "&apos;";
            default:
                return `&#${c.codePointAt(0)};`;
        }
    });
};
