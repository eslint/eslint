---
title: no-restricted-properties
rule_type: suggestion
related_rules:
- no-restricted-globals
- no-restricted-syntax
---


Certain properties on objects may be disallowed in a codebase. This is useful for deprecating an API or restricting usage of a module's methods. For example, you may want to disallow using `describe.only` when using Mocha or telling people to use `Object.assign` instead of `_.extend`.

## Rule Details

This rule looks for accessing a given property key on a given object name, either when reading the property's value or invoking it as a function. You may specify an optional message to indicate an alternative API or a reason for the restriction. This rule applies to both properties accessed by dot notation and destructuring.

### Options

This rule takes a list of objects, where the object name and property names are specified:

```json
{
    "rules": {
        "no-restricted-properties": [2, {
            "object": "disallowedObjectName",
            "property": "disallowedPropertyName"
        }]
    }
}
```

Multiple object/property values can be disallowed, and you can specify an optional message:

```json
{
    "rules": {
        "no-restricted-properties": [2, {
            "object": "disallowedObjectName",
            "property": "disallowedPropertyName"
        }, {
            "object": "disallowedObjectName",
            "property": "anotherDisallowedPropertyName",
            "message": "Please use allowedObjectName.allowedPropertyName."
        }]
    }
}
```

If the object name is omitted, the property is disallowed for all objects:

```json
{
    "rules": {
        "no-restricted-properties": [2, {
            "property": "__defineGetter__",
            "message": "Please use Object.defineProperty instead."
        }]
    }
}
```

If the property name is omitted, accessing any property of the given object is disallowed:

```json
{
    "rules": {
        "no-restricted-properties": [2, {
            "object": "require",
            "message": "Please call require() directly."
        }]
    }
}
```

Examples of **incorrect** code for this rule:

::: incorrect

```js
/* eslint no-restricted-properties: [2, {
    "object": "disallowedObjectName",
    "property": "disallowedPropertyName"
}] */

var example = disallowedObjectName.disallowedPropertyName; /*error Disallowed object property: disallowedObjectName.disallowedPropertyName.*/

disallowedObjectName.disallowedPropertyName(); /*error Disallowed object property: disallowedObjectName.disallowedPropertyName.*/
```

:::

::: incorrect

```js
/* eslint no-restricted-properties: [2, {
    "property": "__defineGetter__"
}] */

foo.__defineGetter__(bar, baz);

const { __defineGetter__ } = qux();

({ __defineGetter__ }) => {};
```

:::

::: incorrect

```js
/* eslint no-restricted-properties: [2, {
    "object": "require"
}] */

require.resolve('foo');
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/* eslint no-restricted-properties: [2, {
    "object": "disallowedObjectName",
    "property": "disallowedPropertyName"
}] */

var example = disallowedObjectName.somePropertyName;

allowedObjectName.disallowedPropertyName();
```

:::

::: correct

```js
/* eslint no-restricted-properties: [2, {
    "object": "require"
}] */

require('foo');
```

:::

## When Not To Use It

If you don't have any object/property combinations to restrict, you should not use this rule.
