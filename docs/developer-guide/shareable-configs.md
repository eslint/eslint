# Shareable Configs

The configuration that you have in your `.eslintrc` file is an important part of your project, and as such, you may want to share it with other projects or people. Shareable configs allow you to publish your configuration settings on [npm](https://npmjs.com) and have others download and use it in their ESLint projects.

## Creating a Shareable Config

Shareable configs are simply npm packages that export a configuration object. To start, [create a Node.js module](https://docs.npmjs.com/getting-started/creating-node-modules) like you normally would. Make sure the module name begins with `eslint-config-`, such as `eslint-config-myconfig`. Create a new `index.js` file and export an object containing your settings:

```js
module.exports = {

    globals: {
        MyGlobal: true
    },

    rules: {
        semi: [2, "always"]
    }

};
```

Since `index.js` is just JavaScript, you can optionally read these settings for a file or generate them dynamically.

## Publishing a Shareable Config

Once your shareable config is ready, you can [publish to npm](https://docs.npmjs.com/getting-started/publishing-npm-packages) to share with others. We recommend using the `eslint` and `eslintconfig` keywords so others can easily find your module.

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

Shareable configs are designed to work with the `extends` feature of `.eslintrc` files. Instead of using a file path for the value of `extends`, use your module name. For example:

```json
{
    "extends": "eslint-config-myconfig"
}
```

You can also omit the `eslint-config-` and it will be automatically assumed by ESLint:

```json
{
    "extends": "myconfig"
}
```

You can override settings from the shareable config by adding them directly into your `.eslintrc` file.

## Sharing Multiple Configs

It's possible to share multiple configs in the same npm package. You can specify a default config for the package by following the directions in the first section. You can specify additional configs by simply adding a new file to your npm package and then referencing it from your ESLint config.

As an example, you can create a file called `my-special-config.js` in the root of your npm package and export a config, such as:

```js
module.exports = {
    rules: {
        quotes: [2, "double"];
    }
};
```

Then, assuming you're using the package name `eslint-config-myconfig`, you can access the additional config via:

```json
{
    "extends": "myconfig/my-special-config"
}
```

Note that you can leave off the `.js` from the filename. In this way, you can add as many additional configs to your package as you'd like.

**Important:** We strongly recommend always including a default config for your plugin to avoid errors.

## Local Config File Resolution

If you need to make multiple configs that can extend from each other and live in different directories, you can create a single shareable config that handles this scenario.

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

In your `index.js` you can do something like this:

```js
module.exports = require('./lib/ci.js');
```

Now inside your package you have `/lib/defaults.js`, which contains:

```js
module.exports = {
    rules: {
        'no-console': 1
    }
};
```

Inside your `/lib/ci.js` you have

```js
module.exports = require('./ci/backend');
```

Inside your `/lib/ci/common.js`

```js
module.exports = {
    rules: {
        'no-alert': 2
    },
    extends: 'myconfig/lib/defaults'
};
```

Despite being in an entirely different directory, you'll see that all `extends` must use the full package path to the config file you wish to extend.

Now inside your `/lib/ci/backend.js`

```js
module.exports = {
    rules: {
        'no-console': 1
    },
    extends: 'myconfig/lib/ci/common'
};
```

In the last file, you'll once again see that to properly resolve your config, you'll need include the full package path.

## Further Reading

* [npm Developer Guide](https://docs.npmjs.com/misc/developers)
