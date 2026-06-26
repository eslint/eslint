/**
 * @fileoverview Tests for debug helpers.
 * @author Pixel998
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("node:assert");
const proxyquire = require("proxyquire").noCallThru();

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("debug-helpers", () => {
	describe("dumpDot()", () => {
		it("should escape DOT label text", () => {
			let debugCall;

			/**
			 * Capture debug calls.
			 * @param {...any} args The arguments passed to debug.
			 * @returns {void}
			 */
			function debugLog(...args) {
				debugCall = args;
			}

			debugLog.enabled = true;

			const debugHelpers = proxyquire(
				"../../../../lib/linter/code-path-analysis/debug-helpers",
				{
					debug: () => debugLog,
				},
			);
			const segment = {
				id: "s1_1",
				reachable: true,
				internal: {
					nodes: ['Literal (")', "Literal (\\)"],
				},
				allNextSegments: [],
			};
			const codePath = {
				initialSegment: segment,
				returnedSegments: [segment],
				thrownSegments: [],
			};
			const expectedLabel = [
				's1_1[label="Literal (\\")',
				'Literal (\\\\)"];',
			].join("\\n");

			debugHelpers.dumpDot(codePath);

			assert.strictEqual(debugCall[0], "DOT");
			assert.ok(debugCall[1].includes(expectedLabel));
		});
	});
});
