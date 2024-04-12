/**
 * @fileoverview A utility related to markdown code blocks.
 * @author Yosuke Ota
 */
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

        // Code blocks always contain an extra line break at the end, so remove it.
        .replace(/\n$/u, "")

        // Replace LF line breaks with CRLF after `\r\n` sequences.
        .replace(/(?<=\\r\\n)\n/gu, "\r\n")

        // Remove presentational `⏎` characters at the end of lines.
        .replace(/⏎(?=\n)/gu, "");
}

module.exports = {
    docsExampleCodeToParsableCode
};
