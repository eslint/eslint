# Migrating to v7.0.0

ESLint v7.0.0 is a major release of ESLint. We have made a few breaking changes in this release. This guide is intended to walk you through the breaking changes.

The lists below are ordered roughly by the number of users each change is expected to affect, where the first items are expected to affect the most users.

## Table of Content

### Breaking changes for users

- [Node.js 8 is no longer supported](#drop-node-8)
- [Lint the files that match to `overrides[].files` by default](#additional-lint-targets)
- [The base path of `overrides` and `ignorePatterns` is changed](#base-path-change)
- [The place that ESLint loads plugins from is changed](#plugin-loading-change)
- [Runtime deprecation warnings on `~/.eslintrc.*` config files](#runtime-deprecation-on-personal-config-files)
- [Default ignore patterns are changed](#default-ignore-patterns)
- [Description in directive comments](#description-in-directive-comments)
- [Several rules get strict](#rules-strict)
- [`eslint:recommended` is updated](#eslint-recommended)

### Breaking changes for plugin/custom rule developers

- [Node.js 8 is no longer supported](#drop-node-8)
- [`CLIEngine` class has been deprecated](#deprecate-cliengine)
- [The place that ESLint loads plugins from is changed](#plugin-loading-change)

### Breaking changes for integration developers

- [Node.js 8 is no longer supported](#drop-node-8)
- [`CLIEngine` class has been deprecated](#deprecate-cliengine)
- [The place that ESLint loads plugins from is changed](#plugin-loading-change)

---

## <a name="drop-node-8"></a> Node.js 8 is no longer supported

⚠️ NOT IMPLEMENTED YET.

Node.js 8 has been at EOL since December 2019. As a result, we have decided to drop support for it in ESLint 7. We now support the following versions of Node.js:

- Node.js 10 (`10.12.0` and above)
- Anything above Node.js 12

**To address:** Make sure you upgrade to at least Node.js `10.12.0` when using ESLint 7. Mind the Node.js version of your editor when using ESLint 7 via editor integrations. If you are unable to upgrade, we recommend continuing to use ESLint 6 until you are able to upgrade Node.js.

**Related issue(s):** [RFC44](https://github.com/eslint/rfcs/blob/master/designs/2019-drop-node8/README.md)

## <a name="additional-lint-targets"></a> Lint the files that match to `overrides[].files` by default

⚠️ NOT IMPLEMENTED YET.

Previously, ESLint lints only `*.js` files by default if directories are present.

    eslint src

In the situation, ESLint 7 lints the files that match to `overrides` as well. (But it excepts patterns that end with `*` in order to avoid linting unlimitedly.)

**To address:** Add `--ext js` option if you are using `overrides` but don't want to lint other files than `*.js` automatically.

**Related issue(s):** [RFC20](https://github.com/eslint/rfcs/blob/master/designs/2019-additional-lint-targets/README.md)

## <a name="base-path-change"></a> The base path of `overrides` and `ignorePatterns` is changed

⚠️ NOT IMPLEMENTED YET.

ESLint resolves the paths in `overrides[].files`, `overrides[].excludedFiles`, and `ignorePatterns` as relative to the directory path of having the config file.

Since ESLint 7, only if the config file is used with `--config path/to/a-config` option then ESLint resolves those paths as relative to the current working directory.

**To address:** Update `overrides[].files`, `overrides[].excludedFiles`, and `ignorePatterns` if you are using the config file with `--config` CLI option.

**Related issue(s):** [RFC37](https://github.com/eslint/rfcs/blob/master/designs/2019-changing-base-path-in-config-files-that-cli-options-specify/README.md)

## <a name="plugin-loading-change"></a> The place that ESLint loads plugins from is changed

⚠️ NOT IMPLEMENTED YET.

Previously, ESLint resolves all plugins from the current working directory by default.

Since ESLint 7, it resolves the `plugins` setting as relative to the directory of having the _entry_ config file. (the _entry_ means that the `plugins` setting of shareable configs is resolved as relative to the directory of having the first extender.)

This will not change anything in most cases. If a config file in a subdirectory has `plugins` setting, the plugins will be loaded from the subdirectory (or an ancestor directory). If you are using a config file of a shared location with `--config` option, the plugins the config file declare will be loaded from the shared location.

**To address:** Install plugins to the proper place or add `--resolve-plugins-relative-to .` option to override this change.

**Related issue(s):** [RFC47](https://github.com/eslint/rfcs/blob/master/designs/2019-plugin-loading-improvement/README.md)

## <a name="runtime-deprecation-on-personal-config-files"></a> Runtime deprecation warnings on `~/.eslintrc.*` config files

⚠️ NOT IMPLEMENTED YET.

Personal config files have been deprecated since [v6.7.0](https://eslint.org/blog/2019/11/eslint-v6.7.0-released). As planned, v7.0.0 has started to print runtime deprecation warnings. It prints the warnings when the following situations:

1. When ESLint loaded `~/.eslintrc.*` config files because project's config was not present.
1. When ESLint ignored `~/.eslintrc.*` config files because project's config was present. (in other words, the HOME directory is an ancestor directory of the project and the project config didn't have `root:true` setting.)

**To address:** Remove `~/.eslintrc.*` config files then add `.eslintrc.*` config files to your project directory. Or use `--config` option to use shared config files.

**Related issue(s):** [RFC32](https://github.com/eslint/rfcs/tree/master/designs/2019-deprecating-personal-config/README.md)

## <a name="default-ignore-patterns"></a> Default ignore patterns are changed

⚠️ NOT IMPLEMENTED YET.

ESLint 7 ignores `node_modules/*` of subdirectories as well, but no longer ignores `bower_components/*` and `.eslintrc.js`.

**To address:** Update your `.eslintignore` or the `ignorePatterns` property of your config file if you don't want to lint `bower_components/*` and `.eslintrc.js`.

**Related issue(s):** RFC51 (TODO: link)

## <a name="description-in-directive-comments"></a> Description in directive comments

⚠️ NOT IMPLEMENTED YET.

ESLint 7 ignores the part preceded by `--` in directive comments. For example:

```js
// eslint-disable-next-line a-rule, another-rule -- those are buggy!!
```

**To address:** If you have `--` surrounded by whitespaces in the configuration in directive comments, consider to move it to your config file.

**Related issue(s):** [RFC33](https://github.com/eslint/rfcs/blob/master/designs/2019-description-in-directive-comments/README.md)

## <a name="rules-strict"></a> Several rules get strict

⚠️ NOT IMPLEMENTED YET.

Several rules now report more errors as enhancement:

- [array-callback-return](https://eslint.org/docs/rules/array-callback-return) rule now recognizes `flatMap` method.
- [func-names](https://eslint.org/docs/rules/func-names) rule now recognizes function declarations in default exports.
- [no-magic-number](https://eslint.org/docs/rules/no-magic-number) rule now recognizes bigint literals.
- [yoda](https://eslint.org/docs/rules/yoda) rule now recognizes bigint literals.
- (TODO: others if exist)

**To address:** Update your code if new warnings appeared.

**Related issue(s):** [#11803](https://github.com/eslint/eslint/issues/11803), [#12235](https://github.com/eslint/eslint/issues/12235), [#12670](https://github.com/eslint/eslint/issues/12670)

## <a name="eslint-recommended"></a> `eslint:recommended` is updated

⚠️ NOT IMPLEMENTED YET.

TBD

**To address:** TBD

**Related issue(s):** TBD

## <a name="deprecate-cliengine"></a> `CLIEngine` class has been deprecated

⚠️ NOT IMPLEMENTED YET.

[`CLIEngine` class](https://eslint.org/docs/developer-guide/nodejs-api#cliengine) has been deprecated and replaced by new [`ESLint` class](https://eslint.org/docs/developer-guide/nodejs-api#eslint).

Because `CLIEngine` class provides synchronous API and we have a bundle of impossible features on the synchronous API. For example, parallel linting, ES modules, and printing progress. Therefore, new `ESLint` class provides only asynchronous API. `CLIEngine` class is left as-is for migration while a time. (we have not determined when we remove `CLIEngine` class yet.)

**To address:** Use `ESLint` class if you are using `CLIEngine` class. The `ESLint` class has similar methods:

- `CLIEngine#addPlugin()` → `plugins` constructor option
- `CLIEngine#executeOnText()` → `ESLint#lintText()`
- `CLIEngine#executeOnFiles()` → `ESLint#lintFiles()`
- `CLIEngine#getConfigForFile()` → `ESLint#getConfigForFile()`
- `CLIEngine#getRules()` → `ESLint#getRulesForFile()`
- `CLIEngine#isPathIgnored()` → `ESLint#isPathIgnored()`
- `CLIEngine#resolveFileGlobPatterns()` → (removed)
- `CLIEngine.getFormatter()` → `ESLint#getFormatter()`
- `CLIEngine.getErrorResults()` → `ESLint.getErrorResults()`
- `CLIEngine.outputFixes()` → `ESLint.outputFixes()`

**Related issue(s):** RFC40 (TODO: link)
