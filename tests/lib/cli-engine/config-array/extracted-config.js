/**
 * @fileoverview Tests for ExtractedConfig class.
 * @author Toru Nagashima <https://github.com/mysticatea>
 */
"use strict";

const assert = require("assert");
const { ExtractedConfig } = require("../../../../lib/cli-engine/config-array/extracted-config");

describe("'ExtractedConfig' class", () => {
    describe("'constructor()' should create an instance.", () => {

        /** @type {ExtractedConfig} */
        let config;

        beforeEach(() => {
            config = new ExtractedConfig();
        });

        it("should have 'env' property.", () => {
            assert.deepStrictEqual(config.env, {});
        });

        it("should have 'globals' property.", () => {
            assert.deepStrictEqual(config.globals, {});
        });

        it("should have 'parser' property.", () => {
            assert.deepStrictEqual(config.parser, null);
        });

        it("should have 'parserOptions' property.", () => {
            assert.deepStrictEqual(config.parserOptions, {});
        });

        it("should have 'plugins' property.", () => {
            assert.deepStrictEqual(config.plugins, {});
        });

        it("should have 'processor' property.", () => {
            assert.deepStrictEqual(config.processor, null);
        });

        it("should have 'rules' property.", () => {
            assert.deepStrictEqual(config.rules, {});
        });

        it("should have 'settings' property.", () => {
            assert.deepStrictEqual(config.settings, {});
        });
    });

    describe("'toCompatibleObjectAsConfigFileContent()' method should return a valid config data.", () => {

        /** @type {ExtractedConfig} */
        let config;

        beforeEach(() => {
            config = new ExtractedConfig();
        });

        it("should use 'env' property as is.", () => {
            config.env = { a: true };

            const data = config.toCompatibleObjectAsConfigFileContent();

            assert.deepStrictEqual(data.env, { a: true });
        });

        it("should use 'globals' as is.", () => {
            config.globals = { a: true };

            const data = config.toCompatibleObjectAsConfigFileContent();

            assert.deepStrictEqual(data.globals, { a: true });
        });

        it("should use 'parser.filePath' for 'parser' property.", () => {
            config.parser = {
                definition: {},
                error: null,
                filePath: "/path/to/a/parser",
                id: "parser",
                importerName: "importer name",
                importerPath: "importer path"
            };

            const data = config.toCompatibleObjectAsConfigFileContent();

            assert.deepStrictEqual(data.parser, "/path/to/a/parser");
        });

        it("should use 'null' for 'parser' property if 'parser' property is 'null'.", () => {
            const data = config.toCompatibleObjectAsConfigFileContent();

            assert.deepStrictEqual(data.parser, null);
        });

        it("should use 'parserOptions' property as is.", () => {
            config.parserOptions = { a: true };

            const data = config.toCompatibleObjectAsConfigFileContent();

            assert.deepStrictEqual(data.parserOptions, { a: true });
        });

        it("should use the keys of 'plugins' property for 'plugins' property.", () => {
            config.plugins = { a: {}, b: {} };

            const data = config.toCompatibleObjectAsConfigFileContent();

            assert.deepStrictEqual(data.plugins, ["b", "a"]);
        });

        it("should not use 'processor' property.", () => {
            config.processor = "foo/.md";

            const data = config.toCompatibleObjectAsConfigFileContent();

            assert.deepStrictEqual(data.processor, void 0);
        });

        it("should use 'rules' property as is.", () => {
            config.rules = { a: 1, b: 2 };

            const data = config.toCompatibleObjectAsConfigFileContent();

            assert.deepStrictEqual(data.rules, { a: 1, b: 2 });
        });

        it("should use 'settings' property as is.", () => {
            config.settings = { a: 1 };

            const data = config.toCompatibleObjectAsConfigFileContent();

            assert.deepStrictEqual(data.settings, { a: 1 });
        });
    });
});
