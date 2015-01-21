/**
 * @fileoverview Tests for FileFinder class.
 * @author Michael Mclaughlin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    path = require("path"),
    FileFinder = require("../../lib/file-finder.js");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("FileFinder", function() {
    var fixtureDir = path.resolve(__dirname, "..", "fixtures"),
        fileFinderDir = path.join(fixtureDir, "file-finder"),
        subsubsubdir = path.join(fileFinderDir, "subdir", "subsubdir", "subsubsubdir"),
        absentFileName = "4ktrgrtUTYjkopoohFe54676hnjyumlimn6r787",
        uniqueFileName = "xvgRHtyH56756764535jkJ6jthty65tyhteHTEY";

    describe("findInDirectoryOrParents", function() {

        describe("a searched for file that is present", function() {
            var actual,
                finder,
                cwd = process.cwd(),
                expected = path.join(fileFinderDir, ".eslintignore");

            it("should be found when in the cwd", function() {
                process.chdir(fileFinderDir);
                finder = new FileFinder(".eslintignore");
                actual = finder.findInDirectoryOrParents();

                try {
                    assert.equal(actual, expected);
                } finally {
                    process.chdir(cwd);
                }
            });

            it("should be found when in a parent directory of the cwd", function() {
                process.chdir(subsubsubdir);
                finder = new FileFinder(".eslintignore");
                actual = finder.findInDirectoryOrParents();

                try {
                    assert.equal(actual, expected);
                } finally {
                    process.chdir(cwd);
                }
            });

            it("should be found when in a specified directory", function() {
                finder = new FileFinder(".eslintignore");
                actual = finder.findInDirectoryOrParents(fileFinderDir);

                assert.equal(actual, expected);
            });

            it("should be found when in a parent directory of a specified directory", function() {
                finder = new FileFinder(".eslintignore");
                actual = finder.findInDirectoryOrParents(subsubsubdir);

                assert.equal(actual, expected);
            });

            it("should be in the cache after it has been found", function() {
                assert.equal(finder.cache[subsubsubdir], expected);
                assert.equal(finder.cache[path.join(fileFinderDir, "subdir", "subsubdir")], expected);
                assert.equal(finder.cache[path.join(fileFinderDir, "subdir")], expected);
                assert.equal(finder.cache[fileFinderDir], expected);
            });
        });

        describe("a file not present", function() {

            it("should not be found, and an empty string returned", function() {
                var expected = String(),
                    finder = new FileFinder(absentFileName),
                    actual = finder.findInDirectoryOrParents();

                assert.equal(actual, expected);
            });
        });
    });

    describe("findAllInDirectoryAndParents", function() {
        var actual,
            expected,
            finder;

        describe("a file present in the cwd", function() {

            it("should be found, and returned as the first element of an array", function() {
                finder = new FileFinder(uniqueFileName);
                actual = finder.findAllInDirectoryAndParents(fileFinderDir);
                expected = path.join(fileFinderDir, uniqueFileName);

                assert.isArray(actual);
                assert.equal(actual[0], expected);
            });
        });

        describe("a file present in a parent directory", function() {

            it("should be found, and returned as the first element of an array", function() {
                finder = new FileFinder(uniqueFileName);
                actual = finder.findAllInDirectoryAndParents(subsubsubdir);
                expected = path.join(fileFinderDir, "subdir", uniqueFileName);

                assert.isArray(actual);
                assert.equal(actual[0], expected);
            });
        });

        describe("two files present with the same name in parent directories", function() {
            var firstExpected = path.join(fileFinderDir, "subdir", uniqueFileName),
                secondExpected = path.join(fileFinderDir, uniqueFileName);

            finder = new FileFinder(uniqueFileName);

            it("should both be found, and returned in an array", function() {
                actual = finder.findAllInDirectoryAndParents(subsubsubdir);

                assert.isArray(actual);
                assert.equal(actual[0], firstExpected);
                assert.equal(actual[1], secondExpected);
            });

            it("should be in the cache after they have been found", function() {
                var subdir = path.join(fileFinderDir, "subdir"),
                    subsubdir = path.join(subdir, "subsubdir");

                assert.equal(finder.cache[subsubsubdir][0], firstExpected);
                assert.equal(finder.cache[subsubsubdir][1], secondExpected);
                assert.equal(finder.cache[subsubdir][0], firstExpected);
                assert.equal(finder.cache[subsubdir][1], secondExpected);
                assert.equal(finder.cache[subdir][0], firstExpected);
                assert.equal(finder.cache[subdir][1], secondExpected);
                assert.equal(finder.cache[fileFinderDir][0], secondExpected);
                assert.equal(finder.cache[fileFinderDir][1], void 0);
            });
        });

        describe("an absent file", function() {

            it("should not be found, and an empty array returned", function() {
                finder = new FileFinder(absentFileName);
                actual = finder.findAllInDirectoryAndParents();

                assert.isArray(actual);
                assert.lengthOf(actual, 0);
            });
        });
    });
});
