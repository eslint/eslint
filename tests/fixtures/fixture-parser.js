"use strict";

const path = require("path");

/**
 * Gets the path to the specified parser.
 *
 * @param {string[]} arguments - The path containing the parser.
 * @returns {string} The path to the specified parser.
 */
module.exports = function parser() {
    const parts = Array.from(arguments);
    const name = parts.pop();

    return path.resolve(__dirname, "parsers", parts.join(path.sep), `${name}.js`);
};
