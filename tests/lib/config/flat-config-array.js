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
    });
});
