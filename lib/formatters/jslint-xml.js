/**
 * @fileoverview JSLint XML reporter
 * @author Ian Christian Myers
 */

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
 * @param {String} message to escape
 * @return escaped message as {String}
 */
function escapeSpecialCharacters(str) {

    str = str || "";
    var pairs = {
        "&": "&amp;",
        "\"": "&quot;",
        "'": "&apos;",
        "<": "&lt;",
        ">": "&gt;"
    };

    return str.replace(/[&"'<>]/g, function(c) {
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
                "reason=\"" + escapeSpecialCharacters(message.message) + "\" />";
        });

        output += "</file>";

    });

    output += "</jslint>";

    return output;
};
