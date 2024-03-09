---
title: ESLint couldn't find the plugin …
eleventyNavigation:
    key: couldn't find the plugin
    parent: troubleshooting
    title: ESLint couldn't find the plugin …
---

[Legacy ESLint configuration files](../configure/configuration-files-deprecated) specify shareable configs by their package name.
That package name is passed to the Node.js `require()`, which looks up the package under local `node_modules/` directories.
For example, the following ESLint config will first try to load a module located at `node_modules/eslint-plugin-yours`:

```js
module.exports = {
    extends: ["eslint-plugin-yours"],
};
```

If the package is not found in any searched `node_modules/`, ESLint will print an error with the format:

```plaintext
ESLint couldn't find the plugin "${pluginName}".

(The package "${pluginName}" was not found when loaded as a Node module from the directory "${resolvePluginsRelativeTo}".)

It's likely that the plugin isn't installed correctly. Try reinstalling by running the following:

    npm install ${pluginName}@latest --save-dev

The plugin "${pluginName}" was referenced from the config file in "${importerName}".
```

Common reasons for this occurring include:

*   Not running `npm install` or the equivalent package manager command
*   Mistyping the case-sensitive name of the plugin

## Plugin Name Variations

The `eslint-plugin-` plugin name prefix may be omitted for brevity, e.g. `extends: ["yours"]`.

[`@` npm scoped packages](https://docs.npmjs.com/cli/v10/using-npm/scope) put the `eslint-plugin-` prefix after the org scope, e.g. `extends: ["@org/yours"]` to load from `@org/eslint-plugin-yours`.

## Resources

For more information, see:

* [Legacy ESLint configuration files](../configure/configuration-files#using-a-shareable-configuration-package) for documentation on the legacy ESLint configuration format
* [Configure Plugins](../configure/plugins) for documentation on how to extend from plugins
* [Create Plugins](../../extend/plugins#configs-in-plugins) for documentation on how to define plugins
