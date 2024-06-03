---
title: Create Plugins
eleventyNavigation:
    key: create plugins
    parent: extend eslint
    title: Create Plugins
    order: 2

---

ESLint plugins extend ESLint with additional functionality. In most cases, you'll extend ESLint by creating plugins that encapsulate the additional functionality you want to share across multiple projects.

## Creating a plugin

A plugin is a JavaScript object that exposes certain properties to ESLint:

* `meta` - information about the plugin.
* `configs` - an object containing named configurations.
* `rules` - an object containing the definitions of custom rules.
* `processors` - an object containing named processors.

To get started, create a JavaScript file and export an object containing the properties you'd like ESLint to use. To make your plugin as easy to maintain as possible, we recommend that you format your plugin entrypoint file to look like this:

```js
const plugin = {
    meta: {},
    configs: {},
    rules: {},
    processors: {}
};

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;
```

If you plan to distribute your plugin as an npm package, make sure that the module that exports the plugin object is the default export of your package. This will enable ESLint to import the plugin when it is specified in the command line in the [`--plugin` option](../use/command-line-interface#--plugin).

### Meta Data in Plugins

For easier debugging and more effective caching of plugins, it's recommended to provide a name and version in a `meta` object at the root of your plugin, like this:

```js
const plugin = {

    // preferred location of name and version
    meta: {
        name: "eslint-plugin-example",
        version: "1.2.3"
    },
    rules: {
        // add rules here
    }
};

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;
```

The `meta.name` property should match the npm package name for your plugin and the `meta.version` property should match the npm package version for your plugin. The easiest way to accomplish this is by reading this information from your `package.json`, as in this example:

```js
import fs from "fs";

const pkg = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url), "utf8"));

const plugin = {

    // preferred location of name and version
    meta: {
        name: pkg.name,
        version: pkg.version
    },
    rules: {
        // add rules here
    }
};

export default plugin;
```

::: tip
While there are no restrictions on plugin names, it helps others to find your plugin on [npm](https://npmjs.com) when you follow these naming conventions:

* **Unscoped:** If your npm package name won't be scoped (doesn't begin with `@`), then the plugin name should begin with `eslint-plugin-`, such as `eslint-plugin-example`.
* **Scoped:** If your npm package name will be scoped, then the plugin name should be in the format of `@<scope>/eslint-plugin-<plugin-name>` such as `@jquery/eslint-plugin-jquery` or even `@<scope>/eslint-plugin` such as `@jquery/eslint-plugin`.
:::

As an alternative, you can also expose `name` and `version` properties at the root of your plugin, such as:

```js
const plugin = {

    // alternate location of name and version
    name: "eslint-plugin-example",
    version: "1.2.3",
    rules: {
        // add rules here
    }
};

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;
```

::: important
While the `meta` object is the preferred way to provide the plugin name and version, this format is also acceptable and is provided for backward compatibility.
:::

### Rules in Plugins

Plugins can expose custom rules for use in ESLint. To do so, the plugin must export a `rules` object containing a key-value mapping of rule ID to rule. The rule ID does not have to follow any naming convention except that it should not contain a `/` character (so it can just be `dollar-sign` but not `foo/dollar-sign`, for instance). To learn more about creating custom rules in plugins, refer to [Custom Rules](custom-rules).

```js
const plugin = {
    meta: {
        name: "eslint-plugin-example",
        version: "1.2.3"
    },
    rules: {
        "dollar-sign": {
            create(context) {
                // rule implementation ...
            }
        }
    }
};

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;
```

In order to use a rule from a plugin in a configuration file, import the plugin and include it in the `plugins` key, specifying a namespace. Then, use that namespace to reference the rule in the `rules` configuration, like this:

```js
// eslint.config.js
import example from "eslint-plugin-example";

export default [
    {
        plugins: {
            example
        },
        rules: {
            "example/dollar-sign": "error"
        }
    }
];
```

::: warning
Namespaces that don't begin with `@` may not contain a `/`; namespaces that begin with `@` may contain a `/`. For example, `eslint/plugin` is not a valid namespace but `@eslint/plugin` is valid. This restriction is for backwards compatibility with eslintrc plugin naming restrictions.
:::

### Processors in Plugins

Plugins can expose [processors](custom-processors) for use in configuration file by providing a `processors` object. Similar to rules, each key in the `processors` object is the name of a processor and each value is the processor object itself. Here's an example:

```js
const plugin = {
    meta: {
        name: "eslint-plugin-example",
        version: "1.2.3"
    },
    processors: {
        "processor-name": {
            preprocess(text, filename) {/* ... */},
            postprocess(messages, filename) { /* ... */ },
        }
    }
};

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;
```

In order to use a processor from a plugin in a configuration file, import the plugin and include it in the `plugins` key, specifying a namespace. Then, use that namespace to reference the processor in the `processor` configuration, like this:

```js
// eslint.config.js
import example from "eslint-plugin-example";

export default [
    {
        plugins: {
            example
        },
        processor: "example/processor-name"
    }
];
```

### Configs in Plugins

You can bundle configurations inside a plugin by specifying them under the `configs` key. This can be useful when you want to bundle a set of custom rules with a configuration that enables the recommended options. Multiple configurations are supported per plugin.

You can include individual rules from a plugin in a config that's also included in the plugin. In the config, you must specify your plugin name in the `plugins` object as well as any rules you want to enable that are part of the plugin. Any plugin rules must be prefixed with the plugin namespace. Here's an example:

```js
const plugin = {
    meta: {
        name: "eslint-plugin-example",
        version: "1.2.3"
    },
    configs: {},
    rules: {
        "dollar-sign": {
            create(context) {
                // rule implementation ...
            }
        }
    }
};

// assign configs here so we can reference `plugin`
Object.assign(plugin.configs, {
    recommended: [{
        plugins: {
            example: plugin
        },
        rules: {
            "example/dollar-sign": "error"
        },
        languageOptions: {
            globals: {
                myGlobal: "readonly"
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        }
    }]
});

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;
```

This plugin exports a `recommended` config that is an array with one config object. When there is just one config object, you can also export just the object without an enclosing array.

In order to use a config from a plugin in a configuration file, import the plugin and access the config directly through the plugin object. Assuming the config is an array, use the spread operator to add it into the array returned from the configuration file, like this:

```js
// eslint.config.js
import example from "eslint-plugin-example";

export default [
    ...example.configs.recommended
];
```

::: important
Plugins cannot force a specific configuration to be used. Users must manually include a plugin's configurations in their configuration file.
:::

## Testing a Plugin

ESLint provides the [`RuleTester`](../integrate/nodejs-api#ruletester) utility to make it easy to test the rules of your plugin.

## Linting a Plugin

ESLint plugins should be linted too! It's suggested to lint your plugin with the `recommended` configurations of:

* [eslint](https://www.npmjs.com/package/eslint)
* [eslint-plugin-eslint-plugin](https://www.npmjs.com/package/eslint-plugin-eslint-plugin)
* [eslint-plugin-n](https://www.npmjs.com/package/eslint-plugin-n)

## Share Plugins

In order to make your plugin available publicly, you have to publish it on npm. When doing so, please be sure to:

1. **List ESLint as a peer dependency.** Because plugins are intended for use with ESLint, it's important to add the `eslint` package as a peer dependency. To do so, manually edit your `package.json` file to include a `peerDependencies` block, like this:

    ```json
    {
        "peerDependencies": {
            "eslint": ">=9.0.0"
        }
    }
    ```

2. **Specify keywords.** ESLint plugins should specify `eslint`, `eslintplugin` and `eslint-plugin` as [keywords](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#keywords) in your `package.json` file.
