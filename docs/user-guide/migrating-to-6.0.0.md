# Migrating to v6.0.0

ESLint v6.0.0 is the fifth major version release. We have made a few breaking changes in this release, but we expect that most users will be able to upgrade without any modifications to their build. This guide is intended to walk you through the breaking changes.

The lists below are ordered roughly by the number of users each change is expected to affect, where the first items are expected to affect the most users.

### Breaking changes for users

- [`no-redeclare` rule now checks the redeclarations by `/* globals */` directive comments](#no-redeclare-and-comments)
- [`no-redeclare` rule now checks the redeclarations with built-in globals by default](#no-redeclare-and-builtins)

### Breaking changes for plugin/custom rule developers

- [`variable.eslintExplicitGlobalComment` property was removed](#remove-variable-explicit-global-comment)

### Breaking changes for integration developers

---

<!-- Breaking changes for users -->

## <a id="no-redeclare-and-comments"></a> `no-redeclare` rule now checks the redeclarations by `/* globals */` directive comments

[no-redeclare] rule reports the following cases newly:

- Your config file defined a global variable but there is `/* globals */` directive comment of the defined global variable in your source code.
- There are multiple `/* globals */` directive comments for the same variable.

**To address:** Please remove the redundant `/* globals */` directive comments.

## <a id="no-redeclare-and-builtins"></a> `no-redeclare` rule now checks the redeclarations with built-in globals by default

The `builtinGlobals` option of [no-redeclare] rule is `true` by default. Previously, it was `false` by default.

**To address:** Please remove the redundant declarations or disable `builtinGlobals` option manually.

---

<!-- Breaking changes for plugin/custom rule developers -->

## <a id="remove-variable-explicit-global-comment"></a> `variable.eslintExplicitGlobalComment` property was removed

Undocumented `variable.eslintExplicitGlobalComment` property, only [no-unused-vars] rule had used it, was removed.

**To address:** Please use [`variable.eslintExplicitGlobalComments` property](../working-with-rules.md#contextgetscope) instead.

---

<!-- Breaking changes for integration developers -->

[no-redeclare]: https://eslint.org/docs/rules/no-redeclare
[no-unused-vars]: https://eslint.org/docs/rules/no-unused-vars
