---
title: Getting Started with ESLint
eleventyNavigation:
    key: getting started
    parent: use eslint
    title: Getting Started
    order: 1
---

{%- from 'components/npm_tabs.macro.html' import npm_tabs with context %}
{%- from 'components/npx_tabs.macro.html' import npx_tabs %}

ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code, with the goal of making code more consistent and avoiding bugs.

ESLint is completely pluggable. Every single rule is a plugin and you can add more at runtime. You can also add community plugins, configurations, and parsers to extend the functionality of ESLint.

## Prerequisites

To use ESLint, you must have [Node.js](https://nodejs.org/en/) (`^20.19.0`, `^22.13.0`, or `>=24`) installed and built with SSL support. (If you are using an official Node.js distribution, SSL is always built in.)

If you use ESLint's TypeScript type definitions, TypeScript 5.3 or later is required.

## Quick start

You can install and configure ESLint using this command:

{{ npm_tabs({
    command: "init-create",
    packages: ["@eslint/config@latest"],
    args: []
}) }}

If you want to use a specific shareable config that is hosted on npm, you can use the `--config` option and specify the package name:

{{ npm_tabs({
    command: "init-create",
    packages: ["@eslint/config@latest", "--", "--config", "eslint-config-xo"],
    args: [],
    comment: "use `eslint-config-xo` shared config - npm 7+"
}) }}

**Note:** `npm init @eslint/config` assumes you have a `package.json` file already. If you don't, make sure to run `npm init` or `yarn init` beforehand.

After that, you can run ESLint on any file or directory like this:

{{ npx_tabs({
    package: "eslint",
    args: ["yourfile.js"]
}) }}

## Configuration

**Note:** If you are coming from a version before 9.0.0 please see the [migration guide](configure/migration-guide).

When you run `npm init @eslint/config`, you'll be asked a series of questions to determine how you're using ESLint and what options should be included. After answering these questions, you'll have an `eslint.config.js` (or `eslint.config.mjs`) file created in your directory.

For example, one of the questions is "Where does your code run?" If you select "Browser" then your configuration file will contain the definitions for global variables found in web browsers. Here's an example:

```js
import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
	{ files: ["**/*.js"], languageOptions: { globals: globals.browser } },
	{ files: ["**/*.js"], plugins: { js }, extends: ["js/recommended"] },
]);
```

The `"js/recommended"` configuration ensures all of the rules marked as recommended on the [rules page](../rules) will be turned on. Alternatively, you can use configurations that others have created by searching for "eslint-config" on [npmjs.com](https://www.npmjs.com/search?q=eslint-config). ESLint will not lint your code unless you extend from a shared configuration or explicitly turn rules on in your configuration.

You can configure rules individually by defining a new object with a `rules` key, as in this example:

```js
import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
	{ files: ["**/*.js"], plugins: { js }, extends: ["js/recommended"] },

	{
		rules: {
			"no-unused-vars": "warn",
			"no-undef": "warn",
		},
	},
]);
```

The names `"no-unused-vars"` and `"no-undef"` are the names of [rules](../rules) in ESLint. The first value is the error level of the rule and can be one of these values:

- `"off"` or `0` - turn the rule off
- `"warn"` or `1` - turn the rule on as a warning (doesn’t affect exit code)
- `"error"` or `2` - turn the rule on as an error (exit code will be 1)

The three error levels allow you fine-grained control over how ESLint applies rules (for more configuration options and details, see the configuration docs).

## Global Install

It is also possible to install ESLint globally, rather than locally, using `npm install eslint --global`. However, this is not recommended, and any plugins or shareable configs that you use must still be installed locally even if you install ESLint globally.

## Manual Set Up

You can also manually set up ESLint in your project.

::: important
If you are using [pnpm](https://pnpm.io), be sure to create a `.npmrc` file with at least the following settings:

```text
auto-install-peers=true
node-linker=hoisted
```

This ensures that pnpm installs dependencies in a way that is more compatible with npm and is less likely to produce errors.
:::

Before you begin, you must already have a `package.json` file. If you don't, make sure to run `npm init` or `yarn init` to create the file beforehand.

1. Install the ESLint packages in your project:

{{ npm_tabs({
    command: "install",
    packages: ["eslint@latest", "@eslint/js@latest"],
    args: ["--save-dev"]
}) }}

2. Add an `eslint.config.js` file:

    ```shell
    # Create JavaScript configuration file
    touch eslint.config.js
    ```

3. Add configuration to the `eslint.config.js` file. Refer to the [Configure ESLint documentation](configure/) to learn how to add rules, custom configurations, plugins, and more.

    ```js
    import { defineConfig } from "eslint/config";
    import js from "@eslint/js";

    export default defineConfig([
    	{
    		files: ["**/*.js"],
    		plugins: {
    			js,
    		},
    		extends: ["js/recommended"],
    		rules: {
    			"no-unused-vars": "warn",
    			"no-undef": "warn",
    		},
    	},
    ]);
    ```

4. Lint code using the ESLint CLI:

{{ npx_tabs({
    package: "eslint",
    args: ["project-dir/", "file.js"]
}) }}

For more information on the available CLI options, refer to [Command Line Interface](./command-line-interface).

---

## Next Steps

- Learn about [advanced configuration](configure/) of ESLint.
- Get familiar with the [command line options](command-line-interface).
- Explore [ESLint integrations](integrations) into other tools like editors, build systems, and more.
- Can't find just the right rule? Make your own [custom rule](../extend/custom-rules).
- Make ESLint even better by [contributing](../contribute/).
