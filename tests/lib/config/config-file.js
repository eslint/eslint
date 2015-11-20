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
    yaml = require("js-yaml"),
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

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ConfigFile", function() {

    describe("CONFIG_FILES", function() {
        it("should be present when imported", function() {
            assert.isTrue(Array.isArray(ConfigFile.CONFIG_FILES));
        });
    });

    describe("applyExtends", function() {

        it("should apply extensions when specified from package", function() {

            var StubbedConfigFile = proxyquire("../../../lib/config/config-file", {
                "eslint-config-foo": {
                    env: { browser: true }
                }
            });

            var config = StubbedConfigFile.applyExtends({
                extends: "foo",
                rules: { eqeqeq: 2 }
            }, "/whatever");

            assert.deepEqual(config, {
                extends: "foo",
                ecmaFeatures: {},
                env: { browser: true },
                globals: environments.browser.globals,
                rules: { eqeqeq: 2 }
            });

        });

        it("should apply extensions recursively when specified from package", function() {

            var StubbedConfigFile = proxyquire("../../../lib/config/config-file", {
                "eslint-config-foo": {
                    extends: "bar",
                    env: { browser: true }
                },
                "eslint-config-bar": {
                    rules: {
                        bar: 2
                    }
                }
            });

            var config = StubbedConfigFile.applyExtends({
                extends: "foo",
                rules: { eqeqeq: 2 }
            }, "/whatever");

            assert.deepEqual(config, {
                extends: "foo",
                ecmaFeatures: {},
                env: { browser: true },
                globals: environments.browser.globals,
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
                ecmaFeatures: {},
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
                ecmaFeatures: {},
                env: { browser: true },
                globals: environments.browser.globals,
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
                ecmaFeatures: {},
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
                ecmaFeatures: environments.es6.ecmaFeatures,
                env: { es6: true },
                globals: {},
                rules: {
                    eqeqeq: 2
                }
            });

        });

    });

    describe("load", function() {

        it("should load information from a legacy file", function() {
            var config = ConfigFile.load(getFixturePath("legacy/.eslintrc"));
            assert.deepEqual(config, {
                ecmaFeatures: {},
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
                ecmaFeatures: {},
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
                ecmaFeatures: {},
                env: {},
                globals: {},
                rules: {
                    quotes: [2, "double"]
                }
            });
        });

        it("should load information from a package.json file", function() {
            var config = ConfigFile.load(getFixturePath("package-json/package.json"));
            assert.deepEqual(config, {
                ecmaFeatures: environments.es6.ecmaFeatures,
                env: { es6: true },
                globals: {},
                rules: {}
            });
        });

        it("should load information from a YAML file", function() {
            var config = ConfigFile.load(getFixturePath("yaml/.eslintrc.yaml"));
            assert.deepEqual(config, {
                ecmaFeatures: {},
                env: { browser: true },
                globals: environments.browser.globals,
                rules: {}
            });
        });

        it("should load information from a YML file", function() {
            var config = ConfigFile.load(getFixturePath("yml/.eslintrc.yml"));
            assert.deepEqual(config, {
                ecmaFeatures: { globalReturn: true },
                env: { node: true },
                globals: environments.node.globals,
                rules: {}
            });
        });

        it("should load information from a YML file and apply extensions", function() {
            var config = ConfigFile.load(getFixturePath("extends/.eslintrc.yml"));
            assert.deepEqual(config, {
                extends: "../package-json/package.json",
                ecmaFeatures: environments.es6.ecmaFeatures,
                env: { es6: true },
                globals: {},
                rules: { booya: 2 }
            });
        });

    });

    describe("resolve()", function() {

        leche.withData([
            [ ".eslintrc", path.resolve(".eslintrc") ],
            [ "eslint-config-foo", "eslint-config-foo" ],
            [ "foo", "eslint-config-foo" ],
            [ "eslint-configfoo", "eslint-config-eslint-configfoo" ],
            [ "@foo/eslint-config", "@foo/eslint-config" ],
            [ "@foo/bar", "@foo/eslint-config-bar" ]
        ], function(input, expected) {
            it("should return " + expected + " when passed " + input, function() {
                var result = ConfigFile.resolve(input);
                assert.equal(result, expected);
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
    });

});
