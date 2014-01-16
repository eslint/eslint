/**
 * @fileoverview CheckStyle XML reporter
 * @author Ian Christian Myers
 */
"use strict";

//------------------------------------------------------------------------------
// Helper Functions
//------------------------------------------------------------------------------

function getMessageType(message, rules) {

    // TODO: Get rule severity in a better way
    var severity = null;

    if (message.fatal) {
        return "error";
    }

    severity = rules[message.ruleId][0] || rules[message.ruleId];

    if (severity === 2) {
        return "error";
    }

    return "warning";
}

function xmlEscape(s) {
    return ("" + s).replace(/[<>&"']/g, function(c) {
        switch(c) {
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case "&":
                return "&amp;";
            case "\"":
                return "&quot;";
            case "'":
                return "&apos;";
        }
    });
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function(results, config) {

    var output = "",
        rules = config.rules || {};

    output += "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
    output += "<checkstyle version=\"4.3\">";

    results.forEach(function(result) {
        var messages = result.messages;

        output += "<file name=\"" + xmlEscape(result.filePath) + "\">";

        messages.forEach(function(message) {
            output += "<error line=\"" + xmlEscape(message.line) + "\" " +
                "column=\"" + xmlEscape(message.column) + "\" " +
                "severity=\"" + xmlEscape(getMessageType(message, rules)) + "\" " +
                "message=\"" + xmlEscape(message.message) +
                (message.ruleId ? " (" + message.ruleId + ")" : "") + "\" />";
        });

        output += "</file>";

    });

    output += "</checkstyle>";

    return output;
};
