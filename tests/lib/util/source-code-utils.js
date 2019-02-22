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
    globUtils = require("../../../lib/util/glob-utils"),
    SourceCode = require("../../../lib/util/source-code");

const proxyquire = require("proxyquire").noCallThru().noPreserveCache();
const originalDir = process.cwd();

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("SourceCodeUtil", () => {

    let fixtureDir,
        getSourceCodeOfFiles;

    /**
     * Returns the path inside of the fixture directory.
     * @returns {string} The path inside the fixture directory.
     * @private
     */
    function getFixturePath(...args) {
        let filepath = path.join(fixtureDir, ...args);

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
    before(() => {
        fixtureDir = `${os.tmpdir()}/eslint/fixtures/source-code-util`;
        sh.mkdir("-p", fixtureDir);
        sh.cp("-r", "./tests/fixtures/source-code-util/.", fixtureDir);
        fixtureDir = fs.realpathSync(fixtureDir);
    });

    beforeEach(() => {
        getSourceCodeOfFiles = proxyquire("../../../lib/util/source-code-utils", requireStubs).getSourceCodeOfFiles;
    });

    afterEach(() => {
        log.info.reset();
        log.error.reset();
    });

    after(() => {
        sh.rm("-r", fixtureDir);
    });

    describe("getSourceCodeOfFiles()", () => {

        it("should handle single string filename arguments", () => {
            const filename = getFixturePath("foo.js");
            const sourceCode = getSourceCodeOfFiles(filename, { cwd: fixtureDir });

            assert.isObject(sourceCode);
        });

        it("should accept an array of string filenames", () => {
            const fooFilename = getFixturePath("foo.js");
            const barFilename = getFixturePath("bar.js");
            const sourceCode = getSourceCodeOfFiles([fooFilename, barFilename], { cwd: fixtureDir });

            assert.isObject(sourceCode);
        });

        it("should accept a glob argument", () => {
            const glob = getFixturePath("*.js");
            const filename = getFixturePath("foo.js");
            const sourceCode = getSourceCodeOfFiles(glob, { cwd: fixtureDir });

            assert.isObject(sourceCode);
            assert.property(sourceCode, filename);
        });

        it("should accept a relative filename", () => {
            const filename = "foo.js";
            const sourceCode = getSourceCodeOfFiles(filename, { cwd: fixtureDir });

            assert.isObject(sourceCode);
            assert.property(sourceCode, getFixturePath(filename));
        });

        it("should accept a relative path to a file in a parent directory", () => {
            const filename = "../foo.js";
            const sourceCode = getSourceCodeOfFiles(filename, { cwd: getFixturePath("nested") });

            assert.isObject(sourceCode);
            assert.property(sourceCode, getFixturePath("foo.js"));
        });

        it("should accept a callback", () => {
            const filename = getFixturePath("foo.js");
            const spy = sinon.spy();

            process.chdir(fixtureDir);
            getSourceCodeOfFiles(filename, spy);
            process.chdir(originalDir);
            assert(spy.calledOnce);
        });

        it("should call the callback with total number of files being processed", () => {
            const filename = getFixturePath("foo.js");
            const spy = sinon.spy();

            process.chdir(fixtureDir);
            getSourceCodeOfFiles(filename, spy);
            process.chdir(originalDir);
            assert.strictEqual(spy.firstCall.args[0], 1);
        });

        it("should use default options if none are provided", () => {
            const filename = getFixturePath("foo.js");
            const spy = sinon.spy(globUtils, "resolveFileGlobPatterns");

            getSourceCodeOfFiles(filename);
            assert(spy.called);
            assert.deepStrictEqual(spy.firstCall.args[1].extensions, [".js"]);
        });

        it("should create an object with located filenames as keys", () => {
            const fooFilename = getFixturePath("foo.js");
            const barFilename = getFixturePath("bar.js");
            const sourceCode = getSourceCodeOfFiles([fooFilename, barFilename], { cwd: fixtureDir });

            assert.property(sourceCode, fooFilename);
            assert.property(sourceCode, barFilename);
        });

        it("should should not include non-existent filenames in results", () => {
            const filename = getFixturePath("missing.js");

            assert.throws(() => {
                getSourceCodeOfFiles(filename, { cwd: fixtureDir });
            }, `No files matching '${filename}' were found.`);
        });

        it("should throw for files with parsing errors", () => {
            const filename = getFixturePath("parse-error", "parse-error.js");

            assert.throw(() => {
                getSourceCodeOfFiles(filename, { cwd: fixtureDir });
            }, /Parsing error: Unexpected token ;/u);

        });

        it("should obtain the sourceCode of a file", () => {
            const filename = getFixturePath("foo.js");
            const sourceCode = getSourceCodeOfFiles(filename, { cwd: fixtureDir });

            assert.isObject(sourceCode);
            assert.instanceOf(sourceCode[filename], SourceCode);
        });

        it("should obtain the sourceCode of JSX files", () => {
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

        it("should honor .eslintignore files by default", () => {
            const glob = getFixturePath("*.js");
            const unignoredFilename = getFixturePath("foo.js");
            const ignoredFilename = getFixturePath("ignored.js");
            const sourceCode = getSourceCodeOfFiles(glob, { cwd: fixtureDir });

            assert.property(sourceCode, unignoredFilename);
            assert.notProperty(sourceCode, ignoredFilename);
        });

        it("should obtain the sourceCode of all files in a specified folder", () => {
            const folder = getFixturePath("nested");
            const fooFile = getFixturePath("nested/foo.js");
            const barFile = getFixturePath("nested/bar.js");
            const sourceCode = getSourceCodeOfFiles(folder, { cwd: fixtureDir });

            assert.strictEqual(Object.keys(sourceCode).length, 2);
            assert.instanceOf(sourceCode[fooFile], SourceCode);
            assert.instanceOf(sourceCode[barFile], SourceCode);
        });

        it("should accept cli options", () => {
            const pattern = getFixturePath("ext");
            const abcFile = getFixturePath("ext/foo.abc");
            const cliOptions = { extensions: [".abc"], cwd: fixtureDir };
            const sourceCode = getSourceCodeOfFiles(pattern, cliOptions);

            assert.strictEqual(Object.keys(sourceCode).length, 1);
            assert.instanceOf(sourceCode[abcFile], SourceCode);
        });

        it("should execute the callback function, if provided", () => {
            const callback = sinon.spy();
            const filename = getFixturePath("foo.js");

            getSourceCodeOfFiles(filename, { cwd: fixtureDir }, callback);
            assert(callback.calledOnce);
        });

        it("should execute callback function once per file", () => {
            const callback = sinon.spy();
            const fooFilename = getFixturePath("foo.js");
            const barFilename = getFixturePath("bar.js");

            getSourceCodeOfFiles([fooFilename, barFilename], { cwd: fixtureDir }, callback);
            assert.strictEqual(callback.callCount, 2);
        });

        it("should call callback function with total number of files with sourceCode", () => {
            const callback = sinon.spy();
            const firstFn = getFixturePath("foo.js");
            const secondFn = getFixturePath("bar.js");
            const thirdFn = getFixturePath("nested/foo.js");

            getSourceCodeOfFiles([firstFn, secondFn, thirdFn], { cwd: fixtureDir }, callback);
            assert(callback.calledWith(3));
        });

    });

});
