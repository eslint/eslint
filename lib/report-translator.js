/**
 * @fileoverview A helper that translates context.report() calls from the rule API into generic problem objects
 * @author Teddy Katz
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("assert");
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
        return Object.assign({}, arguments[0]);
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
 * @param {MessageDescriptor} descriptor A descriptor for the report from a rule. This descriptor may be mutated
 * by this function.
 * @returns {MessageDescriptor} The updated MessageDescriptor that infers the `start` and `end` properties from
 * the `node` of the original descriptor, or infers the `start` from the `loc` of the original descriptor.
 */
function normalizeReportLoc(descriptor) {
    if (descriptor.loc) {
        if (descriptor.loc.start) {
            return descriptor;
        }
        return Object.assign(descriptor, { loc: { start: descriptor.loc, end: null } });
    }

    return Object.assign(descriptor, { loc: descriptor.node.loc });
}

/**
 * Interpolates data placeholders in report messages
 * @param {MessageDescriptor} descriptor The report message descriptor. This descriptor may be mutated
 * by this function.
 * @returns {MessageDescriptor} An new descriptor with a message containing the interpolated data
 */
function normalizeMessagePlaceholders(descriptor) {
    if (!descriptor.data) {
        return descriptor;
    }
    return Object.assign(descriptor, {
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
 * @param {MessageDescriptor} descriptor The report descriptor. This descriptor may be mutated
 * by this function.
 * @param {SourceCode} sourceCode The source code object to get text between fixes.
 * @returns {MessageDescriptor} The updated descriptor.
 */
function normalizeFixes(descriptor, sourceCode) {
    if (typeof descriptor.fix !== "function") {
        return Object.assign(descriptor, { fix: null });
    }

    // @type {null | Fix | Fix[] | IterableIterator<Fix>}
    const fix = descriptor.fix(ruleFixer);

    // Merge to one.
    if (fix && Symbol.iterator in fix) {
        return Object.assign(descriptor, { fix: mergeFixes(Array.from(fix), sourceCode) });
    }
    return Object.assign(descriptor, { fix });
}

/**
 * Creates information about the report from a descriptor
 * @param {MessageDescriptor} descriptor The message descriptor
 * @param {string} ruleId The rule ID of the problem
 * @param {(0|1|2)} severity The severity of the problem
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
 * }} Information about the report
 */
function createProblemFromDescriptor(descriptor, ruleId, severity) {
    const problem = {
        ruleId,
        severity,
        message: descriptor.message,
        line: descriptor.loc.start.line,
        column: descriptor.loc.start.column + 1,
        nodeType: descriptor.node && descriptor.node.type || null
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

/**
 * Returns a function that converts the arguments of a `context.report` call from a rule into a reported
 * problem for the Node.js API, without the `ruleId` and `severity` properties. The reported problem
 * may be mutated by the claler after being returned from this function. However, none of the original arguments
 * to this function should be mutated.
 * @param {{ruleId: string, severity: number, sourceCode: SourceCode}} metadata Metadata for the reported problem
 * @param {SourceCode} sourceCode The `SourceCode` instance for the text being linted
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

    /*
     * `createReportTranslator` gets called once per enabled rule per file. It needs to be very performant.
     * The report translator itself (i.e. the function that `createReportTranslator` returns) gets
     * called every time a rule reports a problem, which happens much less frequently (usually, the vast
     * majority of rules don't report any problems for a given file).
     */
    return function() {
        const descriptor = normalizeMultiArgReportCall.apply(null, arguments);

        assertValidNodeInfo(descriptor);
        normalizeReportLoc(descriptor);
        normalizeMessagePlaceholders(descriptor);
        normalizeFixes(descriptor, metadata.sourceCode);

        const problem = createProblemFromDescriptor(descriptor, metadata.ruleId, metadata.severity);

        problem.source = metadata.sourceCode.lines[problem.line - 1] || "";

        return problem;
    };
};
