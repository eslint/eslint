"use strict";

const path = require("path");
const { expect, use } = require("chai");
const chaiJestSnapshot = require("chai-jest-snapshot");
const { RuleTester } = require("../../../lib/rule-tester");

use(chaiJestSnapshot);

describe("RuleTester:generateSnapshot", () => {
    let ruleTester;

    // eslint-disable-next-line prefer-arrow-callback
    before(function() {
        chaiJestSnapshot.resetSnapshotRegistry();
    });

    beforeEach(function() {
        // eslint-disable-next-line no-invalid-this
        chaiJestSnapshot.configureUsingMochaContext(this);
        const { name } = path.parse(__filename);
        const snapshotName = path.resolve(__dirname, "./__snapshot__/", `${name}.snap.js`);

        chaiJestSnapshot.setFilename(snapshotName);
        ruleTester = new RuleTester();
    });

    it("produces the snapshot for single line", () => {
        const snapshot = ruleTester.generateSnapshot(
            require("../../fixtures/testers/rule-tester/no-eval"),
            {
                code: `
                    eval(foo)
                `
            }
        );

        expect(snapshot).to.matchSnapshot();
    });

    it("produces the snapshot for multiple lines", () => {
        const snapshot = ruleTester.generateSnapshot(
            require("../../fixtures/testers/rule-tester/no-eval"),
            {
                code: `
                    var foo = "const a = 1";
                    var a = eval(foo);
                    var bar = "const a = 2";
                    function test() {
                        return eval(bar);
                    }
                `
            }
        );

        expect(snapshot).to.matchSnapshot();
    });
});
