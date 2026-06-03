module.exports = {
    enum: [{ "enum": ["always", "never"] }],

    objectWithEnum: [{
        "type": "object",
        "properties": {
            "enumProperty": {
                "enum": ["always", "never"]
            }
        },
        "additionalProperties": false
    }],

    objectWithMultipleEnums: [{
        "type": "object",
        "properties": {
            "firstEnum": {
                "enum": ["always", "never"]
            },
            "anotherEnum": {
                "enum": ["var", "let", "const"]
            }
        },
        "additionalProperties": false
    }],

    objectWithBool: [{
        "type": "object",
        "properties": {
            "boolProperty": {
                "type": "boolean"
            }
        },
        "additionalProperties": false
    }],

    objectWithMultipleBools: [{
        "type": "object",
        "properties": {
            "firstBool": {
                "type": "boolean"
            },
            "anotherBool": {
                "type": "boolean"
            }
        },
        "additionalProperties": false
    }],

    mixedEnumObject: [{
        "enum": ["always", "never"]
    },
    {
        "type": "object",
        "properties": {
            "singleValue": {
                "type": "boolean"
            }
        },
        "additionalProperties": false
    }],

    mixedEnumObjectWithNothing: [{
        "enum": ["always", "never"]
    },
    {
        "type": "object",
        "properties": {},
        "additionalProperties": false
    }],

    mixedObjectWithNothingEnum: [{
        "type": "object",
        "properties": {},
        "additionalProperties": false
    },
    {
        "enum": ["always", "never"]
    }],

    mixedStringEnum: [{
        "type": "string"
    },
    {
        "enum": ["always", "never"]
    }],

    oneOf: [{
        "oneOf": [
            {
                "enum": ["before", "after", "both", "neither"]
            },
            {
                "type": "object",
                "properties": {
                    "before": {"type": "boolean"},
                    "after": {"type": "boolean"}
                },
                "additionalProperties": false
            }
        ]
    }],

    nestedObjects: [{
        "type": "object",
        "properties": {
            "prefer": {
                "type": "object",
                "properties": {
                    "nestedProperty": {
                        "type": "boolean"
                    }
                }
            }
        }
    }],

    anyOf: [{
        "anyOf": [
            {
                "enum": ["before", "after", "both", "neither"]
            },
            {
                "type": "object",
                "properties": {
                    "before": {"type": "boolean"},
                    "after": {"type": "boolean"}
                },
                "additionalProperties": false
            }
        ]
    }],

    items: [{
        "type": "array",
        "items": {
            "type": "string"
        }
    }],

    itemsArray: [{
        "type": "array",
        "items": [
            { "type": "string" },
            { "type": "number" }
        ]
    }],

    ref: [{
        "$ref": "#/definitions/aString"
    }],

    definitions: {
        "aString": {
            "type": "string"
        }
    },

    string: [{
        "type": "string"
    }],

    number: [{
        "type": "number"
    }],

    numberWithMinMax: [{
        "type": "number",
        "minimum": 5,
        "maximum": 10
    }],

    integer: [{
        "type": "integer"
    }],

    objectWithManyEnums: [{
        "type": "object",
        "properties": {
            "enumA": {
                "enum": ["a1", "a2", "a3"]
            },
            "enumB": {
                "enum": ["b1", "b2", "b3"]
            },
            "enumC": {
                "enum": ["c1", "c2", "c3"]
            },
            "enumD": {
                "enum": ["d1", "d2", "d3"]
            }
        },
        "additionalProperties": false
    }],

    // Top-level anyOf wrapping alternative array forms (like curly, eqeqeq)
    topLevelAnyOf: {
        "anyOf": [
            {
                "type": "array",
                "items": [
                    { "enum": ["all"] }
                ],
                "minItems": 0,
                "maxItems": 1
            },
            {
                "type": "array",
                "items": [
                    { "enum": ["multi", "multi-line", "multi-or-nest"] },
                    { "enum": ["consistent"] }
                ],
                "minItems": 0,
                "maxItems": 2
            }
        ]
    },

    // type:"array" + oneOf with branches that only have items (like logical-assignment-operators)
    arrayWithOneOf: {
        "type": "array",
        "oneOf": [
            {
                "items": [
                    { "const": "always" },
                    {
                        "type": "object",
                        "properties": {
                            "enforceForIfStatements": { "type": "boolean" }
                        },
                        "additionalProperties": false
                    }
                ],
                "minItems": 0,
                "maxItems": 2
            },
            {
                "items": [
                    { "const": "never" }
                ],
                "minItems": 1,
                "maxItems": 1
            }
        ]
    },

    // const keyword instead of enum
    constValue: [{
        "const": "strict"
    }]
};
