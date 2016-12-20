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

    describe("load()", () => {

        it("should have all default environments loaded", () => {
            Object.keys(envs).forEach(envName => {
                assert.deepEqual(Environments.get(envName), envs[envName]);
            });
        });

        it("should have all default environments loaded after being cleared", () => {
            Environments.testReset();

            Object.keys(envs).forEach(envName => {
                assert.deepEqual(Environments.get(envName), envs[envName]);
            });
        });
    });

    describe("define()", () => {

        afterEach(() => {
            Environments.testReset();
        });

        it("should add an environment with the given name", () => {
            const env = { globals: { foo: true } };

            Environments.define("foo", env);

            const result = Environments.get("foo");

            assert.deepEqual(result, env);
        });
    });

    describe("importPlugin()", () => {

        afterEach(() => {
            Environments.testReset();
        });

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

            Environments.importPlugin(plugin, "plugin");

            const fooEnv = Environments.get("plugin/foo"),
                barEnv = Environments.get("plugin/bar");

            assert.deepEqual(fooEnv, plugin.environments.foo);
            assert.deepEqual(barEnv, plugin.environments.bar);
        });
    });


});
