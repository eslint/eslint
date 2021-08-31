# Configuring ESLint

ESLint is designed to be flexible and configurable for your use case. You can turn off every rule and run only with basic syntax validation or mix and match the bundled rules and your custom rules to fit the needs of your project. There are two primary ways to configure ESLint:

1. **Configuration Comments** - use JavaScript comments to embed configuration information directly into a file.
1. **Configuration Files** - use a JavaScript, JSON, or YAML file to specify configuration information for an entire directory and all of its subdirectories. This can be in the form of an [`.eslintrc.*`](./configuration-files.md#configuration-file-formats) file or an `eslintConfig` field in a [`package.json`](https://docs.npmjs.com/files/package.json) file, both of which ESLint will look for and read automatically, or you can specify a configuration file on the [command line](https://eslint.org/docs/user-guide/command-line-interface).

Here are some of the options that you can configure in ESLint:

* [**Environments**](./language-options.md#specifying-environments) - which environments your script is designed to run in. Each environment brings with it a certain set of predefined global variables.
* [**Globals**](./language-options.md#specifying-globals) - the additional global variables your script accesses during execution.
* [**Rules**](rules.md) - which rules are enabled and at what error level.
* [**Plugins**](plugins.md) - which third-party plugins define additional rules, environments, configs, etc. for ESLint to use.

All of these options give you fine-grained control over how ESLint treats your code.

## Table of Contents

[**Configuration Files**](configuration-files.md)

* [Configuration File Formats](./configuration-files.md#configuration-file-formats)
* [Using Configuration Files](./configuration-files.md#using-configuration-files)
* [Adding Shared Settings](./configuration-files.md#adding-shared-settings)
* [Cascading and Hierarchy](./configuration-files.md#cascading-and-hierarchy)
* [Extending Configuration Files](./configuration-files.md#extending-configuration-files)
* [Configuration Based on Glob Patterns](./configuration-files.md#configuration-based-on-glob-patterns)
* [Personal Configuration Files](./configuration-files.md#personal-configuration-files-deprecated)

[**Language Options**](language-options.md)

* [Specifying Environments](./language-options.md#specifying-environments)
* [Specifying Globals](./language-options.md#specifying-globals)
* [Specifying Parser Options](./language-options.md#specifying-parser-options)

[**Rules**](rules.md)

* [Configuring Rules](./rules.md#configuring-rules)
* [Disabling Rules](./rules.md#disabling-rules)

[**Plugins**](plugins.md)

* [Specifying Parser](./plugins.md#specifying-parser)
* [Specifying Processor](./plugins.md#specifying-processor)
* [Configuring Plugins](./plugins.md#configuring-plugins)

[**Ignoring Code**](ignoring-code.md)

* [`ignorePatterns` in Config Files](./ignoring-code.md#ignorepatterns-in-config-files)
* [The `.eslintignore` File](./ignoring-code.md#the-eslintignore-file)
* [Using an Alternate File](./ignoring-code.md#using-an-alternate-file)
* [Using eslintIgnore in package.json](./ignoring-code.md#using-eslintignore-in-packagejson)
* [Ignored File Warnings](./ignoring-code.md#ignored-file-warnings)
