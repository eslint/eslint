---
title: Custom Rule Tutorial
eleventyNavigation:
    key: custom rule tutorial
    parent: custom rules
    title: Custom Rule Tutorial
    order: 1
---
This tutorial covers how to create a custom rule for ESLint. You can create custom rules to validates if your code meets a certain expectation, and determine what to do if it does not meet that expectation.

## Why Create a Custom Rule?

Create a custom rule if the ESLint [built-in rules](../rules/) and community-published custom rules do not meet your needs.

Before creating a custom rule, it's worth investigating around the web if someone has published a plugin with a custom rule that solves your use case. Very often the rule will already exist.

## Prerequisites

Before you begin, make sure you have the following installed in your development environment:

* [Node.js](https://nodejs.org/en/download/)
* [npm](https://www.npmjs.com/)

This tutorial also assumes that you have a basic understanding of ESLint and ESLint rules.

## The Custom Rule You Make

The custom rule that you make in this tutorial requires that all `const` variables named `foo` are assigned the string `"bar"`. The rule is defined in the file `foo-bar.js`. It also suggests replacing any other value assigned to `const foo` with `"bar"`

For example, say you had the following `foo.js` file:

```javascript
// foo.js

const foo = "baz";
```

Then you run the custom rule on the file:

```shell
npx eslint TODO: whatever exact syntax is here
```

This produces the following output:

```txt
TODO: add whatever this is once the rule is made.
```

## Step 1: Set up Project

First create a new project for your custom rule. Create new a directory,  initiate a new npm project in it, and create a new file for the custom rule:

```shell
mkdir foo-bar-rule
cd foo-bar-rule
npm init -y
touch foo-bar.js
```

## Step 2: Stub Out Rule File

In the `foo-bar.js` file, add some scaffolding for the `foo-bar` custom rule. Also add a `meta` object with some basic information about the rule.

All ESLint rules are objects that follow this basic form.

```js
// foo-bar.js

module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "Can only assign 'bar' to `const foo`.",
        },
         fixable: "code"
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

```js
// foo-bar.js

module.exports = {
    meta: {
        // Specify that provides a suggested change in output
        type: "suggestion",
        // Description of rule. Useful for tools that generate
        // documentation from the rule source.
        docs: {
            description: "Can only assign 'bar' to `const foo`.",
        },
        fixable: "code"
    },
    create(context) {
        return {
           // TODO: add callback function(s)
        };
    }
};
```

To learn more about rule metadata, refer to [Rule Structure](custom-rules#rule-structure).

## Step 4: Add Rule Callback Functions

TODO: describe

```js
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
                        // Check if value of variable is "bar"
                        if (node.declaration.init.value !== "bar") {
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

With the rule written, you can test it to make sure it's working as expected. First you need to set up the testing environment in your project.

This tutorial will use the popular JavaScript testing library [Jest](https://jestjs.io/) and the [ESLint Node.js API](../integrate/nodejs-api) to test out the `foo-bar` rule's functionality.

Install the `jest` and `eslint` package as development dependencies to use them in your tests:

```shell
npm install --save-dev jest eslint
```

Next create the file for the tests, `foo-bar.test.js`:

```shell
touch foo-bar.test.js
```

And add a test script to your `package.json` file to run the tests:

```json
// package.json
{
    // ...other configuration
    "scripts": {
        "test": "jest"
    },
    // ...other configuration
}
```

## Step 5: Write the Test

## Step #: Bundle the Custom Rule in a Plugin

## Step #: Publish the Plugin

## Step #: Use the Published Custom Rule
