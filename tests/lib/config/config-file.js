/**
 * @fileoverview Tests for ConfigFile
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const Module = require("module"),
    assert = require("chai").assert,
    leche = require("leche"),
    sinon = require("sinon"),
    path = require("path"),
    fs = require("fs"),
    os = require("os"),
    yaml = require("js-yaml"),
    shell = require("shelljs"),
    espree = require("espree"),
    ConfigFile = require("../../../lib/config/config-file"),
    Linter = require("../../../lib/linter"),
    CLIEngine = require("../../../lib/cli-engine"),
    Config = require("../../../lib/config");

const userHome = os.homedir();
const temp = require("temp").track();
const proxyquire = require("proxyquire").noCallThru().noPreserveCache();
let configContext;

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/*
 * Project path is the project that is including ESLint as a dependency. In the
 * case of these tests, it will end up the parent of the "eslint" folder. That's
 * fine for the purposes of testing because the tests are just relative to an
 * ancestor location.
 */
const PROJECT_PATH = path.resolve(__dirname, "../../../../"),
    PROJECT_DEPS_PATH = path.join(PROJECT_PATH, "node_modules");

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

/**
 * Creates a module path relative to the current working directory.
 * @param {string} moduleName The full module name.
 * @returns {string} A full path for the module local to cwd.
 * @private
 */
function getProjectModulePath(moduleName) {
    return path.resolve(PROJECT_PATH, "./node_modules", moduleName, "index.js");
}

/**
 * Creates a module path relative to the given directory.
 * @param {string} moduleName The full module name.
 * @returns {string} A full path for the module local to the given directory.
 * @private
 */
function getRelativeModulePath(moduleName) {
    return path.resolve("./node_modules", moduleName, "index.js");
}

/**
 * Creates a module resolver that always resolves the given mappings.
 * @param {Object<string,string>} mapping A mapping of module name to path.
 * @constructor
 * @private
 */
function createStubModuleResolver(mapping) {

    /**
     * Stubbed module resolver for easier testing.
     * @constructor
     * @private
     */
    return class StubModuleResolver {
        resolve(name) { // eslint-disable-line class-methods-use-this
            if (Object.prototype.hasOwnProperty.call(mapping, name)) {
                return mapping[name];
            }

            throw new Error(`Cannot find module '${name}'`);
        }
    };
}

/**
 * Overrides the native module resolver to resolve with the given mappings.
 * @param {Object<string,string>} mapping A mapping of module name to path.
 * @returns {void}
 * @private
 */
function overrideNativeResolve(mapping) {
    let originalFindPath;

    beforeEach(() => {
        originalFindPath = Module._findPath; // eslint-disable-line no-underscore-dangle
        Module._findPath = function(request, paths, isMain) { // eslint-disable-line no-underscore-dangle
            if (Object.prototype.hasOwnProperty.call(mapping, request)) {
                return mapping[request];
            }
            return originalFindPath.call(this, request, paths, isMain);
        };
    });
    afterEach(() => {
        Module._findPath = originalFindPath; // eslint-disable-line no-underscore-dangle
    });
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ConfigFile", () => {

    beforeEach(() => {
        configContext = new Config({}, new Linter());
    });

    describe("CONFIG_FILES", () => {
        it("should be present when imported", () => {
            assert.isTrue(Array.isArray(ConfigFile.CONFIG_FILES));
        });
    });

    describe("applyExtends()", () => {

        overrideNativeResolve({
            "eslint-plugin-test": getProjectModulePath("eslint-plugin-test")
        });

        it("should apply extension 'foo' when specified from root directory config", () => {

            const resolvedPath = path.resolve(PROJECT_PATH, "./node_modules/eslint-config-foo/index.js");

            const configDeps = {

                // Hacky: need to override isFile for each call for testing
                "../util/module-resolver": createStubModuleResolver({ "eslint-config-foo": resolvedPath }),
                "import-fresh"(filename) {
                    return configDeps[filename];
                }
            };

            configDeps[resolvedPath] = {
                env: { browser: true }
            };

            const StubbedConfigFile = proxyquire("../../../lib/config/config-file", configDeps);

            const config = StubbedConfigFile.applyExtends({
                extends: "foo",
                rules: { eqeqeq: 2 }
            }, configContext, "/whatever");

            assert.deepStrictEqual(config, {
                baseDirectory: path.dirname(resolvedPath),
                filePath: resolvedPath,
                extends: "foo",
                parserOptions: {},
                env: { browser: true },
                globals: {},
                rules: { eqeqeq: 2 }
            });

        });

        it("should apply all rules when extends config includes 'eslint:all'", () => {

            const configDeps = {
                "../util/module-resolver": createStubModuleResolver({})
            };
            const StubbedConfigFile = proxyquire("../../../lib/config/config-file", configDeps);
            const config = StubbedConfigFile.applyExtends({
                extends: "eslint:all"
            }, configContext, "/whatever");

            assert.strictEqual(config.rules.eqeqeq, "error");
            assert.strictEqual(config.rules.curly, "error");

        });

        it("should throw an error when extends config module is not found", () => {

            const configDeps = {
                "../util/module-resolver": createStubModuleResolver({})
            };

            const StubbedConfigFile = proxyquire("../../../lib/config/config-file", configDeps);

            assert.throws(() => {
                StubbedConfigFile.applyExtends({
                    extends: "foo",
                    rules: { eqeqeq: 2 }
                }, configContext, "/whatever");
            }, /Cannot find module 'eslint-config-foo'/u);

        });

        it("should throw an error when an eslint config is not found", () => {

            const configDeps = {
                "../util/module-resolver": createStubModuleResolver({})
            };

            const StubbedConfigFile = proxyquire("../../../lib/config/config-file", configDeps);

            assert.throws(() => {
                StubbedConfigFile.applyExtends({
                    extends: "eslint:foo",
                    rules: { eqeqeq: 2 }
                }, configContext, "/whatever");
            }, /Failed to load config "eslint:foo" to extend from./u);

        });

        it("should throw an error when a parser in a plugin config is not found", () => {
            const resolvedPath = path.resolve(PROJECT_PATH, "./node_modules/eslint-plugin-test/index.js");

            const configDeps = {
                "../util/module-resolver": createStubModuleResolver({
                    "eslint-plugin-test": resolvedPath
                }),
                "import-fresh"(filename) {
                    return configDeps[filename];
                }
            };

            configDeps[resolvedPath] = {
                configs: {
                    bar: {
                        parser: "babel-eslint"
                    }
                }
            };

            const StubbedConfigFile = proxyquire("../../../lib/config/config-file", configDeps);

            assert.throws(() => {
                StubbedConfigFile.applyExtends({
                    extends: "plugin:test/bar",
                    rules: { eqeqeq: 2 }
                }, configContext, "/whatever");
            }, /Cannot find module 'babel-eslint'/u);

        });

        it("should throw an error when a plugin config is not found", () => {
            const resolvedPath = path.resolve(PROJECT_PATH, "./node_modules/eslint-plugin-test/index.js");

            const configDeps = {
                "../util/module-resolver": createStubModuleResolver({
                    "eslint-plugin-test": resolvedPath
                }),
                "import-fresh"(filename) {
                    return configDeps[filename];
                }
            };

            configDeps[resolvedPath] = {
                configs: {
                    baz: {}
                }
            };

            const StubbedConfigFile = proxyquire("../../../lib/config/config-file", configDeps);

            assert.throws(() => {
                StubbedConfigFile.applyExtends({
                    extends: "plugin:test/bar",
                    rules: { eqeqeq: 2 }
                }, configContext, "/whatever");
            }, /Failed to load config "plugin:test\/bar" to extend from./u);

        });

        it("should apply extensions recursively when specified from package", () => {

            const resolvedPaths = [
                path.resolve(PROJECT_PATH, "./node_modules/eslint-config-foo/index.js"),
                path.resolve(PROJECT_PATH, "./node_modules/eslint-config-bar/index.js")
            ];

            const configDeps = {

                "../util/module-resolver": createStubModuleResolver({
                    "eslint-config-foo": resolvedPaths[0],
                    "eslint-config-bar": resolvedPaths[1]
                }),
                "import-fresh"(filename) {
                    return configDeps[filename];
                }
            };

            configDeps[resolvedPaths[0]] = {
                extends: "bar",
                env: { browser: true }
            };

            configDeps[resolvedPaths[1]] = {
                rules: {
                    bar: 2
                }
            };

            const StubbedConfigFile = proxyquire("../../../lib/config/config-file", configDeps);

            const config = StubbedConfigFile.applyExtends({
                extends: "foo",
                rules: { eqeqeq: 2 }
            }, configContext, "/whatever");

            assert.deepStrictEqual(config, {
                baseDirectory: path.dirname(resolvedPaths[0]),
                filePath: resolvedPaths[0],
                extends: "foo",
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
                baseDirectory: path.dirname(filePath),
                filePath: path.join(path.dirname(filePath), extendsFile),
                extends: extendsFile,
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
                baseDirectory: path.dirname(filePath),
                filePath: path.join(path.dirname(filePath), extendsFile),
                extends: extendsFile,
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
                baseDirectory: path.dirname(filePath),
                filePath: path.join(path.dirname(filePath), extendsFile),
                extends: extendsFile,
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
                baseDirectory: path.dirname(path.resolve(path.dirname(filePath), extendsFile)),
                filePath: path.resolve(path.dirname(filePath), extendsFile),
                extends: extendsFile,
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
            const config = ConfigFile.load(configFilePath, configContext);

            assert.deepStrictEqual(config, {
                baseDirectory: path.dirname(configFilePath),
                filePath: configFilePath,
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
            const config = ConfigFile.load(configFilePath, configContext);

            assert.deepStrictEqual(config, {
                baseDirectory: path.dirname(configFilePath),
                filePath: configFilePath,
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
                ConfigFile.load(getFixturePath("js/.eslintrc.broken.js"), configContext);
            }, /Cannot read config file/u);
        });

        it("should interpret parser module name when present in a JavaScript file", () => {
            const configFilePath = getFixturePath("js/.eslintrc.parser.js");
            const config = ConfigFile.load(configFilePath, configContext);

            assert.deepStrictEqual(config, {
                baseDirectory: path.dirname(configFilePath),
                filePath: configFilePath,
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
            const config = ConfigFile.load(configFilePath, configContext);

            assert.deepStrictEqual(config, {
                baseDirectory: path.dirname(configFilePath),
                filePath: configFilePath,
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
            const config = ConfigFile.load(configFilePath, configContext);

            assert.deepStrictEqual(config, {
                baseDirectory: path.dirname(configFilePath),
                filePath: configFilePath,
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
            const config = ConfigFile.load(configFilePath, configContext);

            assert.deepStrictEqual(config, {
                baseDirectory: path.dirname(configFilePath),
                filePath: configFilePath,
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
            let config = ConfigFile.load(tmpFilePath, configContext);

            assert.deepStrictEqual(config, Object.assign({}, initialConfig, {
                baseDirectory: path.dirname(tmpFilePath),
                filePath: tmpFilePath
            }));
            writeTempConfigFile(updatedConfig, tmpFilename, path.dirname(tmpFilePath));
            configContext = new Config({}, new Linter());
            config = ConfigFile.load(tmpFilePath, configContext);
            assert.deepStrictEqual(config, Object.assign({}, updatedConfig, {
                baseDirectory: path.dirname(tmpFilePath),
                filePath: tmpFilePath
            }));
        });

        it("should load information from a package.json file", () => {
            const configFilePath = getFixturePath("package-json/package.json");
            const config = ConfigFile.load(configFilePath, configContext);

            assert.deepStrictEqual(config, {
                baseDirectory: path.dirname(configFilePath),
                filePath: configFilePath,
                parserOptions: {},
                env: { es6: true },
                globals: {},
                rules: {}
            });
        });

        it("should throw error when loading invalid package.json file", () => {
            assert.throws(() => {
                try {
                    ConfigFile.load(getFixturePath("broken-package-json/package.json"), configContext);
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
            let config = ConfigFile.load(tmpFilePath, configContext);

            assert.deepStrictEqual(config, Object.assign({}, initialConfig.eslintConfig, {
                baseDirectory: path.dirname(tmpFilePath),
                filePath: tmpFilePath
            }));
            writeTempConfigFile(updatedConfig, tmpFilename, path.dirname(tmpFilePath));
            configContext = new Config({}, new Linter());
            config = ConfigFile.load(tmpFilePath, configContext);
            assert.deepStrictEqual(config, Object.assign({}, updatedConfig.eslintConfig, {
                baseDirectory: path.dirname(tmpFilePath),
                filePath: tmpFilePath
            }));
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
            let config = ConfigFile.load(tmpFilePath, configContext);

            assert.deepStrictEqual(config, Object.assign({}, initialConfig, {
                baseDirectory: path.dirname(tmpFilePath),
                filePath: tmpFilePath
            }));
            writeTempJsConfigFile(updatedConfig, tmpFilename, path.dirname(tmpFilePath));
            configContext = new Config({}, new Linter());
            config = ConfigFile.load(tmpFilePath, configContext);
            assert.deepStrictEqual(config, Object.assign({}, updatedConfig, {
                baseDirectory: path.dirname(tmpFilePath),
                filePath: tmpFilePath
            }));
        });

        it("should load information from a YAML file", () => {
            const configFilePath = getFixturePath("yaml/.eslintrc.yaml");
            const config = ConfigFile.load(configFilePath, configContext);

            assert.deepStrictEqual(config, {
                baseDirectory: path.dirname(configFilePath),
                filePath: configFilePath,
                parserOptions: {},
                env: { browser: true },
                globals: {},
                rules: {}
            });
        });

        it("should load information from a YAML file", () => {
            const configFilePath = getFixturePath("yaml/.eslintrc.empty.yaml");
            const config = ConfigFile.load(configFilePath, configContext);

            assert.deepStrictEqual(config, {
                baseDirectory: path.dirname(configFilePath),
                filePath: configFilePath,
                parserOptions: {},
                env: {},
                globals: {},
                rules: {}
            });
        });

        it("should load information from a YML file", () => {
            const configFilePath = getFixturePath("yml/.eslintrc.yml");
            const config = ConfigFile.load(configFilePath, configContext);

            assert.deepStrictEqual(config, {
                baseDirectory: path.dirname(configFilePath),
                filePath: configFilePath,
                parserOptions: {},
                env: { node: true },
                globals: {},
                rules: {}
            });
        });

        it("should load information from a YML file and apply extensions", () => {
            const configFilePath = getFixturePath("extends/.eslintrc.yml");
            const config = ConfigFile.load(configFilePath, configContext);

            assert.deepStrictEqual(config, {
                baseDirectory: path.dirname(configFilePath),
                filePath: configFilePath,
                env: { es6: true },
                extends: "../package-json/package.json",
                globals: {},
                parserOptions: {},
                rules: { booya: 2 }
            });
        });

        it("should load information from `extends` chain.", () => {
            const configFilePath = getFixturePath("extends-chain/.eslintrc.json");
            const config = ConfigFile.load(configFilePath, configContext);

            assert.deepStrictEqual(config, {
                baseDirectory: path.dirname(configFilePath),
                filePath: configFilePath,
                env: {},
                extends: "a",
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
            const config = ConfigFile.load(configFilePath, configContext);

            assert.deepStrictEqual(config, {
                baseDirectory: path.dirname(configFilePath),
                filePath: configFilePath,
                env: {},
                extends: "a",
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
            const config = ConfigFile.load(configFilePath, configContext);

            assert.deepStrictEqual(config, {
                baseDirectory: path.dirname(configFilePath),
                filePath: configFilePath,
                env: {},
                extends: "./node_modules/eslint-config-a/index.js",
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
            const config = ConfigFile.load(configFilePath, configContext);
            const parserPath = getFixturePath("extends-chain-2/parser.js");

            assert.deepStrictEqual(config, {
                baseDirectory: path.dirname(configFilePath),
                filePath: configFilePath,
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
                const config = ConfigFile.load(configFilePath, configContext);

                assert.deepStrictEqual(config, {
                    baseDirectory: path.dirname(configFilePath),
                    filePath: configFilePath,
                    env: {},
                    extends: "./node_modules/eslint-config-a/index.js",
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
                const config = ConfigFile.load(configFilePath, configContext);
                const parserPath = path.join(fixturePath, "parser.js");

                assert.deepStrictEqual(config, {
                    baseDirectory: path.dirname(configFilePath),
                    filePath: configFilePath,
                    env: {},
                    globals: {},
                    parser: parserPath,
                    parserOptions: {},
                    rules: {}
                });
            });
        });

        describe("Plugins", () => {

            overrideNativeResolve({
                "eslint-plugin-test": getProjectModulePath("eslint-plugin-test")
            });

            it("should load information from a YML file and load plugins", () => {

                const stubConfig = new Config({}, new Linter());

                stubConfig.plugins.define("eslint-plugin-test", {
                    environments: {
                        bar: { globals: { bar: true } }
                    }
                });

                const configFilePath = getFixturePath("plugins/.eslintrc.yml");
                const config = ConfigFile.load(configFilePath, stubConfig);

                assert.deepStrictEqual(config, {
                    baseDirectory: path.dirname(configFilePath),
                    filePath: configFilePath,
                    parserOptions: {},
                    env: { "test/bar": true },
                    globals: {},
                    plugins: ["test"],
                    rules: {
                        "test/foo": 2
                    }
                });
            });

            it("should load two separate configs from a plugin", () => {
                const stubConfig = new Config({}, new Linter());
                const resolvedPath = path.resolve(PROJECT_PATH, "./node_modules/eslint-plugin-test/index.js");

                const configDeps = {
                    "import-fresh"(filename) {
                        return configDeps[filename];
                    }
                };

                configDeps[resolvedPath] = {
                    configs: {
                        foo: { rules: { semi: 2, quotes: 1 } },
                        bar: { rules: { quotes: 2, yoda: 2 } }
                    }
                };

                const StubbedConfigFile = proxyquire("../../../lib/config/config-file", configDeps);

                const configFilePath = getFixturePath("plugins/.eslintrc2.yml");
                const config = StubbedConfigFile.load(configFilePath, stubConfig);

                assert.deepStrictEqual(config, {
                    baseDirectory: path.dirname(configFilePath),
                    filePath: configFilePath,
                    parserOptions: {},
                    globals: {},
                    env: {},
                    rules: {
                        semi: 2,
                        quotes: 2,
                        yoda: 2
                    },
                    extends: [
                        "plugin:test/foo",
                        "plugin:test/bar"
                    ]
                });
            });
        });

        describe("even if config files have Unicode BOM,", () => {
            it("should read the JSON config file correctly.", () => {
                const configFilePath = getFixturePath("bom/.eslintrc.json");
                const config = ConfigFile.load(configFilePath, configContext);

                assert.deepStrictEqual(config, {
                    baseDirectory: path.dirname(configFilePath),
                    filePath: configFilePath,
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
                const config = ConfigFile.load(configFilePath, configContext);

                assert.deepStrictEqual(config, {
                    baseDirectory: path.dirname(configFilePath),
                    filePath: configFilePath,
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
                const config = ConfigFile.load(configFilePath, configContext);

                assert.deepStrictEqual(config, {
                    baseDirectory: path.dirname(configFilePath),
                    filePath: configFilePath,
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
                ConfigFile.load(configFilePath, configContext);
            } catch (err) {
                assert.include(err.message, `ESLint configuration in ${configFilePath} is invalid`);
                return;
            }
            assert.fail();
        });
    });

    describe("resolve()", () => {

        describe("Relative to CWD", () => {
            overrideNativeResolve({
                "eslint-plugin-foo": getProjectModulePath("eslint-plugin-foo")
            });

            leche.withData([
                [".eslintrc", path.resolve(".eslintrc")],
                ["eslint-config-foo", getProjectModulePath("eslint-config-foo")],
                ["foo", getProjectModulePath("eslint-config-foo")],
                ["eslint-configfoo", getProjectModulePath("eslint-config-eslint-configfoo")],
                ["@foo/eslint-config", getProjectModulePath("@foo/eslint-config")],
                ["@foo/bar", getProjectModulePath("@foo/eslint-config-bar")],
                ["plugin:foo/bar", getProjectModulePath("eslint-plugin-foo")]
            ], (input, expected) => {
                it(`should return ${expected} when passed ${input}`, () => {

                    const configDeps = {
                        "eslint-config-foo": getProjectModulePath("eslint-config-foo"),
                        "eslint-config-eslint-configfoo": getProjectModulePath("eslint-config-eslint-configfoo"),
                        "@foo/eslint-config": getProjectModulePath("@foo/eslint-config"),
                        "@foo/eslint-config-bar": getProjectModulePath("@foo/eslint-config-bar"),
                        "eslint-plugin-foo": getProjectModulePath("eslint-plugin-foo")
                    };

                    const StubbedConfigFile = proxyquire("../../../lib/config/config-file", {
                        "../util/module-resolver": createStubModuleResolver(configDeps)
                    });

                    const result = StubbedConfigFile.resolve(input);

                    assert.strictEqual(result.filePath, expected);
                });
            });
        });

        describe("Relative to config file", () => {

            const relativePath = path.resolve("./foo/bar");

            overrideNativeResolve({
                "@foo/eslint-plugin-bar": getProjectModulePath("@foo/eslint-plugin-bar")
            });

            leche.withData([
                [".eslintrc", path.resolve("./foo/bar", ".eslintrc"), relativePath],
                ["eslint-config-foo", getRelativeModulePath("eslint-config-foo", relativePath), relativePath],
                ["foo", getRelativeModulePath("eslint-config-foo", relativePath), relativePath],
                ["eslint-configfoo", getRelativeModulePath("eslint-config-eslint-configfoo", relativePath), relativePath],
                ["@foo/eslint-config", getRelativeModulePath("@foo/eslint-config", relativePath), relativePath],
                ["@foo/bar", getRelativeModulePath("@foo/eslint-config-bar", relativePath), relativePath],
                ["plugin:@foo/bar/baz", getProjectModulePath("@foo/eslint-plugin-bar"), relativePath]
            ], (input, expected, relativeTo) => {
                it(`should return ${expected} when passed ${input}`, () => {

                    const configDeps = {
                        "eslint-config-foo": getRelativeModulePath("eslint-config-foo", relativePath),
                        "eslint-config-eslint-configfoo": getRelativeModulePath("eslint-config-eslint-configfoo", relativePath),
                        "@foo/eslint-config": getRelativeModulePath("@foo/eslint-config", relativePath),
                        "@foo/eslint-config-bar": getRelativeModulePath("@foo/eslint-config-bar", relativePath)
                    };

                    const StubbedConfigFile = proxyquire("../../../lib/config/config-file", {
                        "../util/module-resolver": createStubModuleResolver(configDeps)
                    });

                    const result = StubbedConfigFile.resolve(input, relativeTo);

                    assert.strictEqual(result.filePath, expected);
                });
            });

            leche.withData([
                ["eslint-config-foo/bar", path.resolve("./node_modules", "eslint-config-foo/bar", "index.json"), relativePath],
                ["eslint-config-foo/bar", path.resolve("./node_modules", "eslint-config-foo", "bar.json"), relativePath],
                ["eslint-config-foo/bar", path.resolve("./node_modules", "eslint-config-foo/bar", "index.js"), relativePath],
                ["eslint-config-foo/bar", path.resolve("./node_modules", "eslint-config-foo", "bar.js"), relativePath]
            ], (input, expected, relativeTo) => {
                it(`should return ${expected} when passed ${input}`, () => {

                    const configDeps = {
                        "eslint-config-foo/bar": expected
                    };

                    const StubbedConfigFile = proxyquire("../../../lib/config/config-file", {
                        "../util/module-resolver": createStubModuleResolver(configDeps)
                    });

                    const result = StubbedConfigFile.resolve(input, relativeTo);

                    assert.strictEqual(result.filePath, expected);
                });
            });

        });

    });

    describe("getBaseDir()", () => {

        // can only run this test if there's a home directory
        if (userHome) {

            it("should return project path when config file is in home directory", () => {
                const result = ConfigFile.getBaseDir(userHome);

                assert.strictEqual(result, PROJECT_PATH);
            });
        }

        it("should return project path when config file is in an ancestor directory of the project path", () => {
            const result = ConfigFile.getBaseDir(path.resolve(PROJECT_PATH, "../../"));

            assert.strictEqual(result, PROJECT_PATH);
        });

        it("should return config file path when config file is in a descendant directory of the project path", () => {
            const configFilePath = path.resolve(PROJECT_PATH, "./foo/bar/"),
                result = ConfigFile.getBaseDir(path.resolve(PROJECT_PATH, "./foo/bar/"));

            assert.strictEqual(result, configFilePath);
        });

        it("should return project path when config file is not an ancestor or descendant of the project path", () => {
            const result = ConfigFile.getBaseDir(path.resolve("/tmp/foo"));

            assert.strictEqual(result, PROJECT_PATH);
        });

    });

    describe("getLookupPath()", () => {

        // can only run this test if there's a home directory
        if (userHome) {

            it("should return project path when config file is in home directory", () => {
                const result = ConfigFile.getLookupPath(userHome);

                assert.strictEqual(result, PROJECT_DEPS_PATH);
            });
        }

        it("should return project path when config file is in an ancestor directory of the project path", () => {
            const result = ConfigFile.getLookupPath(path.resolve(PROJECT_DEPS_PATH, "../../"));

            assert.strictEqual(result, PROJECT_DEPS_PATH);
        });

        it("should return config file path when config file is in a descendant directory of the project path", () => {
            const configFilePath = path.resolve(PROJECT_DEPS_PATH, "./foo/bar/node_modules"),
                result = ConfigFile.getLookupPath(path.resolve(PROJECT_DEPS_PATH, "./foo/bar/"));

            assert.strictEqual(result, configFilePath);
        });

        it("should return project path when config file is not an ancestor or descendant of the project path", () => {
            const result = ConfigFile.getLookupPath(path.resolve("/tmp/foo"));

            assert.strictEqual(result, PROJECT_DEPS_PATH);
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
