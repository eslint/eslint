---
title: Ignore Files
eleventyNavigation:
    key: ignore files
    parent: configure
    title: Ignore Files
    order: 7
---

{%- from 'components/npx_tabs.macro.html' import npx_tabs %}

::: tip
This page explains how to ignore files using the flat config format.
:::

::: tip
This page explains how to use the `globalIgnores()` function to completely ignore files and directories. For more information on non-global ignores, see [Specify files and ignores](configuration-files#specify-files-and-ignores). For more information on the differences between global and non-global ignores, see [Globally ignore files with `ignores`](configuration-files#globally-ignore-files-with-ignores).
:::
You can configure ESLint to ignore certain files and directories while linting by specifying one or more glob patterns in the following ways:

- Inside of your `eslint.config.js` file.
- On the command line using `--ignore-pattern`.

## Ignore Files

In your `eslint.config.js` file, you can use the `globalIgnores()` helper function to indicate patterns of files to be ignored. Here's an example:

```js
// eslint.config.js
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([globalIgnores([".config/*"])]);
```

This configuration specifies that all of the files in the `.config` directory should be ignored. This pattern is added after the default patterns, which are `["**/node_modules/", ".git/"]`.

By default, ESLint lints files that match the patterns `**/*.js`, `**/*.cjs`, and `**/*.mjs`. You can ignore them with `globalIgnores()` if you don't want ESLint to lint these files:

```js
// eslint.config.js
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores(["**/*.js", "**/*.cjs", "**/*.mjs"]),
]);
```

When non-JS files are specified in the `files` property, ESLint still lints files that match the default patterns. To lint only the files specified in the `files` property, you must ignore the default file patterns:

```js
// eslint.config.js
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores(["**/*.js", "**/*.cjs", "**/*.mjs"]),
	{
		files: ["**/*.ts"],
		ignores: [".config/**"],
		rules: {
			/* ... */
		},
	},
]);
```

You can also ignore files on the command line using [`--ignore-pattern`](../command-line-interface#--ignore-pattern), such as:

{{ npx_tabs({
    package: "eslint",
    args: [".", "--ignore-pattern", "\'.config/*\'"]
}) }}

## Ignore Directories

Ignoring directories works the same way as ignoring files, by passing a pattern to the `globalIgnores()` helper function. For example, the following ignores the `.config` directory as a whole (meaning file search will not traverse into it at all):

```js
// eslint.config.js
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([globalIgnores([".config/"])]);
```

Unlike `.gitignore`, an ignore pattern like `.config` will only ignore the `.config` directory in the same directory as the configuration file. If you want to recursively ignore all directories named `.config`, you need to use `**/.config/`, as in this example:

```js
// eslint.config.js
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([globalIgnores(["**/.config/"])]);
```

## Unignore Files and Directories

You can also unignore files and directories that are ignored by previous patterns, including the default patterns. For example, this config unignores `node_modules/mylibrary`:

```js
// eslint.config.js
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores([
		"!node_modules/", // unignore `node_modules/` directory
		"node_modules/*", // ignore its content
		"!node_modules/mylibrary/", // unignore `node_modules/mylibrary` directory
	]),
]);
```

If you'd like to ignore a directory except for specific files or subdirectories, then the ignore pattern `directory/**/*` must be used instead of `directory/**`. The pattern `directory/**` ignores the entire directory and its contents, so traversal will skip over the directory completely and you cannot unignore anything inside.

For example, `build/**` ignores directory `build` and its contents, whereas `build/**/*` ignores only its contents. If you'd like to ignore everything in the `build` directory except for `build/test.js`, you'd need to create a config like this:

```js
// eslint.config.js
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores([
		"build/**/*", // ignore all contents in and under `build/` directory but not the `build/` directory itself
		"!build/test.js", // unignore `!build/test.js`
	]),
]);
```

If you'd like to ignore a directory except for specific files at any level under the directory, you should also ensure that subdirectories are not ignored. Note that while patterns that end with `/` only match directories, patterns that don't end with `/` match both files and directories so it isn't possible to write a single pattern that only ignores files, but you can achieve this with two patterns: one to ignore all contents and another to unignore subdirectories.

For example, this config ignores all files in and under `build` directory except for files named `test.js` at any level:

```js
// eslint.config.js
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores([
		"build/**/*", // ignore all contents in and under `build/` directory but not the `build/` directory itself
		"!build/**/*/", // unignore all subdirectories
		"!build/**/test.js", // unignore `test.js` files
	]),
]);
```

If you want to ignore ESLint's default file patterns (`**/*.js`, `**/*.cjs`, and `**/*.mjs`) while still linting specific files or directories, you can use negative patterns to unignore them:

```js
// eslint.config.js
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores(["**/*.js", "**/*.cjs", "**/*.mjs", "!**/src/**/*.js"]),
]);
```

This configuration ignores all files matching the default patterns except for JavaScript files located within `src` directories.

::: important
Note that only global `ignores` patterns can match directories.
`ignores` patterns that are specific to a configuration will only match file names.
:::

You can also unignore files on the command line using [`--ignore-pattern`](../command-line-interface#--ignore-pattern), such as:

{{ npx_tabs({
    package: "eslint",
    args: [".", "--ignore-pattern", "\'!node_modules/\'"]
}) }}

## Glob Pattern Resolution

How glob patterns are evaluated depends on where they are located and how they are used:

1. When using `globalIgnores()` in an `eslint.config.js` file, glob patterns are evaluated relative to the `eslint.config.js` file.
1. When using `globalIgnores()` in an alternate configuration file specified using the [`--config`](../command-line-interface#-c---config) command line option, glob patterns are evaluated relative to the current working directory.
1. When using [`--ignore-pattern`](../command-line-interface#--ignore-pattern), glob patterns are evaluated relative to the current working directory.

## Name the Global Ignores Config

By default, `globalIgnores()` will assign a name to the config that represents your ignores. You can override this name by providing a second argument to `globalIgnores()`, which is the name you'd like to use instead of the default:

```js
// eslint.config.js
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores(["build/**/*"], "Ignore Build Directory"),
]);
```

The `"Ignore Build Directory"` string in this example is the name of the config created for the global ignores. This is useful for debugging purposes.

## Ignored File Warnings

When you pass directories to the ESLint CLI, files and directories are silently ignored. If you pass a specific file to ESLint, then ESLint creates a warning that the file was skipped. For example, suppose you have an `eslint.config.js` file that looks like this:

```js
// eslint.config.js
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([globalIgnores(["foo.js"])]);
```

And then you run:

{{ npx_tabs({
    package: "eslint",
    args: ["foo.js"]
}) }}

You'll see this warning:

```text
foo.js
  0:0  warning  File ignored because of a matching ignore pattern. Use "--no-ignore" to disable file ignore settings or use "--no-warn-ignored" to suppress this warning.

✖ 1 problem (0 errors, 1 warning)
```

This message occurs because ESLint is unsure if you wanted to actually lint the file or not. As the message indicates, you can use `--no-ignore` to omit using the ignore rules.

## Include `.gitignore` Files

If you want to include patterns from a [`.gitignore`](https://git-scm.com/docs/gitignore) file or any other file with gitignore-style patterns, you can use [`includeIgnoreFile`](https://github.com/eslint/rewrite/tree/main/packages/compat#including-ignore-files) utility from the [`@eslint/compat`](https://www.npmjs.com/package/@eslint/compat) package.

By default, `includeIgnoreFile()` will assign a name to the config that represents your ignores. You can override this name by providing a second argument to `includeIgnoreFile()`, which is the name you'd like to use instead of the default:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";
import { includeIgnoreFile } from "@eslint/compat";
import { fileURLToPath } from "node:url";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default defineConfig([
	includeIgnoreFile(gitignorePath, "Imported .gitignore patterns"),
	{
		// your overrides
	},
]);
```

This automatically loads the specified file and translates gitignore-style patterns into `ignores` glob patterns.
