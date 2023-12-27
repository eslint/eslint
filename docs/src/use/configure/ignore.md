---
title: Ignore Files
eleventyNavigation:
    key: ignore files
    parent: configure
    title: Ignore Files
    order: 6

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

## Unignoring Files

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
