---
title: Configure Plugins
eleventyNavigation:
    key: configure plugins
    parent: configure
    title: Configure Plugins
    order: 5

---

You can extend ESLint with plugins in a variety of different ways. Plugins can include:

* Custom rules to validate if your code meets a certain expectation, and what to do if it does not meet that expectation.
* Custom configurations.
* Custom environments.
* Custom processors to extract JavaScript code from other kinds of files or preprocess code before linting.

## Configure Plugins

ESLint supports the use of third-party plugins. Before using a plugin, you have to install it using npm.

To configure plugins inside of a configuration file, use the `plugins` key, which contains a list of plugin names. The `eslint-plugin-` prefix can be omitted from the plugin name.

```json
{
    "plugins": [
        "plugin1",
        "eslint-plugin-plugin2"
    ]
}
```

And in YAML:

```yaml
---
  plugins:
    - plugin1
    - eslint-plugin-plugin2
```

**Notes:**

1. Plugins are resolved relative to the config file. In other words, ESLint loads the plugin as a user would obtain by running `require('eslint-plugin-pluginname')` in the config file.
2. Plugins in the base configuration (loaded by `extends` setting) are relative to the derived config file. For example, if `./.eslintrc` has `extends: ["foo"]` and the `eslint-config-foo` has `plugins: ["bar"]`, ESLint finds the `eslint-plugin-bar` from `./node_modules/` (rather than `./node_modules/eslint-config-foo/node_modules/`) or ancestor directories. Thus every plugin in the config file and base configurations is resolved uniquely.

### Naming convention

#### Include a plugin

The `eslint-plugin-` prefix can be omitted for both non-scoped and scoped packages.

A non-scoped package:

```js
{
    // ...
    "plugins": [
        "jquery", // means eslint-plugin-jquery
    ]
    // ...
}
```

A scoped package:

```js
{
    // ...
    "plugins": [
        "@jquery/jquery", // means @jquery/eslint-plugin-jquery
        "@foobar" // means @foobar/eslint-plugin
    ]
    // ...
}
```

#### Use a plugin

Rules, environments, and configurations defined in plugins must be referenced with the following convention:

* `eslint-plugin-foo` → `foo/a-rule`
* `@foo/eslint-plugin` → `@foo/a-config`
* `@foo/eslint-plugin-bar` → `@foo/bar/a-environment`

For example:

```js
{
    // ...
    "plugins": [
        "jquery",   // eslint-plugin-jquery
        "@foo/foo", // @foo/eslint-plugin-foo
        "@bar"      // @bar/eslint-plugin
    ],
    "extends": [
        "plugin:@foo/foo/recommended",
        "plugin:@bar/recommended"
    ],
    "rules": {
        "jquery/a-rule": "error",
        "@foo/foo/some-rule": "error",
        "@bar/another-rule": "error"
    },
    "env": {
        "jquery/jquery": true,
        "@foo/foo/env-foo": true,
        "@bar/env-bar": true,
    }
    // ...
}
```

### Specify a Processor

Plugins may provide processors. Processors can extract JavaScript code from other kinds of files, then let ESLint lint the JavaScript code. Alternatively, processors can convert JavaScript code during preprocessing.

To specify processors in a configuration file, use the `processor` key with the concatenated string of a plugin name and a processor name by a slash. For example, the following enables the processor `a-processor` that the plugin `a-plugin` provided:

```json
{
    "plugins": ["a-plugin"],
    "processor": "a-plugin/a-processor"
}
```

To specify processors for specific kinds of files, use the combination of the `overrides` key and the `processor` key. For example, the following uses the processor `a-plugin/markdown` for `*.md` files.

```json
{
    "plugins": ["a-plugin"],
    "overrides": [
        {
            "files": ["*.md"],
            "processor": "a-plugin/markdown"
        }
    ]
}
```

Processors may make named code blocks such as `0.js` and `1.js`. ESLint handles such a named code block as a child file of the original file. You can specify additional configurations for named code blocks in the `overrides` section of the config. For example, the following disables the `strict` rule for the named code blocks which end with `.js` in markdown files.

```json
{
    "plugins": ["a-plugin"],
    "overrides": [
        {
            "files": ["*.md"],
            "processor": "a-plugin/markdown"
        },
        {
            "files": ["**/*.md/*.js"],
            "rules": {
                "strict": "off"
            }
        }
    ]
}
```

ESLint checks the file path of named code blocks then ignores those if any `overrides` entry didn't match the file path. Be sure to add an `overrides` entry if you want to lint named code blocks other than `*.js`.
