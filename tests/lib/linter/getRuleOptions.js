/**
 * @fileoverview Tests for getRuleOptions.
 * @author JoshuaKGoldberg
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { getRuleOptions } = require("../../../lib/linter/getRuleOptions");
const assert = require("assert");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const schemaString = {
    type: "string"
};

const schemaStringWithDefault = {
    ...schemaString,
    default: "implicit"
};

const schemaArrayWithStringItems = {
    items: { type: "string" },
    type: "array"
};

const schemaArrayWithStringItemsAndDefault = {
    ...schemaArrayWithStringItems,
    default: ["abc"]
};

const schemaEnum = {
    enum: ["first", "second"]
};

const schemaEnumWithDefault = {
    ...schemaEnum,
    default: "first"
};

const schemaObjectWithShallowDefault = {
    default: {
        first: 2
    },
    properties: {
        first: {
            type: "number"
        }
    }
};

const schemaObjectWithNestedDefault = {
    additionalProperties: false,
    properties: {
        first: {
            default: 2
        }
    }
};

const schemaObjectWithNestedDefaultAndDefault = {
    ...schemaObjectWithNestedDefault,
    default: {
        first: 1
    }
};

describe("getRuleOptions", () => {
    for (const [name, ruleConfig, schema, expected] of [
        [
            "No schema or options",
            ["error"],
            [],
            []
        ],
        [
            "No schema with null option",
            ["error", null],
            [],
            [null]
        ],
        [
            "No schema with options",
            ["error", "a", "b", "c"],
            [],
            ["a", "b", "c"]
        ],
        [
            "Empty object schema",
            ["error"],
            [{}],
            []
        ],
        [
            "Config extending beyond schema",
            ["error", "a", "b", "c"],
            [{ default: 1 }],
            ["a", "b", "c"]
        ],
        [
            "Rule severity without options and schema default",
            "error",
            [{ default: 1 }],
            [1]
        ],
        [
            "String schema without default value and no config",
            ["error"],
            [schemaString],
            []
        ],
        [
            "String schema without default value and null config",
            ["error", null],
            [schemaString],
            [null]
        ],
        [
            "String schema without default value and explicit config",
            ["error", "explicit"],
            [schemaString],
            ["explicit"]
        ],
        [
            "String schema with default value and no config",
            ["error"],
            [schemaStringWithDefault],
            ["implicit"]
        ],
        [
            "String schema with default value and null config",
            ["error", null],
            [schemaStringWithDefault],
            [null]
        ],
        [
            "String schema with default value and explicit config",
            ["error", "explicit"],
            [schemaStringWithDefault],
            ["explicit"]
        ],
        [
            "Array schema without default value and no config",
            ["error"],
            [schemaArrayWithStringItems],
            []
        ],
        [
            "Array schema without default value and null config",
            ["error", null],
            [schemaArrayWithStringItems],
            [null]
        ],
        [
            "Array schema without default value and empty array config",
            ["error", []],
            [schemaArrayWithStringItems],
            [[]]
        ],
        [
            "Array schema without default value and populated array config",
            ["error", ["def"]],
            [schemaArrayWithStringItems],
            [["def"]]
        ],
        [
            "Array schema with default value and no config",
            ["error"],
            [schemaArrayWithStringItemsAndDefault],
            [["abc"]]
        ],
        [
            "Array schema with default value and null config",
            ["error", null],
            [schemaArrayWithStringItemsAndDefault],
            [null]
        ],
        [
            "Array schema with default value and empty array config",
            ["error", []],
            [schemaArrayWithStringItemsAndDefault],
            [[]]
        ],
        [
            "Array schema with default value and populated array config",
            ["error", ["def"]],
            [schemaArrayWithStringItemsAndDefault],
            [["def"]]
        ],
        [
            "Enum schema without default value and no config",
            ["error"],
            [schemaEnum],
            []
        ],
        [
            "Enum schema without default value with value config",
            ["error", null],
            [schemaEnum],
            [null]
        ],
        [
            "Enum schema with default value and no config",
            ["error"],
            [schemaEnumWithDefault],
            [schemaEnumWithDefault.default]
        ],
        [
            "Enum schema with default value with value config",
            ["error", null],
            [schemaEnumWithDefault],
            [null]
        ],
        [
            "Object schema with shallow default value and no config",
            ["error"],
            [schemaObjectWithShallowDefault],
            [{ first: 2 }]
        ],
        [
            "Object schema with shallow default value and null config",
            ["error", null],
            [schemaObjectWithShallowDefault],
            [null]
        ],
        [
            "Object schema with shallow default value and empty object config",
            ["error", {}],
            [schemaObjectWithShallowDefault],
            [{}]
        ],
        [
            "Object schema with shallow default value and populated object config",
            ["error", { first: 3 }],
            [schemaObjectWithShallowDefault],
            [{ first: 3 }]
        ],
        [
            "Object schema with nested default value and no config",
            ["error"],
            [schemaObjectWithNestedDefault],
            [{ first: 2 }]
        ],
        [
            "Object schema with nested default value and null config",
            ["error", null],
            [schemaObjectWithNestedDefault],
            [null]
        ],
        [
            "Object schema with nested default value and empty object config",
            ["error", {}],
            [schemaObjectWithNestedDefault],
            [{ first: 2 }]
        ],
        [
            "Object schema with nested default value and populated object config",
            ["error", { first: 3 }],
            [schemaObjectWithNestedDefault],
            [{ first: 3 }]
        ],
        [
            "Object schema with default value and no config",
            ["error"],
            [schemaObjectWithNestedDefaultAndDefault],
            [{ first: 1 }]
        ],
        [
            "Object schema with default value and null config",
            ["error", null],
            [schemaObjectWithNestedDefaultAndDefault],
            [null]
        ],
        [
            "Object schema with default value and empty object config",
            ["error", {}],
            [schemaObjectWithNestedDefaultAndDefault],
            [{ first: 2 }]
        ],
        [
            "Object schema with default value and populated object config",
            ["error", { first: 3 }],
            [schemaObjectWithNestedDefaultAndDefault],
            [{ first: 3 }]
        ],
        [
            "Object schema with anyOf and no config",
            ["error"],
            [{
                anyOf: [
                    {
                        properties: {
                            first: {
                                type: "number"
                            }
                        }
                    },
                    {
                        type: "string"
                    }
                ]
            }],
            []
        ],
        [
            "Object schema with anyOf and populated object config config",
            ["error", { first: 3 }],
            [{
                anyOf: [
                    {
                        properties: {
                            first: {
                                type: "number"
                            }
                        }
                    },
                    {
                        type: "string"
                    }
                ]
            }],
            [{ first: 3 }]
        ],
        [
            "Real-world: class-methods-use-this and no config",
            ["error"],
            [
                {
                    type: "object",
                    properties: {
                        exceptMethods: {
                            type: "array",
                            items: {
                                type: "string"
                            }
                        },
                        enforceForClassFields: {
                            type: "boolean",
                            default: true
                        }
                    },
                    additionalProperties: false
                }
            ],
            [
                {
                    enforceForClassFields: true
                }
            ]
        ],
        [
            "Real-world: class-methods-use-this and null config",
            ["error", null],
            [
                {
                    type: "object",
                    properties: {
                        exceptMethods: {
                            type: "array",
                            items: {
                                type: "string"
                            }
                        },
                        enforceForClassFields: {
                            type: "boolean",
                            default: true
                        }
                    },
                    additionalProperties: false
                }
            ],
            [null]
        ],
        [
            "Real-world: class-methods-use-this and empty object config",
            ["error", {}],
            [
                {
                    type: "object",
                    properties: {
                        exceptMethods: {
                            type: "array",
                            items: {
                                type: "string"
                            }
                        },
                        enforceForClassFields: {
                            type: "boolean",
                            default: true
                        }
                    },
                    additionalProperties: false
                }
            ],
            [{ enforceForClassFields: true }]
        ],
        [
            "Real-world: require-jsdoc and no config",
            ["error"],
            [
                {
                    type: "object",
                    properties: {
                        require: {
                            type: "object",
                            properties: {
                                ClassDeclaration: {
                                    type: "boolean",
                                    default: false
                                },
                                MethodDefinition: {
                                    type: "boolean",
                                    default: false
                                },
                                FunctionDeclaration: {
                                    type: "boolean",
                                    default: true
                                },
                                ArrowFunctionExpression: {
                                    type: "boolean",
                                    default: false
                                },
                                FunctionExpression: {
                                    type: "boolean",
                                    default: false
                                }
                            },
                            additionalProperties: false,
                            default: {}
                        }
                    },
                    additionalProperties: false
                }
            ],
            [
                {
                    require: {
                        ClassDeclaration: false,
                        MethodDefinition: false,
                        FunctionDeclaration: true,
                        ArrowFunctionExpression: false,
                        FunctionExpression: false
                    }
                }
            ]
        ],
        [
            "Real-world: require-jsdoc and partially filled object config",
            [
                "error",
                {
                    require: {
                        MethodDefinition: true,
                        FunctionDeclaration: false
                    }
                }
            ],
            [
                {
                    type: "object",
                    properties: {
                        require: {
                            type: "object",
                            properties: {
                                ClassDeclaration: {
                                    type: "boolean",
                                    default: false
                                },
                                MethodDefinition: {
                                    type: "boolean",
                                    default: false
                                },
                                FunctionDeclaration: {
                                    type: "boolean",
                                    default: true
                                },
                                ArrowFunctionExpression: {
                                    type: "boolean",
                                    default: false
                                },
                                FunctionExpression: {
                                    type: "boolean",
                                    default: false
                                }
                            },
                            additionalProperties: false,
                            default: {}
                        }
                    },
                    additionalProperties: false
                }
            ],
            [
                {
                    require: {
                        ClassDeclaration: false,
                        MethodDefinition: true,
                        FunctionDeclaration: false,
                        ArrowFunctionExpression: false,
                        FunctionExpression: false
                    }
                }
            ]
        ]
    ]) {
        it(name, () => {
            assert.deepStrictEqual(getRuleOptions(ruleConfig, schema), expected);
        });
    }
});
