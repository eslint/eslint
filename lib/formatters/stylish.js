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

    var severity = rules[message.ruleId][0] || rules[message.ruleId];

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
        rules = config.rules || {};

    results.forEach(function(result) {
        var messages = result.messages;

        if (messages.length === 0) {
            return;
        }

        total += messages.length;
        output += chalk.underline(result.filePath) + "\n";

        output += table(
            messages.map(function(message) {
                return [
                    "",
                    message.line || 0,
                    message.column || 0,
                    getMessageType(message, rules),
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

    output += chalk.red.bold("\u2716 " + total + " problem" + (total === 1 ? "" : "s") + "\n");

    return total > 0 ? output : "";
};
