---
title: Configure ESLint
eleventyNavigation:
    key: configure
    parent: use eslint
    title: Configure ESLint
    order: 3

---

ESLint is designed to be flexible and configurable for your use case. You can turn off every rule and run only with basic syntax validation or mix and match the bundled rules and your custom rules to fit the needs of your project. There are two primary ways to configure ESLint:

1. **Configuration Comments** - use JavaScript comments to embed configuration information directly into a file.
2. **Configuration Files** - use a JavaScript, JSON, or YAML file to specify configuration information for an entire directory and all of its subdirectories. This can be in the form of a [`.eslintrc.*`](./configuration-files#configuration-file-formats) file or an `eslintConfig` field in a [`package.json`](https://docs.npmjs.com/files/package.json) file, both of which ESLint will look for and read automatically, or you can specify a configuration file on the [command line](../command-line-interface).

Here are some of the options that you can configure in ESLint:

* [**Environments**](./language-options#specifying-environments) - which environments your script is designed to run in. Each environment brings with it a certain set of predefined global variables.
* [**Globals**](./language-options#specifying-globals) - the additional global variables your script accesses during execution.
* [**Rules**](rules) - which rules are enabled and at what error level.
* [**Plugins**](plugins) - which third-party plugins define additional rules, environments, configs, etc. for ESLint to use.

All of these options give you fine-grained control over how ESLint treats your code.

## Table of Contents

[**Configuration Files**](configuration-files)

* [Configuration File Formats](./configuration-files#configuration-file-formats)
* [Using Configuration Files](./configuration-files#using-configuration-files)
* [Adding Shared Settings](./configuration-files#adding-shared-settings)
* [Cascading and Hierarchy](./configuration-files#cascading-and-hierarchy)
* [Extending Configuration Files](./configuration-files#extending-configuration-files)
* [Configuration Based on Glob Patterns](./configuration-files#configuration-based-on-glob-patterns)
* [Personal Configuration Files](./configuration-files#personal-configuration-files-deprecated)

[**Configure Language Options**](language-options)

* [Specifying Environments](./language-options#specifying-environments)
* [Specifying Globals](./language-options#specifying-globals)
* [Specifying Parser Options](./language-options#specifying-parser-options)

[**Configure Rules**](rules)

* [Configuring Rules](./rules#configuring-rules)
* [Disabling Rules](./rules#disabling-rules)

[**Configure Plugins**](plugins)

* [Configure Plugins](./plugins#configure-plugins)
* [Specify a Processor](./plugins#specify-a-processor)
* [Configure Parsers](./plugins#configure-a-parser)

[**Ignore Code**](ignore)

* [`ignorePatterns` in Config Files](./ignore#ignorepatterns-in-config-files)
* [The `.eslintignore` File](./ignore#the-eslintignore-file)
* [Using an Alternate File](./ignore#using-an-alternate-file)
* [Using eslintIgnore in package.json](./ignore#using-eslintignore-in-packagejson)
* [Ignored File Warnings](./ignore#ignored-file-warnings)
