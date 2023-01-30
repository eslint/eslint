---
title: Configure a Parser
eleventyNavigation:
    key: configure parser
    parent: configure
    title: Configure a Parser
    order: 6
---

You can use custom parsers to convert JavaScript code into an abstract syntax tree for ESLint to evaluate. You might want to add a custom parser if your code isn't compatible with ESLint's default parser, Espree.

## Configure a Custom Parser

By default, ESLint uses [Espree](https://github.com/eslint/espree) as its parser. You can optionally specify that a different parser should be used in your configuration file if the parser meets the following requirements:

1. It must be a Node module loadable from the config file where the parser is used. Usually, this means you should install the parser package separately using npm.
1. It must conform to the [parser interface](../../extend/custom-parsers).

Note that even with these compatibilities, there are no guarantees that an external parser works correctly with ESLint. ESLint does not fix bugs related to incompatibilities with other parsers.

To indicate the npm module to use as your parser, specify it using the `parser` option in your `.eslintrc` file. For example, the following specifies to use Esprima instead of Espree:

```json
{
    "parser": "esprima",
    "rules": {
        "semi": "error"
    }
}
```

The following parsers are compatible with ESLint:

* [Esprima](https://www.npmjs.com/package/esprima)
* [@babel/eslint-parser](https://www.npmjs.com/package/@babel/eslint-parser) - A wrapper around the [Babel](https://babeljs.io) parser that makes it compatible with ESLint.
* [@typescript-eslint/parser](https://www.npmjs.com/package/@typescript-eslint/parser) - A parser that converts TypeScript into an ESTree-compatible form so it can be used in ESLint.

Note that when using a custom parser, the `parserOptions` configuration property is still required for ESLint to work properly with features not in ECMAScript 5 by default. Parsers are all passed `parserOptions` and may or may not use them to determine which features to enable.
