/**
 * @fileoverview Tests for TraversalSteps.
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
	{ VisitNodeStep, CallMethodStep } = require("@eslint/plugin-kit"),
	{ TraversalSteps } = require("../../../lib/shared/traversal-steps");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("TraversalSteps", () => {
	it("should be empty when created", () => {
		const steps = new TraversalSteps();

		assert.strictEqual(steps.length, 0);
		assert.deepStrictEqual(steps.targets, []);
		assert.deepStrictEqual(steps.details, []);
		assert.deepStrictEqual([...steps], []);
	});

	describe("addVisit()", () => {
		it("should store the node and the phase", () => {
			const steps = new TraversalSteps();
			const node = { type: "Program" };

			steps.addVisit(node, 1);
			steps.addVisit(node, 2);

			assert.strictEqual(steps.length, 2);
			assert.strictEqual(steps.targets[0], node);
			assert.strictEqual(steps.targets[1], node);
			assert.deepStrictEqual(steps.details, [1, 2]);
		});
	});

	describe("addCall()", () => {
		it("should store the method name and the arguments", () => {
			const steps = new TraversalSteps();
			const args = [{ id: "s1" }, { type: "Program" }];

			steps.addCall("onCodePathStart", args);

			assert.strictEqual(steps.length, 1);
			assert.strictEqual(steps.targets[0], "onCodePathStart");
			assert.strictEqual(steps.details[0], args);
		});

		it("should store a call that has no arguments", () => {
			const steps = new TraversalSteps();

			steps.addCall("onSomething", []);

			const [step] = steps;

			assert.instanceOf(step, CallMethodStep);
			assert.strictEqual(step.target, "onSomething");
			assert.deepStrictEqual(step.args, []);
		});
	});

	describe("[Symbol.iterator]()", () => {
		it("should yield a step object for each step in the order added", () => {
			const steps = new TraversalSteps();
			const program = { type: "Program" };
			const identifier = { type: "Identifier" };
			const args = [{ id: "s1" }, program];

			steps.addCall("onCodePathStart", args);
			steps.addVisit(program, 1);
			steps.addVisit(identifier, 1);
			steps.addVisit(identifier, 2);
			steps.addVisit(program, 2);

			const result = [...steps];

			assert.strictEqual(result.length, 5);

			assert.instanceOf(result[0], CallMethodStep);
			assert.strictEqual(result[0].kind, 2);
			assert.strictEqual(result[0].type, "call");
			assert.strictEqual(result[0].target, "onCodePathStart");
			assert.strictEqual(result[0].args, args);

			[
				[program, 1],
				[identifier, 1],
				[identifier, 2],
				[program, 2],
			].forEach(([node, phase], i) => {
				const step = result[i + 1];

				assert.instanceOf(step, VisitNodeStep);
				assert.strictEqual(step.kind, 1);
				assert.strictEqual(step.type, "visit");
				assert.strictEqual(step.target, node);
				assert.strictEqual(step.phase, phase);
				assert.deepStrictEqual(step.args, [node]);
				assert.strictEqual(step.args[0], node);
			});
		});

		it("should allow the steps to be iterated more than once", () => {
			const steps = new TraversalSteps();
			const node = { type: "Program" };

			steps.addVisit(node, 1);
			steps.addVisit(node, 2);

			assert.strictEqual([...steps].length, 2);
			assert.strictEqual([...steps].length, 2);
		});
	});
});
