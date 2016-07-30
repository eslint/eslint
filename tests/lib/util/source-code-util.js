/**
 * @fileoverview Tests for source-code-util.
 * @author Ian VanSchooten
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const path = require("path"),
    fs = require("fs"),
    os = require("os"),
    assert = require("chai").assert,
    sinon = require("sinon"),
    sh = require("shelljs"),
    globUtil = require("../../../lib/util/glob-util"),
    SourceCode = require("../../../lib/util/source-code");

const proxyquire = require("proxyquire").noCallThru().noPreserveCache();
const originalDir = process.cwd();

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("SourceCodeUtil", function() {

    let fixtureDir,
        getSourceCodeOfFiles;

    /**
     * Returns the path inside of the fixture directory.
     * @returns {string} The path inside the fixture directory.
     * @private
     */
    function getFixturePath() {
        const args = Array.prototype.slice.call(arguments);

        args.unshift(fixtureDir);
        let filepath = path.join.apply(path, args);

        try {
            filepath = fs.realpathSync(filepath);
            return filepath;
        } catch (e) {
            return filepath;
        }
    }

    const log = {
        info: sinon.spy(),
        error: sinon.spy()
    };
    const requireStubs = {
        "../logging": log
    };

    // copy into clean area so as not to get "infected" by this project's .eslintrc files
    before(function() {
        fixtureDir = os.tmpdir() + "/eslint/fixtures/source-code-util";
        sh.mkdir("-p", fixtureDir);
        sh.cp("-r", "./tests/fixtures/source-code-util/.", fixtureDir);
        fixtureDir = fs.realpathSync(fixtureDir);
    });

    beforeEach(function() {
        getSourceCodeOfFiles = proxyquire("../../../lib/util/source-code-util", requireStubs).getSourceCodeOfFiles;
    });

    afterEach(function() {
        log.info.reset();
        log.error.reset();
    });

    after(function() {
        sh.rm("-r", fixtureDir);
    });

    describe("getSourceCodeOfFiles()", function() {

        it("should handle single string filename arguments", function() {
            const filename = getFixturePath("foo.js");
            const sourceCode = getSourceCodeOfFiles(filename, {cwd: fixtureDir});

            assert.isObject(sourceCode);
        });

        it("should accept an array of string filenames", function() {
            const fooFilename = getFixturePath("foo.js");
            const barFilename = getFixturePath("bar.js");
            const sourceCode = getSourceCodeOfFiles([fooFilename, barFilename], {cwd: fixtureDir});

            assert.isObject(sourceCode);
        });

        it("should accept a glob argument", function() {
            const glob = getFixturePath("*.js");
            const filename = getFixturePath("foo.js");
            const sourceCode = getSourceCodeOfFiles(glob, {cwd: fixtureDir});

            assert.isObject(sourceCode);
            assert.property(sourceCode, filename);
        });

        it("should accept a relative filename", function() {
            const filename = "foo.js";
            const sourceCode = getSourceCodeOfFiles(filename, {cwd: fixtureDir});

            assert.isObject(sourceCode);
            assert.property(sourceCode, getFixturePath(filename));
        });

        it("should accept a relative path to a file in a parent directory", function() {
            const filename = "../foo.js";
            const sourceCode = getSourceCodeOfFiles(filename, {cwd: getFixturePath("nested")});

            assert.isObject(sourceCode);
            assert.property(sourceCode, getFixturePath("foo.js"));
        });

        it("should accept a callback", function() {
            const filename = getFixturePath("foo.js");
            const spy = sinon.spy();

            process.chdir(fixtureDir);
            getSourceCodeOfFiles(filename, spy);
            process.chdir(originalDir);
            assert(spy.calledOnce);
        });

        it("should call the callback with total number of files being processed", function() {
            const filename = getFixturePath("foo.js");
            const spy = sinon.spy();

            process.chdir(fixtureDir);
            getSourceCodeOfFiles(filename, spy);
            process.chdir(originalDir);
            assert.equal(spy.firstCall.args[0], 1);
        });

        it("should use default options if none are provided", function() {
            const filename = getFixturePath("foo.js");
            const spy = sinon.spy(globUtil, "resolveFileGlobPatterns");

            getSourceCodeOfFiles(filename);
            assert(spy.called);
            assert.deepEqual(spy.firstCall.args[1].extensions, [ ".js" ]);
        });

        it("should create an object with located filenames as keys", function() {
            const fooFilename = getFixturePath("foo.js");
            const barFilename = getFixturePath("bar.js");
            const sourceCode = getSourceCodeOfFiles([fooFilename, barFilename], {cwd: fixtureDir});

            assert.property(sourceCode, fooFilename);
            assert.property(sourceCode, barFilename);
        });

        it("should should not include non-existent filesnames in results", function() {
            const filename = getFixturePath("missing.js");
            const sourceCode = getSourceCodeOfFiles(filename, {cwd: fixtureDir});

            assert.notProperty(sourceCode, filename);
        });

        it("should throw for files with parsing errors", function() {
            const filename = getFixturePath("parse-error", "parse-error.js");

            assert.throw(function() {
                getSourceCodeOfFiles(filename, {cwd: fixtureDir});
            }, /Parsing error: Unexpected token ;/);

        });

        it("should obtain the sourceCode of a file", function() {
            const filename = getFixturePath("foo.js");
            const sourceCode = getSourceCodeOfFiles(filename, {cwd: fixtureDir});

            assert.isObject(sourceCode);
            assert.instanceOf(sourceCode[filename], SourceCode);
        });

        it("should obtain the sourceCode of JSX files", function() {
            const filename = getFixturePath("jsx", "foo.jsx");
            const options = {
                cwd: fixtureDir,
                parserOptions: {
                    ecmaFeatures: {
                        jsx: true
                    }
                }
            };
            const sourceCode = getSourceCodeOfFiles(filename, options);

            assert.isObject(sourceCode);
            assert.instanceOf(sourceCode[filename], SourceCode);
        });

        it("should honor .eslintignore files by default", function() {
            const glob = getFixturePath("*.js");
            const unignoredFilename = getFixturePath("foo.js");
            const ignoredFilename = getFixturePath("ignored.js");
            const sourceCode = getSourceCodeOfFiles(glob, {cwd: fixtureDir});

            assert.property(sourceCode, unignoredFilename);
            assert.notProperty(sourceCode, ignoredFilename);
        });

        it("should obtain the sourceCode of all files in a specified folder", function() {
            const folder = getFixturePath("nested");
            const fooFile = getFixturePath("nested/foo.js");
            const barFile = getFixturePath("nested/bar.js");
            const sourceCode = getSourceCodeOfFiles(folder, {cwd: fixtureDir});

            assert.equal(Object.keys(sourceCode).length, 2);
            assert.instanceOf(sourceCode[fooFile], SourceCode);
            assert.instanceOf(sourceCode[barFile], SourceCode);
        });

        it("should accept cli options", function() {
            const pattern = getFixturePath("ext");
            const abcFile = getFixturePath("ext/foo.abc");
            const cliOptions = {extensions: [".abc"], cwd: fixtureDir};
            const sourceCode = getSourceCodeOfFiles(pattern, cliOptions);

            assert.equal(Object.keys(sourceCode).length, 1);
            assert.instanceOf(sourceCode[abcFile], SourceCode);
        });

        it("should execute the callback function, if provided", function() {
            const callback = sinon.spy();
            const filename = getFixturePath("foo.js");

            getSourceCodeOfFiles(filename, {cwd: fixtureDir}, callback);
            assert(callback.calledOnce);
        });

        it("should execute callback function once per file", function() {
            const callback = sinon.spy();
            const fooFilename = getFixturePath("foo.js");
            const barFilename = getFixturePath("bar.js");

            getSourceCodeOfFiles([fooFilename, barFilename], {cwd: fixtureDir}, callback);
            assert.equal(callback.callCount, 2);
        });

        it("should call callback function with total number of files with sourceCode", function() {
            const callback = sinon.spy();
            const firstFn = getFixturePath("foo.js");
            const secondFn = getFixturePath("bar.js");
            const thirdFn = getFixturePath("nested/foo.js");
            const missingFn = getFixturePath("missing.js");

            getSourceCodeOfFiles([firstFn, secondFn, thirdFn, missingFn], {cwd: fixtureDir}, callback);
            assert(callback.calledWith(3));
        });

    });

});
