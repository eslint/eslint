/**
 * @fileoverview Compact reporter
 * @author Nicholas C. Zakas
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Helper Functions
//------------------------------------------------------------------------------

function getMessageType(message, config) {

    if (config.rules[message.ruleId] < 2) {
        return "Warning";
    } else {
        return "Error";
    }

}


//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function(eslint, messages, filename, config) {

    var output = "",
        rules = config.rules || {};

    messages.forEach(function(message) {

        output += filename + ": line " + message.node.loc.start.line +  ", col " +
                message.node.loc.start.column + ", " + getMessageType(message, config) +
                " - " + message.message + "\n";
    });

    return output;
};
