---
title: Integrate with the Node.js API Tutorial
eleventyNavigation:
    key: integrate with the node.js api tutorial
    parent: integrate eslint
    title: Integrate with the Node.js API Tutorial
    order: 1
---

This guide walks you through integrating the `ESLint` class to lint files and retrieve results, which can be useful for creating integrations with other projects.

## Why Create an Integration?

You might want to create an ESLint integration if you're creating developer tooling, such as the following:

* **Code editors and IDEs**: Integrating ESLint with code editors and IDEs can provide real-time feedback on code quality and automatically highlight potential issues as you type. Many editors already have ESLint plugins available, but you may need to create a custom integration if the existing plugins do not meet your specific requirements.

* **Custom linter tools**: If you're building a custom linter tool that combines multiple linters or adds specific functionality, you may want to integrate ESLint into your tool to provide JavaScript linting capabilities.

* **Code review tools**: Integrating ESLint with code review tools can help automate the process of identifying potential issues in the codebase.

* **Learning platforms**: If you are developing a learning platform or coding tutorial, integrating ESLint can provide real-time feedback to users as they learn JavaScript, helping them improve their coding skills and learn best practices.

* **Developer tool integration**: If you're creating or extending a developer tool, such as a bundler or testing framework, you may want to integrate ESLint to provide linting capabilities. You can integrate ESLint directly into the tool or as a plugin.

## What You'll Build

In this guide, you'll create a simple Node.js project that uses the `ESLint` class to lint files and retrieve results.

## Requirements

This tutorial assumes you are familiar with JavaScript and Node.js.

To follow this tutorial, you'll need to have the following:

* Node.js (v12.22.0 or higher)
* npm
* A text editor

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

Install the `eslint` package as a dependency (**not** as a dev dependency):

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

// Create an instance of ESLint with the configuration passed to the function
function createESLintInstance(overrideConfig){
  return new ESLint({ useEslintrc: false, overrideConfig: overrideConfig, fix: true });
}
```

## Step 3: Lint and Fix Files

To lint a file, use the `lintFiles` method of the `ESLint` instance. The `filePaths` argument passed to `ESLint#lintFiles()` can be a string or an array of strings, representing the file path(s) you want to lint. The file paths can be globs or filenames.

The static method `ESLint.outputFixes()` takes the linting results from the call to `ESLint#lintFiles()`, and then writes the fixed code back to the source files.

```javascript
// example-eslint-integration.js

// ... previous step's code to instantiate the ESLint instance

// Lint the specified files and return the results
async function lintAndFix(eslint, filePaths) {
  const results = await eslint.lintFiles(filePaths);

  // Apply automatic fixes and output fixed code
  await ESLint.outputFixes(results);

  return results;
}
```

## Step 4: Output Results

Define a function to output the linting results to the console. This should be specific to your integration's needs. For example, you could report the linting results to a user interface.

In this example, we'll simply log the results to the console:

```javascript
// example-eslint-integration.js

// ... previous step's code to instantiate the ESLint instance
// and get linting results.

// Log results to console if there are any problems
function outputLintingResults(results) {
  // Identify the number of problems found
  const problems = results.reduce((acc, result) => acc + result.errorCount + result.warningCount, 0);

  if (problems > 0) {
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

// Put previous functions all together
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
    const results = await lintAndFix(eslint, filePaths);
    return outputLintingResults(results);
}

// Export integration
module.exports = { lintFiles }
```

Here's the complete code example for `example-eslint-integration.js`:

```javascript
const { ESLint } = require("eslint");

// Create an instance of ESLint with the configuration passed to the function
function createESLintInstance(overrideConfig){
  return new ESLint({ useEslintrc: false, overrideConfig: overrideConfig, fix: true });
}

// Lint the specified files and return the results
async function lintAndFix(eslint, filePaths) {
  const results = await eslint.lintFiles(filePaths);

  // Apply automatic fixes and output fixed code
  await ESLint.outputFixes(results);

  return results;
}

// Log results to console if there are any problems
function outputLintingResults(results) {
  // Identify the number of problems found
  const problems = results.reduce((acc, result) => acc + result.errorCount + result.warningCount, 0);

  if (problems > 0) {
    console.log("Linting errors found!");
    console.log(results);
  } else {
    console.log("No linting errors found.");
  }
  return results;
}

// Put previous functions all together
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
    const results = await lintAndFix(eslint, filePaths);
    return outputLintingResults(results);
}

// Export integration
module.exports = { lintFiles }
```

## Conclusion

In this tutorial, we have covered the essentials of using the `ESLint` class to lint files and retrieve results in your projects. This knowledge can be applied to create custom integrations, such as code editor plugins, to provide real-time feedback on code quality.

## View the Tutorial Code

You can view the annotated source code for the tutorial [here](https://github.com/eslint/eslint/tree/main/docs/_examples/integration-tutorial-code).
