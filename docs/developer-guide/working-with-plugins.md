# Working with Plugins

Each plugin is an npm module with a name in the format of `eslint-plugin-<plugin-name>`, such as `eslint-plugin-jquery`. You can also use scoped packages in the format of `@<scope>/eslint-plugin-<plugin-name>` such as `@jquery/eslint-plugin-jquery`.

## Create a Plugin

The easiest way to start creating a plugin is to use the [Yeoman generator](https://npmjs.com/package/generator-eslint). The generator will guide you through setting up the skeleton of a plugin.

### Rules in Plugins

If your plugin has rules, then it must export an object with a `rules` property. This `rules` property should be an object containing a key-value mapping of rule ID to rule. The rule ID does not have to follow any naming convention (so it can just be `dollar-sign`, for instance).

```js
module.exports = {
    rules: {
        "dollar-sign": function (context) {
            // rule implementation ...
        }
    }
};
```

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

### Default Configuration for Plugins

You can provide default configuration for the rules included in your plugin by modifying
exported object to include `rulesConfig` property. `rulesConfig` follows the same pattern as
you would use in your .eslintrc config `rules` property, but without plugin name as a prefix.

```js
module.exports = {
    rules: {
        "myFirstRule": require("./lib/rules/my-first-rule"),
        "mySecondRule": require("./lib/rules/my-second-rule")
    },
    rulesConfig: {
        "myFirstRule": 1,
        "mySecondRule": [2, "on"]
    }
};
```

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
