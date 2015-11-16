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
        subdir = path.join(fileFinderDir, "subdir"),
        subsubdir = path.join(subdir, "subsubdir"),
        subsubsubdir = path.join(subsubdir, "subsubsubdir"),
        absentFileName = "4ktrgrtUTYjkopoohFe54676hnjyumlimn6r787",
        uniqueFileName = "xvgRHtyH56756764535jkJ6jthty65tyhteHTEY";

    describe("findInDirectoryOrParents()", function() {

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

            it("should be found when in the cwd and passed an array", function() {
                process.chdir(fileFinderDir);
                finder = new FileFinder([".eslintignore"]);
                actual = finder.findInDirectoryOrParents();

                try {
                    assert.equal(actual, expected);
                } finally {
                    process.chdir(cwd);
                }
            });

            it("should be found when in the cwd and passed an array with a missing file", function() {
                process.chdir(fileFinderDir);
                finder = new FileFinder(["missing", ".eslintignore"]);
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

        describe("Not consider directory with expected file names", function() {
            it("should only find one package.json from the root", function() {
                var expected = path.join(process.cwd(), "package.json");
                var finder = new FileFinder("package.json");
                var actual = finder.findInDirectoryOrParents(fileFinderDir);

                assert.equal(actual, expected);
            });
        });
    });

    describe("findAllInDirectoryAndParents()", function() {
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

        describe("searching for multiple files", function() {

            it("should return only the first specified file", function() {
                var firstExpected = path.join(fileFinderDir, "subdir", "empty"),
                    secondExpected = path.join(fileFinderDir, "empty");

                finder = new FileFinder(["empty", uniqueFileName]);
                actual = finder.findAllInDirectoryAndParents(subdir);

                assert.equal(actual.length, 2);
                assert.equal(actual[0], firstExpected);
                assert.equal(actual[1], secondExpected);
            });

            it("should return the second file when the first is missing", function() {
                var firstExpected = path.join(fileFinderDir, "subdir", uniqueFileName),
                    secondExpected = path.join(fileFinderDir, uniqueFileName);

                finder = new FileFinder(["notreal", uniqueFileName]);
                actual = finder.findAllInDirectoryAndParents(subdir);

                assert.equal(actual.length, 2);
                assert.equal(actual[0], firstExpected);
                assert.equal(actual[1], secondExpected);
            });

            it("should return multiple files when the first is missing and more than one filename is requested", function() {
                var firstExpected = path.join(fileFinderDir, "subdir", uniqueFileName),
                    secondExpected = path.join(fileFinderDir, "subdir", "empty2");

                finder = new FileFinder(["notreal", uniqueFileName], "empty2");
                actual = finder.findAllInDirectoryAndParents(subdir);

                assert.equal(actual.length, 3);
                assert.equal(actual[0], firstExpected);
                assert.equal(actual[1], secondExpected);
            });

        });

        describe("two files present with the same name in parent directories", function() {
            var firstExpected = path.join(fileFinderDir, "subdir", uniqueFileName),
                secondExpected = path.join(fileFinderDir, uniqueFileName);

            before(function() {
                finder = new FileFinder(uniqueFileName);
            });

            it("should both be found, and returned in an array", function() {
                actual = finder.findAllInDirectoryAndParents(subsubsubdir);

                assert.isArray(actual);
                assert.equal(actual[0], firstExpected);
                assert.equal(actual[1], secondExpected);
            });

            it("should be in the cache after they have been found", function() {

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

        describe("Not consider directory with expected file names", function() {
            it("should only find one package.json from the root", function() {
                expected = path.join(process.cwd(), "package.json");
                finder = new FileFinder("package.json");
                actual = finder.findAllInDirectoryAndParents(fileFinderDir);
                assert.equal(actual, expected);
            });
        });
    });
});
