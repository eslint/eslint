---
title: Getting Started with ESLint
eleventyNavigation:
    key: getting started 
    parent: use eslint
    title: Getting Started
    order: 1

---

ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code, with the goal of making code more consistent and avoiding bugs.

ESLint is completely pluggable. Every single rule is a plugin and you can add more at runtime. You can also add community plugins, configurations, and parsers to extend the functionality of ESLint.

## Prerequisites

To use ESLint, you must have [Node.js](https://nodejs.org/en/) (`^12.22.0`, `^14.17.0`, or `>=16.0.0`) installed and built with SSL support. (If you are using an official Node.js distribution, SSL is always built in.)

## Quick start

You can install and configure ESLint using this command:

```shell
npm init @eslint/config
```

If you want to use a specific shareable config that is hosted on npm, you can use the `--config` option and specify the package name:

```shell
# use `eslint-config-semistandard` shared config

# npm 7+
npm init @eslint/config -- --config semistandard

# or (`eslint-config` prefix is optional)
npm init @eslint/config -- --config eslint-config-semistandard

# ⚠️ npm 6.x no extra double-dash:
npm init @eslint/config --config semistandard

```

The `--config` flag also supports passing in arrays:

```shell
npm init @eslint/config -- --config semistandard,standard
# or
npm init @eslint/config -- --config semistandard --config standard
```

**Note:** `npm init @eslint/config` assumes you have a `package.json` file already. If you don't, make sure to run `npm init` or `yarn init` beforehand.

After that, you can run ESLint on any file or directory like this:

```shell
npx eslint yourfile.js

# or

yarn run eslint yourfile.js
```

## Configuration

**Note:** If you are coming from a version before 1.0.0 please see the [migration guide](migrating-to-1.0.0).

After running `npm init @eslint/config`, you'll have a `.eslintrc.{js,yml,json}` file in your directory. In it, you'll see some rules configured like this:

```json
{
    "rules": {
        "semi": ["error", "always"],
        "quotes": ["error", "double"]
    }
}
```

The names `"semi"` and `"quotes"` are the names of [rules](../rules) in ESLint. The first value is the error level of the rule and can be one of these values:

* `"off"` or `0` - turn the rule off
* `"warn"` or `1` - turn the rule on as a warning (doesn't affect exit code)
* `"error"` or `2` - turn the rule on as an error (exit code will be 1)

The three error levels allow you fine-grained control over how ESLint applies rules (for more configuration options and details, see the [configuration docs](configure/)).

Your `.eslintrc.{js,yml,json}` configuration file will also include the line:

```json
{
    "extends": "eslint:recommended"
}
```

Because of this line, all of the rules marked "(recommended)" on the [rules page](../rules) will be turned on.  Alternatively, you can use configurations that others have created by searching for "eslint-config" on [npmjs.com](https://www.npmjs.com/search?q=eslint-config).  ESLint will not lint your code unless you extend from a shared configuration or explicitly turn rules on in your configuration.

## Global Install

It is also possible to install ESLint globally, rather than locally, using `npm install eslint --global`. However, this is not recommended, and any plugins or shareable configs that you use must still be installed locally if you install ESLint globally.

## Manual Set Up

You can also manually set up ESLint in your project.

Before you begin, you must already have a `package.json` file. If you don't, make sure to run `npm init` or `yarn init` to create the file beforehand.

1. Install the ESLint package in your project:

   ```shell
   npm install --save-dev eslint
   ```

1. Add an `.eslintrc` file in one of the [supported configuration file formats](./configure/configuration-files#configuration-file-formats).

   ```shell
   # Create JavaScript configuration file
   touch .eslintrc.js
   ```

1. Add configuration to the `.eslintrc` file. Refer to the [Configuring ESLint documentation](configure/) to learn how to add rules, environments, custom configurations, plugins, and more.

   ```js
   // .eslintrc.js example
   module.exports = {
     "env": {
         "browser": true,
         "es2021": true
     },
     "extends": "eslint:recommended",
     "parserOptions": {
         "ecmaVersion": "latest",
         "sourceType": "module"
     },
   }
   ```

1. Lint code using the ESLint CLI:

   ```shell
   npx eslint project-dir/ file1.js
   ```

   For more information on the available CLI options, refer to [Command Line Interface](./command-line-interface).

---

## Next Steps

* Learn about [advanced configuration](configure/) of ESLint.
* Get familiar with the [command line options](command-line-interface).
* Explore [ESLint integrations](integrations) into other tools like editors, build systems, and more.
* Can't find just the right rule?  Make your own [custom rule](../extend/custom-rules).
* Make ESLint even better by [contributing](../contribute/).
