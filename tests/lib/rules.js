/**
 * @fileoverview Tests for rules.
 * @author Patrick Brosset
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    rules = require("../../lib/rules");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("rules", () => {

    beforeEach(() => {
        rules.testClear();
    });

    afterEach(() => {
        rules.load();
    });

    describe("when given an invalid rules directory", () => {
        const code = "invaliddir";

        it("should log an error and exit", () => {
            assert.throws(() => {
                rules.load(code);
            });
        });
    });

    describe("when given a valid rules directory", () => {
        const code = "tests/fixtures/rules";

        it("should load rules and not log an error or exit", () => {
            assert.equal(typeof rules.get("fixture-rule"), "undefined");
            rules.load(code, process.cwd());
            assert.equal(typeof rules.get("fixture-rule"), "object");
        });
    });

    describe("when a rule has been defined", () => {
        it("should be able to retrieve the rule", () => {
            const ruleId = "michaelficarra";

            rules.define(ruleId, {});
            assert.ok(rules.get(ruleId));
        });
    });

    describe("when importing plugin rules", () => {
        const customPlugin = {
                rules: {
                    "custom-rule"() { }
                }
            },
            pluginName = "custom-plugin";

        it("should define all plugin rules with a qualified rule id", () => {
            rules.importPlugin(customPlugin, pluginName);

            assert.isDefined(rules.get("custom-plugin/custom-rule"));
            assert.equal(rules.get("custom-plugin/custom-rule"), customPlugin.rules["custom-rule"]);
        });
    });
});
