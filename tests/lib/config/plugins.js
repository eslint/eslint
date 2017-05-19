/**
 * @fileoverview Tests for Plugins
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    Plugins = require("../../../lib/config/plugins"),
    Rules = require("../../../lib/rules"),
    Environments = require("../../../lib/config/environments");

const proxyquire = require("proxyquire").noCallThru().noPreserveCache();

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("Plugins", () => {

    describe("get", () => {

        it("should return null when plugin doesn't exist", () => {
            assert.isNull((new Plugins(new Environments(), new Rules())).get("foo"));
        });
    });

    describe("load()", () => {

        let StubbedPlugins,
            rules,
            environments,
            plugin,
            scopedPlugin;

        beforeEach(() => {
            plugin = {};
            scopedPlugin = {};
            rules = new Rules();
            environments = new Environments();
            StubbedPlugins = new (proxyquire("../../../lib/config/plugins", {
                "eslint-plugin-example": plugin,
                "@scope/eslint-plugin-example": scopedPlugin,
                "eslint-plugin-throws-on-load": {
                    get rules() {
                        throw new Error("error thrown while loading this module");
                    }
                }
            }))(environments, rules);
        });

        it("should load a plugin when referenced by short name", () => {
            StubbedPlugins.load("example");
            assert.equal(StubbedPlugins.get("example"), plugin);
        });

        it("should load a plugin when referenced by long name", () => {
            StubbedPlugins.load("eslint-plugin-example");
            assert.equal(StubbedPlugins.get("example"), plugin);
        });

        it("should register environments when plugin has environments", () => {
            plugin.environments = {
                foo: {
                    globals: { foo: true }
                },
                bar: {
                    globals: { bar: false }
                }
            };

            StubbedPlugins.load("eslint-plugin-example");

            assert.deepEqual(environments.get("example/foo"), plugin.environments.foo);
            assert.deepEqual(environments.get("example/bar"), plugin.environments.bar);
        });

        it("should register rules when plugin has rules", () => {
            plugin.rules = {
                baz: {},
                qux: {}
            };

            StubbedPlugins.load("eslint-plugin-example");

            assert.deepEqual(rules.get("example/baz"), plugin.rules.baz);
            assert.deepEqual(rules.get("example/qux"), plugin.rules.qux);
        });

        it("should throw an error when a plugin has whitespace", () => {
            assert.throws(() => {
                StubbedPlugins.load("whitespace ");
            }, /Whitespace found in plugin name 'whitespace '/);
            assert.throws(() => {
                StubbedPlugins.load("whitespace\t");
            }, /Whitespace found in plugin name/);
            assert.throws(() => {
                StubbedPlugins.load("whitespace\n");
            }, /Whitespace found in plugin name/);
            assert.throws(() => {
                StubbedPlugins.load("whitespace\r");
            }, /Whitespace found in plugin name/);
        });

        it("should throw an error when a plugin doesn't exist", () => {
            assert.throws(() => {
                StubbedPlugins.load("nonexistentplugin");
            }, /Failed to load plugin/);
        });

        it("should rethrow an error that a plugin throws on load", () => {
            try {
                StubbedPlugins.load("throws-on-load");
            } catch (err) {
                assert.strictEqual(
                    err.message,
                    "error thrown while loading this module",
                    "should rethrow the same error that was thrown on plugin load"
                );

                return;
            }
            assert.fail(null, null, "should throw an error if a plugin fails to load");
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

            assert.equal(environments.get("@scope/example/foo"), scopedPlugin.environments.foo);
        });

        it("should register rules when scoped plugin has rules", () => {
            scopedPlugin.rules = {
                foo: {}
            };
            StubbedPlugins.load("@scope/eslint-plugin-example");

            assert.equal(rules.get("@scope/example/foo"), scopedPlugin.rules.foo);
        });

        describe("when referencing a scope plugin and omitting @scope/", () => {
            it("should load a scoped plugin when referenced by short name, but should not get the plugin if '@scope/' is omitted", () => {
                StubbedPlugins.load("@scope/example");
                assert.equal(StubbedPlugins.get("example"), null);
            });

            it("should load a scoped plugin when referenced by long name, but should not get the plugin if '@scope/' is omitted", () => {
                StubbedPlugins.load("@scope/eslint-plugin-example");
                assert.equal(StubbedPlugins.get("example"), null);
            });

            it("should register environments when scoped plugin has environments, but should not get the environment if '@scope/' is omitted", () => {
                scopedPlugin.environments = {
                    foo: {}
                };
                StubbedPlugins.load("@scope/eslint-plugin-example");

                assert.equal(environments.get("example/foo"), null);
            });

            it("should register rules when scoped plugin has rules, but should not get the rule if '@scope/' is omitted", () => {
                scopedPlugin.rules = {
                    foo: {}
                };
                StubbedPlugins.load("@scope/eslint-plugin-example");

                assert.equal(rules.get("example/foo"), null);
            });
        });
    });

    describe("loadAll()", () => {

        let StubbedPlugins,
            plugin1,
            plugin2;
        const rules = new Rules(),
            environments = new Environments();

        beforeEach(() => {
            plugin1 = {};
            plugin2 = {};
            StubbedPlugins = new (proxyquire("../../../lib/config/plugins", {
                "eslint-plugin-example1": plugin1,
                "eslint-plugin-example2": plugin2
            }))(environments, rules);
        });

        it("should load plugins when passed multiple plugins", () => {
            StubbedPlugins.loadAll(["example1", "example2"]);
            assert.equal(StubbedPlugins.get("example1"), plugin1);
            assert.equal(StubbedPlugins.get("example2"), plugin2);
        });

        it("should load environments from plugins when passed multiple plugins", () => {
            plugin1.environments = {
                foo: {}
            };

            plugin2.environments = {
                bar: {}
            };

            StubbedPlugins.loadAll(["example1", "example2"]);
            assert.equal(environments.get("example1/foo"), plugin1.environments.foo);
            assert.equal(environments.get("example2/bar"), plugin2.environments.bar);
        });

        it("should load rules from plugins when passed multiple plugins", () => {
            plugin1.rules = {
                foo: {}
            };

            plugin2.rules = {
                bar: {}
            };

            StubbedPlugins.loadAll(["example1", "example2"]);
            assert.equal(rules.get("example1/foo"), plugin1.rules.foo);
            assert.equal(rules.get("example2/bar"), plugin2.rules.bar);
        });

    });

    describe("removePrefix()", () => {
        it("should remove common prefix when passed a plugin name  with a prefix", () => {
            const pluginName = Plugins.removePrefix("eslint-plugin-test");

            assert.equal(pluginName, "test");
        });

        it("should not modify plugin name when passed a plugin name without a prefix", () => {
            const pluginName = Plugins.removePrefix("test");

            assert.equal(pluginName, "test");
        });
    });

    describe("getNamespace()", () => {
        it("should remove namepace when passed with namepace", () => {
            const namespace = Plugins.getNamespace("@namepace/eslint-plugin-test");

            assert.equal(namespace, "@namepace/");
        });
    });

    describe("removeNamespace()", () => {
        it("should remove namepace when passed with namepace", () => {
            const namespace = Plugins.removeNamespace("@namepace/eslint-plugin-test");

            assert.equal(namespace, "eslint-plugin-test");
        });
    });

});
