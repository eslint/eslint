/*global module*/
module.exports = function(results) {

    var output = "";

    results.forEach(function(result) {

        var messages = result.messages;
        messages.forEach(function(message) {
            output += "Problem on line " + (message.line || 0) + "\n";
        });

    });

    return output;
};
