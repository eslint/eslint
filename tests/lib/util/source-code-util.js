/**
 * @fileoverview Tests for source-code-util.
 * @author Ian VanSchooten
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

let path = require("path"),
    fs = require("fs"),
    os = require("os"),
    assert = require("chai").assert,
    sinon = require("sinon"),
    sh = require("shelljs"),
    proxyquire = require("proxyquire"),
    globUtil = require("../../../lib/util/glob-util"),
    SourceCode = require("../../../lib/util/source-code");

proxyquire = proxyquire.noCallThru().noPreserveCache();
let originalDir = process.cwd();

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
        let args = Array.prototype.slice.call(arguments);

        args.unshift(fixtureDir);
        let filepath = path.join.apply(path, args);

        try {
            filepath = fs.realpathSync(filepath);
            return filepath;
        } catch (e) {
            return filepath;
        }
    }

    let log = {
        info: sinon.spy(),
        error: sinon.spy()
    };
    let requireStubs = {
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
            let filename = getFixturePath("foo.js");
            let sourceCode = getSourceCodeOfFiles(filename, {cwd: fixtureDir});

            assert.isObject(sourceCode);
        });

        it("should accept an array of string filenames", function() {
            let fooFilename = getFixturePath("foo.js");
            let barFilename = getFixturePath("bar.js");
            let sourceCode = getSourceCodeOfFiles([fooFilename, barFilename], {cwd: fixtureDir});

            assert.isObject(sourceCode);
        });

        it("should accept a glob argument", function() {
            let glob = getFixturePath("*.js");
            let filename = getFixturePath("foo.js");
            let sourceCode = getSourceCodeOfFiles(glob, {cwd: fixtureDir});

            assert.isObject(sourceCode);
            assert.property(sourceCode, filename);
        });

        it("should accept a relative filename", function() {
            let filename = "foo.js";
            let sourceCode = getSourceCodeOfFiles(filename, {cwd: fixtureDir});

            assert.isObject(sourceCode);
            assert.property(sourceCode, getFixturePath(filename));
        });

        it("should accept a relative path to a file in a parent directory", function() {
            let filename = "../foo.js";
            let sourceCode = getSourceCodeOfFiles(filename, {cwd: getFixturePath("nested")});

            assert.isObject(sourceCode);
            assert.property(sourceCode, getFixturePath("foo.js"));
        });

        it("should accept a callback", function() {
            let filename = getFixturePath("foo.js");
            let spy = sinon.spy();

            process.chdir(fixtureDir);
            getSourceCodeOfFiles(filename, spy);
            process.chdir(originalDir);
            assert(spy.calledOnce);
        });

        it("should call the callback with total number of files being processed", function() {
            let filename = getFixturePath("foo.js");
            let spy = sinon.spy();

            process.chdir(fixtureDir);
            getSourceCodeOfFiles(filename, spy);
            process.chdir(originalDir);
            assert.equal(spy.firstCall.args[0], 1);
        });

        it("should use default options if none are provided", function() {
            let filename = getFixturePath("foo.js");
            let spy = sinon.spy(globUtil, "resolveFileGlobPatterns");

            getSourceCodeOfFiles(filename);
            assert(spy.called);
            assert.deepEqual(spy.firstCall.args[1].extensions, [ ".js" ]);
        });

        it("should create an object with located filenames as keys", function() {
            let fooFilename = getFixturePath("foo.js");
            let barFilename = getFixturePath("bar.js");
            let sourceCode = getSourceCodeOfFiles([fooFilename, barFilename], {cwd: fixtureDir});

            assert.property(sourceCode, fooFilename);
            assert.property(sourceCode, barFilename);
        });

        it("should should not include non-existent filesnames in results", function() {
            let filename = getFixturePath("missing.js");
            let sourceCode = getSourceCodeOfFiles(filename, {cwd: fixtureDir});

            assert.notProperty(sourceCode, filename);
        });

        it("should throw for files with parsing errors", function() {
            let filename = getFixturePath("parse-error", "parse-error.js");

            assert.throw(function() {
                getSourceCodeOfFiles(filename, {cwd: fixtureDir});
            }, /Parsing error: Unexpected token ;/);

        });

        it("should obtain the sourceCode of a file", function() {
            let filename = getFixturePath("foo.js");
            let sourceCode = getSourceCodeOfFiles(filename, {cwd: fixtureDir});

            assert.isObject(sourceCode);
            assert.instanceOf(sourceCode[filename], SourceCode);
        });

        it("should obtain the sourceCode of JSX files", function() {
            let filename = getFixturePath("jsx", "foo.jsx");
            let options = {
                cwd: fixtureDir,
                parserOptions: {
                    ecmaFeatures: {
                        jsx: true
                    }
                }
            };
            let sourceCode = getSourceCodeOfFiles(filename, options);

            assert.isObject(sourceCode);
            assert.instanceOf(sourceCode[filename], SourceCode);
        });

        it("should honor .eslintignore files by default", function() {
            let glob = getFixturePath("*.js");
            let unignoredFilename = getFixturePath("foo.js");
            let ignoredFilename = getFixturePath("ignored.js");
            let sourceCode = getSourceCodeOfFiles(glob, {cwd: fixtureDir});

            assert.property(sourceCode, unignoredFilename);
            assert.notProperty(sourceCode, ignoredFilename);
        });

        it("should obtain the sourceCode of all files in a specified folder", function() {
            let folder = getFixturePath("nested");
            let fooFile = getFixturePath("nested/foo.js");
            let barFile = getFixturePath("nested/bar.js");
            let sourceCode = getSourceCodeOfFiles(folder, {cwd: fixtureDir});

            assert.equal(Object.keys(sourceCode).length, 2);
            assert.instanceOf(sourceCode[fooFile], SourceCode);
            assert.instanceOf(sourceCode[barFile], SourceCode);
        });

        it("should accept cli options", function() {
            let pattern = getFixturePath("ext");
            let abcFile = getFixturePath("ext/foo.abc");
            let cliOptions = {extensions: [".abc"], cwd: fixtureDir};
            let sourceCode = getSourceCodeOfFiles(pattern, cliOptions);

            assert.equal(Object.keys(sourceCode).length, 1);
            assert.instanceOf(sourceCode[abcFile], SourceCode);
        });

        it("should execute the callback function, if provided", function() {
            let callback = sinon.spy();
            let filename = getFixturePath("foo.js");

            getSourceCodeOfFiles(filename, {cwd: fixtureDir}, callback);
            assert(callback.calledOnce);
        });

        it("should execute callback function once per file", function() {
            let callback = sinon.spy();
            let fooFilename = getFixturePath("foo.js");
            let barFilename = getFixturePath("bar.js");

            getSourceCodeOfFiles([fooFilename, barFilename], {cwd: fixtureDir}, callback);
            assert.equal(callback.callCount, 2);
        });

        it("should call callback function with total number of files with sourceCode", function() {
            let callback = sinon.spy();
            let firstFn = getFixturePath("foo.js");
            let secondFn = getFixturePath("bar.js");
            let thirdFn = getFixturePath("nested/foo.js");
            let missingFn = getFixturePath("missing.js");

            getSourceCodeOfFiles([firstFn, secondFn, thirdFn, missingFn], {cwd: fixtureDir}, callback);
            assert(callback.calledWith(3));
        });

    });

});
