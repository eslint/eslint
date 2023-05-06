/**
 * @fileoverview Utilities to operate on strings.
 * @author Stephen Wade
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

// eslint-disable-next-line no-control-regex -- intentionally including control characters
const ASCII_REGEX = /^[\u0000-\u007f]*$/u;

/** @type {Intl.Segmenter.segment | import("graphemer").iterateGraphemes | undefined} */
let iterateGraphemes;

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Converts the first letter of a string to uppercase.
 * @param {string} string The string to operate on
 * @returns {string} The converted string
 */
function upperCaseFirst(string) {
    if (string.length <= 1) {
        return string.toUpperCase();
    }
    return string[0].toUpperCase() + string.slice(1);
}

/**
 * Counts graphemes in a given string.
 * @param {string} value A string to count graphemes.
 * @returns {number} The number of graphemes in `value`.
 */
function getGraphemeCount(value) {
    if (ASCII_REGEX.test(value)) {
        return value.length;
    }

    if (!iterateGraphemes) {
        if (typeof Intl !== "undefined" && typeof Intl.Segmenter !== "undefined") {
            iterateGraphemes = Intl.Segmenter.prototype.segment.bind(new Intl.Segmenter());
        } else {
            const Graphemer = require("graphemer").default;

            iterateGraphemes = Graphemer.prototype.iterateGraphemes.bind(new Graphemer());
        }
    }

    let count = 0;

    // eslint-disable-next-line no-unused-vars -- syntax required
    for (const _ of iterateGraphemes(value)) {
        count++;
    }

    return count;
}

module.exports = {
    upperCaseFirst,
    getGraphemeCount
};
