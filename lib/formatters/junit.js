/**
 * @fileoverview jUnit Reporter
 * @author Jamund Ferguson
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Helper Functions
//------------------------------------------------------------------------------

function getMessageType(message, rules) {

    if (message.fatal || rules[message.ruleId] === 2) {
        return "Error";
    } else {
        return "Warning";
    }

}

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
    for (var r in pairs) {
        str = str.replace(new RegExp(r, "g"), pairs[r]);
    }
    return str || "";

}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function(results, config) {

    var output = "",
        rules = config.rules || {};

    output += "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
    output += "<testsuites>\n";

    results.forEach(function(result) {

        var messages = result.messages;

        if (messages.length) {
            output += "<testsuite package=\"org.eslint\" time=\"0\" tests=\"" + messages.length + "\" errors=\"" + messages.length + "\" name=\"" + result.filePath  + "\">\n";
        }

        messages.forEach(function(message) {
            var type = message.fatal ? "error" : "failure";
            output += "<testcase time=\"0\" name=\"org.eslint." + (message.ruleId || "unknown") +  "\">";
            output += "<" + type + " message=\"" + escapeSpecialCharacters(message.message) + "\">";
            output += "<![CDATA[";
            output += "line " + message.line +  ", col ";
            output += message.column + ", " + getMessageType(message, rules);
            output += " - " + escapeSpecialCharacters(message.message);
            output += "]]>";
            output += "</" + type + ">";
            output += "</testcase>\n";
        });

        if (messages.length) {
            output += "</testsuite>\n";
        }

    });

    output += "</testsuites>\n";

    return output;
};