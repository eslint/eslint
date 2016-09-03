/**
 * @fileoverview Tests for Plugins
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    Plugins = require("../../../lib/config/plugins");

const proxyquire = require("proxyquire").noCallThru().noPreserveCache();

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("Plugins", function() {

    describe("get", function() {

        it("should return null when plugin doesn't exist", function() {
            assert.isNull(Plugins.get("foo"));
        });
    });

    describe("load()", function() {

        let StubbedPlugins,
            Rules,
            Environments,
            plugin,
            scopedPlugin;

        beforeEach(function() {
            plugin = {};
            scopedPlugin = {};
            Environments = require("../../../lib/config/environments");
            Rules = require("../../../lib/rules");
            StubbedPlugins = proxyquire("../../../lib/config/plugins", {
                "eslint-plugin-example": plugin,
                "@scope/eslint-plugin-example": scopedPlugin,
                "./environments": Environments,
                "../rules": Rules
            });
        });

        it("should load a plugin when referenced by short name", function() {
            StubbedPlugins.load("example");
            assert.equal(StubbedPlugins.get("example"), plugin);
        });

        it("should load a plugin when referenced by long name", function() {
            StubbedPlugins.load("eslint-plugin-example");
            assert.equal(StubbedPlugins.get("example"), plugin);
        });

        it("should register environments when plugin has environments", function() {
            plugin.environments = {
                foo: {
                    globals: { foo: true }
                },
                bar: {
                    globals: { bar: false }
                }
            };

            StubbedPlugins.load("eslint-plugin-example");

            assert.deepEqual(Environments.get("example/foo"), plugin.environments.foo);
            assert.deepEqual(Environments.get("example/bar"), plugin.environments.bar);
        });

        it("should register rules when plugin has rules", function() {
            plugin.rules = {
                baz: {},
                qux: {}
            };

            StubbedPlugins.load("eslint-plugin-example");

            assert.deepEqual(Rules.get("example/baz"), plugin.rules.baz);
            assert.deepEqual(Rules.get("example/qux"), plugin.rules.qux);
        });

        it("should throw an error when a plugin has whitespace", function() {
            assert.throws(function() {
                StubbedPlugins.load("whitespace ");
            }, /Whitespace found in plugin name 'whitespace '/);
            assert.throws(function() {
                StubbedPlugins.load("whitespace\t");
            }, /Whitespace found in plugin name/);
            assert.throws(function() {
                StubbedPlugins.load("whitespace\n");
            }, /Whitespace found in plugin name/);
            assert.throws(function() {
                StubbedPlugins.load("whitespace\r");
            }, /Whitespace found in plugin name/);
        });

        it("should throw an error when a plugin doesn't exist", function() {
            assert.throws(function() {
                StubbedPlugins.load("nonexistentplugin");
            }, /Failed to load plugin/);
        });

        it("should load a scoped plugin when referenced by short name", () => {
            StubbedPlugins.load("@scope/example");
            assert.equal(StubbedPlugins.get("@scope/example"), scopedPlugin);
        });

        it("should load a scoped plugin when referenced by long name", () => {
            StubbedPlugins.load("@scope/eslint-plugin-example");
            assert.equal(StubbedPlugins.get("@scope/example"), scopedPlugin);
        });

        it("should register environments when scoped plugin has environments", () => {
            scopedPlugin.environments = {
                foo: {}
            };
            StubbedPlugins.load("@scope/eslint-plugin-example");

            assert.equal(Environments.get("@scope/example/foo"), scopedPlugin.environments.foo);
        });

        it("should register rules when scoped plugin has rules", () => {
            scopedPlugin.rules = {
                foo: {}
            };
            StubbedPlugins.load("@scope/eslint-plugin-example");

            assert.equal(Rules.get("@scope/example/foo"), scopedPlugin.rules.foo);
        });

        describe("(NOTE: those behavior will be removed by 4.0.0)", () => {
            it("should load a scoped plugin when referenced by short name, and should get the plugin even if '@scope/' is omitted", () => {
                StubbedPlugins.load("@scope/example");
                assert.equal(StubbedPlugins.get("example"), scopedPlugin);
            });

            it("should load a scoped plugin when referenced by long name, and should get the plugin even if '@scope/' is omitted", () => {
                StubbedPlugins.load("@scope/eslint-plugin-example");
                assert.equal(StubbedPlugins.get("example"), scopedPlugin);
            });

            it("should register environments when scoped plugin has environments, and should get the environment even if '@scope/' is omitted", () => {
                scopedPlugin.environments = {
                    foo: {}
                };
                StubbedPlugins.load("@scope/eslint-plugin-example");

                assert.equal(Environments.get("example/foo"), scopedPlugin.environments.foo);
            });

            it("should register rules when scoped plugin has rules, and should get the rule even if '@scope/' is omitted", () => {
                scopedPlugin.rules = {
                    foo: {}
                };
                StubbedPlugins.load("@scope/eslint-plugin-example");

                assert.equal(Rules.get("example/foo"), scopedPlugin.rules.foo);
            });
        });
    });

    describe("loadAll()", function() {

        let StubbedPlugins,
            Rules,
            Environments,
            plugin1,
            plugin2;

        beforeEach(function() {
            plugin1 = {};
            plugin2 = {};
            Environments = require("../../../lib/config/environments");
            Rules = require("../../../lib/rules");
            StubbedPlugins = proxyquire("../../../lib/config/plugins", {
                "eslint-plugin-example1": plugin1,
                "eslint-plugin-example2": plugin2,
                "./environments": Environments,
                "../rules": Rules
            });
        });

        it("should load plugins when passed multiple plugins", function() {
            StubbedPlugins.loadAll(["example1", "example2"]);
            assert.equal(StubbedPlugins.get("example1"), plugin1);
            assert.equal(StubbedPlugins.get("example2"), plugin2);
        });

        it("should load environments from plugins when passed multiple plugins", function() {
            plugin1.environments = {
                foo: {}
            };

            plugin2.environments = {
                bar: {}
            };

            StubbedPlugins.loadAll(["example1", "example2"]);
            assert.equal(Environments.get("example1/foo"), plugin1.environments.foo);
            assert.equal(Environments.get("example2/bar"), plugin2.environments.bar);
        });

        it("should load rules from plugins when passed multiple plugins", function() {
            plugin1.rules = {
                foo: {}
            };

            plugin2.rules = {
                bar: {}
            };

            StubbedPlugins.loadAll(["example1", "example2"]);
            assert.equal(Rules.get("example1/foo"), plugin1.rules.foo);
            assert.equal(Rules.get("example2/bar"), plugin2.rules.bar);
        });

    });

    describe("removePrefix()", function() {
        it("should remove common prefix when passed a plugin name  with a prefix", function() {
            const pluginName = Plugins.removePrefix("eslint-plugin-test");

            assert.equal(pluginName, "test");
        });

        it("should not modify plugin name when passed a plugin name without a prefix", function() {
            const pluginName = Plugins.removePrefix("test");

            assert.equal(pluginName, "test");
        });
    });

    describe("getNamespace()", function() {
        it("should remove namepace when passed with namepace", function() {
            const namespace = Plugins.getNamespace("@namepace/eslint-plugin-test");

            assert.equal(namespace, "@namepace/");
        });
    });

    describe("removeNamespace()", function() {
        it("should remove namepace when passed with namepace", function() {
            const namespace = Plugins.removeNamespace("@namepace/eslint-plugin-test");

            assert.equal(namespace, "eslint-plugin-test");
        });
    });

});
