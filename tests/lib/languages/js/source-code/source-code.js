/**
 * @fileoverview Abstraction of JavaScript source code.
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const fs = require("node:fs"),
	path = require("node:path"),
	assert = require("chai").assert,
	espree = require("espree"),
	eslintScope = require("eslint-scope"),
	sinon = require("sinon"),
	{ Linter } = require("../../../../../lib/linter"),
	SourceCode = require("../../../../../lib/languages/js/source-code/source-code"),
	astUtils = require("../../../../../lib/shared/ast-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const DEFAULT_CONFIG = {
	ecmaVersion: 6,
	comment: true,
	tokens: true,
	range: true,
	loc: true,
};
const eslintrcLinter = new Linter({ configType: "eslintrc" });
const linter = new Linter({ configType: "flat" });
const AST = espree.parse("let foo = bar;", DEFAULT_CONFIG),
	TEST_CODE = "var answer = 6 * 7;",
	SHEBANG_TEST_CODE = `#!/usr/bin/env node\n${TEST_CODE}`;
const filename = "foo.js";

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

describe("SourceCode", () => {
	describe("new SourceCode()", () => {
		it("should create a new instance when called with valid data", () => {
			const ast = { comments: [], tokens: [], loc: {}, range: [] };
			const sourceCode = new SourceCode("foo;", ast);

			assert.isObject(sourceCode);
			assert.strictEqual(sourceCode.text, "foo;");
			assert.strictEqual(sourceCode.ast, ast);
		});

		it("should create a new instance when called with valid optional data", () => {
			const parserServices = {};
			const scopeManager = {};
			const visitorKeys = {};
			const ast = { comments: [], tokens: [], loc: {}, range: [] };
			const sourceCode = new SourceCode({
				text: "foo;",
				ast,
				parserServices,
				scopeManager,
				visitorKeys,
			});

			assert.isObject(sourceCode);
			assert.strictEqual(sourceCode.text, "foo;");
			assert.strictEqual(sourceCode.ast, ast);
			assert.strictEqual(sourceCode.parserServices, parserServices);
			assert.strictEqual(sourceCode.scopeManager, scopeManager);
			assert.strictEqual(sourceCode.visitorKeys, visitorKeys);
		});

		it("should split text into lines when called with valid data", () => {
			const ast = { comments: [], tokens: [], loc: {}, range: [] };
			const sourceCode = new SourceCode("foo;\nbar;", ast);

			assert.isObject(sourceCode);
			assert.strictEqual(sourceCode.lines.length, 2);
			assert.strictEqual(sourceCode.lines[0], "foo;");
			assert.strictEqual(sourceCode.lines[1], "bar;");
		});

		it("should throw an error when called with a false AST", () => {
			assert.throws(
				() => new SourceCode("foo;", false),
				/Unexpected empty AST\. \(false\)/u,
			);
		});

		it("should throw an error when called with a null AST", () => {
			assert.throws(
				() => new SourceCode("foo;", null),
				/Unexpected empty AST\. \(null\)/u,
			);
		});

		it("should throw an error when called with a undefined AST", () => {
			assert.throws(
				() => new SourceCode("foo;", void 0),
				/Unexpected empty AST\. \(undefined\)/u,
			);
		});

		it("should throw an error when called with an AST that's missing tokens", () => {
			assert.throws(
				() =>
					new SourceCode("foo;", {
						comments: [],
						loc: {},
						range: [],
					}),
				/missing the tokens array/u,
			);
		});

		it("should throw an error when called with an AST that's missing comments", () => {
			assert.throws(
				() =>
					new SourceCode("foo;", { tokens: [], loc: {}, range: [] }),
				/missing the comments array/u,
			);
		});

		it("should throw an error when called with an AST that's missing location", () => {
			assert.throws(
				() =>
					new SourceCode("foo;", {
						comments: [],
						tokens: [],
						range: [],
					}),
				/missing location information/u,
			);
		});

		it("should throw an error when called with an AST that's missing range", () => {
			assert.throws(
				() =>
					new SourceCode("foo;", {
						comments: [],
						tokens: [],
						loc: {},
					}),
				/missing range information/u,
			);
		});

		it("should store all tokens and comments sorted by range", () => {
			const comments = [{ range: [0, 2] }, { range: [10, 12] }];
			const tokens = [
				{ range: [3, 8] },
				{ range: [8, 10] },
				{ range: [12, 20] },
			];
			const sourceCode = new SourceCode("", {
				comments,
				tokens,
				loc: {},
				range: [],
			});

			const actual = sourceCode.tokensAndComments;
			const expected = [
				comments[0],
				tokens[0],
				tokens[1],
				comments[1],
				tokens[2],
			];

			assert.deepStrictEqual(actual, expected);
		});

		describe("if a text has BOM,", () => {
			let sourceCode;

			beforeEach(() => {
				const ast = { comments: [], tokens: [], loc: {}, range: [] };

				sourceCode = new SourceCode("\uFEFFconsole.log('hello');", ast);
			});

			it("should has true at `hasBOM` property.", () => {
				assert.strictEqual(sourceCode.hasBOM, true);
			});

			it("should not has BOM in `text` property.", () => {
				assert.strictEqual(sourceCode.text, "console.log('hello');");
			});
		});

		describe("if a text doesn't have BOM,", () => {
			let sourceCode;

			beforeEach(() => {
				const ast = { comments: [], tokens: [], loc: {}, range: [] };

				sourceCode = new SourceCode("console.log('hello');", ast);
			});

			it("should has false at `hasBOM` property.", () => {
				assert.strictEqual(sourceCode.hasBOM, false);
			});

			it("should not has BOM in `text` property.", () => {
				assert.strictEqual(sourceCode.text, "console.log('hello');");
			});
		});

		describe("when a text has a shebang", () => {
			let sourceCode;

			beforeEach(() => {
				const ast = {
					comments: [
						{
							type: "Line",
							value: "/usr/bin/env node",
							range: [0, 19],
						},
					],
					tokens: [],
					loc: {},
					range: [],
				};

				sourceCode = new SourceCode(SHEBANG_TEST_CODE, ast);
			});

			it('should change the type of the first comment to "Shebang"', () => {
				const firstToken = sourceCode.getAllComments()[0];

				assert.strictEqual(firstToken.type, "Shebang");
			});
		});

		describe("when a text does not have a shebang", () => {
			it("should not change the type of the first comment", () => {
				const ast = {
					comments: [
						{ type: "Line", value: "comment", range: [0, 9] },
					],
					tokens: [],
					loc: {},
					range: [],
				};
				const sourceCode = new SourceCode(
					"//comment\nconsole.log('hello');",
					ast,
				);
				const firstToken = sourceCode.getAllComments()[0];

				assert.strictEqual(firstToken.type, "Line");
			});
		});

		describe("when it read a UTF-8 file (has BOM), SourceCode", () => {
			const UTF8_FILE = path.resolve(
				__dirname,
				"../../../../fixtures/utf8-bom.js",
			);
			const text = fs
				.readFileSync(UTF8_FILE, "utf8")
				.replace(/\r\n/gu, "\n"); // <-- For autocrlf of "git for Windows"
			let sourceCode;

			beforeEach(() => {
				const ast = { comments: [], tokens: [], loc: {}, range: [] };

				sourceCode = new SourceCode(text, ast);
			});

			it("to be clear, check the file has UTF-8 BOM.", () => {
				const buffer = fs.readFileSync(UTF8_FILE);

				assert.strictEqual(buffer[0], 0xef);
				assert.strictEqual(buffer[1], 0xbb);
				assert.strictEqual(buffer[2], 0xbf);
			});

			it("should has true at `hasBOM` property.", () => {
				assert.strictEqual(sourceCode.hasBOM, true);
			});

			it("should not has BOM in `text` property.", () => {
				assert.strictEqual(
					sourceCode.text,
					'"use strict";\n\nconsole.log("This file has [0xEF, 0xBB, 0xBF] as BOM.");\n',
				);
			});
		});
	});

	describe("getJSDocComment()", () => {
		afterEach(() => {
			sinon.verifyAndRestore();
		});

		it("should not take a JSDoc comment from a FunctionDeclaration parent node when the node is a FunctionExpression", () => {
			const code = [
				"/** Desc*/",
				"function Foo(){var t = function(){}}",
			].join("\n");

			/**
			 * Check jsdoc presence
			 * @param {ASTNode} node not to check
			 * @returns {void}
			 * @private
			 */
			function assertJSDoc(node) {
				const sourceCode = linter.getSourceCode();
				const jsdoc = sourceCode.getJSDocComment(node);

				assert.strictEqual(jsdoc, null);
			}

			const spy = sinon.spy(assertJSDoc);

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create() {
									return {
										FunctionExpression: spy,
									};
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			});
			assert.isTrue(spy.calledOnce, "Event handler should be called.");
		});

		it("should not take a JSDoc comment from a VariableDeclaration parent node when the node is a FunctionExpression inside a NewExpression", () => {
			const code = ["/** Desc*/", "var x = new Foo(function(){});"].join(
				"\n",
			);

			/**
			 * Check jsdoc presence
			 * @param {ASTNode} node not to check
			 * @returns {void}
			 * @private
			 */
			function assertJSDoc(node) {
				const sourceCode = linter.getSourceCode();
				const jsdoc = sourceCode.getJSDocComment(node);

				assert.strictEqual(jsdoc, null);
			}

			const spy = sinon.spy(assertJSDoc);

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create() {
									return {
										FunctionExpression: spy,
									};
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			});
			assert.isTrue(spy.calledOnce, "Event handler should be called.");
		});

		it("should not take a JSDoc comment from a FunctionExpression parent node when the node is a FunctionExpression", () => {
			const code = [
				"/** Desc*/",
				"var f = function(){var t = function(arg){}}",
			].join("\n");

			/**
			 * Check jsdoc presence
			 * @param {ASTNode} node not to check
			 * @returns {void}
			 * @private
			 */
			function assertJSDoc(node) {
				if (node.params.length === 1) {
					const sourceCode = linter.getSourceCode();
					const jsdoc = sourceCode.getJSDocComment(node);

					assert.strictEqual(jsdoc, null);
				}
			}

			const spy = sinon.spy(assertJSDoc);

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create() {
									return {
										FunctionExpression: spy,
									};
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			});
			assert.isTrue(
				spy.calledTwice,
				"Event handler should be called twice.",
			);
		});

		it("should get JSDoc comment for FunctionExpression in a CallExpression", () => {
			const code = [
				"call(",
				"  /** Documentation. */",
				"  function(argName) {",
				"    return 'the return';",
				"  }",
				");",
			].join("\n");

			/**
			 * Check jsdoc presence
			 * @param {ASTNode} node not to check
			 * @returns {void}
			 * @private
			 */
			function assertJSDoc(node) {
				const sourceCode = linter.getSourceCode();
				const jsdoc = sourceCode.getJSDocComment(node);

				assert.strictEqual(jsdoc.type, "Block");
				assert.strictEqual(jsdoc.value, "* Documentation. ");
			}

			const spy = sinon.spy(assertJSDoc);

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create() {
									return {
										FunctionExpression: spy,
									};
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			});
			assert.isTrue(spy.calledOnce, "Event handler should be called.");
		});

		it("should get JSDoc comment for node when the node is a FunctionDeclaration", () => {
			const code = ["/** Desc*/", "function Foo(){}"].join("\n");

			/**
			 * Check jsdoc presence
			 * @param {ASTNode} node not to check
			 * @returns {void}
			 * @private
			 */
			function assertJSDoc(node) {
				const sourceCode = linter.getSourceCode();
				const jsdoc = sourceCode.getJSDocComment(node);

				assert.strictEqual(jsdoc.type, "Block");
				assert.strictEqual(jsdoc.value, "* Desc");
			}

			const spy = sinon.spy(assertJSDoc);

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create() {
									return {
										FunctionDeclaration: spy,
									};
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			});
			assert.isTrue(spy.calledOnce, "Event handler should be called.");
		});

		it("should get JSDoc comment for node when the node is a FunctionDeclaration but its parent is an export", () => {
			const code = ["/** Desc*/", "export function Foo(){}"].join("\n");

			/**
			 * Check jsdoc presence
			 * @param {ASTNode} node not to check
			 * @returns {void}
			 * @private
			 */
			function assertJSDoc(node) {
				const sourceCode = linter.getSourceCode();
				const jsdoc = sourceCode.getJSDocComment(node);

				assert.strictEqual(jsdoc.type, "Block");
				assert.strictEqual(jsdoc.value, "* Desc");
			}

			const spy = sinon.spy(assertJSDoc);

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create() {
									return {
										FunctionDeclaration: spy,
									};
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			});
			assert.isTrue(spy.calledOnce, "Event handler should be called.");
		});

		it("should get JSDoc comment for node when the node is a FunctionDeclaration but not the first statement", () => {
			const code = [
				"'use strict';",
				"/** Desc*/",
				"function Foo(){}",
			].join("\n");

			/**
			 * Check jsdoc presence
			 * @param {ASTNode} node not to check
			 * @returns {void}
			 * @private
			 */
			function assertJSDoc(node) {
				const sourceCode = linter.getSourceCode();
				const jsdoc = sourceCode.getJSDocComment(node);

				assert.strictEqual(jsdoc.type, "Block");
				assert.strictEqual(jsdoc.value, "* Desc");
			}

			const spy = sinon.spy(assertJSDoc);

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create() {
									return {
										FunctionDeclaration: spy,
									};
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			});
			assert.isTrue(spy.calledOnce, "Event handler should be called.");
		});

		it("should not get JSDoc comment for node when the node is a FunctionDeclaration inside of an IIFE without a JSDoc comment", () => {
			const code = [
				"/** Desc*/",
				"(function(){",
				"function Foo(){}",
				"}())",
			].join("\n");

			/**
			 * Check jsdoc presence
			 * @param {ASTNode} node not to check
			 * @returns {void}
			 * @private
			 */
			function assertJSDoc(node) {
				const sourceCode = linter.getSourceCode();
				const jsdoc = sourceCode.getJSDocComment(node);

				assert.isNull(jsdoc);
			}

			const spy = sinon.spy(assertJSDoc);

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create() {
									return {
										FunctionDeclaration: spy,
									};
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			});
			assert.isTrue(spy.calledOnce, "Event handler should be called.");
		});

		it("should get JSDoc comment for node when the node is a FunctionDeclaration and there are multiple comments", () => {
			const code = [
				"/* Code is good */",
				"/** Desc*/",
				"function Foo(){}",
			].join("\n");

			/**
			 * Check jsdoc presence
			 * @param {ASTNode} node not to check
			 * @returns {void}
			 * @private
			 */
			function assertJSDoc(node) {
				const sourceCode = linter.getSourceCode();
				const jsdoc = sourceCode.getJSDocComment(node);

				assert.strictEqual(jsdoc.type, "Block");
				assert.strictEqual(jsdoc.value, "* Desc");
			}

			const spy = sinon.spy(assertJSDoc);

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create() {
									return {
										FunctionDeclaration: spy,
									};
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			});
			assert.isTrue(spy.calledOnce, "Event handler should be called.");
		});

		it("should get JSDoc comment for node when the node is a FunctionDeclaration inside of an IIFE", () => {
			const code = [
				"/** Code is good */",
				"(function() {",
				"/** Desc*/",
				"function Foo(){}",
				"}())",
			].join("\n");

			/**
			 * Check jsdoc presence
			 * @param {ASTNode} node not to check
			 * @returns {void}
			 * @private
			 */
			function assertJSDoc(node) {
				const sourceCode = linter.getSourceCode();
				const jsdoc = sourceCode.getJSDocComment(node);

				assert.strictEqual(jsdoc.type, "Block");
				assert.strictEqual(jsdoc.value, "* Desc");
			}

			const spy = sinon.spy(assertJSDoc);

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create() {
									return {
										FunctionDeclaration: spy,
									};
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			});
			assert.isTrue(spy.calledOnce, "Event handler should be called.");
		});

		it("should get JSDoc comment for node when the node is a FunctionExpression inside of an object literal", () => {
			const code = [
				"/** Code is good */",
				"var o = {",
				"/** Desc*/",
				"foo: function(){}",
				"};",
			].join("\n");

			/**
			 * Check jsdoc presence
			 * @param {ASTNode} node not to check
			 * @returns {void}
			 * @private
			 */
			function assertJSDoc(node) {
				const sourceCode = linter.getSourceCode();
				const jsdoc = sourceCode.getJSDocComment(node);

				assert.strictEqual(jsdoc.type, "Block");
				assert.strictEqual(jsdoc.value, "* Desc");
			}

			const spy = sinon.spy(assertJSDoc);

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create() {
									return {
										FunctionExpression: spy,
									};
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			});
			assert.isTrue(spy.calledOnce, "Event handler should be called.");
		});

		it("should get JSDoc comment for node when the node is a ArrowFunctionExpression inside of an object literal", () => {
			const code = [
				"/** Code is good */",
				"var o = {",
				"/** Desc*/",
				"foo: () => {}",
				"};",
			].join("\n");

			/**
			 * Check jsdoc presence
			 * @param {ASTNode} node not to check
			 * @returns {void}
			 * @private
			 */
			function assertJSDoc(node) {
				const sourceCode = linter.getSourceCode();
				const jsdoc = sourceCode.getJSDocComment(node);

				assert.strictEqual(jsdoc.type, "Block");
				assert.strictEqual(jsdoc.value, "* Desc");
			}

			const spy = sinon.spy(assertJSDoc);

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create() {
									return {
										ArrowFunctionExpression: spy,
									};
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			});
			assert.isTrue(spy.calledOnce, "Event handler should be called.");
		});

		it("should get JSDoc comment for node when the node is a FunctionExpression in an assignment", () => {
			const code = [
				"/** Code is good */",
				"/** Desc*/",
				"Foo.bar = function(){}",
			].join("\n");

			/**
			 * Check jsdoc presence
			 * @param {ASTNode} node not to check
			 * @returns {void}
			 * @private
			 */
			function assertJSDoc(node) {
				const sourceCode = linter.getSourceCode();
				const jsdoc = sourceCode.getJSDocComment(node);

				assert.strictEqual(jsdoc.type, "Block");
				assert.strictEqual(jsdoc.value, "* Desc");
			}

			const spy = sinon.spy(assertJSDoc);

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create() {
									return {
										FunctionExpression: spy,
									};
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			});
			assert.isTrue(spy.calledOnce, "Event handler should be called.");
		});

		it("should get JSDoc comment for node when the node is a FunctionExpression in an assignment inside an IIFE", () => {
			const code = [
				"/** Code is good */",
				"(function iife() {",
				"/** Desc*/",
				"Foo.bar = function(){}",
				"}());",
			].join("\n");

			/**
			 * Check jsdoc presence
			 * @param {ASTNode} node not to check
			 * @returns {void}
			 * @private
			 */
			function assertJSDoc(node) {
				if (!node.id) {
					const sourceCode = linter.getSourceCode();
					const jsdoc = sourceCode.getJSDocComment(node);

					assert.strictEqual(jsdoc.type, "Block");
					assert.strictEqual(jsdoc.value, "* Desc");
				}
			}

			const spy = sinon.spy(assertJSDoc);

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create() {
									return {
										FunctionExpression: spy,
									};
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			});
			assert.isTrue(spy.calledTwice, "Event handler should be called.");
		});

		it("should not get JSDoc comment for node when the node is a FunctionExpression in an assignment inside an IIFE without a JSDoc comment", () => {
			const code = [
				"/** Code is good */",
				"(function iife() {",
				"//* whatever",
				"Foo.bar = function(){}",
				"}());",
			].join("\n");

			/**
			 * Check jsdoc presence
			 * @param {ASTNode} node not to check
			 * @returns {void}
			 * @private
			 */
			function assertJSDoc(node) {
				if (!node.id) {
					const sourceCode = linter.getSourceCode();
					const jsdoc = sourceCode.getJSDocComment(node);

					assert.isNull(jsdoc);
				}
			}

			const spy = sinon.spy(assertJSDoc);

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create() {
									return {
										FunctionExpression: spy,
									};
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			});
			assert.isTrue(spy.calledTwice, "Event handler should be called.");
		});

		it("should not get JSDoc comment for node when the node is a FunctionExpression inside of a CallExpression", () => {
			const code = [
				"/** Code is good */",
				"module.exports = (function() {",
				"}());",
			].join("\n");

			/**
			 * Check jsdoc presence
			 * @param {ASTNode} node not to check
			 * @returns {void}
			 * @private
			 */
			function assertJSDoc(node) {
				if (!node.id) {
					const sourceCode = linter.getSourceCode();
					const jsdoc = sourceCode.getJSDocComment(node);

					assert.isNull(jsdoc);
				}
			}

			const spy = sinon.spy(assertJSDoc);

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create() {
									return {
										FunctionExpression: spy,
									};
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			});
			assert.isTrue(spy.calledOnce, "Event handler should be called.");
		});

		it("should not get JSDoc comment for node when the node is a FunctionExpression in an assignment inside an IIFE without a JSDoc comment", () => {
			const code = [
				"/**",
				" * Merges two objects together.",
				" * @param {Object} target of the cloning operation",
				" * @param {Object} [source] object",
				" * @returns {void}",
				" */",
				"exports.mixin = function(target, source) {",
				"    Object.keys(source).forEach(function forEach(key) {",
				"        target[key] = source[key];",
				"    });",
				"};",
			].join("\n");

			/**
			 * Check jsdoc presence
			 * @param {ASTNode} node not to check
			 * @returns {void}
			 * @private
			 */
			function assertJSDoc(node) {
				if (node.id) {
					const sourceCode = linter.getSourceCode();
					const jsdoc = sourceCode.getJSDocComment(node);

					assert.isNull(jsdoc);
				}
			}

			const spy = sinon.spy(assertJSDoc);

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create() {
									return {
										FunctionExpression: spy,
									};
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			});
			assert.isTrue(spy.calledTwice, "Event handler should be called.");
		});

		it("should get JSDoc comment for node when the node is a ClassExpression", () => {
			const code = [
				"/** Merges two objects together.*/",
				"var A = class {",
				"};",
			].join("\n");

			/**
			 * Check jsdoc presence
			 * @param {ASTNode} node not to check
			 * @returns {void}
			 * @private
			 */
			function assertJSDoc(node) {
				const sourceCode = linter.getSourceCode();
				const jsdoc = sourceCode.getJSDocComment(node);

				assert.strictEqual(jsdoc.type, "Block");
				assert.strictEqual(
					jsdoc.value,
					"* Merges two objects together.",
				);
			}

			const spy = sinon.spy(assertJSDoc);

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create() {
									return {
										ClassExpression: spy,
									};
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			});
			assert.isTrue(spy.calledOnce, "Event handler should be called.");
		});

		it("should get JSDoc comment for node when the node is a ClassDeclaration", () => {
			const code = [
				"/** Merges two objects together.*/",
				"class A {",
				"};",
			].join("\n");

			/**
			 * Check jsdoc presence
			 * @param {ASTNode} node not to check
			 * @returns {void}
			 * @private
			 */
			function assertJSDoc(node) {
				const sourceCode = linter.getSourceCode();
				const jsdoc = sourceCode.getJSDocComment(node);

				assert.strictEqual(jsdoc.type, "Block");
				assert.strictEqual(
					jsdoc.value,
					"* Merges two objects together.",
				);
			}

			const spy = sinon.spy(assertJSDoc);

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create() {
									return {
										ClassDeclaration: spy,
									};
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			});
			assert.isTrue(spy.calledOnce, "Event handler should be called.");
		});

		it("should not get JSDoc comment for class method even if the class has jsdoc present", () => {
			const code = [
				"/** Merges two objects together.*/",
				"var A = class {",
				"    constructor(xs) {}",
				"};",
			].join("\n");

			/**
			 * Check jsdoc presence
			 * @param {ASTNode} node not to check
			 * @returns {void}
			 * @private
			 */
			function assertJSDoc(node) {
				const sourceCode = linter.getSourceCode();
				const jsdoc = sourceCode.getJSDocComment(node);

				assert.isNull(jsdoc);
			}

			const spy = sinon.spy(assertJSDoc);

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create() {
									return {
										FunctionExpression: spy,
									};
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			});
			assert.isTrue(spy.calledOnce, "Event handler should be called.");
		});

		it("should get JSDoc comment for function expression even if function has blank lines on top", () => {
			const code = [
				"/** Merges two objects together.*/",
				"var A = ",
				" ",
				" ",
				" ",
				"     function() {",
				"};",
			].join("\n");

			/**
			 * Check jsdoc presence
			 * @param {ASTNode} node not to check
			 * @returns {void}
			 * @private
			 */
			function assertJSDoc(node) {
				const sourceCode = linter.getSourceCode();
				const jsdoc = sourceCode.getJSDocComment(node);

				assert.strictEqual(jsdoc.type, "Block");
				assert.strictEqual(
					jsdoc.value,
					"* Merges two objects together.",
				);
			}

			const spy = sinon.spy(assertJSDoc);

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create() {
									return {
										FunctionExpression: spy,
									};
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			});
			assert.isTrue(spy.calledOnce, "Event handler should be called.");
		});

		it("should not get JSDoc comment for function declaration when the function has blank lines on top", () => {
			const code = [
				"/** Merges two objects together.*/",
				" ",
				" ",
				" ",
				"function test() {",
				"};",
			].join("\n");

			/**
			 * Check jsdoc presence
			 * @param {ASTNode} node not to check
			 * @returns {void}
			 * @private
			 */
			function assertJSDoc(node) {
				const sourceCode = linter.getSourceCode();
				const jsdoc = sourceCode.getJSDocComment(node);

				assert.isNull(jsdoc);
			}

			const spy = sinon.spy(assertJSDoc);

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create() {
									return {
										FunctionDeclaration: spy,
									};
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			});
			assert.isTrue(spy.calledOnce, "Event handler should be called.");
		});
	});

	describe("getLines()", () => {
		it("should get proper lines when using \\n as a line break", () => {
			const code = "a;\nb;",
				ast = espree.parse(code, DEFAULT_CONFIG),
				sourceCode = new SourceCode(code, ast);

			const lines = sourceCode.getLines();

			assert.strictEqual(lines[0], "a;");
			assert.strictEqual(lines[1], "b;");
		});

		it("should get proper lines when using \\r\\n as a line break", () => {
			const code = "a;\r\nb;",
				ast = espree.parse(code, DEFAULT_CONFIG),
				sourceCode = new SourceCode(code, ast);

			const lines = sourceCode.getLines();

			assert.strictEqual(lines[0], "a;");
			assert.strictEqual(lines[1], "b;");
		});

		it("should get proper lines when using \\r as a line break", () => {
			const code = "a;\rb;",
				ast = espree.parse(code, DEFAULT_CONFIG),
				sourceCode = new SourceCode(code, ast);

			const lines = sourceCode.getLines();

			assert.strictEqual(lines[0], "a;");
			assert.strictEqual(lines[1], "b;");
		});

		it("should get proper lines when using \\u2028 as a line break", () => {
			const code = "a;\u2028b;",
				ast = espree.parse(code, DEFAULT_CONFIG),
				sourceCode = new SourceCode(code, ast);

			const lines = sourceCode.getLines();

			assert.strictEqual(lines[0], "a;");
			assert.strictEqual(lines[1], "b;");
		});

		it("should get proper lines when using \\u2029 as a line break", () => {
			const code = "a;\u2029b;",
				ast = espree.parse(code, DEFAULT_CONFIG),
				sourceCode = new SourceCode(code, ast);

			const lines = sourceCode.getLines();

			assert.strictEqual(lines[0], "a;");
			assert.strictEqual(lines[1], "b;");
		});
	});

	describe("getText()", () => {
		let sourceCode, ast;

		describe("when text begins with a shebang", () => {
			it("should retrieve unaltered shebang text", () => {
				// Shebangs are normalized to line comments before parsing.
				ast = espree.parse(
					SHEBANG_TEST_CODE.replace(
						astUtils.shebangPattern,
						(match, captured) => `//${captured}`,
					),
					DEFAULT_CONFIG,
				);
				sourceCode = new SourceCode(SHEBANG_TEST_CODE, ast);

				const shebangToken = sourceCode.getAllComments()[0];
				const shebangText = sourceCode.getText(shebangToken);

				assert.strictEqual(shebangToken.type, "Shebang");
				assert.strictEqual(shebangText, "#!/usr/bin/env node");
			});
		});

		beforeEach(() => {
			ast = espree.parse(TEST_CODE, DEFAULT_CONFIG);
			sourceCode = new SourceCode(TEST_CODE, ast);
		});

		it("should retrieve all text when used without parameters", () => {
			const text = sourceCode.getText();

			assert.strictEqual(text, TEST_CODE);
		});

		it("should retrieve all text for root node", () => {
			const text = sourceCode.getText(ast);

			assert.strictEqual(text, TEST_CODE);
		});

		it("should clamp to valid range when retrieving characters before start of source", () => {
			const text = sourceCode.getText(ast, 2, 0);

			assert.strictEqual(text, TEST_CODE);
		});

		it("should retrieve all text for binary expression", () => {
			const node = ast.body[0].declarations[0].init;
			const text = sourceCode.getText(node);

			assert.strictEqual(text, "6 * 7");
		});

		it("should retrieve all text plus two characters before for binary expression", () => {
			const node = ast.body[0].declarations[0].init;
			const text = sourceCode.getText(node, 2);

			assert.strictEqual(text, "= 6 * 7");
		});

		it("should retrieve all text plus one character after for binary expression", () => {
			const node = ast.body[0].declarations[0].init;
			const text = sourceCode.getText(node, 0, 1);

			assert.strictEqual(text, "6 * 7;");
		});

		it("should retrieve all text plus two characters before and one character after for binary expression", () => {
			const node = ast.body[0].declarations[0].init;
			const text = sourceCode.getText(node, 2, 1);

			assert.strictEqual(text, "= 6 * 7;");
		});
	});

	describe("getNodeByRangeIndex()", () => {
		let sourceCode;

		beforeEach(() => {
			const ast = espree.parse(TEST_CODE, DEFAULT_CONFIG);

			sourceCode = new SourceCode(TEST_CODE, ast);
		});

		it("should retrieve a node starting at the given index", () => {
			const node = sourceCode.getNodeByRangeIndex(4);

			assert.strictEqual(node.type, "Identifier");
		});

		it("should retrieve a node containing the given index", () => {
			const node = sourceCode.getNodeByRangeIndex(6);

			assert.strictEqual(node.type, "Identifier");
		});

		it("should retrieve a node that is exactly the given index", () => {
			const node = sourceCode.getNodeByRangeIndex(13);

			assert.strictEqual(node.type, "Literal");
			assert.strictEqual(node.value, 6);
		});

		it("should retrieve a node ending with the given index", () => {
			const node = sourceCode.getNodeByRangeIndex(9);

			assert.strictEqual(node.type, "Identifier");
		});

		it("should retrieve the deepest node containing the given index", () => {
			let node = sourceCode.getNodeByRangeIndex(14);

			assert.strictEqual(node.type, "BinaryExpression");
			node = sourceCode.getNodeByRangeIndex(3);
			assert.strictEqual(node.type, "VariableDeclaration");
		});

		it("should return null if the index is outside the range of any node", () => {
			let node = sourceCode.getNodeByRangeIndex(-1);

			assert.isNull(node);
			node = sourceCode.getNodeByRangeIndex(-99);
			assert.isNull(node);
		});
	});

	describe("isSpaceBetween()", () => {
		describe("should return true when there is at least one whitespace character between two tokens", () => {
			[
				["let foo", true],
				["let  foo", true],
				["let /**/ foo", true],
				["let/**/foo", false],
				["let/*\n*/foo", false],
			].forEach(([code, expected]) => {
				describe("when the first given is located before the second", () => {
					it(code, () => {
						const ast = espree.parse(code, DEFAULT_CONFIG),
							sourceCode = new SourceCode(code, ast);

						assert.strictEqual(
							sourceCode.isSpaceBetween(
								sourceCode.ast.tokens[0],
								sourceCode.ast.tokens.at(-1),
							),
							expected,
						);
					});
				});

				describe("when the first given is located after the second", () => {
					it(code, () => {
						const ast = espree.parse(code, DEFAULT_CONFIG),
							sourceCode = new SourceCode(code, ast);

						assert.strictEqual(
							sourceCode.isSpaceBetween(
								sourceCode.ast.tokens.at(-1),
								sourceCode.ast.tokens[0],
							),
							expected,
						);
					});
				});
			});

			[
				["a+b", false],
				["a +b", true],
				["a/**/+b", false],
				["a/* */+b", false],
				["a/**/ +b", true],
				["a/**/ /**/+b", true],
				["a/* */ /* */+b", true],
				["a/**/\n/**/+b", true],
				["a/* */\n/* */+b", true],
				["a/**/+b/**/+c", false],
				["a/* */+b/* */+c", false],
				["a/**/+b /**/+c", true],
				["a/* */+b /* */+c", true],
				["a/**/ +b/**/+c", true],
				["a/* */ +b/* */+c", true],
				["a/**/+b\t/**/+c", true],
				["a/* */+b\t/* */+c", true],
				["a/**/\t+b/**/+c", true],
				["a/* */\t+b/* */+c", true],
				["a/**/+b\n/**/+c", true],
				["a/* */+b\n/* */+c", true],
				["a/**/\n+b/**/+c", true],
				["a/* */\n+b/* */+c", true],
				["a/* */+' /**/ '/* */+c", false],
				["a/* */+ ' /**/ '/* */+c", true],
				["a/* */+' /**/ ' /* */+c", true],
				["a/* */+ ' /**/ ' /* */+c", true],
				["a/* */+` /*\n*/ `/* */+c", false],
				["a/* */+ ` /*\n*/ `/* */+c", true],
				["a/* */+` /*\n*/ ` /* */+c", true],
				["a/* */+ ` /*\n*/ ` /* */+c", true],
			].forEach(([code, expected]) => {
				describe("when the first given is located before the second", () => {
					it(code, () => {
						const ast = espree.parse(code, DEFAULT_CONFIG),
							sourceCode = new SourceCode(code, ast);

						assert.strictEqual(
							sourceCode.isSpaceBetween(
								sourceCode.ast.tokens[0],
								sourceCode.ast.tokens.at(-2),
							),
							expected,
						);
					});
				});

				describe("when the first given is located after the second", () => {
					it(code, () => {
						const ast = espree.parse(code, DEFAULT_CONFIG),
							sourceCode = new SourceCode(code, ast);

						assert.strictEqual(
							sourceCode.isSpaceBetween(
								sourceCode.ast.tokens.at(-2),
								sourceCode.ast.tokens[0],
							),
							expected,
						);
					});
				});
			});
		});

		describe("should return true when there is at least one whitespace character between a token and a node", () => {
			[
				[";let foo = bar", false],
				[";/**/let foo = bar", false],
				[";/* */let foo = bar", false],
				["; let foo = bar", true],
				["; let foo = bar", true],
				["; /**/let foo = bar", true],
				["; /* */let foo = bar", true],
				[";/**/ let foo = bar", true],
				[";/* */ let foo = bar", true],
				["; /**/ let foo = bar", true],
				["; /* */ let foo = bar", true],
				[";\tlet foo = bar", true],
				[";\tlet foo = bar", true],
				[";\t/**/let foo = bar", true],
				[";\t/* */let foo = bar", true],
				[";/**/\tlet foo = bar", true],
				[";/* */\tlet foo = bar", true],
				[";\t/**/\tlet foo = bar", true],
				[";\t/* */\tlet foo = bar", true],
				[";\nlet foo = bar", true],
				[";\nlet foo = bar", true],
				[";\n/**/let foo = bar", true],
				[";\n/* */let foo = bar", true],
				[";/**/\nlet foo = bar", true],
				[";/* */\nlet foo = bar", true],
				[";\n/**/\nlet foo = bar", true],
				[";\n/* */\nlet foo = bar", true],
			].forEach(([code, expected]) => {
				describe("when the first given is located before the second", () => {
					it(code, () => {
						const ast = espree.parse(code, DEFAULT_CONFIG),
							sourceCode = new SourceCode(code, ast);

						assert.strictEqual(
							sourceCode.isSpaceBetween(
								sourceCode.ast.tokens[0],
								sourceCode.ast.body.at(-1),
							),
							expected,
						);
					});
				});

				describe("when the first given is located after the second", () => {
					it(code, () => {
						const ast = espree.parse(code, DEFAULT_CONFIG),
							sourceCode = new SourceCode(code, ast);

						assert.strictEqual(
							sourceCode.isSpaceBetween(
								sourceCode.ast.body.at(-1),
								sourceCode.ast.tokens[0],
							),
							expected,
						);
					});
				});
			});
		});

		describe("should return true when there is at least one whitespace character between a node and a token", () => {
			[
				["let foo = bar;;", false],
				["let foo = bar;;;", false],
				["let foo = 1; let bar = 2;;", true],
				["let foo = bar;/**/;", false],
				["let foo = bar;/* */;", false],
				["let foo = bar;;;", false],
				["let foo = bar; ;", true],
				["let foo = bar; /**/;", true],
				["let foo = bar; /* */;", true],
				["let foo = bar;/**/ ;", true],
				["let foo = bar;/* */ ;", true],
				["let foo = bar; /**/ ;", true],
				["let foo = bar; /* */ ;", true],
				["let foo = bar;\t;", true],
				["let foo = bar;\t/**/;", true],
				["let foo = bar;\t/* */;", true],
				["let foo = bar;/**/\t;", true],
				["let foo = bar;/* */\t;", true],
				["let foo = bar;\t/**/\t;", true],
				["let foo = bar;\t/* */\t;", true],
				["let foo = bar;\n;", true],
				["let foo = bar;\n/**/;", true],
				["let foo = bar;\n/* */;", true],
				["let foo = bar;/**/\n;", true],
				["let foo = bar;/* */\n;", true],
				["let foo = bar;\n/**/\n;", true],
				["let foo = bar;\n/* */\n;", true],
			].forEach(([code, expected]) => {
				describe("when the first given is located before the second", () => {
					it(code, () => {
						const ast = espree.parse(code, DEFAULT_CONFIG),
							sourceCode = new SourceCode(code, ast);

						assert.strictEqual(
							sourceCode.isSpaceBetween(
								sourceCode.ast.body[0],
								sourceCode.ast.tokens.at(-1),
							),
							expected,
						);
					});
				});

				describe("when the first given is located after the second", () => {
					it(code, () => {
						const ast = espree.parse(code, DEFAULT_CONFIG),
							sourceCode = new SourceCode(code, ast);

						assert.strictEqual(
							sourceCode.isSpaceBetween(
								sourceCode.ast.tokens.at(-1),
								sourceCode.ast.body[0],
							),
							expected,
						);
					});
				});
			});
		});

		describe("should return true when there is at least one whitespace character between two nodes", () => {
			[
				["let foo = bar;let baz = qux;", false],
				["let foo = bar;/**/let baz = qux;", false],
				["let foo = bar;/* */let baz = qux;", false],
				["let foo = bar; let baz = qux;", true],
				["let foo = bar; /**/let baz = qux;", true],
				["let foo = bar; /* */let baz = qux;", true],
				["let foo = bar;/**/ let baz = qux;", true],
				["let foo = bar;/* */ let baz = qux;", true],
				["let foo = bar; /**/ let baz = qux;", true],
				["let foo = bar; /* */ let baz = qux;", true],
				["let foo = bar;\tlet baz = qux;", true],
				["let foo = bar;\t/**/let baz = qux;", true],
				["let foo = bar;\t/* */let baz = qux;", true],
				["let foo = bar;/**/\tlet baz = qux;", true],
				["let foo = bar;/* */\tlet baz = qux;", true],
				["let foo = bar;\t/**/\tlet baz = qux;", true],
				["let foo = bar;\t/* */\tlet baz = qux;", true],
				["let foo = bar;\nlet baz = qux;", true],
				["let foo = bar;\n/**/let baz = qux;", true],
				["let foo = bar;\n/* */let baz = qux;", true],
				["let foo = bar;/**/\nlet baz = qux;", true],
				["let foo = bar;/* */\nlet baz = qux;", true],
				["let foo = bar;\n/**/\nlet baz = qux;", true],
				["let foo = bar;\n/* */\nlet baz = qux;", true],
				["let foo = 1;let foo2 = 2; let foo3 = 3;", true],
			].forEach(([code, expected]) => {
				describe("when the first given is located before the second", () => {
					it(code, () => {
						const ast = espree.parse(code, DEFAULT_CONFIG),
							sourceCode = new SourceCode(code, ast);

						assert.strictEqual(
							sourceCode.isSpaceBetween(
								sourceCode.ast.body[0],
								sourceCode.ast.body.at(-1),
							),
							expected,
						);
					});
				});

				describe("when the first given is located after the second", () => {
					it(code, () => {
						const ast = espree.parse(code, DEFAULT_CONFIG),
							sourceCode = new SourceCode(code, ast);

						assert.strictEqual(
							sourceCode.isSpaceBetween(
								sourceCode.ast.body.at(-1),
								sourceCode.ast.body[0],
							),
							expected,
						);
					});
				});
			});

			it("JSXText tokens that contain only whitespaces should NOT be handled as space", () => {
				const code = "let jsx = <div>\n   {content}\n</div>";
				const ast = espree.parse(code, {
					...DEFAULT_CONFIG,
					ecmaFeatures: { jsx: true },
				});
				const sourceCode = new SourceCode(code, ast);
				const jsx = ast.body[0].declarations[0].init;
				const interpolation = jsx.children[1];

				assert.strictEqual(
					sourceCode.isSpaceBetween(
						jsx.openingElement,
						interpolation,
					),
					false,
				);
				assert.strictEqual(
					sourceCode.isSpaceBetween(
						interpolation,
						jsx.closingElement,
					),
					false,
				);

				// Reversed order
				assert.strictEqual(
					sourceCode.isSpaceBetween(
						interpolation,
						jsx.openingElement,
					),
					false,
				);
				assert.strictEqual(
					sourceCode.isSpaceBetween(
						jsx.closingElement,
						interpolation,
					),
					false,
				);
			});

			it("JSXText tokens that contain both letters and whitespaces should NOT be handled as space", () => {
				const code = "let jsx = <div>\n   Hello\n</div>";
				const ast = espree.parse(code, {
					...DEFAULT_CONFIG,
					ecmaFeatures: { jsx: true },
				});
				const sourceCode = new SourceCode(code, ast);
				const jsx = ast.body[0].declarations[0].init;

				assert.strictEqual(
					sourceCode.isSpaceBetween(
						jsx.openingElement,
						jsx.closingElement,
					),
					false,
				);

				// Reversed order
				assert.strictEqual(
					sourceCode.isSpaceBetween(
						jsx.closingElement,
						jsx.openingElement,
					),
					false,
				);
			});

			it("JSXText tokens that contain only letters should NOT be handled as space", () => {
				const code = "let jsx = <div>Hello</div>";
				const ast = espree.parse(code, {
					...DEFAULT_CONFIG,
					ecmaFeatures: { jsx: true },
				});
				const sourceCode = new SourceCode(code, ast);
				const jsx = ast.body[0].declarations[0].init;

				assert.strictEqual(
					sourceCode.isSpaceBetween(
						jsx.openingElement,
						jsx.closingElement,
					),
					false,
				);

				// Reversed order
				assert.strictEqual(
					sourceCode.isSpaceBetween(
						jsx.closingElement,
						jsx.openingElement,
					),
					false,
				);
			});
		});

		describe("should return false either of the arguments' location is inside the other one", () => {
			[["let foo = bar;", false]].forEach(([code, expected]) => {
				it(code, () => {
					const ast = espree.parse(code, DEFAULT_CONFIG),
						sourceCode = new SourceCode(code, ast);

					assert.strictEqual(
						sourceCode.isSpaceBetween(
							sourceCode.ast.tokens[0],
							sourceCode.ast.body[0],
						),
						expected,
					);

					assert.strictEqual(
						sourceCode.isSpaceBetween(
							sourceCode.ast.tokens.at(-1),
							sourceCode.ast.body[0],
						),
						expected,
					);

					assert.strictEqual(
						sourceCode.isSpaceBetween(
							sourceCode.ast.body[0],
							sourceCode.ast.tokens[0],
						),
						expected,
					);

					assert.strictEqual(
						sourceCode.isSpaceBetween(
							sourceCode.ast.body[0],
							sourceCode.ast.tokens.at(-1),
						),
						expected,
					);
				});
			});
		});
	});

	describe("isSpaceBetweenTokens()", () => {
		describe("should return true when there is at least one whitespace character between two tokens", () => {
			[
				["let foo", true],
				["let  foo", true],
				["let /**/ foo", true],
				["let/**/foo", false],
				["let/*\n*/foo", false],
			].forEach(([code, expected]) => {
				describe("when the first given is located before the second", () => {
					it(code, () => {
						const ast = espree.parse(code, DEFAULT_CONFIG),
							sourceCode = new SourceCode(code, ast);

						assert.strictEqual(
							sourceCode.isSpaceBetweenTokens(
								sourceCode.ast.tokens[0],
								sourceCode.ast.tokens.at(-1),
							),
							expected,
						);
					});
				});

				describe("when the first given is located after the second", () => {
					it(code, () => {
						const ast = espree.parse(code, DEFAULT_CONFIG),
							sourceCode = new SourceCode(code, ast);

						assert.strictEqual(
							sourceCode.isSpaceBetweenTokens(
								sourceCode.ast.tokens.at(-1),
								sourceCode.ast.tokens[0],
							),
							expected,
						);
					});
				});
			});

			[
				["a+b", false],
				["a +b", true],
				["a/**/+b", false],
				["a/* */+b", false],
				["a/**/ +b", true],
				["a/**/ /**/+b", true],
				["a/* */ /* */+b", true],
				["a/**/\n/**/+b", true],
				["a/* */\n/* */+b", true],
				["a/**/+b/**/+c", false],
				["a/* */+b/* */+c", false],
				["a/**/+b /**/+c", true],
				["a/* */+b /* */+c", true],
				["a/**/ +b/**/+c", true],
				["a/* */ +b/* */+c", true],
				["a/**/+b\t/**/+c", true],
				["a/* */+b\t/* */+c", true],
				["a/**/\t+b/**/+c", true],
				["a/* */\t+b/* */+c", true],
				["a/**/+b\n/**/+c", true],
				["a/* */+b\n/* */+c", true],
				["a/**/\n+b/**/+c", true],
				["a/* */\n+b/* */+c", true],
				["a/* */+' /**/ '/* */+c", false],
				["a/* */+ ' /**/ '/* */+c", true],
				["a/* */+' /**/ ' /* */+c", true],
				["a/* */+ ' /**/ ' /* */+c", true],
				["a/* */+` /*\n*/ `/* */+c", false],
				["a/* */+ ` /*\n*/ `/* */+c", true],
				["a/* */+` /*\n*/ ` /* */+c", true],
				["a/* */+ ` /*\n*/ ` /* */+c", true],
			].forEach(([code, expected]) => {
				describe("when the first given is located before the second", () => {
					it(code, () => {
						const ast = espree.parse(code, DEFAULT_CONFIG),
							sourceCode = new SourceCode(code, ast);

						assert.strictEqual(
							sourceCode.isSpaceBetweenTokens(
								sourceCode.ast.tokens[0],
								sourceCode.ast.tokens.at(-2),
							),
							expected,
						);
					});
				});

				describe("when the first given is located after the second", () => {
					it(code, () => {
						const ast = espree.parse(code, DEFAULT_CONFIG),
							sourceCode = new SourceCode(code, ast);

						assert.strictEqual(
							sourceCode.isSpaceBetweenTokens(
								sourceCode.ast.tokens.at(-2),
								sourceCode.ast.tokens[0],
							),
							expected,
						);
					});
				});
			});
		});

		describe("should return true when there is at least one whitespace character between a token and a node", () => {
			[
				[";let foo = bar", false],
				[";/**/let foo = bar", false],
				[";/* */let foo = bar", false],
				["; let foo = bar", true],
				["; let foo = bar", true],
				["; /**/let foo = bar", true],
				["; /* */let foo = bar", true],
				[";/**/ let foo = bar", true],
				[";/* */ let foo = bar", true],
				["; /**/ let foo = bar", true],
				["; /* */ let foo = bar", true],
				[";\tlet foo = bar", true],
				[";\tlet foo = bar", true],
				[";\t/**/let foo = bar", true],
				[";\t/* */let foo = bar", true],
				[";/**/\tlet foo = bar", true],
				[";/* */\tlet foo = bar", true],
				[";\t/**/\tlet foo = bar", true],
				[";\t/* */\tlet foo = bar", true],
				[";\nlet foo = bar", true],
				[";\nlet foo = bar", true],
				[";\n/**/let foo = bar", true],
				[";\n/* */let foo = bar", true],
				[";/**/\nlet foo = bar", true],
				[";/* */\nlet foo = bar", true],
				[";\n/**/\nlet foo = bar", true],
				[";\n/* */\nlet foo = bar", true],
			].forEach(([code, expected]) => {
				describe("when the first given is located before the second", () => {
					it(code, () => {
						const ast = espree.parse(code, DEFAULT_CONFIG),
							sourceCode = new SourceCode(code, ast);

						assert.strictEqual(
							sourceCode.isSpaceBetweenTokens(
								sourceCode.ast.tokens[0],
								sourceCode.ast.body.at(-1),
							),
							expected,
						);
					});
				});

				describe("when the first given is located after the second", () => {
					it(code, () => {
						const ast = espree.parse(code, DEFAULT_CONFIG),
							sourceCode = new SourceCode(code, ast);

						assert.strictEqual(
							sourceCode.isSpaceBetweenTokens(
								sourceCode.ast.body.at(-1),
								sourceCode.ast.tokens[0],
							),
							expected,
						);
					});
				});
			});
		});

		describe("should return true when there is at least one whitespace character between a node and a token", () => {
			[
				["let foo = bar;;", false],
				["let foo = bar;;;", false],
				["let foo = 1; let bar = 2;;", true],
				["let foo = bar;/**/;", false],
				["let foo = bar;/* */;", false],
				["let foo = bar;;;", false],
				["let foo = bar; ;", true],
				["let foo = bar; /**/;", true],
				["let foo = bar; /* */;", true],
				["let foo = bar;/**/ ;", true],
				["let foo = bar;/* */ ;", true],
				["let foo = bar; /**/ ;", true],
				["let foo = bar; /* */ ;", true],
				["let foo = bar;\t;", true],
				["let foo = bar;\t/**/;", true],
				["let foo = bar;\t/* */;", true],
				["let foo = bar;/**/\t;", true],
				["let foo = bar;/* */\t;", true],
				["let foo = bar;\t/**/\t;", true],
				["let foo = bar;\t/* */\t;", true],
				["let foo = bar;\n;", true],
				["let foo = bar;\n/**/;", true],
				["let foo = bar;\n/* */;", true],
				["let foo = bar;/**/\n;", true],
				["let foo = bar;/* */\n;", true],
				["let foo = bar;\n/**/\n;", true],
				["let foo = bar;\n/* */\n;", true],
			].forEach(([code, expected]) => {
				describe("when the first given is located before the second", () => {
					it(code, () => {
						const ast = espree.parse(code, DEFAULT_CONFIG),
							sourceCode = new SourceCode(code, ast);

						assert.strictEqual(
							sourceCode.isSpaceBetweenTokens(
								sourceCode.ast.body[0],
								sourceCode.ast.tokens.at(-1),
							),
							expected,
						);
					});
				});

				describe("when the first given is located after the second", () => {
					it(code, () => {
						const ast = espree.parse(code, DEFAULT_CONFIG),
							sourceCode = new SourceCode(code, ast);

						assert.strictEqual(
							sourceCode.isSpaceBetweenTokens(
								sourceCode.ast.tokens.at(-1),
								sourceCode.ast.body[0],
							),
							expected,
						);
					});
				});
			});
		});

		describe("should return true when there is at least one whitespace character between two nodes", () => {
			[
				["let foo = bar;let baz = qux;", false],
				["let foo = bar;/**/let baz = qux;", false],
				["let foo = bar;/* */let baz = qux;", false],
				["let foo = bar; let baz = qux;", true],
				["let foo = bar; /**/let baz = qux;", true],
				["let foo = bar; /* */let baz = qux;", true],
				["let foo = bar;/**/ let baz = qux;", true],
				["let foo = bar;/* */ let baz = qux;", true],
				["let foo = bar; /**/ let baz = qux;", true],
				["let foo = bar; /* */ let baz = qux;", true],
				["let foo = bar;\tlet baz = qux;", true],
				["let foo = bar;\t/**/let baz = qux;", true],
				["let foo = bar;\t/* */let baz = qux;", true],
				["let foo = bar;/**/\tlet baz = qux;", true],
				["let foo = bar;/* */\tlet baz = qux;", true],
				["let foo = bar;\t/**/\tlet baz = qux;", true],
				["let foo = bar;\t/* */\tlet baz = qux;", true],
				["let foo = bar;\nlet baz = qux;", true],
				["let foo = bar;\n/**/let baz = qux;", true],
				["let foo = bar;\n/* */let baz = qux;", true],
				["let foo = bar;/**/\nlet baz = qux;", true],
				["let foo = bar;/* */\nlet baz = qux;", true],
				["let foo = bar;\n/**/\nlet baz = qux;", true],
				["let foo = bar;\n/* */\nlet baz = qux;", true],
				["let foo = 1;let foo2 = 2; let foo3 = 3;", true],
			].forEach(([code, expected]) => {
				describe("when the first given is located before the second", () => {
					it(code, () => {
						const ast = espree.parse(code, DEFAULT_CONFIG),
							sourceCode = new SourceCode(code, ast);

						assert.strictEqual(
							sourceCode.isSpaceBetweenTokens(
								sourceCode.ast.body[0],
								sourceCode.ast.body.at(-1),
							),
							expected,
						);
					});
				});

				describe("when the first given is located after the second", () => {
					it(code, () => {
						const ast = espree.parse(code, DEFAULT_CONFIG),
							sourceCode = new SourceCode(code, ast);

						assert.strictEqual(
							sourceCode.isSpaceBetweenTokens(
								sourceCode.ast.body.at(-1),
								sourceCode.ast.body[0],
							),
							expected,
						);
					});
				});
			});

			it("JSXText tokens that contain only whitespaces should be handled as space", () => {
				const code = "let jsx = <div>\n   {content}\n</div>";
				const ast = espree.parse(code, {
					...DEFAULT_CONFIG,
					ecmaFeatures: { jsx: true },
				});
				const sourceCode = new SourceCode(code, ast);
				const jsx = ast.body[0].declarations[0].init;
				const interpolation = jsx.children[1];

				assert.strictEqual(
					sourceCode.isSpaceBetweenTokens(
						jsx.openingElement,
						interpolation,
					),
					true,
				);
				assert.strictEqual(
					sourceCode.isSpaceBetweenTokens(
						interpolation,
						jsx.closingElement,
					),
					true,
				);

				// Reversed order
				assert.strictEqual(
					sourceCode.isSpaceBetweenTokens(
						interpolation,
						jsx.openingElement,
					),
					true,
				);
				assert.strictEqual(
					sourceCode.isSpaceBetweenTokens(
						jsx.closingElement,
						interpolation,
					),
					true,
				);
			});

			it("JSXText tokens that contain both letters and whitespaces should be handled as space", () => {
				const code = "let jsx = <div>\n   Hello\n</div>";
				const ast = espree.parse(code, {
					...DEFAULT_CONFIG,
					ecmaFeatures: { jsx: true },
				});
				const sourceCode = new SourceCode(code, ast);
				const jsx = ast.body[0].declarations[0].init;

				assert.strictEqual(
					sourceCode.isSpaceBetweenTokens(
						jsx.openingElement,
						jsx.closingElement,
					),
					true,
				);

				// Reversed order
				assert.strictEqual(
					sourceCode.isSpaceBetweenTokens(
						jsx.closingElement,
						jsx.openingElement,
					),
					true,
				);
			});

			it("JSXText tokens that contain only letters should NOT be handled as space", () => {
				const code = "let jsx = <div>Hello</div>";
				const ast = espree.parse(code, {
					...DEFAULT_CONFIG,
					ecmaFeatures: { jsx: true },
				});
				const sourceCode = new SourceCode(code, ast);
				const jsx = ast.body[0].declarations[0].init;

				assert.strictEqual(
					sourceCode.isSpaceBetweenTokens(
						jsx.openingElement,
						jsx.closingElement,
					),
					false,
				);

				// Reversed order
				assert.strictEqual(
					sourceCode.isSpaceBetweenTokens(
						jsx.closingElement,
						jsx.openingElement,
					),
					false,
				);
			});
		});

		describe("should return false either of the arguments' location is inside the other one", () => {
			[["let foo = bar;", false]].forEach(([code, expected]) => {
				it(code, () => {
					const ast = espree.parse(code, DEFAULT_CONFIG),
						sourceCode = new SourceCode(code, ast);

					assert.strictEqual(
						sourceCode.isSpaceBetweenTokens(
							sourceCode.ast.tokens[0],
							sourceCode.ast.body[0],
						),
						expected,
					);

					assert.strictEqual(
						sourceCode.isSpaceBetweenTokens(
							sourceCode.ast.tokens.at(-1),
							sourceCode.ast.body[0],
						),
						expected,
					);

					assert.strictEqual(
						sourceCode.isSpaceBetweenTokens(
							sourceCode.ast.body[0],
							sourceCode.ast.tokens[0],
						),
						expected,
					);

					assert.strictEqual(
						sourceCode.isSpaceBetweenTokens(
							sourceCode.ast.body[0],
							sourceCode.ast.tokens.at(-1),
						),
						expected,
					);
				});
			});
		});
	});

	// need to check that linter.verify() works with SourceCode
	describe("linter.verify()", () => {
		it("should work when passed a SourceCode object without a config", () => {
			const ast = espree.parse(TEST_CODE, DEFAULT_CONFIG);

			const sourceCode = new SourceCode(TEST_CODE, ast),
				messages = linter.verify(sourceCode);

			assert.strictEqual(messages.length, 0);
		});

		it("should work when passed a SourceCode object containing ES6 syntax and config", () => {
			const sourceCode = new SourceCode("let foo = bar;", AST),
				messages = linter.verify(sourceCode, {
					languageOptions: { ecmaVersion: 6 },
				});

			assert.strictEqual(messages.length, 0);
		});

		it("should report an error when using let and ecmaVersion is 6", () => {
			const sourceCode = new SourceCode("let foo = bar;", AST),
				messages = linter.verify(sourceCode, {
					languageOptions: { ecmaVersion: 6 },
					rules: { "no-unused-vars": 2 },
				});

			assert.strictEqual(messages.length, 1);
			assert.strictEqual(
				messages[0].message,
				"'foo' is assigned a value but never used.",
			);
		});
	});

	// TODO: remove this when eslintrc mode is dropped
	describe("linter.verify() in eslintrc mode", () => {
		const CONFIG = {
			parserOptions: { ecmaVersion: 6 },
		};

		it("should work when passed a SourceCode object without a config", () => {
			const ast = espree.parse(TEST_CODE, DEFAULT_CONFIG);

			const sourceCode = new SourceCode(TEST_CODE, ast),
				messages = eslintrcLinter.verify(sourceCode);

			assert.strictEqual(messages.length, 0);
		});

		it("should work when passed a SourceCode object containing ES6 syntax and config", () => {
			const sourceCode = new SourceCode("let foo = bar;", AST),
				messages = eslintrcLinter.verify(sourceCode, CONFIG);

			assert.strictEqual(messages.length, 0);
		});

		it("should report an error when using let and ecmaVersion is 6", () => {
			const sourceCode = new SourceCode("let foo = bar;", AST),
				messages = eslintrcLinter.verify(sourceCode, {
					parserOptions: { ecmaVersion: 6 },
					rules: { "no-unused-vars": 2 },
				});

			assert.strictEqual(messages.length, 1);
			assert.strictEqual(
				messages[0].message,
				"'foo' is assigned a value but never used.",
			);
		});
	});

	describe("getLocFromIndex()", () => {
		const CODE =
			"foo\n" +
			"bar\r\n" +
			"baz\r" +
			"qux\u2028" +
			"foo\u2029" +
			"\n" +
			"qux\n";

		let sourceCode;

		beforeEach(() => {
			sourceCode = new SourceCode(
				CODE,
				espree.parse(CODE, DEFAULT_CONFIG),
			);
		});

		it("should return the location of a range index", () => {
			assert.deepStrictEqual(sourceCode.getLocFromIndex(0), {
				line: 1,
				column: 0,
			});
			assert.deepStrictEqual(sourceCode.getLocFromIndex(3), {
				line: 1,
				column: 3,
			});
			assert.deepStrictEqual(sourceCode.getLocFromIndex(4), {
				line: 2,
				column: 0,
			});
			assert.deepStrictEqual(sourceCode.getLocFromIndex(5), {
				line: 2,
				column: 1,
			});
			assert.deepStrictEqual(sourceCode.getLocFromIndex(15), {
				line: 4,
				column: 2,
			});
			assert.deepStrictEqual(sourceCode.getLocFromIndex(21), {
				line: 6,
				column: 0,
			});
		});

		it("should throw if given a bad input", () => {
			assert.throws(
				() => sourceCode.getLocFromIndex({ line: 1, column: 1 }),
				/Expected `index` to be a number\./u,
			);
		});

		it("should not throw if given sourceCode.text.length", () => {
			assert.deepStrictEqual(sourceCode.getLocFromIndex(CODE.length), {
				line: 8,
				column: 0,
			});
		});

		it("should throw if given an out-of-range input", () => {
			assert.throws(
				() => sourceCode.getLocFromIndex(CODE.length + 1),
				/Index out of range \(requested index 27, but source text has length 26\)\./u,
			);
		});

		it("is symmetric with getIndexFromLoc()", () => {
			for (let index = 0; index <= CODE.length; index++) {
				assert.strictEqual(
					index,
					sourceCode.getIndexFromLoc(
						sourceCode.getLocFromIndex(index),
					),
				);
			}
		});
	});

	describe("getIndexFromLoc()", () => {
		const CODE =
			"foo\n" +
			"bar\r\n" +
			"baz\r" +
			"qux\u2028" +
			"foo\u2029" +
			"\n" +
			"qux\n";

		let sourceCode;

		beforeEach(() => {
			sourceCode = new SourceCode(
				CODE,
				espree.parse(CODE, DEFAULT_CONFIG),
			);
		});
		it("should return the range index of a location", () => {
			assert.strictEqual(
				sourceCode.getIndexFromLoc({ line: 2, column: 1 }),
				5,
			);
			assert.strictEqual(
				sourceCode.getIndexFromLoc({ line: 1, column: 3 }),
				3,
			);
			assert.strictEqual(
				sourceCode.getIndexFromLoc({ line: 2, column: 0 }),
				4,
			);
			assert.strictEqual(
				sourceCode.getIndexFromLoc({ line: 7, column: 0 }),
				22,
			);
			assert.strictEqual(
				sourceCode.getIndexFromLoc({ line: 7, column: 3 }),
				25,
			);
		});

		it("should throw a useful error if given a malformed location", () => {
			assert.throws(
				() => sourceCode.getIndexFromLoc(5),
				/Expected `loc` to be an object with numeric `line` and `column` properties\./u,
			);

			assert.throws(
				() => sourceCode.getIndexFromLoc(null),
				/Expected `loc` to be an object with numeric `line` and `column` properties\./u,
			);

			assert.throws(
				() =>
					sourceCode.getIndexFromLoc({
						line: "three",
						column: "four",
					}),
				/Expected `loc` to be an object with numeric `line` and `column` properties\./u,
			);
		});

		it("should throw a useful error if `line` is out of range", () => {
			assert.throws(
				() => sourceCode.getIndexFromLoc({ line: 9, column: 0 }),
				/Line number out of range \(line 9 requested, but only 8 lines present\)\./u,
			);

			assert.throws(
				() => sourceCode.getIndexFromLoc({ line: 50, column: 3 }),
				/Line number out of range \(line 50 requested, but only 8 lines present\)\./u,
			);

			assert.throws(
				() => sourceCode.getIndexFromLoc({ line: 0, column: 0 }),
				/Line number out of range \(line 0 requested\)\. Line numbers should be 1-based\./u,
			);
		});

		it("should throw a useful error if `column` is out of range", () => {
			assert.throws(
				() => sourceCode.getIndexFromLoc({ line: 1, column: -1 }),
				"Invalid column number (column -1 requested).",
			);

			assert.throws(
				() => sourceCode.getIndexFromLoc({ line: 1, column: -5 }),
				"Invalid column number (column -5 requested).",
			);

			assert.throws(
				() => sourceCode.getIndexFromLoc({ line: 3, column: -1 }),
				"Invalid column number (column -1 requested).",
			);

			assert.throws(
				() => sourceCode.getIndexFromLoc({ line: 3, column: 4 }),
				/Column number out of range \(column 4 requested, but the length of line 3 is 4\)\./u,
			);

			assert.throws(
				() => sourceCode.getIndexFromLoc({ line: 3, column: 50 }),
				/Column number out of range \(column 50 requested, but the length of line 3 is 4\)\./u,
			);

			assert.throws(
				() => sourceCode.getIndexFromLoc({ line: 8, column: 1 }),
				/Column number out of range \(column 1 requested, but the length of line 8 is 0\)\./u,
			);
		});

		it("should not throw if the location one spot past the last character is given", () => {
			assert.strictEqual(
				sourceCode.getIndexFromLoc({ line: 8, column: 0 }),
				CODE.length,
			);
		});
	});

	describe("getScope()", () => {
		it("should throw an error when argument is missing", () => {
			assert.throws(() => {
				linter.verify("foo", {
					plugins: {
						test: {
							rules: {
								"get-scope": {
									create: context => ({
										Program() {
											context.sourceCode.getScope();
										},
									}),
								},
							},
						},
					},
					rules: { "test/get-scope": "error" },
				});
			}, /Missing required argument: node/u);
		});

		/**
		 * Get the scope on the node `astSelector` specified.
		 * @param {string} code The source code to verify.
		 * @param {string} astSelector The AST selector to get scope.
		 * @param {number} [ecmaVersion=5] The ECMAScript version.
		 * @returns {{node: ASTNode, scope: escope.Scope}} Gotten scope.
		 */
		function getScope(code, astSelector, ecmaVersion = 5) {
			let node, scope;

			linter.verify(code, {
				languageOptions: { ecmaVersion, sourceType: "script" },
				plugins: {
					test: {
						rules: {
							"get-scope": {
								create: context => ({
									[astSelector](node0) {
										node = node0;
										scope =
											context.sourceCode.getScope(node);
									},
								}),
							},
						},
					},
				},
				rules: { "test/get-scope": 2 },
			});

			return { node, scope };
		}

		it("should return 'function' scope on FunctionDeclaration (ES5)", () => {
			const { node, scope } = getScope(
				"function f() {}",
				"FunctionDeclaration",
			);

			assert.strictEqual(scope.type, "function");
			assert.strictEqual(scope.block, node);
		});

		it("should return 'function' scope on FunctionExpression (ES5)", () => {
			const { node, scope } = getScope(
				"!function f() {}",
				"FunctionExpression",
			);

			assert.strictEqual(scope.type, "function");
			assert.strictEqual(scope.block, node);
		});

		it("should return 'function' scope on the body of FunctionDeclaration (ES5)", () => {
			const { node, scope } = getScope(
				"function f() {}",
				"BlockStatement",
			);

			assert.strictEqual(scope.type, "function");
			assert.strictEqual(scope.block, node.parent);
		});

		it("should return 'function' scope on the body of FunctionDeclaration (ES2015)", () => {
			const { node, scope } = getScope(
				"function f() {}",
				"BlockStatement",
				2015,
			);

			assert.strictEqual(scope.type, "function");
			assert.strictEqual(scope.block, node.parent);
		});

		it("should return 'function' scope on BlockStatement in functions (ES5)", () => {
			const { node, scope } = getScope(
				"function f() { { var b; } }",
				"BlockStatement > BlockStatement",
			);

			assert.strictEqual(scope.type, "function");
			assert.strictEqual(scope.block, node.parent.parent);
			assert.deepStrictEqual(
				scope.variables.map(v => v.name),
				["arguments", "b"],
			);
		});

		it("should return 'block' scope on BlockStatement in functions (ES2015)", () => {
			const { node, scope } = getScope(
				"function f() { { let a; var b; } }",
				"BlockStatement > BlockStatement",
				2015,
			);

			assert.strictEqual(scope.type, "block");
			assert.strictEqual(scope.upper.type, "function");
			assert.strictEqual(scope.block, node);
			assert.deepStrictEqual(
				scope.variables.map(v => v.name),
				["a"],
			);
			assert.deepStrictEqual(
				scope.variableScope.variables.map(v => v.name),
				["arguments", "b"],
			);
		});

		it("should return 'block' scope on nested BlockStatement in functions (ES2015)", () => {
			const { node, scope } = getScope(
				"function f() { { let a; { let b; var c; } } }",
				"BlockStatement > BlockStatement > BlockStatement",
				2015,
			);

			assert.strictEqual(scope.type, "block");
			assert.strictEqual(scope.upper.type, "block");
			assert.strictEqual(scope.upper.upper.type, "function");
			assert.strictEqual(scope.block, node);
			assert.deepStrictEqual(
				scope.variables.map(v => v.name),
				["b"],
			);
			assert.deepStrictEqual(
				scope.upper.variables.map(v => v.name),
				["a"],
			);
			assert.deepStrictEqual(
				scope.variableScope.variables.map(v => v.name),
				["arguments", "c"],
			);
		});

		it("should return 'function' scope on SwitchStatement in functions (ES5)", () => {
			const { node, scope } = getScope(
				"function f() { switch (a) { case 0: var b; } }",
				"SwitchStatement",
			);

			assert.strictEqual(scope.type, "function");
			assert.strictEqual(scope.block, node.parent.parent);
			assert.deepStrictEqual(
				scope.variables.map(v => v.name),
				["arguments", "b"],
			);
		});

		it("should return 'switch' scope on SwitchStatement in functions (ES2015)", () => {
			const { node, scope } = getScope(
				"function f() { switch (a) { case 0: let b; } }",
				"SwitchStatement",
				2015,
			);

			assert.strictEqual(scope.type, "switch");
			assert.strictEqual(scope.block, node);
			assert.deepStrictEqual(
				scope.variables.map(v => v.name),
				["b"],
			);
		});

		it("should return 'function' scope on SwitchCase in functions (ES5)", () => {
			const { node, scope } = getScope(
				"function f() { switch (a) { case 0: var b; } }",
				"SwitchCase",
			);

			assert.strictEqual(scope.type, "function");
			assert.strictEqual(scope.block, node.parent.parent.parent);
			assert.deepStrictEqual(
				scope.variables.map(v => v.name),
				["arguments", "b"],
			);
		});

		it("should return 'switch' scope on SwitchCase in functions (ES2015)", () => {
			const { node, scope } = getScope(
				"function f() { switch (a) { case 0: let b; } }",
				"SwitchCase",
				2015,
			);

			assert.strictEqual(scope.type, "switch");
			assert.strictEqual(scope.block, node.parent);
			assert.deepStrictEqual(
				scope.variables.map(v => v.name),
				["b"],
			);
		});

		it("should return 'catch' scope on CatchClause in functions (ES5)", () => {
			const { node, scope } = getScope(
				"function f() { try {} catch (e) { var a; } }",
				"CatchClause",
			);

			assert.strictEqual(scope.type, "catch");
			assert.strictEqual(scope.block, node);
			assert.deepStrictEqual(
				scope.variables.map(v => v.name),
				["e"],
			);
		});

		it("should return 'catch' scope on CatchClause in functions (ES2015)", () => {
			const { node, scope } = getScope(
				"function f() { try {} catch (e) { let a; } }",
				"CatchClause",
				2015,
			);

			assert.strictEqual(scope.type, "catch");
			assert.strictEqual(scope.block, node);
			assert.deepStrictEqual(
				scope.variables.map(v => v.name),
				["e"],
			);
		});

		it("should return 'catch' scope on the block of CatchClause in functions (ES5)", () => {
			const { node, scope } = getScope(
				"function f() { try {} catch (e) { var a; } }",
				"CatchClause > BlockStatement",
			);

			assert.strictEqual(scope.type, "catch");
			assert.strictEqual(scope.block, node.parent);
			assert.deepStrictEqual(
				scope.variables.map(v => v.name),
				["e"],
			);
		});

		it("should return 'block' scope on the block of CatchClause in functions (ES2015)", () => {
			const { node, scope } = getScope(
				"function f() { try {} catch (e) { let a; } }",
				"CatchClause > BlockStatement",
				2015,
			);

			assert.strictEqual(scope.type, "block");
			assert.strictEqual(scope.block, node);
			assert.deepStrictEqual(
				scope.variables.map(v => v.name),
				["a"],
			);
		});

		it("should return 'function' scope on ForStatement in functions (ES5)", () => {
			const { node, scope } = getScope(
				"function f() { for (var i = 0; i < 10; ++i) {} }",
				"ForStatement",
			);

			assert.strictEqual(scope.type, "function");
			assert.strictEqual(scope.block, node.parent.parent);
			assert.deepStrictEqual(
				scope.variables.map(v => v.name),
				["arguments", "i"],
			);
		});

		it("should return 'for' scope on ForStatement in functions (ES2015)", () => {
			const { node, scope } = getScope(
				"function f() { for (let i = 0; i < 10; ++i) {} }",
				"ForStatement",
				2015,
			);

			assert.strictEqual(scope.type, "for");
			assert.strictEqual(scope.block, node);
			assert.deepStrictEqual(
				scope.variables.map(v => v.name),
				["i"],
			);
		});

		it("should return 'function' scope on the block body of ForStatement in functions (ES5)", () => {
			const { node, scope } = getScope(
				"function f() { for (var i = 0; i < 10; ++i) {} }",
				"ForStatement > BlockStatement",
			);

			assert.strictEqual(scope.type, "function");
			assert.strictEqual(scope.block, node.parent.parent.parent);
			assert.deepStrictEqual(
				scope.variables.map(v => v.name),
				["arguments", "i"],
			);
		});

		it("should return 'block' scope on the block body of ForStatement in functions (ES2015)", () => {
			const { node, scope } = getScope(
				"function f() { for (let i = 0; i < 10; ++i) {} }",
				"ForStatement > BlockStatement",
				2015,
			);

			assert.strictEqual(scope.type, "block");
			assert.strictEqual(scope.upper.type, "for");
			assert.strictEqual(scope.block, node);
			assert.deepStrictEqual(
				scope.variables.map(v => v.name),
				[],
			);
			assert.deepStrictEqual(
				scope.upper.variables.map(v => v.name),
				["i"],
			);
		});

		it("should return 'function' scope on ForInStatement in functions (ES5)", () => {
			const { node, scope } = getScope(
				"function f() { for (var key in obj) {} }",
				"ForInStatement",
			);

			assert.strictEqual(scope.type, "function");
			assert.strictEqual(scope.block, node.parent.parent);
			assert.deepStrictEqual(
				scope.variables.map(v => v.name),
				["arguments", "key"],
			);
		});

		it("should return 'for' scope on ForInStatement in functions (ES2015)", () => {
			const { node, scope } = getScope(
				"function f() { for (let key in obj) {} }",
				"ForInStatement",
				2015,
			);

			assert.strictEqual(scope.type, "for");
			assert.strictEqual(scope.block, node);
			assert.deepStrictEqual(
				scope.variables.map(v => v.name),
				["key"],
			);
		});

		it("should return 'function' scope on the block body of ForInStatement in functions (ES5)", () => {
			const { node, scope } = getScope(
				"function f() { for (var key in obj) {} }",
				"ForInStatement > BlockStatement",
			);

			assert.strictEqual(scope.type, "function");
			assert.strictEqual(scope.block, node.parent.parent.parent);
			assert.deepStrictEqual(
				scope.variables.map(v => v.name),
				["arguments", "key"],
			);
		});

		it("should return 'block' scope on the block body of ForInStatement in functions (ES2015)", () => {
			const { node, scope } = getScope(
				"function f() { for (let key in obj) {} }",
				"ForInStatement > BlockStatement",
				2015,
			);

			assert.strictEqual(scope.type, "block");
			assert.strictEqual(scope.upper.type, "for");
			assert.strictEqual(scope.block, node);
			assert.deepStrictEqual(
				scope.variables.map(v => v.name),
				[],
			);
			assert.deepStrictEqual(
				scope.upper.variables.map(v => v.name),
				["key"],
			);
		});

		it("should return 'for' scope on ForOfStatement in functions (ES2015)", () => {
			const { node, scope } = getScope(
				"function f() { for (let x of xs) {} }",
				"ForOfStatement",
				2015,
			);

			assert.strictEqual(scope.type, "for");
			assert.strictEqual(scope.block, node);
			assert.deepStrictEqual(
				scope.variables.map(v => v.name),
				["x"],
			);
		});

		it("should return 'block' scope on the block body of ForOfStatement in functions (ES2015)", () => {
			const { node, scope } = getScope(
				"function f() { for (let x of xs) {} }",
				"ForOfStatement > BlockStatement",
				2015,
			);

			assert.strictEqual(scope.type, "block");
			assert.strictEqual(scope.upper.type, "for");
			assert.strictEqual(scope.block, node);
			assert.deepStrictEqual(
				scope.variables.map(v => v.name),
				[],
			);
			assert.deepStrictEqual(
				scope.upper.variables.map(v => v.name),
				["x"],
			);
		});

		it("should shadow the same name variable by the iteration variable.", () => {
			const { node, scope } = getScope(
				"let x; for (let x of x) {}",
				"ForOfStatement",
				2015,
			);

			assert.strictEqual(scope.type, "for");
			assert.strictEqual(scope.upper.type, "global");
			assert.strictEqual(scope.block, node);
			assert.strictEqual(scope.upper.variables[0].references.length, 0);
			assert.strictEqual(
				scope.references[0].identifier,
				node.left.declarations[0].id,
			);
			assert.strictEqual(scope.references[1].identifier, node.right);
			assert.strictEqual(
				scope.references[1].resolved,
				scope.variables[0],
			);
		});
	});

	describe("getAncestors()", () => {
		const code = TEST_CODE;

		it("should retrieve all ancestors when used", () => {
			let spy;

			const config = {
				plugins: {
					test: {
						rules: {
							checker: {
								create(context) {
									spy = sinon.spy(node => {
										const sourceCode = context.sourceCode;
										const ancestors =
											sourceCode.getAncestors(node);

										assert.strictEqual(ancestors.length, 3);
									});
									return { BinaryExpression: spy };
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			};

			linter.verify(code, config, filename);
			assert(spy && spy.calledOnce, "Spy was not called.");
		});

		it("should retrieve empty ancestors for root node", () => {
			let spy;

			const config = {
				plugins: {
					test: {
						rules: {
							checker: {
								create(context) {
									spy = sinon.spy(node => {
										const sourceCode = context.sourceCode;
										const ancestors =
											sourceCode.getAncestors(node);

										assert.strictEqual(ancestors.length, 0);
									});

									return { Program: spy };
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			};

			linter.verify(code, config);
			assert(spy && spy.calledOnce, "Spy was not called.");
		});

		it("should throw an error when the argument is missing", () => {
			let spy;

			const config = {
				plugins: {
					test: {
						rules: {
							checker: {
								create(context) {
									spy = sinon.spy(() => {
										const sourceCode = context.sourceCode;

										assert.throws(() => {
											sourceCode.getAncestors();
										}, /Missing required argument: node/u);
									});

									return { Program: spy };
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			};

			linter.verify(code, config);
			assert(spy && spy.calledOnce, "Spy was not called.");
		});
	});

	describe("getDeclaredVariables(node)", () => {
		/**
		 * Assert `sourceCode.getDeclaredVariables(node)` is valid.
		 * @param {string} code A code to check.
		 * @param {string} type A type string of ASTNode. This method checks variables on the node of the type.
		 * @param {Array<Array<string>>} expectedNamesList An array of expected variable names. The expected variable names is an array of string.
		 * @returns {void}
		 */
		function verify(code, type, expectedNamesList) {
			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create(context) {
									const sourceCode = context.sourceCode;

									/**
									 * Assert `sourceCode.getDeclaredVariables(node)` is empty.
									 * @param {ASTNode} node A node to check.
									 * @returns {void}
									 */
									function checkEmpty(node) {
										assert.strictEqual(
											0,
											sourceCode.getDeclaredVariables(
												node,
											).length,
										);
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
										MetaProperty: checkEmpty,
									};

									rule[type] = function (node) {
										const expectedNames =
											expectedNamesList.shift();
										const variables =
											sourceCode.getDeclaredVariables(
												node,
											);

										assert(Array.isArray(expectedNames));
										assert(Array.isArray(variables));
										assert.strictEqual(
											expectedNames.length,
											variables.length,
										);
										for (
											let i = variables.length - 1;
											i >= 0;
											i--
										) {
											assert.strictEqual(
												expectedNames[i],
												variables[i].name,
											);
										}
									};
									return rule;
								},
							},
						},
					},
				},
				rules: { "test/checker": 2 },
			});

			// Check all expected names are asserted.
			assert.strictEqual(0, expectedNamesList.length);
		}

		it("VariableDeclaration", () => {
			const code =
				"\n var {a, x: [b], y: {c = 0}} = foo;\n let {d, x: [e], y: {f = 0}} = foo;\n const {g, x: [h], y: {i = 0}} = foo, {j, k = function(z) { let l; }} = bar;\n ";
			const namesList = [
				["a", "b", "c"],
				["d", "e", "f"],
				["g", "h", "i", "j", "k"],
				["l"],
			];

			verify(code, "VariableDeclaration", namesList);
		});

		it("VariableDeclaration (on for-in/of loop)", () => {
			// TDZ scope is created here, so tests to exclude those.
			const code =
				"\n for (var {a, x: [b], y: {c = 0}} in foo) {\n let g;\n }\n for (let {d, x: [e], y: {f = 0}} of foo) {\n let h;\n }\n ";
			const namesList = [["a", "b", "c"], ["g"], ["d", "e", "f"], ["h"]];

			verify(code, "VariableDeclaration", namesList);
		});

		it("VariableDeclarator", () => {
			// TDZ scope is created here, so tests to exclude those.
			const code =
				"\n var {a, x: [b], y: {c = 0}} = foo;\n let {d, x: [e], y: {f = 0}} = foo;\n const {g, x: [h], y: {i = 0}} = foo, {j, k = function(z) { let l; }} = bar;\n ";
			const namesList = [
				["a", "b", "c"],
				["d", "e", "f"],
				["g", "h", "i"],
				["j", "k"],
				["l"],
			];

			verify(code, "VariableDeclarator", namesList);
		});

		it("FunctionDeclaration", () => {
			const code =
				"\n function foo({a, x: [b], y: {c = 0}}, [d, e]) {\n let z;\n }\n function bar({f, x: [g], y: {h = 0}}, [i, j = function(q) { let w; }]) {\n let z;\n }\n ";
			const namesList = [
				["foo", "a", "b", "c", "d", "e"],
				["bar", "f", "g", "h", "i", "j"],
			];

			verify(code, "FunctionDeclaration", namesList);
		});

		it("FunctionExpression", () => {
			const code =
				"\n (function foo({a, x: [b], y: {c = 0}}, [d, e]) {\n let z;\n });\n (function bar({f, x: [g], y: {h = 0}}, [i, j = function(q) { let w; }]) {\n let z;\n });\n ";
			const namesList = [
				["foo", "a", "b", "c", "d", "e"],
				["bar", "f", "g", "h", "i", "j"],
				["q"],
			];

			verify(code, "FunctionExpression", namesList);
		});

		it("ArrowFunctionExpression", () => {
			const code =
				"\n (({a, x: [b], y: {c = 0}}, [d, e]) => {\n let z;\n });\n (({f, x: [g], y: {h = 0}}, [i, j]) => {\n let z;\n });\n ";
			const namesList = [
				["a", "b", "c", "d", "e"],
				["f", "g", "h", "i", "j"],
			];

			verify(code, "ArrowFunctionExpression", namesList);
		});

		it("ClassDeclaration", () => {
			const code =
				"\n class A { foo(x) { let y; } }\n class B { foo(x) { let y; } }\n ";
			const namesList = [
				["A", "A"], // outer scope's and inner scope's.
				["B", "B"],
			];

			verify(code, "ClassDeclaration", namesList);
		});

		it("ClassExpression", () => {
			const code =
				"\n (class A { foo(x) { let y; } });\n (class B { foo(x) { let y; } });\n ";
			const namesList = [["A"], ["B"]];

			verify(code, "ClassExpression", namesList);
		});

		it("CatchClause", () => {
			const code =
				"\n try {} catch ({a, b}) {\n let x;\n try {} catch ({c, d}) {\n let y;\n }\n }\n ";
			const namesList = [
				["a", "b"],
				["c", "d"],
			];

			verify(code, "CatchClause", namesList);
		});

		it("ImportDeclaration", () => {
			const code =
				'\n import "aaa";\n import * as a from "bbb";\n import b, {c, x as d} from "ccc";\n ';
			const namesList = [[], ["a"], ["b", "c", "d"]];

			verify(code, "ImportDeclaration", namesList);
		});

		it("ImportSpecifier", () => {
			const code =
				'\n import "aaa";\n import * as a from "bbb";\n import b, {c, x as d} from "ccc";\n ';
			const namesList = [["c"], ["d"]];

			verify(code, "ImportSpecifier", namesList);
		});

		it("ImportDefaultSpecifier", () => {
			const code =
				'\n import "aaa";\n import * as a from "bbb";\n import b, {c, x as d} from "ccc";\n ';
			const namesList = [["b"]];

			verify(code, "ImportDefaultSpecifier", namesList);
		});

		it("ImportNamespaceSpecifier", () => {
			const code =
				'\n import "aaa";\n import * as a from "bbb";\n import b, {c, x as d} from "ccc";\n ';
			const namesList = [["a"]];

			verify(code, "ImportNamespaceSpecifier", namesList);
		});
	});

	describe("markVariableAsUsed()", () => {
		it("should mark variables in current scope as used", () => {
			const code = "var a = 1, b = 2;";
			let spy;

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create(context) {
									const sourceCode = context.sourceCode;

									spy = sinon.spy(node => {
										assert.isTrue(
											sourceCode.markVariableAsUsed("a"),
										);

										const scope = sourceCode.getScope(node);

										assert.isTrue(
											getVariable(scope, "a").eslintUsed,
										);
										assert.notOk(
											getVariable(scope, "b").eslintUsed,
										);
									});

									return { "Program:exit": spy };
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
				languageOptions: { sourceType: "script" },
			});
			assert(spy && spy.calledOnce);
		});

		it("should mark variables in function args as used", () => {
			const code = "function abc(a, b) { return 1; }";
			let spy;

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create(context) {
									const sourceCode = context.sourceCode;

									spy = sinon.spy(node => {
										assert.isTrue(
											sourceCode.markVariableAsUsed(
												"a",
												node,
											),
										);

										const scope = sourceCode.getScope(node);

										assert.isTrue(
											getVariable(scope, "a").eslintUsed,
										);
										assert.notOk(
											getVariable(scope, "b").eslintUsed,
										);
									});

									return { ReturnStatement: spy };
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			});
			assert(spy && spy.calledOnce);
		});

		it("should mark variables in higher scopes as used", () => {
			const code = "var a, b; function abc() { return 1; }";
			let returnSpy, exitSpy;

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create(context) {
									const sourceCode = context.sourceCode;

									returnSpy = sinon.spy(node => {
										assert.isTrue(
											sourceCode.markVariableAsUsed(
												"a",
												node,
											),
										);
									});
									exitSpy = sinon.spy(node => {
										const scope = sourceCode.getScope(node);

										assert.isTrue(
											getVariable(scope, "a").eslintUsed,
										);
										assert.notOk(
											getVariable(scope, "b").eslintUsed,
										);
									});

									return {
										ReturnStatement: returnSpy,
										"Program:exit": exitSpy,
									};
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
				languageOptions: { sourceType: "script" },
			});
			assert(returnSpy && returnSpy.calledOnce);
			assert(exitSpy && exitSpy.calledOnce);
		});

		it("should mark variables in Node.js environment as used", () => {
			const code = "var a = 1, b = 2;";
			let spy;

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create(context) {
									const sourceCode = context.sourceCode;

									spy = sinon.spy(node => {
										const globalScope =
												sourceCode.getScope(node),
											childScope =
												globalScope.childScopes[0];

										assert.isTrue(
											sourceCode.markVariableAsUsed("a"),
										);

										assert.isTrue(
											getVariable(childScope, "a")
												.eslintUsed,
										);
										assert.isUndefined(
											getVariable(childScope, "b")
												.eslintUsed,
										);
									});

									return { "Program:exit": spy };
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
				languageOptions: { sourceType: "commonjs" },
			});
			assert(spy && spy.calledOnce);
		});

		it("should mark variables in modules as used", () => {
			const code = "var a = 1, b = 2;";
			let spy;

			linter.verify(
				code,
				{
					plugins: {
						test: {
							rules: {
								checker: {
									create(context) {
										const sourceCode = context.sourceCode;

										spy = sinon.spy(node => {
											const globalScope =
													sourceCode.getScope(node),
												childScope =
													globalScope.childScopes[0];

											assert.isTrue(
												sourceCode.markVariableAsUsed(
													"a",
												),
											);

											assert.isTrue(
												getVariable(childScope, "a")
													.eslintUsed,
											);
											assert.isUndefined(
												getVariable(childScope, "b")
													.eslintUsed,
											);
										});

										return { "Program:exit": spy };
									},
								},
							},
						},
					},
					rules: { "test/checker": "error" },
				},
				filename,
			);
			assert(spy && spy.calledOnce);
		});

		it("should return false if the given variable is not found", () => {
			const code = "var a = 1, b = 2;";
			let spy;

			linter.verify(code, {
				plugins: {
					test: {
						rules: {
							checker: {
								create(context) {
									const sourceCode = context.sourceCode;

									spy = sinon.spy(() => {
										assert.isFalse(
											sourceCode.markVariableAsUsed("c"),
										);
									});

									return { "Program:exit": spy };
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
				languageOptions: { sourceType: "script" },
			});
			assert(spy && spy.calledOnce);
		});
	});

	describe("getInlineConfigNodes()", () => {
		it("should return inline config comments", () => {
			const code =
				"/*eslint foo: 1*/ foo; /* non-config comment*/ /* eslint-disable bar */ bar; /* eslint-enable bar */";
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const sourceCode = new SourceCode(code, ast);
			const configComments = sourceCode.getInlineConfigNodes();

			// not sure why but without the JSON parse/stringify Chai won't see these as equal
			assert.deepStrictEqual(JSON.parse(JSON.stringify(configComments)), [
				{
					type: "Block",
					value: "eslint foo: 1",
					start: 0,
					end: 17,
					range: [0, 17],
					loc: {
						start: {
							line: 1,
							column: 0,
						},
						end: {
							line: 1,
							column: 17,
						},
					},
				},
				{
					type: "Block",
					value: " eslint-disable bar ",
					start: 47,
					end: 71,
					range: [47, 71],
					loc: {
						start: {
							line: 1,
							column: 47,
						},
						end: {
							line: 1,
							column: 71,
						},
					},
				},
				{
					type: "Block",
					value: " eslint-enable bar ",
					start: 77,
					end: 100,
					range: [77, 100],
					loc: {
						start: {
							line: 1,
							column: 77,
						},
						end: {
							line: 1,
							column: 100,
						},
					},
				},
			]);
		});
	});

	describe("applyLanguageOptions()", () => {
		it("should add ES6 globals", () => {
			const code = "foo";
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const scopeManager = eslintScope.analyze(ast, {
				ignoreEval: true,
				ecmaVersion: 6,
			});
			const sourceCode = new SourceCode({
				text: code,
				ast,
				scopeManager,
			});

			sourceCode.applyLanguageOptions({
				ecmaVersion: 2015,
			});

			sourceCode.finalize();

			const globalScope = sourceCode.scopeManager.scopes[0];
			const variable = globalScope.set.get("Promise");

			assert.isDefined(variable);
		});

		it("should add custom globals", () => {
			const code = "foo";
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const scopeManager = eslintScope.analyze(ast, {
				ignoreEval: true,
				ecmaVersion: 6,
			});
			const sourceCode = new SourceCode({
				text: code,
				ast,
				scopeManager,
			});

			sourceCode.applyLanguageOptions({
				ecmaVersion: 2015,
				globals: {
					FOO: true,
				},
			});

			sourceCode.finalize();

			const globalScope = sourceCode.scopeManager.scopes[0];
			const variable = globalScope.set.get("FOO");

			assert.isDefined(variable);
			assert.isTrue(variable.writeable);
		});

		it("should add commonjs globals", () => {
			const code = "foo";
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const scopeManager = eslintScope.analyze(ast, {
				ignoreEval: true,
				ecmaVersion: 6,
				sourceType: "commonjs",
			});
			const sourceCode = new SourceCode({
				text: code,
				ast,
				scopeManager,
			});

			sourceCode.applyLanguageOptions({
				ecmaVersion: 2015,
				sourceType: "commonjs",
			});

			sourceCode.finalize();

			const globalScope = sourceCode.scopeManager.scopes[0];
			const variable = globalScope.set.get("require");

			assert.isDefined(variable);
		});
	});

	describe("applyInlineConfig()", () => {
		it("should add inline globals", () => {
			const code = "/*global bar: true */ foo;";
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const scopeManager = eslintScope.analyze(ast, {
				ignoreEval: true,
				ecmaVersion: 6,
			});
			const sourceCode = new SourceCode({
				text: code,
				ast,
				scopeManager,
			});

			sourceCode.applyInlineConfig();
			sourceCode.finalize();

			const globalScope = sourceCode.scopeManager.scopes[0];
			const variable = globalScope.set.get("bar");

			assert.isDefined(variable);
			assert.isTrue(variable.writeable);
		});

		describe("exported variables", () => {
			/**
			 * GlobalScope
			 * @param {string} code the code to check
			 * @returns {Scope} globalScope
			 */
			function loadGlobalScope(code) {
				const ast = espree.parse(code, DEFAULT_CONFIG);
				const scopeManager = eslintScope.analyze(ast, {
					ignoreEval: true,
					ecmaVersion: 6,
				});
				const sourceCode = new SourceCode({
					text: code,
					ast,
					scopeManager,
				});

				sourceCode.applyInlineConfig();
				sourceCode.finalize();

				const globalScope = sourceCode.scopeManager.scopes[0].set;

				return globalScope;
			}

			it("should mark exported variable", () => {
				const code = "/*exported foo */ var foo;";
				const globalScope = loadGlobalScope(code);
				const variable = globalScope.get("foo");

				assert.isDefined(variable);
				assert.isTrue(variable.eslintUsed);
				assert.isTrue(variable.eslintExported);
			});

			it("should not mark exported variable with `key: value` pair", () => {
				const code = "/*exported foo: true */ var foo;";
				const globalScope = loadGlobalScope(code);
				const variable = globalScope.get("foo");

				assert.isDefined(variable);
				assert.notOk(variable.eslintUsed);
				assert.notOk(variable.eslintExported);
			});

			it("should mark exported variables with comma", () => {
				const code = "/*exported foo, bar */ var foo, bar;";
				const globalScope = loadGlobalScope(code);

				["foo", "bar"].forEach(name => {
					const variable = globalScope.get(name);

					assert.isDefined(variable);
					assert.isTrue(variable.eslintUsed);
					assert.isTrue(variable.eslintExported);
				});
			});

			it("should not mark exported variables without comma", () => {
				const code = "/*exported foo bar */ var foo, bar;";
				const globalScope = loadGlobalScope(code);

				["foo", "bar"].forEach(name => {
					const variable = globalScope.get(name);

					assert.isDefined(variable);
					assert.notOk(variable.eslintUsed);
					assert.notOk(variable.eslintExported);
				});
			});
		});

		it("should extract rule configuration", () => {
			const code = "/*eslint some-rule: 2 */ var foo;";
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const sourceCode = new SourceCode(code, ast);
			const result = sourceCode.applyInlineConfig();

			assert.strictEqual(result.configs.length, 1);
			assert.strictEqual(result.configs[0].config.rules["some-rule"], 2);
		});

		it("should extract multiple rule configurations", () => {
			const code =
				'/*eslint some-rule: 2, other-rule: ["error", { skip: true }] */ var foo;';
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const sourceCode = new SourceCode(code, ast);
			const result = sourceCode.applyInlineConfig();

			assert.strictEqual(result.configs.length, 1);
			assert.strictEqual(result.configs[0].config.rules["some-rule"], 2);
			assert.deepStrictEqual(
				result.configs[0].config.rules["other-rule"],
				["error", { skip: true }],
			);
		});

		it("should extract multiple comments into multiple configurations", () => {
			const code =
				'/*eslint some-rule: 2*/ /*eslint other-rule: ["error", { skip: true }] */ var foo;';
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const sourceCode = new SourceCode(code, ast);
			const result = sourceCode.applyInlineConfig();

			assert.strictEqual(result.configs.length, 2);
			assert.strictEqual(result.configs[0].config.rules["some-rule"], 2);
			assert.deepStrictEqual(
				result.configs[1].config.rules["other-rule"],
				["error", { skip: true }],
			);
		});

		it("should report problem with rule configuration parsing", () => {
			const code = "/*eslint some-rule::, */ var foo;";
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const sourceCode = new SourceCode(code, ast);
			const result = sourceCode.applyInlineConfig();
			const problem = result.problems[0];

			// Node.js 19 changes the JSON parsing error format, so we need to check each field separately to use a regex
			assert.strictEqual(problem.loc.start.column, 0);
			assert.strictEqual(problem.loc.start.line, 1);
			assert.strictEqual(problem.loc.end.column, 24);
			assert.strictEqual(problem.loc.end.line, 1);
			assert.match(
				problem.message,
				/Failed to parse JSON from '"some-rule"::,': Unexpected token '?:'?/u,
			);
			assert.isNull(problem.ruleId);
		});
	});

	describe("finalize()", () => {
		it("should remove ECMAScript globals from global scope's `implicit`", () => {
			const code = "Array = 1; Foo = 1; Promise = 1; Array; Foo; Promise";
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const scopeManager = eslintScope.analyze(ast, {
				ignoreEval: true,
				ecmaVersion: 6,
			});
			const sourceCode = new SourceCode({
				text: code,
				ast,
				scopeManager,
			});

			sourceCode.applyLanguageOptions({
				ecmaVersion: 2015,
			});

			sourceCode.finalize();

			const globalScope = sourceCode.scopeManager.scopes[0];
			const { implicit } = globalScope;

			assert.deepStrictEqual(
				[...implicit.set].map(([name]) => name),
				["Foo"],
			);
			assert.deepStrictEqual(
				implicit.variables.map(({ name }) => name),
				["Foo"],
			);
			assert.deepStrictEqual(
				implicit.left.map(reference => reference.identifier.name),
				["Foo", "Foo"],
			);
		});

		it("should remove custom globals from global scope's `implicit`", () => {
			const code = "Bar = 1; Foo = 1; Baz = 1; Bar; Foo; Baz";
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const scopeManager = eslintScope.analyze(ast, {
				ignoreEval: true,
				ecmaVersion: 6,
			});
			const sourceCode = new SourceCode({
				text: code,
				ast,
				scopeManager,
			});

			sourceCode.applyLanguageOptions({
				ecmaVersion: 2015,
				globals: {
					Bar: "writable",
					Baz: "readonly",
				},
			});

			sourceCode.finalize();

			const globalScope = sourceCode.scopeManager.scopes[0];
			const { implicit } = globalScope;

			assert.deepStrictEqual(
				[...implicit.set].map(([name]) => name),
				["Foo"],
			);
			assert.deepStrictEqual(
				implicit.variables.map(({ name }) => name),
				["Foo"],
			);
			assert.deepStrictEqual(
				implicit.left.map(reference => reference.identifier.name),
				["Foo", "Foo"],
			);
		});

		it("should remove commonjs globals from global scope's `implicit`", () => {
			const code =
				"exports = {}; Foo = 1; require = () => {}; exports; Foo; require";
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const scopeManager = eslintScope.analyze(ast, {
				ignoreEval: true,
				ecmaVersion: 6,
				sourceType: "commonjs",
			});
			const sourceCode = new SourceCode({
				text: code,
				ast,
				scopeManager,
			});

			sourceCode.applyLanguageOptions({
				ecmaVersion: 2015,
				sourceType: "commonjs",
			});

			sourceCode.finalize();

			const globalScope = sourceCode.scopeManager.scopes[0];
			const { implicit } = globalScope;

			assert.deepStrictEqual(
				[...implicit.set].map(([name]) => name),
				["Foo"],
			);
			assert.deepStrictEqual(
				implicit.variables.map(({ name }) => name),
				["Foo"],
			);
			assert.deepStrictEqual(
				implicit.left.map(reference => reference.identifier.name),
				["Foo", "Foo"],
			);
		});

		it("should remove inline globals from global scope's `implicit`", () => {
			const code =
				"/* globals Bar: writable, Baz: readonly */ Bar = 1; Foo = 1; Baz = 1; Bar; Foo; Baz";
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const scopeManager = eslintScope.analyze(ast, {
				ignoreEval: true,
				ecmaVersion: 6,
			});
			const sourceCode = new SourceCode({
				text: code,
				ast,
				scopeManager,
			});

			sourceCode.applyInlineConfig();
			sourceCode.finalize();

			const globalScope = sourceCode.scopeManager.scopes[0];
			const { implicit } = globalScope;

			assert.deepStrictEqual(
				[...implicit.set].map(([name]) => name),
				["Foo"],
			);
			assert.deepStrictEqual(
				implicit.variables.map(({ name }) => name),
				["Foo"],
			);
			assert.deepStrictEqual(
				implicit.left.map(reference => reference.identifier.name),
				["Foo", "Foo"],
			);
		});

		it("should not crash if global scope doesn't have `implicit` property", () => {
			const code = "Array = 1; Foo = 1; Promise = 1; Array; Foo; Promise";
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const scopeManager = eslintScope.analyze(ast, {
				ignoreEval: true,
				ecmaVersion: 6,
			});

			const globalScope = scopeManager.scopes[0];
			delete globalScope.implicit;

			const sourceCode = new SourceCode({
				text: code,
				ast,
				scopeManager,
			});

			sourceCode.applyLanguageOptions({
				ecmaVersion: 2015,
			});

			// should not throw
			sourceCode.finalize();
		});

		it("should not crash if global scope doesn't have `implicit.left` property", () => {
			const code = "Array = 1; Foo = 1; Promise = 1; Array; Foo; Promise";
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const scopeManager = eslintScope.analyze(ast, {
				ignoreEval: true,
				ecmaVersion: 6,
			});

			const globalScope = scopeManager.scopes[0];
			delete globalScope.implicit.left;

			const sourceCode = new SourceCode({
				text: code,
				ast,
				scopeManager,
			});

			sourceCode.applyLanguageOptions({
				ecmaVersion: 2015,
			});

			// should not throw
			sourceCode.finalize();

			const { implicit } = globalScope;

			assert.deepStrictEqual(
				[...implicit.set].map(([name]) => name),
				["Foo"],
			);
			assert.deepStrictEqual(
				implicit.variables.map(({ name }) => name),
				["Foo"],
			);
		});
	});

	describe("isGlobalReference(node)", () => {
		it("should throw an error when argument is missing", () => {
			assert.throws(() => {
				linter.verify("foo", {
					plugins: {
						test: {
							rules: {
								"is-global-reference": {
									create: context => ({
										Program() {
											context.sourceCode.isGlobalReference();
										},
									}),
								},
							},
						},
					},
					rules: { "test/is-global-reference": 2 },
				});
			}, /Missing required argument: node/u);
		});

		it("should correctly identify global references", () => {
			const code =
				"undefined; globalThis; NaN; Object; Boolean; String; Math; Date; Array; Map; Set; var foo; foo;";
			let identifierSpy;

			const config = {
				languageOptions: {
					sourceType: "script",
				},
				plugins: {
					test: {
						rules: {
							checker: {
								create(context) {
									const sourceCode = context.sourceCode;
									const globals = new Set([
										"undefined",
										"globalThis",
										"NaN",
										"Object",
										"Boolean",
										"String",
										"Math",
										"Date",
										"Array",
										"Map",
										"Set",
									]);

									identifierSpy = sinon.spy(node => {
										if (globals.has(node.name)) {
											assert.isTrue(
												sourceCode.isGlobalReference(
													node,
												),
												`Expected ${node.name} to be identified as a global reference`,
											);
										} else if (node.name === "foo") {
											// The second "foo" reference (not the declaration) should not be a global reference
											if (
												node.parent.type !==
												"VariableDeclarator"
											) {
												assert.isFalse(
													sourceCode.isGlobalReference(
														node,
													),
													"Expected local variable to not be identified as a global reference",
												);
											}
										}
									});

									return { Identifier: identifierSpy };
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			};

			linter.verify(code, config);
			assert(identifierSpy.called, "Identifier spy was not called.");
			assert(
				identifierSpy.callCount > 10,
				"Identifier spy was not called enough times.",
			);
		});

		it("should handle function parameters and shadowed globals", () => {
			const code = "function test(param, NaN) { param; NaN; }";
			let spy;

			const config = {
				plugins: {
					test: {
						rules: {
							checker: {
								create(context) {
									const sourceCode = context.sourceCode;

									spy = sinon.spy(functionDecl => {
										const blockStatement =
											functionDecl.body;

										// Function parameter references
										const paramRef =
											blockStatement.body[0].expression;
										const NaNRef =
											blockStatement.body[1].expression;

										assert.strictEqual(
											paramRef.name,
											"param",
										);
										assert.strictEqual(NaNRef.name, "NaN");

										assert.isFalse(
											sourceCode.isGlobalReference(
												paramRef,
											),
										);
										assert.isFalse(
											sourceCode.isGlobalReference(
												NaNRef,
											),
										);
									});

									return { FunctionDeclaration: spy };
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			};

			linter.verify(code, config);
			assert(spy && spy.calledOnce, "Spy was not called.");
		});

		it("should identify global references in modules", () => {
			const code = "Math;";
			let spy;

			const config = {
				plugins: {
					test: {
						rules: {
							checker: {
								create(context) {
									const sourceCode = context.sourceCode;

									spy = sinon.spy(() => {
										const program = sourceCode.ast;
										const mathRef =
											program.body[0].expression;

										assert.strictEqual(
											mathRef.name,
											"Math",
										);
										assert.isTrue(
											sourceCode.isGlobalReference(
												mathRef,
											),
										);
									});

									return { "Program:exit": spy };
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
				languageOptions: {
					ecmaVersion: 2015,
					sourceType: "module",
				},
			};

			linter.verify(code, config);
			assert(spy && spy.calledOnce, "Spy was not called.");
		});

		it("should identify variables in higher scopes as non-global", () => {
			const code = "var outer; function foo() { outer; }";
			let spy;

			const config = {
				plugins: {
					test: {
						rules: {
							checker: {
								create(context) {
									const sourceCode = context.sourceCode;

									spy = sinon.spy(functionDecl => {
										const blockStatement =
											functionDecl.body;
										const outerRef =
											blockStatement.body[0].expression;

										assert.strictEqual(
											outerRef.name,
											"outer",
										);
										assert.isFalse(
											sourceCode.isGlobalReference(
												outerRef,
											),
										);
									});

									return { FunctionDeclaration: spy };
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			};

			linter.verify(code, config);
			assert(spy && spy.calledOnce, "Spy was not called.");
		});

		it("should distinguish between object property access and global references", () => {
			const code = "String; String.length; Math; obj.Math;";
			let identifierSpy;

			const config = {
				plugins: {
					test: {
						rules: {
							checker: {
								create(context) {
									const sourceCode = context.sourceCode;

									identifierSpy = sinon.spy(node => {
										if (node.name === "String") {
											assert.isTrue(
												sourceCode.isGlobalReference(
													node,
												),
												"Expected 'String' to be identified as a global reference",
											);
										} else if (
											node.name === "length" &&
											node.parent.type ===
												"MemberExpression"
										) {
											assert.isFalse(
												sourceCode.isGlobalReference(
													node,
												),
												"Expected property 'length' to not be identified as a global reference",
											);
										} else if (
											node.name === "Math" &&
											node.parent.type !==
												"MemberExpression"
										) {
											assert.isTrue(
												sourceCode.isGlobalReference(
													node,
												),
												"Expected 'Math' to be identified as a global reference",
											);
										} else if (
											node.name === "Math" &&
											node.parent.object.name === "obj"
										) {
											assert.isFalse(
												sourceCode.isGlobalReference(
													node,
												),
												"Expected 'obj.Math' property to not be identified as a global reference",
											);
										}
									});

									return { Identifier: identifierSpy };
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			};

			linter.verify(code, config);
			assert(identifierSpy.called, "Identifier spy was not called.");
		});

		it("should handle destructuring assignments properly", () => {
			const code =
				"const { Math } = obj; Math; const [Array] = list; Array;";
			let spy;

			const config = {
				plugins: {
					test: {
						rules: {
							checker: {
								create(context) {
									const sourceCode = context.sourceCode;

									spy = sinon.spy(() => {
										// Get the second Math identifier (outside destructuring)
										const mathRef =
											sourceCode.ast.body[1].expression;
										// Get the second Array identifier (outside destructuring)
										const arrayRef =
											sourceCode.ast.body[3].expression;

										assert.strictEqual(
											mathRef.name,
											"Math",
										);
										assert.strictEqual(
											arrayRef.name,
											"Array",
										);

										assert.isFalse(
											sourceCode.isGlobalReference(
												mathRef,
											),
											"Destructured 'Math' should not be identified as a global reference",
										);
										assert.isFalse(
											sourceCode.isGlobalReference(
												arrayRef,
											),
											"Destructured 'Array' should not be identified as a global reference",
										);
									});

									return { "Program:exit": spy };
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
				languageOptions: { ecmaVersion: 2015 },
			};

			linter.verify(code, config);
			assert(spy && spy.calledOnce, "Spy was not called.");
		});

		it("should handle imported names that shadow globals", () => {
			const code =
				"import { Object, String } from './module'; Object; String;";
			let spy;

			const config = {
				plugins: {
					test: {
						rules: {
							checker: {
								create(context) {
									const sourceCode = context.sourceCode;

									spy = sinon.spy(() => {
										const objectRef =
											sourceCode.ast.body[1].expression;
										const stringRef =
											sourceCode.ast.body[2].expression;

										assert.strictEqual(
											objectRef.name,
											"Object",
										);
										assert.strictEqual(
											stringRef.name,
											"String",
										);

										assert.isFalse(
											sourceCode.isGlobalReference(
												objectRef,
											),
											"Imported 'Object' should not be identified as a global reference",
										);
										assert.isFalse(
											sourceCode.isGlobalReference(
												stringRef,
											),
											"Imported 'String' should not be identified as a global reference",
										);
									});

									return { "Program:exit": spy };
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			};

			linter.verify(code, config);
			assert(spy && spy.calledOnce, "Spy was not called.");
		});

		it("should handle temporal dead zone (TDZ) for let variables", () => {
			const code = "{ console.log(x); let x = 5; }";
			let spy;

			const config = {
				plugins: {
					test: {
						rules: {
							checker: {
								create(context) {
									const sourceCode = context.sourceCode;

									spy = sinon.spy(node => {
										if (
											node.name === "x" &&
											node.parent.type !==
												"VariableDeclarator"
										) {
											assert.isFalse(
												sourceCode.isGlobalReference(
													node,
												),
												"Reference in TDZ should not be identified as a global reference",
											);
										}
									});

									return { Identifier: spy };
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
				languageOptions: { ecmaVersion: 2015 },
			};

			linter.verify(code, config);
			assert(spy && spy.called, "Spy was not called.");
		});

		it("should handle variables shadowed in catch blocks", () => {
			const code = "try {} catch (Error) { Error; }";
			let spy;

			const config = {
				plugins: {
					test: {
						rules: {
							checker: {
								create(context) {
									const sourceCode = context.sourceCode;

									spy = sinon.spy(node => {
										if (
											node.parent.type === "CatchClause"
										) {
											// Skip the catch parameter declaration
											return;
										}

										if (node.name === "Error") {
											assert.isFalse(
												sourceCode.isGlobalReference(
													node,
												),
												"Error in catch block should not be identified as a global reference",
											);
										}
									});

									return { Identifier: spy };
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			};

			linter.verify(code, config);
			assert(spy && spy.called, "Spy was not called.");
		});

		it("should handle class declarations and methods", () => {
			const code =
				"class MyClass { method() { Math.random(); this.Math = 5; } }";
			let spy;

			const config = {
				plugins: {
					test: {
						rules: {
							checker: {
								create(context) {
									const sourceCode = context.sourceCode;

									spy = sinon.spy(node => {
										if (
											node.name === "Math" &&
											node.parent.type ===
												"MemberExpression" &&
											node.parent.object.type !==
												"ThisExpression"
										) {
											assert.isTrue(
												sourceCode.isGlobalReference(
													node,
												),
												"Math in method should be identified as a global reference",
											);
										} else if (
											node.name === "Math" &&
											node.parent.object &&
											node.parent.object.type ===
												"ThisExpression"
										) {
											assert.isFalse(
												sourceCode.isGlobalReference(
													node,
												),
												"this.Math should not be identified as a global reference",
											);
										}
									});

									return { Identifier: spy };
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
				languageOptions: { ecmaVersion: 2015 },
			};

			linter.verify(code, config);
			assert(spy && spy.called, "Spy was not called.");
		});

		it("should respect /*globals*/ directive comments", () => {
			const code =
				"/*globals customGlobal:writable, String:off */ customGlobal; String;";
			let spy;

			const config = {
				plugins: {
					test: {
						rules: {
							checker: {
								create(context) {
									const sourceCode = context.sourceCode;

									spy = sinon.spy(node => {
										if (node.name === "customGlobal") {
											assert.isTrue(
												sourceCode.isGlobalReference(
													node,
												),
												"Variable declared in globals directive should be identified as a global reference",
											);
										} else if (node.name === "String") {
											assert.isFalse(
												sourceCode.isGlobalReference(
													node,
												),
												"Global turned off in directive should not be identified as a global reference",
											);
										}
									});

									return { Identifier: spy };
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			};

			linter.verify(code, config);
			assert(spy && spy.called, "Spy was not called.");
		});

		it("should cache the result of isGlobalReference for the same node", () => {
			const code = "Math; Math;";
			let firstNode, secondNode, sourceCodeInstance;

			const config = {
				plugins: {
					test: {
						rules: {
							checker: {
								create(context) {
									const sourceCode = context.sourceCode;
									sourceCodeInstance = sourceCode;
									return {
										Identifier(node) {
											if (!firstNode) {
												firstNode = node;
											} else if (!secondNode) {
												secondNode = node;
											}
										},
									};
								},
							},
						},
					},
				},
				rules: { "test/checker": "error" },
			};

			linter.verify(code, config);

			// Spy on the internal cache
			const cache =
				sourceCodeInstance[
					Object.getOwnPropertySymbols(sourceCodeInstance).find(
						sym =>
							sourceCodeInstance[sym] instanceof Map &&
							sourceCodeInstance[sym].has("isGlobalReference"),
					)
				].get("isGlobalReference");

			// Clear cache for firstNode and count calls
			cache.delete(firstNode);
			let computeCount = 0;
			const original =
				sourceCodeInstance.scopeManager.scopes[0].set.get("Math")
					.references.some;
			sourceCodeInstance.scopeManager.scopes[0].set.get(
				"Math",
			).references.some = function (...args) {
				computeCount++;
				return original.apply(this, args);
			};

			// Call twice, should only compute once
			sourceCodeInstance.isGlobalReference(firstNode);
			sourceCodeInstance.isGlobalReference(firstNode);

			assert.strictEqual(
				computeCount,
				1,
				"isGlobalReference should compute only once per node",
			);

			// Second node should compute
			sourceCodeInstance.isGlobalReference(secondNode);
			sourceCodeInstance.isGlobalReference(secondNode);
			assert.strictEqual(
				computeCount,
				2,
				"isGlobalReference should compute only once per node",
			);

			// Restore
			sourceCodeInstance.scopeManager.scopes[0].set.get(
				"Math",
			).references.some = original;
		});
	});

	describe("traverse()", () => {
		it("should return an array of steps", () => {
			const code = "var foo = 1;";
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const sourceCode = new SourceCode(code, ast);
			const steps = sourceCode.traverse();

			assert.isArray(steps);
			assert.strictEqual(steps.length, 14);
		});

		it("should return steps with VisitNodeStep for each node", () => {
			const code = "var foo = 1;";
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const sourceCode = new SourceCode(code, ast);
			const steps = sourceCode.traverse();

			// Filter for VisitNodeStep instances
			const visitSteps = steps.filter(step => step.kind === 1);

			assert.strictEqual(visitSteps.length, 10);

			// Verify visit step structure
			visitSteps.forEach(step => {
				assert.isNumber(step.phase);
				assert.isTrue(
					step.phase === 1 || step.phase === 2,
					"phase should be 1 (enter) or 2 (exit)",
				);
				assert.isArray(step.args);
				assert.isDefined(step.target.type, "target should have type");
			});
		});

		it("should have enter and exit phases for each node", () => {
			const code = "var foo = 1;";
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const sourceCode = new SourceCode(code, ast);
			const steps = sourceCode.traverse();

			const visitSteps = steps.filter(step => step.kind === 1);

			// Group steps by target node
			const nodeSteps = new Map();
			visitSteps.forEach(step => {
				const key = step.target.type;
				if (!nodeSteps.has(key)) {
					nodeSteps.set(key, []);
				}
				nodeSteps.get(key).push(step.phase);
			});

			// Every node type should have both enter (1) and exit (2) phases
			nodeSteps.forEach((phases, nodeType) => {
				assert.isTrue(
					phases.includes(1),
					`${nodeType} should have enter phase`,
				);
				assert.isTrue(
					phases.includes(2),
					`${nodeType} should have exit phase`,
				);
			});
		});

		it("should traverse nested nodes in correct order", () => {
			const code = "var foo = 1;";
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const sourceCode = new SourceCode(code, ast);
			const steps = sourceCode.traverse();

			const visitSteps = steps.filter(step => step.kind === 1);
			const nodeTypes = visitSteps.map(step => ({
				type: step.target.type,
				phase: step.phase,
			}));

			// Should have Program at the beginning
			assert.deepStrictEqual(nodeTypes, [
				{
					type: "Program",
					phase: 1,
				},
				{
					type: "VariableDeclaration",
					phase: 1,
				},
				{
					type: "VariableDeclarator",
					phase: 1,
				},
				{
					type: "Identifier",
					phase: 1,
				},
				{
					type: "Identifier",
					phase: 2,
				},
				{
					type: "Literal",
					phase: 1,
				},
				{
					type: "Literal",
					phase: 2,
				},
				{
					type: "VariableDeclarator",
					phase: 2,
				},
				{
					type: "VariableDeclaration",
					phase: 2,
				},
				{
					type: "Program",
					phase: 2,
				},
			]);
		});

		it("should cache the result of traverse()", () => {
			const code = "var foo = 1;";
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const sourceCode = new SourceCode(code, ast);

			const steps1 = sourceCode.traverse();
			const steps2 = sourceCode.traverse();

			assert.strictEqual(
				steps1,
				steps2,
				"traverse() should return the same cached array",
			);
		});

		it("should include CodePathAnalyzer steps for ESTree", () => {
			const code = "if (true) { var x = 1; }";
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const sourceCode = new SourceCode(code, ast);
			const steps = sourceCode.traverse();

			// Look for CallMethodStep (kind === 2) which are emitted by CodePathAnalyzer
			const callSteps = steps.filter(step => step.kind === 2);

			// For control flow code, CodePathAnalyzer should emit events
			assert.strictEqual(callSteps.length, 8);

			// Verify call steps have correct structure
			callSteps.forEach(step => {
				assert.isString(
					step.target,
					"call step target should be event name",
				);
				assert.isArray(step.args, "call step should have args array");
			});
		});

		it("should work with simple expressions", () => {
			const code = "42;";
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const sourceCode = new SourceCode(code, ast);
			const steps = sourceCode.traverse();

			assert.strictEqual(steps.length, 10);

			const visitSteps = steps.filter(step => step.kind === 1);
			const nodeTypes = new Set(visitSteps.map(step => step.target.type));

			assert.isTrue(
				nodeTypes.has("Program"),
				"should traverse Program node",
			);
			assert.isTrue(
				nodeTypes.has("ExpressionStatement"),
				"should traverse ExpressionStatement node",
			);
		});

		it("should work with function declarations", () => {
			const code = "function foo(a, b) { return a + b; }";
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const sourceCode = new SourceCode(code, ast);
			const steps = sourceCode.traverse();

			const visitSteps = steps.filter(step => step.kind === 1);
			const nodeTypes = new Set(visitSteps.map(step => step.target.type));

			assert.isTrue(
				nodeTypes.has("FunctionDeclaration"),
				"should traverse FunctionDeclaration",
			);
			assert.isTrue(
				nodeTypes.has("Identifier"),
				"should traverse Identifier nodes",
			);
			assert.isTrue(
				nodeTypes.has("ReturnStatement"),
				"should traverse ReturnStatement",
			);
		});

		it("should work with object and array patterns", () => {
			const code = "const {x, y} = obj; const [a, b] = arr;";
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const sourceCode = new SourceCode(code, ast);
			const steps = sourceCode.traverse();

			const visitSteps = steps.filter(step => step.kind === 1);
			const nodeTypes = new Set(visitSteps.map(step => step.target.type));

			assert.isTrue(
				nodeTypes.has("VariableDeclaration"),
				"should traverse VariableDeclaration",
			);
			assert.isTrue(
				nodeTypes.has("ObjectPattern"),
				"should traverse ObjectPattern",
			);
			assert.isTrue(
				nodeTypes.has("ArrayPattern"),
				"should traverse ArrayPattern",
			);
		});

		it("should traverse all nodes in correct depth-first order", () => {
			const code = "var x = y + z;";
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const sourceCode = new SourceCode(code, ast);
			const steps = sourceCode.traverse();

			const visitSteps = steps.filter(step => step.kind === 1);

			// Verify that we enter before we exit
			const enterExitMap = new Map();
			visitSteps.forEach((step, index) => {
				const nodeKey = `${step.target.type}@${step.target.range.join(",")}`;
				if (!enterExitMap.has(nodeKey)) {
					enterExitMap.set(nodeKey, { enter: null, exit: null });
				}
				if (step.phase === 1) {
					enterExitMap.get(nodeKey).enter = index;
				} else {
					enterExitMap.get(nodeKey).exit = index;
				}
			});

			// For each node, enter should come before exit
			enterExitMap.forEach(({ enter, exit }) => {
				assert.isNotNull(enter, "node should have enter phase");
				assert.isNotNull(exit, "node should have exit phase");
				assert.isBelow(
					enter,
					exit,
					"enter phase should come before exit phase",
				);
			});
		});

		it("should have node as first argument", () => {
			const code = "var foo = 1;";
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const sourceCode = new SourceCode(code, ast);
			const steps = sourceCode.traverse();

			const visitSteps = steps.filter(step => step.kind === 1);

			assert.strictEqual(visitSteps.length, 10);

			visitSteps.forEach(step => {
				assert.strictEqual(
					step.args.length,
					1,
					`Visit step for ${step.target.type} should have exactly 1 argument, got ${step.args.length}`,
				);

				const [node] = step.args;

				// First argument should be the node itself
				assert.strictEqual(
					node,
					step.target,
					`First argument should be the node (${step.target.type})`,
				);
			});
		});

		it("should set `parent` property on nodes as the actual parent node in the AST", () => {
			const code = "if (x) { var y = 1; }";
			const ast = espree.parse(code, DEFAULT_CONFIG);
			const sourceCode = new SourceCode(code, ast);
			sourceCode.traverse();

			const programNode = sourceCode.ast;
			assert.strictEqual(programNode.parent, null);

			const ifNode = programNode.body[0];
			assert.strictEqual(ifNode.parent, programNode);

			const xNode = ifNode.test;
			assert.strictEqual(xNode.parent, ifNode);

			const blockNode = ifNode.consequent;
			assert.strictEqual(blockNode.parent, ifNode);

			const varNode = blockNode.body[0];
			assert.strictEqual(varNode.parent, blockNode);

			const declaratorNode = varNode.declarations[0];
			assert.strictEqual(declaratorNode.parent, varNode);

			const yNode = declaratorNode.id;
			assert.strictEqual(yNode.parent, declaratorNode);

			const number1Node = declaratorNode.init;
			assert.strictEqual(number1Node.parent, declaratorNode);
		});
	});
});
