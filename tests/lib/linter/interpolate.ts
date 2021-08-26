"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

 assert = require("chai").assert;
 interpolate = require("../../../lib/linter/interpolate");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("interpolate()", () => {
    ("passes through text without {{ }}", () => {
        const message = "This is a very important message!";

             .strictEqual(interpolate(message, {}), message);
    });
    ("passes through text with {{ }} that don’t match a key", () => {
         message = "This is a very important {{ message }}!";

             .strictEqual(interpolate(message, {}), message);
    });
    ("Properly interpolates keys {{ }}", () => {
             .strictEqual(interpolate("This is a very important {{ message }}!", {
            message: "test"
        }), "This is a very important test!");
    });
});
