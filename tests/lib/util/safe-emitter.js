/**
 * @fileoverview Tests for safe-emitter
 * @author Teddy Katz
 */

"use strict";

const createEmitter = require("../../../lib/util/safe-emitter");
const assert = require("chai").assert;

describe("safe-emitter", () => {
    describe("emit() and on()", () => {
        it("allows listeners to be registered calls them when emitted", () => {
            const emitter = createEmitter();
            const colors = [];

            emitter.on("foo", () => colors.push("red"));
            emitter.on("foo", () => colors.push("blue"));
            emitter.on("bar", () => colors.push("green"));

            emitter.emit("foo");
            assert.deepStrictEqual(colors, ["red", "blue"]);

            emitter.on("bar", color => colors.push(color));
            emitter.emit("bar", "yellow");

            assert.deepStrictEqual(colors, ["red", "blue", "green", "yellow"]);
        });

        it("calls listeners with no `this` value", () => {
            const emitter = createEmitter();
            let called = false;

            emitter.on("foo", function() {
                assert.strictEqual(this, void 0); // eslint-disable-line no-invalid-this
                called = true;
            });

            emitter.emit("foo");
            assert(called);
        });
    });
});
