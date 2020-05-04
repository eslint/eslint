/**
 * @fileoverview HTML reporter
 * @author Julian Laval
 */
"use strict";

const lodash = require("lodash");
const fs = require("fs");
const path = require("path");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const pageTemplate = lodash.template(fs.readFileSync(path.join(__dirname, "html-template-page.html"), "utf-8"));
const messageTemplate = lodash.template(fs.readFileSync(path.join(__dirname, "html-template-message.html"), "utf-8"));
const resultTemplate = lodash.template(fs.readFileSync(path.join(__dirname, "html-template-result.html"), "utf-8"));

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
 * Renders text along the template of x problems (x errors, x warnings)
 * @param {string} totalErrors Total errors
 * @param {string} totalWarnings Total warnings
 * @returns {string} The formatted string, pluralized where necessary
 */
function renderSummary(totalErrors, totalWarnings) {
    const totalProblems = totalErrors + totalWarnings;
    let renderedText = `${totalProblems} ${pluralize("problem", totalProblems)}`;

    if (totalProblems !== 0) {
        renderedText += ` (${totalErrors} ${pluralize("error", totalErrors)}, ${totalWarnings} ${pluralize("warning", totalWarnings)})`;
    }
    return renderedText;
}

/**
 * Get the color based on whether there are errors/warnings...
 * @param {string} totalErrors Total errors
 * @param {string} totalWarnings Total warnings
 * @returns {int} The color code (0 = green, 1 = yellow, 2 = red)
 */
function renderColor(totalErrors, totalWarnings) {
    if (totalErrors !== 0) {
        return 2;
    }
    if (totalWarnings !== 0) {
        return 1;
    }
    return 0;
}

/**
 * Get HTML (table rows) describing the messages.
 * @param {Array} messages Messages.
 * @param {int} parentIndex Index of the parent HTML row.
 * @param {Object} rulesMeta Dictionary containing metadata for each rule executed by the analysis.
 * @returns {string} HTML (table rows) describing the messages.
 */
function renderMessages(messages, parentIndex, rulesMeta) {

    /**
     * Get HTML (table row) describing a message.
     * @param {Object} message Message.
     * @returns {string} HTML (table row) describing a message.
     */
    return lodash.map(messages, message => {
        const lineNumber = message.line || 0;
        const columnNumber = message.column || 0;
        let ruleUrl;

        if (rulesMeta) {
            const meta = rulesMeta[message.ruleId];

            ruleUrl = lodash.get(meta, "docs.url", null);
        }

        return messageTemplate({
            parentIndex,
            lineNumber,
            columnNumber,
            severityNumber: message.severity,
            severityName: message.severity === 1 ? "Warning" : "Error",
            message: message.message,
            ruleId: message.ruleId,
            ruleUrl
        });
    }).join("\n");
}

// eslint-disable-next-line jsdoc/require-description
/**
 * @param {Array} results Test results.
 * @param {Object} rulesMeta Dictionary containing metadata for each rule executed by the analysis.
 * @returns {string} HTML string describing the results.
 */
function renderResults(results, rulesMeta) {
    return lodash.map(results, (result, index) => resultTemplate({
        index,
        color: renderColor(result.errorCount, result.warningCount),
        filePath: result.filePath,
        summary: renderSummary(result.errorCount, result.warningCount)

    }) + renderMessages(result.messages, index, rulesMeta)).join("\n");
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function(results, data) {
    let totalErrors,
        totalWarnings;

    const metaData = data ? data.rulesMeta : {};

    totalErrors = 0;
    totalWarnings = 0;

    // Iterate over results to get totals
    results.forEach(result => {
        totalErrors += result.errorCount;
        totalWarnings += result.warningCount;
    });

    return pageTemplate({
        date: new Date(),
        reportColor: renderColor(totalErrors, totalWarnings),
        reportSummary: renderSummary(totalErrors, totalWarnings),
        results: renderResults(results, metaData)
    });
};
