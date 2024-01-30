"use strict";

/**
 * Replaces some marks used in the code in the document and converts it into parsable code.
 * The replaced string will be used in the linter,
 * so be careful not to replace characters that change the location of the line and column.
 * @param {string} code The code in the document.
 * @returns {string} The parsable code.
 */
function docsExampleCodeToParsableCode(code) {
    return code

        // Remove trailing newline and presentational `⏎` characters
        .replace(/⏎(?=\n)/gu, "")

        // Code blocks always contain extra line breaks, so remove them.
        .replace(/\n$/u, "");
}

module.exports = {
    docsExampleCodeToParsableCode
};
