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
- [`no-shadow-restricted-names` now reports `globalThis` by default](#no-shadow-restricted-names)

### Breaking changes for plugin developers

- [Node.js < v20.19, v21, v23 are no longer supported](#drop-old-node)

### Breaking changes for integration developers

- [Node.js < v20.19, v21, v23 are no longer supported](#drop-old-node)

---

## <a name="drop-old-node"></a> Node.js < v20.19, v21, v23 are no longer supported

ESLint is officially dropping support for these versions of Node.js starting with ESLint v10.0.0. ESLint now supports the following versions of Node.js:

- Node.js v20.19.0 and above
- Node.js v22.13.0 and above
- Node.js v24 and above

**To address:** Make sure you upgrade to at least Node.js v20.19.0 when using ESLint v10. One important thing to double check is the Node.js version supported by your editor when using ESLint via editor integrations. If you are unable to upgrade, we recommend continuing to use ESLint v9 until you are able to upgrade Node.js.

**Related issue(s):** [#19969](https://github.com/eslint/eslint/issues/19969)

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
