---
title: Create Plugins
eleventyNavigation:
    key: create plugins
    parent: extend eslint
    title: Create Plugins
    order: 1

---

Each plugin is an npm module with a name in the format of `eslint-plugin-<plugin-name>`, such as `eslint-plugin-jquery`. You can also use scoped packages in the format of `@<scope>/eslint-plugin-<plugin-name>` such as `@jquery/eslint-plugin-jquery` or even `@<scope>/eslint-plugin` such as `@jquery/eslint-plugin`.

## Create a Plugin

The easiest way to start creating a plugin is to use the [Yeoman generator](https://www.npmjs.com/package/generator-eslint). The generator will guide you through setting up the skeleton of a plugin.

### Rules in Plugins

Plugins can expose additional rules for use in ESLint. To do so, the plugin must export a `rules` object containing a key-value mapping of rule ID to rule. The rule ID does not have to follow any naming convention (so it can just be `dollar-sign`, for instance).

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

You can also create plugins that would tell ESLint how to process files other than JavaScript. In order to create a processor, the object that is exported from your module has to conform to the following interface:

```js
module.exports = {
    processors: {
        "processor-name": {
            // takes text of the file and filename
            preprocess: function(text, filename) {
                // here, you can strip out any non-JS content
                // and split into multiple strings to lint

                return [ // return an array of code blocks to lint
                    { text: code1, filename: "0.js" },
                    { text: code2, filename: "1.js" },
                ];
            },

            // takes a Message[][] and filename
            postprocess: function(messages, filename) {
                // `messages` argument contains two-dimensional array of Message objects
                // where each top-level array item contains array of lint messages related
                // to the text that was returned in array from preprocess() method

                // you need to return a one-dimensional array of the messages you want to keep
                return [].concat(...messages);
            },

            supportsAutofix: true // (optional, defaults to false)
        }
    }
};
```

**The `preprocess` method** takes the file contents and filename as arguments, and returns an array of code blocks to lint. The code blocks will be linted separately but still be registered to the filename.

A code block has two properties `text` and `filename`; the `text` property is the content of the block and the `filename` property is the name of the block. Name of the block can be anything, but should include the file extension, that would tell the linter how to process the current block. The linter will check [`--ext` CLI option](../use/command-line-interface#--ext) to see if the current block should be linted, and resolve `overrides` configs to check how to process the current block.

It's up to the plugin to decide if it needs to return just one part, or multiple pieces. For example in the case of processing `.html` files, you might want to return just one item in the array by combining all scripts, but for `.md` file where each JavaScript block might be independent, you can return multiple items.

**The `postprocess` method** takes a two-dimensional array of arrays of lint messages and the filename. Each item in the input array corresponds to the part that was returned from the `preprocess` method. The `postprocess` method must adjust the locations of all errors to correspond to locations in the original, unprocessed code, and aggregate them into a single flat array and return it.

Reported problems have the following location information:

```typescript
{
    line: number,
    column: number,

    endLine?: number,
    endColumn?: number
}
```

By default, ESLint will not perform autofixes when a processor is used, even when the `--fix` flag is enabled on the command line. To allow ESLint to autofix code when using your processor, you should take the following additional steps:

1. Update the `postprocess` method to additionally transform the `fix` property of reported problems. All autofixable problems will have a `fix` property, which is an object with the following schema:

    ```js
    {
        range: [number, number],
        text: string
    }
    ```

    The `range` property contains two indexes in the code, referring to the start and end location of a contiguous section of text that will be replaced. The `text` property refers to the text that will replace the given range.

    In the initial list of problems, the `fix` property will refer to a fix in the processed JavaScript. The `postprocess` method should transform the object to refer to a fix in the original, unprocessed file.

2. Add a `supportsAutofix: true` property to the processor.

You can have both rules and processors in a single plugin. You can also have multiple processors in one plugin.
To support multiple extensions, add each one to the `processors` element and point them to the same object.

#### Specifying Processor in Config Files

To use a processor, add its ID to a `processor` section in the config file. Processor ID is a concatenated string of plugin name and processor name with a slash as a separator. This can also be added to a `overrides` section of the config, to specify which processors should handle which files.

For example:

```yml
plugins:
  - a-plugin
overrides:
  - files: "*.md"
    processor: a-plugin/markdown
```

See [Specifying Processor](../use/configure/plugins#specify-a-processor) for details.

#### File Extension-named Processor

If a processor name starts with `.`, ESLint handles the processor as a **file extension-named processor** especially and applies the processor to the kind of files automatically. People don't need to specify the file extension-named processors in their config files.

For example:

```js
module.exports = {
    processors: {
        // This processor will be applied to `*.md` files automatically.
        // Also, people can use this processor as "plugin-id/.md" explicitly.
        ".md": {
            preprocess(text, filename) { /* ... */ },
            postprocess(messageLists, filename) { /* ... */ }
        }
    }
}
```

### Configs in Plugins

You can bundle configurations inside a plugin by specifying them under the `configs` key. This can be useful when you want to provide not just code style, but also some custom rules to support it. Multiple configurations are supported per plugin. Note that it is not possible to specify a default configuration for a given plugin and that users must specify in their configuration file when they want to use one.

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
    }
};
```

If the example plugin above were called `eslint-plugin-myPlugin`, the `myConfig` and `myOtherConfig` configurations would then be usable by extending off of `"plugin:myPlugin/myConfig"` and `"plugin:myPlugin/myOtherConfig"`, respectively.

```json
{
    "extends": ["plugin:myPlugin/myConfig"]
}

```

**Note:** Please note that configuration will not enable any of the plugin's rules by default, and instead should be treated as a standalone config. This means that you must specify your plugin name in the `plugins` array as well as any rules you want to enable that are part of the plugin. Any plugin rules must be prefixed with the short or long plugin name. See [Configuring Plugins](../use/configure/plugins#configure-plugins) for more information.

### Peer Dependency

To make clear that the plugin requires ESLint to work correctly you have to declare ESLint as a `peerDependency` in your `package.json`.
The plugin support was introduced in ESLint version `0.8.0`. Ensure the `peerDependency` points to ESLint `0.8.0` or later.

```json
{
    "peerDependencies": {
        "eslint": ">=0.8.0"
    }
}
```

### Testing

ESLint provides the [`RuleTester`](../integrate/nodejs-api#ruletester) utility to make it easy to test the rules of your plugin.

### Linting

ESLint plugins should be linted too! It's suggested to lint your plugin with the `recommended` configurations of:

* [eslint](https://www.npmjs.com/package/eslint)
* [eslint-plugin-eslint-plugin](https://www.npmjs.com/package/eslint-plugin-eslint-plugin)
* [eslint-plugin-node](https://www.npmjs.com/package/eslint-plugin-node)

## Share Plugins

In order to make your plugin available to the community you have to publish it on npm.

Recommended keywords:

* `eslint`
* `eslintplugin`

Add these keywords into your `package.json` file to make it easy for others to find.

## Further Reading

* [npm Developer Guide](https://docs.npmjs.com/misc/developers)
