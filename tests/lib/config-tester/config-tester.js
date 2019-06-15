"use strict";

const assert = require("assert");
const path = require("path");
const sinon = require("sinon");
const { ConfigTester } = require("../../../lib/config-tester/config-tester");

/**
 * Get the path to a fixture.
 * @param {string} name The fixture name.
 * @returns {string} The path to the fixture.
 */
function fixture(name) {
    return path.resolve(__dirname, "../../fixtures/config-tester", name);
}

/**
 * The implementation of both `describe` and `it` while this test.
 * @param {string} description The description.
 * @param {Function} f The test body.
 * @returns {void}
 */
function spyImpl(description, f) {
    try {
        f();
    } catch (error) {
        error.message = `${description} ${error.message}`;
        throw error;
    }
}

describe("ConfigTester", () => {

    /** @type {sinon.SinonSpy<[string, () => void], void>} */
    let itSpy;

    beforeEach(() => {
        ConfigTester.describe = spyImpl;
        ConfigTester.it = itSpy = sinon.spy(spyImpl);
    });
    afterEach(() => {
        ConfigTester.describe = null;
        ConfigTester.it = itSpy = null;
    });

    describe("run(targetName, options) method", () => {
        describe("with 'core-rules' fixture", () => {
            describe("and no options", () => {
                beforeEach(() => {
                    const tester = new ConfigTester(fixture("core-rules"));

                    tester.run("index");
                });

                it("should validate config schema.", () => {
                    assert(itSpy.args.some(([description]) => description === "should have valid schema."));
                });

                it("should validate config content.", () => {
                    assert(itSpy.args.some(([description]) => description === "should have valid content."));
                });

                it("should check unknown rules.", () => {
                    assert(itSpy.args.some(([description]) => description === "should not configure unknown rules."));
                });

                it("should check deprecated rules.", () => {
                    assert(itSpy.args.some(([description]) => description === "should not enable deprecated rules."));
                });

                it("should check missing rules.", () => {
                    assert(itSpy.args.some(([description]) => description === "should configure all rules."));
                });

                it("should check if the package contains the referred files.", () => {
                    assert(itSpy.args.some(([description]) => description === "should contain all files that your config referred."));
                });

                it("should check if the package depends on the referred packages.", () => {
                    assert(itSpy.args.some(([description]) => description === "should declare all packages that your config referred, as 'dependencies' or 'peerDependencies'."));
                });

                it("should check if the package contains the referred plugins as peer dependencies.", () => {
                    assert(itSpy.args.some(([description]) => description === "should declare all plugin packages that your config referred, as 'peerDependencies'."));
                });
            });

            describe("and 'ignoreMissingRules' option", () => {
                beforeEach(() => {
                    const tester = new ConfigTester(fixture("core-rules"));

                    tester.run("index", { ignoreMissingRules: true });
                });

                it("should validate config schema.", () => {
                    assert(itSpy.args.some(([description]) => description === "should have valid schema."));
                });

                it("should validate config content.", () => {
                    assert(itSpy.args.some(([description]) => description === "should have valid content."));
                });

                it("should check unknown rules.", () => {
                    assert(itSpy.args.some(([description]) => description === "should not configure unknown rules."));
                });

                it("should check deprecated rules.", () => {
                    assert(itSpy.args.some(([description]) => description === "should not enable deprecated rules."));
                });

                it("should NOT check missing rules.", () => {
                    assert(!itSpy.args.some(([description]) => description === "should configure all rules."));
                });

                it("should check if the package contains the referred files.", () => {
                    assert(itSpy.args.some(([description]) => description === "should contain all files that your config referred."));
                });

                it("should check if the package depends on the referred packages.", () => {
                    assert(itSpy.args.some(([description]) => description === "should declare all packages that your config referred, as 'dependencies' or 'peerDependencies'."));
                });

                it("should check if the package contains the referred plugins as peer dependencies.", () => {
                    assert(itSpy.args.some(([description]) => description === "should declare all plugin packages that your config referred, as 'peerDependencies'."));
                });
            });

            describe("and 'ignoreMissingDependencies' option", () => {
                beforeEach(() => {
                    const tester = new ConfigTester(fixture("core-rules"));

                    tester.run("index", { ignoreMissingDependencies: true });
                });

                it("should validate config schema.", () => {
                    assert(itSpy.args.some(([description]) => description === "should have valid schema."));
                });

                it("should validate config content.", () => {
                    assert(itSpy.args.some(([description]) => description === "should have valid content."));
                });

                it("should check unknown rules.", () => {
                    assert(itSpy.args.some(([description]) => description === "should not configure unknown rules."));
                });

                it("should check deprecated rules.", () => {
                    assert(itSpy.args.some(([description]) => description === "should not enable deprecated rules."));
                });

                it("should check missing rules.", () => {
                    assert(itSpy.args.some(([description]) => description === "should configure all rules."));
                });

                it("should NOT check if the package contains the referred files.", () => {
                    assert(!itSpy.args.some(([description]) => description === "should contain all files that your config referred."));
                });

                it("should NOT check if the package depends on the referred packages.", () => {
                    assert(!itSpy.args.some(([description]) => description === "should declare all packages that your config referred, as 'dependencies' or 'peerDependencies'."));
                });

                it("should NOT check if the package contains the referred plugins as peer dependencies.", () => {
                    assert(!itSpy.args.some(([description]) => description === "should declare all plugin packages that your config referred, as 'peerDependencies'."));
                });
            });
        });

        describe("with 'depend-files' fixture", () => {
            it("should NOT throw.", () => {
                const tester = new ConfigTester(fixture("depend-files"));

                tester.run("index");
            });
        });

        describe("with 'depend-packages' fixture", () => {
            it("should NOT throw.", () => {
                const tester = new ConfigTester(fixture("depend-packages"));

                tester.run("index");
            });
        });

        describe("with 'invalid-schema' fixture", () => {
            it("should throw as invalid schema.", () => {
                const tester = new ConfigTester(fixture("invalid-schema"));

                assert.throws(() => {
                    tester.run("index");
                }, /invalidProperty/u);
            });
        });

        describe("with 'invalid-env' fixture", () => {
            it("should throw as invalid value in 'env'.", () => {
                const tester = new ConfigTester(fixture("invalid-env"));

                assert.throws(() => {
                    tester.run("index");
                }, /a boolean value/u);
            });
        });

        describe("with 'unknown-env' fixture", () => {
            it("should throw as unknown key in 'env'.", () => {
                const tester = new ConfigTester(fixture("unknown-env"));

                assert.throws(() => {
                    tester.run("index");
                }, /unknownEnv/u);
            });
        });

        describe("with 'invalid-globals' fixture", () => {
            it("should throw as invalid value in 'globals'.", () => {
                const tester = new ConfigTester(fixture("invalid-globals"));

                assert.throws(() => {
                    tester.run("index");
                }, /invalidGlobalValue/u);
            });
        });

        describe("with 'unknown-processor' fixture", () => {
            it("should throw as unknown name in 'processor'.", () => {
                const tester = new ConfigTester(fixture("unknown-processor"));

                assert.throws(() => {
                    tester.run("index");
                }, /unknown[/]processor/u);
            });
        });

        describe("with 'invalid-rule-option' fixture", () => {
            it("should throw as invalid options in 'rules'.", () => {
                const tester = new ConfigTester(fixture("invalid-rule-option"));

                assert.throws(() => {
                    tester.run("index");
                }, /invalidOption/u);
            });
        });

        describe("with 'unknown-rule' fixture", () => {
            it("should throw as unknown key in 'rules'.", () => {
                const tester = new ConfigTester(fixture("unknown-rule"));

                assert.throws(() => {
                    tester.run("index");
                }, /1 rule\(s\) were not found in ESLint v(?:[0-9]+\.[0-9]+\.[0-9]+(?:-.+)?)\./u);
            });
        });

        describe("with 'deprecated-rule-on' fixture", () => {
            it("should throw as a rule was deprecated.", () => {
                const tester = new ConfigTester(fixture("deprecated-rule-on"));

                assert.throws(() => {
                    tester.run("index");
                }, /1 deprecated rule\(s\) were found\./u);
            });
        });

        describe("with 'deprecated-rule-off' fixture", () => {
            it("should NOT throw even if a deprecated rule was disabled.", () => {
                const tester = new ConfigTester(fixture("deprecated-rule-off"));

                tester.run("index");
            });
        });

        describe("with 'missing-rule' fixture", () => {
            describe("and no options", () => {
                it("should throw as a rule was missing.", () => {
                    const tester = new ConfigTester(fixture("missing-rule"));

                    assert.throws(() => {
                        tester.run("index");
                    }, /1 rule\(s\) were not configured in your config\./u);
                });
            });

            describe("and 'ignoreMissingRules' option", () => {
                it("should NOT throw.", () => {
                    const tester = new ConfigTester(fixture("missing-rule"));

                    tester.run("index", { ignoreMissingRules: true });
                });
            });
        });

        describe("with 'core-rules-in-extends' fixture", () => {
            it("should NOT throw any missing rule error as all rules were configured in the parent config.", () => {
                const tester = new ConfigTester(fixture("core-rules-in-extends"));

                tester.run("index");
            });
        });

        describe("with 'unknown-parser' fixture", () => {
            describe("and no options", () => {
                it("should throw as a parser was not found.", () => {
                    const tester = new ConfigTester(fixture("unknown-parser"));

                    assert.throws(() => {
                        tester.run("index");
                    }, /unknown-parser/u);
                });
            });

            describe("and 'ignoreMissingDependencies' option", () => {
                it("should NOT throw.", () => {
                    const tester = new ConfigTester(fixture("unknown-parser"));

                    tester.run("index", { ignoreMissingDependencies: true });
                });
            });
        });

        describe("with 'extraneous-parser-file1' fixture", () => {
            describe("and no options", () => {
                it("should throw as a parser file was not included in 'files' field.", () => {
                    const tester = new ConfigTester(fixture("extraneous-parser-file1"));

                    assert.throws(() => {
                        tester.run("index");
                    }, /1 file\(s\) were not contained in your package\. Check your 'package\.json' and '\.npmignore'\./u);
                });
            });

            describe("and 'ignoreMissingDependencies' option", () => {
                it("should NOT throw.", () => {
                    const tester = new ConfigTester(fixture("extraneous-parser-file1"));

                    tester.run("index", { ignoreMissingDependencies: true });
                });
            });
        });

        describe("with 'extraneous-parser-file2' fixture", () => {
            describe("and no options", () => {
                it("should throw as a parser file was included in '.npmignore'.", () => {
                    const tester = new ConfigTester(fixture("extraneous-parser-file2"));

                    assert.throws(() => {
                        tester.run("index");
                    }, /1 file\(s\) were not contained in your package\. Check your 'package\.json' and '\.npmignore'\./u);
                });
            });

            describe("and 'ignoreMissingDependencies' option", () => {
                it("should NOT throw.", () => {
                    const tester = new ConfigTester(fixture("extraneous-parser-file2"));

                    tester.run("index", { ignoreMissingDependencies: true });
                });
            });
        });

        describe("with 'extraneous-parser-package' fixture", () => {
            describe("and no options", () => {
                it("should throw as a parser package was not included in 'dependencies' nor 'peerDependencies' field.", () => {
                    const tester = new ConfigTester(fixture("extraneous-parser-package"));

                    assert.throws(() => {
                        tester.run("index");
                    }, /1 package\(s\) were not declared in your package\. Check your 'package\.json'\./u);
                });
            });

            describe("and 'ignoreMissingDependencies' option", () => {
                it("should NOT throw.", () => {
                    const tester = new ConfigTester(fixture("extraneous-parser-package"));

                    tester.run("index", { ignoreMissingDependencies: true });
                });
            });
        });

        describe("with 'unknown-extends' fixture", () => {
            describe("and no options", () => {
                it("should throw as an extends was not found.", () => {
                    const tester = new ConfigTester(fixture("unknown-extends"));

                    assert.throws(() => {
                        tester.run("index");
                    }, /unknown-extends/u);
                });
            });

            describe("and 'ignoreMissingDependencies' option", () => {
                it("should throw as an extends was not found.", () => {
                    const tester = new ConfigTester(fixture("unknown-extends"));

                    assert.throws(() => {
                        tester.run("index", { ignoreMissingDependencies: true });
                    }, /unknown-extends/u);
                });
            });
        });

        describe("with 'extraneous-extends-file1' fixture", () => {
            describe("and no options", () => {
                it("should throw as a extends file was not included in 'files' field.", () => {
                    const tester = new ConfigTester(fixture("extraneous-extends-file1"));

                    assert.throws(() => {
                        tester.run("index");
                    }, /1 file\(s\) were not contained in your package\. Check your 'package\.json' and '\.npmignore'\./u);
                });
            });

            describe("and 'ignoreMissingDependencies' option", () => {
                it("should NOT throw.", () => {
                    const tester = new ConfigTester(fixture("extraneous-extends-file1"));

                    tester.run("index", { ignoreMissingDependencies: true });
                });
            });
        });

        describe("with 'extraneous-extends-file2' fixture", () => {
            describe("and no options", () => {
                it("should throw as a extends file was not included in '.npmignore'.", () => {
                    const tester = new ConfigTester(fixture("extraneous-extends-file2"));

                    assert.throws(() => {
                        tester.run("index");
                    }, /1 file\(s\) were not contained in your package\. Check your 'package\.json' and '\.npmignore'\./u);
                });
            });

            describe("and 'ignoreMissingDependencies' option", () => {
                it("should NOT throw.", () => {
                    const tester = new ConfigTester(fixture("extraneous-extends-file2"));

                    tester.run("index", { ignoreMissingDependencies: true });
                });
            });
        });

        describe("with 'extraneous-extends-package' fixture", () => {
            describe("and no options", () => {
                it("should throw as a extends package was not included in 'dependencies' nor 'peerDependencies' field.", () => {
                    const tester = new ConfigTester(fixture("extraneous-extends-package"));

                    assert.throws(() => {
                        tester.run("index");
                    }, /1 package\(s\) were not declared in your package\. Check your 'package\.json'\./u);
                });
            });

            describe("and 'ignoreMissingDependencies' option", () => {
                it("should NOT throw.", () => {
                    const tester = new ConfigTester(fixture("extraneous-extends-package"));

                    tester.run("index", { ignoreMissingDependencies: true });
                });
            });
        });

        describe("with 'unknown-plugin' fixture", () => {
            describe("and no options", () => {
                it("should throw as a plugin was not found.", () => {
                    const tester = new ConfigTester(fixture("unknown-plugin"));

                    assert.throws(() => {
                        tester.run("index");
                    }, /eslint-plugin-unknown/u);
                });
            });

            describe("and 'ignoreMissingDependencies' option", () => {
                it("should NOT throw.", () => {
                    const tester = new ConfigTester(fixture("unknown-plugin"));

                    tester.run("index", { ignoreMissingDependencies: true });
                });
            });
        });

        describe("with 'extraneous-plugin-package1' fixture", () => {
            describe("and no options", () => {
                it("should throw as a plugin package was not included in 'dependencies' nor 'peerDependencies' field.", () => {
                    const tester = new ConfigTester(fixture("extraneous-plugin-package1"));

                    assert.throws(() => {
                        tester.run("index");
                    }, /1 package\(s\) were not declared in your package\. Check your 'package\.json'\./u);
                });
            });

            describe("and 'ignoreMissingDependencies' option", () => {
                it("should NOT throw.", () => {
                    const tester = new ConfigTester(fixture("extraneous-plugin-package1"));

                    tester.run("index", { ignoreMissingDependencies: true });
                });
            });
        });

        describe("with 'extraneous-plugin-package2' fixture", () => {
            describe("and no options", () => {
                it("should throw as a plugin package was not included in 'dependencies' nor 'peerDependencies' field.", () => {
                    const tester = new ConfigTester(fixture("extraneous-plugin-package1"));

                    assert.throws(() => {
                        tester.run("index");
                    }, /1 package\(s\) were not declared in your package\. Check your 'package\.json'\./u);
                });
            });

            describe("and 'ignoreMissingDependencies' option", () => {
                it("should NOT throw.", () => {
                    const tester = new ConfigTester(fixture("extraneous-plugin-package2"));

                    tester.run("index", { ignoreMissingDependencies: true });
                });
            });
        });

        describe("with 'non-peer-plugin-package' fixture", () => {
            describe("and no options", () => {
                it("should throw as a plugin package was not included in 'peerDependencies' field.", () => {
                    const tester = new ConfigTester(fixture("non-peer-plugin-package"));

                    assert.throws(() => {
                        tester.run("index");
                    }, /1 package\(s\) were not declared in your package\. Check the 'peerDependencies' of your 'package\.json'\./u);
                });
            });

            describe("and 'ignoreMissingDependencies' option", () => {
                it("should NOT throw.", () => {
                    const tester = new ConfigTester(fixture("non-peer-plugin-package"));

                    tester.run("index", { ignoreMissingDependencies: true });
                });
            });
        });

        describe("with 'plugin-itself-rules' fixture", () => {
            it("should NOT throw.", () => {
                const tester = new ConfigTester(fixture("plugin-itself-rules"));

                tester.run("recommended");
            });
        });

        describe("with 'plugin-itself-rules2' fixture", () => {
            it("should NOT throw.", () => {
                const tester = new ConfigTester(fixture("plugin-itself-rules2"));

                tester.run("recommended");
            });
        });

        describe("with 'plugin-itself-rules-without-plugins' fixture", () => {
            it("should NOT throw.", () => {
                const tester = new ConfigTester(fixture("plugin-itself-rules-without-plugins"));

                tester.run("recommended");
            });
        });

        describe("with 'plugin-rules' fixture", () => {
            it("should NOT throw.", () => {
                const tester = new ConfigTester(fixture("plugin-rules"));

                tester.run("index");
            });
        });

        describe("with 'plugin-deprecated-rule' fixture", () => {
            it("should NOT throw.", () => {
                const tester = new ConfigTester(fixture("plugin-deprecated-rule"));

                assert.throws(() => {
                    tester.run("index");
                }, /1 deprecated rule\(s\) were found\./u);
            });
        });

        describe("with 'plugin-unknown-rule' fixture", () => {
            it("should NOT throw.", () => {
                const tester = new ConfigTester(fixture("plugin-unknown-rule"));

                assert.throws(() => {
                    tester.run("index");
                }, /1 rule\(s\) were not found in ESLint v(?:[0-9]+\.[0-9]+\.[0-9]+(?:-.+)?) with plugin\(s\) "test"\./u);
            });
        });

    });
});
