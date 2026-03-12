---
title: Migrate to v10.x
eleventyNavigation:
    key: migrate to v10
    parent: use eslint
    title: Migrate to v10.x
    order: 9
---

ESLint v10.0.0 is a major release of ESLint, and as such, has several breaking changes that you need to be aware of. This guide is intended to walk you through the breaking changes.

The lists below are ordered roughly by the number of users each change is expected to affect, where the first items are expected to affect the most users.

## Table of Contents

### Breaking changes for users

- [Node.js < v20.19, v21, v23 are no longer supported](#drop-old-node)
- [`eslint:recommended` has been updated](#eslint-recommended)
- [New configuration file lookup algorithm](#config-lookup-from-file)
- [Old config format no longer supported](#remove-eslintrc)
- [JSX references are now tracked](#jsx-reference-tracking)
- [`eslint-env` comments are reported as errors](#eslint-env-comments)
- [Jiti < v2.2.0 are no longer supported](#drop-old-jiti)
- [POSIX character classes in glob patterns](#posix-character-classes)
- [`stylish` formatter now uses native `styleText` instead of `chalk`](#stylish-formatter)
- [Deprecated options of the `radix` rule](#radix)
- [`no-shadow-restricted-names` now reports `globalThis` by default](#no-shadow-restricted-names)
- [`func-names` schema is stricter](#func-names)
- [`allowConstructorFlags` option of `no-invalid-regexp` now accepts only unique items](#no-invalid-regexp)
- [`name` property added to ESLint core configs](#eslint-config-name)

### Breaking changes for plugin developers

- [Node.js < v20.19, v21, v23 are no longer supported](#drop-old-node)
- [Old config format no longer supported](#remove-eslintrc)
- [JSX references are now tracked](#jsx-reference-tracking)
- [Removal of `type` property in errors of invalid `RuleTester` cases](#ruletester-type-removed)
- [`Program` AST node range spans entire source text](#program-node-range)
- [Fixer methods now require string `text` arguments](#fixer-text-must-be-string)
- [New requirements for `ScopeManager` implementations](#scope-manager)
- [Removal of deprecated `context` members](#rule-context)
- [Removal of deprecated `SourceCode` methods](#sourcecode-methods-removed)
- [Prohibiting `errors` or `output` of valid RuleTester test cases](#stricter-rule-tester)
- [POSIX character classes in glob patterns](#posix-character-classes)

### Breaking changes for integration developers

- [Node.js < v20.19, v21, v23 are no longer supported](#drop-old-node)
- [New configuration file lookup algorithm](#config-lookup-from-file)
- [Old config format no longer supported](#remove-eslintrc)
- [Removal of `nodeType` property in `LintMessage` objects](#lintmessage-nodetype-removed)
- [POSIX character classes in glob patterns](#posix-character-classes)

---

## <a name="drop-old-node"></a> Node.js < v20.19, v21, v23 are no longer supported

ESLint is officially dropping support for these versions of Node.js starting with ESLint v10.0.0. ESLint now supports the following versions of Node.js:

- Node.js v20.19.0 and above
- Node.js v22.13.0 and above
- Node.js v24 and above

**To address:** Make sure you upgrade to at least Node.js v20.19.0 when using ESLint v10.0.0. One important thing to double check is the Node.js version supported by your editor when using ESLint via editor integrations. If you are unable to upgrade, we recommend continuing to use ESLint v9 until you are able to upgrade Node.js.

**Related issue(s):** [#19969](https://github.com/eslint/eslint/issues/19969)

## <a name="eslint-recommended"></a> `eslint:recommended` has been updated

Three new rules have been enabled in `eslint:recommended`:

- [`no-unassigned-vars`](../rules/no-unassigned-vars)
- [`no-useless-assignment`](../rules/no-useless-assignment)
- [`preserve-caught-error`](../rules/preserve-caught-error)

**To address:** Fix errors or disable these rules.

**Related issue(s):** [#19966](https://github.com/eslint/eslint/issues/19966)

## <a name="config-lookup-from-file"></a> New configuration file lookup algorithm

In ESLint v9, the alternate config lookup behavior could be enabled with the `v10_config_lookup_from_file` feature flag. This behavior made ESLint locate `eslint.config.*` by starting from the directory of each linted file and searching up towards the filesystem root. In ESLint v10.0.0, this behavior is now the default and the `v10_config_lookup_from_file` flag has been removed. Attempting to use this flag will now result in an error.

**To address:**

- Remove any usage of the flag in your setup:
    - CLI: remove `--flag v10_config_lookup_from_file`.
    - Environment: remove `v10_config_lookup_from_file` from `ESLINT_FLAGS`.
    - API: remove `"v10_config_lookup_from_file"` from the `flags` array passed to `new ESLint()` or `new Linter()`.
- If you relied on the previous (cwd-based) lookup behavior, provide an explicit config path with `--config path/to/eslint.config.js`.

**Related issue(s):** [RFC120](https://github.com/eslint/rfcs/tree/main/designs/2024-config-lookup-from-file), [#19967](https://github.com/eslint/eslint/issues/19967)

## <a name="remove-eslintrc"></a> Old config format no longer supported

ESLint v9 introduced a [new default configuration format](./configure/configuration-files) based on the `eslint.config.js` file. The old format, which used `.eslintrc` or `.eslintrc.json`, could still be enabled in v9 by setting the `ESLINT_USE_FLAT_CONFIG` environment variable to `false`.

Starting with ESLint v10.0.0, the old configuration format is no longer supported.

**To address:**

- Follow the instructions in the [configuration migration guide](./configure/migration-guide).
- Be aware that the deprecated APIs `FlatESLint` and `LegacyESLint` have been removed. Always use `ESLint` instead.
- The `configType` option of the `Linter` class can no longer be set to `"eslintrc"`. Remove the option to use the new configuration format.

**Related issue(s):** [#13481](https://github.com/eslint/eslint/issues/13481)

## <a name="jsx-reference-tracking"></a> JSX references are now tracked

ESLint v10.0.0 now tracks JSX references, enabling correct scope analysis of JSX elements.

Previously, ESLint did not track references created by JSX identifiers, which could lead to incorrect results from rules that rely on scope information. For example:

```jsx
import { Card } from "./card.jsx";

export function createCard(name) {
	return <Card name={name} />;
}
```

Prior to v10.0.0, ESLint did not recognize that `<Card>` is a reference to the imported `Card`, which could result in false positives such as reporting `Card` as "defined but never used" ([`no-unused-vars`](../rules/no-unused-vars)) or false negatives such as failing to report `Card` as undefined ([`no-undef`](../rules/no-undef)) if the import is removed. Starting with v10.0.0, `<Card>` is treated as a normal reference to the variable in scope. This brings JSX handling in line with developer expectations and improves the linting experience for modern JavaScript applications using JSX.

**To address:**

- For users:
    - New linting reports may appear in files with JSX. Update your code accordingly or adjust rule configurations if needed.
    - Rules previously used to work around ESLint’s lack of JSX reference tracking (for example, [`@eslint-react/jsx-uses-vars`](https://www.eslint-react.xyz/docs/rules/jsx-uses-vars)) are no longer needed. Remove or disable them in your configuration.
- For plugin developers: Custom rules relying on scope analysis may now encounter `JSXIdentifier` references. Update rules to handle these correctly.

**Related issue(s):** [#19495](https://github.com/eslint/eslint/issues/19495)

## <a name="eslint-env-comments"></a> `eslint-env` comments are reported as errors

In the now obsolete ESLint v8 configuration system, `/* eslint-env */` comments could be used to define globals for a file. The current configuration system does not support such comments, and starting with ESLint v10.0.0, they are reported as errors during linting.

```text
error: /* eslint-env */ comments are no longer supported at file.js:1:1:
> 1 | /* eslint-env node -- Used in Node.js */
    | ^
```

**To address:** Remove any `eslint-env` comments from your code. If you are still using the old configuration system and need help migrating, check the [migration guide](./configure/migration-guide#eslint-env-configuration-comments).

**Related issue(s):** [#13481](https://github.com/eslint/eslint/issues/13481)

## <a name="drop-old-jiti"></a> Jiti < v2.2.0 are no longer supported

ESLint is officially dropping support for versions of `jiti` that are less than v2.2.0.

**To address:** If you've authored your config file in `TypeScript` and have `jiti` v2.1.2 or earlier installed, be sure to update it to at least `2.2.0` when using ESLint v10.0.0.

**Related issue(s):** [#19765](https://github.com/eslint/eslint/issues/19765)

## <a name="posix-character-classes"></a> POSIX character classes in glob patterns

ESLint v10.0.0 uses the latest version of [minimatch](https://github.com/isaacs/minimatch), which supports [POSIX character classes](https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html) in bracket expressions. ESLint relies on minimatch to match file names against glob patterns, such as those defined in `files`, `ignores`, and `globalIgnores()` within a config, or passed via the CLI.

For example, to lint all `.js` files whose names begin with an uppercase letter, you can now run:

```shell
npx eslint "**/[[:upper:]]*.js"
```

Here, `[[:upper:]]` is a POSIX character class that matches uppercase letters in different alphabets.

**To address:** If any of the glob patterns in your configuration, CLI arguments, or Node.js API calls look like containing a POSIX character class, verify that they match files as intended.

**Related issue(s):** [eslint/rewrite#66](https://github.com/eslint/rewrite/issues/66)

## <a name="stylish-formatter"></a> `stylish` formatter now uses native `styleText` instead of `chalk`

Starting in ESLint v10.0.0, the built-in [`stylish`](./formatters#stylish) formatter no longer depends on the third-party [`chalk`](https://github.com/chalk/chalk) library for colorized output. Instead, it now uses Node.js's native [`styleText`](https://nodejs.org/api/util.html#utilstyletextformat-text-options) API, which introduces two breaking changes regarding how colorized output is determined:

1. First, `styleText` checks more environment variables when determining whether to disable colorized output and follows Node.js's own rules for when to enable or disable colors. This means it respects a wider set of environment variables and terminal capabilities than ESLint's previous `chalk`-based logic. For example:

    - [`NO_COLOR`](https://nodejs.org/api/cli.html#no_colorany) now disables colors consistently across tools that honor this convention.
    - [`NODE_DISABLE_COLORS`](https://nodejs.org/api/cli.html#node_disable_colors1) is also respected, aligning ESLint's behavior with Node.js itself.

    Please note that the [`FORCE_COLOR`](https://nodejs.org/api/cli.html#force_color1-2-3) environment variable is still supported to force-enable colors.

2. Second, `--color` and `--no-color` CLI flags now have higher precedence than environment variables when determining whether to use colorized output. This change ensures that explicit user preferences via CLI flags are prioritized. However, if neither flag is provided, environment variables will be considered as before.

**To address:**

- Review any environment configuration related to terminal colors (for example, CI defaults or shell profiles). If ESLint's output appears uncolored after upgrading to v10.0.0, check whether `NO_COLOR` or `NODE_DISABLE_COLORS` (or similar settings) are being set in your environment.
- If you rely on mixed approaches (for example, using `--color` flag but also setting `NO_COLOR` environment variable), be aware that the CLI flags now take precedence and adjust your setup accordingly.

**Related issue(s):** [#20012](https://github.com/eslint/eslint/issues/20012)

## <a name="radix"></a> Deprecated options of the `radix` rule

As of ESLint v10.0.0, string options `"always"` and `"as-needed"` of the [`radix`](../rules/radix) rule are deprecated. Setting either of these options doesn't change the behavior of this rule, which now always enforces providing a radix, as it was the case when the `"always"` option (default) was specified. Since the default radix depends on the first argument of `parseInt()`, this rule assumes that the second argument (the radix) is always needed.

The default behavior of this rule has not been changed.

**To address:**

- If you are using this rule without any options specified, there is no action required.
- If you are using this rule with the `"always"` option explicitly specified, remove the option. The behavior of this rule will remain the same.
- If you are using this rule with the `"as-needed"` option, remove the option and update your code to always provide the second argument to the `parseInt()` function. Alternatively, you can disable this rule.

**Related issue(s):** [#19916](https://github.com/eslint/eslint/issues/19916)

## <a name="no-shadow-restricted-names"></a> `no-shadow-restricted-names` now reports `globalThis` by default

In ESLint v10.0.0, the [`no-shadow-restricted-names`](../rules/no-shadow-restricted-names) rule now treats `globalThis` as a restricted name by default. Consequently, the `reportGlobalThis` option now defaults to `true` (previously `false`). As a result, declarations such as `const globalThis = "foo";` or `function globalThis() {}` will now be reported by default.

**To address:**

- Rename local identifiers named `globalThis` to avoid shadowing the global.
- Or restore the previous behavior by configuring the rule explicitly:

```json
{
	"rules": {
		"no-shadow-restricted-names": ["error", { "reportGlobalThis": false }]
	}
}
```

**Related issue(s):** [#19673](https://github.com/eslint/eslint/issues/19673)

## <a name="func-names"></a> `func-names` schema is stricter

In ESLint v10.0.0, the [`func-names`](../rules/func-names) rule schema now disallows extra items in the options array. Previously, configurations that included additional array elements beyond the allowed options were accepted but ignored. Such configurations are now considered invalid.

For example, this configuration is now invalid due to the extra element `"foo"`:

```js
/*eslint func-names: ["error", "always", { "generators": "never" }, "foo"]*/
```

**To address:**

- Remove any extra array elements from your `func-names` configuration so that it contains only:
    - a base string option: `"always" | "as-needed" | "never"`, and
    - optionally, an object option: `{ "generators": "always" | "as-needed" | "never" }`.

**Related issue(s):** [#20134](https://github.com/eslint/eslint/issues/20134)

## <a name="no-invalid-regexp"></a> `allowConstructorFlags` option of `no-invalid-regexp` now accepts only unique items

In ESLint v10.0.0, the `allowConstructorFlags` option of `no-invalid-regexp` no longer accepts duplicate flags as input. Previously, configurations with duplicate flags in the array were accepted but treated the same as having unique flags. Such configurations are now considered invalid and will result in a configuration error.

For example, this configuration is now invalid due to the duplicate `"u"` flag:

```js
/*eslint no-invalid-regexp: ["error", { "allowConstructorFlags": ["u", "y", "u"] }]*/
```

**To address:** Remove any duplicate flags from your `allowConstructorFlags` array configuration of `no-invalid-regexp` rule. Each flag should appear only once in the array.

**Related issue(s):** [#18755](https://github.com/eslint/eslint/issues/18755)

## <a name="eslint-config-name"></a> `name` property added to ESLint core configs

In ESLint v10.0.0, the `name` property has been restored to the ESLint core configs exported from `@eslint/js`. This property was previously removed due to incompatibility with the legacy eslintrc configuration system. Now that eslintrc is no longer supported, the `name` property has been added back.

This change should not require any action for most users. However, if you are using `@eslint/js` v10.x with the `FlatCompat` utility from `@eslint/eslintrc`, you should upgrade `@eslint/eslintrc` to the latest version to ensure compatibility.

**To address:** Upgrade `@eslint/eslintrc` to the latest version if you are using `FlatCompat`.

**Related issue(s):** [#19864](https://github.com/eslint/eslint/issues/19864)

## <a name="ruletester-type-removed"></a> Removal of `type` property in errors of invalid `RuleTester` cases

In ESLint v10.0.0, the deprecated `type` property in errors of invalid test cases for rules has been removed. Using the `type` property in test cases now throws an error.

**To address:** Remove the `type` property from error objects in invalid test cases.

**Related issue(s):** [#19029](https://github.com/eslint/eslint/issues/19029)

## <a name="program-node-range"></a> `Program` AST node range spans entire source text

ESLint v10.0.0 changes how the `Program` AST node’s range is calculated: it now spans the entire source text, including any leading and trailing comments and whitespace.

Previously, the `Program` node’s range excluded leading and trailing comments/whitespace, which could be unintuitive. For example:

```js
// Leading comment
const x = 1;
// Trailing comment
```

In ESLint v9 and earlier, `Program.range` covers only `const x = 1;` (excludes surrounding comments/whitespace).

Starting with ESLint v10.0.0, `Program.range` covers the entire source text, including the leading and trailing comments/whitespace.

**To address:**

- For rule and plugin authors: If your code depends on the previous `Program.range` behavior, or on `SourceCode` methods that assume it (such as `sourceCode.getCommentsBefore(programNode)` to retrieve all leading comments), update your logic. If your code reports on the `Program` node, update your logic to report on the first statement within the `Program` node, i.e. `node.body[0] ?? node`, to ensure the directive `/* eslint-disable your-rule */` can still work.
- For custom parsers: Set `Program.range` to cover the full source text (typically `[0, code.length]`).

**Related issue(s):** [eslint/js#648](https://github.com/eslint/js/issues/648)

## <a name="fixer-text-must-be-string"></a> Fixer methods now require string `text` arguments

In ESLint v10.0.0, all rule fixer methods that accept a `text` argument now require that it be a string. Providing a non-string value will throw a `TypeError`.

Affected methods:

- `insertTextBefore(nodeOrToken, text)`
- `insertTextBeforeRange(range, text)`
- `insertTextAfter(nodeOrToken, text)`
- `insertTextAfterRange(range, text)`
- `replaceText(nodeOrToken, text)`
- `replaceTextRange(range, text)`

**To address:** Ensure the `text` value you pass to fixer methods is a string.

**Related issue(s):** [#18807](https://github.com/eslint/eslint/issues/18807)

## <a name="scope-manager"></a> New requirements for `ScopeManager` implementations

In ESLint v10.0.0, custom `ScopeManager` implementations must automatically resolve references to global variables declared in the code, including `var` and `function` declarations, and provide an instance method `addGlobals(names: string[])` that creates variables with the given names in the global scope and resolves references to them.

The default `ScopeManager` implementation [`eslint-scope`](https://www.npmjs.com/package/eslint-scope) has already been updated.

This change does not affect custom rules.

**To address:** If you maintain a custom parser that provides a custom `ScopeManager` implementation, update your custom `ScopeManager` implementation.

**Related issue(s):** [eslint/js#665](https://github.com/eslint/js/issues/665)

## <a name="rule-context"></a> Removal of deprecated `context` members

In ESLint v9.x, we deprecated the following [methods](https://eslint.org/blog/2023/09/preparing-custom-rules-eslint-v9/#context-methods-becoming-properties) and [properties](https://eslint.org/blog/2023/09/preparing-custom-rules-eslint-v9/#context-properties%3A-parseroptions-and-parserpath-being-removed):

- `context.getCwd()`
- `context.getFilename()`
- `context.getPhysicalFilename()`
- `context.getSourceCode()`
- `context.parserOptions`
- `context.parserPath`

In ESLint v10.0.0, all of these members have been removed.

**To address:** In your custom rules, make the following changes:

| **Removed on `context`**        | **Replacement on `context`**                                         |
| ------------------------------- | -------------------------------------------------------------------- |
| `context.getCwd()`              | `context.cwd`                                                        |
| `context.getFilename()`         | `context.filename`                                                   |
| `context.getPhysicalFilename()` | `context.physicalFilename`                                           |
| `context.getSourceCode()`       | `context.sourceCode`                                                 |
| `context.parserOptions`         | `context.languageOptions` or `context.languageOptions.parserOptions` |
| `context.parserPath`            | No replacement.                                                      |

You can make changes for the removed `context` methods using the [`eslint-transforms`](https://www.npmjs.com/package/eslint-transforms) utility. To use the utility, first install it and then run the `v9-rule-migration` transform, like this:

```shell
# install the utility
npm install eslint-transforms -g

# apply the transform to one file
eslint-transforms v9-rule-migration rule.js

# apply the transform to all files in a directory
eslint-transforms v9-rule-migration rules/
```

The removed `context` properties must be done manually as there may not be a direct one-to-one replacement.

**Related issue(s):** [eslint/eslint#16999](https://github.com/eslint/eslint/issues/16999)

## <a name="sourcecode-methods-removed"></a> Removal of deprecated `SourceCode` methods

The following deprecated `SourceCode` methods have been removed in ESLint v10.0.0:

- `getTokenOrCommentBefore()`
- `getTokenOrCommentAfter()`
- `isSpaceBetweenTokens()`
- `getJSDocComment()`

These methods have been deprecated for multiple major versions and were primarily used by deprecated formatting rules and internal ESLint utilities. Custom rules using these methods must be updated to use their modern replacements.

**To address:** In your custom rules, make the following changes:

| **Removed on `SourceCode`**                  | **Replacement**                                                |
| -------------------------------------------- | -------------------------------------------------------------- |
| `getTokenOrCommentBefore(nodeOrToken, skip)` | `getTokenBefore(nodeOrToken, { includeComments: true, skip })` |
| `getTokenOrCommentAfter(nodeOrToken, skip)`  | `getTokenAfter(nodeOrToken, { includeComments: true, skip })`  |
| `isSpaceBetweenTokens(first, second)`        | `isSpaceBetween(first, second)`                                |
| `getJSDocComment(node)`                      | No replacement                                                 |

Compatibility patches are available in the [`@eslint/compat`](https://www.npmjs.com/package/@eslint/compat) package to help with the transition.

**Related issue(s):** [#20113](https://github.com/eslint/eslint/issues/20113)

## <a name="stricter-rule-tester"></a> Prohibiting `errors` or `output` of valid RuleTester test cases

In ESLint v10.0.0, the RuleTester has become more strict about test case structure. Valid test cases (those that should not produce any linting errors) are no longer allowed to have `errors` or `output` properties.

​What changed:​​

- Previously, valid test cases could include `errors` or `output` properties, which were ignored.
- Now, including these properties in valid test cases will cause the test to fail.

Example of invalid usage:​

```js
// This will now throw an error in ESLint v10.0.0
const validTestCases = [
	{
		code: "const foo = 'bar';",
		errors: 0, // ❌ Not allowed in valid test cases
		output: "const foo = 'bar';", // ❌ Not allowed in valid test cases
	},
];

ruleTester.run("rule-id", rule, { valid: validTestCases, invalid: [] });
```

**To address:** Remove any `errors`/`output` properties from valid test cases.

**Related issue(s):** [#18960](https://github.com/eslint/eslint/issues/18960)

## <a name="lintmessage-nodetype-removed"></a> Removal of `nodeType` property in `LintMessage` objects

In ESLint v10.0.0, the deprecated `nodeType` property on `LintMessage` objects has been removed. This affects consumers of the Node.js API (for example, custom formatters and editor/tool integrations) that previously relied on `message.nodeType`.

**To address:** Remove all usages of `message.nodeType` in your integrations and formatters.

**Related issue(s):** [#19029](https://github.com/eslint/eslint/issues/19029)
