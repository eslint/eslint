# Migrating to v4.0.0

ESLint v4.0.0 is the fourth major version release. We have made several breaking changes in this release; however, we expect that most of the changes will only affect a very small percentage of users. This guide is intended to walk you through the changes.

The lists below are ordered roughly by the number of users each change is expected to affect, where the first items are expected to affect the most users.

### Breaking changes for users

1. [New rules have been added to `eslint:recommended`](#eslint-recommended-changes)
1. [The `indent` rule is more strict](#indent-rewrite)
1. [Unrecognized properties in config files will cause a fatal error](#config-validation)
1. [Referencing a missing file with the CLI will cause a fatal error](#file-not-found-errors)
1. [.eslintignore patterns are now resolved from the location of the file](#eslintignore-patterns)
1. [The `padded-blocks` rule is more strict by default](#padded-blocks-defaults)
1. [The `space-before-function-paren` rule is more strict by default](#space-before-function-paren-defaults)
1. [The `no-multi-spaces` rule is more strict by default](#no-multi-spaces-eol-comments)
1. [References to scoped plugins in config files must include the scope](#scoped-plugin-resolution)

### Breaking changes for plugin/custom rule developers

1. [`RuleTester` now validates properties of test cases](#rule-tester-validation)
1. [AST nodes no longer have comment properties](#comment-attachment)
1. [Type annotation nodes in an AST will now be traversed](#type-annotation-traversal)

### Breaking changes for integration developers

1. [More report messages have full location ranges](#report-locations)
1. [Some exposed APIs are now ES2015 classes](#exposed-es2015-classes)

---

## <a name="eslint-recommended-changes"/> `eslint:recommended` changes

TODO

## <a name="indent-rewrite"/> The `indent` rule is more strict

Previously, the [`indent`](/docs/rules/indent) rule was fairly lenient about checking indentation; there were many code patterns where indentation was not validated by the rule. This caused confusion for users, because they were accidentally writing code with incorrect indentation, and they expected ESLint to catch the issues.

In 4.0.0, the `indent` rule has been rewritten. The new version of the rule will report some indentation errors that the old version of the rule did not catch. Additionally, the indentation of `MemberExpression` nodes, function parameters, and function arguments will now be checked by default (it was previously ignored by default for backwards compatibility).

To make the upgrade process easier, we've introduced the [`indent-legacy`](/docs/rules/indent-legacy) rule as a snapshot of the `indent` rule from 3.x. If you run into issues from the `indent` rule when you upgrade, you should be able to use the `indent-legacy` rule to replicate the 3.x behavior. However, the `indent-legacy` rule is deprecated and will not receive bugfixes or improvements in the future, so you should eventually switch back to the `indent` rule.

**To address:** We recommend upgrading without changing your `indent` configuration, and fixing any new indentation errors that appear in your codebase. However, if you want to mimic how the `indent` rule worked in 3.x, you can update your configuration:

```js
{
  rules: {
    indent: "off",
    "indent-legacy": "error" // replace this with your previous `indent` configuration
  }
}
```

## <a name="config-validation"/> Unrecognized properties in config files will cause a fatal error

When creating a config, users sometimes make typos or misunderstand how the config is supposed to be structured. Previously, ESLint did not validate the properties of a config file, so a typo in a config could be very tedious to debug. Starting in 4.0.0, ESLint will raise an error if a property in a config file is unrecognized or has the wrong type.

**To address:** If you see a config validation error after upgrading, verify that your config doesn't contain any typos. If you are using an unrecognized property, you should be able to remove it from your config to restore the previous behavior.

## <a name="file-not-found-errors"/> Referencing a missing file with the CLI will cause a fatal error

Previously, ESLint would raise no errors when invoked with missing files:

```bash
eslint 'missing-file.js' 'missing-folder/' 'empty-folder/**/*.js'
```

This caused confusion for users, because it was possible to set up a broken linting task that would always succeed if there was a typo in the file/folder name and no files were matched. Starting in 4.0, referencing a file that does not exist or a glob that matches no files from the CLI is now a fatal error.

**To address:** If you see an error about missing files after upgrading, verify that all of the files that you're linting actually exist. Remove any files that don't exist from the command-line arguments.

## <a name="eslintignore-patterns"/> .eslintignore patterns are now resolved from the location of the file

Due to a bug, glob patterns in an `.eslintignore` file were previously resolved from the current working directory of the process, rather than the location of the `.eslintignore` file. Starting in 4.0, patterns in an `.eslintignore` file will be resolved from the `.eslintignore` file's location.

**To address:** If you use an `.eslintignore` file and you frequently run eslint from somewhere other than the project root, it's possible that the patterns will be matched differently. You should update the patterns in the `.eslintignore` file to ensure they are relative to the file, not to the working directory.

## <a name="padded-blocks-defaults"/> The `padded-blocks` rule is more strict by default

By default, the [`padded-blocks`](/docs/rules/padded-blocks) rule will now enforce padding in class bodies and switch statements. Previously, the rule would ignore these cases unless the user opted into enforcing them.

**To address:** If this change results in more linting errors in your codebase, you should fix them or reconfigure the rule.

## <a name="space-before-function-paren-defaults"/> The `space-before-function-paren` rule is more strict by default

By default, the [`space-before-function-paren`](/docs/rules/space-before-function-paren) rule will now enforce spacing for async arrow functions. Previously, the rule would ignore these cases unless the user opted into enforcing them.

**To address:** To mimic the default config from 3.x, you can use:

```json
{
  "rules": {
    "space-before-function-paren": ["error", {
      "anonymous": "always",
      "named": "always",
      "asyncArrow": "ignore"
    }]
  }
}
```

## <a name="no-multi-spaces-eol-comments"/> The `no-multi-spaces` rule is more strict by default

By default, the [`no-multi-spaces`](/docs/rules/no-multi-spaces) rule will now disallow multiple spaces before comments at the end of a line. Previously, the rule did not check this case.

**To address:** To mimic the default config from 3.x, you can use:

```json
{
  "rules": {
    "no-multi-spaces": ["error", {"ignoreEOLComments": true}]
  }
}
```

## <a name="scoped-plugin-resolution"/> References to scoped plugins in config files must include the scope

In 3.x, there was a bug where references to scoped NPM packages as plugins in config files could omit the scope. For example, in 3.x the following config was legal:

```json
{
  "plugins": [
    "@my-organization/foo"
  ],
  "rules": {
    "foo/some-rule": "error"
  }
}
```

In other words, it was possible to reference a rule from a scoped plugin (such as `foo/some-rule`) without explicitly stating the `@my-organization` scope. This was a bug because it could lead to ambiguous rule references if there was also an unscoped plugin called `eslint-plugin-foo` loaded at the same time.

To avoid this ambiguity, in 4.0 references to scoped plugins must include the scope. The config from above should be fixed to:

```json
{
  "plugins": [
    "@my-organization/foo"
  ],
  "rules": {
    "@my-organization/foo/some-rule": "error"
  }
}
```

**To address:** If you reference a scoped NPM package as a plugin in a config file, be sure to include the scope wherever you reference it.

---

## <a name="rule-tester-validation"/> `RuleTester` now validates properties of test cases

Starting in 4.0, the `RuleTester` utility will validate properties of test case objects, and an error will be thrown if an unknown property is encountered. This change was added because we found that it was relatively common for developers to make typos in rule tests, often invalidating the assertions that the test cases were trying to make.

**To address:** If your tests for custom rules have extra properties, you should remove those properties.

## <a name="comment-attachment"/> AST Nodes no longer have comment properties

Prior to 4.0, ESLint required parsers to implement comment attachment, a process where AST nodes would gain additional properties corresponding to their leading and trailing comments in the source file. This made it difficult for users to develop custom parsers, because they would have to replicate the confusing comment attachment semantics required by ESLint.

In 4.0, comment attachment logic has been moved into ESLint itself. This should make it easier to develop custom parsers, but it also means that AST nodes will no longer have `leadingComments` and `trailingComments` properties.

**To address:** If you have a custom rule that depends on the `leadingComments` or `trailingComments` properties of an AST node, you can switch to `sourceCode.getComments(node).leading` or `sourceCode.getComments(node).trailing` instead. You should also consider using `sourceCode.getAllComments()` or `sourceCode.getTokenBefore(node, { includeComments: true })`.

## <a name="type-annotation-traversal"/> Type annotation nodes in an AST will now be traversed

Starting in 4.0, if a parser produces type annotation nodes, they will be traversed as part of ESLint's AST traversal.

**To address:** If you have a custom rule that relies on having a particular traversal depth, and your rule is run on code with type annotations, you should update the rule logic to account for the new traversal.

---

## <a name="report-locations"/> More report messages have full location ranges

Starting in 3.1.0, rules have been able to specify the *end* location of a reported problem, in addition to the start location, by explicitly specifying an end location in the `report` call. This is useful for tools like editor integrations, which can use the range to precisely display where a reported problem occurs. Starting in 4.0, if a *node* is reported rather than a location, the end location of the range will automatically be inferred from the end location of the node. As a result, many more reported problems will have end locations.

This is not expected to cause breakage. However, it will likely result in larger report locations than before. For example, if a rule reports the root node of the AST, the reported problem's range will be the entire program. In some integrations, this could result in a poor user experience (e.g. if the entire program is highlighted to indicate an error).

**To address:** If you have an integration that deals with the ranges of reported problems, make sure you handle large report ranges in a user-friendly way.

## <a name="exposed-es2015-classes"/> Some exposed APIs are now ES2015 classes

The `CLIEngine`, `SourceCode`, and `RuleTester` modules from ESLint's Node.js API are now ES2015 classes. This will not break any documented behavior, but it does have some observable effects (for example, the methods on `CLIEngine.prototype` are now non-enumerable).

**To address:** If you rely on enumerating the methods of ESLint's Node.js APIs, use a function that can also access non-enumerable properties such as `Object.getOwnPropertyNames`.
