/**
 * @fileoverview Reporter grouped by warnings and then errors
 * @author Jack Franklin
 */
"use strict";

var chalk = require("chalk"),
    table = require("text-table");

function pluralize(word, count) {
    return (count === 1 ? word : word + "s");
}

function outputTable(messages) {
    return table(
        messages.map(function(message) {
            return [
                "",
                message.line || 0,
                message.column || 0,
                message.message.replace(/\.$/, ""),
                chalk.gray(message.ruleId || "")
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
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function(results) {

    var output = "\n",
        summaryColor = "yellow",
        errorsForFiles = {},
        warningsForFiles = {};

    results.forEach(function(result) {
        if (result.errorCount > 0) {
            errorsForFiles[result.filePath] = result.messages.filter(function(message) {
                return message.severity === 2;
            });
        }

        if (result.warningCount > 0) {
            warningsForFiles[result.filePath] = result.messages.filter(function(message) {
                return message.severity === 1;
            });
        }
    });

    var filesWithErrors = Object.keys(errorsForFiles),
        filesWithWarnings = Object.keys(warningsForFiles),
        totalErrors = filesWithErrors.length,
        totalWarnings = filesWithWarnings.length,
        total = totalErrors + totalWarnings;

    if (total === 0) {
        return;
    }

    filesWithWarnings.forEach(function(warningFile) {
        output += chalk.yellow("Warnings for ") + chalk.underline(warningFile) + "\n";
        output += outputTable(warningsForFiles[warningFile]);
    });

    filesWithErrors.forEach(function(errorFile) {
        output += chalk.red("Errors for ") + chalk.underline(errorFile) + "\n";
        output += outputTable(errorsForFiles[errorFile]);
    });

    output += chalk.yellow.bold([
        "\u2716 ", total, pluralize(" problem", total),
        " (", totalErrors, pluralize(" error", totalErrors), ", ",
        totalWarnings, pluralize(" warning", totalWarnings), ")\n"
    ].join(""));

    return output;
};
