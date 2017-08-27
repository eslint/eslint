/**
 * @fileoverview A helper that translates context.report() calls from the rule API into generic problem objects
 * @author Teddy Katz
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("assert");
const lodash = require("lodash");
const ruleFixer = require("./util/rule-fixer");

//------------------------------------------------------------------------------
// Typedefs
//------------------------------------------------------------------------------

/**
 * An error message description
 * @typedef {Object} MessageDescriptor
 * @property {ASTNode} [node] The reported node
 * @property {Location} loc The location of the problem.
 * @property {string} message The problem message.
 * @property {Object} [data] Optional data to use to fill in placeholders in the
 *      message.
 * @property {Function} [fix] The function to call that creates a fix command.
 */

//------------------------------------------------------------------------------
// Module Definition
//------------------------------------------------------------------------------


/**
 * Translates a multi-argument context.report() call into a single object argument call
 * @param {...*} arguments A list of arguments passed to `context.report`
 * @returns {MessageDescriptor} A normalized object containing report information
 */
function normalizeMultiArgReportCall() {

    // If there is one argument, it is considered to be a new-style call already.
    if (arguments.length === 1) {
        return arguments[0];
    }

    // If the second argument is a string, the arguments are interpreted as [node, message, data, fix].
    if (typeof arguments[1] === "string") {
        return {
            node: arguments[0],
            message: arguments[1],
            data: arguments[2],
            fix: arguments[3]
        };
    }

    // Otherwise, the arguments are interpreted as [node, loc, message, data, fix].
    return {
        node: arguments[0],
        loc: arguments[1],
        message: arguments[2],
        data: arguments[3],
        fix: arguments[4]
    };
}

/**
 * Asserts that either a loc or a node was provided, and the node is valid if it was provided.
 * @param {MessageDescriptor} descriptor A descriptor to validate
 * @returns {MessageDescriptor} The same descriptor
 * @throws AssertionError if neither a node nor a loc was provided, or if the node is not an object
 */
function assertValidNodeInfo(descriptor) {
    if (descriptor.node) {
        assert(typeof descriptor.node === "object", "Node must be an object");
    } else {
        assert(descriptor.loc, "Node must be provided when reporting error if location is not provided");
    }

    return descriptor;
}

/**
 * Normalizes a MessageDescriptor to always have a `loc` with `start` and `end` properties
 * @param {MessageDescriptor} descriptor A descriptor for the report from a rule
 * @returns {MessageDescriptor} A new MessageDescriptor that inferred the `start` and `end` properties from
 * the `node` of the old descriptor, or inferred the `start` from the `loc` of the old descriptor.
 */
function normalizeReportLoc(descriptor) {
    if (descriptor.loc) {
        if (descriptor.loc.start) {
            return descriptor;
        }
        return Object.assign({}, descriptor, { loc: { start: descriptor.loc, end: null } });
    }

    return Object.assign({}, descriptor, { loc: descriptor.node.loc });
}

/**
 * Interpolates data placeholders in report messages
 * @param {MessageDescriptor} descriptor The report message descriptor
 * @returns {MessageDescriptor} An new descriptor with a message containing the interpolated data
 */
function normalizeMessagePlaceholders(descriptor) {
    if (!descriptor.data) {
        return descriptor;
    }
    return Object.assign({}, descriptor, {
        message: descriptor.message.replace(/\{\{\s*([^{}]+?)\s*\}\}/g, (fullMatch, term) => {
            if (term in descriptor.data) {
                return descriptor.data[term];
            }

            return fullMatch;
        })
    });
}

/**
 * Compares items in a fixes array by range.
 * @param {Fix} a The first message.
 * @param {Fix} b The second message.
 * @returns {int} -1 if a comes before b, 1 if a comes after b, 0 if equal.
 * @private
 */
function compareFixesByRange(a, b) {
    return a.range[0] - b.range[0] || a.range[1] - b.range[1];
}

/**
 * Merges the given fixes array into one.
 * @param {Fix[]} fixes The fixes to merge.
 * @param {SourceCode} sourceCode The source code object to get the text between fixes.
 * @returns {void}
 */
function mergeFixes(fixes, sourceCode) {
    if (fixes.length === 0) {
        return null;
    }
    if (fixes.length === 1) {
        return fixes[0];
    }

    fixes.sort(compareFixesByRange);

    const originalText = sourceCode.text;
    const start = fixes[0].range[0];
    const end = fixes[fixes.length - 1].range[1];
    let text = "";
    let lastPos = Number.MIN_SAFE_INTEGER;

    for (const fix of fixes) {
        assert(fix.range[0] >= lastPos, "Fix objects must not be overlapped in a report.");

        if (fix.range[0] >= 0) {
            text += originalText.slice(Math.max(0, start, lastPos), fix.range[0]);
        }
        text += fix.text;
        lastPos = fix.range[1];
    }
    text += originalText.slice(Math.max(0, start, lastPos), end);

    return { range: [start, end], text };
}

/**
 * Gets one fix object from the given descriptor.
 * If the descriptor retrieves multiple fixes, this merges those to one.
 * @param {SourceCode} sourceCode The source code object to get text between fixes.
 * @param {Object} descriptor The report descriptor.
 * @returns {Fix} The got fix object.
 */
function normalizeFixes(sourceCode, descriptor) {
    if (typeof descriptor.fix !== "function") {
        return Object.assign({}, descriptor, { fix: null });
    }

    // @type {null | Fix | Fix[] | IterableIterator<Fix>}
    const fix = descriptor.fix(ruleFixer);

    // Merge to one.
    if (fix && Symbol.iterator in fix) {
        return Object.assign({}, descriptor, { fix: mergeFixes(Array.from(fix), sourceCode) });
    }
    return Object.assign({}, descriptor, { fix });
}

/**
 * Returns a function that converts the arguments of a `context.report` call from a rule into a reported
 * problem for the Node.js API.
 * @param {Object} metadata Metadata that will be added to the reports. This cannot be modified
 * by rules.
 * @param {string} metadata.ruleId The rule that the reported messages should be associated with
 * @param {0|1|2} metadata.severity The severity that the messages should have
 * @param {SourceCode} metadata.sourceCode The `SourceCode` instance for the text being linted
 * @returns {function(...args): {
 *      ruleId: string,
 *      severity: (0|1|2),
 *      message: string,
 *      line: number,
 *      column: number,
 *      endLine: (number|undefined),
 *      endColumn: (number|undefined),
 *      nodeType: (string|null),
 *      source: string,
 *      fix: ({text: string, range: [number, number]}|null)
 * }}
 * Information about the report
 */
module.exports = function createReportTranslator(metadata) {
    const ruleId = metadata.ruleId;
    const severity = metadata.severity;
    const sourceCode = metadata.sourceCode;

    return lodash.flow([
        normalizeMultiArgReportCall,
        assertValidNodeInfo,
        normalizeReportLoc,
        normalizeMessagePlaceholders,
        lodash.partial(normalizeFixes, sourceCode),
        descriptor => {
            const problem = {
                ruleId,
                severity,
                message: descriptor.message,
                line: descriptor.loc.start.line,
                column: descriptor.loc.start.column + 1,
                nodeType: descriptor.node && descriptor.node.type || null,
                source: sourceCode.lines[descriptor.loc.start.line - 1] || ""
            };

            if (descriptor.loc.end) {
                problem.endLine = descriptor.loc.end.line;
                problem.endColumn = descriptor.loc.end.column + 1;
            }

            if (descriptor.fix) {
                problem.fix = descriptor.fix;
            }

            return problem;
        }
    ]);
};
