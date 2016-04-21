/**
 * @fileoverview Common helpers for operations on filenames and paths
 * @author Ian VanSchooten
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var path = require("path"),
    assert = require("chai").assert,
    sinon = require("sinon"),
    pathUtil = require("../../../lib/util/path-util");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("pathUtil", function() {

    describe("convertPathToPosix()", function() {

        it("should remove a leading './'", function() {
            var input = "./relative/file/path.js";
            var result = pathUtil.convertPathToPosix(input);

            assert.equal(result, "relative/file/path.js");
        });

        it("should remove interior '../'", function() {
            var input = "./relative/file/../path.js";
            var result = pathUtil.convertPathToPosix(input);

            assert.equal(result, "relative/path.js");
        });

        it("should not remove a leading '../'", function() {
            var input = "../parent/file/path.js";
            var result = pathUtil.convertPathToPosix(input);

            assert.equal(result, "../parent/file/path.js");
        });

        it("should convert windows path seperators into posix style path seperators", function() {
            var input = "windows\\style\\path.js";
            var result = pathUtil.convertPathToPosix(input);

            assert.equal(result, "windows/style/path.js");
        });

    });

    describe("getRelativePath()", function() {

        it("should return a path relative to the provided base path", function() {
            var filePath = "/absolute/file/path.js";
            var basePath = "/absolute/";
            var result = pathUtil.getRelativePath(filePath, basePath);

            assert.equal(result, path.normalize("file/path.js"));
        });

        it("should throw if the base path is not absolute", function() {
            var filePath = "/absolute/file/path.js";
            var basePath = "somewhere/";

            assert.throws(function() {
                pathUtil.getRelativePath(filePath, basePath);
            });
        });

        it("should treat relative file path arguments as being relative to process.cwd", function() {
            var filePath = "file/path.js";
            var basePath = "/absolute/file";

            sinon.stub(process, "cwd", function() {
                return "/absolute/";
            });
            var result = pathUtil.getRelativePath(filePath, basePath);

            assert.equal(result, "path.js");

            process.cwd.restore();
        });

        it("should strip a leading '/' if no baseDir is provided", function() {
            var filePath = "/absolute/file/path.js";
            var result = pathUtil.getRelativePath(filePath);

            assert.equal(result, "absolute/file/path.js");
        });

    });
});
