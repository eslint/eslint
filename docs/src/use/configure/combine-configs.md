---
title: Combine Configs
eleventyNavigation:
    key: combine configs
    parent: configure
    title: Combine Configs
    order: 6
---

In many cases, you won't write an ESLint config file from scratch, but rather, you'll use a combination of predefined and shareable configs along with your own overrides to create the config for your project. This page explains some of the patterns you can use to combine configs in your configuration file.

## Apply a Config Object

If you are importing an object from another module, in most cases, you can just insert the object directly into your config file's exported array. For example, you can use the recommended rule configurations for JavaScript by importing the `recommended` config and using it in your array:

```js
// eslint.config.js
import js from "@eslint/js";
import { defineConfig } from "eslint/config";

export default defineConfig([
	js.configs.recommended,
	{
		rules: {
			"no-unused-vars": "warn",
		},
	},
]);
```

Here, the `js.configs.recommended` predefined configuration is applied first and then another configuration object adds the desired configuration for `no-unused-vars`.

### Apply a Configuration to a Subset of Files

You can apply a config object to just a subset of files by creating a new object with a `files` key and using the `extends` key to merge in the rest of the properties from the config object. For example:

```js
// eslint.config.js
import js from "@eslint/js";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/src/safe/*.js"],
		plugins: {
			js,
		},
		extends: ["js/recommended"],
	},
]);
```

Here, the `js/recommended` config object is applied only to files that match the pattern "`**/src/safe/*.js"`.

## Apply a Config Array

If you are importing an array from another module, insert the array directly into your exported array. Here's an example:

```js
// eslint.config.js
import exampleConfigs from "eslint-config-example";
import { defineConfig } from "eslint/config";

export default defineConfig([
	// insert array directly
	exampleConfigs,

	// your modifications
	{
		rules: {
			"no-unused-vars": "warn",
		},
	},
]);
```

Here, the `exampleConfigs` shareable configuration is applied first and then another configuration object adds the desired configuration for `no-unused-vars`. This is equivalent to inserting the individual elements of `exampleConfigs` in order, such as:

```js
// eslint.config.js
import exampleConfigs from "eslint-config-example";
import { defineConfig } from "eslint/config";

export default defineConfig([
	// insert individual elements instead of an array
	exampleConfigs[0],
	exampleConfigs[1],
	exampleConfigs[2],

	// your modifications
	{
		rules: {
			"no-unused-vars": "warn",
		},
	},
]);
```

### Apply a Config Array to a Subset of Files

You can apply a config array to just a subset of files by using the `extends` key. For example:

```js
// eslint.config.js
import exampleConfigs from "eslint-config-example";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/src/safe/*.js"],
		extends: [exampleConfigs],
		rules: {
			"no-unused-vars": "warn",
		},
	},
]);
```

Here, each config object in `exampleConfigs` is applied only to files that match the pattern "`**/src/safe/*.js"`.
