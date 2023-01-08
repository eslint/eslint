---
title: Configuration Files
eleventyNavigation:
    key: configuration files
    parent: configure
    title: Configuration Files
    order: 2

---

You can put your ESLint project configuration in a configuration file. You can include built-in rules, how you want them enforced, plugins with custom rules, shareable configurations, which files you want rules to apply to, and more.

## Configuration File Formats

ESLint supports configuration files in several formats:

* **JavaScript** - use `.eslintrc.js` and export an object containing your configuration.
* **JavaScript (ESM)** - use `.eslintrc.cjs` when running ESLint in JavaScript packages that specify `"type":"module"` in their `package.json`. Note that ESLint does not support ESM configuration at this time.
* **YAML** - use `.eslintrc.yaml` or `.eslintrc.yml` to define the configuration structure.
* **JSON** - use `.eslintrc.json` to define the configuration structure. ESLint's JSON files also allow JavaScript-style comments.
* **package.json** - create an `eslintConfig` property in your `package.json` file and define your configuration there.

If there are multiple configuration files in the same directory, ESLint only uses one. The priority order is as follows:

1. `.eslintrc.js`
1. `.eslintrc.cjs`
1. `.eslintrc.yaml`
1. `.eslintrc.yml`
1. `.eslintrc.json`
1. `package.json`

## Using Configuration Files

There are two ways to use configuration files.

The first way to use configuration files is via `.eslintrc.*` and `package.json` files. ESLint automatically looks for them in the directory of the file to be linted, and in successive parent directories all the way up to the root directory of the filesystem (`/`), the home directory of the current user (`~/`), or when `root: true` is specified. See [Cascading and Hierarchy](#cascading-and-hierarchy) below for more details on this. Configuration files can be useful when you want different configurations for different parts of a project or when you want others to be able to use ESLint directly without needing to remember to pass in the configuration file.

The second way to use configuration files is to save the file wherever you would like and pass its location to the CLI using the `--config` option, such as:

```shell
eslint -c myconfig.json myfiletotest.js
```

If you are using one configuration file and want ESLint to ignore any `.eslintrc.*` files, make sure to use [`--no-eslintrc`](../command-line-interface#--no-eslintrc) along with the [`--config`](../../use/command-line-interface#-c---config) flag.

Here's an example JSON configuration file that uses the `typescript-eslint` parser to support TypeScript syntax:

```json
{
    "root": true,
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": { "project": ["./tsconfig.json"] },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "@typescript-eslint/strict-boolean-expressions": [
            2,
            {
                "allowString" : false,
                "allowNumber" : false
            }
        ]
    },
    "ignorePatterns": ["src/**/*.test.ts", "src/frontend/generated/*"]
}
```

### Comments in configuration files

Both the JSON and YAML configuration file formats support comments (`package.json` files should not include them). You can use JavaScript-style comments for JSON files and YAML-style comments for YAML files. ESLint safely ignores comments in configuration files. This allows your configuration files to be more human-friendly.

For JavaScript-style comments:

```js
{
    "env": {
        "browser": true
    },
    "rules": {
        // Override our default settings just for this directory
        "eqeqeq": "warn",
        "strict": "off"
    }
}
```

For YAML-style comments:

```yaml
env:
    browser: true
rules:
    # Override default settings
    eqeqeq: warn
    strict: off
```

## Adding Shared Settings

ESLint supports adding shared settings into configuration files. Plugins use `settings` to specify the information that should be shared across all of its rules. You can add a `settings` object to the ESLint configuration file and it is supplied to every executed rule. This may be useful if you are adding custom rules and want them to have access to the same information and be easily configurable.

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

When using `.eslintrc.*` and `package.json` files for configuration, you can take advantage of configuration cascading. Suppose your project has the following structure:

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

In the same way, if there is a `package.json` file in the root directory with an `eslintConfig` field, the configuration it describes is applied to all subdirectories beneath it. However, the configuration described by the `.eslintrc` file in the `tests/` directory overrides conflicting specifications.

```text
your-project
├── package.json
├── lib
│ └── source.js
└─┬ tests
  ├── .eslintrc.json
  └── test.js
```

If there is a `.eslintrc` and a `package.json` file found in the same directory, `.eslintrc` takes priority and the `package.json` file is not used.

By default, ESLint looks for configuration files in all parent folders up to the root directory. This can be useful if you want all of your projects to follow a certain convention, but can sometimes lead to unexpected results. To limit ESLint to a specific project, place `"root": true` inside the `.eslintrc.*` file or `eslintConfig` field of the `package.json` file or in the `.eslintrc.*` file at your project's root level. ESLint stops looking in parent folders once it finds a configuration with `"root": true`.

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

For example, consider `projectA` which has `"root": true` set in the `.eslintrc` file in the `lib/` directory.  In this case, while linting `main.js`, the configurations within `lib/` are used, but the `.eslintrc` file in `projectA/` is not.

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

Please note that the [home directory of the current user on your preferred operating system](https://nodejs.org/api/os.html#os_os_homedir) (`~/`) is also considered a root directory in this context and searching for configuration files stops there as well. And with the [removal of support for Personal Configuration Files](configuration-files#personal-configuration-files-deprecated) from the 8.0.0 release forward, configuration files present in that directory are ignored.

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

A [sharable configuration](../../extend/shareable-configs) is an npm package that exports a configuration object. Make sure that you have installed the package in your project root directory, so that ESLint can require it.

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

Using `"eslint:recommended"` in the `extends` property enables a subset of core rules that report common problems (these rules are identified with a checkmark (recommended) on the [rules page](../../rules/)).

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

A [plugin](../../extend/plugins) is an npm package that can add various extensions to ESLint. A plugin can perform numerous functions, including but not limited to adding new rules and exporting [shareable configurations](../../extend/plugins#configs-in-plugins). Make sure the package has been installed in a directory where ESLint can require it.

The `plugins` [property value](./plugins#configure-plugins) can omit the `eslint-plugin-` prefix of the package name.

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

You might enable all core rules as a shortcut to explore rules and options while you decide on the configuration for a project, especially if you rarely override options or disable rules. The default options for rules are not endorsements by ESLint (for example, the default option for the [`quotes`](../../rules/quotes) rule does not mean double quotes are better than single quotes).

If your configuration extends `eslint:all`, after you upgrade to a newer major or minor version of ESLint, review the reported problems before you use the `--fix` option on the [command line](../command-line-interface#--fix), so you know if a new fixable rule will make changes to the code.

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

**v4.1.0+.** Sometimes a more fine-controlled configuration is necessary, like if the configuration for files within the same directory has to be different. In this case, you can provide configurations under the `overrides` key that only apply to files that match specific glob patterns, using the same format you would pass on the command line (e.g., `app/**/*.test.js`).

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

* The patterns are applied against the file path relative to the directory of the config file. For example, if your config file has the path `/Users/john/workspace/any-project/.eslintrc.js` and the file you want to lint has the path `/Users/john/workspace/any-project/lib/util.js`, then the pattern provided in `.eslintrc.js` is executed against the relative path `lib/util.js`.
* Glob pattern overrides have higher precedence than the regular configuration in the same config file. Multiple overrides within the same config are applied in order. That is, the last override block in a config file always has the highest precedence.
* A glob specific configuration works almost the same as any other ESLint config. Override blocks can contain any configuration options that are valid in a regular config, with the exception of `root` and `ignorePatterns`.
    * A glob specific configuration can have an `extends` setting, but the `root` property in the extended configs is ignored. The `ignorePatterns` property in the extended configs is used only for the files the glob specific configuration matched.
    * Nested `overrides` settings are applied only if the glob patterns of both the parent config and the child config are matched. This is the same when the extended configs have an `overrides` setting.
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

If you specified the [`--ext`](../command-line-interface#--ext) command line option along with directories, the target files are only the files that have specified file extensions regardless of `overrides` entries.

## Personal Configuration Files (deprecated)

⚠️ **This feature has been deprecated**. This feature was removed in the 8.0.0 release. If you want to continue to use personal configuration files, please use the [`--config` CLI option](../command-line-interface#-c---config). For more information regarding this decision, please see [RFC 28](https://github.com/eslint/rfcs/pull/28) and [RFC 32](https://github.com/eslint/rfcs/pull/32).

`~/` refers to [the home directory of the current user on your preferred operating system](https://nodejs.org/api/os.html#os_os_homedir). The personal configuration file being referred to here is `~/.eslintrc.*` file, which is currently handled differently than other configuration files.

### How does ESLint find personal configuration files?

If `eslint` could not find any configuration file in the project, `eslint` loads `~/.eslintrc.*` file.

If `eslint` could find configuration files in the project, `eslint` ignores `~/.eslintrc.*` file even if it's in an ancestor directory of the project directory.

### How do personal configuration files behave?

`~/.eslintrc.*` files behave similarly to regular configuration files, with some exceptions:

`~/.eslintrc.*` files load shareable configs and custom parsers from `~/node_modules/` – similarly to `require()` – in the user's home directory. Please note that it doesn't load global-installed packages.

`~/.eslintrc.*` files load plugins from `$CWD/node_modules` by default in order to identify plugins uniquely. If you want to use plugins with `~/.eslintrc.*` files, plugins must be installed locally per project. Alternatively, you can use the [`--resolve-plugins-relative-to` CLI option](../command-line-interface#--resolve-plugins-relative-to) to change the location from which ESLint loads plugins.
