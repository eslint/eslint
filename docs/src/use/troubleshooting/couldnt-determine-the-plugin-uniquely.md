---
title: ESLint couldn't determine the plugin … uniquely
eleventyNavigation:
    key: couldn't determine plugin uniquely
    parent: troubleshooting
    title: ESLint couldn't determine the plugin … uniquely
---

## Symptoms

When using the [legacy ESLint config system](../configure/configuration-files-deprecated), you may see this error running ESLint after installing dependencies:

```plaintext
ESLint couldn't determine the plugin "${pluginId}" uniquely.

- ${filePath} (loaded in "${importerName}")
- ${filePath} (loaded in "${importerName}")
...

Please remove the "plugins" setting from either config or remove either plugin installation.
```

## Cause

ESLint configuration files allow loading in plugins that may include other plugins.
A plugin package might be specified as a dependency of both your package and one or more ESLint plugins.
Legacy ESLint configuration files may use `extends` to include other configurations.
Those configurations may depend on plugins to provide certain functionality in the configuration.

For example, if your config depends on `eslint-plugin-a@2` and `eslint-plugin-b@3`, and you extend `eslint-config-b` that depends on `eslint-plugin-a@1`, then the `eslint-plugin-a` package might have two different versions on disk:

* `node_modules/eslint-plugin-a`
* `node_modules/eslint-plugin-b/node_modules/eslint-plugin-a`

If the legacy ESLint configuration system sees that both plugins exists in multiple places with different versions, it won't know which one to use.

Note that this issue is only present in the legacy eslintrc configurations.
The new ["flat" config system](../configure/configuration-files) has you `import` the dependencies yourself, removing the need for ESLint to attempt to determine their version uniquely.

## Resolution

Common resolutions for this issue include:

* Upgrading all versions of all packages to their latest version.
* Running `npm dedupe` or the equivalent package manager command to deduplicate packages, if their version ranges are compatible.
* Using `overrides` or the equivalent package manager `package.json` field, to force a specific version of a plugin package.
    * Note that this may cause bugs in linting if the plugin package had breaking changes between versions.

## Resources

For more information, see:

* [Configure Plugins](../configure/plugins) for documentation on how to extend from plugins
* [Create Plugins](../../extend/plugins#configs-in-plugins) for documentation on how to define plugins
