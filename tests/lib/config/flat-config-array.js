/**
 * @fileoverview Tests for FlatConfigArray
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const { FlatConfigArray } = require("../../../lib/config/flat-config-array");
const assert = require("chai").assert;

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

function createFlatConfigArray(configs) {
    return new FlatConfigArray(configs, {
        basePath: __dirname
    });
}

async function assertMergedResult(values, result) {
    const configs = createFlatConfigArray(values);
    await configs.normalize();

    const config = configs.getConfig("foo.js");
    assert.deepStrictEqual(config, result);
}

async function assertInvalidConfig(values, message) {
    const configs = createFlatConfigArray(values);
    await configs.normalize();

    assert.throws(() => {
        configs.getConfig("foo.js");
    }, message);
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("FlatConfigArray", () => {
    
    describe("Config Properties", () => {

        describe("settings", () => {

            it("should merge two objects", () => {
                
                return assertMergedResult([
                    {
                        settings: {
                            a: true,
                            b: false
                        }
                    },
                    {
                        settings: {
                            c: true,
                            d: false
                        }
                    }
                ], {
                    settings: {
                        a: true,
                        b: false,
                        c: true,
                        d: false
                    }
                });
            });

            it("should merge two objects when second object has overrides", () => {
                
                return assertMergedResult([
                    {
                        settings: {
                            a: true,
                            b: false
                        }
                    },
                    {
                        settings: {
                            c: true,
                            a: false
                        }
                    }
                ], {
                    settings: {
                        a: false,
                        b: false,
                        c: true
                    }
                });
            });

            it("should merge an object and undefined into one object", () => {

                return assertMergedResult([
                    {
                        settings: {
                            a: true,
                            b: false
                        }
                    },
                    {
                    }
                ], {
                    settings: {
                        a: true,
                        b: false
                    }
                });

            });

        });

        describe("plugins", () => {

            const pluginA = {};
            const pluginB = {};
            const pluginC = {};

            it("should merge two objects", () => {

                return assertMergedResult([
                    {
                        plugins: {
                            a: pluginA,
                            b: pluginB
                        }
                    },
                    {
                        plugins: {
                            c: pluginC
                        }
                    }
                ], {
                    plugins: {
                        a: pluginA,
                        b: pluginB,
                        c: pluginC
                    }
                });
            });

            it("should merge an object and undefined into one object", () => {

                return assertMergedResult([
                    {
                        plugins: {
                            a: pluginA,
                            b: pluginB
                        }
                    },
                    {
                    }
                ], {
                    plugins: {
                        a: pluginA,
                        b: pluginB
                    }
                });

            });

            it("should error when attempting to redefine a plugin", async () => {

                await assertInvalidConfig([
                    {
                        plugins: {
                            a: pluginA,
                            b: pluginB
                        }
                    },
                    {
                        plugins: {
                            a: pluginC
                        }
                    }
                ], "redefine plugin");
            });

            it("should error when plugin is not an object", async () => {

                await assertInvalidConfig([
                    {
                        plugins: {
                            a: true,
                        }
                    }
                ], "Key \"a\": Expected an object.");
            });


        });

        describe("processor", () => {

            it("should merge two values when second is a string", () => {

                return assertMergedResult([
                    {
                        processor: {
                            preprocess() {},
                            postprocess() {}
                        }
                    },
                    {
                        processor: "markdown/markdown"
                    }
                ], {
                    processor: "markdown/markdown"
                });
            });

            it("should merge two values when second is an object", () => {

                const processor = {
                    preprocess() { },
                    postprocess() { }
                };

                return assertMergedResult([
                    {
                        processor: "markdown/markdown"
                    },
                    {
                        processor
                    }
                ], {
                    processor
                });
            });

            it("should error when an invalid string is used", async () => {

                await assertInvalidConfig([
                    {
                        processor: "foo"
                    }
                ], "plugin-name/object-name");
            });

            it("should error when an empty string is used", async () => {

                await assertInvalidConfig([
                    {
                        processor: ""
                    }
                ], "plugin-name/object-name");
            });

            it("should error when an invalid processor is used", async () => {
                await assertInvalidConfig([
                    {
                        processor: {}
                    }
                ], "preprocess() and a postprocess()");

            });

        });

        describe("linterOptions", () => {

            it("should error when an unexpected key is found", async () => {

                await assertInvalidConfig([
                    {
                        linterOptions: {
                            foo: true
                        }
                    }
                ], "Unexpected key \"foo\" found.");

            });

            describe("noInlineConfig", () => {

                it("should error when an unexpected value is found", async () => {

                    await assertInvalidConfig([
                        {
                            linterOptions: {
                                noInlineConfig: "true"
                            }
                        }
                    ], "Expected a Boolean.")
                });

                it("should merge two objects when second object has overrides", () => {

                    return assertMergedResult([
                        {
                            linterOptions: {
                                noInlineConfig: true
                            }
                        },
                        {
                            linterOptions: {
                                noInlineConfig: false
                            }
                        }
                    ], {
                        linterOptions: {
                            noInlineConfig: false
                        }
                    });
                });

                it("should merge an object and undefined into one object", () => {

                    return assertMergedResult([
                        {
                            linterOptions: {
                                noInlineConfig: false
                            }
                        },
                        {
                        }
                    ], {
                        linterOptions: {
                            noInlineConfig: false
                        }
                    });

                });


            });
            describe("reportUnusedDisableDirectives", () => {

                it("should error when an unexpected value is found", async () => {

                    await assertInvalidConfig([
                        {
                            linterOptions: {
                                reportUnusedDisableDirectives: "true"
                            }
                        }
                    ], "Value must be \"off\", \"warn\", or \"error\".");
                });

                it("should merge two objects when second object has overrides", () => {

                    return assertMergedResult([
                        {
                            linterOptions: {
                                reportUnusedDisableDirectives: "off"
                            }
                        },
                        {
                            linterOptions: {
                                reportUnusedDisableDirectives: "error"
                            }
                        }
                    ], {
                        linterOptions: {
                            reportUnusedDisableDirectives: "error"
                        }
                    });
                });

                it("should merge an object and undefined into one object", () => {

                    return assertMergedResult([
                        {},
                        {
                            linterOptions: {
                                reportUnusedDisableDirectives: "warn"
                            }
                        }
                    ], {
                        linterOptions: {
                            reportUnusedDisableDirectives: "warn"
                        }
                    });

                });


            });

        });
    });
});
