/**
 * @fileoverview Tests for ConfigFile
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    sinon = require("sinon"),
    path = require("path"),
    yaml = require("js-yaml"),
    espree = require("espree"),
    ConfigFile = require("../../../lib/init/config-file"),
    { CLIEngine } = require("../../../lib/cli-engine");

const proxyquire = require("proxyquire").noCallThru().noPreserveCache();

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Helper function get easily get a path in the fixtures directory.
 * @param {string} filepath The path to find in the fixtures directory.
 * @returns {string} Full path in the fixtures directory.
 * @private
 */
function getFixturePath(filepath) {
    return path.resolve(__dirname, "../../fixtures/config-file", filepath);
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ConfigFile", () => {
    describe("write()", () => {
        let config;

        beforeEach(() => {
            config = {
                env: {
                    browser: true,
                    node: true
                },
                rules: {
                    quotes: 2,
                    semi: 1
                }
            };
        });

        afterEach(() => {
            sinon.verifyAndRestore();
        });

        [
            ["JavaScript", "foo.js", espree.parse],
            ["JSON", "bar.json", JSON.parse],
            ["YAML", "foo.yaml", yaml.safeLoad],
            ["YML", "foo.yml", yaml.safeLoad]
        ].forEach(([fileType, filename, validate]) => {

            it(`should write a file through fs when a ${fileType} path is passed`, () => {
                const fakeFS = {
                    writeFileSync: () => {}
                };

                sinon.mock(fakeFS).expects("writeFileSync").withExactArgs(
                    filename,
                    sinon.match(value => !!validate(value)),
                    "utf8"
                );

                const StubbedConfigFile = proxyquire("../../../lib/init/config-file", {
                    fs: fakeFS
                });

                StubbedConfigFile.write(config, filename);
            });

            it("should include a newline character at EOF", () => {
                const fakeFS = {
                    writeFileSync: () => {}
                };

                sinon.mock(fakeFS).expects("writeFileSync").withExactArgs(
                    filename,
                    sinon.match(value => value.endsWith("\n")),
                    "utf8"
                );

                const StubbedConfigFile = proxyquire("../../../lib/init/config-file", {
                    fs: fakeFS
                });

                StubbedConfigFile.write(config, filename);
            });
        });

        it("should make sure js config files match linting rules", () => {
            const fakeFS = {
                writeFileSync: () => {}
            };

            const singleQuoteConfig = {
                rules: {
                    quotes: [2, "single"]
                }
            };

            sinon.mock(fakeFS).expects("writeFileSync").withExactArgs(
                "test-config.js",
                sinon.match(value => !value.includes("\"")),
                "utf8"
            );

            const StubbedConfigFile = proxyquire("../../../lib/init/config-file", {
                fs: fakeFS
            });

            StubbedConfigFile.write(singleQuoteConfig, "test-config.js");
        });

        it("should still write a js config file even if linting fails", () => {
            const fakeFS = {
                writeFileSync: () => {}
            };
            const fakeCLIEngine = sinon.mock().withExactArgs(sinon.match({
                baseConfig: config,
                fix: true,
                useEslintrc: false
            }));

            Object.defineProperties(fakeCLIEngine.prototype, Object.getOwnPropertyDescriptors(CLIEngine.prototype));
            sinon.stub(fakeCLIEngine.prototype, "executeOnText").throws();

            sinon.mock(fakeFS).expects("writeFileSync").once();

            const StubbedConfigFile = proxyquire("../../../lib/init/config-file", {
                fs: fakeFS,
                "../cli-engine": { CLIEngine: fakeCLIEngine }
            });

            assert.throws(() => {
                StubbedConfigFile.write(config, "test-config.js");
            });
        });

        it("should throw error if file extension is not valid", () => {
            assert.throws(() => {
                ConfigFile.write({}, getFixturePath("yaml/.eslintrc.class"));
            }, /write to unknown file type/u);
        });
    });
});
