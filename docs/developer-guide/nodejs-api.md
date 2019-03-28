# Node.js API

While ESLint is designed to be run on the command line, it's possible to use ESLint programmatically through the Node.js API. The purpose of the Node.js API is to allow plugin and tool authors to use the ESLint functionality directly, without going through the command line interface.

**Note:** Use undocumented parts of the API at your own risk. Only those parts that are specifically mentioned in this document are approved for use and will remain stable and reliable. Anything left undocumented is unstable and may change or be removed at any point.

## Table of Contents

* [CLIEngine](#cliengine)
    * [executeOnFiles()](#cliengineexecuteonfiles)
    * [resolveFileGlobPatterns()](#cliengineresolvefileglobpatterns)
    * [getConfigForFile()](#clienginegetconfigforfile)
    * [executeOnText()](#cliengineexecuteontext)
    * [addPlugin()](#cliengineaddplugin)
    * [isPathIgnored()](#cliengineispathignored)
    * [getFormatter()](#clienginegetformatter)
    * [getErrorResults()](#clienginegeterrorresults)
    * [outputFixes()](#cliengineoutputfixes)
    * [getRules()](#clienginegetrules)
    * [version](#cliengineversion)
* [Linter](#linter)
    * [verify()](#linterverify)
    * [verifyAndFix()](#linterverifyandfix)
    * [defineRule()](#linterdefinerule)
    * [defineRules()](#linterdefinerules)
    * [getRules()](#lintergetrules)
    * [defineParser()](#linterdefineparser)
    * [version](#linterversion)
* [linter (deprecated)](#linter-1)
* [SourceCode](#sourcecode)
    * [splitLines()](#sourcecodesplitlines)
* [RuleTester](#ruletester)
    * [Customizing RuleTester](#customizing-ruletester)
* [Deprecated APIs](#deprecated-apis)

## CLIEngine

The primary Node.js API is `CLIEngine`, which is the underlying utility that runs the ESLint command line interface. This object will read the filesystem for configuration and file information but will not output any results. Instead, it allows you direct access to the important information so you can deal with the output yourself.

You can get a reference to the `CLIEngine` by doing the following:

```js
var CLIEngine = require("eslint").CLIEngine;
```

The `CLIEngine` is a constructor, and you can create a new instance by passing in the options you want to use. The available options are:

* `allowInlineConfig` - Set to `false` to disable the use of configuration comments (such as `/*eslint-disable*/`). Corresponds to `--no-inline-config`.
* `baseConfig` - Can optionally be set to a config object. This will used as a default config, and will be merged with any configuration defined in `.eslintrc.*` files, with the `.eslintrc.*` files having precedence.
* `cache` - Operate only on changed files (default: `false`). Corresponds to `--cache`.
* `cacheFile` - Name of the file where the cache will be stored (default: `.eslintcache`). Corresponds to `--cache-file`. Deprecated: use `cacheLocation` instead.
* `cacheLocation` - Name of the file or directory where the cache will be stored (default: `.eslintcache`). Corresponds to `--cache-location`.
* `configFile` - The configuration file to use (default: null). If `useEslintrc` is true or not specified, this configuration will be merged with any configuration defined in `.eslintrc.*` files, with options in this configuration having precedence. Corresponds to `-c`.
* `cwd` - Path to a directory that should be considered as the current working directory.
* `envs` - An array of environments to load (default: empty array). Corresponds to `--env`.
* `extensions` - An array of filename extensions that should be checked for code. The default is an array containing just `".js"`. Corresponds to `--ext`. It is only used in conjunction with directories, not with filenames or glob patterns.
* `fix` - A boolean or a function (default: `false`). If a function, it will be passed each linting message and should return a boolean indicating whether the fix should be included with the output report (errors and warnings will not be listed if fixed). Files on disk are never changed regardless of the value of `fix`. To persist changes to disk, call [`outputFixes()`](#cliengineoutputfixes).
* `fixTypes` - An array of rule types for which fixes should be applied (default: `null`). This array acts like a filter, only allowing rules of the given types to apply fixes. Possible array values are `"problem"`, `"suggestion"`, and `"layout"`.
* `globals` - An array of global variables to declare (default: empty array). Corresponds to `--global`.
* `ignore` - False disables use of `.eslintignore`, `ignorePath` and `ignorePattern` (default: true). Corresponds to `--no-ignore`.
* `ignorePath` - The ignore file to use instead of `.eslintignore` (default: null). Corresponds to `--ignore-path`.
* `ignorePattern` - Glob patterns for paths to ignore. String or array of strings.
* `parser` - Specify the parser to be used (default: `espree`). Corresponds to `--parser`.
* `parserOptions` - An object containing parser options (default: empty object). Corresponds to `--parser-options`.
* `plugins` - An array of plugins to load (default: empty array). Corresponds to `--plugin`.
* `reportUnusedDisableDirectives` - When set to `true`, adds reported errors for unused `eslint-disable` directives when no problems would be reported in the disabled area anyway (default: false). Corresponds to `--report-unused-disable-directives`.
* `rulePaths` - An array of directories to load custom rules from (default: empty array). Corresponds to `--rulesdir`.
* `rules` - An object of rules to use (default: null). Corresponds to `--rule`.
* `useEslintrc` - Set to false to disable use of `.eslintrc` files (default: true). Corresponds to `--no-eslintrc`.
* `globInputPaths` - Set to false to skip glob resolution of input file paths to lint (default: true). If false, each input file paths is assumed to be a non-glob path to an existing file.



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

### CLIEngine#executeOnFiles()

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
            filePath: "/Users/eslint/project/myfile.js",
            messages: [{
                ruleId: "semi",
                severity: 2,
                message: "Missing semicolon.",
                line: 1,
                column: 13,
                nodeType: "ExpressionStatement",
                fix: { range: [12, 12], text: ";" }
            }],
            errorCount: 1,
            warningCount: 0,
            fixableErrorCount: 1,
            fixableWarningCount: 0,
            source: "\"use strict\"\n"
        }
    ],
    errorCount: 1,
    warningCount: 0,
    fixableErrorCount: 1,
    fixableWarningCount: 0,
    usedDeprecatedRules: []
}
```

You can also pass `fix: true` when instantiating the `CLIEngine` in order to have it figure out what fixes can be applied.

```js
var CLIEngine = require("eslint").CLIEngine;

var cli = new CLIEngine({
    envs: ["browser", "mocha"],
    fix: true, // difference from last example
    useEslintrc: false,
    rules: {
        semi: 2,
        quotes: [2, "double"]
    }
});

// lint myfile.js and all files in lib/
var report = cli.executeOnFiles(["myfile.js", "lib/"]);
```

```js
{
    results: [
        {
            filePath: "/Users/eslint/project/myfile.js",
            messages: [
                {
                    ruleId: "semi",
                    severity: 2,
                    message: "Missing semicolon.",
                    line: 1,
                    column: 13,
                    nodeType: "ExpressionStatement",
                    fix: { range: [12, 12], text: ";" }
                },
                {
                    ruleId: "func-name-matching",
                    severity: 2,
                    message: "Function name `bar` should match variable name `foo`",
                    line: 2,
                    column: 5,
                    nodeType: "VariableDeclarator"
                }
            ],
            errorCount: 2,
            warningCount: 0,
            fixableErrorCount: 1,
            fixableWarningCount: 0,
            output: "\"use strict\";\nvar foo = function bar() {};\nfoo();\n"
        }
    ],
    errorCount: 2,
    warningCount: 0,
    fixableErrorCount: 1,
    fixableWarningCount: 0,
    usedDeprecatedRules: []
}
```

If the operation ends with a parsing error, you will get a single message for this file, with `fatal: true` added as an extra property.

```js
{
    results: [
        {
            filePath: "./myfile.js",
            messages: [
                {
                    ruleId: null,
                    fatal: true,
                    severity: 2,
                    message: "Parsing error: Unexpected token foo",
                    line: 1,
                    column: 10
                }
            ],
            errorCount: 1,
            warningCount: 0,
            fixableErrorCount: 0,
            fixableWarningCount: 0,
            source: "function foo() {}"
        }
    ],
    errorCount: 1,
    warningCount: 0,
    fixableErrorCount: 0,
    fixableWarningCount: 0,
    usedDeprecatedRules: []
}
```

The top-level report object has a `results` array containing all linting results for files that had warnings or errors (any files that did not produce a warning or error are omitted). Each file result includes:

* `filePath` - Path to the given file.
* `messages` - Array containing the result of calling `linter.verify()` on the given file.
* `errorCount` and `warningCount` - The exact number of errors and warnings respectively on the given file.
* `source` - The source code for the given file. This property is omitted if this file has no errors/warnings or if the `output` property is present.
* `output` - The source code for the given file with as many fixes applied as possible, so you can use that to rewrite the files if necessary. This property is omitted if no fix is available.

The top-level report object also has `errorCount` and `warningCount` which give the exact number of errors and warnings respectively on all the files. Additionally, `usedDeprecatedRules` signals any deprecated rules used and their replacement (if available). Specifically, it is array of objects with properties like so:

* `ruleId` - The name of the rule (e.g. `indent-legacy`).
* `replacedBy` - An array of rules that replace the deprecated rule (e.g. `["indent"]`).

Once you get a report object, it's up to you to determine how to output the results. Fixes will not be automatically applied to the files, even if you set `fix: true` when constructing the `CLIEngine` instance. To apply fixes to the files, call [`outputFixes`](#cliengineoutputfixes).

### CLIEngine#resolveFileGlobPatterns()

You can pass filesystem-style or glob patterns to ESLint and have it function properly. In order to achieve this, ESLint must resolve non-glob patterns into glob patterns before determining which files to execute on. The `resolveFileGlobPatterns()` methods uses the current settings from `CLIEngine` to resolve non-glob patterns into glob patterns. Pass an array of patterns that might be passed to the ESLint CLI and it will return an array of glob patterns that mean the same thing. Here's an example:

```js
var CLIEngine = require("eslint").CLIEngine;

var cli = new CLIEngine({
});

// pass an array of patterns
var globPatterns = cli.resolveFileGlobPatterns(["."]);
console.log(globPatterns[i]);       // ["**/*.js"]
```

### CLIEngine#getConfigForFile()

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

### CLIEngine#executeOnText()

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

If a filename in the optional second parameter matches a file that is configured to be ignored, then this function returns no errors or warnings. To return a warning instead, call the method with true as the optional third parameter.

### CLIEngine#addPlugin()

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

### CLIEngine#isPathIgnored()

Checks if a given path is ignored by ESLint.

```js
var CLIEngine = require("eslint").CLIEngine;

var cli = new CLIEngine({
    ignore: true,
    ignorePath: ".customIgnoreFile"
});

var isIgnored = cli.isPathIgnored("foo/bar.js");
```

### CLIEngine#getFormatter()

Retrieves a formatter, which you can then use to format a report object. The argument is either the name of a built-in formatter:

* "[checkstyle](../user-guide/formatters#checkstyle)"
* "[codeframe](../user-guide/formatters#codeframe)"
* "[compact](../user-guide/formatters#compact)"
* "[html](../user-guide/formatters#html)"
* "[jslint-xml](../user-guide/formatters#jslint-xml)"
* "[json](../user-guide/formatters#json)"
* "[junit](../user-guide/formatters#junit)"
* "[stylish](../user-guide/formatters#stylish)" (the default)
* "[table](../user-guide/formatters#table)"
* "[tap](../user-guide/formatters#tap)"
* "[unix](../user-guide/formatters#unix)"

or the full path to a JavaScript file containing a custom formatter. You can also omit the argument to retrieve the default formatter.

```js
var CLIEngine = require("eslint").CLIEngine;

var cli = new CLIEngine({
    baseConfig: {
        extends: ["eslint-config-shared"],
        settings: {
            sharedData: "Hello"
        }
    },
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

### CLIEngine#getErrorResults()

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

### CLIEngine#outputFixes()

This is a static function on `CLIEngine` that is used to output fixes from `report` to disk. It does by looking for files that have an `output` property in their results. Here's an example:

```js
var CLIEngine = require("eslint").CLIEngine;

var cli = new CLIEngine({
    envs: ["browser", "mocha"],
    fix: true,
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

### CLIEngine#getRules()

This method returns a map of all loaded rules. Under the hood, it calls [Linter#getRules](#lintergetrules).

```js
const CLIEngine = require("eslint").CLIEngine;
const cli = new CLIEngine();

cli.getRules();

/*
Map {
  'accessor-pairs' => { meta: { docs: [Object], schema: [Array] }, create: [Function: create] },
  'array-bracket-newline' => { meta: { docs: [Object], schema: [Array] }, create: [Function: create] },
  ...
}
*/
```


### CLIEngine.version

`CLIEngine` has a static `version` property containing the semantic version number of ESLint that it comes from.

```js
require("eslint").CLIEngine.version; // '4.5.0'
```

## Linter

The `Linter` object does the actual evaluation of the JavaScript code. It doesn't do any filesystem operations, it simply parses and reports on the code. In particular, the `Linter` object does not process configuration objects or files. You can retrieve instances of `Linter` like this:

```js
var Linter = require("eslint").Linter;
var linter = new Linter();
```

### Linter#verify

The most important method on `Linter` is `verify()`, which initiates linting of the given text. This method accepts three arguments:

* `code` - the source code to lint (a string or instance of `SourceCode`).
* `config` - a configuration object that has been processed and normalized by CLIEngine using eslintrc files and/or other configuration arguments.
    * **Note**: If you want to lint text and have your configuration be read and processed, use CLIEngine's [`executeOnFiles`](#cliengineexecuteonfiles) or [`executeOnText`](#cliengineexecuteontext) instead.
* `options` - (optional) Additional options for this run.
    * `filename` - (optional) the filename to associate with the source code.
    * `preprocess` - (optional) A function that accepts a string containing source text, and returns an array of strings containing blocks of code to lint. Also see: [Processors in Plugins](/docs/developer-guide/working-with-plugins.md#processors-in-plugins)
    * `postprocess` - (optional) A function that accepts an array of problem lists (one list of problems for each block of code from `preprocess`), and returns a one-dimensional array of problems containing problems for the original, unprocessed text. Also see: [Processors in Plugins](/docs/developer-guide/working-with-plugins.md#processors-in-plugins)
    * `allowInlineConfig` - (optional) set to `false` to disable inline comments from changing ESLint rules.
    * `reportUnusedDisableDirectives` - (optional) when set to `true`, adds reported errors for unused `eslint-disable` directives when no problems would be reported in the disabled area anyway.

If the third argument is a string, it is interpreted as the `filename`.

You can call `verify()` like this:

```js
var Linter = require("eslint").Linter;
var linter = new Linter();

var messages = linter.verify("var foo;", {
    rules: {
        semi: 2
    }
}, { filename: "foo.js" });

// or using SourceCode

var Linter = require("eslint").Linter,
    linter = new Linter(),
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
* `endColumn` - the end column of the range on which the error occurred (this property is omitted if it's not range).
* `endLine` - the end line of the range on which the error occurred (this property is omitted if it's not range).
* `fix` - an object describing the fix for the problem (this property is omitted if no fix is available).

Linting message objects have a deprecated `source` property. This property **will be removed** from linting messages in an upcoming breaking release. If you depend on this property, you should now use the `SourceCode` instance provided by the linter.

You can also get an instance of the `SourceCode` object used inside of `linter` by using the `getSourceCode()` method:

```js
var Linter = require("eslint").Linter;
var linter = new Linter();

var messages = linter.verify("var foo = bar;", {
    rules: {
        semi: 2
    }
}, { filename: "foo.js" });

var code = linter.getSourceCode();

console.log(code.text);     // "var foo = bar;"
```

In this way, you can retrieve the text and AST used for the last run of `linter.verify()`.

### Linter#verifyAndFix()

This method is similar to verify except that it also runs autofixing logic, similar to the `--fix` flag on the command line. The result object will contain the autofixed code, along with any remaining linting messages for the code that were not autofixed.

```js
var Linter = require("eslint").Linter;
var linter = new Linter();

var messages = linter.verifyAndFix("var foo", {
    rules: {
        semi: 2
    }
});
```

Output object from this method:

```js
{
    fixed: true,
    output: "var foo;",
    messages: []
}
```

The information available is:

* `fixed` - True, if the code was fixed.
* `output` - Fixed code text (might be the same as input if no fixes were applied).
* `messages` - Collection of all messages for the given code (It has the same information as explained above under `verify` block).

### Linter#defineRule

Each `Linter` instance holds a map of rule names to loaded rule objects. By default, all ESLint core rules are loaded. If you want to use `Linter` with custom rules, you should use the `defineRule` method to register your rules by ID.

```js
const Linter = require("eslint").Linter;
const linter = new Linter();

linter.defineRule("my-custom-rule", {
    // (an ESLint rule)

    create(context) {
        // ...
    }
});

const results = linter.verify("// some source text", { rules: { "my-custom-rule": "error" } });
```

### Linter#defineRules

This is a convenience method similar to `Linter#defineRule`, except that it allows you to define many rules at once using an object.

```js
const Linter = require("eslint").Linter;
const linter = new Linter();

linter.defineRules({
    "my-custom-rule": { /* an ESLint rule */ create() {} },
    "another-custom-rule": { /* an ESLint rule */ create() {} }
});

const results = linter.verify("// some source text", {
    rules: {
        "my-custom-rule": "error",
        "another-custom-rule": "warn"
    }
});
```

### Linter#getRules

This method returns a map of all loaded rules.

```js
const Linter = require("eslint").Linter;
const linter = new Linter();

linter.getRules();

/*
Map {
  'accessor-pairs' => { meta: { docs: [Object], schema: [Array] }, create: [Function: create] },
  'array-bracket-newline' => { meta: { docs: [Object], schema: [Array] }, create: [Function: create] },
  ...
}
*/
```

### Linter#defineParser
Each instance of `Linter` holds a map of custom parsers. If you want to define a parser programmatically you can add this function
with the name of the parser as first argument and the [parser object](/docs/developer-guide/working-with-plugins.md#working-with-custom-parsers) as second argument.
* "[checkstyle](../user-guide/formatters#checkstyle)"
* "[codeframe](../user-guide/formatters#codeframe)"
* "[compact](../user-guide/formatters#compact)"
* "[html](../user-guide/formatters#html)"
* "[jslint-xml](../user-guide/formatters#jslint-xml)"
* "[json](../user-guide/formatters#json)"
* "[junit](../user-guide/formatters#junit)"
* "[stylish](../user-guide/formatters#stylish)" (the default)
* "[table](../user-guide/formatters#table)"
* "[tap](../user-guide/formatters#tap)"
* "[unix](../user-guide/formatters#unix)"
* "[visualstudio](../user-guide/formatters#visualstudio)"

If during linting the parser is not found, it will fallback to `require(parserId)`.

```js
const Linter = require("eslint").Linter;
const linter = new Linter();

linter.defineParser("my-custom-parser", {
    parse(code, options) {
        // ...
    }
});

const results = linter.verify("// some source text", { parser: "my-custom-parser" });
```

### Linter#version/Linter.version

Each instance of `Linter` has a `version` property containing the semantic version number of ESLint that the `Linter` instance is from.

```js
const Linter = require("eslint").Linter;
const linter = new Linter();

linter.version; // => '4.5.0'
```

There is also a `Linter.version` property that you can read without instantiating `Linter`:

```js
const Linter = require("eslint").Linter;

Linter.version; // => '4.5.0'
```

## linter

The `eslint.linter` object (deprecated) is an instance of the `Linter` class as defined [above](#linter). `eslint.linter` exists for backwards compatibility, but we do not recommend using it because any mutations to it are shared among every module that uses `eslint`. Instead, please create your own instance of `eslint.Linter`.

```js
var linter = require("eslint").linter;

var messages = linter.verify("var foo;", {
    rules: {
        semi: 2
    }
}, { filename: "foo.js" });
```

Note: This API is deprecated as of 4.0.0.

## SourceCode

The `SourceCode` type represents the parsed source code that ESLint executes on. It's used internally in ESLint and is also available so that already-parsed code can be used. You can create a new instance of `SourceCode` by passing in the text string representing the code and an abstract syntax tree (AST) in [ESTree](https://github.com/estree/estree) format (including location information, range information, comments, and tokens):

```js
var SourceCode = require("eslint").SourceCode;

var code = new SourceCode("var foo = bar;", ast);
```

The `SourceCode` constructor throws an error if the AST is missing any of the required information.

The `SourceCode` constructor strips Unicode BOM.
Please note the AST also should be parsed from stripped text.

```js
var SourceCode = require("eslint").SourceCode;

var code = new SourceCode("\uFEFFvar foo = bar;", ast);

assert(code.hasBOM === true);
assert(code.text === "var foo = bar;");
```

### SourceCode#splitLines()

This is a static function on `SourceCode` that is used to split the source code text into an array of lines.

```js
var SourceCode = require("eslint").SourceCode;

var code = "var a = 1;\nvar b = 2;"

// split code into an array
var codeLines = SourceCode.splitLines(code);

/*
    Value of codeLines will be
    [
        "var a = 1;",
        "var b = 2;"
    ]
 */
```

## RuleTester

`eslint.RuleTester` is a utility to write tests for ESLint rules. It is used internally for the bundled rules that come with ESLint, and it can also be used by plugins.

Example usage:

```js
"use strict";

const rule = require("../../../lib/rules/my-rule"),
    RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester();

ruleTester.run("my-rule", rule, {
    valid: [
        {
            code: "var foo = true",
            options: [{ allowFoo: true }]
        }
    ],

    invalid: [
        {
            code: "var invalidVariable = true",
            errors: [{ message: "Unexpected invalid variable." }]
        },
        {
            code: "var invalidVariable = true",
            errors: [{ message: /^Unexpected.+variable/ }]
        }
    ]
});
```

The `RuleTester` constructor accepts an optional object argument, which can be used to specify defaults for your test cases. For example, if all of your test cases use ES2015, you can set it as a default:

```js
const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });
```

The `RuleTester#run()` method is used to run the tests. It should be passed the following arguments:

* The name of the rule (string)
* The rule object itself (see ["working with rules"](./working-with-rules))
* An object containing `valid` and `invalid` properties, each of which is an array containing test cases.

A test case is an object with the following properties:

* `code` (string, required): The source code that the rule should be run on
* `options` (array, optional): The options passed to the rule. The rule severity should not be included in this list.
* `filename` (string, optional): The filename for the given case (useful for rules that make assertions about filenames).

In addition to the properties above, invalid test cases can also have the following properties:

* `errors` (number or array, required): Asserts some properties of the errors that the rule is expected to produce when run on this code. If this is a number, asserts the number of errors produced. Otherwise, this should be a list of objects, each containing information about a single reported error. The following properties can be used for an error (all are optional):
    * `message` (string/regexp): The message for the error
    * `type` (string): The type of the reported AST node
    * `line` (number): The 1-based line number of the reported location
    * `column` (number): The 1-based column number of the reported location
    * `endLine` (number): The 1-based line number of the end of the reported location
    * `endColumn` (number): The 1-based column number of the end of the reported location

    If a string is provided as an error instead of an object, the string is used to assert the `message` of the error.
* `output` (string, optional): Asserts the output that will be produced when using this rule for a single pass of autofixing (e.g. with the `--fix` command line flag). If this is `null`, asserts that none of the reported problems suggest autofixes.

Any additional properties of a test case will be passed directly to the linter as config options. For example, a test case can have a `parserOptions` property to configure parser behavior:

```js
{
    code: "let foo;",
    parserOptions: { ecmaVersion: 2015 }
}
```

If a valid test case only uses the `code` property, it can optionally be provided as a string containing the code, rather than an object with a `code` key.

### Customizing RuleTester

`RuleTester` depends on two functions to run tests: `describe` and `it`. These functions can come from various places:

1. If `RuleTester.describe` and `RuleTester.it` have been set to function values, `RuleTester` will use `RuleTester.describe` and `RuleTester.it` to run tests. You can use this to customize the behavior of `RuleTester` to match a test framework that you're using.
1. Otherwise, if `describe` and `it` are present as globals, `RuleTester` will use `global.describe` and `global.it` to run tests. This allows `RuleTester` to work when using frameworks like [Mocha](https://mochajs.org/) without any additional configuration.
1. Otherwise, `RuleTester#run` will simply execute all of the tests in sequence, and will throw an error if one of them fails. This means you can simply execute a test file that calls `RuleTester.run` using `node`, without needing a testing framework.

`RuleTester#run` calls the `describe` function with two arguments: a string describing the rule, and a callback function. The callback calls the `it` function with a string describing the test case, and a test function. The test function will return successfully if the test passes, and throw an error if the test fails. (Note that this is the standard behavior for test suites when using frameworks like [Mocha](https://mochajs.org/); this information is only relevant if you plan to customize `RuleTester.it` and `RuleTester.describe`.)

Example of customizing `RuleTester`:

```js
"use strict";

const RuleTester = require("eslint").RuleTester,
    test = require("my-test-runner"),
    myRule = require("../../../lib/rules/my-rule");

RuleTester.describe = function(text, method) {
    RuleTester.it.title = text;
    return method.call(this);
};

RuleTester.it = function(text, method) {
    test(RuleTester.it.title + ": " + text, method);
};

// then use RuleTester as documented

const ruleTester = new RuleTester();

ruleTester.run("my-rule", myRule, {
    valid: [
        // valid test cases
    ],
    invalid: [
        // invalid test cases
    ]
})
```

## Deprecated APIs

* `cli` - the `cli` object has been deprecated in favor of `CLIEngine`. As of v1.0.0, `cli` is no longer exported and should not be used by external tools.
* `linter` - the `linter` object has been deprecated in favor of `Linter` as of v4.0.0.
