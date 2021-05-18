/**
 * @fileoverview Common helpers for operations on filenames and paths
 * @author Ian VanSchooten
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const path = require("path"),
    assert = require("chai").assert,
    sinon = require("sinon"),
    pathUtils = require("../../../lib/util/path-utils");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("pathUtil", () => {

    describe("convertPathToPosix()", () => {

        it("should remove a leading './'", () => {
            const input = "./relative/file/path.js";
            const result = pathUtils.convertPathToPosix(input);

            assert.strictEqual(result, "relative/file/path.js");
        });

        it("should remove interior '../'", () => {
            const input = "./relative/file/../path.js";
            const result = pathUtils.convertPathToPosix(input);

            assert.strictEqual(result, "relative/path.js");
        });

        it("should not remove a leading '../'", () => {
            const input = "../parent/file/path.js";
            const result = pathUtils.convertPathToPosix(input);

            assert.strictEqual(result, "../parent/file/path.js");
        });

        it("should convert windows path seperators into posix style path seperators", () => {
            const input = "windows\\style\\path.js";
            const result = pathUtils.convertPathToPosix(input);

            assert.strictEqual(result, "windows/style/path.js");
        });

    });

    describe("getRelativePath()", () => {

        it("should return a path relative to the provided base path", () => {
            const filePath = "/absolute/file/path.js";
            const basePath = "/absolute/";
            const result = pathUtils.getRelativePath(filePath, basePath);

            assert.strictEqual(result, path.normalize("file/path.js"));
        });

        it("should throw if the base path is not absolute", () => {
            const filePath = "/absolute/file/path.js";
            const basePath = "somewhere/";

            assert.throws(() => {
                pathUtils.getRelativePath(filePath, basePath);
            });
        });

        it("should treat relative file path arguments as being relative to process.cwd", () => {
            const filePath = "file/path.js";
            const basePath = "/absolute/file";

            sinon.stub(process, "cwd").returns("/absolute/");
            const result = pathUtils.getRelativePath(filePath, basePath);

            assert.strictEqual(result, "path.js");

            process.cwd.restore();
        });

        it("should strip a leading '/' if no baseDir is provided", () => {
            const filePath = "/absolute/file/path.js";
            const result = pathUtils.getRelativePath(filePath);

            assert.strictEqual(result, "absolute/file/path.js");
        });

    });
});
