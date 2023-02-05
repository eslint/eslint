---
title: Ways to Extend ESLint
eleventyNavigation:
    key: ways to extend
    parent: extend eslint
    title: Ways to Extend ESLint
    order: 1
---

ESLint is highly pluggable and configurable. There are a variety of ways that you can extend ESLint's functionality.

This page explains the ways to extend ESLint, and how these extensions all fit together.

## Plugins

Plugins let you add your own ESLint custom rules, processors, and formatters to a project. You can publish a plugin as a npm module.

Plugins are useful because your project may require some ESLint configuration that isn't included in the core `eslint` package. For example, if you're using a frontend JavaScript library like React or framework like Vue, these tools have some features that require custom rules outside the scope of the ESLint core rules.

Often a plugin is paired with a shareable config, which applies a set of features from the plugin to a project. You can include a shareable config in a plugin as well.

For example, [`eslint-plugin-react`](https://www.npmjs.com/package/eslint-plugin-react) is an ESLint plugin that include rules specifically for React projects. The rules include things like enforcing consistent usage of React component lifecycle methods and requiring the use of key props when rendering dynamic lists.

To learn more about creating the extensions you can include in a plugin, refer to the following documentation:

* [Custom Rules](custom-rules)
* [Custom Formatters](custom-formatters)
* [Custom Processors](custom-processors)
* [Share Configurations](shareable-configs)

To learn more about bundling these extensions into a plugin, refer to [Plugins](plugins).

## Shareable Configs

ESLint shareable configs are pre-defined configurations for ESLint that you can use in your projects. They bundle rules and other configuration together in an npm package. Anything that you can put in a configuration file can be put in a shareable config.

You can either publish a shareable config independently or as part of a plugin.

For example, a popular shareable config is [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb), which contains a variety of rules in addition to some [parser options](../use/configure/language-options#specifying-parser-options). This is a set of rules for ESLint that is designed to match the style guide used by the [Airbnb JavaScript style guide](https://github.com/airbnb/javascript). By using the `eslint-config-airbnb` shareable config, you can automatically enforce the Airbnb style guide in your project without having to manually configure each rule.

To learn more about creating a shareable config, refer to [Share Configuration](shareable-configs).

## Custom Parsers

ESLint custom parsers are a way to extend ESLint to support linting of new language features or custom syntax in your code. A parser is responsible for taking your code and transforming it into an abstract syntax tree (AST) that ESLint can then analyze and lint.

ESLint ships with a built-in JavaScript parser (Espree), but custom parsers allow you to lint other languages or to extend the linting capabilities of the built-in parser.

For example, the custom parser [@typescript-eslint/parser](https://typescript-eslint.io/architecture/parser/) extends ESLint to lint TypeScript code.

Custom parsers **cannot** be included in a plugin, unlike the other extension types.

To learn more about creating a custom parser, refer to [Custom Parsers](custom-parsers).
