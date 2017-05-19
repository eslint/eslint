/**
 * @fileoverview Tests for Environments
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    envs = require("../../../conf/environments"),
    Environments = require("../../../lib/config/environments");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("Environments", () => {
    let environments = null;

    beforeEach(() => {
        environments = new Environments();
    });

    describe("load()", () => {

        it("should have all default environments loaded", () => {
            Object.keys(envs).forEach(envName => {
                assert.deepEqual(environments.get(envName), envs[envName]);
            });
        });
    });

    describe("define()", () => {
        it("should add an environment with the given name", () => {
            const env = { globals: { foo: true } };

            environments.define("foo", env);

            const result = environments.get("foo");

            assert.deepEqual(result, env);
        });
    });

    describe("importPlugin()", () => {
        it("should import all environments from a plugin object", () => {
            const plugin = {
                environments: {
                    foo: {
                        globals: { foo: true }
                    },
                    bar: {
                        globals: { bar: true }
                    }
                }
            };

            environments.importPlugin(plugin, "plugin");

            const fooEnv = environments.get("plugin/foo"),
                barEnv = environments.get("plugin/bar");

            assert.deepEqual(fooEnv, plugin.environments.foo);
            assert.deepEqual(barEnv, plugin.environments.bar);
        });
    });
});
