/**
 * @fileoverview CheckStyle XML reporter
 * @author Ian Christian Myers
 */
"use strict";

const xmlEscape = require("../util/xml-escape");

//------------------------------------------------------------------------------
// Helper Functions
//------------------------------------------------------------------------------

/**
 * Returns the severity of warning or error
 * @param {Object} message message object to examine
 * @returns {string} severity level
 * @private
 */
function getMessageType(message) {
    if (message.fatal || message.severity === 2) {
        return "error";
    } else {
        return "warning";
    }
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function(results) {

    let output = "";

    output += "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
    output += "<checkstyle version=\"4.3\">";

    results.forEach(function(result) {
        const messages = result.messages;

        output += "<file name=\"" + xmlEscape(result.filePath) + "\">";

        messages.forEach(function(message) {
            output += "<error line=\"" + xmlEscape(message.line) + "\" " +
                "column=\"" + xmlEscape(message.column) + "\" " +
                "severity=\"" + xmlEscape(getMessageType(message)) + "\" " +
                "message=\"" + xmlEscape(message.message) +
                (message.ruleId ? " (" + message.ruleId + ")" : "") + "\" " +
                "source=\"" + (message.ruleId ? xmlEscape("eslint.rules." + message.ruleId) : "") + "\" />";
        });

        output += "</file>";

    });

    output += "</checkstyle>";

    return output;
};
