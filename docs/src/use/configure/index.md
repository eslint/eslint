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
2. **Configuration Files** - use a JavaScript file to specify configuration information for an entire directory and all of its subdirectories. This can be in the form of an [`eslint.config.js`](./configuration-files) file which ESLint will look for and read automatically, or you can specify a configuration file on the [command line](../command-line-interface).

Here are some of the options that you can configure in ESLint:

* [**Globals**](./language-options#specifying-globals) - the additional global variables your script accesses during execution.
* [**Rules**](rules) - which rules are enabled and at what error level.
* [**Plugins**](plugins) - which third-party plugins define additional rules, languages, configs, etc. for ESLint to use.

All of these options give you fine-grained control over how ESLint treats your code.

## Table of Contents

[**Configuration Files**](configuration-files)

* [Configuration File Format](./configuration-files#configuration-file)
* [Configuration Objects](./configuration-files#configuration-objects)
* [Configuring Shared Settings](./configuration-files#configuring-shared-settings)
* [Configuration File Resolution](./configuration-files#configuration-file-resolution)

[**Configure Language Options**](language-options)

* [Specifying JavaScript Options](./language-options#specifying-javascript-options)
* [Specifying Globals](./language-options#specifying-globals)

[**Configure Rules**](rules)

* [Configuring Rules](./rules)
* [Disabling Rules](./rules#disabling-rules)

[**Configure Plugins**](plugins)

* [Configure Plugins](./plugins#configure-plugins)
* [Specify a Processor](./plugins#specify-a-processor)

[**Configure a Parser**](./parser)

* [Configure a Custom Parser](./parser#configure-a-custom-parser)

[**Ignore Files**](ignore)

* [Ignoring Files](./ignore#ignoring-files)
* [Ignoring Directories](./ignore#ignoring-directories)
* [Unignoring Files and Directories](./ignore#unignoring-files-and-directories)
* [Ignored File Warnings](./ignore#ignored-file-warnings)
