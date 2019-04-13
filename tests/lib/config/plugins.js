/**
 * @fileoverview Tests for Plugins
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    path = require("path"),
    Plugins = require("../../../lib/config/plugins"),
    Environments = require("../../../lib/config/environments");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("Plugins", () => {

    describe("get", () => {

        it("should return null when plugin doesn't exist", () => {
            assert.isNull((new Plugins(new Environments(), { defineRule: () => {}, pluginRootPath: process.cwd() })).get("foo"));
        });
    });

    describe("load()", () => {

        let RelativeLoadedPlugins,
            rules,
            environments,
            plugin,
            scopedPlugin;

        beforeEach(() => {
            plugin = require("../../fixtures/plugins/node_modules/eslint-plugin-example");
            scopedPlugin = require("../../fixtures/plugins/node_modules/@scope/eslint-plugin-example");
            environments = new Environments();
            rules = new Map();
            RelativeLoadedPlugins = new Plugins(environments, {
                defineRule: rules.set.bind(rules),
                pluginRootPath: path.resolve(__dirname, "..", "..", "fixtures", "plugins")
            });
        });

        it("should load a plugin when referenced by short name", () => {
            RelativeLoadedPlugins.load("example");
            assert.strictEqual(RelativeLoadedPlugins.get("example"), plugin);
        });

        it("should load a plugin when referenced by long name", () => {
            RelativeLoadedPlugins.load("eslint-plugin-example");
            assert.strictEqual(RelativeLoadedPlugins.get("example"), plugin);
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

            RelativeLoadedPlugins.load("eslint-plugin-example");

            assert.deepStrictEqual(environments.get("example/foo"), plugin.environments.foo);
            assert.deepStrictEqual(environments.get("example/bar"), plugin.environments.bar);
        });

        it("should register rules when plugin has rules", () => {
            plugin.rules = {
                baz: {},
                qux: {}
            };

            RelativeLoadedPlugins.load("eslint-plugin-example");

            assert.deepStrictEqual(rules.get("example/baz"), plugin.rules.baz);
            assert.deepStrictEqual(rules.get("example/qux"), plugin.rules.qux);
        });

        it("should throw an error when a plugin has whitespace", () => {
            assert.throws(() => {
                RelativeLoadedPlugins.load("whitespace ");
            }, /Whitespace found in plugin name 'whitespace '/u);
            assert.throws(() => {
                RelativeLoadedPlugins.load("whitespace\t");
            }, /Whitespace found in plugin name/u);
            assert.throws(() => {
                RelativeLoadedPlugins.load("whitespace\n");
            }, /Whitespace found in plugin name/u);
            assert.throws(() => {
                RelativeLoadedPlugins.load("whitespace\r");
            }, /Whitespace found in plugin name/u);
        });

        it("should throw an error when a plugin doesn't exist", () => {
            assert.throws(() => {
                RelativeLoadedPlugins.load("nonexistentplugin");
            }, /Failed to load plugin/u);
        });

        it("should rethrow an error that a plugin throws on load", () => {
            try {
                RelativeLoadedPlugins.load("throws-on-load");
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
            RelativeLoadedPlugins.load("@scope/example");
            assert.strictEqual(RelativeLoadedPlugins.get("@scope/example"), scopedPlugin);
        });

        it("should load a scoped plugin when referenced by long name", () => {
            RelativeLoadedPlugins.load("@scope/eslint-plugin-example");
            assert.strictEqual(RelativeLoadedPlugins.get("@scope/example"), scopedPlugin);
        });

        it("should register environments when scoped plugin has environments", () => {
            scopedPlugin.environments = {
                foo: {}
            };
            RelativeLoadedPlugins.load("@scope/eslint-plugin-example");

            assert.strictEqual(environments.get("@scope/example/foo"), scopedPlugin.environments.foo);
        });

        it("should register rules when scoped plugin has rules", () => {
            scopedPlugin.rules = {
                foo: {}
            };
            RelativeLoadedPlugins.load("@scope/eslint-plugin-example");

            assert.strictEqual(rules.get("@scope/example/foo"), scopedPlugin.rules.foo);
        });

        describe("when referencing a scope plugin and omitting @scope/", () => {
            it("should load a scoped plugin when referenced by short name, but should not get the plugin if '@scope/' is omitted", () => {
                RelativeLoadedPlugins.load("@scope/example");
                assert.strictEqual(RelativeLoadedPlugins.get("example"), null);
            });

            it("should load a scoped plugin when referenced by long name, but should not get the plugin if '@scope/' is omitted", () => {
                RelativeLoadedPlugins.load("@scope/eslint-plugin-example");
                assert.strictEqual(RelativeLoadedPlugins.get("example"), null);
            });

            it("should register environments when scoped plugin has environments, but should not get the environment if '@scope/' is omitted", () => {
                scopedPlugin.environments = {
                    foo: {}
                };
                RelativeLoadedPlugins.load("@scope/eslint-plugin-example");

                assert.strictEqual(environments.get("example/foo"), null);
            });

            it("should register rules when scoped plugin has rules, but should not get the rule if '@scope/' is omitted", () => {
                scopedPlugin.rules = {
                    foo: {}
                };
                RelativeLoadedPlugins.load("@scope/eslint-plugin-example");

                assert.isFalse(rules.has("example/foo"));
            });
        });
    });

    describe("loadAll()", () => {

        let RelativeLoadedPlugins,
            plugin1,
            plugin2,
            rules;
        const environments = new Environments();

        beforeEach(() => {
            plugin1 = require("../../fixtures/plugins/node_modules/eslint-plugin-example1");
            plugin2 = require("../../fixtures/plugins/node_modules/eslint-plugin-example2");
            rules = new Map();
            RelativeLoadedPlugins = new Plugins(environments, {
                defineRule: rules.set.bind(rules),
                pluginRootPath: path.resolve(__dirname, "..", "..", "fixtures", "plugins")
            });
        });

        it("should load plugins when passed multiple plugins", () => {
            RelativeLoadedPlugins.loadAll(["example1", "example2"]);
            assert.strictEqual(RelativeLoadedPlugins.get("example1"), plugin1);
            assert.strictEqual(RelativeLoadedPlugins.get("example2"), plugin2);
        });

        it("should load environments from plugins when passed multiple plugins", () => {
            plugin1.environments = {
                foo: {}
            };

            plugin2.environments = {
                bar: {}
            };

            RelativeLoadedPlugins.loadAll(["example1", "example2"]);
            assert.strictEqual(environments.get("example1/foo"), plugin1.environments.foo);
            assert.strictEqual(environments.get("example2/bar"), plugin2.environments.bar);
        });

        it("should load rules from plugins when passed multiple plugins", () => {
            plugin1.rules = {
                foo: {}
            };

            plugin2.rules = {
                bar: {}
            };

            RelativeLoadedPlugins.loadAll(["example1", "example2"]);
            assert.strictEqual(rules.get("example1/foo"), plugin1.rules.foo);
            assert.strictEqual(rules.get("example2/bar"), plugin2.rules.bar);
        });

        it("should throw an error if plugins is not an array", () => {
            assert.throws(() => RelativeLoadedPlugins.loadAll("example1"), "\"plugins\" value must be an array");
        });

    });
});
