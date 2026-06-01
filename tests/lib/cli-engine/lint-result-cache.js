/**
 * @fileoverview Unit tests for lint result cache.
 * @author Kevin Partington
 */
"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const assert = require("chai").assert,
	{ ESLint } = require("../../../lib/eslint"),
	fs = require("node:fs"),
	os = require("node:os"),
	path = require("node:path"),
	proxyquire = require("proxyquire"),
	sinon = require("sinon"),
	fileEntryCache = require("file-entry-cache"),
	OriginalLintResultCache = require("../../../lib/cli-engine/lint-result-cache");

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("LintResultCache", () => {
	const fixturePath = path.resolve(
		__dirname,
		"../../fixtures/lint-result-cache",
	);
	const cacheFileLocation = path.join(fixturePath, ".eslintcache");
	const fileEntryCacheStubs = {};

	/*
	 * fileEntryCache.create is a getter with `configurable: false`, so we need to set
	 * it in advance with `configurable: true` to be able to modify it.
	 */
	Object.defineProperty(fileEntryCacheStubs, "create", {
		...Object.getOwnPropertyDescriptor(fileEntryCache, "create"),
		configurable: true,
	});

	let LintResultCache,
		hashStub,
		sandbox,
		fakeConfig,
		fakeErrorResults,
		fakeErrorResultsAutofix;

	before(async () => {
		sandbox = sinon.createSandbox();
		hashStub = sandbox.stub();

		let shouldFix = false;

		// Get lint results for test fixtures
		const eslint = new ESLint({
			cache: false,
			ignore: false,
			globInputPaths: false,
			fix: () => shouldFix,
		});

		// Get results without autofixing...
		fakeErrorResults = (
			await eslint.lintFiles([
				path.join(fixturePath, "test-with-errors.js"),
			])
		)[0];
		// ...and with autofixing
		shouldFix = true;
		fakeErrorResultsAutofix = (
			await eslint.lintFiles([
				path.join(fixturePath, "test-with-errors.js"),
			])
		)[0];

		// Set up LintResultCache with fake fileEntryCache module
		LintResultCache = proxyquire(
			"../../../lib/cli-engine/lint-result-cache.js",
			{
				"file-entry-cache": fileEntryCacheStubs,
				"./hash": hashStub,
			},
		);
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
			assert.throws(
				() => new LintResultCache(),
				/Cache file location is required/u,
			);
		});

		it("should throw an error if cacheStrategy is not provided", () => {
			assert.throws(
				() => new LintResultCache(cacheFileLocation),
				/Cache strategy is required/u,
			);
		});

		it("should throw an error if cacheStrategy is an invalid value", () => {
			assert.throws(
				() => new LintResultCache(cacheFileLocation, "foo"),
				/Cache strategy must be one of/u,
			);
		});

		it("should successfully create an instance if cache file location and cache strategy provided", () => {
			const instance = new LintResultCache(cacheFileLocation, "metadata");

			assert.ok(
				instance,
				"Instance should have been created successfully",
			);
		});
	});

	describe("getCachedLintResults", () => {
		const filePath = path.join(fixturePath, "test-with-errors.js");
		const hashOfConfig = "hashOfConfig";

		let cacheEntry, getFileDescriptorStub, lintResultsCache;

		before(() => {
			getFileDescriptorStub = sandbox.stub();

			Object.defineProperty(fileEntryCacheStubs, "create", {
				...Object.getOwnPropertyDescriptor(fileEntryCache, "create"),
				get() {
					return () => ({
						getFileDescriptor: getFileDescriptorStub,
					});
				},
				configurable: true,
			});
		});

		after(() => {
			delete fileEntryCacheStubs.create;
		});

		beforeEach(() => {
			cacheEntry = {
				meta: {
					data: {
						// Serialized results will have null source
						results: Object.assign({}, fakeErrorResults, {
							source: null,
						}),

						hashOfConfig,
					},
				},
			};

			getFileDescriptorStub.withArgs(filePath).returns(cacheEntry);

			fakeConfig = {};

			lintResultsCache = new LintResultCache(
				cacheFileLocation,
				"metadata",
			);
		});

		describe("when calculating the hashing", () => {
			it("contains eslint version during hashing", () => {
				const version = "eslint-=-version";
				const NewLintResultCache = proxyquire(
					"../../../lib/cli-engine/lint-result-cache.js",
					{
						"../../package.json": { version },
						"./hash": hashStub,
					},
				);
				const newLintResultCache = new NewLintResultCache(
					cacheFileLocation,
					"metadata",
				);

				newLintResultCache.getCachedLintResults(filePath, fakeConfig);
				assert.ok(hashStub.calledOnce);
				assert.ok(hashStub.calledWithMatch(version));
			});

			it("contains node version during hashing", () => {
				const version = "node-=-version";

				const versionStub = sandbox
					.stub(process, "version")
					.value(version);

				try {
					const NewLintResultCache = proxyquire(
						"../../../lib/cli-engine/lint-result-cache.js",
						{
							"./hash": hashStub,
						},
					);
					const newLintResultCache = new NewLintResultCache(
						cacheFileLocation,
						"metadata",
					);

					newLintResultCache.getCachedLintResults(
						filePath,
						fakeConfig,
					);

					assert.ok(hashStub.calledOnce);
					assert.ok(hashStub.calledWithMatch(version));
				} finally {
					versionStub.restore();
				}
			});
		});

		describe("When file is changed", () => {
			beforeEach(() => {
				hashStub.returns(hashOfConfig);
				cacheEntry.changed = true;
			});

			it("should return null", () => {
				const result = lintResultsCache.getCachedLintResults(
					filePath,
					fakeConfig,
				);

				assert.ok(getFileDescriptorStub.calledOnce);
				assert.isNull(result);
			});
		});

		describe("When config hash is changed", () => {
			beforeEach(() => {
				hashStub.returns("differentHash");
			});

			it("should return null", () => {
				const result = lintResultsCache.getCachedLintResults(
					filePath,
					fakeConfig,
				);

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
				const result = lintResultsCache.getCachedLintResults(
					filePath,
					fakeConfig,
				);

				assert.ok(getFileDescriptorStub.calledOnce);
				assert.isNull(result);
			});
		});

		describe("When file is present and unchanged and config is unchanged", () => {
			beforeEach(() => {
				hashStub.returns(hashOfConfig);
			});

			it("should return expected results", () => {
				const result = lintResultsCache.getCachedLintResults(
					filePath,
					fakeConfig,
				);

				assert.deepStrictEqual(result, fakeErrorResults);
				assert.ok(
					result.source,
					"source property should be hydrated from filesystem",
				);
			});
		});

		describe("When called multiple times for the same file", () => {
			let testDir;
			let testFile;
			let anotherFile;
			let cacheFile;
			let lintResult, anotherLintResult;
			let config;

			beforeEach(async () => {
				testDir = await fs.promises.mkdtemp(
					path.join(os.tmpdir(), "eslint-cache-"),
				);

				testFile = path.resolve(testDir, "file.js");
				await fs.promises.writeFile(testFile, "foo;");

				anotherFile = path.resolve(testDir, "anotherfile.js");
				await fs.promises.writeFile(anotherFile, "bar;");

				const testEslint = new ESLint({
					cwd: testDir,
					cache: false,
					overrideConfigFile: true,
				});

				[lintResult] = await testEslint.lintFiles([testFile]);
				assert(lintResult, "Lint result should have been created");

				[anotherLintResult] = await testEslint.lintFiles([anotherFile]);
				assert(
					anotherLintResult,
					"Another lint result should have been created",
				);

				config = await testEslint.calculateConfigForFile(testFile);

				cacheFile = path.resolve(testDir, ".eslintcache");
			});

			afterEach(async () => {
				await fs.promises.rm(testDir, {
					recursive: true,
					force: true,
				});
				testDir = void 0;
			});

			["metadata", "content"].forEach(cacheStrategy => {
				it(`should return null for a file when cache file hasn't been created yet when cacheStrategy is "${cacheStrategy}"`, async () => {
					const testLintResultCache = new OriginalLintResultCache(
						cacheFile,
						cacheStrategy,
					);

					// Get results from cache multiple times
					assert.isNull(
						testLintResultCache.getCachedLintResults(
							testFile,
							config,
						),
					);
					assert.isNull(
						testLintResultCache.getCachedLintResults(
							testFile,
							config,
						),
					);
				});

				it(`should return null for a file that hasn't already been cached when cacheStrategy is "${cacheStrategy}"`, async () => {
					const initLintResultCache = new OriginalLintResultCache(
						cacheFile,
						cacheStrategy,
					);

					initLintResultCache.setCachedLintResults(
						anotherFile,
						config,
						anotherLintResult,
					);
					initLintResultCache.reconcile();

					const checkLintResultCache = new OriginalLintResultCache(
						cacheFile,
						cacheStrategy,
					);
					assert(
						checkLintResultCache.getCachedLintResults(
							anotherFile,
							config,
						),
						"Cache entry for another file should have be valid",
					);

					const testLintResultCache = new OriginalLintResultCache(
						cacheFile,
						cacheStrategy,
					);

					// Get results from cache multiple times
					assert.isNull(
						testLintResultCache.getCachedLintResults(
							testFile,
							config,
						),
					);
					assert.isNull(
						testLintResultCache.getCachedLintResults(
							testFile,
							config,
						),
					);
				});

				it(`should return null for a file that has already been cached but modified when cacheStrategy is "${cacheStrategy}"`, async () => {
					const initLintResultCache = new OriginalLintResultCache(
						cacheFile,
						cacheStrategy,
					);

					initLintResultCache.setCachedLintResults(
						testFile,
						config,
						lintResult,
					);
					initLintResultCache.reconcile();

					const checkLintResultCache = new OriginalLintResultCache(
						cacheFile,
						cacheStrategy,
					);
					assert(
						checkLintResultCache.getCachedLintResults(
							testFile,
							config,
						),
						"Cache entry should have initially be valid",
					);

					// Modify file. This should make cache entry invalid for all cache strategies.
					await fs.promises.writeFile(testFile, "bar;");

					const testLintResultCache = new OriginalLintResultCache(
						cacheFile,
						cacheStrategy,
					);

					// Get results from cache multiple times
					assert.isNull(
						testLintResultCache.getCachedLintResults(
							testFile,
							config,
						),
					);
					assert.isNull(
						testLintResultCache.getCachedLintResults(
							testFile,
							config,
						),
					);
				});
			});
		});
	});

	describe("setCachedLintResults", () => {
		const filePath = path.join(fixturePath, "test-with-errors.js");
		const hashOfConfig = "hashOfConfig";

		let cacheEntry, getFileDescriptorStub, lintResultsCache;

		before(() => {
			getFileDescriptorStub = sandbox.stub();

			Object.defineProperty(fileEntryCacheStubs, "create", {
				...Object.getOwnPropertyDescriptor(fileEntryCache, "create"),
				get() {
					return () => ({
						getFileDescriptor: getFileDescriptorStub,
					});
				},
				configurable: true,
			});
		});

		after(() => {
			delete fileEntryCacheStubs.create;
		});

		beforeEach(() => {
			cacheEntry = {
				meta: {},
			};

			getFileDescriptorStub.withArgs(filePath).returns(cacheEntry);

			fakeConfig = {};

			hashStub.returns(hashOfConfig);

			lintResultsCache = new LintResultCache(
				cacheFileLocation,
				"metadata",
			);
		});

		describe("When lint result has output property", () => {
			it("does not modify file entry", () => {
				lintResultsCache.setCachedLintResults(
					filePath,
					fakeConfig,
					fakeErrorResultsAutofix,
				);

				assert.notProperty(cacheEntry.meta, "data");
			});
		});

		describe("When file is not found on filesystem", () => {
			beforeEach(() => {
				cacheEntry.notFound = true;
			});

			it("does not modify file entry", () => {
				lintResultsCache.setCachedLintResults(
					filePath,
					fakeConfig,
					fakeErrorResults,
				);

				assert.notProperty(cacheEntry.meta, "data");
			});
		});

		describe("When file is found on filesystem", () => {
			beforeEach(() => {
				lintResultsCache.setCachedLintResults(
					filePath,
					fakeConfig,
					fakeErrorResults,
				);
			});

			it("stores hash of config in file entry", () => {
				assert.strictEqual(
					cacheEntry.meta.data.hashOfConfig,
					hashOfConfig,
				);
			});

			it("stores results (except source) in file entry", () => {
				const expectedCachedResults = Object.assign(
					{},
					fakeErrorResults,
					{
						source: null,
					},
				);

				assert.deepStrictEqual(
					cacheEntry.meta.data.results,
					expectedCachedResults,
				);
			});
		});

		describe("When file is found and empty", () => {
			beforeEach(() => {
				lintResultsCache.setCachedLintResults(
					filePath,
					fakeConfig,
					Object.assign({}, fakeErrorResults, { source: "" }),
				);
			});

			it("stores hash of config in file entry", () => {
				assert.strictEqual(
					cacheEntry.meta.data.hashOfConfig,
					hashOfConfig,
				);
			});

			it("stores results (except source) in file entry", () => {
				const expectedCachedResults = Object.assign(
					{},
					fakeErrorResults,
					{
						source: null,
					},
				);

				assert.deepStrictEqual(
					cacheEntry.meta.data.results,
					expectedCachedResults,
				);
			});
		});
	});

	describe("reconcile", () => {
		let reconcileStub, lintResultsCache;

		before(() => {
			reconcileStub = sandbox.stub();

			Object.defineProperty(fileEntryCacheStubs, "create", {
				...Object.getOwnPropertyDescriptor(fileEntryCache, "create"),
				get() {
					return () => ({
						reconcile: reconcileStub,
					});
				},
				configurable: true,
			});
		});

		after(() => {
			delete fileEntryCacheStubs.create;
		});

		beforeEach(() => {
			lintResultsCache = new LintResultCache(
				cacheFileLocation,
				"metadata",
			);
		});

		it("calls reconcile on the underlying cache", () => {
			lintResultsCache.reconcile();

			assert.isTrue(reconcileStub.calledOnce);
		});
	});
});
