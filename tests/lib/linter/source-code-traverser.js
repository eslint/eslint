/**
 * @fileoverview Tests for SourceCodeTraverser.
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("node:assert"),
	sinon = require("sinon"),
	espree = require("espree"),
	vk = require("eslint-visitor-keys"),
	{ SourceCodeVisitor } = require("../../../lib/linter/source-code-visitor"),
	{
		SourceCodeTraverser,
	} = require("../../../lib/linter/source-code-traverser"),
	jslang = require("../../../lib/languages/js");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

const ESPREE_CONFIG = {
	ecmaVersion: 6,
	comment: true,
	tokens: true,
	range: true,
	loc: true,
};

// Mock Language object for tests
const MOCK_LANGUAGE = {
	visitorKeys: vk.KEYS,
	nodeTypeKey: "type",
};

// Step kinds for source code traversal
const STEP_KIND_VISIT = 1;
const STEP_KIND_CALL = 2;

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const keysToSkip = new Set(["parent", "loc", "tokens", "comments", "range"]);

/**
 * Create a mock SourceCode object with traversal steps
 * @param {Object} ast The AST to traverse
 * @returns {Object} A mock SourceCode object
 */
function createMockSourceCode(ast) {
	const steps = [];

	/**
	 * Recursively builds traversal steps for the AST
	 * @param {Object} node The current AST node
	 * @param {Object[]} ancestors The ancestry of the current node
	 * @returns {void}
	 */
	function buildSteps(node, ancestors = []) {
		// Enter phase
		steps.push({
			kind: STEP_KIND_VISIT,
			target: node,
			phase: 1, // enter phase
		});

		// Visit children
		const keys = vk.getKeys(node);
		if (keys) {
			for (const key of keys) {
				if (keysToSkip.has(key)) {
					continue; // Skip keys that should not be traversed
				}

				const child = node[key];
				if (Array.isArray(child)) {
					for (const item of child) {
						if (item && typeof item === "object") {
							buildSteps(item, [node, ...ancestors]);
						}
					}
				} else if (child && typeof child === "object") {
					buildSteps(child, [node, ...ancestors]);
				}
			}
		}

		// Exit phase
		steps.push({
			kind: STEP_KIND_VISIT,
			target: node,
			phase: 2, // exit phase
		});
	}

	buildSteps(ast);

	return {
		ast,
		visitorKeys: vk.KEYS,
		*traverse() {
			for (const step of steps) {
				yield step;
			}
		},
	};
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("SourceCodeTraverser", () => {
	describe("traverseSync", () => {
		let visitor, traverser;

		beforeEach(() => {
			visitor = Object.assign(new SourceCodeVisitor(), {
				callSync: sinon.spy(),
			});

			["Foo", "Bar", "Foo > Bar", "Foo:exit"].forEach(selector =>
				visitor.add(selector, () => {}),
			);
			traverser = SourceCodeTraverser.getInstance(MOCK_LANGUAGE);
		});

		it("should generate events for AST nodes.", () => {
			const dummyNode = { type: "Foo", value: 1 };
			const sourceCode = createMockSourceCode(dummyNode);

			traverser.traverseSync(sourceCode, visitor);

			assert(visitor.callSync.calledTwice);
			assert(visitor.callSync.firstCall.calledWith("Foo", dummyNode));
			assert(
				visitor.callSync.secondCall.calledWith("Foo:exit", dummyNode),
			);
		});

		it("should use nodeTypeKey if provided.", () => {
			traverser = new SourceCodeTraverser({
				...MOCK_LANGUAGE,
				nodeTypeKey: "customType",
			});
			const dummyNode = { customType: "Foo", value: 1 };
			const sourceCode = createMockSourceCode(dummyNode);

			traverser.traverseSync(sourceCode, visitor);

			assert(visitor.callSync.calledTwice);
			assert(visitor.callSync.firstCall.calledWith("Foo", dummyNode));
			assert(
				visitor.callSync.secondCall.calledWith("Foo:exit", dummyNode),
			);
		});

		it("should generate events for nested AST nodes", () => {
			const dummyNode = {
				type: "Foo",
				value: 1,
				child: { type: "Bar", value: 2 },
			};

			const sourceCode = createMockSourceCode(dummyNode);

			traverser.traverseSync(sourceCode, visitor);

			assert(visitor.callSync.callCount === 4);
			assert(
				visitor.callSync.firstCall.calledWith("Foo", dummyNode),
				"First call was wrong",
			);
			assert(
				visitor.callSync.secondCall.calledWith("Bar", dummyNode.child),
				"Second call was wrong",
			);
			assert(
				visitor.callSync.thirdCall.calledWith(
					"Foo > Bar",
					dummyNode.child,
				),
				"Third call was wrong",
			);
			assert(
				visitor.callSync.lastCall.calledWith("Foo:exit", dummyNode),
				"Last call was wrong",
			);
		});

		it("should handle call steps in traverse", () => {
			const dummyNode = { type: "Foo", value: 1 };
			const sourceCode = {
				ast: dummyNode,
				visitorKeys: vk.KEYS,
				*traverse() {
					yield {
						kind: STEP_KIND_VISIT,
						target: dummyNode,
						phase: 1,
					};
					yield {
						kind: STEP_KIND_CALL,
						target: "customEvent",
						args: [dummyNode, "extra"],
					};
					yield {
						kind: STEP_KIND_VISIT,
						target: dummyNode,
						phase: 2,
					};
				},
			};

			traverser.traverseSync(sourceCode, visitor);

			assert(visitor.callSync.calledThrice);
			assert(visitor.callSync.firstCall.calledWith("Foo", dummyNode));
			assert(
				visitor.callSync.secondCall.calledWith(
					"customEvent",
					dummyNode,
					"extra",
				),
			);
			assert(
				visitor.callSync.thirdCall.calledWith("Foo:exit", dummyNode),
			);
		});

		it("should pass step.args to visitor", () => {
			const dummyParent = { type: "Parent", value: 0 };
			const dummyNode = { type: "Foo", value: 1 };
			const sourceCode = {
				ast: dummyNode,
				visitorKeys: vk.KEYS,
				*traverse() {
					yield {
						kind: STEP_KIND_VISIT,
						target: dummyNode,
						phase: 1,
						args: [dummyNode, dummyParent],
					};
					yield {
						kind: STEP_KIND_VISIT,
						target: dummyNode,
						phase: 2,
						args: [dummyNode, dummyParent],
					};
				},
			};

			traverser.traverseSync(sourceCode, visitor);

			assert(visitor.callSync.calledTwice);
			assert(
				visitor.callSync.firstCall.calledWith(
					"Foo",
					dummyNode,
					dummyParent,
				),
			);
			assert(
				visitor.callSync.secondCall.calledWith(
					"Foo:exit",
					dummyNode,
					dummyParent,
				),
			);
		});

		it("should use provided steps instead of source code traverse", () => {
			// Create a source code object with normal traverse behavior
			const fooNode = { type: "Foo", value: 1 };
			const barNode = { type: "Bar", value: 2 };
			const sourceCode = createMockSourceCode(fooNode);

			// Create custom steps that don't match sourceCode.traverse() behavior
			const customSteps = [
				{
					kind: STEP_KIND_VISIT,
					target: barNode,
					phase: 1, // enter phase
				},
				{
					kind: STEP_KIND_CALL,
					target: "customEvent",
					args: [barNode, "customArg"],
				},
				{
					kind: STEP_KIND_VISIT,
					target: barNode,
					phase: 2, // exit phase
				},
			];

			// Add a listener for the Bar node type and custom event
			visitor.add("Bar", () => {});
			visitor.add("Bar:exit", () => {});
			visitor.add("customEvent", () => {});

			// Call traverseSync with custom steps
			traverser.traverseSync(sourceCode, visitor, { steps: customSteps });

			// Verify that our custom steps were used, not the source code's traverse
			assert(visitor.callSync.calledThrice);
			assert(
				visitor.callSync.firstCall.calledWith("Bar", barNode),
				"Should call with custom Bar node",
			);
			assert(
				visitor.callSync.secondCall.calledWith(
					"customEvent",
					barNode,
					"customArg",
				),
				"Should emit custom event",
			);
			assert(
				visitor.callSync.thirdCall.calledWith("Bar:exit", barNode),
				"Should call exit with custom Bar node",
			);
			assert(
				visitor.callSync.neverCalledWith("Foo", fooNode),
				"Should not emit events for original Foo node",
			);
		});

		it("should throw error for invalid step kind", () => {
			const dummyNode = { type: "Foo", value: 1 };
			const sourceCode = {
				ast: dummyNode,
				visitorKeys: vk.KEYS,
				*traverse() {
					yield {
						kind: 999, // Invalid step kind
						target: dummyNode,
					};
				},
			};

			assert.throws(
				() => traverser.traverseSync(sourceCode, visitor),
				/Invalid traversal step found:/u,
			);
		});

		it("should throw error with currentNode property when error occurs during traversal", () => {
			const dummyNode = { type: "Foo", value: 1 };
			const visitorWithError = Object.assign(new SourceCodeVisitor(), {
				callSync() {
					throw new Error("Test error");
				},
			});

			["Foo"].forEach(selector =>
				visitorWithError.add(selector, () => {}),
			);

			const sourceCode = createMockSourceCode(dummyNode);

			try {
				traverser.traverseSync(sourceCode, visitorWithError);
				assert.fail("Should have thrown error");
			} catch (err) {
				assert.strictEqual(err.message, "Test error");
				assert.strictEqual(err.currentNode, dummyNode);
			}
		});
	});

	describe("caching behavior", () => {
		it("should cache instances per language", () => {
			const language1 = { ...MOCK_LANGUAGE };
			const language2 = { ...MOCK_LANGUAGE };

			const instance1a = SourceCodeTraverser.getInstance(language1);
			const instance1b = SourceCodeTraverser.getInstance(language1);
			const instance2 = SourceCodeTraverser.getInstance(language2);

			assert.strictEqual(
				instance1a,
				instance1b,
				"Should return same instance for same language",
			);
			assert.notStrictEqual(
				instance1a,
				instance2,
				"Should return different instance for different language",
			);
		});
	});

	describe("traversing the entire AST", () => {
		/**
		 * Gets a list of emitted types/selectors from the traverser, in emission order
		 * @param {ASTNode} ast The AST to traverse
		 * @param {Array<string>|Set<string>} possibleQueries Selectors to detect
		 * @returns {Array[]} A list of emissions, in the order that they were emitted. Each emission is a two-element
		 * array where the first element is a string, and the second element is the emitted AST node.
		 */
		function getEmissions(ast, possibleQueries) {
			const emissions = [];
			const visitor = Object.assign(new SourceCodeVisitor(), {
				callSync(selector, node) {
					emissions.push([selector, node]);
				},
			});

			possibleQueries.forEach(query => visitor.add(query, () => {}));

			const sourceCode = createMockSourceCode(ast);
			const traverser = SourceCodeTraverser.getInstance(jslang);

			traverser.traverseSync(sourceCode, visitor);

			return emissions.filter(emission =>
				possibleQueries.includes(emission[0]),
			);
		}

		/**
		 * Creates a test case that asserts a particular sequence of traverser emissions
		 * @param {string} sourceText The source text that should be parsed and traversed
		 * @param {string[]} possibleQueries A collection of selectors that rules are listening for
		 * @param {(ast: ASTNode) => Array[]} getExpectedEmissions A function that accepts the AST and returns a list of the emissions that the
		 * traverser is expected to produce, in order.
		 * Each element of this list is an array where the first element is a selector (string), and the second is an AST node
		 * This should only include emissions that appear in possibleQueries.
		 * @returns {void}
		 */
		function assertEmissions(
			sourceText,
			possibleQueries,
			getExpectedEmissions,
		) {
			it(possibleQueries.join("; "), () => {
				const ast = espree.parse(sourceText, ESPREE_CONFIG);

				const actualEmissions = getEmissions(ast, possibleQueries);
				const expectedEmissions = getExpectedEmissions(ast);

				assert.deepStrictEqual(actualEmissions, expectedEmissions);

				/*
				 * `assert.deepStrictEqual()` compares objects by their properties.
				 * Here, we additionally compare node objects by reference to ensure
				 * the emitted objects are expected instances from the AST.
				 */
				actualEmissions.forEach((actualEmission, index) => {
					assert.strictEqual(
						actualEmission[1],
						expectedEmissions[index][1],
						"Expected a node instance from the AST",
					);
				});
			});
		}

		assertEmissions(
			"foo + bar;",
			[
				"Program",
				"Program:exit",
				"ExpressionStatement",
				"ExpressionStatement:exit",
				"BinaryExpression",
				"BinaryExpression:exit",
				"Identifier",
				"Identifier:exit",
			],
			ast => [
				["Program", ast], // entering program
				["ExpressionStatement", ast.body[0]], // entering 'foo + bar;'
				["BinaryExpression", ast.body[0].expression], // entering 'foo + bar'
				["Identifier", ast.body[0].expression.left], // entering 'foo'
				["Identifier:exit", ast.body[0].expression.left], // exiting 'foo'
				["Identifier", ast.body[0].expression.right], // entering 'bar'
				["Identifier:exit", ast.body[0].expression.right], // exiting 'bar'
				["BinaryExpression:exit", ast.body[0].expression], // exiting 'foo + bar'
				["ExpressionStatement:exit", ast.body[0]], // exiting 'foo + bar;'
				["Program:exit", ast], // exiting program
			],
		);

		assertEmissions(
			"foo + 5",
			[
				"BinaryExpression > Identifier",
				"BinaryExpression",
				"BinaryExpression Literal:exit",
				"BinaryExpression > Identifier:exit",
				"BinaryExpression:exit",
			],
			ast => [
				["BinaryExpression", ast.body[0].expression], // foo + 5
				["BinaryExpression > Identifier", ast.body[0].expression.left], // foo
				[
					"BinaryExpression > Identifier:exit",
					ast.body[0].expression.left,
				], // exiting foo
				["BinaryExpression Literal:exit", ast.body[0].expression.right], // exiting 5
				["BinaryExpression:exit", ast.body[0].expression], // exiting foo + 5
			],
		);

		assertEmissions(
			"foo + 5",
			["BinaryExpression > *[name='foo']"],
			ast => [
				[
					"BinaryExpression > *[name='foo']",
					ast.body[0].expression.left,
				],
			], // entering foo
		);

		assertEmissions("foo", ["*"], ast => [
			["*", ast], // Program
			["*", ast.body[0]], // ExpressionStatement
			["*", ast.body[0].expression], // Identifier
		]);

		assertEmissions("foo", ["*:not(ExpressionStatement)"], ast => [
			["*:not(ExpressionStatement)", ast], // Program
			["*:not(ExpressionStatement)", ast.body[0].expression], // Identifier
		]);

		assertEmissions(
			"foo()",
			["CallExpression[callee.name='foo']"],
			ast => [
				["CallExpression[callee.name='foo']", ast.body[0].expression],
			], // foo()
		);

		assertEmissions(
			"foo()",
			["CallExpression[callee.name='bar']"],
			() => [], // (nothing emitted)
		);

		assertEmissions(
			"foo + bar + baz",
			[":not(*)"],
			() => [], // (nothing emitted)
		);

		assertEmissions(
			"foo + bar + baz",
			[
				":matches(Identifier[name='foo'], Identifier[name='bar'], Identifier[name='baz'])",
			],
			ast => [
				[
					":matches(Identifier[name='foo'], Identifier[name='bar'], Identifier[name='baz'])",
					ast.body[0].expression.left.left,
				], // foo
				[
					":matches(Identifier[name='foo'], Identifier[name='bar'], Identifier[name='baz'])",
					ast.body[0].expression.left.right,
				], // bar
				[
					":matches(Identifier[name='foo'], Identifier[name='bar'], Identifier[name='baz'])",
					ast.body[0].expression.right,
				], // baz
			],
		);

		assertEmissions(
			"foo + 5 + 6",
			["Identifier, Literal[value=5]"],
			ast => [
				[
					"Identifier, Literal[value=5]",
					ast.body[0].expression.left.left,
				], // foo
				[
					"Identifier, Literal[value=5]",
					ast.body[0].expression.left.right,
				], // 5
			],
		);

		assertEmissions(
			"[foo, 5, foo]",
			["Identifier + Literal"],
			ast => [
				["Identifier + Literal", ast.body[0].expression.elements[1]],
			], // 5
		);

		assertEmissions(
			"[foo, {}, 5]",
			["Identifier + Literal", "Identifier ~ Literal"],
			ast => [
				["Identifier ~ Literal", ast.body[0].expression.elements[2]],
			], // 5
		);

		assertEmissions(
			"foo; bar + baz; qux()",
			[":expression", ":statement"],
			ast => [
				[":statement", ast.body[0]],
				[":expression", ast.body[0].expression],
				[":statement", ast.body[1]],
				[":expression", ast.body[1].expression],
				[":expression", ast.body[1].expression.left],
				[":expression", ast.body[1].expression.right],
				[":statement", ast.body[2]],
				[":expression", ast.body[2].expression],
				[":expression", ast.body[2].expression.callee],
			],
		);

		assertEmissions(
			"function foo(){} var x; (function (p){}); () => {};",
			[
				":function",
				"ExpressionStatement > :function",
				"VariableDeclaration, :function[params.length=1]",
			],
			ast => [
				[":function", ast.body[0]], // function foo(){}
				[
					"VariableDeclaration, :function[params.length=1]",
					ast.body[1],
				], // var x;
				[":function", ast.body[2].expression], // function (p){}
				["ExpressionStatement > :function", ast.body[2].expression], // function (p){}
				[
					"VariableDeclaration, :function[params.length=1]",
					ast.body[2].expression,
				], // function (p){}
				[":function", ast.body[3].expression], // () => {}
				["ExpressionStatement > :function", ast.body[3].expression], // () => {}
			],
		);

		assertEmissions(
			"foo;",
			[
				"*",
				":not(*)",
				"Identifier",
				"ExpressionStatement > *",
				"ExpressionStatement > Identifier",
				"ExpressionStatement > [name='foo']",
				"Identifier, ReturnStatement",
				"FooStatement",
				"[name = 'foo']",
				"[name='foo']",
				"[name ='foo']",
				"Identifier[name='foo']",
				"[name='foo'][name.length=3]",
				":not(Program, ExpressionStatement)",
				":not(Program, Identifier) > [name.length=3]",
			],
			ast => [
				["*", ast], // Program
				["*", ast.body[0]], // ExpressionStatement

				// selectors for the 'foo' identifier, in order of increasing specificity
				["*", ast.body[0].expression], // 0 identifiers, 0 pseudoclasses
				["ExpressionStatement > *", ast.body[0].expression], // 0 pseudoclasses, 1 identifier
				["Identifier", ast.body[0].expression], // 0 pseudoclasses, 1 identifier
				[":not(Program, ExpressionStatement)", ast.body[0].expression], // 0 pseudoclasses, 2 identifiers
				["ExpressionStatement > Identifier", ast.body[0].expression], // 0 pseudoclasses, 2 identifiers
				["Identifier, ReturnStatement", ast.body[0].expression], // 0 pseudoclasses, 2 identifiers
				["[name = 'foo']", ast.body[0].expression], // 1 pseudoclass, 0 identifiers
				["[name ='foo']", ast.body[0].expression], // 1 pseudoclass, 0 identifiers
				["[name='foo']", ast.body[0].expression], // 1 pseudoclass, 0 identifiers
				["ExpressionStatement > [name='foo']", ast.body[0].expression], // 1 attribute, 1 identifier
				["Identifier[name='foo']", ast.body[0].expression], // 1 attribute, 1 identifier
				[
					":not(Program, Identifier) > [name.length=3]",
					ast.body[0].expression,
				], // 1 attribute, 2 identifiers
				["[name='foo'][name.length=3]", ast.body[0].expression], // 2 attributes, 0 identifiers
			],
		);

		assertEmissions(
			"foo(); bar; baz;",
			["CallExpression, [name='bar']"],
			ast => [
				["CallExpression, [name='bar']", ast.body[0].expression],
				["CallExpression, [name='bar']", ast.body[1].expression],
			],
		);

		assertEmissions("foo; bar;", ["[name.length=3]:exit"], ast => [
			["[name.length=3]:exit", ast.body[0].expression],
			["[name.length=3]:exit", ast.body[1].expression],
		]);

		// https://github.com/eslint/eslint/issues/14799
		assertEmissions("const {a = 1} = b;", ["Property > .key"], ast => [
			[
				"Property > .key",
				ast.body[0].declarations[0].id.properties[0].key,
			],
		]);
	});

	describe("traversing the entire non-standard AST", () => {
		/**
		 * Gets a list of emitted types/selectors from the generator, in emission order
		 * @param {ASTNode} ast The AST to traverse
		 * @param {Record<string, string[]>} visitorKeys The custom visitor keys.
		 * @param {Array<string>|Set<string>} possibleQueries Selectors to detect
		 * @returns {Array[]} A list of emissions, in the order that they were emitted. Each emission is a two-element
		 * array where the first element is a string, and the second element is the emitted AST node.
		 */
		function getEmissions(ast, visitorKeys, possibleQueries) {
			const emissions = [];
			const visitor = Object.assign(new SourceCodeVisitor(), {
				callSync(selector, node) {
					emissions.push([selector, node]);
				},
			});

			possibleQueries.forEach(query => visitor.add(query, () => {}));

			const sourceCode = createMockSourceCode(ast);
			sourceCode.visitorKeys = visitorKeys;
			const traverser = SourceCodeTraverser.getInstance(jslang);

			traverser.traverseSync(sourceCode, visitor);

			return emissions.filter(emission =>
				possibleQueries.includes(emission[0]),
			);
		}

		/**
		 * Creates a test case that asserts a particular sequence of generator emissions
		 * @param {ASTNode} ast The AST to traverse
		 * @param {Record<string, string[]>} visitorKeys The custom visitor keys.
		 * @param {string[]} possibleQueries A collection of selectors that rules are listening for
		 * @param {(ast: ASTNode) => Array[]} getExpectedEmissions A function that accepts the AST and returns a list of the emissions that the
		 * generator is expected to produce, in order.
		 * Each element of this list is an array where the first element is a selector (string), and the second is an AST node
		 * This should only include emissions that appear in possibleQueries.
		 * @returns {void}
		 */
		function assertEmissions(
			ast,
			visitorKeys,
			possibleQueries,
			getExpectedEmissions,
		) {
			it(possibleQueries.join("; "), () => {
				const actualEmissions = getEmissions(
					ast,
					visitorKeys,
					possibleQueries,
				);
				const expectedEmissions = getExpectedEmissions(ast);

				assert.deepStrictEqual(actualEmissions, expectedEmissions);

				/*
				 * `assert.deepStrictEqual()` compares objects by their properties.
				 * Here, we additionally compare node objects by reference to ensure
				 * the emitted objects are expected instances from the AST.
				 */
				actualEmissions.forEach((actualEmission, index) => {
					assert.strictEqual(
						actualEmission[1],
						expectedEmissions[index][1],
						"Expected a node instance from the AST",
					);
				});
			});
		}

		assertEmissions(
			espree.parse("const foo = [<div/>, <div/>]", {
				...ESPREE_CONFIG,
				ecmaFeatures: { jsx: true },
			}),
			vk.KEYS,
			["* ~ *"],
			ast => [
				["* ~ *", ast.body[0].declarations[0].init.elements[1]], // entering second JSXElement
			],
		);

		assertEmissions(
			{
				// Parse `class A implements B {}` with typescript-eslint.
				type: "Program",
				errors: [],
				comments: [],
				sourceType: "module",
				body: [
					{
						type: "ClassDeclaration",
						id: {
							type: "Identifier",
							name: "A",
						},
						superClass: null,
						implements: [
							{
								type: "ClassImplements",
								id: {
									type: "Identifier",
									name: "B",
								},
								typeParameters: null,
							},
						],
						body: {
							type: "ClassBody",
							body: [],
						},
					},
				],
			},
			vk.unionWith({
				// see https://github.com/typescript-eslint/typescript-eslint/blob/e4d737b47574ff2c53cabab22853035dfe48c1ed/packages/visitor-keys/src/visitor-keys.ts#L27
				ClassDeclaration: [
					"decorators",
					"id",
					"typeParameters",
					"superClass",
					"superTypeParameters",
					"implements",
					"body",
				],
			}),
			[":first-child"],
			ast => [
				[":first-child", ast.body[0]], // entering first ClassDeclaration
				[":first-child", ast.body[0].implements[0]], // entering first ClassImplements
			],
		);
	});

	describe("parsing an invalid selector", () => {
		it("throws a useful error", () => {
			const visitor = new SourceCodeVisitor();

			visitor.add("Foo >", () => {});

			assert.throws(() => {
				const traverser = new SourceCodeTraverser(MOCK_LANGUAGE);
				const sourceCode = createMockSourceCode({
					type: "Program",
					body: [],
				});
				traverser.traverseSync(sourceCode, visitor);
			}, /Syntax error in selector "Foo >" at position 5: Expected " ", "!", .*/u);
		});
	});
});
