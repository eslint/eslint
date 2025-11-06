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

### Breaking changes for plugin developers

- [Node.js < v20.19, v21, v23 are no longer supported](#drop-old-node)

### Breaking changes for integration developers

- [Node.js < v20.19, v21, v23 are no longer supported](#drop-old-node)
- [New configuration file lookup algorithm](#config-lookup-from-file)

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
- If you relied on the previous (cwd-based) lookup behavior, either:
    - Run ESLint from the directory containing the desired config file, or
    - Provide an explicit config path with `-c, --config path/to/eslint.config.js`.

**Related issue(s):** [#19967](https://github.com/eslint/eslint/issues/19967)
