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
