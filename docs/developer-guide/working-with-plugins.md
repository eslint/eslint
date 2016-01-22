# Working with Plugins

Each plugin is an npm module with a name in the format of `eslint-plugin-<plugin-name>`, such as `eslint-plugin-jquery`. You can also use scoped packages in the format of `@<scope>/eslint-plugin-<plugin-name>` such as `@jquery/eslint-plugin-jquery`.

## Create a Plugin

The easiest way to start creating a plugin is to use the [Yeoman generator](https://npmjs.com/package/generator-eslint). The generator will guide you through setting up the skeleton of a plugin.

### Rules in Plugins

Plugins can expose additional rules for use in ESLint. To do so, the plugin must export a `rules` object containing a key-value mapping of rule ID to rule. The rule ID does not have to follow any naming convention (so it can just be `dollar-sign`, for instance).

```js
module.exports = {
    rules: {
        "dollar-sign": function (context) {
            // rule implementation ...
        }
    }
};
```

To use the rule in ESLint, you would use the unprefixed plugin name, followed by a slash, followed by the rule name. So if this plugin were named `eslint-plugin-myplugin`, then you would set the environment in your configuration to be `"myplugin/dollar-sign"`.


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

You can also create plugins that would tell ESLint how to process files other than JavaScript. In order to create a processor, object that is exported from your module has to conform to the following interface:

```js
processors: {

    // assign to the file extension you want (.js, .jsx, .html, etc.)
    ".ext": {
        // takes text of the file and filename
        preprocess: function(text, filename) {
            // here, you can strip out any non-JS content
            // and split into multiple strings to lint

            return [string];  // return an array of strings to lint
        },

        // takes a Message[][] and filename
        postprocess: function(messages, filename) {
            // `messages` argument contains two-dimensional array of Message objects
            // where each top-level array item contains array of lint messages related
            // to the text that was returned in array from preprocess() method

            // you need to return a one-dimensional array of the messages you want to keep
            return [Message];
        }
    }
}
```

The `preprocess` method takes the file contents and filename as arguments, and returns an array of strings to lint. The strings will be linted separately but still be registered to the filename. It's up to the plugin to decide if it needs to return just one part, or multiple pieces. For example in the case of processing `.html` files, you might want to return just one item in the array by combining all scripts, but for `.md` file where each JavaScript block might be independent, you can return multiple items.

The `postprocess` method takes a two-dimensional array of arrays of lint messages and the filename. Each item in the input
array corresponds to the part that was returned from the `preprocess` method. The `postprocess` method must adjust the location of all errors and aggregate them into a single flat array and return it.

You can have both rules and processors in a single plugin. You can also have multiple processors in one plugin.
To support multiple extensions, add each one to the `processors` element and point them to the same object.

### Configs in Plugins

You can bundle configurations inside a plugin. This can be useful when you want to provide not just code style, but also some custom rules to support it. You can specify configurations under `configs` key. Please note that when exposing configurations, you have to name each one, and there is no default. So your users will have to specify the name of the configuration they want to use.

```js
configs: {
    myConfig: {
        env: ["browser"],
        rules: {
            semi: 2
        }
    }
}
```

**Note:** Please note that configuration will not automatically attach your rules and you have to specify your plugin name and any rules you want to enable that are part of the plugin. See [Configuring Plugins](../user-guide/configuring#configuring-plugins)

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

You can test the rules of your plugin [the same way as bundled ESLint rules](working-with-rules.md#rule-unit-tests) using [`ESLintTester`](https://github.com/eslint/eslint-tester).

Example:

```js
"use strict";

var rule = require("../../../lib/rules/custom-plugin-rule"),
    RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();
ruleTester.run("custom-plugin-rule", rule, {
    valid: [
        "var validVariable = true",
    ],

    invalid: [
        {
            code: "var invalidVariable = true",
            errors: [ { message: "Unexpected invalid variable." } ]
        }
    ]
});
```

## Share Plugins

In order to make your plugin available to the community you have to publish it on npm.

Recommended keywords:

* `eslint`
* `eslintplugin`

Add these keywords into your `package.json` file to make it easy for others to find.

## Further Reading

* [npm Developer Guide](https://docs.npmjs.com/misc/developers)
