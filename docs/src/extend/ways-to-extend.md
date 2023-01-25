---
title: Ways to Extend ESLint
eleventyNavigation:
    key: ways to extend
    parent: extend eslint
    title: Ways to Extend ESLint
    order: 1
---

ESLint is highly pluggable and configurable. There are a variety of ways that you can extend ESLint's functionality.

This page explains the ways to extend ESLint, and how these different ways all fit together.

## Plugins

Plugins let you add your own ESLint custom rules, processors, and formatters to a project. You can publish a plugin as a npm module.

Plugins are useful because your project may require some ESLint configuration that isn't included in the core `eslint` package. For example, if you're using a frontend JavaScript library like React or framework like Vue, these tools have some features that require custom rules outside the scope of the ESLint core rules.

Often a plugin is paired with a shareable config, which applies a set of features from the plugin to a project.

For example, ... TODO: come up w example. react prob easiest

To learn more about creating the things you can include in a plugin, refer to the following documentation:

* [Custom Rules](custom-rules)
* [Custom Formatters](custom-formatters)
* [Custom Processors](custom-processors)

## Shareable Configs

## Custom Parsers

## Putting It All in a Package

TODO: bit about how you can bundle all these things in a package
