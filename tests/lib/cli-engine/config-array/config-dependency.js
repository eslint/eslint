/**
 * @fileoverview Tests for ConfigDependency class.
 * @author Toru Nagashima <https://github.com/mysticatea>
 */
"use strict";

const assert = require("assert");
const { Console } = require("console");
const { Writable } = require("stream");
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

    describe("'JSON.stringify(...)' should return readable JSON; not include 'definition' property", () => {
        it("should not print 'definition' property.", () => {
            const dep = new ConfigDependency({
                definition: { name: "definition?" },
                error: new Error("error?"),
                filePath: "filePath?",
                id: "id?",
                importerName: "importerName?",
                importerPath: "importerPath?"
            });

            assert.deepStrictEqual(
                JSON.parse(JSON.stringify(dep)),
                {
                    error: { message: "error?" },
                    filePath: "filePath?",
                    id: "id?",
                    importerName: "importerName?",
                    importerPath: "importerPath?"
                }
            );
        });
    });

    describe("'console.log(...)' should print readable string; not include 'defininition' property", () => {

        // Record the written strings to `output` variable.
        let output = "";
        const localConsole = new Console(
            new class extends Writable {
                write(chunk) { // eslint-disable-line class-methods-use-this
                    output += chunk;
                }
            }()
        );

        it("should not print 'definition' property.", () => {
            const error = new Error("error?"); // reuse error object to use the same stacktrace.
            const dep = new ConfigDependency({
                definition: { name: "definition?" },
                error,
                filePath: "filePath?",
                id: "id?",
                importerName: "importerName?",
                importerPath: "importerPath?"
            });

            // Make actual output.
            output = "";
            localConsole.log(dep);
            const actual = output;

            // Make expected output; no `definition` property.
            output = "";
            localConsole.log({
                error,
                filePath: "filePath?",
                id: "id?",
                importerName: "importerName?",
                importerPath: "importerPath?"
            });
            const expected = output;

            assert.strictEqual(actual, expected);
        });
    });
});
