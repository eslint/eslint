"use strict";

const {
    defineInMemoryFs,
    defineConfigArrayFactoryWithInMemoryFileSystem,
    defineCascadingConfigArrayFactoryWithInMemoryFileSystem,
    defineFileEnumeratorWithInMemoryFileSystem,
    defineCLIEngineWithInMemoryFileSystem,
    defineESLintWithInMemoryFileSystem
} = require("./in-memory-fs");


/**
 * Prevents leading spaces in a multiline template literal from appearing in the resulting string
 * @param {string[]} strings The strings in the template literal
 * @param {any[]} values The interpolation values in the template literal.
 * @returns {string} The template literal, with spaces removed from all lines
 */
function unIndent(strings, ...values) {
    const text = strings
        .map((s, i) => (i === 0 ? s : values[i - 1] + s))
        .join("");
    const lines = text.replace(/^\n/u, "").replace(/\n\s*$/u, "").split("\n");
    const lineIndents = lines.filter(line => line.trim()).map(line => line.match(/ */u)[0].length);
    const minLineIndent = Math.min(...lineIndents);

    return lines.map(line => line.slice(minLineIndent)).join("\n");
}


module.exports = {
    unIndent,
    defineInMemoryFs,
    defineConfigArrayFactoryWithInMemoryFileSystem,
    defineCascadingConfigArrayFactoryWithInMemoryFileSystem,
    defineFileEnumeratorWithInMemoryFileSystem,
    defineCLIEngineWithInMemoryFileSystem,
    defineESLintWithInMemoryFileSystem
};
