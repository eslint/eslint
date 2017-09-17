/**
 * @fileoverview A module that filters reported problems based on `eslint-disable` and `eslint-enable` comments
 * @author Teddy Katz
 */

"use strict";

const lodash = require("lodash");

/**
 * Compares the locations of two objects in a source file
 * @param {{line: number, column: number}} itemA The first object
 * @param {{line: number, column: number}} itemB The second object
 * @returns {number} A value less than 1 if itemA appears before itemB in the source file, greater than 1 if
 * itemA appears after itemB in the source file, or 0 if itemA and itemB have the same location.
 */
function compareLocations(itemA, itemB) {
    return itemA.line - itemB.line || itemA.column - itemB.column;
}

/**
 * This is the same as the exported function, except that it doesn't handle disable-line and disable-next-line directives.
 * @param {Object} options options (see the exported function)
 * @returns {Problem[]} Filtered problems (see the exported function)
 */
function applyDirectives(options) {
    const problems = [];
    let nextDirectiveIndex = 0;
    let globalDisableActive = false;

    // disabledRules is only used when there is no active global /* eslint-disable */ comment.
    const disabledRules = new Set();

    // enabledRules is only used when there is an active global /* eslint-disable */ comment.
    const enabledRules = new Set();

    for (const problem of options.problems) {
        while (
            nextDirectiveIndex < options.directives.length &&
            compareLocations(options.directives[nextDirectiveIndex], problem) <= 0
        ) {
            const directive = options.directives[nextDirectiveIndex++];

            switch (directive.type) {
                case "disable":
                    if (directive.ruleId === null) {
                        globalDisableActive = true;
                        enabledRules.clear();
                    } else if (globalDisableActive) {
                        enabledRules.delete(directive.ruleId);
                    } else {
                        disabledRules.add(directive.ruleId);
                    }
                    break;

                case "enable":
                    if (directive.ruleId === null) {
                        globalDisableActive = false;
                        disabledRules.clear();
                    } else if (globalDisableActive) {
                        enabledRules.add(directive.ruleId);
                    } else {
                        disabledRules.delete(directive.ruleId);
                    }
                    break;

                // no default
            }
        }

        if (
            globalDisableActive && enabledRules.has(problem.ruleId) ||
            !globalDisableActive && !disabledRules.has(problem.ruleId)
        ) {
            problems.push(problem);
        }
    }

    return problems;
}

/**
 * Given a list of directive comments (i.e. metadata about eslint-disable and eslint-enable comments) and a list
 * of reported problems, determines which problems should be reported.
 * @param {Object} options Information about directives and problems
 * @param {{
 *      type: ("disable"|"enable"|"disable-line"|"disable-next-line"),
 *      ruleId: (string|null),
 *      line: number,
 *      column: number
 * }} options.directives Directive comments found in the file, with one-based columns.
 * Two directive comments can only have the same location if they also have the same type (e.g. a single eslint-disable
 * comment for two different rules is represented as two directives).
 * @param {{ruleId: (string|null), line: number, column: number}[]} options.problems
 * A list of problems reported by rules, sorted by increasing location in the file, with one-based columns.
 * @returns {{ruleId: (string|null), line: number, column: number}[]}
 * A list of reported problems that were not disabled by the directive comments.
 */
module.exports = options => {
    const blockDirectives = options.directives
        .filter(directive => directive.type === "disable" || directive.type === "enable")
        .sort(compareLocations);

    const lineDirectives = lodash.flatMap(options.directives, directive => {
        switch (directive.type) {
            case "disable":
            case "enable":
                return [];

            case "disable-line":
                return [
                    { type: "disable", line: directive.line, column: 1, ruleId: directive.ruleId },
                    { type: "enable", line: directive.line + 1, column: 0, ruleId: directive.ruleId }
                ];

            case "disable-next-line":
                return [
                    { type: "disable", line: directive.line + 1, column: 1, ruleId: directive.ruleId },
                    { type: "enable", line: directive.line + 2, column: 0, ruleId: directive.ruleId }
                ];

            default:
                throw new TypeError(`Unrecognized directive type '${directive.type}'`);
        }
    }).sort(compareLocations);

    const problemsAfterBlockDirectives = applyDirectives({ problems: options.problems, directives: blockDirectives });
    const problemsAfterLineDirectives = applyDirectives({ problems: problemsAfterBlockDirectives, directives: lineDirectives });

    return problemsAfterLineDirectives.sort(compareLocations);
};
