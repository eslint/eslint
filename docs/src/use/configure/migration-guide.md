---
title: Configuration Migration Guide
eleventyNavigation:
    key: migration guide
    parent: configure
    title: Configuration Migration Guide
    order: 8
---

This guide provides an overview of how you can migrate your ESLint configuration file from the eslintrc format (typically configured in `.eslintrc.js` or `.eslintrc.json` files) to the new flat config format (typically configured in an `eslint.config.js` file).

To learn more about the flat config format, refer to [this blog post](https://eslint.org/blog/2022/08/new-config-system-part-2/).

For reference information on these configuration formats, refer to the following documentation:

* [eslintrc configuration files](configuration-files)
* [flat configuration files](configuration-files-new)

## Start Using Flat Config Files

Starting with ESLint v9.0.0, the flat config file format will be the default configuration file format. Once ESLint v9.0.0 is released, you can start using the flat config file format without any additional configuration.

To use flat config with ESLint v8, place a `eslint.config.js` file in the root of your project **or** set the `ESLINT_USE_FLAT_CONFIG` environment variable to `true`.

## Things That Haven’t Changed between Configuration File Formats

While the configuration file format has changed from eslintrc to flat config, the following has stayed the same:

* Syntax for configuring rules
* Syntax for configuring processors
* The CLI, except for the flag changes noted in [CLI Flag Changes](#cli-flag-changes).
* Global variables are configured the same way, but on a different property (see [Configuring Language Options](#configuring-language-options)).

## Key Differences between Configuration Formats

A few of the most notable differences between the eslintrc and flat config formats are the following:

### Importing Plugins and Custom Parsers

Eslintrc files use string-based import system inside the `plugins` property to load plugins and inside the `extends` property to load external configurations.

Flat config files use CommonJS `require()` or ES module `import` statements to load plugins and custom parsers.

For example, this eslintrc config file loads `eslint-plugin-jsdoc` and configures rules from that plugin:

```javascript
// .eslintrc.js

{
    // ...other config
    plugins: ["jsdoc"],
    rules: {
        "jsdoc/require-description": "error",
        "jsdoc/check-values": "error"
    }
    // ...other config
}
```

In flat config, you would do the same thing like this:

```javascript
// eslint.config.js

import jsdoc from "eslint-plugin-jsdoc";

export default [
    {
        files: ["**/*.js"],
        plugins: {
            jsdoc: jsdoc
        },
        rules: {
            "jsdoc/require-description": "error",
            "jsdoc/check-values": "error"
        }
    }
];
```

### Custom Parsers

In eslintrc files, importing a custom parser is similar to importing a plugin: you use a string to specify the name of the parser.

In flat config files, import a custom parser as a module, then assign it to the `languageOptions.parser` property of a configuration object.

For example, this eslintrc config file uses the `@babel/eslint-parser` parser:

```javascript
// .eslintrc.js

{
    // ...other config
    parser: "@babel/eslint-parser",
    // ...other config
}
```

In flat config, you would do the same thing like this:

```javascript
// eslint.config.js

import babelParser from "@babel/eslint-parser";

export default [
   {
       // ...other config
       languageOptions: {
           parser: babelParser
       }
       // ...other config
   }
];
```

### Glob-Based Configs

By default, eslintrc files lint all files (except those covered by `.gitignore`) in the directory in which they’re placed and its child directories. If you want to have different configurations for different file glob patterns, you can specify them in the `overrides` property.

By default, flat config files support different glob pattern-based configs in exported array. You can include the glob pattern in a config object's `files` property. If you don't specify a `files` property, the config defaults to the glob pattern `"**/*.{js,mjs,cjs}"`. Basically, all configuration in the flat config file is like the eslintrc `overrides` property.

#### eslintrc Examples

For example, this eslintrc file applies to all files in the directory where it is placed and its child directories:

```javascript
// .eslintrc.js

module.exports = {
    // ...other config
    rules: {
        semi: ["warn", "always"]
    }
};
```

This eslintrc file supports multiple configs with overrides:

```javascript
// .eslintrc.js

module.exports = {
    // ...other config
    overrides: [
        {
            files: ["src/**/*"],
            rules: {
                semi: ["warn", "always"]
            }
        },
        {
            files:["test/**/*"],
            rules: {
                "no-console": "off"
            }
        }
    ]
};
```

For flat config, here is a configuration with the default glob pattern:

```javascript
// eslint.config.js

import js from "@eslint/js";

export default [
   js.configs.recommended, // Recommended config applied to all files
    // Override the recommended config
    {
        rules: {
           indent: ["error", 2],
           "no-unused-vars": "warn"
        }
        // ...other configuration
    }
];
```

A flag config example configuration supporting multiple configs for different glob patterns:

```javascript
// eslint.config.js

import js from "@eslint/js";

export default [
    js.configs.recommended, // Recommended config applied to all files
    // File-pattern specific overrides
    {
        files: ["src/**/*", "test/**/*"],
        rules: {
                semi: ["warn", "always"]
        }
    },
    {
        files:["test/**/*"],
        rules: {
            "no-console": "off"
        }
    }
    // ...other configurations
];
```

### Configuring Language Options

In eslintrc files, you configure various language options across the `env`, `globals` and `parserOptions` properties. Groups of global variables for specific runtimes (e.g `document` and `window` for browser JavaScript; `process` and `require` for Node.js ) are configured with the `env` property.

In flat config files, the `globals`, and `parserOptions` are consolidated under the `languageOptions` key; the `env` property doesn't exist. Groups of global variables for specific runtimes are imported from the [globals](https://www.npmjs.com/package/globals) npm package and included in the `globals` property. You can use the spread operator (`...`) to import multiple globals at once.


For example, here's a eslintrc file with language options:

```javascript
// .eslintrc.js

module.exports = {
    env: {
        browser: true,
    },
    globals: {
        myCustomGlobal: "readonly",
    },
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module"
    }
    // ...other config
}
```

Here's the same configuration in flat config:

```javascript
// eslint.config.js

import globals from "globals";

export default [
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                myCustomGlobal: "readonly"
            },
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: "module"
            }
        }
        // ...other config
    }
];
```

### Predefined Configs

In eslintrc files, use the `extends` property to use predefined configs. ESLint comes with two predefined configs that you can access as strings:

* `"eslint:recommended"`: the rules recommended by ESLint
* `"eslint:all"`: all rules shipped with ESLint

You can also use the `extends` property to extend a custom config. Custom configs can either be paths to local config files or npm package names.

In flat config files, predefined configs are imported from separate modules into flat config files. The `recommended` and `all` rules configs are located in the [`@eslint/js`](https://www.npmjs.com/package/@eslint/js) package. You must import this package to use these configs:

```shell
npm install @eslint/js --save-dev
```

You can add each of these configs to the exported array or expose specific rules from them. You must import the modules for local config files and npm package configs with flat config.

For example, here's an eslintrc file using the built-in `eslint:recommended` config:

```javascript
// .eslintrc.js

module.exports = {
    // ...other config
    extends: "eslint:recommended",
    rules: {
        semi: ["warn", "always"]
    },
    // ...other config
}
```

This eslintrc file uses built-in config, local custom config, and custom config from an npm package:

```javascript
// .eslintrc.js

module.exports = {
    // ...other config
    extends: ["eslint:recommended", "./custom-config.js", "eslint-config-my-config"],
    rules: {
        semi: ["warn", "always"]
    },
    // ...other config
}
```

To use the same configs in flat config, you would do the following:

```javascript
// eslint.config.js

import js from "@eslint/js";
import customConfig from "./custom-config.js";
import myConfig from "eslint-config-my-config";

export default [
    js.configs.recommended,
    customConfig,
    myConfig,
    {
        rules: {
            semi: ["warn", "always"]
        },
        // ...other config
    }
];
```

Note that because you are just importing JavaScript modules, you can mutate the config objects before ESLint uses them. For example, you might want to have a certain config object only apply to your test files:

```javascript
// eslint.config.js

import js from "@eslint/js";
import customTestConfig from "./custom-test-config.js";

export default [
    js.configs.recommended,
    {
        ...customTestConfig,
        files: ["**/*.test.js"],
    },
];
```

### Ignoring Files

With eslintrc, you can make ESLint ignore files by creating a separate `.eslintignore` file in the root of your project. The `.eslintignore` file uses the same glob pattern syntax as `.gitignore` files. Alternatively, you can use an `ignorePatterns` property in your eslintrc file.

To ignore files with flat config, you can use the `ignores` property in a config object. The `ignores` property accepts an array of glob patterns. Note that flat config glob patterns do _not_ match dot files (e.g. `.dotfile.js`).

For example, here's a `.eslintignore` example you can use with an eslintrc config:

```shell
# .eslintignore
temp.js
.config/*
# ...other ignored files
```

`ignorePatterns` example:

```javascript
// .eslintrc.js
{
    // ...other config
    ignorePatterns: ["temp.js", ".config/*"],
}
```

Here are the same files ignore patterns in flat config:

```javascript
export default [
    {
        // ...other config
        ignores: ["temp.js", ".config/*"]
    }
];
```

### CLI Flag Changes

The following CLI flags are no longer supported with the flat config file format:

* `--rulesdir`
* `--ext`
* `--resolve-plugins-relative-to`

The flag `--no-eslintrc` has been replaced with `--no-config-lookup`.

### Additional Changes

The following changes have been made from the eslintrc to the flat config file format:

* The `root` option no longer exists. (Flat config files act as if `root: true` is set.)
* The `files` option cannot be a single string anymore, it must be an array.
* The `sourceType` option now supports the new value `"commonjs"` (`.eslintrc` supports it too, but it was never documented).
* You can configure `noInlineConfig` and `reportUnusedDisableDirectives` options under the setting `linterOptions`.

## TypeScript Types for Flat Config Files

You can see the TypeScript types for the eslint.config.js file format in the DefinitelyTyped project. The interface for the objects in the config’s array is called the `FlatConfig`.

You can view the type definitions in the [DefinitelyTyped repository on Github](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/eslint/index.d.ts).

## Further Reading

* [Overview of the eslint.config.js file format blog post](https://eslint.org/blog/2022/08/new-config-system-part-2/)
* [API usage of new configuration system blog post](https://eslint.org/blog/2022/08/new-config-system-part-3/)
* [Background to new configuration system blog post](https://eslint.org/blog/2022/08/new-config-system-part-1/)
