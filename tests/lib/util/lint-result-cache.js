/**
 * @fileoverview Unit tests for lint result cache.
 * @author Kevin Partington
 */
"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const assert = require("chai").assert,
    CLIEngine = require("../../../lib/cli-engine"),
    fs = require("fs"),
    path = require("path"),
    proxyquire = require("proxyquire"),
    sinon = require("sinon");

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("LintResultCache", () => {
    const fixturePath = path.resolve(__dirname, "../../fixtures/lint-result-cache");
    const cacheFileLocation = path.join(fixturePath, ".eslintcache");
    const fileEntryCacheStubs = {};

    let LintResultCache,
        hashStub,
        sandbox,
        fakeConfigHelper,
        fakeErrorResults,
        fakeErrorResultsAutofix;

    before(() => {
        sandbox = sinon.sandbox.create();

        fakeConfigHelper = {
            getConfig: sandbox.stub()
        };

        hashStub = sandbox.stub();

        let shouldFix = false;

        // Get lint results for test fixtures
        const cliEngine = new CLIEngine({
            cache: false,
            ignore: false,
            globInputPaths: false,
            fix: () => shouldFix
        });

        // Get results without autofixing...
        fakeErrorResults = cliEngine.executeOnFiles([path.join(fixturePath, "test-with-errors.js")]).results[0];

        // ...and with autofixing
        shouldFix = true;
        fakeErrorResultsAutofix = cliEngine.executeOnFiles([path.join(fixturePath, "test-with-errors.js")]).results[0];

        // Set up LintResultCache with fake fileEntryCache module
        LintResultCache = proxyquire("../../../lib/util/lint-result-cache", {
            "file-entry-cache": fileEntryCacheStubs,
            "./hash": hashStub
        });
    });

    afterEach(done => {
        sandbox.reset();

        fs.unlink(cacheFileLocation, err => {
            if (err && err.code !== "ENOENT") {
                return done(err);
            }

            return done();
        });
    });

    describe("constructor", () => {
        it("should throw an error if cache file path is not provided", () => {
            assert.throws(() => new LintResultCache(), /Cache file location is required/u);
        });

        it("should throw an error if config helper is not provided", () => {
            assert.throws(() => new LintResultCache(cacheFileLocation), /Config helper is required/u);
        });

        it("should successfully create an instance if cache file location and config helper are provided", () => {
            const instance = new LintResultCache(cacheFileLocation, fakeConfigHelper);

            assert.ok(instance, "Instance should have been created successfully");
        });
    });

    describe("getCachedLintResults", () => {
        const filePath = path.join(fixturePath, "test-with-errors.js");
        const hashOfConfig = "hashOfConfig";

        let cacheEntry,
            getFileDescriptorStub,
            lintResultsCache;

        before(() => {
            getFileDescriptorStub = sandbox.stub();

            fileEntryCacheStubs.create = () => ({
                getFileDescriptor: getFileDescriptorStub
            });
        });

        after(() => {
            delete fileEntryCacheStubs.create;
        });

        beforeEach(() => {
            cacheEntry = {
                meta: {

                    // Serialized results will have null source
                    results: Object.assign({}, fakeErrorResults, { source: null }),

                    hashOfConfig
                }
            };

            getFileDescriptorStub.withArgs(filePath)
                .returns(cacheEntry);

            const fakeConfig = {};

            fakeConfigHelper.getConfig.returns(fakeConfig);

            lintResultsCache = new LintResultCache(cacheFileLocation, fakeConfigHelper);
        });

        describe("When file is changed", () => {
            beforeEach(() => {
                hashStub.returns(hashOfConfig);
                cacheEntry.changed = true;
            });

            it("should return null", () => {
                const result = lintResultsCache.getCachedLintResults(filePath);

                assert.ok(getFileDescriptorStub.calledOnce);
                assert.isNull(result);
            });
        });

        describe("When config hash is changed", () => {
            beforeEach(() => {
                hashStub.returns("differentHash");
            });

            it("should return null", () => {
                const result = lintResultsCache.getCachedLintResults(filePath);

                assert.ok(getFileDescriptorStub.calledOnce);
                assert.isNull(result);
            });
        });

        describe("When file is not found on filesystem", () => {
            beforeEach(() => {
                cacheEntry.notFound = true;
                hashStub.returns(hashOfConfig);
            });

            it("should return null", () => {
                const result = lintResultsCache.getCachedLintResults(filePath);

                assert.ok(getFileDescriptorStub.calledOnce);
                assert.isNull(result);
            });
        });

        describe("When file is present and unchanged and config is unchanged", () => {
            beforeEach(() => {
                hashStub.returns(hashOfConfig);
            });

            it("should return expected results", () => {
                const result = lintResultsCache.getCachedLintResults(filePath);

                assert.deepStrictEqual(result, fakeErrorResults);
                assert.ok(result.source, "source property should be hydrated from filesystem");
            });
        });
    });

    describe("setCachedLintResults", () => {
        const filePath = path.join(fixturePath, "test-with-errors.js");
        const hashOfConfig = "hashOfConfig";

        let cacheEntry,
            getFileDescriptorStub,
            lintResultsCache;

        before(() => {
            getFileDescriptorStub = sandbox.stub();

            fileEntryCacheStubs.create = () => ({
                getFileDescriptor: getFileDescriptorStub
            });
        });

        after(() => {
            delete fileEntryCacheStubs.create;
        });

        beforeEach(() => {
            cacheEntry = {
                meta: {}
            };

            getFileDescriptorStub.withArgs(filePath)
                .returns(cacheEntry);

            const fakeConfig = {};

            fakeConfigHelper.getConfig.returns(fakeConfig);

            hashStub.returns(hashOfConfig);

            lintResultsCache = new LintResultCache(cacheFileLocation, fakeConfigHelper);
        });

        describe("When lint result has output property", () => {
            it("does not modify file entry", () => {
                lintResultsCache.setCachedLintResults(filePath, fakeErrorResultsAutofix);

                assert.notProperty(cacheEntry.meta, "results");
                assert.notProperty(cacheEntry.meta, "hashOfConfig");
            });
        });

        describe("When file is not found on filesystem", () => {
            beforeEach(() => {
                cacheEntry.notFound = true;
            });

            it("does not modify file entry", () => {
                lintResultsCache.setCachedLintResults(filePath, fakeErrorResults);

                assert.notProperty(cacheEntry.meta, "results");
                assert.notProperty(cacheEntry.meta, "hashOfConfig");
            });
        });

        describe("When file is found on filesystem", () => {
            beforeEach(() => {
                lintResultsCache.setCachedLintResults(filePath, fakeErrorResults);
            });

            it("stores hash of config in file entry", () => {
                assert.strictEqual(cacheEntry.meta.hashOfConfig, hashOfConfig);
            });

            it("stores results (except source) in file entry", () => {
                const expectedCachedResults = Object.assign(
                    {},
                    fakeErrorResults,
                    { source: null }
                );

                assert.deepStrictEqual(cacheEntry.meta.results, expectedCachedResults);
            });
        });

        describe("When file is found and empty", () => {
            beforeEach(() => {
                lintResultsCache.setCachedLintResults(
                    filePath,
                    Object.assign({}, fakeErrorResults, { source: "" })
                );
            });

            it("stores hash of config in file entry", () => {
                assert.strictEqual(cacheEntry.meta.hashOfConfig, hashOfConfig);
            });

            it("stores results (except source) in file entry", () => {
                const expectedCachedResults = Object.assign(
                    {},
                    fakeErrorResults,
                    { source: null }
                );

                assert.deepStrictEqual(cacheEntry.meta.results, expectedCachedResults);
            });
        });
    });

    describe("reconcile", () => {
        let reconcileStub,
            lintResultsCache;

        before(() => {
            reconcileStub = sandbox.stub();

            fileEntryCacheStubs.create = () => ({
                reconcile: reconcileStub
            });
        });

        after(() => {
            delete fileEntryCacheStubs.create;
        });

        beforeEach(() => {
            lintResultsCache = new LintResultCache(cacheFileLocation, fakeConfigHelper);
        });

        it("calls reconcile on the underlying cache", () => {
            lintResultsCache.reconcile();

            assert.isTrue(reconcileStub.calledOnce);
        });
    });
});
