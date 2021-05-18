"use strict";

const assert = require("chai").assert;
const interpolate = require("../../../lib/util/interpolate");

describe("interpolate()", () => {
    it("passes through text without {{ }}", () => {
        const message = "This is a very important message!";

        assert.strictEqual(interpolate(message, {}), message);
    });
    it("passes through text with {{ }} that don’t match a key", () => {
        const message = "This is a very important {{ message }}!";

        assert.strictEqual(interpolate(message, {}), message);
    });
    it("Properly interpolates keys in {{ }}", () => {
        assert.strictEqual(interpolate("This is a very important {{ message }}!", {
            message: "test"
        }), "This is a very important test!");
    });
});
