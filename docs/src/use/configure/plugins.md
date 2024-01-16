---
title: Configure Plugins
eleventyNavigation:
    key: configure plugins
    parent: configure
    title: Configure Plugins
    order: 4

---

::: tip
This page explains how to configure plugins using the flat config format. For the deprecated eslintrc format, [see the deprecated documentation](plugins-deprecated).
:::

You can extend ESLint with plugins in a variety of different ways. Plugins can include:

* Custom rules to validate if your code meets a certain expectation, and what to do if it does not meet that expectation.
* Custom configurations. Please refer to the plugin's documentation for details on how to use these configurations.
* Custom processors to extract JavaScript code from other kinds of files or preprocess code before linting.

## Configure Plugins

ESLint supports the use of third-party plugins. Plugins are simply objects that conform to a specific interface that ESLint recognizes.

To configure plugins inside of a configuration file, use the `plugins` key, which contains an object with properties representing plugin namespaces and values equal to the plugin object.

```js
// eslint.config.js
import example from "eslint-plugin-example";

export default [
    {
        plugins: {
            example
        },
        rules: {
            "example/rule1": "warn"
        }
    }
];
```

::: tip
When creating a namespace for a plugin, the convention is to use the npm package name without the `eslint-plugin-` prefix. In the preceding example, `eslint-plugin-example` is assigned a namespace of `example`.
:::

### Configure a Local Plugin

Plugins don't need to be published to npm for use with ESLint. You can also load plugins directly from a file, as in this example:

```js
// eslint.config.js
import local from "./my-local-plugin.js";

export default [
    {
        plugins: {
            local
        },
        rules: {
            "local/rule1": "warn"
        }
    }
];
```

Here, the namespace `local` is used, but you can also use any name you'd like instead.

### Configure a Virtual Plugin

Plugin definitions can be created virtually directly in your config. For example, suppose you have a rule contained in a file called `my-rule.js` that you'd like to enable in your config. You can define a virtual plugin to do so, as in this example:

```js
// eslint.config.js
import myRule from "./rules/my-rule.js";

export default [
    {
        plugins: {
            local: {
                rules: {
                    "my-rule": myRule
                }
            }
        },
        rules: {
            "local/my-rule": "warn"
        }
    }
];
```

Here, the namespace `local` is used to define a virtual plugin. The rule `myRule` is then assigned a name of `my-rule` inside of the virtual plugin's `rules` object. (See [Create Plugins](../../extend/plugins) for the complete format of a plugin.) You can then reference the rule as `local/my-rule` to configure it.

## Use Plugin Rules

You can use specific rules included in a plugin. To do this, specify the plugin
in a configuration object using the `plugins` key. The value for the `plugin` key
is an object where the name of the plugin is the property name and the value is the plugin object itself. Here's an example:

```js
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

In this configuration, the JSDoc plugin is defined to have the name `jsdoc`. The prefix `jsdoc/` in each rule name indicates that the rule is coming from the plugin with that name rather than from ESLint itself.

Because the name of the plugin and the plugin object are both `jsdoc`, you can also shorten the configuration to this:

```js
import jsdoc from "eslint-plugin-jsdoc";

export default [
    {
        files: ["**/*.js"],
        plugins: {
            jsdoc
        },
        rules: {
            "jsdoc/require-description": "error",
            "jsdoc/check-values": "error"
        }
    }
];
```

While this is the most common convention, you don't need to use the same name that the plugin prescribes. You can specify any prefix that you'd like, such as:

```js
import jsdoc from "eslint-plugin-jsdoc";

export default [
    {
        files: ["**/*.js"],
        plugins: {
            jsd: jsdoc
        },
        rules: {
            "jsd/require-description": "error",
            "jsd/check-values": "error"
        }
    }
];
```

This configuration object uses `jsd` as the prefix plugin instead of `jsdoc`.

## Specify a Processor

Plugins may provide processors. Processors can extract JavaScript code from other kinds of files, then let ESLint lint the JavaScript code. Alternatively, processors can convert JavaScript code during preprocessing.

To specify processors in a configuration file, use the `processor` key and assign the name of processor in the format `namespace/processor-name`. For example, the following uses the processor from `eslint-plugin-markdown` for `*.md` files.

```js
// eslint.config.js
import markdown from "eslint-plugin-markdown";

export default [
    {
        files: ["**/*.md"],
        plugins: {
            markdown
        },
        processor: "markdown/markdown"
    }
];
```

Processors may make named code blocks such as `0.js` and `1.js`. ESLint handles such a named code block as a child file of the original file. You can specify additional configurations for named code blocks with additional config objects. For example, the following disables the `strict` rule for the named code blocks which end with `.js` in markdown files.

```js
// eslint.config.js
import markdown from "eslint-plugin-markdown";

export default [

    // applies to all JavaScript files
    {
        rules: {
            strict: "error"
        }
    },

    // applies to Markdown files
    {
        files: ["**/*.md"],
        plugins: {
            markdown
        },
        processor: "markdown/markdown"
    },

    // applies only to JavaScript blocks inside of Markdown files
    {
        files: ["**/*.md/*.js"],
        rules: {
            strict: "off"
        }
    }
];
```

ESLint only lints named code blocks when they are JavaScript files or if they match a `files` entry in a config object. Be sure to add a config object with a matching `files` entry if you want to lint non-JavaScript named code blocks.
