---
title: Ignore Files
eleventyNavigation:
    key: ignore files
    parent: configure
    title: Ignore Files
    order: 7

---

::: tip
This page explains how to ignore files using the flat config format. For the deprecated eslintrc format, [see the deprecated documentation](ignore-deprecated).
:::

You can configure ESLint to ignore certain files and directories while linting by specifying one or more glob patterns in the following ways:

* Inside of your `eslint.config.js` file
* On the command line using `--ignore-pattern`

## Ignoring Files

In your `eslint.config.js` file, if an `ignores` key is used without any other keys in the configuration object, then the patterns act as global ignores. Here's an example:

```js
// eslint.config.js
export default [
    {
        ignores: [".config/*"]
    }
];
```

This configuration specifies that all of the files in the `.config` directory should be ignored. This pattern is added after the default patterns, which are `["**/node_modules/", ".git/"]`.

You can also ignore files on the command line using `--ignore-pattern`, such as:

```shell
npx eslint . --ignore-pattern ".config/*"
```

## Ignoring Directories

Ignoring directories works the same way as ignoring files, by placing a pattern in the `ignores` key of a configuration object with no other keys. For example, the following ignores the `.config` directory as a whole (meaning file search will not traverse into it at all):

```js
// eslint.config.js
export default [
    {
        ignores: [".config/"]
    }
];
```

Unlike `.gitignore`, an ignore pattern like `.config` will only ignore the `.config` directory in the same directory as the configuration file. If you want to recursively ignore all directories named `.config`, you need to use `**/.config/`, as in this example:

```js
// eslint.config.js
export default [
    {
        ignores: ["**/.config/"]
    }
];
```

## Unignoring Files and Directories

You can also unignore files and directories that are ignored by previous patterns, including the default patterns. For example, this config unignores `node_modules/mylibrary`:

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

If you'd like to ignore a directory except for specific files or subdirectories, then the ignore pattern `directory/**/*` must be used instead of `directory/**`. The pattern `directory/**` ignores the entire directory and its contents, so traversal will skip over the directory completely and you cannot unignore anything inside.

For example,  `build/**` ignores directory `build` and its contents, whereas `build/**/*` ignores only its contents. If you'd like to ignore everything in the `build` directory except for `build/test.js`, you'd need to create a config like this:

```js
export default [
    {
        ignores: [
            "build/**/*",     // ignore all contents in and under `build/` directory but not the `build/` directory itself
            "!build/test.js"  // unignore `!build/test.js`
        ]
    }
];
```

If you'd like to ignore a directory except for specific files at any level under the directory, you should also ensure that subdirectories are not ignored. Note that while patterns that end with `/` only match directories, patterns that don't end with `/` match both files and directories so it isn't possible to write a single pattern that only ignores files, but you can achieve this with two patterns: one to ignore all contents and another to unignore subdirectories.

For example, this config ignores all files in and under `build` directory except for files named `test.js` at any level:

```js
export default [
    {
        ignores: [
            "build/**/*",        // ignore all contents in and under `build/` directory but not the `build/` directory itself
            "!build/**/*/",      // unignore all subdirectories
            "!build/**/test.js"  // unignore `test.js` files
        ]
    }
];
```

Note that only global `ignores` patterns can match directories.
`ignores` patterns that are specific to a configuration will only match file names.

You can also unignore files on the command line using `--ignore-pattern`, such as:

```shell
npx eslint . --ignore-pattern "!node_modules/"
```

## Glob Pattern Resolution

How glob patterns are evaluated depends on where they are located and how they are used:

1. When using `ignores` in an `eslint.config.js` file, glob patterns are evaluated relative to the `eslint.config.js` file.
1. When using `ignores` in an alternate configuration file specified using the `--config` command line option, glob patterns are evaluated relative to the current working directory.
1. When using `--ignore-pattern`, glob patterns are evaluated relative to the current working directory.

## Ignored File Warnings

When you pass directories to the ESLint CLI, files and directories are silently ignored. If you pass a specific file to ESLint, then ESLint creates a warning that the file was skipped. For example, suppose you have an `eslint.config.js` file that looks like this:

```js
// eslint.config.js
export default [
    {
        ignores: ["foo.js"]
    }
]
```

And then you run:

```shell
npx eslint foo.js
```

You'll see this warning:

```text
foo.js
  0:0  warning  File ignored because of a matching ignore pattern. Use "--no-ignore" to disable file ignore settings or use "--no-warn-ignored" to suppress this warning.

✖ 1 problem (0 errors, 1 warning)
```

This message occurs because ESLint is unsure if you wanted to actually lint the file or not. As the message indicates, you can use `--no-ignore` to omit using the ignore rules.
