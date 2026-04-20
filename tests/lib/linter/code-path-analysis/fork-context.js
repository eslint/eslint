/**
 * @fileoverview Tests for ForkContext.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("node:assert");
const ForkContext = require("../../../../lib/linter/code-path-analysis/fork-context");
const CodePathSegment = require("../../../../lib/linter/code-path-analysis/code-path-segment");
const IdGenerator = require("../../../../lib/linter/code-path-analysis/id-generator");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ForkContext", () => {
	describe("constructor", () => {
		it("should initialize with the given parameters", () => {
			const idGenerator = new IdGenerator("s");
			const upper = {};
			const context = new ForkContext(idGenerator, upper, 2);

			assert.strictEqual(context.idGenerator, idGenerator);
			assert.strictEqual(context.upper, upper);
			assert.strictEqual(context.count, 2);
			assert.deepStrictEqual(context.segmentsList, []);
		});
	});

	describe("newRoot()", () => {
		it("should create a root context", () => {
			const idGenerator = new IdGenerator("s");
			const context = ForkContext.newRoot(idGenerator);

			assert.strictEqual(context.idGenerator, idGenerator);
			assert.strictEqual(context.upper, null);
			assert.strictEqual(context.count, 1);
			assert.strictEqual(context.segmentsList.length, 1);
			assert.strictEqual(context.head.length, 1);
			assert.strictEqual(context.head[0].id, "s1");
			assert.strictEqual(context.head[0].reachable, true);
		});
	});

	describe("newEmpty()", () => {
		it("should create an empty context from parent", () => {
			const idGenerator = new IdGenerator("s");
			const parent = ForkContext.newRoot(idGenerator);
			const context = ForkContext.newEmpty(parent, false);

			assert.strictEqual(context.idGenerator, idGenerator);
			assert.strictEqual(context.upper, parent);
			assert.strictEqual(context.count, 1);
			assert.deepStrictEqual(context.segmentsList, []);
			assert.strictEqual(context.empty, true);
		});

		it("should create an empty context with doubled count if shouldForkLeavingPath is true", () => {
			const idGenerator = new IdGenerator("s");
			const parent = ForkContext.newRoot(idGenerator);
			const context = ForkContext.newEmpty(parent, true);

			assert.strictEqual(context.idGenerator, idGenerator);
			assert.strictEqual(context.upper, parent);
			assert.strictEqual(context.count, 2);
			assert.deepStrictEqual(context.segmentsList, []);
			assert.strictEqual(context.empty, true);
		});
	});

	describe("properties", () => {
		it("should return empty state correctly", () => {
			const idGenerator = new IdGenerator("s");
			const context = new ForkContext(idGenerator, null, 1);

			assert.strictEqual(context.empty, true);
			assert.deepStrictEqual(context.head, []);
			assert.strictEqual(context.reachable, false);

			const segment = CodePathSegment.newRoot(idGenerator.next());
			context.add([segment]);

			assert.strictEqual(context.empty, false);
			assert.deepStrictEqual(context.head, [segment]);
			assert.strictEqual(context.reachable, true);
		});
	});

	describe("segment creation methods", () => {
		let idGenerator;
		let context;

		beforeEach(() => {
			idGenerator = new IdGenerator("s");
			context = ForkContext.newRoot(idGenerator);
			CodePathSegment.markUsed(context.head[0]);
		});

		describe("makeNext()", () => {
			it("should create next segments", () => {
				const nextSegments = context.makeNext(-1, -1);
				assert.strictEqual(nextSegments.length, 1);
				assert.strictEqual(nextSegments[0].id, "s2");
				assert.strictEqual(nextSegments[0].reachable, true);
				assert.strictEqual(nextSegments[0].allPrevSegments.length, 1);
				assert.strictEqual(nextSegments[0].allPrevSegments[0].id, "s1");
			});
		});

		describe("makeUnreachable()", () => {
			it("should create unreachable segments", () => {
				const unreachableSegments = context.makeUnreachable(-1, -1);
				assert.strictEqual(unreachableSegments.length, 1);
				assert.strictEqual(unreachableSegments[0].id, "s2");
				assert.strictEqual(unreachableSegments[0].reachable, false);
				assert.strictEqual(
					unreachableSegments[0].allPrevSegments.length,
					1,
				);
				assert.strictEqual(
					unreachableSegments[0].allPrevSegments[0].id,
					"s1",
				);
			});
		});

		describe("makeDisconnected()", () => {
			it("should create disconnected segments", () => {
				const disconnectedSegments = context.makeDisconnected(-1, -1);
				assert.strictEqual(disconnectedSegments.length, 1);
				assert.strictEqual(disconnectedSegments[0].id, "s2");
				assert.strictEqual(disconnectedSegments[0].reachable, true);
				assert.strictEqual(
					disconnectedSegments[0].allPrevSegments.length,
					0,
				);
			});
		});
	});

	describe("modification methods", () => {
		let idGenerator;
		let context;

		beforeEach(() => {
			idGenerator = new IdGenerator("s");
			context = ForkContext.newRoot(idGenerator);
		});

		describe("add()", () => {
			it("should add segments to the context list", () => {
				const segment = CodePathSegment.newRoot("s2");
				context.add([segment]);
				assert.strictEqual(context.segmentsList.length, 2);
				assert.deepStrictEqual(context.head, [segment]);
			});
		});

		describe("replaceHead()", () => {
			it("should replace the head segment", () => {
				const replaceSegment = CodePathSegment.newRoot("s2");
				context.replaceHead([replaceSegment]);
				assert.strictEqual(context.segmentsList.length, 1);
				assert.deepStrictEqual(context.head, [replaceSegment]);
			});
		});

		describe("addAll()", () => {
			it("should add all segments from another context", () => {
				const otherContext = ForkContext.newRoot(new IdGenerator("t"));
				context.addAll(otherContext);
				assert.strictEqual(context.segmentsList.length, 2);
				assert.deepStrictEqual(context.head, otherContext.head);
			});
		});

		describe("clear()", () => {
			it("should clear the context list", () => {
				context.clear();
				assert.strictEqual(context.segmentsList.length, 0);
				assert.deepStrictEqual(context.head, []);
			});
		});
	});
});
