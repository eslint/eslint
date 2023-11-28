---
title: Custom Formatters
eleventyNavigation:
    key: custom formatters
    parent: extend eslint
    title: Custom Formatters
    order: 4

---

Custom formatters let you display linting results in a format that best fits your needs, whether that's in a specific file format, a certain display style, or a format optimized for a particular tool.

ESLint also has [built-in formatters](../use/formatters/) that you can use.

You can include custom formatters in your project directly or create an npm package to distribute them separately.

## Creating a Custom Formatter

Each formatter is a function that receives a `results` object and a `context` as arguments and returns a string. For example, the following is how the built-in [JSON formatter](../use/formatters/#json) is implemented:

```js
//my-awesome-formatter.js
module.exports = function(results, context) {
    return JSON.stringify(results, null, 2);
};
```

A formatter can also be an async function (from ESLint v8.4.0), the following shows a simple example:

```js
//my-awesome-formatter.js
module.exports = async function(results) {
    const formatted = await asyncTask();
    return formatted;
};
```

To run ESLint with this formatter, you can use the [`-f` (or `--format`)](../use/command-line-interface#-f---format) command line flag. You must begin the path to a locally defined custom formatter with a period (`.`), such as `./my-awesome-formatter.js` or `../formatters/my-awesome-formatter.js`.

```bash
eslint -f ./my-awesome-formatter.js src/
```

The remainder of this section contains reference information on how to work with custom formatter functions.

### The `results` Argument

The `results` object passed into a formatter is an array of [`result`](#the-result-object) objects containing the linting results for individual files. Here's an example output:

```js
[
    {
        filePath: "/path/to/a/file.js",
        messages: [
            {
                ruleId: "curly",
                severity: 2,
                message: "Expected { after 'if' condition.",
                line: 2,
                column: 1,
                nodeType: "IfStatement"
            },
            {
                ruleId: "no-process-exit",
                severity: 2,
                message: "Don't use process.exit(); throw an error instead.",
                line: 3,
                column: 1,
                nodeType: "CallExpression"
            }
        ],
        errorCount: 2,
        warningCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        source:
            "var err = doStuff();\nif (err) console.log('failed tests: ' + err);\nprocess.exit(1);\n"
    },
    {
        filePath: "/path/to/Gruntfile.js",
        messages: [],
        errorCount: 0,
        warningCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0
    }
]
```

#### The `result` Object

<!-- This section is copied from the "Node.js API" page. Changes to this section should
also be manually applied to that page. -->

Each object in the `results` array is a `result` object. Each `result` object contains the path of the file that was linted and information about linting issues that were encountered. Here are the properties available on each `result` object:

* **filePath**: The absolute path to the file that was linted.
* **messages**: An array of [`message`](#the-message-object) objects. See below for more info about messages.
* **errorCount**: The number of errors for the given file.
* **warningCount**: The number of warnings for the given file.
* **source**: The source code for the given file. This property is omitted if this file has no errors/warnings or if the `output` property is present.
* **output**: The source code for the given file with as many fixes applied as possible. This property is omitted if no fix is available.

##### The `message` Object

Each `message` object contains information about the ESLint rule that was triggered by some source code. The properties available on each `message` object are:

* **ruleId**: the ID of the rule that produced the error or warning.
* **severity**: the severity of the failure, `1` for warnings and `2` for errors.
* **message**: the human readable description of the error.
* **line**: the line where the issue is located.
* **column**: the column where the issue is located.
* **nodeType**: the type of the node in the [AST](https://github.com/estree/estree/blob/master/es5.md#node-objects)

### The `context` Argument

The formatter function receives a `context` object as its second argument. The object has the following properties:

* `cwd`: The current working directory. This value comes from the `cwd` constructor option of the [ESLint](../integrate/nodejs-api#-new-eslintoptions) class.
* `maxWarningsExceeded` (optional): If `--max-warnings` was set and the number of warnings exceeded the limit, this property's value is an object containing two properties:
    * `maxWarnings`: the value of the `--max-warnings` option
    * `foundWarnings`: the number of lint warnings
* `rulesMeta`: The `meta` property values of rules. See the [Custom Rules](custom-rules) page for more information about rules.

For example, here's what the object would look like if the rule `no-extra-semi` had been run:

```js
{
    cwd: "/path/to/cwd",
    maxWarningsExceeded: {
        maxWarnings: 5,
        foundWarnings: 6
    },
    rulesMeta: {
        "no-extra-semi": {
            type: "suggestion",
            docs: {
                description: "disallow unnecessary semicolons",
                recommended: true,
                url: "https://eslint.org/docs/rules/no-extra-semi"
            },
            fixable: "code",
            schema: [],
            messages: {
                unexpected: "Unnecessary semicolon."
            }
        }
    },
}
```

**Note:** if a linting is executed by the deprecated `CLIEngine` class, the `context` argument may be a different value because it is up to the API users. Please check whether the `context` argument is an expected value or not if you want to support legacy environments.

### Passing Arguments to Formatters

While formatter functions do not receive arguments in addition to the results object and the context, it is possible to pass additional data into custom formatters using the methods described below.

#### Using Environment Variables

Custom formatters have access to environment variables and so can change their behavior based on environment variable data.

Here's an example that uses a `FORMATTER_SKIP_WARNINGS` environment variable to determine whether to show warnings in the results:

```js
module.exports = function(results) {
    var skipWarnings = process.env.FORMATTER_SKIP_WARNINGS === "true";

    var results = results || [];
    var summary = results.reduce(
        function(seq, current) {
            current.messages.forEach(function(msg) {
                var logMessage = {
                    filePath: current.filePath,
                    ruleId: msg.ruleId,
                    message: msg.message,
                    line: msg.line,
                    column: msg.column
                };

                if (msg.severity === 1) {
                    logMessage.type = "warning";
                    seq.warnings.push(logMessage);
                }
                if (msg.severity === 2) {
                    logMessage.type = "error";
                    seq.errors.push(logMessage);
                }
            });
            return seq;
        },
        {
            errors: [],
            warnings: []
        }
    );

    if (summary.errors.length > 0 || summary.warnings.length > 0) {
        var warnings = !skipWarnings ? summary.warnings : []; // skip the warnings in that case

        var lines = summary.errors
            .concat(warnings)
            .map(function(msg) {
                return (
                    "\n" +
                    msg.type +
                    " " +
                    msg.ruleId +
                    "\n  " +
                    msg.filePath +
                    ":" +
                    msg.line +
                    ":" +
                    msg.column
                );
            })
            .join("\n");

        return lines + "\n";
    }
};
```

You would run ESLint with this custom formatter and an environment variable set like this:

```bash
FORMATTER_SKIP_WARNINGS=true eslint -f ./my-awesome-formatter.js src/
```

The output would be:

```bash
error space-infix-ops
  src/configs/bundler.js:6:8

error semi
  src/configs/bundler.js:6:10
```

#### Complex Argument Passing

If you find the custom formatter pattern doesn't provide enough options for the way you'd like to format ESLint results, the best option is to use ESLint's built-in [JSON formatter](../use/formatters/#json) and pipe the output to a second program. For example:

```bash
eslint -f json src/ | your-program-that-reads-JSON --option
```

In this example, the `your-program-that-reads-json` program can accept the raw JSON of ESLint results and process it before outputting its own format of the results. You can pass as many command line arguments to that program as are necessary to customize the output.

### Formatting for Terminals

Modern terminals like [iTerm2](https://www.iterm2.com/) or [Guake](http://guake-project.org/) expect a specific results format to automatically open filenames when they are clicked. Most terminals support this format for that purpose:

```bash
file:line:column
```

## Packaging a Custom Formatter

Custom formatters can be distributed through npm packages. To do so, create an npm package with a name in the format `eslint-formatter-*`, where `*` is the name of your formatter (such as `eslint-formatter-awesome`). Projects should then install the package and use the custom formatter with the [`-f` (or `--format`)](../use/command-line-interface#-f---format) flag like this:

```bash
eslint -f awesome src/
```

Because ESLint knows to look for packages beginning with `eslint-formatter-` when the specified formatter doesn't begin with a period, you do not need to type `eslint-formatter-` when using a packaged custom formatter.

Tips for the `package.json` of a custom formatter:

* The [`main`](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#main) entry point must be the JavaScript file implementing your custom formatter.
* Add these [`keywords`](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#keywords) to help users find your formatter:
    * `"eslint"`
    * `"eslint-formatter"`
    * `"eslintformatter"`

See all [custom formatters on npm](https://www.npmjs.com/search?q=eslint-formatter).

## Examples

### Summary Formatter

A formatter that only reports on the total count of errors and warnings will look like this:

```javascript
module.exports = function(results, context) {
    // accumulate the errors and warnings
    var summary = results.reduce(
        function(seq, current) {
            seq.errors += current.errorCount;
            seq.warnings += current.warningCount;
            return seq;
        },
        { errors: 0, warnings: 0 }
    );

    if (summary.errors > 0 || summary.warnings > 0) {
        return (
            "Errors: " +
            summary.errors +
            ", Warnings: " +
            summary.warnings +
            "\n"
        );
    }

    return "";
};
```

Run `eslint` with the above summary formatter:

```bash
eslint -f ./my-awesome-formatter.js src/
```

Will produce the following output:

```bash
Errors: 2, Warnings: 4
```

### Detailed Formatter

A more complex report could look like this:

```javascript
module.exports = function(results, context) {
    var results = results || [];

    var summary = results.reduce(
        function(seq, current) {
            current.messages.forEach(function(msg) {
                var logMessage = {
                    filePath: current.filePath,
                    ruleId: msg.ruleId,
                    ruleUrl: context.rulesMeta[msg.ruleId].docs.url,
                    message: msg.message,
                    line: msg.line,
                    column: msg.column
                };

                if (msg.severity === 1) {
                    logMessage.type = "warning";
                    seq.warnings.push(logMessage);
                }
                if (msg.severity === 2) {
                    logMessage.type = "error";
                    seq.errors.push(logMessage);
                }
            });
            return seq;
        },
        {
            errors: [],
            warnings: []
        }
    );

    if (summary.errors.length > 0 || summary.warnings.length > 0) {
        var lines = summary.errors
            .concat(summary.warnings)
            .map(function(msg) {
                return (
                    "\n" +
                    msg.type +
                    " " +
                    msg.ruleId + (msg.ruleUrl ? " (" + msg.ruleUrl + ")" : "") +
                    "\n  " +
                    msg.filePath +
                    ":" +
                    msg.line +
                    ":" +
                    msg.column
                );
            })
            .join("\n");

        return lines + "\n";
    }
};
```

When you run ESLint with this custom formatter:

```bash
eslint -f ./my-awesome-formatter.js src/
```

The output is:

```bash
error space-infix-ops (https://eslint.org/docs/rules/space-infix-ops)
  src/configs/bundler.js:6:8
error semi (https://eslint.org/docs/rules/semi)
  src/configs/bundler.js:6:10
warning no-unused-vars (https://eslint.org/docs/rules/no-unused-vars)
  src/configs/bundler.js:5:6
warning no-unused-vars (https://eslint.org/docs/rules/no-unused-vars)
  src/configs/bundler.js:6:6
warning no-shadow (https://eslint.org/docs/rules/no-shadow)
  src/configs/bundler.js:65:32
warning no-unused-vars (https://eslint.org/docs/rules/no-unused-vars)
  src/configs/clean.js:3:6
```
