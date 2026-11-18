/**
 * @fileoverview Tests for config loader classes.
 * @author Milos Djermanovic
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("node:assert");
const fs = require("node:fs");
const Module = require("node:module");
const os = require("node:os");
const path = require("node:path");
const vm = require("node:vm");
const sinon = require("sinon");
const { ConfigLoader } = require("../../../lib/config/config-loader");
const { WarningService } = require("../../../lib/services/warning-service");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const fixtureDir = path.resolve(__dirname, "../../fixtures");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ConfigLoader", () => {
	afterEach(() => {
		sinon.restore();
	});

	describe("ConfigLoader class", () => {
		describe("findConfigFileForPath()", () => {
			it("should lookup config file only once for multiple files in same directory", async () => {
				const cwd = path.resolve(fixtureDir, "simple-valid-project-2");

				const locateConfigFileToUse = sinon.spy(
					ConfigLoader,
					"locateConfigFileToUse",
				);

				const configLoader = new ConfigLoader({
					cwd,
					ignoreEnabled: true,
				});

				const [path1, path2] = await Promise.all([
					configLoader.findConfigFileForPath(
						path.resolve(cwd, "foo.js"),
					),
					configLoader.findConfigFileForPath(
						path.resolve(cwd, "bar.js"),
					),
				]);

				const configFile = path.resolve(cwd, "eslint.config.js");

				assert.strictEqual(path1, configFile);
				assert.strictEqual(path2, configFile);

				assert.strictEqual(
					locateConfigFileToUse.callCount,
					1,
					"Expected `ConfigLoader.locateConfigFileToUse` to be called exactly once",
				);
			});
		});

		describe("loadConfigArrayForFile()", () => {
			it("should not error when require.cache is unavailable", async () => {
				const cwd = path.resolve(fixtureDir, "simple-valid-project-2");
				const configLoaderPath = path.resolve(
					__dirname,
					"../../../lib/config/config-loader.js",
				);
				const configLoaderSource = fs.readFileSync(
					configLoaderPath,
					"utf8",
				);
				const module = { exports: {} };
				const requireWithoutCache =
					Module.createRequire(configLoaderPath);

				requireWithoutCache.cache = void 0;

				// Do not warn about usage of experimental `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`.
				const emitStub = sinon.stub(process, "emit");
				emitStub
					.withArgs(
						"warning",
						sinon.match({ name: "ExperimentalWarning" }),
					)
					.returns();
				emitStub.callThrough();

				const compiledWrapper = vm.runInThisContext(
					Module.wrap(configLoaderSource),
					{
						filename: path.join(
							os.tmpdir(),
							"eslint-config-loader-without-require-cache.js",
						),
						importModuleDynamically:
							vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER,
					},
				);

				compiledWrapper.call(
					module.exports,
					module.exports,
					requireWithoutCache,
					module,
					configLoaderPath,
					path.dirname(configLoaderPath),
				);

				const { ConfigLoader: ConfigLoaderWithoutRequireCache } =
					module.exports;

				const configArray =
					await ConfigLoaderWithoutRequireCache.calculateConfigArray(
						path.resolve(cwd, "eslint.config.js"),
						cwd,
						{
							cwd,
							ignoreEnabled: true,
							warningService: new WarningService(),
						},
					);

				assert(
					Array.isArray(configArray),
					"Expected `calculateConfigArray()` to return a config array",
				);
			});

			// https://github.com/eslint/eslint/issues/19025
			it("should lookup config file only once and create config array only once for multiple files in same directory", async () => {
				const cwd = path.resolve(fixtureDir, "simple-valid-project-2");

				const locateConfigFileToUse = sinon.spy(
					ConfigLoader,
					"locateConfigFileToUse",
				);
				const calculateConfigArray = sinon.spy(
					ConfigLoader,
					"calculateConfigArray",
				);

				const configLoader = new ConfigLoader({
					cwd,
					ignoreEnabled: true,
				});

				const [configArray1, configArray2] = await Promise.all([
					configLoader.loadConfigArrayForFile(
						path.resolve(cwd, "foo.js"),
					),
					configLoader.loadConfigArrayForFile(
						path.resolve(cwd, "bar.js"),
					),
				]);

				assert(
					Array.isArray(configArray1),
					"Expected `loadConfigArrayForFile()` to return a config array",
				);
				assert(
					configArray1 === configArray2,
					"Expected config array instances for `foo.js` and `bar.js` to be the same",
				);

				assert.strictEqual(
					locateConfigFileToUse.callCount,
					1,
					"Expected `ConfigLoader.locateConfigFileToUse` to be called exactly once",
				);
				assert.strictEqual(
					calculateConfigArray.callCount,
					1,
					"Expected `ConfigLoader.calculateConfigArray` to be called exactly once",
				);
			});

			it("should not error when loading an empty CommonJS config file", async () => {
				const cwd = path.resolve(fixtureDir, "empty-config-file");

				const warningService = new WarningService();
				warningService.emitEmptyConfigWarning = sinon.spy();
				const configLoader = new ConfigLoader({
					cwd,
					ignoreEnabled: true,
					configFile: "cjs/eslint.config.cjs",
					warningService,
				});

				const configArray = await configLoader.loadConfigArrayForFile(
					path.resolve(cwd, "cjs/foo.js"),
				);

				assert(
					Array.isArray(configArray),
					"Expected `loadConfigArrayForFile()` to return a config array",
				);
				assert(
					warningService.emitEmptyConfigWarning.calledOnce,
					"Expected `warningService.emitEmptyConfigWarning` to be called once",
				);
			});

			it("should not error when loading an empty ESM config file", async () => {
				const cwd = path.resolve(fixtureDir, "empty-config-file");

				const warningService = new WarningService();
				warningService.emitEmptyConfigWarning = sinon.spy();
				const configLoader = new ConfigLoader({
					cwd,
					ignoreEnabled: true,
					configFile: "esm/eslint.config.mjs",
					warningService,
				});

				const configArray = await configLoader.loadConfigArrayForFile(
					path.resolve(cwd, "esm/foo.js"),
				);

				assert(
					Array.isArray(configArray),
					"Expected `loadConfigArrayForFile()` to return a config array",
				);
				assert(
					warningService.emitEmptyConfigWarning.calledOnce,
					"Expected `warningService.emitEmptyConfigWarning` to be called once",
				);
			});

			it("should not error when loading an ESM config file with an empty array", async () => {
				const cwd = path.resolve(fixtureDir, "empty-config-file");

				const warningService = new WarningService();
				warningService.emitEmptyConfigWarning = sinon.spy();
				const configLoader = new ConfigLoader({
					cwd,
					ignoreEnabled: true,
					configFile: "esm/eslint.config.empty-array.mjs",
					warningService,
				});

				const configArray = await configLoader.loadConfigArrayForFile(
					path.resolve(cwd, "mjs/foo.js"),
				);

				assert(
					Array.isArray(configArray),
					"Expected `loadConfigArrayForFile()` to return a config array",
				);
				assert(
					warningService.emitEmptyConfigWarning.calledOnce,
					"Expected `warningService.emitEmptyConfigWarning` to be called once",
				);
			});

			it("should throw an error when loading an ESM config file with null", async () => {
				const cwd = path.resolve(fixtureDir, "empty-config-file");

				const configLoader = new ConfigLoader({
					cwd,
					ignoreEnabled: true,
					configFile: "esm/eslint.config.null.mjs",
				});

				let error;

				try {
					await configLoader.loadConfigArrayForFile(
						path.resolve(cwd, "mjs/foo.js"),
					);
				} catch (err) {
					error = err;
				}

				assert(error);
				assert.strictEqual(
					error.message,
					"Config (unnamed): Unexpected null config at user-defined index 0.",
				);
			});

			it("should throw an error when loading an ESM config with 0", async () => {
				const cwd = path.resolve(fixtureDir, "empty-config-file");

				const configLoader = new ConfigLoader({
					cwd,
					ignoreEnabled: true,
					configFile: "esm/eslint.config.zero.mjs",
				});

				let error;

				try {
					await configLoader.loadConfigArrayForFile(
						path.resolve(cwd, "mjs/foo.js"),
					);
				} catch (err) {
					error = err;
				}

				assert(error);
				assert.strictEqual(
					error.message,
					"Config (unnamed): Unexpected non-object config at user-defined index 0.",
				);
			});
		});

		describe("getCachedConfigArrayForFile()", () => {
			it("should throw an error if calculating the config array is not yet complete", async () => {
				let error;

				const cwd = path.resolve(fixtureDir, "simple-valid-project-2");
				const filePath = path.resolve(cwd, "foo.js");

				const configLoader = new ConfigLoader({
					cwd,
					ignoreEnabled: true,
				});

				const originalCalculateConfigArray =
					ConfigLoader.calculateConfigArray;

				sinon
					.stub(ConfigLoader, "calculateConfigArray")
					.callsFake((...args) => {
						process.nextTick(() => {
							try {
								configLoader.getCachedConfigArrayForFile(
									filePath,
								);
							} catch (e) {
								error = e;
							}
						});

						return originalCalculateConfigArray(...args);
					});

				await configLoader.loadConfigArrayForFile(filePath);

				assert(error, "An error was expected");
				assert.match(error.message, /has not yet been calculated/u);
			});
		});
	});
});
