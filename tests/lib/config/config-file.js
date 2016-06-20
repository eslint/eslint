/**
 * @fileoverview Tests for ConfigFile
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    leche = require("leche"),
    sinon = require("sinon"),
    path = require("path"),
    fs = require("fs"),
    temp = require("temp"),
    yaml = require("js-yaml"),
    userHome = require("user-home"),
    proxyquire = require("proxyquire"),
    shell = require("shelljs"),
    environments = require("../../../conf/environments"),
    ConfigFile = require("../../../lib/config/config-file");

temp = temp.track();

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

proxyquire = proxyquire.noCallThru().noPreserveCache();

/*
 * Project path is the project that is including ESLint as a dependency. In the
 * case of these tests, it will end up the parent of the "eslint" folder. That's
 * fine for the purposes of testing because the tests are just relative to an
 * ancestor location.
 */
var PROJECT_PATH = path.resolve(__dirname, "../../../../"),
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
 * Reads a JS configuration object from a string to ensure that it parses.
 * Used for testing configuration file output.
 * @param {string} code The code to eval.
 * @returns {*} The result of the evaluation.
 * @private
 */
function readJSModule(code) {
    return eval("var module = {};\n" + code);  // eslint-disable-line no-eval
}

/**
 * Helper function to write configs to temp file.
 * @param {object} config Config to write out to temp file.
 * @param {string} filename Name of file to write in temp dir.
 * @param {string} existingTmpDir Optional dir path if temp file exists.
 * @returns {string} Full path to the temp file.
 * @private
 */
function writeTempConfigFile(config, filename, existingTmpDir) {
    var tmpFileDir = existingTmpDir || temp.mkdirSync("eslint-tests-"),
        tmpFilePath = path.join(tmpFileDir, filename),
        tmpFileContents = JSON.stringify(config);

    fs.writeFileSync(tmpFilePath, tmpFileContents);
    return tmpFilePath;
}

/**
 * Helper function to write JS configs to temp file.
 * @param {object} config Config to write out to temp file.
 * @param {string} filename Name of file to write in temp dir.
 * @param {string} existingTmpDir Optional dir path if temp file exists.
 * @returns {string} Full path to the temp file.
 * @private
 */
function writeTempJsConfigFile(config, filename, existingTmpDir) {
    var tmpFileDir = existingTmpDir || temp.mkdirSync("eslint-tests-"),
        tmpFilePath = path.join(tmpFileDir, filename),
        tmpFileContents = "module.exports = " + JSON.stringify(config);

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
    function StubModuleResolver() {}

    StubModuleResolver.prototype.resolve = function(name) {
        if (mapping.hasOwnProperty(name)) {
            return mapping[name];
        }

        throw new Error("Cannot find module '" + name + "'");
    };

    return StubModuleResolver;
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ConfigFile", function() {

    describe("CONFIG_FILES", function() {
        it("should be present when imported", function() {
            assert.isTrue(Array.isArray(ConfigFile.CONFIG_FILES));
        });
    });

    describe("applyExtends()", function() {

        it("should apply extension 'foo' when specified from root directory config", function() {

            var resolvedPath = path.resolve(PROJECT_PATH, "./node_modules/eslint-config-foo/index.js");

            var configDeps = {

                // Hacky: need to override isFile for each call for testing
                "../util/module-resolver": createStubModuleResolver({ "eslint-config-foo": resolvedPath }),
                "require-uncached": function(filename) {
                    return configDeps[filename];
                }
            };

            configDeps[resolvedPath] = {
                env: { browser: true }
            };

            var StubbedConfigFile = proxyquire("../../../lib/config/config-file", configDeps);

            var config = StubbedConfigFile.applyExtends({
                extends: "foo",
                rules: { eqeqeq: 2 }
            }, "/whatever");

            assert.deepEqual(config, {
                extends: "foo",
                parserOptions: {},
                env: { browser: true },
                globals: {},
                rules: { eqeqeq: 2 }
            });

        });

        it("should apply all rules when extends config includes 'eslint:all'", function() {

            var configDeps = {
                "../util/module-resolver": createStubModuleResolver({})
            };
            var StubbedConfigFile = proxyquire("../../../lib/config/config-file", configDeps);
            var config = StubbedConfigFile.applyExtends({
                extends: "eslint:all"
            }, "/whatever");

            assert.equal(config.rules.eqeqeq, "error");
            assert.equal(config.rules.curly, "error");

        });

        it("should throw an error when extends config is not found", function() {

            var configDeps = {
                "../util/module-resolver": createStubModuleResolver({})
            };

            var StubbedConfigFile = proxyquire("../../../lib/config/config-file", configDeps);

            assert.throws(function() {
                StubbedConfigFile.applyExtends({
                    extends: "foo",
                    rules: { eqeqeq: 2 }
                }, "/whatever");
            }, /Cannot find module 'eslint-config-foo'/);

        });

        it("should apply extensions recursively when specified from package", function() {

            var resolvedPaths = [
                path.resolve(PROJECT_PATH, "./node_modules/eslint-config-foo/index.js"),
                path.resolve(PROJECT_PATH, "./node_modules/eslint-config-bar/index.js")
            ];

            var configDeps = {

                "../util/module-resolver": createStubModuleResolver({
                    "eslint-config-foo": resolvedPaths[0],
                    "eslint-config-bar": resolvedPaths[1]
                }),
                "require-uncached": function(filename) {
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

            var StubbedConfigFile = proxyquire("../../../lib/config/config-file", configDeps);

            var config = StubbedConfigFile.applyExtends({
                extends: "foo",
                rules: { eqeqeq: 2 }
            }, "/whatever");

            assert.deepEqual(config, {
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

        it("should apply extensions when specified from a JavaScript file", function() {

            var config = ConfigFile.applyExtends({
                extends: ".eslintrc.js",
                rules: { eqeqeq: 2 }
            }, getFixturePath("js/foo.js"));

            assert.deepEqual(config, {
                extends: ".eslintrc.js",
                parserOptions: {},
                env: {},
                globals: {},
                rules: {
                    semi: [2, "always"],
                    eqeqeq: 2
                }
            });

        });

        it("should apply extensions when specified from a YAML file", function() {

            var config = ConfigFile.applyExtends({
                extends: ".eslintrc.yaml",
                rules: { eqeqeq: 2 }
            }, getFixturePath("yaml/foo.js"));

            assert.deepEqual(config, {
                extends: ".eslintrc.yaml",
                parserOptions: {},
                env: { browser: true },
                globals: {},
                rules: {
                    eqeqeq: 2
                }
            });

        });

        it("should apply extensions when specified from a JSON file", function() {

            var config = ConfigFile.applyExtends({
                extends: ".eslintrc.json",
                rules: { eqeqeq: 2 }
            }, getFixturePath("json/foo.js"));

            assert.deepEqual(config, {
                extends: ".eslintrc.json",
                parserOptions: {},
                env: {},
                globals: {},
                rules: {
                    eqeqeq: 2,
                    quotes: [2, "double"]
                }
            });

        });

        it("should apply extensions when specified from a package.json file in a sibling directory", function() {

            var config = ConfigFile.applyExtends({
                extends: "../package-json/package.json",
                rules: { eqeqeq: 2 }
            }, getFixturePath("json/foo.js"));

            assert.deepEqual(config, {
                extends: "../package-json/package.json",
                parserOptions: {},
                env: { es6: true },
                globals: {},
                rules: {
                    eqeqeq: 2
                }
            });

        });

    });

    describe("load()", function() {

        it("should throw error if file doesnt exist", function() {
            assert.throws(function() {
                ConfigFile.load(getFixturePath("legacy/nofile.js"));
            });

            assert.throws(function() {
                ConfigFile.load(getFixturePath("legacy/package.json"));
            });
        });

        it("should load information from a legacy file", function() {
            var config = ConfigFile.load(getFixturePath("legacy/.eslintrc"));

            assert.deepEqual(config, {
                parserOptions: {},
                env: {},
                globals: {},
                rules: {
                    eqeqeq: 2
                }
            });
        });

        it("should load information from a JavaScript file", function() {
            var config = ConfigFile.load(getFixturePath("js/.eslintrc.js"));

            assert.deepEqual(config, {
                parserOptions: {},
                env: {},
                globals: {},
                rules: {
                    semi: [2, "always"]
                }
            });
        });

        it("should throw error when loading invalid JavaScript file", function() {
            assert.throws(function() {
                ConfigFile.load(getFixturePath("js/.eslintrc.broken.js"));
            }, /Cannot read config file/);
        });

        it("should interpret parser module name when present in a JavaScript file", function() {
            var config = ConfigFile.load(getFixturePath("js/.eslintrc.parser.js"));

            assert.deepEqual(config, {
                parser: path.resolve(getFixturePath("js/node_modules/foo/index.js")),
                parserOptions: {},
                env: {},
                globals: {},
                rules: {
                    semi: [2, "always"]
                }
            });
        });

        it("should interpret parser path when present in a JavaScript file", function() {
            var config = ConfigFile.load(getFixturePath("js/.eslintrc.parser2.js"));

            assert.deepEqual(config, {
                parser: path.resolve(getFixturePath("js/not-a-config.js")),
                parserOptions: {},
                env: {},
                globals: {},
                rules: {
                    semi: [2, "always"]
                }
            });
        });

        it("should not interpret parser module name or path when parser is set to default parser in a JavaScript file", function() {
            var config = ConfigFile.load(getFixturePath("js/.eslintrc.parser3.js"));

            assert.deepEqual(config, {
                parser: null,
                parserOptions: {},
                env: {},
                globals: {},
                rules: {
                    semi: [2, "always"]
                }
            });
        });

        it("should load information from a JSON file", function() {
            var config = ConfigFile.load(getFixturePath("json/.eslintrc.json"));

            assert.deepEqual(config, {
                parserOptions: {},
                env: {},
                globals: {},
                rules: {
                    quotes: [2, "double"]
                }
            });
        });

        it("should load fresh information from a JSON file", function() {
            var initialConfig = {
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
                tmpFilePath = writeTempConfigFile(initialConfig, tmpFilename),
                config = ConfigFile.load(tmpFilePath);

            assert.deepEqual(config, initialConfig);
            writeTempConfigFile(updatedConfig, tmpFilename, path.dirname(tmpFilePath));
            config = ConfigFile.load(tmpFilePath);
            assert.deepEqual(config, updatedConfig);
        });

        it("should load information from a package.json file", function() {
            var config = ConfigFile.load(getFixturePath("package-json/package.json"));

            assert.deepEqual(config, {
                parserOptions: {},
                env: { es6: true },
                globals: {},
                rules: {}
            });
        });

        it("should throw error when loading invalid package.json file", function() {
            assert.throws(function() {
                ConfigFile.load(getFixturePath("broken-package-json/package.json"));
            }, /Cannot read config file/);
        });

        it("should load information from a package.json file and apply environments", function() {
            var config = ConfigFile.load(getFixturePath("package-json/package.json"), true);

            assert.deepEqual(config, {
                parserOptions: { ecmaVersion: 6 },
                env: { es6: true },
                globals: environments.es6.globals,
                rules: {}
            });
        });

        it("should load fresh information from a package.json file", function() {
            var initialConfig = {
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
                tmpFilePath = writeTempConfigFile(initialConfig, tmpFilename),
                config = ConfigFile.load(tmpFilePath);

            assert.deepEqual(config, initialConfig.eslintConfig);
            writeTempConfigFile(updatedConfig, tmpFilename, path.dirname(tmpFilePath));
            config = ConfigFile.load(tmpFilePath);
            assert.deepEqual(config, updatedConfig.eslintConfig);
        });

        it("should load fresh information from a .eslintrc.js file", function() {
            var initialConfig = {
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
                tmpFilePath = writeTempJsConfigFile(initialConfig, tmpFilename),
                config = ConfigFile.load(tmpFilePath);

            assert.deepEqual(config, initialConfig);
            writeTempJsConfigFile(updatedConfig, tmpFilename, path.dirname(tmpFilePath));
            config = ConfigFile.load(tmpFilePath);
            assert.deepEqual(config, updatedConfig);
        });

        it("should load information from a YAML file", function() {
            var config = ConfigFile.load(getFixturePath("yaml/.eslintrc.yaml"));

            assert.deepEqual(config, {
                parserOptions: {},
                env: { browser: true },
                globals: {},
                rules: {}
            });
        });

        it("should load information from a YAML file", function() {
            var config = ConfigFile.load(getFixturePath("yaml/.eslintrc.empty.yaml"));

            assert.deepEqual(config, {
                parserOptions: {},
                env: {},
                globals: {},
                rules: {}
            });
        });

        it("should load information from a YAML file and apply environments", function() {
            var config = ConfigFile.load(getFixturePath("yaml/.eslintrc.yaml"), true);

            assert.deepEqual(config, {
                parserOptions: {},
                env: { browser: true },
                globals: environments.browser.globals,
                rules: {}
            });
        });

        it("should load information from a YML file", function() {
            var config = ConfigFile.load(getFixturePath("yml/.eslintrc.yml"));

            assert.deepEqual(config, {
                parserOptions: {},
                env: { node: true },
                globals: {},
                rules: {}
            });
        });

        it("should load information from a YML file and apply environments", function() {
            var config = ConfigFile.load(getFixturePath("yml/.eslintrc.yml"), true);

            assert.deepEqual(config, {
                parserOptions: {ecmaFeatures: { globalReturn: true }},
                env: { node: true },
                globals: environments.node.globals,
                rules: {}
            });
        });

        it("should load information from a YML file and apply extensions", function() {
            var config = ConfigFile.load(getFixturePath("extends/.eslintrc.yml"), true);

            assert.deepEqual(config, {
                extends: "../package-json/package.json",
                parserOptions: { ecmaVersion: 6 },
                env: { es6: true },
                globals: environments.es6.globals,
                rules: { booya: 2 }
            });
        });

        it("should load information from `extends` chain.", function() {
            var config = ConfigFile.load(getFixturePath("extends-chain/.eslintrc.json"));

            assert.deepEqual(config, {
                env: {},
                extends: "a",
                globals: {},
                parserOptions: {},
                rules: {
                    a: 2, // from node_modules/eslint-config-a
                    b: 2, // from node_modules/eslint-config-a/node_modules/eslint-config-b
                    c: 2  // from node_modules/eslint-config-a/node_modules/eslint-config-b/node_modules/eslint-config-c
                }
            });
        });

        it("should load information from `extends` chain with relative path.", function() {
            var config = ConfigFile.load(getFixturePath("extends-chain-2/.eslintrc.json"));

            assert.deepEqual(config, {
                env: {},
                extends: "a",
                globals: {},
                parserOptions: {},
                rules: {
                    a: 2,       // from node_modules/eslint-config-a/index.js
                    relative: 2 // from node_modules/eslint-config-a/relative.js
                }
            });
        });

        it("should load information from `extends` chain in .eslintrc with relative path.", function() {
            var config = ConfigFile.load(getFixturePath("extends-chain-2/relative.eslintrc.json"));

            assert.deepEqual(config, {
                env: {},
                extends: "./node_modules/eslint-config-a/index.js",
                globals: {},
                parserOptions: {},
                rules: {
                    a: 2,       // from node_modules/eslint-config-a/index.js
                    relative: 2 // from node_modules/eslint-config-a/relative.js
                }
            });
        });

        it("should load information from `parser` in .eslintrc with relative path.", function() {
            var config = ConfigFile.load(getFixturePath("extends-chain-2/parser.eslintrc.json"));
            var parserPath = getFixturePath("extends-chain-2/parser.js");

            assert.deepEqual(config, {
                env: {},
                globals: {},
                parser: parserPath,
                parserOptions: {},
                rules: {}
            });
        });

        describe("even if it's in another directory,", function() {
            var fixturePath = "";

            before(function() {
                var tempDir = temp.mkdirSync("eslint-test-chain");
                var chain2 = getFixturePath("extends-chain-2");

                fixturePath = path.join(tempDir, "extends-chain-2");
                shell.cp("-r", chain2, fixturePath);
            });

            after(function() {
                temp.cleanupSync();
            });

            it("should load information from `extends` chain in .eslintrc with relative path.", function() {
                var config = ConfigFile.load(path.join(fixturePath, "relative.eslintrc.json"));

                assert.deepEqual(config, {
                    env: {},
                    extends: "./node_modules/eslint-config-a/index.js",
                    globals: {},
                    parserOptions: {},
                    rules: {
                        a: 2,       // from node_modules/eslint-config-a/index.js
                        relative: 2 // from node_modules/eslint-config-a/relative.js
                    }
                });
            });

            it("should load information from `parser` in .eslintrc with relative path.", function() {
                var config = ConfigFile.load(path.join(fixturePath, "parser.eslintrc.json"));
                var parserPath = path.join(fixturePath, "parser.js");

                assert.deepEqual(config, {
                    env: {},
                    globals: {},
                    parser: parserPath,
                    parserOptions: {},
                    rules: {}
                });
            });
        });

        describe("Plugins", function() {

            it("should load information from a YML file and load plugins", function() {

                var StubbedPlugins = proxyquire("../../../lib/config/plugins", {
                    "eslint-plugin-test": {
                        environments: {
                            bar: { globals: { bar: true } }
                        }
                    }
                });

                var StubbedConfigFile = proxyquire("../../../lib/config/config-file", {
                    "./plugins": StubbedPlugins
                });

                var config = StubbedConfigFile.load(getFixturePath("plugins/.eslintrc.yml"));

                assert.deepEqual(config, {
                    parserOptions: {},
                    env: { "test/bar": true },
                    globals: {},
                    plugins: [ "test" ],
                    rules: {
                        "test/foo": 2
                    }
                });
            });
        });

    });

    describe("resolve()", function() {

        describe("Relative to CWD", function() {

            leche.withData([
                [ ".eslintrc", path.resolve(".eslintrc") ],
                [ "eslint-config-foo", getProjectModulePath("eslint-config-foo") ],
                [ "foo", getProjectModulePath("eslint-config-foo") ],
                [ "eslint-configfoo", getProjectModulePath("eslint-config-eslint-configfoo") ],
                [ "@foo/eslint-config", getProjectModulePath("@foo/eslint-config") ],
                [ "@foo/bar", getProjectModulePath("@foo/eslint-config-bar") ],
                [ "plugin:foo/bar", getProjectModulePath("eslint-plugin-foo") ]
            ], function(input, expected) {
                it("should return " + expected + " when passed " + input, function() {

                    var configDeps = {
                        "eslint-config-foo": getProjectModulePath("eslint-config-foo"),
                        "eslint-config-eslint-configfoo": getProjectModulePath("eslint-config-eslint-configfoo"),
                        "@foo/eslint-config": getProjectModulePath("@foo/eslint-config"),
                        "@foo/eslint-config-bar": getProjectModulePath("@foo/eslint-config-bar"),
                        "eslint-plugin-foo": getProjectModulePath("eslint-plugin-foo")
                    };

                    var StubbedConfigFile = proxyquire("../../../lib/config/config-file", {
                        "../util/module-resolver": createStubModuleResolver(configDeps)
                    });

                    var result = StubbedConfigFile.resolve(input);

                    assert.equal(result.filePath, expected);
                });
            });
        });

        describe("Relative to config file", function() {

            var relativePath = path.resolve("./foo/bar");

            leche.withData([
                [ ".eslintrc", path.resolve("./foo/bar", ".eslintrc"), relativePath ],
                [ "eslint-config-foo", getRelativeModulePath("eslint-config-foo", relativePath), relativePath],
                [ "foo", getRelativeModulePath("eslint-config-foo", relativePath), relativePath],
                [ "eslint-configfoo", getRelativeModulePath("eslint-config-eslint-configfoo", relativePath), relativePath],
                [ "@foo/eslint-config", getRelativeModulePath("@foo/eslint-config", relativePath), relativePath],
                [ "@foo/bar", getRelativeModulePath("@foo/eslint-config-bar", relativePath), relativePath],
                [ "plugin:@foo/bar/baz", getRelativeModulePath("@foo/eslint-plugin-bar", relativePath), relativePath]
            ], function(input, expected, relativeTo) {
                it("should return " + expected + " when passed " + input, function() {

                    var configDeps = {
                        "eslint-config-foo": getRelativeModulePath("eslint-config-foo", relativePath),
                        "eslint-config-eslint-configfoo": getRelativeModulePath("eslint-config-eslint-configfoo", relativePath),
                        "@foo/eslint-config": getRelativeModulePath("@foo/eslint-config", relativePath),
                        "@foo/eslint-config-bar": getRelativeModulePath("@foo/eslint-config-bar", relativePath),
                        "eslint-plugin-foo": getRelativeModulePath("eslint-plugin-foo", relativePath),
                        "@foo/eslint-plugin-bar": getRelativeModulePath("@foo/eslint-plugin-bar", relativePath)
                    };

                    var StubbedConfigFile = proxyquire("../../../lib/config/config-file", {
                        "../util/module-resolver": createStubModuleResolver(configDeps)
                    });

                    var result = StubbedConfigFile.resolve(input, relativeTo);

                    assert.equal(result.filePath, expected);
                });
            });

            leche.withData([
                [ "eslint-config-foo/bar", path.resolve("./node_modules", "eslint-config-foo/bar", "index.json"), relativePath],
                [ "eslint-config-foo/bar", path.resolve("./node_modules", "eslint-config-foo", "bar.json"), relativePath],
                [ "eslint-config-foo/bar", path.resolve("./node_modules", "eslint-config-foo/bar", "index.js"), relativePath],
                [ "eslint-config-foo/bar", path.resolve("./node_modules", "eslint-config-foo", "bar.js"), relativePath]
            ], function(input, expected, relativeTo) {
                it("should return " + expected + " when passed " + input, function() {

                    var configDeps = {
                        "eslint-config-foo/bar": expected
                    };

                    var StubbedConfigFile = proxyquire("../../../lib/config/config-file", {
                        "../util/module-resolver": createStubModuleResolver(configDeps)
                    });

                    var result = StubbedConfigFile.resolve(input, relativeTo);

                    assert.equal(result.filePath, expected);
                });
            });

        });

    });

    describe("getBaseDir()", function() {

        // can only run this test if there's a home directory
        if (userHome) {

            it("should return project path when config file is in home directory", function() {
                var result = ConfigFile.getBaseDir(userHome);

                assert.equal(result, PROJECT_PATH);
            });
        }

        it("should return project path when config file is in an ancestor directory of the project path", function() {
            var result = ConfigFile.getBaseDir(path.resolve(PROJECT_PATH, "../../"));

            assert.equal(result, PROJECT_PATH);
        });

        it("should return config file path when config file is in a descendant directory of the project path", function() {
            var configFilePath = path.resolve(PROJECT_PATH, "./foo/bar/"),
                result = ConfigFile.getBaseDir(path.resolve(PROJECT_PATH, "./foo/bar/"));

            assert.equal(result, configFilePath);
        });

        it("should return project path when config file is not an ancestor or descendant of the project path", function() {
            var result = ConfigFile.getBaseDir(path.resolve("/tmp/foo"));

            assert.equal(result, PROJECT_PATH);
        });

    });

    describe("getLookupPath()", function() {

        // can only run this test if there's a home directory
        if (userHome) {

            it("should return project path when config file is in home directory", function() {
                var result = ConfigFile.getLookupPath(userHome);

                assert.equal(result, PROJECT_DEPS_PATH);
            });
        }

        it("should return project path when config file is in an ancestor directory of the project path", function() {
            var result = ConfigFile.getLookupPath(path.resolve(PROJECT_DEPS_PATH, "../../"));

            assert.equal(result, PROJECT_DEPS_PATH);
        });

        it("should return config file path when config file is in a descendant directory of the project path", function() {
            var configFilePath = path.resolve(PROJECT_DEPS_PATH, "./foo/bar/node_modules"),
                result = ConfigFile.getLookupPath(path.resolve(PROJECT_DEPS_PATH, "./foo/bar/"));

            assert.equal(result, configFilePath);
        });

        it("should return project path when config file is not an ancestor or descendant of the project path", function() {
            var result = ConfigFile.getLookupPath(path.resolve("/tmp/foo"));

            assert.equal(result, PROJECT_DEPS_PATH);
        });

    });

    describe("getFilenameFromDirectory()", function() {

        leche.withData([
            [ getFixturePath("legacy"), ".eslintrc" ],
            [ getFixturePath("yaml"), ".eslintrc.yaml" ],
            [ getFixturePath("yml"), ".eslintrc.yml" ],
            [ getFixturePath("json"), ".eslintrc.json" ],
            [ getFixturePath("js"), ".eslintrc.js" ]
        ], function(input, expected) {
            it("should return " + expected + " when passed " + input, function() {
                var result = ConfigFile.getFilenameForDirectory(input);

                assert.equal(result, path.resolve(input, expected));
            });
        });

    });

    describe("normalizePackageName()", function() {

        leche.withData([
            [ "foo", "eslint-config-foo" ],
            [ "eslint-config-foo", "eslint-config-foo" ],
            [ "@z/foo", "@z/eslint-config-foo" ],
            [ "@z\\foo", "@z/eslint-config-foo" ],
            [ "@z\\foo\\bar.js", "@z/eslint-config-foo/bar.js" ],
            [ "@z/eslint-config", "@z/eslint-config" ],
            [ "@z/eslint-config-foo", "@z/eslint-config-foo" ]
        ], function(input, expected) {
            it("should return " + expected + " when passed " + input, function() {
                var result = ConfigFile.normalizePackageName(input, "eslint-config");

                assert.equal(result, expected);
            });
        });

    });

    describe("write()", function() {

        var sandbox,
            config;

        beforeEach(function() {
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

        afterEach(function() {
            sandbox.verifyAndRestore();
        });

        leche.withData([
            ["JavaScript", "foo.js", readJSModule],
            ["JSON", "bar.json", JSON.parse],
            ["YAML", "foo.yaml", yaml.safeLoad],
            ["YML", "foo.yml", yaml.safeLoad]
        ], function(fileType, filename, validate) {

            it("should write a file through fs when a " + fileType + " path is passed", function() {
                var fakeFS = leche.fake(fs);

                sandbox.mock(fakeFS).expects("writeFileSync").withExactArgs(
                    filename,
                    sinon.match(function(value) {
                        return !!validate(value);
                    }),
                    "utf8"
                );

                var StubbedConfigFile = proxyquire("../../../lib/config/config-file", {
                    fs: fakeFS
                });

                StubbedConfigFile.write(config, filename);
            });

        });

        it("should throw error if file extension is not valid", function() {
            assert.throws(function() {
                ConfigFile.write({}, getFixturePath("yaml/.eslintrc.class"));
            }, /write to unknown file type/);
        });
    });

});
