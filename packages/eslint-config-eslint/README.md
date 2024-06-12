[![npm version][npm-image]][npm-url]

# ESLint Configuration

[Website](https://eslint.org) | [Configure ESLint](https://eslint.org/docs/latest/use/configure) | [Rules](https://eslint.org/docs/rules/) | [Contributing](https://eslint.org/docs/latest/contribute) | [Twitter](https://twitter.com/geteslint) | [Discord](https://eslint.org/chat) | [Mastodon](https://fosstodon.org/@eslint)

Contains the ESLint configuration used for projects maintained by the ESLint team.

## Installation

You can install ESLint using npm:

```shell
npm install eslint --save-dev
```

Then install this configuration:

```shell
npm install eslint-config-eslint --save-dev
```

## Usage

### ESM (`"type":"module"`) projects

In your `eslint.config.js` file, add:

```js
import eslintConfigESLint from "eslint-config-eslint";

export default [
    ...eslintConfigESLint
];
```

**Note**: This configuration array contains configuration objects with the `files` property.

* `files: ["**/*.js"]`: ESM-specific configurations.
* `files: ["**/*.cjs"]`: CommonJS-specific configurations.

### CommonJS projects

In your `eslint.config.js` file, add:

```js
const eslintConfigESLintCJS = require("eslint-config-eslint/cjs");

module.exports = [
    ...eslintConfigESLintCJS
];
```

### Base config

Note that the above configurations are intended for files that will run in Node.js. For files that will not run in Node.js, you should use the `base` config.

Here's an example of an `eslint.config.js` file for a website project with scripts that run in browser and CommonJS configuration files and tools that run in Node.js:

```js
const eslintConfigESLintBase = require("eslint-config-eslint/base");
const eslintConfigESLintCJS = require("eslint-config-eslint/cjs");

module.exports = [
    ...eslintConfigESLintBase.map(config => ({
        ...config,
        files: ["scripts/*.js"]
    })),
    ...eslintConfigESLintCJS.map(config => ({
        ...config,
        files: ["eslint.config.js", ".eleventy.js", "tools/*.js"]
    }))
];
```

### Formatting config

Note that none of the above configurations includes formatting rules. If you want to enable formatting rules, add the formatting config.

```js
import eslintConfigESLint from "eslint-config-eslint";
import eslintConfigESLintFormatting from "eslint-config-eslint/formatting";

export default [
    ...eslintConfigESLint,
    eslintConfigESLintFormatting
];
```

### Where to ask for help?

Open a [discussion](https://github.com/eslint/eslint/discussions) or stop by our [Discord server](https://eslint.org/chat) instead of filing an issue.

[npm-image]: https://img.shields.io/npm/v/eslint-config-eslint.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/eslint-config-eslint
