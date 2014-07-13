/**
 * @fileoverview Tests for IgnoredPaths object.
 * @author Jonathan Rajavuori
 */

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
                assert.notEqual(ignoredPaths.patterns.length, 0);
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
            assert.notEqual(ignoredPaths.patterns.length, 0);
        });

        it("should add a second children pattern", function() {
            var ignoredPaths = IgnoredPaths.load({ ignore: true, ignorePath: filepath });
            assert.ok(ignoredPaths.patterns[1]);
            assert.equal(ignoredPaths.patterns[1], ignoredPaths.patterns[0] + "/**");
        });

    });

    describe("initialization with invalid file", function() {

        var filepath = path.resolve(__dirname, "..", "fixtures", "configurations", ".foobaz");

        it("should throw error", function() {
            assert.throws(function () {
                var ignoredPaths = IgnoredPaths.load({ ignore: true, ignorePath: filepath });
                assert.ok(ignoredPaths);
            }, "Cannot read ignore file");
        });

    });

    describe("contains", function() {

        var filepath = path.resolve(__dirname, "..", "fixtures", ".eslintignore2");

        it("should return true for file matching an ignore pattern", function() {
            var ignoredPaths = IgnoredPaths.load({ ignore: true, ignorePath: filepath });
            assert.ok(ignoredPaths.contains("undef.js"));
        });

        it("should return true for file matching a child of an ignore pattern", function() {
            var ignoredPaths = IgnoredPaths.load({ ignore: true, ignorePath: filepath });
            assert.ok(ignoredPaths.contains("undef.js/subdir/grandsubdir"));
        });

        it("should return false for file not matching any ignore pattern", function() {
            var ignoredPaths = IgnoredPaths.load({ ignore: true, ignorePath: filepath });
            assert.notOk(ignoredPaths.contains("./passing.js"));
        });

    });

    describe("initialization with commented lines", function() {

        var filepath = path.resolve(__dirname, "..", "fixtures", ".eslintignore3");

        it("should ignore comments", function() {
            var ignoredPaths = IgnoredPaths.load({ ignore: true, ignorePath: filepath });
            // get 2 lines, because loader autoadd '/**' rule to each
            // change to 1 if loader updated
            assert.equal(ignoredPaths.patterns.length, 2);
        });

    });

});
