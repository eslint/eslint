"use strict";

const espree = require("espree");

exports.parse = (sourceText, options) => {
    if (options.ecmaVersion) {
        throw new Error("Expected no parserOptions to be used");
    }
    return espree.parse(sourceText, options);
};
