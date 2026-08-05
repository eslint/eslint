/**
 * @fileoverview Tests for ForkContext.
 * @author kuldeep2822k
 */

"use strict";

const assert = require("node:assert");
const ForkContext = require("../../../../lib/linter/code-path-analysis/fork-context");

//------------------------------------------------------------------------------
// Stubs
//------------------------------------------------------------------------------

/**
 * Creates a stub id generator for testing.
 * Provides the same interface as IdGenerator without coupling to it.
 * @returns {Object} A stub id generator with a `next()` method.
 */
function createIdGenerator() {
	return {
		n: 0,
		next() {
			this.n++;
			return `s${this.n}`;
		},
	};
}

/**
 * Creates a stub code path segment for testing.
 * Provides the minimal shape expected by ForkContext without coupling
 * to the real CodePathSegment class.
 * @param {string} id The segment identifier.
 * @param {Array<Object>} allPrevSegments An array of previous segments.
 * @param {boolean} reachable Whether the segment is reachable.
 * @returns {Object} A stub segment object.
 */
function createSegment(id, allPrevSegments, reachable) {
	return {
		id,
		reachable,
		allPrevSegments,
		prevSegments: allPrevSegments.filter(s => s.reachable),
		nextSegments: [],
		allNextSegments: [],
		internal: {
			used: false,
			loopedPrevSegments: [],
		},
	};
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ForkContext", () => {
	let idGenerator;

	beforeEach(() => {
		idGenerator = createIdGenerator();
	});

	describe("constructor", () => {
		it("should set idGenerator", () => {
			const context = new ForkContext(idGenerator, null, 1);

			assert.strictEqual(context.idGenerator, idGenerator);
		});

		it("should set upper to null when no parent is given", () => {
			const context = new ForkContext(idGenerator, null, 1);

			assert.strictEqual(context.upper, null);
		});

		it("should set upper to the given parent context", () => {
			const parentContext = new ForkContext(idGenerator, null, 1);
			const context = new ForkContext(idGenerator, parentContext, 1);

			assert.strictEqual(context.upper, parentContext);
		});

		it("should set count", () => {
			const context = new ForkContext(idGenerator, null, 3);

			assert.strictEqual(context.count, 3);
		});

		it("should initialize segmentsList as an empty array", () => {
			const context = new ForkContext(idGenerator, null, 1);

			assert.ok(Array.isArray(context.segmentsList));
			assert.strictEqual(context.segmentsList.length, 0);
		});
	});

	describe("newRoot()", () => {
		it("should create a new root context with null upper and count 1", () => {
			const context = ForkContext.newRoot(idGenerator);

			assert.strictEqual(context.upper, null);
			assert.strictEqual(context.count, 1);
		});

		it("should add one initial segment to segmentsList", () => {
			const context = ForkContext.newRoot(idGenerator);

			assert.strictEqual(context.segmentsList.length, 1);
			assert.strictEqual(context.segmentsList[0].length, 1);
			assert.strictEqual(context.segmentsList[0][0].id, "s1");
			assert.strictEqual(context.segmentsList[0][0].reachable, true);
		});
	});

	describe("newEmpty()", () => {
		it("should create a new empty context with the given parent context", () => {
			const parentContext = ForkContext.newRoot(idGenerator);
			const context = ForkContext.newEmpty(parentContext, false);

			assert.strictEqual(context.upper, parentContext);
			assert.strictEqual(context.count, 1);
			assert.strictEqual(context.segmentsList.length, 0);
			assert.strictEqual(context.empty, true);
		});

		it("should create a new empty context with double count when shouldForkLeavingPath is true", () => {
			const parentContext = ForkContext.newRoot(idGenerator);
			const context = ForkContext.newEmpty(parentContext, true);

			assert.strictEqual(context.upper, parentContext);
			assert.strictEqual(context.count, 2);
			assert.strictEqual(context.segmentsList.length, 0);
			assert.strictEqual(context.empty, true);
		});
	});

	describe("head", () => {
		it("should return the last segments", () => {
			const context = ForkContext.newRoot(idGenerator);

			assert.strictEqual(context.head, context.segmentsList[0]);
		});

		it("should return an empty array if empty", () => {
			const parentContext = ForkContext.newRoot(idGenerator);
			const context = ForkContext.newEmpty(parentContext, false);

			assert.deepStrictEqual(context.head, []);
		});
	});

	describe("empty", () => {
		it("should return true if segmentsList is empty", () => {
			const parentContext = ForkContext.newRoot(idGenerator);
			const context = ForkContext.newEmpty(parentContext, false);

			assert.strictEqual(context.empty, true);
		});

		it("should return false if segmentsList is not empty", () => {
			const context = ForkContext.newRoot(idGenerator);

			assert.strictEqual(context.empty, false);
		});
	});

	describe("reachable", () => {
		it("should return true if any head segment is reachable", () => {
			const context = ForkContext.newRoot(idGenerator);

			assert.strictEqual(context.reachable, true);
		});

		it("should return false if no head segment is reachable", () => {
			const context = ForkContext.newRoot(idGenerator);
			const unreachableSegment = createSegment("s2", [], false);

			context.replaceHead([unreachableSegment]);
			assert.strictEqual(context.reachable, false);
		});

		it("should return false if empty", () => {
			const parentContext = ForkContext.newRoot(idGenerator);
			const context = ForkContext.newEmpty(parentContext, false);

			assert.strictEqual(context.reachable, false);
		});
	});

	describe("makeNext()", () => {
		it("should create next segments using elements from startIndex to endIndex", () => {
			const context = ForkContext.newRoot(idGenerator);
			const seg1 = createSegment(
				idGenerator.next(),
				[context.head[0]],
				true,
			);

			context.add([seg1]);
			const seg2 = createSegment(
				idGenerator.next(),
				[context.head[0]],
				true,
			);

			context.add([seg2]);

			/*
			 * segmentsList has 3 elements: [root], [seg1], [seg2]
			 * We need to mark segments used so that flattenUnusedSegments returns them
			 */
			seg1.internal.used = true;
			seg2.internal.used = true;

			const nextSegments = context.makeNext(1, 2);

			assert.strictEqual(nextSegments.length, 1);
			assert.strictEqual(nextSegments[0].allPrevSegments.length, 2);
			assert.strictEqual(nextSegments[0].allPrevSegments[0], seg1);
			assert.strictEqual(nextSegments[0].allPrevSegments[1], seg2);
		});

		it("should normalize negative values for startIndex and endIndex", () => {
			const context = ForkContext.newRoot(idGenerator);
			const seg1 = createSegment(
				idGenerator.next(),
				[context.head[0]],
				true,
			);

			context.add([seg1]);
			const seg2 = createSegment(
				idGenerator.next(),
				[context.head[0]],
				true,
			);

			context.add([seg2]);

			seg1.internal.used = true;
			seg2.internal.used = true;

			const nextSegments = context.makeNext(-2, -1);

			assert.strictEqual(nextSegments.length, 1);
			assert.strictEqual(nextSegments[0].allPrevSegments.length, 2);
			assert.strictEqual(nextSegments[0].allPrevSegments[0], seg1);
			assert.strictEqual(nextSegments[0].allPrevSegments[1], seg2);
		});
	});

	describe("makeUnreachable()", () => {
		it("should create unreachable next segments", () => {
			const context = ForkContext.newRoot(idGenerator);
			const nextSegments = context.makeUnreachable(0, 0);

			assert.strictEqual(nextSegments.length, 1);
			assert.strictEqual(nextSegments[0].reachable, false);
		});

		it("should normalize negative values for startIndex and endIndex", () => {
			const context = ForkContext.newRoot(idGenerator);
			const seg1 = createSegment(
				idGenerator.next(),
				[context.head[0]],
				true,
			);

			context.add([seg1]);
			const seg2 = createSegment(
				idGenerator.next(),
				[context.head[0]],
				true,
			);

			context.add([seg2]);

			seg1.internal.used = true;
			seg2.internal.used = true;

			const nextSegments = context.makeUnreachable(-2, -1);

			assert.strictEqual(nextSegments.length, 1);
			assert.strictEqual(nextSegments[0].reachable, false);
			assert.strictEqual(nextSegments[0].allPrevSegments.length, 2);
			assert.strictEqual(nextSegments[0].allPrevSegments[0], seg1);
			assert.strictEqual(nextSegments[0].allPrevSegments[1], seg2);
		});
	});

	describe("makeDisconnected()", () => {
		it("should create disconnected segments", () => {
			const context = ForkContext.newRoot(idGenerator);
			const nextSegments = context.makeDisconnected(0, 0);

			assert.strictEqual(nextSegments.length, 1);
			assert.strictEqual(nextSegments[0].allPrevSegments.length, 0);
			assert.strictEqual(nextSegments[0].reachable, true);
		});

		it("should normalize negative values for startIndex and endIndex", () => {
			const context = ForkContext.newRoot(idGenerator);
			const seg1 = createSegment(
				idGenerator.next(),
				[context.head[0]],
				true,
			);

			context.add([seg1]);
			const seg2 = createSegment(
				idGenerator.next(),
				[context.head[0]],
				true,
			);

			context.add([seg2]);

			seg1.internal.used = true;
			seg2.internal.used = true;

			const nextSegments = context.makeDisconnected(-2, -1);

			assert.strictEqual(nextSegments.length, 1);
			assert.strictEqual(nextSegments[0].allPrevSegments.length, 0);
			assert.strictEqual(nextSegments[0].reachable, true);
		});
	});

	describe("add()", () => {
		it("should throw an error when segments length is less than count", () => {
			const context = ForkContext.newRoot(idGenerator); // count is 1

			assert.throws(() => {
				context.add([]);
			}, /0 >= 1/u);
		});

		it("should add segments to segmentsList", () => {
			const context = ForkContext.newRoot(idGenerator);
			const newSegment = createSegment("s2", [context.head[0]], true);

			context.add([newSegment]);
			assert.strictEqual(context.segmentsList.length, 2);
			assert.strictEqual(context.head[0], newSegment);
		});

		it("should merge extra segments when segments length is greater than count", () => {
			const context = ForkContext.newRoot(idGenerator); // count is 1
			const seg1 = createSegment(
				idGenerator.next(),
				[context.head[0]],
				true,
			);
			const seg2 = createSegment(
				idGenerator.next(),
				[context.head[0]],
				true,
			);

			// Mark segments used so they aren't flattened during merge
			seg1.internal.used = true;
			seg2.internal.used = true;

			context.add([seg1, seg2]);

			assert.strictEqual(context.segmentsList.length, 2);
			assert.strictEqual(context.head.length, 1);
			assert.strictEqual(context.head[0].allPrevSegments.length, 2);
			assert.ok(context.head[0].allPrevSegments.includes(seg1));
			assert.ok(context.head[0].allPrevSegments.includes(seg2));
		});
	});

	describe("replaceHead()", () => {
		it("should throw an error when segments length is less than count", () => {
			const context = ForkContext.newRoot(idGenerator); // count is 1

			assert.throws(() => {
				context.replaceHead([]);
			}, /0 >= 1/u);
		});

		it("should replace head segments", () => {
			const context = ForkContext.newRoot(idGenerator);
			const newSegment = createSegment("s2", [context.head[0]], true);

			context.replaceHead([newSegment]);

			assert.strictEqual(context.segmentsList.length, 1);
			assert.strictEqual(context.head[0], newSegment);
		});

		it("should only modify the head", () => {
			const context = ForkContext.newRoot(idGenerator);
			const seg1 = context.head[0];
			const seg2 = createSegment("s2", [seg1], true);

			context.add([seg2]);
			const seg3 = createSegment("s3", [seg1], true);

			context.replaceHead([seg3]);

			assert.strictEqual(context.segmentsList.length, 2);
			assert.strictEqual(context.segmentsList[0][0], seg1);
			assert.strictEqual(context.segmentsList[1][0], seg3);
		});

		it("should merge extra segments when replacementHeadSegments length is greater than count", () => {
			const parent = ForkContext.newRoot(idGenerator);
			const context = ForkContext.newEmpty(parent, true); // count is 2
			const rootSeg = parent.head[0];

			const seg1 = createSegment("s1", [rootSeg], true);
			const seg2 = createSegment("s2", [rootSeg], true);

			context.add([seg1, seg2]);

			const seg3 = createSegment("s3", [rootSeg], true);
			const seg4 = createSegment("s4", [rootSeg], true);
			const seg5 = createSegment("s5", [rootSeg], true);
			const seg6 = createSegment("s6", [rootSeg], true);

			// Mark used so they don't get flattened
			seg3.internal.used = true;
			seg4.internal.used = true;
			seg5.internal.used = true;
			seg6.internal.used = true;

			context.replaceHead([seg3, seg4, seg5, seg6]);

			assert.strictEqual(context.segmentsList.length, 1);
			assert.strictEqual(context.head.length, 2);
		});
	});

	describe("addAll()", () => {
		it("should throw an error when context counts do not match", () => {
			const context1 = ForkContext.newRoot(idGenerator); // count is 1
			const parent2 = ForkContext.newRoot(idGenerator);
			const context2 = ForkContext.newEmpty(parent2, true); // count is 2

			assert.throws(() => {
				context1.addAll(context2);
			}, /Assertion failed./u);
		});

		it("should add all segments from another context", () => {
			const context1 = ForkContext.newRoot(idGenerator);
			const context2 = ForkContext.newRoot(idGenerator);

			const newSegment = createSegment("s3", [context2.head[0]], true);

			context2.add([newSegment]);

			context1.addAll(context2);

			assert.strictEqual(context1.segmentsList.length, 3);
			assert.strictEqual(context1.head[0], newSegment);
		});
	});

	describe("clear()", () => {
		it("should clear segmentsList", () => {
			const context = ForkContext.newRoot(idGenerator);
			context.clear();
			assert.strictEqual(context.segmentsList.length, 0);
		});
	});
});
