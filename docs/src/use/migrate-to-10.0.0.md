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
- [New configuration file lookup algorithm](#config-lookup-from-file)
- [`no-shadow-restricted-names` now reports `globalThis` by default](#no-shadow-restricted-names)
- [`eslint:recommended` has been updated](#eslint-recommended)
- [Jiti < v2.2.0 are no longer supported](#drop-old-jiti)
- [`eslint-env` comments are reported as errors](#eslint-env-comments)
- [`func-names` schema is stricter](#func-names)

### Breaking changes for plugin developers

- [Node.js < v20.19, v21, v23 are no longer supported](#drop-old-node)
- [Removal of `type` property in errors of invalid `RuleTester` cases](#ruletester-type-removed)

### Breaking changes for integration developers

- [Node.js < v20.19, v21, v23 are no longer supported](#drop-old-node)
- [New configuration file lookup algorithm](#config-lookup-from-file)
- [Removal of `nodeType` property in `LintMessage` objects](#lintmessage-nodetype-removed)

---

## <a name="drop-old-node"></a> Node.js < v20.19, v21, v23 are no longer supported

ESLint is officially dropping support for these versions of Node.js starting with ESLint v10.0.0. ESLint now supports the following versions of Node.js:

- Node.js v20.19.0 and above
- Node.js v22.13.0 and above
- Node.js v24 and above

**To address:** Make sure you upgrade to at least Node.js v20.19.0 when using ESLint v10. One important thing to double check is the Node.js version supported by your editor when using ESLint via editor integrations. If you are unable to upgrade, we recommend continuing to use ESLint v9 until you are able to upgrade Node.js.

**Related issue(s):** [#19969](https://github.com/eslint/eslint/issues/19969)

## <a name="config-lookup-from-file"></a> New configuration file lookup algorithm

In ESLint v9, the alternate config lookup behavior could be enabled with the `v10_config_lookup_from_file` feature flag. This behavior made ESLint locate `eslint.config.*` by starting from the directory of each linted file and searching up towards the filesystem root. In ESLint v10, this behavior is now the default and the `v10_config_lookup_from_file` flag has been removed. Attempting to use this flag will now result in an error.

**To address:**

- Remove any usage of the flag in your setup:
    - CLI: remove `--flag v10_config_lookup_from_file`.
    - Environment: remove `v10_config_lookup_from_file` from `ESLINT_FLAGS`.
    - API: remove `"v10_config_lookup_from_file"` from the `flags` array passed to `new ESLint()` or `new Linter()`.
- If you relied on the previous (cwd-based) lookup behavior, provide an explicit config path with `--config path/to/eslint.config.js`.

**Related issue(s):** [#19967](https://github.com/eslint/eslint/issues/19967)

## <a name="no-shadow-restricted-names"></a> `no-shadow-restricted-names` now reports `globalThis` by default

In ESLint v10, the [`no-shadow-restricted-names`](../rules/no-shadow-restricted-names) rule now treats `globalThis` as a restricted name by default. Consequently, the `reportGlobalThis` option now defaults to `true` (previously `false`). As a result, declarations such as `const globalThis = "foo";` or `function globalThis() {}` will now be reported by default.

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

## <a name="eslint-recommended"></a> `eslint:recommended` has been updated

Three new rules have been enabled in `eslint:recommended`:

- [`no-unassigned-vars`](../rules/no-unassigned-vars)
- [`no-useless-assignment`](../rules/no-useless-assignment)
- [`preserve-caught-error`](../rules/preserve-caught-error)

**To address:** Fix errors or disable these rules.

**Related issue(s):** [#19966](https://github.com/eslint/eslint/issues/19966)

## <a name="drop-old-jiti"></a> Jiti < v2.2.0 are no longer supported

ESLint is officially dropping support for versions of `jiti` that are less than v2.2.0.

**To address:** If you've authored your config file in `TypeScript` and have `jiti` v2.1.2 or earlier installed, be sure to update it to at least `2.2.0` when using ESLint v10.

**Related issue(s):** [#19765](https://github.com/eslint/eslint/issues/19765)

## <a name="ruletester-type-removed"></a> Removal of `type` property in errors of invalid `RuleTester` cases

In ESLint v10, the deprecated `type` property in errors of invalid test cases for rules has been removed. Using the `type` property in test cases now throws an error.

**To address:** Remove the `type` property from error objects in invalid test cases.

**Related issue(s):** [#19029](https://github.com/eslint/eslint/issues/19029)

## <a name="lintmessage-nodetype-removed"></a> Removal of `nodeType` property in `LintMessage` objects

In ESLint v10, the deprecated `nodeType` property on `LintMessage` objects has been removed. This affects consumers of the Node.js API (for example, custom formatters and editor/tool integrations) that previously relied on `message.nodeType`.

**To address:** Remove all usages of `message.nodeType` in your integrations and formatters.

**Related issue(s):** [#19029](https://github.com/eslint/eslint/issues/19029)

## <a name="eslint-env-comments"></a> `eslint-env` comments are reported as errors

In the now obsolete ESLint v8 configuration system, `/* eslint-env */` comments could be used to define globals for a file. The current configuration system does not support such comments, and starting with ESLint v10, they are reported as errors during linting.

```text
error: /* eslint-env */ comments are no longer supported at file.js:1:1:
> 1 | /* eslint-env node -- Used in Node.js */
    | ^
```

**To address:** Remove any `eslint-env` comments from your code. If you are still using the old configuration system and need help migrating, check the [migration guide](./configure/migration-guide#eslint-env-configuration-comments).

**Related issue(s):** [#13481](https://github.com/eslint/eslint/issues/13481)

## <a name="func-names"></a> `func-names` schema is stricter

In ESLint v10, the [`func-names`](../rules/func-names) rule schema now disallows extra items in the options array. Previously, configurations that included additional array elements beyond the allowed options were accepted but ignored. Such configurations are now considered invalid.

For example, this configuration is now invalid due to the extra element `"foo"`:

```js
/*eslint func-names: ["error", "always", { "generators": "never" }, "foo"]*/
```

**To address:**

- Remove any extra array elements from your `func-names` configuration so that it contains only:
    - a base string option: `"always" | "as-needed" | "never"`, and
    - optionally, an object option: `{ "generators": "always" | "as-needed" | "never" }`.

**Related issue(s):** [#20134](https://github.com/eslint/eslint/issues/20134)

<!-- TODO -->
