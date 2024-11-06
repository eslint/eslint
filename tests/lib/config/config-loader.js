/**
 * @fileoverview Tests for config loader classes.
 * @author Milos Djermanovic
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("node:assert");
const path = require("node:path");
const sinon = require("sinon");
const { ConfigLoader, LegacyConfigLoader } = require("../../../lib/config/config-loader");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const fixtureDir = path.resolve(__dirname, "../../fixtures");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("Config loaders", () => {
    afterEach(() => {
        sinon.restore();
    });

    [ConfigLoader, LegacyConfigLoader].forEach(ConfigLoaderClass => {
        describe(`${ConfigLoaderClass.name} class`, () => {

            describe("findConfigFileForPath()", () => {

                it("should lookup config file only once for multiple files in same directory", async () => {
                    const cwd = path.resolve(fixtureDir, "simple-valid-project-2");

                    const locateConfigFileToUse = sinon.spy(ConfigLoader, "locateConfigFileToUse");

                    const configLoader = new ConfigLoaderClass({
                        cwd,
                        ignoreEnabled: true
                    });

                    const [path1, path2] = await Promise.all([
                        configLoader.findConfigFileForPath(path.resolve(cwd, "foo.js")),
                        configLoader.findConfigFileForPath(path.resolve(cwd, "bar.js"))
                    ]);

                    const configFile = path.resolve(cwd, "eslint.config.js");

                    assert.strictEqual(path1, configFile);
                    assert.strictEqual(path2, configFile);

                    assert.strictEqual(locateConfigFileToUse.callCount, 1, "Expected `ConfigLoader.locateConfigFileToUse` to be called exactly once");
                });
            });

            describe("loadConfigArrayForFile()", () => {

                // https://github.com/eslint/eslint/issues/19025
                it("should lookup config file only once and create config array only once for multiple files in same directory", async () => {
                    const cwd = path.resolve(fixtureDir, "simple-valid-project-2");

                    const locateConfigFileToUse = sinon.spy(ConfigLoader, "locateConfigFileToUse");
                    const calculateConfigArray = sinon.spy(ConfigLoader, "calculateConfigArray");

                    const configLoader = new ConfigLoaderClass({
                        cwd,
                        ignoreEnabled: true
                    });

                    const [configArray1, configArray2] = await Promise.all([
                        configLoader.loadConfigArrayForFile(path.resolve(cwd, "foo.js")),
                        configLoader.loadConfigArrayForFile(path.resolve(cwd, "bar.js"))
                    ]);

                    assert(Array.isArray(configArray1), "Expected `loadConfigArrayForFile()` to return a config array");
                    assert(configArray1 === configArray2, "Expected config array instances for `foo.js` and `bar.js` to be the same");

                    assert.strictEqual(locateConfigFileToUse.callCount, 1, "Expected `ConfigLoader.locateConfigFileToUse` to be called exactly once");
                    assert.strictEqual(calculateConfigArray.callCount, 1, "Expected `ConfigLoader.calculateConfigArray` to be called exactly once");
                });
            });

            describe("getCachedConfigArrayForFile()", () => {

                it("should throw an error if calculating the config array is not yet complete", async () => {
                    let error;

                    const cwd = path.resolve(fixtureDir, "simple-valid-project-2");
                    const filePath = path.resolve(cwd, "foo.js");

                    const configLoader = new ConfigLoaderClass({
                        cwd,
                        ignoreEnabled: true
                    });

                    const originalCalculateConfigArray = ConfigLoader.calculateConfigArray;

                    sinon.stub(ConfigLoader, "calculateConfigArray").callsFake((...args) => {
                        process.nextTick(() => {
                            try {
                                configLoader.getCachedConfigArrayForFile(filePath);
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
});
