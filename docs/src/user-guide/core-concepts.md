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
and fix bugs.

## Rules

Rules are the core building block of ESLint. A rule validates if your code meets a
certain expectation and what to do if it does not.
Rules can also contain additional configuration options specific to that rule.

For example, the [`semi` rule](../rules/semi.md`) lets you specify whether or not
JavaScript statements should end with a semicolon (`;`).
You can set the rule to either always require semicolons or require that a statement
never ends with a semicolon.

TODO: figure out how to do the link
ESLint contains hundreds of built-in rules that you can use.
You can also create custom rules for your project or use rules that others have
created with [plugins](#plugins).

For more information, refer to [Rules](../pages/rules.md).

## Configuration Files

An ESLint configuration file is a single place where you put all the configuration
for ESLint your project. You can include built-in rules, how you want them enforced,
plugins with custom rules, which files you want rules to apply to, and more.

For more information, refer to [Configuration Files](./configuring/configuration-files.md).

## Plugins

## Formatters

## Integrations

One of the things that makes ESLint such a useful tool is the ecosystem of integrations
that surrounds. These integrations extend the core functionality of ESLint.
For example, many code editors have ESLint extensions that show you the ESLint results
of your code in file so that you don't need to use the ESLint CLI to see linting
results.

For more information, refer to [Integrations](./integrations.md).
For a curated collection of popular ESLint integrations,
see the [awesome-eslint Github repository](https://github.com/dustinspecker/awesome-eslint).

## CLI
