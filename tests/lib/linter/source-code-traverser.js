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
	createEmitter = require("../../../lib/linter/safe-emitter"),
	{
		SourceCodeTraverser,
	} = require("../../../lib/linter/source-code-traverser");

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
		let emitter, traverser;

		beforeEach(() => {
			emitter = Object.create(createEmitter(), {
				emit: { value: sinon.spy() },
			});

			["Foo", "Bar", "Foo > Bar", "Foo:exit"].forEach(selector =>
				emitter.on(selector, () => {}),
			);
			traverser = SourceCodeTraverser.getInstance(MOCK_LANGUAGE);
		});

		it("should generate events for AST nodes.", () => {
			const dummyNode = { type: "Foo", value: 1 };
			const sourceCode = createMockSourceCode(dummyNode);

			traverser.traverseSync(sourceCode, emitter);

			assert(emitter.emit.calledTwice);
			assert(emitter.emit.firstCall.calledWith("Foo", dummyNode));
			assert(emitter.emit.secondCall.calledWith("Foo:exit", dummyNode));
		});

		it("should use nodeTypeKey if provided.", () => {
			traverser = new SourceCodeTraverser({
				...MOCK_LANGUAGE,
				nodeTypeKey: "customType",
			});
			const dummyNode = { customType: "Foo", value: 1 };
			const sourceCode = createMockSourceCode(dummyNode);

			traverser.traverseSync(sourceCode, emitter);

			assert(emitter.emit.calledTwice);
			assert(emitter.emit.firstCall.calledWith("Foo", dummyNode));
			assert(emitter.emit.secondCall.calledWith("Foo:exit", dummyNode));
		});

		it("should generate events for nested AST nodes", () => {
			const dummyNode = {
				type: "Foo",
				value: 1,
				child: { type: "Bar", value: 2 },
			};

			const sourceCode = createMockSourceCode(dummyNode);

			traverser.traverseSync(sourceCode, emitter);

			assert(emitter.emit.callCount === 4);
			assert(
				emitter.emit.firstCall.calledWith("Foo", dummyNode),
				"First call was wrong",
			);
			assert(
				emitter.emit.secondCall.calledWith("Bar", dummyNode.child),
				"Second call was wrong",
			);
			assert(
				emitter.emit.thirdCall.calledWith("Foo > Bar", dummyNode.child),
				"Third call was wrong",
			);
			assert(
				emitter.emit.lastCall.calledWith("Foo:exit", dummyNode),
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

			traverser.traverseSync(sourceCode, emitter);

			assert(emitter.emit.calledThrice);
			assert(emitter.emit.firstCall.calledWith("Foo", dummyNode));
			assert(
				emitter.emit.secondCall.calledWith(
					"customEvent",
					dummyNode,
					"extra",
				),
			);
			assert(emitter.emit.thirdCall.calledWith("Foo:exit", dummyNode));
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
				() => traverser.traverseSync(sourceCode, emitter),
				/Invalid traversal step found:/u,
			);
		});

		it("should throw error with currentNode property when error occurs during traversal", () => {
			const dummyNode = { type: "Foo", value: 1 };
			const emitterWithError = createEmitter();

			emitterWithError.on("Foo", () => {
				throw new Error("Test error");
			});

			const sourceCode = createMockSourceCode(dummyNode);

			try {
				traverser.traverseSync(sourceCode, emitterWithError);
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

	describe("traversing an actual AST", () => {
		/**
		 * Gets a list of emitted types/selectors from the traverser, in emission order
		 * @param {string} sourceText The source text to parse and traverse
		 * @param {Array<string>|Set<string>} possibleQueries Selectors to detect
		 * @returns {Array[]} A list of emissions, in the order that they were emitted. Each emission is a two-element
		 * array where the first element is a string, and the second element is the emitted AST node.
		 */
		function getEmissions(sourceText, possibleQueries) {
			const emissions = [];
			const emitter = Object.create(createEmitter(), {
				emit: {
					value: (selector, node) => emissions.push([selector, node]),
				},
			});

			possibleQueries.forEach(query => emitter.on(query, () => {}));

			const ast = espree.parse(sourceText, ESPREE_CONFIG);
			const sourceCode = createMockSourceCode(ast);
			const traverser = SourceCodeTraverser.getInstance(MOCK_LANGUAGE);

			traverser.traverseSync(sourceCode, emitter);

			return emissions.filter(emission =>
				possibleQueries.includes(emission[0]),
			);
		}

		/**
		 * Creates a test case that asserts a particular sequence of traverser emissions
		 * @param {string} sourceText The source text that should be parsed and traversed
		 * @param {string[]} possibleQueries A collection of selectors that rules are listening for
		 * @param {Array[]} expectedEmissions A function that accepts the AST and returns a list of the emissions that the
		 * traverser is expected to produce, in order.
		 * Each element of this list is an array where the first element is a selector (string), and the second is an AST node
		 * This should only include emissions that appear in possibleQueries.
		 * @returns {void}
		 */
		function assertEmissions(
			sourceText,
			possibleQueries,
			expectedEmissions,
		) {
			it(possibleQueries.join("; "), () => {
				const ast = espree.parse(sourceText, ESPREE_CONFIG);
				const emissions = getEmissions(sourceText, possibleQueries);

				assert.deepStrictEqual(emissions, expectedEmissions(ast));
			});
		}

		assertEmissions(
			"foo + bar;",
			[
				"Program",
				"Program:exit",
				"ExpressionStatement",
				"BinaryExpression",
				"BinaryExpression:exit",
				"Identifier",
			],
			ast => [
				["Program", ast], // entering program
				["ExpressionStatement", ast.body[0]], // entering 'foo + bar;'
				["BinaryExpression", ast.body[0].expression], // entering 'foo + bar'
				["Identifier", ast.body[0].expression.left], // entering 'foo'
				["Identifier", ast.body[0].expression.right], // entering 'bar'
				["BinaryExpression:exit", ast.body[0].expression], // exiting 'foo + bar'
				["Program:exit", ast], // exiting program
			],
		);

		assertEmissions(
			"foo + 5",
			[
				"BinaryExpression > Identifier",
				"BinaryExpression > Literal:exit",
			],
			ast => [
				["BinaryExpression > Identifier", ast.body[0].expression.left], // foo
				[
					"BinaryExpression > Literal:exit",
					ast.body[0].expression.right,
				], // exiting 5
			],
		);

		assertEmissions("foo", ["*:not(ExpressionStatement)"], ast => [
			["*:not(ExpressionStatement)", ast], // Program
			["*:not(ExpressionStatement)", ast.body[0].expression], // Identifier
		]);
	});

	describe("parsing an invalid selector", () => {
		it("throws a useful error", () => {
			const emitter = createEmitter();

			emitter.on("Foo >", () => {});

			assert.throws(() => {
				const traverser = new SourceCodeTraverser(MOCK_LANGUAGE);
				const sourceCode = createMockSourceCode({
					type: "Program",
					body: [],
				});
				traverser.traverseSync(sourceCode, emitter);
			}, /Syntax error in selector "Foo >" at position 5: Expected " ", "!", .*/u);
		});
	});
});
