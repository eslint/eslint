/**
 * @fileoverview Compact reporter
 * @author Nicholas C. Zakas
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


//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function(messages, filename, config) {

    var output = "",
        rules = config.rules || {};

    messages.forEach(function(message) {

        output += filename + ": ";
        output += "line " + message.line +  ", col " +
            message.column + ", " + getMessageType(message, rules);
        output += " - " + message.message + "\n";
    });

    return output;
};
