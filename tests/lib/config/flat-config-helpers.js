/**
 * @fileoverview Tests for FlatConfigArray
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const {
    parseRuleId,
    getRuleFromConfig
} = require("../../../lib/config/flat-config-helpers");
const assert = require("chai").assert;

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("Config Helpers", () => {


    describe("parseRuleId()", () => {

        it("should return plugin name and rule name for core rule", () => {
            const result = parseRuleId("foo");

            assert.deepStrictEqual(result, {
                pluginName: "@",
                ruleName: "foo"
            });
        });

        it("should return plugin name and rule name with a/b format", () => {
            const result = parseRuleId("test/foo");

            assert.deepStrictEqual(result, {
                pluginName: "test",
                ruleName: "foo"
            });
        });

        it("should return plugin name and rule name with a/b/c format", () => {
            const result = parseRuleId("node/no-unsupported-features/es-builtins");

            assert.deepStrictEqual(result, {
                pluginName: "node",
                ruleName: "no-unsupported-features/es-builtins"
            });
        });

        it("should return plugin name and rule name with @a/b/c format", () => {
            const result = parseRuleId("@test/foo/bar");

            assert.deepStrictEqual(result, {
                pluginName: "@test/foo",
                ruleName: "bar"
            });
        });
    });

    describe("getRuleFromConfig", () => {
        it("should retrieve rule from plugin in config", () => {
            const rule = {};
            const config = {
                plugins: {
                    test: {
                        rules: {
                            one: rule
                        }
                    }
                }
            };

            const result = getRuleFromConfig("test/one", config);

            assert.strictEqual(result, rule);

        });

        it("should retrieve rule from core in config", () => {
            const rule = {};
            const config = {
                plugins: {
                    "@": {
                        rules: {
                            semi: rule
                        }
                    }
                }
            };

            const result = getRuleFromConfig("semi", config);

            assert.strictEqual(result, rule);

        });
    });

});
