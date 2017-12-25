/**
 * @fileoverview Tests for RuleTester without any test runner
 * @author Weijia Wang <starkwang@126.com>
 */
"use strict";

/* global describe, it */
/* eslint-disable no-global-assign*/
const assert = require("assert"),
    RuleTester = require("../../../lib/testers/rule-tester");
const tmpIt = it;
const tmpDescribe = describe;

it = null;
describe = null;

const ruleTester = new RuleTester();

assert.throws(() => {
    ruleTester.run("no-var", require("../../fixtures/testers/rule-tester/no-var"), {
        valid: [
            "bar = baz;"
        ],
        invalid: [
            { code: "var foo = bar;", output: "invalid output", errors: 1 }
        ]
    });
}, /' foo = bar;' == 'invalid output'/);

it = tmpIt;
describe = tmpDescribe;
