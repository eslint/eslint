---
title: Create Plugins
eleventyNavigation:
    key: create plugins
    parent: extend eslint
    title: Create Plugins
    order: 2

---

An ESLint plugin is an extension for ESLint that adds additional rules and configuration options. Plugins let you customize your ESLint configuration to enforce rules that are not included in the core ESLint package. Plugins can also provide additional environments, custom processors, and configurations.

## Name a Plugin

Each plugin is an npm module with a name in the format of `eslint-plugin-<plugin-name>`, such as `eslint-plugin-jquery`. You can also use scoped packages in the format of `@<scope>/eslint-plugin-<plugin-name>` such as `@jquery/eslint-plugin-jquery` or even `@<scope>/eslint-plugin` such as `@jquery/eslint-plugin`.

## Create a Plugin

The easiest way to start creating a plugin is to use the [Yeoman generator](https://www.npmjs.com/package/generator-eslint). The generator will guide you through setting up the skeleton of a plugin.

### Rules in Plugins

Plugins can expose custom rules for use in ESLint. To do so, the plugin must export a `rules` object containing a key-value mapping of rule ID to rule. The rule ID does not have to follow any naming convention (so it can just be `dollar-sign`, for instance). To learn more about creating custom rules in plugins, refer to [Custom Rules](custom-rules).

```js
module.exports = {
    rules: {
        "dollar-sign": {
            create: function (context) {
                // rule implementation ...
            }
        }
    }
};
```

To use the rule in ESLint, you would use the unprefixed plugin name, followed by a slash, followed by the rule name. So if this plugin were named `eslint-plugin-myplugin`, then in your configuration you'd refer to the rule by the name `myplugin/dollar-sign`. Example: `"rules": {"myplugin/dollar-sign": 2}`.

### Environments in Plugins

Plugins can expose additional environments for use in ESLint. To do so, the plugin must export an `environments` object. The keys of the `environments` object are the names of the different environments provided and the values are the environment settings. For example:

```js
module.exports = {
    environments: {
        jquery: {
            globals: {
                $: false
            }
        }
    }
};
```

There's a `jquery` environment defined in this plugin. To use the environment in ESLint, you would use the unprefixed plugin name, followed by a slash, followed by the environment name. So if this plugin were named `eslint-plugin-myplugin`, then you would set the environment in your configuration to be `"myplugin/jquery"`.

Plugin environments can define the following objects:

1. `globals` - acts the same `globals` in a configuration file. The keys are the names of the globals and the values are `true` to allow the global to be overwritten and `false` to disallow.
1. `parserOptions` - acts the same as `parserOptions` in a configuration file.

### Processors in Plugins

::: warning
File extension-named processors are deprecated and only work in eslintrc-style configuration files. Flat config files do not automatically apply processors; you need to explicitly set the `processor` property.
:::

You can add processors to plugins by including the processor functions in the `processors` key. For more information on defining custom processors, refer to [Custom Processors](custom-processors).

```js
module.exports = {
    processors: {
        // This processor will be applied to `*.md` files automatically.
        ".md": {
            preprocess(text, filename) { /* ... */ },
            postprocess(messages, filename) { /* ... */ }
        }
        "processor-name": {
            preprocess: function(text, filename) {/* ... */},

            postprocess: function(messages, filename) { /* ... */ },
        }
    }
}
```

### Configs in Plugins

You can bundle configurations inside a plugin by specifying them under the `configs` key. This can be useful when you want to bundle a set of custom rules with additional configuration. Multiple configurations are supported per plugin.

You can include individual rules from a plugin in a config that's also included in the plugin. In the config, you must specify your plugin name in the `plugins` array as well as any rules you want to enable that are part of the plugin. Any plugin rules must be prefixed with the short or long plugin name.

```js
// eslint-plugin-myPlugin

module.exports = {
    configs: {
        myConfig: {
            plugins: ["myPlugin"],
            env: ["browser"],
            rules: {
                semi: "error",
                "myPlugin/my-rule": "error",
                "eslint-plugin-myPlugin/another-rule": "error"
            }
        },
        myOtherConfig: {
            plugins: ["myPlugin"],
            env: ["node"],
            rules: {
                "myPlugin/my-rule": "off",
                "eslint-plugin-myPlugin/another-rule": "off",
                "eslint-plugin-myPlugin/yet-another-rule": "error"
            }
        }
    },
    rules: {
        "my-rule": {/* rule definition */},
        "another-rule": {/* rule definition */},
        "yet-another-rule": {/* rule definition */}
    }
};
```

Plugins cannot force a specific configuration to be used. Users must manually include a plugin's configurations in their configuration file.

If the example plugin above were called `eslint-plugin-myPlugin`, the `myConfig` and `myOtherConfig` configurations would then be usable in a configuration file by extending `"plugin:myPlugin/myConfig"` and `"plugin:myPlugin/myOtherConfig"`, respectively.

```json
// .eslintrc.json

{
    "extends": ["plugin:myPlugin/myConfig"]
}

```

### Meta Data in Plugins

For easier debugging and more effective caching of plugins, it's recommended to provide a name and version in a `meta` object at the root of your plugin, like this:

```js
// preferred location of name and version
module.exports = {
    meta: {
        name: "eslint-plugin-custom",
        version: "1.2.3"
    }
};
```

The `meta.name` property should match the npm package name for your plugin and the `meta.version` property should match the npm package version for your plugin. The easiest way to accomplish this is by reading this information from your `package.json`.

As an alternative, you can also expose `name` and `version` properties at the root of your plugin, such as:

```js
// alternate location of name and version
module.exports = {
    name: "eslint-plugin-custom",
    version: "1.2.3"
};
```

While the `meta` object is the preferred way to provide the plugin name and version, this format is also acceptable and is provided for backward compatibility.

### Peer Dependency

To make clear that the plugin requires ESLint to work correctly, you must declare ESLint as a peer dependency by mentioning it in the `peerDependencies` field of your plugin's `package.json`.

Plugin support was introduced in ESLint version `0.8.0`. Ensure the `peerDependencies` points to ESLint `0.8.0` or later.

```json
{
    "peerDependencies": {
        "eslint": ">=0.8.0"
    }
}
```

## Testing

ESLint provides the [`RuleTester`](../integrate/nodejs-api#ruletester) utility to make it easy to test the rules of your plugin.

## Linting

ESLint plugins should be linted too! It's suggested to lint your plugin with the `recommended` configurations of:

* [eslint](https://www.npmjs.com/package/eslint)
* [eslint-plugin-eslint-plugin](https://www.npmjs.com/package/eslint-plugin-eslint-plugin)
* [eslint-plugin-n](https://www.npmjs.com/package/eslint-plugin-n)

## Share Plugins

In order to make your plugin available to the community you have to publish it on npm.

To make it easy for others to find your plugin, add these [keywords](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#keywords) to your `package.json` file:

* `eslint`
* `eslintplugin`
