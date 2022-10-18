---
title: Core Concepts
layout: doc
eleventyNavigation:
    key: core concepts
    title: Core Concepts
    parent: user guide
    order: 2
---

This page contains a high-level overview of some of the core concepts of ESLint.

## What is ESLint?

ESLint is a configurable JavaScript linter. It's like spell check and autocorrect
for your JavaScript code. It helps you write JavaScript in a consistent style
and fix bugs in your code.

## Rules

Rules are the core building block of ESLint. A rule validates if your code meets a
certain expectation, and what to do if it does not meet that expectation.
Rules can also contain additional configuration options specific to that rule.

For example, the [`semi`](../rules/semi`) rule lets you specify whether or not
JavaScript statements should end with a semicolon (`;`).
You can set the rule to either always require semicolons or require that
a statement never ends with a semicolon.

ESLint contains hundreds of built-in rules that you can use.
You can also create custom rules or use rules that others have
created with [plugins](#plugins).

For more information, refer to [Rules](../rules/).

## Configuration Files

An ESLint configuration file is a single place where you put all the configuration
for ESLint your project. You can include built-in rules, how you want them enforced,
plugins with custom rules, which files you want rules to apply to, and more.

For more information, refer to [Configuration Files](./configuring/configuration-files).

## Plugins

An ESLint plugin is an npm module that contains a set of ESLint rules.
Plugins can be used to enforce a style guide and support JavaScript extensions
(like TypeScript) or frameworks (like React).
You can add single rules or sets of rules from a plugin.
Often plugins come with recommended sets of rules that you can include in your project.

For more information, refer to [Configuring Plugins](./configuring/plugins.md).

## Formatters

An ESLint formatter controls the appearance of the linting results.
If you're using a code editor with an ESLint integration to see linting results
in line, the editor is using an ESLint formatter to display those results.

For more information, refer to [Formatters](./formatters/index.md).

## Integrations

One of the things that makes ESLint such a useful tool is the ecosystem of integrations
that surrounds. These integrations extend the core functionality of ESLint.
For example, many code editors have ESLint extensions that show you the ESLint results
of your code in the file as you work so that you don't need to use the ESLint CLI
to see linting results.

For more information, refer to [Integrations](./integrations).
For a curated collection of popular ESLint integrations,
see the [awesome-eslint Github repository](https://github.com/dustinspecker/awesome-eslint).

## CLI & Node.js API

The ESLint CLI is a command line interface that lets you execute linting
from the terminal. The CLI has a variety of options that you can pass to its commands.

The ESLint Node.js API lets you use ESLint programmatically from Node.js code.
The API is useful when developing plugins, integrations, and other tools related
to ESLint.

Unless you are extending ESLint in some way, you should use the CLI.

For more information, refer to [Command Line Interface](./command-line-interface)
and [Node.js API](../developer-guide/nodejs-api).
