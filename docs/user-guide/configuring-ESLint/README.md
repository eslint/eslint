# Configuring ESLint
ESLint is designed to be completely configurable. You can turn off every rule and run only with basic syntax validation, or mix and match the bundled rules and your custom rules to make ESLint perfect for your project. There are two primary ways to configure ESLint:

1. **Configuration Comments** - use JavaScript comments to embed configuration information directly into a file.
1. **Configuration Files** - use a JavaScript, JSON, or YAML file to specify configuration information for an entire directory and all of its subdirectories. This can be in the form of an [`.eslintrc.*`](./configuring-files#configuration-file-formats) file or an `eslintConfig` field in a [`package.json`](https://docs.npmjs.com/files/package.json) file, both of which ESLint will look for and read automatically, or you can specify a configuration file on the [command line](https://eslint.org/docs/user-guide/command-line-interface).

Following are some of the important pieces of information that you can configure in ESLint:

* [**Environments**](./language-options.md#specifying-environments) - which environments your script is designed to run in. Each environment brings with it a certain set of predefined global variables.
* [**Globals**](./language-options.md#specifying-globals) - the additional global variables your script accesses during execution.
* [**Rules**](rules.md) - which rules are enabled and at what error level.
* [**Plugins**](plugins.md) - the use of third-party plugins in ESLint.

All of these options give you fine-grained control over how ESLint treats your code.

## Table of Contents

[**Configuration Files**](configuration-files.md)

* [Configuration File Formats](./configuration-files.md#configuration-file-formats)
* [Using Configuration Files](./configuration-files.md#using-configuration-files)
* [Adding Shared Settings](./configuration-files.md#adding-shared-settings)
* [Cascading and Hierarchy](./configuration-files.md#cascading-and-hierarchy)
* [Extending Configuration Files](./configuring-files.md#extending-configuration-files)
* [Configuration Based on Glob Patterns](./configuration-files.md#configuration-based-on-glon-patterns)
* [Personal Configuration Files](./configuration-files.md#personal-configuration-files)

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

* [`ignorePatterns` in config files](./ignoring-code.md#ignorepatterns-in-config-files)
* [`.eslintignore`](./ignoring-code.md#eslintignore)
* [Using an Alternate File](./ignoring-code.md#using-an-alternate-file)
* [Using eslintIgnore in package.json](./ignoring-code.md#using-eslintignore-in-package.json)
* [Ignored File Warnings](./ignoring-code.md#ignored-file-warnings)
* [Disabling Inline Comments](./ignoring-code.md#disabling-inline-comments)
