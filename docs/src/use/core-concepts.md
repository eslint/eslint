---
title: Core Concepts
eleventyNavigation:
    key: core concepts
    title: Core Concepts
    parent: use eslint
    order: 2
---

This page contains a high-level overview of some of the core concepts of ESLint.

## What is ESLint?

ESLint is a configurable JavaScript linter. It helps you find and fix problems in your JavaScript code. Problems can be anything from potential runtime bugs, to not following best practices, to styling issues.

## Rules

Rules are the core building block of ESLint. A rule validates if your code meets a certain expectation, and what to do if it does not meet that expectation. Rules can also contain additional configuration options specific to that rule.

For example, the [`semi`](../rules/semi) rule lets you specify whether or not JavaScript statements should end with a semicolon (`;`). You can set the rule to either always require semicolons or require that a statement never ends with a semicolon.

ESLint contains hundreds of built-in rules that you can use. You can also create custom rules or use rules that others have created with [plugins](#plugins).

For more information, refer to [Rules](../rules/).

## Configuration Files

An ESLint configuration file is a place where you put the configuration for ESLint in your project. You can include built-in rules, how you want them enforced, plugins with custom rules, shareable configurations, which files you want rules to apply to, and more.

For more information, refer to [Configuration Files](./configure/configuration-files).

## Shareable Configurations

Shareable configurations are ESLint configurations that are shared via npm.

Often shareable configurations are used to enforce style guides using ESLint's built-in rules. For example the sharable configuration [eslint-config-airbnb-base](https://www.npmjs.com/package/eslint-config-airbnb-base) implements the popular Airbnb JavaScript style guide.

For more information, refer to [Using a shareable configuration package](./configure/configuration-files#using-a-shareable-configuration-package).

## Plugins

An ESLint plugin is an npm module that can contain a set of ESLint rules, configurations, processors, and environments. Often plugins include custom rules. Plugins can be used to enforce a style guide and support JavaScript extensions (like TypeScript), libraries (like React), and frameworks (Angular).

A popular use case for plugins is to enforce best practices for a framework. For example, [@angular-eslint/eslint-plugin](https://www.npmjs.com/package/@angular-eslint/eslint-plugin) contains best practices for using the Angular framework.

For more information, refer to [Configuring Plugins](./configure/plugins).

## Parsers

An ESLint parser converts code into an abstract syntax tree that ESLint can evaluate. By default, ESLint uses the built-in [Espree](https://github.com/eslint/espree) parser, which is compatible with standard JavaScript runtimes and versions.

Custom parsers let ESLint parse non-standard JavaScript syntax. Often custom parsers are included as part of shareable configurations or plugins, so you don't have to use them directly.

For example, [@typescript-eslint/parser](https://www.npmjs.com/package/@typescript-eslint/parser) is a custom parser included in the [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) project that lets ESLint parse TypeScript code.

## Custom Processors

An ESLint processor extracts JavaScript code from other kinds of files, then lets ESLint lint the JavaScript code. Alternatively, you can use a processor to manipulate JavaScript code before parsing it with ESLint.

For example, [eslint-plugin-markdown](https://github.com/eslint/eslint-plugin-markdown) contains a custom processor that lets you lint JavaScript code inside of Markdown code blocks.

## Formatters

An ESLint formatter controls the appearance of the linting results in the CLI.

For more information, refer to [Formatters](./formatters/).

## Integrations

One of the things that makes ESLint such a useful tool is the ecosystem of integrations that surrounds it. For example, many code editors have ESLint extensions that show you the ESLint results of your code in the file as you work so that you don't need to use the ESLint CLI to see linting results.

For more information, refer to [Integrations](./integrations).

## CLI & Node.js API

The ESLint CLI is a command line interface that lets you execute linting from the terminal. The CLI has a variety of options that you can pass to its commands.

The ESLint Node.js API lets you use ESLint programmatically from Node.js code. The API is useful when developing plugins, integrations, and other tools related to ESLint.

Unless you are extending ESLint in some way, you should use the CLI.

For more information, refer to [Command Line Interface](./command-line-interface) and [Node.js API](../integrate/nodejs-api).
