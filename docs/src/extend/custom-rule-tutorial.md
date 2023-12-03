---
title: Custom Rule Tutorial
eleventyNavigation:
    key: custom rule tutorial
    parent: create plugins
    title: Custom Rule Tutorial
    order: 1
---
This tutorial covers how to create a custom rule for ESLint and distribute it with a plugin.

You can create custom rules to validate if your code meets a certain expectation, and determine what to do if it does not meet that expectation. Plugins package custom rules and other configuration, allowing you to easily share and reuse them in different projects.

To learn more about custom rules and plugins refer to the following documentation:

* [Custom Rules](custom-rules)
* [Plugins](plugins)

## Why Create a Custom Rule?

Create a custom rule if the ESLint [built-in rules](../rules/) and community-published custom rules do not meet your needs. You might create a custom rule to enforce a best practice for your company or project, prevent a particular bug from recurring, or ensure compliance with a style guide.

Before creating a custom rule that isn't specific to your company or project, it's worth searching the web to see if someone has published a plugin with a custom rule that solves your use case. It's quite possible the rule may already exist.

## Prerequisites

Before you begin, make sure you have the following installed in your development environment:

* [Node.js](https://nodejs.org/en/download/)
* [npm](https://www.npmjs.com/)

This tutorial also assumes that you have a basic understanding of ESLint and ESLint rules.

## The Custom Rule

The custom rule in this tutorial requires that all `const` variables named `foo` are assigned the string literal `"bar"`. The rule is defined in the file `enforce-foo-bar.js`. The rule also suggests replacing any other value assigned to `const foo` with `"bar"`.

For example, say you had the following `foo.js` file:

```javascript
// foo.js

const foo = "baz123";
```

Running ESLint with the rule would flag `"baz123"` as an incorrect value for variable `foo`. If ESLint is running in autofix mode, then ESLint would fix the file to contain the following:

```javascript
// foo.js

const foo = "bar";
```

## Step 1: Set up Your Project

First, create a new project for your custom rule. Create a new directory, initiate a new npm project in it, and create a new file for the custom rule:

```shell
mkdir eslint-custom-rule-example # create directory
cd eslint-custom-rule-example # enter the directory
npm init -y # init new npm project
touch enforce-foo-bar.js # create file enforce-foo-bar.js
```

## Step 2: Stub Out the Rule File

In the `enforce-foo-bar.js` file, add some scaffolding for the `enforce-foo-bar` custom rule. Also, add a `meta` object with some basic information about the rule.

```javascript
// enforce-foo-bar.js

module.exports = {
    meta: {
       // TODO: add metadata
    },
    create(context) {
        return {
            // TODO: add callback function(s)
        };
    }
};
```

## Step 3: Add Rule Metadata

Before writing the rule, add some metadata to the rule object. ESLint uses this information when running the rule.

Start by exporting an object with a `meta` property containing the rule's metadata, such as the rule type, documentation, and fixability. In this case, the rule type is "problem," the description is "Enforce that a variable named `foo` can only be assigned a value of 'bar'.", and the rule is fixable by modifying the code.

```javascript
// enforce-foo-bar.js

module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Enforce that a variable named `foo` can only be assigned a value of 'bar'.",
        },
        fixable: "code",
        schema: []
    },
    create(context) {
        return {
            // TODO: add callback function(s)
        };
    }
};
```

To learn more about rule metadata, refer to [Rule Structure](custom-rules#rule-structure).

## Step 4: Add Rule Visitor Methods

Define the rule's `create` function, which accepts a `context` object and returns an object with a property for each syntax node type you want to handle. In this case, you want to handle `VariableDeclarator` nodes.
You can choose any [ESTree node type](https://github.com/estree/estree) or [selector](selectors).

Inside the `VariableDeclarator` visitor method, check if the node represents a `const` variable declaration, if its name is `foo`, and if it's not assigned to the string `"bar"`. You do this by evaluating the `node` passed to the `VariableDeclaration` method.

If the `const foo` declaration is assigned a value of `"bar"`, then the rule does nothing. If `const foo` **is not** assigned a value of `"bar"`, then `context.report()` reports an error to ESLint. The error report includes information about the error and how to fix it.

```javascript
// enforce-foo-bar.js
{% raw %}
module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Enforce that a variable named `foo` can only be assigned a value of 'bar'."
        },
        fixable: "code",
        schema: []
    },
    create(context) {
        return {

            // Performs action in the function on every variable declarator
            VariableDeclarator(node) {

                // Check if a `const` variable declaration
                if (node.parent.kind === "const") {

                    // Check if variable name is `foo`
                    if (node.id.type === "Identifier" && node.id.name === "foo") {

                        // Check if value of variable is "bar"
                        if (node.init && node.init.type === "Literal" && node.init.value !== "bar") {

                            /*
                             * Report error to ESLint. Error message uses
                             * a message placeholder to include the incorrect value
                             * in the error message.
                             * Also includes a `fix(fixer)` function that replaces
                             * any values assigned to `const foo` with "bar".
                             */
                            context.report({
                                node,
                                message: 'Value other than "bar" assigned to `const foo`. Unexpected value: {{ notBar }}.',
                                data: {
                                    notBar: node.init.value
                                },
                                fix(fixer) {
                                    return fixer.replaceText(node.init, '"bar"');
                                }
                            });
                        }
                    }
                }
            }
        };
    }
};
{% endraw %}
```

## Step 5: Set up Testing

With the rule written, you can test it to make sure it's working as expected.

ESLint provides the built-in [`RuleTester`](../integrate/nodejs-api#ruletester) class to test rules. You do not need to use third-party testing libraries to test ESLint rules, but `RuleTester` works seamlessly with tools like Mocha and Jest.

Next, create the file for the tests, `enforce-foo-bar.test.js`:

```shell
touch enforce-foo-bar.test.js
```

You will use the `eslint` package in the test file. Install it as a development dependency:

```shell
npm install eslint --save-dev
```

And add a test script to your `package.json` file to run the tests:

```javascript
// package.json
{
    // ...other configuration
    "scripts": {
        "test": "node enforce-foo-bar.test.js"
    },
    // ...other configuration
}
```

## Step 6: Write the Test

To write the test using `RuleTester`, import the class and your custom rule into the `enforce-foo-bar.test.js` file.

The `RuleTester#run()` method tests the rule against valid and invalid test cases. If the rule fails to pass any of the test scenarios, this method throws an error.
`RuleTester` requires that at least one valid and one invalid test scenario be present.

```javascript
// enforce-foo-bar.test.js
const {RuleTester} = require("eslint");
const fooBarRule = require("./enforce-foo-bar");

const ruleTester = new RuleTester({
  // Must use at least ecmaVersion 2015 because
  // that's when `const` variables were introduced.
  parserOptions: { ecmaVersion: 2015 }
});

// Throws error if the tests in ruleTester.run() do not pass
ruleTester.run(
  "enforce-foo-bar", // rule name
  fooBarRule, // rule code
  { // checks
    // 'valid' checks cases that should pass
    valid: [{
      code: "const foo = 'bar';",
    }],
    // 'invalid' checks cases that should not pass
    invalid: [{
      code: "const foo = 'baz';",
      output: 'const foo = "bar";',
      errors: 1,
    }],
  }
);

console.log("All tests passed!");
```

Run the test with the following command:

```shell
npm test
```

If the test passes, you should see the following in your console:

```shell
All tests passed!
```

## Step 7: Bundle the Custom Rule in a Plugin

Now that you've written the custom rule and validated that it works, you can include it in a plugin. Using a plugin, you can share the rule in an npm package to use in other projects.

Create the file for the plugin:

```shell
touch eslint-plugin-example.js
```

And now write the plugin code. Plugins are just exported JavaScript objects. To include a rule in a plugin, include it in the plugin's `rules` object, which contains key-value pairs of rule names and their source code.

To learn more about creating plugins, refer to [Create Plugins](plugins).

```javascript
// eslint-plugin-example.js

const fooBarRule = require("./enforce-foo-bar");
const plugin = { rules: { "enforce-foo-bar": fooBarRule } };
module.exports = plugin;
```

## Step 8: Use the Plugin Locally

You can use a locally defined plugin to execute the custom rule in your project. To use a local plugin, specify the path to the plugin in the `plugins` property of your ESLint configuration file.

You might want to use a locally defined plugin in one of the following scenarios:

* You want to test the plugin before publishing it to npm.
* You want to use a plugin, but do not want to publish it to npm.

Before you can add the plugin to the project, create an ESLint configuration for your project using a [flat configuration file](../use/configure/configuration-files-new), `eslint.config.js`:

```shell
touch eslint.config.js
```

Then, add the following code to `eslint.config.js`:

```javascript
// eslint.config.js
"use strict";

// Import the ESLint plugin locally
const eslintPluginExample = require("./eslint-plugin-example");

module.exports = [
    {
        files: ["**/*.js"],
        languageOptions: {
            sourceType: "commonjs",
            ecmaVersion: "latest",
        },
        // Using the eslint-plugin-example plugin defined locally
        plugins: {"example": eslintPluginExample},
        rules: {
            "example/enforce-foo-bar": "error",
        },
    }
]
```

Before you can test the rule, you must create a file to test the rule on.

Create a file `example.js`:

```shell
touch example.js
```

Add the following code to `example.js`:

```javascript
// example.js

function correctFooBar() {
  const foo = "bar";
}

function incorrectFoo(){
  const foo = "baz"; // Problem!
}
```

Now you're ready to test the custom rule with the locally defined plugin.

Run ESLint on `example.js`:

```shell
npx eslint example.js
```

This produces the following output in the terminal:

```text
/<path-to-directory>/eslint-custom-rule-example/example.js
  8:11  error  Value other than "bar" assigned to `const foo`. Unexpected value: baz  example/enforce-foo-bar

✖ 1 problem (1 error, 0 warnings)
  1 error and 0 warnings potentially fixable with the `--fix` option.
```

## Step 9: Publish the Plugin

To publish a plugin containing a rule to npm, you need to configure the `package.json`. Add the following in the corresponding fields:

1. `"name"`: A unique name for the package. No other package on npm can have the same name.
1. `"main"`: The relative path to the plugin file. Following this example, the path is `"eslint-plugin-example.js"`.
1. `"description"`: A description of the package that's viewable on npm.
1. `"peerDependencies"`: Add `"eslint": ">=8.0.0"` as a peer dependency. Any version greater than or equal to that is necessary to use the plugin. Declaring `eslint` as a peer dependency requires that users add the package to the project separately from the plugin.
1. `"keywords"`: Include the standard keywords `["eslint", "eslintplugin", "eslint-plugin"]` to make the package easy to find. You can add any other keywords that might be relevant to your plugin as well.

A complete annotated example of what a plugin's `package.json` file should look like:

```javascript
// package.json
{
  // Name npm package.
  // Add your own package name. eslint-plugin-example is taken!
  "name": "eslint-plugin-example",
  "version": "1.0.0",
  "description": "ESLint plugin for enforce-foo-bar rule.",
  "main": "eslint-plugin-example.js", // plugin entry point
  "scripts": {
    "test": "node enforce-foo-bar.test.js"
  },
  // Add eslint>=8.0.0 as a peer dependency.
  "peerDependencies": {
    "eslint": ">=8.0.0"
  },
  // Add these standard keywords to make plugin easy to find!
  "keywords": [
    "eslint",
    "eslintplugin",
    "eslint-plugin"
  ],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "eslint": "^8.36.0"
  }
}
```

To publish the package, run `npm publish` and follow the CLI prompts.

You should see the package live on npm!

## Step 10: Use the Published Custom Rule

Next, you can use the published plugin.

Run the following command in your project to download the package:

```shell
npm install --save-dev eslint-plugin-example # Add your package name here
```

Update the `eslint.config.js` to use the packaged version of the plugin:

```javascript
// eslint.config.js
"use strict";

// Import the plugin downloaded from npm
const eslintPluginExample = require("eslint-plugin-example");

// ... rest of configuration
```

Now you're ready to test the custom rule.

Run ESLint on the `example.js` file you created in step 8, now with the downloaded plugin:

```shell
npx eslint example.js
```

This produces the following output in the terminal:

```text
/<path-to-directory>/eslint-custom-rule-example/example.js
  8:11  error  Value other than "bar" assigned to `const foo`. Unexpected value: baz  example/enforce-foo-bar

✖ 1 problem (1 error, 0 warnings)
  1 error and 0 warnings potentially fixable with the `--fix` option.
```

As you can see in the above message, you can actually fix the issue with the `--fix` flag, correcting the variable assignment to be `"bar"`.

Run ESLint again with the `--fix` flag:

```shell
npx eslint example.js --fix
```

There is no error output in the terminal when you run this, but you can see the fix applied in `example.js`. You should see the following:

```javascript
// example.js

// ... rest of file

function incorrectFoo(){
  const foo = "bar"; // Fixed!
}
```

## Summary

In this tutorial, you've made a custom rule that requires all `const` variables named `foo` to be assigned the string `"bar"` and suggests replacing any other value assigned to `const foo` with `"bar"`. You've also added the rule to a plugin, and published the plugin on npm.

Through doing this, you've learned the following practices which you can apply to create other custom rules and plugins:

1. Creating a custom ESLint rule
1. Testing the custom rule
1. Bundling the rule in a plugin
1. Publishing the plugin
1. Using the rule from the plugin

## View the Tutorial Code

You can view the annotated source code for the tutorial [here](https://github.com/eslint/eslint/tree/main/docs/_examples/custom-rule-tutorial-code).
