/**
 * @fileoverview Stylish reporter
 * @author Sindre Sorhus
 */
"use strict";

var chalk = require("chalk"),
    table = require("text-table");

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function(results) {

    var output = "\n",
        total = 0,
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
                var messageType;

                if (message.fatal || message.severity === 2) {
                    messageType = chalk.red("error");
                    summaryColor = "red";
                } else {
                    messageType = chalk.yellow("warning");
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
