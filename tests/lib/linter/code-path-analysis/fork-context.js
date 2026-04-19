/**
 * @fileoverview Tests for ForkContext.
 */

"use strict";

const assert = require("node:assert");
const ForkContext = require("../../../../lib/linter/code-path-analysis/fork-context");
const IdGenerator = require("../../../../lib/linter/code-path-analysis/id-generator");
const CodePathSegment = require("../../../../lib/linter/code-path-analysis/code-path-segment");

describe("ForkContext", () => {
    let idGenerator;

    beforeEach(() => {
        idGenerator = new IdGenerator("s");
    });

    describe("newRoot()", () => {
        it("should create a new root context with one initial segment", () => {
            const context = ForkContext.newRoot(idGenerator);

            assert.strictEqual(context.upper, null);
            assert.strictEqual(context.count, 1);
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

    describe("properties", () => {
        it("head should return the last segments", () => {
            const context = ForkContext.newRoot(idGenerator);
            assert.strictEqual(context.head, context.segmentsList[0]);
        });

        it("head should return an empty array if empty", () => {
            const parentContext = ForkContext.newRoot(idGenerator);
            const context = ForkContext.newEmpty(parentContext, false);
            assert.deepStrictEqual(context.head, []);
        });

        it("reachable should return true if any head segment is reachable", () => {
            const context = ForkContext.newRoot(idGenerator);
            assert.strictEqual(context.reachable, true);
        });

        it("reachable should return false if no head segment is reachable", () => {
            const context = ForkContext.newRoot(idGenerator);
            const unreachableSegment = CodePathSegment.newUnreachable("s2", []);
            context.replaceHead([unreachableSegment]);
            assert.strictEqual(context.reachable, false);
        });

        it("reachable should return false if empty", () => {
            const parentContext = ForkContext.newRoot(idGenerator);
            const context = ForkContext.newEmpty(parentContext, false);
            assert.strictEqual(context.reachable, false);
        });
    });

    describe("makeNext()", () => {
        it("should create next segments using elements from startIndex to endIndex", () => {
            const context = ForkContext.newRoot(idGenerator);
            const seg1 = CodePathSegment.newNext("s2", [context.head[0]]);
            context.add([seg1]);
            const seg2 = CodePathSegment.newNext("s3", [context.head[0]]);
            context.add([seg2]);

            // segmentsList has 3 elements
            // [root], [s2], [s3]
            // We need to mark segments used so that flattenUnusedSegments returns them
            CodePathSegment.markUsed(seg1);
            CodePathSegment.markUsed(seg2);

            const nextSegments = context.makeNext(-2, -1);
            assert.strictEqual(nextSegments.length, 1);
            assert.strictEqual(nextSegments[0].allPrevSegments.length, 2);
            assert.strictEqual(nextSegments[0].reachable, true);
        });
    });

    describe("makeUnreachable()", () => {
        it("should create unreachable next segments", () => {
            const context = ForkContext.newRoot(idGenerator);
            const nextSegments = context.makeUnreachable(-1, -1);
            assert.strictEqual(nextSegments.length, 1);
            // newUnreachable flattens unused segments
            assert.strictEqual(nextSegments[0].reachable, false);
        });
    });

    describe("makeDisconnected()", () => {
        it("should create disconnected segments", () => {
            const context = ForkContext.newRoot(idGenerator);
            const nextSegments = context.makeDisconnected(-1, -1);
            assert.strictEqual(nextSegments.length, 1);
            assert.strictEqual(nextSegments[0].allPrevSegments.length, 0); // Disconnected doesn't connect
            assert.strictEqual(nextSegments[0].reachable, true); // Inherits reachable from prev segments
        });
    });

    describe("add()", () => {
        it("should add segments to segmentsList", () => {
            const context = ForkContext.newRoot(idGenerator);
            const newSegment = CodePathSegment.newNext("s2", [context.head[0]]);
            context.add([newSegment]);
            assert.strictEqual(context.segmentsList.length, 2);
            assert.strictEqual(context.head[0], newSegment);
        });

        it("should merge extra segments when segments length is greater than count", () => {
            const context = ForkContext.newRoot(idGenerator); // count is 1
            const seg1 = CodePathSegment.newNext("s2", [context.head[0]]);
            const seg2 = CodePathSegment.newNext("s3", [context.head[0]]);

            context.add([seg1, seg2]);

            assert.strictEqual(context.segmentsList.length, 2);
            assert.strictEqual(context.head.length, 1); // Because count is 1
        });
    });

    describe("replaceHead()", () => {
        it("should replace head segments", () => {
            const context = ForkContext.newRoot(idGenerator);
            const newSegment = CodePathSegment.newNext("s2", [context.head[0]]);
            context.replaceHead([newSegment]);

            assert.strictEqual(context.segmentsList.length, 1);
            assert.strictEqual(context.head[0], newSegment);
        });
    });

    describe("addAll()", () => {
        it("should add all segments from another context", () => {
            const context1 = ForkContext.newRoot(idGenerator);
            const context2 = ForkContext.newRoot(idGenerator);

            const newSegment = CodePathSegment.newNext("s3", [context2.head[0]]);
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
