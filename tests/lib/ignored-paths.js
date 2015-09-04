/**
 * @fileoverview Tests for IgnoredPaths object.
 * @author Jonathan Rajavuori
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    path = require("path"),
    IgnoredPaths = require("../../lib/ignored-paths.js");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("IgnoredPaths", function() {

    describe("initialization", function() {

        it("should travel to parent directories to find .eslintignore", function() {
            var cwd, ignoredPaths;

            cwd = process.cwd();
            process.chdir(path.resolve(__dirname, "..", "fixtures", "configurations"));

            try {
                ignoredPaths = IgnoredPaths.load({ ignore: true });
                assert.ok(ignoredPaths.patterns.length > 1);
                assert.equal(ignoredPaths.patterns[0], "node_modules/**");
            } finally {
                process.chdir(cwd);
            }
        });

        it("should load empty array with ignore option off or missing", function() {
            var ignoredPaths = IgnoredPaths.load();
            assert.isArray(ignoredPaths.patterns);
            assert.lengthOf(ignoredPaths.patterns, 0);
        });

    });

    describe("initialization with specific file", function() {

        var filepath = path.resolve(__dirname, "..", "fixtures", ".eslintignore2");

        it("should work", function() {
            var ignoredPaths = IgnoredPaths.load({ ignore: true, ignorePath: filepath });
            assert.notEqual(ignoredPaths.patterns.length, 1);
        });

    });

    describe("initialization with invalid file", function() {

        var filepath = path.resolve(__dirname, "..", "fixtures", "configurations", ".foobaz");

        it("should throw error", function() {
            assert.throws(function() {
                var ignoredPaths = IgnoredPaths.load({ ignore: true, ignorePath: filepath });
                assert.ok(ignoredPaths);
            }, "Cannot read ignore file");
        });

    });

    describe("initialization with commented lines", function() {

        var filepath = path.resolve(__dirname, "..", "fixtures", ".eslintignore3");

        it("should ignore comments", function() {
            var ignoredPaths = IgnoredPaths.load({ ignore: true, ignorePath: filepath });
            assert.equal(ignoredPaths.patterns.length, 2);
        });

    });

});
