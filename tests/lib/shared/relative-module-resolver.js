/**
 * @fileoverview Tests for relative module resolver.
 */

"use strict";

const { assert } = require("chai");
const path = require("node:path");
const ModuleResolver = require("../../../lib/shared/relative-module-resolver.js");

describe("ModuleResolver", () => {
	describe("resolve()", () => {
		it("should correctly resolve a relative path", () => {
			assert.strictEqual(
				ModuleResolver.resolve(
					"./file2.js",
					path.resolve(
						"./tests/fixtures/relative-module-resolver/file.js",
					),
				),
				path.resolve(
					"./tests/fixtures/relative-module-resolver/file2.js",
				),
			);
		});
	});
});
