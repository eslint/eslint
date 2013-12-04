/**
 * @fileoverview Tests for util.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    util = require("../../lib/util");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("util", function() {
    describe("when calling mixin()", function() {
        var code = function() {
            var a = {}, b = { foo: "f", bar: 1 };
            util.mixin(a, b);
            return [a, b];
        };

        it("should add properties to target object", function() {
            var a = code()[0];
            assert.equal(Object.keys(a).length, 2);
            assert.equal(a.foo, "f");
            assert.equal(a.bar, 1);
        });

        it("should not change the source object", function() {
            var b = code()[1];
            assert.equal(Object.keys(b).length, 2);
            assert.equal(b.foo, "f");
            assert.equal(b.bar, 1);
        });
    });

    describe("when calling mergeConfigs()", function() {
        var code = [
            { env: { browser: true } },
            { globals: { foo: "bar"} }
        ];

        it("should combine the two objects", function() {
            var result = util.mergeConfigs(code[0], code[1]);

            assert.equal(result.globals.foo, "bar");
            assert.isTrue(result.env.browser);
        });
    });
    describe("when merging two configs with arrays", function() {
        var code = [
            { rules: { "no-mixed-requires": [0, false] } },
            { rules: { "no-mixed-requires": [1, true] } }
        ];

        it("should combine configs and override rules", function() {
            var result = util.mergeConfigs(code[0], code[1]);

            assert.isArray(result.rules["no-mixed-requires"]);
            assert.equal(result.rules["no-mixed-requires"][0], 1);
            assert.equal(result.rules["no-mixed-requires"][1], true);
        });
    });

    describe("when merging two configs with arrays and int", function() {
        var code = [
            { rules: { "no-mixed-requires": [0, false] } },
            { rules: { "no-mixed-requires": 1 } }
        ];

        it("should combine configs and override rules", function() {
            var result = util.mergeConfigs(code[0], code[1]);

            assert.isArray(result.rules["no-mixed-requires"]);
            assert.equal(result.rules["no-mixed-requires"][0], 1);
            assert.equal(result.rules["no-mixed-requires"][1], false);
        });
    });
});
