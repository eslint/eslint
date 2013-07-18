/**
 * @fileoverview Compact reporter
 * @author Nicholas C. Zakas
 */

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
            output += "line " + message.line +  ", col " +
                message.column + ", " + getMessageType(message, rules);
            output += " - " + message.message + "\n";
        });

    });

    output += "\n" + total + " problems";

    return output;
};
