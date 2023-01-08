---
title: Command Line Interface Reference
eleventyNavigation:
    key: command line interface
    parent: use eslint
    title: Command Line Interface Reference
    order: 4

---

The ESLint Command Line Interface (CLI) lets you execute linting from the terminal. The CLI has a variety of options that you can pass to configure ESLint.

## Run the CLI

ESLint requires Node.js for installation. Follow the instructions in the [Getting Started Guide](getting-started) to install ESLint.

Most users use [`npx`](https://docs.npmjs.com/cli/v8/commands/npx) to run ESLint on the command line like this:

```shell
npx eslint [options] [file|dir|glob]*
```

Such as:

```shell
# Run on two files
npx eslint file1.js file2.js

# Run on multiple files
npx eslint lib/**
```

Please note that when passing a glob as a parameter, it is expanded by your shell. The results of the expansion can vary depending on your shell, and its configuration. If you want to use node `glob` syntax, you have to quote your parameter (using double quotes if you need it to run in Windows), as follows:

```shell
npx eslint "lib/**"
```

**Note:** You can also use alternative package managers such as [Yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/) to run ESLint. Please refer to your package manager's documentation for the correct syntax.

## Pass Multiple Values to an Option

Options that accept multiple values can be specified by repeating the option or with a comma-delimited list (other than [`--ignore-pattern`](#--ignore-pattern), which does not allow the second style).

Examples of options that accept multiple values:

```shell
npx eslint --ext .jsx --ext .js lib/
# OR
npx eslint --ext .jsx,.js lib/
```

## Options

You can view all the CLI options by running `npx eslint -h`.

```txt
eslint [options] file.js [file.js] [dir]

Basic configuration:
  --no-eslintrc                   Disable use of configuration from .eslintrc.*
  -c, --config path::String       Use this configuration, overriding .eslintrc.* config options if present
  --env [String]                  Specify environments
  --ext [String]                  Specify JavaScript file extensions
  --global [String]               Define global variables
  --parser String                 Specify the parser to be used
  --parser-options Object         Specify parser options
  --resolve-plugins-relative-to path::String  A folder where plugins should be resolved from, CWD by default

Specify rules and plugins:
  --plugin [String]               Specify plugins
  --rule Object                   Specify rules
  --rulesdir [path::String]       Load additional rules from this directory. Deprecated: Use rules from plugins

Fix problems:
  --fix                           Automatically fix problems
  --fix-dry-run                   Automatically fix problems without saving the changes to the file system
  --fix-type Array                Specify the types of fixes to apply (directive, problem, suggestion, layout)

Ignore files:
  --ignore-path path::String      Specify path of ignore file
  --no-ignore                     Disable use of ignore files and patterns
  --ignore-pattern [String]       Pattern of files to ignore (in addition to those in .eslintignore)

Use stdin:
  --stdin                         Lint code provided on <STDIN> - default: false
  --stdin-filename String         Specify filename to process STDIN as

Handle warnings:
  --quiet                         Report errors only - default: false
  --max-warnings Int              Number of warnings to trigger nonzero exit code - default: -1

Output:
  -o, --output-file path::String  Specify file to write report to
  -f, --format String             Use a specific output format - default: stylish
  --color, --no-color             Force enabling/disabling of color

Inline configuration comments:
  --no-inline-config              Prevent comments from changing config or rules
  --report-unused-disable-directives  Adds reported errors for unused eslint-disable directives

Caching:
  --cache                         Only check changed files - default: false
  --cache-file path::String       Path to the cache file. Deprecated: use --cache-location - default: .eslintcache
  --cache-location path::String   Path to the cache file or directory
  --cache-strategy String         Strategy to use for detecting changed files in the cache - either: metadata or content - default: metadata

Miscellaneous:
  --init                          Run config initialization wizard - default: false
  --env-info                      Output execution environment information - default: false
  --no-error-on-unmatched-pattern  Prevent errors when pattern is unmatched
  --exit-on-fatal-error           Exit with exit code 2 in case of fatal error - default: false
  --debug                         Output debugging information
  -h, --help                      Show help
  -v, --version                   Output the version number
  --print-config path::String     Print the configuration for the given file
```

### Basic Configuration

#### `--no-eslintrc`

Disables use of configuration from `.eslintrc.*` and `package.json` files.

* **Argument Type**: No argument.

##### `--no-eslintrc` example

```shell
npx eslint --no-eslintrc file.js
```

#### `-c`, `--config`

This option allows you to specify an additional configuration file for ESLint (see [Configuring ESLint](configure/) for more).

* **Argument Type**: String. Path to file.
* **Multiple Arguments**: No

##### `-c`, `--config` example

```shell
npx eslint -c ~/my-eslint.json file.js
```

This example uses the configuration file at `~/my-eslint.json`.

If `.eslintrc.*` and/or `package.json` files are also used for configuration (i.e., `--no-eslintrc` was not specified), the configurations are merged. Options from this configuration file have precedence over the options from `.eslintrc.*` and `package.json` files.

#### `--env`

This option enables specific environments.

* **Argument Type**: String. One of the available environments.
* **Multiple Arguments**: Yes

Details about the global variables defined by each environment are available in the [Specifying Environments](configure/language-options#specifying-environments) documentation. This option only enables environments. It does not disable environments set in other configuration files. To specify multiple environments, separate them using commas, or use the option multiple times.

##### `--env` example

```shell
npx eslint --env browser,node file.js
npx eslint --env browser --env node file.js
```

#### `--ext`

This option allows you to specify which file extensions ESLint uses when searching for target files in the directories you specify.

* **Argument Type**: String. File extension.
* **Multiple Arguments**: Yes
* **Default Value**: `.js` and the files that match the `overrides` entries of your configuration.

`--ext` is only used when the the patterns to lint are directories. If you use glob patterns or file names, then `--ext` is ignored. For example, `npx eslint "lib/*" --ext .js` matches all files within the `lib/` directory, regardless of extension.

##### `--ext` example

```shell
# Use only .ts extension
npx eslint . --ext .ts

# Use both .js and .ts
npx eslint . --ext .js --ext .ts

# Also use both .js and .ts
npx eslint . --ext .js,.ts
```

#### `--global`

This option defines global variables so that they are not  flagged as undefined by the [`no-undef`](../rules/no-undef) rule.

* **Argument Type**: String. Name of the global variable. Any specified global variables are assumed to be read-only by default, but appending `:true` to a variable's name ensures that `no-undef` also allows writes.
* **Multiple Arguments**: Yes

##### `--global` example

```shell
npx eslint --global require,exports:true file.js
npx eslint --global require --global exports:true
```

#### `--parser`

This option allows you to specify a parser to be used by ESLint.

* **Argument Type**: String. Parser to be used by ESLint.
* **Multiple Arguments**: No
* **Default Value**: `espree`

##### `--parser` example

```shell
# Use TypeScript ESLint parser
npx eslint --parser @typescript-eslint/parser file.ts
```

#### `--parser-options`

This option allows you to specify parser options to be used by ESLint. The available parser options are determined by the parser being used.

* **Argument Type**: Key/value pair separated by colon (`:`).
* **Multiple Arguments**: Yes

##### `--parser-options` example

```shell
echo '3 ** 4' | npx eslint --stdin --parser-options ecmaVersion:6 # fails with a parsing error
echo '3 ** 4' | npx eslint --stdin --parser-options ecmaVersion:7 # succeeds, yay!
```

#### `--resolve-plugins-relative-to`

Changes the directory where plugins are resolved from.

* **Argument Type**: String. Path to directory.
* **Multiple Arguments**: No
* **Default Value**: By default, plugins are resolved from the directory in which your configuration file is found.

This option should be used when plugins were installed by someone other than the end user. It should be set to the project directory of the project that has a dependency on the necessary plugins.

For example:

* When using a config file that is located outside of the current project (with the `--config` flag), if the config uses plugins which are installed locally to itself, `--resolve-plugins-relative-to` should be set to the directory containing the config file.
* If an integration has dependencies on ESLint and a set of plugins, and the tool invokes ESLint on behalf of the user with a preset configuration, the tool should set `--resolve-plugins-relative-to` to the top-level directory of the tool.

##### `--resolve-plugins-relative-to` example

```shell
npx eslint --config ~/personal-eslintrc.js \
--resolve-plugins-relative-to /usr/local/lib/
```

### Specify Rules and Plugins

#### `--plugin`

This option specifies a plugin to load.

* **Argument Type**: String. Plugin name. You can optionally omit the prefix `eslint-plugin-` from the plugin name.
* **Multiple Arguments**: Yes

Before using the plugin, you have to install it using npm.

##### `--plugin` example

```shell
npx eslint --plugin jquery file.js
npx eslint --plugin eslint-plugin-mocha file.js
```

#### `--rule`

This option specifies the rules to be used.

* **Argument Type**: Rules and their configuration specified with [levn](https://github.com/gkz/levn#levn--) format.
* **Multiple Arguments**: Yes

These rules are merged with any rules specified with configuration files. If the rule is defined in a plugin, you have to prefix the rule ID with the plugin name and a `/`.

To ignore rules in `.eslintrc` configuration files and only run rules specified in the command line, use the `--rules` flag in combination with the [`--no-eslintrc`](#--no-eslintrc) flag.

##### `--rule` example

```shell
# Apply single rule
npx eslint --rule 'quotes: [error, double]'
# Apply multiple rules
npx eslint --rule 'guard-for-in: error' --rule 'brace-style: [error, 1tbs]'
# Apply rule from jquery plugin
npx eslint --rule 'jquery/dollar-sign: error'
# Only apply rule from the command line
npx eslint --rule 'quotes: [error, double]' --no-eslintrc
```

#### `--rulesdir`

**Deprecated**: Use rules from plugins instead.

This option allows you to specify another directory from which to load rules files. This allows you to dynamically load new rules at run time. This is useful when you have custom rules that aren't suitable for being bundled with ESLint.

* **Argument Type**: String. Path to directory. The rules in your custom rules directory must follow the same format as bundled rules to work properly.
* **Multiple Arguments**: Yes.

Note that, as with core rules and plugin rules, you still need to enable the rules in configuration or via the `--rule` CLI option in order to actually run those rules during linting. Specifying a rules directory with `--rulesdir` does not automatically enable the rules within that directory.

##### `--rulesdir` example

```shell
npx eslint --rulesdir my-rules/ file.js
npx eslint --rulesdir my-rules/ --rulesdir my-other-rules/ file.js
```

### Fix Problems

#### `--fix`

This option instructs ESLint to try to fix as many issues as possible. The fixes are made to the actual files themselves and only the remaining unfixed issues are output.

* **Argument Type**: No argument.

Not all problems are fixable using this option, and the option does not work in these situations:

1. This option throws an error when code is piped to ESLint.
1. This option has no effect on code that uses a processor, unless the processor opts into allowing autofixes.

If you want to fix code from `stdin` or otherwise want to get the fixes without actually writing them to the file, use the [`--fix-dry-run`](#--fix-dry-run) option.

##### `--fix` example

```shell
npx eslint --fix file.js
```

#### `--fix-dry-run`

This option has the same effect as `--fix` with the difference that the fixes are not saved to the file system. Because the default formatter does not output the fixed code, you'll have to use another formatter (e.g. `--format json`) to get the fixes.

* **Argument Type**: No argument.

This makes it possible to fix code from `stdin` when used with the `--stdin` flag.

This flag can be useful for integrations (e.g. editor plugins) which need to autofix text from the command line without saving it to the filesystem.

##### `--fix-dry-run` example

```shell
getSomeText | npx eslint --stdin --fix-dry-run --format json
```

#### `--fix-type`

This option allows you to specify the type of fixes to apply when using either `--fix` or `--fix-dry-run`.

* **Argument Type**: String. One of the following fix types:
  1. `problem` - fix potential errors in the code
  1. `suggestion` - apply fixes to the code that improve it
  1. `layout` - apply fixes that do not change the program structure (AST)
  1. `directive` - apply fixes to inline directives such as `// eslint-disable`
* **Multiple Arguments**: Yes

This option is helpful if you are using another program to format your code, but you would still like ESLint to apply other types of fixes.

##### `--fix-type` example

```shell
npx eslint --fix --fix-type suggestion .
npx eslint --fix --fix-type suggestion --fix-type problem .
npx eslint --fix --fix-type suggestion,layout .
```

### Ignore Files

#### `--ignore-path`

This option allows you to specify the file to use as your `.eslintignore`.

* **Argument Type**: String. Path to file.
* **Multiple Arguments**: No
* **Default Value**:  By default, ESLint looks for `.eslintignore` in the current working directory.

**Note:** `--ignore-path` is not supported when using [flat configuration](./configure/configuration-files-new) (`eslint.config.js`).

##### `--ignore-path` example

```shell
npx eslint --ignore-path tmp/.eslintignore file.js
npx eslint --ignore-path .gitignore file.js
```

#### `--no-ignore`

Disables excluding of files from `.eslintignore` files, `--ignore-path` flags, `--ignore-pattern` flags, and the `ignorePatterns` property in config files.

* **Argument Type**: No argument.

##### `--no-ignore` example

```shell
npx eslint --no-ignore file.js
```

#### `--ignore-pattern`

This option allows you to specify patterns of files to ignore (in addition to those in `.eslintignore`).

* **Argument Type**: String. The supported syntax is the same as for [`.eslintignore` files](configure/ignore#the-eslintignore-file), which use the same patterns as the [`.gitignore` specification](https://git-scm.com/docs/gitignore). You should quote your patterns in order to avoid shell interpretation of glob patterns.
* **Multiple Arguments**: Yes

##### `--ignore-pattern` example

```shell
npx eslint --ignore-pattern "/lib/" --ignore-pattern "/src/vendor/*" .
```

### Use stdin

#### `--stdin`

This option tells ESLint to read and lint source code from STDIN instead of from files. You can use this to pipe code to ESLint.

* **Argument Type**: No argument.

##### `--stdin` example

```shell
cat myfile.js | npx eslint --stdin
```

#### `--stdin-filename`

This option allows you to specify a filename to process STDIN as.

* **Argument Type**: String. Path to file.
* **Multiple Arguments**: No

This is useful when processing files from STDIN and you have rules which depend on the filename.

##### `--stdin-filename` example

```shell
cat myfile.js | npx eslint --stdin --stdin-filename myfile.js
```

### Handle Warnings

#### `--quiet`

This option allows you to disable reporting on warnings. If you enable this option, only errors are reported by ESLint.

* **Argument Type**: No argument.

##### `--quiet` example

```shell
npx eslint --quiet file.js
```

#### `--max-warnings`

This option allows you to specify a warning threshold, which can be used to force ESLint to exit with an error status if there are too many warning-level rule violations in your project.

* **Argument Type**: Integer. The maximum number of warnings to allow. To prevent this behavior, do not use this option or specify `-1` as the argument.
* **Multiple Arguments**: No

Normally, if ESLint runs and finds no errors (only warnings), it exits with a success exit status. However, if `--max-warnings` is specified and the total warning count is greater than the specified threshold, ESLint exits with an error status.

##### `--max-warnings` example

```shell
npx eslint --max-warnings 10 file.js
```

### Output

#### `-o`, `--output-file`

Write the output of linting results to a specified file.

* **Argument Type**: String. Path to file.
* **Multiple Arguments**: No

##### `-o`, `--output-file` example

```shell
npx eslint -o ./test/test.html
```

#### `-f`, `--format`

This option specifies the output format for the console.

* **Argument Type**: String. One of the [built-in formatters](formatters/) or a custom formatter.
* **Multiple Arguments**: No
* **Default Value**: [`stylish`](formatters/#stylish)

If you are using a custom formatter defined in a local file, you can specify the path to the custom formatter file.

An npm-installed formatter is resolved with or without `eslint-formatter-` prefix.

When specified, the given format is output to the console. If you'd like to save that output into a file, you can do so on the command line like so:

```shell
# Saves the output into the `results.txt` file.
npx eslint -f compact file.js > results.txt
```

##### `-f`, `--format` example

Use the built-in `compact` formatter:

```shell
npx eslint --format compact file.js
```

Use a local custom formatter:

```shell
npx eslint -f ./customformat.js file.js
```

Use an npm-installed formatter:

```shell
npm install eslint-formatter-pretty

# Then run one of the following commands
npx eslint -f pretty file.js
# or alternatively
npx eslint -f eslint-formatter-pretty file.js
```

#### `--color` and `--no-color`

These options force the enabling/disabling of colorized output.

* **Argument Type**: No argument.

You can use these options to override the default behavior, which is to enable colorized output unless no TTY is detected, such as when piping `eslint` through `cat` or `less`.

##### `--color` and `--no-color` example

```shell
npx eslint --color file.js | cat
npx eslint --no-color file.js
```

### Inline Configuration Comments

#### `--no-inline-config`

This option prevents inline comments like `/*eslint-disable*/` or
`/*global foo*/` from having any effect.

* **Argument Type**: No argument.

This allows you to set an ESLint config without files modifying it. All inline config comments are ignored, such as:

* `/*eslint-disable*/`
* `/*eslint-enable*/`
* `/*global*/`
* `/*eslint*/`
* `/*eslint-env*/`
* `// eslint-disable-line`
* `// eslint-disable-next-line`

##### `--no-inline-config` example

```shell
npx eslint --no-inline-config file.js
```

#### `--report-unused-disable-directives`

This option causes ESLint to report directive comments like `// eslint-disable-line` when no errors would have been reported on that line anyway.

* **Argument Type**: No argument.

This can be useful to prevent future errors from unexpectedly being suppressed, by cleaning up old `eslint-disable` comments which are no longer applicable.

::: warning
When using this option, it is possible that new errors start being reported whenever ESLint or custom rules are upgraded.

For example, suppose a rule has a bug that causes it to report a false positive, and an `eslint-disable` comment is added to suppress the incorrect report. If the bug is then fixed in a patch release of ESLint, the `eslint-disable` comment becomes unused since ESLint is no longer generating an incorrect report. This results in a new reported error for the unused directive if the `report-unused-disable-directives` option is used.
:::

##### `--report-unused-disable-directives` example

```shell
npx eslint --report-unused-disable-directives file.js
```

### Caching

#### `--cache`

Store the info about processed files in order to only operate on the changed ones. Enabling this option can dramatically improve ESLint's run time performance by ensuring that only changed files are linted.
The cache is stored in `.eslintcache` by default.

* **Argument Type**: No argument.

If you run ESLint with `--cache` and then run ESLint without `--cache`, the `.eslintcache` file will be deleted. This is necessary because the results of the lint might change and make `.eslintcache` invalid. If you want to control when the cache file is deleted, then use `--cache-location` to specify an alternate location for the cache file.

Autofixed files are not placed in the cache. Subsequent linting that does not trigger an autofix will place it in the cache.

##### `--cache` example

```shell
npx eslint --cache file.js
```

#### `--cache-file`

**Deprecated**: Use `--cache-location` instead.

Path to the cache file. If none specified `.eslintcache` is used. The file is created in the directory where the `eslint` command is executed.

#### `--cache-location`

Specify the path to the cache location. Can be a file or a directory.

* **Argument Type**: String. Path to file or directory. If a directory is specified, a cache file is created inside the specified folder. The name of the file is based on the hash of the current working directory, e.g.: `.cache_hashOfCWD`.
* **Multiple Arguments**: No
* **Default Value**: If no location is specified, `.eslintcache` is used. The file is created in the directory where the `eslint` command is executed.

If the directory for the cache does not exist make sure you add a trailing `/` on \*nix systems or `\` on Windows. Otherwise, the path is assumed to be a file.

##### `--cache-location` example

```shell
npx eslint "src/**/*.js" --cache --cache-location "/Users/user/.eslintcache/"
```

#### `--cache-strategy`

Strategy for the cache to use for detecting changed files.

* **Argument Type**: String. One of the following values:
  1. `metadata`
  1. `content`
* **Multiple Arguments**: No
* **Default Value**: `metadata`

The `content` strategy can be useful in cases where the modification time of your files changes even if their contents have not. For example, this can happen during git operations like `git clone` because git does not track file modification time.

##### `--cache-strategy` example

```shell
npx eslint "src/**/*.js" --cache --cache-strategy content
```

### Miscellaneous

#### `--init`

This option runs `npm init @eslint/config` to start the config initialization wizard. It's designed to help new users quickly create an `.eslintrc` file by answering a few questions. When you use this flag, the CLI does not perform linting.

* **Argument Type**: No argument.

The resulting configuration file is created in the current directory.

##### `--init` example

```shell
npx eslint --init
```

#### `--env-info`

This option outputs information about the execution environment, including the version of Node.js, npm, and local and global installations of ESLint.

* **Argument Type**: No argument.

The ESLint team may ask for this information to help solve bugs. When you use this flag, the CLI does not perform linting.

##### `--env-info` example

```shell
npx eslint --env-info
```

#### `--no-error-on-unmatched-pattern`

This option prevents errors when a quoted glob pattern or `--ext` is unmatched. This does not prevent errors when your shell can't match a glob.

* **Argument Type**: No argument.

##### `--no-error-on-unmatched-pattern` example

```shell
npx eslint --no-error-on-unmatched-pattern --ext .ts "lib/*"
```

#### `--exit-on-fatal-error`

This option causes ESLint to exit with exit code 2 if one or more fatal parsing errors occur. Without this option, ESLint reports fatal parsing errors as rule violations.

* **Argument Type**: No argument.

##### `--exit-on-fatal-error` example

```shell
npx eslint --exit-on-fatal-error file.js
```

#### `--debug`

This option outputs debugging information to the console. Add this flag to an ESLint command line invocation in order to get extra debugging information while the command runs.

* **Argument Type**: No argument.

This information is useful when you're seeing a problem and having a hard time pinpointing it. The ESLint team may ask for this debugging information to help solve bugs.

##### `--debug` example

```shell
npx eslint --debug test.js
```

#### `-h`, `--help`

This option outputs the help menu, displaying all of the available options. All other options are ignored when this is present. When you use this flag, the CLI does not perform linting.

* **Argument Type**: No argument.

##### `-h`, `--help` example

```shell
npx eslint --help
```

#### `-v`, `--version`

This option outputs the current ESLint version onto the console. All other options are ignored when this is present. When you use this flag, the CLI does not perform linting.

* **Argument Type**: No argument.

##### `-v`, `--version` example

```shell
npx eslint --version
```

#### `--print-config`

This option outputs the configuration to be used for the file passed. When present, no linting is performed and only config-related options are valid. When you use this flag, the CLI does not perform linting.

* **Argument Type**: String. Path to file.
* **Multiple Arguments**: No

##### `--print-config` example

```shell
npx eslint --print-config file.js
```

## Exit Codes

When linting files, ESLint exits with one of the following exit codes:

* `0`: Linting was successful and there are no linting errors. If the [`--max-warnings`](#--max-warnings) flag is set to `n`, the number of linting warnings is at most `n`.
* `1`: Linting was successful and there is at least one linting error, or there are more linting warnings than allowed by the `--max-warnings` option.
* `2`: Linting was unsuccessful due to a configuration problem or an internal error.
