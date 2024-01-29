---
title: Migrate to v9.x
eleventyNavigation:
    key: migrate to v9
    parent: use eslint
    title: Migrate to v9.x
    order: 7

---

ESLint v9.0.0 is a major release of ESLint, and as such, has several breaking changes that you need to be aware of. This guide is intended to walk you through the breaking changes.

The lists below are ordered roughly by the number of users each change is expected to affect, where the first items are expected to affect the most users.

## Table of Contents

### Breaking changes for users

* [Node.js < v18.18, v19 are no longer supported](#drop-old-node)
* [New default config format (`eslint.config.js`)](#flat-config)
* [Removed multiple formatters](#removed-formatters)
* [Removed `require-jsdoc` and `valid-jsdoc` rules](#remove-jsdoc-rules)
* [`eslint:recommended` has been updated](#eslint-recommended)
* [`--quiet` no longer runs rules set to `"warn"`](#quiet-warn)
* [`--output-file` now writes a file to disk even with an empty output](#output-file)
* [Change in behavior when no patterns are passed to CLI](#cli-empty-patterns)
* [`/* eslint */` comments with only severity now retain options from the config file](#eslint-comment-options)
* [Stricter `/* exported */` parsing](#exported-parsing)
* [`no-constructor-return` and `no-sequences` rule schemas are stricter](#stricter-rule-schemas)
* [New checks in `no-implicit-coercion` by default](#no-implicit-coercion)
* [Case-sensitive flags in `no-invalid-regexp`](#no-invalid-regexp)
* [`varsIgnorePattern` option of `no-unused-vars` no longer applies to catch arguments](#vars-ignore-pattern)
* [`no-restricted-imports` now accepts multiple config entries with the same `name`](#no-restricted-imports)
* [`"eslint:recommended"` and `"eslint:all"` strings no longer accepted in flat config](#string-config)
* [`no-inner-declarations` has a new default behavior with a new option](#no-inner-declarations)

### Breaking changes for plugin developers

* [Node.js < v18.18, v19 are no longer supported](#drop-old-node)
* [Removed multiple `context` methods](#removed-context-methods)
* [Removed `sourceCode.getComments()`](#removed-sourcecode-getcomments)
* [Removed `CodePath#currentSegments`](#removed-codepath-currentsegments)
* [Function-style rules are no longer supported](#drop-function-style-rules)
* [`meta.schema` is required for rules with options](#meta-schema-required)
* [`FlatRuleTester` is now `RuleTester`](#flat-rule-tester)
* [Stricter `RuleTester` checks](#stricter-rule-tester)

### Breaking changes for integration developers

* [Node.js < v18.18, v19 are no longer supported](#drop-old-node)
* [`FlatESLint` is now `ESLint`](#flat-eslint)
* [`Linter` now expects flat config format](#flat-linter)

---

## <a name="drop-old-node"></a> Node.js < v18.18, v19 are no longer supported

ESLint is officially dropping support for these versions of Node.js starting with ESLint v9.0.0. ESLint now supports the following versions of Node.js:

* Node.js v18.18.0 and above
* Node.js v20.9.0 and above
* Node.js v21 and above

**To address:** Make sure you upgrade to at least Node.js v18.18.0 when using ESLint v9.0.0. One important thing to double check is the Node.js version supported by your editor when using ESLint via editor integrations. If you are unable to upgrade, we recommend continuing to use ESLint v8.56.0 until you are able to upgrade Node.js.

**Related issue(s):** [#17595](https://github.com/eslint/eslint/issues/17595)

## <a name="flat-config"></a> New default config format (`eslint.config.js`)

As announced in our [blog post](/blog/2023/10/flat-config-rollout-plans/), in ESLint v9.0.0, [`eslint.config.js`](./configure/configuration-files) is the new default configuration format. The previous format, eslintrc, is now deprecated and will not automatically be searched for.

**To address:** Update your configuration to the new format following the [Configuration Migration Guide](./configure/migration-guide). In case you still need to use the deprecated eslintrc config format, set environment variable `ESLINT_USE_FLAT_CONFIG` to `false`.

**Related Issues(s):** [#13481](https://github.com/eslint/eslint/issues/13481)

## <a name="removed-formatters"></a> Removed multiple formatters

ESLint v9.0.0 has removed the following formatters from the core:

| **Removed Formatter** | **Replacement npm Package** |
|-----------------------|-----------------------------|
| `checkstyle` | `eslint-formatter-checkstyle` |
| `compact` | `eslint-formatter-compact` |
| `jslint-xml` | `eslint-formatter-jslint-xml` |
| `junit` | `eslint-formatter-junit` |
| `tap` | `eslint-formatter-tap` |
| `unix` | `eslint-formatter-unix` |
| `visualstudio` | `eslint-formatter-visualstudio` |

**To address:** If you are using any of these formatters via the `-f` command line flag, you'll need to install the respective package for the formatter.

**Related issue(s):** [#17524](https://github.com/eslint/eslint/issues/17524)

## <a name="remove-jsdoc-rules"></a> Removed `require-jsdoc` and `valid-jsdoc` rules

The `require-jsdoc` and `valid-jsdoc` rules have been removed in ESLint v9.0.0. These rules were initially deprecated in 2018.

**To address:** Use the [replacement rules](https://github.com/gajus/eslint-plugin-jsdoc/wiki/Comparison-with-deprecated-JSdoc-related-ESLint-rules) in `eslint-plugin-jsdoc`.

**Related issue(s):** [#15820](https://github.com/eslint/eslint/issues/15820)

## <a name="eslint-recommended"></a> `eslint:recommended` has been updated

Four new rules have been enabled in `eslint:recommended`:

* [`no-constant-binary-expression`](../rules/no-constant-binary-expression)
* [`no-empty-static-block`](../rules/no-empty-static-block)
* [`no-new-native-nonconstructor`](../rules/no-new-native-nonconstructor)
* [`no-unused-private-class-members`](../rules/no-unused-private-class-members)

Additionally, the following rules have been removed from `eslint:recommended`:

* [`no-extra-semi`](../rules/no-extra-semi)
* [`no-inner-declarations`](../rules/no-inner-declarations)
* [`no-mixed-spaces-and-tabs`](../rules/no-mixed-spaces-and-tabs)
* [`no-new-symbol`](../rules/no-new-symbol)

**To address:** Fix errors or disable these rules.

**Related issue(s):** [#15576](https://github.com/eslint/eslint/issues/15576), [#17446](https://github.com/eslint/eslint/issues/17446), [#17596](https://github.com/eslint/eslint/issues/17596)

## <a name="quiet-warn"></a> `--quiet` no longer runs rules set to `"warn"`

Prior to ESLint v9.0.0, the `--quiet` CLI flag would run all rules set to either `"error"` or `"warn"` and then hide the results from rules set to `"warn"`. In ESLint v9.0.0, `--quiet` will prevent rules from being executed when set to `"warn"`. This can result in a performance improvement for configurations containing many rules set to `"warn"`.

If `--max-warnings` is used then `--quiet` will not suppress the execution of rules set to `"warn"` but the output of those rules will be suppressed.

**To address:** In most cases, this change is transparent. If, however, you are running a rule set to `"warn"` that makes changes to the data available to other rules (for example, if the rule uses `sourceCode.markVariableAsUsed()`), then this can result in a behavior change. In such a case, you'll need to either set the rule to `"error"` or stop using `--quiet`.

**Related issue(s):** [#16450](https://github.com/eslint/eslint/issues/16450)

## <a name="output-file"></a> `--output-file` now writes a file to disk even with an empty output

Prior to ESLint v9.0.0, the `--output-file` flag would skip writing a file to disk if the output was empty. However, in ESLint v9.0.0, `--output-file` now consistently writes a file to disk, even when the output is empty. This update ensures a more consistent and reliable behavior for `--output-file`.

**To address:** Review your usage of the `--output-file` flag, especially if your processes depend on the file's presence or absence based on output content. If necessary, update your scripts or configurations to accommodate this change.

**Related Issues(s):** [#17660](https://github.com/eslint/eslint/issues/17660)

## <a name="cli-empty-patterns"></a> Change in behavior when no patterns are passed to CLI

Prior to ESLint v9.0.0, running the ESLint CLI without any file or directory patterns would result in no files being linted and would exit with code 0. This was confusing because it wasn't clear that nothing had actually happened. In ESLint v9.0.0, this behavior has been updated:

* **Flat config.** If you are using flat config, you can run `npx eslint` or `eslint` (if globally installed) and ESLint will assume you want to lint the current directory. Effectively, passing no patterns is equivalent to passing `.`.
* **eslintrc.** If you are using the deprecated eslintrc config, you'll now receive an error when running the CLI without any patterns.

**To address:** In most cases, no change is necessary, and you may find some locations where you thought ESLint was running but it wasn't. If you'd like to keep the v8.x behavior, where passing no patterns results in ESLint exiting with code 0, add the `--pass-on-no-patterns` flag to the CLI call.

**Related issue(s):** [#14308](https://github.com/eslint/eslint/issues/14308)

## <a name="eslint-comment-options"></a> `/* eslint */` comments with only severity now retain options from the config file

Prior to ESLint v9.0.0, configuration comments such as `/* eslint curly: "warn" */` or `/* eslint curly: ["warn"] */` would completely override any configuration specified for the rule in the config file, and thus enforce the default options of the rule.

In ESLint v9.0.0, the behavior of configuration comments is aligned with how rule configurations in config files are merged, meaning that a configuration comment with only severity now retains options specified in the config file and just overrides the severity.

For example, if you have the following config file:

```js
// eslint.config.js

export default [{
    rules: {
        curly: ["error", "multi"]
    }
}];
```

and the following configuration comment:

```js
// my-file.js

/* eslint curly: "warn" */
```

the resulting configuration for the `curly` rule when linting `my-file.js` will be `curly: ["warn", "multi"]`.

Note that this change only affects cases where the same rule is configured in the config file with options and using a configuration comment without options. In all other cases (e.g. the rule is only configured using a configuration comment), the behavior remains the same as prior to ESLint v9.0.0.

**To address:** We expect that in most cases no change is necessary, as rules configured using configuration comments are typically not already configured in the config file. However, if you need a configuration comment to completely override configuration from the config file and enforce the default options, you'll need to specify at least one option:

```js
// my-file.js

/* eslint curly: ["warn", "all"] */
```

**Related issue(s):** [#17381](https://github.com/eslint/eslint/issues/17381)

## <a name="exported-parsing"></a> Stricter `/* exported */` parsing

Prior to ESLint v9.0.0, the `/* exported */` directive incorrectly allowed the following syntax:

```js
/* exported foo: true, bar: false */

// and

/* exported foo bar */
```

The `true` and `false` in this example had no effect on ESLint's behavior, and in fact, was a parsing bug.

In ESLint v9.0.0, any `/* exported */` variables followed by a colon and value will be ignored as invalid.

**To address:** Update any `/* exported */` directives to eliminate the colons and subsequent values, and ensure there are commas between variable names such as:

```js
/* exported foo, bar */
```

**Related issue(s):** [#17622](https://github.com/eslint/eslint/issues/17622)

## <a name="stricter-rule-schemas"></a> `no-constructor-return` and `no-sequences` rule schemas are stricter

In previous versions of ESLint, `no-constructor-return` and `no-sequences` rules were mistakenly accepting invalid options.

This has been fixed in ESLint v9.0.0:

* The `no-constructor-return` rule does not accept any options.
* The `no-sequences` rule can take one option, an object with a property `"allowInParentheses"` (boolean).

```json
{
    "rules": {
        "no-constructor-return": ["error"],
        "no-sequences": ["error", { "allowInParentheses": false }]
    }
}
```

**To address:** If ESLint reports invalid configuration for any of these rules, update your configuration.

**Related issue(s):** [#16879](https://github.com/eslint/eslint/issues/16879)

## <a name="no-implicit-coercion"></a> New checks in `no-implicit-coercion` by default

In ESLint v9.0.0, the `no-implicit-coercion` rule additionally reports the following cases by default:

```js
-(-foo);
foo - 0;
```

**To address:** If you want to retain the previous behavior of this rule, set `"allow": ["-", "- -"]`.

```json
{
    "rules": {
        "no-implicit-coercion": [2, { "allow": ["-", "- -"] } ],
    }
}
```

**Related issue(s):** [#17832](https://github.com/eslint/eslint/pull/17832)

## <a name="no-invalid-regexp"></a> Case-sensitive flags in `no-invalid-regexp`

In ESLint v9.0.0, the option `allowConstructorFlags` is now case-sensitive.

**To address:** Update your configuration if needed.

**Related issue(s):** [#16574](https://github.com/eslint/eslint/issues/16574)

## <a name="vars-ignore-pattern"></a> `varsIgnorePattern` option of `no-unused-vars` no longer applies to catch arguments

In previous versions of ESLint, the `varsIgnorePattern` option of `no-unused-vars` incorrectly ignored errors specified in a `catch` clause. In ESLint v9.0.0, `varsIgnorePattern` no longer applies to errors in `catch` clauses. For example:

```js
/*eslint no-unused-vars: ["error", { "caughtErrors": "all", "varsIgnorePattern": "^err" }]*/

try {
    //...
} catch (err) { // 'err' will be reported.
    console.error("errors");
}

```

**To address:** If you want to specify ignore patterns for `catch` clause variable names, use the `caughtErrorsIgnorePattern` option in addition to `varsIgnorePattern`.

**Related issue(s):** [#17540](https://github.com/eslint/eslint/issues/17540)

## <a name="no-restricted-imports"></a> `no-restricted-imports` now accepts multiple config entries with the same `name`

In previous versions of ESLint, if multiple entries in the `paths` array of your configuration for the `no-restricted-imports` rule had the same `name` property, only the last one would apply, while the previous ones would be ignored.

As of ESLint v9.0.0, all entries apply, allowing for specifying different messages for different imported names. For example, you can now configure the rule like this:

```js
{
    rules: {
        "no-restricted-imports": ["error", {
            paths: [
                {
                    name: "react-native",
                    importNames: ["Text"],
                    message: "import 'Text' from 'ui/_components' instead"
                },
                {
                    name: "react-native",
                    importNames: ["View"],
                    message: "import 'View' from 'ui/_components' instead"
                }
            ]
        }]
    }
}
```

and both `import { Text } from "react-native"` and `import { View } from "react-native"` will be reported, with different messages.

In previous versions of ESLint, with this configuration only `import { View } from "react-native"` would be reported.

**To address:** If your configuration for this rule has multiple entries with the same `name`, you may need to remove unintentional ones.

**Related issue(s):** [#15261](https://github.com/eslint/eslint/issues/15261)

## <a name="string-config"></a> `"eslint:recommended"` and `"eslint:all"` no longer accepted in flat config

In ESLint v8.x, `eslint.config.js` could refer to `"eslint:recommended"` and `"eslint:all"` configurations by inserting a string into the config array, as in this example:

```js
// eslint.config.js
export default [
    "eslint:recommended",
    "eslint:all"
];
```

In ESLint v9.0.0, this format is no longer supported and will result in an error.

**To address:** Use the `@eslint/js` package instead:

```js
// eslint.config.js
import js from "@eslint/js";

export default [
    js.configs.recommended,
    js.configs.all
];
```

**Related issue(s):** [#17488](https://github.com/eslint/eslint/issues/17488)

## <a name="no-inner-declarations"></a> `no-inner-declarations` has a new default behavior with a new option

ESLint v9.0.0 introduces a new option in `no-inner-declarations` rule called `blockScopeFunctions` which by default allows block-level `function`s in strict mode when `languageOptions.ecmaVersion` is set to `2015` or above.

```js
/*eslint no-inner-declarations: "error"*/
"use strict";

if (test) {
    function foo () { }  // no error
}
```

**To address:** If you want to report the block-level `function`s in every condition regardless of strict or non-strict mode, set the `blockScopeFunctions` option to `"disallow"`.

**Related issue(s):** [#15576](https://github.com/eslint/eslint/issues/15576)

## <a name="removed-context-methods"></a> Removed multiple `context` methods

ESLint v9.0.0 removes multiple deprecated methods from the `context` object and moves them onto the `SourceCode` object:

|**Removed on `context`**|**Replacement(s) on `SourceCode`**|
|-----------------------|--------------------------|
|`context.getSource()`|`sourceCode.getText()`|
|`context.getSourceLines()`|`sourceCode.getLines()`|
|`context.getAllComments()`|`sourceCode.getAllComments()`|
|`context.getNodeByRangeIndex()`|`sourceCode.getNodeByRangeIndex()`|
|`context.getComments()`|`sourceCode.getCommentsBefore()`, `sourceCode.getCommentsAfter()`, `sourceCode.getCommentsInside()`|
|`context.getCommentsBefore()`|`sourceCode.getCommentsBefore()`|
|`context.getCommentsAfter()`|`sourceCode.getCommentsAfter()`|
|`context.getCommentsInside()`|`sourceCode.getCommentsInside()`|
|`context.getJSDocComment()`|`sourceCode.getJSDocComment()`|
|`context.getFirstToken()`|`sourceCode.getFirstToken()`|
|`context.getFirstTokens()`|`sourceCode.getFirstTokens()`|
|`context.getLastToken()`|`sourceCode.getLastToken()`|
|`context.getLastTokens()`|`sourceCode.getLastTokens()`|
|`context.getTokenAfter()`|`sourceCode.getTokenAfter()`|
|`context.getTokenBefore()`|`sourceCode.getTokenBefore()`|
|`context.getTokenByRangeStart()`|`sourceCode.getTokenByRangeStart()`|
|`context.getTokens()`|`sourceCode.getTokens()`|
|`context.getTokensAfter()`|`sourceCode.getTokensAfter()`|
|`context.getTokensBefore()`|`sourceCode.getTokensBefore()`|
|`context.getTokensBetween()`|`sourceCode.getTokensBetween()`|
|`context.parserServices`|`sourceCode.parserServices`|
|`context.getDeclaredVariables()`|`sourceCode.getDeclaredVariables()`|

In addition to the methods in the above table, there are several other methods that are also moved but required different method signatures:

|**Removed on `context`**|**Replacement(s) on `SourceCode`**|
|-----------------------|--------------------------|
|`context.getAncestors()`|`sourceCode.getAncestors(node)`|
|`context.getScope()`|`sourceCode.getScope(node)`|
|`context.markVariableAsUsed(name)`|`sourceCode.markVariableAsUsed(name, node)`|

**To address:** Following the recommendations in the [blog post](https://eslint.org/blog/2023/09/preparing-custom-rules-eslint-v9/#from-context-to-sourcecode).

**Related Issues(s):** [#16999](https://github.com/eslint/eslint/issues/16999), [#13481](https://github.com/eslint/eslint/issues/13481)

## <a name="removed-sourcecode-getcomments"></a> Removed `sourceCode.getComments()`

ESLint v9.0.0 removes the deprecated `sourceCode.getComments()` method.

**To address:** Replace with `sourceCode.getCommentsBefore()`, `sourceCode.getCommentsAfter()`, or `sourceCode.getCommentsInside()`.

**Related Issues(s):** [#14744](https://github.com/eslint/eslint/issues/14744)

## <a name="removed-codepath-currentsegments"></a> Removed `CodePath#currentSegments`

ESLint v9.0.0 removes the deprecated `CodePath#currentSegments` property.

**To address:** Update your code following the recommendations in the [blog post](https://eslint.org/blog/2023/09/preparing-custom-rules-eslint-v9/#codepath%23currentsegments).

**Related Issues(s):** [#17457](https://github.com/eslint/eslint/issues/17457)

## <a name="drop-function-style-rules"></a> Function-style rules are no longer supported

ESLint v9.0.0 drops support for function-style rules. Function-style rules are rules created by exporting a function rather than an object with a `create()` method. This rule format was deprecated in 2016.

**To address:** Update your rules to [the most recent rule format](../extend/custom-rules).

The [eslint-plugin/prefer-object-rule](https://github.com/eslint-community/eslint-plugin-eslint-plugin/blob/main/docs/rules/prefer-object-rule.md) rule can help enforce the usage of object-style rules and autofix any remaining function-style rules.

**Related Issues(s):** [#14709](https://github.com/eslint/eslint/issues/14709)

## <a name="meta-schema-required"></a> `meta.schema` is required for rules with options

As of ESLint v9.0.0, an error will be thrown if any options are [passed](../use/configure/rules#using-configuration-files) to a rule that doesn't specify `meta.schema` property.

**To address:**

* If your rule expects [options](../extend/custom-rules#accessing-options-passed-to-a-rule), set [`meta.schema`](../extend/custom-rules#options-schemas) property to a JSON Schema format description of the rule’s options. This schema will be used by ESLint to validate configured options and prevent invalid or unexpected inputs to your rule.
* If your rule doesn't expect any options, there is no action required. This change ensures that end users will not mistakenly configure options for rules that don't expect options.
* **(not recommended)** you can also set `meta.schema` to `false` to disable this validation, but it is highly recommended to provide a schema if the rule expects options and omit the schema (or set `[]`) if the rule doesn't expect options so that ESLint can ensure that your users' configurations are valid.

The [eslint-plugin/require-meta-schema](https://github.com/eslint-community/eslint-plugin-eslint-plugin/blob/main/docs/rules/require-meta-schema.md) rule can help enforce that rules have schemas when required.

**Related Issues(s):** [#14709](https://github.com/eslint/eslint/issues/14709)

## <a name="flat-rule-tester"></a> `FlatRuleTester` is now `RuleTester`

As announced in our [blog post](/blog/2023/10/flat-config-rollout-plans/), the temporary `FlatRuleTester` class has been renamed to `RuleTester`, while the `RuleTester` class from v8.x has been removed. Additionally, the `FlatRuleTester` export from `eslint/use-at-your-own-risk` has been removed.

**To address:** Update your rule tests to use the new `RuleTester`. To do so, here are some of the common changes you'll need to make:

* **Be aware of new defaults for `ecmaVersion` and `sourceType`.** By default, `RuleTester` uses the flat config default of `ecmaVersion: "latest"` and `sourceType: "module"`. This may cause some tests to break if they were expecting the old default of `ecmaVersion: 5` and `sourceType: "script"`. If you'd like to use the old default, you'll need to manually specify that in your `RuleTester` like this:

    ```js
    // use eslintrc defaults
    const ruleTester = new RuleTester({
        languageOptions: {
            ecmaVersion: 5,
            sourceType: "script"
        }
    });
    ```

* **Change `parserOptions` to `languageOptions`.** If you're setting `ecmaVersion` or `sourceType` on your tests, move those from `parserOptions` to `languageOptions`, like this:

    ```js
    ruleTester.run("my-rule", myRule, {
        valid: [
            {
                code: "foo",
                parserOptions: {
                    ecmaVersion: 6
                }
            }
        ]
    });

    // becomes

    ruleTester.run("my-rule", myRule, {
        valid: [
            {
                code: "foo",
                languageOptions: {
                    ecmaVersion: 6
                }
            }
        ]
    });
    ```

* **Translate other config keys.** Keys such as `env` and `parser` that used to run on the eslintrc config system must be translated into the flat config system. Please refer to the [Configuration Migration Guide](configure/migration-guide) for details on translating other keys you may be using.

**Related Issues(s):** [#13481](https://github.com/eslint/eslint/issues/13481)

## <a name="stricter-rule-tester"></a> Stricter `RuleTester` checks

In order to aid in the development of high-quality custom rules that are free from common bugs, ESLint v9.0.0 implements several changes to `RuleTester`:

1. **Suggestion messages must be unique.** Because suggestions are typically displayed in an editor as a dropdown list, it's important that no two suggestions for the same lint problem have the same message. Otherwise, it's impossible to know what any given suggestion will do. This additional check runs automatically.
1. **Suggestions must generate valid syntax.** In order for rule suggestions to be helpful, they need to be valid syntax. `RuleTester` now parses the output of suggestions using the same language options as the `code` value and throws an error if parsing fails.
1. **Test cases must be unique.** Identical test cases can cause confusion and be hard to detect manually in a long test file. Duplicates are now automatically detected and can be safely removed.

**To address:** Run your rule tests using `RuleTester` and fix any errors that occur. The changes you'll need to make to satisfy `RuleTester` are compatible with ESLint v8.x.

**Related Issues(s):** [#15104](https://github.com/eslint/eslint/issues/15104), [#15735](https://github.com/eslint/eslint/issues/15735), [#16908](https://github.com/eslint/eslint/issues/16908)

## <a name="flat-eslint"></a> `FlatESLint` is now `ESLint`

As announced in our [blog post](/blog/2023/10/flat-config-rollout-plans/), the temporary `FlatESLint` class has been renamed to `ESLint`, while the `ESLint` class from v8.x has been renamed to `LegacyESLint`.

**To address:** If you are currently using the `ESLint` class, verify that your tests pass using the new `ESLint` class. Not all of the old options are supported, so you may need to update the arguments passed to the constructor. See the [Node.js API Reference](../integrate/nodejs-api) for details.

If you still need the v8.x `ESLint` functionality, use the `LegacyESLint` class like this:

```js
const { LegacyESLint } = require("eslint/use-at-your-own-risk");
```

**Related Issues(s):** [#13481](https://github.com/eslint/eslint/issues/13481)

## <a name="flat-linter"></a> `Linter` now expects flat config format

In ESLint v9.0.0, the `config` argument passed to `Linter#verify()` and `Linter#verifyAndFix()` methods should be in the flat config format.

Additionally, methods `Linter#defineRule()`, `Linter#defineRules()`, `Linter#defineParser()`, and `Linter#getRules()` are no longer available.

**To address:** If you are using the `Linter` class, verify that your tests pass.

If you're passing configuration objects that are incompatible with the flat config format, you'll need to update the code.

```js
// eslintrc config format
linter.verify(code, {
    parserOptions: {
        ecmaVersion: 6
    }
});

// flat config format
linter.verify(code, {
    languageOptions: {
        ecmaVersion: 6
    }
});
```

Please refer to the [Configuration Migration Guide](configure/migration-guide) for details on translating other keys you may be using.

Rules and parsers can be defined directly in the configuration.

```js
// eslintrc mode
linter.defineRule("my-rule1", myRule1);
linter.defineRules({
    "my-rule2": myRule2,
    "my-rule3": myRule3
});
linter.defineParser("my-parser", myParser);
linter.verify(code, {
    rules: {
        "my-rule1": "error",
        "my-rule2": "error",
        "my-rule3": "error"
    },
    parser: "my-parser"
});

// flat config mode
linter.verify(code, {
    plugins: {
        "my-plugin-foo": {
            rules: {
                "my-rule1": myRule1
            }
        },
        "my-plugin-bar": {
            rules: {
                "my-rule2": myRule2,
                "my-rule3": myRule3
            }
        }
    },
    rules: {
        "my-plugin-foo/my-rule1": "error",
        "my-plugin-bar/my-rule2": "error",
        "my-plugin-bar/my-rule3": "error"
    },
    languageOptions: {
        parser: myParser
    }
});
```

If you still need the v8.x `Linter` functionality, pass `configType: "eslintrc"` to the constructor like this:

```js
const linter = new Linter({ configType: "eslintrc" });

linter.verify(code, {
    parserOptions: {
        ecmaVersion: 6
    }
});

linter.getRules();
```

**Related Issues(s):** [#13481](https://github.com/eslint/eslint/issues/13481)
