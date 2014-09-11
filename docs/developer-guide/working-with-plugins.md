# Working with Plugins

Each plugin is a npm module with a name in the format of `eslint-plugin-<plugin-name>`, such as `eslint-plugin-jquery`.

## Create a Plugin

The module must export an object with a `rules` property.
This `rules` property should be an object containing a key-value mapping of rule ID to rule.
The rule ID does not have to follow any naming convention (so it can just be `dollar-sign, for instance).

```js
module.exports = {
    rules: {
        "dollar-sign": function (context) {
            // rule implementation ...
        }
    }
};
```

### Peer Dependency

To make clear that the plugin requires eslint to work correctly you have to declare eslint as a `peerDependency` in your `package.json`.
The plugin support was introduced in eslint version `0.8.0`. Ensure the `peerDependency` points to eslint `0.8.0` or later.

```json
{
    "peerDependencies": {
        "eslint": ">=0.8.0"
    }
}
```

### Testing

You can test the rules of your plugin [the same way as bundled eslint rules](working-with-rules.md#rule-unit-tests) using [`ESLintTester`](https://github.com/eslint/eslint-tester).

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

## Further Reading

* [npm Developer Guide](https://www.npmjs.org/doc/misc/npm-developers.html)
