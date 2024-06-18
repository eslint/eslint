/**
 * @fileoverview Tests for VFile
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { VFile } = require("../../../lib/linter/vfile");
const assert = require("chai").assert;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("VFile", () => {

    describe("new VFile()", () => {

        it("should create a new instance", () => {
            const vfile = new VFile("foo.js", "var foo = bar;");

            assert.strictEqual(vfile.path, "foo.js");
            assert.strictEqual(vfile.physicalPath, "foo.js");
            assert.strictEqual(vfile.body, "var foo = bar;");
            assert.isFalse(vfile.bom);
        });

        it("should create a new instance with a BOM", () => {
            const vfile = new VFile("foo.js", "\uFEFFvar foo = bar;");

            assert.strictEqual(vfile.path, "foo.js");
            assert.strictEqual(vfile.physicalPath, "foo.js");
            assert.strictEqual(vfile.body, "var foo = bar;");
            assert.isTrue(vfile.bom);
        });

        it("should create a new instance with a physicalPath", () => {
            const vfile = new VFile("foo.js", "var foo = bar;", { physicalPath: "foo/bar" });

            assert.strictEqual(vfile.path, "foo.js");
            assert.strictEqual(vfile.physicalPath, "foo/bar");
            assert.strictEqual(vfile.body, "var foo = bar;");
            assert.isFalse(vfile.bom);
        });

        it("should create a new instance with a Uint8Array", () => {
            const encoder = new TextEncoder();
            const body = encoder.encode("var foo = bar;");
            const vfile = new VFile("foo.js", body);

            assert.strictEqual(vfile.path, "foo.js");
            assert.strictEqual(vfile.physicalPath, "foo.js");
            assert.deepStrictEqual(vfile.body, body);
            assert.isFalse(vfile.bom);
        });

        it("should create a new instance with a BOM in a Uint8Array", () => {
            const encoder = new TextEncoder();
            const body = encoder.encode("\uFEFFvar foo = bar;");
            const vfile = new VFile("foo.js", body);

            assert.strictEqual(vfile.path, "foo.js");
            assert.strictEqual(vfile.physicalPath, "foo.js");
            assert.deepStrictEqual(vfile.body, body.slice(3));
            assert.isTrue(vfile.bom);
        });

    });

});
