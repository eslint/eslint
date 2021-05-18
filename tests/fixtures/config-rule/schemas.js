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

};
