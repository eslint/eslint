/**
 * @fileoverview JSLint XML reporter
 * @author Ian Christian Myers
 */
"use strict";

 //------------------------------------------------------------------------------
 // Helper Functions
 //------------------------------------------------------------------------------

/**
 * Replace special characters before write to output.
 *
 * Rules:
 *  - single quotes is the escape sequence for double-quotes
 *  - &lt; is the escape sequence for <
 *  - &gt; is the escape sequence for >
 *  - &quot; is the escape sequence for "
 *  - &apos; is the escape sequence for '
 *  - &amp; is the escape sequence for &
 *
 * @param {string} message to escape
 * @returns {string} escaped message
 */
function escapeSpecialCharacters(message) {

    message = message || "";
    var pairs = {
        "&": "&amp;",
        "\"": "&quot;",
        "'": "&apos;",
        "<": "&lt;",
        ">": "&gt;"
    };

    return message.replace(/[&"'<>]/g, function(c) {
        return pairs[c];
    });

}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function(results) {

    var output = "";

    output += "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
    output += "<jslint>";

    results.forEach(function(result) {
        var messages = result.messages;

        output += "<file name=\"" + result.filePath + "\">";

        messages.forEach(function(message) {
            output += "<issue line=\"" + message.line + "\" " +
                "char=\"" + message.column + "\" " +
                "evidence=\"" + escapeSpecialCharacters(message.source) + "\" " +
                "reason=\"" + escapeSpecialCharacters(message.message) +
                (message.ruleId ? " (" + message.ruleId + ")" : "") + "\" />";
        });

        output += "</file>";

    });

    output += "</jslint>";

    return output;
};
