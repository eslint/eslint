/**
 * @fileoverview CheckStyle XML reporter
 * @author Ian Christian Myers
 */

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

        output += "<file name=\"" + result.filePath + "\">";

        messages.forEach(function(message) {
            output += "<error line=\"" + message.line + "\" " +
                "column=\"" + message.column + "\" " +
                "severity=\"" + getMessageType(message, rules) + "\" " +
                "message=\"" + message.message + "\" />";
        });

        output += "</file>";

    });

    output += "</checkstyle>";

    return output;
};
