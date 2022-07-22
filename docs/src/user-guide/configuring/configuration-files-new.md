---
title: Configuration Files (New)
layout: doc
edit_link: https://github.com/eslint/eslint/edit/main/docs/src/user-guide/configuring/configuration-files-new.md
eleventyNavigation:
    key: configuration files
    parent: configuring
    title: Configuration Files (New)
    order: 1

---

::: warning
This is an experimental feature that is not enabled by default. You can use the configuration system described on this page by using the `FlatESLint` class, the `FlatRuleTester` class, or by setting `configType: "flat"` in the `Linter` class.
:::

## Configuration File

The ESLint configuration file is named `eslint.config.js` and should be placed in the root directory of your project and export an array of configuration objects. Here's an example:

```js
export default [
    {
        rules: {
            semi: "error",
            "prefer-const": "error"
        }
    }
]
```

Here, the configuration array contains just one configuration object. The configuration object enables two rules: `semi` and `prefer-const`. These rules will be applied to all of the files ESLint processes using this config file.

## Configuration Objects

Each configuration object contains all of the information ESLint needs to execute on a set of files. Each configuration object is made up of these properties:

* `files` - An array of glob patterns indicating the files that the configuration object should apply to. If not specified, the configuration object applies to all files.
* `ignores` - An array of glob patterns indicating the files that the configuration object should not apply to. If not specified, the configuration object applies to all files matched by `files`.
* `languageOptions` - An object containing settings related to how JavaScript is configured for linting.
    * `ecmaVersion` - The version of ECMAScript to support. May be any year (i.e., `2022`) or version (i.e., `5`). Set to `"latest"` for the most recent supported version. (default: `"latest"`)
    * `sourceType` - The type of JavaScript source code. Possible values are `"script"` for traditional script files, `"module"` for ECMAScript modules (ESM), and `"commonjs"` for CommonJS files. (default: `"module"` for `.js` and `.mjs` files; `"commonjs"` for `.cjs` files)
    * `globals` - An object specifying additional objects that should be added to the global scope during linting.
    * `parser` - Either an object containing a `parse()` method or a string indicating the name of a parser inside of a plugin (i.e., `"pluginName/parserName"`). (default: `"@/espree"`)
    * `parserOptions` - An object specifying additional options that are passed directly to the `parser()` method on the parser. The available options are parser-dependent.
* `linterOptions` - An object containing settings related to the linting process.
    * `noInlineConfig` - A Boolean value indicating if inline configuration is allowed.
    * `reportUnusedDisableDirectives` - A Boolean value indicating if unused disable directives should be tracked and reported.
* `processor` - Either an object containing `preprocess()` and `postprocess()` methods or a string indicating the name of a processor inside of a plugin (i.e., `"pluginName/processorName"`).
* `plugins` - An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
* `rules` - An object containing the configured rules. When `files` or `ignores` are specified, these rule configurations are only available to the matching files.

### Specifying `files` and `ignores`

::: tip
Patterns specified in `files` and `ignores` use [`minimatch`](https://www.npmjs.com/package/minimatch) syntax and are evaluated relative to the location of the `eslint.config.js` file.
:::

You can use a combination of `files` and `ignores` to determine which files should apply the configuration object and which should not. By default, ESLint matches `**/*.js`, `**/*.cjs`, and `**/*.mjs`. Because config objects that don't specify `files` or `ignores` apply to all files that have been matched by any other configuration object, by default config objects will apply to any JavaScript files passed to ESLint. For example:

```js
export default [
    {
        rules: {
            semi: "error"
        }
    }
];
```

With this configuration, the `semi` rule is enabled for all files that match the default files in ESLint. So if you pass `example.js` to ESLint, the `semi` rule will be applied. If you pass a non-JavaScript file, like `example.txt`, the `semi` rule will not be applied because there are no other configuration objects that match that filename. (ESLint will output an error message letting you know that the file was ignored due to missing configuration.)

#### Excluding files with `ignores`

You can limit which files a configuration object applies to by specifying a combination of `files` and `ignores` patterns. For example, you may want certain rules to apply only to files in your `src` directory, like this:

```js
export default [
    {   
        files: ["src/**/*.js"],
        rules: {
            semi: "error"
        }
    }
];
```

Here, only the JavaScript files in the `src` directory will have the `semi` rule applied. If you run ESLint on files in another directory, this configuration object will be skipped. By adding `ignores`, you can also remove some of the files in `src` from this configuration object:

```js
export default [
    {   
        files: ["src/**/*.js"],
        ignores: ["**/*.config.js"],
        rules: {
            semi: "error"
        }
    }
];
```

This configuration object matches all JavaScript files in the `src` directory except those that end with `.config.js`. You can also use negation patterns in `ignores` to exclude files from the ignore patterns, such as:

```js
export default [
    {   
        files: ["src/**/*.js"],
        ignores: ["**/*.config.js", "!**/eslint.config.js"],
        rules: {
            semi: "error"
        }
    }
];
```

Here, the configuration object excludes files ending with `.config.js` except for `eslint.config.js`. That file will still have `semi` applied.

If `ignores` is used without `files` and any other setting, then the configuration object applies to all files except the ones specified in `ignores`, for example:

```js
export default [
    {   
        ignores: ["**/*.config.js"],
        rules: {
            semi: "error"
        }
    }
];
```

This configuration object applies to all files except those ending with `.config.js`. Effectively, this is like having `files` set to `**/*`. In general, it's a good idea to always include `files` if you are specifying `ignores`.

#### Globally ignoring files with `ignores`

If `ignores` is used without any other keys in the configuration object, then the patterns act as additional global ignores, similar to those found in `.eslintignore`. Here's an example:

```js
export default [
    {   
        ignores: [".config/*"]
    }
];
```

This configuration specifies that all of the files in the `.config` directory should be ignored. This pattern is added after the patterns found in `.eslintignore`.

#### Cascading configuration objects

When more than one configuration object matches a given filename, the configuration objects are merged with later objects overriding previous objects when there is a conflict. For example:

```js
export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            globals: {
                MY_CUSTOM_GLOBAL: "readonly"
            }
        }   
    },
    {   
        files: ["tests/**/*.js"],
        languageOptions: {
            globals: {
                it: "readonly",
                describe: "readonly"
            }
        }   
    }
];
```

Using this configuration, all JavaScript files define a custom global object defined called `MY_CUSTOM_GLOBAL` while those JavaScript files in the `tests` directory have `it` and `describe` defined as global objects in addition to `MY_CUSTOM_GLOBAL`. For any JavaScript file in the tests directory, both configuration objects are applied, so `languageOptions.globals` are merged to create a final result.

### Specifying linter options

Options specific to the linting process can be configured using the `linterOptions` object. These effect how linting proceeds and does not affect how the source code of the file is interpreted.

#### Disabling inline configuration

Inline configuration is implemented using an `/*eslint*/` comment, such as `/*eslint semi: error*/`. You can disallow inline configuration by setting `noInlineConfig` to `true`. When enabled, all inline configuration is ignored. Here's an example:

```js
export default [
    {
        files: ["**/*.js"],
        linterOptions: {
            noInlineConfig: true
        }
    }
];
```

#### Reporting unused disable directives

Disable directives such as `/*eslint-disable*/` and `/*eslint-disable-next-line*/` are used to disable ESLint rules around certain portions of code. As code changes, it's possible for these directives to no longer be needed because the code has changed in such a way that the rule will no longer be triggered. You can enable reporting of these unused disable directives by setting the `reportUnusedDisableDirectives` option to `true`, as in this example:

```js
export default [
    {
        files: ["**/*.js"],
        linterOptions: {
            reportUnusedDisableDirectives: true
        }
    }
];
```

By default, unused disable directives are reported as warnings. You can change this setting using the `--report-unused-disable-directives` command line option.

### Using plugins in your configuration

Plugins are used to share rules, processors, configurations, parsers, and more across ESLint projects. Plugins are specified in a configuration object using the `plugins` key, which is an object where the name of the plugin is the property name and the value is the plugin object itself. Here's an example:

```js
import jsdoc from "eslint-plugin-jsdoc";

export default [
    {
        files: ["**/*.js"],
        plugins: {
            jsdoc: jsdoc
        }
        rules: {
            "jsdoc/require-description": "error",
            "jsdoc/check-values": "error"
        }  
    }
];
```

In this configuration, the JSDoc plugin is defined to have the name `jsdoc`. The prefix `jsdoc/` in each rule name indicates that the rule is coming from the plugin with that name rather than from ESLint itself.

Because the name of the plugin and the plugin object are both `jsdoc`, you can also shorten the configuration to this:

```js
import jsdoc from "eslint-plugin-jsdoc";

export default [
    {
        files: ["**/*.js"],
        plugins: {
            jsdoc: jsdoc
        }
        rules: {
            "jsdoc/require-description": "error",
            "jsdoc/check-values": "error"
        }  
    }
];
```

While this is the most common convention, you don't need to use the same name that the plugin prescribes. You can specify any prefix that you'd like, such as:

```js
import jsdoc from "eslint-plugin-jsdoc";

export default [
    {
        files: ["**/*.js"],
        plugins: {
            jsd: jsdoc
        }
        rules: {
            "jsd/require-description": "error",
            "jsd/check-values": "error"
        }  
    }
];
```

This configuration object uses `jsd` as the prefix plugin instead of `jsdoc`.

## Configuration File Resolution

When ESLint is run on the command line, it first checks the current working directory for `eslint.config.js`, and if not found, will look to the next parent directory for the file. This search continues until either the file is found or the root directory is reached.

You can prevent this search for `eslint.config.js` by using the `-c` or `--config--file` option on the command line to specify an alternate configuration file, such as:

```shell
npx eslint -c some-other-file.js **/*.js
```

In this case, ESLint will not search for `eslint.config.js` and will instead use `some-other-file.js`.

Each configuration file exports one or more configuration object. A configuration object

## Adding Shared Settings

ESLint supports adding shared settings into configuration files. Plugins use `settings` to specify information that should be shared across all of its rules. You can add `settings` object to ESLint configuration file and it will be supplied to every rule being executed. This may be useful if you are adding custom rules and want them to have access to the same information and be easily configurable.

In JSON:

```json
{
    "settings": {
        "sharedData": "Hello"
    }
}
```

And in YAML:

```yaml
---
  settings:
    sharedData: "Hello"
```

## Cascading and Hierarchy

When using `.eslintrc.*` and `package.json` files for configuration, you can take advantage of configuration cascading. Suppose you have the following structure:

```text
your-project
├── .eslintrc.json
├── lib
│ └── source.js
└─┬ tests
  ├── .eslintrc.json
  └── test.js
```

The configuration cascade works based on the location of the file being linted. If there is a `.eslintrc` file in the same directory as the file being linted, then that configuration takes precedence. ESLint then searches up the directory structure, merging any `.eslintrc` files it finds along the way until reaching either a `.eslintrc` file with `root: true` or the root directory.

In the same way, if there is a `package.json` file in the root directory with an `eslintConfig` field, the configuration it describes will apply to all subdirectories beneath it, but the configuration described by the `.eslintrc` file in the `tests/` directory will override it where there are conflicting specifications.

```text
your-project
├── package.json
├── lib
│ └── source.js
└─┬ tests
  ├── .eslintrc.json
  └── test.js
```

If there is a `.eslintrc` and a `package.json` file found in the same directory, `.eslintrc` will take priority and `package.json` file will not be used.

By default, ESLint will look for configuration files in all parent folders up to the root directory. This can be useful if you want all of your projects to follow a certain convention, but can sometimes lead to unexpected results. To limit ESLint to a specific project, place `"root": true` inside the `.eslintrc.*` file or `eslintConfig` field of the `package.json` file or in the `.eslintrc.*` file at your project's root level. ESLint will stop looking in parent folders once it finds a configuration with `"root": true`.

```js
{
    "root": true
}
```

And in YAML:

```yaml
---
  root: true
```

For example, consider `projectA` which has `"root": true` set in the `.eslintrc` file in the `lib/` directory.  In this case, while linting `main.js`, the configurations within `lib/` will be used, but the `.eslintrc` file in `projectA/` will not.

```text
home
└── user
    └── projectA
        ├── .eslintrc.json  <- Not used
        └── lib
            ├── .eslintrc.json  <- { "root": true }
            └── main.js
```

The complete configuration hierarchy, from highest to lowest precedence, is as follows:

1. Inline configuration
    1. `/*eslint-disable*/` and `/*eslint-enable*/`
    1. `/*global*/`
    1. `/*eslint*/`
    1. `/*eslint-env*/`
1. Command line options (or CLIEngine equivalents):
    1. `--global`
    1. `--rule`
    1. `--env`
    1. `-c`, `--config`
1. Project-level configuration:
    1. `.eslintrc.*` or `package.json` file in the same directory as the linted file
    1. Continue searching for `.eslintrc.*` and `package.json` files in ancestor directories up to and including the root directory or until a config with `"root": true` is found.

Please note that the [home directory of the current user on your preferred operating system](https://nodejs.org/api/os.html#os_os_homedir) (`~/`) is also considered a root directory in this context and searching for configuration files will stop there as well. And with the [removal of support for Personal Configuration Files](https://eslint.org/docs/user-guide/configuring/configuration-files#personal-configuration-files-deprecated) from the 8.0.0 release forward, configuration files present in that directory will be ignored.

## Extending Configuration Files

A configuration file, once extended, can inherit all the traits of another configuration file (including rules, plugins, and language options) and modify all the options. As a result, there are three configurations, as defined below:

* Base config: the configuration that is extended.
* Derived config: the configuration that extends the base configuration.
* Resulting actual config: the result of merging the derived configuration into the base configuration.

The `extends` property value is either:

* a string that specifies a configuration (either a path to a config file, the name of a shareable config, `eslint:recommended`, or `eslint:all`)
* an array of strings where each additional configuration extends the preceding configurations

ESLint extends configurations recursively, so a base configuration can also have an `extends` property. Relative paths and shareable config names in an `extends` property are resolved from the location of the config file where they appear.

The `eslint-config-` prefix can be omitted from the configuration name. For example, `airbnb` resolves as `eslint-config-airbnb`.

The `rules` property can do any of the following to extend (or override) the set of rules:

* enable additional rules
* change an inherited rule's severity without changing its options:
    * Base config: `"eqeqeq": ["error", "allow-null"]`
    * Derived config: `"eqeqeq": "warn"`
    * Resulting actual config: `"eqeqeq": ["warn", "allow-null"]`
* override options for rules from base configurations:
    * Base config: `"quotes": ["error", "single", "avoid-escape"]`
    * Derived config: `"quotes": ["error", "single"]`
    * Resulting actual config: `"quotes": ["error", "single"]`
* override options for rules given as object from base configurations:
    * Base config: `"max-lines": ["error", { "max": 200, "skipBlankLines": true, "skipComments": true }]`
    * Derived config: `"max-lines": ["error", { "max": 100 }]`
    * Resulting actual config: `"max-lines": ["error", { "max": 100 }]` where `skipBlankLines` and `skipComments` default to `false`

### Using a shareable configuration package

A [sharable configuration](https://eslint.org/docs/developer-guide/shareable-configs) is an npm package that exports a configuration object. Make sure that you have installed the package in your project root directory, so that ESLint can require it.

The `extends` property value can omit the `eslint-config-` prefix of the package name.

The `npm init @eslint/config` command can create a configuration so you can extend a popular style guide (for example, `eslint-config-standard`).

Example of a configuration file in YAML format:

```yaml
extends: standard
rules:
  comma-dangle:
    - error
    - always
  no-empty: warn
```

### Using `eslint:recommended`

Using `"eslint:recommended"` in the `extends` property enables a subset of core rules that report common problems (these rules are identified with a checkmark (recommended) on the [rules page](https://eslint.org/docs/rules/)).

Here's an example of extending `eslint:recommended` and overriding some of the set configuration options:

Example of a configuration file in JavaScript format:

```js
module.exports = {
    "extends": "eslint:recommended",
    "rules": {
        // enable additional rules
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],

        // override configuration set by extending "eslint:recommended"
        "no-empty": "warn",
        "no-cond-assign": ["error", "always"],

        // disable rules from base configurations
         "for-direction": "off",
    }
}
```

### Using a configuration from a plugin

A [plugin](https://eslint.org/docs/developer-guide/working-with-plugins) is an npm package that can add various extensions to ESLint. A plugin can perform numerous functions, including but not limited to adding new rules and exporting [shareable configurations](https://eslint.org/docs/developer-guide/working-with-plugins#configs-in-plugins). Make sure the package has been installed in a directory where ESLint can require it.

The `plugins` [property value](./plugins#configuring-plugins) can omit the `eslint-plugin-` prefix of the package name.

The `extends` property value can consist of:

* `plugin:`
* the package name (from which you can omit the prefix, for example, `react` is short for `eslint-plugin-react`)
* `/`
* the configuration name (for example, `recommended`)

Example of a configuration file in JSON format:

```json
{
    "plugins": [
        "react"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "rules": {
       "react/no-set-state": "off"
    }
}
```

### Using a configuration file

The `extends` property value can be an absolute or relative path to a base [configuration file](#using-configuration-files). ESLint resolves a relative path to a base configuration file relative to the configuration file that uses it.

Example of a configuration file in JSON format:

```json
{
    "extends": [
        "./node_modules/coding-standard/eslintDefaults.js",
        "./node_modules/coding-standard/.eslintrc-es6",
        "./node_modules/coding-standard/.eslintrc-jsx"
    ],
    "rules": {
        "eqeqeq": "warn"
    }
}
```

### Using `"eslint:all"`

The `extends` property value can be `"eslint:all"` to enable all core rules in the currently installed version of ESLint. The set of core rules can change at any minor or major version of ESLint.

**Important:** This configuration is **not recommended for production use** because it changes with every minor and major version of ESLint. Use it at your own risk.

You might enable all core rules as a shortcut to explore rules and options while you decide on the configuration for a project, especially if you rarely override options or disable rules. The default options for rules are not endorsements by ESLint (for example, the default option for the [`quotes`](https://eslint.org/docs/rules/quotes) rule does not mean double quotes are better than single quotes).

If your configuration extends `eslint:all`, after you upgrade to a newer major or minor version of ESLint, review the reported problems before you use the `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#--fix), so you know if a new fixable rule will make changes to the code.

Example of a configuration file in JavaScript format:

```js
module.exports = {
    "extends": "eslint:all",
    "rules": {
        // override default options
        "comma-dangle": ["error", "always"],
        "indent": ["error", 2],
        "no-cond-assign": ["error", "always"],

        // disable now, but enable in the future
        "one-var": "off", // ["error", "never"]

        // disable
        "init-declarations": "off",
        "no-console": "off",
        "no-inline-comments": "off",
    }
}
```

## Configuration Based on Glob Patterns

<b>v4.1.0+.</b> Sometimes a more fine-controlled configuration is necessary, for example, if the configuration for files within the same directory has to be different. Therefore you can provide configurations under the `overrides` key that will only apply to files that match specific glob patterns, using the same format you would pass on the command line (e.g., `app/**/*.test.js`).

Glob patterns in overrides use [minimatch syntax](https://github.com/isaacs/minimatch).

### How do overrides work?

It is possible to override settings based on file glob patterns in your configuration by using the `overrides` key. An example of using the `overrides` key is as follows:

In your `.eslintrc.json`:

```json
{
  "rules": {
    "quotes": ["error", "double"]
  },

  "overrides": [
    {
      "files": ["bin/*.js", "lib/*.js"],
      "excludedFiles": "*.test.js",
      "rules": {
        "quotes": ["error", "single"]
      }
    }
  ]
}
```

Here is how overrides work in a configuration file:

* The patterns are applied against the file path relative to the directory of the config file. For example, if your config file has the path `/Users/john/workspace/any-project/.eslintrc.js` and the file you want to lint has the path `/Users/john/workspace/any-project/lib/util.js`, then the pattern provided in `.eslintrc.js` will be executed against the relative path `lib/util.js`.
* Glob pattern overrides have higher precedence than the regular configuration in the same config file. Multiple overrides within the same config are applied in order. That is, the last override block in a config file always has the highest precedence.
* A glob specific configuration works almost the same as any other ESLint config. Override blocks can contain any configuration options that are valid in a regular config, with the exception of `root` and `ignorePatterns`.
    * A glob specific configuration can have an `extends` setting, but the `root` property in the extended configs is ignored. The `ignorePatterns` property in the extended configs is used only for the files the glob specific configuration matched.
    * Nested `overrides` setting will be applied only if the glob patterns of both of the parent config and the child config matched. This is the same when the extended configs have an `overrides` setting.
* Multiple glob patterns can be provided within a single override block. A file must match at least one of the supplied patterns for the configuration to apply.
* Override blocks can also specify patterns to exclude from matches. If a file matches any of the excluded patterns, the configuration won't apply.

### Relative glob patterns

```txt
project-root
├── app
│   ├── lib
│   │   ├── foo.js
│   │   ├── fooSpec.js
│   ├── components
│   │   ├── bar.js
│   │   ├── barSpec.js
│   ├── .eslintrc.json
├── server
│   ├── server.js
│   ├── serverSpec.js
├── .eslintrc.json
```

The config in `app/.eslintrc.json` defines the glob pattern `**/*Spec.js`. This pattern is relative to the base directory of `app/.eslintrc.json`. So, this pattern would match `app/lib/fooSpec.js` and `app/components/barSpec.js` but **NOT** `server/serverSpec.js`. If you defined the same pattern in the `.eslintrc.json` file within in the `project-root` folder, it would match all three of the `*Spec` files.

If a config is provided via the `--config` CLI option, the glob patterns in the config are relative to the current working directory rather than the base directory of the given config. For example, if `--config configs/.eslintrc.json` is present, the glob patterns in the config are relative to `.` rather than `./configs`.

### Specifying target files to lint

If you specified directories with CLI (e.g., `eslint lib`), ESLint searches target files in the directory to lint. The target files are `*.js` or the files that match any of `overrides` entries (but exclude entries that are any of `files` end with `*`).

If you specified the [`--ext`](https://eslint.org/docs/user-guide/command-line-interface#ext) command line option along with directories, the target files are only the files that have specified file extensions regardless of `overrides` entries.

## Personal Configuration Files (deprecated)

⚠️ **This feature has been deprecated**. This feature will be removed in the 8.0.0 release. If you want to continue to use personal configuration files, please use the [`--config` CLI option](https://eslint.org/docs/user-guide/command-line-interface#-c---config). For more information regarding this decision, please see [RFC 28](https://github.com/eslint/rfcs/pull/28) and [RFC 32](https://github.com/eslint/rfcs/pull/32).

`~/` refers to [the home directory of the current user on your preferred operating system](https://nodejs.org/api/os.html#os_os_homedir). The personal configuration file being referred to here is `~/.eslintrc.*` file, which is currently handled differently than other configuration files.

### Using a plugin

If you want to use an environment from a plugin, be sure to specify the plugin name in the `plugins` array and then use the unprefixed plugin name, followed by a slash, followed by the environment name. For example:

```json
{
    "plugins": ["example"],
    "env": {
        "example/custom": true
    }
}
```

Or in a `package.json` file

```json
{
    "name": "mypackage",
    "version": "0.0.1",
    "eslintConfig": {
        "plugins": ["example"],
        "env": {
            "example/custom": true
        }
    }
}
```

## Specifying Globals

Some of ESLint's core rules rely on knowledge of the global variables available to your code at runtime. Since these can vary greatly between different environments as well as be modified at runtime, ESLint makes no assumptions about what global variables exist in your execution environment. If you would like to use rules that require knowledge of what global variables are available, you can define global variables in your configuration file or by using configuration comments in your source code.

### Using configuration comments

To specify globals using a comment inside of your JavaScript file, use the following format:

```js
/* global var1, var2 */
```

This defines two global variables, `var1` and `var2`. If you want to optionally specify that these global variables can be written to (rather than only being read), then you can set each with a `"writable"` flag:

```js
/* global var1:writable, var2:writable */
```

### Using configuration files

To configure global variables inside of a configuration file, set the `globals` configuration property to an object containing keys named for each of the global variables you want to use. For each global variable key, set the corresponding value equal to `"writable"` to allow the variable to be overwritten or `"readonly"` to disallow overwriting. For example:

```json
{
    "globals": {
        "var1": "writable",
        "var2": "readonly"
    }
}
```

And in YAML:

```yaml
---
  globals:
    var1: writable
    var2: readonly
```

These examples allow `var1` to be overwritten in your code, but disallow it for `var2`.

Globals can be disabled with the string `"off"`. For example, in an environment where most ES2015 globals are available but `Promise` is unavailable, you might use this config:

```json
{
    "env": {
        "es6": true
    },
    "globals": {
        "Promise": "off"
    }
}
```

For historical reasons, the boolean value `false` and the string value `"readable"` are equivalent to `"readonly"`. Similarly, the boolean value `true` and the string value `"writeable"` are equivalent to `"writable"`. However, the use of older values is deprecated.

## Specifying Parser Options

ESLint allows you to specify the JavaScript language options you want to support. By default, ESLint expects ECMAScript 5 syntax. You can override that setting to enable support for other ECMAScript versions as well as JSX by using parser options.

Please note that supporting JSX syntax is not the same as supporting React. React applies specific semantics to JSX syntax that ESLint doesn't recognize. We recommend using [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react) if you are using React and want React semantics.
By the same token, supporting ES6 syntax is not the same as supporting new ES6 globals (e.g., new types such as
`Set`).
For ES6 syntax, use `{ "parserOptions": { "ecmaVersion": 6 } }`; for new ES6 global variables, use `{ "env":
{ "es6": true } }`. `{ "env": { "es6": true } }` enables ES6 syntax automatically, but `{ "parserOptions": { "ecmaVersion": 6 } }` does not enable ES6 globals automatically.

Parser options are set in your `.eslintrc.*` file by using the `parserOptions` property. The available options are:

* `ecmaVersion` - set to 3, 5 (default), 6, 7, 8, 9, 10, 11, 12, or 13 to specify the version of ECMAScript syntax you want to use. You can also set to 2015 (same as 6), 2016 (same as 7), 2017 (same as 8), 2018 (same as 9), 2019 (same as 10), 2020 (same as 11), 2021 (same as 12), or 2022 (same as 13) to use the year-based naming. You can also set "latest" to use the most recently supported version.
* `sourceType` - set to `"script"` (default) or `"module"` if your code is in ECMAScript modules.
* `allowReserved` - allow the use of reserved words as identifiers (if `ecmaVersion` is 3).
* `ecmaFeatures` - an object indicating which additional language features you'd like to use:
    * `globalReturn` - allow `return` statements in the global scope
    * `impliedStrict` - enable global [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) (if `ecmaVersion` is 5 or greater)
    * `jsx` - enable [JSX](https://facebook.github.io/jsx/)

Here's an example `.eslintrc.json` file:

```json
{
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "rules": {
        "semi": "error"
    }
}
```

Setting parser options helps ESLint determine what is a parsing error. All language options are `false` by default.
