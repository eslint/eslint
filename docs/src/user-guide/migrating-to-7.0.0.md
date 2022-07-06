---
title: Migrating to v7.0.0
layout: doc
edit_link: https://github.com/eslint/eslint/edit/main/docs/src/user-guide/migrating-to-7.0.0.md

---

ESLint v7.0.0 is a major release of ESLint. We have made a few breaking changes in this release. This guide is intended to walk you through the breaking changes.

The lists below are ordered roughly by the number of users each change is expected to affect, where the first items are expected to affect the most users.

## Table of Content

### Breaking changes for users

* [Node.js 8 is no longer supported](#drop-node-8)
* [Lint files matched by `overrides[].files` by default](#additional-lint-targets)
* [The base path of `overrides` and `ignorePatterns` is changed if the config file is given by the `--config`/`--ignore-path` options](#base-path-change)
* [The place where ESLint loads plugins from is changed](#plugin-loading-change)
* [Runtime deprecation warnings for `~/.eslintrc.*` config files](#runtime-deprecation-on-personal-config-files)
* [Default ignore patterns have changed](#default-ignore-patterns)
* [Description in directive comments](#description-in-directive-comments)
* [Node.js/CommonJS rules are deprecated](#deprecate-node-rules)
* [Several rules have been updated to cover more cases](#rules-strict)
* [`eslint:recommended` has been updated](#eslint-recommended)

### Breaking changes for plugin developers

* [Node.js 8 is no longer supported](#drop-node-8)
* [Lint files matched by `overrides[].files` by default](#additional-lint-targets)
* [Plugin resolution has been updated](#plugin-loading-change)
* [Additional validation added to the `RuleTester` class](#rule-tester-strict)

### Breaking changes for integration developers

* [Node.js 8 is no longer supported](#drop-node-8)
* [Plugin resolution has been updated](#plugin-loading-change)
* [The `CLIEngine` class has been deprecated](#deprecate-cliengine)

---

## <a name="drop-node-8"></a> Node.js 8 is no longer supported

Node.js 8 reached EOL in December 2019, and we are officially dropping support for it in this release. ESLint now supports the following versions of Node.js:

* Node.js 10 (`10.12.0` and above)
* Node.js 12 and above

**To address:** Make sure you upgrade to at least Node.js `10.12.0` when using ESLint v7.0.0. One important thing to double check is the Node.js version supported by your editor when using ESLint via editor integrations. If you are unable to upgrade, we recommend continuing to use ESLint 6 until you are able to upgrade Node.js.

**Related issue(s):** [RFC44](https://github.com/eslint/rfcs/blob/master/designs/2019-drop-node8/README.md), [#12700](https://github.com/eslint/eslint/pull/12700)

## <a name="additional-lint-targets"></a> Lint files matched by `overrides[].files` by default

Previously to v7.0.0, ESLint would only lint files with a `.js` extension by default if you give directories like `eslint src`.

ESLint v7.0.0 will now additionally lint files with other extensions (`.ts`, `.vue`, etc.) if the extension is explicitly matched by an `overrides[].files` entry. This will allow for users to lint files that don't end with `*.js` to be linted without having to use the `--ext` command line flag, as well as allow shared configuration authors to enable linting of these files without additional overhead for the end user. Please note that patterns that end with `*` are exempt from this behavior and will behave as they did previously. For example, if the following config file is present,

```yml
# .eslintrc.yml
extends: my-config-js
overrides:
  - files: "*.ts"
    extends: my-config-ts
```

then running `eslint src` would check both `*.js` and `*.ts` files in the `src` directory.

**To address:** Using the `--ext` CLI option will override this new behavior. Run ESLint with `--ext .js`  if you are using `overrides` but only want to lint files that have a `.js` extension.

If you maintain plugins that check files with extensions other than `.js`, this feature will allow you to check these files by default by configuring an `overrides` setting in your `recommended` preset.

**Related issue(s):** [RFC20](https://github.com/eslint/rfcs/blob/master/designs/2019-additional-lint-targets/README.md), [#12677](https://github.com/eslint/eslint/pull/12677)

## <a name="base-path-change"></a> The base path of `overrides` and `ignorePatterns` has changed when using the `--config`/`--ignore-path` options

Up until now, ESLint has resolved the following paths relative to the directory path of the _entry_ configuration file:

* Configuration files (`.eslintrc.*`)
    * relative paths in the `overrides[].files` setting
    * relative paths in the `overrides[].excludedFiles` setting
    * paths which start with `/` in the `ignorePatterns` setting
* Ignore files (`.eslintignore`)
    * paths which start with `/`

Starting in ESLint v7.0.0, configuration files and ignore files passed to ESLint using the `--config path/to/a-config` and `--ignore-path path/to/a-ignore` CLI flags, respectively, will resolve from the current working directory rather than the file location. This allows for users to utilize shared plugins without having to install them directly in their project.

**To address:** Update the affected paths if you are using a configuration or ignore file via the `--config` or `--ignore-path` CLI options.

**Related issue(s):** [RFC37](https://github.com/eslint/rfcs/blob/master/designs/2019-changing-base-path-in-config-files-that-cli-options-specify/README.md), [#12887](https://github.com/eslint/eslint/pull/12887)

## <a name="plugin-loading-change"></a> Plugin resolution has been updated

In previous versions, ESLint resolved all plugins from the current working directory by default.

Starting in ESLint v7.0.0, `plugins` are resolved relative to the directory path of the _entry_ configuration file.

This will not change anything in most cases. If a configuration file in a subdirectory has `plugins` defined, the plugins will be loaded from the subdirectory (or ancestor directories that include the current working directory if not found).

This means that if you are using a config file from a shared location via `--config` option, the plugins that the config file declare will be loaded from the shared config file location.

**To address:** Ensure that plugins are installed in a place that can be resolved relative to your configuration file or use `--resolve-plugins-relative-to .` to override this change.

**Related issue(s):** [RFC47](https://github.com/eslint/rfcs/blob/master/designs/2019-plugin-loading-improvement/README.md), [#12922](https://github.com/eslint/eslint/pull/12922)

## <a name="runtime-deprecation-on-personal-config-files"></a> Runtime deprecation warnings for `~/.eslintrc.*` config files

Personal config files have been deprecated since [v6.7.0](https://eslint.org/blog/2019/11/eslint-v6.7.0-released). ESLint v7.0.0 will start printing runtime deprecation warnings. It will print a warning for the following situations:

1. When a project does not have a configuration file present and ESLint loads configuration from `~/.eslintrc.*`.
1. When a project has a configuration file and ESLint ignored a `~/.eslintrc.*` configuration file. This occurs when the `$HOME` directory is an ancestor directory of the project and the project's configuration files doesn't contain `root:true`.

**To address:** Remove `~/.eslintrc.*` configuration files and add a `.eslintrc.*` configuration file to your project. Alternatively, use the `--config` option to use shared config files.

**Related issue(s):** [RFC32](https://github.com/eslint/rfcs/tree/master/designs/2019-deprecating-personal-config/README.md), [#12678](https://github.com/eslint/eslint/pull/12678)

## <a name="default-ignore-patterns"></a> Default ignore patterns have changed

Up until now, ESLint has ignored the following files by default:

* Dotfiles (`.*`)
* `node_modules` in the current working directory (`/node_modules/*`)
* `bower_components` in the current working directory (`/bower_components/*`)

ESLint v7.0.0 ignores `node_modules/*` of subdirectories as well, but no longer ignores `bower_components/*` and `.eslintrc.js`. Therefore, the new default ignore patterns are:

* Dotfiles except `.eslintrc.*` (`.*` but not `.eslintrc.*`)
* `node_modules` (`/**/node_modules/*`)

**To address:** Modify your `.eslintignore` or the `ignorePatterns` property of your config file if you don't want to lint `bower_components/*` and `.eslintrc.js`.

**Related issue(s):** [RFC51](https://github.com/eslint/rfcs/blob/master/designs/2019-update-default-ignore-patterns/README.md), [#12888](https://github.com/eslint/eslint/pull/12888)

## <a name="description-in-directive-comments"></a> Descriptions in directive comments

In older version of ESLint, there was no convenient way to indicate why a directive comment – such as `/*eslint-disable*/` – was necessary.

To allow for the colocation of comments that provide context with the directive, ESLint v7.0.0 adds the ability to append arbitrary text in directive comments by ignoring text following `--` surrounded by whitespace. For example:

```js
// eslint-disable-next-line a-rule, another-rule -- those are buggy!!
```

**To address:** If you have `--` surrounded by whitespace in directive comments, consider moving it into your configuration file.

**Related issue(s):** [RFC33](https://github.com/eslint/rfcs/blob/master/designs/2019-description-in-directive-comments/README.md), [#12699](https://github.com/eslint/eslint/pull/12699)

## <a name="deprecate-node-rules"></a> Node.js/CommonJS rules have been deprecated

The ten Node.js/CommonJS rules in core have been deprecated and moved to the [eslint-plugin-node](https://github.com/mysticatea/eslint-plugin-node) plugin.

**To address:** As per [our deprecation policy](https://eslint.org/docs/user-guide/rule-deprecation), the deprecated rules will remain in core for the foreseeable future and are still available for use. However, we will no longer be updating or fixing any bugs in those rules. To use a supported version of the rules, we recommend using the corresponding rules in the plugin instead.

| Deprecated Rules                                                             | Replacement                                                                                                                     |
| :--------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| [callback-return](https://eslint.org/docs/rules/callback-return)             | [node/callback-return](https://github.com/mysticatea/eslint-plugin-node/blob/v11.1.0/docs/rules/callback-return.md)             |
| [global-require](https://eslint.org/docs/rules/global-require)               | [node/global-require](https://github.com/mysticatea/eslint-plugin-node/blob/v11.1.0/docs/rules/global-require.md)               |
| [handle-callback-err](https://eslint.org/docs/rules/handle-callback-err)     | [node/handle-callback-err](https://github.com/mysticatea/eslint-plugin-node/blob/v11.1.0/docs/rules/handle-callback-err.md)     |
| [no-mixed-requires](https://eslint.org/docs/rules/no-mixed-requires)         | [node/no-mixed-requires](https://github.com/mysticatea/eslint-plugin-node/blob/v11.1.0/docs/rules/no-mixed-requires.md)         |
| [no-new-require](https://eslint.org/docs/rules/no-new-require)               | [node/no-new-require](https://github.com/mysticatea/eslint-plugin-node/blob/v11.1.0/docs/rules/no-new-require.md)               |
| [no-path-concat](https://eslint.org/docs/rules/no-path-concat)               | [node/no-path-concat](https://github.com/mysticatea/eslint-plugin-node/blob/v11.1.0/docs/rules/no-path-concat.md)               |
| [no-process-env](https://eslint.org/docs/rules/no-process-env)               | [node/no-process-env](https://github.com/mysticatea/eslint-plugin-node/blob/v11.1.0/docs/rules/no-process-env.md)               |
| [no-process-exit](https://eslint.org/docs/rules/no-process-exit)             | [node/no-process-exit](https://github.com/mysticatea/eslint-plugin-node/blob/v11.1.0/docs/rules/no-process-exit.md)             |
| [no-restricted-modules](https://eslint.org/docs/rules/no-restricted-modules) | [node/no-restricted-require](https://github.com/mysticatea/eslint-plugin-node/blob/v11.1.0/docs/rules/no-restricted-require.md) |
| [no-sync](https://eslint.org/docs/rules/no-sync)                             | [node/no-sync](https://github.com/mysticatea/eslint-plugin-node/blob/v11.1.0/docs/rules/no-sync.md)                             |

**Related issue(s):** [#12898](https://github.com/eslint/eslint/pull/12898)

## <a name="rules-strict"></a> Several rules have been updated to cover more cases

Several rules have been enhanced and now report additional errors:

* [accessor-pairs](https://eslint.org/docs/rules/accessor-pairs) rule now recognizes class members by default.
* [array-callback-return](https://eslint.org/docs/rules/array-callback-return) rule now recognizes `flatMap` method.
* [computed-property-spacing](https://eslint.org/docs/rules/computed-property-spacing) rule now recognizes class members by default.
* [func-names](https://eslint.org/docs/rules/func-names) rule now recognizes function declarations in default exports.
* [no-extra-parens](https://eslint.org/docs/rules/no-extra-parens) rule now recognizes parentheses in assignment targets.
* [no-dupe-class-members](https://eslint.org/docs/rules/no-dupe-class-members) rule now recognizes computed keys for static class members.
* [no-magic-numbers](https://eslint.org/docs/rules/no-magic-numbers) rule now recognizes bigint literals.
* [radix](https://eslint.org/docs/rules/radix) rule now recognizes invalid numbers for the second parameter of `parseInt()`.
* [use-isnan](https://eslint.org/docs/rules/use-isnan) rule now recognizes class members by default.
* [yoda](https://eslint.org/docs/rules/yoda) rule now recognizes bigint literals.

**To address:** Fix errors or disable these rules.

**Related issue(s):** [#12490](https://github.com/eslint/eslint/pull/12490), [#12608](https://github.com/eslint/eslint/pull/12608), [#12670](https://github.com/eslint/eslint/pull/12670), [#12701](https://github.com/eslint/eslint/pull/12701), [#12765](https://github.com/eslint/eslint/pull/12765), [#12837](https://github.com/eslint/eslint/pull/12837), [#12913](https://github.com/eslint/eslint/pull/12913), [#12915](https://github.com/eslint/eslint/pull/12915), [#12919](https://github.com/eslint/eslint/pull/12919)

## <a name="eslint-recommended"></a> `eslint:recommended` has been updated

Three new rules have been enabled in the `eslint:recommended` preset.

* [no-dupe-else-if](https://eslint.org/docs/rules/no-dupe-else-if)
* [no-import-assign](https://eslint.org/docs/rules/no-import-assign)
* [no-setter-return](https://eslint.org/docs/rules/no-setter-return)

**To address:** Fix errors or disable these rules.

**Related issue(s):** [#12920](https://github.com/eslint/eslint/pull/12920)

## <a name="rule-tester-strict"></a> Additional validation added to the `RuleTester` class

The `RuleTester` now validates the following:

* It fails test cases if the rule under test uses the non-standard `node.start` or `node.end` properties. Rules should use `node.range` instead.
* It fails test cases if the rule under test provides an autofix but a test case doesn't have an `output` property. Add an `output` property to test cases to test the rule's autofix functionality.
* It fails test cases if any unknown properties are found in the objects in the `errors` property.

**To address:** Modify your rule or test case if existing test cases fail.

**Related issue(s):** [RFC25](https://github.com/eslint/rfcs/blob/master/designs/2019-rule-tester-improvements/README.md), [#12096](https://github.com/eslint/eslint/pull/12096), [#12955](https://github.com/eslint/eslint/pull/12955)

## <a name="deprecate-cliengine"></a> The `CLIEngine` class has been deprecated

The [`CLIEngine` class](https://eslint.org/docs/developer-guide/nodejs-api#cliengine) has been deprecated and replaced by the new [`ESLint` class](https://eslint.org/docs/developer-guide/nodejs-api#eslint-class).

The `CLIEngine` class provides a synchronous API that is blocking the implementation of features such as parallel linting, supporting ES modules in shareable configs/parsers/plugins/formatters, and adding the ability to visually display the progress of linting runs. The new `ESLint` class provides an asynchronous API that ESLint core will now using going forward. `CLIEngine` will remain in core for the foreseeable future but may be removed in a future major version.

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
| `static getFormatter(name)`                  | (removed ※1)                       |
| `addPlugin(pluginId, definition)`            | the `plugins` constructor option   |
| `getRules()`                                 | (not implemented yet)              |
| `resolveFileGlobPatterns()`                  | (removed ※2)                       |

* ※1 The `engine.getFormatter()` method currently returns the object of loaded packages as-is, which made it difficult to add new features to formatters for backward compatibility reasons. The new `eslint.loadFormatter()` method returns an adapter object that wraps the object of loaded packages, to ease the process of adding new features. Additionally, the adapter object has access to the `ESLint` instance to calculate default data (using loaded plugin rules to make `rulesMeta`, for example). As a result, the `ESLint` class only implements an instance version of the `loadFormatter()` method.
* ※2 Since ESLint 6, ESLint uses different logic from the `resolveFileGlobPatterns()` method to iterate files, making this method obsolete.

**Related issue(s):** [RFC40](https://github.com/eslint/rfcs/blob/master/designs/2019-move-to-async-api/README.md), [#12939](https://github.com/eslint/eslint/pull/12939)
