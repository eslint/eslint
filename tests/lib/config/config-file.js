/**
 * @fileoverview Tests for ConfigFile
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    leche = require("leche"),
    sinon = require("sinon"),
    path = require("path"),
    fs = require("fs"),
    yaml = require("js-yaml"),
    shell = require("shelljs"),
    espree = require("espree"),
    ConfigFile = require("../../../lib/config/config-file"),
    Linter = require("../../../lib/linter"),
    CLIEngine = require("../../../lib/cli-engine"),
    Config = require("../../../lib/config"),
    relativeModuleResolver = require("../../../lib/util/relative-module-resolver");

const temp = require("temp").track();
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

/**
 * Helper function to write configs to temp file.
 * @param {Object} config Config to write out to temp file.
 * @param {string} filename Name of file to write in temp dir.
 * @param {string} existingTmpDir Optional dir path if temp file exists.
 * @returns {string} Full path to the temp file.
 * @private
 */
function writeTempConfigFile(config, filename, existingTmpDir) {
    const tmpFileDir = existingTmpDir || temp.mkdirSync("eslint-tests-"),
        tmpFilePath = path.join(tmpFileDir, filename),
        tmpFileContents = JSON.stringify(config);

    fs.writeFileSync(tmpFilePath, tmpFileContents);
    return tmpFilePath;
}

/**
 * Helper function to write JS configs to temp file.
 * @param {Object} config Config to write out to temp file.
 * @param {string} filename Name of file to write in temp dir.
 * @param {string} existingTmpDir Optional dir path if temp file exists.
 * @returns {string} Full path to the temp file.
 * @private
 */
function writeTempJsConfigFile(config, filename, existingTmpDir) {
    const tmpFileDir = existingTmpDir || temp.mkdirSync("eslint-tests-"),
        tmpFilePath = path.join(tmpFileDir, filename),
        tmpFileContents = `module.exports = ${JSON.stringify(config)}`;

    fs.writeFileSync(tmpFilePath, tmpFileContents);
    return tmpFilePath;
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ConfigFile", () => {
    let configContext;

    beforeEach(() => {
        configContext = new Config({ cwd: getFixturePath(".") }, new Linter());
    });

    describe("CONFIG_FILES", () => {
        it("should be present when imported", () => {
            assert.isTrue(Array.isArray(ConfigFile.CONFIG_FILES));
        });
    });

    describe("applyExtends()", () => {
        it("should apply extension 'foo' when specified from root directory config", () => {
            const config = ConfigFile.applyExtends({
                extends: "enable-browser-env",
                rules: { eqeqeq: 2 }
            }, configContext, getFixturePath(".eslintrc"));

            assert.deepStrictEqual(config, {
                parserOptions: {},
                env: { browser: true },
                globals: {},
                rules: { eqeqeq: 2 }
            });
        });

        it("should apply all rules when extends config includes 'eslint:all'", () => {
            const config = ConfigFile.applyExtends({
                extends: "eslint:all"
            }, configContext, "/whatever");

            assert.strictEqual(config.rules.eqeqeq, "error");
            assert.strictEqual(config.rules.curly, "error");

        });

        it("should throw an error when extends config module is not found", () => {
            assert.throws(() => {
                ConfigFile.applyExtends({
                    extends: "foo",
                    rules: { eqeqeq: 2 }
                }, configContext, "/whatever");
            }, /Cannot find module 'eslint-config-foo'/u);

        });

        it("should throw an error when an eslint config is not found", () => {
            assert.throws(() => {
                ConfigFile.applyExtends({
                    extends: "eslint:foo",
                    rules: { eqeqeq: 2 }
                }, configContext, "/whatever");
            }, /Failed to load config "eslint:foo" to extend from./u);

        });

        it("should throw an error when a parser in a plugin config is not found", () => {
            assert.throws(() => {
                ConfigFile.applyExtends({
                    extends: "plugin:enable-nonexistent-parser/bar",
                    rules: { eqeqeq: 2 }
                }, configContext, "/whatever");
            }, /Failed to resolve parser 'nonexistent-parser' declared in '[-\w/.:\\]+'.\nReferenced from: \/whatever/u);
        });

        it("should fall back to default parser when a parser called 'espree' is not found", () => {
            assert.deepStrictEqual(
                ConfigFile.loadObject(configContext, { config: { parser: "espree" }, filePath: "/", configFullName: "configName" }),
                { parser: require.resolve("espree") }
            );
        });

        it("should throw an error when a plugin config is not found", () => {
            assert.throws(() => {
                ConfigFile.applyExtends({
                    extends: "plugin:enable-nonexistent-parser/baz",
                    rules: { eqeqeq: 2 }
                }, configContext, "/whatever");
            }, /Failed to load config "plugin:enable-nonexistent-parser\/baz" to extend from./u);
        });

        it("should throw an error with a message template when a plugin referenced for a plugin config is not found", () => {
            try {
                ConfigFile.applyExtends({
                    extends: "plugin:nonexistent-plugin/baz",
                    rules: { eqeqeq: 2 }
                }, configContext, "/whatever");
            } catch (err) {
                assert.strictEqual(err.messageTemplate, "plugin-missing");
                assert.deepStrictEqual(err.messageData, {
                    pluginName: "eslint-plugin-nonexistent-plugin",
                    pluginRootPath: getFixturePath("."),
                    configStack: ["/whatever"]
                });

                return;
            }
            assert.fail("Expected to throw an error");
        });

        it("should throw an error with a message template when a plugin in the plugins list is not found", () => {
            try {
                ConfigFile.loadObject(configContext, {
                    config: {
                        plugins: ["nonexistent-plugin"]
                    },
                    filePath: "/whatever",
                    configFullName: "configName"
                });
            } catch (err) {
                assert.strictEqual(err.messageTemplate, "plugin-missing");
                assert.deepStrictEqual(err.messageData, {
                    pluginName: "eslint-plugin-nonexistent-plugin",
                    pluginRootPath: getFixturePath("."),
                    configStack: ["/whatever"]
                });

                return;
            }
            assert.fail("Expected to throw an error");
        });

        it("should apply extensions recursively when specified from package", () => {
            const config = ConfigFile.applyExtends({
                extends: "recursive-dependent",
                rules: { eqeqeq: 2 }
            }, configContext, getFixturePath(".eslintrc.js"));

            assert.deepStrictEqual(config, {
                parserOptions: {},
                env: { browser: true },
                globals: {},
                rules: {
                    eqeqeq: 2,
                    bar: 2
                }
            });

        });

        it("should apply extensions when specified from a JavaScript file", () => {

            const extendsFile = ".eslintrc.js";
            const filePath = getFixturePath("js/foo.js");

            const config = ConfigFile.applyExtends({
                extends: extendsFile,
                rules: { eqeqeq: 2 }
            }, configContext, filePath);

            assert.deepStrictEqual(config, {
                parserOptions: {},
                env: {},
                globals: {},
                rules: {
                    semi: [2, "always"],
                    eqeqeq: 2
                }
            });

        });

        it("should apply extensions when specified from a YAML file", () => {

            const extendsFile = ".eslintrc.yaml";
            const filePath = getFixturePath("yaml/foo.js");

            const config = ConfigFile.applyExtends({
                extends: extendsFile,
                rules: { eqeqeq: 2 }
            }, configContext, filePath);

            assert.deepStrictEqual(config, {
                parserOptions: {},
                env: { browser: true },
                globals: {},
                rules: {
                    eqeqeq: 2
                }
            });

        });

        it("should apply extensions when specified from a JSON file", () => {

            const extendsFile = ".eslintrc.json";
            const filePath = getFixturePath("json/foo.js");

            const config = ConfigFile.applyExtends({
                extends: extendsFile,
                rules: { eqeqeq: 2 }
            }, configContext, filePath);

            assert.deepStrictEqual(config, {
                parserOptions: {},
                env: {},
                globals: {},
                rules: {
                    eqeqeq: 2,
                    quotes: [2, "double"]
                }
            });

        });

        it("should apply extensions when specified from a package.json file in a sibling directory", () => {

            const extendsFile = "../package-json/package.json";
            const filePath = getFixturePath("json/foo.js");

            const config = ConfigFile.applyExtends({
                extends: extendsFile,
                rules: { eqeqeq: 2 }
            }, configContext, filePath);

            assert.deepStrictEqual(config, {
                parserOptions: {},
                env: { es6: true },
                globals: {},
                rules: {
                    eqeqeq: 2
                }
            });

        });

    });

    describe("load()", () => {

        it("should throw error if file doesnt exist", () => {
            assert.throws(() => {
                ConfigFile.load(getFixturePath("legacy/nofile.js"), configContext);
            });

            assert.throws(() => {
                ConfigFile.load(getFixturePath("legacy/package.json"), configContext);
            });
        });

        it("should load information from a legacy file", () => {
            const configFilePath = getFixturePath("legacy/.eslintrc");
            const config = ConfigFile.load(configFilePath, configContext, getFixturePath("__placeholder__.js"));

            assert.deepStrictEqual(config, {
                parserOptions: {},
                env: {},
                globals: {},
                rules: {
                    eqeqeq: 2
                }
            });
        });

        it("should load information from a JavaScript file", () => {
            const configFilePath = getFixturePath("js/.eslintrc.js");
            const config = ConfigFile.load(configFilePath, configContext, getFixturePath("__placeholder__.js"));

            assert.deepStrictEqual(config, {
                parserOptions: {},
                env: {},
                globals: {},
                rules: {
                    semi: [2, "always"]
                }
            });
        });

        it("should throw error when loading invalid JavaScript file", () => {
            assert.throws(() => {
                ConfigFile.load(getFixturePath("js/.eslintrc.broken.js"), configContext, getFixturePath("__placeholder__.js"));
            }, /Cannot read config file/u);
        });

        it("should interpret parser module name when present in a JavaScript file", () => {
            const configFilePath = getFixturePath("js/.eslintrc.parser.js");
            const config = ConfigFile.load(configFilePath, configContext, getFixturePath("__placeholder__.js"));

            assert.deepStrictEqual(config, {
                parser: path.resolve(getFixturePath("js/node_modules/foo/index.js")),
                parserOptions: {},
                env: {},
                globals: {},
                rules: {
                    semi: [2, "always"]
                }
            });
        });

        it("should interpret parser path when present in a JavaScript file", () => {
            const configFilePath = getFixturePath("js/.eslintrc.parser2.js");
            const config = ConfigFile.load(configFilePath, configContext, getFixturePath("__placeholder__.js"));

            assert.deepStrictEqual(config, {
                parser: path.resolve(getFixturePath("js/not-a-config.js")),
                parserOptions: {},
                env: {},
                globals: {},
                rules: {
                    semi: [2, "always"]
                }
            });
        });

        it("should interpret parser module name or path when parser is set to default parser in a JavaScript file", () => {
            const configFilePath = getFixturePath("js/.eslintrc.parser3.js");
            const config = ConfigFile.load(configFilePath, configContext, getFixturePath("__placeholder__.js"));

            assert.deepStrictEqual(config, {
                parser: require.resolve("espree"),
                parserOptions: {},
                env: {},
                globals: {},
                rules: {
                    semi: [2, "always"]
                }
            });
        });

        it("should load information from a JSON file", () => {
            const configFilePath = getFixturePath("json/.eslintrc.json");
            const config = ConfigFile.load(configFilePath, configContext, getFixturePath("__placeholder__.js"));

            assert.deepStrictEqual(config, {
                parserOptions: {},
                env: {},
                globals: {},
                rules: {
                    quotes: [2, "double"]
                }
            });
        });

        it("should load fresh information from a JSON file", () => {
            const initialConfig = {
                    parserOptions: {},
                    env: {},
                    globals: {},
                    rules: {
                        quotes: [2, "double"]
                    }
                },
                updatedConfig = {
                    parserOptions: {},
                    env: {},
                    globals: {},
                    rules: {
                        quotes: 0
                    }
                },
                tmpFilename = "fresh-test.json",
                tmpFilePath = writeTempConfigFile(initialConfig, tmpFilename);
            let config = ConfigFile.load(tmpFilePath, configContext, getFixturePath("__placeholder__.js"));

            assert.deepStrictEqual(config, initialConfig);
            writeTempConfigFile(updatedConfig, tmpFilename, path.dirname(tmpFilePath));
            configContext = new Config({ cwd: getFixturePath(".") }, new Linter());
            config = ConfigFile.load(tmpFilePath, configContext, getFixturePath("__placeholder__.js"));
            assert.deepStrictEqual(config, updatedConfig);
        });

        it("should load information from a package.json file", () => {
            const configFilePath = getFixturePath("package-json/package.json");
            const config = ConfigFile.load(configFilePath, configContext, getFixturePath("__placeholder__.js"));

            assert.deepStrictEqual(config, {
                parserOptions: {},
                env: { es6: true },
                globals: {},
                rules: {}
            });
        });

        it("should throw error when loading invalid package.json file", () => {
            assert.throws(() => {
                try {
                    ConfigFile.load(getFixturePath("broken-package-json/package.json"), configContext, getFixturePath("__placeholder__.js"));
                } catch (error) {
                    assert.strictEqual(error.messageTemplate, "failed-to-read-json");
                    throw error;
                }
            }, /Cannot read config file/u);
        });

        it("should load fresh information from a package.json file", () => {
            const initialConfig = {
                    eslintConfig: {
                        parserOptions: {},
                        env: {},
                        globals: {},
                        rules: {
                            quotes: [2, "double"]
                        }
                    }
                },
                updatedConfig = {
                    eslintConfig: {
                        parserOptions: {},
                        env: {},
                        globals: {},
                        rules: {
                            quotes: 0
                        }
                    }
                },
                tmpFilename = "package.json",
                tmpFilePath = writeTempConfigFile(initialConfig, tmpFilename);
            let config = ConfigFile.load(tmpFilePath, configContext, getFixturePath("__placeholder__.js"));

            assert.deepStrictEqual(config, initialConfig.eslintConfig);
            writeTempConfigFile(updatedConfig, tmpFilename, path.dirname(tmpFilePath));
            configContext = new Config({ cwd: getFixturePath(".") }, new Linter());
            config = ConfigFile.load(tmpFilePath, configContext, getFixturePath("__placeholder__.js"));
            assert.deepStrictEqual(config, updatedConfig.eslintConfig);
        });

        it("should load fresh information from a .eslintrc.js file", () => {
            const initialConfig = {
                    parserOptions: {},
                    env: {},
                    globals: {},
                    rules: {
                        quotes: [2, "double"]
                    }
                },
                updatedConfig = {
                    parserOptions: {},
                    env: {},
                    globals: {},
                    rules: {
                        quotes: 0
                    }
                },
                tmpFilename = ".eslintrc.js",
                tmpFilePath = writeTempJsConfigFile(initialConfig, tmpFilename);
            let config = ConfigFile.load(tmpFilePath, configContext, getFixturePath("__placeholder__.js"));

            assert.deepStrictEqual(config, initialConfig);
            writeTempJsConfigFile(updatedConfig, tmpFilename, path.dirname(tmpFilePath));
            configContext = new Config({ cwd: getFixturePath(".") }, new Linter());
            config = ConfigFile.load(tmpFilePath, configContext, getFixturePath("__placeholder__.js"));
            assert.deepStrictEqual(config, updatedConfig);
        });

        it("should load information from a YAML file", () => {
            const configFilePath = getFixturePath("yaml/.eslintrc.yaml");
            const config = ConfigFile.load(configFilePath, configContext, getFixturePath("__placeholder__.js"));

            assert.deepStrictEqual(config, {
                parserOptions: {},
                env: { browser: true },
                globals: {},
                rules: {}
            });
        });

        it("should load information from an empty YAML file", () => {
            const configFilePath = getFixturePath("yaml/.eslintrc.empty.yaml");
            const config = ConfigFile.load(configFilePath, configContext, getFixturePath("__placeholder__.js"));

            assert.deepStrictEqual(config, {
                parserOptions: {},
                env: {},
                globals: {},
                rules: {}
            });
        });

        it("should load information from a YML file", () => {
            const configFilePath = getFixturePath("yml/.eslintrc.yml");
            const config = ConfigFile.load(configFilePath, configContext, getFixturePath("__placeholder__.js"));

            assert.deepStrictEqual(config, {
                parserOptions: {},
                env: { node: true },
                globals: {},
                rules: {}
            });
        });

        it("should load information from a YML file and apply extensions", () => {
            const configFilePath = getFixturePath("extends/.eslintrc.yml");
            const config = ConfigFile.load(configFilePath, configContext, getFixturePath("__placeholder__.js"));

            assert.deepStrictEqual(config, {
                env: { es6: true },
                globals: {},
                parserOptions: {},
                rules: { booya: 2 }
            });
        });

        it("should load information from `extends` chain.", () => {
            const configFilePath = getFixturePath("extends-chain/.eslintrc.json");
            const config = ConfigFile.load(configFilePath, configContext, getFixturePath("__placeholder__.js"));

            assert.deepStrictEqual(config, {
                env: {},
                globals: {},
                parserOptions: {},
                rules: {
                    a: 2, // from node_modules/eslint-config-a
                    b: 2, // from node_modules/eslint-config-a/node_modules/eslint-config-b
                    c: 2 // from node_modules/eslint-config-a/node_modules/eslint-config-b/node_modules/eslint-config-c
                }
            });
        });

        it("should load information from `extends` chain with relative path.", () => {
            const configFilePath = getFixturePath("extends-chain-2/.eslintrc.json");
            const config = ConfigFile.load(configFilePath, configContext, getFixturePath("__placeholder__.js"));

            assert.deepStrictEqual(config, {
                env: {},
                globals: {},
                parserOptions: {},
                rules: {
                    a: 2, // from node_modules/eslint-config-a/index.js
                    relative: 2 // from node_modules/eslint-config-a/relative.js
                }
            });
        });

        it("should load information from `extends` chain in .eslintrc with relative path.", () => {
            const configFilePath = getFixturePath("extends-chain-2/relative.eslintrc.json");
            const config = ConfigFile.load(configFilePath, configContext, getFixturePath("__placeholder__.js"));

            assert.deepStrictEqual(config, {
                env: {},
                globals: {},
                parserOptions: {},
                rules: {
                    a: 2, // from node_modules/eslint-config-a/index.js
                    relative: 2 // from node_modules/eslint-config-a/relative.js
                }
            });
        });

        it("should load information from `parser` in .eslintrc with relative path.", () => {
            const configFilePath = getFixturePath("extends-chain-2/parser.eslintrc.json");
            const config = ConfigFile.load(configFilePath, configContext, getFixturePath("__placeholder__.js"));
            const parserPath = getFixturePath("extends-chain-2/parser.js");

            assert.deepStrictEqual(config, {
                env: {},
                globals: {},
                parser: parserPath,
                parserOptions: {},
                rules: {}
            });
        });

        describe("even if it's in another directory,", () => {
            let fixturePath = "";

            before(() => {
                const tempDir = temp.mkdirSync("eslint-test-chain");
                const chain2 = getFixturePath("extends-chain-2");

                fixturePath = path.join(tempDir, "extends-chain-2");
                shell.cp("-r", chain2, fixturePath);
            });

            after(() => {
                temp.cleanupSync();
            });

            it("should load information from `extends` chain in .eslintrc with relative path.", () => {
                const configFilePath = path.join(fixturePath, "relative.eslintrc.json");
                const config = ConfigFile.load(configFilePath, configContext, getFixturePath("__placeholder__.js"));

                assert.deepStrictEqual(config, {
                    env: {},
                    globals: {},
                    parserOptions: {},
                    rules: {
                        a: 2, // from node_modules/eslint-config-a/index.js
                        relative: 2 // from node_modules/eslint-config-a/relative.js
                    }
                });
            });

            it("should load information from `parser` in .eslintrc with relative path.", () => {
                const configFilePath = path.join(fixturePath, "parser.eslintrc.json");
                const config = ConfigFile.load(configFilePath, configContext, getFixturePath("__placeholder__.js"));
                const parserPath = fs.realpathSync(path.join(fixturePath, "parser.js"));

                assert.deepStrictEqual(config, {
                    env: {},
                    globals: {},
                    parser: parserPath,
                    parserOptions: {},
                    rules: {}
                });
            });
        });

        describe("Plugins", () => {
            it("should load information from a YML file and load plugins", () => {
                const configFilePath = getFixturePath("plugins/.eslintrc.yml");
                const config = ConfigFile.load(configFilePath, configContext, getFixturePath("__placeholder__.js"));

                assert.deepStrictEqual(config, {
                    parserOptions: {},
                    env: { "with-environment/bar": true },
                    globals: {},
                    plugins: ["with-environment"],
                    rules: {
                        "with-environment/foo": 2
                    }
                });
            });

            it("should load two separate configs from a plugin", () => {
                const configFilePath = getFixturePath("plugins/.eslintrc2.yml");
                const config = ConfigFile.load(configFilePath, configContext, getFixturePath("__placeholder__.js"));

                assert.deepStrictEqual(config, {
                    parserOptions: {},
                    globals: {},
                    env: {},
                    rules: {
                        semi: 2,
                        quotes: 2,
                        yoda: 2
                    }
                });
            });
        });

        describe("even if config files have Unicode BOM,", () => {
            it("should read the JSON config file correctly.", () => {
                const configFilePath = getFixturePath("bom/.eslintrc.json");
                const config = ConfigFile.load(configFilePath, configContext, getFixturePath("__placeholder__.js"));

                assert.deepStrictEqual(config, {
                    env: {},
                    globals: {},
                    parserOptions: {},
                    rules: {
                        semi: "error"
                    }
                });
            });

            it("should read the YAML config file correctly.", () => {
                const configFilePath = getFixturePath("bom/.eslintrc.yaml");
                const config = ConfigFile.load(configFilePath, configContext, getFixturePath("__placeholder__.js"));

                assert.deepStrictEqual(config, {
                    env: {},
                    globals: {},
                    parserOptions: {},
                    rules: {
                        semi: "error"
                    }
                });
            });

            it("should read the config in package.json correctly.", () => {
                const configFilePath = getFixturePath("bom/package.json");
                const config = ConfigFile.load(configFilePath, configContext, getFixturePath("__placeholder__.js"));

                assert.deepStrictEqual(config, {
                    env: {},
                    globals: {},
                    parserOptions: {},
                    rules: {
                        semi: "error"
                    }
                });
            });
        });

        it("throws an error including the config file name if the config file is invalid", () => {
            const configFilePath = getFixturePath("invalid/invalid-top-level-property.yml");

            try {
                ConfigFile.load(configFilePath, configContext, getFixturePath("__placeholder__.js"));
            } catch (err) {
                assert.include(err.message, `ESLint configuration in ${configFilePath} is invalid`);
                return;
            }
            assert.fail();
        });
    });

    describe("resolve() relative to config file", () => {
        leche.withData([
            [".eslintrc", getFixturePath("subdir/.eslintrc")],
            ["eslint-config-foo", relativeModuleResolver("eslint-config-foo", getFixturePath("subdir/__placeholder__.js"))],
            ["foo", relativeModuleResolver("eslint-config-foo", getFixturePath("subdir/__placeholder__.js"))],
            ["eslint-configfoo", relativeModuleResolver("eslint-config-eslint-configfoo", getFixturePath("subdir/__placeholder__.js"))],
            ["@foo/eslint-config", relativeModuleResolver("@foo/eslint-config", getFixturePath("subdir/__placeholder__.js"))],
            ["@foo/bar", relativeModuleResolver("@foo/eslint-config-bar", getFixturePath("subdir/__placeholder__.js"))],
            ["plugin:foo/bar", relativeModuleResolver("eslint-plugin-foo", getFixturePath("__placeholder__.js"))]
        ], (input, expected) => {
            it(`should return ${expected} when passed ${input}`, () => {
                const result = ConfigFile.resolve(input, getFixturePath("subdir/__placeholder__.js"), getFixturePath("."));

                assert.strictEqual(result.filePath, expected);
            });
        });
    });

    describe("getFilenameFromDirectory()", () => {

        leche.withData([
            [getFixturePath("legacy"), ".eslintrc"],
            [getFixturePath("yaml"), ".eslintrc.yaml"],
            [getFixturePath("yml"), ".eslintrc.yml"],
            [getFixturePath("json"), ".eslintrc.json"],
            [getFixturePath("js"), ".eslintrc.js"]
        ], (input, expected) => {
            it(`should return ${expected} when passed ${input}`, () => {
                const result = ConfigFile.getFilenameForDirectory(input);

                assert.strictEqual(result, path.resolve(input, expected));
            });
        });

    });

    describe("write()", () => {

        let sandbox,
            config;

        beforeEach(() => {
            sandbox = sinon.sandbox.create();
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
            sandbox.verifyAndRestore();
        });

        leche.withData([
            ["JavaScript", "foo.js", espree.parse],
            ["JSON", "bar.json", JSON.parse],
            ["YAML", "foo.yaml", yaml.safeLoad],
            ["YML", "foo.yml", yaml.safeLoad]
        ], (fileType, filename, validate) => {

            it(`should write a file through fs when a ${fileType} path is passed`, () => {
                const fakeFS = leche.fake(fs);

                sandbox.mock(fakeFS).expects("writeFileSync").withExactArgs(
                    filename,
                    sinon.match(value => !!validate(value)),
                    "utf8"
                );

                const StubbedConfigFile = proxyquire("../../../lib/config/config-file", {
                    fs: fakeFS
                });

                StubbedConfigFile.write(config, filename);
            });

        });

        it("should make sure js config files match linting rules", () => {
            const fakeFS = leche.fake(fs);

            const singleQuoteConfig = {
                rules: {
                    quotes: [2, "single"]
                }
            };

            sandbox.mock(fakeFS).expects("writeFileSync").withExactArgs(
                "test-config.js",
                sinon.match(value => !value.includes("\"")),
                "utf8"
            );

            const StubbedConfigFile = proxyquire("../../../lib/config/config-file", {
                fs: fakeFS
            });

            StubbedConfigFile.write(singleQuoteConfig, "test-config.js");
        });

        it("should still write a js config file even if linting fails", () => {
            const fakeFS = leche.fake(fs);
            const fakeCLIEngine = sandbox.mock().withExactArgs(sinon.match({
                baseConfig: config,
                fix: true,
                useEslintrc: false
            }));

            fakeCLIEngine.prototype = leche.fake(CLIEngine.prototype);
            sandbox.stub(fakeCLIEngine.prototype, "executeOnText").throws();

            sandbox.mock(fakeFS).expects("writeFileSync").once();

            const StubbedConfigFile = proxyquire("../../../lib/config/config-file", {
                fs: fakeFS,
                "../cli-engine": fakeCLIEngine
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
