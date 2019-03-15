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
    }
    if (typeof require === "function") {
        return require(name);
    }
    throw new Error(`Cannot find object '${name}'.`);

}

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    sinon = require("sinon"),
    path = require("path");

const Linter = compatRequire("../../lib/linter", "eslint");

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
 * @returns {ASTNode|null} The variable object
 * @private
 */
function getVariable(scope, name) {
    return scope.variables.find(v => v.name === name) || null;
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

    describe("Static Members", () => {
        describe("version", () => {
            it("should return same version as instance property", () => {
                assert.strictEqual(Linter.version, linter.version);
            });
        });
    });

    describe("when using events", () => {
        const code = TEST_CODE;

        it("an error should be thrown when an error occurs inside of an event handler", () => {
            const config = { rules: { checker: "error" } };

            linter.defineRule("checker", () => ({
                Program() {
                    throw new Error("Intentional error.");
                }
            }));

            assert.throws(() => {
                linter.verify(code, config, filename);
            }, `Intentional error.\nOccurred while linting ${filename}:1`);
        });

        it("does not call rule listeners with a `this` value", () => {
            const spy = sandbox.spy();

            linter.defineRule("checker", () => ({ Program: spy }));
            linter.verify("foo", { rules: { checker: "error" } });
            assert(spy.calledOnce);
            assert.strictEqual(spy.firstCall.thisValue, void 0);
        });

        it("does not allow listeners to use special EventEmitter values", () => {
            const spy = sandbox.spy();

            linter.defineRule("checker", () => ({ newListener: spy }));
            linter.verify("foo", { rules: { checker: "error", "no-undef": "error" } });
            assert(spy.notCalled);
        });

        it("has all the `parent` properties on nodes when the rule listeners are created", () => {
            const spy = sandbox.spy(context => {
                const ast = context.getSourceCode().ast;

                assert.strictEqual(ast.body[0].parent, ast);
                assert.strictEqual(ast.body[0].expression.parent, ast.body[0]);
                assert.strictEqual(ast.body[0].expression.left.parent, ast.body[0].expression);
                assert.strictEqual(ast.body[0].expression.right.parent, ast.body[0].expression);

                return {};
            });

            linter.defineRule("checker", spy);

            linter.verify("foo + bar", { rules: { checker: "error" } });
            assert(spy.calledOnce);
        });
    });

    describe("context.getSourceLines()", () => {

        it("should get proper lines when using \\n as a line break", () => {
            const code = "a;\nb;";
            const spy = sandbox.spy(context => {
                assert.deepStrictEqual(context.getSourceLines(), ["a;", "b;"]);
                return {};
            });

            linter.defineRule("checker", spy);
            linter.verify(code, { rules: { checker: "error" } });
            assert(spy.calledOnce);
        });

        it("should get proper lines when using \\r\\n as a line break", () => {
            const code = "a;\r\nb;";
            const spy = sandbox.spy(context => {
                assert.deepStrictEqual(context.getSourceLines(), ["a;", "b;"]);
                return {};
            });

            linter.defineRule("checker", spy);
            linter.verify(code, { rules: { checker: "error" } });
            assert(spy.calledOnce);
        });

        it("should get proper lines when using \\r as a line break", () => {
            const code = "a;\rb;";
            const spy = sandbox.spy(context => {
                assert.deepStrictEqual(context.getSourceLines(), ["a;", "b;"]);
                return {};
            });

            linter.defineRule("checker", spy);
            linter.verify(code, { rules: { checker: "error" } });
            assert(spy.calledOnce);
        });

        it("should get proper lines when using \\u2028 as a line break", () => {
            const code = "a;\u2028b;";
            const spy = sandbox.spy(context => {
                assert.deepStrictEqual(context.getSourceLines(), ["a;", "b;"]);
                return {};
            });

            linter.defineRule("checker", spy);
            linter.verify(code, { rules: { checker: "error" } });
            assert(spy.calledOnce);
        });

        it("should get proper lines when using \\u2029 as a line break", () => {
            const code = "a;\u2029b;";
            const spy = sandbox.spy(context => {
                assert.deepStrictEqual(context.getSourceLines(), ["a;", "b;"]);
                return {};
            });

            linter.defineRule("checker", spy);
            linter.verify(code, { rules: { checker: "error" } });
            assert(spy.calledOnce);
        });


    });

    describe("getSourceCode()", () => {
        const code = TEST_CODE;

        it("should retrieve SourceCode object after reset", () => {
            linter.verify(code, {}, filename, true);

            const sourceCode = linter.getSourceCode();

            assert.isObject(sourceCode);
            assert.strictEqual(sourceCode.text, code);
            assert.isObject(sourceCode.ast);
        });

        it("should retrieve SourceCode object without reset", () => {
            linter.verify(code, {}, filename);

            const sourceCode = linter.getSourceCode();

            assert.isObject(sourceCode);
            assert.strictEqual(sourceCode.text, code);
            assert.isObject(sourceCode.ast);
        });

    });

    describe("context.getSource()", () => {
        const code = TEST_CODE;

        it("should retrieve all text when used without parameters", () => {

            const config = { rules: { checker: "error" } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    assert.strictEqual(context.getSource(), TEST_CODE);
                });
                return { Program: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });

        it("should retrieve all text for root node", () => {
            const config = { rules: { checker: "error" } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(node => {
                    assert.strictEqual(context.getSource(node), TEST_CODE);
                });
                return { Program: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });

        it("should clamp to valid range when retrieving characters before start of source", () => {
            const config = { rules: { checker: "error" } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(node => {
                    assert.strictEqual(context.getSource(node, 2, 0), TEST_CODE);
                });
                return { Program: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });

        it("should retrieve all text for binary expression", () => {
            const config = { rules: { checker: "error" } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(node => {
                    assert.strictEqual(context.getSource(node), "6 * 7");
                });
                return { BinaryExpression: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });

        it("should retrieve all text plus two characters before for binary expression", () => {
            const config = { rules: { checker: "error" } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(node => {
                    assert.strictEqual(context.getSource(node, 2), "= 6 * 7");
                });
                return { BinaryExpression: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });

        it("should retrieve all text plus one character after for binary expression", () => {
            const config = { rules: { checker: "error" } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(node => {
                    assert.strictEqual(context.getSource(node, 0, 1), "6 * 7;");
                });
                return { BinaryExpression: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });

        it("should retrieve all text plus two characters before and one character after for binary expression", () => {
            const config = { rules: { checker: "error" } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(node => {
                    assert.strictEqual(context.getSource(node, 2, 1), "= 6 * 7;");
                });
                return { BinaryExpression: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });

    });

    describe("when calling context.getAncestors", () => {
        const code = TEST_CODE;

        it("should retrieve all ancestors when used", () => {

            const config = { rules: { checker: "error" } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const ancestors = context.getAncestors();

                    assert.strictEqual(ancestors.length, 3);
                });
                return { BinaryExpression: spy };
            });

            linter.verify(code, config, filename, true);
            assert(spy && spy.calledOnce);
        });

        it("should retrieve empty ancestors for root node", () => {
            const config = { rules: { checker: "error" } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const ancestors = context.getAncestors();

                    assert.strictEqual(ancestors.length, 0);
                });

                return { Program: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });
    });

    describe("when calling context.getNodeByRangeIndex", () => {
        const code = TEST_CODE;

        it("should retrieve a node starting at the given index", () => {
            const config = { rules: { checker: "error" } };
            const spy = sandbox.spy(context => {
                assert.strictEqual(context.getNodeByRangeIndex(4).type, "Identifier");
                return {};
            });

            linter.defineRule("checker", spy);
            linter.verify(code, config);
            assert(spy.calledOnce);
        });

        it("should retrieve a node containing the given index", () => {
            const config = { rules: { checker: "error" } };
            const spy = sandbox.spy(context => {
                assert.strictEqual(context.getNodeByRangeIndex(6).type, "Identifier");
                return {};
            });

            linter.defineRule("checker", spy);
            linter.verify(code, config);
            assert(spy.calledOnce);
        });

        it("should retrieve a node that is exactly the given index", () => {
            const config = { rules: { checker: "error" } };
            const spy = sandbox.spy(context => {
                const node = context.getNodeByRangeIndex(13);

                assert.strictEqual(node.type, "Literal");
                assert.strictEqual(node.value, 6);
                return {};
            });

            linter.defineRule("checker", spy);
            linter.verify(code, config);
            assert(spy.calledOnce);
        });

        it("should retrieve a node ending with the given index", () => {
            const config = { rules: { checker: "error" } };
            const spy = sandbox.spy(context => {
                assert.strictEqual(context.getNodeByRangeIndex(9).type, "Identifier");
                return {};
            });

            linter.defineRule("checker", spy);
            linter.verify(code, config);
            assert(spy.calledOnce);
        });

        it("should retrieve the deepest node containing the given index", () => {
            const config = { rules: { checker: "error" } };
            const spy = sandbox.spy(context => {
                const node1 = context.getNodeByRangeIndex(14);

                assert.strictEqual(node1.type, "BinaryExpression");

                const node2 = context.getNodeByRangeIndex(3);

                assert.strictEqual(node2.type, "VariableDeclaration");
                return {};
            });

            linter.defineRule("checker", spy);
            linter.verify(code, config);
            assert(spy.calledOnce);
        });

        it("should return null if the index is outside the range of any node", () => {
            const config = { rules: { checker: "error" } };
            const spy = sandbox.spy(context => {
                const node1 = context.getNodeByRangeIndex(-1);

                assert.isNull(node1);

                const node2 = context.getNodeByRangeIndex(-99);

                assert.isNull(node2);
                return {};
            });

            linter.defineRule("checker", spy);
            linter.verify(code, config);
            assert(spy.calledOnce);
        });
    });


    describe("when calling context.getScope", () => {
        const code = "function foo() { q: for(;;) { break q; } } function bar () { var q = t; } var baz = (() => { return 1; });";

        it("should retrieve the global scope correctly from a Program", () => {
            const config = { rules: { checker: "error" }, parserOptions: { ecmaVersion: 6 } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope();

                    assert.strictEqual(scope.type, "global");
                });
                return { Program: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });

        it("should retrieve the function scope correctly from a FunctionDeclaration", () => {
            const config = { rules: { checker: "error" }, parserOptions: { ecmaVersion: 6 } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope();

                    assert.strictEqual(scope.type, "function");
                });
                return { FunctionDeclaration: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledTwice);
        });

        it("should retrieve the function scope correctly from a LabeledStatement", () => {
            const config = { rules: { checker: "error" }, parserOptions: { ecmaVersion: 6 } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope();

                    assert.strictEqual(scope.type, "function");
                    assert.strictEqual(scope.block.id.name, "foo");
                });
                return { LabeledStatement: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });

        it("should retrieve the function scope correctly from within an ArrowFunctionExpression", () => {
            const config = { rules: { checker: "error" }, parserOptions: { ecmaVersion: 6 } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope();

                    assert.strictEqual(scope.type, "function");
                    assert.strictEqual(scope.block.type, "ArrowFunctionExpression");
                });

                return { ReturnStatement: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });

        it("should retrieve the function scope correctly from within an SwitchStatement", () => {
            const config = { rules: { checker: "error" }, parserOptions: { ecmaVersion: 6 } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope();

                    assert.strictEqual(scope.type, "switch");
                    assert.strictEqual(scope.block.type, "SwitchStatement");
                });

                return { SwitchStatement: spy };
            });

            linter.verify("switch(foo){ case 'a': var b = 'foo'; }", config);
            assert(spy && spy.calledOnce);
        });

        it("should retrieve the function scope correctly from within a BlockStatement", () => {
            const config = { rules: { checker: "error" }, parserOptions: { ecmaVersion: 6 } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope();

                    assert.strictEqual(scope.type, "block");
                    assert.strictEqual(scope.block.type, "BlockStatement");
                });

                return { BlockStatement: spy };
            });

            linter.verify("var x; {let y = 1}", config);
            assert(spy && spy.calledOnce);
        });

        it("should retrieve the function scope correctly from within a nested block statement", () => {
            const config = { rules: { checker: "error" }, parserOptions: { ecmaVersion: 6 } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope();

                    assert.strictEqual(scope.type, "block");
                    assert.strictEqual(scope.block.type, "BlockStatement");
                });

                return { BlockStatement: spy };
            });

            linter.verify("if (true) { let x = 1 }", config);
            assert(spy && spy.calledOnce);
        });

        it("should retrieve the function scope correctly from within a FunctionDeclaration", () => {
            const config = { rules: { checker: "error" }, parserOptions: { ecmaVersion: 6 } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope();

                    assert.strictEqual(scope.type, "function");
                    assert.strictEqual(scope.block.type, "FunctionDeclaration");
                });

                return { FunctionDeclaration: spy };
            });

            linter.verify("function foo() {}", config);
            assert(spy && spy.calledOnce);
        });

        it("should retrieve the function scope correctly from within a FunctionExpression", () => {
            const config = { rules: { checker: "error" }, parserOptions: { ecmaVersion: 6 } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope();

                    assert.strictEqual(scope.type, "function");
                    assert.strictEqual(scope.block.type, "FunctionExpression");
                });

                return { FunctionExpression: spy };
            });

            linter.verify("(function foo() {})();", config);
            assert(spy && spy.calledOnce);
        });

        it("should retrieve the catch scope correctly from within a CatchClause", () => {
            const config = { rules: { checker: "error" }, parserOptions: { ecmaVersion: 6 } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope();

                    assert.strictEqual(scope.type, "catch");
                    assert.strictEqual(scope.block.type, "CatchClause");
                });

                return { CatchClause: spy };
            });

            linter.verify("try {} catch (err) {}", config);
            assert(spy && spy.calledOnce);
        });

        it("should retrieve module scope correctly from an ES6 module", () => {
            const config = { rules: { checker: "error" }, parserOptions: { sourceType: "module" } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope();

                    assert.strictEqual(scope.type, "module");
                });

                return { AssignmentExpression: spy };
            });

            linter.verify("var foo = {}; foo.bar = 1;", config);
            assert(spy && spy.calledOnce);
        });

        it("should retrieve function scope correctly when globalReturn is true", () => {
            const config = { rules: { checker: "error" }, parserOptions: { ecmaFeatures: { globalReturn: true } } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope();

                    assert.strictEqual(scope.type, "function");
                });

                return { AssignmentExpression: spy };
            });

            linter.verify("var foo = {}; foo.bar = 1;", config);
            assert(spy && spy.calledOnce);
        });
    });

    describe("marking variables as used", () => {
        it("should mark variables in current scope as used", () => {
            const code = "var a = 1, b = 2;";
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    assert.isTrue(context.markVariableAsUsed("a"));

                    const scope = context.getScope();

                    assert.isTrue(getVariable(scope, "a").eslintUsed);
                    assert.notOk(getVariable(scope, "b").eslintUsed);
                });

                return { "Program:exit": spy };
            });

            linter.verify(code, { rules: { checker: "error" } });
            assert(spy && spy.calledOnce);
        });
        it("should mark variables in function args as used", () => {
            const code = "function abc(a, b) { return 1; }";
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    assert.isTrue(context.markVariableAsUsed("a"));

                    const scope = context.getScope();

                    assert.isTrue(getVariable(scope, "a").eslintUsed);
                    assert.notOk(getVariable(scope, "b").eslintUsed);
                });

                return { ReturnStatement: spy };
            });

            linter.verify(code, { rules: { checker: "error" } });
            assert(spy && spy.calledOnce);
        });
        it("should mark variables in higher scopes as used", () => {
            const code = "var a, b; function abc() { return 1; }";
            let returnSpy, exitSpy;

            linter.defineRule("checker", context => {
                returnSpy = sandbox.spy(() => {
                    assert.isTrue(context.markVariableAsUsed("a"));
                });
                exitSpy = sandbox.spy(() => {
                    const scope = context.getScope();

                    assert.isTrue(getVariable(scope, "a").eslintUsed);
                    assert.notOk(getVariable(scope, "b").eslintUsed);
                });

                return { ReturnStatement: returnSpy, "Program:exit": exitSpy };
            });

            linter.verify(code, { rules: { checker: "error" } });
            assert(returnSpy && returnSpy.calledOnce);
            assert(exitSpy && exitSpy.calledOnce);
        });

        it("should mark variables in Node.js environment as used", () => {
            const code = "var a = 1, b = 2;";
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const globalScope = context.getScope(),
                        childScope = globalScope.childScopes[0];

                    assert.isTrue(context.markVariableAsUsed("a"));

                    assert.isTrue(getVariable(childScope, "a").eslintUsed);
                    assert.isUndefined(getVariable(childScope, "b").eslintUsed);
                });

                return { "Program:exit": spy };
            });

            linter.verify(code, { rules: { checker: "error" }, env: { node: true } });
            assert(spy && spy.calledOnce);
        });

        it("should mark variables in modules as used", () => {
            const code = "var a = 1, b = 2;";
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const globalScope = context.getScope(),
                        childScope = globalScope.childScopes[0];

                    assert.isTrue(context.markVariableAsUsed("a"));

                    assert.isTrue(getVariable(childScope, "a").eslintUsed);
                    assert.isUndefined(getVariable(childScope, "b").eslintUsed);
                });

                return { "Program:exit": spy };
            });

            linter.verify(code, { rules: { checker: "error" }, parserOptions: { sourceType: "module" } }, filename, true);
            assert(spy && spy.calledOnce);
        });

        it("should return false if the given variable is not found", () => {
            const code = "var a = 1, b = 2;";
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    assert.isFalse(context.markVariableAsUsed("c"));
                });

                return { "Program:exit": spy };
            });

            linter.verify(code, { rules: { checker: "error" } });
            assert(spy && spy.calledOnce);
        });
    });

    describe("when evaluating code", () => {
        const code = TEST_CODE;

        it("events for each node type should fire", () => {
            const config = { rules: { checker: "error" } };

            // spies for various AST node types
            const spyLiteral = sinon.spy(),
                spyVariableDeclarator = sinon.spy(),
                spyVariableDeclaration = sinon.spy(),
                spyIdentifier = sinon.spy(),
                spyBinaryExpression = sinon.spy();

            linter.defineRule("checker", () => ({
                Literal: spyLiteral,
                VariableDeclarator: spyVariableDeclarator,
                VariableDeclaration: spyVariableDeclaration,
                Identifier: spyIdentifier,
                BinaryExpression: spyBinaryExpression
            }));

            const messages = linter.verify(code, config, filename, true);

            assert.strictEqual(messages.length, 0);
            sinon.assert.calledOnce(spyVariableDeclaration);
            sinon.assert.calledOnce(spyVariableDeclarator);
            sinon.assert.calledOnce(spyIdentifier);
            sinon.assert.calledTwice(spyLiteral);
            sinon.assert.calledOnce(spyBinaryExpression);
        });

        it("should throw an error if a rule reports a problem without a message", () => {
            linter.defineRule("invalid-report", context => ({
                Program(node) {
                    context.report({ node });
                }
            }));

            assert.throws(
                () => linter.verify("foo", { rules: { "invalid-report": "error" } }),
                TypeError,
                "Missing `message` property in report() call; add a message that describes the linting problem."
            );
        });
    });

    describe("when config has shared settings for rules", () => {
        const code = "test-rule";

        it("should pass settings to all rules", () => {
            linter.defineRule(code, context => ({
                Literal(node) {
                    context.report(node, context.settings.info);
                }
            }));

            const config = { rules: {}, settings: { info: "Hello" } };

            config.rules[code] = 1;

            const messages = linter.verify("0", config, filename);

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].message, "Hello");
        });

        it("should not have any settings if they were not passed in", () => {
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

            assert.strictEqual(messages.length, 0);
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

            linter.defineRule("test-rule", sandbox.mock().withArgs(
                sinon.match({ parserOptions })
            ).returns({}));

            const config = { rules: { "test-rule": 2 }, parserOptions };

            linter.verify("0", config, filename);
        });

        it("should pass parserOptions to all rules when default parserOptions is used", () => {

            const parserOptions = {};

            linter.defineRule("test-rule", sandbox.mock().withArgs(
                sinon.match({ parserOptions })
            ).returns({}));

            const config = { rules: { "test-rule": 2 } };

            linter.verify("0", config, filename);
        });

    });

    describe("when a custom parser is defined using defineParser", () => {

        it("should be able to define a custom parser", () => {
            const parser = {
                parseForESLint: function parse(code, options) {
                    return {
                        ast: require("espree").parse(code, options),
                        services: {
                            test: {
                                getMessage() {
                                    return "Hi!";
                                }
                            }
                        }
                    };
                }
            };

            linter.defineParser("test-parser", parser);
            const config = { rules: {}, parser: "test-parser" };
            const messages = linter.verify("0", config, filename);

            assert.strictEqual(messages.length, 0);
        });

    });

    describe("when config has parser", () => {

        // custom parser unsupported in browser, only test in Node
        if (typeof window === "undefined") {
            it("should pass parser as parserPath to all rules when provided on config", () => {

                const alternateParser = "esprima";

                linter.defineRule("test-rule", sandbox.mock().withArgs(
                    sinon.match({ parserPath: alternateParser })
                ).returns({}));

                const config = { rules: { "test-rule": 2 }, parser: alternateParser };

                linter.verify("0", config, filename);
            });

            it("should use parseForESLint() in custom parser when custom parser is specified", () => {

                const alternateParser = path.resolve(__dirname, "../fixtures/parsers/enhanced-parser.js");
                const config = { rules: {}, parser: alternateParser };
                const messages = linter.verify("0", config, filename);

                assert.strictEqual(messages.length, 0);
            });

            it("should expose parser services when using parseForESLint() and services are specified", () => {

                const alternateParser = path.resolve(__dirname, "../fixtures/parsers/enhanced-parser.js");

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

                assert.strictEqual(messages.length, 1);
                assert.strictEqual(messages[0].message, "Hi!");
            });

            it("should use the same parserServices if source code object is reused", () => {
                const parser = path.resolve(__dirname, "../fixtures/parsers/enhanced-parser.js");

                linter.defineRule("test-service-rule", context => ({
                    Literal(node) {
                        context.report({
                            node,
                            message: context.parserServices.test.getMessage()
                        });
                    }
                }));

                const config = { rules: { "test-service-rule": 2 }, parser };
                const messages = linter.verify("0", config, filename);

                assert.strictEqual(messages.length, 1);
                assert.strictEqual(messages[0].message, "Hi!");

                const messages2 = linter.verify(linter.getSourceCode(), config, filename);

                assert.strictEqual(messages2.length, 1);
                assert.strictEqual(messages2[0].message, "Hi!");
            });
        }

        it("should pass parser as parserPath to all rules when default parser is used", () => {
            linter.defineRule("test-rule", sandbox.mock().withArgs(
                sinon.match({ parserPath: "espree" })
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

            const messages = linter.verify(code, config, filename, true);

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].ruleId, rule);
        });

        it("should be configurable by only setting the string value", () => {
            const rule = "semi",
                config = { rules: {} };

            config.rules[rule] = "warn";

            const messages = linter.verify(code, config, filename, true);

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].severity, 1);
            assert.strictEqual(messages[0].ruleId, rule);
        });

        it("should be configurable by passing in values as an array", () => {
            const rule = "semi",
                config = { rules: {} };

            config.rules[rule] = [1];

            const messages = linter.verify(code, config, filename, true);

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].ruleId, rule);
        });

        it("should be configurable by passing in string value as an array", () => {
            const rule = "semi",
                config = { rules: {} };

            config.rules[rule] = ["warn"];

            const messages = linter.verify(code, config, filename, true);

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].severity, 1);
            assert.strictEqual(messages[0].ruleId, rule);
        });

        it("should not be configurable by setting other value", () => {
            const rule = "semi",
                config = { rules: {} };

            config.rules[rule] = "1";

            const messages = linter.verify(code, config, filename, true);

            assert.strictEqual(messages.length, 0);
        });

        it("should process empty config", () => {
            const config = {};
            const messages = linter.verify(code, config, filename, true);

            assert.strictEqual(messages.length, 0);
        });
    });

    describe("when evaluating code containing /*global */ and /*globals */ blocks", () => {

        it("variables should be available in global scope", () => {
            const config = { rules: { checker: "error" }, globals: { Array: "off", ConfigGlobal: "writeable" } };
            const code = `
                /*global a b:true c:false d:readable e:writeable Math:off */
                function foo() {}
                /*globals f:true*/
                /* global ConfigGlobal : readable */
            `;
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope();
                    const a = getVariable(scope, "a"),
                        b = getVariable(scope, "b"),
                        c = getVariable(scope, "c"),
                        d = getVariable(scope, "d"),
                        e = getVariable(scope, "e"),
                        f = getVariable(scope, "f"),
                        mathGlobal = getVariable(scope, "Math"),
                        arrayGlobal = getVariable(scope, "Array"),
                        configGlobal = getVariable(scope, "ConfigGlobal");

                    assert.strictEqual(a.name, "a");
                    assert.strictEqual(a.writeable, false);
                    assert.strictEqual(b.name, "b");
                    assert.strictEqual(b.writeable, true);
                    assert.strictEqual(c.name, "c");
                    assert.strictEqual(c.writeable, false);
                    assert.strictEqual(d.name, "d");
                    assert.strictEqual(d.writeable, false);
                    assert.strictEqual(e.name, "e");
                    assert.strictEqual(e.writeable, true);
                    assert.strictEqual(f.name, "f");
                    assert.strictEqual(f.writeable, true);
                    assert.strictEqual(mathGlobal, null);
                    assert.strictEqual(arrayGlobal, null);
                    assert.strictEqual(configGlobal.name, "ConfigGlobal");
                    assert.strictEqual(configGlobal.writeable, false);
                });

                return { Program: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });
    });

    describe("when evaluating code containing a /*global */ block with sloppy whitespace", () => {
        const code = "/* global  a b  : true   c:  false*/";

        it("variables should be available in global scope", () => {
            const config = { rules: { checker: "error" } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope(),
                        a = getVariable(scope, "a"),
                        b = getVariable(scope, "b"),
                        c = getVariable(scope, "c");

                    assert.strictEqual(a.name, "a");
                    assert.strictEqual(a.writeable, false);
                    assert.strictEqual(b.name, "b");
                    assert.strictEqual(b.writeable, true);
                    assert.strictEqual(c.name, "c");
                    assert.strictEqual(c.writeable, false);
                });

                return { Program: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });
    });

    describe("when evaluating code containing /*eslint-env */ block", () => {
        it("variables should be available in global scope", () => {
            const code = "/*eslint-env node*/ function f() {} /*eslint-env browser, foo*/";
            const config = { rules: { checker: "error" } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope(),
                        exports = getVariable(scope, "exports"),
                        window = getVariable(scope, "window");

                    assert.strictEqual(exports.writeable, true);
                    assert.strictEqual(window.writeable, false);
                });

                return { Program: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });
    });

    describe("when evaluating code containing /*eslint-env */ block with sloppy whitespace", () => {
        const code = "/* eslint-env ,, node  , no-browser ,,  */";

        it("variables should be available in global scope", () => {
            const config = { rules: { checker: "error" } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope(),
                        exports = getVariable(scope, "exports"),
                        window = getVariable(scope, "window");

                    assert.strictEqual(exports.writeable, true);
                    assert.strictEqual(window, null);
                });

                return { Program: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });
    });

    describe("when evaluating code containing /*exported */ block", () => {

        it("we should behave nicely when no matching variable is found", () => {
            const code = "/* exported horse */";
            const config = { rules: {} };

            linter.verify(code, config, filename, true);
        });

        it("variables should be exported", () => {
            const code = "/* exported horse */\n\nvar horse = 'circus'";
            const config = { rules: { checker: "error" } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope(),
                        horse = getVariable(scope, "horse");

                    assert.strictEqual(horse.eslintUsed, true);
                });

                return { Program: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });

        it("undefined variables should not be exported", () => {
            const code = "/* exported horse */\n\nhorse = 'circus'";
            const config = { rules: { checker: "error" } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope(),
                        horse = getVariable(scope, "horse");

                    assert.strictEqual(horse, null);
                });

                return { Program: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });

        it("variables should be exported in strict mode", () => {
            const code = "/* exported horse */\n'use strict';\nvar horse = 'circus'";
            const config = { rules: { checker: "error" } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope(),
                        horse = getVariable(scope, "horse");

                    assert.strictEqual(horse.eslintUsed, true);
                });

                return { Program: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });

        it("variables should not be exported in the es6 module environment", () => {
            const code = "/* exported horse */\nvar horse = 'circus'";
            const config = { rules: { checker: "error" }, parserOptions: { sourceType: "module" } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope(),
                        horse = getVariable(scope, "horse");

                    assert.strictEqual(horse, null); // there is no global scope at all
                });

                return { Program: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });

        it("variables should not be exported when in the node environment", () => {
            const code = "/* exported horse */\nvar horse = 'circus'";
            const config = { rules: { checker: "error" }, env: { node: true } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope(),
                        horse = getVariable(scope, "horse");

                    assert.strictEqual(horse, null); // there is no global scope at all
                });

                return { Program: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });
    });

    describe("when evaluating code containing a line comment", () => {
        const code = "//global a \n function f() {}";

        it("should not introduce a global variable", () => {
            const config = { rules: { checker: "error" } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope();

                    assert.strictEqual(getVariable(scope, "a"), null);
                });

                return { Program: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });
    });

    describe("when evaluating code containing normal block comments", () => {
        const code = "/**/  /*a*/  /*b:true*/  /*foo c:false*/";

        it("should not introduce a global variable", () => {
            const config = { rules: { checker: "error" } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope();

                    assert.strictEqual(getVariable(scope, "a"), null);
                    assert.strictEqual(getVariable(scope, "b"), null);
                    assert.strictEqual(getVariable(scope, "foo"), null);
                    assert.strictEqual(getVariable(scope, "c"), null);
                });

                return { Program: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });
    });

    describe("when evaluating any code", () => {
        const code = "x";

        it("builtin global variables should be available in the global scope", () => {
            const config = { rules: { checker: "error" } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope();

                    assert.notStrictEqual(getVariable(scope, "Object"), null);
                    assert.notStrictEqual(getVariable(scope, "Array"), null);
                    assert.notStrictEqual(getVariable(scope, "undefined"), null);
                });

                return { Program: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });

        it("ES6 global variables should not be available by default", () => {
            const config = { rules: { checker: "error" } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope();

                    assert.strictEqual(getVariable(scope, "Promise"), null);
                    assert.strictEqual(getVariable(scope, "Symbol"), null);
                    assert.strictEqual(getVariable(scope, "WeakMap"), null);
                });

                return { Program: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });

        it("ES6 global variables should be available in the es6 environment", () => {
            const config = { rules: { checker: "error" }, env: { es6: true } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope();

                    assert.notStrictEqual(getVariable(scope, "Promise"), null);
                    assert.notStrictEqual(getVariable(scope, "Symbol"), null);
                    assert.notStrictEqual(getVariable(scope, "WeakMap"), null);
                });

                return { Program: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });

        it("ES6 global variables can be disabled when the es6 environment is enabled", () => {
            const config = { rules: { checker: "error" }, globals: { Promise: "off", Symbol: "off", WeakMap: "off" }, env: { es6: true } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(() => {
                    const scope = context.getScope();

                    assert.strictEqual(getVariable(scope, "Promise"), null);
                    assert.strictEqual(getVariable(scope, "Symbol"), null);
                    assert.strictEqual(getVariable(scope, "WeakMap"), null);
                });

                return { Program: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });
    });

    describe("at any time", () => {
        const code = "new-rule";

        it("can add a rule dynamically", () => {
            linter.defineRule(code, context => ({
                Literal(node) {
                    context.report(node, "message");
                }
            }));

            const config = { rules: {} };

            config.rules[code] = 1;

            const messages = linter.verify("0", config, filename);

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].ruleId, code);
            assert.strictEqual(messages[0].nodeType, "Literal");
        });
    });

    describe("at any time", () => {
        const code = ["new-rule-0", "new-rule-1"];

        it("can add multiple rules dynamically", () => {
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

            assert.strictEqual(messages.length, code.length);
            code.forEach(item => {
                assert.ok(messages.some(message => message.ruleId === item));
            });
            messages.forEach(message => {
                assert.strictEqual(message.nodeType, "Literal");
            });
        });
    });

    describe("at any time", () => {
        const code = "filename-rule";

        it("has access to the filename", () => {
            linter.defineRule(code, context => ({
                Literal(node) {
                    context.report(node, context.getFilename());
                }
            }));

            const config = { rules: {} };

            config.rules[code] = 1;

            const messages = linter.verify("0", config, filename);

            assert.strictEqual(messages[0].message, filename);
        });

        it("defaults filename to '<input>'", () => {
            linter.defineRule(code, context => ({
                Literal(node) {
                    context.report(node, context.getFilename());
                }
            }));

            const config = { rules: {} };

            config.rules[code] = 1;

            const messages = linter.verify("0", config);

            assert.strictEqual(messages[0].message, "<input>");
        });
    });

    describe("when evaluating code with comments to enable rules", () => {

        it("should report a violation", () => {
            const code = "/*eslint no-alert:1*/ alert('test');";
            const config = { rules: {} };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].ruleId, "no-alert");
            assert.strictEqual(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].nodeType, "CallExpression");
        });

        it("rules should not change initial config", () => {
            const config = { rules: { strict: 2 } };
            const codeA = "/*eslint strict: 0*/ function bar() { return 2; }";
            const codeB = "function foo() { return 1; }";
            let messages = linter.verify(codeA, config, filename, false);

            assert.strictEqual(messages.length, 0);

            messages = linter.verify(codeB, config, filename, false);
            assert.strictEqual(messages.length, 1);
        });

        it("rules should not change initial config", () => {
            const config = { rules: { quotes: [2, "double"] } };
            const codeA = "/*eslint quotes: 0*/ function bar() { return '2'; }";
            const codeB = "function foo() { return '1'; }";
            let messages = linter.verify(codeA, config, filename, false);

            assert.strictEqual(messages.length, 0);

            messages = linter.verify(codeB, config, filename, false);
            assert.strictEqual(messages.length, 1);
        });

        it("rules should not change initial config", () => {
            const config = { rules: { quotes: [2, "double"] } };
            const codeA = "/*eslint quotes: [0, \"single\"]*/ function bar() { return '2'; }";
            const codeB = "function foo() { return '1'; }";
            let messages = linter.verify(codeA, config, filename, false);

            assert.strictEqual(messages.length, 0);

            messages = linter.verify(codeB, config, filename, false);
            assert.strictEqual(messages.length, 1);
        });

        it("rules should not change initial config", () => {
            const config = { rules: { "no-unused-vars": [2, { vars: "all" }] } };
            const codeA = "/*eslint no-unused-vars: [0, {\"vars\": \"local\"}]*/ var a = 44;";
            const codeB = "var b = 55;";
            let messages = linter.verify(codeA, config, filename, false);

            assert.strictEqual(messages.length, 0);

            messages = linter.verify(codeB, config, filename, false);
            assert.strictEqual(messages.length, 1);
        });
    });

    describe("when evaluating code with invalid comments to enable rules", () => {
        it("should report a violation when the config is not a valid rule configuration", () => {
            assert.deepStrictEqual(
                linter.verify("/*eslint no-alert:true*/ alert('test');", {}),
                [
                    {
                        severity: 2,
                        ruleId: "no-alert",
                        message: "Configuration for rule \"no-alert\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed 'true').\n",
                        line: 1,
                        column: 1,
                        endLine: 1,
                        endColumn: 25,
                        nodeType: null
                    }
                ]
            );
        });

        it("should report a violation when the config violates a rule's schema", () => {
            assert.deepStrictEqual(
                linter.verify("/* eslint no-alert: [error, {nonExistentPropertyName: true}]*/", {}),
                [
                    {
                        severity: 2,
                        ruleId: "no-alert",
                        message: "Configuration for rule \"no-alert\" is invalid:\n\tValue [{\"nonExistentPropertyName\":true}] should NOT have more than 0 items.\n",
                        line: 1,
                        column: 1,
                        endLine: 1,
                        endColumn: 63,
                        nodeType: null
                    }
                ]
            );
        });
    });

    describe("when evaluating code with comments to disable rules", () => {
        const code = "/*eslint no-alert:0*/ alert('test');";

        it("should not report a violation", () => {
            const config = { rules: { "no-alert": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 0);
        });
    });

    describe("when evaluating code with comments to enable multiple rules", () => {
        const code = "/*eslint no-alert:1 no-console:1*/ alert('test'); console.log('test');";

        it("should report a violation", () => {
            const config = { rules: {} };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 2);
            assert.strictEqual(messages[0].ruleId, "no-alert");
            assert.strictEqual(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].nodeType, "CallExpression");
            assert.strictEqual(messages[1].ruleId, "no-console");
        });
    });

    describe("when evaluating code with comments to enable and disable multiple rules", () => {
        const code = "/*eslint no-alert:1 no-console:0*/ alert('test'); console.log('test');";

        it("should report a violation", () => {
            const config = { rules: { "no-console": 1, "no-alert": 0 } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].ruleId, "no-alert");
            assert.strictEqual(messages[0].message, "Unexpected alert.");
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

            assert.strictEqual(messages.length, 0);
        });

        it("should not report a violation when inline comment disables plugin rule", () => {
            const code = "/*eslint test-plugin/test-rule:0*/ var a = \"trigger violation\"";
            const config = { rules: { "test-plugin/test-rule": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 0);
        });

        it("should report a violation when the report is right before the comment", () => {
            const code = " /* eslint-disable */ ";

            linter.defineRule("checker", context => ({
                Program() {
                    context.report({ loc: { line: 1, column: 0 }, message: "foo" });
                }
            }));
            const problems = linter.verify(code, { rules: { checker: "error" } });

            assert.strictEqual(problems.length, 1);
            assert.strictEqual(problems[0].message, "foo");
        });

        it("should not report a violation when the report is right at the start of the comment", () => {
            const code = " /* eslint-disable */ ";

            linter.defineRule("checker", context => ({
                Program() {
                    context.report({ loc: { line: 1, column: 1 }, message: "foo" });
                }
            }));
            const problems = linter.verify(code, { rules: { checker: "error" } });

            assert.strictEqual(problems.length, 0);
        });

        it("rules should not change initial config", () => {
            const config = { rules: { "test-plugin/test-rule": 2 } };
            const codeA = "/*eslint test-plugin/test-rule: 0*/ var a = \"trigger violation\";";
            const codeB = "var a = \"trigger violation\";";
            let messages = linter.verify(codeA, config, filename, false);

            assert.strictEqual(messages.length, 0);

            messages = linter.verify(codeB, config, filename, false);
            assert.strictEqual(messages.length, 1);
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

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].ruleId, "no-alert");
            assert.strictEqual(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].nodeType, "CallExpression");
            assert.strictEqual(messages[0].line, 4);
        });

        it("should not report a violation", () => {
            const code = [
                "/*eslint-disable */",
                "alert('test');",
                "alert('test');"
            ].join("\n");
            const config = { rules: { "no-alert": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 0);
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

            assert.strictEqual(messages.length, 2);
            assert.strictEqual(messages[0].column, 21);
            assert.strictEqual(messages[1].column, 19);
        });

        it("should report a violation", () => {

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

            assert.strictEqual(messages.length, 1);
        });


        it("should not report a violation", () => {
            const code = [
                "/*eslint-disable */",
                "(function(){ var b = 44;})()",
                "/*eslint-enable */;any();"
            ].join("\n");

            const config = { rules: { "no-unused-vars": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 0);
        });

        it("should not report a violation", () => {
            const code = [
                "(function(){ /*eslint-disable */ var b = 44;})()",
                "/*eslint-enable */;any();"
            ].join("\n");

            const config = { rules: { "no-unused-vars": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 0);
        });
    });

    describe("when evaluating code with comments to ignore reporting on specific rules on a specific line", () => {

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

                assert.strictEqual(messages.length, 1);

                assert.strictEqual(messages[0].ruleId, "no-console");
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

                assert.strictEqual(messages.length, 1);

                assert.strictEqual(messages[0].ruleId, "no-alert");
            });

            it("should report a violation if eslint-disable-line in a block comment is not on a single line", () => {
                const code = [
                    "/* eslint-disable-line",
                    "*",
                    "*/ console.log('test');" // here
                ].join("\n");
                const config = {
                    rules: {
                        "no-console": 1
                    }
                };

                const messages = linter.verify(code, config, filename);

                assert.strictEqual(messages.length, 2);

                assert.strictEqual(messages[1].ruleId, "no-console");
            });

            it("should not disable rule and add an extra report if eslint-disable-line in a block comment is not on a single line", () => {
                const code = [
                    "alert('test'); /* eslint-disable-line ",
                    "no-alert */"
                ].join("\n");
                const config = {
                    rules: {
                        "no-alert": 1
                    }
                };

                const messages = linter.verify(code, config);

                assert.deepStrictEqual(messages, [
                    {
                        ruleId: "no-alert",
                        severity: 1,
                        line: 1,
                        column: 1,
                        endLine: 1,
                        endColumn: 14,
                        message: "Unexpected alert.",
                        messageId: "unexpected",
                        nodeType: "CallExpression"
                    },
                    {
                        ruleId: null,
                        severity: 2,
                        message: "eslint-disable-line comment should not span multiple lines.",
                        line: 1,
                        column: 16,
                        endLine: 2,
                        endColumn: 12,
                        nodeType: null
                    }
                ]);
            });

            it("should not report a violation for eslint-disable-line in block comment", () => {
                const code = [
                    "alert('test'); // eslint-disable-line no-alert",
                    "alert('test'); /*eslint-disable-line no-alert*/"
                ].join("\n");
                const config = {
                    rules: {
                        "no-alert": 1
                    }
                };

                const messages = linter.verify(code, config, filename);

                assert.strictEqual(messages.length, 0);
            });

            it("should not report a violation", () => {
                const code = [
                    "alert('test'); // eslint-disable-line no-alert",
                    "console.log('test'); // eslint-disable-line no-console"
                ].join("\n");
                const config = {
                    rules: {
                        "no-alert": 1,
                        "no-console": 1
                    }
                };

                const messages = linter.verify(code, config, filename);

                assert.strictEqual(messages.length, 0);
            });

            it("should not report a violation", () => {
                const code = [
                    "alert('test') // eslint-disable-line no-alert, quotes, semi",
                    "console.log('test'); // eslint-disable-line"
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

                assert.strictEqual(messages.length, 0);
            });

            it("should not report a violation", () => {
                const code = [
                    "alert('test') /* eslint-disable-line no-alert, quotes, semi */",
                    "console.log('test'); /* eslint-disable-line */"
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

                assert.strictEqual(messages.length, 0);
            });

            it("should ignore violations of multiple rules when specified in mixed comments", () => {
                const code = [
                    " alert(\"test\"); /* eslint-disable-line no-alert */ // eslint-disable-line quotes"
                ].join("\n");
                const config = {
                    rules: {
                        "no-alert": 1,
                        quotes: [1, "single"]
                    }
                };
                const messages = linter.verify(code, config, filename);

                assert.strictEqual(messages.length, 0);
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

                assert.strictEqual(messages.length, 1);
                assert.strictEqual(messages[0].ruleId, "no-console");
            });

            it("should ignore violation of specified rule if eslint-disable-next-line is a block comment", () => {
                const code = [
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

                assert.strictEqual(messages.length, 1);
                assert.strictEqual(messages[0].ruleId, "no-console");
            });
            it("should ignore violation of specified rule if eslint-disable-next-line is a block comment", () => {
                const code = [
                    "/* eslint-disable-next-line no-alert */",
                    "alert('test');"
                ].join("\n");
                const config = {
                    rules: {
                        "no-alert": 1
                    }
                };
                const messages = linter.verify(code, config, filename);

                assert.strictEqual(messages.length, 0);
            });

            it("should not ignore violation if block comment is not on a single line", () => {
                const code = [
                    "/* eslint-disable-next-line",
                    "no-alert */alert('test');"
                ].join("\n");
                const config = {
                    rules: {
                        "no-alert": 1
                    }
                };
                const messages = linter.verify(code, config, filename);

                assert.strictEqual(messages.length, 2);
                assert.strictEqual(messages[1].ruleId, "no-alert");
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

                assert.strictEqual(messages.length, 2);
                assert.strictEqual(messages[0].ruleId, "no-alert");
                assert.strictEqual(messages[1].ruleId, "no-console");
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

                assert.strictEqual(messages.length, 1);
                assert.strictEqual(messages[0].ruleId, "no-console");
            });

            it("should ignore violations of multiple rules when specified in mixed comments", () => {
                const code = [
                    "/* eslint-disable-next-line no-alert */ // eslint-disable-next-line quotes",
                    "alert(\"test\");"
                ].join("\n");
                const config = {
                    rules: {
                        "no-alert": 1,
                        quotes: [1, "single"]
                    }
                };
                const messages = linter.verify(code, config, filename);

                assert.strictEqual(messages.length, 0);
            });

            it("should ignore violations of only the specified rule on next line", () => {
                const code = [
                    "// eslint-disable-next-line quotes",
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

                assert.strictEqual(messages.length, 2);
                assert.strictEqual(messages[0].ruleId, "no-alert");
                assert.strictEqual(messages[1].ruleId, "no-console");
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

                assert.strictEqual(messages.length, 2);
                assert.strictEqual(messages[0].ruleId, "no-alert");
                assert.strictEqual(messages[1].ruleId, "no-console");
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

                assert.strictEqual(messages.length, 1);
                assert.strictEqual(messages[0].ruleId, "no-console");
            });

            it("should ignore violations if eslint-disable-next-line is a block comment", () => {
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

                assert.strictEqual(messages.length, 2);
                assert.strictEqual(messages[0].ruleId, "no-alert");
                assert.strictEqual(messages[1].ruleId, "no-console");
            });

            it("should report a violation", () => {
                const code = [
                    "/* eslint-disable-next-line",
                    "*",
                    "*/",
                    "console.log('test');" // here
                ].join("\n");
                const config = {
                    rules: {
                        "no-alert": 1,
                        "no-console": 1
                    }
                };

                const messages = linter.verify(code, config, filename);

                assert.strictEqual(messages.length, 2);

                assert.strictEqual(messages[1].ruleId, "no-console");
            });

            it("should not ignore violations if comment is of the type Shebang", () => {
                const code = [
                    "#! eslint-disable-next-line no-alert",
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

                assert.strictEqual(messages.length, 2);
                assert.strictEqual(messages[0].ruleId, "no-alert");
                assert.strictEqual(messages[1].ruleId, "no-console");
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

            assert.strictEqual(messages.length, 1);

            assert.strictEqual(messages[0].ruleId, "no-console");
        });

        it("should report no violation", () => {
            const code = [
                "/*eslint-disable no-unused-vars */",
                "var foo; // eslint-disable-line no-unused-vars",
                "var bar;",
                "/* eslint-enable no-unused-vars */" // here
            ].join("\n");
            const config = { rules: { "no-unused-vars": 2 } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 0);
        });

        it("should report no violation", () => {
            const code = [
                "var foo1; // eslint-disable-line no-unused-vars",
                "var foo2; // eslint-disable-line no-unused-vars",
                "var foo3; // eslint-disable-line no-unused-vars",
                "var foo4; // eslint-disable-line no-unused-vars",
                "var foo5; // eslint-disable-line no-unused-vars"
            ].join("\n");
            const config = { rules: { "no-unused-vars": 2 } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 0);
        });

        it("should report no violation", () => {
            const code = [
                "/* eslint-disable quotes */",
                "console.log(\"foo\");",
                "/* eslint-enable quotes */"
            ].join("\n");
            const config = { rules: { quotes: 2 } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 0);
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

            assert.strictEqual(messages.length, 2);

            assert.strictEqual(messages[0].ruleId, "no-alert");
            assert.strictEqual(messages[0].line, 5);
            assert.strictEqual(messages[1].ruleId, "no-console");
            assert.strictEqual(messages[1].line, 6);
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

            assert.strictEqual(messages.length, 1);

            assert.strictEqual(messages[0].ruleId, "no-console");
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

            assert.strictEqual(messages.length, 1);

            assert.strictEqual(messages[0].ruleId, "no-alert");
            assert.strictEqual(messages[0].line, 5);
        });


        it("should report a violation", () => {
            const code = [
                "/*eslint-disable no-alert */",

                "/*eslint-disable no-console */",
                "alert('test');",
                "console.log('test');",
                "/*eslint-enable */",

                "alert('test');", // here
                "console.log('test');", // here

                "/*eslint-enable */",

                "alert('test');", // here
                "console.log('test');", // here

                "/*eslint-enable*/"
            ].join("\n");
            const config = { rules: { "no-alert": 1, "no-console": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 4);

            assert.strictEqual(messages[0].ruleId, "no-alert");
            assert.strictEqual(messages[0].line, 6);

            assert.strictEqual(messages[1].ruleId, "no-console");
            assert.strictEqual(messages[1].line, 7);

            assert.strictEqual(messages[2].ruleId, "no-alert");
            assert.strictEqual(messages[2].line, 9);

            assert.strictEqual(messages[3].ruleId, "no-console");
            assert.strictEqual(messages[3].line, 10);

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

            assert.strictEqual(messages.length, 3);

            assert.strictEqual(messages[0].ruleId, "no-alert");
            assert.strictEqual(messages[0].line, 5);

            assert.strictEqual(messages[1].ruleId, "no-alert");
            assert.strictEqual(messages[1].line, 8);

            assert.strictEqual(messages[2].ruleId, "no-console");
            assert.strictEqual(messages[2].line, 9);

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

            assert.strictEqual(messages.length, 3);

            assert.strictEqual(messages[0].ruleId, "no-alert");
            assert.strictEqual(messages[0].line, 5);

            assert.strictEqual(messages[1].ruleId, "no-alert");
            assert.strictEqual(messages[1].line, 8);

            assert.strictEqual(messages[2].ruleId, "no-console");
            assert.strictEqual(messages[2].line, 9);

        });
    });

    describe("when evaluating code with comments to enable and disable multiple comma separated rules", () => {
        const code = "/*eslint no-alert:1, no-console:0*/ alert('test'); console.log('test');";

        it("should report a violation", () => {
            const config = { rules: { "no-console": 1, "no-alert": 0 } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].ruleId, "no-alert");
            assert.strictEqual(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].nodeType, "CallExpression");
        });
    });

    describe("when evaluating code with comments to enable configurable rule", () => {
        const code = "/*eslint quotes:[2, \"double\"]*/ alert('test');";

        it("should report a violation", () => {
            const config = { rules: { quotes: [2, "single"] } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].ruleId, "quotes");
            assert.strictEqual(messages[0].message, "Strings must use doublequote.");
            assert.include(messages[0].nodeType, "Literal");
        });
    });

    describe("when evaluating code with comments to enable configurable rule using string severity", () => {
        const code = "/*eslint quotes:[\"error\", \"double\"]*/ alert('test');";

        it("should report a violation", () => {
            const config = { rules: { quotes: [2, "single"] } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].ruleId, "quotes");
            assert.strictEqual(messages[0].message, "Strings must use doublequote.");
            assert.include(messages[0].nodeType, "Literal");
        });
    });

    describe("when evaluating code with incorrectly formatted comments to disable rule", () => {
        it("should report a violation", () => {
            const code = "/*eslint no-alert:'1'*/ alert('test');";

            const config = { rules: { "no-alert": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 2);

            /*
             * Incorrectly formatted comment threw error;
             * message from caught exception
             * may differ amongst UAs, so verifying
             * first part only as defined in the
             * parseJsonConfig function in lib/eslint.js
             */
            assert.match(messages[0].message, /^Failed to parse JSON from ' "no-alert":'1'':/u);
            assert.strictEqual(messages[0].line, 1);
            assert.strictEqual(messages[0].column, 1);

            assert.strictEqual(messages[1].ruleId, "no-alert");
            assert.strictEqual(messages[1].message, "Unexpected alert.");
            assert.include(messages[1].nodeType, "CallExpression");
        });

        it("should report a violation", () => {
            const code = "/*eslint no-alert:abc*/ alert('test');";

            const config = { rules: { "no-alert": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 2);

            /*
             * Incorrectly formatted comment threw error;
             * message from caught exception
             * may differ amongst UAs, so verifying
             * first part only as defined in the
             * parseJsonConfig function in lib/eslint.js
             */
            assert.match(messages[0].message, /^Failed to parse JSON from ' "no-alert":abc':/u);
            assert.strictEqual(messages[0].line, 1);
            assert.strictEqual(messages[0].column, 1);

            assert.strictEqual(messages[1].ruleId, "no-alert");
            assert.strictEqual(messages[1].message, "Unexpected alert.");
            assert.include(messages[1].nodeType, "CallExpression");
        });

        it("should report a violation", () => {
            const code = "/*eslint no-alert:0 2*/ alert('test');";

            const config = { rules: { "no-alert": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 2);

            /*
             * Incorrectly formatted comment threw error;
             * message from caught exception
             * may differ amongst UAs, so verifying
             * first part only as defined in the
             * parseJsonConfig function in lib/eslint.js
             */
            assert.match(messages[0].message, /^Failed to parse JSON from ' "no-alert":0 2':/u);
            assert.strictEqual(messages[0].line, 1);
            assert.strictEqual(messages[0].column, 1);

            assert.strictEqual(messages[1].ruleId, "no-alert");
            assert.strictEqual(messages[1].message, "Unexpected alert.");
            assert.include(messages[1].nodeType, "CallExpression");
        });
    });

    describe("when evaluating code with comments which have colon in its value", () => {
        const code = "/* eslint max-len: [2, 100, 2, {ignoreUrls: true, ignorePattern: \"data:image\\/|\\s*require\\s*\\(|^\\s*loader\\.lazy|-\\*-\"}] */\nalert('test');";

        it("should not parse errors, should report a violation", () => {
            const messages = linter.verify(code, {}, filename);

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].ruleId, "max-len");
            assert.strictEqual(messages[0].message, "Line 1 exceeds the maximum line length of 100.");
            assert.include(messages[0].nodeType, "Program");
        });
    });

    describe("when evaluating a file with a shebang", () => {
        const code = "#!bin/program\n\nvar foo;;";

        it("should preserve line numbers", () => {
            const config = { rules: { "no-extra-semi": 1 } };
            const messages = linter.verify(code, config);

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].ruleId, "no-extra-semi");
            assert.strictEqual(messages[0].nodeType, "EmptyStatement");
            assert.strictEqual(messages[0].line, 3);
        });

        it("should have a comment with the shebang in it", () => {
            const config = { rules: { checker: "error" } };
            const spy = sandbox.spy(context => {
                const comments = context.getAllComments();

                assert.strictEqual(comments.length, 1);
                assert.strictEqual(comments[0].type, "Shebang");
                return {};
            });

            linter.defineRule("checker", spy);
            linter.verify(code, config);
            assert(spy.calledOnce);
        });
    });

    describe("when evaluating broken code", () => {
        const code = BROKEN_TEST_CODE;

        it("should report a violation with a useful parse error prefix", () => {
            const messages = linter.verify(code);

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].severity, 2);
            assert.isNull(messages[0].ruleId);
            assert.strictEqual(messages[0].line, 1);
            assert.strictEqual(messages[0].column, 4);
            assert.isTrue(messages[0].fatal);
            assert.match(messages[0].message, /^Parsing error:/u);
        });

        it("should report source code where the issue is present", () => {
            const inValidCode = [
                "var x = 20;",
                "if (x ==4 {",
                "    x++;",
                "}"
            ];
            const messages = linter.verify(inValidCode.join("\n"));

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].severity, 2);
            assert.isTrue(messages[0].fatal);
            assert.match(messages[0].message, /^Parsing error:/u);
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
            assert.strictEqual(result.ruleId, "foobar");
        });

        it("should report that the rule does not exist", () => {
            assert.property(result, "message");
            assert.strictEqual(result.message, "Definition for rule 'foobar' was not found");
        });

        it("should report at the correct severity", () => {
            assert.property(result, "severity");
            assert.strictEqual(result.severity, 2);
            assert.strictEqual(warningResult.severity, 1);
        });

        it("should accept any valid rule configuration", () => {
            assert.isObject(arrayOptionResults[0]);
            assert.isObject(objectOptionResults[0]);
        });

        it("should report multiple missing rules", () => {
            assert.isArray(resultsMultiple);

            assert.deepStrictEqual(
                resultsMultiple[1],
                {
                    ruleId: "barfoo",
                    message: "Definition for rule 'barfoo' was not found",
                    line: 1,
                    column: 1,
                    severity: 1,
                    nodeType: null
                }
            );
        });
    });

    describe("when using a rule which has been replaced", () => {
        const code = TEST_CODE;
        const results = linter.verify(code, { rules: { "no-comma-dangle": 2 } });

        it("should report the new rule", () => {
            assert.strictEqual(results[0].ruleId, "no-comma-dangle");
            assert.strictEqual(results[0].message, "Rule 'no-comma-dangle' was removed and replaced by: comma-dangle");
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

    describe("when evaluating an empty string", () => {
        it("runs rules", () => {
            linter.defineRule("no-programs", context => ({
                Program(node) {
                    context.report({ node, message: "No programs allowed." });
                }
            }));

            assert.strictEqual(
                linter.verify("", { rules: { "no-programs": "error" } }).length,
                1
            );
        });
    });

    describe("when evaluating code without comments to environment", () => {
        it("should report a violation when using typed array", () => {
            const code = "var array = new Uint8Array();";

            const config = { rules: { "no-undef": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 1);
        });

        it("should report a violation when using Promise", () => {
            const code = "new Promise();";

            const config = { rules: { "no-undef": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 1);
        });
    });

    describe("when evaluating code with comments to environment", () => {
        it("should not support legacy config", () => {
            const code = "/*jshint mocha:true */ describe();";

            const config = { rules: { "no-undef": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].ruleId, "no-undef");
            assert.strictEqual(messages[0].nodeType, "Identifier");
            assert.strictEqual(messages[0].line, 1);
        });

        it("should not report a violation", () => {
            const code = "/*eslint-env es6 */ new Promise();";

            const config = { rules: { "no-undef": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 0);
        });

        it("should not report a violation", () => {
            const code = "/*eslint-env mocha,node */ require();describe();";

            const config = { rules: { "no-undef": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 0);
        });

        it("should not report a violation", () => {
            const code = "/*eslint-env mocha */ suite();test();";

            const config = { rules: { "no-undef": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 0);
        });

        it("should not report a violation", () => {
            const code = "/*eslint-env amd */ define();require();";

            const config = { rules: { "no-undef": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 0);
        });

        it("should not report a violation", () => {
            const code = "/*eslint-env jasmine */ expect();spyOn();";

            const config = { rules: { "no-undef": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 0);
        });

        it("should not report a violation", () => {
            const code = "/*globals require: true */ /*eslint-env node */ require = 1;";

            const config = { rules: { "no-undef": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 0);
        });

        it("should not report a violation", () => {
            const code = "/*eslint-env node */ process.exit();";

            const config = { rules: {} };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 0);
        });

        it("should not report a violation", () => {
            const code = "/*eslint no-process-exit: 0 */ /*eslint-env node */ process.exit();";

            const config = { rules: { "no-undef": 1 } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 0);
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

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].ruleId, "no-alert");
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

            linter.defineRules({
                test(context) {
                    return {
                        Program() {
                            const scope = context.getScope();
                            const sourceCode = context.getSourceCode();
                            const comments = sourceCode.getAllComments();

                            assert.strictEqual(1, comments.length);

                            const foo = getVariable(scope, "foo");

                            assert.notOk(foo);

                            ok = true;
                        }
                    };
                }
            });

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

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].ruleId, "no-alert");
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

            assert.strictEqual(messages.length, 0);
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

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].ruleId, "no-alert");
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

            linter.defineRules({
                test(context) {
                    return {
                        Program() {
                            const scope = context.getScope();
                            const sourceCode = context.getSourceCode();
                            const comments = sourceCode.getAllComments();

                            assert.strictEqual(1, comments.length);

                            const windowVar = getVariable(scope, "window");

                            assert.notOk(windowVar.eslintExplicitGlobal);

                            ok = true;
                        }
                    };
                }
            });

            linter.verify(code, config, { allowInlineConfig: false });
            assert(ok);
        });
    });

    describe("reportUnusedDisable option", () => {
        it("reports problems for unused eslint-disable comments", () => {
            assert.deepStrictEqual(
                linter.verify("/* eslint-disable */", {}, { reportUnusedDisableDirectives: true }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported).",
                        line: 1,
                        column: 1,
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
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

            assert.strictEqual(messages.length, 0);
        });
    });

    describe("when evaluating code with hashbang", () => {
        it("should comment hashbang without breaking offset", () => {
            const code = "#!/usr/bin/env node\n'123';";
            const config = { rules: { checker: "error" } };
            let spy;

            linter.defineRule("checker", context => {
                spy = sandbox.spy(node => {
                    assert.strictEqual(context.getSource(node), "'123';");
                });
                return { ExpressionStatement: spy };
            });

            linter.verify(code, config);
            assert(spy && spy.calledOnce);
        });
    });

    describe("verify()", () => {
        describe("filenames", () => {
            it("should allow filename to be passed on options object", () => {
                const filenameChecker = sandbox.spy(context => {
                    assert.strictEqual(context.getFilename(), "foo.js");
                    return {};
                });

                linter.defineRule("checker", filenameChecker);
                linter.defineRule("checker", filenameChecker);
                linter.verify("foo;", { rules: { checker: "error" } }, { filename: "foo.js" });
                assert(filenameChecker.calledOnce);
            });

            it("should allow filename to be passed as third argument", () => {
                const filenameChecker = sandbox.spy(context => {
                    assert.strictEqual(context.getFilename(), "bar.js");
                    return {};
                });

                linter.defineRule("checker", filenameChecker);
                linter.verify("foo;", { rules: { checker: "error" } }, "bar.js");
                assert(filenameChecker.calledOnce);
            });

            it("should default filename to <input> when options object doesn't have filename", () => {
                const filenameChecker = sandbox.spy(context => {
                    assert.strictEqual(context.getFilename(), "<input>");
                    return {};
                });

                linter.defineRule("checker", filenameChecker);
                linter.verify("foo;", { rules: { checker: "error" } }, {});
                assert(filenameChecker.calledOnce);
            });

            it("should default filename to <input> when only two arguments are passed", () => {
                const filenameChecker = sandbox.spy(context => {
                    assert.strictEqual(context.getFilename(), "<input>");
                    return {};
                });

                linter.defineRule("checker", filenameChecker);
                linter.verify("foo;", { rules: { checker: "error" } });
                assert(filenameChecker.calledOnce);
            });
        });

        it("should report warnings in order by line and column when called", () => {

            const code = "foo()\n    alert('test')";
            const config = { rules: { "no-mixed-spaces-and-tabs": 1, "eol-last": 1, semi: [1, "always"] } };

            const messages = linter.verify(code, config, filename);

            assert.strictEqual(messages.length, 3);
            assert.strictEqual(messages[0].line, 1);
            assert.strictEqual(messages[0].column, 6);
            assert.strictEqual(messages[1].line, 2);
            assert.strictEqual(messages[1].column, 18);
            assert.strictEqual(messages[2].line, 2);
            assert.strictEqual(messages[2].column, 18);
        });

        describe("ecmaVersion", () => {
            describe("it should properly parse let declaration when", () => {
                it("the ECMAScript version number is 6", () => {
                    const messages = linter.verify("let x = 5;", {
                        parserOptions: {
                            ecmaVersion: 6
                        }
                    });

                    assert.strictEqual(messages.length, 0);
                });

                it("the ECMAScript version number is 2015", () => {
                    const messages = linter.verify("let x = 5;", {
                        parserOptions: {
                            ecmaVersion: 2015
                        }
                    });

                    assert.strictEqual(messages.length, 0);
                });
            });

            it("should fail to parse exponentiation operator when the ECMAScript version number is 2015", () => {
                const messages = linter.verify("x ** y;", {
                    parserOptions: {
                        ecmaVersion: 2015
                    }
                });

                assert.strictEqual(messages.length, 1);
            });

            describe("should properly parse exponentiation operator when", () => {
                it("the ECMAScript version number is 7", () => {
                    const messages = linter.verify("x ** y;", {
                        parserOptions: {
                            ecmaVersion: 7
                        }
                    });

                    assert.strictEqual(messages.length, 0);
                });

                it("the ECMAScript version number is 2016", () => {
                    const messages = linter.verify("x ** y;", {
                        parserOptions: {
                            ecmaVersion: 2016
                        }
                    });

                    assert.strictEqual(messages.length, 0);
                });
            });
        });

        it("should properly parse object spread when ecmaVersion is 2018", () => {

            const messages = linter.verify("var x = { ...y };", {
                parserOptions: {
                    ecmaVersion: 2018
                }
            }, filename);

            assert.strictEqual(messages.length, 0);
        });

        it("should properly parse global return when passed ecmaFeatures", () => {

            const messages = linter.verify("return;", {
                parserOptions: {
                    ecmaFeatures: {
                        globalReturn: true
                    }
                }
            }, filename);

            assert.strictEqual(messages.length, 0);
        });

        it("should properly parse global return when in Node.js environment", () => {

            const messages = linter.verify("return;", {
                env: {
                    node: true
                }
            }, filename);

            assert.strictEqual(messages.length, 0);
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

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].message, "Parsing error: 'return' outside of function");
        });

        it("should not parse global return when Node.js environment is false", () => {

            const messages = linter.verify("return;", {}, filename);

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].message, "Parsing error: 'return' outside of function");
        });

        it("should properly parse sloppy-mode code when impliedStrict is false", () => {

            const messages = linter.verify("var private;", {}, filename);

            assert.strictEqual(messages.length, 0);
        });

        it("should not parse sloppy-mode code when impliedStrict is true", () => {

            const messages = linter.verify("var private;", {
                parserOptions: {
                    ecmaFeatures: {
                        impliedStrict: true
                    }
                }
            }, filename);

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].message, "Parsing error: The keyword 'private' is reserved");
        });

        it("should properly parse valid code when impliedStrict is true", () => {

            const messages = linter.verify("var foo;", {
                parserOptions: {
                    ecmaFeatures: {
                        impliedStrict: true
                    }
                }
            }, filename);

            assert.strictEqual(messages.length, 0);
        });

        it("should properly parse JSX when passed ecmaFeatures", () => {

            const messages = linter.verify("var x = <div/>;", {
                parserOptions: {
                    ecmaFeatures: {
                        jsx: true
                    }
                }
            }, filename);

            assert.strictEqual(messages.length, 0);
        });

        it("should report an error when JSX code is encountered and JSX is not enabled", () => {
            const code = "var myDivElement = <div className=\"foo\" />;";
            const messages = linter.verify(code, {}, "filename");

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].line, 1);
            assert.strictEqual(messages[0].column, 20);
            assert.strictEqual(messages[0].message, "Parsing error: Unexpected token <");
        });

        it("should not report an error when JSX code is encountered and JSX is enabled", () => {
            const code = "var myDivElement = <div className=\"foo\" />;";
            const messages = linter.verify(code, { parserOptions: { ecmaFeatures: { jsx: true } } }, "filename");

            assert.strictEqual(messages.length, 0);
        });

        it("should not report an error when JSX code contains a spread operator and JSX is enabled", () => {
            const code = "var myDivElement = <div {...this.props} />;";
            const messages = linter.verify(code, { parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } } }, "filename");

            assert.strictEqual(messages.length, 0);
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
                "class B { superInFunc() { super.foo(); } }",
                "var template = `hello, ${a}`;",
                "var unicode = '\\u{20BB7}';"
            ].join("\n");

            const messages = linter.verify(code, null, "eslint-env es6");

            assert.strictEqual(messages.length, 0);
        });

        it("should be able to return in global if there is a comment which has \"eslint-env node\"", () => {
            const messages = linter.verify("/* eslint-env node */ return;", null, "eslint-env node");

            assert.strictEqual(messages.length, 0);
        });

        it("should attach a \"/*global\" comment node to declared variables", () => {
            const code = "/* global foo */\n/* global bar, baz */";
            let ok = false;

            linter.defineRules({
                test(context) {
                    return {
                        Program() {
                            const scope = context.getScope();
                            const sourceCode = context.getSourceCode();
                            const comments = sourceCode.getAllComments();

                            assert.strictEqual(2, comments.length);

                            const foo = getVariable(scope, "foo");

                            assert.strictEqual(true, foo.eslintExplicitGlobal);
                            assert.strictEqual(comments[0], foo.eslintExplicitGlobalComment);

                            const bar = getVariable(scope, "bar");

                            assert.strictEqual(true, bar.eslintExplicitGlobal);
                            assert.strictEqual(comments[1], bar.eslintExplicitGlobalComment);

                            const baz = getVariable(scope, "baz");

                            assert.strictEqual(true, baz.eslintExplicitGlobal);
                            assert.strictEqual(comments[1], baz.eslintExplicitGlobalComment);

                            ok = true;
                        }
                    };
                }
            });

            linter.verify(code, { rules: { test: 2 } });
            assert(ok);
        });

        it("should not crash when we reuse the SourceCode object", () => {
            linter.verify("function render() { return <div className='test'>{hello}</div> }", { parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } } });
            linter.verify(linter.getSourceCode(), { parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } } });
        });

        it("should reuse the SourceCode object", () => {
            let ast1 = null,
                ast2 = null;

            linter.defineRule("save-ast1", () => ({
                Program(node) {
                    ast1 = node;
                }
            }));
            linter.defineRule("save-ast2", () => ({
                Program(node) {
                    ast2 = node;
                }
            }));

            linter.verify("function render() { return <div className='test'>{hello}</div> }", { parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } }, rules: { "save-ast1": 2 } });
            linter.verify(linter.getSourceCode(), { parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } }, rules: { "save-ast2": 2 } });

            assert(ast1 !== null);
            assert(ast2 !== null);
            assert(ast1 === ast2);
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
            linter.verify("var", config);
        });

        it("should pass 'id' to rule contexts with the rule id", () => {
            const spy = sandbox.spy(context => {
                assert.strictEqual(context.id, "foo-bar-baz");
                return {};
            });

            linter.defineRule("foo-bar-baz", spy);
            linter.verify("x", { rules: { "foo-bar-baz": "error" } });
            assert(spy.calledOnce);
        });

        it("should parse ES2018 code for backward compatibility if 'parserOptions.ecmaFeatures.experimentalObjectRestSpread' is given.", () => {
            const messages = linter.verify(
                "async function* f() { let {a, ...rest} = { a, ...obj }; }",
                { parserOptions: { ecmaFeatures: { experimentalObjectRestSpread: true } } }
            );

            assert(messages.length === 0);
        });
    });

    describe("context.getScope()", () => {

        /**
         * Get the scope on the node `astSelector` specified.
         * @param {string} code The source code to verify.
         * @param {string} astSelector The AST selector to get scope.
         * @param {number} [ecmaVersion=5] The ECMAScript version.
         * @returns {{node: ASTNode, scope: escope.Scope}} Gotten scope.
         */
        function getScope(code, astSelector, ecmaVersion = 5) {
            let node, scope;

            linter.defineRule("get-scope", context => ({
                [astSelector](node0) {
                    node = node0;
                    scope = context.getScope();
                }
            }));
            linter.verify(
                code,
                {
                    parserOptions: { ecmaVersion },
                    rules: { "get-scope": 2 }
                }
            );

            return { node, scope };
        }

        it("should return 'function' scope on FunctionDeclaration (ES5)", () => {
            const { node, scope } = getScope("function f() {}", "FunctionDeclaration");

            assert.strictEqual(scope.type, "function");
            assert.strictEqual(scope.block, node);
        });

        it("should return 'function' scope on FunctionExpression (ES5)", () => {
            const { node, scope } = getScope("!function f() {}", "FunctionExpression");

            assert.strictEqual(scope.type, "function");
            assert.strictEqual(scope.block, node);
        });

        it("should return 'function' scope on the body of FunctionDeclaration (ES5)", () => {
            const { node, scope } = getScope("function f() {}", "BlockStatement");

            assert.strictEqual(scope.type, "function");
            assert.strictEqual(scope.block, node.parent);
        });

        it("should return 'function' scope on the body of FunctionDeclaration (ES2015)", () => {
            const { node, scope } = getScope("function f() {}", "BlockStatement", 2015);

            assert.strictEqual(scope.type, "function");
            assert.strictEqual(scope.block, node.parent);
        });

        it("should return 'function' scope on BlockStatement in functions (ES5)", () => {
            const { node, scope } = getScope("function f() { { var b; } }", "BlockStatement > BlockStatement");

            assert.strictEqual(scope.type, "function");
            assert.strictEqual(scope.block, node.parent.parent);
            assert.deepStrictEqual(scope.variables.map(v => v.name), ["arguments", "b"]);
        });

        it("should return 'block' scope on BlockStatement in functions (ES2015)", () => {
            const { node, scope } = getScope("function f() { { let a; var b; } }", "BlockStatement > BlockStatement", 2015);

            assert.strictEqual(scope.type, "block");
            assert.strictEqual(scope.upper.type, "function");
            assert.strictEqual(scope.block, node);
            assert.deepStrictEqual(scope.variables.map(v => v.name), ["a"]);
            assert.deepStrictEqual(scope.variableScope.variables.map(v => v.name), ["arguments", "b"]);
        });

        it("should return 'block' scope on nested BlockStatement in functions (ES2015)", () => {
            const { node, scope } = getScope("function f() { { let a; { let b; var c; } } }", "BlockStatement > BlockStatement > BlockStatement", 2015);

            assert.strictEqual(scope.type, "block");
            assert.strictEqual(scope.upper.type, "block");
            assert.strictEqual(scope.upper.upper.type, "function");
            assert.strictEqual(scope.block, node);
            assert.deepStrictEqual(scope.variables.map(v => v.name), ["b"]);
            assert.deepStrictEqual(scope.upper.variables.map(v => v.name), ["a"]);
            assert.deepStrictEqual(scope.variableScope.variables.map(v => v.name), ["arguments", "c"]);
        });

        it("should return 'function' scope on SwitchStatement in functions (ES5)", () => {
            const { node, scope } = getScope("function f() { switch (a) { case 0: var b; } }", "SwitchStatement");

            assert.strictEqual(scope.type, "function");
            assert.strictEqual(scope.block, node.parent.parent);
            assert.deepStrictEqual(scope.variables.map(v => v.name), ["arguments", "b"]);
        });

        it("should return 'switch' scope on SwitchStatement in functions (ES2015)", () => {
            const { node, scope } = getScope("function f() { switch (a) { case 0: let b; } }", "SwitchStatement", 2015);

            assert.strictEqual(scope.type, "switch");
            assert.strictEqual(scope.block, node);
            assert.deepStrictEqual(scope.variables.map(v => v.name), ["b"]);
        });

        it("should return 'function' scope on SwitchCase in functions (ES5)", () => {
            const { node, scope } = getScope("function f() { switch (a) { case 0: var b; } }", "SwitchCase");

            assert.strictEqual(scope.type, "function");
            assert.strictEqual(scope.block, node.parent.parent.parent);
            assert.deepStrictEqual(scope.variables.map(v => v.name), ["arguments", "b"]);
        });

        it("should return 'switch' scope on SwitchCase in functions (ES2015)", () => {
            const { node, scope } = getScope("function f() { switch (a) { case 0: let b; } }", "SwitchCase", 2015);

            assert.strictEqual(scope.type, "switch");
            assert.strictEqual(scope.block, node.parent);
            assert.deepStrictEqual(scope.variables.map(v => v.name), ["b"]);
        });

        it("should return 'catch' scope on CatchClause in functions (ES5)", () => {
            const { node, scope } = getScope("function f() { try {} catch (e) { var a; } }", "CatchClause");

            assert.strictEqual(scope.type, "catch");
            assert.strictEqual(scope.block, node);
            assert.deepStrictEqual(scope.variables.map(v => v.name), ["e"]);
        });

        it("should return 'catch' scope on CatchClause in functions (ES2015)", () => {
            const { node, scope } = getScope("function f() { try {} catch (e) { let a; } }", "CatchClause", 2015);

            assert.strictEqual(scope.type, "catch");
            assert.strictEqual(scope.block, node);
            assert.deepStrictEqual(scope.variables.map(v => v.name), ["e"]);
        });

        it("should return 'catch' scope on the block of CatchClause in functions (ES5)", () => {
            const { node, scope } = getScope("function f() { try {} catch (e) { var a; } }", "CatchClause > BlockStatement");

            assert.strictEqual(scope.type, "catch");
            assert.strictEqual(scope.block, node.parent);
            assert.deepStrictEqual(scope.variables.map(v => v.name), ["e"]);
        });

        it("should return 'block' scope on the block of CatchClause in functions (ES2015)", () => {
            const { node, scope } = getScope("function f() { try {} catch (e) { let a; } }", "CatchClause > BlockStatement", 2015);

            assert.strictEqual(scope.type, "block");
            assert.strictEqual(scope.block, node);
            assert.deepStrictEqual(scope.variables.map(v => v.name), ["a"]);
        });

        it("should return 'function' scope on ForStatement in functions (ES5)", () => {
            const { node, scope } = getScope("function f() { for (var i = 0; i < 10; ++i) {} }", "ForStatement");

            assert.strictEqual(scope.type, "function");
            assert.strictEqual(scope.block, node.parent.parent);
            assert.deepStrictEqual(scope.variables.map(v => v.name), ["arguments", "i"]);
        });

        it("should return 'for' scope on ForStatement in functions (ES2015)", () => {
            const { node, scope } = getScope("function f() { for (let i = 0; i < 10; ++i) {} }", "ForStatement", 2015);

            assert.strictEqual(scope.type, "for");
            assert.strictEqual(scope.block, node);
            assert.deepStrictEqual(scope.variables.map(v => v.name), ["i"]);
        });

        it("should return 'function' scope on the block body of ForStatement in functions (ES5)", () => {
            const { node, scope } = getScope("function f() { for (var i = 0; i < 10; ++i) {} }", "ForStatement > BlockStatement");

            assert.strictEqual(scope.type, "function");
            assert.strictEqual(scope.block, node.parent.parent.parent);
            assert.deepStrictEqual(scope.variables.map(v => v.name), ["arguments", "i"]);
        });

        it("should return 'block' scope on the block body of ForStatement in functions (ES2015)", () => {
            const { node, scope } = getScope("function f() { for (let i = 0; i < 10; ++i) {} }", "ForStatement > BlockStatement", 2015);

            assert.strictEqual(scope.type, "block");
            assert.strictEqual(scope.upper.type, "for");
            assert.strictEqual(scope.block, node);
            assert.deepStrictEqual(scope.variables.map(v => v.name), []);
            assert.deepStrictEqual(scope.upper.variables.map(v => v.name), ["i"]);
        });

        it("should return 'function' scope on ForInStatement in functions (ES5)", () => {
            const { node, scope } = getScope("function f() { for (var key in obj) {} }", "ForInStatement");

            assert.strictEqual(scope.type, "function");
            assert.strictEqual(scope.block, node.parent.parent);
            assert.deepStrictEqual(scope.variables.map(v => v.name), ["arguments", "key"]);
        });

        it("should return 'for' scope on ForInStatement in functions (ES2015)", () => {
            const { node, scope } = getScope("function f() { for (let key in obj) {} }", "ForInStatement", 2015);

            assert.strictEqual(scope.type, "for");
            assert.strictEqual(scope.block, node);
            assert.deepStrictEqual(scope.variables.map(v => v.name), ["key"]);
        });

        it("should return 'function' scope on the block body of ForInStatement in functions (ES5)", () => {
            const { node, scope } = getScope("function f() { for (var key in obj) {} }", "ForInStatement > BlockStatement");

            assert.strictEqual(scope.type, "function");
            assert.strictEqual(scope.block, node.parent.parent.parent);
            assert.deepStrictEqual(scope.variables.map(v => v.name), ["arguments", "key"]);
        });

        it("should return 'block' scope on the block body of ForInStatement in functions (ES2015)", () => {
            const { node, scope } = getScope("function f() { for (let key in obj) {} }", "ForInStatement > BlockStatement", 2015);

            assert.strictEqual(scope.type, "block");
            assert.strictEqual(scope.upper.type, "for");
            assert.strictEqual(scope.block, node);
            assert.deepStrictEqual(scope.variables.map(v => v.name), []);
            assert.deepStrictEqual(scope.upper.variables.map(v => v.name), ["key"]);
        });

        it("should return 'for' scope on ForOfStatement in functions (ES2015)", () => {
            const { node, scope } = getScope("function f() { for (let x of xs) {} }", "ForOfStatement", 2015);

            assert.strictEqual(scope.type, "for");
            assert.strictEqual(scope.block, node);
            assert.deepStrictEqual(scope.variables.map(v => v.name), ["x"]);
        });

        it("should return 'block' scope on the block body of ForOfStatement in functions (ES2015)", () => {
            const { node, scope } = getScope("function f() { for (let x of xs) {} }", "ForOfStatement > BlockStatement", 2015);

            assert.strictEqual(scope.type, "block");
            assert.strictEqual(scope.upper.type, "for");
            assert.strictEqual(scope.block, node);
            assert.deepStrictEqual(scope.variables.map(v => v.name), []);
            assert.deepStrictEqual(scope.upper.variables.map(v => v.name), ["x"]);
        });

        it("should shadow the same name variable by the iteration variable.", () => {
            const { node, scope } = getScope("let x; for (let x of x) {}", "ForOfStatement", 2015);

            assert.strictEqual(scope.type, "for");
            assert.strictEqual(scope.upper.type, "global");
            assert.strictEqual(scope.block, node);
            assert.strictEqual(scope.upper.variables[0].references.length, 0);
            assert.strictEqual(scope.references[0].identifier, node.left.declarations[0].id);
            assert.strictEqual(scope.references[1].identifier, node.right);
            assert.strictEqual(scope.references[1].resolved, scope.variables[0]);
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

            linter.defineRules({
                test(context) {
                    return {
                        Program() {
                            scope = context.getScope();
                            ok = true;
                        }
                    };
                }
            });
            linter.verify(code, { rules: { test: 2 }, globals: { e: true, f: false } });
            assert(ok);
        });

        afterEach(() => {
            scope = null;
        });

        it("Scope#through should contain references of undefined variables", () => {
            assert.strictEqual(scope.through.length, 2);
            assert.strictEqual(scope.through[0].identifier.name, "a");
            assert.strictEqual(scope.through[0].identifier.loc.start.line, 1);
            assert.strictEqual(scope.through[0].resolved, null);
            assert.strictEqual(scope.through[1].identifier.name, "b");
            assert.strictEqual(scope.through[1].identifier.loc.start.line, 2);
            assert.strictEqual(scope.through[1].resolved, null);
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
            assert.strictEqual(scope.set.get("Object").references.length, 1);
            assert.strictEqual(scope.set.get("Object").references[0].identifier.name, "Object");
            assert.strictEqual(scope.set.get("Object").references[0].identifier.loc.start.line, 3);
            assert.strictEqual(scope.set.get("Object").references[0].resolved, scope.set.get("Object"));
            assert.strictEqual(scope.set.get("foo").references.length, 1);
            assert.strictEqual(scope.set.get("foo").references[0].identifier.name, "foo");
            assert.strictEqual(scope.set.get("foo").references[0].identifier.loc.start.line, 4);
            assert.strictEqual(scope.set.get("foo").references[0].resolved, scope.set.get("foo"));
            assert.strictEqual(scope.set.get("c").references.length, 1);
            assert.strictEqual(scope.set.get("c").references[0].identifier.name, "c");
            assert.strictEqual(scope.set.get("c").references[0].identifier.loc.start.line, 6);
            assert.strictEqual(scope.set.get("c").references[0].resolved, scope.set.get("c"));
            assert.strictEqual(scope.set.get("d").references.length, 1);
            assert.strictEqual(scope.set.get("d").references[0].identifier.name, "d");
            assert.strictEqual(scope.set.get("d").references[0].identifier.loc.start.line, 8);
            assert.strictEqual(scope.set.get("d").references[0].resolved, scope.set.get("d"));
            assert.strictEqual(scope.set.get("e").references.length, 1);
            assert.strictEqual(scope.set.get("e").references[0].identifier.name, "e");
            assert.strictEqual(scope.set.get("e").references[0].identifier.loc.start.line, 9);
            assert.strictEqual(scope.set.get("e").references[0].resolved, scope.set.get("e"));
            assert.strictEqual(scope.set.get("f").references.length, 1);
            assert.strictEqual(scope.set.get("f").references[0].identifier.name, "f");
            assert.strictEqual(scope.set.get("f").references[0].identifier.loc.start.line, 10);
            assert.strictEqual(scope.set.get("f").references[0].resolved, scope.set.get("f"));
        });

        it("Reference#resolved should be their variable", () => {
            assert.strictEqual(scope.set.get("Object").references[0].resolved, scope.set.get("Object"));
            assert.strictEqual(scope.set.get("foo").references[0].resolved, scope.set.get("foo"));
            assert.strictEqual(scope.set.get("c").references[0].resolved, scope.set.get("c"));
            assert.strictEqual(scope.set.get("d").references[0].resolved, scope.set.get("d"));
            assert.strictEqual(scope.set.get("e").references[0].resolved, scope.set.get("e"));
            assert.strictEqual(scope.set.get("f").references[0].resolved, scope.set.get("f"));
        });
    });

    describe("context.getDeclaredVariables(node)", () => {

        /**
         * Assert `context.getDeclaredVariables(node)` is valid.
         * @param {string} code - A code to check.
         * @param {string} type - A type string of ASTNode. This method checks variables on the node of the type.
         * @param {Array<Array<string>>} expectedNamesList - An array of expected variable names. The expected variable names is an array of string.
         * @returns {void}
         */
        function verify(code, type, expectedNamesList) {
            linter.defineRules({
                test(context) {

                    /**
                     * Assert `context.getDeclaredVariables(node)` is empty.
                     * @param {ASTNode} node - A node to check.
                     * @returns {void}
                     */
                    function checkEmpty(node) {
                        assert.strictEqual(0, context.getDeclaredVariables(node).length);
                    }
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
                        assert.strictEqual(expectedNames.length, variables.length);
                        for (let i = variables.length - 1; i >= 0; i--) {
                            assert.strictEqual(expectedNames[i], variables[i].name);
                        }
                    };
                    return rule;
                }
            });
            linter.verify(code, {
                rules: { test: 2 },
                parserOptions: {
                    ecmaVersion: 6,
                    sourceType: "module"
                }
            });

            // Check all expected names are asserted.
            assert.strictEqual(0, expectedNamesList.length);
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

    describe("processors", () => {
        beforeEach(() => {

            // A rule that always reports the AST with a message equal to the source text
            linter.defineRule("report-original-text", context => ({
                Program(ast) {
                    context.report({ node: ast, message: context.getSourceCode().text });
                }
            }));
        });

        describe("preprocessors", () => {
            it("should apply a preprocessor to the code, and lint each code sample separately", () => {
                const code = "foo bar baz";
                const problems = linter.verify(
                    code,
                    { rules: { "report-original-text": "error" } },
                    {

                        // Apply a preprocessor that splits the source text into spaces and lints each word individually
                        preprocess(input) {
                            assert.strictEqual(input, code);
                            assert.strictEqual(arguments.length, 1);
                            return input.split(" ");
                        }
                    }
                );

                assert.strictEqual(problems.length, 3);
                assert.deepStrictEqual(problems.map(problem => problem.message), ["foo", "bar", "baz"]);
            });
        });

        describe("postprocessors", () => {
            it("should apply a postprocessor to the reported messages", () => {
                const code = "foo bar baz";

                const problems = linter.verify(
                    code,
                    { rules: { "report-original-text": "error" } },
                    {
                        preprocess: input => input.split(" "),

                        /*
                         * Apply a postprocessor that updates the locations of the reported problems
                         * to make sure they correspond to the locations in the original text.
                         */
                        postprocess(problemLists) {
                            assert.strictEqual(problemLists.length, 3);
                            assert.strictEqual(arguments.length, 1);

                            problemLists.forEach(problemList => assert.strictEqual(problemList.length, 1));
                            return problemLists.reduce(
                                (combinedList, problemList, index) =>
                                    combinedList.concat(
                                        problemList.map(
                                            problem =>
                                                Object.assign(
                                                    {},
                                                    problem,
                                                    {
                                                        message: problem.message.toUpperCase(),
                                                        column: problem.column + index * 4
                                                    }
                                                )
                                        )
                                    ),
                                []
                            );
                        }
                    }
                );

                assert.strictEqual(problems.length, 3);
                assert.deepStrictEqual(problems.map(problem => problem.message), ["FOO", "BAR", "BAZ"]);
                assert.deepStrictEqual(problems.map(problem => problem.column), [1, 5, 9]);
            });

            it("should use postprocessed problem ranges when applying autofixes", () => {
                const code = "foo bar baz";

                linter.defineRule("capitalize-identifiers", context => ({
                    Identifier(node) {
                        if (node.name !== node.name.toUpperCase()) {
                            context.report({
                                node,
                                message: "Capitalize this identifier",
                                fix: fixer => fixer.replaceText(node, node.name.toUpperCase())
                            });
                        }
                    }
                }));

                const fixResult = linter.verifyAndFix(
                    code,
                    { rules: { "capitalize-identifiers": "error" } },
                    {

                        /*
                         * Apply a postprocessor that updates the locations of autofixes
                         * to make sure they correspond to locations in the original text.
                         */
                        preprocess: input => input.split(" "),
                        postprocess(problemLists) {
                            return problemLists.reduce(
                                (combinedProblems, problemList, blockIndex) =>
                                    combinedProblems.concat(
                                        problemList.map(problem =>
                                            Object.assign(problem, {
                                                fix: {
                                                    text: problem.fix.text,
                                                    range: problem.fix.range.map(
                                                        rangeIndex => rangeIndex + blockIndex * 4
                                                    )
                                                }
                                            }))
                                    ),
                                []
                            );
                        }
                    }
                );

                assert.strictEqual(fixResult.fixed, true);
                assert.strictEqual(fixResult.messages.length, 0);
                assert.strictEqual(fixResult.output, "FOO BAR BAZ");
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

            assert.strictEqual(messages.output, "var a;", "Fixes were applied correctly");
            assert.isTrue(messages.fixed);
        });

        it("does not require a third argument", () => {
            const fixResult = linter.verifyAndFix("var a", {
                rules: {
                    semi: 2
                }
            });

            assert.deepStrictEqual(fixResult, {
                fixed: true,
                messages: [],
                output: "var a;"
            });
        });

        it("does not apply autofixes when fix argument is `false`", () => {
            const fixResult = linter.verifyAndFix("var a", {
                rules: {
                    semi: 2
                }
            }, { fix: false });

            assert.strictEqual(fixResult.fixed, false);
        });

        it("stops fixing after 10 passes", () => {
            linter.defineRule("add-spaces", context => ({
                Program(node) {
                    context.report({
                        node,
                        message: "Add a space before this node.",
                        fix: fixer => fixer.insertTextBefore(node, " ")
                    });
                }
            }));

            const fixResult = linter.verifyAndFix("a", { rules: { "add-spaces": "error" } });

            assert.strictEqual(fixResult.fixed, true);
            assert.strictEqual(fixResult.output, `${" ".repeat(10)}a`);
            assert.strictEqual(fixResult.messages.length, 1);
        });

        it("should throw an error if fix is passed but meta has no `fixable` property", () => {
            linter.defineRule("test-rule", {
                meta: {
                    docs: {},
                    schema: []
                },
                create: context => ({
                    Program(node) {
                        context.report(node, "hello world", {}, () => ({ range: [1, 1], text: "" }));
                    }
                })
            });

            assert.throws(() => {
                linter.verify("0", { rules: { "test-rule": "error" } });
            }, /Fixable rules should export a `meta\.fixable` property.\nOccurred while linting <input>:1$/u);
        });

        it("should not throw an error if fix is passed and there is no metadata", () => {
            linter.defineRule("test-rule", {
                create: context => ({
                    Program(node) {
                        context.report(node, "hello world", {}, () => ({ range: [1, 1], text: "" }));
                    }
                })
            });

            linter.verify("0", { rules: { "test-rule": "error" } });
        });
    });

    describe("Edge cases", () => {

        it("should properly parse import statements when sourceType is module", () => {
            const code = "import foo from 'foo';";
            const messages = linter.verify(code, { parserOptions: { sourceType: "module" } });

            assert.strictEqual(messages.length, 0);
        });

        it("should properly parse import all statements when sourceType is module", () => {
            const code = "import * as foo from 'foo';";
            const messages = linter.verify(code, { parserOptions: { sourceType: "module" } });

            assert.strictEqual(messages.length, 0);
        });

        it("should properly parse default export statements when sourceType is module", () => {
            const code = "export default function initialize() {}";
            const messages = linter.verify(code, { parserOptions: { sourceType: "module" } });

            assert.strictEqual(messages.length, 0);
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

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].fatal, true);
        });

        it("should not rewrite env setting in core (https://github.com/eslint/eslint/issues/4814)", () => {

            /*
             * This test focuses on the instance of https://github.com/eslint/eslint/blob/v2.0.0-alpha-2/conf/environments.js#L26-L28
             * This `verify()` takes the instance and runs https://github.com/eslint/eslint/blob/v2.0.0-alpha-2/lib/eslint.js#L416
             */
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
        const escope = require("eslint-scope");
        const vk = require("eslint-visitor-keys");

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
                const messages = linter.verify(code, { parser: "esprima", parserOptions: { jsx: true } }, "filename");

                assert.strictEqual(messages.length, 0);
            });

            it("should return an error when the custom parser can't be found", () => {
                const code = "var myDivElement = <div {...this.props} />;";
                const messages = linter.verify(code, { parser: "esprima-xyz" }, "filename");

                assert.strictEqual(messages.length, 1);
                assert.strictEqual(messages[0].severity, 2);
                assert.strictEqual(messages[0].message, "Cannot find module 'esprima-xyz'");
            });

            it("should not throw or report errors when the custom parser returns unrecognized operators (https://github.com/eslint/eslint/issues/10475)", () => {
                const code = "null %% 'foo'";
                const parser = path.join(parserFixtures, "unknown-operators", "unknown-logical-operator.js");

                // This shouldn't throw
                const messages = linter.verify(code, { parser }, filename, true);

                assert.strictEqual(messages.length, 0);
            });

            it("should not throw or report errors when the custom parser returns nested unrecognized operators (https://github.com/eslint/eslint/issues/10560)", () => {
                const code = "foo && bar %% baz";
                const parser = path.join(parserFixtures, "unknown-operators", "unknown-logical-operator-nested.js");

                // This shouldn't throw
                const messages = linter.verify(code, { parser }, filename, true);

                assert.strictEqual(messages.length, 0);
            });

            it("should strip leading line: prefix from parser error", () => {
                const parser = path.join(parserFixtures, "line-error.js");
                const messages = linter.verify(";", { parser }, "filename");

                assert.strictEqual(messages.length, 1);
                assert.strictEqual(messages[0].severity, 2);
                assert.strictEqual(messages[0].message, errorPrefix + require(parser).expectedError);
            });

            it("should not modify a parser error message without a leading line: prefix", () => {
                const parser = path.join(parserFixtures, "no-line-error.js");
                const messages = linter.verify(";", { parser }, "filename");

                assert.strictEqual(messages.length, 1);
                assert.strictEqual(messages[0].severity, 2);
                assert.strictEqual(messages[0].message, errorPrefix + require(parser).expectedError);
            });

            describe("if a parser provides 'visitorKeys'", () => {
                let types = [];
                let scopeAnalyzeStub = null;
                let sourceCode = null;

                beforeEach(() => {
                    scopeAnalyzeStub = sandbox.spy(escope, "analyze");

                    const parser = path.join(parserFixtures, "enhanced-parser2.js");

                    types = [];
                    linter.defineRule("collect-node-types", () => ({
                        "*"(node) {
                            types.push(node.type);
                        }
                    }));
                    linter.verify("@foo class A {}", {
                        parser,
                        rules: {
                            "collect-node-types": "error"
                        }
                    });

                    sourceCode = linter.getSourceCode();
                });

                it("Traverser should use the visitorKeys (so 'types' includes 'Decorator')", () => {
                    assert.deepStrictEqual(
                        types,
                        ["Program", "ClassDeclaration", "Decorator", "Identifier", "Identifier", "ClassBody"]
                    );
                });

                it("eslint-scope should use the visitorKeys (so 'childVisitorKeys.ClassDeclaration' includes 'experimentalDecorators')", () => {
                    assert(scopeAnalyzeStub.calledOnce);
                    assert.deepStrictEqual(
                        scopeAnalyzeStub.firstCall.args[1].childVisitorKeys.ClassDeclaration,
                        vk.unionWith({ ClassDeclaration: ["experimentalDecorators"] }).ClassDeclaration
                    );
                });

                it("should use the same visitorKeys if the source code object is reused", () => {
                    const types2 = [];

                    linter.defineRule("collect-node-types", () => ({
                        "*"(node) {
                            types2.push(node.type);
                        }
                    }));
                    linter.verify(sourceCode, {
                        rules: {
                            "collect-node-types": "error"
                        }
                    });

                    assert.deepStrictEqual(
                        types2,
                        ["Program", "ClassDeclaration", "Decorator", "Identifier", "Identifier", "ClassBody"]
                    );
                });
            });

            describe("if a parser provides 'scope'", () => {
                let scopeAnalyzeStub = null;
                let scope = null;
                let sourceCode = null;

                beforeEach(() => {
                    scopeAnalyzeStub = sandbox.spy(escope, "analyze");

                    const parser = path.join(parserFixtures, "enhanced-parser3.js");

                    linter.defineRule("save-scope1", context => ({
                        Program() {
                            scope = context.getScope();
                        }
                    }));
                    linter.verify("@foo class A {}", { parser, rules: { "save-scope1": 2 } });

                    sourceCode = linter.getSourceCode();
                });

                it("should not use eslint-scope analyzer", () => {
                    assert(scopeAnalyzeStub.notCalled);
                });

                it("should use the scope (so the global scope has the reference of '@foo')", () => {
                    assert.strictEqual(scope.references.length, 1);
                    assert.deepStrictEqual(
                        scope.references[0].identifier.name,
                        "foo"
                    );
                });

                it("should use the same scope if the source code object is reused", () => {
                    let scope2 = null;

                    linter.defineRule("save-scope2", context => ({
                        Program() {
                            scope2 = context.getScope();
                        }
                    }));
                    linter.verify(sourceCode, { rules: { "save-scope2": 2 } }, "test.js");

                    assert(scope2 !== null);
                    assert(scope2 === scope);
                });
            });

            it("should not pass any default parserOptions to the parser", () => {
                const parser = path.join(parserFixtures, "throws-with-options.js");

                const messages = linter.verify(";", { parser }, "filename");

                assert.strictEqual(messages.length, 0);
            });
        });
    }
});
