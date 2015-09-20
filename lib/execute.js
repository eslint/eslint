"use strict";

var debug = require("debug"),
    fs = require("fs"),
    path = require("path"),
    eslint = require("./eslint");
/**
 * It will calculate the error and warning count for collection of messages per file
 * @param {Object[]} messages - Collection of messages
 * @returns {Object} Contains the stats
 * @private
 */
function calculateStatsPerFile(messages) {
    return messages.reduce(function(stat, message) {
        if (message.fatal || message.severity === 2) {
            stat.errorCount++;
        } else {
            stat.warningCount++;
        }
        return stat;
    }, {
        errorCount: 0,
        warningCount: 0
    });
}

/**
 * Processes an source code using ESLint.
 * @param {string} text The source code to check.
 * @param {Object} configHelper The configuration options for ESLint.
 * @param {string} filename An optional string representing the texts filename.
 * @returns {Result} The results for linting on this text.
 * @private
 */
function processText(text, config, filename) {

    // clear all existing settings for a new file
    eslint.reset();

    var messages,
        stats;

    filename = filename || "<text>";
    debug("Linting " + filename);
    // loadPlugins(config.plugins);

    messages = eslint.verify(text, config, filename);

    stats = calculateStatsPerFile(messages);

    return {
        filePath: filename,
        messages: messages,
        errorCount: stats.errorCount,
        warningCount: stats.warningCount
    };
}

/**
 * Processes an individual file using ESLint. Files used here are known to
 * exist, so no need to check that here.
 * @param {string} filename The filename of the file being checked.
 * @param {Object} configHelper The configuration options for ESLint.
 * @returns {Result} The results for linting on this file.
 * @private
 */
function processFile(filename, config) {

    var text = fs.readFileSync(path.resolve(filename), "utf8");

    return processText(text, config, filename);
}


function executeOnFile(filename, config) {
    debug("Processing " + filename);
    var res = processFile(filename, config);
    return res;
}

process.on("message", function(m) {
    var result = executeOnFile(m.filename, m.config);
    process.send(result);
    process.send("done");
});
