/**
 * @fileoverview Tests for ConfigFile
 * @author Nicholas C. Zakas
 * @copyright 2015 Nicholas C. Zakas. All rights reserved.
 * See LICENSE file in root directory for full license.
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
    tmp = require("tmp"),
    yaml = require("js-yaml"),
    resolve = require("resolve"),
    proxyquire = require("proxyquire"),
    environments = require("../../../conf/environments"),
    ConfigFile = require("../../../lib/config/config-file");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

proxyquire = proxyquire.noCallThru().noPreserveCache();

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
    var tmpFileDir = existingTmpDir || tmp.dirSync({prefix: "eslint-tests-"}).name,
        tmpFilePath = path.join(tmpFileDir, filename),
        tmpFileContents = JSON.stringify(config);
    fs.writeFileSync(tmpFilePath, tmpFileContents);
    return tmpFilePath;
}

/**
 * Creates a module path relative to the current working directory.
 * @param {string} moduleName The full module name.
 * @returns {string} A full path for the module local to cwd.
 * @private
 */
function getCWDModulePath(moduleName) {
    return path.resolve("./node_modules", moduleName, "index.js");
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

        var target = [];

        /**
         * Called by resolve.sync() to get a function that checks for a specific
         * value. This is the only way to validate that ConfigFile.resolve()
         * works without actually creating all the dummy packages for the
         * resolve package to find.
         * @returns {Function} The function to pass in as isFile to resolve.sync().
         * @private
         */
        function getFileCheck() {
            return function(filename) {
                return target.indexOf(filename) > -1;
            };
        }

        afterEach(function() {
            target = [];
        });

        it("should apply extensions when specified from package", function() {

            target.push(path.resolve("./node_modules/eslint-config-foo/index.js"));

            var configDeps = {
                // Hacky: need to override isFile for each call for testing
                "resolve": {
                    sync: function(filename, opts) {
                        opts.isFile = getFileCheck();
                        return resolve.sync(filename, opts);
                    }
                }
            };

            configDeps[target[0]] = {
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

        it("should apply extensions recursively when specified from package", function() {

            target.push(path.resolve("./node_modules/eslint-config-foo/index.js"));
            target.push(path.resolve("./node_modules/eslint-config-bar/index.js"));

            var configDeps = {
                // Hacky: need to override isFile for each call for testing
                "resolve": {
                    sync: function(filename, opts) {
                        opts.isFile = getFileCheck();
                        return resolve.sync(filename, opts);
                    }
                }
            };

            configDeps[target[0]] = {
                extends: "bar",
                env: { browser: true }
            };

            configDeps[target[1]] = {
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

        var StubbedConfigFile,
            target;

        /**
         * Called by resolve.sync() to get a function that checks for a specific
         * value. This is the only way to validate that ConfigFile.resolve()
         * works without actually creating all the dummy packages for the
         * resolve package to find.
         * @returns {Function} The function to pass in as isFile to resolve.sync().
         * @private
         */
        function getFileCheck() {
            return function(filename) {
                return filename === target;
            };
        }

        beforeEach(function() {
            StubbedConfigFile = proxyquire("../../../lib/config/config-file", {
                // Hacky: need to override isFile for each call for testing
                "resolve": {
                    sync: function(filename, opts) {
                        opts.isFile = getFileCheck();
                        return resolve.sync(filename, opts);
                    }
                }
            });

        });

        describe("Relative to CWD", function() {

            leche.withData([
                [ ".eslintrc", path.resolve(".eslintrc") ],
                [ "eslint-config-foo", getCWDModulePath("eslint-config-foo") ],
                [ "foo", getCWDModulePath("eslint-config-foo") ],
                [ "eslint-configfoo", getCWDModulePath("eslint-config-eslint-configfoo") ],
                [ "@foo/eslint-config", getCWDModulePath("@foo/eslint-config") ],
                [ "@foo/bar", getCWDModulePath("@foo/eslint-config-bar") ]
            ], function(input, expected) {
                it("should return " + expected + " when passed " + input, function() {

                    // used to stub out resolve.sync
                    target = expected;

                    var result = StubbedConfigFile.resolve(input);
                    assert.equal(result, expected);
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
                [ "@foo/bar", getRelativeModulePath("@foo/eslint-config-bar", relativePath), relativePath]
            ], function(input, expected, relativeTo) {
                it("should return " + expected + " when passed " + input, function() {

                    // used to stub out resolve.sync
                    target = expected;

                    var result = StubbedConfigFile.resolve(input, relativeTo);
                    assert.equal(result, expected);
                });
            });

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
