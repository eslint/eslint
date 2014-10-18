# Node.js API

While ESLint is designed to be run on the command line, it's possible to use ESLint programmatically through the Node.js API. The purpose of the Node.js API is to allow plugin and tool authors to use the ESLint functionality directly, without going through the command line interface.

**Note:** Use undocumented parts of the API at your own risk. Only those parts that are specifically mentioned in this document are approved for use and will remain stable and reliable. Anything left undocumented is unstable and may change or be removed at any point.

## linter

The `linter` object does the actual evaluation of the JavaScript code. It doesn't do any filesystem operations, it simply parses and reports on the code. You can retrieve `linter` like this:

```js
var linter = require("eslint").linter;
```

The most important method on `linter` is `verify()`, which initiates linting of the given text. This method accepts four arguments:

* `code` - the source code to lint (a string).
* `config` - a configuration object.
* `filename` - (optional) the filename to associate with the source code.
* `saveState` - (optional) set to true to maintain the internal state of `linter` after linting (mostly used for testing purposes).

You can call `verify()` like this:

```js
var linter = require("eslint").linter;

var messages = linter.verify("var foo;", {
    rules: {
        semi: 2
    }
}, "foo.js");
```

The `verify()` method returns an array of objects containing information about the linting warnings and errors. Here's an example:

```js
{
    fatal: false,
    severity: 2,
    ruleId: "semi",
    severity: 2,
    line: 1,
    column: 23,
    message: "Expected a semicolon."
}
```

The information available for each linting message is:

* `column` - the column on which the error occurred.
* `fatal` - usually omitted, but will be set to true if there's a parsing error (not related to a rule).
* `line` - the line on which the error occurred.
* `message` - the message that should be output.
* `ruleId` - the ID of the rule that triggered the messages (or null if `fatal` is true).
* `severity` - either 1 or 2, depending on your configuration.


## CLIEngine

The primary Node.js API is `CLIEngine`, which is the underlying utility that runs the ESLint command line interface. This object will read the filesystem for configuration and file information but will not output any results. Instead, it allows you direct access to the important information so you can deal with the output yourself.

You can get a reference to the `CLIEngine` by doing the following:

```js
var CLIEngine = require("eslint").CLIEngine;
```

The `CLIEngine` is a constructor, and you can create a new instance by passing in the options you want to use. The available options are:

* `configFile` - The configuration file to use (default: null). Corresponds to `-c`.
* `envs` - An array of environments to load (default: empty array). Corresponds to `--env`.
* `globals` - An array of global variables to declare (default: empty array). Corresponds to `--global`.
* `ignore` - False disables use of `.eslintignore` (default: true). Corresponds to `--no-ignore`.
* `ignorePath` - The ignore file to use instead of `.eslintignore` (default: null). Corresponds to `--ignore-path`.
* `reset` - True disables all default rules and environments (default: false). Corresponds to `--reset`.
* `rulePaths` - An array of directories to load custom rules from (default: empty array). Corresponds to `--rulesdir`.
* `rules` - An object of rules to use (default: null). Corresponds to `--rule`.
* `useEslintrc` - Set to false to disable use of `.eslintrc` files (default: true). Corresponds to `--no-eslintrc`.

For example:

```js
var CLIEngine = require("eslint").CLIEngine;

var cli = new CLIEngine({
    envs: ["browser", "mocha"],
    useEslintrc: false,
    rules: {
        semi: 2
    }
});
```

In this code, a new `CLIEngine` instance is created that sets two environments, `"browser"` and `"mocha"`, disables loading of `.eslintrc` files, and enables the `semi` rule as an error. You can then call methods on `cli` and these options will be used to perform the correct action.

### executeOnFiles()

If you want to lint one or more files, use the `executeOnFiles()` method. This method accepts a single argument, which is an array of files and/or directories to traverse for files. You can pass the same values as you would using the ESLint command line interface, such as `"."` to search all JavaScript files in the current directory. Here's an example:

```js
var CLIEngine = require("eslint").CLIEngine;

var cli = new CLIEngine({
    envs: ["browser", "mocha"],
    useEslintrc: false,
    rules: {
        semi: 2
    }
});

// lint myfile.js and all files in lib/
var report = cli.executeOnFiles(["myfile.js", "lib/"]);
```

The return value is an object containing the results of the linting operation. Here's an example of a report object:

```js
{
    results: [
        {
            filePath: "./myfile.js",
            messages: [
                {
                    fatal: false,
                    severity: 2,
                    ruleId: "semi",
                    severity: 2,
                    line: 1,
                    column: 23,
                    message: "Expected a semicolon."
                }
            ]
        }
    ]
}
```

The top-level report object has a `results` array containing all linting results for files that had warnings or errors (any files that did not product a warning or error are omitted). Each file result includes the `filePath` and a `messages` array. The `messages` array contains the result of calling `linter.verify()` on the given file.

Once you get a report object, it's up to you to determine how to output the results.

### getConfigForFile()

If you want to retrieve a configuration object for a given file, use the `getConfigForFile()` method. This method accepts one argument, a file path, and returns an object represented the calculated configuration of the file. Here's an example:

```js
var CLIEngine = require("eslint").CLIEngine;

var cli = new CLIEngine({
    envs: ["browser", "mocha"],
    useEslintrc: false,
    rules: {
        semi: 2
    }
});

var config = cli.getConfigForFile("myfile.js");
```

Once you have the configuration information, you can pass it into the `linter` object:

```js
var CLIEngine = require("eslint").CLIEngine,
    linter = require("eslint").linter;

var cli = new CLIEngine({
    envs: ["browser", "mocha"],
    useEslintrc: false,
    rules: {
        semi: 2
    }
});

var config = cli.getConfigForFile("myfile.js");

var messages = linter.verify('var foo;', config);
```

### executeOnText()

If you already have some text to lint, then you can use the `executeOnText()` method to lint that text. The linter will assume that the text is a file in the current working directory, and so will still obey any `.eslintrc` and `.eslintignore` files that may be present. Here's an example:

```js
var CLIEngine = require("eslint").CLIEngine;

var cli = new CLIEngine({
    envs: ["browser", "mocha"],
    useEslintrc: false,
    rules: {
        semi: 2
    }
});

// lint myfile.js and all files in lib/
var report = cli.executeOnText("var foo = 'bar';");
```

The `report` returned from `executeOnText()` is in the same format as from `executeOnFiles()`, but there is only ever one result in `report.results`.

## Deprecated APIs

* `cli` - the `cli` object has been deprecated in favor of `CLIEngine`. It will be removed at some point in the future.
