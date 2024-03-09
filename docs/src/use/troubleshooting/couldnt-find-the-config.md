---
title: ESLint couldn't find the config … to extend from
eleventyNavigation:
    key: couldn't find the config to extend from
    parent: troubleshooting
    title: ESLint couldn't find the config … to extend from
---

[Legacy ESLint configuration files](../configure/configuration-files) specify shareable configs by their package name.
That package name is passed to the Node.js `require()`, which looks up the package under local `node_modules/` directories.
For example, the following ESLint config will first try to load a module located at `node_modules/eslint-config-yours`:

```js
module.exports = {
    extends: ["eslint-config-yours"],
};
```

If the package is not found in any searched `node_modules/`, ESLint will print an error with the format:

```plaintext
ESLint couldn't find the config "${configName}" to extend from. Please check that the name of the config is correct.

The config "${configName}" was referenced from the config file in "${importerName}".
```

Common reasons for this occurring include:

*   Not running `npm install` or the equivalent package manager command
*   Mistyping the case-sensitive name of the package and/or configuration

## Config Name Variations

ESLint supports several config name formats:

* The `eslint-config-` config name prefix may be omitted for brevity, e.g. `extends: ["yours"]`
    * [`@` npm scoped packages](https://docs.npmjs.com/cli/v10/using-npm/scope) put the `eslint-config-` prefix after the org scope, e.g. `extends: ["@org/yours"]` to load from `@org/eslint-config-yours`
* A `plugin:` prefix indicates a config is loaded from a shared plugin, e.g. `extends: [plugin:yours/recommended]` to load from `eslint-plugin-yours`

## Resources

For more information, see:

* [Legacy ESLint configuration files](../configure/configuration-files#using-a-shareable-configuration-package) for documentation on the legacy ESLint configuration format
    * [Legacy ESLint configuration files > Using a shareable configuration package](../configure/configuration-files#using-a-shareable-configuration-package) for documentation on using shareable configurations
* [Share Configurations](../../extend/shareable-configs) for documentation on how to define standalone shared configs
* [Create Plugins > Configs in Plugins](../../extend/plugins#configs-in-plugins) for documentation on how to define shared configs in plugins
