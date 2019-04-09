/**
 * @fileoverview Tests for ConfigOps
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    leche = require("leche"),
    util = require("util"),
    ConfigOps = require("../../../lib/config/config-ops");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ConfigOps", () => {

    describe("getRuleSeverity()", () => {
        const EXPECTED_RESULTS = new Map([
            [0, 0],
            [1, 1],
            [2, 2],
            [[0], 0],
            [[1], 1],
            [[2], 2],
            ["off", 0],
            ["warn", 1],
            ["error", 2],
            [["off"], 0],
            [["warn"], 1],
            [["error"], 2],
            ["OFF", 0],
            ["wArN", 1],
            [["ErRoR"], 2],
            ["invalid config", 0],
            [["invalid config"], 0],
            [3, 0],
            [[3], 0],
            [1.5, 0],
            [[1.5], 0]
        ]);

        for (const key of EXPECTED_RESULTS.keys()) {
            it(`returns ${util.inspect(EXPECTED_RESULTS.get(key))} for ${util.inspect(key)}`, () => {
                assert.strictEqual(ConfigOps.getRuleSeverity(key), EXPECTED_RESULTS.get(key));
            });
        }
    });

    describe("normalizeToStrings()", () => {
        it("should convert 2 rule setting to error when rule has just a severity", () => {
            const config = {
                rules: {
                    foo: 2,
                    bar: 2
                }
            };

            ConfigOps.normalizeToStrings(config);

            assert.deepStrictEqual(config, {
                rules: {
                    foo: "error",
                    bar: "error"
                }
            });
        });

        it("should convert 2 rule setting to error when rule has array with severity", () => {
            const config = {
                rules: {
                    foo: [2, "something"],
                    bar: 2
                }
            };

            ConfigOps.normalizeToStrings(config);

            assert.deepStrictEqual(config, {
                rules: {
                    foo: ["error", "something"],
                    bar: "error"
                }
            });
        });

        it("should convert 1 rule setting to warn when rule has just a severity", () => {
            const config = {
                rules: {
                    foo: 1,
                    bar: 1
                }
            };

            ConfigOps.normalizeToStrings(config);

            assert.deepStrictEqual(config, {
                rules: {
                    foo: "warn",
                    bar: "warn"
                }
            });
        });

        it("should convert 1 rule setting to warn when rule has array with severity", () => {
            const config = {
                rules: {
                    foo: [1, "something"],
                    bar: 1
                }
            };

            ConfigOps.normalizeToStrings(config);

            assert.deepStrictEqual(config, {
                rules: {
                    foo: ["warn", "something"],
                    bar: "warn"
                }
            });
        });

        it("should convert 0 rule setting to off when rule has just a severity", () => {
            const config = {
                rules: {
                    foo: 0,
                    bar: 0
                }
            };

            ConfigOps.normalizeToStrings(config);

            assert.deepStrictEqual(config, {
                rules: {
                    foo: "off",
                    bar: "off"
                }
            });
        });

        it("should convert 0 rule setting to off when rule has array with severity", () => {
            const config = {
                rules: {
                    foo: [0, "something"],
                    bar: 0
                }
            };

            ConfigOps.normalizeToStrings(config);

            assert.deepStrictEqual(config, {
                rules: {
                    foo: ["off", "something"],
                    bar: "off"
                }
            });
        });

        it("should convert 256 rule setting to off when rule has just a severity", () => {
            const config = {
                rules: {
                    foo: 256,
                    bar: 256
                }
            };

            ConfigOps.normalizeToStrings(config);

            assert.deepStrictEqual(config, {
                rules: {
                    foo: "off",
                    bar: "off"
                }
            });
        });

        it("should convert 256 rule setting to off when rule has array with severity", () => {
            const config = {
                rules: {
                    foo: [256, "something"],
                    bar: 256
                }
            };

            ConfigOps.normalizeToStrings(config);

            assert.deepStrictEqual(config, {
                rules: {
                    foo: ["off", "something"],
                    bar: "off"
                }
            });
        });
    });

    describe("isError()", () => {

        leche.withData([
            ["error", true],
            ["Error", true],
            [2, true],
            [["error"], true],
            [["erRor"], true],
            [[2], true],
            [["error", "foo"], true],
            [["eRror", "bar"], true],
            [[2, "baz"], true]
        ], (input, expected) => {

            it(`should return ${expected}when passed ${input}`, () => {
                const result = ConfigOps.isErrorSeverity(input);

                assert.strictEqual(result, expected);
            });

        });

    });

    describe("normalizeConfigGlobal", () => {
        [
            ["off", "off"],
            [true, "writeable"],
            ["true", "writeable"],
            [false, "readable"],
            ["false", "readable"],
            [null, "readable"],
            ["writeable", "writeable"],
            ["writable", "writeable"],
            ["readable", "readable"],
            ["readonly", "readable"],
            ["writable", "writeable"]
        ].forEach(([input, output]) => {
            it(util.inspect(input), () => {
                assert.strictEqual(ConfigOps.normalizeConfigGlobal(input), output);
            });
        });

        it("throws on other inputs", () => {
            assert.throws(
                () => ConfigOps.normalizeConfigGlobal("something else"),
                /^'something else' is not a valid configuration for a global \(use 'readonly', 'writable', or 'off'\)$/u
            );
        });
    });
});
