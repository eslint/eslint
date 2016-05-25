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
    fs = require("fs"),
    includes = require("lodash").includes;

require("shelljs/global");

/* global mkdir, rm, cp */

//------------------------------------------------------------------------------
// Helper
//------------------------------------------------------------------------------

var fixtureDir;

/**
 * get raw rules from IgnorePaths instance
 * @param {IgnoredPaths} ignoredPaths, instance of IgnoredPaths
 * @returns {string[]} raw ignore rules
 */
function getIgnoreRules(ignoredPaths) {
    var ignoreRulesProperty = "_rules";
    var ignoreRules = [];

    Object.keys(ignoredPaths.ig).forEach(function(key) {
        var rules = ignoredPaths.ig[key][ignoreRulesProperty];

        rules.forEach(function(rule) {
            var ruleOrigins = ignoreRules.map(function(ruleObj) {
                return ruleObj.origin;
            });

            /*
             * Don't include duplicate ignore rules.
             * (Duplicates occur because we add custom ignore patterns to the
             * defaults as well, to allow unignoring default ignores)
             */
            if (!includes(ruleOrigins, rule.origin)) {
                ignoreRules = ignoreRules.concat(rule);
            }
        });
    });

    return ignoreRules;
}

/**
 * Get a list of paths of loaded ignore files (e.g. .eslintignore) from IgnorePaths instance
 * @param {IgnoredPaths} ignoredPaths Instance of IgnoredPaths
 * @returns {string[]} loaded ignore files
 */
function getIgnoreFiles(ignoredPaths) {
    return ignoredPaths.ig.custom.ignoreFiles;
}

/**
 * Get a list of ignore patterns that are loaded
 * @param   {Object[]} ignoredPaths Instance of IgnoredPaths
 * @returns {string[]}              Ignore patterns
 */
function getIgnorePatterns(ignoredPaths) {
    var ignoreRules = getIgnoreRules(ignoredPaths);

    return ignoreRules.map(function(rule) {
        return rule.origin;
    });
}

/**
 * count the number of default patterns applied to IgnoredPaths instance
 * @param {IgnoredPaths} ignoredPaths, instance of IgnoredPaths
 * @returns {integer} count of default patterns
 */
function countDefaultPatterns(ignoredPaths) {
    var count = ignoredPaths.defaultPatterns.length;

    if (!ignoredPaths.options || (ignoredPaths.options.dotfiles !== true)) {
        count = count + 2;  // Two patterns for ignoring dotfiles
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

    args.unshift(fs.realpathSync(fixtureDir));
    return path.join.apply(path, args);
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("IgnoredPaths", function() {

    // copy into clean area so as not to get "infected" by this project's .eslintrc files
    before(function() {
        fixtureDir = path.join(os.tmpdir(), "/eslint/fixtures/ignored-paths/");
        mkdir("-p", fixtureDir);
        cp("-r", "./tests/fixtures/ignored-paths/.", fixtureDir);
    });

    after(function() {
        rm("-r", fixtureDir);
    });

    describe("initialization", function() {

        it("should load .eslintignore from cwd when explicitly passed", function() {
            var expectedIgnoreFile = getFixturePath(".eslintignore");
            var ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath() });
            var ignorePatterns = getIgnorePatterns(ignoredPaths);

            assert.isNotNull(ignoredPaths.baseDir);
            assert.equal(getIgnoreFiles(ignoredPaths), expectedIgnoreFile);
            assert.include(ignorePatterns, "sampleignorepattern");
        });

        it("should set baseDir to cwd when no ignore file was loaded", function() {
            var ignoredPaths = new IgnoredPaths({ cwd: getFixturePath("no-ignore-file") });

            assert.equal(ignoredPaths.baseDir, getFixturePath("no-ignore-file"));
        });

        it("should not travel to parent directories to find .eslintignore when it's missing and cwd is provided", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath("configurations") });

            assert.lengthOf(getIgnoreRules(ignoredPaths), 4);
            assert.lengthOf(getIgnoreFiles(ignoredPaths), 0);
        });

        it("should load empty array with ignorePath set to false", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: false, cwd: getFixturePath("no-ignore-file") });

            assert.isArray(getIgnoreRules(ignoredPaths));
            assert.lengthOf(getIgnoreRules(ignoredPaths), countDefaultPatterns(ignoredPaths));
        });

        it("should accept an array for options.ignorePattern", function() {
            var ignorePattern = ["a", "b"];

            var ignoredPaths = new IgnoredPaths({
                ignorePattern: ignorePattern
            });

            assert.ok(ignorePattern.every(function(pattern) {
                return getIgnoreRules(ignoredPaths).filter(function(rule) {
                    return (rule.pattern === pattern);
                }).length > 0;
            }));
        });
    });

    describe("initialization with ignorePattern", function() {

        it("should ignore a normal pattern", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePattern: "ignore-me.txt", cwd: getFixturePath("ignore-pattern") });

            assert.isTrue(ignoredPaths.contains(getFixturePath("ignore-pattern", "ignore-me.txt")));
        });

    });

    describe("initialization with ignorePath", function() {

        var ignoreFilePath;

        before(function() {
            ignoreFilePath = getFixturePath(".eslintignore");
        });

        it("should set baseDir to directory containing ignorePath if provided", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: ignoreFilePath, cwd: getFixturePath() });

            assert.equal(ignoredPaths.baseDir, path.dirname(ignoreFilePath));
        });

    });

    describe("initialization with ignorePath file not named .eslintignore", function() {

        var ignoreFilePath;

        before(function() {
            ignoreFilePath = getFixturePath("custom-name", "ignore-file");
        });

        it("should work when cwd is a parent directory", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: ignoreFilePath, cwd: getFixturePath() });

            assert.notEqual(getIgnoreRules(ignoredPaths).length, countDefaultPatterns(ignoredPaths));
        });

        it("should work when the file is in the cwd", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: ignoreFilePath, cwd: getFixturePath("custom-name") });

            assert.notEqual(getIgnoreRules(ignoredPaths).length, countDefaultPatterns(ignoredPaths));
        });

        it("should work when cwd is a subdirectory", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: ignoreFilePath, cwd: getFixturePath("custom-name", "subdirectory") });

            assert.notEqual(getIgnoreRules(ignoredPaths).length, countDefaultPatterns(ignoredPaths));
        });

    });

    describe("initialization without ignorePath", function() {

        it("should not load an ignore file if none is in cwd", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath("no-ignore-file") });

            assert.lengthOf(getIgnoreFiles(ignoredPaths), 0);
            assert.lengthOf(getIgnoreRules(ignoredPaths), countDefaultPatterns(ignoredPaths));
        });

    });

    describe("initialization with invalid file", function() {

        var invalidFilepath;

        before(function() {
            invalidFilepath = getFixturePath("not-a-directory", ".foobaz");
        });

        it("should throw error", function() {
            assert.throws(function() {
                var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: invalidFilepath, cwd: getFixturePath() });

                assert.ok(ignoredPaths);
            }, "Cannot read ignore file");
        });

    });

    describe("contains", function() {

        it("should throw if initialized with invalid options", function() {
            var ignoredPaths = new IgnoredPaths(null);

            assert.throw(ignoredPaths.contains, Error);
        });

        it("should not throw if given a relative filename", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePattern: "undef.js", cwd: getFixturePath() });

            assert.doesNotThrow(function() {
                ignoredPaths.contains("undef.js");
            });
        });

        it("should return true for files which match an ignorePattern even if they do not exist on the filesystem", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePattern: "not-a-file", cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath("not-a-file")));
        });

        it("should return false for files outside of the cwd (with no ignore file provided)", function() {

            // Default ignore patterns should not inadvertantly ignore files in parent directories
            var ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath("no-ignore-file") });

            assert.isFalse(ignoredPaths.contains(getFixturePath("undef.js")));
        });

        it("should return false for files outside of ignorePath's directory", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: getFixturePath("custom-name", "ignore-file"), cwd: getFixturePath() });

            assert.isFalse(ignoredPaths.contains(getFixturePath("undef.js")));
        });

        it("should return true for file matching an ignore pattern exactly", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePattern: "undef.js", cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath("undef.js")));
        });

        it("should return false for file matching an invalid ignore pattern with leading './'", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePattern: "./undef.js", cwd: getFixturePath() });

            assert.isFalse(ignoredPaths.contains(getFixturePath("undef.js")));
        });

        it("should return false for file in subfolder of cwd matching an ignore pattern with leading '/'", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePattern: "/undef.js", cwd: getFixturePath() });

            assert.isFalse(ignoredPaths.contains(getFixturePath("subdir", "undef.js")));
        });

        it("should return true for file matching a child of an ignore pattern", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePattern: "ignore-pattern", cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath("ignore-pattern", "ignore-me.txt")));
        });

        it("should return true for file matching a grandchild of an ignore pattern", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePattern: "ignore-pattern", cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath("ignore-pattern", "subdir", "ignore-me.txt")));
        });

        it("should return true for file matching a child of an ignore pattern with windows line termination", function() {
            sinon.stub(fs, "readFileSync")
                .withArgs(".eslintignore")
                .returns("subdir\r\n");
            sinon.stub(fs, "statSync")
                .withArgs("subdir")
                .returns();
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: ".eslintignore", cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath("subdir/undef.js")));

            fs.readFileSync.restore();
            fs.statSync.restore();
        });

        it("should return false for file not matching any ignore pattern", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePattern: "failing.js", cwd: getFixturePath() });

            assert.isFalse(ignoredPaths.contains(getFixturePath("unignored.js")));
        });

        it("should return false for ignored file when unignored with ignore pattern", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: getFixturePath(".eslintignore"), ignorePattern: "!sampleignorepattern", cwd: getFixturePath() });

            assert.isFalse(ignoredPaths.contains(getFixturePath("sampleignorepattern")));

        });
    });

    describe("initialization with ignorePath containing commented lines", function() {

        var ignoreFilePath;

        before(function() {
            ignoreFilePath = getFixturePath(".eslintignoreWithComments");
        });

        it("should not include comments in ignore rules", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: ignoreFilePath, cwd: getFixturePath() });
            var ignorePatterns = getIgnorePatterns(ignoredPaths);

            assert.equal(getIgnoreRules(ignoredPaths).length, countDefaultPatterns(ignoredPaths) + 1);
            assert.include(ignorePatterns, "this_one_not");
        });

    });

    describe("initialization with ignorePath containing negations", function() {
        var ignoreFilePath;

        before(function() {
            ignoreFilePath = getFixturePath(".eslintignoreWithNegation");
        });

        it("should ignore a non-negated pattern", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: ignoreFilePath, cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath("negation", "ignore.js")));
        });

        it("should not ignore a negated pattern", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: ignoreFilePath, cwd: getFixturePath() });

            assert.isFalse(ignoredPaths.contains(getFixturePath("negation", "unignore.js")));
        });

    });

    describe("default ignores", function() {

        it("should contain /bower_components/*", function() {
            var ignoredPaths = new IgnoredPaths();

            assert.include(ignoredPaths.defaultPatterns, "/bower_components/*");
        });

        it("should contain /node_modules/*", function() {
            var ignoredPaths = new IgnoredPaths();

            assert.include(ignoredPaths.defaultPatterns, "/node_modules/*");
        });

        it("should always apply defaultPatterns if ignore option is true", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath("bower_components/package/file.js")));
            assert.isTrue(ignoredPaths.contains(getFixturePath("node_modules/package/file.js")));
        });

        it("should still apply defaultPatterns if ignore option is is false", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: false, cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath("bower_components/package/file.js")));
            assert.isTrue(ignoredPaths.contains(getFixturePath("node_modules/package/file.js")));
        });

        it("should not ignore files in defaultPatterns within a subdirectory", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath() });

            assert.isFalse(ignoredPaths.contains(getFixturePath("subdir/bower_components/package/file.js")));
            assert.isFalse(ignoredPaths.contains(getFixturePath("subdir/node_modules/package/file.js")));
        });

        it("should allow subfolders of defaultPatterns to be unignored by ignorePattern", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath(), ignorePattern: "!/node_modules/package" });

            assert.isFalse(ignoredPaths.contains(getFixturePath("node_modules", "package", "file.js")));
        });

        it("should allow subfolders of defaultPatterns to be unignored by ignorePath", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath(), ignorePath: getFixturePath(".eslintignoreWithUnignoredDefaults") });

            assert.isFalse(ignoredPaths.contains(getFixturePath("node_modules", "package", "file.js")));
        });

        it("should ignore dotfiles", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath(".foo")));
            assert.isTrue(ignoredPaths.contains(getFixturePath("foo/.bar")));
        });

        it("should ignore directories beginning with a dot", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath(".foo/bar")));
            assert.isTrue(ignoredPaths.contains(getFixturePath("foo/.bar/baz")));
        });

        it("should still ignore dotfiles when ignore option disabled", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: false, cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath(".foo")));
            assert.isTrue(ignoredPaths.contains(getFixturePath("foo/.bar")));
        });

        it("should still ignore directories beginning with a dot when ignore option disabled", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: false, cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath(".foo/bar")));
            assert.isTrue(ignoredPaths.contains(getFixturePath("foo/.bar/baz")));
        });

        it("should not ignore absolute paths containing '..'", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath() });

            assert.isFalse(ignoredPaths.contains(getFixturePath("foo") + "/../unignored.js"));
        });

        it("should ignore /node_modules/ at top level relative to .eslintignore when loaded", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: getFixturePath(".eslintignore"), cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath("node_modules", "existing.js")));
            assert.isFalse(ignoredPaths.contains(getFixturePath("foo", "node_modules", "existing.js")));
        });

        it("should ignore /node_modules/ at top level relative to cwd without an .eslintignore", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath("no-ignore-file") });

            assert.isTrue(ignoredPaths.contains(getFixturePath("no-ignore-file", "node_modules", "existing.js")));
            assert.isFalse(ignoredPaths.contains(getFixturePath("no-ignore-file", "foo", "node_modules", "existing.js")));
        });

    });

    describe("two globstar '**' ignore pattern", function() {

        it("should ignore files in nested directories", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, ignorePattern: "**/*.js", cwd: getFixturePath() });

            assert.isTrue(ignoredPaths instanceof IgnoredPaths);
            assert.isTrue(ignoredPaths.contains(getFixturePath("foo.js")));
            assert.isTrue(ignoredPaths.contains(getFixturePath("foo/bar.js")));
            assert.isTrue(ignoredPaths.contains(getFixturePath("foo/bar/baz.js")));
            assert.isFalse(ignoredPaths.contains(getFixturePath("foo.j2")));
            assert.isFalse(ignoredPaths.contains(getFixturePath("foo/bar.j2")));
            assert.isFalse(ignoredPaths.contains(getFixturePath("foo/bar/baz.j2")));
        });
    });

    describe("dotfiles option", function() {

        it("should add at least one pattern when false", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, dotfiles: false, cwd: getFixturePath("no-ignore-file") });

            assert(getIgnoreRules(ignoredPaths).length > ignoredPaths.defaultPatterns.length);
        });

        it("should add no patterns when true", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, dotfiles: true, cwd: getFixturePath("no-ignore-file") });

            assert.lengthOf(getIgnoreRules(ignoredPaths), ignoredPaths.defaultPatterns.length);
        });

        it("should not ignore dotfiles when true", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, dotfiles: true, cwd: getFixturePath() });

            assert.isFalse(ignoredPaths.contains(getFixturePath(".foo")));
            assert.isFalse(ignoredPaths.contains(getFixturePath("foo/.bar")));
        });

        it("should not ignore directories beginning with a dot when true", function() {
            var ignoredPaths = new IgnoredPaths({ ignore: true, dotfiles: true, cwd: getFixturePath() });

            assert.isFalse(ignoredPaths.contains(getFixturePath(".foo/bar")));
            assert.isFalse(ignoredPaths.contains(getFixturePath("foo/.bar/baz")));
        });

    });

});
