/**
 * @fileoverview Tests for debug-helpers.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("node:assert"),
	debugHelpers = require("../../../../lib/linter/code-path-analysis/debug-helpers");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("debug-helpers", () => {
	describe("getId()", () => {
		it("should return the id when the segment is reachable", () => {
			const segment = { id: "s1", reachable: true };
			assert.strictEqual(debugHelpers.getId(segment), "s1");
		});

		it("should return the id with '!' when the segment is unreachable", () => {
			const segment = { id: "s1", reachable: false };
			assert.strictEqual(debugHelpers.getId(segment), "s1!");
		});
	});

	describe("nodeToString()", () => {
		it("should return the node type and name for Identifier without label", () => {
			const node = { type: "Identifier", name: "foo" };
			assert.strictEqual(
				debugHelpers.nodeToString(node),
				"Identifier (foo)",
			);
		});

		it("should return the node type, label, and name for Identifier with label", () => {
			const node = { type: "Identifier", name: "foo" };
			assert.strictEqual(
				debugHelpers.nodeToString(node, "enter"),
				"Identifier:enter (foo)",
			);
		});

		it("should return the node type and value for Literal without label", () => {
			const node = { type: "Literal", value: 42 };
			assert.strictEqual(debugHelpers.nodeToString(node), "Literal (42)");
		});

		it("should return the node type, label, and value for Literal with label", () => {
			const node = { type: "Literal", value: 42 };
			assert.strictEqual(
				debugHelpers.nodeToString(node, "exit"),
				"Literal:exit (42)",
			);
		});

		it("should return the node type for Program without label", () => {
			const node = { type: "Program" };
			assert.strictEqual(debugHelpers.nodeToString(node), "Program");
		});

		it("should return the node type and label for Program with label", () => {
			const node = { type: "Program" };
			assert.strictEqual(
				debugHelpers.nodeToString(node, "enter"),
				"Program:enter",
			);
		});
	});
});
