---
title: Migrating to v5.0.0

---

ESLint v5.0.0 is the fifth major version release. We have made a few breaking changes in this release, but we expect that most users will be able to upgrade without any modifications to their build. This guide is intended to walk you through the breaking changes.

The lists below are ordered roughly by the number of users each change is expected to affect, where the first items are expected to affect the most users.

## Breaking changes for users

1. [Node.js 4 is no longer supported](#drop-node-4)
1. [New rules have been added to `eslint:recommended`](#eslint-recommended-changes)
1. [The `experimentalObjectRestSpread` option has been deprecated](#experimental-object-rest-spread)
1. [Linting nonexistent files from the command line is now a fatal error](#nonexistent-files)
1. [The default options for some rules have changed](#rule-default-changes)
1. [Deprecated globals have been removed from the `node`, `browser`, and `jest` environments](#deprecated-globals)
1. [Empty files are now linted](#empty-files)
1. [Plugins in scoped packages are now resolvable in configs](#scoped-plugins)
1. [Multi-line `eslint-disable-line` directives are now reported as problems](#multiline-directives)

## Breaking changes for plugin/custom rule developers

1. [The `parent` property of AST nodes is now set before rules start running](#parent-before-rules)
1. [When using the default parser, spread operators now have type `SpreadElement`](#spread-operators)
1. [When using the default parser, rest operators now have type `RestElement`](#rest-operators)
1. [When using the default parser, text nodes in JSX elements now have type `JSXText`](#jsx-text-nodes)
1. [The `context.getScope()` method now returns more proper scopes](#context-get-scope)
1. [The `_linter` property on rule context objects has been removed](#no-context-linter)
1. [`RuleTester` now uses strict equality checks in its assertions](#rule-tester-equality)
1. [Rules are now required to provide messages along with reports](#required-report-messages)

## Breaking changes for integration developers

1. [The `source` property is no longer available on individual linting messages](#source-property)
1. [Fatal errors now result in an exit code of 2](#exit-code-two)
1. [The `eslint.linter` property is now non-enumerable](#non-enumerable-linter)

---

## <a name="drop-node-4"></a> Node.js 4 is no longer supported

As of April 30th, 2018, Node.js 4 will be at EOL and will no longer be receiving security updates. As a result, we have decided to drop support for it in ESLint v5. We now support the following versions of Node.js:

* Node.js 6 (6.14.0 and above)
* Node.js 8 (8.10.0 and above)
* Anything above Node.js 9.10.0

**To address:** Make sure you upgrade to at least Node.js 6 when using ESLint v5. If you are unable to upgrade, we recommend continuing to use ESLint v4.x until you are able to upgrade Node.js.

## <a name="eslint-recommended-changes"/> `eslint:recommended` changes

Two new rules have been added to the [`eslint:recommended`](configure/configuration-files#using-eslintrecommended) config:

* [`for-direction`](../rules/for-direction) enforces that a `for` loop update clause moves the counter in the right direction.
* [`getter-return`](../rules/getter-return) enforces that a `return` statement is present in property getters.

**To address:** To mimic the `eslint:recommended` behavior from 4.x, you can disable these rules in a config file:

```json
{
  "extends": "eslint:recommended",

  "rules": {
    "for-direction": "off",
    "getter-return": "off"
  }
}
```

## <a name="experimental-object-rest-spread"></a> The `experimentalObjectRestSpread` option has been deprecated

Previously, when using the default parser it was possible to use the `experimentalObjectRestSpread` option to enable support for [rest/spread properties](https://developers.google.com/web/updates/2017/06/object-rest-spread), as follows:

```json
{
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true
    }
  }
}
```

Object rest/spread is now an official part of the JavaScript language, so our support for it is no longer experimental. In both ESLint v4 and ESLint v5, object rest/spread can now be enabled with the `"ecmaVersion": 2018` option:

```json
{
  "parserOptions": {
    "ecmaVersion": 2018
  }
}
```

Note that this also enables parsing for other features from ES2018, such as [async iteration](https://github.com/tc39/proposal-async-iteration). When using ESLint v5 with the default parser, it is no longer possible to toggle syntax support for object rest/spread independently of other features.

For compatibility, ESLint v5 will treat `ecmaFeatures: { experimentalObjectRestSpread: true }` as an alias for `ecmaVersion: 2018` when the former is found in a config file. As a result, if you use object rest/spread, your code should still parse successfully with ESLint v5. However, note that this alias will be removed in ESLint v6.

**To address:** If you use the `experimentalObjectRestSpread` option, you should be able to upgrade to ESLint v5 without any changes, but you will encounter a deprecation warning. To avoid the warning, use `ecmaVersion: 2018` in your config file rather than `ecmaFeatures: { experimentalObjectRestSpread: true }`. If you would like to disallow the use of other ES2018 features, consider using rules such as [`no-restricted-syntax`](../rules/no-restricted-syntax).

## <a name="nonexistent-files"></a> Linting nonexistent files from the command line is now a fatal error

Previous versions of ESLint silently ignored any nonexistent files and globs provided on the command line:

```bash
eslint nonexistent-file.js 'nonexistent-folder/**/*.js' # exits without any errors in ESLint v4
```

Many users found this behavior confusing, because if they made a typo in a filename, ESLint would appear to lint that file successfully while actually not linting anything.

ESLint v5 will report a fatal error when either of the following conditions is met:

* A file provided on the command line does not exist
* A glob or folder provided on the command line does not match any lintable files

Note that this also affects the [`CLIEngine.executeOnFiles()`](../integrate/nodejs-api#cliengineexecuteonfiles) API.

**To address:** If you encounter an error about missing files after upgrading to ESLint v5, you may want to double-check that there are no typos in the paths you provide to ESLint. To make the error go away, you can simply remove the given files or globs from the list of arguments provided to ESLint on the command line.

If you use a boilerplate generator that relies on this behavior (e.g. to generate a script that runs `eslint tests/` in a new project before any test files are actually present), you can work around this issue by adding a dummy file that matches the given pattern (e.g. an empty `tests/index.js` file).

## <a name="rule-default-changes"></a> The default options for some rules have changed

* The default options for the [`object-curly-newline`](../rules/object-curly-newline) rule have changed from `{ multiline: true }` to `{ consistent: true }`.
* The default options object for the [`no-self-assign`](../rules/no-self-assign) rule has changed from `{ props: false }` to `{ props: true }`.

**To address:** To restore the rule behavior from ESLint v4, you can update your config file to include the previous options:

```json
{
  "rules": {
    "object-curly-newline": ["error", { "multiline": true }],
    "no-self-assign": ["error", { "props": false }]
  }
}
```

## <a name="deprecated-globals"></a> Deprecated globals have been removed from the `node`, `browser`, and `jest` environments

Some global variables have been deprecated or removed for code running in Node.js, browsers, and Jest. (For example, browsers used to expose an `SVGAltGlyphElement` global variable to JavaScript code, but this global has been removed from web standards and is no longer present in browsers.) As a result, we have removed these globals from the corresponding `eslint` environments, so use of these globals will trigger an error when using rules such as [`no-undef`](../rules/no-undef).

**To address:** If you use deprecated globals in the `node`, `browser`, or `jest` environments, you can add a `globals` section to your configuration to re-enable any globals you need. For example:

```json
{
  "env": {
    "browser": true
  },
  "globals": {
    "SVGAltGlyphElement": false
  }
}
```

## <a name="empty-files"></a> Empty files are now linted

ESLint v4 had a special behavior when linting files that only contain whitespace: it would skip running the parser and rules, and it would always return zero errors. This led to some confusion for users and rule authors, particularly when writing tests for rules. (When writing a stylistic rule, rule authors would occasionally write a test where the source code only contained whitespace, to ensure that the rule behaved correctly when no applicable code was found. However, a test like this would actually not run the rule at all, so an aspect of the rule would end up untested.)

ESLint v5 treats whitespace-only files the same way as all other files: it parses them and runs enabled rules on them as appropriate. This could lead to additional linting problems if you use a custom rule that reports errors on empty files.

**To address:** If you have an empty file in your project and you don't want it to be linted, consider adding it to an [`.eslintignore` file](configure/ignore).

If you have a custom rule, you should make sure it handles empty files appropriately. (In most cases, no changes should be necessary.)

## <a name="scoped-plugins"></a> Plugins in scoped packages are now resolvable in configs

When ESLint v5 encounters a plugin name in a config starting with `@`, the plugin will be resolved as a [scoped npm package](https://docs.npmjs.com/misc/scope). For example, if a config contains `"plugins": ["@foo"]`, ESLint v5 will attempt to load a package called `@foo/eslint-plugin`. (On the other hand, ESLint v4 would attempt to load a package called `eslint-plugin-@foo`.) This is a breaking change because users might have been relying on ESLint finding a package at `node_modules/eslint-plugin-@foo`. However, we think it is unlikely that many users were relying on this behavior, because packages published to npm cannot contain an `@` character in the middle.

**To address:** If you rely on ESLint loading a package like `eslint-config-@foo`, consider renaming the package to something else.

## <a name="multiline-directives"></a> Multi-line `eslint-disable-line` directives are now reported as problems

`eslint-disable-line` and `eslint-disable-next-line` directive comments are only allowed to span a single line. For example, the following directive comment is invalid:

```js
alert('foo'); /* eslint-disable-line
   no-alert */ alert('bar');

// (which line is the rule disabled on?)
```

Previously, ESLint would ignore these malformed directive comments. ESLint v5 will report an error when it sees a problem like this, so that the issue can be more easily corrected.

**To address:** If you see new reported errors as a result of this change, ensure that your `eslint-disable-line` directives only span a single line. Note that "block comments" (delimited by `/* */`) are still allowed to be used for directives, provided that the block comments do not contain linebreaks.

---

## <a name="parent-before-rules"></a> The `parent` property of AST nodes is now set before rules start running

Previously, ESLint would set the `parent` property on each AST node immediately before running rule listeners for that node. This caused some confusion for rule authors, because the `parent` property would not initially be present on any nodes, and it was sometimes necessary to complicate the structure of a rule to ensure that the `parent` property of a given node would be available when needed.

In ESLint v5, the `parent` property is set on all AST nodes before any rules have access to the AST. This makes it easier to write some rules, because the `parent` property is always available rather than being mutated behind the scenes. However, as a side-effect of having `parent` properties, the AST object has a circular structure the first time a rule sees it (previously, it only had a circular structure after the first rule listeners were called). As a result, a custom rule that enumerates all properties of a node in order to traverse the AST might now loop forever or run out of memory if it does not check for cycles properly.

**To address:** If you have written a custom rule that enumerates all properties of an AST node, consider excluding the `parent` property or implementing cycle detection to ensure that you obtain the correct result.

## <a name="spread-operators"></a> When using the default parser, spread operators now have type `SpreadElement`

Previously, when parsing JS code like `const foo = {...data}` with the `experimentalObjectRestSpread` option enabled, the default parser would generate an `ExperimentalSpreadProperty` node type for the `...data` spread element.

In ESLint v5, the default parser will now always give the `...data` AST node the `SpreadElement` type, even if the (now deprecated) [`experimentalObjectRestSpread`](#experimental-object-rest-spread) option is enabled. This makes the AST compliant with the current ESTree spec.

**To address:** If you have written a custom rule that relies on spread operators having the `ExperimentalSpreadProperty` type, you should update it to also work with spread operators that have the `SpreadElement` type.

## <a name="rest-operators"></a> When using the default parser, rest operators now have type `RestElement`

Previously, when parsing JS code like `const {foo, ...rest} = data` with the `experimentalObjectRestSpread` option enabled, the default parser would generate an `ExperimentalRestProperty` node type for the `...data` rest element.

In ESLint v5, the default parser will now always give the `...data` AST node the `RestElement` type, even if the (now deprecated) [`experimentalObjectRestSpread`](#experimental-object-rest-spread) option is enabled. This makes the AST compliant with the current ESTree spec.

**To address:** If you have written a custom rule that relies on rest operators having the `ExperimentalRestProperty` type, you should update it to also work with rest operators that have the `RestElement` type.

## <a name="jsx-text-nodes"></a> When using the default parser, text nodes in JSX elements now have type `JSXText`

When parsing JSX code like `<a>foo</a>`, the default parser will now give the `foo` AST node the `JSXText` type, rather than the `Literal` type. This makes the AST compliant with a recent update to the JSX spec.

**To address:** If you have written a custom rule that relies on text nodes in JSX elements having the `Literal` type, you should update it to also work with nodes that have the `JSXText` type.

## <a name="context-get-scope"></a> The `context.getScope()` method now returns more proper scopes

Previously, the `context.getScope()` method changed its behavior based on the `parserOptions.ecmaVersion` property. However, this could cause confusing behavior when using a parser that doesn't respond to the `ecmaVersion` option, such as `babel-eslint`.

Additionally, `context.getScope()` incorrectly returned the parent scope of the proper scope on `CatchClause` (in ES5), `ForStatement` (in ≧ES2015), `ForInStatement` (in ≧ES2015), `ForOfStatement`, and `WithStatement` nodes.

In ESLint v5, the `context.getScope()` method has the same behavior regardless of `parserOptions.ecmaVersion` and returns the proper scope. See [the documentation](../extend/custom-rules#accessing-the-scope-of-a-node) for more details on which scopes are returned.

**To address:** If you have written a custom rule that uses the `context.getScope()` method in node handlers, you may need to update it to account for the modified scope information.

## <a name="no-context-linter"></a> The `_linter` property on rule context objects has been removed

Previously, rule context objects had an undocumented `_linter` property, which was used internally within ESLint to process reports from rules. Some rules used this property to achieve functionality that was not intended to be possible for rules. For example, several plugins used the `_linter` property in a rule to monitor reports from other rules, for the purpose of checking for unused `/* eslint-disable */` directive comments. Although this functionality was useful for users, it could also cause stability problems for projects using ESLint. For example, an upgrade to a rule in one plugin could unexpectedly cause a rule in another plugin to start reporting errors.

The `_linter` property has been removed in ESLint v5.0, so it is no longer possible to implement rules with this functionality. However, the [`--report-unused-disable-directives`](command-line-interface#--report-unused-disable-directives) CLI flag can be used to flag unused directive comments.

## <a name="rule-tester-equality"></a> `RuleTester` now uses strict equality checks in its assertions

Previously, `RuleTester` used loose equality when making some of its assertions. For example, if a rule produced the string `"7"` as a result of autofixing, `RuleTester` would allow the number `7` in an `output` assertion, rather than the string `"7"`. In ESLint v5, comparisons from `RuleTester` use strict equality, so an assertion like this will no longer pass.

**To address:** If you use `RuleTester` to write tests for your custom rules, make sure the expected values in your assertions are strictly equal to the actual values.

## <a name="required-report-messages"></a> Rules are now required to provide messages along with reports

Previously, it was possible for rules to report AST nodes without providing a report message. This was not intended behavior, and as a result the default formatter would crash if a rule omitted a message. However, it was possible to avoid a crash when using a non-default formatter, such as `json`.

In ESLint v5, reporting a problem without providing a message always results in an error.

**To address:** If you have written a custom rule that reports a problem without providing a message, update it to provide a message along with the report.

---

## <a name="source-property"></a> The `source` property is no longer available on individual linting messages

As announced in [October 2016](/blog/2016/10/eslint-v3.8.0-released#additional-property-on-linting-results), the `source` property has been removed from individual lint message objects.

**To address:** If you have a formatter or integration which relies on using the `source` property on individual linting messages, you should update it to use the `source` property on file results objects instead.

## <a name="exit-code-two"></a> Fatal errors now result in an exit code of 2

When using ESLint v4, both of the following scenarios resulted in an exit code of 1 when running ESLint on the command line:

* Linting completed successfully, but there are some linting errors
* Linting was unsuccessful due to a fatal error (e.g. an invalid config file)

As a result, it was difficult for an integration to distinguish between the two cases to determine whether it should try to extract linting results from the output.

In ESLint v5, an unsuccessful linting run due to a fatal error will result in an exit code of 2, rather than 1.

**To address:** If you have an integration that detects all problems with linting runs by checking whether the exit code is equal to 1, update it to check whether the exit code is nonzero instead.

## <a name="non-enumerable-linter"></a> The `eslint.linter` property is now non-enumerable

When using ESLint's Node.js API, the [`linter`](../integrate/nodejs-api#linter-1) property is now non-enumerable. Note that the `linter` property was deprecated in ESLint v4 in favor of the [`Linter`](../integrate/nodejs-api#linter) property.

**To address:** If you rely on enumerating all the properties of the `eslint` object, use something like `Object.getOwnPropertyNames` to ensure that non-enumerable keys are captured.
