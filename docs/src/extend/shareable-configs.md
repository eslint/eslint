---
title: Share Configurations
eleventyNavigation:
    key: share configs
    parent: extend eslint
    title: Share Configurations
    order: 3

---

To share your ESLint configuration, create a **shareable config**. You can publish your shareable config on [npm](https://www.npmjs.com/) so that others can download and use it in their ESLint projects.

This page explains how to create and publish a shareable config.

## Creating a Shareable Config

Shareable configs are simply npm packages that export a configuration object. To start, [create a Node.js module](https://docs.npmjs.com/getting-started/creating-node-modules) like you normally would.

The module name must take one of the following forms:

* Begin with `eslint-config-`, such as `eslint-config-myconfig`.
* Be an npm [scoped module](https://docs.npmjs.com/misc/scope). To create a scoped module, name or prefix the module with `@scope/eslint-config`, such as `@scope/eslint-config` or `@scope/eslint-config-myconfig`.

In your module, export the shareable config from the module's [`main`](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#main) entry point file. The default main entry point is `index.js`. For example:

```js
// index.js
module.exports = {

    globals: {
        MyGlobal: true
    },

    rules: {
        semi: [2, "always"]
    }

};
```

Since the `index.js` file is just JavaScript, you can read these settings from a file or generate them dynamically.

## Publishing a Shareable Config

Once your shareable config is ready, you can [publish it to npm](https://docs.npmjs.com/getting-started/publishing-npm-packages) to share it with others. We recommend using the `eslint` and `eslintconfig` [keywords](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#keywords) in the `package.json` file so others can easily find your module.

You should declare your dependency on ESLint in the `package.json` using the [peerDependencies](https://docs.npmjs.com/files/package.json#peerdependencies) field. The recommended way to declare a dependency for future-proof compatibility is with the ">=" range syntax, using the lowest required ESLint version. For example:

```json
{
    "peerDependencies": {
        "eslint": ">= 3"
    }
}
```

If your shareable config depends on a plugin, you should also specify it as a `peerDependency` (plugins will be loaded relative to the end user's project, so the end user is required to install the plugins they need). However, if your shareable config depends on a [custom parser](custom-parsers) or another shareable config, you can specify these packages as `dependencies` in the `package.json`.

You can also test your shareable config on your computer before publishing by linking your module globally. Type:

```bash
npm link
```

Then, in your project that wants to use your shareable config, type:

```bash
npm link eslint-config-myconfig
```

Be sure to replace `eslint-config-myconfig` with the actual name of your module.

## Using a Shareable Config

To use a shareable config, include the config name in the `extends` field of a configuration file. For the value, use your module name. For example:

```json
{
    "extends": "eslint-config-myconfig"
}
```

You can also omit the `eslint-config-` and it is automatically assumed by ESLint:

```json
{
    "extends": "myconfig"
}
```

You cannot use shareable configs with the ESLint CLI [`--config`](../use/command-line-interface#-c---config) flag.

### npm Scoped Modules

npm [scoped modules](https://docs.npmjs.com/misc/scope) are also supported in a number of ways.

You can use the module name:

```json
{
    "extends": "@scope/eslint-config"
}
```

You can also omit the `eslint-config` and it is automatically assumed by ESLint:

```json
{
    "extends": "@scope"
}
```

The module name can also be customized. For example, if you have a package named `@scope/eslint-config-myconfig`, the configuration can be specified as:

```json
{
    "extends": "@scope/eslint-config-myconfig"
}
```

You could also omit `eslint-config` to specify the configuration as:

```json
{
    "extends": "@scope/myconfig"
}
```

### Overriding Settings from Shareable Configs

You can override settings from the shareable config by adding them directly into your `.eslintrc` file.

## Sharing Multiple Configs

You can share multiple configs in the same npm package. Specify a default config for the package by following the directions in the [Creating a Shareable Config](#creating-a-shareable-config) section. You can specify additional shareable configs by adding a new file to your npm package and then referencing it from your ESLint config.

As an example, you can create a file called `my-special-config.js` in the root of your npm package and export a config, such as:

```js
// my-special-config.js
module.exports = {
    rules: {
        quotes: [2, "double"]
    }
};
```

Then, assuming you're using the package name `eslint-config-myconfig`, you can access the additional config via:

```json
{
    "extends": "myconfig/my-special-config"
}
```

When using [scoped modules](https://docs.npmjs.com/misc/scope) it is not possible to omit the `eslint-config` namespace. Doing so would result in resolution errors as explained above. Assuming the package name is `@scope/eslint-config`, the additional config can be accessed as:

```json
{
    "extends": "@scope/eslint-config/my-special-config"
}
```

Note that you can leave off the `.js` from the filename.

**Important:** We strongly recommend always including a default config for your plugin to avoid errors.

## Local Config File Resolution

If you need to make multiple configs that can extend each other and live in different directories, you can create a single shareable config that handles this scenario.

As an example, let's assume you're using the package name `eslint-config-myconfig` and your package looks something like this:

```text
myconfig
├── index.js
└─┬ lib
  ├── defaults.js
  ├── dev.js
  ├── ci.js
  └─┬ ci
    ├── frontend.js
    ├── backend.js
    └── common.js
```

In the `index.js` file, you can do something like this:

```js
module.exports = require('./lib/ci.js');
```

Now inside the package you have `/lib/defaults.js`, which contains:

```js
module.exports = {
    rules: {
        'no-console': 1
    }
};
```

Inside `/lib/ci.js` you have:

```js
module.exports = require('./ci/backend');
```

Inside `/lib/ci/common.js`:

```js
module.exports = {
    rules: {
        'no-alert': 2
    },
    extends: 'myconfig/lib/defaults'
};
```

Despite being in an entirely different directory, you'll see that all `extends` must use the full package path to the config file you wish to extend.

Now inside `/lib/ci/backend.js`:

```js
module.exports = {
    rules: {
        'no-console': 1
    },
    extends: 'myconfig/lib/ci/common'
};
```

In the last file, once again see that to properly resolve your config, you need to include the full package path.

## Further Reading

* [npm Developer Guide](https://docs.npmjs.com/misc/developers)
