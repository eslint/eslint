# Configuration Files

ESLint is fully configurable using configuration files. The configuration files are in JSON format and are used to specify exactly how you want ESLint to behave.

## Format

ESLint configuration files are simply JSON files that follow a particular format. These are the top-level properties of a configuration file:

* `env` - specifies environment information
* `rules` - specifies which rules are enabled

Here's a simple example:

```json
{
    "env": {
        "browser": true
    },
    "rules": {
        "eqeqeq": 1,
        "strict": 0
    }
}
```

### Environment

ESLint will configure itself automatically based on where your JavaScript should be executable. There are three options:

* `browser` - the code is to be run in the browser so predefine browser-specific globals
* `node` - the code is to be run using Node.js so predefine Node.js-specific globals
* `amd` - the code is running as an AMD module so predefine AMD-specific globals

By specifying the environment in which to run the code, you can avoid faulty warnings for using variables that are environment-specific.

Set each environment to `true` in order to enable (the default for each is `false`).

### Rules

You can turn on or off different rules by setting the rule ID equal to a value:

* 0 - turn the rule off
* 1 - turn the rule on as a warning (doesn't affect exit code)
* 2 - turn the rule on as a warning (exit code is 1)

Each of the rule settings modifies the default. For example, to turn off `strict`, which is on by default with ESLint, your configuration file might simply be:

```
{
    "rules": {
        "strict": 0
    }
}
```

There's no need to specify every single rule - you will automatically get the default setting for every rule. You only need to override the rules that you want to change.

**Note:** All rules that are enabled by default are set to 2, so they will cause a non-zero exit code when encountered. You can lower these rule to a warning by setting them to 1, which has the effect of outputting the message onto the console but doesn't affect the exit code.

## Using Configuration Files

There are two ways to use configuration files. The first is to save the file wherever you would like an pass its location to the CLI using the `-c` option, such as:

    eslint -c myconfig.json myfiletotest.js

Passing in the configuration file in this manner will override any default settings.

The second way to use configuration files is via `.eslintrc` files. These files you place directly into your project directory and ESLint will automatically find them and read configuration information from them. This option is useful when you want different configurations for different parts of a project or when you want others to be able to use ESLint directly without needing to remember to pass in the configuration file.

In either case, the settings in the configuration file override default settings.
