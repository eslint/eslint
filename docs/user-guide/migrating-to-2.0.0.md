# Migrating to v2.0.0

ESLint v2.0.0 is the second major version release. As a result, there are some significant changes between how ESLint worked during its life in 0.x and 1.x and how it will work going forward. These changes are the direct result of feedback from the ESLint community of users and were not made without due consideration for the upgrade path. We believe that these changes make ESLint even better, and while some work is necessary to upgrade, we hope the pain of this upgrade is small enough that you will see the benefit of upgrading.

**Important:** If you are upgrading from 0.x, please refer to [Migrating to 1.0.0](./migrating-to-1.0.0) as your starting point.

## Rule Schema Changes

Due to a quirk in the way rule schemas worked, it was possible that you'd need to account for the rule severity (0, 1, or 2) in a rule schema if the options were sufficiently complex. That would result in a schema such as:

```js
module.exports = {
    "type": "array",
    "items": [
        {
            "enum": [0, 1, 2]
        },
        {
            "enum": ["always", "never"]
        }
    ],
    "minItems": 1,
    "maxItems": 2
};
```

This was confusing to rule developers as it seemed that rules shouldn't be in charge of validating their own severity. In 2.0.0, rules no longer need to check their own severity.

**To address:** If you are exporting a rule schema that checks severity, you need to make several changes:

1. Remove the severity from the schema
1. Adjust `minItems` from 1 to 0
1. Adjust `maxItems` by subtracting 1

Here's what the schema from above looks like when properly converted:

```js
module.exports = {
    "type": "array",
    "items": [
        {
            "enum": ["always", "never"]
        }
    ],
    "minItems": 0,
    "maxItems": 1
};
```

## Configuration cascading changes

If you previously relied on the fact that ESLint will merge configurations from `.eslintrc` and `package.json` files located in the same directory you will have to choose either `.eslintrc` or `package.json` file
and move all of your configuration into one or the other. In 2.0.0 `package.json` will be treated just like any other configuration file and will have the lowest priority.

## Built-In Global Variables

Prior to 2.0.0, new global variables that were standardized as part of ES6 such as `Promise`, `Map`, `Set`, and `Symbol` were included in the built-in global environment. This could lead to potential issues when, for example, `no-undef` permitted use of the `Promise` constructor even in ES5 code where promises are unavailable. In 2.0.0, the built-in environment only includes the standard ES5 global variables, and the new ES6 global variables have been moved to the `es6` environment.

**To address:** If you are writing ES6 code, enable the `es6` environment if you have not already done so:

```js
// In your .eslintrc
{
    env: {
        es6: true
    }
}

// Or in a configuration comment
/*eslint-env es6*/
```
