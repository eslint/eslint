# Working with Plugins

Each plugin is a npm module with a name in the format of `eslint-plugin-<plugin-name>`, such as `eslint-plugin-jquery`.

## Create a Plugin

The module must export an object with a `rules` property.
This `rules` property should be an object containing a key-value mapping of rule ID to rule.
The rule ID does not have to follow any naming convention (so it can just be `dollar-sign`, for instance).

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

You can also create plugins that would tell ESLint how to process files other then JavaScript. In order to create a
processor, object that is exported from your module has to conform to the following interface:

```js
processors: {
    file_extension_with_dot: {
        preprocess: function(string, string) { return [string] } //Takes text of the file and returns array of texts to
                                                                 //be processed
        postprocess: function([[Message]], string) { return [Message] //Takes array of array of error messages, one for
                                                                      //each text block and filename and returns single
                                                                      //array of processed messages
    }
}
```

`preprocess` function takes content of the file and filename and returns back an array of javascript parts of the file.
It's up to the plugin to decide if it needs to return just one part, or multiple pieces. For example in the case of
processing .html files you might want to return just one item in the array by combining all scripts, but for .md file
where each javascript block might be independent, you can return multiple items.

`postprocess` function will take an array of arrays of errors returned by eslint and filename. Each item in the input
array is going to correspond to the part that was returned from `preprocess` function. It's the function of `postprocess`
to adjust location of all errors and aggregate them into a single flat array and return it.

You can have both rules and processor in a single plugin, you can also add multiple preprocessors in a the same plugin.
To support multiple extensions add each one to `preprocessors` element and point them to the same object.

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

### Custom Environments in Plugins

Plugins can also provide custom environments. Custom environments can declare `globals`, turn `ecmaFeatures` on and off,
and configure both core rules as well as rules included in the plugin. To provide custom environment, include `environment`
property in your exported object.

```js
module.exports = {
    environments: {
        "my-custom-environment": {
            globals: {
                "global-variable": true
            },
            rules: {
                "no-alert": 0, //turn off no-alert rule
                "my-plugin/my-rule": 1 //turn on custom rule from this plugin (given that plugin's name is "my-plugin")
            }
        }
    }
}
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

var linter = require("eslint").linter,
    ESLintTester = require("eslint-tester"),
    eslintTester = new ESLintTester(linter);

eslintTester.addRuleTest("lib/rules/custom-plugin-rule", {
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

* [npm Developer Guide](https://www.npmjs.org/doc/misc/npm-developers.html)
