# Node.js API

While ESLint is designed to be run on the command line, it's possible to use ESLint programmatically through the Node.js API. The purpose of the Node.js API is to allow plugin and tool authors to use the ESLint functionality directly, without going through the command line interface.

**Note:** Use undocumented parts of the API at your own risk. Only those parts that are specifically mentioned in this document are approved for use and will remain stable and reliable. Anything left undocumented is unstable and may change or be removed at any point.

## SourceCode

The `SourceCode` type represents the parsed source code that ESLint executes on. It's used internally in ESLint and is also available so that already-parsed code can be used. You can create a new instance of `SourceCode` by passing in the text string representing the code and an abstract syntax tree (AST) in [ESTree](https://github.com/estree/estree) format (including location information, range information, comments, and tokens):

```js
var SourceCode = require("eslint").SourceCode;

var code = new SourceCode("var foo = bar;", ast);
```

The `SourceCode` constructor throws an error if the AST is missing any of the required information.

## linter

The `linter` object does the actual evaluation of the JavaScript code. It doesn't do any filesystem operations, it simply parses and reports on the code. You can retrieve `linter` like this:

```js
var linter = require("eslint").linter;
```

The most important method on `linter` is `verify()`, which initiates linting of the given text. This method accepts four arguments:

* `code` - the source code to lint (a string or instance of `SourceCode`).
* `config` - a configuration object.
* `options` - (optional) Additional options for this run.
    * `filename` - (optional) the filename to associate with the source code.
    * `saveState` - (optional) set to true to maintain the internal state of `linter` after linting (mostly used for testing purposes).
    * `allowInlineConfig` - (optional) set to `false` to disable inline comments from changing eslint rules.

You can call `verify()` like this:

```js
var linter = require("eslint").linter;

var messages = linter.verify("var foo;", {
    rules: {
        semi: 2
    }
}, { filename: "foo.js" });

// or using SourceCode

var linter = require("eslint").linter,
    SourceCode = require("eslint").SourceCode;

var code = new SourceCode("var foo = bar;", ast);

var messages = linter.verify(code, {
    rules: {
        semi: 2
    }
}, { filename: "foo.js" });
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
    message: "Expected a semicolon.",
    fix: {
        range: [1, 15],
        text: ";"
    }
}
```

The information available for each linting message is:

* `column` - the column on which the error occurred.
* `fatal` - usually omitted, but will be set to true if there's a parsing error (not related to a rule).
* `line` - the line on which the error occurred.
* `message` - the message that should be output.
* `nodeType` - the node or token type that was reported with the problem.
* `ruleId` - the ID of the rule that triggered the messages (or null if `fatal` is true).
* `severity` - either 1 or 2, depending on your configuration.
* `source` - the line of code where the problem is (or empty string if it can't be found).
* `fix` - an object describing the fix for the problem (this property is omitted if no fix is available).

You can also get an instance of the `SourceCode` object used inside of `linter` by using the `getSourceCode()` method:

```js
var linter = require("eslint").linter;

var messages = linter.verify("var foo = bar;", {
    rules: {
        semi: 2
    }
}, { filename: "foo.js" });

var code = linter.getSourceCode();

console.log(code.text);     // "var foo = bar;"
```

In this way, you can retrieve the text and AST used for the last run of `linter.verify()`.

## CLIEngine

The primary Node.js API is `CLIEngine`, which is the underlying utility that runs the ESLint command line interface. This object will read the filesystem for configuration and file information but will not output any results. Instead, it allows you direct access to the important information so you can deal with the output yourself.

You can get a reference to the `CLIEngine` by doing the following:

```js
var CLIEngine = require("eslint").CLIEngine;
```

The `CLIEngine` is a constructor, and you can create a new instance by passing in the options you want to use. The available options are:

* `configFile` - The configuration file to use (default: null). Corresponds to `-c`.
* `envs` - An array of environments to load (default: empty array). Corresponds to `--env`.
* `extensions` - An array of filename extensions that should be checked for code. The default is an array containing just `".js"`. Corresponds to `--ext`.
* `globals` - An array of global variables to declare (default: empty array). Corresponds to `--global`.
* `fix` - True indicates that fixes should be applied to the text when possible.
* `ignore` - False disables use of `.eslintignore` (default: true). Corresponds to `--no-ignore`.
* `ignorePath` - The ignore file to use instead of `.eslintignore` (default: null). Corresponds to `--ignore-path`.
* `ignorePattern` - Glob patterns for paths to ignore. String or array of strings.
* `baseConfig` - Set to false to disable use of base config. Could be set to an object to override default base config as well.
* `rulePaths` - An array of directories to load custom rules from (default: empty array). Corresponds to `--rulesdir`.
* `rules` - An object of rules to use (default: null). Corresponds to `--rule`.
* `useEslintrc` - Set to false to disable use of `.eslintrc` files (default: true). Corresponds to `--no-eslintrc`.
* `parser` - Specify the parser to be used (default: `espree`). Corresponds to `--parser`.
* `cache` - Operate only on changed files (default: `false`). Corresponds to `--cache`.
* `cacheFile` - Name of the file where the cache will be stored (default: `.eslintcache`). Corresponds to `--cache-file`. Deprecated: use `cacheLocation` instead.
* `cacheLocation` - Name of the file or directory where the cache will be stored (default: `.eslintcache`). Correspond to `--cache-location`

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

In this code, a new `CLIEngine` instance is created that sets two environments, `"browser"` and `"mocha"`, disables loading of `.eslintrc` and `package.json` files, and enables the `semi` rule as an error. You can then call methods on `cli` and these options will be used to perform the correct action.

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
            output: "foo;",
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
            ],
            errorCount: 1,
            warningCount: 0
        }
    ],
    errorCount: 1,
    warningCount: 0
}
```

The top-level report object has a `results` array containing all linting results for files that had warnings or errors (any files that did not produce a warning or error are omitted). Each file result includes the `filePath`, a `messages` array, `errorCount`, `warningCount`, and optionally `output`. The `messages` array contains the result of calling `linter.verify()` on the given file. The `errorCount` and `warningCount` give the exact number of errors and warnings respectively on the given file. The `output` property gives the source code for the file with as many fixes applied as possible, so you can use that to rewrite the files if necessary. The top-level report object also has `errorCount` and `warningCount` which give the exact number of errors and warnings respectively on all the files.

Once you get a report object, it's up to you to determine how to output the results.

### resolveFileGlobPatterns()

You can pass filesystem-style or glob patterns to ESLint and have it function properly. In order to achieve this, ESLint must resolve non-glob patterns into glob patterns before determining which files to execute on. The `resolveFileGlobPatterns()` methods uses the current settings from `CLIEngine` to resolve non-glob patterns into glob patterns. Pass an array of patterns that might be passed to the ESLint CLI and it will return an array of glob patterns that mean the same thing. Here's an example:

```js
var CLIEngine = require("eslint").CLIEngine;

var cli = new CLIEngine({
});

// pass an array of patterns
var globPatterns = cli.resolveFileGlobPatterns(["."]);
console.log(globPatterns[i]);       // ["**/*.js"]
```

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

// lint the supplied text and optionally set
// a filename that is displayed in the report
var report = cli.executeOnText("var foo = 'bar';", "foo.js");
```

The `report` returned from `executeOnText()` is in the same format as from `executeOnFiles()`, but there is only ever one result in `report.results`.

### addPlugin()

Loads a plugin from configuration object with specified name. Name can include plugin prefix ("eslint-plugin-")

```js
var CLIEngine = require("eslint").CLIEngine;
var cli = new CLIEngine({
    ignore: true
});
cli.addPlugin("eslint-plugin-processor", {
    processors: {
        ".txt": {
            preprocess: function(text) {
                return [text];
            },
            postprocess: function(messages) {
                return messages[0];
            }
        }
    }
});
```

### isPathIgnored()

Checks if a given path is ignored by ESLint.

```js
var CLIEngine = require("eslint").CLIEngine;

var cli = new CLIEngine({
    ignore: true,
    ignorePath: ".customIgnoreFile"
});

var isIgnored = cli.isPathIgnored("foo/bar.js");
```

### getFormatter()

Retrieves a formatter, which you can then use to format a report object. The argument is either the name of a built-in formatter:

* "[stylish](./user-guide/formatters#stylish)" (the default)
* "[checkstyle](./user-guide/formatters#checkstyle)"
* "[compact](./user-guide/formatters#compact)"
* "[html](./user-guide/formatters#html)"
* "[jslint-xml](./user-guide/formatters#jslint-xml)"
* "[json](./user-guide/formatters#json)"
* "[junit](./user-guide/formatters#junit)"
* "[tap](./user-guide/formatters#tap)"
* "[unix](./user-guide/formatters#unix)"

or the full path to a JavaScript file containing a custom formatter. You can also omit the argument to retrieve the default formatter.

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

// get the default formatter
var formatter = cli.getFormatter();

// Also could do...
// var formatter = cli.getFormatter("compact");
// var formatter = cli.getFormatter("./my/formatter.js");

// output to console
console.log(formatter(report.results));
```

**Note:** Also available as a static function on `CLIEngine`.

```js
// get the default formatter by calling the static function
var formatter = CLIEngine.getFormatter();
```

**Important:** You must pass in the `results` property of the report. Passing in `report` directly will result in an error.

### getErrorResults()

This is a static function on `CLIEngine`. It can be used to filter out all the non error messages from the report object.

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

// only get the error messages
var errorReport = CLIEngine.getErrorResults(report.results)
```

**Important:** You must pass in the `results` property of the report. Passing in `report` directly will result in an error.

### outputFixes()

This is a static function on `CLIEngine` that is used to output fixes from `report` to disk. It does by looking for files that have an `output` property in their results. Here's an example:

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

// output fixes to disk
CLIEngine.outputFixes(report);
```

## Deprecated APIs

* `cli` - the `cli` object has been deprecated in favor of `CLIEngine`. As of v1.0.0, `cli` is no longer exported and should not be used by external tools.
