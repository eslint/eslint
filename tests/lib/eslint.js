/**
 * @fileoverview Tests for eslint object.
 * @author Nicholas C. Zakas
 * @copyright 2013 Nicholas C. Zakas. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
/* globals window */

"use strict";

//------------------------------------------------------------------------------
// Helper
//------------------------------------------------------------------------------

/**
 * To make sure this works in both browsers and Node.js
 * @param {string} name Name of the module to require
 * @param {object} windowName name of the window
 * @returns {object} Required object
 * @private
 */
function compatRequire(name, windowName) {
    if (typeof window === "object") {
        return window[windowName || name];
    } else if (typeof require === "function") {
        return require(name);
    } else {
        throw new Error("Cannot find object '" + name + "'.");
    }
}

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = compatRequire("chai").assert,
    sinon = compatRequire("sinon"),
    path = compatRequire("path"),
    eslint = compatRequire("../../lib/eslint", "eslint");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var TEST_CODE = "var answer = 6 * 7;",
    BROKEN_TEST_CODE = "var;";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Get variables in the current escope
 * @param {object} scope current scope
 * @param {string} name name of the variable to look for
 * @returns {ASTNode} The variable object
 * @private
 */
function getVariable(scope, name) {
    var variable = null;
    scope.variables.some(function(v) {
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

describe("eslint", function() {
    var filename = "filename.js",
        sandbox;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
        eslint.reset();
        sandbox.verifyAndRestore();
    });

    describe("when using events", function() {
        var code = TEST_CODE;

        it("an error should be thrown when an error occurs inside of an event handler", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                throw new Error("Intentional error.");
            });

            assert.throws(function() {
                eslint.verify(code, config, filename, true);
            }, Error);
        });
    });

    describe("getSourceLines()", function() {

        it("should get proper lines when using \\n as a line break", function() {
            var code = "a;\nb;";
            eslint.verify(code, {}, filename, true);

            var lines = eslint.getSourceLines();
            assert.equal(lines[0], "a;");
            assert.equal(lines[1], "b;");
        });

        it("should get proper lines when using \\r\\n as a line break", function() {
            var code = "a;\r\nb;";
            eslint.verify(code, {}, filename, true);

            var lines = eslint.getSourceLines();
            assert.equal(lines[0], "a;");
            assert.equal(lines[1], "b;");
        });

        it("should get proper lines when using \\r as a line break", function() {
            var code = "a;\rb;";
            eslint.verify(code, {}, filename, true);

            var lines = eslint.getSourceLines();
            assert.equal(lines[0], "a;");
            assert.equal(lines[1], "b;");
        });

        it("should get proper lines when using \\u2028 as a line break", function() {
            var code = "a;\u2028b;";
            eslint.verify(code, {}, filename, true);

            var lines = eslint.getSourceLines();
            assert.equal(lines[0], "a;");
            assert.equal(lines[1], "b;");
        });

        it("should get proper lines when using \\u2029 as a line break", function() {
            var code = "a;\u2029b;";
            eslint.verify(code, {}, filename, true);

            var lines = eslint.getSourceLines();
            assert.equal(lines[0], "a;");
            assert.equal(lines[1], "b;");
        });


    });

    describe("getSourceCode()", function() {
        var code = TEST_CODE;

        it("should retrieve SourceCode object after reset", function() {
            eslint.reset();
            eslint.verify(code, {}, filename, true);

            var sourceCode = eslint.getSourceCode();
            assert.isObject(sourceCode);
            assert.equal(sourceCode.text, code);
            assert.isObject(sourceCode.ast);
        });

        it("should retrieve SourceCode object without reset", function() {
            eslint.reset();
            eslint.verify(code, {}, filename);

            var sourceCode = eslint.getSourceCode();
            assert.isObject(sourceCode);
            assert.equal(sourceCode.text, code);
            assert.isObject(sourceCode.ast);
        });

    });

    describe("getSource()", function() {
        var code = TEST_CODE;

        it("should retrieve all text when used without parameters", function() {
            /**
             * Callback handler
             * @returns {void}
             */
            function handler() {
                var source = eslint.getSource();
                assert.equal(source, TEST_CODE);
            }

            var config = { rules: {} },
                spy = sandbox.spy(handler);

            eslint.reset();
            eslint.on("Program", spy);

            eslint.verify(code, config, filename, true);
            assert(spy.calledOnce);
        });

        it("should retrieve all text for root node", function() {
            /**
             * Callback handler
             * @param {ASTNode} node node to examine
             * @returns {void}
             */
            function handler(node) {
                var source = eslint.getSource(node);
                assert.equal(source, TEST_CODE);
            }

            var config = { rules: {} },
                spy = sandbox.spy(handler);

            eslint.reset();
            eslint.on("Program", spy);

            eslint.verify(code, config, filename, true);
            assert(spy.calledOnce);
        });

        it("should clamp to valid range when retrieving characters before start of source", function() {
            /**
             * Callback handler
             * @param {ASTNode} node node to examine
             * @returns {void}
             */
            function handler(node) {
                var source = eslint.getSource(node, 2, 0);
                assert.equal(source, TEST_CODE);
            }

            var config = { rules: {} },
                spy = sandbox.spy(handler);

            eslint.reset();
            eslint.on("Program", spy);

            eslint.verify(code, config, filename, true);
            assert(spy.calledOnce);
        });

        it("should retrieve all text for binary expression", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var source = eslint.getSource(node);
                assert.equal(source, "6 * 7");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve all text plus two characters before for binary expression", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var source = eslint.getSource(node, 2);
                assert.equal(source, "= 6 * 7");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve all text plus one character after for binary expression", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var source = eslint.getSource(node, 0, 1);
                assert.equal(source, "6 * 7;");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve all text plus two characters before and one character after for binary expression", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function(node) {
                var source = eslint.getSource(node, 2, 1);
                assert.equal(source, "= 6 * 7;");
            });

            eslint.verify(code, config, filename, true);
        });

    });

    describe("when calling getAncestors", function() {
        var code = TEST_CODE;

        it("should retrieve all ancestors when used", function() {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("BinaryExpression", function() {
                var ancestors = eslint.getAncestors();
                assert.equal(ancestors.length, 3);
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve empty ancestors for root node", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var ancestors = eslint.getAncestors();
                assert.equal(ancestors.length, 0);
            });

            eslint.verify(code, config, filename, true);
        });
    });

    describe("when calling getNodeByRangeIndex", function() {
        var code = TEST_CODE;

        it("should retrieve a node starting at the given index", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var node = eslint.getNodeByRangeIndex(4);
                assert.equal(node.type, "Identifier");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve a node containing the given index", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var node = eslint.getNodeByRangeIndex(6);
                assert.equal(node.type, "Identifier");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve a node that is exactly the given index", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var node = eslint.getNodeByRangeIndex(13);
                assert.equal(node.type, "Literal");
                assert.equal(node.value, 6);
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve a node ending with the given index", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var node = eslint.getNodeByRangeIndex(9);
                assert.equal(node.type, "Identifier");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve the deepest node containing the given index", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var node = eslint.getNodeByRangeIndex(14);
                assert.equal(node.type, "BinaryExpression");
                node = eslint.getNodeByRangeIndex(3);
                assert.equal(node.type, "VariableDeclaration");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should return null if the index is outside the range of any node", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var node = eslint.getNodeByRangeIndex(-1);
                assert.isNull(node);
                node = eslint.getNodeByRangeIndex(-99);
                assert.isNull(node);
            });

            eslint.verify(code, config, filename, true);
        });

        it("should attach the node's parent", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var node = eslint.getNodeByRangeIndex(14);
                assert.property(node, "parent");
                assert.equal(node.parent.type, "VariableDeclarator");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should not modify the node when attaching the parent", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var node = eslint.getNodeByRangeIndex(10);
                assert.equal(node.type, "VariableDeclarator");
                node = eslint.getNodeByRangeIndex(4);
                assert.equal(node.type, "Identifier");
                assert.property(node, "parent");
                assert.equal(node.parent.type, "VariableDeclarator");
                assert.notProperty(node.parent, "parent");
            });

            eslint.verify(code, config, filename, true);
        });

    });



    describe("when calling getScope", function() {
        var code = "function foo() { q: for(;;) { break q; } } function bar () { var q = t; } var baz = (() => { return 1; });";

        it("should retrieve the global scope correctly from a Program", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var scope = eslint.getScope();
                assert.equal(scope.type, "global");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve the function scope correctly from a FunctionDeclaration", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("FunctionDeclaration", function() {
                var scope = eslint.getScope();
                assert.equal(scope.type, "function");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve the function scope correctly from a LabeledStatement", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("LabeledStatement", function() {
                var scope = eslint.getScope();
                assert.equal(scope.type, "function");
                assert.equal(scope.block.id.name, "foo");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve the function scope correctly from within an ArrowFunctionExpression", function() {
            var config = { rules: {}, ecmaFeatures: { arrowFunctions: true } };

            eslint.reset();
            eslint.on("ReturnStatement", function() {
                var scope = eslint.getScope();
                assert.equal(scope.type, "function");
                assert.equal(scope.block.type, "ArrowFunctionExpression");
            });

            eslint.verify(code, config, filename, true);
        });

        it("should retrieve the function scope correctly from within an SwitchStatement", function() {
            var config = { rules: {}, parserOptions: { ecmaVersion: 6 } };

            eslint.reset();
            eslint.on("SwitchStatement", function() {
                var scope = eslint.getScope();
                assert.equal(scope.type, "switch");
                assert.equal(scope.block.type, "SwitchStatement");
            });

            eslint.verify("switch(foo){ case 'a': var b = 'foo'; }", config, filename, true);
        });

        it("should retrieve the function scope correctly from within a BlockStatement", function() {
            var config = { rules: {}, parserOptions: { ecmaVersion: 6 } };

            eslint.reset();
            eslint.on("BlockStatement", function() {
                var scope = eslint.getScope();
                assert.equal(scope.type, "block");
                assert.equal(scope.block.type, "BlockStatement");
            });

            eslint.verify("var x; {let y = 1}", config, filename, true);
        });

        it("should retrieve the function scope correctly from within a nested block statement", function() {
            var config = { rules: {}, parserOptions: { ecmaVersion: 6 } };

            eslint.reset();
            eslint.on("BlockStatement", function() {
                var scope = eslint.getScope();
                assert.equal(scope.type, "block");
                assert.equal(scope.block.type, "BlockStatement");
            });

            eslint.verify("if (true) { let x = 1 }", config, filename, true);
        });

        it("should retrieve the function scope correctly from within a FunctionDeclaration", function() {
            var config = { rules: {}, parserOptions: { ecmaVersion: 6 } };

            eslint.reset();
            eslint.on("FunctionDeclaration", function() {
                var scope = eslint.getScope();
                assert.equal(scope.type, "function");
                assert.equal(scope.block.type, "FunctionDeclaration");
            });

            eslint.verify("function foo() {}", config, filename, true);
        });

        it("should retrieve the function scope correctly from within a FunctionExpression", function() {
            var config = { rules: {}, parserOptions: { ecmaVersion: 6 } };

            eslint.reset();
            eslint.on("FunctionExpression", function() {
                var scope = eslint.getScope();
                assert.equal(scope.type, "function");
                assert.equal(scope.block.type, "FunctionExpression");
            });

            eslint.verify("(function foo() {})();", config, filename, true);
        });

        it("should retrieve the catch scope correctly from within a CatchClause", function() {
            var config = { rules: {}, parserOptions: { ecmaVersion: 6 } };

            eslint.reset();
            eslint.on("CatchClause", function() {
                var scope = eslint.getScope();
                assert.equal(scope.type, "catch");
                assert.equal(scope.block.type, "CatchClause");
            });

            eslint.verify("try {} catch (err) {}", config, filename, true);
        });

        it("should retrieve module scope correctly from an ES6 module", function() {
            var config = { rules: {}, parserOptions: { sourceType: "module" } };

            eslint.reset();
            eslint.on("AssignmentExpression", function() {
                var scope = eslint.getScope();
                assert.equal(scope.type, "module");
            });

            eslint.verify("var foo = {}; foo.bar = 1;", config, filename, true);
        });

        it("should retrieve function scope correctly when globalReturn is true", function() {
            var config = { rules: {}, parserOptions: { ecmaFeatures: { globalReturn: true } } };

            eslint.reset();
            eslint.on("AssignmentExpression", function() {
                var scope = eslint.getScope();
                assert.equal(scope.type, "function");
            });

            eslint.verify("var foo = {}; foo.bar = 1;", config, filename, true);
        });
    });

    describe("marking variables as used", function() {
        it("should mark variables in current scope as used", function() {
            var code = "var a = 1, b = 2;";

            eslint.reset();
            eslint.on("Program:exit", function() {
                var scope;

                eslint.markVariableAsUsed("a");

                scope = eslint.getScope();

                assert.isTrue(getVariable(scope, "a").eslintUsed);
                assert.notOk(getVariable(scope, "b").eslintUsed);
            });

            eslint.verify(code, {}, filename, true);
        });
        it("should mark variables in function args as used", function() {
            var code = "function abc(a, b) { return 1; }";

            eslint.reset();
            eslint.on("ReturnStatement", function() {
                var scope;

                eslint.markVariableAsUsed("a");

                scope = eslint.getScope();

                assert.isTrue(getVariable(scope, "a").eslintUsed);
                assert.notOk(getVariable(scope, "b").eslintUsed);
            });

            eslint.verify(code, {}, filename, true);
        });
        it("should mark variables in higher scopes as used", function() {
            var code = "var a, b; function abc() { return 1; }";

            eslint.reset();
            eslint.on("ReturnStatement", function() {
                eslint.markVariableAsUsed("a");
            });
            eslint.on("Program:exit", function() {
                var scope = eslint.getScope();

                assert.isTrue(getVariable(scope, "a").eslintUsed);
                assert.notOk(getVariable(scope, "b").eslintUsed);
            });

            eslint.verify(code, {}, filename, true);
        });

        it("should mark variables in Node.js environment as used", function() {
            var code = "var a = 1, b = 2;";

            eslint.reset();
            eslint.on("Program:exit", function() {
                var globalScope = eslint.getScope(),
                    childScope = globalScope.childScopes[0];

                eslint.markVariableAsUsed("a");

                assert.isTrue(getVariable(childScope, "a").eslintUsed);
                assert.isUndefined(getVariable(childScope, "b").eslintUsed);
            });

            eslint.verify(code, { env: { node: true }}, filename, true);
        });

        it("should mark variables in modules as used", function() {
            var code = "var a = 1, b = 2;";

            eslint.reset();
            eslint.on("Program:exit", function() {
                var globalScope = eslint.getScope(),
                    childScope = globalScope.childScopes[0];

                eslint.markVariableAsUsed("a");

                assert.isTrue(getVariable(childScope, "a").eslintUsed);
                assert.isUndefined(getVariable(childScope, "b").eslintUsed);
            });

            eslint.verify(code, { parserOptions: { sourceType: "module" }}, filename, true);
        });
    });

    describe("report()", function() {

        var config;
        beforeEach(function() {
            eslint.reset();
            config = { rules: {} };
        });

        it("should correctly parse a message when being passed all options", function() {
            eslint.on("Program", function(node) {
                eslint.report("test-rule", 2, node, node.loc.end, "hello {{dynamic}}", {dynamic: node.type});
            });

            var messages = eslint.verify("0", config, "", true);
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

        it("should use the report the provided location when given", function() {
            eslint.on("Program", function(node) {
                eslint.report("test-rule", 2, node, {line: 42, column: 13}, "hello world");
            });

            var messages = eslint.verify("0", config, "", true);
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

        it("should not throw an error if node is provided and location is not", function() {
            eslint.on("Program", function(node) {
                eslint.report("test-rule", 2, node, "hello world");
            });

            assert.doesNotThrow(function() {
                eslint.verify("0", config, "", true);
            });
        });

        it("should not throw an error if location is provided and node is not", function() {
            eslint.on("Program", function() {
                eslint.report("test-rule", 2, null, { line: 1, column: 1}, "hello world");
            });

            assert.doesNotThrow(function() {
                eslint.verify("0", config, "", true);
            });
        });

        it("should throw an error if neither node nor location is provided", function() {
            eslint.on("Program", function() {
                eslint.report("test-rule", 2, null, "hello world");
            });

            assert.throws(function() {
                eslint.verify("0", config, "", true);
            }, /Node must be provided when reporting error if location is not provided$/);
        });

        it("should throw an error if node is not an object", function() {
            eslint.on("Program", function() {
                eslint.report("test-rule", 2, "not a node", "hello world");
            });

            assert.throws(function() {
                eslint.verify("0", config, "", true);
            }, /Node must be an object$/);
        });

        it("should correctly parse a message with object keys as numbers", function() {
            eslint.on("Program", function(node) {
                eslint.report("test-rule", 2, node, "my message {{name}}{{0}}", {0: "!", name: "testing"});
            });

            var messages = eslint.verify("0", config, "", true);
            assert.deepEqual(messages[0], {
                severity: 2,
                ruleId: "test-rule",
                message: "my message testing!",
                nodeType: "Program",
                line: 1,
                column: 1,
                source: "0"
            });
        });

        it("should correctly parse a message with array", function() {
            eslint.on("Program", function(node) {
                eslint.report("test-rule", 2, node, "my message {{1}}{{0}}", ["!", "testing"]);
            });

            var messages = eslint.verify("0", config, "", true);
            assert.deepEqual(messages[0], {
                severity: 2,
                ruleId: "test-rule",
                message: "my message testing!",
                nodeType: "Program",
                line: 1,
                column: 1,
                source: "0"
            });
        });

        it("should include a fix passed as the last argument when location is not passed", function() {
            eslint.on("Program", function(node) {
                eslint.report("test-rule", 2, node, "my message {{1}}{{0}}", ["!", "testing"], { range: [1, 1], text: "" });
            });

            var messages = eslint.verify("0", config, "", true);
            assert.deepEqual(messages[0], {
                severity: 2,
                ruleId: "test-rule",
                message: "my message testing!",
                nodeType: "Program",
                line: 1,
                column: 1,
                source: "0",
                fix: { range: [1, 1], text: "" }
            });
        });

        it("should allow template parameter with inner whitespace", function() {
            eslint.reset();
            eslint.defineRule("test-rule", function(context) {
                return {
                    "Literal": function(node) {
                        context.report(node, "message {{parameter name}}", {
                            "parameter name": "yay!"
                        });
                    }
                };
            });

            config.rules["test-rule"] = 1;

            var messages = eslint.verify("0", config);
            assert.equal(messages[0].message, "message yay!");
        });

        it("should not crash if no template parameters are passed", function() {
            eslint.reset();
            eslint.defineRule("test-rule", function(context) {
                return {
                    "Literal": function(node) {
                        context.report(node, "message {{code}}");
                    }
                };
            });

            config.rules["test-rule"] = 1;

            var messages = eslint.verify("0", config);
            assert.equal(messages[0].message, "message {{code}}");
        });

        it("should allow template parameter with non-identifier characters", function() {
            eslint.reset();
            eslint.defineRule("test-rule", function(context) {
                return {
                    "Literal": function(node) {
                        context.report(node, "message {{parameter-name}}", {
                            "parameter-name": "yay!"
                        });
                    }
                };
            });

            config.rules["test-rule"] = 1;

            var messages = eslint.verify("0", config);
            assert.equal(messages[0].message, "message yay!");
        });

        it("should ignore template parameter with no specified value", function() {
            eslint.reset();
            eslint.defineRule("test-rule", function(context) {
                return {
                    "Literal": function(node) {
                        context.report(node, "message {{parameter}}", {});
                    }
                };
            });

            config.rules["test-rule"] = 1;

            var messages = eslint.verify("0", config);
            assert.equal(messages[0].message, "message {{parameter}}");
        });

        it("should ignore template parameter with no specified value with warn severity", function() {
            eslint.reset();
            eslint.defineRule("test-rule", function(context) {
                return {
                    "Literal": function(node) {
                        context.report(node, "message {{parameter}}", {});
                    }
                };
            });

            config.rules["test-rule"] = "warn";

            var messages = eslint.verify("0", config);
            assert.equal(messages[0].severity, 1);
            assert.equal(messages[0].message, "message {{parameter}}");
        });

        it("should handle leading whitespace in template parameter", function() {
            eslint.reset();
            eslint.defineRule("test-rule", function(context) {
                return {
                    "Literal": function(node) {
                        context.report(node, "message {{ parameter}}", {
                            parameter: "yay!"
                        });
                    }
                };
            });

            config.rules["test-rule"] = 1;

            var messages = eslint.verify("0", config);
            assert.equal(messages[0].message, "message yay!");
        });

        it("should handle trailing whitespace in template parameter", function() {
            eslint.reset();
            eslint.defineRule("test-rule", function(context) {
                return {
                    "Literal": function(node) {
                        context.report(node, "message {{parameter }}", {
                            parameter: "yay!"
                        });
                    }
                };
            });

            config.rules["test-rule"] = 1;

            var messages = eslint.verify("0", config);
            assert.equal(messages[0].message, "message yay!");
        });

        it("should still allow inner whitespace as well as leading/trailing", function() {
            eslint.reset();
            eslint.defineRule("test-rule", function(context) {
                return {
                    "Literal": function(node) {
                        context.report(node, "message {{ parameter name }}", {
                            "parameter name": "yay!"
                        });
                    }
                };
            });

            config.rules["test-rule"] = 1;

            var messages = eslint.verify("0", config);
            assert.equal(messages[0].message, "message yay!");
        });

        it("should still allow non-identifier characters as well as leading/trailing whitespace", function() {
            eslint.reset();
            eslint.defineRule("test-rule", function(context) {
                return {
                    "Literal": function(node) {
                        context.report(node, "message {{ parameter-name }}", {
                            "parameter-name": "yay!"
                        });
                    }
                };
            });

            config.rules["test-rule"] = 1;

            var messages = eslint.verify("0", config);
            assert.equal(messages[0].message, "message yay!");
        });

        it("should include a fix passed as the last argument when location is passed", function() {
            eslint.on("Program", function(node) {
                eslint.report("test-rule", 2, node, { line: 42, column: 23 }, "my message {{1}}{{0}}", ["!", "testing"], { range: [1, 1], text: "" });
            });

            var messages = eslint.verify("0", config, "", true);
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

    });

    describe("when evaluating code", function() {
        var code = TEST_CODE;

        it("events for each node type should fire", function() {
            var config = { rules: {} };

            // spies for various AST node types
            var spyLiteral = sinon.spy(),
                spyVariableDeclarator = sinon.spy(),
                spyVariableDeclaration = sinon.spy(),
                spyIdentifier = sinon.spy(),
                spyBinaryExpression = sinon.spy();

            eslint.reset();
            eslint.on("Literal", spyLiteral);
            eslint.on("VariableDeclarator", spyVariableDeclarator);
            eslint.on("VariableDeclaration", spyVariableDeclaration);
            eslint.on("Identifier", spyIdentifier);
            eslint.on("BinaryExpression", spyBinaryExpression);

            var messages = eslint.verify(code, config, filename, true);

            assert.equal(messages.length, 0);
            sinon.assert.calledOnce(spyVariableDeclaration);
            sinon.assert.calledOnce(spyVariableDeclarator);
            sinon.assert.calledOnce(spyIdentifier);
            sinon.assert.calledTwice(spyLiteral);
            sinon.assert.calledOnce(spyBinaryExpression);
        });
    });

    describe("when config has shared settings for rules", function() {
        var code = "test-rule";

        it("should pass settings to all rules", function() {
            eslint.reset();
            eslint.defineRule(code, function(context) {
                return {
                    "Literal": function(node) {
                        context.report(node, context.settings.info);
                    }
                };
            });

            var config = { rules: {}, settings: { info: "Hello" } };
            config.rules[code] = 1;

            var messages = eslint.verify("0", config, filename);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].message, "Hello");
        });

        it("should not have any settings if they were not passed in", function() {
            eslint.reset();
            eslint.defineRule(code, function(context) {
                return {
                    "Literal": function(node) {
                        if (Object.getOwnPropertyNames(context.settings).length !== 0) {
                            context.report(node, "Settings should be empty");
                        }
                    }
                };
            });

            var config = { rules: {} };
            config.rules[code] = 1;

            var messages = eslint.verify("0", config, filename);

            assert.equal(messages.length, 0);
        });
    });

    describe("when config has parseOptions", function() {

        it("should pass ecmaFeatures to all rules when provided on config", function() {

            var parserOptions = {
                ecmaFeatures: {
                    jsx: true,
                    globalReturn: true
                }
            };

            eslint.reset();
            eslint.defineRule("test-rule", sandbox.mock().withArgs(
                sinon.match({parserOptions: parserOptions})
            ).returns({}));

            var config = { rules: { "test-rule": 2 }, parserOptions: parserOptions };

            eslint.verify("0", config, filename);
        });

        it("should pass parserOptions to all rules when default parserOptions is used", function() {

            var parserOptions = {};

            eslint.reset();
            eslint.defineRule("test-rule", sandbox.mock().withArgs(
                sinon.match({parserOptions: parserOptions})
            ).returns({}));

            var config = { rules: { "test-rule": 2 } };

            eslint.verify("0", config, filename);
        });

    });

    describe("when config has parser", function() {

        // custom parser unsupported in browser, only test in Node
        if (typeof window === "undefined") {
            it("should pass parser as parserPath to all rules when provided on config", function() {

                var alternateParser = "esprima-fb";

                eslint.reset();
                eslint.defineRule("test-rule", sandbox.mock().withArgs(
                    sinon.match({parserPath: alternateParser})
                ).returns({}));

                var config = { rules: { "test-rule": 2 }, parser: alternateParser };

                eslint.verify("0", config, filename);
            });
        }

        it("should pass parser as parserPath to all rules when default parser is used", function() {

            var DEFAULT_PARSER = eslint.defaults().parser;

            eslint.reset();
            eslint.defineRule("test-rule", sandbox.mock().withArgs(
                sinon.match({parserPath: DEFAULT_PARSER})
            ).returns({}));

            var config = { rules: { "test-rule": 2 } };

            eslint.verify("0", config, filename);
        });

    });


    describe("when passing in configuration values for rules", function() {
        var code = "var answer = 6 * 7";

        it("should be configurable by only setting the integer value", function() {
            var rule = "semi",
                config = { rules: {} };

            config.rules[rule] = 1;
            eslint.reset();

            var messages = eslint.verify(code, config, filename, true);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, rule);
        });

        it("should be configurable by only setting the string value", function() {
            var rule = "semi",
                config = { rules: {} };

            config.rules[rule] = "warn";
            eslint.reset();

            var messages = eslint.verify(code, config, filename, true);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].severity, 1);
            assert.equal(messages[0].ruleId, rule);
        });

        it("should be configurable by passing in values as an array", function() {
            var rule = "semi",
                config = { rules: {} };

            config.rules[rule] = [1];
            eslint.reset();

            var messages = eslint.verify(code, config, filename, true);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, rule);
        });

        it("should be configurable by passing in string value as an array", function() {
            var rule = "semi",
                config = { rules: {} };

            config.rules[rule] = ["warn"];
            eslint.reset();

            var messages = eslint.verify(code, config, filename, true);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].severity, 1);
            assert.equal(messages[0].ruleId, rule);
        });

        it("should not be configurable by setting other value", function() {
            var rule = "semi",
                config = { rules: {} };

            config.rules[rule] = "1";
            eslint.reset();

            var messages = eslint.verify(code, config, filename, true);

            assert.equal(messages.length, 0);
        });

        it("should process empty config", function() {
            var config = {};

            eslint.reset();
            var messages = eslint.verify(code, config, filename, true);
            assert.equal(messages.length, 0);
        });
    });

    describe("after calling reset()", function() {
        var code = TEST_CODE;

        it("previously registered event handlers should not be called", function() {

            var config = { rules: {} };

            // spies for various AST node types
            var spyLiteral = sinon.spy(),
                spyVariableDeclarator = sinon.spy(),
                spyVariableDeclaration = sinon.spy(),
                spyIdentifier = sinon.spy(),
                spyBinaryExpression = sinon.spy();

            eslint.reset();
            eslint.on("Literal", spyLiteral);
            eslint.on("VariableDeclarator", spyVariableDeclarator);
            eslint.on("VariableDeclaration", spyVariableDeclaration);
            eslint.on("Identifier", spyIdentifier);
            eslint.on("BinaryExpression", spyBinaryExpression);
            eslint.reset();

            var messages = eslint.verify(code, config, filename, true);

            assert.equal(messages.length, 0);
            sinon.assert.notCalled(spyVariableDeclaration);
            sinon.assert.notCalled(spyVariableDeclarator);
            sinon.assert.notCalled(spyIdentifier);
            sinon.assert.notCalled(spyLiteral);
            sinon.assert.notCalled(spyBinaryExpression);
        });

        it("text should not be available", function() {
            var config = { rules: {} };

            eslint.reset();
            var messages = eslint.verify(code, config, filename, true);
            eslint.reset();

            assert.equal(messages.length, 0);
            assert.isNull(eslint.getSource());
        });

        it("source for nodes should not be available", function() {
            var config = { rules: {} };

            eslint.reset();
            var messages = eslint.verify(code, config, filename, true);
            eslint.reset();

            assert.equal(messages.length, 0);
            assert.isNull(eslint.getSource({}));
        });
    });

    describe("when evaluating code containing /*global */ and /*globals */ blocks", function() {
        var code = "/*global a b:true c:false*/ function foo() {} /*globals d:true*/";

        it("variables should be available in global scope", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var scope = eslint.getScope();
                var a = getVariable(scope, "a"),
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

            eslint.verify(code, config, filename, true);
        });
    });

    describe("when evaluating code containing a /*global */ block with sloppy whitespace", function() {
        var code = "/* global  a b  : true   c:  false*/";

        it("variables should be available in global scope", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var scope = eslint.getScope(),
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

            eslint.verify(code, config, filename, true);
        });
    });

    describe("when evaluating code containing /*eslint-env */ block", function() {
        it("variables should be available in global scope", function() {
            var code = "/*eslint-env node*/ function f() {} /*eslint-env browser, foo*/";
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var scope = eslint.getScope(),
                    exports = getVariable(scope, "exports"),
                    window = getVariable(scope, "window");

                assert.equal(exports.writeable, true);
                assert.equal(window.writeable, false);
            });
            eslint.verify(code, config, filename, true);
        });
    });

    describe("when evaluating code containing /*eslint-env */ block with sloppy whitespace", function() {
        var code = "/* eslint-env ,, node  , no-browser ,,  */";

        it("variables should be available in global scope", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var scope = eslint.getScope(),
                    exports = getVariable(scope, "exports"),
                    window = getVariable(scope, "window");

                assert.equal(exports.writeable, true);
                assert.equal(window, null);
            });
            eslint.verify(code, config, filename, true);
        });
    });

    describe("when evaluating code containing /*exported */ block", function() {

        it("we should behave nicely when no matching variable is found", function() {
            var code = "/* exported horse */";
            var config = { rules: {} };
            eslint.reset();
            eslint.verify(code, config, filename, true);
        });

        it("variables should be exported", function() {
            var code = "/* exported horse */\n\nvar horse = 'circus'";
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var scope = eslint.getScope(),
                    horse = getVariable(scope, "horse");

                assert.equal(horse.eslintUsed, true);
            });
            eslint.verify(code, config, filename, true);
        });

        it("undefined variables should not be exported", function() {
            var code = "/* exported horse */\n\nhorse = 'circus'";
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var scope = eslint.getScope(),
                    horse = getVariable(scope, "horse");

                assert.equal(horse, null);
            });
            eslint.verify(code, config, filename, true);
        });

        it("variables should be exported in strict mode", function() {
            var code = "/* exported horse */\n'use strict';\nvar horse = 'circus'";
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var scope = eslint.getScope(),
                    horse = getVariable(scope, "horse");

                assert.equal(horse.eslintUsed, true);
            });
            eslint.verify(code, config, filename, true);
        });

        it("variables should not be exported in the es6 module environment", function() {
            var code = "/* exported horse */\nvar horse = 'circus'";
            var config = { rules: {}, parserOptions: { sourceType: "module" }};

            eslint.reset();
            eslint.on("Program", function() {
                var scope = eslint.getScope(),
                    horse = getVariable(scope, "horse");

                assert.equal(horse, null); // there is no global scope at all
            });
            eslint.verify(code, config, filename, true);
        });

        it("variables should not be exported when in the node environment", function() {
            var code = "/* exported horse */\nvar horse = 'circus'";
            var config = { rules: {}, env: { node: true } };

            eslint.reset();
            eslint.on("Program", function() {
                var scope = eslint.getScope(),
                    horse = getVariable(scope, "horse");

                assert.equal(horse, null); // there is no global scope at all
            });
            eslint.verify(code, config, filename, true);
        });
    });

    describe("when evaluating code containing a line comment", function() {
        var code = "//global a \n function f() {}";

        it("should not introduce a global variable", function() {

            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var scope = eslint.getScope();

                assert.equal(getVariable(scope, "a"), null);
            });
            eslint.verify(code, config, filename, true);
        });
    });

    describe("when evaluating code containing normal block comments", function() {
        var code = "/**/  /*a*/  /*b:true*/  /*foo c:false*/";

        it("should not introduce a global variable", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var scope = eslint.getScope();

                assert.equal(getVariable(scope, "a"), null);
                assert.equal(getVariable(scope, "b"), null);
                assert.equal(getVariable(scope, "foo"), null);
                assert.equal(getVariable(scope, "c"), null);
            });
            eslint.verify(code, config, filename, true);
        });
    });

    describe("when evaluating any code", function() {
        var code = "";

        it("builtin global variables should be available in the global scope", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var scope = eslint.getScope();

                assert.notEqual(getVariable(scope, "Object"), null);
                assert.notEqual(getVariable(scope, "Array"), null);
                assert.notEqual(getVariable(scope, "undefined"), null);
            });
            eslint.verify(code, config, filename, true);
        });

        it("ES6 global variables should not be available by default", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var scope = eslint.getScope();

                assert.equal(getVariable(scope, "Promise"), null);
                assert.equal(getVariable(scope, "Symbol"), null);
                assert.equal(getVariable(scope, "WeakMap"), null);
            });
            eslint.verify(code, config, filename, true);
        });

        it("ES6 global variables should be available in the es6 environment", function() {
            var config = { rules: {} };

            eslint.reset();
            eslint.on("Program", function() {
                var scope = eslint.getScope();

                assert.notEqual(getVariable(scope, "Promise"), null);
                assert.notEqual(getVariable(scope, "Symbol"), null);
                assert.notEqual(getVariable(scope, "WeakMap"), null);
            });
            eslint.verify(code, config, filename, true);
        });
    });

    describe("when evaluating empty code", function() {
        var code = "", config = { rules: {} };

        it("getSource() should return an empty string", function() {
            eslint.reset();
            eslint.verify(code, config, filename, true);
            assert.equal(eslint.getSource(), "");
        });
    });

    describe("at any time", function() {
        var code = "new-rule";

        it("can add a rule dynamically", function() {
            eslint.reset();
            eslint.defineRule(code, function(context) {
                return {
                    "Literal": function(node) {
                        context.report(node, "message");
                    }
                };
            });

            var config = { rules: {} };
            config.rules[code] = 1;

            var messages = eslint.verify("0", config, filename);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, code);
            assert.equal(messages[0].nodeType, "Literal");
        });
    });

    describe("at any time", function() {
        var code = ["new-rule-0", "new-rule-1"];

        it("can add multiple rules dynamically", function() {
            eslint.reset();
            var config = { rules: {} };
            var newRules = {};
            code.forEach(function(item) {
                config.rules[item] = 1;
                newRules[item] = function(context) {
                    return {
                        "Literal": function(node) {
                            context.report(node, "message");
                        }
                    };
                };
            });
            eslint.defineRules(newRules);

            var messages = eslint.verify("0", config, filename);

            assert.equal(messages.length, code.length);
            code.forEach(function(item) {
                assert.ok(messages.some(function(message) {
                    return message.ruleId === item;
                }));
            });
            messages.forEach(function(message) {
                assert.equal(message.nodeType, "Literal");
            });
        });
    });

    describe("at any time", function() {
        var code = "filename-rule";

        it("has access to the filename", function() {
            eslint.reset();
            eslint.defineRule(code, function(context) {
                return {
                    "Literal": function(node) {
                        context.report(node, context.getFilename());
                    }
                };
            });

            var config = { rules: {} };
            config.rules[code] = 1;

            var messages = eslint.verify("0", config, filename);

            assert.equal(messages[0].message, filename);
        });

        it("defaults filename to '<input>'", function() {
            eslint.reset();
            eslint.defineRule(code, function(context) {
                return {
                    "Literal": function(node) {
                        context.report(node, context.getFilename());
                    }
                };
            });

            var config = { rules: {} };
            config.rules[code] = 1;

            var messages = eslint.verify("0", config);

            assert.equal(messages[0].message, "<input>");
        });
    });

    describe("when evaluating code with comments to enable rules", function() {

        it("should report a violation", function() {
            var code = "/*eslint no-alert:1*/ alert('test');";
            var config = { rules: {} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].nodeType, "CallExpression");
        });

        it("rules should not change initial config", function() {
            var config = { rules: {"strict": 2} };
            var codeA = "/*eslint strict: 0*/ function bar() { return 2; }";
            var codeB = "function foo() { return 1; }";

            eslint.reset();
            var messages = eslint.verify(codeA, config, filename, false);
            assert.equal(messages.length, 0);

            messages = eslint.verify(codeB, config, filename, false);
            assert.equal(messages.length, 1);
        });

        it("rules should not change initial config", function() {
            var config = { rules: {"quotes": [2, "double"]} };
            var codeA = "/*eslint quotes: 0*/ function bar() { return '2'; }";
            var codeB = "function foo() { return '1'; }";

            eslint.reset();
            var messages = eslint.verify(codeA, config, filename, false);
            assert.equal(messages.length, 0);

            messages = eslint.verify(codeB, config, filename, false);
            assert.equal(messages.length, 1);
        });

        it("rules should not change initial config", function() {
            var config = { rules: {"quotes": [2, "double"]} };
            var codeA = "/*eslint quotes: [0, \"single\"]*/ function bar() { return '2'; }";
            var codeB = "function foo() { return '1'; }";

            eslint.reset();
            var messages = eslint.verify(codeA, config, filename, false);
            assert.equal(messages.length, 0);

            messages = eslint.verify(codeB, config, filename, false);
            assert.equal(messages.length, 1);
        });

        it("rules should not change initial config", function() {
            var config = { rules: {"no-unused-vars": [2, {"vars": "all"}]} };
            var codeA = "/*eslint no-unused-vars: [0, {\"vars\": \"local\"}]*/ var a = 44;";
            var codeB = "var b = 55;";

            eslint.reset();
            var messages = eslint.verify(codeA, config, filename, false);
            assert.equal(messages.length, 0);

            messages = eslint.verify(codeB, config, filename, false);
            assert.equal(messages.length, 1);
        });
    });

    describe("when evaluating code with invalid comments to enable rules", function() {
        var code = "/*eslint no-alert:true*/ alert('test');";

        it("should report a violation", function() {
            var config = { rules: {} };

            var fn = eslint.verify.bind(eslint, code, config, filename);
            assert.throws(fn, "filename.js line 1:\n\tConfiguration for rule \"no-alert\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warning, 2 = error (you passed 'true').\n");
        });
    });

    describe("when evaluating code with comments to disable rules", function() {
        var code = "/*eslint no-alert:0*/ alert('test');";

        it("should not report a violation", function() {
            var config = { rules: { "no-alert": 1 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });
    });

    describe("when evaluating code with comments to enable multiple rules", function() {
        var code = "/*eslint no-alert:1 no-console:1*/ alert('test'); console.log('test');";

        it("should report a violation", function() {
            var config = { rules: {} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 2);
            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].nodeType, "CallExpression");
            assert.equal(messages[1].ruleId, "no-console");
        });
    });

    describe("when evaluating code with comments to enable and disable multiple rules", function() {
        var code = "/*eslint no-alert:1 no-console:0*/ alert('test'); console.log('test');";
        it("should report a violation", function() {
            var config = { rules: { "no-console": 1, "no-alert": 0 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].nodeType, "CallExpression");
        });
    });

    describe("when evaluating code with comments to disable and enable configurable rule as part of plugin", function() {

        eslint.defineRule("test-plugin/test-rule", function(context) {
            return {
                "Literal": function(node) {
                    if (node.value === "trigger violation") {
                        context.report(node, "Reporting violation.");
                    }
                }
            };
        });

        it("should not report a violation when inline comment enables plugin rule and there's no violation", function() {
            var config = { rules: {} };
            var code = "/*eslint test-plugin/test-rule: 2*/ var a = \"no violation\";";

            eslint.reset();
            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });

        it("should not report a violation when inline comment disables plugin rule", function() {
            var code = "/*eslint test-plugin/test-rule:0*/ var a = \"trigger violation\"";
            var config = { rules: { "test-plugin/test-rule": 1 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });

        it("rules should not change initial config", function() {
            var config = { rules: {"test-plugin/test-rule": 2} };
            var codeA = "/*eslint test-plugin/test-rule: 0*/ var a = \"trigger violation\";";
            var codeB = "var a = \"trigger violation\";";

            eslint.reset();
            var messages = eslint.verify(codeA, config, filename, false);
            assert.equal(messages.length, 0);

            messages = eslint.verify(codeB, config, filename, false);
            assert.equal(messages.length, 1);
        });
    });

    describe("when evaluating code with comments to enable and disable all reporting", function() {
        it("should report a violation", function() {

            var code = [
                "/*eslint-disable */",
                "alert('test');",
                "/*eslint-enable */",
                "alert('test');"
            ].join("\n");
            var config = { rules: { "no-alert": 1 } };

            var messages = eslint.verify(code, config, filename);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].nodeType, "CallExpression");
            assert.equal(messages[0].line, 4);
        });

        it("should not report a violation", function() {
            var code = [
                "/*eslint-disable */",
                "alert('test');",
                "alert('test');"
            ].join("\n");
            var config = { rules: { "no-alert": 1 } };

            var messages = eslint.verify(code, config, filename);

            assert.equal(messages.length, 0);
        });

        it("should not report a violation", function() {
            var code = [
                "                    alert('test1');/*eslint-disable */\n",
                "alert('test');",
                "                                         alert('test');\n",
                "/*eslint-enable */alert('test2');"
            ].join("");
            var config = { rules: { "no-alert": 1 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 2);
            assert.equal(messages[0].column, 21);
            assert.equal(messages[1].column, 19);
        });

        it("should not report a violation", function() {

            var code = [
                "/*eslint-disable */",
                "alert('test');",
                "/*eslint-disable */",
                "alert('test');",
                "/*eslint-enable*/",
                "alert('test');",
                "/*eslint-enable*/"
            ].join("\n");

            var config = { rules: { "no-alert": 1 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });


        it("should not report a violation", function() {
            var code = [
                "/*eslint-disable */",
                "(function(){ var b = 44;})()",
                "/*eslint-enable */;any();"
            ].join("\n");

            var config = { rules: { "no-unused-vars": 1 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });

        it("should not report a violation", function() {
            var code = [
                "(function(){ /*eslint-disable */ var b = 44;})()",
                "/*eslint-enable */;any();"
            ].join("\n");

            var config = { rules: { "no-unused-vars": 1 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });
    });

    describe("when evaluating code with comments to ignore reporting on of specific rules on a specific line", function() {

        describe("eslint-disable-line", function() {
            it("should report a violation", function() {
                var code = [
                    "alert('test'); // eslint-disable-line no-alert",
                    "console.log('test');" // here
                ].join("\n");
                var config = {
                    rules: {
                        "no-alert": 1,
                        "no-console": 1
                    }
                };

                var messages = eslint.verify(code, config, filename);
                assert.equal(messages.length, 1);

                assert.equal(messages[0].ruleId, "no-console");
            });

            it("should report a violation", function() {
                var code = [
                    "alert('test'); // eslint-disable-line no-alert",
                    "console.log('test'); // eslint-disable-line no-console",
                    "alert('test');" // here
                ].join("\n");
                var config = {
                    rules: {
                        "no-alert": 1,
                        "no-console": 1
                    }
                };

                var messages = eslint.verify(code, config, filename);
                assert.equal(messages.length, 1);

                assert.equal(messages[0].ruleId, "no-alert");
            });

            it("should report a violation", function() {
                var code = [
                    "alert('test'); // eslint-disable-line no-alert",
                    "alert('test'); /*eslint-disable-line no-alert*/" // here
                ].join("\n");
                var config = {
                    rules: {
                        "no-alert": 1
                    }
                };

                var messages = eslint.verify(code, config, filename);
                assert.equal(messages.length, 1);

                assert.equal(messages[0].ruleId, "no-alert");
            });

            it("should not report a violation", function() {
                var code = [
                    "alert('test'); // eslint-disable-line no-alert",
                    "console('test'); // eslint-disable-line no-console"
                ].join("\n");
                var config = {
                    rules: {
                        "no-alert": 1,
                        "no-console": 1
                    }
                };

                var messages = eslint.verify(code, config, filename);
                assert.equal(messages.length, 0);
            });

            it("should not report a violation", function() {
                var code = [
                    "alert('test') // eslint-disable-line no-alert, quotes, semi",
                    "console('test'); // eslint-disable-line"
                ].join("\n");
                var config = {
                    rules: {
                        "no-alert": 1,
                        "quotes": [1, "double"],
                        "semi": [1, "always"],
                        "no-console": 1
                    }
                };

                var messages = eslint.verify(code, config, filename);
                assert.equal(messages.length, 0);
            });
        });

        describe("eslint-disable-next-line", function() {
            it("should ignore violation of specified rule on next line", function() {
                var code = [
                    "// eslint-disable-next-line no-alert",
                    "alert('test');",
                    "console.log('test');"
                ].join("\n");
                var config = {
                    rules: {
                        "no-alert": 1,
                        "no-console": 1
                    }
                };
                var messages = eslint.verify(code, config, filename);

                assert.equal(messages.length, 1);
                assert.equal(messages[0].ruleId, "no-console");
            });

            it("should ignore violations only of specified rule", function() {
                var code = [
                    "// eslint-disable-next-line no-console",
                    "alert('test');",
                    "console.log('test');"
                ].join("\n");
                var config = {
                    rules: {
                        "no-alert": 1,
                        "no-console": 1
                    }
                };
                var messages = eslint.verify(code, config, filename);

                assert.equal(messages.length, 2);
                assert.equal(messages[0].ruleId, "no-alert");
                assert.equal(messages[1].ruleId, "no-console");
            });

            it("should ignore violations of multiple rules when specified", function() {
                var code = [
                    "// eslint-disable-next-line no-alert, quotes",
                    "alert(\"test\");",
                    "console.log('test');"
                ].join("\n");
                var config = {
                    rules: {
                        "no-alert": 1,
                        "quotes": [1, "single"],
                        "no-console": 1
                    }
                };
                var messages = eslint.verify(code, config, filename);

                assert.equal(messages.length, 1);
                assert.equal(messages[0].ruleId, "no-console");
            });

            it("should ignore violations of specified rule on next line only", function() {
                var code = [
                    "alert('test');",
                    "// eslint-disable-next-line no-alert",
                    "alert('test');",
                    "console.log('test');"
                ].join("\n");
                var config = {
                    rules: {
                        "no-alert": 1,
                        "no-console": 1
                    }
                };
                var messages = eslint.verify(code, config, filename);

                assert.equal(messages.length, 2);
                assert.equal(messages[0].ruleId, "no-alert");
                assert.equal(messages[1].ruleId, "no-console");
            });

            it("should ignore all rule violations on next line if none specified", function() {
                var code = [
                    "// eslint-disable-next-line",
                    "alert(\"test\");",
                    "console.log('test')"
                ].join("\n");
                var config = {
                    rules: {
                        "semi": [1, "never"],
                        "quotes": [1, "single"],
                        "no-alert": 1,
                        "no-console": 1
                    }
                };
                var messages = eslint.verify(code, config, filename);

                assert.equal(messages.length, 1);
                assert.equal(messages[0].ruleId, "no-console");
            });

            it("should not report if comment is in block quotes", function() {
                var code = [
                    "alert('test');",
                    "/* eslint-disable-next-line no-alert */",
                    "alert('test');",
                    "console.log('test');"
                ].join("\n");
                var config = {
                    rules: {
                        "no-alert": 1,
                        "no-console": 1
                    }
                };
                var messages = eslint.verify(code, config, filename);

                assert.equal(messages.length, 3);
                assert.equal(messages[0].ruleId, "no-alert");
                assert.equal(messages[1].ruleId, "no-alert");
                assert.equal(messages[2].ruleId, "no-console");
            });
        });
    });

    describe("when evaluating code with comments to enable and disable reporting of specific rules", function() {

        it("should report a violation", function() {
            var code = [
                "/*eslint-disable no-alert */",
                "alert('test');",
                "console.log('test');" // here
            ].join("\n");
            var config = { rules: { "no-alert": 1, "no-console": 1 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 1);

            assert.equal(messages[0].ruleId, "no-console");
        });

        it("should report a violation", function() {
            var code = [
                "/*eslint-disable no-alert, no-console */",
                "alert('test');",
                "console.log('test');",
                "/*eslint-enable*/",

                "alert('test');", // here
                "console.log('test');" // here
            ].join("\n");
            var config = { rules: { "no-alert": 1, "no-console": 1 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 2);

            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].line, 5);
            assert.equal(messages[1].ruleId, "no-console");
            assert.equal(messages[1].line, 6);
        });

        it("should report a violation", function() {
            var code = [
                "/*eslint-disable no-alert */",
                "alert('test');",
                "console.log('test');",
                "/*eslint-enable no-console */",

                "alert('test');" // here
            ].join("\n");
            var config = { rules: { "no-alert": 1, "no-console": 1 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 1);

            assert.equal(messages[0].ruleId, "no-console");
        });


        it("should report a violation", function() {
            var code = [
                "/*eslint-disable no-alert, no-console */",
                "alert('test');",
                "console.log('test');",
                "/*eslint-enable no-alert*/",

                "alert('test');", // here
                "console.log('test');"
            ].join("\n");
            var config = { rules: { "no-alert": 1, "no-console": 1 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 1);

            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].line, 5);
        });


        it("should report a violation", function() {
            var code = [
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
            var config = { rules: { "no-alert": 1, "no-console": 1 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 3);

            assert.equal(messages[0].ruleId, "no-console");
            assert.equal(messages[0].line, 7);

            assert.equal(messages[1].ruleId, "no-alert");
            assert.equal(messages[1].line, 9);

            assert.equal(messages[2].ruleId, "no-console");
            assert.equal(messages[2].line, 10);

        });

        it("should report a violation", function() {
            var code = [
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
            var config = { rules: { "no-alert": 1, "no-console": 1 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 3);

            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].line, 5);

            assert.equal(messages[1].ruleId, "no-alert");
            assert.equal(messages[1].line, 8);

            assert.equal(messages[2].ruleId, "no-console");
            assert.equal(messages[2].line, 9);

        });

        it("should report a violation when severity is warn", function() {
            var code = [
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
            var config = { rules: { "no-alert": "warn", "no-console": "warn" } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 3);

            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].line, 5);

            assert.equal(messages[1].ruleId, "no-alert");
            assert.equal(messages[1].line, 8);

            assert.equal(messages[2].ruleId, "no-console");
            assert.equal(messages[2].line, 9);

        });
    });

    describe("when evaluating code with comments to enable and disable multiple comma separated rules", function() {
        var code = "/*eslint no-alert:1, no-console:0*/ alert('test'); console.log('test');";

        it("should report a violation", function() {
            var config = { rules: { "no-console": 1, "no-alert": 0 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
            assert.equal(messages[0].message, "Unexpected alert.");
            assert.include(messages[0].nodeType, "CallExpression");
        });
    });

    describe("when evaluating code with comments to enable configurable rule", function() {
        var code = "/*eslint quotes:[2, \"double\"]*/ alert('test');";

        it("should report a violation", function() {
            var config = { rules: { "quotes": [2, "single"] } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "quotes");
            assert.equal(messages[0].message, "Strings must use doublequote.");
            assert.include(messages[0].nodeType, "Literal");
        });
    });

    describe("when evaluating code with comments to enable configurable rule using string severity", function() {
        var code = "/*eslint quotes:[\"error\", \"double\"]*/ alert('test');";

        it("should report a violation", function() {
            var config = { rules: { "quotes": [2, "single"] } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "quotes");
            assert.equal(messages[0].message, "Strings must use doublequote.");
            assert.include(messages[0].nodeType, "Literal");
        });
    });

    describe("when evaluating code with incorrectly formatted comments to disable rule", function() {
        it("should report a violation", function() {
            var code = "/*eslint no-alert:'1'*/ alert('test');";

            var config = { rules: { "no-alert": 1} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 2);

            // Incorrectly formatted comment threw error;
            // message from caught exception
            // may differ amongst UAs, so verifying
            // first part only as defined in the
            // parseJsonConfig function in lib/eslint.js
            assert.match(messages[0].message, /^Failed to parse JSON from ' "no-alert":'1'':/);
            assert.equal(messages[0].line, 1);
            assert.equal(messages[0].column, 1);

            assert.equal(messages[1].ruleId, "no-alert");
            assert.equal(messages[1].message, "Unexpected alert.");
            assert.include(messages[1].nodeType, "CallExpression");
        });

        it("should report a violation", function() {
            var code = "/*eslint no-alert:abc*/ alert('test');";

            var config = { rules: { "no-alert": 1} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 2);

            // Incorrectly formatted comment threw error;
            // message from caught exception
            // may differ amongst UAs, so verifying
            // first part only as defined in the
            // parseJsonConfig function in lib/eslint.js
            assert.match(messages[0].message, /^Failed to parse JSON from ' "no-alert":abc':/);
            assert.equal(messages[0].line, 1);
            assert.equal(messages[0].column, 1);

            assert.equal(messages[1].ruleId, "no-alert");
            assert.equal(messages[1].message, "Unexpected alert.");
            assert.include(messages[1].nodeType, "CallExpression");
        });

        it("should report a violation", function() {
            var code = "/*eslint no-alert:0 2*/ alert('test');";

            var config = { rules: { "no-alert": 1} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 2);

            // Incorrectly formatted comment threw error;
            // message from caught exception
            // may differ amongst UAs, so verifying
            // first part only as defined in the
            // parseJsonConfig function in lib/eslint.js
            assert.match(messages[0].message, /^Failed to parse JSON from ' "no-alert":0 2':/);
            assert.equal(messages[0].line, 1);
            assert.equal(messages[0].column, 1);

            assert.equal(messages[1].ruleId, "no-alert");
            assert.equal(messages[1].message, "Unexpected alert.");
            assert.include(messages[1].nodeType, "CallExpression");
        });
    });

    describe("when evaluating a file with a shebang", function() {
        var code = "#!bin/program\n\nvar foo;;";

        it("should preserve line numbers", function() {
            var config = { rules: { "no-extra-semi": 1 } };
            var messages = eslint.verify(code, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-extra-semi");
            assert.equal(messages[0].nodeType, "EmptyStatement");
            assert.equal(messages[0].line, 3);
        });

        it("should not have a comment with the shebang in it", function() {
            var config = { rules: { "no-extra-semi": 1 } };
            eslint.reset();

            eslint.on("Program", function(node) {
                assert.equal(node.comments.length, 0);

                var comments = eslint.getComments(node);
                assert.equal(comments.leading.length, 0);
                assert.equal(comments.trailing.length, 0);

                comments = eslint.getComments(node.body[0]);
                assert.equal(comments.leading.length, 0);
                assert.equal(comments.trailing.length, 0);
            });
            eslint.verify(code, config, "foo.js", true);
        });

        it("should not fire a LineComment event for a comment with the shebang in it", function() {
            var config = { rules: { "no-extra-semi": 1 } };
            eslint.reset();

            eslint.on("LineComment", sandbox.mock().never());
            eslint.verify(code, config, "foo.js", true);
        });
    });

    describe("when evaluating broken code", function() {
        var code = BROKEN_TEST_CODE;

        it("should report a violation with a useful parse error prefix", function() {
            var messages = eslint.verify(code);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].severity, 2);
            assert.isNull(messages[0].ruleId);
            assert.equal(messages[0].source, BROKEN_TEST_CODE);
            assert.equal(messages[0].line, 1);
            assert.equal(messages[0].column, 4);
            assert.isTrue(messages[0].fatal);
            assert.match(messages[0].message, /^Parsing error:/);
        });

        it("should report source code where the issue is present", function() {
            var inValidCode = [
                "var x = 20;",
                "if (x ==4 {",
                "    x++;",
                "}"
            ];
            var messages = eslint.verify(inValidCode.join("\n"));
            assert.equal(messages.length, 1);
            assert.equal(messages[0].severity, 2);
            assert.equal(messages[0].source, inValidCode[1]);
            assert.isTrue(messages[0].fatal);
            assert.match(messages[0].message, /^Parsing error:/);
        });
    });

    describe("when using an invalid (undefined) rule", function() {
        var code = TEST_CODE;
        var results = eslint.verify(code, { rules: {foobar: 2 } });
        var result = results[0];
        var warningResult = eslint.verify(code, { rules: {foobar: 1 } })[0];
        var arrayOptionResults = eslint.verify(code, { rules: {foobar: [2, "always"]} });
        var objectOptionResults = eslint.verify(code, { rules: {foobar: [1, {bar: false}]} });
        var resultsMultiple = eslint.verify(code, { rules: {foobar: 2, barfoo: 1} });

        it("should add a stub rule", function() {
            assert.isNotNull(result);
            assert.isArray(results);
            assert.isObject(result);
            assert.property(result, "ruleId");
            assert.equal(result.ruleId, "foobar");
        });

        it("should report that the rule does not exist", function() {
            assert.property(result, "message");
            assert.equal(result.message, "Definition for rule \'foobar\' was not found");
        });

        it("should report at the correct severity", function() {
            assert.property(result, "severity");
            assert.equal(result.severity, 2);
            assert.equal(warningResult.severity, 1);
        });

        it("should accept any valid rule configuration", function() {
            assert.isObject(arrayOptionResults[0]);
            assert.isObject(objectOptionResults[0]);
        });

        it("should report multiple missing rules", function() {
            assert.isArray(resultsMultiple);
            assert.equal(resultsMultiple[1].ruleId, "barfoo");
        });
    });

    describe("when using a rule which has been replaced", function() {
        var code = TEST_CODE;
        var results = eslint.verify(code, { rules: {"no-comma-dangle": 2 } });

        it("should report the new rule", function() {
            assert.equal(results[0].ruleId, "no-comma-dangle");
            assert.equal(results[0].message, "Rule \'no-comma-dangle\' was removed and replaced by: comma-dangle");
        });
    });

    describe("when using invalid rule config", function() {
        var code = TEST_CODE;

        it("should throw an error", function() {
            assert.throws(function() {
                eslint.verify(code, { rules: {foobar: null } });
            }, /Invalid config for rule 'foobar'\./);
        });
    });

    describe("when calling defaults", function() {
        it("should return back config object", function() {
            var config = eslint.defaults();

            assert.isNotNull(config.rules);
        });
    });

    describe("when evaluating code without comments to environment", function() {
        it("should report a violation when using typed array", function() {
            var code = "var array = new Uint8Array();";

            var config = { rules: { "no-undef": 1} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 1);
        });

        it("should report a violation when using Promise", function() {
            var code = "new Promise();";

            var config = { rules: { "no-undef": 1} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 1);
        });
    });

    describe("when evaluating code with comments to environment", function() {
        it("should not support legacy config", function() {
            var code = "/*jshint mocha:true */ describe();";

            var config = { rules: { "no-undef": 1} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-undef");
            assert.equal(messages[0].nodeType, "Identifier");
            assert.equal(messages[0].line, 1);
        });

        it("should not report a violation", function() {
            var code = "/*eslint-env es6 */ new Promise();";

            var config = { rules: { "no-undef": 1 } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });

        it("should not report a violation", function() {
            var code = "/*eslint-env mocha,node */ require();describe();";

            var config = { rules: { "no-undef": 1} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });

        it("should not report a violation", function() {
            var code = "/*eslint-env mocha */ suite();test();";

            var config = { rules: { "no-undef": 1} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });

        it("should not report a violation", function() {
            var code = "/*eslint-env amd */ define();require();";

            var config = { rules: { "no-undef": 1} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });

        it("should not report a violation", function() {
            var code = "/*eslint-env jasmine */ expect();spyOn();";

            var config = { rules: { "no-undef": 1} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });

        it("should not report a violation", function() {
            var code = "/*globals require: true */ /*eslint-env node */ require = 1;";

            var config = { rules: {"no-undef": 1} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });

        it("should not report a violation", function() {
            var code = "/*eslint-env node */ process.exit();";

            var config = { rules: {} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });

        it("should not report a violation", function() {
            var code = "/*eslint no-process-exit: 0 */ /*eslint-env node */ process.exit();";

            var config = { rules: {"no-undef": 1} };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 0);
        });
    });

    describe("when evaluating code with comments to change config when allowInlineConfig is enabled", function() {

        it("should report a violation for disabling rules", function() {
            var code = [
                "alert('test'); // eslint-disable-line no-alert"
            ].join("\n");
            var config = {
                rules: {
                    "no-alert": 1
                }
            };

            var messages = eslint.verify(code, config, {
                filename: filename,
                allowInlineConfig: false
            });

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
        });

        it("should report a violation for global variable declarations",
        function() {
            var code = [
                "/* global foo */"
            ].join("\n");
            var config = {
                rules: {
                    test: 2
                }
            };
            var ok = false;

            eslint.defineRules({test: function(context) {
                return {
                    "Program": function() {
                        var scope = context.getScope();
                        var comments = context.getAllComments();
                        assert.equal(1, comments.length);

                        var foo = getVariable(scope, "foo");
                        assert.notOk(foo);

                        ok = true;
                    }
                };
            }});

            eslint.verify(code, config, {allowInlineConfig: false});
            assert(ok);
        });

        it("should report a violation for eslint-disable", function() {
            var code = [
                "/* eslint-disable */",
                "alert('test');"
            ].join("\n");
            var config = {
                rules: {
                    "no-alert": 1
                }
            };

            var messages = eslint.verify(code, config, {
                filename: filename,
                allowInlineConfig: false
            });

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
        });

        it("should not report a violation for rule changes", function() {
            var code = [
                "/*eslint no-alert:2*/",
                "alert('test');"
            ].join("\n");
            var config = {
                rules: {
                    "no-alert": 0
                }
            };

            var messages = eslint.verify(code, config, {
                filename: filename,
                allowInlineConfig: false
            });

            assert.equal(messages.length, 0);
        });

        it("should report a violation for disable-line", function() {
            var code = [
                "alert('test'); // eslint-disable-line"
            ].join("\n");
            var config = {
                rules: {
                    "no-alert": 2
                }
            };

            var messages = eslint.verify(code, config, {
                filename: filename,
                allowInlineConfig: false
            });

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
        });

        it("should report a violation for env changes", function() {
            var code = [
                "/*eslint-env browser*/"
            ].join("\n");
            var config = {
                rules: {
                    test: 2
                }
            };
            var ok = false;

            eslint.defineRules({test: function(context) {
                return {
                    "Program": function() {
                        var scope = context.getScope();
                        var comments = context.getAllComments();
                        assert.equal(1, comments.length);

                        var windowVar = getVariable(scope, "window");
                        assert.notOk(windowVar.eslintExplicitGlobal);

                        ok = true;
                    }
                };
            }});

            eslint.verify(code, config, {allowInlineConfig: false});
            assert(ok);
        });
    });

    describe("when evaluating code with comments to change config when allowInlineConfig is disabled", function() {

        it("should not report a violation", function() {
            var code = [
                "alert('test'); // eslint-disable-line no-alert"
            ].join("\n");
            var config = {
                rules: {
                    "no-alert": 1
                }
            };

            var messages = eslint.verify(code, config, {
                filename: filename,
                allowInlineConfig: true
            });

            assert.equal(messages.length, 0);
        });
    });

    describe("when evaluating code with code comments", function() {

        it("should emit enter only once for each comment", function() {

            var code = "a; /*zz*/ b;";

            var config = { rules: {} },
                spy = sandbox.spy();

            eslint.reset();
            eslint.on("BlockComment", spy);

            eslint.verify(code, config, filename, true);
            assert.equal(spy.calledOnce, true);
        });

        it("should emit exit only once for each comment", function() {

            var code = "a; //zz\n b;";

            var config = { rules: {} },
                spy = sandbox.spy();

            eslint.reset();
            eslint.on("LineComment:exit", spy);

            eslint.verify(code, config, filename, true);
            assert.equal(spy.calledOnce, true);
        });

    });

    describe("when evaluating code with hashbang", function() {
        it("should comment hashbang without breaking offset", function() {

            var code = "#!/usr/bin/env node\n'123';";

            var config = { rules: {} };

            eslint.reset();
            eslint.on("ExpressionStatement", function(node) {
                assert.equal(eslint.getSource(node), "'123';");
            });

            eslint.verify(code, config, filename, true);
        });

    });

    describe("verify()", function() {

        describe("filenames", function() {
            it("should allow filename to be passed on options object", function() {

                eslint.verify("foo;", {}, { filename: "foo.js"});
                var result = eslint.getFilename();
                assert.equal(result, "foo.js");
            });

            it("should allow filename to be passed as third argument", function() {

                eslint.verify("foo;", {}, "foo.js");
                var result = eslint.getFilename();
                assert.equal(result, "foo.js");
            });

            it("should default filename to <input> when options object doesn't have filename", function() {

                eslint.verify("foo;", {}, {});
                var result = eslint.getFilename();
                assert.equal(result, "<input>");
            });

            it("should default filename to <input> when only two arguments are passed", function() {

                eslint.verify("foo;", {});
                var result = eslint.getFilename();
                assert.equal(result, "<input>");
            });
        });

        describe("saveState", function() {
            it("should save the state when saveState is passed as an option", function() {

                var spy = sinon.spy(eslint, "reset");
                eslint.verify("foo;", {}, { saveState: true });
                assert.equal(spy.callCount, 0);
            });


        });


        it("should report warnings in order by line and column when called", function() {

            var code = "foo()\n    alert('test')";
            var config = { rules: { "no-mixed-spaces-and-tabs": 1, "eol-last": 1, "semi": [1, "always"] } };

            var messages = eslint.verify(code, config, filename);
            assert.equal(messages.length, 3);
            assert.equal(messages[0].line, 1);
            assert.equal(messages[0].column, 6);
            assert.equal(messages[1].line, 2);
            assert.equal(messages[1].column, 2);
            assert.equal(messages[2].line, 2);
            assert.equal(messages[2].column, 18);
        });

        it("should properly parse let declaration when passed ecmaVersion", function() {

            var messages = eslint.verify("let x = 5;", {
                parserOptions: {
                    ecmaVersion: 6
                }
            }, filename);

            assert.equal(messages.length, 0);
        });

        it("should properly parse object spread when passed ecmaFeatures", function() {

            var messages = eslint.verify("var x = { ...y };", {
                parserOptions: {
                    ecmaVersion: 6,
                    ecmaFeatures: {
                        experimentalObjectRestSpread: true
                    }
                }
            }, filename);

            assert.equal(messages.length, 0);
        });

        it("should properly parse global return when passed ecmaFeatures", function() {

            var messages = eslint.verify("return;", {
                parserOptions: {
                    ecmaFeatures: {
                        globalReturn: true
                    }
                }
            }, filename);

            assert.equal(messages.length, 0);
        });

        it("should properly parse global return when in Node.js environment", function() {

            var messages = eslint.verify("return;", {
                env: {
                    node: true
                }
            }, filename);

            assert.equal(messages.length, 0);
        });

        it("should not parse global return when in Node.js environment with globalReturn explicitly off", function() {

            var messages = eslint.verify("return;", {
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

        it("should not parse global return when Node.js environment is false", function() {

            var messages = eslint.verify("return;", {}, filename);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].message, "Parsing error: 'return' outside of function");
        });

        it("should properly parse sloppy-mode code when impliedStrict is false", function() {

            var messages = eslint.verify("var private;", {}, filename);

            assert.equal(messages.length, 0);
        });

        it("should not parse sloppy-mode code when impliedStrict is true", function() {

            var messages = eslint.verify("var private;", {
                parserOptions: {
                    ecmaFeatures: {
                        impliedStrict: true
                    }
                }
            }, filename);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].message, "Parsing error: The keyword 'private' is reserved");
        });

        it("should properly parse valid code when impliedStrict is true", function() {

            var messages = eslint.verify("var foo;", {
                parserOptions: {
                    ecmaFeatures: {
                        impliedStrict: true
                    }
                }
            }, filename);

            assert.equal(messages.length, 0);
        });

        it("should properly parse JSX when passed ecmaFeatures", function() {

            var messages = eslint.verify("var x = <div/>;", {
                parserOptions: {
                    ecmaFeatures: {
                        jsx: true
                    }
                }
            }, filename);

            assert.equal(messages.length, 0);
        });

        it("should report an error when JSX code is encountered and JSX is not enabled", function() {
            var code = "var myDivElement = <div className=\"foo\" />;";
            var messages = eslint.verify(code, {}, "filename");

            assert.equal(messages.length, 1);
            assert.equal(messages[0].line, 1);
            assert.equal(messages[0].column, 20);
            assert.equal(messages[0].message, "Parsing error: Unexpected token <");
        });

        it("should not report an error when JSX code is encountered and JSX is enabled", function() {
            var code = "var myDivElement = <div className=\"foo\" />;";
            var messages = eslint.verify(code, { parserOptions: { ecmaFeatures: { jsx: true }}}, "filename");

            assert.equal(messages.length, 0);
        });

        it("should not report an error when JSX code contains a spread operator and JSX is enabled", function() {
            var code = "var myDivElement = <div {...this.props} />;";
            var messages = eslint.verify(code, { parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true }}}, "filename");
            assert.equal(messages.length, 0);
        });

        // TODO: Remove when escope is updated
        it("should not crash due to no-undef mutating escope data", function() {
            var code = "import foo from 'bar';";
            eslint.verify(code, {
                parserOptions: {
                    sourceType: "module"
                },
                rules: {
                    "no-undef": 2,
                    "no-unused-vars": 2
                }
            }, "filename");
        });

        it("should be able to use es6 features if there is a comment which has \"eslint-env es6\"", function() {
            var code = [
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

            var messages = eslint.verify(code, null, "eslint-env es6");
            assert.equal(messages.length, 0);
        });

        it("should be able to return in global if there is a comment which has \"eslint-env node\"", function() {
            var messages = eslint.verify("/* eslint-env node */ return;", null, "eslint-env node");
            assert.equal(messages.length, 0);
        });

        it("should attach a \"/*global\" comment node to declared variables", function() {
            var code = "/* global foo */\n/* global bar, baz */";
            var ok = false;

            eslint.defineRules({test: function(context) {
                return {
                    "Program": function() {
                        var scope = context.getScope();
                        var comments = context.getAllComments();
                        assert.equal(2, comments.length);

                        var foo = getVariable(scope, "foo");
                        assert.equal(true, foo.eslintExplicitGlobal);
                        assert.equal(comments[0], foo.eslintExplicitGlobalComment);

                        var bar = getVariable(scope, "bar");
                        assert.equal(true, bar.eslintExplicitGlobal);
                        assert.equal(comments[1], bar.eslintExplicitGlobalComment);

                        var baz = getVariable(scope, "baz");
                        assert.equal(true, baz.eslintExplicitGlobal);
                        assert.equal(comments[1], baz.eslintExplicitGlobalComment);

                        ok = true;
                    }
                };
            }});

            eslint.verify(code, {rules: {test: 2}});
            assert(ok);
        });

        it("should not crash when we reuse the SourceCode object", function() {
            eslint.verify("function render() { return <div className='test'>{hello}</div> }", { parserOptions: { ecmaVersion: 6, ecmaFeatures: {jsx: true} }});
            eslint.verify(eslint.getSourceCode(), { parserOptions: { ecmaVersion: 6, ecmaFeatures: {jsx: true} }});
        });
    });

    describe("Variables and references", function() {
        var code = [
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
        var scope = null;

        beforeEach(function() {
            var ok = false;
            eslint.defineRules({test: function(context) {
                return {
                    "Program": function() {
                        scope = context.getScope();
                        ok = true;
                    }
                };
            }});
            eslint.verify(code, {rules: {test: 2}, globals: {e: true, f: false}});
            assert(ok);
        });

        afterEach(function() {
            scope = null;
        });

        it("Scope#through should contain references of undefined variables", function() {
            assert.equal(scope.through.length, 2);
            assert.equal(scope.through[0].identifier.name, "a");
            assert.equal(scope.through[0].identifier.loc.start.line, 1);
            assert.equal(scope.through[0].resolved, null);
            assert.equal(scope.through[1].identifier.name, "b");
            assert.equal(scope.through[1].identifier.loc.start.line, 2);
            assert.equal(scope.through[1].resolved, null);
        });

        it("Scope#variables should contain global variables", function() {
            assert(scope.variables.some(function(v) {
                return v.name === "Object";
            }));
            assert(scope.variables.some(function(v) {
                return v.name === "foo";
            }));
            assert(scope.variables.some(function(v) {
                return v.name === "c";
            }));
            assert(scope.variables.some(function(v) {
                return v.name === "d";
            }));
            assert(scope.variables.some(function(v) {
                return v.name === "e";
            }));
            assert(scope.variables.some(function(v) {
                return v.name === "f";
            }));
        });

        it("Scope#set should contain global variables", function() {
            assert(scope.set.get("Object"));
            assert(scope.set.get("foo"));
            assert(scope.set.get("c"));
            assert(scope.set.get("d"));
            assert(scope.set.get("e"));
            assert(scope.set.get("f"));
        });

        it("Variables#references should contain their references", function() {
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

        it("Reference#resolved should be their variable", function() {
            assert.equal(scope.set.get("Object").references[0].resolved, scope.set.get("Object"));
            assert.equal(scope.set.get("foo").references[0].resolved, scope.set.get("foo"));
            assert.equal(scope.set.get("c").references[0].resolved, scope.set.get("c"));
            assert.equal(scope.set.get("d").references[0].resolved, scope.set.get("d"));
            assert.equal(scope.set.get("e").references[0].resolved, scope.set.get("e"));
            assert.equal(scope.set.get("f").references[0].resolved, scope.set.get("f"));
        });
    });

    describe("getDeclaredVariables(node)", function() {
        /**
         * Assert `eslint.getDeclaredVariables(node)` is empty.
         * @param {ASTNode} node - A node to check.
         * @returns {void}
         */
        function checkEmpty(node) {
            assert.equal(0, eslint.getDeclaredVariables(node).length);
        }

        /**
         * Assert `eslint.getDeclaredVariables(node)` is valid.
         * @param {string} code - A code to check.
         * @param {string} type - A type string of ASTNode. This method checks variables on the node of the type.
         * @param {Array<Array<string>>} expectedNamesList - An array of expected variable names. The expected variable names is an array of string.
         * @returns {void}
         */
        function verify(code, type, expectedNamesList) {
            eslint.defineRules({test: function(context) {
                var rule = {
                    "Program": checkEmpty,
                    "EmptyStatement": checkEmpty,
                    "BlockStatement": checkEmpty,
                    "ExpressionStatement": checkEmpty,
                    "LabeledStatement": checkEmpty,
                    "BreakStatement": checkEmpty,
                    "ContinueStatement": checkEmpty,
                    "WithStatement": checkEmpty,
                    "SwitchStatement": checkEmpty,
                    "ReturnStatement": checkEmpty,
                    "ThrowStatement": checkEmpty,
                    "TryStatement": checkEmpty,
                    "WhileStatement": checkEmpty,
                    "DoWhileStatement": checkEmpty,
                    "ForStatement": checkEmpty,
                    "ForInStatement": checkEmpty,
                    "DebuggerStatement": checkEmpty,
                    "ThisExpression": checkEmpty,
                    "ArrayExpression": checkEmpty,
                    "ObjectExpression": checkEmpty,
                    "Property": checkEmpty,
                    "SequenceExpression": checkEmpty,
                    "UnaryExpression": checkEmpty,
                    "BinaryExpression": checkEmpty,
                    "AssignmentExpression": checkEmpty,
                    "UpdateExpression": checkEmpty,
                    "LogicalExpression": checkEmpty,
                    "ConditionalExpression": checkEmpty,
                    "CallExpression": checkEmpty,
                    "NewExpression": checkEmpty,
                    "MemberExpression": checkEmpty,
                    "SwitchCase": checkEmpty,
                    "Identifier": checkEmpty,
                    "Literal": checkEmpty,
                    "ForOfStatement": checkEmpty,
                    "ArrowFunctionExpression": checkEmpty,
                    "YieldExpression": checkEmpty,
                    "TemplateLiteral": checkEmpty,
                    "TaggedTemplateExpression": checkEmpty,
                    "TemplateElement": checkEmpty,
                    "ObjectPattern": checkEmpty,
                    "ArrayPattern": checkEmpty,
                    "RestElement": checkEmpty,
                    "AssignmentPattern": checkEmpty,
                    "ClassBody": checkEmpty,
                    "MethodDefinition": checkEmpty,
                    "MetaProperty": checkEmpty
                };
                rule[type] = function(node) {
                    var expectedNames = expectedNamesList.shift();
                    var variables = context.getDeclaredVariables(node);

                    assert(Array.isArray(expectedNames));
                    assert(Array.isArray(variables));
                    assert.equal(expectedNames.length, variables.length);
                    for (var i = variables.length - 1; i >= 0; i--) {
                        assert.equal(expectedNames[i], variables[i].name);
                    }
                };
                return rule;
            }});
            eslint.verify(code, {
                rules: {test: 2},
                parserOptions: {
                    ecmaVersion: 6,
                    sourceType: "module"
                }
            });

            // Check all expected names are asserted.
            assert.equal(0, expectedNamesList.length);
        }

        it("VariableDeclaration", function() {
            var code = "\n var {a, x: [b], y: {c = 0}} = foo;\n let {d, x: [e], y: {f = 0}} = foo;\n const {g, x: [h], y: {i = 0}} = foo, {j, k = function(z) { let l; }} = bar;\n ";
            var namesList = [
                ["a", "b", "c"],
                ["d", "e", "f"],
                ["g", "h", "i", "j", "k"],
                ["l"]
            ];

            verify(code, "VariableDeclaration", namesList);
        });

        it("VariableDeclaration (on for-in/of loop)", function() {
            // TDZ scope is created here, so tests to exclude those.
            var code = "\n for (var {a, x: [b], y: {c = 0}} in foo) {\n let g;\n }\n for (let {d, x: [e], y: {f = 0}} of foo) {\n let h;\n }\n ";
            var namesList = [
                ["a", "b", "c"],
                ["g"],
                ["d", "e", "f"],
                ["h"]
            ];

            verify(code, "VariableDeclaration", namesList);
        });

        it("VariableDeclarator", function() {
            // TDZ scope is created here, so tests to exclude those.
            var code = "\n var {a, x: [b], y: {c = 0}} = foo;\n let {d, x: [e], y: {f = 0}} = foo;\n const {g, x: [h], y: {i = 0}} = foo, {j, k = function(z) { let l; }} = bar;\n ";
            var namesList = [
                ["a", "b", "c"],
                ["d", "e", "f"],
                ["g", "h", "i"],
                ["j", "k"],
                ["l"]
            ];

            verify(code, "VariableDeclarator", namesList);
        });

        it("FunctionDeclaration", function() {
            var code = "\n function foo({a, x: [b], y: {c = 0}}, [d, e]) {\n let z;\n }\n function bar({f, x: [g], y: {h = 0}}, [i, j = function(q) { let w; }]) {\n let z;\n }\n ";
            var namesList = [
                ["foo", "a", "b", "c", "d", "e"],
                ["bar", "f", "g", "h", "i", "j"]
            ];

            verify(code, "FunctionDeclaration", namesList);
        });

        it("FunctionExpression", function() {
            var code = "\n (function foo({a, x: [b], y: {c = 0}}, [d, e]) {\n let z;\n });\n (function bar({f, x: [g], y: {h = 0}}, [i, j = function(q) { let w; }]) {\n let z;\n });\n ";
            var namesList = [
                ["foo", "a", "b", "c", "d", "e"],
                ["bar", "f", "g", "h", "i", "j"],
                ["q"]
            ];

            verify(code, "FunctionExpression", namesList);
        });

        it("ArrowFunctionExpression", function() {
            var code = "\n (({a, x: [b], y: {c = 0}}, [d, e]) => {\n let z;\n });\n (({f, x: [g], y: {h = 0}}, [i, j]) => {\n let z;\n });\n ";
            var namesList = [
                ["a", "b", "c", "d", "e"],
                ["f", "g", "h", "i", "j"]
            ];

            verify(code, "ArrowFunctionExpression", namesList);
        });

        it("ClassDeclaration", function() {
            var code = "\n class A { foo(x) { let y; } }\n class B { foo(x) { let y; } }\n ";
            var namesList = [
                ["A", "A"], // outer scope's and inner scope's.
                ["B", "B"]
            ];

            verify(code, "ClassDeclaration", namesList);
        });

        it("ClassExpression", function() {
            var code = "\n (class A { foo(x) { let y; } });\n (class B { foo(x) { let y; } });\n ";
            var namesList = [
                ["A"],
                ["B"]
            ];

            verify(code, "ClassExpression", namesList);
        });

        it("CatchClause", function() {
            var code = "\n try {} catch ({a, b}) {\n let x;\n try {} catch ({c, d}) {\n let y;\n }\n }\n ";
            var namesList = [
                ["a", "b"],
                ["c", "d"]
            ];

            verify(code, "CatchClause", namesList);
        });

        it("ImportDeclaration", function() {
            var code = "\n import \"aaa\";\n import * as a from \"bbb\";\n import b, {c, x as d} from \"ccc\";\n ";
            var namesList = [
                [],
                ["a"],
                ["b", "c", "d"]
            ];

            verify(code, "ImportDeclaration", namesList);
        });

        it("ImportSpecifier", function() {
            var code = "\n import \"aaa\";\n import * as a from \"bbb\";\n import b, {c, x as d} from \"ccc\";\n ";
            var namesList = [
                ["c"],
                ["d"]
            ];

            verify(code, "ImportSpecifier", namesList);
        });

        it("ImportDefaultSpecifier", function() {
            var code = "\n import \"aaa\";\n import * as a from \"bbb\";\n import b, {c, x as d} from \"ccc\";\n ";
            var namesList = [
                ["b"]
            ];

            verify(code, "ImportDefaultSpecifier", namesList);
        });

        it("ImportNamespaceSpecifier", function() {
            var code = "\n import \"aaa\";\n import * as a from \"bbb\";\n import b, {c, x as d} from \"ccc\";\n ";
            var namesList = [
                ["a"]
            ];

            verify(code, "ImportNamespaceSpecifier", namesList);
        });
    });

    describe("Edge cases", function() {

        it("should properly parse import statements when sourceType is module", function() {
            var code = "import foo from 'foo';";
            var messages = eslint.verify(code, { parserOptions: { sourceType: "module" } });
            assert.equal(messages.length, 0);
        });

        it("should properly parse import all statements when sourceType is module", function() {
            var code = "import * as foo from 'foo';";
            var messages = eslint.verify(code, { parserOptions: { sourceType: "module" } });
            assert.equal(messages.length, 0);
        });

        it("should properly parse default export statements when sourceType is module", function() {
            var code = "export default function initialize() {}";
            var messages = eslint.verify(code, { parserOptions: { sourceType: "module" } });
            assert.equal(messages.length, 0);
        });

        it("should not crash when invalid parentheses syntax is encountered", function() {
            eslint.verify("left = (aSize.width/2) - ()");
        });

        it("should not crash when let is used inside of switch case", function() {
            eslint.verify("switch(foo) { case 1: let bar=2; }", { parserOptions: { ecmaVersion: 6 }});
        });

        it("should not crash when parsing destructured assignment", function() {
            eslint.verify("var { a='a' } = {};", { parserOptions: { ecmaVersion: 6 }});
        });

        it("should not rewrite env setting in core (https://github.com/eslint/eslint/issues/4814)", function() {
            // This test focuses on the instance of https://github.com/eslint/eslint/blob/v2.0.0-alpha-2/conf/environments.js#L26-L28

            // This `verify()` takes the instance and runs https://github.com/eslint/eslint/blob/v2.0.0-alpha-2/lib/eslint.js#L416
            eslint.defineRule("test", function() {
                return {};
            });
            eslint.verify("var a = 0;", {
                env: {node: true},
                parserOptions: {sourceType: "module"},
                rules: {test: 2}
            });

            // This `verify()` takes the instance and tests that the instance was not modified.
            var ok = false;
            eslint.defineRule("test", function(context) {
                assert(
                    context.parserOptions.ecmaFeatures.globalReturn,
                    "`ecmaFeatures.globalReturn` of the node environment should not be modified."
                );
                ok = true;
                return {};
            });
            eslint.verify("var a = 0;", {
                env: {node: true},
                rules: {test: 2}
            });

            assert(ok);
        });
    });

    // only test in Node.js, not browser
    if (typeof window === "undefined") {

        describe("Custom parser", function() {

            var parserFixtures = path.join(__dirname, "../fixtures/parsers"),
                errorPrefix = "Parsing error: ";

            it("should not report an error when JSX code contains a spread operator and JSX is enabled", function() {
                var code = "var myDivElement = <div {...this.props} />;";
                var messages = eslint.verify(code, { parser: "esprima-fb" }, "filename");
                assert.equal(messages.length, 0);
            });

            it("should return an error when the custom parser can't be found", function() {
                var code = "var myDivElement = <div {...this.props} />;";
                var messages = eslint.verify(code, { parser: "esprima-fbxyz" }, "filename");
                assert.equal(messages.length, 1);
                assert.equal(messages[0].severity, 2);
                assert.equal(messages[0].message, "Cannot find module 'esprima-fbxyz'");
            });

            it("should strip leading line: prefix from parser error", function() {
                var parser = path.join(parserFixtures, "line-error.js");
                var messages = eslint.verify(";", { parser: parser }, "filename");
                assert.equal(messages.length, 1);
                assert.equal(messages[0].severity, 2);
                assert.isNull(messages[0].source);
                assert.equal(messages[0].message, errorPrefix + require(parser).expectedError);
            });

            it("should not modify a parser error message without a leading line: prefix", function() {
                var parser = path.join(parserFixtures, "no-line-error.js");
                var messages = eslint.verify(";", { parser: parser }, "filename");
                assert.equal(messages.length, 1);
                assert.equal(messages[0].severity, 2);
                assert.equal(messages[0].message, errorPrefix + require(parser).expectedError);
            });

        });
    }


});
