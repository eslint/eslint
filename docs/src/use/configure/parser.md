---
title: Configure a Parser
eleventyNavigation:
    key: configure parser
    parent: configure
    title: Configure a Parser
    order: 5
---

::: tip
This page explains how to configure parsers using the flat config format.
:::

You can use custom parsers to convert JavaScript code into an abstract syntax tree for ESLint to evaluate. You might want to add a custom parser if your code isn't compatible with ESLint's default parser, Espree.

## Configure a Custom Parser

In many cases, you can use the [default parser](https://github.com/eslint/js/tree/main/packages/espree) that ESLint ships with for parsing your JavaScript code. You can optionally override the default parser by using the `parser` property. The `parser` property must be an object that conforms to the [parser interface](../../extend/custom-parsers). For example, you can use the [`@babel/eslint-parser`](https://www.npmjs.com/package/@babel/eslint-parser) package to allow ESLint to parse experimental syntax:

```js
// eslint.config.js
import babelParser from "@babel/eslint-parser";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.js", "**/*.mjs"],
		languageOptions: {
			parser: babelParser,
		},
	},
]);
```

This configuration ensures that the Babel parser, rather than the default Espree parser, is used to parse all files ending with `.js` and `.mjs`.

The following third-party parsers are known to be compatible with ESLint:

- [Esprima](https://www.npmjs.com/package/esprima)
- [@babel/eslint-parser](https://www.npmjs.com/package/@babel/eslint-parser) - A wrapper around the [Babel](https://babeljs.io) parser that makes it compatible with ESLint.
- [@typescript-eslint/parser](https://www.npmjs.com/package/@typescript-eslint/parser) - A parser that converts TypeScript into an ESTree-compatible form so it can be used in ESLint.

::: warning
There are no guarantees that an external parser works correctly with ESLint. ESLint does not fix bugs related to incompatibilities that affect only third-party parsers.
:::

## Configure Parser Options

Parsers may accept options to alter the way they behave. The `languageOptions.parserOptions` is used to pass options directly to parsers. These options are always parser-specific, so you'll need to check the documentation of the parser you're using for available options. Here's an example of setting parser options for the Babel ESLint parser:

```js
// eslint.config.js
import babelParser from "@babel/eslint-parser";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		languageOptions: {
			parser: babelParser,
			parserOptions: {
				requireConfigFile: false,
				babelOptions: {
					babelrc: false,
					configFile: false,
					presets: ["@babel/preset-env"],
				},
			},
		},
	},
]);
```

::: tip
In addition to the options specified in `languageOptions.parserOptions`, ESLint also passes `ecmaVersion` and `sourceType` to all parsers. This allows custom parsers to understand the context in which ESLint is evaluating JavaScript code.
:::
