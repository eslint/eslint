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
    pathUtil = require("../../../lib/util/path-util");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("pathUtil", function() {

    describe("convertPathToPosix()", function() {

        it("should remove a leading './'", function() {
            const input = "./relative/file/path.js";
            const result = pathUtil.convertPathToPosix(input);

            assert.equal(result, "relative/file/path.js");
        });

        it("should remove interior '../'", function() {
            const input = "./relative/file/../path.js";
            const result = pathUtil.convertPathToPosix(input);

            assert.equal(result, "relative/path.js");
        });

        it("should not remove a leading '../'", function() {
            const input = "../parent/file/path.js";
            const result = pathUtil.convertPathToPosix(input);

            assert.equal(result, "../parent/file/path.js");
        });

        it("should convert windows path seperators into posix style path seperators", function() {
            const input = "windows\\style\\path.js";
            const result = pathUtil.convertPathToPosix(input);

            assert.equal(result, "windows/style/path.js");
        });

    });

    describe("getRelativePath()", function() {

        it("should return a path relative to the provided base path", function() {
            const filePath = "/absolute/file/path.js";
            const basePath = "/absolute/";
            const result = pathUtil.getRelativePath(filePath, basePath);

            assert.equal(result, path.normalize("file/path.js"));
        });

        it("should throw if the base path is not absolute", function() {
            const filePath = "/absolute/file/path.js";
            const basePath = "somewhere/";

            assert.throws(function() {
                pathUtil.getRelativePath(filePath, basePath);
            });
        });

        it("should treat relative file path arguments as being relative to process.cwd", function() {
            const filePath = "file/path.js";
            const basePath = "/absolute/file";

            sinon.stub(process, "cwd", function() {
                return "/absolute/";
            });
            const result = pathUtil.getRelativePath(filePath, basePath);

            assert.equal(result, "path.js");

            process.cwd.restore();
        });

        it("should strip a leading '/' if no baseDir is provided", function() {
            const filePath = "/absolute/file/path.js";
            const result = pathUtil.getRelativePath(filePath);

            assert.equal(result, "absolute/file/path.js");
        });

    });
});
