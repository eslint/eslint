/**
 * @fileoverview TAP reporter
 * @author Jonathan Kingston
 */
"use strict";

var yaml = require("js-yaml");

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

        if (messages.length > 0) {
            output += outputDiagnostics(diagnostics);
        }

    });

    return output;
};
