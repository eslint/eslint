/**
 * @fileoverview Manages the suppressed violations.
 * @author Iacovos Constantinou
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const fs = require("node:fs");
const path = require("node:path");
const { calculateStatsPerFile } = require("../eslint/eslint-helpers");

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * Manages the suppressed violations.
 */
class SuppressionsService {
    suppressionsLocation = "";
    cwd = "";

    /**
     * Creates a new instance of SuppressionsService.
     * @param {Object} options The options.
     * @param {string} [options.filePath] The location of the suppressions file.
     * @param {string} [options.cwd] The current working directory.
     */
    constructor({ filePath, cwd }) {
        this.suppressionsLocation = filePath;
        this.cwd = cwd;
    }

    /**
     * Updates the suppressions file based on the provided lint results.
     * It goes through each file and counts the number of violations per rule.
     * Warnings are ignored.
     * @param {LintResult[]} results The lint results.
     * @returns {void}
     */
    async suppressAll(results) {
        const output = {};

        for (const result of results) {
            const relativeFilePath = this.getRelativeFilePath(result.filePath);
            const violationsByRule = SuppressionsService.countViolationsByRule(result.messages);

            output[relativeFilePath] = violationsByRule;
        }

        await this.save(output);
    }

    /**
     * Updates the suppressions file based on the current violations and the provided rules.
     * @param {LintResult[]} results The lint results.
     * @param {string[]} rules The rules to suppress.
     * @returns {void}
     */
    async suppressByRules(results, rules) {
        const suppressions = await this.load();

        for (const result of results) {

            const relativeFilePath = this.getRelativeFilePath(result.filePath);
            const violationsByRule = SuppressionsService.countViolationsByRule(result.messages);

            for (const ruleId in violationsByRule) {
                if (!rules.includes(ruleId)) {
                    continue;
                }

                if (!suppressions[relativeFilePath]) {
                    suppressions[relativeFilePath] = {};
                }

                suppressions[relativeFilePath][ruleId] = violationsByRule[ruleId];
            }
        }

        await this.save(suppressions);
    }

    /**
     * Removes old, unused suppressions for violations that do not occur anymore.
     * @param {LintResult[]} results The lint results.
     * @returns {void} No return value.
     */
    async prune(results) {
        const suppressions = await this.load();
        const { unused } = this.applySuppressions(results, suppressions);

        for (const file in unused) {
            if (!suppressions[file]) {
                continue;
            }

            for (const rule in unused[file]) {
                if (!suppressions[file][rule]) {
                    continue;
                }

                const suppressionsCount = suppressions[file][rule].count;
                const violationsCount = unused[file][rule].count;

                if (suppressionsCount === violationsCount) {

                    // Remove unused rules
                    delete suppressions[file][rule];
                } else {

                    // Update the count to match the new number of violations
                    suppressions[file][rule].count -= violationsCount;
                }
            }

            if (Object.keys(suppressions[file]).length === 0) {

                // Cleanup files with no rules
                delete suppressions[file];
            }
        }

        await this.save(suppressions);
    }

    /**
     * Checks the provided suppressions against the lint results.
     *
     * For each file, counts the number of violations per rule.
     * For each rule in each file, compares the number of violations against the counter from the suppressions file.
     * If the number of violations is less or equal to the counter, messages are moved to `LintResult#suppressedMessages` and ignored.
     * Otherwise, all violations are reported as usual.
     * @param {LintResult[]} results The lint results.
     * @param {SuppressedViolations} suppressions The suppressions.
     * @returns {{
     *   results: LintResult[],
     *   unused: SuppressedViolations
     * }} The updated results and the unused suppressions.
     */
    applySuppressions(results, suppressions) {

        /**
         * We copy both the results and the suppressions to avoid modifying the original objects
         * We remove only suppressions and result messages that are matched and hence suppressed
         * We leave the rest untouched to minimize the risk of losing parts of the original data
         */
        const filtered = structuredClone(results);
        const unused = structuredClone(suppressions);

        for (const result of filtered) {
            const relativeFilePath = this.getRelativeFilePath(result.filePath);

            if (!suppressions[relativeFilePath]) {
                continue;
            }

            const violationsByRule = SuppressionsService.countViolationsByRule(result.messages);

            for (const ruleId in violationsByRule) {
                if (!unused[relativeFilePath][ruleId]) {
                    continue;
                }

                const suppressionsCount = unused[relativeFilePath][ruleId].count;
                const violationsCount = violationsByRule[ruleId].count;

                // Suppress messages if the number of violations is less or equal to the suppressions count
                if (violationsCount <= suppressionsCount) {
                    SuppressionsService.suppressMessagesByRule(result, ruleId);
                }

                // Update the count to match the new number of violations, otherwise remove the rule entirely
                if (violationsCount < suppressionsCount) {
                    unused[relativeFilePath][ruleId].count = suppressionsCount - violationsCount;
                } else {
                    delete unused[relativeFilePath][ruleId];
                }
            }

            // Cleanup files with no rules
            if (Object.keys(unused[relativeFilePath]).length === 0) {
                delete unused[relativeFilePath];
            }
        }

        return {
            results: filtered,
            unused
        };
    }

    /**
     * Loads the suppressions file.
     * @throws {Error} If the suppressions file cannot be parsed.
     * @returns {Promise<SuppressedViolations>} The suppressions.
     */
    async load() {
        if (await fs.promises.access(this.suppressionsLocation).then(() => true).catch(() => false)) {
            try {
                const data = await fs.promises.readFile(this.suppressionsLocation, "utf8");

                return JSON.parse(data);
            } catch {
                throw new Error(`Failed to parse suppressions file at ${this.suppressionsLocation}`);
            }
        }

        return {};
    }

    /**
     * Updates the suppressions file.
     * @param {SuppressedViolations} suppressions The suppressions to save.
     * @returns {Promise<void>}
     * @private
     */
    async save(suppressions) {
        await fs.promises.writeFile(
            this.suppressionsLocation,
            JSON.stringify(suppressions, null, 2)
        );
    }

    /**
     * Counts the violations by rule, ignoring warnings.
     * @param {LintMessage[]} messages The messages to count.
     * @returns {Record<string, number>} The number of violations by rule.
     */
    static countViolationsByRule(messages) {
        return messages.reduce((totals, message) => {
            if (message.severity === 2) {
                totals[message.ruleId] ??= { count: 0 };
                totals[message.ruleId].count++;
            }
            return totals;
        }, {});
    }

    /**
     * Returns the relative path of a file to the current working directory.
     * Always in POSIX format for consistency and interoperability.
     * @param {string} filePath The file path.
     * @returns {string} The relative file path.
     */
    getRelativeFilePath(filePath) {
        return path
            .relative(this.cwd, filePath)
            .split(path.sep)
            .join(path.posix.sep);
    }

    /**
     * Moves the messages matching the rule to `LintResult#suppressedMessages` and updates the stats.
     * @param {LintResult} result The result to update.
     * @param {string} ruleId The rule to suppress.
     * @returns {void}
     */
    static suppressMessagesByRule(result, ruleId) {
        const suppressedMessages = result.messages.filter(message => message.ruleId === ruleId);

        result.suppressedMessages = result.suppressedMessages.concat(
            suppressedMessages
                .map(message => {
                    message.suppressions = [{
                        type: "file",
                        justification: ""
                    }];

                    return message;
                })
        );

        result.messages = result.messages.filter(message => message.ruleId !== ruleId);
        Object.assign(result, calculateStatsPerFile(result.messages));
    }
}

module.exports = { SuppressionsService };