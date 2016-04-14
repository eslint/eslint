# Disallow certain object properties (no-restricted-properties)

Certain properties on objects may be disallowed in a codebase. This is useful for deprecating an API or restricting usage of a module's methods. This rule looks for accessing a given property key on a given object name, either when reading the property's value or invoking it as a function. You may specify an optional message to indicate an alternative API or a reason for the restriction.

## Rule Details

This rule is aimed at disallowing certain object properties from your code.

### Options

This rule takes a list of objects, where the object name and property names are specified:

```json
{
    "rules": {
        "no-restricted-properties": [2, [{
            "object": "disallowedObjectName",
            "property": "disallowedPropertyName"
        }]]
    }
}
```

Multiple object/property values can be disallowed, and you can specify an optional message:

```json
{
    "rules": {
        "no-restricted-properties": [2, [{
            "object": "disallowedObjectName",
            "property": "disallowedPropertyName"
        }, {
            "object": "disallowedObjectName",
            "property": "anotherDisallowedPropertyName",
            "message": "Please use allowedObjectName.allowedPropertyName."
        }]]
    }
}
```

The following patterns are considered problems:

```js
/* eslint no-restricted-properties: [2, {
    "object": "disallowedObjectName",
    "property": "disallowedPropertyName"
}] */

var example = disallowedObjectName.disallowedPropertyName; /*error Disallowed object property: disallowedObjectName.disallowedPropertyName.*/

disallowedObjectName.disallowedPropertyName(); /*error Disallowed object property: disallowedObjectName.disallowedPropertyName.*/
```

The following patterns are not considered problems:

```js
/* eslint no-restricted-properties: [2, {
    "object": "disallowedObjectName",
    "property": "disallowedPropertyName"
}] */

var example = disallowedObjectName.somePropertyName;

allowedObjectName.disallowedPropertyName();
```

## When Not To Use It

If you don't have any object/property combinations to restrict, you should not use this rule.

## Related Rules

* [no-restricted-syntax](no-restricted-syntax.md)
