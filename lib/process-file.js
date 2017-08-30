"use strict";

const fs = require("fs");
const path = require("path");
const Linter = require("./linter");
const Plugins = require("./config/plugins");

/**
 * It will calculate the error and warning count for collection of messages per file
 * @param {Object[]} messages - Collection of messages
 * @returns {Object} Contains the stats
 * @private
 */
function calculateStatsPerFile(messages) {
    return messages.reduce((stat, message) => {
        if (message.fatal || message.severity === 2) {
            stat.errorCount++;
            if (message.fix) {
                stat.fixableErrorCount++;
            }
        } else {
            stat.warningCount++;
            if (message.fix) {
                stat.fixableWarningCount++;
            }
        }
        return stat;
    }, {
        errorCount: 0,
        warningCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0
    });
}

// FIXME: this code is copy-pasted from cli-engine, should be deduped.
// It needs to be in a separate file so that the workers can access it directly.

// FIXME: this function signature is a mess

/**
 * Processes an source code using ESLint.
 * @param {string} text The source code to check.
 * @param {Object} config The configuration options for ESLint.
 * @param {string} filename An optional string representing the texts filename.
 * @param {boolean|Function} fix Indicates if fixes should be processed.
 * @param {boolean} allowInlineConfig Allow/ignore comments that change config.
 * @returns {LintResult} The results for linting on this text.
 * @private
 */
function processText(text, config, filename, fix, allowInlineConfig, rulesdirs, cwd) {


    let filePath,
        messages,

        fileExtension,
        processor,
        fixedResult;

    if (filename) {
        filePath = path.resolve(filename);

        fileExtension = path.extname(filename);
    }

    filename = filename || "<text>";

    const linter = new Linter();

    rulesdirs.forEach(rulesdir => {
        linter.rules.load(rulesdir, cwd);
    });
    const plugins = new Plugins(linter.environments, linter.rules);

    plugins.loadAll(config.plugins || []);
    const loadedPlugins = plugins.getAll();

    for (const plugin in loadedPlugins) {
        if (loadedPlugins[plugin].processors && Object.keys(loadedPlugins[plugin].processors).indexOf(fileExtension) >= 0) {
            processor = loadedPlugins[plugin].processors[fileExtension];
            break;
        }
    }

    if (processor) {
        const parsedBlocks = processor.preprocess(text, filename);
        const unprocessedMessages = [];

        parsedBlocks.forEach(block => {
            unprocessedMessages.push(linter.verify(block, config, {
                filename,
                allowInlineConfig
            }));
        });

        // TODO(nzakas): Figure out how fixes might work for processors

        messages = processor.postprocess(unprocessedMessages, filename);

    } else {

        if (fix) {
            fixedResult = linter.verifyAndFix(text, config, {
                filename,
                allowInlineConfig,
                fix
            });
            messages = fixedResult.messages;
        } else {
            messages = linter.verify(text, config, {
                filename,
                allowInlineConfig
            });
        }
    }

    const stats = calculateStatsPerFile(messages);

    const result = {
        filePath: filename,
        messages,
        errorCount: stats.errorCount,
        warningCount: stats.warningCount,
        fixableErrorCount: stats.fixableErrorCount,
        fixableWarningCount: stats.fixableWarningCount
    };

    if (fixedResult && fixedResult.fixed) {
        result.output = fixedResult.output;
    }

    if (result.errorCount + result.warningCount > 0 && typeof result.output === "undefined") {
        result.source = text;
    }

    return result;
}

// FIXME: this function signature is a mess
// FIXME: add error handling
/**
 * Processes an individual file using ESLint. Files used here are known to
 * exist, so no need to check that here.
 * @param {string} filename The filename of the file being checked.
 * @param {Object} config The configuration object for ESLint.
 * @param {Object} options The CLIEngine options object.
 * @param {Function} callback callback
 * @returns {void}
 * @private
 */
module.exports = function processFile(filename, config, options, rulesdirs, cwd, callback) {
    const text = fs.readFileSync(path.resolve(filename), "utf8"),
        result = processText(text, config, filename, options.fix, options.allowInlineConfig, rulesdirs, cwd);

    callback(result);
};
