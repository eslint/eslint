---
title: Configuration Files (New)
eleventyNavigation:
    key: configuration files
    parent: configure
    title: Configuration Files (New)
    order: 1

---

::: warning
This config system is feature complete but not enabled by default. To opt-in, place an `eslint.config.js` file in the root of your project or set the `ESLINT_USE_FLAT_CONFIG` environment variable to `true`. To opt-out, even in the presence of an `eslint.config.js` file, set the environment variable to `false`. If you are using the API, you can use the configuration system described on this page by using the `FlatESLint` class, the `FlatRuleTester` class, or by setting `configType: "flat"` in the `Linter` class.
:::

You can put your ESLint project configuration in a configuration file. You can include built-in rules, how you want them enforced, plugins with custom rules, shareable configurations, which files you want rules to apply to, and more.

## Configuration File

The ESLint configuration file is named `eslint.config.js`. It should be placed in the root directory of your project and export an array of [configuration objects](#configuration-objects). Here's an example:

```js
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
module.exports = [
    {
        rules: {
            semi: "error",
            "prefer-const": "error"
        }
    }
];
```

The configuration file can also export a promise that resolves to the configuration array. This can be useful for using ESM dependencies in CommonJS configuration files, as in this example:

```js
module.exports = (async () => {

    const someDependency = await import("some-esm-dependency");

    return [
        // ... use `someDependency` here
    ];

})();
```

::: warning
ESLint only automatically looks for a config file named `eslint.config.js` and does not look for `eslint.config.cjs` or `eslint.config.mjs`. If you'd like to specify a different config filename than the default, use the `--config` command line option.
:::

## Configuration Objects

Each configuration object contains all of the information ESLint needs to execute on a set of files. Each configuration object is made up of these properties:

* `files` - An array of glob patterns indicating the files that the configuration object should apply to. If not specified, the configuration object applies to all files matched by any other configuration object.
* `ignores` - An array of glob patterns indicating the files that the configuration object should not apply to. If not specified, the configuration object applies to all files matched by `files`.
* `languageOptions` - An object containing settings related to how JavaScript is configured for linting.
    * `ecmaVersion` - The version of ECMAScript to support. May be any year (i.e., `2022`) or version (i.e., `5`). Set to `"latest"` for the most recent supported version. (default: `"latest"`)
    * `sourceType` - The type of JavaScript source code. Possible values are `"script"` for traditional script files, `"module"` for ECMAScript modules (ESM), and `"commonjs"` for CommonJS files. (default: `"module"` for `.js` and `.mjs` files; `"commonjs"` for `.cjs` files)
    * `globals` - An object specifying additional objects that should be added to the global scope during linting.
    * `parser` - An object containing a `parse()` method or a `parseForESLint()` method. (default: [`espree`](https://github.com/eslint/espree))
    * `parserOptions` - An object specifying additional options that are passed directly to the `parse()` or `parseForESLint()` method on the parser. The available options are parser-dependent.
* `linterOptions` - An object containing settings related to the linting process.
    * `noInlineConfig` - A Boolean value indicating if inline configuration is allowed.
    * `reportUnusedDisableDirectives` - A Boolean value indicating if unused disable and enable directives should be tracked and reported.
* `processor` - Either an object containing `preprocess()` and `postprocess()` methods or a string indicating the name of a processor inside of a plugin (i.e., `"pluginName/processorName"`).
* `plugins` - An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
* `rules` - An object containing the configured rules. When `files` or `ignores` are specified, these rule configurations are only available to the matching files.
* `settings` - An object containing name-value pairs of information that should be available to all rules.

### Specifying `files` and `ignores`

::: tip
Patterns specified in `files` and `ignores` use [`minimatch`](https://www.npmjs.com/package/minimatch) syntax and are evaluated relative to the location of the `eslint.config.js` file.
:::

You can use a combination of `files` and `ignores` to determine which files should apply the configuration object and which should not. By default, ESLint matches `**/*.js`, `**/*.cjs`, and `**/*.mjs`. Because config objects that don't specify `files` or `ignores` apply to all files that have been matched by any other configuration object, those config objects apply to any JavaScript files passed to ESLint by default. For example:

```js
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

If `ignores` is used without `files` and there are other keys (such as `rules`), then the configuration object applies to all files except the ones specified in `ignores`, for example:

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

If `ignores` is used without any other keys in the configuration object, then the patterns act as global ignores. Here's an example:

```js
export default [
    {
        ignores: [".config/*"]
    }
];
```

This configuration specifies that all of the files in the `.config` directory should be ignored. This pattern is added after the default patterns, which are `["**/node_modules/", ".git/"]`.

You can also unignore files and directories that are ignored by the default patterns. For example, this config unignores `node_modules/mylibrary`:

```js
export default [
    {
        ignores: [
            "!node_modules/",           // unignore `node_modules/` directory
            "node_modules/*",           // ignore its content
            "!node_modules/mylibrary/"  // unignore `node_modules/mylibrary` directory
        ]
    }
];
```

Note that only global `ignores` patterns can match directories.
`ignores` patterns that are specific to a configuration will only match file names.

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

### Configuring linter options

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

Disable and enable directives such as `/*eslint-disable*/`, `/*eslint-enable*/` and `/*eslint-disable-next-line*/` are used to disable ESLint rules around certain portions of code. As code changes, it's possible for these directives to no longer be needed because the code has changed in such a way that the rule is no longer triggered. You can enable reporting of these unused disable directives by setting the `reportUnusedDisableDirectives` option to `true`, as in this example:

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

By default, unused disable and enable directives are reported as warnings. You can change this setting using the `--report-unused-disable-directives` command line option.

### Configuring language options

Options specific to how ESLint evaluates your JavaScript code can be configured using the `languageOptions` object.

#### Configuring the JavaScript version

To configure the version of JavaScript (ECMAScript) that ESLint uses to evaluate your JavaScript, use the `ecmaVersion` property. This property determines which global variables and syntax are valid in your code and can be set to the version number (such as `6`), the year number (such as `2022`), or `"latest"` (for the most recent version that ESLint supports). By default, `ecmaVersion` is set to `"latest"` and it's recommended to keep this default unless you need to ensure that your JavaScript code is evaluated as an older version. For example, some older runtimes might only allow ECMAScript 5, in which case you can configure ESLint like this:

```js
export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 5
        }
    }
];
```

#### Configuring the JavaScript source type

ESLint can evaluate your code in one of three ways:

1. ECMAScript module (ESM) - Your code has a module scope and is run in strict mode.
1. CommonJS - Your code has a top-level function scope and runs in non-strict mode.
1. Script - Your code has a shared global scope and runs in non-strict mode.

You can specify which of these modes your code is intended to run in by specifying the `sourceType` property. This property can be set to `"module"`, `"commonjs"`, or `"script"`. By default, `sourceType` is set to `"module"` for `.js` and `.mjs` files and is set to `"commonjs"` for `.cjs` files. Here's an example:

```js
export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            sourceType: "script"
        }
    }
];
```

#### Configuring a custom parser and its options

In many cases, you can use the default parser that ESLint ships with for parsing your JavaScript code. You can optionally override the default parser by using the `parser` property. The `parser` property must be an object containing either a `parse()` method or a `parseForESLint()` method. For example, you can use the [`@babel/eslint-parser`](https://www.npmjs.com/package/@babel/eslint-parser) package to allow ESLint to parse experimental syntax:

```js
import babelParser from "@babel/eslint-parser";

export default [
    {
        files: ["**/*.js", "**/*.mjs"],
        languageOptions: {
            parser: babelParser
        }
    }
];
```

This configuration ensures that the Babel parser, rather than the default Espree parser, is used to parse all files ending with `.js` and `.mjs`.

You can also pass options directly to the custom parser by using the `parserOptions` property. This property is an object whose name-value pairs are specific to the parser that you are using. For the Babel parser, you might pass in options like this:

```js
import babelParser from "@babel/eslint-parser";

export default [
    {
        files: ["**/*.js", "**/*.mjs"],
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
                babelOptions: {
                    babelrc: false,
                    configFile: false,
                    // your babel options
                    presets: ["@babel/preset-env"],
                }
            }
        }
    }
];
```

#### Configuring global variables

To configure global variables inside of a configuration object, set the `globals` configuration property to an object containing keys named for each of the global variables you want to use. For each global variable key, set the corresponding value equal to `"writable"` to allow the variable to be overwritten or `"readonly"` to disallow overwriting. For example:

```js
export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            globals: {
                var1: "writable",
                var2: "readonly"
            }
        }
    }
];
```

These examples allow `var1` to be overwritten in your code, but disallow it for `var2`.

Globals can be disabled with the string `"off"`. For example, in an environment where most ES2015 globals are available but `Promise` is unavailable, you might use this config:

```js
export default [
    {
        languageOptions: {
            globals: {
                Promise: "off"
            }
        }
    }
];
```

For historical reasons, the boolean value `false` and the string value `"readable"` are equivalent to `"readonly"`. Similarly, the boolean value `true` and the string value `"writeable"` are equivalent to `"writable"`. However, the use of older values is deprecated.

##### Predefined global variables

Apart from the ECMAScript standard built-in globals, which are automatically enabled based on the configured `languageOptions.ecmaVersion`, ESLint doesn't provide predefined sets of global variables. You can use the [`globals`](https://www.npmjs.com/package/globals) package to additionally enable all globals for a specific environment. For example, here is how you can add `console`, amongst other browser globals, into your configuration.

```js
import globals from "globals";
export default [
    {
        languageOptions: {
            globals: {
                ...globals.browser
            }
        }
    }
];
```

### Using plugins in your configuration

Plugins are used to share rules, processors, configurations, parsers, and more across ESLint projects.

#### Using plugin rules

You can use specific rules included in a plugin. To do this, specify the plugin
in a configuration object using the `plugins` key. The value for the `plugin` key
is an object where the name of the plugin is the property name and the value is the plugin object itself. Here's an example:

```js
import jsdoc from "eslint-plugin-jsdoc";

export default [
    {
        files: ["**/*.js"],
        plugins: {
            jsdoc: jsdoc
        },
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
            jsdoc
        },
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
        },
        rules: {
            "jsd/require-description": "error",
            "jsd/check-values": "error"
        }
    }
];
```

This configuration object uses `jsd` as the prefix plugin instead of `jsdoc`.

#### Using configurations included in plugins

You can use a configuration included in a plugin by adding that configuration
directly to the `eslint.config.js` configurations array.
Often, you do this for a plugin's recommended configuration. Here's an example:

```js
import jsdoc from "eslint-plugin-jsdoc";

export default [
    // configuration included in plugin
    jsdoc.configs["flat/recommended"],
    // other configuration objects...
    {
        files: ["**/*.js"],
        plugins: {
            jsdoc: jsdoc
        },
        rules: {
            "jsdoc/require-description": "warn",
        }
    }
];
```

### Using processors

Processors allow ESLint to transform text into pieces of code that ESLint can lint. You can specify the processor to use for a given file type by defining a `processor` property that contains either the processor name in the format `"pluginName/processorName"` to reference a processor in a plugin or an object containing both a `preprocess()` and a `postprocess()` method. For example, to extract JavaScript code blocks from a Markdown file, you might add this to your configuration:

```js
import markdown from "eslint-plugin-markdown";

export default [
    {
        files: ["**/*.md"],
        plugins: {
            markdown
        },
        processor: "markdown/markdown",
        settings: {
            sharedData: "Hello"
        }
    }
];
```

This configuration object specifies that there is a processor called `"markdown"` contained in the plugin named `"markdown"`.  The configuration applies the processor to all files ending with `.md`.

Processors may make named code blocks that function as filenames in configuration objects, such as `0.js` and `1.js`. ESLint handles such a named code block as a child of the original file. You can specify additional configuration objects for named code blocks. For example, the following disables the `strict` rule for the named code blocks which end with `.js` in markdown files.

```js
import markdown from "eslint-plugin-markdown";

export default [
    {
        files: ["**/*.md"],
        plugins: {
            markdown
        },
        processor: "markdown/markdown",
        settings: {
            sharedData: "Hello"
        }
    },

    // applies only to code blocks
    {
        files: ["**/*.md/*.js"],
        rules: {
            strict: "off"
        }
    }
];
```

### Configuring rules

You can configure any number of rules in a configuration object by add a `rules` property containing an object with your rule configurations. The names in this object are the names of the rules and the values are the configurations for each of those rules. Here's an example:

```js
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
export default [
    {
        rules: {
            semi: ["error", "never"]
        }
    }
];
```

Each rule specifies its own options and can be any valid JSON data type. Please check the documentation for the rule you want to configure for more information about its available options.

#### Rule severities

There are three possible severities you can specify for a rule

* `"error"` (or `2`) - the reported problem should be treated as an error. When using the ESLint CLI, errors cause the CLI to exit with a nonzero code.
* `"warn"` (or `1`) - the reported problem should be treated as a warning. When using the ESLint CLI, warnings are reported but do not change the exit code. If only warnings are reported, the exit code is 0.
* `"off"` (or `0`) - the rule should be turned off completely.

#### Rule configuration cascade

When more than one configuration object specifies the same rule, the rule configuration is merged with the later object taking precedence over any previous objects. For example:

```js
export default [
    {
        rules: {
            semi: ["error", "never"]
        }
    },
    {
        rules: {
            semi: ["warn", "always"]
        }
    }
];
```

Using this configuration, the final rule configuration for `semi` is `["warn", "always"]` because it appears last in the array. The array indicates that the configuration is for the severity and any options. You can change just the severity by defining only a string or number, as in this example:

```js
export default [
    {
        rules: {
            semi: ["error", "never"]
        }
    },
    {
        rules: {
            semi: "warn"
        }
    }
];
```

Here, the second configuration object only overrides the severity, so the final configuration for `semi` is `["warn", "never"]`.

### Configuring shared settings

ESLint supports adding shared settings into configuration files. When you add a `settings` object to a configuration object, it is supplied to every rule. By convention, plugins namespace the settings they are interested in to avoid collisions with others. Plugins can use `settings` to specify the information that should be shared across all of their rules. This may be useful if you are adding custom rules and want them to have access to the same information. Here's an example:

```js
export default [
    {
        settings: {
            sharedData: "Hello"
        }
    }
];
```

### Using predefined configurations

ESLint has two predefined configurations for JavaScript:

* `js.configs.recommended` - enables the rules that ESLint recommends everyone use to avoid potential errors
* `js.configs.all` - enables all of the rules shipped with ESLint

To include these predefined configurations, install the `@eslint/js` package and then make any modifications to other properties in subsequent configuration objects:

```js
import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        rules: {
            semi: ["warn", "always"]
        }
    }
];
```

Here, the `js.configs.recommended` predefined configuration is applied first and then another configuration object adds the desired configuration for `semi`.

You can apply these predefined configs to just a subset of files by specifying a config object with a `files` key, like this:

```js
import js from "@eslint/js";

export default [
    {
        files: ["**/src/safe/*.js"],
        ...js.configs.recommended
    }
];
```

## Configuration File Resolution

When ESLint is run on the command line, it first checks the current working directory for `eslint.config.js`. If the file is not found, it looks to the next parent directory for the file. This search continues until either the file is found or the root directory is reached.

You can prevent this search for `eslint.config.js` by setting the `ESLINT_USE_FLAT_CONFIG` environment variable to `true` and using the `-c` or `--config` option on the command line to specify an alternate configuration file, such as:

```shell
ESLINT_USE_FLAT_CONFIG=true npx eslint --config some-other-file.js **/*.js
```

In this case, ESLint does not search for `eslint.config.js` and instead uses `some-other-file.js`.
