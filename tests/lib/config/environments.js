/**
 * @fileoverview Tests for Environments
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    proxyquire = require("proxyquire"),
    envs = require("../../../conf/environments"),
    Environments = require("../../../lib/config/environments");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

proxyquire = proxyquire.noCallThru().noPreserveCache();

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("Environments", function() {

    describe("load()", function() {

        it("should have all default environments loaded", function() {
            Object.keys(envs).forEach(function(envName) {
                assert.deepEqual(Environments.get(envName), envs[envName]);
            });
        });

        it("should have all default environments loaded after being cleared", function() {
            Environments.testReset();

            Object.keys(envs).forEach(function(envName) {
                assert.deepEqual(Environments.get(envName), envs[envName]);
            });
        });
    });

    describe("define()", function() {

        afterEach(function() {
            Environments.testReset();
        });

        it("should add an environment with the given name", function() {
            var env = { globals: { foo: true }};

            Environments.define("foo", env);

            var result = Environments.get("foo");

            assert.deepEqual(result, env);
        });
    });

    describe("importPlugin()", function() {

        afterEach(function() {
            Environments.testReset();
        });

        it("should import all environments from a plugin object", function() {
            var plugin = {
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

            var fooEnv = Environments.get("plugin/foo"),
                barEnv = Environments.get("plugin/bar");

            assert.deepEqual(fooEnv, plugin.environments.foo);
            assert.deepEqual(barEnv, plugin.environments.bar);
        });
    });


});
