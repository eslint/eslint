# Configuring ESLint
ESLint is designed to be completely configurable. You can turn off every rule and run only with basic syntax validation, or mix and match the bundled rules and your custom rules to make ESLint perfect for your project. There are two primary ways to configure ESLint:

1. **Configuration Comments** - use JavaScript comments to embed configuration information directly into a file.
1. **Configuration Files** - use a JavaScript, JSON, or YAML file to specify configuration information for an entire directory and all of its subdirectories. This can be in the form of an [`.eslintrc.*`](./configuring-files#configuration-file-formats) file or an `eslintConfig` field in a [`package.json`](https://docs.npmjs.com/files/package.json) file, both of which ESLint will look for and read automatically, or you can specify a configuration file on the [command line](https://eslint.org/docs/user-guide/command-line-interface).

Following are some of the important pieces of information that you can configure in ESLint:

* [**Environments**](./language-options#specifying-environments) - which environments your script is designed to run in. Each environment brings with it a certain set of predefined global variables.
* [**Globals**](./language-options#specifying-globals) - the additional global variables your script accesses during execution.
* [**Rules**](rules.md) - which rules are enabled and at what error level.
* [**Plugins**](plugins.md) - the use of third-party plugins in ESLint.

All of these options give you fine-grained control over how ESLint treats your code.

## Table of Contents

[**Configuration Files**](configuration-files.md)
* [Configuration File Formats](./configuration-files#configuration-file-formats)
* [Using Configuration Files](./configuring-files#using-configuration-files)
* [Adding Shared Settings](./configuration-files#adding-shared-settings)
* [Cascading and Hierarchy](./configuration-files#cascading-and-hierarchy)
* [Extending Configuration Files](./configuring-files#extending-configuration-files)
* [Configuration Based on Glob Patterns](./configuration-files#configuration-based-on-glon-patterns)
* [Personal Configuration Files](./configuration-files#personal-configuration-files)

[**Language Options**](language-options.md)
* [Specifying Environments](./language-options#specifying-environments)
* [Specifying Globals](./language-options#specifying-globals)
* [Specifying Parser Options](./language-options#specifying-parser-options)

[**Rules**](rules.md)
* [Configuring Rules](./rules#configuring-rules)
* [Disabling Rules](./rules#disabling-rules)

[**Plugins**](plugins.md)
* [Specifying Parser](./plugins#specifying-parser)
* [Specifying Processor](./plugins#specifying-processor)
* [Configuring Plugins](./plugins#configuring-plugins)

[**Ignoring Code**](ignoring-code.md)
* [`ignorePatterns` in config files](./ignoring-code#ignorepatterns-in-config-files)
* [`.eslintignore`](./ignoring-code#eslintignore)
* [Using an Alternate File](./ignoring-code#using-an-alternate-file)
* [Using eslintIgnore in package.json](./ignoring-code#using-eslintignore-in-package.json)
* [Ignored File Warnings](./ignoring-code#ignored-file-warnings)
* [Disabling Comments](./ignoring-code#disabling-comments)
