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
        basePath: __dirname,
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

        describe("languageOptions", () => {

            it("should error when an unexpected key is found", async () => {

                await assertInvalidConfig([
                    {
                        languageOptions: {
                            foo: true
                        }
                    }
                ], "Unexpected key \"foo\" found.");

            });

            describe("ecmaVersion", () => {

                it("should error when an unexpected value is found", async () => {

                    await assertInvalidConfig([
                        {
                            languageOptions: {
                                ecmaVersion: "true"
                            }
                        }
                    ], "Expected a number.")
                });

                it("should merge two objects when second object has overrides", () => {

                    return assertMergedResult([
                        {
                            languageOptions: {
                                ecmaVersion: 2019
                            }
                        },
                        {
                            languageOptions: {
                                ecmaVersion: 2021
                            }
                        }
                    ], {
                        languageOptions: {
                            ecmaVersion: 2021
                        }
                    });
                });

                it("should merge an object and undefined into one object", () => {

                    return assertMergedResult([
                        {
                            languageOptions: {
                                ecmaVersion: 2021
                            }
                        },
                        {
                        }
                    ], {
                        languageOptions: {
                            ecmaVersion: 2021
                        }
                    });

                });


                it("should merge undefined and an object into one object", () => {

                    return assertMergedResult([
                        {
                        },
                        {
                            languageOptions: {
                                ecmaVersion: 2021
                            }
                        }
                    ], {
                        languageOptions: {
                            ecmaVersion: 2021
                        }
                    });

                });


            });

            describe("sourceType", () => {

                it("should error when an unexpected value is found", async () => {

                    await assertInvalidConfig([
                        {
                            languageOptions: {
                                sourceType: "true"
                            }
                        }
                    ], "Expected \"script\", \"module\", or \"commonjs\".")
                });

                it("should merge two objects when second object has overrides", () => {

                    return assertMergedResult([
                        {
                            languageOptions: {
                                sourceType: "module"
                            }
                        },
                        {
                            languageOptions: {
                                sourceType: "script"
                            }
                        }
                    ], {
                        languageOptions: {
                            sourceType: "script"
                        }
                    });
                });

                it("should merge an object and undefined into one object", () => {

                    return assertMergedResult([
                        {
                            languageOptions: {
                                sourceType: "script"
                            }
                        },
                        {
                        }
                    ], {
                        languageOptions: {
                            sourceType: "script"
                        }
                    });

                });


                it("should merge undefined and an object into one object", () => {

                    return assertMergedResult([
                        {
                        },
                        {
                            languageOptions: {
                                sourceType: "module"
                            }
                        }
                    ], {
                        languageOptions: {
                            sourceType: "module"
                        }
                    });

                });


            });

            describe("globals", () => {

                it("should error when an unexpected value is found", async () => {

                    await assertInvalidConfig([
                        {
                            languageOptions: {
                                globals: "true"
                            }
                        }
                    ], "Expected an object.")
                });

                it("should error when an unexpected key value is found", async () => {

                    await assertInvalidConfig([
                        {
                            languageOptions: {
                                globals: {
                                    foo: "true"
                                }
                            }
                        }
                    ], "Expected \"readonly\", \"writeable\", or \"off\".")
                });

                it("should merge two objects when second object has different keys", () => {

                    return assertMergedResult([
                        {
                            languageOptions: {
                                globals: {
                                    foo: "readonly"
                                }
                            }
                        },
                        {
                            languageOptions: {
                                globals: {
                                    bar: "writeable"
                                }
                            }
                        }
                    ], {
                        languageOptions: {
                            globals: {
                                foo: "readonly",
                                bar: "writeable"
                            }
                        }
                    });
                });

                it("should merge two objects when second object has overrides", () => {

                    return assertMergedResult([
                        {
                            languageOptions: {
                                globals: {
                                    foo: "readonly"
                                }
                            }
                        },
                        {
                            languageOptions: {
                                globals: {
                                    foo: "writeable"
                                }
                            }
                        }
                    ], {
                        languageOptions: {
                            globals: {
                                foo: "writeable"
                            }
                        }
                    });
                });

                it("should merge an object and undefined into one object", () => {

                    return assertMergedResult([
                        {
                            languageOptions: {
                                globals: {
                                    foo: "readonly"
                                }
                            }
                        },
                        {
                        }
                    ], {
                        languageOptions: {
                            globals: {
                                foo: "readonly"
                            }
                        }
                    });

                });


                it("should merge undefined and an object into one object", () => {

                    return assertMergedResult([
                        {
                        },
                        {
                            languageOptions: {
                                globals: {
                                    foo: "readonly"
                                }
                            }
                        }
                    ], {
                        languageOptions: {
                            globals: {
                                foo: "readonly"
                            }
                        }
                    });

                });


            });

            describe("parser", () => {

                it("should error when an unexpected value is found", async () => {

                    await assertInvalidConfig([
                        {
                            languageOptions: {
                                parser: true
                            }
                        }
                    ], "Expected an object or string.")
                });

                it("should error when an unexpected value is found", async () => {

                    await assertInvalidConfig([
                        {
                            languageOptions: {
                                parser: "true"
                            }
                        }
                    ], "Expected string in the form \"plugin-name/object-name\".")
                });

                it("should error when a value doesn't have a parse() method", async () => {

                    await assertInvalidConfig([
                        {
                            languageOptions: {
                                parser: {}
                            }
                        }
                    ], "Expected object to have a parse() or parseForESLint() method.")
                });

                it("should merge two objects when second object has overrides", () => {

                    const parser = { parse(){} };

                    return assertMergedResult([
                        {
                            languageOptions: {
                                parser: "foo/bar"
                            }
                        },
                        {
                            languageOptions: {
                                parser
                            }
                        }
                    ], {
                        languageOptions: {
                            parser
                        }
                    });
                });

                it("should merge an object and undefined into one object", () => {

                    return assertMergedResult([
                        {
                            languageOptions: {
                                parser: "foo/bar"
                            }
                        },
                        {
                        }
                    ], {
                        languageOptions: {
                            parser: "foo/bar"
                        }
                    });

                });


                it("should merge undefined and an object into one object", () => {

                    return assertMergedResult([
                        {
                        },
                        {
                            languageOptions: {
                                parser: "foo/bar"
                            }
                        }
                    ], {
                        languageOptions: {
                            parser: "foo/bar"
                        }
                    });

                });

            });


            describe("parserOptions", () => {

                it("should error when an unexpected value is found", async () => {

                    await assertInvalidConfig([
                        {
                            languageOptions: {
                                parserOptions: "true"
                            }
                        }
                    ], "Expected an object.")
                });

                it("should merge two objects when second object has different keys", () => {

                    return assertMergedResult([
                        {
                            languageOptions: {
                                parserOptions: {
                                    foo: "whatever"
                                }
                            }
                        },
                        {
                            languageOptions: {
                                parserOptions: {
                                    bar: "baz"
                                }
                            }
                        }
                    ], {
                        languageOptions: {
                            parserOptions: {
                                foo: "whatever",
                                bar: "baz"
                            }
                        }
                    });
                });

                it("should merge two objects when second object has overrides", () => {

                    return assertMergedResult([
                        {
                            languageOptions: {
                                parserOptions: {
                                    foo: "whatever"
                                }
                            }
                        },
                        {
                            languageOptions: {
                                parserOptions: {
                                    foo: "bar"
                                }
                            }
                        }
                    ], {
                        languageOptions: {
                            parserOptions: {
                                foo: "bar"
                            }
                        }
                    });
                });

                it("should merge an object and undefined into one object", () => {

                    return assertMergedResult([
                        {
                            languageOptions: {
                                parserOptions: {
                                    foo: "whatever"
                                }
                            }
                        },
                        {
                        }
                    ], {
                        languageOptions: {
                            parserOptions: {
                                foo: "whatever"
                            }
                        }
                    });

                });


                it("should merge undefined and an object into one object", () => {

                    return assertMergedResult([
                        {
                        },
                        {
                            languageOptions: {
                                parserOptions: {
                                    foo: "bar"
                                }
                            }
                        }
                    ], {
                        languageOptions: {
                            parserOptions: {
                                foo: "bar"
                            }
                        }
                    });

                });


            });

            
        });

        describe("rules", () => {

            it("should error when an unexpected value is found", async () => {

                await assertInvalidConfig([
                    {
                        rules: true
                    }
                ], "Expected an object.")
            });

            it("should error when an invalid rule severity is set", async () => {

                await assertInvalidConfig([
                    {
                        rules: {
                            foo: true
                        }
                    }
                ], "Key \"rules\": Key \"foo\": Expected a string, number, or array.")
            });

            it("should error when an invalid rule severity is set in an array", async () => {

                await assertInvalidConfig([
                    {
                        rules: {
                            foo: [true]
                        }
                    }
                ], "Key \"rules\": Key \"foo\": Expected severity of \"off\", 0, \"warn\", 1, \"error\", or 2.")
            });

            it("should merge two objects", () => {

                return assertMergedResult([
                    {
                        rules: {
                            foo: 1,
                            bar: "error"
                        }
                    },
                    {
                        rules: {
                            baz: "warn",
                            boom: 0
                        }
                    }
                ], {
                    rules: {
                        foo: 1,
                        bar: "error",
                        baz: "warn",
                        boom: 0
                    }
                });
            });

            it("should merge two objects when second object has simple overrides", () => {

                return assertMergedResult([
                    {
                        rules: {
                            foo: [1, "always"],
                            bar: "error"
                        }
                    },
                    {
                        rules: {
                            foo: "error",
                            bar: 0
                        }
                    }
                ], {
                    rules: {
                        foo: ["error", "always"],
                        bar: 0
                    }
                });
            });

            it("should merge two objects when second object has array overrides", () => {

                return assertMergedResult([
                    {
                        rules: {
                            foo: 1,
                            bar: "error"
                        }
                    },
                    {
                        rules: {
                            foo: ["error", "never"],
                            bar: ["warn", "foo"]
                        }
                    }
                ], {
                    rules: {
                        foo: ["error", "never"],
                        bar: ["warn", "foo"]
                    }
                });
            });

            xit("should merge an object and undefined into one object", () => {

                return assertMergedResult([
                    {
                        rules: {
                            a: true,
                            b: false
                        }
                    },
                    {
                    }
                ], {
                    rules: {
                        a: true,
                        b: false
                    }
                });

            });

        });

    });
});
