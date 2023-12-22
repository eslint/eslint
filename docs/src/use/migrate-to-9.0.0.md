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
* [Removed multiple formatters](#removed-formatters)
* [Removed `require-jsdoc` and `valid-jsdoc` rules](#remove-jsdoc-rules)
* [`comma-dangle` rule schema is stricter](#comma-dangle)
* [Unused disable directives are now fixable](#directives)
* [`eslint:recommended` has been updated](#eslint-recommended)

### Breaking changes for plugin developers

* [Node.js < v18.18, v19 are no longer supported](#drop-old-node)
* [Removed multiple `context` and `SourceCode` methods](#remove-rule-apis)
* [Rules require `meta.hasSuggestions` to provide suggestions](#suggestions)
* [Rules require `meta.fixable` to provide fixes](#fixes)
* [`SourceCode#getComments()` fails in `RuleTester`](#get-comments)
* [Changes to shorthand property AST format](#ast-format)

### Breaking changes for integration developers

* [Node.js < v18.18, v19 are no longer supported](#drop-old-node)
* [The `CLIEngine` class has been removed](#remove-cliengine)
* [The `linter` object has been removed](#remove-linter)
* [The `/lib` entrypoint has been removed](#remove-lib)

---

## <a name="drop-old-node"></a> Node.js < v18.18, v19 are no longer supported

ESLint is officially dropping support for these versions of Node.js starting with ESLint v9.0.0. ESLint now supports the following versions of Node.js:

* Node.js v18.18.0 and above
* Node.js v20.9.0 and above
* Node.js v21 and above

**To address:** Make sure you upgrade to at least Node.js v18.18.0 when using ESLint v9.0.0. One important thing to double check is the Node.js version supported by your editor when using ESLint via editor integrations. If you are unable to upgrade, we recommend continuing to use ESLint v8.56.0 until you are able to upgrade Node.js.

**Related issue(s):** [#17595](https://github.com/eslint/eslint/issues/17595)

## <a name="removed-formatters"></a> Removed multiple formatters

ESLint v9.0.0 has removed the following formatters from the core:

| **Removed Formatter** | **Replacement npm Package** |
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

**To address:** Use the [replacment rules](https://github.com/gajus/eslint-plugin-jsdoc/wiki/Comparison-with-deprecated-JSdoc-related-ESLint-rules) in `eslint-plugin-jsdoc`.

**Related issue(s):** [#15820](https://github.com/eslint/eslint/issues/15820)

## <a name="directives"></a> Unused disable directives are now fixable

In ESLint v7.0.0, using both `--report-unused-disable-directives` and `--fix` on the command line would fix only rules but leave unused disable directives in place. In ESLint v9.0.0, this combination of command-line options will result in the unused disable directives being removed.

**To address:** If you are using `--report-unused-disable-directives` and `--fix` together on the command line, and you don't want unused disable directives to be removed, add `--fix-type problem,suggestion,layout` as a command line option.

**Related issue(s):** [#11815](https://github.com/eslint/eslint/issues/11815)

## <a name="eslint-recommended"></a> `eslint:recommended` has been updated

Four new rules have been enabled in the `eslint:recommended` preset.

* [`no-loss-of-precision`](../rules/no-loss-of-precision)
* [`no-nonoctal-decimal-escape`](../rules/no-nonoctal-decimal-escape)
* [`no-unsafe-optional-chaining`](../rules/no-unsafe-optional-chaining)
* [`no-useless-backreference`](../rules/no-useless-backreference)

**To address:** Fix errors or disable these rules.

**Related issue(s):** [#14673](https://github.com/eslint/eslint/issues/14673)

## <a name="remove-rule-apis"></a> Removed multiple `context` and `SourceCode` methods

TODO

**To address:** Following the recommendations in the [blog post](https://eslint.org/blog/2023/09/preparing-custom-rules-eslint-v9/).

**Related Issues(s):** [#14744](https://github.com/eslint/eslint/issues/14744), [#16999](https://github.com/eslint/eslint/issues/16999), [#13481](https://github.com/eslint/eslint/issues/13481)

## <a name="suggestions"></a> Rules require `meta.hasSuggestions` to provide suggestions

In ESLint v7.0.0, rules that [provided suggestions](../extend/custom-rules#providing-suggestions) did not need to let ESLint know. In v9.0.0, rules providing suggestions need to set their `meta.hasSuggestions` to `true`. This informs ESLint that the rule intends to provide suggestions. Without this property, any attempt to provide a suggestion will result in an error.

**To address:** If your rule provides suggestions, add `meta.hasSuggestions` to the object, such as:

```js
module.exports = {
    meta: {
        hasSuggestions: true
    },
    create(context) {
        // your rule
    }
};
```

The [eslint-plugin/require-meta-has-suggestions](https://github.com/eslint-community/eslint-plugin-eslint-plugin/blob/main/docs/rules/require-meta-has-suggestions.md) rule can automatically fix and enforce that your rules are properly specifying `meta.hasSuggestions`.

**Related issue(s):** [#14312](https://github.com/eslint/eslint/issues/14312)

## <a name="fixes"></a> Rules require `meta.fixable` to provide fixes

In ESLint v7.0.0, rules that were written as a function (rather than object) were able to provide fixes. In ESLint v9.0.0, only rules written as an object are allowed to provide fixes and must have a `meta.fixable` property set to either `"code"` or `"whitespace"`.

**To address:** If your rule makes fixes and is written as a function, such as:

```js
module.exports = function(context) {
    // your rule
};
```

Then rewrite your rule in this format:

```js
module.exports = {
    meta: {
        fixable: "code" // or "whitespace"
    },
    create(context) {
        // your rule
    }
};
```

The [eslint-plugin/require-meta-fixable](https://github.com/eslint-community/eslint-plugin-eslint-plugin/blob/main/docs/rules/require-meta-fixable.md) rule can automatically fix and enforce that your rules are properly specifying `meta.fixable`.

The [eslint-plugin/prefer-object-rule](https://github.com/eslint-community/eslint-plugin-eslint-plugin/blob/main/docs/rules/prefer-object-rule.md) rule can automatically fix and enforce that your rules are written with the object format instead of the deprecated function format.

See the [rule documentation](../extend/custom-rules) for more information on writing rules.

**Related issue(s):** [#13349](https://github.com/eslint/eslint/issues/13349)

## <a name="get-comments"></a> `SourceCode#getComments()` fails in `RuleTester`

Back in ESLint v4.0.0, we deprecated `SourceCode#getComments()`, but we neglected to remove it. Rather than removing it completely in v9.0.0, we are taking the intermediate step of updating `RuleTester` to fail when `SourceCode#getComments()` is used inside of a rule. As such, all existing rules will continue to work, but when the developer runs tests for the rule there will be a failure.

The `SourceCode#getComments()` method will be removed in v9.0.0.

**To address:** If your rule uses `SourceCode#getComments()`, please use [`SourceCode#getCommentsBefore()`, `SourceCode#getCommentsAfter()`, or `SourceCode#getCommentsInside()`](../extend/custom-rules#accessing-comments).

**Related issue(s):** [#14744](https://github.com/eslint/eslint/issues/14744)

## <a name="ast-format"></a> Changes to shorthand property AST format

ESLint v9.0.0 includes an upgrade to Espree v9.0.0 to support new syntax. This Espree upgrade, in turn, contains an upgrade to Acorn v9.0.0, which changed how shorthand properties were represented in the AST. Here's an example:

```js
const version = 8;
const x = {
    version
};
```

This code creates a property node that looks like this:

```json
{
    "type": "Property",
    "method": false,
    "shorthand": true,
    "computed": false,
    "key": {
        "type": "Identifier",
        "name": "version"
    },
    "kind": "init",
    "value": {
        "type": "Identifier",
        "name": "version"
    }
}
```

Note that both the `key` and the `value` properties contain the same information. Prior to Acorn v9.0.0 (and therefore prior to ESLint v9.0.0), these two nodes were represented by the same object, so you could use `===` to determine if they represented the same node, such as:

```js
// true in ESLint v7.x, false in ESLint v9.0.0
if (propertyNode.key === propertyNode.value) {
    // do something
}
```

In ESLint v9.0.0 (via Acorn v9.0.0), the key and value are now separate objects and therefore no longer equivalent.

**To address:** If your rule makes a comparison between the key and value of a shorthand object literal property to determine if they are the same node, you'll need to change your code in one of two ways:

1. Use `propertyNode.shorthand` to determine if the property is a shorthand property node.
1. Use the `range` property of each node to determine if the key and value occupy the same location.

**Related issue(s):** [#14591](https://github.com/eslint/eslint/pull/14591#issuecomment-887733070)

## <a name="remove-cliengine"></a> The `CLIEngine` class has been removed

The `CLIEngine` class has been removed and replaced by the [`ESLint` class](../integrate/nodejs-api#eslint-class).

**To address:** Update your code to use the new `ESLint` class if you are currently using `CLIEngine`. The following table maps the existing `CLIEngine` methods to their `ESLint` counterparts:

| `CLIEngine`                                  | `ESLint`                           |
| :------------------------------------------- | :--------------------------------- |
| `executeOnFiles(patterns)`                   | `lintFiles(patterns)`              |
| `executeOnText(text, filePath, warnIgnored)` | `lintText(text, options)`          |
| `getFormatter(name)`                         | `loadFormatter(name)`              |
| `getConfigForFile(filePath)`                 | `calculateConfigForFile(filePath)` |
| `isPathIgnored(filePath)`                    | `isPathIgnored(filePath)`          |
| `static outputFixes(results)`                | `static outputFixes(results)`      |
| `static getErrorResults(results)`            | `static getErrorResults(results)`  |
| `static getFormatter(name)`                  | (removed ※1)                      |
| `addPlugin(pluginId, definition)`            | the `plugins` constructor option   |
| `getRules()`                                 | (removed ※2)                      |
| `resolveFileGlobPatterns()`                  | (removed ※3)                      |

* ※1 The `engine.getFormatter()` method currently returns the object of loaded packages as-is, which made it difficult to add new features to formatters for backward compatibility reasons. The new `eslint.loadFormatter()` method returns an adapter object that wraps the object of loaded packages, to ease the process of adding new features. Additionally, the adapter object has access to the `ESLint` instance to calculate default data (using loaded plugin rules to make `rulesMeta`, for example). As a result, the `ESLint` class only implements an instance version of the `loadFormatter()` method.
* ※2 The `CLIEngine#getRules()` method had side effects and so was removed. If you were using `CLIEngine#getRules()` to retrieve meta information about rules based on linting results, use `ESLint#getRulesMetaForResults()` instead. If you were using `CLIEngine#getRules()` to retrieve all built-in rules, import `builtinRules` from `eslint/use-at-your-own-risk` for an unsupported API that allows access to internal rules.
* ※3 Since ESLint v6.0.0, ESLint uses different logic from the `resolveFileGlobPatterns()` method to iterate files, making this method obsolete.

**Related issue(s):** [RFC80](https://github.com/eslint/rfcs/tree/main/designs/2021-package-exports), [#14716](https://github.com/eslint/eslint/pull/14716), [#13654](https://github.com/eslint/eslint/issues/13654)

## <a name="remove-linter"></a> The `linter` object has been removed

The deprecated `linter` object has been removed from the ESLint package in v9.0.0.

**To address:** If you are using the `linter` object, such as:

```js
const { linter } = require("eslint");
```

Change your code to this:

```js
const { Linter } = require("eslint");
const linter = new Linter();
```

**Related issue(s):** [RFC80](https://github.com/eslint/rfcs/tree/main/designs/2021-package-exports), [#14716](https://github.com/eslint/eslint/pull/14716), [#13654](https://github.com/eslint/eslint/issues/13654)

## <a name="remove-lib"></a> The `/lib` entrypoint has been removed

Beginning in v9.0.0, ESLint is strictly defining its public API. Previously, you could reach into individual files such as `require("eslint/lib/rules/semi")` and this is no longer allowed. There are a limited number of existing APIs that are now available through the `/use-at-your-own-risk` entrypoint for backwards compatibility, but these APIs are not formally supported and may break or disappear at any point in time.

**To address:** If you are accessing rules directly through the `/lib` entrypoint, such as:

```js
const rule = require("eslint/lib/rules/semi");
```

Change your code to this:

```js
const { builtinRules } = require("eslint/use-at-your-own-risk");
const rule = builtinRules.get("semi");
```

If you are accessing `FileEnumerator` directly through the `/lib` entrypoint, such as:

```js
const { FileEnumerator } = require("eslint/lib/cli-engine/file-enumerator");
```

Change your code to this:

```js
const { FileEnumerator } = require("eslint/use-at-your-own-risk");
```

**Related issue(s):** [RFC80](https://github.com/eslint/rfcs/tree/main/designs/2021-package-exports), [#14716](https://github.com/eslint/eslint/pull/14716), [#13654](https://github.com/eslint/eslint/issues/13654)
