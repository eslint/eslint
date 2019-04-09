/**
 * @fileoverview Tests for ConfigDependency class.
 * @author Toru Nagashima <https://github.com/mysticatea>
 */
"use strict";

const assert = require("assert");
const { ConfigDependency } = require("../../../../lib/cli-engine/config-array/config-dependency");

describe("ConfigDependency", () => {
    describe("'constructor(data)' should initialize properties.", () => {

        /** @type {ConfigDependency} */
        let dep;

        beforeEach(() => {
            dep = new ConfigDependency({
                definition: { name: "definition?" },
                error: new Error("error?"),
                filePath: "filePath?",
                id: "id?",
                importerName: "importerName?",
                importerPath: "importerPath?"
            });
        });

        it("should set 'data.definition' to 'definition' property.", () => {
            assert.deepStrictEqual(dep.definition, { name: "definition?" });
        });

        it("should set 'data.error' to 'error' property.", () => {
            assert.deepStrictEqual(dep.error.message, "error?");
        });

        it("should set 'data.filePath' to 'filePath' property.", () => {
            assert.deepStrictEqual(dep.filePath, "filePath?");
        });

        it("should set 'data.id' to 'id' property.", () => {
            assert.deepStrictEqual(dep.id, "id?");
        });

        it("should set 'data.importerName' to 'importerName' property.", () => {
            assert.deepStrictEqual(dep.importerName, "importerName?");
        });

        it("should set 'data.importerPath' to 'importerPath' property.", () => {
            assert.deepStrictEqual(dep.importerPath, "importerPath?");
        });
    });

    describe("'JSON.stringify(...)' should return readable JSON; not include 'definition' objects", () => {
        it("should return an object that has five properties.", () => {
            const dep = new ConfigDependency({
                definition: { name: "definition?" },
                error: new Error("error?"),
                filePath: "filePath?",
                id: "id?",
                importerName: "importerName?",
                importerPath: "importerPath?"
            });

            assert.strictEqual(
                JSON.stringify(dep),
                "{\"error\":{},\"filePath\":\"filePath?\",\"id\":\"id?\",\"importerName\":\"importerName?\",\"importerPath\":\"importerPath?\"}"
            );
        });
    });

    describe("'console.log(...)' should print readable string; not include 'Minimatch' objects", () => {
        it("should use 'toJSON()' method.", () => {
            const dep = new ConfigDependency({
                definition: { name: "definition?" },
                error: new Error("error?"),
                filePath: "filePath?",
                id: "id?",
                importerName: "importerName?",
                importerPath: "importerPath?"
            });
            let called = false;

            dep.toJSON = () => {
                called = true;
                return "";
            };

            console.log(dep); // eslint-disable-line no-console

            assert(called);
        });
    });
});
