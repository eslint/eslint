/**
 * @fileoverview JSLint XML reporter
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function(results) {

    var output = "";

    output += "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
    output += "<jslint>";

    results.forEach(function(result) {
        var messages = result.messages;

        output += "<file name=\"" + result.filePath + "\">";

        messages.forEach(function(message) {
            output += "<issue line=\"" + message.line + "\" " +
                "char=\"" + message.column + "\" " +
                "evidence=\"" + message.source + "\" " +
                "reason=\"" + message.message + "\" />";
        });

        output += "</file>";

    });

    output += "</jslint>";

    return output;
};
