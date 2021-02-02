/**
 * @fileoverview Tests for configInitializer.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    fs = require("fs"),
    path = require("path"),
    os = require("os"),
    sinon = require("sinon"),
    sh = require("shelljs"),
    espree = require("espree"),
    autoconfig = require("../../../lib/init/autoconfig"),
    npmUtils = require("../../../lib/init/npm-utils");

const originalDir = process.cwd();
const proxyquire = require("proxyquire").noPreserveCache();

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

let answers = {};

describe("configInitializer", () => {

    let fixtureDir,
        npmCheckStub,
        npmInstallStub,
        npmFetchPeerDependenciesStub,
        init,
        localESLintVersion = null;

    const log = {
        info: sinon.spy(),
        error: sinon.spy()
    };
    const requireStubs = {
        "../shared/logging": log,
        "../shared/relative-module-resolver": {
            resolve() {
                if (localESLintVersion) {
                    return `local-eslint-${localESLintVersion}`;
                }
                throw new Error("Cannot find module");
            }
        },
        "local-eslint-3.18.0": { linter: { version: "3.18.0" }, "@noCallThru": true },
        "local-eslint-3.19.0": { linter: { version: "3.19.0" }, "@noCallThru": true },
        "local-eslint-4.0.0": { linter: { version: "4.0.0" }, "@noCallThru": true }
    };

    /**
     * Returns the path inside of the fixture directory.
     * @param {...string} args file path segments.
     * @returns {string} The path inside the fixture directory.
     * @private
     */
    function getFixturePath(...args) {
        const filepath = path.join(fixtureDir, ...args);

        try {
            return fs.realpathSync(filepath);
        } catch {
            return filepath;
        }
    }

    // copy into clean area so as not to get "infected" by this project's .eslintrc files
    before(() => {
        fixtureDir = path.join(os.tmpdir(), "eslint/fixtures/config-initializer");
        sh.mkdir("-p", fixtureDir);
        sh.cp("-r", "./tests/fixtures/config-initializer/.", fixtureDir);
        fixtureDir = fs.realpathSync(fixtureDir);
    });

    beforeEach(() => {
        npmInstallStub = sinon.stub(npmUtils, "installSyncSaveDev");
        npmCheckStub = sinon.stub(npmUtils, "checkDevDeps").callsFake(packages => packages.reduce((status, pkg) => {
            status[pkg] = false;
            return status;
        }, {}));
        npmFetchPeerDependenciesStub = sinon
            .stub(npmUtils, "fetchPeerDependencies")
            .returns({
                eslint: "^3.19.0",
                "eslint-plugin-jsx-a11y": "^5.0.1",
                "eslint-plugin-import": "^2.2.0",
                "eslint-plugin-react": "^7.0.1"
            });
        init = proxyquire("../../../lib/init/config-initializer", requireStubs);
    });

    afterEach(() => {
        log.info.resetHistory();
        log.error.resetHistory();
        npmInstallStub.restore();
        npmCheckStub.restore();
        npmFetchPeerDependenciesStub.restore();
    });

    after(() => {
        sh.rm("-r", fixtureDir);
    });

    describe("processAnswers()", () => {

        describe("prompt", () => {

            beforeEach(() => {
                answers = {
                    purpose: "style",
                    source: "prompt",
                    extendDefault: true,
                    indent: 2,
                    quotes: "single",
                    linebreak: "unix",
                    semi: true,
                    moduleType: "esm",
                    es6Globals: true,
                    env: ["browser"],
                    format: "JSON"
                };
            });

            it("should create default config", () => {
                const config = init.processAnswers(answers);

                assert.deepStrictEqual(config.rules.indent, ["error", 2]);
                assert.deepStrictEqual(config.rules.quotes, ["error", "single"]);
                assert.deepStrictEqual(config.rules["linebreak-style"], ["error", "unix"]);
                assert.deepStrictEqual(config.rules.semi, ["error", "always"]);
                assert.strictEqual(config.env.es2021, true);
                assert.strictEqual(config.parserOptions.ecmaVersion, espree.latestEcmaVersion);
                assert.strictEqual(config.parserOptions.sourceType, "module");
                assert.strictEqual(config.env.browser, true);
                assert.strictEqual(config.extends, "eslint:recommended");
            });

            it("should disable semi", () => {
                answers.semi = false;
                const config = init.processAnswers(answers);

                assert.deepStrictEqual(config.rules.semi, ["error", "never"]);
            });

            it("should enable react plugin", () => {
                answers.framework = "react";
                const config = init.processAnswers(answers);

                assert.strictEqual(config.parserOptions.ecmaFeatures.jsx, true);
                assert.strictEqual(config.parserOptions.ecmaVersion, espree.latestEcmaVersion);
                assert.deepStrictEqual(config.plugins, ["react"]);
            });

            it("should enable vue plugin", () => {
                answers.framework = "vue";
                const config = init.processAnswers(answers);

                assert.strictEqual(config.parserOptions.ecmaVersion, espree.latestEcmaVersion);
                assert.deepStrictEqual(config.plugins, ["vue"]);
                assert.deepStrictEqual(config.extends, ["eslint:recommended", "plugin:vue/essential"]);
            });

            it("should enable typescript parser and plugin", () => {
                answers.typescript = true;
                const config = init.processAnswers(answers);

                assert.strictEqual(config.parser, "@typescript-eslint/parser");
                assert.deepStrictEqual(config.plugins, ["@typescript-eslint"]);
                assert.deepStrictEqual(config.extends, ["eslint:recommended", "plugin:@typescript-eslint/recommended"]);
            });

            it("should enable typescript parser and plugin with vue", () => {
                answers.framework = "vue";
                answers.typescript = true;
                const config = init.processAnswers(answers);

                assert.deepStrictEqual(config.extends, ["eslint:recommended", "plugin:vue/essential", "plugin:@typescript-eslint/recommended"]);
                assert.strictEqual(config.parserOptions.parser, "@typescript-eslint/parser");
                assert.deepStrictEqual(config.plugins, ["vue", "@typescript-eslint"]);
            });

            it("should extend eslint:recommended", () => {
                const config = init.processAnswers(answers);

                assert.strictEqual(config.extends, "eslint:recommended");
            });

            it("should not use commonjs by default", () => {
                const config = init.processAnswers(answers);

                assert.isUndefined(config.env.commonjs);
            });

            it("should use commonjs when set", () => {
                answers.moduleType = "commonjs";
                const config = init.processAnswers(answers);

                assert.isTrue(config.env.commonjs);
            });
        });

        describe("guide", () => {
            it("should support the google style guide", () => {
                const config = { extends: "google" };
                const modules = init.getModulesList(config);

                assert.deepStrictEqual(config, { extends: "google", installedESLint: true });
                assert.include(modules, "eslint-config-google@latest");
            });

            it("should support the airbnb style guide", () => {
                const config = { extends: "airbnb" };
                const modules = init.getModulesList(config);

                assert.deepStrictEqual(config, { extends: "airbnb", installedESLint: true });
                assert.include(modules, "eslint-config-airbnb@latest");
            });

            it("should support the airbnb base style guide", () => {
                const config = { extends: "airbnb-base" };
                const modules = init.getModulesList(config);

                assert.deepStrictEqual(config, { extends: "airbnb-base", installedESLint: true });
                assert.include(modules, "eslint-config-airbnb-base@latest");
            });

            it("should support the standard style guide", () => {
                const config = { extends: "standard" };
                const modules = init.getModulesList(config);

                assert.deepStrictEqual(config, { extends: "standard", installedESLint: true });
                assert.include(modules, "eslint-config-standard@latest");
            });

            it("should install required sharable config", () => {
                const config = { extends: "google" };

                init.installModules(init.getModulesList(config));
                assert(npmInstallStub.calledOnce);
                assert(npmInstallStub.firstCall.args[0].some(name => name.startsWith("eslint-config-google@")));
            });

            it("should install ESLint if not installed locally", () => {
                const config = { extends: "google" };

                init.installModules(init.getModulesList(config));
                assert(npmInstallStub.calledOnce);
                assert(npmInstallStub.firstCall.args[0].some(name => name.startsWith("eslint@")));
            });

            it("should install peerDependencies of the sharable config", () => {
                const config = { extends: "airbnb" };

                init.installModules(init.getModulesList(config));

                assert(npmFetchPeerDependenciesStub.calledOnce);
                assert(npmFetchPeerDependenciesStub.firstCall.args[0] === "eslint-config-airbnb@latest");
                assert(npmInstallStub.calledOnce);
                assert.deepStrictEqual(
                    npmInstallStub.firstCall.args[0],
                    [
                        "eslint-config-airbnb@latest",
                        "eslint@^3.19.0",
                        "eslint-plugin-jsx-a11y@^5.0.1",
                        "eslint-plugin-import@^2.2.0",
                        "eslint-plugin-react@^7.0.1"
                    ]
                );
            });

            describe("hasESLintVersionConflict (Note: peerDependencies always `eslint: \"^3.19.0\"` by stubs)", () => {
                describe("if local ESLint is not found,", () => {
                    before(() => {
                        localESLintVersion = null;
                    });

                    it("should return false.", () => {
                        const result = init.hasESLintVersionConflict({ styleguide: "airbnb" });

                        assert.strictEqual(result, false);
                    });
                });

                describe("if local ESLint is 3.19.0,", () => {
                    before(() => {
                        localESLintVersion = "3.19.0";
                    });

                    it("should return false.", () => {
                        const result = init.hasESLintVersionConflict({ styleguide: "airbnb" });

                        assert.strictEqual(result, false);
                    });
                });

                describe("if local ESLint is 4.0.0,", () => {
                    before(() => {
                        localESLintVersion = "4.0.0";
                    });

                    it("should return true.", () => {
                        const result = init.hasESLintVersionConflict({ styleguide: "airbnb" });

                        assert.strictEqual(result, true);
                    });
                });

                describe("if local ESLint is 3.18.0,", () => {
                    before(() => {
                        localESLintVersion = "3.18.0";
                    });

                    it("should return true.", () => {
                        const result = init.hasESLintVersionConflict({ styleguide: "airbnb" });

                        assert.strictEqual(result, true);
                    });
                });
            });

            it("should support the standard style guide with Vue.js", () => {
                const config = {
                    plugins: ["vue"],
                    extends: ["plugin:vue/essential", "standard"]
                };
                const modules = init.getModulesList(config);

                assert.include(modules, "eslint-plugin-vue@latest");
                assert.include(modules, "eslint-config-standard@latest");
            });

            it("should support custom parser", () => {
                const config = {
                    parser: "@typescript-eslint/parser"
                };
                const modules = init.getModulesList(config);

                assert.include(modules, "@typescript-eslint/parser@latest");
            });

            it("should support custom parser with Vue.js", () => {
                const config = {

                    // We should declare the parser at `parserOptions` when using with `eslint-plugin-vue`.
                    parserOptions: {
                        parser: "@typescript-eslint/parser"
                    }
                };
                const modules = init.getModulesList(config);

                assert.include(modules, "@typescript-eslint/parser@latest");
            });
        });

        describe("auto", () => {
            const completeSpy = sinon.spy();
            let config;

            before(() => {
                const patterns = [
                    getFixturePath("lib"),
                    getFixturePath("tests")
                ].join(" ");

                answers = {
                    purpose: "style",
                    source: "auto",
                    patterns,
                    env: ["browser"],
                    format: "JSON"
                };

                sinon.stub(console, "log"); // necessary to replace, because of progress bar

                process.chdir(fixtureDir);
                config = init.processAnswers(answers);
                sinon.restore();
            });

            after(() => {
                sinon.restore();
            });

            afterEach(() => {
                process.chdir(originalDir);
                sinon.restore();
            });

            it("should create a config", () => {
                assert.isTrue(completeSpy.notCalled);
                assert.ok(config);
            });

            it("should create the config based on examined files", () => {
                assert.deepStrictEqual(config.rules.quotes, ["error", "double"]);
                assert.strictEqual(config.rules.semi, "off");
            });

            it("should extend and not disable recommended rules", () => {
                assert.strictEqual(config.extends, "eslint:recommended");
                assert.notProperty(config.rules, "no-debugger");
            });

            it("should not include deprecated rules", () => {
                assert.notProperty(config.rules, "id-blacklist");
                assert.notProperty(config.rules, "no-negated-in-lhs");
                assert.notProperty(config.rules, "no-process-exit");
                assert.notProperty(config.rules, "no-spaced-func");
                assert.notProperty(config.rules, "prefer-reflect");
            });

            it("should support new ES features if using later ES version", () => {
                const filename = getFixturePath("new-es-features");

                answers.patterns = filename;
                answers.ecmaVersion = 2017;
                process.chdir(fixtureDir);
                config = init.processAnswers(answers);
            });

            it("should throw on fatal parsing error", () => {
                const filename = getFixturePath("parse-error");

                sinon.stub(autoconfig, "extendFromRecommended");
                answers.patterns = filename;
                process.chdir(fixtureDir);
                assert.throws(() => {
                    config = init.processAnswers(answers);
                }, "Parsing error: Unexpected token ;");
            });

            it("should throw if no files are matched from patterns", () => {
                sinon.stub(autoconfig, "extendFromRecommended");
                answers.patterns = "not-a-real-filename";
                process.chdir(fixtureDir);
                assert.throws(() => {
                    config = init.processAnswers(answers);
                }, "No files matching 'not-a-real-filename' were found.");
            });
        });
    });
});
