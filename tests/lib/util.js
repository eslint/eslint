/**
 * @fileoverview Tests for util.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
    assert = require("assert"),
    util = require("../../lib/util");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe("util").addBatch({

    "when calling mixin()": {
        topic: function() {
            var a = {}, b = { foo: "f", bar: 1 };
            util.mixin(a, b);
            return [a, b];
        },

        "should add properties to target object": function(topic) {
            var a = topic[0];
            assert.equal(Object.keys(a).length, 2);
            assert.equal(a.foo, "f");
            assert.equal(a.bar, 1);
        },

        "should not change the source object": function(topic) {
            var b = topic[1];
            assert.equal(Object.keys(b).length, 2);
            assert.equal(b.foo, "f");
            assert.equal(b.bar, 1);
        }

    },

    "when calling mergeConfigs()": {
        topic: [
            { env: { browser: true } },
            { globals: { foo: "bar"} }
        ],

        "should combine the two objects": function(topic) {
            var result = util.mergeConfigs(topic[0], topic[1]);

            assert.equal(result.globals.foo, "bar");
            assert.isTrue(result.env.browser);
        }

    }

}).export(module);
