/**
 * @fileoverview Compact reporter
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Helper Functions
//------------------------------------------------------------------------------

function getMessageType(message, rules) {
    if (message.fatal) {
        return "Error";
    }

    var rule = rules[message.ruleId],
        severity = rule && (rule[0] || rule);

    if (severity === 2) {
        return "Error";
    }

    return "Warning";
}


//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function(results, config) {

    var output = "",
        total = 0,
        rules = config.rules || {};

    results.forEach(function(result) {

        var messages = result.messages;
        total += messages.length;

        messages.forEach(function(message) {

            output += result.filePath + ": ";
            output += "line " + (message.line || 0) +  ", col " +
                (message.column || 0) + ", " + getMessageType(message, rules);
            output += " - " + message.message + (message.ruleId ? " (" + message.ruleId + ")" : "") + "\n";
        });

    });

    if (total > 0) {
        output += "\n" + total + " problem" + (total !== 1 ? "s" : "");
    }

    return output;
};
