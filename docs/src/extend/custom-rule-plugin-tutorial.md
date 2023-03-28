---
title: Custom Rule & Plugin Tutorial
eleventyNavigation:
    key: custom rule plugin tutorial
    parent: create plugins
    title: Custom Rule & Plugin Tutorial
    order: 1
---
This tutorial covers how to create a custom rule and plugin for ESLint.

You can create custom rules to validate if your code meets a certain expectation, and determine what to do if it does not meet that expectation. Plugins package custom rules and other configuration, allowing you to easily share and reuse them in different projects.

To learn more about custom rules and plugins refer to the following documentation:

* [Custom Rules](custom-rules)
* [Plugins](plugins)

## Why Create a Custom Rule?

Create a custom rule if the ESLint [built-in rules](../rules/) and community-published custom rules do not meet your needs.

Before creating a custom rule, it's worth investigating on the web if someone has published a plugin with a custom rule that solves your use case. Very often the rule will already exist.

## Prerequisites

Before you begin, make sure you have the following installed in your development environment:

* [Node.js](https://nodejs.org/en/download/)
* [npm](https://www.npmjs.com/)

This tutorial also assumes that you have a basic understanding of ESLint and ESLint rules.

## The Custom Rule You Make

The custom rule that you make in this tutorial requires that all `const` variables named `foo` are assigned the string `"bar"`. The rule is defined in the file `foo-bar.js`. The rule also suggests replacing any other value assigned to `const foo` with `"bar"`

You can run the custom rule on a file to report and fix any problems.

For example, say you had the following `foo.js` file:

```javascript
// foo.js

const foo = "baz123";
```

Running ESLint with the rule would fix the file to contain the following:

```javascript
// foo.js

const foo = "bar";
```

## Step 1: Set up Project

First create a new project for your custom rule. Create a new directory, initiate a new npm project in it, and create a new file for the custom rule:

```shell
mkdir foo-bar-rule # create directory
cd foo-bar-rule # enter the directory
npm init -y # init new npm project
touch foo-bar.js # create file foo-bar.js
```

## Step 2: Stub Out Rule File

In the `foo-bar.js` file, add some scaffolding for the `foo-bar` custom rule. Also add a `meta` object with some basic information about the rule.

All ESLint rules are objects that follow this structure.

```javascript
// foo-bar.js

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

Start by exporting a module with a `meta` object containing the rule's metadata, such as the rule type, documentation, and fixability. In this case, the rule type is "fix," the description is "Can only assign 'bar' to const foo.", and the rule is fixable by modifying the code.

```javascript
// foo-bar.js

module.exports = {
    meta: {
        type: "fix",
        docs: {
            description: "Can only assign 'bar' to `const foo`.",
        },
        fixable: "code"
    },
    create(context) {
        return {
            // TODO: add callback function(s)
            }
        };
    }
};
```

To learn more about rule metadata, refer to [Rule Structure](custom-rules#rule-structure).

## Step 4: Add Rule Callback Functions

Define the rule's `create` function, which accepts a `context` object and returns an object with a property for each syntax node type you want to handle. In this case, we want to handle `"VariableDeclaration"` nodes.
You can choose any [ESTree node type](https://github.com/estree/estree) or [selector](selectors).

Inside the `"VariableDeclaration"` function, check if the node represents a `const` variable declaration, if its name is `foo`, and if it's not assigned to the string `"bar"`. You do this by evaluating the `node` passed to the `"VariableDeclaration"` function.

If the `const foo` declaration_is assigned to `"bar"` the rule does nothing. If `const foo` **is not** assigned to `"bar"`, then `context.report()` reports an error to ESLint. The error report include information about the error and how to fix it.

```javascript
// foo-bar.js
module.exports = {
    meta: {
        type: "fix",
        docs: {
            description: "Can only assign 'bar' to `const foo`.",
        },
         fixable: "code"
    },
    create(context) {
        return {
            // Performs action in the function on every variable declaration
            "VariableDeclaration": function(node) {
                // Check if a `const` variable declaration
                if(node.kind === "const") {
                    // Check if variable name is `foo`
                    if(node.declarations[0].id.name === "foo") {
                        // Check if the value of the variable is "bar"
                        if (node.declaration[0].init.value !== "bar") {
                            // Report error to ESLint. Error message uses
                            // a message placeholder to include the incorrect value
                            // in the error message.
                            // Also includes a `fix(fixer)` function that replaces
                            // any values assigned to `const foo` with "bar".
                            context.report({
                                node,
                                message: 'Value other than "bar" assigned to \`const foo\`. Unexpected value: {{ notBar }}',
                                data: {
                                    notBar: node.declaration.init.value
                                },
                                fix(fixer) {
                                    return fixer.replaceText(node.declaration.init, "bar");
                                }
                            });
                        }
                    }
                }
            }
        };
    }
};
```

## Step 5: Set up Testing

With the rule written, you can test it to make sure it's working as expected.

ESLint provides the built-in [RuleTester](../integrate/nodejs-api#ruletester) class to test rules. You do not need to use 3rd-party testing libraries to test ESLint rules.

Next create the file for the tests, `foo-bar.test.js`:

```shell
touch foo-bar.test.js
```

And add a test script to your `package.json` file to run the tests:

```javascript
// package.json
{
    // ...other configuration
    "scripts": {
        "test": "node foo-bar.test.js"
    },
    // ...other configuration
}
```

## Step 6: Write the Test

To write the test using `RuleTester`, import the class and your custom rule into the `foo-bar.test.js` file.

The `RuleTester#run()` method tests the rule against valid and invalid test cases. If the rule doesn't match any of the criteria in the tests, the method throws an error.

```javascript
// foo-bar.test.js
const {RuleTester} = require("eslint");
const fooBarRule = require("./foo-bar");

const ruleTester = new RuleTester({
  // Must use at least ecmaVersion 2015 because
  // that's when `const` variable introduced.
  parserOptions: { ecmaVersion: 2015 }
});

// Throws error if the tests in ruleTester.run() do not pass
ruleTester.run(
  "foo-bar", // rule name
  fooBarRule, // rule code
  { // checks
    // 'valid' checks cases that should pass
    valid: [{
      code: "const foo = 'bar';",
    }],
    // 'invalid' checks cases that should not pass
    invalid: [{
      code:"const foo = 'baz';",
      output: 'const foo = "bar";',
      errors: 1,
    }],
  }
);

console.log("All tests passed!");
```

## Step 7: Bundle the Custom Rule in a Plugin

Now that you've written the custom rule and validated that it works, you can include it in a plugin. Using a plugin, you can share the rule in an npm package to use in other projects.

Create the file for the plugin:

```shell
touch eslint-plugin-foo-bar.js
```

And now write the plugin code. Plugins are just exported JavaScript objects. To include a rule in a plugin, include it in the plugin's `rules` object, which contains key-value pairs of rule names and their source code.

To learn more about creating plugins, refer to [Create Plugins](plugins).

```javascript
// eslint-plugin-foo-bar.js

const fooBarRule = require("./foo-bar");
module.exports = { rules: { "foo-bar": fooBarRule } };
```

## Step 8: Publish the Plugin

To publish a plugin containing a rule to npm, you need to do a bit of set up in your project's `package.json` file.

To help publish the package easily, install the dependency [np](https://www.npmjs.com/package/np):

```shell
npm install --save-dev np
```

Add a script to run `np`:

```javascript
// package.json
// ...rest of package.json
  "scripts": {
    "test": "node foo-bar.test.js",
    "pub": "np --yarn false" // new publication script
  },
// ...rest of package.json
```

Next, configure the `package.json` to be ready for publishing the plugin. Add the following in the corresponding fields:

1. `"name"`: A unique name for the package. No other package on npm can have the same name.
1. `"main"`: The relative path to the plugin file. Following this example, the path is `"eslint-plugin-foo-bar.js"`.
1. `"description"`: A description of the package that's viewable on npm.
1. `"peerDependencies"`: Add `"eslint": ">=0.8.0"` as a peer dependency. Plugins were introduced in eslint@0.8.0, so any version greater than or equal to that is necessary to use the plugin. By declaring `eslint` as a peer dependency, it requires that users add the package to the project separately from the plugin.
1. `"keyworkds"`: Include the standard keywords `["eslint", "eslintplugin", "eslint-plugin"]` to make the package easy to find. You can add any other keywords that might be relevant to your plugin as well.

A complete annotated example of what a plugin's `package.json` file should look like:

```javascript
// package.json
{
  // name npm package.
  // Add your own package name. eslint-plugin-foo-bar is taken!
  "name": "eslint-plugin-foo-bar",
  "version": "1.2.0",
  "description": "ESLint plugin for foo-bar rule.",
  "main": "eslint-plugin-foo-bar.js", // plugin entry point
  "scripts": {
    "test": "node foo-bar.test.js",
    "pub": "np --yarn false"
  },
  // Add eslint>=0.8.0 as a peer dependency.
  // This was the ESLint version where plugins were introduced.
  "peerDependencies": {
    "eslint": ">=0.8.0"
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
    "eslint": "^8.36.0",
    "np": "^7.6.3"
  }
}
```

To publish the package, run `npm run pub` and follow the CLI prompts.

You should see the package live on npm!

## Step 9: Use the Published Custom Rule

To use the package now that it's published, run the following command in your project to download your published package:

```shell
npm install --save-dev <YOUR-PLUGIN-PACKAGE-NAME>
```

Then create an ESLint configuration for your project by running the following command:

```shell
npx init @eslint
```

Select the following options in the CLI prompts:

1. **How would you like to use ESLint?** To check syntax and find problems
1. **What type of modules does your project use?**  CommonJS (require/exports)
1. **Which framework does your project use?** None of these
1. **Does your project use TypeScript?** No
1. **Where does your code run?** Node
1. **What format do you want your config file to be in?** JavaScript

This generates a configuration file `.eslintrc.js` with some configuration. Add the following code to add the plugin and custom rule to the configuration:

```javascript
module.exports = {
    // ... other configuration

    // Using the eslint-plugin-foo-bar plugin downloaded from npm
    plugins: ["foo-bar"],
    rules: {
        "foo-bar/foo-bar": "error",
    },
}
```

Before you can test the rule, you must create a file to test the rule on.

Create a file `example.js`:

```shell
touch example.js
```

Add the following code to `example.js`:

```javascript
// example.js
/* eslint-disable no-unused-vars -- Disable other rule causing problem for this file */

function correctFooBar() {
  const foo = "bar";
}

function incorrectFoo(){
  const foo = "baz"; // Problem!
}
```

Now you're ready to test the custom rule.

Run ESLint on `example.js`:

```shell
npx eslint example.js
```

This produces the following output in the terminal:

```text
/<path-to-directory>/eslint-plugin-foo-bar/example.js
  14:3  error  Value other than "bar" assigned to `const foo`. Unexpected value: baz  foo-bar/foo-bar

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

In this tutorial, you've learned how to create a custom rule and plugin for ESLint. You've made a custom rule that requires all `const` variables named `foo` to be assigned the string `"bar"` and suggests replacing any other value assigned to `const foo` with `"bar"`. You've also added the rule to a plugin, and published the plugin on npm.

Through doing this, you've learned the following practices which you can apply to creating other custom rules and plugins:

1. Creating an ESLint custom rule
1. Testing the custom rule
1. Bundling the rule in a plugin
1. Publishing the plugin
1. Using the rule from the plugin

## View the Tutorial Code

You can view the annotated source code for the tutorial [here](https://github.com/eslint/eslint/tree/main/docs/_custom-rule-tutorial-code).
