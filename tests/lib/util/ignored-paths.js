/**
 * @fileoverview Tests for IgnoredPaths object.
 * @author Jonathan Rajavuori
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    path = require("path"),
    os = require("os"),
    IgnoredPaths = require("../../../lib/util/ignored-paths.js"),
    sinon = require("sinon"),
    fs = require("fs"),
    includes = require("lodash").includes;

require("shelljs/global");

/* global mkdir, rm, cp */

//------------------------------------------------------------------------------
// Helper
//------------------------------------------------------------------------------

let fixtureDir;

/**
 * get raw rules from IgnorePaths instance
 * @param {IgnoredPaths} ignoredPaths instance of IgnoredPaths
 * @returns {string[]} raw ignore rules
 */
function getIgnoreRules(ignoredPaths) {
    const ignoreRulesProperty = "_rules";
    let ignoreRules = [];

    Object.keys(ignoredPaths.ig).forEach(key => {
        const rules = ignoredPaths.ig[key][ignoreRulesProperty];

        rules.forEach(rule => {
            const ruleOrigins = ignoreRules.map(ruleObj => ruleObj.origin);

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
    const ignoreRules = getIgnoreRules(ignoredPaths);

    return ignoreRules.map(rule => rule.origin);
}

/**
 * count the number of default patterns applied to IgnoredPaths instance
 * @param {IgnoredPaths} ignoredPaths instance of IgnoredPaths
 * @returns {integer} count of default patterns
 */
function countDefaultPatterns(ignoredPaths) {
    let count = ignoredPaths.defaultPatterns.length;

    if (!ignoredPaths.options || (ignoredPaths.options.dotfiles !== true)) {
        count += 2; // Two patterns for ignoring dotfiles
    }
    return count;
}

/**
 * Returns the path inside of the fixture directory.
 * @returns {string} The path inside the fixture directory.
 * @private
 */
function getFixturePath(...args) {
    return path.join(fs.realpathSync(fixtureDir), ...args);
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("IgnoredPaths", () => {

    // copy into clean area so as not to get "infected" by this project's .eslintrc files
    before(() => {
        fixtureDir = path.join(os.tmpdir(), "/eslint/fixtures/ignored-paths/");
        mkdir("-p", fixtureDir);
        cp("-r", "./tests/fixtures/ignored-paths/.", fixtureDir);
    });

    after(() => {
        rm("-r", fixtureDir);
    });

    describe("initialization", () => {

        it("should load .eslintignore from cwd when explicitly passed", () => {
            const expectedIgnoreFile = getFixturePath(".eslintignore");
            const ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath() });
            const ignorePatterns = getIgnorePatterns(ignoredPaths);

            assert.isNotNull(ignoredPaths.ignoreFileDir);
            assert.deepStrictEqual(getIgnoreFiles(ignoredPaths), [expectedIgnoreFile]);
            assert.include(ignorePatterns, "sampleignorepattern");
        });

        it("should set baseDir to cwd when no ignore file was loaded", () => {
            const ignoredPaths = new IgnoredPaths({ cwd: getFixturePath("no-ignore-file") });

            assert.strictEqual(ignoredPaths.ignoreFileDir, getFixturePath("no-ignore-file"));
        });

        it("should not travel to parent directories to find .eslintignore when it's missing and cwd is provided", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath("configurations") });

            assert.lengthOf(getIgnoreRules(ignoredPaths), 4);
            assert.lengthOf(getIgnoreFiles(ignoredPaths), 0);
        });

        it("should load empty array with ignorePath set to false", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: false, cwd: getFixturePath("no-ignore-file") });

            assert.isArray(getIgnoreRules(ignoredPaths));
            assert.lengthOf(getIgnoreRules(ignoredPaths), countDefaultPatterns(ignoredPaths));
        });

        it("should accept an array for options.ignorePattern", () => {
            const ignorePattern = ["a", "b"];

            const ignoredPaths = new IgnoredPaths({
                ignorePattern
            });

            assert.ok(
                ignorePattern.every(pattern => (
                    getIgnoreRules(ignoredPaths).some(rule => rule.pattern === pattern)
                ))
            );
        });

        it("should use package.json's eslintIgnore files if no specified .eslintignore file", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath("package-json-ignore") });

            assert.isTrue(ignoredPaths.contains("hello.js"));
            assert.isTrue(ignoredPaths.contains("world.js"));
        });

        it("should use correct message template if failed to parse package.json", () => {
            assert.throw(() => {
                try {
                    // eslint-disable-next-line no-new
                    new IgnoredPaths({ ignore: true, cwd: getFixturePath("broken-package-json") });
                } catch (error) {
                    assert.strictEqual(error.messageTemplate, "failed-to-read-json");
                    throw error;
                }
            });
        });

        it("should not use package.json's eslintIgnore files if specified .eslintignore file", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath() });

            assert.isFalse(ignoredPaths.contains("hello.js"));
            assert.isFalse(ignoredPaths.contains("world.js"));
            assert.isTrue(ignoredPaths.contains("sampleignorepattern"));
        });

        it("should error if package.json's eslintIgnore is not an array of file paths", () => {
            assert.throws(() => {
                const ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath("bad-package-json-ignore") });

                assert.ok(ignoredPaths);
            }, "Package.json eslintIgnore property requires an array of paths");
        });
    });

    describe("caching file reads", () => {

        let readFileSyncCount;

        before(() => {
            readFileSyncCount = sinon.spy(fs, "readFileSync");
        });

        after(() => {
            readFileSyncCount.restore();
        });

        it("should cache readFileSync on same file paths", () => {
            const ignoreFilePath = getFixturePath(".eslintignore");
            const ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath() });

            ignoredPaths.readIgnoreFile(ignoreFilePath);
            assert.isTrue(ignoredPaths.contains(ignoreFilePath));
            sinon.assert.calledOnce(readFileSyncCount);
        });
    });

    describe("initialization with ignorePattern", () => {

        it("should ignore a normal pattern", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePattern: "ignore-me.txt", cwd: getFixturePath("ignore-pattern") });

            assert.isTrue(ignoredPaths.contains(getFixturePath("ignore-pattern", "ignore-me.txt")));
        });

    });

    describe("initialization with ignorePath", () => {

        let ignoreFilePath;

        before(() => {
            ignoreFilePath = getFixturePath(".eslintignore");
        });

        it("should set baseDir to directory containing ignorePath if provided", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: ignoreFilePath, cwd: getFixturePath() });

            assert.strictEqual(ignoredPaths.ignoreFileDir, path.dirname(ignoreFilePath));
        });

        it("should set the common ancestor directory of cwd and ignorePath to baseDir (in the case that 'ignoreFilePath' and 'cwd' are siblings)", () => {
            const baseDir = path.dirname(ignoreFilePath);
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: ignoreFilePath, cwd: path.resolve(baseDir, "testcwd") });

            assert.strictEqual(ignoredPaths.getBaseDir(), baseDir);
        });

        it("should set the common ancestor directory of cwd and ignorePath to baseDir", () => {
            const baseDir = path.resolve(ignoreFilePath, "../../..");
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: ignoreFilePath, cwd: path.resolve(baseDir, "fix/testcwd") });

            assert.strictEqual(ignoredPaths.getBaseDir(), baseDir);
        });

    });

    describe("initialization with ignorePath file not named .eslintignore", () => {

        let ignoreFilePath;

        before(() => {
            ignoreFilePath = getFixturePath("custom-name", "ignore-file");
        });

        it("should work when cwd is a parent directory", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: ignoreFilePath, cwd: getFixturePath() });

            assert.notStrictEqual(getIgnoreRules(ignoredPaths).length, countDefaultPatterns(ignoredPaths));
        });

        it("should work when the file is in the cwd", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: ignoreFilePath, cwd: getFixturePath("custom-name") });

            assert.notStrictEqual(getIgnoreRules(ignoredPaths).length, countDefaultPatterns(ignoredPaths));
        });

        it("should work when cwd is a subdirectory", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: ignoreFilePath, cwd: getFixturePath("custom-name", "subdirectory") });

            assert.notStrictEqual(getIgnoreRules(ignoredPaths).length, countDefaultPatterns(ignoredPaths));
        });

    });

    describe("initialization without ignorePath", () => {

        it("should not load an ignore file if none is in cwd", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath("no-ignore-file") });

            assert.lengthOf(getIgnoreFiles(ignoredPaths), 0);
            assert.lengthOf(getIgnoreRules(ignoredPaths), countDefaultPatterns(ignoredPaths));
        });

    });

    describe("initialization with invalid file", () => {

        let invalidFilepath;

        before(() => {
            invalidFilepath = getFixturePath("not-a-directory", ".foobaz");
        });

        it("should throw error", () => {
            assert.throws(() => {
                const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: invalidFilepath, cwd: getFixturePath() });

                assert.ok(ignoredPaths);
            }, "Cannot read ignore file");
        });

    });

    describe("contains", () => {

        it("should throw if initialized with invalid options", () => {
            const ignoredPaths = new IgnoredPaths(null);

            assert.throw(ignoredPaths.contains, Error);
        });

        it("should not throw if given a relative filename", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePattern: "undef.js", cwd: getFixturePath() });

            ignoredPaths.contains("undef.js");
        });

        it("should return true for files which match an ignorePattern even if they do not exist on the filesystem", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePattern: "not-a-file", cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath("not-a-file")));
        });

        it("should return false for files outside of the cwd (with no ignore file provided)", () => {

            // Default ignore patterns should not inadvertantly ignore files in parent directories
            const ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath("no-ignore-file") });

            assert.isFalse(ignoredPaths.contains(getFixturePath("undef.js")));
        });

        it("should return false for files outside of ignorePath's directory", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: getFixturePath("custom-name", "ignore-file"), cwd: getFixturePath() });

            assert.isFalse(ignoredPaths.contains(getFixturePath("undef.js")));
        });

        it("should return true for file matching an ignore pattern exactly", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePattern: "undef.js", cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath("undef.js")));
        });

        it("should return false for file matching an invalid ignore pattern with leading './'", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePattern: "./undef.js", cwd: getFixturePath() });

            assert.isFalse(ignoredPaths.contains(getFixturePath("undef.js")));
        });

        it("should return false for file in subfolder of cwd matching an ignore pattern with leading '/'", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePattern: "/undef.js", cwd: getFixturePath() });

            assert.isFalse(ignoredPaths.contains(getFixturePath("subdir", "undef.js")));
        });

        it("should return true for file matching a child of an ignore pattern", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePattern: "ignore-pattern", cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath("ignore-pattern", "ignore-me.txt")));
        });

        it("should return true for file matching a grandchild of an ignore pattern", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePattern: "ignore-pattern", cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath("ignore-pattern", "subdir", "ignore-me.txt")));
        });

        it("should return true for file matching a child of an ignore pattern with windows line termination", () => {
            sinon.stub(fs, "readFileSync")
                .withArgs(".eslintignore")
                .returns("subdir\r\n");
            sinon.stub(fs, "statSync")
                .withArgs("subdir")
                .returns();
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: ".eslintignore", cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath("subdir/undef.js")));

            fs.readFileSync.restore();
            fs.statSync.restore();
        });

        it("should return false for file not matching any ignore pattern", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePattern: "failing.js", cwd: getFixturePath() });

            assert.isFalse(ignoredPaths.contains(getFixturePath("unignored.js")));
        });

        it("should return false for ignored file when unignored with ignore pattern", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: getFixturePath(".eslintignore"), ignorePattern: "!sampleignorepattern", cwd: getFixturePath() });

            assert.isFalse(ignoredPaths.contains(getFixturePath("sampleignorepattern")));

        });

        it("should resolve relative paths from the ignorePath, not cwd", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: getFixturePath(".eslintignoreForDifferentCwd"), cwd: getFixturePath("subdir") });

            assert.isFalse(ignoredPaths.contains(getFixturePath("subdir/undef.js")));
            assert.isTrue(ignoredPaths.contains(getFixturePath("undef.js")));
        });

        it("should resolve relative paths from the ignorePath when it's in a child directory", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: getFixturePath("subdir/.eslintignoreInChildDir"), cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath("subdir/undef.js")));
            assert.isFalse(ignoredPaths.contains(getFixturePath("undef.js")));
            assert.isTrue(ignoredPaths.contains(getFixturePath("foo.js")));
            assert.isTrue(ignoredPaths.contains(getFixturePath("subdir/foo.js")));

            assert.isTrue(ignoredPaths.contains(getFixturePath("node_modules/bar.js")));
        });

        it("should resolve relative paths from the ignorePath when it contains negated globs", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: getFixturePath("subdir/.eslintignoreInChildDir"), cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains("subdir/blah.txt"));
            assert.isTrue(ignoredPaths.contains("blah.txt"));
            assert.isFalse(ignoredPaths.contains("subdir/bar.txt"));
            assert.isTrue(ignoredPaths.contains("bar.txt"));
            assert.isFalse(ignoredPaths.contains("subdir/baz.txt"));
            assert.isFalse(ignoredPaths.contains("baz.txt"));
        });

        it("should resolve default ignore patterns from the CWD even when the ignorePath is in a subdirectory", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: getFixturePath("subdir/.eslintignoreInChildDir"), cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains("node_modules/blah.js"));
        });

        it("should resolve default ignore patterns from the CWD even when the ignorePath is in a parent directory", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: getFixturePath(".eslintignoreForDifferentCwd"), cwd: getFixturePath("subdir") });

            assert.isTrue(ignoredPaths.contains("node_modules/blah.js"));
        });

        it("should handle .eslintignore which contains CRLF correctly.", () => {
            const ignoreFileContent = fs.readFileSync(getFixturePath("crlf/.eslintignore"), "utf8");

            assert.isTrue(ignoreFileContent.includes("\r"), "crlf/.eslintignore should contains CR.");

            const ignoredPaths = new IgnoredPaths({
                ignore: true,
                ignorePath: getFixturePath("crlf/.eslintignore"),
                cwd: getFixturePath()
            });

            assert.isTrue(ignoredPaths.contains(getFixturePath("crlf/hide1/a.js")));
            assert.isTrue(ignoredPaths.contains(getFixturePath("crlf/hide2/a.js")));
            assert.isFalse(ignoredPaths.contains(getFixturePath("crlf/hide3/a.js")));
        });
    });

    describe("initialization with ignorePath containing commented lines", () => {

        let ignoreFilePath;

        before(() => {
            ignoreFilePath = getFixturePath(".eslintignoreWithComments");
        });

        it("should not include comments in ignore rules", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: ignoreFilePath, cwd: getFixturePath() });
            const ignorePatterns = getIgnorePatterns(ignoredPaths);

            assert.strictEqual(getIgnoreRules(ignoredPaths).length, countDefaultPatterns(ignoredPaths) + 1);
            assert.include(ignorePatterns, "this_one_not");
        });

    });

    describe("initialization with ignorePath containing negations", () => {
        let ignoreFilePath;

        before(() => {
            ignoreFilePath = getFixturePath(".eslintignoreWithNegation");
        });

        it("should ignore a non-negated pattern", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: ignoreFilePath, cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath("negation", "ignore.js")));
        });

        it("should not ignore a negated pattern", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: ignoreFilePath, cwd: getFixturePath() });

            assert.isFalse(ignoredPaths.contains(getFixturePath("negation", "unignore.js")));
        });

    });

    describe("default ignores", () => {

        it("should contain /bower_components/*", () => {
            const ignoredPaths = new IgnoredPaths();

            assert.include(ignoredPaths.defaultPatterns, "/bower_components/*");
        });

        it("should contain /node_modules/*", () => {
            const ignoredPaths = new IgnoredPaths();

            assert.include(ignoredPaths.defaultPatterns, "/node_modules/*");
        });

        it("should always apply defaultPatterns if ignore option is true", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath("bower_components/package/file.js")));
            assert.isTrue(ignoredPaths.contains(getFixturePath("node_modules/package/file.js")));
        });

        it("should still apply defaultPatterns if ignore option is is false", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: false, cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath("bower_components/package/file.js")));
            assert.isTrue(ignoredPaths.contains(getFixturePath("node_modules/package/file.js")));
        });

        it("should not ignore files in defaultPatterns within a subdirectory", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath() });

            assert.isFalse(ignoredPaths.contains(getFixturePath("subdir/bower_components/package/file.js")));
            assert.isFalse(ignoredPaths.contains(getFixturePath("subdir/node_modules/package/file.js")));
        });

        it("should allow subfolders of defaultPatterns to be unignored by ignorePattern", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath(), ignorePattern: "!/node_modules/package" });

            assert.isFalse(ignoredPaths.contains(getFixturePath("node_modules", "package", "file.js")));
        });

        it("should allow subfolders of defaultPatterns to be unignored by ignorePath", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath(), ignorePath: getFixturePath(".eslintignoreWithUnignoredDefaults") });

            assert.isFalse(ignoredPaths.contains(getFixturePath("node_modules", "package", "file.js")));
        });

        it("should ignore dotfiles", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath(".foo")));
            assert.isTrue(ignoredPaths.contains(getFixturePath("foo/.bar")));
        });

        it("should ignore directories beginning with a dot", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath(".foo/bar")));
            assert.isTrue(ignoredPaths.contains(getFixturePath("foo/.bar/baz")));
        });

        it("should still ignore dotfiles when ignore option disabled", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: false, cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath(".foo")));
            assert.isTrue(ignoredPaths.contains(getFixturePath("foo/.bar")));
        });

        it("should still ignore directories beginning with a dot when ignore option disabled", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: false, cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath(".foo/bar")));
            assert.isTrue(ignoredPaths.contains(getFixturePath("foo/.bar/baz")));
        });

        it("should not ignore absolute paths containing '..'", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath() });

            assert.isFalse(ignoredPaths.contains(`${getFixturePath("foo")}/../unignored.js`));
        });

        it("should ignore /node_modules/ at top level relative to .eslintignore when loaded", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: getFixturePath(".eslintignore"), cwd: getFixturePath() });

            assert.isTrue(ignoredPaths.contains(getFixturePath("node_modules", "existing.js")));
            assert.isFalse(ignoredPaths.contains(getFixturePath("foo", "node_modules", "existing.js")));
        });

        it("should ignore /node_modules/ at top level relative to cwd without an .eslintignore", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, cwd: getFixturePath("no-ignore-file") });

            assert.isTrue(ignoredPaths.contains(getFixturePath("no-ignore-file", "node_modules", "existing.js")));
            assert.isFalse(ignoredPaths.contains(getFixturePath("no-ignore-file", "foo", "node_modules", "existing.js")));
        });

    });

    describe("two globstar '**' ignore pattern", () => {

        it("should ignore files in nested directories", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePattern: "**/*.js", cwd: getFixturePath() });

            assert.isTrue(ignoredPaths instanceof IgnoredPaths);
            assert.isTrue(ignoredPaths.contains(getFixturePath("foo.js")));
            assert.isTrue(ignoredPaths.contains(getFixturePath("foo/bar.js")));
            assert.isTrue(ignoredPaths.contains(getFixturePath("foo/bar/baz.js")));
            assert.isFalse(ignoredPaths.contains(getFixturePath("foo.j2")));
            assert.isFalse(ignoredPaths.contains(getFixturePath("foo/bar.j2")));
            assert.isFalse(ignoredPaths.contains(getFixturePath("foo/bar/baz.j2")));
        });
    });

    describe("dotfiles option", () => {

        it("should add at least one pattern when false", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, dotfiles: false, cwd: getFixturePath("no-ignore-file") });

            assert(getIgnoreRules(ignoredPaths).length > ignoredPaths.defaultPatterns.length);
        });

        it("should add no patterns when true", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, dotfiles: true, cwd: getFixturePath("no-ignore-file") });

            assert.lengthOf(getIgnoreRules(ignoredPaths), ignoredPaths.defaultPatterns.length);
        });

        it("should not ignore dotfiles when true", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, dotfiles: true, cwd: getFixturePath() });

            assert.isFalse(ignoredPaths.contains(getFixturePath(".foo")));
            assert.isFalse(ignoredPaths.contains(getFixturePath("foo/.bar")));
        });

        it("should not ignore directories beginning with a dot when true", () => {
            const ignoredPaths = new IgnoredPaths({ ignore: true, dotfiles: true, cwd: getFixturePath() });

            assert.isFalse(ignoredPaths.contains(getFixturePath(".foo/bar")));
            assert.isFalse(ignoredPaths.contains(getFixturePath("foo/.bar/baz")));
        });

    });

    describe("getIgnoredFoldersGlobChecker", () => {

        /**
         * Creates a function to resolve the given relative path according to the `cwd`
         * @param {path} cwd The cwd of `ignorePaths`
         * @returns {function()} the function described above.
         */
        function createResolve(cwd) {
            return function(relative) {
                return path.join(cwd, relative);
            };
        }

        it("should ignore default folders when there is no eslintignore file", () => {
            const cwd = getFixturePath("no-ignore-file");
            const ignoredPaths = new IgnoredPaths({ ignore: true, cwd });

            const shouldIgnore = ignoredPaths.getIgnoredFoldersGlobChecker();
            const resolve = createResolve(cwd);

            assert.isTrue(shouldIgnore(resolve("node_modules/a")));
            assert.isTrue(shouldIgnore(resolve("node_modules/a/b")));
            assert.isTrue(shouldIgnore(resolve("bower_components/a")));
            assert.isTrue(shouldIgnore(resolve("bower_components/a/b")));
            assert.isFalse(shouldIgnore(resolve(".hidden")));
            assert.isTrue(shouldIgnore(resolve(".hidden/a")));

            assert.isFalse(shouldIgnore(resolve("..")));
            assert.isFalse(shouldIgnore(resolve("../..")));
            assert.isFalse(shouldIgnore(resolve("../foo")));
            assert.isFalse(shouldIgnore(resolve("../../..")));
            assert.isFalse(shouldIgnore(resolve("../../foo")));
        });

        it("should ignore default folders when there is an ignore file without unignored defaults", () => {
            const cwd = getFixturePath();
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: getFixturePath(".eslintignore"), cwd });

            const shouldIgnore = ignoredPaths.getIgnoredFoldersGlobChecker();
            const resolve = createResolve(cwd);

            assert.isTrue(shouldIgnore(resolve("node_modules/a")));
            assert.isTrue(shouldIgnore(resolve("node_modules/a/b")));
            assert.isTrue(shouldIgnore(resolve("bower_components/a")));
            assert.isTrue(shouldIgnore(resolve("bower_components/a/b")));
            assert.isFalse(shouldIgnore(resolve(".hidden")));
            assert.isTrue(shouldIgnore(resolve(".hidden/a")));
        });

        it("should not ignore things which are re-included in ignore file", () => {
            const cwd = getFixturePath();
            const ignoredPaths = new IgnoredPaths({ ignore: true, ignorePath: getFixturePath(".eslintignoreWithUnignoredDefaults"), cwd });

            const shouldIgnore = ignoredPaths.getIgnoredFoldersGlobChecker();
            const resolve = createResolve(cwd);

            assert.isTrue(shouldIgnore(resolve("node_modules/a")));
            assert.isTrue(shouldIgnore(resolve("node_modules/a/b")));
            assert.isTrue(shouldIgnore(resolve("bower_components/a")));
            assert.isTrue(shouldIgnore(resolve("bower_components/a/b")));
            assert.isFalse(shouldIgnore(resolve(".hidden")));
            assert.isTrue(shouldIgnore(resolve(".hidden/a")));
            assert.isFalse(shouldIgnore(resolve("node_modules/package")));
            assert.isFalse(shouldIgnore(resolve("bower_components/package")));
            assert.isFalse(shouldIgnore(resolve(".hidden/package")));
        });

        it("should ignore files which we try to re-include in ignore file when ignore option is disabled", () => {
            const cwd = getFixturePath();
            const ignoredPaths = new IgnoredPaths({ ignore: false, ignorePath: getFixturePath(".eslintignoreWithUnignoredDefaults"), cwd });

            const shouldIgnore = ignoredPaths.getIgnoredFoldersGlobChecker();
            const resolve = createResolve(cwd);

            assert.isTrue(shouldIgnore(resolve("node_modules/a")));
            assert.isTrue(shouldIgnore(resolve("node_modules/a/b")));
            assert.isTrue(shouldIgnore(resolve("bower_components/a")));
            assert.isTrue(shouldIgnore(resolve("bower_components/a/b")));
            assert.isFalse(shouldIgnore(resolve(".hidden")));
            assert.isTrue(shouldIgnore(resolve(".hidden/a")));
            assert.isTrue(shouldIgnore(resolve("node_modules/package")));
            assert.isTrue(shouldIgnore(resolve("bower_components/package")));
            assert.isTrue(shouldIgnore(resolve(".hidden/package")));
        });

        it("should not ignore dirs which are re-included by ignorePattern", () => {
            const cwd = getFixturePath("no-ignore-file");
            const ignoredPaths = new IgnoredPaths({ ignore: true, cwd, ignorePattern: "!/node_modules/package" });

            const shouldIgnore = ignoredPaths.getIgnoredFoldersGlobChecker();
            const resolve = createResolve(cwd);

            assert.isTrue(shouldIgnore(resolve("node_modules/a")));
            assert.isTrue(shouldIgnore(resolve("node_modules/a/b")));
            assert.isTrue(shouldIgnore(resolve("bower_components/a")));
            assert.isTrue(shouldIgnore(resolve("bower_components/a/b")));
            assert.isFalse(shouldIgnore(resolve(".hidden")));
            assert.isTrue(shouldIgnore(resolve(".hidden/a")));
            assert.isFalse(shouldIgnore(resolve("node_modules/package")));
            assert.isTrue(shouldIgnore(resolve("bower_components/package")));
        });

        it("should not ignore hidden dirs when dotfiles is enabled", () => {
            const cwd = getFixturePath("no-ignore-file");
            const ignoredPaths = new IgnoredPaths({ ignore: true, cwd, dotfiles: true });

            const shouldIgnore = ignoredPaths.getIgnoredFoldersGlobChecker();
            const resolve = createResolve(cwd);

            assert.isFalse(shouldIgnore(resolve(".hidden")));
            assert.isFalse(shouldIgnore(resolve(".hidden/a")));
        });

        it("should use the ignorePath's directory as the base to resolve relative paths, not cwd", () => {
            const cwd = getFixturePath("subdir");
            const ignoredPaths = new IgnoredPaths({ ignore: true, cwd, ignorePath: getFixturePath(".eslintignoreForDifferentCwd") });

            const shouldIgnore = ignoredPaths.getIgnoredFoldersGlobChecker();
            const resolve = createResolve(cwd);

            assert.isFalse(shouldIgnore(resolve("undef.js")));
            assert.isTrue(shouldIgnore(resolve("../undef.js")));
        });
    });

});
