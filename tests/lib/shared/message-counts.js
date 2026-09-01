/**
 * @fileoverview Tests for message-counts util.
 * @author Kuldeep Kumar <https://github.com/Kuldeep2822k>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { assert } = require("chai");
const { calculateStatsPerFile } = require("../../../lib/shared/message-counts");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("message-counts", () => {
	describe("calculateStatsPerFile()", () => {
		it("should return zero counts for an empty message list", () => {
			assert.deepStrictEqual(calculateStatsPerFile([]), {
				errorCount: 0,
				fatalErrorCount: 0,
				warningCount: 0,
				fixableErrorCount: 0,
				fixableWarningCount: 0,
			});
		});

		it("should count errors, warnings, fatal errors, and fixable messages correctly", () => {
			const messages = [
				{ severity: 2 },
				{ severity: 2, fix: { range: [0, 1], text: "x" } },
				{ fatal: true },
				{ fatal: true, fix: { range: [1, 2], text: "y" } },
				{ severity: 1 },
				{ severity: 1, fix: { range: [2, 3], text: "z" } },
			];

			assert.deepStrictEqual(calculateStatsPerFile(messages), {
				errorCount: 4,
				fatalErrorCount: 2,
				warningCount: 2,
				fixableErrorCount: 2,
				fixableWarningCount: 1,
			});
		});

		it("should treat fatal messages as errors even when severity is not 2", () => {
			const messages = [{ fatal: true, severity: 1 }];

			assert.deepStrictEqual(calculateStatsPerFile(messages), {
				errorCount: 1,
				fatalErrorCount: 1,
				warningCount: 0,
				fixableErrorCount: 0,
				fixableWarningCount: 0,
			});
		});
	});
});
