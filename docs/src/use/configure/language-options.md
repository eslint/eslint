---
title: Configure Language Options
eleventyNavigation:
    key: configure language options
    parent: configure
    title: Configure Language Options
    order: 2
---

::: tip
This page explains how to configure language options using the flat config format.
:::

The JavaScript ecosystem has a variety of runtimes, versions, extensions, and frameworks. Each of these can have different supported syntax and global variables. ESLint lets you configure language options specific to the JavaScript used in your project, like custom global variables. You can also use plugins to extend ESLint to support your project's language options.

## Specify JavaScript Options

ESLint allows you to specify the JavaScript language options you want to support. By default, ESLint expects the most recent stage 4 ECMAScript syntax and ECMAScript modules (ESM) mode. You can override these settings by using the `languageOptions` key and specifying one or more of these properties:

- `ecmaVersion` (default: `"latest"`) - Indicates the ECMAScript version of the code being linted, determining both the syntax and the available global variables. Set to `3` or `5` for ECMAScript 3 and 5, respectively. Otherwise, you can use any year between `2015` to present. In most cases, we recommend using the default of `"latest"` to ensure you're always using the most recent ECMAScript version.
- `sourceType` (default: `"module"`) - Indicates the mode of the JavaScript file being used. Possible values are:
    - `module` - ESM module (invalid when `ecmaVersion` is `3` or `5`). Your code has a module scope and is run in strict mode.
    - `commonjs` - CommonJS module (useful if your code uses `require()`). Your code has a top-level function scope and runs in non-strict mode.
    - `script` - non-module. Your code has a shared global scope and runs in non-strict mode.

Here's an example [configuration file](./configuration-files#configuration-file) you might use when linting ECMAScript 5 code:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		languageOptions: {
			ecmaVersion: 5,
			sourceType: "script",
		},
	},
]);
```

## Specify Parser Options

If you are using the built-in ESLint parser, you can additionally change how ESLint interprets your code by specifying the `languageOptions.parserOptions` key. All options are `false` by default:

- `allowReserved` - allow the use of reserved words as identifiers (if `ecmaVersion` is `3`).
- `ecmaFeatures` - an object indicating which additional language features you'd like to use:
    - `globalReturn` - allow `return` statements in the global scope.
    - `impliedStrict` - enable global [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) (if `ecmaVersion` is `5` or greater).
    - `jsx` - enable [JSX](https://facebook.github.io/jsx/).

Here's an example [configuration file](./configuration-files#configuration-file) that enables JSX parsing in the default parser:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
	},
]);
```

::: important
Please note that supporting JSX syntax is not the same as supporting React. React applies specific semantics to JSX syntax that ESLint doesn't recognize. We recommend using [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) if you are using React.
:::

## Specify Globals

Some of ESLint's core rules rely on knowledge of the global variables available to your code at runtime. Since these can vary greatly between different environments as well as be modified at runtime, ESLint makes no assumptions about what global variables exist in your execution environment. If you would like to use rules that require knowledge of what global variables are available, you can define global variables in your configuration file or by using configuration comments in your source code.

### Use configuration comments

To specify globals using a comment inside of your JavaScript file, use the following format:

```js
/* global var1, var2 */
```

This defines two global variables, `var1` and `var2`. If you want to optionally specify that these global variables can be written to (rather than only being read), then you can set each with a `"writable"` flag:

```js
/* global var1:writable, var2:writable */
```

### Use configuration files

To configure global variables inside of a [configuration file](./configuration-files#configuration-file), set the `languageOptions.globals` configuration property to an object containing keys named for each of the global variables you want to use. For each global variable key, set the corresponding value equal to `"writable"` to allow the variable to be overwritten or `"readonly"` to disallow overwriting. For example:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		languageOptions: {
			globals: {
				var1: "writable",
				var2: "readonly",
			},
		},
	},
]);
```

This configuration allows `var1` to be overwritten in your code, but disallow it for `var2`.

Globals can be disabled by setting their value to `"off"`. For example, in an environment where most globals are available but `Promise` is unavailable, you might use this config:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		languageOptions: {
			globals: {
				Promise: "off",
			},
		},
	},
]);
```

::: tip
For historical reasons, the boolean value `false` and the string value `"readable"` are equivalent to `"readonly"`. Similarly, the boolean value `true` and the string value `"writeable"` are equivalent to `"writable"`. However, the use of these older values is deprecated.
:::

### Predefined global variables

Apart from the ECMAScript standard built-in globals, which are automatically enabled based on the configured `languageOptions.ecmaVersion`, ESLint doesn't provide predefined sets of global variables. You can use the [`globals`](https://www.npmjs.com/package/globals) package to additionally enable all globals for a specific environment. For example, here is how you can add `console`, amongst other browser globals, into your configuration.

```js
// eslint.config.js
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
	},
]);
```

You can include multiple different collections of globals in the same way. The following example includes globals both for web browsers and for [Jest](https://jestjs.io/):

```js
// eslint.config.js
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.jest,
			},
		},
	},
]);
```
