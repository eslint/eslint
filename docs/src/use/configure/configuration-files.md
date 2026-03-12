---
title: Configuration Files
eleventyNavigation:
    key: configuration files
    parent: configure
    title: Configuration Files
    order: 1
---

{%- from 'components/npx_tabs.macro.html' import npx_tabs %}
{%- from 'components/npm_tabs.macro.html' import npm_tabs with context %}

::: tip
This page explains how to use flat config files.
:::

You can put your ESLint project configuration in a configuration file. You can include built-in rules, how you want them enforced, plugins with custom rules, shareable configurations, which files you want rules to apply to, and more.

## Configuration File

The ESLint configuration file may be named any of the following:

- `eslint.config.js`
- `eslint.config.mjs`
- `eslint.config.cjs`
- `eslint.config.ts` (requires [additional setup](#typescript-configuration-files))
- `eslint.config.mts` (requires [additional setup](#typescript-configuration-files))
- `eslint.config.cts` (requires [additional setup](#typescript-configuration-files))

It should be placed in the root directory of your project and export an array of [configuration objects](#configuration-objects). Here's an example:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		rules: {
			semi: "error",
			"prefer-const": "error",
		},
	},
]);
```

In this example, the `defineConfig()` helper is used to define a configuration array with just one configuration object. The configuration object enables two rules: `semi` and `prefer-const`. These rules are applied to all of the files ESLint processes using this config file.

If your project does not specify `"type":"module"` in its `package.json` file, then `eslint.config.js` must be in CommonJS format, such as:

```js
// eslint.config.js
const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
	{
		rules: {
			semi: "error",
			"prefer-const": "error",
		},
	},
]);
```

## Configuration Objects

Each configuration object contains all of the information ESLint needs to execute on a set of files. Each configuration object is made up of these properties:

- `name` - A name for the configuration object. This is used in error messages and [config inspector](https://github.com/eslint/config-inspector) to help identify which configuration object is being used. ([Naming Convention](#configuration-naming-conventions))
- `basePath` - A string specifying the path to a subdirectory to which the configuration object should apply to. It can be a relative or an absolute path.
- `files` - An array of glob patterns indicating the files that the configuration object should apply to. If not specified, the configuration object applies to all files matched by any other configuration object.
- `ignores` - An array of glob patterns indicating the files that the configuration object should not apply to. If not specified, the configuration object applies to all files matched by `files`. If `ignores` is used without any other keys in the configuration object, then the patterns act as [global ignores](#globally-ignore-files-with-ignores) and it gets applied to every configuration object.
- `extends` - An array of strings, configuration objects, or configuration arrays that contain additional configuration to apply.
- `languageOptions` - An object containing settings related to how JavaScript is configured for linting.
    - `ecmaVersion` - The version of ECMAScript to support. May be any year (i.e., `2022`) or version (i.e., `5`). Set to `"latest"` for the most recent supported version. (default: `"latest"`)
    - `sourceType` - The type of JavaScript source code. Possible values are `"script"` for traditional script files, `"module"` for ECMAScript modules (ESM), and `"commonjs"` for CommonJS files. (default: `"module"` for `.js` and `.mjs` files; `"commonjs"` for `.cjs` files)
    - `globals` - An object specifying additional objects that should be added to the global scope during linting.
    - `parser` - An object containing a `parse()` method or a `parseForESLint()` method. (default: [`espree`](https://github.com/eslint/js/tree/main/packages/espree))
    - `parserOptions` - An object specifying additional options that are passed directly to the `parse()` or `parseForESLint()` method on the parser. The available options are parser-dependent.
- `linterOptions` - An object containing settings related to the linting process.
    - `noInlineConfig` - A Boolean value indicating if inline configuration is allowed.
    - `reportUnusedDisableDirectives` - A severity string indicating if and how unused disable and enable directives should be tracked and reported. For legacy compatibility, `true` is equivalent to `"warn"` and `false` is equivalent to `"off"`. (default: `"warn"`).
    - `reportUnusedInlineConfigs` - A severity string indicating if and how unused inline configs should be tracked and reported. (default: `"off"`)
- `processor` - Either an object containing `preprocess()` and `postprocess()` methods or a string indicating the name of a processor inside of a plugin (i.e., `"pluginName/processorName"`).
- `plugins` - An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
- `rules` - An object containing the configured rules. When `files` or `ignores` are specified, these rule configurations are only available to the matching files.
- `settings` - An object containing name-value pairs of information that should be available to all rules.

### Specify `files` and `ignores`

::: tip
Patterns specified in `files` and `ignores` use [`minimatch`](https://www.npmjs.com/package/minimatch) syntax and are evaluated relative to the location of the `eslint.config.js` file. If using an alternate config file via the `--config` command line option, then all patterns are evaluated relative to the current working directory. In case the configuration object has the `basePath` property with a relative path, the subdirectory it specifies is evaluated relative to the location of the `eslint.config.js` file (or relative to the current working directory if using an alternate config file via the `--config` command line option). In configuration objects with the `basePath` property, patterns specified in `files` and `ignores` are evaluated relative to the subdirectory represented by the `basePath`.
:::

You can use a combination of `files` and `ignores` to determine which files the configuration object should apply to and which not. Here's an example:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	// matches all files ending with .js
	{
		files: ["**/*.js"],
		rules: {
			semi: "error",
		},
	},

	// matches all files ending with .js except those in __tests
	{
		files: ["**/*.js"],
		ignores: ["__tests/**"],
		rules: {
			"no-console": "error",
		},
	},
]);
```

Configuration objects without `files` or `ignores` are automatically applied to any file that is matched by any other configuration object. For example:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	// matches all files because it doesn't specify the `files` or `ignores` key
	{
		rules: {
			semi: "error",
		},
	},
]);
```

With this configuration, the `semi` rule is enabled for all files that match the default files in ESLint. So if you pass `example.js` to ESLint, the `semi` rule is applied. If you pass a non-JavaScript file, like `example.txt`, the `semi` rule is not applied because there are no other configuration objects that match that filename. (ESLint outputs an error message letting you know that the file was ignored due to missing configuration.)

::: important
By default, ESLint lints files that match the patterns `**/*.js`, `**/*.cjs`, and `**/*.mjs`. Those files are always matched unless you explicitly exclude them using [global ignores](#globally-ignore-files-with-ignores).
If your configuration object includes other patterns, the rules in configuration objects without a `files` key will also apply to these patterns.

Therefore, when using ESLint for non-JS files as well, it is more appropriate to create a configuration object that includes `files: ["**/*.js", "**/*.cjs", "**/*.mjs"]` and place the relevant rules there.
:::

#### Specify files with arbitrary extensions

To lint files with extensions other than the default `.js`, `.cjs` and `.mjs`, include them in `files` with a pattern in the format of `"**/*.extension"`. Any pattern will work except if it is `*` or if it ends with `/*` or `/**`.
For example, to lint TypeScript files with `.ts`, `.cts` and `.mts` extensions, you would specify a configuration object like this:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.ts", "**/*.cts", "**/*.mts"],
	},
	// ...other config
]);
```

#### Specify files without extension

Files without an extension can be matched with the pattern `!(*.*)`. For example:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/!(*.*)"],
	},
	// ...other config
]);
```

The above config lints files without extension besides the default `.js`, `.cjs` and `.mjs` extensions in all directories.
::: tip
Filenames starting with a dot, such as `.gitignore`, are considered to have only an extension without a base name. In the case of `.gitignore`, the extension is `gitignore`, so the file matches the pattern `"**/.gitignore"` but not `"**/*.gitignore"`.
:::

#### Specify files with an AND operation

Multiple patterns can be matched against the same file by using an array of strings inside of the `files` array. For example:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: [["src/*", "**/.js"]],
	},
	// ...other config
]);
```

The pattern `["src/*", "**/.js"]` matches when a file is both inside of the `src` directory and also ends with `.js`. This approach can be helpful when you're dynamically calculating the value of the `files` array and want to avoid potential errors by trying to combine multiple glob patterns into a single string.

#### Exclude files with `ignores`

You can limit which files a configuration object applies to by specifying a combination of `files` and `ignores` patterns. For example, you may want certain rules to apply only to files in your `src` directory:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["src/**/*.js"],
		rules: {
			semi: "error",
		},
	},
]);
```

Here, only the JavaScript files in the `src` directory have the `semi` rule applied. If you run ESLint on files in another directory, this configuration object is skipped. By adding `ignores`, you can also remove some of the files in `src` from this configuration object:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["src/**/*.js"],
		ignores: ["**/*.config.js"],
		rules: {
			semi: "error",
		},
	},
]);
```

This configuration object matches all JavaScript files in the `src` directory except those that end with `.config.js`. You can also use negation patterns in `ignores` to exclude files from the ignore patterns, such as:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["src/**/*.js"],
		ignores: ["**/*.config.js", "!**/eslint.config.js"],
		rules: {
			semi: "error",
		},
	},
]);
```

Here, the configuration object excludes files ending with `.config.js` except for `eslint.config.js`. That file still has `semi` applied.

Non-global `ignores` patterns can only match file names. A pattern like `"dir-to-exclude/"` will not ignore anything. To ignore everything in a particular directory, a pattern like `"dir-to-exclude/**"` should be used instead.

If `ignores` is used without `files` and there are other keys (such as `rules`), then the configuration object applies to all linted files except the ones excluded by `ignores`, for example:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		ignores: ["**/*.config.js"],
		rules: {
			semi: "error",
		},
	},
]);
```

This configuration object applies to all JavaScript files except those ending with `.config.js`. Effectively, this is like having `files` set to `**/*`. In general, it's a good idea to always include `files` if you are specifying `ignores`.

Note that when `files` is not specified, negated `ignores` patterns do not cause any matching files to be linted automatically.
ESLint only lints files that are matched either by default or by a `files` pattern that is not `*` and does not end with `/*` or `/**`.

::: tip
Use the [config inspector](https://github.com/eslint/config-inspector) (`--inspect-config` in the CLI) to test which config objects apply to a specific file.
:::

#### Globally ignore files with `ignores`

Depending on how the `ignores` property is used, it can behave as non-global `ignores` or as global `ignores`.

- When `ignores` is used without any other keys (besides `name`) in the configuration object, then the patterns act as global ignores. This means they apply to every configuration object (not only to the configuration object in which it is defined). Global `ignores` allows you not to have to copy and keep the `ignores` property synchronized in more than one configuration object.
- If `ignores` is used with other properties in the same configuration object, then the patterns act as non-global ignores. This way `ignores` applies only to the configuration object in which it is defined.

Global and non-global `ignores` have some usage differences:

- patterns in non-global `ignores` only match the files (`dir/filename.js`) or files within directories (`dir/**`)
- patterns in global `ignores` can match directories (`dir/`) in addition to the patterns that non-global ignores supports.

For all uses of `ignores`:

- The patterns you define are added after the default ESLint patterns, which are `["**/node_modules/", ".git/"]`.
- The patterns always match files and directories that begin with a dot, such as `.foo.js` or `.fixtures`, unless those files are explicitly ignored. The only dot directory ignored by default is `.git`.

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

// Example of global ignores
export default defineConfig([
    {
      ignores: [".config/", "dist/", "tsconfig.json"] // acts as global ignores, due to the absence of other properties
    },
    { ... }, // ... other configuration object, inherit global ignores
    { ... }, // ... other configuration object, inherit global ignores
]);

// Example of non-global ignores
export default defineConfig([
    {
      ignores: [".config/**", "dir1/script1.js"],
      rules: { ... } // the presence of this property dictates non-global ignores
    },
    {
      ignores: ["other-dir/**", "dist/script2.js"],
      rules: { ... } // the presence of this property dictates non-global ignores
    },
]);
```

To avoid confusion, use the `globalIgnores()` helper function to clearly indicate which ignores are meant to be global. Here's the previous example rewritten to use `globalIgnores()`:

```js
// eslint.config.js
import { defineConfig, globalIgnores } from "eslint/config";

// Example of global ignores
export default defineConfig([
    globalIgnores([".config/", "dist/", "tsconfig.json"]),
    { ... }, // ... other configuration object, inherit global ignores
    { ... }, // ... other configuration object, inherit global ignores
]);

// Example of non-global ignores
export default defineConfig([
    {
      ignores: [".config/**", "dir1/script1.js"],
      rules: { ... } // the presence of this property dictates non-global ignores
    },
    {
      ignores: ["other-dir/**", "dist/script2.js"],
      rules: { ... } // the presence of this property dictates non-global ignores
    },
]);
```

For more information and examples on configuring rules regarding `ignores`, see [Ignore Files](ignore).

#### Specify base path

You can optionally specify `basePath` to apply the configuration object to a specific subdirectory (including its subdirectories).

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	// matches all files in tests and its subdirectories
	{
		basePath: "tests",
		rules: {
			"no-undef": "error",
		},
	},

	// matches all files ending with spec.js in tests and its subdirectories
	{
		basePath: "tests",
		files: ["**/*.spec.js"],
		languageOptions: {
			globals: {
				it: "readonly",
				describe: "readonly",
			},
		},
	},

	// globally ignores tests/fixtures directory
	{
		basePath: "tests",
		ignores: ["fixtures/"],
	},
]);
```

In combination with [`extends`](#extending-configurations), multiple configuration objects can be applied to the same subdirectory by specifying `basePath` only once, like this:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		basePath: "tests",
		extends: [
			// matches all files in tests and its subdirectories
			{
				rules: {
					"no-undef": "error",
				},
			},

			// matches all files ending with spec.js in tests and its subdirectories
			{
				files: ["**/*.spec.js"],
				languageOptions: {
					globals: {
						it: "readonly",
						describe: "readonly",
					},
				},
			},

			// globally ignores tests/fixtures directory
			{
				ignores: ["fixtures/"],
			},
		],
	},
]);
```

#### Cascading Configuration Objects

When more than one configuration object matches a given filename, the configuration objects are merged with later objects overriding previous objects when there is a conflict. For example:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.js"],
		languageOptions: {
			globals: {
				MY_CUSTOM_GLOBAL: "readonly",
			},
		},
	},
	{
		files: ["tests/**/*.js"],
		languageOptions: {
			globals: {
				it: "readonly",
				describe: "readonly",
			},
		},
	},
]);
```

Using this configuration, all JavaScript files define a custom global object defined called `MY_CUSTOM_GLOBAL` while those JavaScript files in the `tests` directory have `it` and `describe` defined as global objects in addition to `MY_CUSTOM_GLOBAL`. For any JavaScript file in the `tests` directory, both configuration objects are applied, so `languageOptions.globals` are merged to create a final result.

### Configure Linter Options

Options specific to the linting process can be configured using the `linterOptions` object. These effect how linting proceeds and does not affect how the source code of the file is interpreted.

#### Disable Inline Configuration

Inline configuration is implemented using an `/*eslint*/` comment, such as `/*eslint semi: error*/`. You can disallow inline configuration by setting `noInlineConfig` to `true`. When enabled, all inline configuration is ignored. Here's an example:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.js"],
		linterOptions: {
			noInlineConfig: true,
		},
	},
]);
```

#### Report Unused Disable Directives

Disable and enable directives such as `/*eslint-disable*/`, `/*eslint-enable*/` and `/*eslint-disable-next-line*/` are used to disable ESLint rules around certain portions of code. As code changes, it's possible for these directives to no longer be needed because the code has changed in such a way that the rule is no longer triggered. You can enable reporting of these unused disable directives by setting the `reportUnusedDisableDirectives` option to a severity string, as in this example:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.js"],
		linterOptions: {
			reportUnusedDisableDirectives: "error",
		},
	},
]);
```

This setting defaults to `"warn"`.

You can override this setting using the [`--report-unused-disable-directives`](../command-line-interface#--report-unused-disable-directives) or the [`--report-unused-disable-directives-severity`](../command-line-interface#--report-unused-disable-directives-severity) command line options.

For legacy compatibility, `true` is equivalent to `"warn"` and `false` is equivalent to `"off"`.

#### Report Unused Inline Configs

Inline config comments such as `/* eslint rule-name: "error" */` are used to change ESLint rule severity and/or options around certain portions of code.
As a project's ESLint configuration file changes, it's possible for these directives to no longer be different from what was already set.
You can enable reporting of these unused inline config comments by setting the `reportUnusedInlineConfigs` option to a severity string, as in this example:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.js"],
		linterOptions: {
			reportUnusedInlineConfigs: "error",
		},
	},
]);
```

You can override this setting using the [`--report-unused-inline-configs`](../command-line-interface#--report-unused-inline-configs) command line option.

### Configure Rules

You can configure any number of rules in a configuration object by adding a `rules` property containing an object with your rule configurations. The names in this object are the names of the rules and the values are the configurations for each of those rules. Here's an example:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		rules: {
			semi: "error",
		},
	},
]);
```

This configuration object specifies that the [`semi`](../../rules/semi) rule should be enabled with a severity of `"error"`. You can also provide options to a rule by specifying an array where the first item is the severity and each item after that is an option for the rule. For example, you can switch the `semi` rule to disallow semicolons by passing `"never"` as an option:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		rules: {
			semi: ["error", "never"],
		},
	},
]);
```

Each rule specifies its own options and can be any valid JSON data type. Please check the documentation for the rule you want to configure for more information about its available options.

For more information on configuring rules, see [Configure Rules](rules).

### Configure Shared Settings

ESLint supports adding shared settings into configuration files. When you add a `settings` object to a configuration object, it is supplied to every rule. By convention, plugins namespace the settings they are interested in to avoid collisions with others. Plugins can use `settings` to specify the information that should be shared across all of their rules. This may be useful if you are adding custom rules and want them to have access to the same information. Here's an example:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		settings: {
			sharedData: "Hello",
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
						},
					},
				},
			},
		},
		rules: {
			"customPlugin/my-rule": "error",
		},
	},
]);
```

### Extending Configurations

A configuration object uses `extends` to inherit all the traits of another configuration object or array (including rules, plugins, and language options) and can then modify all the options. The `extends` key is an array of values indicating which configurations to extend from. The elements of the `extends` array can be one of three values:

- a string that specifies the name of a configuration in a plugin
- a configuration object
- a configuration array

#### Use Configurations from Plugins

ESLint plugins can export predefined configurations. These configurations are referenced using a string and follow the pattern `pluginName/configName`. The plugin must be specified in the `plugins` key first. Here's an example:

```js
// eslint.config.js
import examplePlugin from "eslint-plugin-example";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.js"],
		plugins: {
			example: examplePlugin,
		},
		extends: ["example/recommended"],
	},
]);
```

In this example, the configuration named `recommended` from `eslint-plugin-example` is loaded. The plugin configurations can also be referenced by name inside of the configuration array.

You can also insert plugin configurations directly into the `extends` array. For example:

```js
// eslint.config.js
import pluginExample from "eslint-plugin-example";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.js"],
		plugins: {
			example: pluginExample,
		},
		extends: [pluginExample.configs.recommended],
	},
]);
```

In this case, the configuration named `recommended` from `eslint-plugin-example` is accessed directly through the plugin object's `configs` property.

::: important
It's recommended to always use a `files` key when you use the `extends` key to ensure that your configuration applies to the correct files. By omitting the `files` key, the extended configuration may end up applied to all files.
:::

#### Use Predefined Configurations

ESLint has two predefined configurations for JavaScript:

- `js/recommended` - enables the rules that ESLint recommends everyone use to avoid potential errors.
- `js/all` - enables all of the rules shipped with ESLint. This configuration is **not recommended** for production use because it changes with every minor and major version of ESLint. Use at your own risk.

To include these predefined configurations, install the `@eslint/js` package and then make any modifications to other properties in subsequent configuration objects:

```js
// eslint.config.js
import js from "@eslint/js";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.js"],
		plugins: {
			js,
		},
		extends: ["js/recommended"],
		rules: {
			"no-unused-vars": "warn",
		},
	},
]);
```

Here, the `js/recommended` predefined configuration is applied first and then another configuration object adds the desired configuration for [`no-unused-vars`](../../rules/no-unused-vars).

For more information on how to combine predefined configs with your preferences, please see [Combine Configs](combine-configs).

#### Use a Shareable Configuration Package

A sharable configuration is an npm package that exports a configuration object or array. This package should be installed as a dependency in your project and then referenced from inside of your `eslint.config.js` file. For example, to use a shareable configuration named `eslint-config-example`, your configuration file would look like this:

```js
// eslint.config.js
import exampleConfig from "eslint-config-example";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.js"],
		extends: [exampleConfig],
		rules: {
			"no-unused-vars": "warn",
		},
	},
]);
```

In this example, `exampleConfig` can be either an object or an array, and either way it can be inserted directly into the `extends` array.

For more information on how to combine shareable configs with your preferences, please see [Combine Configs](combine-configs).

### When to Use Extends vs Cascading

When to use `Extends`:

- **For reusing configurations** - When you want to inherit and build upon existing configurations from plugins, shareable packages, or predefined configs.
- **For plugin configuration** - When applying recommended or specific configurations from ESLint plugins (e.g., `example/recommended`).
- **For shareable configurations** - When using npm packages that export configuration objects (e.g., `eslint-config-example`).
- **For predefined configurations** - When using ESLint's built-in configurations like `js/recommended` or `js/all`.
- **For modular configuration** - When you want to compose multiple configuration sources into a single configuration object.
- **For maintaining consistency** - When you want to ensure consistent base rules across multiple configuration objects.
- **For plugin integration** - When you need to apply configurations that come bundled with plugins.

When to use `Cascading`:

- **For file-specific rule** - When you need different rules for different file patterns or directories.
- **For progressive configuration** - When you want to apply base rules to all files and then add/override rules for specific subsets.
- **For environment-specific settings** - When test files, source files, and config files need different rule sets.
- **For directory-based configuration** - When different project directories require different linting approaches.
- **For rule severity adjustment** - When you want to change rule severity (`error`/`warn`/`off`) for specific file patterns.
- **For language option variations** - When different files need different ECMAScript versions or parser options.

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
				"no-unused-vars": "warn",
			},
		},
		strict: {
			name: "example/strict",
			rules: {
				"no-unused-vars": "error",
			},
		},
	},
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
					ecmaVersion: 2024,
				},
			},
			{
				name: "example/strict/sub-config",
				files: ["src/**/*.js"],
				rules: {
					"no-unused-vars": "error",
				},
			},
		],
	},
};
```

## Configuration File Resolution

When ESLint is run on the command line, it determines configuration for each target file by first looking in the directory that contains the file and then searching up ancestor directories until it finds an `eslint.config.*` file. This behavior improves support for monorepos, where subdirectories can have their own configuration files.

You can prevent this search by using the `-c` or `--config` option on the command line to specify an alternate configuration file, such as:

{{ npx_tabs({
    package: "eslint",
    args: ["--config", "some-other-file.js", "**/*.js"]
}) }}

In this case, ESLint does not search for configuration files and instead uses `some-other-file.js`.

## TypeScript Configuration Files

For Deno and Bun, TypeScript configuration files are natively supported; for Node.js, you must install the optional dev dependency [`jiti`](https://github.com/unjs/jiti) in version 2.2.0 or later in your project (this dependency is not automatically installed by ESLint):

{{ npm_tabs({
    command: "install",
    packages: ["jiti"],
    args: ["--save-dev"]
}) }}

You can then create a configuration file with a `.ts`, `.mts`, or `.cts` extension, and export an array of [configuration objects](#configuration-objects).

::: important
ESLint does not perform type checking on your configuration file and does not apply any settings from `tsconfig.json`.
:::

### Native TypeScript Support

If you're using **Node.js >= 22.13.0**, you can load TypeScript configuration files natively without requiring [`jiti`](https://github.com/unjs/jiti). This is possible thanks to the [**`--experimental-strip-types`**](https://nodejs.org/docs/latest-v22.x/api/cli.html#--experimental-strip-types) flag.

Since this feature is still experimental, you must also enable the `unstable_native_nodejs_ts_config` flag.

```bash
npx --node-options='--experimental-strip-types' eslint --flag unstable_native_nodejs_ts_config
```

### Configuration File Precedence

If you have multiple ESLint configuration files, ESLint prioritizes JavaScript files over TypeScript files. The order of precedence is as follows:

1. `eslint.config.js`
2. `eslint.config.mjs`
3. `eslint.config.cjs`
4. `eslint.config.ts`
5. `eslint.config.mts`
6. `eslint.config.cts`

To override this behavior, use the `--config` or `-c` command line option to specify a different configuration file:

{{ npx_tabs({
    package: "eslint",
    args: ["--config", "eslint.config.ts"]
}) }}
