"use strict";

const assert = require("assert");
const ScopeManager = require("eslint-scope/lib/scope-manager");
const Referencer = require("eslint-scope/lib/referencer");
const vk = require("eslint-visitor-keys");

class EnhancedReferencer extends Referencer {
    visitClass(node) {

        // Visit decorators.
        if (node.experimentalDecorators) {
            for (const decorator of node.experimentalDecorators) {
                this.visit(decorator);
            }
        }

        // Do default.
        super.visitClass(node);
    }

    Decorator(node) {
        if (node.expression) {
            this.visit(node.expression);
        }
    }
}

function analyzeScope(ast) {
    const options = {
        optimistic: false,
        directive: false,
        nodejsScope: false,
        impliedStrict: false,
        sourceType: "script",
        ecmaVersion: 6,
        childVisitorKeys: null,
        fallback: vk.getKeys
    };
    const scopeManager = new ScopeManager(options);
    const referencer = new EnhancedReferencer(options, scopeManager);

    referencer.visit(ast);

    return scopeManager;
}

exports.parseForESLint = (code, options) => {
    assert(code === "@foo class A {}");
    assert(options.eslintVisitorKeys === true);
    assert(options.eslintScopeManager === true);

    const ast = { type: "Program", start: 0, end: 15, loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 15 } }, comments: [], tokens: [{ type: "Punctuator", value: "@", start: 0, end: 1, loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 1 } }, range: [0, 1] }, { type: "Identifier", value: "foo", start: 1, end: 4, loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 4 } }, range: [1, 4] }, { type: "Keyword", value: "class", start: 5, end: 10, loc: { start: { line: 1, column: 5 }, end: { line: 1, column: 10 } }, range: [5, 10] }, { type: "Identifier", value: "A", start: 11, end: 12, loc: { start: { line: 1, column: 11 }, end: { line: 1, column: 12 } }, range: [11, 12] }, { type: "Punctuator", value: "{", start: 13, end: 14, loc: { start: { line: 1, column: 13 }, end: { line: 1, column: 14 } }, range: [13, 14] }, { type: "Punctuator", value: "}", start: 14, end: 15, loc: { start: { line: 1, column: 14 }, end: { line: 1, column: 15 } }, range: [14, 15] }], range: [5, 15], sourceType: "module", body: [{ type: "ClassDeclaration", start: 5, end: 15, loc: { start: { line: 1, column: 5 }, end: { line: 1, column: 15 } }, experimentalDecorators: [{ type: "Decorator", start: 0, end: 4, loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 4 } }, expression: { type: "Identifier", start: 1, end: 4, loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 4 }, identifierName: "foo" }, name: "foo", range: [1, 4], _babelType: "Identifier" }, range: [0, 4], _babelType: "Decorator" }], id: { type: "Identifier", start: 11, end: 12, loc: { start: { line: 1, column: 11 }, end: { line: 1, column: 12 }, identifierName: "A" }, name: "A", range: [11, 12], _babelType: "Identifier" }, superClass: null, body: { type: "ClassBody", start: 13, end: 15, loc: { start: { line: 1, column: 13 }, end: { line: 1, column: 15 } }, body: [], range: [13, 15], _babelType: "ClassBody" }, range: [5, 15], _babelType: "ClassDeclaration" }] };

    return {
        ast,
        scopeManager: analyzeScope(ast)
    };
};

exports.parse = function () {
    throw new Error("Use parseForESLint() instead.");
};
