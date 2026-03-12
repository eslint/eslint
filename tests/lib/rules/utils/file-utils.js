/**
 * @fileoverview Tests for file utils.
 * @author Josh Goldberg
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
	files = require("../../../../lib/rules/utils/file-utils");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("files", () => {
	describe("isDefinitionFile", () => {
		const expectedResults = {
			// Value-space JavaScript files
			"file.cjs": false,
			"file.js": false,
			"file.jsx": false,
			"file.mjs": false,

			// Value-space TypeScript files
			"file.cts": false,
			"file.mts": false,
			"file.ts": false,
			"file.tsx": false,

			// Type-space TypeScript files
			"file.d.cts": true,
			"file.d.mts": true,
			"file.d.ts": true,
			"prefix-file.d.cts": true,
			"prefix-file.d.mts": true,
			"prefix-file.d.ts": true,
			"prefix.file.d.cts": true,
			"prefix.file.d.mts": true,
			"prefix.file.d.ts": true,

			// Other / not recognized by TypeScript
			"": false,
			"-": false,
			"file.css": false,
			"file.d.js": false,
			"file.d.jsx": false,
			"file.d.tsx": false,
			"file.less": false,
			"file.sass": false,
			"file.scss": false,
			"file.txt": false,
			file: false,
		};

		for (const [input, expected] of Object.entries(expectedResults)) {
			it(`should return ${expected} for ${input}`, () => {
				assert.strictEqual(files.isDefinitionFile(input), expected);
			});
		}
	});
});
