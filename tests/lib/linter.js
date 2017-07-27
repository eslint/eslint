/**
 * @fileoverview Tests for eslint object.
 * @author Nicholas C. Zakas
 */
/* globals window */

"use strict";

//------------------------------------------------------------------------------
// Helper
//------------------------------------------------------------------------------

/**
 * To make sure this works in both browsers and Node.js
 * @param {string} name Name of the module to require
 * @param {Object} windowName name of the window
 * @returns {Object} Required object
 * @private
 */
function compatRequire(name, windowName) {
    if (typeof window === "object") {
        return window[windowName || name];
    } else if (typeof require === "function") {
        return require(name);
    }
    throw new Error(`Cannot find object '${name}'.`);

}

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = compatRequire("chai").assert,
    sinon = compatRequire("sinon"),
    path = compatRequire("path"),
    Linter = compatRequire("../../lib/linter", "eslint");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

const TEST_CODE = "var answer = 6 * 7;",
    BROKEN_TEST_CODE = "var;";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Get variables in the current scope
 * @param {Object} scope current scope
 * @param {string} name name of the variable to look for
 * @returns {ASTNode} The variable object
 * @private
 */
function getVariable(scope, name) {
    let variable = null;

    scope.variables.some(v => {
        if (v.name === name) {
            variable = v;
            return true;
        }
        return false;
    });
    return variable;
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("Linter", () => {
    const filename = "filename.js";
    let sandbox, linter;

    beforeEach(() => {
        linter = new Linter();
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe("when using events", () => {
        const code = TEST_CODE;

        it("an error should be thrown when an error occurs inside of an event handler", () => {
            const config = { rules: {} };

            linter.reset();
            linter.on("Program", () => {
                throw new Error("Intentional error.");
            });

            assert.throws(() => {
                linter.verify(code, config, filename, true);
            }, Error);
        });
    });

    describe("getSourceLines()", () => {

        it("should get proper lines when using \\n as a line break", () => {
            const code = "a;\nb;";

            linter.verify(code, {}, filename, true);

            const lines = linter.getSourceLines();

            assert.equal(lines[0], "a;");
            assert.equal(lines[1], "b;");
        });

        it("should get proper lines when using \\r\\n as a line break", () => {
            const code = "a;\r\nb;";

            linter.verify(code, {}, filename, true);

            const lines = linter.getSourceLines();

            assert.equal(lines[0], "a;");
            assert.equal(lines[1], "b;");
        });

        it("should get proper lines when using \\r as a line break", () => {
            const code = "a;\rb;";

            linter.verify(code, {}, filename, true);

            const lines = linter.getSourceLines();

            assert.equal(lines[0], "a;");
            assert.equal(lines[1], "b;");
        });

        it("should get proper lines when using \\u2028 as a line break", () => {
            const code = "a;\u2028b;";

            linter.verify(code, {}, filename, true);

            const lines = linter.getSourceLines();

            assert.equal(lines[0], "a;");
            assert.equal(lines[1], "b;");
        });

        it("should get proper lines when using \\u2029 as a line break", () => {
            const code = "a;\u2029b;";

            linter.verify(code, {}, filename, true);

            const lines = linter.getSourceLines();

            assert.equal(lines[0], "a;");
            assert.equal(lines[1], "b;");
        });


    });

    describe("getSourceCode()", () => {
        const code = TEST_CODE;

        it("should retrieve SourceCode object after reset", () => {
            linter.reset();
            linter.verify(code, {}, filename, true);

            const sourceCode = linter.getSourceCode();

            assert.isObject(sourceCode);
            assert.equal(sourceCode.text, code);
            assert.isObject(sourceCode.ast);
        });

        it("should retrieve SourceCode object without reset", () => {
            linter.reset();
            linter.verify(code, {}, filename);

            const sourceCode = linter.getSourceCode();

            assert.isObject(sourceCode);
            assert.equal(sourceCode.text, code);
            assert.isObject(sourceCode.ast);
        });

    });

    describe("getSource()", () => {
        const code = TEST_CODE;

        it("should retrieve all text when used without parameters", () => {

            /**
             * Callback handler
             * @returns {void}
             */
            function handler() {
                const source = linter.getSource();

                assert.equal(source, TEST_CODE);
            }

            const config = { rules: {} },
                spy = sandbox.spy(handler);

            linter.reset();
            linter.on("Program", spy);

            linter.verify(code, config, filename, true);
            assert(spy.calledOnce);
        });

        it("should retrieve all text for root node", () => {

            /**
             * Callback handler
             * @param {ASTNode} node node to examine
             * @returns {void}
             */
            function handler(node) {
                const source = linter.getSource(node);

                assert.equal(source, TEST_CODE);
            }

            const config = { rules: {} },
                spy = sandbox.spy(handler);

            linter.reset();
            linter.on("Program", spy);

            linter.verify(code, config, filename, true);
            assert(spy.calledOnce);
        });

        it("should clamp to valid range when retrieving characters before start of source", () => {

            /**
             * Callback handler
             * @param {ASTNode} node node to examine
             * @returns {void}
             */
            function handler(node) {
                const source = linter.getSource(node, 2, 0);

                assert.equal(source, TEST_CODE);
            }

            const config = { rules: {} },
                spy = sandbox.spy(handler);

            linter.reset();
            linter.on("Program", spy);

            linter.verify(code, config, filename, true);
            assert(spy.calledOnce);
        });

        it("should retrieve all text for binary expression", () => {
            const config = { rules: {} };

            linter.reset();
            linter.on("BinaryExpression", node => {
                const source = linter.getSource(node);

                assert.equal(source, "6 * 7");
            });

            linter.verify(code, config, filename, true);
        });

        it("should retrieve all text plus two characters before for binary expression", () => {
            const config = { rules: {} };

            linter.reset();
            linter.on("BinaryExpression", node => {
                const source = linter.getSource(node, 2);

                assert.equal(source, "= 6 * 7");
            });

            linter.verify(code, config, filename, true);
        });

        it("should retrieve all text plus one character after for binary expression", () => {
            const config = { rules: {} };

            linter.reset();
            linter.on("BinaryExpression", node => {
                const source = linter.getSource(node, 0, 1);

                assert.equal(source, "6 * 7;");
            });

            linter.verify(code, config, filename, true);
        });

        it("should retrieve all text plus two characters before and one character after for binary expression", () => {
            const config = { rules: {} };

            linter.reset();
            linter.on("BinaryExpression", node => {
                const source = linter.getSource(node, 2, 1);

                assert.equal(source, "= 6 * 7;");
            });

            linter.verify(code, config, filename, true);
        });

    });

    describe("when calling getAncestors", () => {
        const code = TEST_CODE;

        it("should retrieve all ancestors when used", () => {

            const config = { rules: {} };

            linter.reset();
            linter.on("BinaryExpression", () => {
                const ancestors = linter.getAncestors();

                assert.equal(ancestors.length, 3);
            });

            linter.verify(code, config, filename, true);
        });

        it("should retrieve empty ancestors for root node", () => {
            const config = { rules: {} };

            linter.reset();
            linter.on("Program", () => {
                const ancestors = linter.getAncestors();

                assert.equal(ancestors.length, 0);
            });

            linter.verify(code, config, filename, true);
        });
    });

    describe("when calling getNodeByRangeIndex", () => {
        const code = TEST_CODE;

        it("should retrieve a node starting at the given index", () => {
            const config = { rules: {} };

            linter.reset();
            linter.on("Program", () => {
                const node = linter.getNodeByRangeIndex(4);

                assert.equal(node.type, "Identifier");
            });

            linter.verify(code, config, filename, true);
        });

        it("should retrieve a node containing the given index", () => {
            const config = { rules: {} };

            linter.reset();
            linter.on("Program", () => {
                const node = linter.getNodeByRangeIndex(6);

                assert.equal(node.type, "Identifier");
            });

            linter.verify(code, config, filename, true);
        });

        it("should retrieve a node that is exactly the given index", () => {
            const config = { rules: {} };

            linter.reset();
            linter.on("Program", () => {
                const node = linter.getNodeByRangeIndex(13);

                assert.equal(node.type, "Literal");
                assert.equal(node.value, 6);
            });

            linter.verify(code, config, filename, true);
        });

        it("should retrieve a node ending with the given index", () => {
            const config = { rules: {} };

            linter.reset();
            linter.on("Program", () => {
                const node = linter.getNodeByRangeIndex(9);

                assert.equal(node.type, "Identifier");
            });

            linter.verify(code, config, filename, true);
        });

        it("should retrieve the deepest node containing the given index", () => {
            const config = { rules: {} };

            linter.reset();
            linter.on("Program", () => {
                let node = linter.getNodeByRangeIndex(14);

                assert.equal(node.type, "BinaryExpression");
                node = linter.getNodeByRangeIndex(3);
                assert.equal(node.type, "VariableDeclaration");
            });

            linter.verify(code, config, filename, true);
        });

        it("should return null if the index is outside the range of any node", () => {
            const config = { rules: {} };

            linter.reset();
            linter.on("Program", () => {
                let node = linter.getNodeByRangeIndex(-1);

                assert.isNull(node);
                node = linter.getNodeByRangeIndex(-99);
                assert.isNull(node);
            });

            linter.verify(code, config, filename, true);
        });

        it("should attach the node's parent", () => {
            const config = { rules: {} };

            linter.reset();
            linter.on("Program", () => {
                const node = linter.getNodeByRangeIndex(14);

                assert.property(node, "parent");
                assert.equal(node.parent.type, "VariableDeclarator");
            });

            linter.verify(code, config, filename, true);
        });

        it("should not modify the node when attaching the parent", () => {
            const config = { rules: {} };

            linter.reset();
            linter.on("Program", () => {
                let node = linter.getNodeByRangeIndex(10);

                assert.equal(node.type, "VariableDeclarator");
                node = linter.getNodeByRangeIndex(4);
                assert.equal(node.type, "Identifier");
                assert.property(node, "parent");
                assert.equal(node.parent.type, "VariableDeclarator");
                assert.notProperty(node.parent, "parent");
            });

            linter.verify(code, config, filename, true);
        });

    });


    describe("when calling getScope", () => {
        const code = "function foo() { q: for(;;) { break q; } } function bar () { var q = t; } var baz = (() => { return 1; });";

        it("should retrieve the global scope correctly from a Program", () => {
            const config = { rules: {} };

            linter.reset();
            linter.on("Program", () => {
                const scope = linter.getScope();

                assert.equal(scope.type, "global");
            });

            linter.verify(code, config, filename, true);
        });

        it("should retrieve the function scope correctly from a FunctionDeclaration", () => {
            const config = { rules: {} };

            linter.reset();
            linter.on("FunctionDeclaration", () => {
                const scope = linter.getScope();

                assert.equal(scope.type, "function");
            });

            linter.verify(code, config, filename, true);
        });

        it("should retrieve the function scope correctly from a LabeledStatement", () => {
            const config = { rules: {} };

            linter.reset();
            linter.on("LabeledStatement", () => {
                const scope = linter.getScope();

                assert.equal(scope.type, "function");
                assert.equal(scope.block.id.name, "foo");
            });

            linter.verify(code, config, filename, true);
        });

        it("should retrieve the function scope correctly from within an ArrowFunctionExpression", () => {
            const config = { rules: {}, ecmaFeatures: { arrowFunctions: true } };

            linter.reset();
            linter.on("ReturnStatement", () => {
                const scope = linter.getScope();

                assert.equal(scope.type, "function");
                assert.equal(scope.block.type, "ArrowFunctionExpression");
            });

            linter.verify(code, config, filename, true);
        });

        it("should retrieve the function scope correctly from within an SwitchStatement", () => {
            const config = { rules: {}, parserOptions: { ecmaVersion: 6 } };

            linter.reset();
            linter.on("SwitchStatement", () => {
                const scope = linter.getScope();

                assert.equal(scope.type, "switch");
                assert.equal(scope.block.type, "SwitchStatement");
            });

            linter.verify("switch(foo){ case 'a': var b = 'foo'; }", config, filename, true);
        });

        it("should retrieve the function scope correctly from within a BlockStatement", () => {
            const config = { rules: {}, parserOptions: { ecmaVersion: 6 } };

            linter.reset();
            linter.on("BlockStatement", () => {
                const scope = linter.getScope();

                assert.equal(scope.type, "block");
                assert.equal(scope.block.type, "BlockStatement");
            });

            linter.verify("var x; {let y = 1}", config, filename, true);
        });

        it("should retrieve the function scope correctly from within a nested block statement", () => {
            const config = { rules: {}, parserOptions: { ecmaVersion: 6 } };

            linter.reset();
            linter.on("BlockStatement", () => {
                const scope = linter.getScope();

                assert.equal(scope.type, "block");
                assert.equal(scope.block.type, "BlockStatement");
            });

            linter.verify("if (true) { let x = 1 }", config, filename, true);
        });

        it("should retrieve the function scope correctly from within a FunctionDeclaration", () => {
            const config = { rules: {}, parserOptions: { ecmaVersion: 6 } };

            linter.reset();
            linter.on("FunctionDeclaration", () => {
                const scope = linter.getScope();

                assert.equal(scope.type, "function");
                assert.equal(scope.block.type, "FunctionDeclaration");
            });

            linter.verify("function foo() {}", config, filename, true);
        });

        it("should retrieve the function scope correctly from within a FunctionExpression", () => {
            const config = { rules: {}, parserOptions: { ecmaVersion: 6 } };

            linter.reset();
            linter.on("FunctionExpression", () => {
                const scope = linter.getScope();

                assert.equal(scope.type, "function");
                assert.equal(scope.block.type, "FunctionExpression");
            });

            linter.verify("(function foo() {})();", config, filename, true);
        });

        it("should retrieve the catch scope correctly from within a CatchClause", () => {
            const config = { rules: {}, parserOptions: { ecmaVersion: 6 } };

            linter.reset();
            linter.on("CatchClause", () => {
                const scope = linter.getScope();

                assert.equal(scope.type, "catch");
                assert.equal(scope.block.type, "CatchClause");
            });

            linter.verify("try {} catch (err) {}", config, filename, true);
        });

        it("should retrieve module scope correctly from an ES6 module", () => {
            const config = { rules: {}, parserOptions: { sourceType: "module" } };

            linter.reset();
            linter.on("AssignmentExpression", () => {
                const scope = linter.getScope();

                assert.equal(scope.type, "module");
            });

            linter.verify("var foo = {}; foo.bar = 1;", config, filename, true);
        });

        it("should retrieve function scope correctly when globalReturn is true", () => {
            const config = { rules: {}, parserOptions: { ecmaFeatures: { globalReturn: true } } };

            linter.reset();
            linter.on("AssignmentExpression", () => {
                const scope = linter.getScope();

                assert.equal(scope.type, "function");
            });

            linter.verify("var foo = {}; foo.bar = 1;", config, filename, true);
        });
    });

    describe("marking variables as used", () => {
        it("should mark variables in current scope as used", () => {
            const code = "var a = 1, b = 2;";

            linter.reset();
            linter.on("Program:exit", () => {
                linter.markVariableAsUsed("a");

                const scope = linter.getScope();

                assert.isTrue(getVariable(scope, "a").eslintUsed);
                assert.notOk(getVariable(scope, "b").eslintUsed);
            });

            linter.verify(code, {}, filename, true);
        });
        it("should mark variables in function args as used", () => {
            const code = "function abc(a, b) { return 1; }";

            linter.reset();
            linter.on("ReturnStatement", () => {
                linter.markVariableAsUsed("a");

                const scope = linter.getScope();

                assert.isTrue(getVariable(scope, "a").eslintUsed);
                assert.notOk(getVariable(scope, "b").eslintUsed);
            });

            linter.verify(code, {}, filename, true);
        });
        it("should mark variables in higher scopes as used", () => {
            const code = "var a, b; function abc() { return 1; }";

            linter.reset();
            linter.on("ReturnStatement", () => {
                linter.markVariableAsUsed("a");
            });
            linter.on("Program:exit", () => {
                const scope = linter.getScope();

                assert.isTrue(getVariable(scope, "a").eslintUsed);
                assert.notOk(getVariable(scope, "b").eslintUsed);
            });

            linter.verify(code, {}, filename, true);
        });

        it("should mark variables in Node.js environment as used", () => {
            const code = "var a = 1, b = 2;";

            linter.reset();
            linter.on("Program:exit", () => {
                const globalScope = linter.getScope(),
                    childScope = globalScope.childScopes[0];

                linter.markVariableAsUsed("a");

                assert.isTrue(getVariable(childScope, "a").eslintUsed);
                assert.isUndefined(getVariable(childScope, "b").eslintUsed);
            });

            linter.verify(code, { env: { node: true } }, filename, true);
        });

        it("should mark variables in modules as used", () => {
            const code = "var a = 1, b = 2;";

            linter.reset();
            linter.on("Program:exit", () => {
                const globalScope = linter.getScope(),
                    childScope = globalScope.childScopes[0];

                linter.markVariableAsUsed("a");

                assert.isTrue(getVariable(childScope, "a").eslintUsed);
                assert.isUndefined(getVariable(childScope, "b").eslintUsed);
            });

            linter.verify(code, { parserOptions: { sourceType: "module" } }, filename, true);
        });
    });

    describe("report()", () => {

        let config;

        beforeEach(() => {
            config = { rules: {} };
        });

        it("should correctly parse a message when being passed all options", () => {
            linter.on("Program", node => {
                linter.report("test-rule", 2, node, node.loc.end, "hello {{dynamic}}", { dynamic: node.type });
            });

            const messages = linter.verify("0", config, "", true);

            assert.deepEqual(messages[0], {
                severity: 2,
                ruleId: "test-rule",
                message: "hello Program",
                nodeType: "Program",
                line: 1,
                column: 2,
                source: "0"
            });
        });

        it("should use the report the provided location when given", () => {
            linter.on("Program", node => {
                linter.report("test-rule", 2, node, { line: 42, column: 13 }, "hello world");
            });

            const messages = linter.verify("0", config, "", true);

            assert.deepEqual(messages[0], {
                severity: 2,
                ruleId: "test-rule",
                message: "hello world",
                nodeType: "Program",
                line: 42,
                column: 14,
                source: ""
            });
        });

        it("should not throw an error if node is provided and location is not", () => {
            linter.on("Program", node => {
                linter.report("test-rule", 2, node, "hello world");
            });

            assert.doesNotThrow(() => {
                linter.verify("0", config, "", true);
            });
        });

        it("should not throw an error if location is provided and node is not", () => {
            linter.on("Program", () => {
                linter.report("test-rule", 2, null, { line: 1, column: 1 }, "hello world");
            });

            assert.doesNotThrow(() => {
                linter.verify("0", config, "", true);
            });
        });

        it("should throw an error if neither node nor location is provided", () => {
            linter.on("Program", () => {
                linter.report("test-rule", 2, null, "hello world");
            });

            assert.throws(() => {
                linter.verify("0", config, "", true);
            }, /Node must be provided when reporting error if location is not provided$/);
        });

        it("should throw an error if node is not an object", () => {
            linter.on("Program", () => {
                linter.report("test-rule", 2, "not a node", "hello world");
            });

            assert.throws(() => {
                linter.verify("0", config, "", true);
            }, /Node must be an object$/);
        });

        it("should throw an error if fix is passed but meta has no `fixable` property", () => {
            const meta = {
                docs: {},
                schema: []
            };

            linter.on("Program", node => {
                linter.report("test-rule", 2, node, "hello world", [], { range: [1, 1], text: "" }, meta);
            });

            assert.throws(() => {
                linter.verify("0", config, "", true);
            }, /Fixable rules should export a `meta\.fixable` property.$/);
        });

        it("should not throw an error if fix is passed and no metadata is passed", () => {
            linter.on("Program", node => {
                linter.report("test-rule", 2, node, "hello world", [], { range: [1, 1], text: "" });
            });

            assert.doesNotThrow(() => {
                linter.verify("0", config, "", true);
            });
        });

        it("should correctly parse a message with object keys as numbers", () => {
            linter.on("Program", node => {
                linter.report("test-rule", 2, node, "my message {{name}}{{0}}", { 0: "!", name: "testing" });
            });

            const messages = linter.verify("0", config, "", true);

            assert.deepEqual(messages[0], {
                severity: 2,
                ruleId: "test-rule",
                message: "my message testing!",
                nodeType: "Program",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 2,
                source: "0"
            });
        });

        it("should correctly parse a message with array", () => {
            linter.on("Program", node => {
                linter.report("test-rule", 2, node, "my message {{1}}{{0}}", ["!", "testing"]);
            });

            const messages = linter.verify("0", config, "", true);

            assert.deepEqual(messages[0], {
                severity: 2,
                ruleId: "test-rule",
                message: "my message testing!",
                nodeType: "Program",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 2,
                source: "0"
            });
        });

        it("should include a fix passed as the last argument when location is not passed", () => {
            linter.on("Program", node => {
                linter.report("test-rule", 2, node, "my message {{1}}{{0}}", ["!", "testing"], { range: [1, 1], text: "" });
            });

            const messages = linter.verify("0", config, "", true);

            assert.deepEqual(messages[0], {
                severity: 2,
                ruleId: "test-rule",
                message: "my message testing!",
                nodeType: "Program",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 2,
                source: "0",
                fix: { range: [1, 1], text: "" }
            });
        });

        it("should allow template parameter with inner whitespace", () => {
            linter.reset();
            linter.defineRule("test-rule", context => ({
                Literal(node) {
                    context.report(node, "message {{parameter name}}", {
                        "parameter name": "yay!"
                    });
                }
            }));

            config.rules["test-rule"] = 1;

            const messages = linter.verify("0", config);

            assert.equal(messages[0].message, "message yay!");
        });

        it("should not crash if no template parameters are passed", () => {
            linter.reset();
            linter.defineRule("test-rule", context => ({
                Literal(node) {
                    context.report(node, "message {{code}}");
                }
            }));

            config.rules["test-rule"] = 1;

            const messages = linter.verify("0", config);

            assert.equal(messages[0].message, "message {{code}}");
        });

        it("should allow template parameter with non-identifier characters", () => {
            linter.reset();
            linter.defineRule("test-rule", context => ({
                Literal(node) {
                    context.report(node, "message {{parameter-name}}", {
                        "parameter-name": "yay!"
                    });
                }
            }));

            config.rules["test-rule"] = 1;

            const messages = linter.verify("0", config);

            assert.equal(messages[0].message, "message yay!");
        });

        it("should allow template parameter wrapped in braces", () => {
            linter.reset();
            linter.defineRule("test-rule", context => ({
                Literal(node) {
                    context.report(node, "message {{{param}}}", {
                        param: "yay!"
                    });
                }
            }));

            config.rules["test-rule"] = 1;

            const messages = linter.verify("0", config);

            assert.equal(messages[0].message, "message {yay!}");
        });

        it("should ignore template parameter with no specified value", () => {
            linter.reset();
            linter.defineRule("test-rule", context => ({
                Literal(node) {
                    context.report(node, "message {{parameter}}", {});
                }
            }));

            config.rules["test-rule"] = 1;

            const messages = linter.verify("0", config);

            assert.equal(messages[0].message, "message {{parameter}}");
        });

        it("should ignore template parameter with no specified value with warn severity", () => {
            linter.reset();
            linter.defineRule("test-rule", context => ({
                Literal(node) {
                    context.report(node, "message {{parameter}}", {});
                }
            }));

            config.rules["test-rule"] = "warn";

            const messages = linter.verify("0", config);

            assert.equal(messages[0].severity, 1);
            assert.equal(messages[0].message, "message {{parameter}}");
        });

        it("should handle leading whitespace in template parameter", () => {
            linter.reset();
            linter.defineRule("test-rule", context => ({
                Literal(node) {
                    context.report(node, "message {{ parameter}}", {
                        parameter: "yay!"
                    });
                }
            }));

            config.rules["test-rule"] = 1;

            const messages = linter.verify("0", config);

            assert.equal(messages[0].message, "message yay!");
        });

        it("should handle trailing whitespace in template parameter", () => {
            linter.reset();
            linter.defineRule("test-rule", context => ({
                Literal(node) {
                    context.report(node, "message {{parameter }}", {
                        parameter: "yay!"
                    });
                }
            }));

            config.rules["test-rule"] = 1;

            const messages = linter.verify("0", config);

            assert.equal(messages[0].message, "message yay!");
        });

        it("should still allow inner whitespace as well as leading/trailing", () => {
            linter.reset();
            linter.defineRule("test-rule", context => ({
                Literal(node) {
                    context.report(node, "message {{ parameter name }}", {
                        "parameter name": "yay!"
                    });
                }
            }));

            config.rules["test-rule"] = 1;

            const messages = linter.verify("0", config);

            assert.equal(messages[0].message, "message yay!");
        });

        it("should still allow non-identifier characters as well as leading/trailing whitespace", () => {
            linter.reset();
            linter.defineRule("test-rule", context => ({
                Literal(node) {
                    context.report(node, "message {{ parameter-name }}", {
                        "parameter-name": "yay!"
                    });
                }
            }));

            config.rules["test-rule"] = 1;

            const messages = linter.verify("0", config);

            assert.equal(messages[0].message, "message yay!");
        });

        it("should include a fix passed as the last argument when location is passed", () => {
            linter.on("Program", node => {
                linter.report("test-rule", 2, node, { line: 42, column: 23 }, "my message {{1}}{{0}}", ["!", "testing"], { range: [1, 1], text: "" });
            });

            const messages = linter.verify("0", config, "", true);

            assert.deepEqual(messages[0], {
                severity: 2,
                ruleId: "test-rule",
                message: "my message testing!",
                nodeType: "Program",
                line: 42,
                column: 24,
                source: "",
                fix: { range: [1, 1], text: "" }
            });
        });

        it("should have 'endLine' and 'endColumn' when there is not 'loc' property.", () => {
            linter.on("Program", node => {
                linter.report(
                    "test-rule",
                    2,
                    node,
                    "test"
                );
            });

            const sourceText = "foo + bar;";

            const messages = linter.verify(sourceText, config, "", true);

            assert.strictEqual(messages[0].endLine, 1);
            assert.strictEqual(messages[0].endColumn, sourceText.length + 1); // (1-based column)
        });

        it("should have 'endLine' and 'endColumn' when 'loc' property has 'end' property.", () => {
            linter.on("Program", node => {
                linter.report(
                    "test-rule",
                    2,
                    node,
                    node.loc,
                    "test"
                );
            });

            const messages = linter.verify("0", config, "", true);

            assert.strictEqual(messages[0].endLine, 1);
            assert.strictEqual(messages[0].endColumn, 2);
        });

        it("should not have 'endLine' and 'endColumn' when 'loc' property doe not have 'end' property.", () => {
            linter.on("Program", node => {
                linter.report(
                    "test-rule",
                    2,
                    node,
                    node.loc.start,
                    "test"
                );
            });

            const messages = linter.verify("0", config, "", true);

            assert.strictEqual(messages[0].endLine, void 0);
            assert.strictEqual(messages[0].endColumn, void 0);
        });

    });

    describe("when evaluating code", () => {
        const code = TEST_CODE;

        it("events for each node type should fire", () => {
            const config = { rules: {} };

            // spies for various AST node types
            const spyLiteral = sinon.spy(),
                spyVariableDeclarator = sinon.spy(),
                spyVariableDeclaration = sinon.spy(),
                spyIdentifier = sinon.spy(),
                spyBinaryExpression = sinon.spy();

            linter.reset();
            linter.on("Literal", spyLiteral);
            linter.on("VariableDeclarator", spyVariableDeclarator);
            linter.on("VariableDeclaration", spyVariableDeclaration);
            linter.on("Identifier", spyIdentifier);
            linter.on("BinaryExpression", spyBinaryExpression);

            const messages = linter.verify(code, config, filename, true);

            assert.equal(messages.length, 0);
            sinon.assert.calledOnce(spyVariableDeclaration);
            sinon.assert.calledOnce(spyVariableDeclarator);
            sinon.assert.calledOnce(spyIdentifier);
            sinon.assert.calledTwice(spyLiteral);
            sinon.assert.calledOnce(spyBinaryExpression);
        });
    });

    describe("when config has shared settings for rules", () => {
        const code = "test-rule";

        it("should pass settings to all rules", () => {
            linter.reset();
            linter.defineRule(code, context => ({
                Literal(node) {
                    context.report(node, context.settings.info);
                }
            }));

            const config = { rules: {}, settings: { info: "Hello" } };

            config.rules[code] = 1;

            const messages = linter.verify("0", config, filename);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].message, "Hello");
        });

        it("should not have any settings if they were not passed in", () => {
            linter.reset();
            linter.defineRule(code, context => ({
                Literal(node) {
                    if (Object.getOwnPropertyNames(context.settings).length !== 0) {
                        context.report(node, "Settings should be empty");
                    }
                }
            }));

            const config = { rules: {} };

            config.rules[code] = 1;

            const messages = linter.verify("0", config, filename);

            assert.equal(messages.length, 0);
        });
    });

    describe("when config has parseOptions", () => {

        it("should pass ecmaFeatures to all rules when provided on config", () => {

            const parserOptions = {
                ecmaFeatures: {
                    jsx: true,
                    globalReturn: true
                }
            };

            linter.reset();
            linter.defineRule("test-rule", sandbox.mock().withArgs(
                sinon.match({ parserOptions })
            ).returns({}));

            const config = { rules: { "test-rule": 2 }, parserOptions };

            linter.verify("0", config, filename);
        });

        it("should pass parserOptions to all rules when default parserOptions is used", () => {

            const parserOptions = {};

            linter.reset();
            linter.defineRule("test-rule", sandbox.mock().withArgs(
                sinon.match({ parserOptions })
            ).returns({}));

            const config = { rules: { "test-rule": 2 } };

            linter.verify("0", config, filename);
        });

    });

    describe("when config has parser", () => {

        // custom parser unsupported in browser, only test in Node
        if (typeof window === "undefined") {
            it("should pass parser as parserPath to all rules when provided on config", () => {

                const alternateParser = "esprima-fb";

                linter.reset();
                linter.defineRule("test-rule", sandbox.mock().withArgs(
                    sinon.match({ parserPath: alternateParser })
                ).returns({}));

                const config = { rules: { "test-rule": 2 }, parser: alternateParser };

                linter.verify("0", config, filename);
            });

            it("should use parseForESLint() in custom parser when custom parser is specified", () => {

                const alternateParser = path.resolve(__dirname, "../fixtures/parsers/enhanced-parser.js");

                linter.reset();

                const config = { rules: {}, parser: alternateParser };
                const messages = linter.verify("0", config, filename);

                assert.equal(messages.length, 0);
            });

            it("should expose parser services when using parseForESLint() and services are specified", () => {

                const alternateParser = path.resolve(__dirname, "../fixtures/parsers/enhanced-parser.js");

                linter.reset();
                linter.defineRule("test-service-rule", context => ({
                    Literal(node) {
                        context.report({
                            node,
                            message: context.parserServices.test.getMessage()
                        });
                    }
                }));

                const config = { rules: { "test-service-rule": 2 }, parser: alternateParser };
                const messages = linter.verify("0", config, filename);

                assert.equal(messages.length, 1);
                assert.equal(messages[0].message, "Hi!");
            });
        }

        it("should pass parser as parserPath to all rules when default parser is used", () => {

            const DEFAULT_PARSER = linter.defaults().parser;

            linter.reset();
            linter.defineRule("test-rule", sandbox.mock().withArgs(
                sinon.match({ parserPath: DEFAULT_PARSER })
            ).returns({}));

            const config = { rules: { "test-rule": 2 } };

            linter.verify("0", config, filename);
        });

    });


    describe("when passing in configuration values for rules", () => {
        const code = "var answer = 6 * 7";

        it("should be configurable by only setting the integer value", () => {
            const rule = "semi",
                config = { rules: {} };

            config.rules[rule] = 1;
            linter.reset();

            const messages = linter.verify(code, config, filename, true);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, rule);
        });

        it("should be configurable by only setting the string value", () => {
            const rule = "semi",
                config = { rules: {} };

            config.rules[rule] = "warn";
            linter.reset();

            const messages = linter.verify(code, config, filename, true);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].severity, 1);
            assert.equal(messages[0].ruleId, rule);
        });

        it("should be configurable by passing in values as an array", () => {
            const rule = "semi",
                config = { rules: {} };

            config.rules[rule] = [1];
            linter.reset();

            const messages = linter.verify(code, config, filename, true);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, rule);
        });

        it("should be configurable by passing in string value as an array", () => {
            const rule = "semi",
                config = { rules: {} };

            config.rules[rule] = ["warn"];
            linter.reset();

            const messages = linter.verify(code, config, filename, true);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].severity, 1);
            assert.equal(messages[0].ruleId, rule);
        });

        it("should not be configurable by setting other value", () => {
            const rule = "semi",
                config = { rules: {} };

            config.rules[rule] = "1";
            linter.reset();

            const messages = linter.verify(code, config, filename, true);

            assert.equal(messages.length, 0);
        });

        it("should process empty config", () => {
            const config = {};

            linter.reset();
            const messages = linter.verify(code, config, filename, true);

            assert.equal(messages.length, 0);
        });
    });

    describe("after calling reset()", () => {
        const code = TEST_CODE;

        it("previously registered event handlers should not be called", () => {

            const config = { rules: {} };

            // spies for various AST node types
            const spyLiteral = sinon.spy(),
                spyVariableDeclarator = sinon.spy(),
                spyVariableDeclaration = sinon.spy(),
                spyIdentifier = sinon.spy(),
                spyBinaryExpression = sinon.spy();

            linter.reset();
            linter.on("Literal", spyLiteral);
            linter.on("VariableDeclarator", spyVariableDeclarator);
            linter.on("VariableDeclaration", spyVariableDeclaration);
            linter.on("Identifier", spyIdentifier);
            linter.on("BinaryExpression", spyBinaryExpression);
            linter.reset();

            const messages = linter.verify(code, config, filename, true);

            assert.equal(messages.length, 0);
            sinon.assert.notCalled(spyVariableDeclaration);
            sinon.assert.notCalled(spyVariableDeclarator);
            sinon.assert.notCalled(spyIdentifier);
            sinon.assert.notCalled(spyLiteral);
            sinon.assert.notCalled(spyBinaryExpression);
        });

        it("text should not be available", () => {
            const config = { rules: {} };

            linter.reset();
            const messages = linter.verify(code, config, filename, true);

            linter.reset();

            assert.equal(messages.length, 0);
            assert.isNull(linter.getSource());
        });

        it("source for nodes should not be available", () => {
            const config = { rules: {} };

            linter.reset();
            const messages = linter.verify(code, config, filename, true);

            linter.reset();

            assert.equal(messages.length, 0);
            assert.isNull(linter.getSource({}));
        });
    });

    describe("when evaluating code containing /*global */ and /*globals */ blocks", () => {
        const code = "/*global a b:true c:false*/ function foo() {} /*globals d:true*/";

        it("variables should be available in global scope", () => {
            const config = { rules: {} };

            linter.reset();
            linter.on("Program", () => {
                const scope = linter.getScope();
                const a = getVariable(scope, "a"),
                    b = getVariable(scope, "b"),
                    c = getVariable(scope, "c"),
                    d = getVariable(scope, "d");

                assert.equal(a.name, "a");
                assert.equal(a.writeable, false);
                assert.equal(b.name, "b");
                assert.equal(b.writeable, true);
                assert.equal(c.name, "c");
                assert.equal(c.writeable, false);
                assert.equal(d.name, "d");
                assert.equal(d.writeable, true);
            });

            linter.verify(code, config, filename, true);
        });
    });

    describe("when evaluating code containing a /*global */ block with sloppy whitespace", () => {
        const code = "/* global  a b  : true   c:  false*/";

        it("variables should be available in global scope", () => {
            const config = { rules: {} };

            linter.reset();
            linter.on("Program", () => {
                const scope = linter.getScope(),
                    a = getVariable(scope, "a"),
                    b = getVariable(scope, "b"),
                    c = getVariable(scope, "c");

                assert.equal(a.name, "a");
                assert.equal(a.writeable, false);
                assert.equal(b.name, "b");
                assert.equal(b.writeable, true);
                assert.equal(c.name, "c");
                assert.equal(c.writeable, false);
            });

            linter.verify(code, config, filename, true);
        });
    });

    describe("when evaluating code containing /*eslint-env */ block", () => {
        it("variables should be available in global scope", () => {
            const code = "/*eslint-env node*/ function f() {} /*eslint-env browser, foo*/";
            const config = { rules: {} };

            linter.reset();
            linter.on("Program", () => {
                const scope = linter.getScope(),
                    exports = getVariable(scope, "exports"),
                    window = getVariable(scope, "window");

                assert.equal(exports.writeable, true);
                assert.equal(window.writeable, false);
            });
            linter.verify(code, config, filename, true);
        });
    });

    describe("when evaluating code containing /*eslint-env */ block with sloppy whitespace", () => {
        const code = "/* eslint-env ,, node  , no-browser ,,  */";

        it("variables should be available in global scope", () => {
            const config = { rules: {} };

            linter.reset();
            linter.on("Program", () => {
                const scope = linter.getScope(),
                    exports = getVariable(scope, "exports"),
                    window = getVariable(scope, "window");

                assert.equal(exports.writeable, true);
                assert.equal(window, null);
            });
            linter.verify(code, config, filename, true);
        });
    });

    describe("when evaluating code containing /*exported */ block", () => {

        it("we should behave nicely when no matching variable is found", () => {
            const code = "/* exported horse */";
            const config = { rules: {} };

            linter.reset();
            linter.verify(code, config, filename, true);
        });

        it("variables should be exported", () => {
            const code = "/* exported horse */\n\nvar horse = 'circus'";
            const config = { rules: {} };

            linter.reset();
            linter.on("Program", () => {
                const scope = linter.getScope(),
                    horse = getVariable(scope, "horse");

                assert.equal(horse.eslintUsed, true);
            });
            linter.verify(code, config, filename, true);
        });

        it("undefined variables should not be exported", () => {
            const code = "/* exported horse */\n\nhorse = 'circus'";
            const config = { rules: {} };

            linter.reset();
            linter.on("Program", () => {
                const scope = linter.getScope(),
                    horse = getVariable(scope, "horse");

                assert.equal(horse, null);
            });
            linter.verify(code, config, filename, true);
        });

        it("variables should be exported in strict mode", () => {
            const code = "/* exported horse */\n'use strict';\nvar horse = 'circus'";
            const config = { rules: {} };

            linter.reset();
            linter.on("Program", () => {
                const scope = linter.getScope(),
                    horse = getVariable(scope, "horse");

                assert.equal(horse.eslintUsed, true);
            });
            linter.verify(code, config, filename, true);
        });

        it("variables should not be exported in the es6 module environment", () => {
            const code = "/* exported horse */\nvar horse = 'circus'";
            const config = { rules: {}, parserOptions: { sourceType: "module" } };

            linter.reset();
            linter.on("Program", () => {
                const scope = linter.getScope(),
                    horse = getVariable(scope, "horse");

                assert.equal(horse, null); // there is no global scope at all
            });
            linter.verify(code, config, filename, true);
        });

        it("variables should not be exported when in the node environment", () => {
            const code = "/* exported horse */\nvar horse = 'circus'";
            const config = { rules: {}, env: { node: true } };

            linter.reset();
            linter.on("Program", () => {
                const scope = linter.getScope(),
                    horse = getVariable(scope, "horse");

                assert.equal(horse, null); // there is no global scope at all
            });
            linter.verify(code, config, filename, true);
        });
    });

    describe("when evaluating code containing a line comment", () => {
        const code = "//global a \n function f() {}";

        it("should not introduce a global variable", () => {

            const config = { rules: {} };

            linter.reset();
            linter.on("Program", () => {
                const scope = linter.getScope();

                assert.equal(getVariable(scope, "a"), null);
            });
            linter.verify(code, config, filename, true);
        });
    });

    describe("when evaluating code containing normal block comments", () => {
        const code = "/**/  /*a*/  /*b:true*/  /*foo c:false*/";

        it("should not introduce a global variable", () => {
            const config = { rules: {} };

            linter.reset();
            linter.on("Program", () => {
                const scope = linter.getScope();

                assert.equal(getVariable(scope, "a"), null);
                assert.equal(getVariable(scope, "b"), null);
                assert.equal(getVariable(scope, "foo"), null);
                assert.equal(getVariable(scope, "c"), null);
            });
            linter.verify(code, config, filename, true);
        });
    });

    describe("when evaluating any code", () => {
        const code = "";

        it("builtin global variables should be available in the global scope", () => {
            const config = { rules: {} };

            linter.reset();
            linter.on("Program", () => {
                const scope = linter.getScope();

                assert.notEqual(getVariable(scope, "Object"), null);
                assert.notEqual(getVariable(scope, "Array"), null);
                assert.notEqual(getVariable(scope, "undefined"), null);
            });
            linter.verify(code, config, filename, true);
        });

        it("ES6 global variables should not be available by default", () => {
            const config = { rules: {} };

            linter.reset();
            linter.on("Program", () => {
                const scope = linter.getScope();

                assert.equal(getVariable(scope, "Promise"), null);
                assert.equal(getVariable(scope, "Symbol"), null);
                assert.equal(getVariable(scope, "WeakMap"), null);
            });
            linter.verify(code, config, filename, true);
        });

        it("ES6 global variables should be available in the es6 environment", () => {
            const config = { rules: {} };

            linter.reset();
            linter.on("Program", () => {
                const scope = linter.getScope();

                assert.notEqual(getVariable(scope, "Promise"), null);
                assert.notEqual(getVariable(scope, "Symbol"), null);
                assert.notEqual(getVariable(scope, "WeakMap"), null);
            });
            linter.verify(code, config, filename, true);
        });
    });

    describe("when evaluating empty code", () => {
        const code = "",
            config = { rules: {} };

        it("getSource() should return an empty string", () => {
            linter.reset();
            linter.verify(code, config, filename, true);
            assert.equal(linter.getSource(), "");
        });
    });

    describe("at any time", () => {
        const code = "new-rule";

        it("can add a rule dynamically", () => {
            linter.reset();
            linter.defineRule(code, context => ({
                Literal(node) {
                    context.report(node, "message");
                }
            }));

            const config = { rules: {} };

            config.rules[code] = 1;

            const messages = linter.verify("0", config, filename);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, code);
            assert.equal(messages[0].nodeType, "Literal");
        });
    });

    describe("at any time", () => {
        const code = ["new-rule-0", "new-rule-1"];

        it("can add multiple rules dynamically", () => {
            linter.reset();
            const config = { rules: {} };
            const newRules = {};

            code.forEach(item => {
                config.rules[item] = 1;
                newRules[item] = function(context) {
                    return {
                        Literal(node) {
                            context.report(node, "message");
                        }
                    };
                };
            });
            linter.defineRules(newRules);

            const messages = linter.verify("0", config, filename);

            assert.equal(messages.length, code.length);
            code.forEach(item => {
                assert.ok(messages.some(message => message.ruleId === item));
            });
            messages.forEach(message => {
                assert.equal(message.nodeType, "Literal");
            });
        });
    });

    describe("at any time", () => {
        const code = "filename-rule";

        it("has access to the filename", () => {
            linter.reset();
            linter.defineRule(code, context => ({
                Literal(node) {
                    context.report(node, context.getFilename());
                }
            }));

            const config = { rules: {} };

            config.rules[code] = 1;

            const messages = linter.verify("0", config, filename);

            assert.equal(messages[0].message, filename);
        });

        it("defaults filename to '<input>'", () => {
            linter.reset();
            linter.defineRule(code, context => ({
                Literal(node) {
                    context.report(node, context.getFilename());
                }
            }));

            const config = { rules: {} };

            config.rules[code] = 1;

            const messages = linter.verify("0", config);

            assert.equal(messages[0].message, "<input>");
        });
    });

    describe("when evaluating code with comments to enable rules", () => {

        it("should report a violation", () => {
            const code = "/*eslint no-alert:1*/ alert('test');";
            const config = { rules: {} };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].nodeType, "CallExpression");
        });

        it("rules should not change initial config", () => {
            const config = { rules: { strict: 2 } };
            const codeA = "/*eslint strict: 0*/ function bar() { return 2; }";
            const codeB = "function foo() { return 1; }";

            linter.reset();
            let messages = linter.verify(codeA, config, filename, false);

            assert.equal(messages.length, 0);

            messages = linter.verify(codeB, config, filename, false);
            assert.equal(messages.length, 1);
        });

        it("rules should not change initial config", () => {
            const config = { rules: { quotes: [2, "double"] } };
            const codeA = "/*eslint quotes: 0*/ function bar() { return '2'; }";
            const codeB = "function foo() { return '1'; }";

            linter.reset();
            let messages = linter.verify(codeA, config, filename, false);

            assert.equal(messages.length, 0);

            messages = linter.verify(codeB, config, filename, false);
            assert.equal(messages.length, 1);
        });

        it("rules should not change initial config", () => {
            const config = { rules: { quotes: [2, "double"] } };
            const codeA = "/*eslint quotes: [0, \"single\"]*/ function bar() { return '2'; }";
            const codeB = "function foo() { return '1'; }";

            linter.reset();
            let messages = linter.verify(codeA, config, filename, false);

            assert.equal(messages.length, 0);

            messages = linter.verify(codeB, config, filename, false);
            assert.equal(messages.length, 1);
        });

        it("rules should not change initial config", () => {
            const config = { rules: { "no-unused-vars": [2, { vars: "all" }] } };
            const codeA = "/*eslint no-unused-vars: [0, {\"vars\": \"local\"}]*/ var a = 44;";
            const codeB = "var b = 55;";

            linter.reset();
            let messages = linter.verify(codeA, config, filename, false);

            assert.equal(messages.length, 0);

            messages = linter.verify(codeB, config, filename, false);
            assert.equal(messages.length, 1);
        });
    });

    describe("when evaluating code with invalid comments to enable rules", () => {
        const code = "/*eslint no-alert:true*/ alert('test');";

        it("should report a violation", () => {
            const config = { rules: {} };

            const fn = linter.verify.bind(linter, code, config, filename);

            assert.throws(fn, "filename.js line 1:\n\tConfiguration for rule \"no-alert\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed 'true').\n");
        });
    });

    describe("when evaluating code with comments to disable rules", () => {
        const code = "/*eslint no-alert:0*/ alert('test');";

        it("should not report a violation", () => {
            const config = { rules: { "no-alert": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 0);
        });
    });

    describe("when evaluating code with comments to enable multiple rules", () => {
        const code = "/*eslint no-alert:1 no-console:1*/ alert('test'); console.log('test');";

        it("should report a violation", () => {
            const config = { rules: {} };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 2);
            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].nodeType, "CallExpression");
            assert.equal(messages[1].ruleId, "no-console");
        });
    });

    describe("when evaluating code with comments to enable and disable multiple rules", () => {
        const code = "/*eslint no-alert:1 no-console:0*/ alert('test'); console.log('test');";

        it("should report a violation", () => {
            const config = { rules: { "no-console": 1, "no-alert": 0 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].nodeType, "CallExpression");
        });
    });

    describe("when evaluating code with comments to disable and enable configurable rule as part of plugin", () => {

        beforeEach(() => {
            linter.defineRule("test-plugin/test-rule", context => ({
                Literal(node) {
                    if (node.value === "trigger violation") {
                        context.report(node, "Reporting violation.");
                    }
                }
            }));
        });

        it("should not report a violation when inline comment enables plugin rule and there's no violation", () => {
            const config = { rules: {} };
            const code = "/*eslint test-plugin/test-rule: 2*/ var a = \"no violation\";";

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 0);
        });

        it("should not report a violation when inline comment disables plugin rule", () => {
            const code = "/*eslint test-plugin/test-rule:0*/ var a = \"trigger violation\"";
            const config = { rules: { "test-plugin/test-rule": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 0);
        });

        it("rules should not change initial config", () => {
            const config = { rules: { "test-plugin/test-rule": 2 } };
            const codeA = "/*eslint test-plugin/test-rule: 0*/ var a = \"trigger violation\";";
            const codeB = "var a = \"trigger violation\";";

            linter.reset();
            let messages = linter.verify(codeA, config, filename, false);

            assert.equal(messages.length, 0);

            messages = linter.verify(codeB, config, filename, false);
            assert.equal(messages.length, 1);
        });
    });

    describe("when evaluating code with comments to enable and disable all reporting", () => {
        it("should report a violation", () => {

            const code = [
                "/*eslint-disable */",
                "alert('test');",
                "/*eslint-enable */",
                "alert('test');"
            ].join("\n");
            const config = { rules: { "no-alert": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].nodeType, "CallExpression");
            assert.equal(messages[0].line, 4);
        });

        it("should not report a violation", () => {
            const code = [
                "/*eslint-disable */",
                "alert('test');",
                "alert('test');"
            ].join("\n");
            const config = { rules: { "no-alert": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 0);
        });

        it("should not report a violation", () => {
            const code = [
                "                    alert('test1');/*eslint-disable */\n",
                "alert('test');",
                "                                         alert('test');\n",
                "/*eslint-enable */alert('test2');"
            ].join("");
            const config = { rules: { "no-alert": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 2);
            assert.equal(messages[0].column, 21);
            assert.equal(messages[1].column, 19);
        });

        it("should not report a violation", () => {

            const code = [
                "/*eslint-disable */",
                "alert('test');",
                "/*eslint-disable */",
                "alert('test');",
                "/*eslint-enable*/",
                "alert('test');",
                "/*eslint-enable*/"
            ].join("\n");

            const config = { rules: { "no-alert": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 0);
        });


        it("should not report a violation", () => {
            const code = [
                "/*eslint-disable */",
                "(function(){ var b = 44;})()",
                "/*eslint-enable */;any();"
            ].join("\n");

            const config = { rules: { "no-unused-vars": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 0);
        });

        it("should not report a violation", () => {
            const code = [
                "(function(){ /*eslint-disable */ var b = 44;})()",
                "/*eslint-enable */;any();"
            ].join("\n");

            const config = { rules: { "no-unused-vars": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 0);
        });
    });

    describe("when evaluating code with comments to ignore reporting on of specific rules on a specific line", () => {

        describe("eslint-disable-line", () => {
            it("should report a violation", () => {
                const code = [
                    "alert('test'); // eslint-disable-line no-alert",
                    "console.log('test');" // here
                ].join("\n");
                const config = {
                    rules: {
                        "no-alert": 1,
                        "no-console": 1
                    }
                };

                const messages = linter.verify(code, config, filename);

                assert.equal(messages.length, 1);

                assert.equal(messages[0].ruleId, "no-console");
            });

            it("should report a violation", () => {
                const code = [
                    "alert('test'); // eslint-disable-line no-alert",
                    "console.log('test'); // eslint-disable-line no-console",
                    "alert('test');" // here
                ].join("\n");
                const config = {
                    rules: {
                        "no-alert": 1,
                        "no-console": 1
                    }
                };

                const messages = linter.verify(code, config, filename);

                assert.equal(messages.length, 1);

                assert.equal(messages[0].ruleId, "no-alert");
            });

            it("should report a violation", () => {
                const code = [
                    "alert('test'); // eslint-disable-line no-alert",
                    "alert('test'); /*eslint-disable-line no-alert*/" // here
                ].join("\n");
                const config = {
                    rules: {
                        "no-alert": 1
                    }
                };

                const messages = linter.verify(code, config, filename);

                assert.equal(messages.length, 1);

                assert.equal(messages[0].ruleId, "no-alert");
            });

            it("should not report a violation", () => {
                const code = [
                    "alert('test'); // eslint-disable-line no-alert",
                    "console('test'); // eslint-disable-line no-console"
                ].join("\n");
                const config = {
                    rules: {
                        "no-alert": 1,
                        "no-console": 1
                    }
                };

                const messages = linter.verify(code, config, filename);

                assert.equal(messages.length, 0);
            });

            it("should not report a violation", () => {
                const code = [
                    "alert('test') // eslint-disable-line no-alert, quotes, semi",
                    "console('test'); // eslint-disable-line"
                ].join("\n");
                const config = {
                    rules: {
                        "no-alert": 1,
                        quotes: [1, "double"],
                        semi: [1, "always"],
                        "no-console": 1
                    }
                };

                const messages = linter.verify(code, config, filename);

                assert.equal(messages.length, 0);
            });
        });

        describe("eslint-disable-next-line", () => {
            it("should ignore violation of specified rule on next line", () => {
                const code = [
                    "// eslint-disable-next-line no-alert",
                    "alert('test');",
                    "console.log('test');"
                ].join("\n");
                const config = {
                    rules: {
                        "no-alert": 1,
                        "no-console": 1
                    }
                };
                const messages = linter.verify(code, config, filename);

                assert.equal(messages.length, 1);
                assert.equal(messages[0].ruleId, "no-console");
            });

            it("should ignore violations only of specified rule", () => {
                const code = [
                    "// eslint-disable-next-line no-console",
                    "alert('test');",
                    "console.log('test');"
                ].join("\n");
                const config = {
                    rules: {
                        "no-alert": 1,
                        "no-console": 1
                    }
                };
                const messages = linter.verify(code, config, filename);

                assert.equal(messages.length, 2);
                assert.equal(messages[0].ruleId, "no-alert");
                assert.equal(messages[1].ruleId, "no-console");
            });

            it("should ignore violations of multiple rules when specified", () => {
                const code = [
                    "// eslint-disable-next-line no-alert, quotes",
                    "alert(\"test\");",
                    "console.log('test');"
                ].join("\n");
                const config = {
                    rules: {
                        "no-alert": 1,
                        quotes: [1, "single"],
                        "no-console": 1
                    }
                };
                const messages = linter.verify(code, config, filename);

                assert.equal(messages.length, 1);
                assert.equal(messages[0].ruleId, "no-console");
            });

            it("should ignore violations of specified rule on next line only", () => {
                const code = [
                    "alert('test');",
                    "// eslint-disable-next-line no-alert",
                    "alert('test');",
                    "console.log('test');"
                ].join("\n");
                const config = {
                    rules: {
                        "no-alert": 1,
                        "no-console": 1
                    }
                };
                const messages = linter.verify(code, config, filename);

                assert.equal(messages.length, 2);
                assert.equal(messages[0].ruleId, "no-alert");
                assert.equal(messages[1].ruleId, "no-console");
            });

            it("should ignore all rule violations on next line if none specified", () => {
                const code = [
                    "// eslint-disable-next-line",
                    "alert(\"test\");",
                    "console.log('test')"
                ].join("\n");
                const config = {
                    rules: {
                        semi: [1, "never"],
                        quotes: [1, "single"],
                        "no-alert": 1,
                        "no-console": 1
                    }
                };
                const messages = linter.verify(code, config, filename);

                assert.equal(messages.length, 1);
                assert.equal(messages[0].ruleId, "no-console");
            });

            it("should not report if comment is in block quotes", () => {
                const code = [
                    "alert('test');",
                    "/* eslint-disable-next-line no-alert */",
                    "alert('test');",
                    "console.log('test');"
                ].join("\n");
                const config = {
                    rules: {
                        "no-alert": 1,
                        "no-console": 1
                    }
                };
                const messages = linter.verify(code, config, filename);

                assert.equal(messages.length, 3);
                assert.equal(messages[0].ruleId, "no-alert");
                assert.equal(messages[1].ruleId, "no-alert");
                assert.equal(messages[2].ruleId, "no-console");
            });
        });
    });

    describe("when evaluating code with comments to enable and disable reporting of specific rules", () => {

        it("should report a violation", () => {
            const code = [
                "/*eslint-disable no-alert */",
                "alert('test');",
                "console.log('test');" // here
            ].join("\n");
            const config = { rules: { "no-alert": 1, "no-console": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 1);

            assert.equal(messages[0].ruleId, "no-console");
        });

        it("should report a violation", () => {
            const code = [
                "/*eslint-disable no-alert, no-console */",
                "alert('test');",
                "console.log('test');",
                "/*eslint-enable*/",

                "alert('test');", // here
                "console.log('test');" // here
            ].join("\n");
            const config = { rules: { "no-alert": 1, "no-console": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 2);

            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].line, 5);
            assert.equal(messages[1].ruleId, "no-console");
            assert.equal(messages[1].line, 6);
        });

        it("should report a violation", () => {
            const code = [
                "/*eslint-disable no-alert */",
                "alert('test');",
                "console.log('test');",
                "/*eslint-enable no-console */",

                "alert('test');" // here
            ].join("\n");
            const config = { rules: { "no-alert": 1, "no-console": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 1);

            assert.equal(messages[0].ruleId, "no-console");
        });


        it("should report a violation", () => {
            const code = [
                "/*eslint-disable no-alert, no-console */",
                "alert('test');",
                "console.log('test');",
                "/*eslint-enable no-alert*/",

                "alert('test');", // here
                "console.log('test');"
            ].join("\n");
            const config = { rules: { "no-alert": 1, "no-console": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 1);

            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].line, 5);
        });


        it("should report a violation", () => {
            const code = [
                "/*eslint-disable no-alert */",

                "/*eslint-disable no-console */",
                "alert('test');",
                "console.log('test');",
                "/*eslint-enable */",

                "alert('test');",
                "console.log('test');", // here

                "/*eslint-enable */",

                "alert('test');", // here
                "console.log('test');", // here

                "/*eslint-enable*/"
            ].join("\n");
            const config = { rules: { "no-alert": 1, "no-console": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 3);

            assert.equal(messages[0].ruleId, "no-console");
            assert.equal(messages[0].line, 7);

            assert.equal(messages[1].ruleId, "no-alert");
            assert.equal(messages[1].line, 9);

            assert.equal(messages[2].ruleId, "no-console");
            assert.equal(messages[2].line, 10);

        });

        it("should report a violation", () => {
            const code = [
                "/*eslint-disable no-alert, no-console */",
                "alert('test');",
                "console.log('test');",

                "/*eslint-enable no-alert */",

                "alert('test');", // here
                "console.log('test');",

                "/*eslint-enable no-console */",

                "alert('test');", // here
                "console.log('test');", // here
                "/*eslint-enable no-console */"
            ].join("\n");
            const config = { rules: { "no-alert": 1, "no-console": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 3);

            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].line, 5);

            assert.equal(messages[1].ruleId, "no-alert");
            assert.equal(messages[1].line, 8);

            assert.equal(messages[2].ruleId, "no-console");
            assert.equal(messages[2].line, 9);

        });

        it("should report a violation when severity is warn", () => {
            const code = [
                "/*eslint-disable no-alert, no-console */",
                "alert('test');",
                "console.log('test');",

                "/*eslint-enable no-alert */",

                "alert('test');", // here
                "console.log('test');",

                "/*eslint-enable no-console */",

                "alert('test');", // here
                "console.log('test');", // here
                "/*eslint-enable no-console */"
            ].join("\n");
            const config = { rules: { "no-alert": "warn", "no-console": "warn" } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 3);

            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].line, 5);

            assert.equal(messages[1].ruleId, "no-alert");
            assert.equal(messages[1].line, 8);

            assert.equal(messages[2].ruleId, "no-console");
            assert.equal(messages[2].line, 9);

        });
    });

    describe("when evaluating code with comments to enable and disable multiple comma separated rules", () => {
        const code = "/*eslint no-alert:1, no-console:0*/ alert('test'); console.log('test');";

        it("should report a violation", () => {
            const config = { rules: { "no-console": 1, "no-alert": 0 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].nodeType, "CallExpression");
        });
    });

    describe("when evaluating code with comments to enable configurable rule", () => {
        const code = "/*eslint quotes:[2, \"double\"]*/ alert('test');";

        it("should report a violation", () => {
            const config = { rules: { quotes: [2, "single"] } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "quotes");
            assert.equal(messages[0].message, "Strings must use doublequote.");
            assert.include(messages[0].nodeType, "Literal");
        });
    });

    describe("when evaluating code with comments to enable configurable rule using string severity", () => {
        const code = "/*eslint quotes:[\"error\", \"double\"]*/ alert('test');";

        it("should report a violation", () => {
            const config = { rules: { quotes: [2, "single"] } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "quotes");
            assert.equal(messages[0].message, "Strings must use doublequote.");
            assert.include(messages[0].nodeType, "Literal");
        });
    });

    describe("when evaluating code with incorrectly formatted comments to disable rule", () => {
        it("should report a violation", () => {
            const code = "/*eslint no-alert:'1'*/ alert('test');";

            const config = { rules: { "no-alert": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 2);

            /*
             * Incorrectly formatted comment threw error;
             * message from caught exception
             * may differ amongst UAs, so verifying
             * first part only as defined in the
             * parseJsonConfig function in lib/eslint.js
             */
            assert.match(messages[0].message, /^Failed to parse JSON from ' "no-alert":'1'':/);
            assert.equal(messages[0].line, 1);
            assert.equal(messages[0].column, 1);

            assert.equal(messages[1].ruleId, "no-alert");
            assert.equal(messages[1].message, "Unexpected alert.");
            assert.include(messages[1].nodeType, "CallExpression");
        });

        it("should report a violation", () => {
            const code = "/*eslint no-alert:abc*/ alert('test');";

            const config = { rules: { "no-alert": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 2);

            /*
             * Incorrectly formatted comment threw error;
             * message from caught exception
             * may differ amongst UAs, so verifying
             * first part only as defined in the
             * parseJsonConfig function in lib/eslint.js
             */
            assert.match(messages[0].message, /^Failed to parse JSON from ' "no-alert":abc':/);
            assert.equal(messages[0].line, 1);
            assert.equal(messages[0].column, 1);

            assert.equal(messages[1].ruleId, "no-alert");
            assert.equal(messages[1].message, "Unexpected alert.");
            assert.include(messages[1].nodeType, "CallExpression");
        });

        it("should report a violation", () => {
            const code = "/*eslint no-alert:0 2*/ alert('test');";

            const config = { rules: { "no-alert": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 2);

            /*
             * Incorrectly formatted comment threw error;
             * message from caught exception
             * may differ amongst UAs, so verifying
             * first part only as defined in the
             * parseJsonConfig function in lib/eslint.js
             */
            assert.match(messages[0].message, /^Failed to parse JSON from ' "no-alert":0 2':/);
            assert.equal(messages[0].line, 1);
            assert.equal(messages[0].column, 1);

            assert.equal(messages[1].ruleId, "no-alert");
            assert.equal(messages[1].message, "Unexpected alert.");
            assert.include(messages[1].nodeType, "CallExpression");
        });
    });

    describe("when evaluating code with comments which have colon in its value", () => {
        const code = "/* eslint max-len: [2, 100, 2, {ignoreUrls: true, ignorePattern: \"data:image\\/|\\s*require\\s*\\(|^\\s*loader\\.lazy|-\\*-\"}] */\nalert('test');";

        it("should not parse errors, should report a violation", () => {
            const messages = linter.verify(code, {}, filename);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "max-len");
            assert.equal(messages[0].message, "Line 1 exceeds the maximum line length of 100.");
            assert.include(messages[0].nodeType, "Program");
        });
    });

    describe("when evaluating a file with a shebang", () => {
        const code = "#!bin/program\n\nvar foo;;";

        it("should preserve line numbers", () => {
            const config = { rules: { "no-extra-semi": 1 } };
            const messages = linter.verify(code, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-extra-semi");
            assert.equal(messages[0].nodeType, "EmptyStatement");
            assert.equal(messages[0].line, 3);
        });

        it("should have a comment with the shebang in it", () => {
            const config = { rules: { "no-extra-semi": 1 } };

            linter.reset();

            linter.on("Program", () => {
                const comments = linter.getAllComments();

                assert.equal(comments.length, 1);
                assert.equal(comments[0].type, "Shebang");
            });
            linter.verify(code, config, "foo.js", true);
        });
    });

    describe("when evaluating broken code", () => {
        const code = BROKEN_TEST_CODE;

        it("should report a violation with a useful parse error prefix", () => {
            const messages = linter.verify(code);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].severity, 2);
            assert.isNull(messages[0].ruleId);
            assert.equal(messages[0].source, BROKEN_TEST_CODE);
            assert.equal(messages[0].line, 1);
            assert.equal(messages[0].column, 4);
            assert.isTrue(messages[0].fatal);
            assert.match(messages[0].message, /^Parsing error:/);
        });

        it("should report source code where the issue is present", () => {
            const inValidCode = [
                "var x = 20;",
                "if (x ==4 {",
                "    x++;",
                "}"
            ];
            const messages = linter.verify(inValidCode.join("\n"));

            assert.equal(messages.length, 1);
            assert.equal(messages[0].severity, 2);
            assert.equal(messages[0].source, inValidCode[1]);
            assert.isTrue(messages[0].fatal);
            assert.match(messages[0].message, /^Parsing error:/);
        });
    });

    describe("when using an invalid (undefined) rule", () => {
        linter = new Linter();

        const code = TEST_CODE;
        const results = linter.verify(code, { rules: { foobar: 2 } });
        const result = results[0];
        const warningResult = linter.verify(code, { rules: { foobar: 1 } })[0];
        const arrayOptionResults = linter.verify(code, { rules: { foobar: [2, "always"] } });
        const objectOptionResults = linter.verify(code, { rules: { foobar: [1, { bar: false }] } });
        const resultsMultiple = linter.verify(code, { rules: { foobar: 2, barfoo: 1 } });

        it("should add a stub rule", () => {
            assert.isNotNull(result);
            assert.isArray(results);
            assert.isObject(result);
            assert.property(result, "ruleId");
            assert.equal(result.ruleId, "foobar");
        });

        it("should report that the rule does not exist", () => {
            assert.property(result, "message");
            assert.equal(result.message, "Definition for rule 'foobar' was not found");
        });

        it("should report at the correct severity", () => {
            assert.property(result, "severity");
            assert.equal(result.severity, 2);
            assert.equal(warningResult.severity, 1);
        });

        it("should accept any valid rule configuration", () => {
            assert.isObject(arrayOptionResults[0]);
            assert.isObject(objectOptionResults[0]);
        });

        it("should report multiple missing rules", () => {
            assert.isArray(resultsMultiple);

            assert.deepEqual(
                resultsMultiple[1],
                {
                    ruleId: "barfoo",
                    message: "Definition for rule 'barfoo' was not found",
                    line: 1,
                    column: 1,
                    severity: 1,
                    source: "var answer = 6 * 7;",
                    nodeType: void 0
                }
            );
        });
    });

    describe("when using a rule which has been replaced", () => {
        const code = TEST_CODE;
        const results = linter.verify(code, { rules: { "no-comma-dangle": 2 } });

        it("should report the new rule", () => {
            assert.equal(results[0].ruleId, "no-comma-dangle");
            assert.equal(results[0].message, "Rule 'no-comma-dangle' was removed and replaced by: comma-dangle");
        });
    });

    describe("when using invalid rule config", () => {
        const code = TEST_CODE;

        it("should throw an error", () => {
            assert.throws(() => {
                linter.verify(code, { rules: { foobar: null } });
            }, /Invalid config for rule 'foobar'\./);
        });
    });

    describe("when calling defaults", () => {
        it("should return back config object", () => {
            const config = linter.defaults();

            assert.isNotNull(config.rules);
        });
    });

    describe("when calling getRules", () => {
        it("should return all loaded rules", () => {
            const rules = linter.getRules();

            assert.isAbove(rules.size, 230);
            assert.isObject(rules.get("no-alert"));
        });
    });

    describe("when calling version", () => {
        it("should return current version number", () => {
            const version = linter.version;

            assert.isString(version);
            assert.isTrue(parseInt(version[0], 10) >= 3);
        });
    });

    describe("when evaluating code without comments to environment", () => {
        it("should report a violation when using typed array", () => {
            const code = "var array = new Uint8Array();";

            const config = { rules: { "no-undef": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 1);
        });

        it("should report a violation when using Promise", () => {
            const code = "new Promise();";

            const config = { rules: { "no-undef": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 1);
        });
    });

    describe("when evaluating code with comments to environment", () => {
        it("should not support legacy config", () => {
            const code = "/*jshint mocha:true */ describe();";

            const config = { rules: { "no-undef": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-undef");
            assert.equal(messages[0].nodeType, "Identifier");
            assert.equal(messages[0].line, 1);
        });

        it("should not report a violation", () => {
            const code = "/*eslint-env es6 */ new Promise();";

            const config = { rules: { "no-undef": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 0);
        });

        it("should not report a violation", () => {
            const code = "/*eslint-env mocha,node */ require();describe();";

            const config = { rules: { "no-undef": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 0);
        });

        it("should not report a violation", () => {
            const code = "/*eslint-env mocha */ suite();test();";

            const config = { rules: { "no-undef": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 0);
        });

        it("should not report a violation", () => {
            const code = "/*eslint-env amd */ define();require();";

            const config = { rules: { "no-undef": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 0);
        });

        it("should not report a violation", () => {
            const code = "/*eslint-env jasmine */ expect();spyOn();";

            const config = { rules: { "no-undef": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 0);
        });

        it("should not report a violation", () => {
            const code = "/*globals require: true */ /*eslint-env node */ require = 1;";

            const config = { rules: { "no-undef": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 0);
        });

        it("should not report a violation", () => {
            const code = "/*eslint-env node */ process.exit();";

            const config = { rules: {} };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 0);
        });

        it("should not report a violation", () => {
            const code = "/*eslint no-process-exit: 0 */ /*eslint-env node */ process.exit();";

            const config = { rules: { "no-undef": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 0);
        });
    });

    describe("when evaluating code with comments to change config when allowInlineConfig is enabled", () => {
        it("should report a violation for disabling rules", () => {
            const code = [
                "alert('test'); // eslint-disable-line no-alert"
            ].join("\n");
            const config = {
                rules: {
                    "no-alert": 1
                }
            };

            const messages = linter.verify(code, config, {
                filename,
                allowInlineConfig: false
            });

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
        });

        it("should report a violation for global variable declarations", () => {
            const code = [
                "/* global foo */"
            ].join("\n");
            const config = {
                rules: {
                    test: 2
                }
            };
            let ok = false;

            linter.defineRules({ test(context) {
                return {
                    Program() {
                        const scope = context.getScope();
                        const sourceCode = context.getSourceCode();
                        const comments = sourceCode.getAllComments();

                        assert.equal(1, comments.length);

                        const foo = getVariable(scope, "foo");

                        assert.notOk(foo);

                        ok = true;
                    }
                };
            } });

            linter.verify(code, config, { allowInlineConfig: false });
            assert(ok);
        });

        it("should report a violation for eslint-disable", () => {
            const code = [
                "/* eslint-disable */",
                "alert('test');"
            ].join("\n");
            const config = {
                rules: {
                    "no-alert": 1
                }
            };

            const messages = linter.verify(code, config, {
                filename,
                allowInlineConfig: false
            });

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
        });

        it("should not report a violation for rule changes", () => {
            const code = [
                "/*eslint no-alert:2*/",
                "alert('test');"
            ].join("\n");
            const config = {
                rules: {
                    "no-alert": 0
                }
            };

            const messages = linter.verify(code, config, {
                filename,
                allowInlineConfig: false
            });

            assert.equal(messages.length, 0);
        });

        it("should report a violation for disable-line", () => {
            const code = [
                "alert('test'); // eslint-disable-line"
            ].join("\n");
            const config = {
                rules: {
                    "no-alert": 2
                }
            };

            const messages = linter.verify(code, config, {
                filename,
                allowInlineConfig: false
            });

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
        });

        it("should report a violation for env changes", () => {
            const code = [
                "/*eslint-env browser*/"
            ].join("\n");
            const config = {
                rules: {
                    test: 2
                }
            };
            let ok = false;

            linter.defineRules({ test(context) {
                return {
                    Program() {
                        const scope = context.getScope();
                        const sourceCode = context.getSourceCode();
                        const comments = sourceCode.getAllComments();

                        assert.equal(1, comments.length);

                        const windowVar = getVariable(scope, "window");

                        assert.notOk(windowVar.eslintExplicitGlobal);

                        ok = true;
                    }
                };
            } });

            linter.verify(code, config, { allowInlineConfig: false });
            assert(ok);
        });
    });

    describe("when evaluating code with comments to change config when allowInlineConfig is disabled", () => {
        it("should not report a violation", () => {
            const code = [
                "alert('test'); // eslint-disable-line no-alert"
            ].join("\n");
            const config = {
                rules: {
                    "no-alert": 1
                }
            };

            const messages = linter.verify(code, config, {
                filename,
                allowInlineConfig: true
            });

            assert.equal(messages.length, 0);
        });
    });

    describe("when evaluating code with hashbang", () => {
        it("should comment hashbang without breaking offset", () => {

            const code = "#!/usr/bin/env node\n'123';";

            const config = { rules: {} };

            linter.reset();
            linter.on("ExpressionStatement", node => {
                assert.equal(linter.getSource(node), "'123';");
            });

            linter.verify(code, config, filename, true);
        });
    });

    describe("verify()", () => {
        describe("filenames", () => {
            it("should allow filename to be passed on options object", () => {

                linter.verify("foo;", {}, { filename: "foo.js" });
                const result = linter.getFilename();

                assert.equal(result, "foo.js");
            });

            it("should allow filename to be passed as third argument", () => {

                linter.verify("foo;", {}, "foo.js");
                const result = linter.getFilename();

                assert.equal(result, "foo.js");
            });

            it("should default filename to <input> when options object doesn't have filename", () => {

                linter.verify("foo;", {}, {});
                const result = linter.getFilename();

                assert.equal(result, "<input>");
            });

            it("should default filename to <input> when only two arguments are passed", () => {

                linter.verify("foo;", {});
                const result = linter.getFilename();

                assert.equal(result, "<input>");
            });
        });

        describe("saveState", () => {
            it("should save the state when saveState is passed as an option", () => {

                const spy = sinon.spy(linter, "reset");

                linter.verify("foo;", {}, { saveState: true });
                assert.equal(spy.callCount, 0);
            });
        });

        it("should report warnings in order by line and column when called", () => {

            const code = "foo()\n    alert('test')";
            const config = { rules: { "no-mixed-spaces-and-tabs": 1, "eol-last": 1, semi: [1, "always"] } };

            const messages = linter.verify(code, config, filename);

            assert.equal(messages.length, 3);
            assert.equal(messages[0].line, 1);
            assert.equal(messages[0].column, 6);
            assert.equal(messages[1].line, 2);
            assert.equal(messages[1].column, 18);
            assert.equal(messages[2].line, 2);
            assert.equal(messages[2].column, 18);
        });

        describe("ecmaVersion", () => {
            describe("it should properly parse let declaration when", () => {
                it("the ECMAScript version number is 6", () => {
                    const messages = linter.verify("let x = 5;", {
                        parserOptions: {
                            ecmaVersion: 6
                        }
                    });

                    assert.equal(messages.length, 0);
                });

                it("the ECMAScript version number is 2015", () => {
                    const messages = linter.verify("let x = 5;", {
                        parserOptions: {
                            ecmaVersion: 2015
                        }
                    });

                    assert.equal(messages.length, 0);
                });
            });

            it("should fail to parse exponentiation operator when the ECMAScript version number is 2015", () => {
                const messages = linter.verify("x ** y;", {
                    parserOptions: {
                        ecmaVersion: 2015
                    }
                });

                assert.equal(messages.length, 1);
            });

            describe("should properly parse exponentiation operator when", () => {
                it("the ECMAScript version number is 7", () => {
                    const messages = linter.verify("x ** y;", {
                        parserOptions: {
                            ecmaVersion: 7
                        }
                    });

                    assert.equal(messages.length, 0);
                });

                it("the ECMAScript version number is 2016", () => {
                    const messages = linter.verify("x ** y;", {
                        parserOptions: {
                            ecmaVersion: 2016
                        }
                    });

                    assert.equal(messages.length, 0);
                });
            });
        });

        it("should properly parse object spread when passed ecmaFeatures", () => {

            const messages = linter.verify("var x = { ...y };", {
                parserOptions: {
                    ecmaVersion: 6,
                    ecmaFeatures: {
                        experimentalObjectRestSpread: true
                    }
                }
            }, filename);

            assert.equal(messages.length, 0);
        });

        it("should properly parse global return when passed ecmaFeatures", () => {

            const messages = linter.verify("return;", {
                parserOptions: {
                    ecmaFeatures: {
                        globalReturn: true
                    }
                }
            }, filename);

            assert.equal(messages.length, 0);
        });

        it("should properly parse global return when in Node.js environment", () => {

            const messages = linter.verify("return;", {
                env: {
                    node: true
                }
            }, filename);

            assert.equal(messages.length, 0);
        });

        it("should not parse global return when in Node.js environment with globalReturn explicitly off", () => {

            const messages = linter.verify("return;", {
                env: {
                    node: true
                },
                parserOptions: {
                    ecmaFeatures: {
                        globalReturn: false
                    }
                }
            }, filename);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].message, "Parsing error: 'return' outside of function");
        });

        it("should not parse global return when Node.js environment is false", () => {

            const messages = linter.verify("return;", {}, filename);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].message, "Parsing error: 'return' outside of function");
        });

        it("should properly parse sloppy-mode code when impliedStrict is false", () => {

            const messages = linter.verify("var private;", {}, filename);

            assert.equal(messages.length, 0);
        });

        it("should not parse sloppy-mode code when impliedStrict is true", () => {

            const messages = linter.verify("var private;", {
                parserOptions: {
                    ecmaFeatures: {
                        impliedStrict: true
                    }
                }
            }, filename);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].message, "Parsing error: The keyword 'private' is reserved");
        });

        it("should properly parse valid code when impliedStrict is true", () => {

            const messages = linter.verify("var foo;", {
                parserOptions: {
                    ecmaFeatures: {
                        impliedStrict: true
                    }
                }
            }, filename);

            assert.equal(messages.length, 0);
        });

        it("should properly parse JSX when passed ecmaFeatures", () => {

            const messages = linter.verify("var x = <div/>;", {
                parserOptions: {
                    ecmaFeatures: {
                        jsx: true
                    }
                }
            }, filename);

            assert.equal(messages.length, 0);
        });

        it("should report an error when JSX code is encountered and JSX is not enabled", () => {
            const code = "var myDivElement = <div className=\"foo\" />;";
            const messages = linter.verify(code, {}, "filename");

            assert.equal(messages.length, 1);
            assert.equal(messages[0].line, 1);
            assert.equal(messages[0].column, 20);
            assert.equal(messages[0].message, "Parsing error: Unexpected token <");
        });

        it("should not report an error when JSX code is encountered and JSX is enabled", () => {
            const code = "var myDivElement = <div className=\"foo\" />;";
            const messages = linter.verify(code, { parserOptions: { ecmaFeatures: { jsx: true } } }, "filename");

            assert.equal(messages.length, 0);
        });

        it("should not report an error when JSX code contains a spread operator and JSX is enabled", () => {
            const code = "var myDivElement = <div {...this.props} />;";
            const messages = linter.verify(code, { parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } } }, "filename");

            assert.equal(messages.length, 0);
        });

        it("should be able to use es6 features if there is a comment which has \"eslint-env es6\"", () => {
            const code = [
                "/* eslint-env es6 */",
                "var arrow = () => 0;",
                "var binary = 0b1010;",
                "{ let a = 0; const b = 1; }",
                "class A {}",
                "function defaultParams(a = 0) {}",
                "var {a = 1, b = 2} = {};",
                "for (var a of []) {}",
                "function* generator() { yield 0; }",
                "var computed = {[a]: 0};",
                "var duplicate = {dup: 0, dup: 1};",
                "var method = {foo() {}};",
                "var property = {a, b};",
                "var octal = 0o755;",
                "var u = /^.$/u.test('𠮷');",
                "var y = /hello/y.test('hello');",
                "function restParam(a, ...rest) {}",
                "function superInFunc() { super.foo(); }",
                "var template = `hello, ${a}`;",
                "var unicode = '\\u{20BB7}';"
            ].join("\n");

            const messages = linter.verify(code, null, "eslint-env es6");

            assert.equal(messages.length, 0);
        });

        it("should be able to return in global if there is a comment which has \"eslint-env node\"", () => {
            const messages = linter.verify("/* eslint-env node */ return;", null, "eslint-env node");

            assert.equal(messages.length, 0);
        });

        it("should attach a \"/*global\" comment node to declared variables", () => {
            const code = "/* global foo */\n/* global bar, baz */";
            let ok = false;

            linter.defineRules({ test(context) {
                return {
                    Program() {
                        const scope = context.getScope();
                        const sourceCode = context.getSourceCode();
                        const comments = sourceCode.getAllComments();

                        assert.equal(2, comments.length);

                        const foo = getVariable(scope, "foo");

                        assert.equal(true, foo.eslintExplicitGlobal);
                        assert.equal(comments[0], foo.eslintExplicitGlobalComment);

                        const bar = getVariable(scope, "bar");

                        assert.equal(true, bar.eslintExplicitGlobal);
                        assert.equal(comments[1], bar.eslintExplicitGlobalComment);

                        const baz = getVariable(scope, "baz");

                        assert.equal(true, baz.eslintExplicitGlobal);
                        assert.equal(comments[1], baz.eslintExplicitGlobalComment);

                        ok = true;
                    }
                };
            } });

            linter.verify(code, { rules: { test: 2 } });
            assert(ok);
        });

        it("should not crash when we reuse the SourceCode object", () => {
            linter.verify("function render() { return <div className='test'>{hello}</div> }", { parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } } });
            linter.verify(linter.getSourceCode(), { parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } } });
        });

        it("should allow 'await' as a property name in modules", () => {
            const result = linter.verify(
                "obj.await",
                { parserOptions: { ecmaVersion: 6, sourceType: "module" } }
            );

            assert(result.length === 0);
        });


        it("should not modify config object passed as argument", () => {
            const config = {};

            Object.freeze(config);
            assert.doesNotThrow(() => {
                linter.verify("var foo", config);
            });
        });
    });

    describe("Variables and references", () => {
        const code = [
            "a;",
            "function foo() { b; }",
            "Object;",
            "foo;",
            "var c;",
            "c;",
            "/* global d */",
            "d;",
            "e;",
            "f;"
        ].join("\n");
        let scope = null;

        beforeEach(() => {
            let ok = false;

            linter.defineRules({ test(context) {
                return {
                    Program() {
                        scope = context.getScope();
                        ok = true;
                    }
                };
            } });
            linter.verify(code, { rules: { test: 2 }, globals: { e: true, f: false } });
            assert(ok);
        });

        afterEach(() => {
            scope = null;
        });

        it("Scope#through should contain references of undefined variables", () => {
            assert.equal(scope.through.length, 2);
            assert.equal(scope.through[0].identifier.name, "a");
            assert.equal(scope.through[0].identifier.loc.start.line, 1);
            assert.equal(scope.through[0].resolved, null);
            assert.equal(scope.through[1].identifier.name, "b");
            assert.equal(scope.through[1].identifier.loc.start.line, 2);
            assert.equal(scope.through[1].resolved, null);
        });

        it("Scope#variables should contain global variables", () => {
            assert(scope.variables.some(v => v.name === "Object"));
            assert(scope.variables.some(v => v.name === "foo"));
            assert(scope.variables.some(v => v.name === "c"));
            assert(scope.variables.some(v => v.name === "d"));
            assert(scope.variables.some(v => v.name === "e"));
            assert(scope.variables.some(v => v.name === "f"));
        });

        it("Scope#set should contain global variables", () => {
            assert(scope.set.get("Object"));
            assert(scope.set.get("foo"));
            assert(scope.set.get("c"));
            assert(scope.set.get("d"));
            assert(scope.set.get("e"));
            assert(scope.set.get("f"));
        });

        it("Variables#references should contain their references", () => {
            assert.equal(scope.set.get("Object").references.length, 1);
            assert.equal(scope.set.get("Object").references[0].identifier.name, "Object");
            assert.equal(scope.set.get("Object").references[0].identifier.loc.start.line, 3);
            assert.equal(scope.set.get("Object").references[0].resolved, scope.set.get("Object"));
            assert.equal(scope.set.get("foo").references.length, 1);
            assert.equal(scope.set.get("foo").references[0].identifier.name, "foo");
            assert.equal(scope.set.get("foo").references[0].identifier.loc.start.line, 4);
            assert.equal(scope.set.get("foo").references[0].resolved, scope.set.get("foo"));
            assert.equal(scope.set.get("c").references.length, 1);
            assert.equal(scope.set.get("c").references[0].identifier.name, "c");
            assert.equal(scope.set.get("c").references[0].identifier.loc.start.line, 6);
            assert.equal(scope.set.get("c").references[0].resolved, scope.set.get("c"));
            assert.equal(scope.set.get("d").references.length, 1);
            assert.equal(scope.set.get("d").references[0].identifier.name, "d");
            assert.equal(scope.set.get("d").references[0].identifier.loc.start.line, 8);
            assert.equal(scope.set.get("d").references[0].resolved, scope.set.get("d"));
            assert.equal(scope.set.get("e").references.length, 1);
            assert.equal(scope.set.get("e").references[0].identifier.name, "e");
            assert.equal(scope.set.get("e").references[0].identifier.loc.start.line, 9);
            assert.equal(scope.set.get("e").references[0].resolved, scope.set.get("e"));
            assert.equal(scope.set.get("f").references.length, 1);
            assert.equal(scope.set.get("f").references[0].identifier.name, "f");
            assert.equal(scope.set.get("f").references[0].identifier.loc.start.line, 10);
            assert.equal(scope.set.get("f").references[0].resolved, scope.set.get("f"));
        });

        it("Reference#resolved should be their variable", () => {
            assert.equal(scope.set.get("Object").references[0].resolved, scope.set.get("Object"));
            assert.equal(scope.set.get("foo").references[0].resolved, scope.set.get("foo"));
            assert.equal(scope.set.get("c").references[0].resolved, scope.set.get("c"));
            assert.equal(scope.set.get("d").references[0].resolved, scope.set.get("d"));
            assert.equal(scope.set.get("e").references[0].resolved, scope.set.get("e"));
            assert.equal(scope.set.get("f").references[0].resolved, scope.set.get("f"));
        });
    });

    describe("getDeclaredVariables(node)", () => {

        /**
         * Assert `eslint.getDeclaredVariables(node)` is empty.
         * @param {ASTNode} node - A node to check.
         * @returns {void}
         */
        function checkEmpty(node) {
            assert.equal(0, linter.getDeclaredVariables(node).length);
        }

        /**
         * Assert `eslint.getDeclaredVariables(node)` is valid.
         * @param {string} code - A code to check.
         * @param {string} type - A type string of ASTNode. This method checks variables on the node of the type.
         * @param {Array<Array<string>>} expectedNamesList - An array of expected variable names. The expected variable names is an array of string.
         * @returns {void}
         */
        function verify(code, type, expectedNamesList) {
            linter.defineRules({ test(context) {
                const rule = {
                    Program: checkEmpty,
                    EmptyStatement: checkEmpty,
                    BlockStatement: checkEmpty,
                    ExpressionStatement: checkEmpty,
                    LabeledStatement: checkEmpty,
                    BreakStatement: checkEmpty,
                    ContinueStatement: checkEmpty,
                    WithStatement: checkEmpty,
                    SwitchStatement: checkEmpty,
                    ReturnStatement: checkEmpty,
                    ThrowStatement: checkEmpty,
                    TryStatement: checkEmpty,
                    WhileStatement: checkEmpty,
                    DoWhileStatement: checkEmpty,
                    ForStatement: checkEmpty,
                    ForInStatement: checkEmpty,
                    DebuggerStatement: checkEmpty,
                    ThisExpression: checkEmpty,
                    ArrayExpression: checkEmpty,
                    ObjectExpression: checkEmpty,
                    Property: checkEmpty,
                    SequenceExpression: checkEmpty,
                    UnaryExpression: checkEmpty,
                    BinaryExpression: checkEmpty,
                    AssignmentExpression: checkEmpty,
                    UpdateExpression: checkEmpty,
                    LogicalExpression: checkEmpty,
                    ConditionalExpression: checkEmpty,
                    CallExpression: checkEmpty,
                    NewExpression: checkEmpty,
                    MemberExpression: checkEmpty,
                    SwitchCase: checkEmpty,
                    Identifier: checkEmpty,
                    Literal: checkEmpty,
                    ForOfStatement: checkEmpty,
                    ArrowFunctionExpression: checkEmpty,
                    YieldExpression: checkEmpty,
                    TemplateLiteral: checkEmpty,
                    TaggedTemplateExpression: checkEmpty,
                    TemplateElement: checkEmpty,
                    ObjectPattern: checkEmpty,
                    ArrayPattern: checkEmpty,
                    RestElement: checkEmpty,
                    AssignmentPattern: checkEmpty,
                    ClassBody: checkEmpty,
                    MethodDefinition: checkEmpty,
                    MetaProperty: checkEmpty
                };

                rule[type] = function(node) {
                    const expectedNames = expectedNamesList.shift();
                    const variables = context.getDeclaredVariables(node);

                    assert(Array.isArray(expectedNames));
                    assert(Array.isArray(variables));
                    assert.equal(expectedNames.length, variables.length);
                    for (let i = variables.length - 1; i >= 0; i--) {
                        assert.equal(expectedNames[i], variables[i].name);
                    }
                };
                return rule;
            } });
            linter.verify(code, {
                rules: { test: 2 },
                parserOptions: {
                    ecmaVersion: 6,
                    sourceType: "module"
                }
            });

            // Check all expected names are asserted.
            assert.equal(0, expectedNamesList.length);
        }

        it("VariableDeclaration", () => {
            const code = "\n var {a, x: [b], y: {c = 0}} = foo;\n let {d, x: [e], y: {f = 0}} = foo;\n const {g, x: [h], y: {i = 0}} = foo, {j, k = function(z) { let l; }} = bar;\n ";
            const namesList = [
                ["a", "b", "c"],
                ["d", "e", "f"],
                ["g", "h", "i", "j", "k"],
                ["l"]
            ];

            verify(code, "VariableDeclaration", namesList);
        });

        it("VariableDeclaration (on for-in/of loop)", () => {

            // TDZ scope is created here, so tests to exclude those.
            const code = "\n for (var {a, x: [b], y: {c = 0}} in foo) {\n let g;\n }\n for (let {d, x: [e], y: {f = 0}} of foo) {\n let h;\n }\n ";
            const namesList = [
                ["a", "b", "c"],
                ["g"],
                ["d", "e", "f"],
                ["h"]
            ];

            verify(code, "VariableDeclaration", namesList);
        });

        it("VariableDeclarator", () => {

            // TDZ scope is created here, so tests to exclude those.
            const code = "\n var {a, x: [b], y: {c = 0}} = foo;\n let {d, x: [e], y: {f = 0}} = foo;\n const {g, x: [h], y: {i = 0}} = foo, {j, k = function(z) { let l; }} = bar;\n ";
            const namesList = [
                ["a", "b", "c"],
                ["d", "e", "f"],
                ["g", "h", "i"],
                ["j", "k"],
                ["l"]
            ];

            verify(code, "VariableDeclarator", namesList);
        });

        it("FunctionDeclaration", () => {
            const code = "\n function foo({a, x: [b], y: {c = 0}}, [d, e]) {\n let z;\n }\n function bar({f, x: [g], y: {h = 0}}, [i, j = function(q) { let w; }]) {\n let z;\n }\n ";
            const namesList = [
                ["foo", "a", "b", "c", "d", "e"],
                ["bar", "f", "g", "h", "i", "j"]
            ];

            verify(code, "FunctionDeclaration", namesList);
        });

        it("FunctionExpression", () => {
            const code = "\n (function foo({a, x: [b], y: {c = 0}}, [d, e]) {\n let z;\n });\n (function bar({f, x: [g], y: {h = 0}}, [i, j = function(q) { let w; }]) {\n let z;\n });\n ";
            const namesList = [
                ["foo", "a", "b", "c", "d", "e"],
                ["bar", "f", "g", "h", "i", "j"],
                ["q"]
            ];

            verify(code, "FunctionExpression", namesList);
        });

        it("ArrowFunctionExpression", () => {
            const code = "\n (({a, x: [b], y: {c = 0}}, [d, e]) => {\n let z;\n });\n (({f, x: [g], y: {h = 0}}, [i, j]) => {\n let z;\n });\n ";
            const namesList = [
                ["a", "b", "c", "d", "e"],
                ["f", "g", "h", "i", "j"]
            ];

            verify(code, "ArrowFunctionExpression", namesList);
        });

        it("ClassDeclaration", () => {
            const code = "\n class A { foo(x) { let y; } }\n class B { foo(x) { let y; } }\n ";
            const namesList = [
                ["A", "A"], // outer scope's and inner scope's.
                ["B", "B"]
            ];

            verify(code, "ClassDeclaration", namesList);
        });

        it("ClassExpression", () => {
            const code = "\n (class A { foo(x) { let y; } });\n (class B { foo(x) { let y; } });\n ";
            const namesList = [
                ["A"],
                ["B"]
            ];

            verify(code, "ClassExpression", namesList);
        });

        it("CatchClause", () => {
            const code = "\n try {} catch ({a, b}) {\n let x;\n try {} catch ({c, d}) {\n let y;\n }\n }\n ";
            const namesList = [
                ["a", "b"],
                ["c", "d"]
            ];

            verify(code, "CatchClause", namesList);
        });

        it("ImportDeclaration", () => {
            const code = "\n import \"aaa\";\n import * as a from \"bbb\";\n import b, {c, x as d} from \"ccc\";\n ";
            const namesList = [
                [],
                ["a"],
                ["b", "c", "d"]
            ];

            verify(code, "ImportDeclaration", namesList);
        });

        it("ImportSpecifier", () => {
            const code = "\n import \"aaa\";\n import * as a from \"bbb\";\n import b, {c, x as d} from \"ccc\";\n ";
            const namesList = [
                ["c"],
                ["d"]
            ];

            verify(code, "ImportSpecifier", namesList);
        });

        it("ImportDefaultSpecifier", () => {
            const code = "\n import \"aaa\";\n import * as a from \"bbb\";\n import b, {c, x as d} from \"ccc\";\n ";
            const namesList = [
                ["b"]
            ];

            verify(code, "ImportDefaultSpecifier", namesList);
        });

        it("ImportNamespaceSpecifier", () => {
            const code = "\n import \"aaa\";\n import * as a from \"bbb\";\n import b, {c, x as d} from \"ccc\";\n ";
            const namesList = [
                ["a"]
            ];

            verify(code, "ImportNamespaceSpecifier", namesList);
        });
    });

    describe("mutability", () => {
        let linter1 = null;
        let linter2 = null;

        beforeEach(() => {
            linter1 = new Linter();
            linter2 = new Linter();
        });

        describe("rules", () => {
            it("with no changes, same rules are loaded", () => {
                assert.sameDeepMembers(Array.from(linter1.getRules().keys()), Array.from(linter2.getRules().keys()));
            });

            it("loading rule in one doesnt change the other", () => {
                linter1.defineRule("mock-rule", () => ({}));

                assert.isTrue(linter1.getRules().has("mock-rule"), "mock rule is present");
                assert.isFalse(linter2.getRules().has("mock-rule"), "mock rule is not present");
            });
        });

        describe("environments", () => {
            it("with no changes same env are loaded", () => {
                assert.sameDeepMembers([linter1.environments.getAll()], [linter2.environments.getAll()]);
            });

            it("defining env in one doesnt change the other", () => {
                linter1.environments.define("mock-env", true);

                assert.isTrue(linter1.environments.get("mock-env"), "mock env is present");
                assert.isNull(linter2.environments.get("mock-env"), "mock env is not present");
            });
        });
    });

    describe("verifyAndFix", () => {
        it("Fixes the code", () => {
            const messages = linter.verifyAndFix("var a", {
                rules: {
                    semi: 2
                }
            }, { filename: "test.js" });

            assert.equal(messages.output, "var a;", "Fixes were applied correctly");
            assert.isTrue(messages.fixed);
        });

        it("does not require a third argument", () => {
            const fixResult = linter.verifyAndFix("var a", {
                rules: {
                    semi: 2
                }
            });

            assert.deepEqual(fixResult, {
                fixed: true,
                messages: [],
                output: "var a;"
            });
        });
    });

    describe("Edge cases", () => {

        it("should properly parse import statements when sourceType is module", () => {
            const code = "import foo from 'foo';";
            const messages = linter.verify(code, { parserOptions: { sourceType: "module" } });

            assert.equal(messages.length, 0);
        });

        it("should properly parse import all statements when sourceType is module", () => {
            const code = "import * as foo from 'foo';";
            const messages = linter.verify(code, { parserOptions: { sourceType: "module" } });

            assert.equal(messages.length, 0);
        });

        it("should properly parse default export statements when sourceType is module", () => {
            const code = "export default function initialize() {}";
            const messages = linter.verify(code, { parserOptions: { sourceType: "module" } });

            assert.equal(messages.length, 0);
        });

        it("should not crash when invalid parentheses syntax is encountered", () => {
            linter.verify("left = (aSize.width/2) - ()");
        });

        it("should not crash when let is used inside of switch case", () => {
            linter.verify("switch(foo) { case 1: let bar=2; }", { parserOptions: { ecmaVersion: 6 } });
        });

        it("should not crash when parsing destructured assignment", () => {
            linter.verify("var { a='a' } = {};", { parserOptions: { ecmaVersion: 6 } });
        });

        it("should report syntax error when a keyword exists in object property shorthand", () => {
            const messages = linter.verify("let a = {this}", { parserOptions: { ecmaVersion: 6 } });

            assert.equal(messages.length, 1);
            assert.equal(messages[0].fatal, true);
        });

        it("should not rewrite env setting in core (https://github.com/eslint/eslint/issues/4814)", () => {

            // This test focuses on the instance of https://github.com/eslint/eslint/blob/v2.0.0-alpha-2/conf/environments.js#L26-L28

            // This `verify()` takes the instance and runs https://github.com/eslint/eslint/blob/v2.0.0-alpha-2/lib/eslint.js#L416
            linter.defineRule("test", () => ({}));
            linter.verify("var a = 0;", {
                env: { node: true },
                parserOptions: { sourceType: "module" },
                rules: { test: 2 }
            });

            // This `verify()` takes the instance and tests that the instance was not modified.
            let ok = false;

            linter.defineRule("test", context => {
                assert(
                    context.parserOptions.ecmaFeatures.globalReturn,
                    "`ecmaFeatures.globalReturn` of the node environment should not be modified."
                );
                ok = true;
                return {};
            });
            linter.verify("var a = 0;", {
                env: { node: true },
                rules: { test: 2 }
            });

            assert(ok);
        });
    });

    // only test in Node.js, not browser
    if (typeof window === "undefined") {

        describe("Custom parser", () => {

            const parserFixtures = path.join(__dirname, "../fixtures/parsers"),
                errorPrefix = "Parsing error: ";

            it("should have file path passed to it", () => {
                const code = "/* this is code */";
                const parser = path.join(parserFixtures, "stub-parser.js");
                const parseSpy = sinon.spy(require(parser), "parse");

                linter.verify(code, { parser }, filename, true);

                sinon.assert.calledWithMatch(parseSpy, "", { filePath: filename });
            });

            it("should not report an error when JSX code contains a spread operator and JSX is enabled", () => {
                const code = "var myDivElement = <div {...this.props} />;";
                const messages = linter.verify(code, { parser: "esprima-fb" }, "filename");

                assert.equal(messages.length, 0);
            });

            it("should return an error when the custom parser can't be found", () => {
                const code = "var myDivElement = <div {...this.props} />;";
                const messages = linter.verify(code, { parser: "esprima-fbxyz" }, "filename");

                assert.equal(messages.length, 1);
                assert.equal(messages[0].severity, 2);
                assert.equal(messages[0].message, "Cannot find module 'esprima-fbxyz'");
            });

            it("should strip leading line: prefix from parser error", () => {
                const parser = path.join(parserFixtures, "line-error.js");
                const messages = linter.verify(";", { parser }, "filename");

                assert.equal(messages.length, 1);
                assert.equal(messages[0].severity, 2);
                assert.isNull(messages[0].source);
                assert.equal(messages[0].message, errorPrefix + require(parser).expectedError);
            });

            it("should not modify a parser error message without a leading line: prefix", () => {
                const parser = path.join(parserFixtures, "no-line-error.js");
                const messages = linter.verify(";", { parser }, "filename");

                assert.equal(messages.length, 1);
                assert.equal(messages[0].severity, 2);
                assert.equal(messages[0].message, errorPrefix + require(parser).expectedError);
            });

            it("should not pass any default parserOptions to the parser", () => {
                const parser = path.join(parserFixtures, "throws-with-options.js");

                const messages = linter.verify(";", { parser }, "filename");

                assert.strictEqual(messages.length, 0);
            });
        });
    }


});
