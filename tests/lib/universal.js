/**
 * @fileoverview Tests for "eslint/universal".
 * @author 唯然<weiran.zsd@outlook.com>
 */

"use strict";
const assert = require("node:assert/strict");

describe("universal", () => {
    it("should have Linter exported", () => {
        const { Linter } = require("eslint/universal");

        assert.ok(Linter);
        assert.ok(typeof Linter === "function");


        const linter = new Linter();

        assert.ok(linter);
    });
});
