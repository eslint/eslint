"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const fs = require("node:fs");
const path = require("node:path");

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * Manages the suppressed violations.
 */
class SuppressedViolationsManager {
    suppressionsLocation = "";
    cwd = "";

    /**
     * Creates a new instance of SuppressedViolationsManager.
     * @param {string} suppressionsLocation The location of the suppressions file.
     * @param {string} cwd The current working directory.
     */
    constructor(suppressionsLocation, cwd) {
        this.suppressionsLocation = suppressionsLocation;
        this.cwd = cwd;
    }

    /**
     * Updates the suppressions file based on the provided lint resuts.
     * It goes through each file and counts the number of violations per rule.
     * Warnings are ignored.
     * @param {LintResult[]} results The lint results.
     * @returns {void}
     */
    suppressAll(results) {
        const output = {};

        for (const result of results) {
            const relativeFilePath = path.posix.relative(this.cwd, result.filePath);
            const violationsByRule = SuppressedViolationsManager.countViolationsByRule(result.messages);

            output[relativeFilePath] = violationsByRule;
        }

        this.save(output);
    }

    /**
     * Updates the suppressions file based on the current violations and the provided rules.
     * @param {LintResult[]} results The lint results.
     * @param {string[]} rules The rules to suppress.
     * @returns {void}
     */
    suppressByRules(results, rules) {
        const suppressions = this.load();

        for (const result of results) {

            const violationsByRule = SuppressedViolationsManager.countViolationsByRule(result.messages);

            for (const ruleId in violationsByRule) {
                if (!rules.includes(ruleId)) {
                    continue;
                }

                const relativeFilePath = path.posix.relative(this.cwd, result.filePath);

                if (suppressions[relativeFilePath]) {
                    suppressions[relativeFilePath][ruleId] = violationsByRule[ruleId];
                } else {
                    suppressions[relativeFilePath] = {
                        [ruleId]: violationsByRule[ruleId]
                    };
                }
            }
        }

        this.save(suppressions);
    }

    /**
     * Removes old, unused suppressions for violations that do not occur anymore.
     * @param {LintResult[]} results The lint results.
     * @returns {void} No return value.
     */
    prune(results) {
        const suppressions = this.load();
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

        this.save(suppressions);
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
        const unused = structuredClone(suppressions);

        for (const result of results) {
            const relativeFilePath = path.posix.relative(this.cwd, result.filePath);

            if (!suppressions[relativeFilePath]) {
                continue;
            }

            const violationsByRule = SuppressedViolationsManager.countViolationsByRule(result.messages);

            for (const ruleId in violationsByRule) {
                if (!unused[relativeFilePath][ruleId]) {
                    continue;
                }

                const suppressionsCount = unused[relativeFilePath][ruleId].count;
                const violationsCount = violationsByRule[ruleId].count;

                if (violationsCount <= suppressionsCount) {
                    result.suppressedMessages = result.messages.filter(message => message.ruleId === ruleId);
                    result.messages = result.messages.filter(message => message.ruleId !== ruleId);
                    result.errorCount -= violationsCount;

                    if (violationsCount < suppressionsCount) {

                        // Update the count to match the new number of violations
                        unused[relativeFilePath][ruleId].count = suppressionsCount - violationsCount;
                    } else {

                        // Remove the rule if the counts are equal
                        delete unused[relativeFilePath][ruleId];
                    }
                } else {

                    // Mark the rule as used when the number of violations is greater than the counter
                    delete unused[relativeFilePath][ruleId];
                }
            }

            // Cleanup files with no rules
            if (Object.keys(unused[relativeFilePath]).length === 0) {
                delete unused[relativeFilePath];
            }
        }

        return {
            results,
            unused
        };
    }

    /**
     * Loads the suppressions file.
     * @throws {Error} If the suppressions file cannot be parsed.
     * @returns {SuppressedViolations} The suppressions.
     */
    load() {
        if (fs.existsSync(this.suppressionsLocation)) {
            try {
                return JSON.parse(fs.readFileSync(this.suppressionsLocation, "utf8"));
            } catch {
                throw new Error(`Failed to parse suppressions file at ${this.suppressionsLocation}`);
            }
        }

        return {};
    }

    /**
     * Updates the suppressions file.
     * @param {SuppressedViolations} suppressions The suppressions to save.
     * @returns {void}
     * @private
     */
    save(suppressions) {
        fs.writeFileSync(
            this.suppressionsLocation,
            JSON.stringify(suppressions, null, 2)
        );
    }

    /**
     * Counts the violations by rule.
     * @param {LintMessage[]} messages The messages to count.
     * @returns {Record<string, number>} The violations by rule.
     */
    static countViolationsByRule(messages) {
        const violationsByRule = {};

        for (const message of messages) {
            if (message.severity !== 2) {
                continue;
            }

            if (violationsByRule[message.ruleId]) {
                violationsByRule[message.ruleId].count++;
            } else {
                violationsByRule[message.ruleId] = {
                    count: 1
                };
            }
        }

        return violationsByRule;
    }
}

module.exports = { SuppressedViolationsManager };
