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
 * Returns whether a comment is alone on its line.
 * @param {Comment} comment The comment node which will be deleted.
 * @param {string} line Contents of the comment's line.
 * @returns {boolean} Whether the comment is alone on its line.
 */
function commentIsAloneOnLine(comment, line) {
    return comment.type === "Block" ? line.length === comment.value.length + "/**/".length : line.startsWith("//");
}

/**
 * Finds where to remove text for an unused directive.
 * @param {Directive} directive Unused directive to be removed.
 * @param {SourceCode} sourceCode A SourceCode object for the given text
 * @returns {Range} Removal range for the unused directive.
 * @see https://github.com/eslint/rfcs/pull/78
 */
function getDirectiveRemovalRange(directive, sourceCode) {
    const lineIndex = directive.unprocessedDirective.line - 1;
    const lineStart = sourceCode.lineStartIndices[lineIndex];
    const commentStart = lineStart + directive.unprocessedDirective.column - 1;
    const comment = sourceCode.getTokenByRangeStart(commentStart, { includeComments: true });
    const line = sourceCode.lines[lineIndex];

    // If the directive's rule isn't the only one in the comment, only remove that rule
    if (comment.value.includes(",")) {
        const ruleStart = comment.value.indexOf(directive.ruleId);
        const ruleEnd = ruleStart + directive.ruleId.length;

        if (comment.value.trimRight().endsWith(directive.ruleId)) {
            for (const prefix of [", ", ","]) {
                if (comment.value.slice(ruleStart - prefix.length, ruleStart) === prefix) {
                    return [commentStart + 2 + ruleStart - prefix.length, commentStart + ruleEnd + 2];
                }
            }
        } else {
            for (const suffix of [", ", ","]) {
                if (comment.value.slice(ruleEnd, ruleEnd + suffix.length) === suffix) {
                    return [commentStart + 2 + ruleStart, commentStart + 2 + ruleEnd + suffix.length];
                }
            }
        }

        return [commentStart + 2 + ruleStart, commentStart + 2 + ruleEnd];
    }

    // If the comment is alone on its line, remove the entire line
    if (commentIsAloneOnLine(comment, line)) {
        return [
            lineStart,
            lineIndex === sourceCode.lines.length - 1
                ? lineStart + line.length
                : sourceCode.lineStartIndices[lineIndex + 1]
        ];
    }

    // If the comment has space between it and whatever else is on its line, collapse the space
    if (commentStart !== 0 && ["\n", " "].includes(sourceCode.text[commentStart - 1])) {
        if (comment.range[1] === sourceCode.text.length) {
            return [comment.range[0] - 1, comment.range[1]];
        }

        if (sourceCode.text[comment.range[1]] === " ") {
            return [comment.range[0], comment.range[1] + 1];
        }
    }

    return comment.range;
}

/**
 * This is the same as the exported function, except that it
 * doesn't handle disable-line and disable-next-line directives, and it always reports unused
 * disable directives.
 * @param {Object} options options for applying directives. This is the same as the options
 * for the exported function, except that `reportUnusedDisableDirectives` is not supported
 * (this function always reports unused disable directives).
 * @returns {{problems: Problem[], unusedDisableDirectives: Problem[]}} An object with a list
 * of filtered problems and unused eslint-disable directives
 */
function applyDirectives(options) {
    const problems = [];
    let nextDirectiveIndex = 0;
    let currentGlobalDisableDirective = null;
    const disabledRuleMap = new Map();

    // enabledRules is only used when there is a current global disable directive.
    const enabledRules = new Set();
    const usedDisableDirectives = new Set();

    for (const problem of options.problems) {
        while (
            nextDirectiveIndex < options.directives.length &&
            compareLocations(options.directives[nextDirectiveIndex], problem) <= 0
        ) {
            const directive = options.directives[nextDirectiveIndex++];

            switch (directive.type) {
                case "disable":
                    if (directive.ruleId === null) {
                        currentGlobalDisableDirective = directive;
                        disabledRuleMap.clear();
                        enabledRules.clear();
                    } else if (currentGlobalDisableDirective) {
                        enabledRules.delete(directive.ruleId);
                        disabledRuleMap.set(directive.ruleId, directive);
                    } else {
                        disabledRuleMap.set(directive.ruleId, directive);
                    }
                    break;

                case "enable":
                    if (directive.ruleId === null) {
                        currentGlobalDisableDirective = null;
                        disabledRuleMap.clear();
                    } else if (currentGlobalDisableDirective) {
                        enabledRules.add(directive.ruleId);
                        disabledRuleMap.delete(directive.ruleId);
                    } else {
                        disabledRuleMap.delete(directive.ruleId);
                    }
                    break;

                // no default
            }
        }

        if (disabledRuleMap.has(problem.ruleId)) {
            usedDisableDirectives.add(disabledRuleMap.get(problem.ruleId));
        } else if (currentGlobalDisableDirective && !enabledRules.has(problem.ruleId)) {
            usedDisableDirectives.add(currentGlobalDisableDirective);
        } else {
            problems.push(problem);
        }
    }

    const unusedDisableDirectives = options.directives
        .filter(directive => directive.type === "disable" && !usedDisableDirectives.has(directive))
        .map(directive => ({
            fix: {
                range: getDirectiveRemovalRange(directive, options.sourceCode),
                text: ""
            },
            ruleId: null,
            message: directive.ruleId
                ? `Unused eslint-disable directive (no problems were reported from '${directive.ruleId}').`
                : "Unused eslint-disable directive (no problems were reported).",
            line: directive.unprocessedDirective.line,
            column: directive.unprocessedDirective.column,
            severity: options.reportUnusedDisableDirectives === "warn" ? 1 : 2,
            nodeType: null
        }));

    return { problems, unusedDisableDirectives };
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
 * @param {"off" | "warn" | "error"} options.reportUnusedDisableDirectives If `"warn"` or `"error"`, adds additional problems for unused directives
 * @param {SourceCode} options.sourceCode A SourceCode object for the given text
 * @returns {{ruleId: (string|null), line: number, column: number}[]}
 * A list of reported problems that were not disabled by the directive comments.
 */
module.exports = ({ directives, problems, reportUnusedDisableDirectives = "off", sourceCode }) => {
    const blockDirectives = directives
        .filter(directive => directive.type === "disable" || directive.type === "enable")
        .map(directive => Object.assign({}, directive, { unprocessedDirective: directive }))
        .sort(compareLocations);

    const lineDirectives = lodash.flatMap(directives, directive => {
        switch (directive.type) {
            case "disable":
            case "enable":
                return [];

            case "disable-line":
                return [
                    { type: "disable", line: directive.line, column: 1, ruleId: directive.ruleId, unprocessedDirective: directive },
                    { type: "enable", line: directive.line + 1, column: 0, ruleId: directive.ruleId, unprocessedDirective: directive }
                ];

            case "disable-next-line":
                return [
                    { type: "disable", line: directive.line + 1, column: 1, ruleId: directive.ruleId, unprocessedDirective: directive },
                    { type: "enable", line: directive.line + 2, column: 0, ruleId: directive.ruleId, unprocessedDirective: directive }
                ];

            default:
                throw new TypeError(`Unrecognized directive type '${directive.type}'`);
        }
    }).sort(compareLocations);

    const blockDirectivesResult = applyDirectives({
        problems,
        directives: blockDirectives,
        reportUnusedDisableDirectives,
        sourceCode
    });
    const lineDirectivesResult = applyDirectives({
        problems: blockDirectivesResult.problems,
        directives: lineDirectives,
        reportUnusedDisableDirectives,
        sourceCode
    });

    return reportUnusedDisableDirectives !== "off"
        ? lineDirectivesResult.problems
            .concat(blockDirectivesResult.unusedDisableDirectives)
            .concat(lineDirectivesResult.unusedDisableDirectives)
            .sort(compareLocations)
        : lineDirectivesResult.problems;
};
