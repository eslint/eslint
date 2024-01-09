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

export default [
    js.configs.recommended,
    {
        rules: {
            "no-unused-vars": "warn"
        }
    }
];
```

Here, the `js.configs.recommended` predefined configuration is applied first and then another configuration object adds the desired configuration for `no-unused-vars`.

### Apply a Config Object to a Subset of Files

You can apply a config object to just a subset of files by creating a new object with a `files` key and using the object spread operator to merge in the rest of the properties from the config object. For example:

```js
// eslint.config.js
import js from "@eslint/js";

export default [
    {
        ...js.configs.recommended,
        files: ["**/src/safe/*.js"]
    }
];
```

Here, the `js.configs.recommended` config object is applied only to files that match the pattern "`**/src/safe/*.js"`.

## Apply a Config Array

If you are importing an array from another module, you can use the array spread operator to insert the items from that array into your exported array. Here's an example:

```js
// eslint.config.js
import exampleConfigs from "eslint-config-example";

export default [
    ...exampleConfigs,

    // your modifications
    {
        rules: {
            "no-unused-vars": "warn"
        }
    }
];
```

Here, the `exampleConfigs` shareable configuration is applied first and then another configuration object adds the desired configuration for `no-unused-vars`.

### Apply a Config Array to a Subset of Files

You can apply a config array to just a subset of files by using the `map()` method to add a `files` key to each config object. For example:

```js
// eslint.config.js
import exampleConfigs from "eslint-config-example";

export default [
    ...exampleConfigs.map(config => ({
        ...config,
        files: ["**/src/safe/*.js"]
    })),

    // your modifications
    {
        rules: {
            "no-unused-vars": "warn"
        }
    }
];
```

Here, each config object in `exampleConfigs` is applied only to files that match the pattern "`**/src/safe/*.js"`.
