"use strict";

const assert = require("assert");

class Passthrough {
    constructor(eventGenerator) {
        this.eventGenerator = eventGenerator;
    }

    enterNode(node) {
        this.eventGenerator.enterNode(node);
    }

    leaveNode(node) {
        this.eventGenerator.leaveNode(node);
    }

    onLooped() {}
}

exports.parseForESLint = (code, options) => {
    assert(code === "foo()");
    assert(options.eslintCodePathAnalyzer === true);

    const ast = { type: 'Program', comments: [], loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 5 } }, range: [ 0, 5 ], start: 0, end: 5, tokens: [ { type: 'IDENTIFIER', value: 'foo', loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 3 } }, range: [ 0, 3 ], start: 0, end: 3 }, { type: 'Punctuator', value: '(', loc: { start: { line: 1, column: 3 }, end: { line: 1, column: 4 } }, range: [ 3, 4 ], start: 3, end: 4 }, { type: 'Punctuator', value: ')', loc: { start: { line: 1, column: 4 }, end: { line: 1, column: 5 } }, range: [ 4, 5 ], start: 4, end: 5 } ], sourceType: 'module', directives: undefined, body: [ { type: 'ExpressionStatement', expression: { callee: { name: 'foo', declaration: undefined, type: 'Identifier', loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 3 } }, range: [ 0, 3 ], start: 0, end: 3, _babelType: 'Identifier' }, arguments: [], optional: false, type: 'CallExpression', loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 5 } }, range: [ 0, 5 ], start: 0, end: 5, _babelType: 'CallExpression' }, loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 5 } }, range: [ 0, 5 ], start: 0, end: 5, comments: [], _babelType: 'ExpressionStatement' } ] };

    return {
        ast,
        CodePathAnalyzer: Passthrough,
    };
};

exports.parse = function () {
    throw new Error("Use parseForESLint() instead.");
};
