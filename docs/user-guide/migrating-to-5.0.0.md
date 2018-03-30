# Migrating to v5.0.0

ESLint v5.0.0 is the fifth major version release. We have made a few breaking changes in this release, but we expect that most users will be able to upgrade without any modifications to their build. This guide is intended to walk you through the breaking changes.

The lists below are ordered roughly by the number of users each change is expected to affect, where the first items are expected to affect the most users.

### Breaking changes for users

1. [Node.js 4 is no longer supported](#drop-node-4)
1. [The `experimentalObjectRestSpread` option has been deprecated](#experimental-object-rest-spread)
1. [Linting nonexistent files from the command line is now a fatal error](#nonexistent-files)
1. [Empty files are now linted](#empty-files)
1. [Plugins in scoped packages are now resolvable in configs](#scoped-plugins)

### Breaking changes for plugin/custom rule developers

1. [The `parent` property of AST nodes is now set before rules start running](#parent-before-rules)
1. [When using the default parser, text nodes in JSX elements now have type `JSXText`](#jsx-text-nodes)
1. [`RuleTester` now uses strict equality checks in its assertions](#rule-tester-equality)
1. [Rules are now required to provide messages along with reports](#required-report-messages)

### Breaking changes for integration developers

1. [The `source` property is no longer available on individual linting messages](#source-property)
1. [Fatal errors now result in an exit code of 2](#exit-code-two)
1. [The `eslint.linter` property is now non-enumerable](#non-enumerable-linter)

---

## <a name="drop-node-4"></a> Node.js 4 is no longer supported

As of April 30th, 2018, Node.js 4 will be at EOL and will no longer be receiving security updates. As a result, we have decided to drop support for it in ESLint v5. We now support the following versions of Node.js:

* Node.js 6 (6.14.0 and above)
* Node.js 8 (8.11.0 and above)
* Anything above Node.js 9.10.0

**To address:** Make sure you upgrade to at least Node.js 6 when using ESLint v5. If you are unable to upgrade, we recommend continuing to use ESLint v4.x until you are able to upgrade Node.js.

*Note: The latest alpha release of ESLint v5 may still function on Node.js 4, but we plan to officially drop support for it before the first stable release.*

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

**To address:** If you use the `experimentalObjectRestSpread` option, you should be able to upgrade to ESLint v5 without any changes, but you will encounter a deprecation warning. To avoid the warning, use `ecmaVersion: 2018` in your config file rather than `ecmaFeatures: { experimentalObjectRestSpread: true }`. If you would like to disallow the use of other ES2018 features, consider using rules such as [`no-restricted-syntax`](/docs/rules/no-restricted-syntax).

*Note: In the latest alpha release of ESLint v5, `experimentalObjectRestSpread` is not yet implemented as an alias for `ecmaVersion: 2018`, so configs that use `experimentalObjectRestSpread` may temporarily cause parsing errors. We plan to add this alias in a future prerelease.*

## <a name="nonexistent-files"></a> Linting nonexistent files from the command line is now a fatal error

Previous versions of ESLint silently ignored any nonexistent files and globs provided on the command line:

```bash
$ eslint nonexistent-file.js 'nonexistent-folder/**/*.js' # exits without any errors in ESLint v4
```

Many users found this behavior confusing, because if they made a typo in a filename, ESLint would appear to lint that file successfully while actually not linting anything.

ESLint v5 will report a fatal error when either of the following conditions is met:

* A file provided on the command line does not exist
* A glob or folder provided on the command line does not match any lintable files

Note that this also affects the [`CLIEngine.executeOnFiles()`](https://eslint.org/docs/developer-guide/nodejs-api#cliengineexecuteonfiles) API.

**To address:** If you encounter an error about missing files after upgrading to ESLint v5, you may want to double-check that there are no typos in the paths you provide to ESLint. To make the error go away, you can simply remove the given files or globs from the list of arguments provided to ESLint on the command line.

If you use a boilerplate generator that relies on this behavior (e.g. to generate a script that runs `eslint tests/` in a new project before any test files are actually present), you can work around this issue by adding a dummy file that matches the given pattern (e.g. an empty `tests/index.js` file).

*Note: This change has not yet appeared in the latest alpha release. We plan to add it in a future prerelease.*

## <a name="empty-files"></a> Empty files are now linted

ESLint v4 had a special behavior when linting files that only contain whitespace: it would skip running the parser and rules, and it would always return zero errors. This led to some confusion for users and rule authors, particularly when writing tests for rules. (When writing a stylistic rule, rule authors would occasionally write a test where the source code only contained whitespace, to ensure that the rule behaved correctly when no applicable code was found. However, a test like this would actually not run the rule at all, so an aspect of the rule would end up untested.)

ESLint v5 treats whitespace-only files the same way as all other files: it parses them and runs enabled rules on them as appropriate. This could lead to additional linting problems if you use a custom rule that reports errors on empty files.

**To address:** If you have an empty file in your project and you don't want it to be linted, consider adding it to an [`.eslintignore` file](/docs/user-guide/configuring#ignoring-files-and-directories).

If you have a custom rule, you should make sure it handles empty files appropriately. (In most cases, no changes should be necessary.)

## <a name="scoped-plugins"></a> Plugins in scoped packages are now resolvable in configs

When it encounters a plugin name in a config starting with `@`, ESLint v5 will resolve it as a [scoped npm package](https://docs.npmjs.com/misc/scope). For example, if a config contains `"plugins": ["@foo"]`, ESLint v5 will attempt to load a package called `@foo/eslint-plugin`. (On the other hand, ESLint v4 would attempt to load a package called `eslint-plugin-@foo`.) This is a breaking change because users might have been relying on ESLint finding a package at `node_modules/eslint-plugin-@foo`. However, we think it is unlikely that many users were relying on this behavior, because packages published to npm cannot contain an `@` character in the middle.

**To address:** If you rely on ESLint loading a package like `eslint-config-@foo`, consider renaming the package to something else.

---

## <a name="parent-before-rules"></a> The `parent` property of AST nodes is now set before rules start running

Previously, ESLint would set the `parent` property on each AST node immediately before running rule listeners for that node. This caused some confusion for rule authors, because the `parent` property would not initially be present on any nodes, and it was sometimes necessary to complicate the structure of a rule to ensure that the `parent` property of a given node would be available when needed.

In ESLint v5, the `parent` property is set on all AST nodes before any rules have access to the AST. This makes it easier to write some rules, because the `parent` property is always available rather than being mutated behind the scenes. However, as a side-effect of having `parent` properties, the AST object has a circular structure the first time a rule sees it (previously, it only had a circular structure after the first rule listeners were called). As a result, a custom rule that enumerates all properties of an node in order to traverse the AST might now loop forever or run out of memory if it does not check for cycles properly.

**To address:** If you have written a custom rule that enumerates all properties of an AST node, consider excluding the `parent` property or implementing cycle detection to ensure that you obtain the correct result.

## <a name="jsx-text-nodes"></a> When using the default parser, text nodes in JSX elements now have type `JSXText`

When parsing JSX code like `<a>foo</a>`, the default parser will now give the `foo` AST node the `JSXText` type, rather than the `Literal` type. This makes the AST compliant with a recent update to the JSX spec.

**To address:** If you have written a custom rule that relies on text nodes in JSX elements having the `Literal` type, you should update it to also work with nodes that have the `JSXText` type.

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

When using ESLint's Node.js API, the [`linter`](/docs/developer-guide/nodejs-api#linter-1) property is now non-enumerable. Note that the `linter` property was deprecated in ESLint v4 in favor of the [`Linter`](/docs/developer-guide/nodejs-api#linter) property.

**To address:** If you rely on enumerating all the properties of the `eslint` object, use something like `Object.getOwnPropertyNames` to ensure that non-enumerable keys are captured.
