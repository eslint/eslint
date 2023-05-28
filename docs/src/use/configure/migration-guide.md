---
title: Configuration Migration Guide
eleventyNavigation:
    key: migration guide
    parent: configure
    title: Configuration Migration Guide
    order: 8
---

This guide provides an overview of how you can migrate your ESLint configuration file from the `.eslintrc` format to the new configuration file format, `eslint.config.js`.

To learn more about the `eslint.config.js` file format, refer to [this blog post](https://eslint.org/blog/2022/08/new-config-system-part-2/).

For reference information on these configuration formats, refer to the following documentation:

* [`.eslintrc` configuration files](configuration-files)
* [`eslint.config.js` configuration files](configuration-files-new)

## Key Differences between Configuration Formats

A few of the most notable differences between the `.eslintrc` and `eslint.config.js` formats are the following:

### Importing Plugins and Custom Parsers

#### .eslintrc

String-based import system with the `plugins` property to load plugins and `extends` to load configurations from the plugins.

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

#### eslint.config.js

Uses CommonJS `requires()` or ESModule `import` to load pluginsand custom parsers.

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

#### .eslintrc

Importing a custom parser is very similar to importing a plugin. However, a parser must be a separate module.

```javascript
// .eslintrc.js

{
    // ...other config
    parser: "@babel/eslint-parser",
    // ...other config
}
```

#### eslint.config.js

To import a custom parser, import the parser as a module. Then assign it to the `languageOptions.parser` property of a configuration object:

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

#### .eslintrc

By default, .`eslintrc` files lint all files (except those covered by `.gitignore`) in the directory in which they’re placed and child directories:

```javascript
// .eslintrc.js
module.exports = {
    // ...other config
    extends: "eslint:recommended",
};
```

If you want to have different configurations for different file glob patterns, you can specify them in the `overrides` property:

```javascript
// .eslintrc.js
module.exports = {
    // ...other config
    extends: "eslint:recommended",
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

#### eslint.config.js

By default, `eslint.config.js` files support different glob pattern-based configs in exported array.

Basically, all configuration in the `eslint.config.js` file is like the .`eslintrc` `overrides` property.

Here is a configuration with the default glob pattern (`**/*.{js,mjs,cjs}`):

```javascript
// eslint.config.js
export default [
    "eslint:recommended", // Recommended config applied to all files
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

To support multiple configs for different glob patterns:

```javascript
// eslint.config.js
export default [
    "eslint:recommended", // Recommended config applied to all files
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

#### .eslintrc

In `.eslintrc` files, you configure various language options across the `env`, `globals` and `parserOptions` properties.

Global variables for specific runtimes (e.g `document` for browser JavaScript and `process` for Node.js ) are configured with the `env` property.

```javascript
// .eslintrc
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

#### eslint.config.js

In the `eslint.config.js`, the `globals`, and `parserOptions` are consolidated under the `languageOptions` key.

There is no longer the `env` property in `eslint.config.js`. Global variables for specific runtimes are imported from the [globals](https://www.npmjs.com/package/globals) npm package and included in the `globals` property. You can use the spread operator (`...`)to import all globals:

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

#### .eslintrc

To use predefined configs, use the `extends` property:

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

ESLint comes with two predefined configs:

* -`eslint:recommended`: the rules recommended by ESLint
* -`eslint:all`: all rules shipped with ESLint

You can also use the `extends` property to extend a custom config. Custom configs can either be paths to local config files or npm package names:

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

#### eslint.config.js

`eslint.config.js` supports the built-in `eslint:recommended` and `eslint:all` configs, locally defined configs and npm package configs.

You can add each of these configs to the exported array.

You must import the modules for local config files and npm package configs with `eslint.config.js`:

```javascript
// eslint.config.js

import customConfig from "./custom-config.js";
import myConfig from "eslint-config-my-config";

export default [
    "eslint:recommended",
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

Note that because you are just importing JavaScript modules, you can mutate the config objects before exporting them. For example, you might want to have a certain config object only apply to your test files:

```javascript
// eslint.config.js
import customTestConfig from "./custom-test-config.js";
export default [
    "eslint:recommended",
    {
        ...customTestConfig,
        files: ["**/*.test.js"],
    },
];
```

## Things That Haven’t Changed between Configuration File Formats

While all the above mentioned features have changed from `.eslintrc` to `eslint.config.js` configurations, the following has stayed the same:

* Syntax for adding rules
* Processors
* All options. Just the way to configure them have changed.

## TypeScript Types for eslint.config.js

You can see the TypeScript types for the eslint.config.js file format in the DefinitelyTyped project. The interface for the objects in the config’s array is called the `FlatConfig`.

You can view the type definitions in the [DefinitelyTyped repository on Github](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/eslint/index.d.ts).

## Further Reading

* [Overview of the eslint.config.js file format blog post](https://eslint.org/blog/2022/08/new-config-system-part-2/)
* [API usage of new configuration system blog post](https://eslint.org/blog/2022/08/new-config-system-part-3/)
* [Background to new configuration system blog post](https://eslint.org/blog/2022/08/new-config-system-part-1/)
