---
title: ESLint couldn't determine the plugin … uniquely
eleventyNavigation:
    key: couldn't determine plugin uniquely
    parent: troubleshooting
    title: ESLint couldn't determine the plugin … uniquely
---

[ESLint configuration files](../configure/configuration-files) allow loading in plugins that may include other plugins.
A plugin package might be specified as a dependency of both your package and one or more ESLint plugins.
If the same plugin appears multiple times in different versions, ESLint will print an error with the format:

```plaintext
ESLint couldn't determine the plugin "${pluginId}" uniquely.

- ${filePath} (loaded in "${importerName}")
...

Please remove the "plugins" setting from either config or remove either plugin installation.
```

For example, if your package requires `eslint-plugin-a@2` and `eslint-plugin-b@3`, and `eslint-plugin-b` requires `eslint-plugin-a@1`, then the `eslint-plugin-a` package might have two different versions on disk:

* `node_modules/eslint-plugin-a`
* `node_modules/eslint-plugin-b/node_modules/eslint-plugin-a`

Common resolutions to this issue include:

* Upgrading all versions of all packages to their latest version
* Running `npm dedupe` or the equivalent package manager command to deduplicate packages, if their version ranges are compatible
* Using `overrides` or the equivalent package manager `package.json` field, to force a specific version of a plugin package
    * Note that this may cause bugs in linting if the plugin package had breaking changes between versions

## Resources

For more information, see:

* [Configure Plugins](../configure/plugins) for documentation on how to extend from plugins
* [Create Plugins](../../extend/plugins#configs-in-plugins) for documentation on how to define plugins
