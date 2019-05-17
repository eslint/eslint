/**
 * @fileoverview Stylish reporter
 * @author Sindre Sorhus
 */
"use strict";

const chalk = require("chalk"),
    stripAnsi = require("strip-ansi"),
    table = require("text-table");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Given a word and a count, append an s if count is not one.
 * @param {string} word A word in its singular form.
 * @param {int} count A number controlling whether word should be pluralized.
 * @returns {string} The original word with an s on the end if count is not one.
 */
function pluralize(word, count) {
    return (count === 1 ? word : `${word}s`);
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function(results) {

    let output = "\n",
        errorCount = 0,
        warningCount = 0,
        fixableErrorCount = 0,
        fixableWarningCount = 0,
        summaryColor = "yellow";

    results.forEach(result => {
        const messages = result.messages;

        if (messages.length === 0) {
            return;
        }

        errorCount += result.errorCount;
        warningCount += result.warningCount;
        fixableErrorCount += result.fixableErrorCount;
        fixableWarningCount += result.fixableWarningCount;

        output += `${chalk.underline(result.filePath)}\n`;

        output += `${table(
            messages.map(message => {
                let messageType;

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
                    message.message.replace(/([^ ])\.$/, "$1"),
                    chalk.dim(message.ruleId || "")
                ];
            }),
            {
                align: ["", "r", "l"],
                stringLength(str) {
                    return stripAnsi(str).length;
                }
            }
        ).split("\n").map(el => el.replace(/(\d+)\s+(\d+)/, (m, p1, p2) => chalk.dim(`${p1}:${p2}`))).join("\n")}\n\n`;
    });

    const total = errorCount + warningCount;

    if (total > 0) {
        output += chalk[summaryColor].bold([
            "\u2716 ", total, pluralize(" problem", total),
            " (", errorCount, pluralize(" error", errorCount), ", ",
            warningCount, pluralize(" warning", warningCount), ")\n"
        ].join(""));

        if (fixableErrorCount > 0 || fixableWarningCount > 0) {
            output += chalk[summaryColor].bold([
                "  ", fixableErrorCount, pluralize(" error", fixableErrorCount), " and ",
                fixableWarningCount, pluralize(" warning", fixableWarningCount),
                " potentially fixable with the `--fix` option.\n"
            ].join(""));
        }
    }

    return total > 0 ? output : "";
};
