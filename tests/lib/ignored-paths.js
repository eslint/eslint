/**
 * @fileoverview Tests for IgnoredPaths object.
 * @author Jonathan Rajavuori
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    path = require("path"),
    IgnoredPaths = require("../../lib/ignored-paths.js"),
    sinon = require("sinon"),
    fs = require("fs");


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

        it("should return true for file matching an ignore pattern with leading './'", function() {
            var ignoredPaths = IgnoredPaths.load({ ignore: true, ignorePath: filepath });
            assert.ok(ignoredPaths.contains("undef2.js"));
        });

        it("should return true for file with leading './' matching an ignore pattern without leading './'", function() {
            var ignoredPaths = IgnoredPaths.load({ ignore: true, ignorePath: filepath });
            assert.ok(ignoredPaths.contains("./undef3.js"));
        });

        it("should return true for file matching a child of an ignore pattern", function() {
            var ignoredPaths = IgnoredPaths.load({ ignore: true, ignorePath: filepath });
            assert.ok(ignoredPaths.contains("undef.js/subdir/grandsubdir"));
        });

        it("should return true for file matching a child of an ignore pattern with windows line termination", function() {
            var stub = sinon.stub(fs, "readFileSync");
            stub.withArgs("test", "utf8").returns("undef.js\r\n");

            var ignoredPaths = IgnoredPaths.load({ ignore: true, ignorePath: "test" });
            assert.ok(ignoredPaths.contains("undef.js/subdir/grandsubdir"));
            stub.restore();
        });

        it("should always ignore files in node_modules", function() {
            var ignoredPaths = IgnoredPaths.load({ ignore: true, ignorePath: filepath });
            assert.ok(ignoredPaths.contains("node_modules/mocha/bin/mocha"));
        });

        it("should not ignore files in node_modules in a subdirectory", function() {
            var ignoredPaths = IgnoredPaths.load({ ignore: true, ignorePath: filepath });
            assert.notOk(ignoredPaths.contains("subdir/node_modules/test.js"));
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
            assert.equal(ignoredPaths.patterns.length, 2);
        });

    });

    describe("initialization with negations", function() {

        var filepath = path.resolve(__dirname, "..", "fixtures", ".eslintignore4");

        it("should ignore a normal pattern", function() {
            var ignoredPaths = IgnoredPaths.load({ ignore: true, ignorePath: filepath });
            assert.ok(ignoredPaths.contains("/dir/bar.js"));
        });

        it("should not ignore a negated pattern", function() {
            var ignoredPaths = IgnoredPaths.load({ ignore: true, ignorePath: filepath });
            assert.notOk(ignoredPaths.contains("/dir/foo.js"));
        });

    });

});
