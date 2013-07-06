/**
 * @fileoverview Compact reporter
 * @author Nicholas C. Zakas
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Helper Functions
//------------------------------------------------------------------------------

function getMessageType(message, config) {

    if (message.fatal || config.rules[message.ruleId] === 2) {
        return "Error";
    } else {
        return "Warning";
    }

}


//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function(eslint, messages, filename, config) {

    var output = "",
        rules = config.rules || {};

    messages.forEach(function(message) {

        output += filename + ": ";

        if (message.node) {
            output += "line " + message.node.loc.start.line +  ", col " +
                message.node.loc.start.column + ", " + getMessageType(message, config);
        }

        output += " - " + message.message + "\n";
    });

    return output;
};
