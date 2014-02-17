/**
 * @fileoverview TAP reporter
 * @author Jonathan Kingston
 */
"use strict";

var yaml = require("js-yaml");

//------------------------------------------------------------------------------
// Helper Functions
//------------------------------------------------------------------------------

/**
 * Returns a canonical error level string based upon the error message passed in.
 *     The rules setup in the config will determine if an issue is an error.
 *     Issues marked with message.fatal will be error level.
 *     All other issues will be a warning.
 * @param {object} message Individual error message provided by eslint
 * @param {object} rules Rules setup in the config via: config.rules
 * @returns {String} Error level string
 */
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

/**
 * Takes in a JavaScript object and outputs a TAP diagnostics string
 * @param {object} diagnostic JavaScript object to be embedded as YAML into output.
 * @returns {string} diagnostics string with YAML embedded - TAP version 13 compliant
 */
function outputDiagnostics(diagnostic) {
    var prefix = "  ";
    var output = prefix + "---\n";
    output += prefix + yaml.safeDump(diagnostic).split("\n").join("\n" + prefix);
    output += "...\n";
    return output;
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function(results, config) {
    var output = "TAP version 13\n1.." + results.length + "\n",
        rules = config.rules || {};

    results.forEach(function(result, id) {
        var messages = result.messages;
        var testResult = "ok";
        var diagnostics = {};

        if (messages.length > 0) {
            testResult = "not ok";

            messages.forEach(function(message) {
                var diagnostic = {
                    message: message.message,
                    severity: getMessageType(message, rules),
                    data: {
                        line: message.line || 0,
                        column: message.column || 0,
                        ruleId: message.ruleId || ""
                    }
                };

                // If we have multiple messages place them under a messages key
                // The first error will be logged as message key
                // This is to adhere to TAP 13 loosely defined specification of having a message key
                if ("message" in diagnostics) {
                    if ("messages" in diagnostics) {
                        diagnostics.messages.push(diagnostic);
                    } else {
                        diagnostics.messages = [diagnostic];
                    }
                } else {
                  diagnostics = diagnostic;
                }
            });
        }

        output += testResult + " " + (id + 1) + " - " + result.filePath + "\n";

        // If we have an error include diagnostics 
        if (messages.length > 0) {
            output += outputDiagnostics(diagnostics);
        }

    });

    return output;
};
