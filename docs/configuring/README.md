# Configuring ESLint

ESLint is designed to be completely configurable, meaning you can turn off every rule and run only with basic syntax validation, or mix and match the bundled rules and your custom rules to make ESLint perfect for your project. There are two primary ways to configure ESLint:

1. **Configuration Comments** - use JavaScript comments to embed configuration information directly into a file.
1. **Configuration Files** - use a JSON or YAML file to specify configuration information for an entire directory and all of its subdirectories. This can be in the form of `.eslintrc` file, which ESLint will look for and read automatically, or you can specify a configuration file on the [command line](../command-line-interface).

There are several pieces of information that can be configured:

* **Environments** - which environments your script is designed to run in. Each environment brings with it a certain set of global variables and rules that are enabled by default.
* **Globals** - the additional global variables your script accesses during execution.
* **Rules** - which rules are enabled and at what error level.

All of these options give you fine-grained control over how ESLint treats your code.

## Specifying Environments

An environment defines both global variables that are predefined as well as which rules should be on or off by default. The available environments are:

* `browser` - browser global variables.
* `node` - Node.js global variables and Node.js-specific rules.
* `amd` - defines `require()` and `define()` as global variables.
* `mocha` - adds all of the Mocha testing global variables.

These environments are not mutually exclusive, so you can define more than one at a time.

Environments can only be specified in configuration files. To do so, use the `env` key and specify which environments you want to enable by setting each to `true`. For example, the following JSON enables the browser and Node.js environments:

```json
{
    "env": {
        "browser": true,
        "node": true
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

## Specifying Globals

By default, ESLint will warn on variables that are accessed but not defined within the same file. If you are using global variables inside of a file then it's worthwhile to define those globals so that ESLint will not warn about their usage. You can define global variables either using comments inside of a file or in the configuration file.

To specify globals using a comment inside of your JavaScript file, use the following format:

```js
/*global var1, var2*/
```

This defines two global variables, `var1` and `var2`. If you want to optionally specify that these global variables should never be written to (only read), then you can set each with a `false` flag:

```js
/*global var1:false, var2:false*/
```

To configure global variables inside of a configuration file, use the `globals` key and indicate the global variables you want to use. Set each global variable name equal to `true` to allow the variable to be overwritten or `false` to disallow overwriting. For example:

```json
{
    "globals": {
        "var1": true,
        "var2": false
    }
}
```

And in YAML:

```yaml
---
  globals:
    var1: true
    var2: false
```

These examples allow `var1` to be overwritten in your code, but disallow it for `var2`.

## Configuring Rules

ESLint comes with a large number of rules, some of which are on by default and some of which are off by default. You can modify which rules your project uses either using configuration comments or configuration files. To change a rule setting, you must set the rule ID equal to one of these values:

* 0 - turn the rule off
* 1 - turn the rule on as a warning (doesn't affect exit code)
* 2 - turn the rule on as a warning (exit code is 1 when triggered)

To configure rules inside of a file using configuration comments, use a comment in the following format:

```js
/*eslint eqeqeq:0, curly: 2*/
```

In this example, `eqeqeq` is turned off and `curly` is turned on as an error. If a rule has additional options, you can specify them using array literal syntax, such as:

```js
/*eslint quotes: [2, "double"], curly: 2*/
```

This comment specifies the "double" option for the `[quotes](../rules/quotes.md)` rule.

To configure rules inside of a configuration file, use the `rules` key along with an error level and any options you want to use. For example:


```json
{
    "rules": {
        "eqeqeq": 0,
        "curly": 2,
        "quotes": [2, "double"]
    }
}
```

And in YAML:

```yaml
---
  rules:
    eqeqeq: 0
    curly: 2
    quotes:
      - 2
      - "double"
```

There's no need to specify every single rule - you will automatically get the default setting for every rule. You only need to override the rules that you want to change.

**Note:** All rules that are enabled by default are set to 2, so they will cause a non-zero exit code when encountered. You can lower these rule to a warning by setting them to 1, which has the effect of outputting the message onto the console but doesn't affect the exit code.

## Using Configuration Files

There are two ways to use configuration files. The first is to save the file wherever you would like an pass its location to the CLI using the `-c` option, such as:

    eslint -c myconfig.json myfiletotest.js

Passing in the configuration file in this manner will override any default settings.

The second way to use configuration files is via `.eslintrc` files. These files you place directly into your project directory and ESLint will automatically find them and read configuration information from them. This option is useful when you want different configurations for different parts of a project or when you want others to be able to use ESLint directly without needing to remember to pass in the configuration file.

In either case, the settings in the configuration file override default settings.

## Comments in Configuration Files

Both the JSON and YAML configuration file formats support comments. You can use JavaScript-style comments or YAML-style comments in either type of file and ESLint will safely ignore them. This allows your configuration files to be more human-friendly. For example:

```js
{
    "env": {
        "browser": true
    },
    "rules": {
        // Override our default settings just for this directory
        "eqeqeq": 1,
        "strict": 0
    }
}
```

