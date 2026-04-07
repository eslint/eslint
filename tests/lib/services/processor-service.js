/**
 * @fileoverview Unit tests for the ProcessorService class.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { ProcessorService } = require("../../../lib/services/processor-service");
const { VFile } = require("../../../lib/linter/vfile");
const assert = require("node:assert");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ProcessorService", () => {
	let processorService;

	beforeEach(() => {
		processorService = new ProcessorService();
	});

	describe("preprocessSync()", () => {
		it("should throw an error if the preprocessor returns a promise", () => {
			const file = new VFile("/project/file.js", "const a = 1;");
			const config = {
				processor: {
					preprocess() {
						return Promise.resolve(["const a = 1;"]);
					}
				}
			};

			assert.throws(() => {
				processorService.preprocessSync(file, config);
			}, /Unsupported: Preprocessor returned a promise\./u);
		});
	});
});
