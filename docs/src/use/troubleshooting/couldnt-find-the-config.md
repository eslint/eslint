---
title: ESLint couldn't find the config … to extend from
eleventyNavigation:
    key: couldn't find the config to extend from
    parent: troubleshooting
    title: ESLint couldn't find the config … to extend from
---

## Symptoms

When using the [legacy ESLint config system](../configure/configuration-files-deprecated), you may see this error running ESLint after installing dependencies:

```plaintext
ESLint couldn't find the config "${configName}" to extend from. Please check that the name of the config is correct.

The config "${configName}" was referenced from the config file in "${importerName}".
```

## Cause

ESLint configuration files specify shareable configs by their package name in the `extends` array.
That package name is passed to the Node.js `require()`, which looks up the package under local `node_modules/` directories.
For example, the following ESLint config will first try to load a module located at `node_modules/eslint-config-yours`:

```js
module.exports = {
    extends: ["eslint-config-yours"],
};
```

The error is output when you attempt to extend from a configuration and the package for that configuration is not found in any searched `node_modules/`.

Common reasons for this occurring include:

*   Not running `npm install` or the equivalent package manager command
*   Mistyping the case-sensitive name of the package and/or configuration

### Config Name Variations

Note that ESLint supports several config name formats:

* The `eslint-config-` config name prefix may be omitted for brevity, e.g. `extends: ["yours"]`
    * [`@` npm scoped packages](https://docs.npmjs.com/cli/v10/using-npm/scope) put the `eslint-config-` prefix after the org scope, e.g. `extends: ["@org/yours"]` to load from `@org/eslint-config-yours`
* A `plugin:` prefix indicates a config is loaded from a shared plugin, e.g. `extends: [plugin:yours/recommended]` to load from `eslint-plugin-yours`

## Resolution

Common resolutions for this issue include:

* Upgrading all versions of all packages to their latest version.
* Adding the config as a `devDependency` in your `package.json`.
* Running `npm install` or the equivalent package manager command.
* Checking that the name in your config file matches the name of the config package.

## Resources

For more information, see:

* [Legacy ESLint configuration files](../configure/configuration-files-deprecated#using-a-shareable-configuration-package) for documentation on the legacy ESLint configuration format
    * [Legacy ESLint configuration files > Using a shareable configuration package](../configure/configuration-files-deprecated#using-a-shareable-configuration-package) for documentation on using shareable configurations
* [Share Configurations](../../extend/shareable-configs) for documentation on how to define standalone shared configs
* [Create Plugins > Configs in Plugins](../../extend/plugins#configs-in-plugins) for documentation on how to define shared configs in plugins
