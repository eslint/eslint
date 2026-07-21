/**
 * @fileoverview Tests for SourceCodeVisitor.
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("node:assert"),
	sinon = require("sinon"),
	{ SourceCodeVisitor } = require("../../../lib/linter/source-code-visitor");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * First test function
 * @returns {void}
 */
function func1() {}

/**
 * Second test function
 * @returns {void}
 */
function func2() {}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("SourceCodeVisitor", () => {
	let visitor;

	beforeEach(() => {
		visitor = new SourceCodeVisitor();
	});

	describe("add()", () => {
		it("should add a function for a name that doesn't already exist", () => {
			visitor.add("test", func1);

			const functions = visitor.get("test");
			assert.strictEqual(functions.length, 1);
			assert.strictEqual(functions[0], func1);
		});

		it("should add a function to an existing list of functions", () => {
			visitor.add("test", func1);
			visitor.add("test", func2);

			const functions = visitor.get("test");
			assert.strictEqual(functions.length, 2);
			assert.strictEqual(functions[0], func1);
			assert.strictEqual(functions[1], func2);
		});

		it("should add functions for different names", () => {
			visitor.add("test1", func1);
			visitor.add("test2", func2);

			const functions1 = visitor.get("test1");
			const functions2 = visitor.get("test2");

			assert.strictEqual(functions1.length, 1);
			assert.strictEqual(functions1[0], func1);

			assert.strictEqual(functions2.length, 1);
			assert.strictEqual(functions2[0], func2);
		});
	});

	describe("get()", () => {
		it("should return an empty frozen array when no functions exist for a name", () => {
			const functions = visitor.get("nonexistent");

			assert.strictEqual(functions.length, 0);
			assert.throws(() => {
				functions.push(() => {});
			}, TypeError);
		});

		it("should return all functions for a name", () => {
			visitor.add("test", func1);
			visitor.add("test", func2);

			const functions = visitor.get("test");

			assert.strictEqual(functions.length, 2);
			assert.strictEqual(functions[0], func1);
			assert.strictEqual(functions[1], func2);
		});
	});

	describe("forEachName()", () => {
		it("should not call callback when there are no functions", () => {
			const callback = sinon.spy();

			visitor.forEachName(callback);

			assert.strictEqual(callback.callCount, 0);
		});

		it("should call callback once for each unique name", () => {
			const callback = sinon.spy();

			visitor.add("test1", func1);
			visitor.add("test2", func1);
			visitor.add("test1", func2);

			visitor.forEachName(callback);

			assert.strictEqual(callback.callCount, 2);
			assert(callback.firstCall.calledWith("test1"));
			assert(callback.secondCall.calledWith("test2"));
		});
	});

	describe("callSync()", () => {
		it("should not error when no functions exist for a name", () => {
			// Should not throw an error
			visitor.callSync("nonexistent", {});
		});

		it("should call all functions for a name with the arguments", () => {
			const spyFunc1 = sinon.spy();
			const spyFunc2 = sinon.spy();
			const arg1 = {};
			const arg2 = "test";

			visitor.add("test", spyFunc1);
			visitor.add("test", spyFunc2);

			visitor.callSync("test", arg1, arg2);

			assert(spyFunc1.calledOnce);
			assert(spyFunc1.calledWith(arg1, arg2));

			assert(spyFunc2.calledOnce);
			assert(spyFunc2.calledWith(arg1, arg2));
		});

		it("should call functions in the order they were added", () => {
			const calls = [];

			/**
			 * Pushes 1 to the calls array
			 * @returns {void}
			 */
			function pushOne() {
				calls.push(1);
			}

			/**
			 * Pushes 2 to the calls array
			 * @returns {void}
			 */
			function pushTwo() {
				calls.push(2);
			}

			visitor.add("test", pushOne);
			visitor.add("test", pushTwo);

			visitor.callSync("test");

			assert.deepStrictEqual(calls, [1, 2]);
		});

		it("should not call functions for other names", () => {
			const spyFunc1 = sinon.spy();
			const spyFunc2 = sinon.spy();

			visitor.add("test1", spyFunc1);
			visitor.add("test2", spyFunc2);

			visitor.callSync("test1");

			assert(spyFunc1.calledOnce);
			assert(spyFunc2.notCalled);
		});
	});
});
