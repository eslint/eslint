---
title: Configuration Files
eleventyNavigation:
    key: configuration files
    parent: configure
    title: Configuration Files
    order: 1

---

::: tip
This page explains how to use flat config files. For the deprecated eslintrc format, [see the deprecated documentation](configuration-files-deprecated).
:::

You can put your ESLint project configuration in a configuration file. You can include built-in rules, how you want them enforced, plugins with custom rules, shareable configurations, which files you want rules to apply to, and more.

## Configuration File

The ESLint configuration file may be named any of the following:

* `eslint.config.js`
* `eslint.config.mjs`
* `eslint.config.cjs`
* `eslint.config.ts` (requires [additional setup](#typescript-configuration-files))
* `eslint.config.mts` (requires [additional setup](#typescript-configuration-files))
* `eslint.config.cts` (requires [additional setup](#typescript-configuration-files))

It should be placed in the root directory of your project and export an array of [configuration objects](#configuration-objects). Here's an example:

```js
// eslint.config.js
export default [
    {
        rules: {
            semi: "error",
            "prefer-const": "error"
        }
    }
];
```

In this example, the configuration array contains just one configuration object. The configuration object enables two rules: `semi` and `prefer-const`. These rules are applied to all of the files ESLint processes using this config file.

If your project does not specify `"type":"module"` in its `package.json` file, then `eslint.config.js` must be in CommonJS format, such as:

```js
// eslint.config.js
module.exports = [
    {
        rules: {
            semi: "error",
            "prefer-const": "error"
        }
    }
];
```

## Configuration Objects

Each configuration object contains all of the information ESLint needs to execute on a set of files. Each configuration object is made up of these properties:

* `name` - A name for the configuration object. This is used in error messages and config inspector to help identify which configuration object is being used. ([Naming Convention](#configuration-naming-conventions))
* `files` - An array of glob patterns indicating the files that the configuration object should apply to. If not specified, the configuration object applies to all files matched by any other configuration object.
* `ignores` - An array of glob patterns indicating the files that the configuration object should not apply to. If not specified, the configuration object applies to all files matched by `files`. If `ignores` is used without any other keys in the configuration object, then the patterns act as [global ignores](#globally-ignoring-files-with-ignores).
* `languageOptions` - An object containing settings related to how JavaScript is configured for linting.
    * `ecmaVersion` - The version of ECMAScript to support. May be any year (i.e., `2022`) or version (i.e., `5`). Set to `"latest"` for the most recent supported version. (default: `"latest"`)
    * `sourceType` - The type of JavaScript source code. Possible values are `"script"` for traditional script files, `"module"` for ECMAScript modules (ESM), and `"commonjs"` for CommonJS files. (default: `"module"` for `.js` and `.mjs` files; `"commonjs"` for `.cjs` files)
    * `globals` - An object specifying additional objects that should be added to the global scope during linting.
    * `parser` - An object containing a `parse()` method or a `parseForESLint()` method. (default: [`espree`](https://github.com/eslint/js/tree/main/packages/espree))
    * `parserOptions` - An object specifying additional options that are passed directly to the `parse()` or `parseForESLint()` method on the parser. The available options are parser-dependent.
* `linterOptions` - An object containing settings related to the linting process.
    * `noInlineConfig` - A Boolean value indicating if inline configuration is allowed.
    * `reportUnusedDisableDirectives` - A severity string indicating if and how unused disable and enable directives should be tracked and reported. For legacy compatibility, `true` is equivalent to `"warn"` and `false` is equivalent to `"off"`. (default: `"warn"`).
* `processor` - Either an object containing `preprocess()` and `postprocess()` methods or a string indicating the name of a processor inside of a plugin (i.e., `"pluginName/processorName"`).
* `plugins` - An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
* `rules` - An object containing the configured rules. When `files` or `ignores` are specified, these rule configurations are only available to the matching files.
* `settings` - An object containing name-value pairs of information that should be available to all rules.

### Specifying `files` and `ignores`

::: tip
Patterns specified in `files` and `ignores` use [`minimatch`](https://www.npmjs.com/package/minimatch) syntax and are evaluated relative to the location of the `eslint.config.js` file. If using an alternate config file via the `--config` command line option, then all patterns are evaluated relative to the current working directory.
:::

You can use a combination of `files` and `ignores` to determine which files the configuration object should apply to and which not. By default, ESLint lints files that match the patterns `**/*.js`, `**/*.cjs`, and `**/*.mjs`. Those files are always matched unless you explicitly exclude them using [global ignores](#globally-ignoring-files-with-ignores).
Because config objects that don't specify `files` or `ignores` apply to all files that have been matched by any other configuration object, they will apply to all JavaScript files. For example:

```js
// eslint.config.js
export default [
    {
        rules: {
            semi: "error"
        }
    }
];
```

With this configuration, the `semi` rule is enabled for all files that match the default files in ESLint. So if you pass `example.js` to ESLint, the `semi` rule is applied. If you pass a non-JavaScript file, like `example.txt`, the `semi` rule is not applied because there are no other configuration objects that match that filename. (ESLint outputs an error message letting you know that the file was ignored due to missing configuration.)

#### Excluding files with `ignores`

You can limit which files a configuration object applies to by specifying a combination of `files` and `ignores` patterns. For example, you may want certain rules to apply only to files in your `src` directory:

```js
// eslint.config.js
export default [
    {
        files: ["src/**/*.js"],
        rules: {
            semi: "error"
        }
    }
];
```

Here, only the JavaScript files in the `src` directory have the `semi` rule applied. If you run ESLint on files in another directory, this configuration object is skipped. By adding `ignores`, you can also remove some of the files in `src` from this configuration object:

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

Here, the configuration object excludes files ending with `.config.js` except for `eslint.config.js`. That file still has `semi` applied.

Non-global `ignores` patterns can only match file names. A pattern like `"dir-to-exclude/"` will not ignore anything. To ignore everything in a particular directory, a pattern like `"dir-to-exclude/**"` should be used instead.

If `ignores` is used without `files` and there are other keys (such as `rules`), then the configuration object applies to all linted files except the ones excluded by `ignores`, for example:

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

This configuration object applies to all JavaScript files except those ending with `.config.js`. Effectively, this is like having `files` set to `**/*`. In general, it's a good idea to always include `files` if you are specifying `ignores`.

Note that when `files` is not specified, negated `ignores` patterns do not cause any matching files to be linted automatically.
ESLint only lints files that are matched either by default or by a `files` pattern that is not `*` and does not end with `/*` or `/**`.

::: tip
Use the [config inspector](https://github.com/eslint/config-inspector) (`--inspect-config` in the CLI) to test which config objects apply to a specific file.
:::

#### Specifying files with arbitrary extensions

To lint files with extensions other than the default `.js`, `.cjs` and `.mjs`, include them in `files` with a pattern in the format of `"**/*.extension"`. Any pattern will work except if it is `*` or if it ends with `/*` or `/**`.
For example, to lint TypeScript files with `.ts`, `.cts` and `.mts` extensions, you would specify a configuration object like this:

```js
// eslint.config.js
export default [
    {
        files: [
            "**/*.ts",
            "**/*.cts",
            "**.*.mts"
        ]
    },
    // ...other config
];
```

#### Specifying files without extension

Files without an extension can be matched with the pattern `!(*.*)`. For example:

```js
// eslint.config.js
export default [
    {
        files: ["**/!(*.*)"]
    },
    // ...other config
];
```

The above config lints files without extension besides the default `.js`, `.cjs` and `.mjs` extensions in all directories.
::: tip
Filenames starting with a dot, such as `.gitignore`, are considered to have only an extension without a base name. In the case of `.gitignore`, the extension is `gitignore`, so the file matches the pattern `"**/.gitignore"` but not `"**/*.gitignore"`.
:::

#### Globally ignoring files with `ignores`

If `ignores` is used without any other keys in the configuration object, then the patterns act as global ignores. Here's an example:

```js
// eslint.config.js
export default [
    {
        ignores: [".config/*"]
    }
];
```

This configuration specifies that all of the files in the `.config` directory should be ignored. This pattern is added after the default patterns, which are `["**/node_modules/", ".git/"]`.

For more information on configuring rules, see [Ignore Files](ignore).

::: important
Glob patterns always match files and directories that begin with a dot, such as `.foo.js` or `.fixtures`, unless those files are explicitly ignored. The only dot directory ignored by default is `.git`.
:::

#### Cascading Configuration Objects

When more than one configuration object matches a given filename, the configuration objects are merged with later objects overriding previous objects when there is a conflict. For example:

```js
// eslint.config.js
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

### Configuring Linter Options

Options specific to the linting process can be configured using the `linterOptions` object. These effect how linting proceeds and does not affect how the source code of the file is interpreted.

#### Disabling Inline Configuration

Inline configuration is implemented using an `/*eslint*/` comment, such as `/*eslint semi: error*/`. You can disallow inline configuration by setting `noInlineConfig` to `true`. When enabled, all inline configuration is ignored. Here's an example:

```js
// eslint.config.js
export default [
    {
        files: ["**/*.js"],
        linterOptions: {
            noInlineConfig: true
        }
    }
];
```

#### Reporting Unused Disable Directives

Disable and enable directives such as `/*eslint-disable*/`, `/*eslint-enable*/` and `/*eslint-disable-next-line*/` are used to disable ESLint rules around certain portions of code. As code changes, it's possible for these directives to no longer be needed because the code has changed in such a way that the rule is no longer triggered. You can enable reporting of these unused disable directives by setting the `reportUnusedDisableDirectives` option to a severity string, as in this example:

```js
// eslint.config.js
export default [
    {
        files: ["**/*.js"],
        linterOptions: {
            reportUnusedDisableDirectives: "error"
        }
    }
];
```

This setting defaults to `"warn"`.

You can override this setting using the [`--report-unused-disable-directives`](../command-line-interface#--report-unused-disable-directives) or the [`--report-unused-disable-directives-severity`](../command-line-interface#--report-unused-disable-directives-severity) command line options.

For legacy compatibility, `true` is equivalent to `"warn"` and `false` is equivalent to `"off"`.

### Configuring Rules

You can configure any number of rules in a configuration object by add a `rules` property containing an object with your rule configurations. The names in this object are the names of the rules and the values are the configurations for each of those rules. Here's an example:

```js
// eslint.config.js
export default [
    {
        rules: {
            semi: "error"
        }
    }
];
```

This configuration object specifies that the [`semi`](../../rules/semi) rule should be enabled with a severity of `"error"`. You can also provide options to a rule by specifying an array where the first item is the severity and each item after that is an option for the rule. For example, you can switch the `semi` rule to disallow semicolons by passing `"never"` as an option:

```js
// eslint.config.js
export default [
    {
        rules: {
            semi: ["error", "never"]
        }
    }
];
```

Each rule specifies its own options and can be any valid JSON data type. Please check the documentation for the rule you want to configure for more information about its available options.

For more information on configuring rules, see [Configure Rules](rules).

### Configuring Shared Settings

ESLint supports adding shared settings into configuration files. When you add a `settings` object to a configuration object, it is supplied to every rule. By convention, plugins namespace the settings they are interested in to avoid collisions with others. Plugins can use `settings` to specify the information that should be shared across all of their rules. This may be useful if you are adding custom rules and want them to have access to the same information. Here's an example:

```js
// eslint.config.js
export default [
    {
        settings: {
            sharedData: "Hello"
        },
        plugins: {
            customPlugin: {
                rules: {
                    "my-rule": {
                        meta: {
                            // custom rule's meta information
                        },
                        create(context) {
                            const sharedData = context.settings.sharedData;
                            return {
                                // code
                            };
                        }
                    }
                }
            }
        },
        rules: {
            "customPlugin/my-rule": "error"
        }
    }
];
```

### Using Predefined Configurations

ESLint has two predefined configurations for JavaScript:

* `js.configs.recommended` - enables the rules that ESLint recommends everyone use to avoid potential errors.
* `js.configs.all` - enables all of the rules shipped with ESLint. This configuration is **not recommended** for production use because it changes with every minor and major version of ESLint. Use at your own risk.

To include these predefined configurations, install the `@eslint/js` package and then make any modifications to other properties in subsequent configuration objects:

```js
// eslint.config.js
import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        rules: {
            "no-unused-vars": "warn"
        }
    }
];
```

Here, the `js.configs.recommended` predefined configuration is applied first and then another configuration object adds the desired configuration for `no-unused-vars`.

For more information on how to combine predefined configs with your preferences, please see [Combine Configs](combine-configs).

### Configuration Naming Conventions

The `name` property is optional, but it is recommended to provide a name for each configuration object, especially when you are creating shared configurations. The name is used in error messages and the config inspector to help identify which configuration object is being used.

The name should be descriptive of the configuration object's purpose and scoped with the configuration name or plugin name using `/` as a separator. ESLint does not enforce the names to be unique at runtime, but it is recommended that unique names be set to avoid confusion.

For example, if you are creating a configuration object for a plugin named `eslint-plugin-example`, you might add `name` to the configuration objects with the `example/` prefix:

```js
export default {
    configs: {
        recommended: {
            name: "example/recommended",
            rules: {
                "no-unused-vars": "warn"
            }
        },
        strict: {
            name: "example/strict",
            rules: {
                "no-unused-vars": "error"
            }
        }
    }
};
```

When exposing arrays of configuration objects, the `name` may have extra scoping levels to help identify the configuration object. For example:

```js
export default {
    configs: {
        strict: [
            {
                name: "example/strict/language-setup",
                languageOptions: {
                    ecmaVersion: 2024
                }
            },
            {
                name: "example/strict/sub-config",
                file: ["src/**/*.js"],
                rules: {
                    "no-unused-vars": "error"
                }
            }
        ]
    }
}
```

## Using a Shareable Configuration Package

A sharable configuration is an npm package that exports a configuration object or array. This package should be installed as a dependency in your project and then referenced from inside of your `eslint.config.js` file. For example, to use a shareable configuration named `eslint-config-example`, your configuration file would look like this:

```js
// eslint.config.js
import exampleConfig from "eslint-config-example";

export default [
    exampleConfig,

    // your modifications
    {
        rules: {
            "no-unused-vars": "warn"
        }
    }
];
```

In this example, `exampleConfig` is an object, so you insert it directly into the configuration array.

Some shareable configurations will export an array instead, in which case you'll need to use the spread operator to insert those items into the configuration array. For example:

```js
// eslint.config.js
import exampleConfigs from "eslint-config-example";

export default [
    ...exampleConfigs,

    // your modifications
    {
        rules: {
            "no-unused-vars": "warn"
        }
    }
];
```

Please refer to the documentation for the shareable configuration package you're using to determine whether it is exporting an object or an array.

For more information on how to combine shareable configs with your preferences, please see [Combine Configs](combine-configs).

## Configuration File Resolution

When ESLint is run on the command line, it first checks the current working directory for `eslint.config.js`. If that file is found, then the search stops, otherwise it checks for `eslint.config.mjs`. If that file is found, then the search stops, otherwise it checks for `eslint.config.cjs`. If none of the files are found, it checks the parent directory for each file. This search continues until either a config file is found or the root directory is reached.

You can prevent this search for `eslint.config.js` by using the `-c` or `--config` option on the command line to specify an alternate configuration file, such as:

```shell
npx eslint --config some-other-file.js **/*.js
```

In this case, ESLint does not search for `eslint.config.js` and instead uses `some-other-file.js`.

### Experimental Configuration File Resolution

::: warning
This feature is experimental and its details may change before being finalized. This behavior will be the new lookup behavior starting in v10.0.0, but you can try it today using a feature flag.
:::

You can use the `unstable_config_lookup_from_file` flag to change the way ESLint searches for configuration files. Instead of searching from the current working directory, ESLint will search for a configuration file by first starting in the directory of the file being linted and then searching up its ancestor directories until it finds a `eslint.config.js` file (or any other extension of configuration file). This behavior is better for monorepos, where each subdirectory may have its own configuration file.

To use this feature on the command line, use the `--flag` flag:

```shell
npx eslint --flag unstable_config_lookup_from_file .
```

For more information about using feature flags, see [Feature Flags](../../flags/).

## TypeScript Configuration Files

For Deno and Bun, TypeScript configuration files are natively supported; for Node.js, you must install the optional dev dependency [`jiti`](https://github.com/unjs/jiti) in version 2.0.0 or later in your project (this dependency is not automatically installed by ESLint):

```bash
npm install -D jiti
# or
yarn add --dev jiti
# or
pnpm add -D jiti
```

You can then create a configuration file with a `.ts`, `.mts`, or `.cts` extension, and export an array of [configuration objects](#configuration-objects). Here's an example in ESM format:

```ts
import js from "@eslint/js";
import type { Linter } from "eslint";

export default [
  js.configs.recommended,
  {
    rules: {
      "no-console": [0],
    },
  },
] satisfies Linter.Config[];
```

Here's an example in CommonJS format:

```ts
import type { Linter } from "eslint";
const eslint = require("@eslint/js");

const config: Linter.Config[] = [
  eslint.configs.recommended,
  {
    rules: {
      "no-console": [0],
    },
  },
];

module.exports = config;
```

::: important
ESLint does not perform type checking on your configuration file and does not apply any settings from `tsconfig.json`.
:::

### Configuration File Precedence

If you have multiple ESLint configuration files, ESLint prioritizes JavaScript files over TypeScript files. The order of precedence is as follows:

1. `eslint.config.js`
2. `eslint.config.mjs`
3. `eslint.config.cjs`
4. `eslint.config.ts`
5. `eslint.config.mts`
6. `eslint.config.cts`

To override this behavior, use the `--config` or `-c` command line option to specify a different configuration file:

```bash
npx eslint --config eslint.config.ts
```
