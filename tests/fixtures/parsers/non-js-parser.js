/**
 * Source code:
 * function foo(a: number=0): Foo { }
 */

exports.parseForESLint = () => ({
    ast: {
        "kind": "Document",
        "definitions": [
            {
                "kind": "ObjectTypeExtension",
                "name": {
                    "kind": "Name",
                    "value": "Query",
                    "loc": {
                        "start": 12,
                        "end": 17
                    },
                    "type": "Name"
                },
                "interfaces": [],
                "directives": [],
                "fields": [
                    {
                        "kind": "FieldDefinition",
                        "name": {
                            "kind": "Name",
                            "value": "login",
                            "loc": {
                                "start": 24,
                                "end": 29
                            },
                            "type": "Name"
                        },
                        "arguments": [
                            {
                                "kind": "InputValueDefinition",
                                "name": {
                                    "kind": "Name",
                                    "value": "input",
                                    "loc": {
                                        "start": 30,
                                        "end": 35
                                    },
                                    "type": "Name"
                                },
                                "type": "InputValueDefinition",
                                "directives": [],
                                "loc": {
                                    "start": 30,
                                    "end": 49
                                },
                                "fieldType": {
                                    "kind": "NonNullType",
                                    "type": "NonNullType",
                                    "loc": {
                                        "start": 37,
                                        "end": 49
                                    },
                                    "fieldType": {
                                        "kind": "NamedType",
                                        "name": {
                                            "kind": "Name",
                                            "value": "Credentials",
                                            "loc": {
                                                "start": 37,
                                                "end": 48
                                            },
                                            "type": "Name"
                                        },
                                        "loc": {
                                            "start": 37,
                                            "end": 48
                                        },
                                        "type": "NamedType"
                                    }
                                }
                            }
                        ],
                        "type": "FieldDefinition",
                        "directives": [],
                        "loc": {
                            "start": 24,
                            "end": 63
                        },
                        "fieldType": {
                            "kind": "NamedType",
                            "name": {
                                "kind": "Name",
                                "value": "UserProfile",
                                "loc": {
                                    "start": 52,
                                    "end": 63
                                },
                                "type": "Name"
                            },
                            "loc": {
                                "start": 52,
                                "end": 63
                            },
                            "type": "NamedType"
                        }
                    }
                ],
                "loc": {
                    "start": 0,
                    "end": 65
                },
                "type": "ObjectTypeExtension"
            },
            {
                "kind": "InputObjectTypeDefinition",
                "name": {
                    "kind": "Name",
                    "value": "Credentials",
                    "loc": {
                        "start": 73,
                        "end": 84
                    },
                    "type": "Name"
                },
                "directives": [],
                "fields": [
                    {
                        "kind": "InputValueDefinition",
                        "name": {
                            "kind": "Name",
                            "value": "login",
                            "loc": {
                                "start": 91,
                                "end": 96
                            },
                            "type": "Name"
                        },
                        "type": "InputValueDefinition",
                        "directives": [],
                        "loc": {
                            "start": 91,
                            "end": 105
                        },
                        "fieldType": {
                            "kind": "NonNullType",
                            "type": "NonNullType",
                            "loc": {
                                "start": 98,
                                "end": 105
                            },
                            "fieldType": {
                                "kind": "NamedType",
                                "name": {
                                    "kind": "Name",
                                    "value": "String",
                                    "loc": {
                                        "start": 98,
                                        "end": 104
                                    },
                                    "type": "Name"
                                },
                                "loc": {
                                    "start": 98,
                                    "end": 104
                                },
                                "type": "NamedType"
                            }
                        }
                    },
                    {
                        "kind": "InputValueDefinition",
                        "name": {
                            "kind": "Name",
                            "value": "password",
                            "loc": {
                                "start": 110,
                                "end": 118
                            },
                            "type": "Name"
                        },
                        "type": "InputValueDefinition",
                        "directives": [],
                        "loc": {
                            "start": 110,
                            "end": 127
                        },
                        "fieldType": {
                            "kind": "NonNullType",
                            "type": "NonNullType",
                            "loc": {
                                "start": 120,
                                "end": 127
                            },
                            "fieldType": {
                                "kind": "NamedType",
                                "name": {
                                    "kind": "Name",
                                    "value": "String",
                                    "loc": {
                                        "start": 120,
                                        "end": 126
                                    },
                                    "type": "Name"
                                },
                                "loc": {
                                    "start": 120,
                                    "end": 126
                                },
                                "type": "NamedType"
                            }
                        }
                    }
                ],
                "loc": {
                    "start": 67,
                    "end": 129
                },
                "type": "InputObjectTypeDefinition"
            }
        ],
        "loc": {
            "start": 0,
            "end": 130
        },
        "type": "Document",
        "tokens": [],
        "comments": [],
        "range": {}
    },
    services: {},
    scopeManager: { variables: [], scopes: [{ set: new Map(), variables: [], through: [] }], getDeclaredVariables: () => {} },
    visitorKeys: {
        Document: ['definitions'],
        ObjectTypeDefinition: ['interfaces', 'directives', 'fields'],
        ObjectTypeExtension: ['interfaces', 'directives', 'fields'],
        InputObjectTypeDefinition: ['directives', 'fields'],
        InputValueDefinition: ['directives', 'fieldType'],
        FieldDefinition: ['directives', 'fieldType', 'arguments'],
        EnumTypeDefinition: ['directives', 'values']
    }
});
