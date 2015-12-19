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

## Removed Rules

The following rules have been deprecated with new rules created to take their place. The following is a list of the removed rules and their replacements:

* [no-arrow-condition](http://eslint.org/docs/rules/no-arrow-condition) is replaced by a combination of [no-confusing-arrow](http://eslint.org/docs/rules/no-confusing-arrow) and [no-arrow-condition](http://eslint.org/docs/rules/no-arrow-condition). Turn on both of these rules to get the same functionality as `no-arrow-condition`.

**To address:** You'll need to update your rule configurations to use the new rules. ESLint v2.0.0 will also warn you when you're using a rule that has been removed and will suggest the replacement rules. Hopefully, this will result in few surprises during the upgrade process.

## Configuration Cascading Changes

Prior to 2.0.0, if a directory contained both an `.eslintrc` file and a `package.json` file with ESLint configuration information, the settings from the two files would be merged together. In 2.0.0, only the settings from the `.eslintrc.*` file are used and the ones in `package.json` are ignored when both are present. Otherwise, `package.json` can still be used with ESLint configuration, but only if no other `.eslintrc.*` files are present.

**To address:** If you have both an `.eslintrc.*` and `package.json` with ESLint configuration information in the same directory, combine your configurations into just one of those files.

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

## Language Options

Prior to 2.0.0, the way to enable language options was by using `ecmaFeatures` in your configuration. In 2.0.0:

* The `ecmaFeatures` property is now under a top-level `parserOptions` property.
* All ECMAScript 6 `ecmaFeatures` flags have been removed in favor of a `ecmaVersion` property under `parserOptions` that can be set to 3, 5 (default), or 6.
* The `ecmaFeatures.modules` flag has been replaced by a `sourceType` property under `parserOptions` which can be set to `"script"` (default) or `"module"` for ES6 modules.

**To address:** If you are using any ECMAScript 6 feature flags in `ecmaFeatures`, you'll need to use `ecmaVersion: 6` instead. The ECMAScript 6 feature flags are:

* `arrowFunctions` - enable [arrow functions](https://leanpub.com/understandinges6/read#leanpub-auto-arrow-functions)
* `binaryLiterals` - enable [binary literals](https://leanpub.com/understandinges6/read#leanpub-auto-octal-and-binary-literals)
* `blockBindings` - enable `let` and `const` (aka [block bindings](https://leanpub.com/understandinges6/read#leanpub-auto-block-bindings))
* `classes` - enable classes
* `defaultParams` - enable [default function parameters](https://leanpub.com/understandinges6/read/#leanpub-auto-default-parameters)
* `destructuring` - enable [destructuring](https://leanpub.com/understandinges6/read#leanpub-auto-destructuring-assignment)
* `forOf` - enable [`for-of` loops](https://leanpub.com/understandinges6/read#leanpub-auto-iterables-and-for-of)
* `generators` - enable [generators](https://leanpub.com/understandinges6/read#leanpub-auto-generators)
* `modules` - enable modules and global strict mode
* `objectLiteralComputedProperties` - enable [computed object literal property names](https://leanpub.com/understandinges6/read#leanpub-auto-computed-property-names)
* `objectLiteralDuplicateProperties` - enable [duplicate object literal properties](https://leanpub.com/understandinges6/read#leanpub-auto-duplicate-object-literal-properties) in strict mode
* `objectLiteralShorthandMethods` - enable [object literal shorthand methods](https://leanpub.com/understandinges6/read#leanpub-auto-method-initializer-shorthand)
* `objectLiteralShorthandProperties` - enable [object literal shorthand properties](https://leanpub.com/understandinges6/read#leanpub-auto-property-initializer-shorthand)
* `octalLiterals` - enable [octal literals](https://leanpub.com/understandinges6/read#leanpub-auto-octal-and-binary-literals)
* `regexUFlag` - enable the [regular expression `u` flag](https://leanpub.com/understandinges6/read#leanpub-auto-the-regular-expression-u-flag)
* `regexYFlag` - enable the [regular expression `y` flag](https://leanpub.com/understandinges6/read#leanpub-auto-the-regular-expression-y-flag)
* `restParams` - enable the [rest parameters](https://leanpub.com/understandinges6/read#leanpub-auto-rest-parameters)
* `spread` - enable the [spread operator](https://leanpub.com/understandinges6/read#leanpub-auto-the-spread-operator) for arrays
* `superInFunctions` - enable `super` references inside of functions
* `templateStrings` - enable [template strings](https://leanpub.com/understandinges6/read/#leanpub-auto-template-strings)
* `unicodeCodePointEscapes` - enable [code point escapes](https://leanpub.com/understandinges6/read/#leanpub-auto-escaping-non-bmp-characters)

If you're using any of these flags, such as:

```js
{
    ecmaFeatures: {
        arrowFunctions: true
    }
}
```

Then you should enable ES6 using `ecmaVersion`:

```js
{
    parserOptions: {
        ecmaVersion: 6
    }
}
```

If you're using any non-ES6 flags in `ecmaFeatures`, you need to move those inside of `parserOptions`. For instance:

```js
{
    ecmaFeatures: {
        jsx: true
    }
}
```

Then you should move `ecmaFeatures` under `parserOptions`:

```js
{
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        }
    }
}
```

If you were using `ecmaFeatures.modules` to enable ES6 module support like this:

```js
{
    ecmaFeatures: {
        modules: true
    }
}
```

```js
{
    parserOptions: {
        sourceType: "module"
    }
}
```

Additionally, if you are using `context.ecmaFeatures` inside of your rules, then you'll need to update your code in the following ways:

1. If you're using an ES6 feature flag such as `context.ecmaFeatures.blockBindings`, rewrite to check for `context.parserOptions.ecmaVersion > 5`.
1. If you're using `context.ecmaFeatures.modules`, rewrite to check for `context.parserOptions.sourceType === "module"`.
1. If you're using a non-ES6 feature flag such as `context.ecmaFeatures.jsx`, rewrite to check for `context.parserOptions.ecmaFeatures.jsx`.

If you're not using `ecmaFeatures` in your configuration, then no change is needed.


## Scope Analysis Changes

We found some bugs in our scope analysis that needed to be addressed. Specifically, we were not properly accounting for global variables in all the ways they are defined.

Originally, `Variable` objects and `Reference` objects refer each other:

* `Variable#references` property is an array of `Reference` objects which are referencing the variable.
* `Reference#resolved` property is a `Variable` object which are referenced.

But until 1.x, the following variables and references had the wrong value (empty) in those properties:

* `var` declarations in the global.
* `function` declarations in the global.
* Variables defined in config files.
* Variables defined in `/* global */` comments.

Now, those variables and references have correct values in these properties.

`Scope#through` property has references where `Reference#resolved` is `null`. So as a result of this change, the value of `Scope#through` property was changed also.

**To address:** If you are using `Scope#through` to find references of a built-in global variable, you need to make several changes.

For example, this is how you might locate the `window` global variable in 1.x:

```js
var globalScope = context.getScope();
globalScope.through.forEach(function(reference) {
    if (reference.identifier.name === "window") {
        checkForWindow(reference);
    }
});
```

This was a roundabout way to find the variable because it was added after the fact by ESLint. The `window` variable was in `Scope#through` because the definition couldn't be found.

In 2.0.0, `window` is no longer located in `Scope#through` because we have added back the correct declaration. That means you can reference the `window` object (or any other global object) directly. So the previous example would change to this:

```js
var globalScope = context.getScope();
var variable = globalScope.set.get("window");
if (variable) {
    variable.references.forEach(checkForWindow);
}
```

Further Reading: http://estools.github.io/escope/
