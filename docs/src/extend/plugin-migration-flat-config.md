---
title: Plugin Migration to Flat Config
eleventyNavigation:
    key: plugin flat config
    parent: create plugins
    title: Migration to Flat Config
    order: 4

---

Beginning in ESLint v9.0.0, the default configuration system will be the new flat config system. In order for your plugins to work with flat config files, you'll need to make some changes to your existing plugins.

## Recommended Plugin Structure

To make it easier to work with your plugin in the flat config system, it's recommended that you switch your existing plugin entrypoint to look like this:

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

This structure allows the most flexibility when making other changes discussed on this page.

## Adding Plugin Meta Information

With the old eslintrc configuration system, ESLint could pull information about the plugin from the package name, but with flat config, ESLint no longer has access to the name of the plugin package. To replace that missing information, you should add a `meta` key that contains at least a `name` key, and ideally, a `version` key, such as:

```js
const plugin = {
    meta: {
        name: "eslint-plugin-example",
        version: "1.0.0"
    },
    configs: {},
    rules: {},
    processors: {}
};

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;
```

If your plugin is published as an npm package, the `name` and `version` should be the same as in your `package.json` file; otherwise, you can assign any value you'd like.

Without this meta information, your plugin will not be usable with the `--cache` and `--print-config` command line options.

## Migrating Rules for Flat Config

No changes are necessary for the `rules` key in your plugin. Everything works the same as with the old eslintrc configuration system.

## Migrating Processors for Flat Config

No changes are necessary for the `processors` key in your plugin as long as you aren't using file extension-named processors. If you have any [file extension-named processors](custom-processors#file-extension-named-processor), you must update the name to a valid identifier (numbers and letters). File extension-named processors were automatically applied in the old configuration system but are not automatically applied when using flat config. Here is an example of a file extension-named processor:

```js
const plugin = {
    configs: {},
    rules: {},
    processors: {

        // no longer supported
        ".md": {
            preprocess() {},
            postprocess() {}
        }
    }
};

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;
```

The name `".md"` is no longer valid for a processor, so it must be replaced with a valid identifier such as `markdown`:

```js
const plugin = {
    configs: {},
    rules: {},
    processors: {

        // works in both old and new config systems
        "markdown": {
            preprocess() {},
            postprocess() {}
        }
    }
};

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;
```

In order to use this renamed processor, you'll also need to manually specify it inside of a config, such as:

```js
import example from "eslint-plugin-example";

export default [
    {
        plugins: {
            example
        },
        processor: "example/markdown"
    }
];
```

You should update your plugin's documentation to advise your users if you have renamed a file extension-named processor.

## Migrating Configs for Flat Config

If your plugin is exporting configs that refer back to your plugin, then you'll need to update your configs to flat config format. As part of the migration, you'll need to reference your plugin directly in the `plugins` key. For example, here is an exported config in the old configuration system format for a plugin named `eslint-plugin-example`:

```js
// plugin name: eslint-plugin-example
module.exports = {
    configs: {

        // the config referenced by example/recommended
        recommended: {
            plugins: ["example"],
            rules: {
                "example/rule1": "error",
                "example/rule2": "error"
            }
        }
    },
    rules: {
        rule1: {},
        rule2: {};
    }
};
```

To migrate to flat config format, you'll need to move the configs to after the definition of the `plugin` variable in the recommended plugin structure, like this:

```js
const plugin = {
    configs: {},
    rules: {},
    processors: {}
};

// assign configs here so we can reference `plugin`
Object.assign(plugin.configs, {
    recommended: {
        plugins: {
            example: plugin
        },
        rules: {
            "example/rule1": "error",
            "example/rule2": "error"
        }
    }
})

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;
```

Your users can then use this exported config like this:

```js
import example from "eslint-plugin-example";

export default [

    // use recommended config
    example.configs.recommended,

    // and provide your own overrides
    {
        rules: {
            "example/rule1": "warn"
        }
    }
];
```

You should update your documentation so your plugin users know how to reference the exported configs.

## Migrating Environments for Flat Config

Environments are no longer supported in flat config, and so we recommend transitioning your environments into exported configs. For example, suppose you export a `mocha` environment like this:

```js
// plugin name: eslint-plugin-example
module.exports = {
    environments: {
        mocha: {
            globals: {
                it: true,
                xit: true,
                describe: true,
                xdescribe: true
            }
        }
    },
    rules: {
        rule1: {},
        rule2: {};
    }
};
```

To migrate this environment into a config, you need to add a new key in the `plugin.configs` object that has a flat config object containing the same information, like this:

```js
const plugin = {
    configs: {},
    rules: {},
    processors: {}
};

// assign configs here so we can reference `plugin`
Object.assign(plugin.configs, {
    mocha: {
        languageOptions: {
            globals: {
                it: "writeable",
                xit: "writeable",
                describe: "writeable",
                xdescribe: "writeable"
            }
        }
    }
})

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;
```

Your users can then use this exported config like this:

```js
import example from "eslint-plugin-example";

export default [

    // use the mocha globals
    example.configs.mocha,

    // and provide your own overrides
    {
        languageOptions: {
            globals: {
                it: "readonly"
            }
        }
    }
];
```

You should update your documentation so your plugin users know how to reference the exported configs.

## Backwards Compatibility

If your plugin needs to work with both the old and new configuration systems, then you'll need to:

1. **Export a CommonJS entrypoint.** The old configuration system cannot load plugins that are published only in ESM format. If your source code is in ESM, then you'll need to use a bundler that can generate a CommonJS version and use the [`exports`](https://nodejs.org/api/packages.html#package-entry-points) key in your `package.json` file to ensure the CommonJS version can be found by Node.js.
1. **Keep the `environments` key.** If your plugin exports custom environments, you should keep those as they are and also export the equivalent flat configs as described above. The `environments` key is ignored when ESLint is running in flat config mode.
1. **Export both eslintrc and flat configs.** The `configs` key is only validated when a config is used, so you can provide both formats of configs in the `configs` key. We recommend that you append older format configs with `-legacy` to make it clear that these configs will not be supported in the future. For example, if your primary config is called `recommended` and is in flat config format, then you can also have a config named `recommended-legacy` that is the eslintrc config format.

## Further Reading

* [Overview of the flat config file format blog post](https://eslint.org/blog/2022/08/new-config-system-part-2/)
* [API usage of new configuration system blog post](https://eslint.org/blog/2022/08/new-config-system-part-3/)
* [Background to new configuration system blog post](https://eslint.org/blog/2022/08/new-config-system-part-1/)
