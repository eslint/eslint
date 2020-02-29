# Configuring ESLint

ESLint is designed to be completely configurable, meaning you can turn off every rule and run only with basic syntax validation, or mix and match the bundled rules and your custom rules to make ESLint perfect for your project. There are two primary ways to configure ESLint:

1. **Configuration Comments** - use JavaScript comments to embed configuration information directly into a file.
1. **Configuration Files** - use a JavaScript, JSON or YAML file to specify configuration information for an entire directory and all of its subdirectories. This can be in the form of an [`.eslintrc.*`](#configuration-file-formats) file or an `eslintConfig` field in a [`package.json`](https://docs.npmjs.com/files/package.json) file, both of which ESLint will look for and read automatically, or you can specify a configuration file on the [command line](command-line-interface).

There are several pieces of information that can be configured:

* **Environments** - which environments your script is designed to run in. Each environment brings with it a certain set of predefined global variables.
* **Globals** - the additional global variables your script accesses during execution.
* **Rules** - which rules are enabled and at what error level.

All of these options give you fine-grained control over how ESLint treats your code.

## Specifying Parser Options

ESLint allows you to specify the JavaScript language options you want to support. By default, ESLint expects ECMAScript 5 syntax. You can override that setting to enable support for other ECMAScript versions as well as JSX by using parser options.

Please note that supporting JSX syntax is not the same as supporting React. React applies specific semantics to JSX syntax that ESLint doesn't recognize. We recommend using [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react) if you are using React and want React semantics.
By the same token, supporting ES6 syntax is not the same as supporting new ES6 globals (e.g., new types such as
`Set`).
For ES6 syntax, use `{ "parserOptions": { "ecmaVersion": 6 } }`; for new ES6 global variables, use `{ "env":
{ "es6": true } }`. `{ "env": { "es6": true } }` enables ES6 syntax automatically, but `{ "parserOptions": { "ecmaVersion": 6 } }` does not enable ES6 globals automatically.
Parser options are set in your `.eslintrc.*` file by using the `parserOptions` property. The available options are:

* `ecmaVersion` - set to 3, 5 (default), 6, 7, 8, 9, 10 or 11 to specify the version of ECMAScript syntax you want to use. You can also set to 2015 (same as 6), 2016 (same as 7), 2017 (same as 8), 2018 (same as 9), 2019 (same as 10) or 2020 (same as 11) to use the year-based naming.
* `sourceType` - set to `"script"` (default) or `"module"` if your code is in ECMAScript modules.
* `ecmaFeatures` - an object indicating which additional language features you'd like to use:
    * `globalReturn` - allow `return` statements in the global scope
    * `impliedStrict` - enable global [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) (if `ecmaVersion` is 5 or greater)
    * `jsx` - enable [JSX](https://facebook.github.io/jsx/)

Here's an example `.eslintrc.json` file:

```json
{
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "rules": {
        "semi": "error"
    }
}
```

Setting parser options helps ESLint determine what is a parsing error. All language options are `false` by default.

## Specifying Parser

By default, ESLint uses [Espree](https://github.com/eslint/espree) as its parser. You can optionally specify that a different parser should be used in your configuration file so long as the parser meets the following requirements:

1. It must be a Node module loadable from the config file where it appears. Usually, this means you should install the parser package separately using npm.
1. It must conform to the [parser interface](/docs/developer-guide/working-with-custom-parsers.md).

Note that even with these compatibilities, there are no guarantees that an external parser will work correctly with ESLint and ESLint will not fix bugs related to incompatibilities with other parsers.

To indicate the npm module to use as your parser, specify it using the `parser` option in your `.eslintrc` file. For example, the following specifies to use Esprima instead of Espree:

```json
{
    "parser": "esprima",
    "rules": {
        "semi": "error"
    }
}
```

The following parsers are compatible with ESLint:

* [Esprima](https://www.npmjs.com/package/esprima)
* [Babel-ESLint](https://www.npmjs.com/package/babel-eslint) - A wrapper around the [Babel](https://babeljs.io) parser that makes it compatible with ESLint.
* [@typescript-eslint/parser](https://www.npmjs.com/package/@typescript-eslint/parser) - A parser that converts TypeScript into an ESTree-compatible form so it can be used in ESLint.

Note when using a custom parser, the `parserOptions` configuration property is still required for ESLint to work properly with features not in ECMAScript 5 by default. Parsers are all passed `parserOptions` and may or may not use them to determine which features to enable.

## Specifying Processor

Plugins may provide processors. Processors can extract JavaScript code from another kind of files, then lets ESLint lint the JavaScript code. Or processors can convert JavaScript code in preprocessing for some purpose.

To specify processors in a configuration file, use the `processor` key with the concatenated string of a plugin name and a processor name by a slash. For example, the following enables the processor `a-processor` that the plugin `a-plugin` provided:

```json
{
    "plugins": ["a-plugin"],
    "processor": "a-plugin/a-processor"
}
```

To specify processors for a specific kind of files, use the combination of the `overrides` key and the `processor` key. For example, the following uses the processor `a-plugin/markdown` for `*.md` files.

```json
{
    "plugins": ["a-plugin"],
    "overrides": [
        {
            "files": ["*.md"],
            "processor": "a-plugin/markdown"
        }
    ]
}
```

Processors may make named code blocks such as `0.js` and `1.js`. ESLint handles such a named code block as a child file of the original file. You can specify additional configurations for named code blocks in the `overrides` section of the config. For example, the following disables `strict` rule for the named code blocks which end with `.js` in markdown files.

```json
{
    "plugins": ["a-plugin"],
    "overrides": [
        {
            "files": ["*.md"],
            "processor": "a-plugin/markdown"
        },
        {
            "files": ["**/*.md/*.js"],
            "rules": {
                "strict": "off"
            }
        }
    ]
}
```

ESLint checks the file path of named code blocks then ignores those if any `overrides` entry didn't match the file path. Be sure to make `overrides` entry if you wanted to lint named code blocks other than `*.js`.

## Specifying Environments

An environment defines global variables that are predefined. The available environments are:

* `browser` - browser global variables.
* `node` - Node.js global variables and Node.js scoping.
* `commonjs` - CommonJS global variables and CommonJS scoping (use this for browser-only code that uses Browserify/WebPack).
* `shared-node-browser` - Globals common to both Node.js and Browser.
* `es6` - enable all ECMAScript 6 features except for modules (this automatically sets the `ecmaVersion` parser option to 6).
* `es2017` - adds all ECMAScript 2017 globals and automatically sets the `ecmaVersion` parser option to 8.
* `es2020` - adds all ECMAScript 2020 globals and automatically sets the `ecmaVersion` parser option to 11.
* `worker` - web workers global variables.
* `amd` - defines `require()` and `define()` as global variables as per the [amd](https://github.com/amdjs/amdjs-api/wiki/AMD) spec.
* `mocha` - adds all of the Mocha testing global variables.
* `jasmine` - adds all of the Jasmine testing global variables for version 1.3 and 2.0.
* `jest` - Jest global variables.
* `phantomjs` - PhantomJS global variables.
* `protractor` - Protractor global variables.
* `qunit` - QUnit global variables.
* `jquery` - jQuery global variables.
* `prototypejs` - Prototype.js global variables.
* `shelljs` - ShellJS global variables.
* `meteor` - Meteor global variables.
* `mongo` - MongoDB global variables.
* `applescript` - AppleScript global variables.
* `nashorn` - Java 8 Nashorn global variables.
* `serviceworker` - Service Worker global variables.
* `atomtest` - Atom test helper globals.
* `embertest` - Ember test helper globals.
* `webextensions` - WebExtensions globals.
* `greasemonkey` - GreaseMonkey globals.

These environments are not mutually exclusive, so you can define more than one at a time.

Environments can be specified inside of a file, in configuration files or using the `--env` [command line](command-line-interface) flag.

To specify environments using a comment inside of your JavaScript file, use the following format:

```js
/* eslint-env node, mocha */
```

This enables Node.js and Mocha environments.

To specify environments in a configuration file, use the `env` key and specify which environments you want to enable by setting each to `true`. For example, the following enables the browser and Node.js environments:

```json
{
    "env": {
        "browser": true,
        "node": true
    }
}
```

Or in a `package.json` file

```json
{
    "name": "mypackage",
    "version": "0.0.1",
    "eslintConfig": {
        "env": {
            "browser": true,
            "node": true
        }
    }
}
```

And in YAML:

```yaml
---
  env:
    browser: true
    node: true
```

If you want to use an environment from a plugin, be sure to specify the plugin name in the `plugins` array and then use the unprefixed plugin name, followed by a slash, followed by the environment name. For example:

```json
{
    "plugins": ["example"],
    "env": {
        "example/custom": true
    }
}
```

Or in a `package.json` file

```json
{
    "name": "mypackage",
    "version": "0.0.1",
    "eslintConfig": {
        "plugins": ["example"],
        "env": {
            "example/custom": true
        }
    }
}
```

And in YAML:

```yaml
---
  plugins:
    - example
  env:
    example/custom: true
```

## Specifying Globals

The [no-undef](../rules/no-undef.md) rule will warn on variables that are accessed but not defined within the same file. If you are using global variables inside of a file then it's worthwhile to define those globals so that ESLint will not warn about their usage. You can define global variables either using comments inside of a file or in the configuration file.

To specify globals using a comment inside of your JavaScript file, use the following format:

```js
/* global var1, var2 */
```

This defines two global variables, `var1` and `var2`. If you want to optionally specify that these global variables can be written to (rather than only being read), then you can set each with a `"writable"` flag:

```js
/* global var1:writable, var2:writable */
```

To configure global variables inside of a configuration file, set the `globals` configuration property to an object containing keys named for each of the global variables you want to use. For each global variable key, set the corresponding value equal to `"writable"` to allow the variable to be overwritten or `"readonly"` to disallow overwriting. For example:

```json
{
    "globals": {
        "var1": "writable",
        "var2": "readonly"
    }
}
```

And in YAML:

```yaml
---
  globals:
    var1: writable
    var2: readonly
```

These examples allow `var1` to be overwritten in your code, but disallow it for `var2`.

Globals can be disabled with the string `"off"`. For example, in an environment where most ES2015 globals are available but `Promise` is unavailable, you might use this config:

```json
{
    "env": {
        "es6": true
    },
    "globals": {
        "Promise": "off"
    }
}
```

For historical reasons, the boolean value `false` and the string value `"readable"` are equivalent to `"readonly"`. Similarly, the boolean value `true` and the string value `"writeable"` are equivalent to `"writable"`. However, the use of older values is deprecated.

**Note:** Enable the [no-global-assign](../rules/no-global-assign.md) rule to disallow modifications to read-only global variables in your code.

## Configuring Plugins

ESLint supports the use of third-party plugins. Before using the plugin, you have to install it using npm.

To configure plugins inside of a configuration file, use the `plugins` key, which contains a list of plugin names. The `eslint-plugin-` prefix can be omitted from the plugin name.

```json
{
    "plugins": [
        "plugin1",
        "eslint-plugin-plugin2"
    ]
}
```

And in YAML:

```yaml
---
  plugins:
    - plugin1
    - eslint-plugin-plugin2
```

**Note:** Plugins are resolved relative to the current working directory of the ESLint process. In other words, ESLint will load the same plugin as a user would obtain by running `require('eslint-plugin-pluginname')` in a Node REPL from their project root.

### Naming Convention

#### Include a Plugin

The `eslint-plugin-` prefix can be omitted for non-scoped packages

```js
{
    // ...
    "plugins": [
        "jquery", // means eslint-plugin-jquery
    ]
    // ...
}
```

The same rule does apply to scoped packages:

```js
{
    // ...
    "plugins": [
        "@jquery/jquery", // means @jquery/eslint-plugin-jquery
        "@foobar" // means @foobar/eslint-plugin
    ]
    // ...
}
```

#### Use a Plugin

When using rules, environments or configs defined by plugins, they must be referenced following the convention:

* `eslint-plugin-foo` → `foo/a-rule`
* `@foo/eslint-plugin` → `@foo/a-config`
* `@foo/eslint-plugin-bar` → `@foo/bar/a-environment`

For example:

```js
{
    // ...
    "plugins": [
        "jquery",   // eslint-plugin-jquery
        "@foo/foo", // @foo/eslint-plugin-foo
        "@bar"      // @bar/eslint-plugin
    ],
    "extends": [
        "plugin:@foo/foo/recommended",
        "plugin:@bar/recommended"
    ],
    "rules": {
        "jquery/a-rule": "error",
        "@foo/foo/some-rule": "error",
        "@bar/another-rule": "error"
    },
    "env": {
        "jquery/jquery": true,
        "@foo/foo/env-foo": true,
        "@bar/env-bar": true,
    }
    // ...
}
```

## Configuring Rules

ESLint comes with a large number of rules. You can modify which rules your project uses either using configuration comments or configuration files. To change a rule setting, you must set the rule ID equal to one of these values:

* `"off"` or `0` - turn the rule off
* `"warn"` or `1` - turn the rule on as a warning (doesn't affect exit code)
* `"error"` or `2` - turn the rule on as an error (exit code is 1 when triggered)

### Using Configuration Comments

To configure rules inside of a file using configuration comments, use a comment in the following format:

```js
/* eslint eqeqeq: "off", curly: "error" */
```

In this example, [`eqeqeq`](../rules/eqeqeq) is turned off and [`curly`](../rules/curly) is turned on as an error. You can also use the numeric equivalent for the rule severity:

```js
/* eslint eqeqeq: 0, curly: 2 */
```

This example is the same as the last example, only it uses the numeric codes instead of the string values. The `eqeqeq` rule is off and the `curly` rule is set to be an error.

If a rule has additional options, you can specify them using array literal syntax, such as:

```js
/* eslint quotes: ["error", "double"], curly: 2 */
```

This comment specifies the "double" option for the [`quotes`](../rules/quotes) rule. The first item in the array is always the rule severity (number or string).

Configuration comments can include descriptions to explain why the comment is necessary. The description must occur after the configuration and is separated from the configuration by two or more consecutive `-` characters. For example:

```js
/* eslint eqeqeq: "off", curly: "error" -- Here's a description about why this configuration is necessary. */
```

```js
/* eslint eqeqeq: "off", curly: "error"
    --------
    Here's a description about why this configuration is necessary. */
```

```js
/* eslint eqeqeq: "off", curly: "error"
 * --------
 * This will not work due to the line above starting with a '*' character.
 */
```

### Using Configuration Files

To configure rules inside of a configuration file, use the `rules` key along with an error level and any options you want to use. For example:


```json
{
    "rules": {
        "eqeqeq": "off",
        "curly": "error",
        "quotes": ["error", "double"]
    }
}
```

And in YAML:

```yaml
---
rules:
  eqeqeq: off
  curly: error
  quotes:
    - error
    - double
```

To configure a rule which is defined within a plugin you have to prefix the rule ID with the plugin name and a `/`. For example:

```json
{
    "plugins": [
        "plugin1"
    ],
    "rules": {
        "eqeqeq": "off",
        "curly": "error",
        "quotes": ["error", "double"],
        "plugin1/rule1": "error"
    }
}
```

And in YAML:

```yaml
---
plugins:
  - plugin1
rules:
  eqeqeq: 0
  curly: error
  quotes:
    - error
    - "double"
  plugin1/rule1: error
```

In these configuration files, the rule `plugin1/rule1` comes from the plugin named `plugin1`. You can also use this format with configuration comments, such as:

```js
/* eslint "plugin1/rule1": "error" */
```

**Note:** When specifying rules from plugins, make sure to omit `eslint-plugin-`. ESLint uses only the unprefixed name internally to locate rules.

## Disabling Rules with Inline Comments

To temporarily disable rule warnings in your file, use block comments in the following format:

```js
/* eslint-disable */

alert('foo');

/* eslint-enable */
```

You can also disable or enable warnings for specific rules:

```js
/* eslint-disable no-alert, no-console */

alert('foo');
console.log('bar');

/* eslint-enable no-alert, no-console */
```

To disable rule warnings in an entire file, put a `/* eslint-disable */` block comment at the top of the file:

```js
/* eslint-disable */

alert('foo');
```

You can also disable or enable specific rules for an entire file:

```js
/* eslint-disable no-alert */

alert('foo');
```

To disable all rules on a specific line, use a line or block comment in one of the following formats:

```js
alert('foo'); // eslint-disable-line

// eslint-disable-next-line
alert('foo');

/* eslint-disable-next-line */
alert('foo');

alert('foo'); /* eslint-disable-line */
```

To disable a specific rule on a specific line:

```js
alert('foo'); // eslint-disable-line no-alert

// eslint-disable-next-line no-alert
alert('foo');

alert('foo'); /* eslint-disable-line no-alert */

/* eslint-disable-next-line no-alert */
alert('foo');
```

To disable multiple rules on a specific line:

```js
alert('foo'); // eslint-disable-line no-alert, quotes, semi

// eslint-disable-next-line no-alert, quotes, semi
alert('foo');

alert('foo'); /* eslint-disable-line no-alert, quotes, semi */

/* eslint-disable-next-line no-alert, quotes, semi */
alert('foo');
```

All of the above methods also work for plugin rules. For example, to disable `eslint-plugin-example`'s `rule-name` rule, combine the plugin's name (`example`) and the rule's name (`rule-name`) into `example/rule-name`:

```js
foo(); // eslint-disable-line example/rule-name
foo(); /* eslint-disable-line example/rule-name */
```

Configuration comments can include descriptions to explain why the comment is necessary. The description must occur after the configuration and is separated from the configuration by two or more consecutive `-` characters. For example:

```js
// eslint-disable-next-line no-console -- Here's a description about why this configuration is necessary.
console.log('hello');
```

**Note:** Comments that disable warnings for a portion of a file tell ESLint not to report rule violations for the disabled code. ESLint still parses the entire file, however, so disabled code still needs to be syntactically valid JavaScript.


### Disabling Rules Only for a Group of Files

To disable rules inside of a configuration file for a group of files, use the `overrides` key along with a `files` key. For example:

```json
{
  "rules": {...},
  "overrides": [
    {
      "files": ["*-test.js","*.spec.js"],
      "rules": {
        "no-unused-expressions": "off"
      }
    }
  ]
}
```

## Configuring Inline Comment Behaviors

### Disabling Inline Comments

To disable all inline config comments, use `noInlineConfig` setting. For example:

```json
{
  "rules": {...},
  "noInlineConfig": true
}
```

This setting is similar to [--no-inline-config](./command-line-interface.md#--no-inline-config) CLI option.

### Report Unused `eslint-disable` Comments

To report unused `eslint-disable` comments, use `reportUnusedDisableDirectives` setting. For example:

```json
{
  "rules": {...},
  "reportUnusedDisableDirectives": true
}
```

This setting is similar to [--report-unused-disable-directives](./command-line-interface.md#--report-unused-disable-directives) CLI option, but doesn't fail linting (reports as `"warn"` severity).

## Adding Shared Settings

ESLint supports adding shared settings into configuration file. You can add `settings` object to ESLint configuration file and it will be supplied to every rule that will be executed. This may be useful if you are adding custom rules and want them to have access to the same information and be easily configurable.

In JSON:

```json
{
    "settings": {
        "sharedData": "Hello"
    }
}
```

And in YAML:

```yaml
---
  settings:
    sharedData: "Hello"
```

## Using Configuration Files

There are two ways to use configuration files.

The first way to use configuration files is via `.eslintrc.*` and `package.json` files. ESLint will automatically look for them in the directory of the file to be linted, and in successive parent directories all the way up to the root directory of the filesystem (unless `root: true` is specified). This option is useful when you want different configurations for different parts of a project or when you want others to be able to use ESLint directly without needing to remember to pass in the configuration file.

The second is to save the file wherever you would like and pass its location to the CLI using the `-c` option, such as:

    eslint -c myconfig.json myfiletotest.js

If you are using one configuration file and want ESLint to ignore any `.eslintrc.*` files, make sure to use `--no-eslintrc` along with the `-c` flag.

In each case, the settings in the configuration file override default settings.

## Configuration File Formats

ESLint supports configuration files in several formats:

* **JavaScript** - use `.eslintrc.js` and export an object containing your configuration.
* **JavaScript (ESM)** - use `.eslintrc.cjs` when running ESLint in JavaScript packages that specify `"type":"module"` in their `package.json`. Note that ESLint does not support ESM configuration at this time.
* **YAML** - use `.eslintrc.yaml` or `.eslintrc.yml` to define the configuration structure.
* **JSON** - use `.eslintrc.json` to define the configuration structure. ESLint's JSON files also allow JavaScript-style comments.
* **Deprecated** - use `.eslintrc`, which can be either JSON or YAML.
* **package.json** - create an `eslintConfig` property in your `package.json` file and define your configuration there.

If there are multiple configuration files in the same directory, ESLint will only use one. The priority order is:

1. `.eslintrc.js`
1. `.eslintrc.cjs`
1. `.eslintrc.yaml`
1. `.eslintrc.yml`
1. `.eslintrc.json`
1. `.eslintrc`
1. `package.json`

## Configuration Cascading and Hierarchy

When using `.eslintrc.*` and `package.json` files for configuration, you can take advantage of configuration cascading. For instance, suppose you have the following structure:

```text
your-project
├── .eslintrc
├── lib
│ └── source.js
└─┬ tests
  ├── .eslintrc
  └── test.js
```

The configuration cascade works by using the closest `.eslintrc` file to the file being linted as the highest priority, then any configuration files in the parent directory, and so on. When you run ESLint on this project, all files in `lib/` will use the `.eslintrc` file at the root of the project as their configuration. When ESLint traverses into the `tests/` directory, it will then use `your-project/tests/.eslintrc` in addition to `your-project/.eslintrc`. So `your-project/tests/test.js` is linted based on the combination of the two `.eslintrc` files in its directory hierarchy, with the closest one taking priority. In this way, you can have project-level ESLint settings and also have directory-specific overrides.

In the same way, if there is a `package.json` file in the root directory with an `eslintConfig` field, the configuration it describes will apply to all subdirectories beneath it, but the configuration described by the `.eslintrc` file in the tests directory will override it where there are conflicting specifications.

```text
your-project
├── package.json
├── lib
│ └── source.js
└─┬ tests
  ├── .eslintrc
  └── test.js
```

If there is an `.eslintrc` and a `package.json` file found in the same directory, `.eslintrc` will take a priority and `package.json` file will not be used.

By default, ESLint will look for configuration files in all parent folders up to the root directory. This can be useful if you want all of your projects to follow a certain convention, but can sometimes lead to unexpected results. To limit ESLint to a specific project, place `"root": true` inside the `eslintConfig` field of the `package.json` file or in the `.eslintrc.*` file at your project's root level.  ESLint will stop looking in parent folders once it finds a configuration with `"root": true`.

```js
{
    "root": true
}
```

And in YAML:

```yaml
---
  root: true
```

For example, consider `projectA` which has `"root": true` set in the `.eslintrc` file in the `lib/` directory.  In this case, while linting `main.js`, the configurations within `lib/` will be used, but the `.eslintrc` file in `projectA/` will not.

```text
home
└── user
    └── projectA
        ├── .eslintrc  <- Not used
        └── lib
            ├── .eslintrc  <- { "root": true }
            └── main.js
```

The complete configuration hierarchy, from highest precedence to lowest precedence, is as follows:

1. Inline configuration
    1. `/*eslint-disable*/` and `/*eslint-enable*/`
    1. `/*global*/`
    1. `/*eslint*/`
    1. `/*eslint-env*/`
1. Command line options (or CLIEngine equivalents):
    1. `--global`
    1. `--rule`
    1. `--env`
    1. `-c`, `--config`
1. Project-level configuration:
    1. `.eslintrc.*` or `package.json` file in same directory as linted file
    1. Continue searching for `.eslintrc` and `package.json` files in ancestor directories (parent has highest precedence, then grandparent, etc.), up to and including the root directory or until a config with `"root": true` is found.

## Extending Configuration Files

A configuration file can extend the set of enabled rules from base configurations.

The `extends` property value is either:

* a string that specifies a configuration (either a path to a config file, the name of a shareable config, `eslint:recommended`, or `eslint:all`)
* an array of strings: each additional configuration extends the preceding configurations

ESLint extends configurations recursively, so a base configuration can also have an `extends` property. Relative paths and shareable config names in an `extends` property are resolved from the location of the config file where they appear.

The `rules` property can do any of the following to extend (or override) the set of rules:

* enable additional rules
* change an inherited rule's severity without changing its options:
    * Base config: `"eqeqeq": ["error", "allow-null"]`
    * Derived config: `"eqeqeq": "warn"`
    * Resulting actual config: `"eqeqeq": ["warn", "allow-null"]`
* override options for rules from base configurations:
    * Base config: `"quotes": ["error", "single", "avoid-escape"]`
    * Derived config: `"quotes": ["error", "single"]`
    * Resulting actual config: `"quotes": ["error", "single"]`

### Using `"eslint:recommended"`

An `extends` property value `"eslint:recommended"` enables a subset of core rules that report common problems, which have a check mark (recommended) on the [rules page](../rules/). The recommended subset can change only at major versions of ESLint.

If your configuration extends the recommended rules: after you upgrade to a newer major version of ESLint, review the reported problems before you use the `--fix` option on the [command line](./command-line-interface#fix), so you know if a new fixable recommended rule will make changes to the code.

The `eslint --init` command can create a configuration so you can extend the recommended rules.

Example of a configuration file in JavaScript format:

```js
module.exports = {
    "extends": "eslint:recommended",
    "rules": {
        // enable additional rules
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],

        // override default options for rules from base configurations
        "comma-dangle": ["error", "always"],
        "no-cond-assign": ["error", "always"],

        // disable rules from base configurations
        "no-console": "off",
    }
}
```

### Using a shareable configuration package

A [sharable configuration](../developer-guide/shareable-configs) is an npm package that exports a configuration object. Make sure the package has been installed to a directory where ESLint can require it.

The `extends` property value can omit the `eslint-config-` prefix of the package name.

The `eslint --init` command can create a configuration so you can extend a popular style guide (for example, `eslint-config-standard`).

Example of a configuration file in YAML format:

```yaml
extends: standard
rules:
  comma-dangle:
    - error
    - always
  no-empty: warn
```

### Using the configuration from a plugin

A [plugin](../developer-guide/working-with-plugins) is an npm package that usually exports rules. Some plugins also export one or more named [configurations](../developer-guide/working-with-plugins#configs-in-plugins). Make sure the package has been installed to a directory where ESLint can require it.

The `plugins` [property value](#configuring-plugins) can omit the `eslint-plugin-` prefix of the package name.

The `extends` property value can consist of:

* `plugin:`
* the package name (from which you can omit the prefix, for example, `react`)
* `/`
* the configuration name (for example, `recommended`)

Example of a configuration file in JSON format:

```json
{
    "plugins": [
        "react"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "rules": {
       "react/no-set-state": "off"
    }
}
```

### Using a configuration file

The `extends` property value can be an absolute or relative path to a base [configuration file](#using-configuration-files). ESLint resolves a relative path to a base configuration file relative to the configuration file that uses it.

Example of a configuration file in JSON format:

```json
{
    "extends": [
        "./node_modules/coding-standard/eslintDefaults.js",
        "./node_modules/coding-standard/.eslintrc-es6",
        "./node_modules/coding-standard/.eslintrc-jsx"
    ],
    "rules": {
        "eqeqeq": "warn"
    }
}
```

### Using `"eslint:all"`

The `extends` property value can be `"eslint:all"` to enable all core rules in the currently installed version of ESLint. The set of core rules can change at any minor or major version of ESLint.

**Important:** This configuration is **not recommended for production use** because it changes with every minor and major version of ESLint. Use at your own risk.

If you configure ESLint to automatically enable new rules when you upgrade, ESLint can report new problems when there are no changes to source code, therefore any newer minor version of ESLint can behave as if it has breaking changes.

You might enable all core rules as a shortcut to explore rules and options while you decide on the configuration for a project, especially if you rarely override options or disable rules. The default options for rules are not endorsements by ESLint (for example, the default option for the `quotes` rule does not mean double quotes are better than single quotes).

If your configuration extends all core rules: after you upgrade to a newer major or minor version of ESLint, review the reported problems before you use the `--fix` option on the [command line](./command-line-interface#fix), so you know if a new fixable rule will make changes to the code.

Example of a configuration file in JavaScript format:

```js
module.exports = {
    "extends": "eslint:all",
    "rules": {
        // override default options
        "comma-dangle": ["error", "always"],
        "indent": ["error", 2],
        "no-cond-assign": ["error", "always"],

        // disable now, but enable in the future
        "one-var": "off", // ["error", "never"]

        // disable
        "init-declarations": "off",
        "no-console": "off",
        "no-inline-comments": "off",
    }
}
```

## Configuration Based on Glob Patterns

<b>v4.1.0+.</b> Sometimes a more fine-controlled configuration is necessary, for example if the configuration for files within the same directory has to be different. Therefore you can provide configurations under the `overrides` key that will only apply to files that match specific glob patterns, using the same format you would pass on the command line (e.g., `app/**/*.test.js`).

### How it works

* The patterns are applied against the file path relative to the directory of the config file. For example, if your config file has the path `/Users/john/workspace/any-project/.eslintrc.js` and the file you want to lint has the path `/Users/john/workspace/any-project/lib/util.js`, then the pattern provided in `.eslintrc.js` will be executed against the relative path `lib/util.js`.
* Glob pattern overrides have higher precedence than the regular configuration in the same config file. Multiple overrides within the same config are applied in order. That is, the last override block in a config file always has the highest precedence.
* A glob specific configuration works almost the same as any other ESLint config. Override blocks can contain any configuration options that are valid in a regular config, with the exception of `root` and `ignorePatterns`.
    * A glob specific configuration can have `extends` setting, but the `root` property in the extended configs is ignored. The `ignorePatterns` property in the extended configs is used only for the files the glob specific configuration matched.
    * Nested `overrides` setting will be applied only if the glob patterns of both of the parent config and the child config matched. This is the same when the extended configs have `overrides` setting.
* Multiple glob patterns can be provided within a single override block. A file must match at least one of the supplied patterns for the configuration to apply.
* Override blocks can also specify patterns to exclude from matches. If a file matches any of the excluded patterns, the configuration won't apply.

### Relative glob patterns

```
project-root
├── app
│   ├── lib
│   │   ├── foo.js
│   │   ├── fooSpec.js
│   ├── components
│   │   ├── bar.js
│   │   ├── barSpec.js
│   ├── .eslintrc.json
├── server
│   ├── server.js
│   ├── serverSpec.js
├── .eslintrc.json
```

The config in `app/.eslintrc.json` defines the glob pattern `**/*Spec.js`. This pattern is relative to the base directory of `app/.eslintrc.json`. So, this pattern would match `app/lib/fooSpec.js` and `app/components/barSpec.js` but **NOT** `server/serverSpec.js`. If you defined the same pattern in the `.eslintrc.json` file within in the `project-root` folder, it would match all three of the `*Spec` files.

### Example configuration

In your `.eslintrc.json`:

```json
{
  "rules": {
    "quotes": ["error", "double"]
  },

  "overrides": [
    {
      "files": ["bin/*.js", "lib/*.js"],
      "excludedFiles": "*.test.js",
      "rules": {
        "quotes": ["error", "single"]
      }
    }
  ]
}
```

### Specifying Target Files to Lint

If you specified directories with CLI (e.g., `eslint lib`), ESLint searches target files in the directory to lint. The target files are `*.js` or the files that match any of `overrides` entries (but exclude entries that are any of `files` end with `*`).

If you specified the [`--ext`](./command-line-interface#ext) command line option along with directories, the target files are only the files that have specified file extensions regardless of `overrides` entries.

## Comments in Configuration Files

Both the JSON and YAML configuration file formats support comments (`package.json` files should not include them). You can use JavaScript-style comments or YAML-style comments in either type of file and ESLint will safely ignore them. This allows your configuration files to be more human-friendly. For example:

```js
{
    "env": {
        "browser": true
    },
    "rules": {
        // Override our default settings just for this directory
        "eqeqeq": "warn",
        "strict": "off"
    }
}
```

## Ignoring Files and Directories

### `ignorePatterns` in config files

You can tell ESLint to ignore specific files and directories by `ignorePatterns` in your config files. Each value of `ignorePatterns` is the same pattern as each line of `.eslintignore` in the next section.

```json
{
    "ignorePatterns": ["temp.js", "node_modules/"],
    "rules": {
        //...
    }
}
```

* The `ignorePatterns` property affects only the directory that the config file placed.
* You cannot write `ignorePatterns` property under `overrides` property.
* `.eslintignore` can override `ignorePatterns` property of config files.

### `.eslintignore`

You can tell ESLint to ignore specific files and directories by creating an `.eslintignore` file in your project's root directory. The `.eslintignore` file is a plain text file where each line is a glob pattern indicating which paths should be omitted from linting. For example, the following will omit all JavaScript files:

```text
**/*.js
```

When ESLint is run, it looks in the current working directory to find an `.eslintignore` file before determining which files to lint. If this file is found, then those preferences are applied when traversing directories. Only one `.eslintignore` file can be used at a time, so `.eslintignore` files other than the one in the current working directory will not be used.

Globs are matched using [node-ignore](https://github.com/kaelzhang/node-ignore), so a number of features are available:

* Lines beginning with `#` are treated as comments and do not affect ignore patterns.
* Paths are relative to `.eslintignore` location or the current working directory. This is also true of paths passed in via the `--ignore-pattern` [command](./command-line-interface.md#--ignore-pattern).
* Lines preceded by `!` are negated patterns that re-include a pattern that was ignored by an earlier pattern.
* Ignore patterns behave according to the `.gitignore` [specification](https://git-scm.com/docs/gitignore).

Of particular note is that like `.gitignore` files, all paths used as patterns for both `.eslintignore` and `--ignore-pattern` must use forward slashes as their path separators.

```text
# Valid
/root/src/*.js

# Invalid
\root\src\*.js
```

Please see `.gitignore`'s specification for further examples of valid syntax.

In addition to any patterns in a `.eslintignore` file, ESLint always ignores files in `/**/node_modules/*`.

For example, placing the following `.eslintignore` file in the current working directory will ignore all of `node_modules/*` and anything in the `build/` directory except `build/index.js`:

```text
# node_modules/* are ignored by default

# Ignore built files except build/index.js
build/*
!build/index.js
```

### Using an Alternate File

If you'd prefer to use a different file than the `.eslintignore` in the current working directory, you can specify it on the command line using the `--ignore-path` option. For example, you can use `.jshintignore` file because it has the same format:

    eslint --ignore-path .jshintignore file.js

You can also use your `.gitignore` file:

    eslint --ignore-path .gitignore file.js

Any file that follows the standard ignore file format can be used. Keep in mind that specifying `--ignore-path` means that any existing `.eslintignore` file will not be used. Note that globbing rules in `.eslintignore` follow those of `.gitignore`.

### Using eslintIgnore in package.json

If an `.eslintignore` file is not found and an alternate file is not specified, ESLint will look in package.json for an `eslintIgnore` key to check for files to ignore.

    {
      "name": "mypackage",
      "version": "0.0.1",
      "eslintConfig": {
          "env": {
              "browser": true,
              "node": true
          }
      },
      "eslintIgnore": ["hello.js", "world.js"]
    }

### Ignored File Warnings

When you pass directories to ESLint, files and directories are silently ignored. If you pass a specific file to ESLint, then you will see a warning indicating that the file was skipped. For example, suppose you have an `.eslintignore` file that looks like this:

```text
foo.js
```

And then you run:

    eslint foo.js

You'll see this warning:

```text
foo.js
  0:0  warning  File ignored because of your .eslintignore file. Use --no-ignore to override.

✖ 1 problem (0 errors, 1 warning)
```

This message occurs because ESLint is unsure if you wanted to actually lint the file or not. As the message indicates, you can use `--no-ignore` to omit using the ignore rules.

## Personal Configuration File (deprecated)

⚠️ **This feature has been deprecated**. This feature will be removed in the 8.0.0 release. If you want to continue to use personal configuration files, please use the [`--config` CLI option](https://eslint.org/docs/user-guide/command-line-interface#-c---config). For more information regarding this decision, please see [RFC 28](https://github.com/eslint/rfcs/pull/28) and [RFC 32](https://github.com/eslint/rfcs/pull/32).

`~/` refers to [the home directory of the current user on your preferred operating system](https://nodejs.org/api/os.html#os_os_homedir). The personal configuration file being referred to here is `~/.eslintrc.*` file, which is currently handled differently than other configuration files.

### How ESLint Finds Personal Configuration File

If `eslint` could not find any configuration file in the project, `eslint` loads `~/.eslintrc.*` file.

If `eslint` could find configuration files in the project, `eslint` ignores `~/.eslintrc.*` file even if it's in an ancestor directory of the project directory.

### How Personal Configuration File Behaves

`~/.eslintrc.*` files behave similarly to regular configuration files, with some exceptions:

`~/.eslintrc.*` files load shareable configs and custom parsers from `~/node_modules/` – similarly to `require()` – in the user's home directory. Please note that it doesn't load global-installed packages.

`~/.eslintrc.*` files load plugins from `$CWD/node_modules` by default in order to identify plugins uniquely. If you want to use plugins with `~/.eslintrc.*` files, plugins must be installed locally per project. Alternatively, you can use the [`--resolve-plugins-relative-to` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--resolve-plugins-relative-to) to change the location from which ESLint loads plugins.
