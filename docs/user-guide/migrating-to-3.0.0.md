# Migrating to v3.0.0

ESLint v3.0.0 is the third major version release. We have made several breaking changes in this release, however, we believe the changes to be small enough that they should not require significant changes for ESLint users. This guide is intended to walk you through the changes.

## Dropping Support for Node.js < 4

With ESLint v3.0.0, we are dropping support for Node.js versions prior to 4. Node.js 0.10 and 0.12 are in [maintenance mode](https://github.com/nodejs/Release) and Node.js 4 is the current LTS version. If you are using an older version of Node.js, we recommend upgrading to at least Node.js 4 as soon as possible. If you are unable to upgrade to Node.js 4 or higher, then we recommend continuing to use ESLint v2.x until you are ready to upgrade Node.js.

**Important:** We will not be updating the ESLint v2.x versions going forward. All bug fixes and enhancements will land in ESLint v3.x.

## Requiring Configuration to Run

ESLint v3.0.0 now requires that you use a configuration to run. A configuration can be any of the following:

1. A `.eslintrc.js`, `.eslintrc.json`, `.eslintrc.yml`, `.eslintrc.yaml`, or `.eslintrc` file either in your project or home directory.
2. Configuration options passed on the command line using `--rule` (or to CLIEngine using `rules`).
3. A configuration file passed on the command line using `-c` (or to CLIEngine using `configFile`).
4. A base configuration is provided to CLIEngine using the `baseConfig` option.

If ESLint can't find a configuration, then it will throw an error and ask you to provide one.

This change was made to help new ESLint users who are frequently confused that ESLint does nothing by default besides reporting parser errors. We anticipate this change will have minimal impact on most established users because you're more likely to have configuration files already.

**To Address:** You should be sure to use a configuration whenever you run ESLint. However, you can still run ESLint without a configuration by passing the `--no-eslintrc` option on the command line or setting the `useEslintrc` option to `false` for `CLIEngine`.

To create a new configuration, use `eslint --init`.

## Changes to `"eslint:recommended"`

```json
{
    "extends": "eslint:recommended"
}
```

In 3.0.0, the following rules were added to `"eslint:recommended"`:

* [`no-unsafe-finally`](https://eslint.org/docs/rules/no-unsafe-finally) helps catch `finally` clauses that may not behave as you think.
* [`no-native-reassign`](https://eslint.org/docs/rules/no-native-reassign) was previously part of `no-undef`, but was split out because it didn't make sense as part of another rule. The `no-native-reassign` rule warns whenever you try to overwrite a read-only global variable.
* [`require-yield`](https://eslint.org/docs/rules/require-yield) helps to identify generator functions that do not have the `yield` keyword.

The following rules were removed from `"eslint:recommended"`:

* [`comma-dangle`](https://eslint.org/docs/rules/comma-dangle) used to be recommended because Internet Explorer 8 and earlier threw a syntax error when it found a dangling comma on object literal properties. However, [Internet Explorer 8 was end-of-lifed](https://www.microsoft.com/en-us/WindowsForBusiness/End-of-IE-support) in January 2016 and all other active browsers allow dangling commas. As such, we consider dangling commas to now be a stylistic issue instead of a possible error.

The following rules were modified:

* [`complexity`](https://eslint.org/docs/rules/complexity) used to have a hardcoded default of 11 in `eslint:recommended` that would be used if you turned the rule on without specifying a maximum. The default is now 20. The rule actually always had a default of 20, but `eslint:recommended` was overriding it by mistake.

**To address:** If you want to mimic how `eslint:recommended` worked in v2.x, you can use the following:

```json
{
    "extends": "eslint:recommended",
    "rules": {
        "no-unsafe-finally": "off",
        "no-native-reassign": "off",
        "complexity": ["off", 11],
        "comma-dangle": "error",
        "require-yield": "error"
    }
}
```

## Changes to `CLIEngine#executeOnText()`

The `CLIEngine#executeOnText()` method has changed to work more like `CLIEngine#executeOnFiles()`. In v2.x, `CLIEngine#executeOnText()` warned about ignored files by default and didn't have a way to opt-out of those warnings whereas `CLIEngine#executeOnFiles()` did not warn about ignored files by default and allowed you to opt-in to warning about them. The `CLIEngine#executeOnText()` method now also does not warn about ignored files by default and allows you to opt-in with a new, third argument (a boolean, `true` to warn about ignored files and `false` to not warn).

**To address:** If you are currently using `CLIEngine#executeOnText()` in your project like this:

```js
var result = engine.executeOnText(text, filename);
```

You can get the equivalent behavior using this:

```js
var result = engine.executeOnText(text, filename, true);
```

If you do not want ignored file warnings output to the console, you can omit the third argument or pass `false`.
