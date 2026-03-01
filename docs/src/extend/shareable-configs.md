---
title: Share Configurations
eleventyNavigation:
    key: share configs
    parent: extend eslint
    title: Share Configurations
    order: 3
---

To share your ESLint configuration, create a **shareable config**. You can publish your shareable config on [npm](https://www.npmjs.com/) so that others can download and use it in their ESLint projects.

This page explains how to create and publish a shareable config.

::: tip
This page explains how to create a shareable config using the flat config format.
:::

## Create a Shareable Config

Shareable configs are simply npm packages that export a configuration object or array. To start, [create a Node.js module](https://docs.npmjs.com/getting-started/creating-node-modules) like you normally would.

While you can name the package in any way that you'd like, we recommend using one of the following conventions to make your package easier to identify:

- Begin with `eslint-config-`, such as `eslint-config-myconfig`.
- For an npm [scoped module](https://docs.npmjs.com/misc/scope), name or prefix the module with `@scope/eslint-config`, such as `@scope/eslint-config` or `@scope/eslint-config-myconfig`.

In your module, export the shareable config from the module's [`main`](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#main) entry point file. The default main entry point is `index.js`. For example:

```js
// index.js
export default [
	{
		languageOptions: {
			globals: {
				MyGlobal: true,
			},
		},

		rules: {
			semi: [2, "always"],
		},
	},
];
```

Because the `index.js` file is just JavaScript, you can read these settings from a file or generate them dynamically.

::: tip
Most of the time, you'll want to export an array of config objects from your shareable config. However, you can also export a single config object. Make sure your documentation clearly shows an example of how to use your shareable config inside of an `eslint.config.js` file to avoid user confusion.
:::

## Publishing a Shareable Config

Once your shareable config is ready, you can [publish it to npm](https://docs.npmjs.com/getting-started/publishing-npm-packages) to share it with others. We recommend using the `eslint` and `eslintconfig` [keywords](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#keywords) in the `package.json` file so others can easily find your module.

You should declare your dependency on ESLint in the `package.json` using the [peerDependencies](https://docs.npmjs.com/files/package.json#peerdependencies) field. The recommended way to declare a dependency for future-proof compatibility is with the ">=" range syntax, using the lowest required ESLint version. For example:

```json
{
	"peerDependencies": {
		"eslint": ">= 9"
	}
}
```

If your shareable config depends on a plugin or a custom parser, you should specify these packages as `dependencies` in your `package.json`.

## Use a Shareable Config

To use a shareable config, import the package inside of an `eslint.config.js` file and add it into the exported array using `extends`, like this:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";
import myconfig from "eslint-config-myconfig";

export default defineConfig([
	{
		files: ["**/*.js"],
		extends: [myconfig],
	},
]);
```

::: warning
It's not possible to use shareable configs with the ESLint CLI [`--config`](../use/command-line-interface#-c---config) flag.
:::

### Overriding Settings from Shareable Configs

You can override settings from the shareable config by adding them directly into your `eslint.config.js` file after importing the shareable config. For example:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";
import myconfig from "eslint-config-myconfig";

export default defineConfig([
	{
		files: ["**/*.js"],
		extends: [myconfig],

		// anything from here will override myconfig
		rules: {
			"no-unused-vars": "warn",
		},
	},
]);
```

## Sharing Multiple Configs

Because shareable configs are just npm packages, you can export as many configs as you'd like from the same package. In addition to specifying a default config using the `main` entry in your `package.json`, you can specify additional shareable configs by adding a new file to your npm package and then referencing it from your `eslint.config.js` file.

As an example, you can create a file called `my-special-config.js` in the root of your npm package and export a config, such as:

```js
// my-special-config.js
export default {
	rules: {
		quotes: [2, "double"],
	},
};
```

Then, assuming you're using the package name `eslint-config-myconfig`, you can access the additional config via:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";
import myconfig from "eslint-config-myconfig";
import mySpecialConfig from "eslint-config-myconfig/my-special-config.js";

export default defineConfig([
	{
		files: ["**/*.js"],
		extends: [myconfig, mySpecialConfig],

		// anything from here will override myconfig
		rules: {
			"no-unused-vars": "warn",
		},
	},
]);
```

::: important
We strongly recommend always including a default export for your package to avoid confusion.
:::

## Further Reading

- [npm Developer Guide](https://docs.npmjs.com/misc/developers)
