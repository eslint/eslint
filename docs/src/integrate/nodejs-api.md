---
title: Node.js API Reference
eleventyNavigation:
    key: node.js api
    parent: extend eslint
    title: Node.js API Reference
    order: 6

---

While ESLint is designed to be run on the command line, it's possible to use ESLint programmatically through the Node.js API. The purpose of the Node.js API is to allow plugin and tool authors to use the ESLint functionality directly, without going through the command line interface.

**Note:** Use undocumented parts of the API at your own risk. Only those parts that are specifically mentioned in this document are approved for use and will remain stable and reliable. Anything left undocumented is unstable and may change or be removed at any point.

## ESLint class

The `ESLint` class is the primary class to use in Node.js applications.

This class depends on the Node.js `fs` module and the file system, so you cannot use it in browsers. If you want to lint code on browsers, use the [Linter](#linter) class instead.

Here's a simple example of using the `ESLint` class:

```js
const { ESLint } = require("eslint");

(async function main() {
  // 1. Create an instance.
  const eslint = new ESLint();

  // 2. Lint files.
  const results = await eslint.lintFiles(["lib/**/*.js"]);

  // 3. Format the results.
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);

  // 4. Output it.
  console.log(resultText);
})().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});
```

And here is an example that autofixes lint problems:

```js
const { ESLint } = require("eslint");

(async function main() {
  // 1. Create an instance with the `fix` option.
  const eslint = new ESLint({ fix: true });

  // 2. Lint files. This doesn't modify target files.
  const results = await eslint.lintFiles(["lib/**/*.js"]);

  // 3. Modify the files with the fixed code.
  await ESLint.outputFixes(results);

  // 4. Format the results.
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);

  // 5. Output it.
  console.log(resultText);
})().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});
```

### ◆ new ESLint(options)

```js
const eslint = new ESLint(options);
```

Create a new `ESLint` instance.

#### Parameters

The `ESLint` constructor takes an `options` object. If you omit the `options` object then it uses default values for all options. The `options` object has the following properties.

##### File Enumeration

* `options.cwd` (`string`)<br>
  Default is `process.cwd()`. The working directory. This must be an absolute path.
* `options.errorOnUnmatchedPattern` (`boolean`)<br>
  Default is `true`. Unless set to `false`, the [`eslint.lintFiles()`][eslint-lintfiles] method will throw an error when no target files are found.
* `options.extensions` (`string[] | null`)<br>
  Default is `null`. If you pass directory paths to the [`eslint.lintFiles()`][eslint-lintfiles] method, ESLint checks the files in those directories that have the given extensions. For example, when passing the `src/` directory and `extensions` is `[".js", ".ts"]`, ESLint will lint `*.js` and `*.ts` files in `src/`. If `extensions` is `null`, ESLint checks `*.js` files and files that match `overrides[].files` patterns in your configuration.<br>**Note:** This option only applies when you pass directory paths to the [`eslint.lintFiles()`][eslint-lintfiles] method. If you pass glob patterns like `lib/**/*`, ESLint will lint all files matching the glob pattern regardless of extension.
* `options.globInputPaths` (`boolean`)<br>
  Default is `true`. If `false` is present, the [`eslint.lintFiles()`][eslint-lintfiles] method doesn't interpret glob patterns.
* `options.ignore` (`boolean`)<br>
  Default is `true`. If `false` is present, the [`eslint.lintFiles()`][eslint-lintfiles] method doesn't respect `.eslintignore` files or `ignorePatterns` in your configuration.
* `options.ignorePath` (`string | null`)<br>
  Default is `null`. The path to a file ESLint uses instead of `$CWD/.eslintignore`. If a path is present and the file doesn't exist, this constructor will throw an error.

##### Linting

* `options.allowInlineConfig` (`boolean`)<br>
  Default is `true`. If `false` is present, ESLint suppresses directive comments in source code. If this option is `false`, it overrides the `noInlineConfig` setting in your configurations.
* `options.baseConfig` (`ConfigData | null`)<br>
  Default is `null`. [Configuration object], extended by all configurations used with this instance. You can use this option to define the default settings that will be used if your configuration files don't configure it.
* `options.overrideConfig` (`ConfigData | null`)<br>
  Default is `null`. [Configuration object], overrides all configurations used with this instance. You can use this option to define the settings that will be used even if your configuration files configure it.
* `options.overrideConfigFile` (`string | null`)<br>
  Default is `null`. The path to a configuration file, overrides all configurations used with this instance. The `options.overrideConfig` option is applied after this option is applied.
* `options.plugins` (`Record<string, Plugin> | null`)<br>
  Default is `null`. The plugin implementations that ESLint uses for the `plugins` setting of your configuration. This is a map-like object. Those keys are plugin IDs and each value is implementation.
* `options.reportUnusedDisableDirectives` (`"error" | "warn" | "off" | null`)<br>
  Default is `null`. The severity to report unused eslint-disable directives. If this option is a severity, it overrides the `reportUnusedDisableDirectives` setting in your configurations.
* `options.resolvePluginsRelativeTo` (`string` | `null`)<br>
  Default is `null`. The path to a directory where plugins should be resolved from. If `null` is present, ESLint loads plugins from the location of the configuration file that contains the plugin setting. If a path is present, ESLint loads all plugins from there.
* `options.rulePaths` (`string[]`)<br>
  Default is `[]`. An array of paths to directories to load custom rules from.
* `options.useEslintrc` (`boolean`)<br>
  Default is `true`. If `false` is present, ESLint doesn't load configuration files (`.eslintrc.*` files). Only the configuration of the constructor options is valid.

##### Autofix

* `options.fix` (`boolean | (message: LintMessage) => boolean`)<br>
  Default is `false`. If `true` is present, the [`eslint.lintFiles()`][eslint-lintfiles] and [`eslint.lintText()`][eslint-linttext] methods work in autofix mode. If a predicate function is present, the methods pass each lint message to the function, then use only the lint messages for which the function returned `true`.
* `options.fixTypes` (`("directive" | "problem" | "suggestion" | "layout")[] | null`)<br>
  Default is `null`. The types of the rules that the [`eslint.lintFiles()`][eslint-lintfiles] and [`eslint.lintText()`][eslint-linttext] methods use for autofix.

##### Cache-related

* `options.cache` (`boolean`)<br>
  Default is `false`. If `true` is present, the [`eslint.lintFiles()`][eslint-lintfiles] method caches lint results and uses it if each target file is not changed. Please mind that ESLint doesn't clear the cache when you upgrade ESLint plugins. In that case, you have to remove the cache file manually. The [`eslint.lintText()`][eslint-linttext] method doesn't use caches even if you pass the `options.filePath` to the method.
* `options.cacheLocation` (`string`)<br>
  Default is `.eslintcache`. The [`eslint.lintFiles()`][eslint-lintfiles] method writes caches into this file.
* `options.cacheStrategy` (`string`)<br>
  Default is `"metadata"`. Strategy for the cache to use for detecting changed files. Can be either `"metadata"` or `"content"`.

### ◆ eslint.lintFiles(patterns)

```js
const results = await eslint.lintFiles(patterns);
```

This method lints the files that match the glob patterns and then returns the results.

#### Parameters

* `patterns` (`string | string[]`)<br>
  The lint target files. This can contain any of file paths, directory paths, and glob patterns.

#### Return Value

* (`Promise<LintResult[]>`)<br>
  The promise that will be fulfilled with an array of [LintResult] objects.

### ◆ eslint.lintText(code, options)

```js
const results = await eslint.lintText(code, options);
```

This method lints the given source code text and then returns the results.

By default, this method uses the configuration that applies to files in the current working directory (the `cwd` constructor option). If you want to use a different configuration, pass `options.filePath`, and ESLint will load the same configuration that [`eslint.lintFiles()`][eslint-lintfiles] would use for a file at `options.filePath`.

If the `options.filePath` value is configured to be ignored, this method returns an empty array. If the `options.warnIgnored` option is set along with the `options.filePath` option, this method returns a [LintResult] object. In that case, the result may contain a warning that indicates the file was ignored.

#### Parameters

The second parameter `options` is omittable.

* `code` (`string`)<br>
  The source code text to check.
* `options.filePath` (`string`)<br>
  Optional. The path to the file of the source code text. If omitted, the `result.filePath` becomes the string `"<text>"`.
* `options.warnIgnored` (`boolean`)<br>
  Optional. If `true` is present and the `options.filePath` is a file ESLint should ignore, this method returns a lint result contains a warning message.

#### Return Value

* (`Promise<LintResult[]>`)<br>
  The promise that will be fulfilled with an array of [LintResult] objects. This is an array (despite there being only one lint result) in order to keep the interfaces between this and the [`eslint.lintFiles()`][eslint-lintfiles] method similar.

### ◆ eslint.getRulesMetaForResults(results)

```js
const results = await eslint.lintFiles(patterns);
const rulesMeta = eslint.getRulesMetaForResults(results);
```

This method returns an object containing meta information for each rule that triggered a lint error in the given `results`.

#### Parameters

* `results` (`LintResult[]`)<br>
  An array of [LintResult] objects returned from a call to `ESLint#lintFiles()` or `ESLint#lintText()`.

#### Return Value

* (`Object`)<br>
  An object whose property names are the rule IDs from the `results` and whose property values are the rule's meta information (if available).

### ◆ eslint.calculateConfigForFile(filePath)

```js
const config = await eslint.calculateConfigForFile(filePath);
```

This method calculates the configuration for a given file, which can be useful for debugging purposes.

* It resolves and merges `extends` and `overrides` settings into the top level configuration.
* It resolves the `parser` setting to absolute paths.
* It normalizes the `plugins` setting to align short names. (e.g., `eslint-plugin-foo` → `foo`)
* It adds the `processor` setting if a legacy file extension processor is matched.
* It doesn't interpret the `env` setting to the `globals` and `parserOptions` settings, so the result object contains the `env` setting as is.

#### Parameters

* `filePath` (`string`)<br>
  The path to the file whose configuration you would like to calculate. Directory paths are forbidden because ESLint cannot handle the `overrides` setting.

#### Return Value

* (`Promise<Object>`)<br>
  The promise that will be fulfilled with a configuration object.

### ◆ eslint.isPathIgnored(filePath)

```js
const isPathIgnored = await eslint.isPathIgnored(filePath);
```

This method checks if a given file is ignored by your configuration.

#### Parameters

* `filePath` (`string`)<br>
  The path to the file you want to check.

#### Return Value

* (`Promise<boolean>`)<br>
  The promise that will be fulfilled with whether the file is ignored or not. If the file is ignored, then it will return `true`.

### ◆ eslint.loadFormatter(nameOrPath)

```js
const formatter = await eslint.loadFormatter(nameOrPath);
```

This method loads a formatter. Formatters convert lint results to a human- or machine-readable string.

#### Parameters

* `nameOrPath` (`string | undefined`)<br>
  The path to the file you want to check. The following values are allowed:
    * `undefined`. In this case, loads the `"stylish"` built-in formatter.
    * A name of [built-in formatters][builtin-formatters].
    * A name of [third-party formatters][third-party-formatters]. For examples:
        * `"foo"` will load `eslint-formatter-foo`.
        * `"@foo"` will load `@foo/eslint-formatter`.
        * `"@foo/bar"` will load `@foo/eslint-formatter-bar`.
    * A path to the file that defines a formatter. The path must contain one or more path separators (`/`) in order to distinguish if it's a path or not. For example, start with `./`.

#### Return Value

* (`Promise<LoadedFormatter>`)<br>
  The promise that will be fulfilled with a [LoadedFormatter] object.

### ◆ ESLint.version

```js
const version = ESLint.version;
```

The version string of ESLint. E.g. `"7.0.0"`.

This is a static property.

### ◆ ESLint.outputFixes(results)

```js
await ESLint.outputFixes(results);
```

This method writes code modified by ESLint's autofix feature into its respective file. If any of the modified files don't exist, this method does nothing.

This is a static method.

#### Parameters

* `results` (`LintResult[]`)<br>
  The [LintResult] objects to write.

#### Return Value

* (`Promise<void>`)<br>
  The promise that will be fulfilled after all files are written.

### ◆ ESLint.getErrorResults(results)

```js
const filteredResults = ESLint.getErrorResults(results);
```

This method copies the given results and removes warnings. The returned value contains only errors.

This is a static method.

#### Parameters

* `results` (`LintResult[]`)<br>
  The [LintResult] objects to filter.

#### Return Value

* (`LintResult[]`)<br>
  The filtered [LintResult] objects.

### ◆ LintResult type

The `LintResult` value is the information of the linting result of each file. The [`eslint.lintFiles()`][eslint-lintfiles] and [`eslint.lintText()`][eslint-linttext] methods return it. It has the following properties:

* `filePath` (`string`)<br>
  The absolute path to the file of this result. This is the string `"<text>"` if the file path is unknown (when you didn't pass the `options.filePath` option to the [`eslint.lintText()`][eslint-linttext] method).
* `messages` (`LintMessage[]`)<br>
  The array of [LintMessage] objects.
* `suppressedMessages` (`SuppressedLintMessage[]`)<br>
  The array of [SuppressedLintMessage] objects.
* `fixableErrorCount` (`number`)<br>
  The number of errors that can be fixed automatically by the `fix` constructor option.
* `fixableWarningCount` (`number`)<br>
  The number of warnings that can be fixed automatically by the `fix` constructor option.
* `errorCount` (`number`)<br>
  The number of errors. This includes fixable errors and fatal errors.
* `fatalErrorCount` (`number`)<br>
  The number of fatal errors.
* `warningCount` (`number`)<br>
  The number of warnings. This includes fixable warnings.
* `output` (`string | undefined`)<br>
  The modified source code text. This property is undefined if any fixable messages didn't exist.
* `source` (`string | undefined`)<br>
  The original source code text. This property is undefined if any messages didn't exist or the `output` property exists.
* `usedDeprecatedRules` (`{ ruleId: string; replacedBy: string[] }[]`)<br>
  The information about the deprecated rules that were used to check this file.

### ◆ LintMessage type

The `LintMessage` value is the information of each linting error. The `messages` property of the [LintResult] type contains it. It has the following properties:

* `ruleId` (`string` | `null`)<br>
  The rule name that generates this lint message. If this message is generated by the ESLint core rather than rules, this is `null`.
* `severity` (`1 | 2`)<br>
  The severity of this message. `1` means warning and `2` means error.
* `fatal` (`boolean | undefined`)<br>
  `true` if this is a fatal error unrelated to a rule, like a parsing error.
* `message` (`string`)<br>
  The error message.
* `line` (`number | undefined`)<br>
  The 1-based line number of the begin point of this message.
* `column` (`number | undefined`)<br>
  The 1-based column number of the begin point of this message.
* `endLine` (`number | undefined`)<br>
  The 1-based line number of the end point of this message. This property is undefined if this message is not a range.
* `endColumn` (`number | undefined`)<br>
  The 1-based column number of the end point of this message. This property is undefined if this message is not a range.
* `fix` (`EditInfo | undefined`)<br>
  The [EditInfo] object of autofix. This property is undefined if this message is not fixable.
* `suggestions` (`{ desc: string; fix: EditInfo }[] | undefined`)<br>
  The list of suggestions. Each suggestion is the pair of a description and an [EditInfo] object to fix code. API users such as editor integrations can choose one of them to fix the problem of this message. This property is undefined if this message doesn't have any suggestions.

### ◆ SuppressedLintMessage type

The `SuppressedLintMessage` value is the information of each suppressed linting error. The `suppressedMessages` property of the [LintResult] type contains it. It has the following properties:

* `ruleId` (`string` | `null`)<br>
  Same as `ruleId` in [LintMessage] type.
* `severity` (`1 | 2`)<br>
  Same as `severity` in [LintMessage] type.
* `fatal` (`boolean | undefined`)<br>
  Same as `fatal` in [LintMessage] type.
* `message` (`string`)<br>
  Same as `message` in [LintMessage] type.
* `line` (`number | undefined`)<br>
  Same as `line` in [LintMessage] type.
* `column` (`number | undefined`)<br>
  Same as `column` in [LintMessage] type.
* `endLine` (`number | undefined`)<br>
  Same as `endLine` in [LintMessage] type.
* `endColumn` (`number | undefined`)<br>
  Same as `endColumn` in [LintMessage] type.
* `fix` (`EditInfo | undefined`)<br>
  Same as `fix` in [LintMessage] type.
* `suggestions` (`{ desc: string; fix: EditInfo }[] | undefined`)<br>
  Same as `suggestions` in [LintMessage] type.
* `suppressions` (`{ kind: string; justification: string}[]`)<br>
  The list of suppressions. Each suppression is the pair of a kind and a justification.

### ◆ EditInfo type

The `EditInfo` value is information to edit text. The `fix` and `suggestions` properties of [LintMessage] type contain it. It has following properties:

* `range` (`[number, number]`)<br>
  The pair of 0-based indices in source code text to remove.
* `text` (`string`)<br>
  The text to add.

This edit information means replacing the range of the `range` property by the `text` property value. It's like `sourceCodeText.slice(0, edit.range[0]) + edit.text + sourceCodeText.slice(edit.range[1])`. Therefore, it's an add if the `range[0]` and `range[1]` property values are the same value, and it's removal if the `text` property value is empty string.

### ◆ LoadedFormatter type

The `LoadedFormatter` value is the object to convert the [LintResult] objects to text. The [eslint.loadFormatter()][eslint-loadformatter] method returns it. It has the following method:

* `format` (`(results: LintResult[], resultsMeta: ResultsMeta) => string | Promise<string>`)<br>
  The method to convert the [LintResult] objects to text. `resultsMeta` is an object that will contain a `maxWarningsExceeded` object if `--max-warnings` was set and the number of warnings exceeded the limit. The `maxWarningsExceeded` object will contain two properties: `maxWarnings`, the value of the `--max-warnings` option, and `foundWarnings`, the number of lint warnings.

---

## SourceCode

The `SourceCode` type represents the parsed source code that ESLint executes on. It's used internally in ESLint and is also available so that already-parsed code can be used. You can create a new instance of `SourceCode` by passing in the text string representing the code and an abstract syntax tree (AST) in [ESTree](https://github.com/estree/estree) format (including location information, range information, comments, and tokens):

```js
const SourceCode = require("eslint").SourceCode;

const code = new SourceCode("var foo = bar;", ast);
```

The `SourceCode` constructor throws an error if the AST is missing any of the required information.

The `SourceCode` constructor strips Unicode BOM.
Please note the AST also should be parsed from stripped text.

```js
const SourceCode = require("eslint").SourceCode;

const code = new SourceCode("\uFEFFvar foo = bar;", ast);

assert(code.hasBOM === true);
assert(code.text === "var foo = bar;");
```

### SourceCode#splitLines()

This is a static function on `SourceCode` that is used to split the source code text into an array of lines.

```js
const SourceCode = require("eslint").SourceCode;

const code = "var a = 1;\nvar b = 2;"

// split code into an array
const codeLines = SourceCode.splitLines(code);

/*
    Value of codeLines will be
    [
        "var a = 1;",
        "var b = 2;"
    ]
 */
```

---

## Linter

The `Linter` object does the actual evaluation of the JavaScript code. It doesn't do any filesystem operations, it simply parses and reports on the code. In particular, the `Linter` object does not process configuration objects or files. Unless you are working in the browser, you probably want to use the [ESLint class](#eslint-class) instead.

The `Linter` is a constructor, and you can create a new instance by passing in the options you want to use. The available options are:

* `cwd` - Path to a directory that should be considered as the current working directory. It is accessible to rules by calling `context.getCwd()` (see [The Context Object](../extend/custom-rules#the-context-object)). If `cwd` is `undefined`, it will be normalized to `process.cwd()` if the global `process` object is defined (for example, in the Node.js runtime) , or `undefined` otherwise.

For example:

```js
const Linter = require("eslint").Linter;
const linter1 = new Linter({ cwd: 'path/to/project' });
const linter2 = new Linter();
```

In this example, rules run on `linter1` will get `path/to/project` when calling `context.getCwd()`.
Those run on `linter2` will get `process.cwd()` if the global `process` object is defined or `undefined` otherwise (e.g. on the browser <https://eslint.org/demo>).

### Linter#verify

The most important method on `Linter` is `verify()`, which initiates linting of the given text. This method accepts three arguments:

* `code` - the source code to lint (a string or instance of `SourceCode`).
* `config` - a configuration object that has been processed and normalized by `ESLint` using eslintrc files and/or other configuration arguments.
    * **Note**: If you want to lint text and have your configuration be read and processed, use [`ESLint#lintFiles()`][eslint-lintfiles] or [`ESLint#lintText()`][eslint-linttext] instead.
* `options` - (optional) Additional options for this run.
    * `filename` - (optional) the filename to associate with the source code.
    * `preprocess` - (optional) A function that [Processors in Plugins](../extend/plugins#processors-in-plugins) documentation describes as the `preprocess` method.
    * `postprocess` - (optional) A function that [Processors in Plugins](../extend/plugins#processors-in-plugins) documentation describes as the `postprocess` method.
    * `filterCodeBlock` - (optional) A function that decides which code blocks the linter should adopt. The function receives two arguments. The first argument is the virtual filename of a code block. The second argument is the text of the code block. If the function returned `true` then the linter adopts the code block. If the function was omitted, the linter adopts only `*.js` code blocks. If you provided a `filterCodeBlock` function, it overrides this default behavior, so the linter doesn't adopt `*.js` code blocks automatically.
    * `disableFixes` - (optional) when set to `true`, the linter doesn't make either the `fix` or `suggestions` property of the lint result.
    * `allowInlineConfig` - (optional) set to `false` to disable inline comments from changing ESLint rules.
    * `reportUnusedDisableDirectives` - (optional) when set to `true`, adds reported errors for unused `eslint-disable` directives when no problems would be reported in the disabled area anyway.

If the third argument is a string, it is interpreted as the `filename`.

You can call `verify()` like this:

```js
const Linter = require("eslint").Linter;
const linter = new Linter();

const messages = linter.verify("var foo;", {
    rules: {
        semi: 2
    }
}, { filename: "foo.js" });

// or using SourceCode

const Linter = require("eslint").Linter,
    linter = new Linter(),
    SourceCode = require("eslint").SourceCode;

const code = new SourceCode("var foo = bar;", ast);

const messages = linter.verify(code, {
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
* `suggestions` - an array of objects describing possible lint fixes for editors to programmatically enable (see details in the [Working with Rules docs](../extend/custom-rules#providing-suggestions)).

You can get the suppressed messages from the previous run by `getSuppressedMessages()` method. If there is not a previous run, `getSuppressedMessage()` will return an empty list.

```js
const Linter = require("eslint").Linter;
const linter = new Linter();

const messages = linter.verify("var foo = bar; // eslint-disable-line -- Need to suppress", {
    rules: {
        semi: ["error", "never"]
    }
}, { filename: "foo.js" });
const suppressedMessages = linter.getSuppressedMessages();

console.log(suppressedMessages[0].suppressions); // [{ "kind": "directive", "justification": "Need to suppress" }]
```

Linting message objects have a deprecated `source` property. This property **will be removed** from linting messages in an upcoming breaking release. If you depend on this property, you should now use the `SourceCode` instance provided by the linter.

You can also get an instance of the `SourceCode` object used inside of `linter` by using the `getSourceCode()` method:

```js
const Linter = require("eslint").Linter;
const linter = new Linter();

const messages = linter.verify("var foo = bar;", {
    rules: {
        semi: 2
    }
}, { filename: "foo.js" });

const code = linter.getSourceCode();

console.log(code.text);     // "var foo = bar;"
```

In this way, you can retrieve the text and AST used for the last run of `linter.verify()`.

### Linter#verifyAndFix()

This method is similar to verify except that it also runs autofixing logic, similar to the `--fix` flag on the command line. The result object will contain the autofixed code, along with any remaining linting messages for the code that were not autofixed.

```js
const Linter = require("eslint").Linter;
const linter = new Linter();

const messages = linter.verifyAndFix("var foo", {
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

Each instance of `Linter` holds a map of custom parsers. If you want to define a parser programmatically, you can add this function
with the name of the parser as first argument and the [parser object](../extend/custom-parsers) as second argument. The default `"espree"` parser will already be loaded for every `Linter` instance.

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

---

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
* The rule object itself (see ["working with rules"](../extend/custom-rules))
* An object containing `valid` and `invalid` properties, each of which is an array containing test cases.

A test case is an object with the following properties:

* `name` (string, optional): The name to use for the test case, to make it easier to find
* `code` (string, required): The source code that the rule should be run on
* `options` (array, optional): The options passed to the rule. The rule severity should not be included in this list.
* `filename` (string, optional): The filename for the given case (useful for rules that make assertions about filenames).
* `only` (boolean, optional): Run this case exclusively for debugging in supported test frameworks.

In addition to the properties above, invalid test cases can also have the following properties:

* `errors` (number or array, required): Asserts some properties of the errors that the rule is expected to produce when run on this code. If this is a number, asserts the number of errors produced. Otherwise, this should be a list of objects, each containing information about a single reported error. The following properties can be used for an error (all are optional):
    * `message` (string/regexp): The message for the error
    * `messageId` (string): The Id for the error. See [testing errors with messageId](#testing-errors-with-messageid) for details
    * `data` (object): Placeholder data which can be used in combination with `messageId`
    * `type` (string): The type of the reported AST node
    * `line` (number): The 1-based line number of the reported location
    * `column` (number): The 1-based column number of the reported location
    * `endLine` (number): The 1-based line number of the end of the reported location
    * `endColumn` (number): The 1-based column number of the end of the reported location
    * `suggestions` (array): An array of objects with suggestion details to check. See [Testing Suggestions](#testing-suggestions) for details

    If a string is provided as an error instead of an object, the string is used to assert the `message` of the error.
* `output` (string, required if the rule fixes code): Asserts the output that will be produced when using this rule for a single pass of autofixing (e.g. with the `--fix` command line flag). If this is `null`, asserts that none of the reported problems suggest autofixes.

Any additional properties of a test case will be passed directly to the linter as config options. For example, a test case can have a `parserOptions` property to configure parser behavior:

```js
{
    code: "let foo;",
    parserOptions: { ecmaVersion: 2015 }
}
```

If a valid test case only uses the `code` property, it can optionally be provided as a string containing the code, rather than an object with a `code` key.

### Testing errors with `messageId`

If the rule under test uses `messageId`s, you can use `messageId` property in a test case to assert reported error's `messageId` instead of its `message`.

```js
{
    code: "let foo;",
    errors: [{ messageId: "unexpected" }]
}
```

For messages with placeholders, a test case can also use `data` property to additionally assert reported error's `message`.

```js
{
    code: "let foo;",
    errors: [{ messageId: "unexpected", data: { name: "foo" } }]
}
```

Please note that `data` in a test case does not assert `data` passed to `context.report`. Instead, it is used to form the expected message text which is then compared with the received `message`.

### Testing Suggestions

Suggestions can be tested by defining a `suggestions` key on an errors object. The options to check for the suggestions are the following (all are optional):

* `desc` (string): The suggestion `desc` value
* `messageId` (string): The suggestion `messageId` value for suggestions that use `messageId`s
* `data` (object): Placeholder data which can be used in combination with `messageId`
* `output` (string): A code string representing the result of applying the suggestion fix to the input code

Example:

```js
ruleTester.run("my-rule-for-no-foo", rule, {
    valid: [],
    invalid: [{
        code: "var foo;",
        errors: [{
            suggestions: [{
                desc: "Rename identifier 'foo' to 'bar'",
                output: "var bar;"
            }]
        }]
    }]
})
```

`messageId` and `data` properties in suggestion test objects work the same way as in error test objects. See [testing errors with messageId](#testing-errors-with-messageid) for details.

```js
ruleTester.run("my-rule-for-no-foo", rule, {
    valid: [],
    invalid: [{
        code: "var foo;",
        errors: [{
            suggestions: [{
                messageId: "renameFoo",
                data: { newName: "bar" },
                output: "var bar;"
            }]
        }]
    }]
})
```

### Customizing RuleTester

`RuleTester` depends on two functions to run tests: `describe` and `it`. These functions can come from various places:

1. If `RuleTester.describe` and `RuleTester.it` have been set to function values, `RuleTester` will use `RuleTester.describe` and `RuleTester.it` to run tests. You can use this to customize the behavior of `RuleTester` to match a test framework that you're using.

    If `RuleTester.itOnly` has been set to a function value, `RuleTester` will call `RuleTester.itOnly` instead of `RuleTester.it` to run cases with `only: true`. If `RuleTester.itOnly` is not set but `RuleTester.it` has an `only` function property, `RuleTester` will fall back to `RuleTester.it.only`.

2. Otherwise, if `describe` and `it` are present as globals, `RuleTester` will use `global.describe` and `global.it` to run tests and `global.it.only` to run cases with `only: true`. This allows `RuleTester` to work when using frameworks like [Mocha](https://mochajs.org/) without any additional configuration.
3. Otherwise, `RuleTester#run` will simply execute all of the tests in sequence, and will throw an error if one of them fails. This means you can simply execute a test file that calls `RuleTester.run` using `Node.js`, without needing a testing framework.

`RuleTester#run` calls the `describe` function with two arguments: a string describing the rule, and a callback function. The callback calls the `it` function with a string describing the test case, and a test function. The test function will return successfully if the test passes, and throw an error if the test fails. The signature for `only` is the same as `it`. `RuleTester` calls either `it` or `only` for every case even when some cases have `only: true`, and the test framework is responsible for implementing test case exclusivity. (Note that this is the standard behavior for test suites when using frameworks like [Mocha](https://mochajs.org/); this information is only relevant if you plan to customize `RuleTester.describe`, `RuleTester.it`, or `RuleTester.itOnly`.)

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

---

[configuration object]: ../use/configure/
[builtin-formatters]: ../use/formatters/
[third-party-formatters]: https://www.npmjs.com/search?q=eslintformatter
[eslint-lintfiles]: #-eslintlintfilespatterns
[eslint-linttext]: #-eslintlinttextcode-options
[eslint-loadformatter]: #-eslintloadformatternameorpath
[lintresult]: #-lintresult-type
[lintmessage]: #-lintmessage-type
[suppressedlintmessage]: #-suppressedlintmessage-type
[editinfo]: #-editinfo-type
[loadedformatter]: #-loadedformatter-type
