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
    os = require("os"),
    IgnoredPaths = require("../../lib/ignored-paths.js"),
    sinon = require("sinon"),
    fs = require("fs");

require("shelljs/global");

/* global mkdir, rm, cp */

//------------------------------------------------------------------------------
// Helper
//------------------------------------------------------------------------------

var ORIGINAL_CWD = process.cwd();

var fixtureDir;

/**
 * get raw rules from IgnorePaths instance
 * @param {IgnoredPaths} ignoredPaths, instance of IgnoredPaths
 * @returns {array} raw ignore rules
 */
function getRules(ignoredPaths) {
    var ignoreRulesProperty = "_rules";
    var rules = [];

    Object.keys(ignoredPaths.ig).forEach(function(key) {
        rules = rules.concat(ignoredPaths.ig[key][ignoreRulesProperty]);
    });

    return rules;
}

/**
 * count the number of default patterns applied to IgnoredPaths instance
 * @param {IgnoredPaths} ignoredPaths, instance of IgnoredPaths
 * @returns {integer} count of default patterns
 */
function countDefaultPatterns(ignoredPaths) {
    var count = ignoredPaths.defaultPatterns.length;
    if (!ignoredPaths.options || (ignoredPaths.options.dotfiles !== true)) {
        count++;
    }
    return count;
}

/**
 * Returns the path inside of the fixture directory.
 * @returns {string} The path inside the fixture directory.
 * @private
 */
function getFixturePath() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(fixtureDir);
    return path.join.apply(path, args);
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("IgnoredPaths", function() {

    // copy into clean area so as not to get "infected" by this project's .eslintrc files
    before(function() {
        fixtureDir = os.tmpdir() + "/eslint/fixtures";
        mkdir("-p", fixtureDir);
        cp("-r", "./tests/fixtures/.", fixtureDir);
    });

    after(function() {
        rm("-r", fixtureDir);
    });

    describe("initialization", function() {

        after(function() {
            if (process.cwd() !== ORIGINAL_CWD) {
                process.chdir(ORIGINAL_CWD);
            }
        });

        it("should load .eslintignore from cwd when explicitly passed", function() {
            var ignoredPaths;

            process.chdir(getFixturePath("configurations"));
            ignoredPaths = new IgnoredPaths({ ignore: true, cwd: fixtureDir });

            // there are only 3 rules loaded by default
            assert.ok(getRules(ignoredPaths).length > 3);
            assert.isNotNull(ignoredPaths.baseDir);
            assert.equal(getRules(ignoredPaths).length, countDefaultPatterns(ignoredPaths) + 2);
        });

        it("should not travel to parent directories to find .eslintignore when it's missing and cwd is provided", function() {
            var cwd, ignoredPaths;

            cwd = path.resolve(__dirname, "..", "fixtures", "configurations");

            ignoredPaths = new IgnoredPaths({ ignore: true, cwd: cwd });
            assert.ok(getRules(ignoredPaths).length === 3);

            assert.equal(getRules(ignoredPaths).filter(function(rule) {
                return rule.pattern === "/node_modules/";
            }).length, 1);

            assert.equal(getRules(ignoredPaths).filter(function(rule) {
                return rule.pattern === "/bower_components/";
            }).length, 1);

        });

        it("should load empty array with ignorePath set to false", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, cwd: path.join(fixtureDir, "..") });
            assert.isArray(getRules(ignoredPaths));
            assert.lengthOf(getRules(ignoredPaths), countDefaultPatterns(ignoredPaths));
        });

        it("should accept an array for options.ignorePattern", function() {
            var ignorePattern = ["a", "b"];

            var ignoredPaths = new IgnoredPaths({
                ignorePattern: ignorePattern
            });

            assert.ok(ignorePattern.every(function(pattern) {
                return getRules(ignoredPaths).filter(function(rule) {
                    return (rule.pattern === pattern);
                }).length > 0;
            }));
        });
    });

    describe("initialization with specific file", function() {

        var filepath = path.resolve(__dirname, "..", "fixtures", ".eslintignore2");

        it("should work", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: filepath, cwd: path.join(fixtureDir, "..") });
            assert.notEqual(getRules(ignoredPaths).length, countDefaultPatterns(ignoredPaths));
        });

    });

    describe("initialization with ignorePath false", function() {

        it("should not load an ignore file", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, cwd: path.join(fixtureDir, "..") });
            assert.equal(ignoredPaths.baseDir, ".");
            assert.lengthOf(getRules(ignoredPaths), countDefaultPatterns(ignoredPaths));
        });

    });

    describe("initialization with invalid file", function() {

        var filepath = path.resolve(__dirname, "..", "fixtures", "configurations", ".foobaz");

        it("should throw error", function() {
            assert.throws(function() {
                var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: filepath, cwd: path.join(fixtureDir, "..") });
                assert.ok(ignoredPaths);
            }, "Cannot read ignore file");
        });

    });

    describe("contains", function() {

        var filepath;

        beforeEach(function() {
            filepath = getFixturePath(".eslintignore2");
        });

        it("should throw if initialized with invalid options", function() {
            var ignoredPaths = new IgnoredPaths(null);
            assert.throw(ignoredPaths.contains, Error);
        });

        it("should return true for file matching an ignore pattern", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: filepath });
            assert.ok(ignoredPaths.contains("undef.js"));
        });

        it("should not return true for file matching an ignore pattern with leading './'", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: filepath });
            assert.notOk(ignoredPaths.contains("undef2.js"));
        });

        it("should return true for file with leading './' matching an ignore pattern without leading './'", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: filepath });
            assert.ok(ignoredPaths.contains("./undef3.js"));
        });

        it("should return true for file matching a child of an ignore pattern", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: filepath });
            assert.ok(ignoredPaths.contains("undef.js/subdir/grandsubdir"));
        });

        it("should return true for file matching a child of an ignore pattern with windows line termination", function() {
            var readFileSyncStub = sinon.stub(fs, "readFileSync");
            readFileSyncStub.withArgs("test").returns("undef.js\r\n");

            var statSyncStub = sinon.stub(fs, "statSync");
            statSyncStub.withArgs("test").returns();

            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: "test" });
            assert.ok(ignoredPaths.contains("undef.js/subdir/grandsubdir"));

            readFileSyncStub.restore();
            statSyncStub.restore();
        });

        it("should always ignore files in node_modules", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: filepath });
            assert.ok(ignoredPaths.contains("node_modules/mocha/bin/mocha"));
        });

        it("should always ignore files in bower_components", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: filepath });
            assert.ok(ignoredPaths.contains("bower_components/package/file.js"));
        });

        it("should not ignore files in node_modules in a subdirectory", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: filepath });
            assert.notOk(ignoredPaths.contains("subdir/node_modules/package/file.js"));
        });

        it("should not ignore files in bower_components in a subdirectory", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: filepath });
            assert.notOk(ignoredPaths.contains("subdir/bower_components/package/file.js"));
        });

        it("should return false for file not matching any ignore pattern", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: filepath });
            assert.notOk(ignoredPaths.contains("./passing.js"));
        });

    });

    describe("initialization with commented lines", function() {

        var filepath = path.resolve(__dirname, "..", "fixtures", ".eslintignore3");

        it("should ignore comments", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: filepath });
            assert.equal(getRules(ignoredPaths).length, countDefaultPatterns(ignoredPaths) + 2);
        });

    });

    describe("default ignorePattern", function() {

        it("should contain /node_modules/", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true });
            assert.notEqual(ignoredPaths.defaultPatterns.indexOf("/node_modules/"), -1);
        });

        it("should contain /bower_components/", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true });
            assert.notEqual(ignoredPaths.defaultPatterns.indexOf("/bower_components/"), -1);
        });

        it("should ignore dotfiles", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true });
            assert.isTrue(ignoredPaths.contains(".foo"));
            assert.isTrue(ignoredPaths.contains("foo/.bar"));
        });

        it("should ignore directories beginning with a dot", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true });
            assert.isTrue(ignoredPaths.contains(".foo/bar"));
            assert.isTrue(ignoredPaths.contains("foo/.bar/baz"));
        });

    });

    describe("initialization with negations", function() {

        var filepath = path.resolve(__dirname, "..", "fixtures", ".eslintignore4");

        it("should ignore a normal pattern", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: filepath });
            assert.ok(ignoredPaths.contains("dir/bar.js"));
        });

        it("should not ignore a negated pattern", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: filepath });
            assert.notOk(ignoredPaths.contains("dir/foo.js"));
        });

    });

    describe("initialization with ignorePattern", function() {

        it("should ignore a normal pattern", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePattern: "ignore/me.txt" });
            assert.ok(ignoredPaths.contains("ignore/me.txt"));
        });

    });

    describe(".eslintignore location", function() {

        var dir = path.resolve(__dirname, "..", "fixtures");
        var filepath = path.join(dir, ".eslintignore4");

        it("should not set baseDir when no ignore file was loaded", function() {
            var ignoredPaths = new IgnoredPaths({ cwd: path.join(fixtureDir, "..") });
            assert.equal(ignoredPaths.baseDir, ".");
        });

        it("should set baseDir relative to itself after loading", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: filepath });
            assert.equal(ignoredPaths.baseDir, path.dirname(filepath));
        });

        it("should ignore absolute file paths", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: filepath });

            var asset = path.join(dir, "/dir/undef.js");
            assert.ok(ignoredPaths.contains(asset));
        });

        it("should not break negations", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: filepath });
            assert.equal(ignoredPaths.baseDir, path.dirname(filepath));

            var asset = path.join(dir, "/dir/foo.js");
            assert.notOk(ignoredPaths.contains(asset));
        });

    });

    describe("two globstar '**' ignore pattern", function() {

        it("should ignore files in nested directories", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePattern: "**/*.js" });
            assert.isTrue(ignoredPaths instanceof IgnoredPaths);
            assert.isTrue(ignoredPaths.contains("foo.js"));
            assert.isTrue(ignoredPaths.contains("foo/bar.js"));
            assert.isTrue(ignoredPaths.contains("foo/bar/baz.js"));
            assert.isFalse(ignoredPaths.contains("foo.j2"));
            assert.isFalse(ignoredPaths.contains("foo/bar.j2"));
            assert.isFalse(ignoredPaths.contains("foo/bar/baz.j2"));
        });
    });

    describe("default ignore patterns", function() {

        it("should include /node_modules/ and /bower_components/ by default", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, cwd: path.join(fixtureDir, "..") });
            assert.ok(getRules(ignoredPaths).length > 1);
            assert.equal(getRules(ignoredPaths).filter(function(rule) {
                return (rule.pattern === "/node_modules/") || (rule.pattern === "/bower_components/");
            }).length, 2);
            assert.isTrue(ignoredPaths.contains("node_modules/"));
            assert.isTrue(ignoredPaths.contains("bower_components/"));
        });

        it("should not ignore files in /node_modules/ with ignore option disabled", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: false });
            assert.isFalse(ignoredPaths.contains("node_modules/foo/bar.js"));
        });

        it("should not ignore files in /bower_components/ with ignore option disabled", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: false });
            assert.isFalse(ignoredPaths.contains("bower_components/foo/bar.js"));
        });

        it("should ignore /node_modules/ at top level", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, cwd: path.join(fixtureDir, "..") });
            assert.isTrue(ignoredPaths.contains("node_modules/"));
            assert.isFalse(ignoredPaths.contains("foo/node_modules/"));
        });

        it("should ignore /bower_components/ at top level", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, cwd: path.join(fixtureDir, "..") });
            assert.isTrue(ignoredPaths.contains("bower_components/"));
            assert.isFalse(ignoredPaths.contains("foo/bower_components/"));
        });

        it("should ignore /node_modules/ at top level relative to .eslintignore when loaded", function() {
            var dir = path.resolve(__dirname, "..", "fixtures", "ignored-paths"),
                ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: path.join(dir, ".eslintignore") });
            assert.isTrue(ignoredPaths.contains(path.resolve(dir, "node_modules/existing.js")));
            assert.isFalse(ignoredPaths.contains(path.resolve(dir, "foo/node_modules/existing.js")));
        });

        it("should ignore /node_modules/ at top level relative to process.cwd() without .eslintignore", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, cwd: path.join(fixtureDir, "..") });
            assert.isTrue(ignoredPaths.contains(path.join(process.cwd(), "node_modules/")));
            assert.isFalse(ignoredPaths.contains(path.join(process.cwd(), "foo/node_modules/")));
        });

        it("should still ignore dotfiles when ignore option disabled", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: false });
            assert.isTrue(ignoredPaths.contains(".foo"));
            assert.isTrue(ignoredPaths.contains("foo/.bar"));
        });

        it("should still ignore directories beginning with a dot when ignore option disabled", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: false });
            assert.isTrue(ignoredPaths.contains(".foo/bar"));
            assert.isTrue(ignoredPaths.contains("foo/.bar/baz"));
        });

    });

    describe("dotfiles option", function() {

        it("should add at least one pattern by default", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, dotfiles: false, cwd: path.join(fixtureDir, "..") });
            assert.lengthOf(getRules(ignoredPaths), ignoredPaths.defaultPatterns.length + 1);
        });

        it("should add no pattern by default when true", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, dotfiles: true, cwd: path.join(fixtureDir, "..") });
            assert.lengthOf(getRules(ignoredPaths), ignoredPaths.defaultPatterns.length);
        });

        it("should ignore dotfiles when false", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, dotfiles: false });
            assert.isTrue(ignoredPaths.contains(".foo"));
            assert.isTrue(ignoredPaths.contains("foo/.bar"));
        });

        it("should ignore directories beginning with a dot when false", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, dotfiles: false });
            assert.isTrue(ignoredPaths.contains(".foo/bar"));
            assert.isTrue(ignoredPaths.contains("foo/.bar/baz"));
        });

        it("should not ignore dotfiles when true", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, dotfiles: true });
            assert.isFalse(ignoredPaths.contains(".foo"));
            assert.isFalse(ignoredPaths.contains("foo/.bar"));
        });

        it("should not ignore directories beginning with a dot when true", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, dotfiles: true });
            assert.isFalse(ignoredPaths.contains(".foo/bar"));
            assert.isFalse(ignoredPaths.contains("foo/.bar/baz"));
        });

    });

});
