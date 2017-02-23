/**
 * @fileoverview Stylish reporter
 * @author Sindre Sorhus
 */
"use strict";

const chalk = require("chalk"),
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

/**
 * Returns true if and only if any fixes were applied to any input files
 * @param {Object[]} results - Collection of messages from all the files
 * @returns {boolean} If any fixes were applied
 * @private
 */
function fixesWereApplied(results) {
    return Boolean(results.some(r => r.output));
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function(results) {

    let output = "\n",
        total = 0,
        errors = 0,
        warnings = 0,
        summaryColor = "yellow",
        showOutput = false;

    const didApplyFixes = fixesWereApplied(results);

    results.forEach(function(result) {
        const messages = result.messages;

        if (messages.length === 0) {
            return;
        }

        total += messages.length;
        output += `${chalk.underline(result.filePath)}\n`;

        output += `${table(
            messages.map(function(message) {
                let messageType;

                if (message.fatal || message.severity === 2) {
                    messageType = chalk.red("error");
                    summaryColor = "red";
                    errors++;
                } else {
                    messageType = chalk.yellow("warning");
                    warnings++;
                }

                return [
                    "",
                    message.line || 0,
                    message.column || 0,
                    messageType,
                    message.message.replace(/\.$/, ""),
                    chalk.dim(message.ruleId || "")
                ];
            }),
            {
                align: ["", "r", "l"],
                stringLength(str) {
                    return chalk.stripColor(str).length;
                }
            }
        ).split("\n").map(function(el) {
            return el.replace(/(\d+)\s+(\d+)/, function(m, p1, p2) {
                return chalk.dim(`${p1}:${p2}`);
            });
        }).join("\n")}\n\n`;
    });

    if (total > 0) {
        output += chalk[summaryColor].bold([
            "\u2716 ", total, pluralize(" problem", total),
            " (", errors, pluralize(" error", errors), ", ",
            warnings, pluralize(" warning", warnings), ")\n"
        ].join(""));
        showOutput = true;
    }

    if (didApplyFixes) {
        const message = chalk.cyan("Fixes were applied.");

        if (total > 0) {
            output += "\n";
        }
        output += message;
        showOutput = true;
    }

    return showOutput ? output : "";
};
