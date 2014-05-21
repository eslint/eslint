/**
 * @fileoverview Stylish reporter
 * @author Sindre Sorhus
 */
"use strict";

var chalk = require("chalk"),
    table = require("text-table");

//------------------------------------------------------------------------------
// Helper Functions
//------------------------------------------------------------------------------

function getMessageType(message, rules) {
    if (message.fatal) {
        return chalk.red("error");
    }

    var rule = rules[message.ruleId],
        severity = rule && (rule[0] || rule);

    if (severity === 2) {
        return chalk.red("error");
    }

    return chalk.yellow("warning");
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function(results, config) {

    var output = "\n",
        total = 0,
        rules = config.rules || {},
        summaryColor = "yellow";

    results.forEach(function(result) {
        var messages = result.messages;

        if (messages.length === 0) {
            return;
        }

        total += messages.length;
        output += chalk.underline(result.filePath) + "\n";

        output += table(
            messages.map(function(message) {
                var messageType = getMessageType(message, rules);
                if (chalk.stripColor(messageType) === "error") {
                    summaryColor = "red";
                }
                return [
                    "",
                    message.line || 0,
                    message.column || 0,
                    messageType,
                    message.message.replace(/\.$/, ""),
                    chalk.gray(message.ruleId)
                ];
            }),
            {
                align: ["", "r", "l"],
                stringLength: function(str) {
                    return chalk.stripColor(str).length;
                }
            }
        ).split("\n").map(function(el) {
            return el.replace(/(\d+)\s+(\d+)/, function(m, p1, p2) {
                return chalk.gray(p1 + ":" + p2);
            });
        }).join("\n") + "\n\n";
    });

    if (total > 0) {
        output += chalk[summaryColor].bold("\u2716 " + total + " problem" + (total === 1 ? "" : "s") + "\n");
    }

    return total > 0 ? output : "";
};
