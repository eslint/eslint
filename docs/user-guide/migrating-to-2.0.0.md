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

* [no-arrow-condition](https://eslint.org/docs/rules/no-arrow-condition) is replaced by a combination of [no-confusing-arrow](https://eslint.org/docs/rules/no-confusing-arrow) and [no-constant-condition](https://eslint.org/docs/rules/no-constant-condition). Turn on both of these rules to get the same functionality as `no-arrow-condition`.
* [no-empty-label](https://eslint.org/docs/rules/no-empty-label) is replaced by [no-labels](https://eslint.org/docs/rules/no-labels) with `{"allowLoop": true, "allowSwitch": true}` option.
* [space-after-keywords](https://eslint.org/docs/rules/space-after-keywords) is replaced by [keyword-spacing](https://eslint.org/docs/rules/keyword-spacing).
* [space-before-keywords](https://eslint.org/docs/rules/space-before-keywords) is replaced by [keyword-spacing](https://eslint.org/docs/rules/keyword-spacing).
* [space-return-throw-case](https://eslint.org/docs/rules/space-return-throw-case) is replaced by [keyword-spacing](https://eslint.org/docs/rules/keyword-spacing).

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
1. If you're using `context.ecmaFeatures.modules`, rewrite to check that the `sourceType` property of the Program node is `"module"`.
1. If you're using a non-ES6 feature flag such as `context.ecmaFeatures.jsx`, rewrite to check for `context.parserOptions.ecmaFeatures.jsx`.

If you have a plugin with rules and you are using RuleTester, then you also need to update the options you pass for rules that use `ecmaFeatures`. For example:

```js
var ruleTester = new RuleTester();
ruleTester.run("no-var", rule, {
    valid: [
        {
            code: "let x;",
            parserOptions: { ecmaVersion: 6 }
        }
    ]
});
```

If you're not using `ecmaFeatures` in your configuration or your custom/plugin rules and tests, then no change is needed.

## New Rules in `"eslint:recommended"`

```json
{
    "extends": "eslint:recommended"
}
```

In 2.0.0, the following 11 rules were added to `"eslint:recommended"`.

* [constructor-super](https://eslint.org/docs/rules/constructor-super)
* [no-case-declarations](https://eslint.org/docs/rules/no-case-declarations)
* [no-class-assign](https://eslint.org/docs/rules/no-class-assign)
* [no-const-assign](https://eslint.org/docs/rules/no-const-assign)
* [no-dupe-class-members](https://eslint.org/docs/rules/no-dupe-class-members)
* [no-empty-pattern](https://eslint.org/docs/rules/no-empty-pattern)
* [no-new-symbol](https://eslint.org/docs/rules/no-new-symbol)
* [no-self-assign](https://eslint.org/docs/rules/no-self-assign)
* [no-this-before-super](https://eslint.org/docs/rules/no-this-before-super)
* [no-unexpected-multiline](https://eslint.org/docs/rules/no-unexpected-multiline)
* [no-unused-labels](https://eslint.org/docs/rules/no-unused-labels)

**To address:** If you don't want to be notified by those rules, you can simply disable those rules.

```json
{
    "extends": "eslint:recommended",
    "rules": {
        "no-case-declarations": 0,
        "no-class-assign": 0,
        "no-const-assign": 0,
        "no-dupe-class-members": 0,
        "no-empty-pattern": 0,
        "no-new-symbol": 0,
        "no-self-assign": 0,
        "no-this-before-super": 0,
        "no-unexpected-multiline": 0,
        "no-unused-labels": 0,
        "constructor-super": 0
    }
}
```

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

Further Reading: https://estools.github.io/escope/

## Default Changes When Using `eslint:recommended`

This will affect you if you are extending from `eslint:recommended`, and are enabling [`no-multiple-empty-lines`] or [`func-style`] with only a severity, such as:

```json
{
    "extends": "eslint:recommended",
    "rules": {
        "no-multiple-empty-lines": 2,
        "func-style": 2
    }
}
```

The rule `no-multiple-empty-lines` has no default exceptions, but in ESLint `1.x`, a default from `eslint:recommended` was applied such that a maximum of two empty lines would be permitted.

The rule `func-style` has a default configuration of `"expression"`, but in ESLint `1.x`, `eslint:recommended` defaulted it to `"declaration"`.

ESLint 2.0.0 removes these conflicting defaults, and so you may begin seeing linting errors related to these rules.

**To address:**  If you would like to maintain the previous behavior, update your configuration for `no-multiple-empty-lines` by adding `{"max": 2}`, and change `func-style` to `"declaration"`. For example:

```json
{
    "extends": "eslint:recommended",
    "rules": {
        "no-multiple-empty-lines": [2, {"max": 2}],
        "func-style": [2, "declaration"]
    }
}
```

[`no-multiple-empty-lines`]: ../rules/no-multiple-empty-lines
[`func-style`]: ../rules/func-style

## SourceCode constructor (Node API) changes

`SourceCode` constructor got to handle Unicode BOM.
If the first argument `text` has BOM, `SourceCode` constructor sets `true` to `this.hasBOM` and strips BOM from the text.

```js
var SourceCode = require("eslint").SourceCode;

var code = new SourceCode("\uFEFFvar foo = bar;", ast);

assert(code.hasBOM === true);
assert(code.text === "var foo = bar;");
```

So the second argument `ast` also should be parsed from stripped text.

**To address:** If you are using `SourceCode` constructor in your code, please parse the source code after it stripped BOM:

```js
var ast = yourParser.parse(text.replace(/^\uFEFF/, ""), options);
var sourceCode = new SourceCode(text, ast);
```

## Rule Changes

* [`strict`](../rules/strict.md) - defaults to `"safe"` (previous default was `"function"`)

## Plugins No Longer Have Default Configurations

Prior to v2.0.0, plugins could specify a `rulesConfig` for the plugin. The `rulesConfig` would automatically be applied whenever someone uses the plugin, which is the opposite of what ESLint does in every other situation (where nothing is on by default). To bring plugins behavior in line, we have removed support for `rulesConfig` in plugins.

**To address:** If you are using a plugin in your configuration file, you will need to manually enable the plugin rules in the configuration file.
