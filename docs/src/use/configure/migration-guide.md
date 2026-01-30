---
title: Configuration Migration Guide
eleventyNavigation:
    key: migration guide
    parent: configure
    title: Configuration Migration Guide
    order: 9
---

{%- from 'components/npm_tabs.macro.html' import npm_tabs with context %}
{%- from 'components/npx_tabs.macro.html' import npx_tabs %}

This guide provides an overview of how you can migrate your ESLint configuration file from the eslintrc format (typically configured in `.eslintrc.js` or `.eslintrc.json` files) to the new flat config format (typically configured in an `eslint.config.js` file).

To learn more about the flat config format, refer to [this blog post](https://eslint.org/blog/2022/08/new-config-system-part-2/).

For reference information on flat configuration files, refer to [flat configuration files](configuration-files).

## Migrate Your Config File

To get started, use the [configuration migrator](https://npmjs.com/package/@eslint/migrate-config) on your existing configuration file (`.eslintrc`, `.eslintrc.json`, `.eslintrc.yml`), like this:

{{ npx_tabs({
    package: "@eslint/migrate-config",
    args: [".eslintrc.json"]
}) }}

This will create a starting point for your `eslint.config.js` file but is not guaranteed to work immediately without further modification. It will, however, do most of the conversion work mentioned in this guide automatically.

::: important
The configuration migrator doesn't yet work well for `.eslintrc.js` files. If you are using `.eslintrc.js`, the migration results in a config file that matches the evaluated output of your configuration and won't include any functions, conditionals, or anything other than the raw data represented in your configuration.
:::

## Start Using Flat Config Files

The flat config file format has been the default configuration file format since ESLint v9.0.0. You can start using the flat config file format without any additional configuration.

To use flat config with ESLint v8, place a `eslint.config.js` file in the root of your project **or** set the `ESLINT_USE_FLAT_CONFIG` environment variable to `true`.

## Things That Haven’t Changed between Configuration File Formats

While the configuration file format has changed from eslintrc to flat config, the following has stayed the same:

- Syntax for configuring rules.
- Syntax for configuring processors.
- The CLI, except for the flag changes noted in [CLI Flag Changes](#cli-flag-changes).
- Global variables are configured the same way, but on a different property (see [Configure Language Options](#configure-language-options)).

## Key Differences between Configuration Formats

A few of the most notable differences between the eslintrc and flat config formats are the following:

### Import Plugins and Custom Parsers

Eslintrc files use string-based import system inside the `plugins` property to load plugins and inside the `extends` property to load external configurations.

Flat config files represent plugins and parsers as JavaScript objects. This means you can use CommonJS `require()` or ES module `import` statements to load plugins and custom parsers from external files.

For example, this eslintrc config file loads `eslint-plugin-jsdoc` and configures rules from that plugin:

```javascript
// .eslintrc.js

module.exports = {
	// ...other config
	plugins: ["jsdoc"],
	rules: {
		"jsdoc/require-description": "error",
		"jsdoc/check-values": "error",
	},
	// ...other config
};
```

In flat config, you would do the same thing like this:

```javascript
// eslint.config.js

import { defineConfig } from "eslint/config";
import jsdoc from "eslint-plugin-jsdoc";

export default defineConfig([
	{
		files: ["**/*.js"],
		plugins: {
			jsdoc: jsdoc,
		},
		rules: {
			"jsdoc/require-description": "error",
			"jsdoc/check-values": "error",
		},
	},
]);
```

::: tip
If you import a plugin and get an error such as "TypeError: context.getScope is not a function", then that means the plugin has not yet been updated to the ESLint v9.x rule API. While you should file an issue with the particular plugin, you can manually patch the plugin to work in ESLint v9.x using the [compatibility utilities](https://eslint.org/blog/2024/05/eslint-compatibility-utilities/).
:::

### Custom Parsers

In eslintrc files, importing a custom parser is similar to importing a plugin: you use a string to specify the name of the parser.

In flat config files, import a custom parser as a module, then assign it to the `languageOptions.parser` property of a configuration object.

For example, this eslintrc config file uses the `@babel/eslint-parser` parser:

```javascript
// .eslintrc.js

module.exports = {
	// ...other config
	parser: "@babel/eslint-parser",
	// ...other config
};
```

In flat config, you would do the same thing like this:

```javascript
// eslint.config.js

import { defineConfig } from "eslint/config";
import babelParser from "@babel/eslint-parser";

export default defineConfig([
	{
		// ...other config
		languageOptions: {
			parser: babelParser,
		},
		// ...other config
	},
]);
```

### Processors

In eslintrc files, processors had to be defined in a plugin, and then referenced by name in the configuration. Processors beginning with a dot indicated a file extension-named processor which ESLint would automatically configure for that file extension.

In flat config files, processors can still be referenced from plugins by their name, but they can now also be inserted directly into the configuration. Processors will _never_ be automatically configured, and must be explicitly set in the configuration.

As an example with a custom plugin with processors:

```javascript
// node_modules/eslint-plugin-someplugin/index.js
module.exports = {
	processors: {
		".md": {
			preprocess() {},
			postprocess() {},
		},
		someProcessor: {
			preprocess() {},
			postprocess() {},
		},
	},
};
```

In eslintrc, you would configure as follows:

```javascript
// .eslintrc.js
module.exports = {
	plugins: ["someplugin"],
	processor: "someplugin/someProcessor",
};
```

ESLint would also automatically add the equivalent of the following:

```javascript
{
	overrides: [
		{
			files: ["**/*.md"],
			processor: "someplugin/.md",
		},
	];
}
```

In flat config, the following are all valid ways to express the same:

```javascript
// eslint.config.js
import { defineConfig } from "eslint/config";
import somePlugin from "eslint-plugin-someplugin";

export default defineConfig([
	{
		plugins: { somePlugin },
		processor: "somePlugin/someProcessor",
	},
	{
		plugins: { somePlugin },
		// We can embed the processor object in the config directly
		processor: somePlugin.processors.someProcessor,
	},
	{
		// We don't need the plugin to be present in the config to use the processor directly
		processor: somePlugin.processors.someProcessor,
	},
]);
```

Note that because the `.md` processor is _not_ automatically added by flat config, you also need to specify an extra configuration element:

```javascript
{
    files: ["**/*.md"],
    processor: somePlugin.processors[".md"]
}
```

### Glob-Based Configs

By default, eslintrc files lint all files (except those covered by `.eslintignore`) in the directory in which they’re placed and its child directories. If you want to have different configurations for different file glob patterns, you can specify them in the `overrides` property.

By default, flat config files support different glob pattern-based configs in exported array. You can include the glob pattern in a config object's `files` property. If you don't specify a `files` property, the config defaults to the glob pattern `"**/*.{js,mjs,cjs}"`. Basically, all configuration in the flat config file is like the eslintrc `overrides` property.

#### eslintrc Examples

For example, this eslintrc file applies to all files in the directory where it is placed and its child directories:

```javascript
// .eslintrc.js

module.exports = {
	// ...other config
	rules: {
		semi: ["warn", "always"],
	},
};
```

This eslintrc file supports multiple configs with overrides:

```javascript
// .eslintrc.js

module.exports = {
	// ...other config
	overrides: [
		{
			files: ["src/**/*"],
			rules: {
				semi: ["warn", "always"],
			},
		},
		{
			files: ["test/**/*"],
			rules: {
				"no-console": "off",
			},
		},
	],
};
```

For flat config, here is a configuration with the default glob pattern:

```javascript
// eslint.config.js

import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
	js.configs.recommended, // Recommended config applied to all files
	// Override the recommended config
	{
		rules: {
			indent: ["error", 2],
			"no-unused-vars": "warn",
		},
		// ...other configuration
	},
]);
```

A flat config example configuration supporting multiple configs for different glob patterns:

```javascript
// eslint.config.js

import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
	js.configs.recommended, // Recommended config applied to all files
	// File-pattern specific overrides
	{
		files: ["src/**/*", "test/**/*"],
		rules: {
			semi: ["warn", "always"],
		},
	},
	{
		files: ["test/**/*"],
		rules: {
			"no-console": "off",
		},
	},
	// ...other configurations
]);
```

### Configure Language Options

In eslintrc files, you configure various language options across the `env`, `globals` and `parserOptions` properties. Groups of global variables for specific runtimes (e.g. `document` and `window` for browser JavaScript; `process` and `require` for Node.js) are configured with the `env` property.

In flat config files, the `globals`, and `parserOptions` are consolidated under the `languageOptions` key; the `env` property doesn't exist. Groups of global variables for specific runtimes are imported from the [globals](https://www.npmjs.com/package/globals) npm package and included in the `globals` property. You can use the spread operator (`...`) to import multiple globals at once.

For example, here's an eslintrc file with language options:

```javascript
// .eslintrc.js

module.exports = {
	env: {
		browser: true,
		node: true,
	},
	globals: {
		myCustomGlobal: "readonly",
	},
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: "module",
	},
	// ...other config
};
```

Here's the same configuration in flat config:

```javascript
// eslint.config.js

import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([
	{
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "module",
			globals: {
				...globals.browser,
				...globals.node,
				myCustomGlobal: "readonly",
			},
		},
		// ...other config
	},
]);
```

::: tip
You'll need to install the `globals` package from npm for this example to work. It is not automatically installed by ESLint.
:::

### `eslint-env` Configuration Comments

In the eslintrc config system it was possible to use `eslint-env` configuration comments to define globals for a file.
These comments are no longer recognized when linting with flat config and will be reported as errors.
For this reason, when migrating from eslintrc to flat config, `eslint-env` configuration comments should be removed from all files.
They can be either replaced with equivalent but more verbose `global` configuration comments, or dropped in favor of `globals` definitions in the config file.

For example, when using eslintrc, a file to be linted could look like this:

```javascript
// tests/my-file.js

/* eslint-env mocha */

describe("unit tests", () => {
	it("should pass", () => {
		// ...
	});
});
```

In the above example, `describe` and `it` would be recognized as global identifiers because of the `/* eslint-env mocha */` comment.

The same effect can be achieved with flat config with a `global` configuration comment, e.g.:

```javascript
// tests/my-file.js

/* global describe, it -- Globals defined by Mocha */

describe("unit tests", () => {
	it("should pass", () => {
		// ...
	});
});
```

Another option is to remove the comment from the file being linted and define the globals in the configuration, for example:

```javascript
// eslint.config.js

import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([
	// ...other config
	{
		files: ["tests/**"],
		languageOptions: {
			globals: {
				...globals.mocha,
			},
		},
	},
]);
```

### Predefined and Shareable Configs

In eslintrc files, use the `extends` property to use predefined and shareable configs. ESLint comes with two predefined configs that you can access as strings:

- `"eslint:recommended"`: the rules recommended by ESLint.
- `"eslint:all"`: all rules shipped with ESLint.

You can also use the `extends` property to extend a shareable config. Shareable configs can either be paths to local config files or npm package names.

In flat config files, predefined configs are imported from separate modules into flat config files. The `recommended` and `all` rules configs are located in the [`@eslint/js`](https://www.npmjs.com/package/@eslint/js) package. You must import this package to use these configs:

{{ npm_tabs({
    command: "install",
    packages: ["@eslint/js"],
    args: ["--save-dev"]
}) }}

You can add each of these configs to the exported array or expose specific rules from them. You must import the modules for local config files and npm package configs with flat config.

For example, here's an eslintrc file using the built-in `eslint:recommended` config:

```javascript
// .eslintrc.js

module.exports = {
	// ...other config
	extends: "eslint:recommended",
	rules: {
		semi: ["warn", "always"],
	},
	// ...other config
};
```

This eslintrc file uses built-in config, local custom config, and shareable config from an npm package:

```javascript
// .eslintrc.js

module.exports = {
	// ...other config
	extends: [
		"eslint:recommended",
		"./custom-config.js",
		"eslint-config-my-config",
	],
	rules: {
		semi: ["warn", "always"],
	},
	// ...other config
};
```

To use the same configs in flat config, you would do the following:

```javascript
// eslint.config.js

import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import customConfig from "./custom-config.js";
import myConfig from "eslint-config-my-config";

export default defineConfig([
	js.configs.recommended,
	customConfig,
	myConfig,
	{
		rules: {
			semi: ["warn", "always"],
		},
		// ...other config
	},
]);
```

Note that because you are just importing JavaScript modules, you can mutate the config objects before ESLint uses them. For example, you might want to have a certain config object only apply to your test files:

```javascript
// eslint.config.js

import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import customTestConfig from "./custom-test-config.js";

export default defineConfig([
	js.configs.recommended,
	{
		...customTestConfig,
		files: ["**/*.test.js"],
	},
]);
```

#### Use eslintrc Configs in Flat Config

You may find that there's a shareable config you rely on that hasn't yet been updated to flat config format. In that case, you can use the `FlatCompat` utility to translate the eslintrc format into flat config format. First, install the `@eslint/eslintrc` package:

{{ npm_tabs({
    command: "install",
    packages: ["@eslint/eslintrc"],
    args: ["--save-dev"]
}) }}

Then, import `FlatCompat` and create a new instance to convert an existing eslintrc config. For example, if the npm package `eslint-config-my-config` is in eslintrc format, you can write this:

```js
import { defineConfig } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

export default defineConfig([
	// mimic ESLintRC-style extends
	...compat.extends("eslint-config-my-config"),
]);
```

This example uses the `FlatCompat#extends()` method to insert the `eslint-config-my-config` into the flat config array.

For more information about the `FlatCompat` class, please see the [package README](https://github.com/eslint/eslintrc#usage).

### Ignore Files

With eslintrc, you can make ESLint ignore files by creating a separate `.eslintignore` file in the root of your project. The `.eslintignore` file uses the same glob pattern syntax as `.gitignore` files. Alternatively, you can use an `ignorePatterns` property in your eslintrc file.

To ignore files with flat config, you can use the `ignores` property in a config object with no other properties. The `ignores` property accepts an array of glob patterns. Flat config does not support loading ignore patterns from `.eslintignore` files, so you'll need to migrate those patterns directly into flat config.

For example, here's a `.eslintignore` example you can use with an eslintrc config:

```shell
# .eslintignore
temp.js
config/*
# ...other ignored files
```

Here are the same patterns represented as `ignorePatterns` in a `.eslintrc.js` file:

```javascript
// .eslintrc.js
module.exports = {
	// ...other config
	ignorePatterns: ["temp.js", "config/*"],
};
```

The equivalent ignore patterns in flat config look like this:

```javascript
import { defineConfig } from "eslint/config";

export default defineConfig([
	// ...other config
	{
		// Note: there should be no other properties in this object
		ignores: ["**/temp.js", "config/*"],
	},
]);
```

In `.eslintignore`, `temp.js` ignores all files named `temp.js`, whereas in flat config, you need to specify this as `**/temp.js`. The pattern `temp.js` in flat config only ignores a file named `temp.js` in the same directory as the configuration file.

::: important
In flat config, dotfiles (e.g. `.dotfile.js`) are no longer ignored by default. If you want to ignore dotfiles, add an ignore pattern of `"**/.*"`.
:::

### Linter Options

Eslintrc files let you configure the linter itself with the `noInlineConfig` and `reportUnusedDisableDirectives` properties.

The flat config system introduces a new top-level property `linterOptions` that you can use to configure the linter. In the `linterOptions` object, you can include `noInlineConfig` and `reportUnusedDisableDirectives`.

For example, here's an eslintrc file with linter options enabled:

```javascript
// .eslintrc.js

module.exports = {
	// ...other config
	noInlineConfig: true,
	reportUnusedDisableDirectives: true,
};
```

Here's the same options in flat config:

```javascript
// eslint.config.js

import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		// ...other config
		linterOptions: {
			noInlineConfig: true,
			reportUnusedDisableDirectives: "warn",
		},
	},
]);
```

### CLI Flag Changes

The following CLI flags are no longer supported with the flat config file format:

- `--env`
- `--ignore-path`
- `--no-eslintrc`
- `--resolve-plugins-relative-to`
- `--rulesdir`

#### `--env`

The `--env` flag was used to enable environment-specific globals (for example, `browser`, or `node`). Flat config doesn't support this flag. Instead, define the relevant globals directly in your configuration. See [Specify Globals](language-options#specify-globals) for more details.

For example, if you previously used `--env browser,node`, you’ll need to update your config file like this:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
]);
```

#### `--ignore-path`

The `--ignore-path` flag was used to specify which file to use as your `.eslintignore`. Flat config doesn't load ignore patterns from `.eslintignore` files and does not support this flag. If you want to include patterns from a `.gitignore` file, use `includeIgnoreFile()` from `@eslint/compat`. See [Include `.gitignore` Files](ignore#include-gitignore-files) for more details.

For example, if you previously used `--ignore-path .gitignore`:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";
import { includeIgnoreFile } from "@eslint/compat";
import { fileURLToPath } from "node:url";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default defineConfig([
	includeIgnoreFile(gitignorePath, "Imported .gitignore patterns"),
	// other configs
]);
```

#### `--no-eslintrc`

The `--no-eslintrc` flag has been replaced with `--no-config-lookup`.

#### `--resolve-plugins-relative-to`

The `--resolve-plugins-relative-to` flag was used to indicate which directory plugin references in your configuration file should be resolved relative to. This was necessary because shareable configs could only resolve plugins that were peer dependencies or dependencies of parent packages.

With flat config, shareable configs can specify their dependencies directly, so this flag is no longer needed.

#### `--rulesdir`

The `--rulesdir` flag was used to load additional rules from a specified directory. This is no longer supported when using flat config. You can instead create a plugin containing the local rules you have directly in your config, like this:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";
import myRule from "./rules/my-rule.js";

export default defineConfig([
	{
		// define the plugin
		plugins: {
			local: {
				rules: {
					"my-rule": myRule,
				},
			},
		},

		// configure the rule
		rules: {
			"local/my-rule": ["error"],
		},
	},
]);
```

### `package.json` Configuration No Longer Supported

With eslintrc, it was possible to use a `package.json` file to configure ESLint using the `eslintConfig` key.

With flat config, it's no longer possible to use a `package.json` file to configure ESLint. You'll need to move your configuration into a separate file.

### Additional Changes

The following changes have been made from the eslintrc to the flat config file format:

- The `root` option no longer exists. (Flat config files act as if `root: true` is set.)
- The `files` option cannot be a single string anymore, it must be an array.
- The `sourceType` option now supports the new value `"commonjs"` (`.eslintrc` supports it too, but it was never documented).

## TypeScript Types for Flat Config Files

You can see the TypeScript types for the flat config file format in the [`lib/types` source folder on GitHub](https://github.com/eslint/eslint/tree/main/lib/types). The interface for the objects in the config’s array is called `Linter.Config`.

You can view the type definitions in [`lib/types/index.d.ts`](https://github.com/eslint/eslint/blob/main/lib/types/index.d.ts).

## Visual Studio Code Support

ESLint v9.x support was added in the [`vscode-eslint`](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) v3.0.10.

In versions of `vscode-eslint` prior to v3.0.10, the new configuration system is not enabled by default. To enable support for the new configuration files, edit your `.vscode/settings.json` file and add the following:

```json
{
	// required in vscode-eslint < v3.0.10 only
	"eslint.experimental.useFlatConfig": true
}
```

In a future version of the ESLint plugin, you will no longer need to enable this manually.

## Further Reading

- [Overview of the flat config file format blog post](https://eslint.org/blog/2022/08/new-config-system-part-2/)
- [API usage of new configuration system blog post](https://eslint.org/blog/2022/08/new-config-system-part-3/)
- [Background to new configuration system blog post](https://eslint.org/blog/2022/08/new-config-system-part-1/)
