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

function escape(s) {
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

        output += "<file name=\"" + escape(result.filePath) + "\">";

        messages.forEach(function(message) {
            output += "<error line=\"" + escape(message.line) + "\" " +
                "column=\"" + escape(message.column) + "\" " +
                "severity=\"" + escape(getMessageType(message, rules)) + "\" " +
                "message=\"" + escape(message.message) + "\" />";
        });

        output += "</file>";

    });

    output += "</checkstyle>";

    return output;
};
