/**
 * @fileoverview Test file for Linter class
 * @author Gyandeep Singh
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    Linter = require("../../lib/linter");

//------------------------------------------------------------------------------
// Tests
// All the core logic has been tested inside eslint.js file
// Here we will be focusing more on the mutability portion of it
//------------------------------------------------------------------------------

/**
 * extract the keys into an array
 * @param {Map} mapObj - Map type object
 * @returns {Array<*>} collection of all the keys
 * @private
 */
function extractMapKeys(mapObj) {
    const keys = [];

    for (const key of mapObj.keys()) {
        keys.push(key);
    }

    return keys;
}

describe("Linter", () => {
    describe("mutability", () => {
        let linter1 = null;
        let linter2 = null;

        beforeEach(() => {
            linter1 = new Linter();
            linter2 = new Linter();
        });

        describe("rules", () => {
            it("with no changes, same rules are loaded", () => {
                assert.sameDeepMembers(extractMapKeys(linter1.getRules()), extractMapKeys(linter2.getRules()));
            });

            it("loading rule in one doesnt change the other", () => {
                linter1.defineRule("mock-rule", () => ({}));

                assert.isTrue(linter1.getRules().has("mock-rule"), "mock rule is present");
                assert.isFalse(linter2.getRules().has("mock-rule"), "mock rule is not present");
            });
        });

        describe("environments", () => {
            it("with no changes same env are loaded", () => {
                assert.sameDeepMembers([linter1.environments.getAll()], [linter2.environments.getAll()]);
            });

            it("defining env in one doesnt change the other", () => {
                linter1.environments.define("mock-env", true);

                assert.isTrue(linter1.environments.get("mock-env"), "mock env is present");
                assert.isNull(linter2.environments.get("mock-env"), "mock env is not present");
            });
        });
    });

    describe("verifyAndFix", () => {
        it("Fixes the code", () => {
            const linter = new Linter();
            const messages = linter.verifyAndFix("var a", {
                rules: {
                    semi: 2
                }
            }, { filename: "test.js" });

            assert.equal(messages.output, "var a;", "Fixes were applied correctly");
            assert.isTrue(messages.fixed);
        });
    });
});
