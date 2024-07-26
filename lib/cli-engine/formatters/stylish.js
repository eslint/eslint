/**
 * @fileoverview Stylish reporter
 * @author Sindre Sorhus
 */
"use strict";

const chalk = require("chalk"),
    stripAnsi = require("strip-ansi");

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

/**
 * Formats a two-dimensional array of strings into a table.
 * @param {string[][]} rows The rows of the table, each row being an array of strings representing the columns.
 * @returns {string} The formatted table.
 */
function table(rows) {
    const columnSizes = new Array(rows[0].length).fill(0);

    for (const row of rows) {
        for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
            const length = stripAnsi(row[columnIndex]).length;

            if (length > columnSizes[columnIndex]) {
                columnSizes[columnIndex] = length;
            }
        }
    }

    const hsep = "  ";
    let result = "";

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex];

        for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
            const column = row[columnIndex];
            const spacing = " ".repeat(columnSizes[columnIndex] - stripAnsi(column).length);

            result += hsep;

            if (columnIndex === 0) {
                result += spacing + column;
            } else {
                result += column + (columnIndex === row.length - 1 ? "" : spacing);
            }
        }

        if (rowIndex < rows.length - 1) {
            result += "\n";
        }
    }

    return result;
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

                const row = [
                    (message.line || 0).toString(),
                    (message.column || 0).toString(),
                    messageType,
                    message.message.replace(/([^ ])\.$/u, "$1")
                ];

                if (message.ruleId) {
                    row.push(chalk.dim(message.ruleId));
                }

                return row;
            })
        ).split("\n").map(el => el.replace(/(\d+)\s+(\d+)/u, (m, p1, p2) => chalk.dim(`${p1}:${p2}`))).join("\n")}\n\n`;
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

    // Resets output color, for prevent change on top level
    return total > 0 ? chalk.reset(output) : "";
};
