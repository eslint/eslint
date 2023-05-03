---
title: Integrate with the Node.js API Tutorial
eleventyNavigation:
    key: integrate with the node.js api tutorial
    parent: integrate eslint
    title: Integrate with the Node.js API Tutorial
    order: 1
---

This guide walks you through integrating the `ESLint` class to lint files and retrieve results, which can be useful for creating integrations with other projects.

## Why Create a Custom Integration?

You might want to create an ESLint integration if you're creating developer tooling, such as the following:

- **Code editors and IDEs**: Integrating ESLint with code editors and IDEs can provide real-time feedback on code quality and automatically highlight potential issues as you type. Many editors already have ESLint plugins available, but you may need to create a custom integration if the existing plugins do not meet your specific requirements.

- **Continuous Integration (CI) pipelines**: Including ESLint in CI pipelines can help enforce code quality standards before merging changes into the main codebase. By integrating ESLint into your CI process, you can automatically run linting checks on pull requests and provide feedback to developers about potential issues.

- **Custom linter tools**: If you're building a custom linter tool that combines multiple linters or adds specific functionality, you may want to integrate ESLint into your tool to provide JavaScript linting capabilities.

- **Code review tools**: Integrating ESLint with code review tools can help automate the process of identifying potential issues in the codebase.

- **Learning platforms**: If you are developing a learning platform or coding tutorial, integrating ESLint can provide real-time feedback to users as they learn JavaScript, helping them improve their coding skills and learn best practices.

## What You'll Build

In this guide, you'll create a simple Node.js project that uses the `ESLint` class to lint files and retrieve results.

## Requirements

This tutorial assumes you are familiar with JavaScript and Node.js.

To follow this tutorial, you'll need to have the following:

- Node.js (v12.0.0 or higher)
- npm or Yarn package manager
- A text editor

## Step 1: Setup

First, create a new project directory:

```shell
mkdir eslint-integration
cd eslint-integration
```

Initialize the project with a `package.json` file:

```shell
npm init -y
```

Install the `eslint` package as a dependency:

```shell
npm install eslint
```

Create a new file called `example-eslint-integration.js` in the project root:

```shell
touch example-eslint-integration.js
```

## Step 2: Import and Configure the `ESLint` Instance

Import the `ESLint` class from the `eslint` package and create a new instance. 

You can customize the ESLint configuration by passing an options object to the `ESLint` constructor:

```javascript
// example-eslint-integration.js

const { ESLint } = require("eslint");

function createESLintInstance(eslintConfig){
    if (eslintConfig) {
        return new ESLint({ useEslintrc: false, overrideConfig: eslintConfig });
    } else {
        return new ESLint({ useEslintrc: false });
    }
}
```

## Step 3: Get Linting Results

To lint a file, use the `lintFiles` method of the `ESLint` instance:

The `filePaths` argument passed to `ESLint#lintFiles()` can be a string or an array of strings, representing the file path(s) you want to lint.

To format the linting results for better readability, use the `outputFixes` and `getErrorResults` methods:

```javascript
// example-eslint-integration.js

// ... previous step's code to instantiate the ESLint instance

/// Define a function that lints the specified files and returns the error results
async function getLintingResults(eslint, filePaths) {
  const results = await eslint.lintFiles(filePaths);

  // Apply automatic fixes and output fixed code
  await ESLint.outputFixes(results);

  // Get error results
  const errorResults = ESLint.getErrorResults(results);

  return errorResults;
}
```

## Step 4: Handle Results

Define a custom function to handle the linting results. This should be custom to your integration's needs.
For example, you could report the linting results to a user interface. In this example, we'll simply log the results to the console:

```javascript
// example-eslint-integration.js

// ... previous step's code to instantiate the ESLint instance
// and get linting results.

// Log results to console if there are any problems
function handleLintingResults(results) {
  if (results.length) {
    console.log("Linting errors found!");
    console.log(results);
  } else {
    console.log("No linting errors found.");
  }
  return results;
}


``` 

## Step 5: Put It All Together

Put the above functions together in a new function called `lintFiles`. This function will be the main entry point for your integration:

```javascript
// example-eslint-integration.js

// Put previous function all together
function lintFiles(filePaths) {

    // The ESLint configuration. Alternatively, you could load the configuration
    // from a .eslintrc file or just use the default config.
    const overrideConfig = {
        env: {
            es6: true,
            node: true,
        },
        parserOptions: {
            ecmaVersion: 2018,
        },
        extends: [
        "eslint:recommended",
        ],
        rules: {
            "no-console": "error",
            "no-unused-vars": "warn",
        },
    };

    const eslint = createESLintInstance(eslintConfig);
    const results = getLintingResults(eslint, filePaths);
    handleLintingResults(results);
}

// Export integration
module.exports = { lintFiles }
```

Here's the complete code example for `example-eslint-integration.js`:

```javascript
/** 
 * @fileoverview An example of how to integrate ESLint into your own tool
 * @author Ben Perlmutter
 */

const { ESLint } = require("eslint");

function createESLintInstance(eslintConfig){
    if (eslintConfig) {
        return new ESLint({ useEslintrc: false, overrideConfig: eslintConfig });
    } else {
        return new ESLint({ useEslintrc: false });
    }
}

// Define a function that lints the specified files and returns the error results
async function getLintingResults(eslint, filePaths) {
  const results = await eslint.lintFiles(filePaths);

  // Apply automatic fixes and output fixed code
  await ESLint.outputFixes(results);

  // Get error results
  const errorResults = ESLint.getErrorResults(results);

  return errorResults;
}

// Log results to console if there are any problems
function handleLintingResults(results) {
  if (results.length) {
    console.log("Linting errors found!");
    console.log(results);
  } else {
    console.log("No linting errors found.");
  }
  return results;
}

// Put previous function all together
async function lintFiles(filePaths) {

    // The ESLint configuration. Alternatively, you could load the configuration
    // from a .eslintrc file or just use the default config.
    const overrideConfig = {
        env: {
            es6: true,
            node: true,
        },
        parserOptions: {
            ecmaVersion: 2018,
        },
        rules: {
            "no-console": "error",
            "no-unused-vars": "warn",
        },
    };

    const eslint = createESLintInstance(overrideConfig);
    const results = await getLintingResults(eslint, filePaths);
    return handleLintingResults(results);
}

module.exports = { lintFiles }
```

## Conclusion

In this tutorial, we have covered the essentials of using the `ESLint` class to lint files and retrieve results in your projects. This knowledge can be applied to create custom integrations, such as code editor plugins, to provide real-time feedback on code quality.

## View the Tutorial Code

You can view the annotated source code for the tutorial [here](https://github.com/eslint/eslint/tree/main/docs/_integration-tutorial-code).