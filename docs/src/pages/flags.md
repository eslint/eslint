---
title: Feature Flags
permalink: /flags/index.html
eleventyNavigation:
    key: feature flags
    parent: use eslint
    title: Feature Flags
    order: 6
---

{%- from 'components/npx_tabs.macro.html' import npx_tabs %}

ESLint ships experimental and future breaking changes behind feature flags to let users opt-in to behavior they want. Flags are used in these situations:

1. When a feature is experimental and not ready to be enabled for everyone.
1. When a feature is a breaking change that will be formally merged in the next major release, but users may opt-in to that behavior prior to the next major release.

## Flag Prefixes

The prefix of a flag indicates its status:

- `unstable_` indicates that the feature is experimental and the implementation may change before the feature is stabilized. This is a "use at your own risk" feature.
- `v##_` indicates that the feature is stabilized and will be available in the next major release. For example, `v10_some_feature` indicates that this is a breaking change that will be formally released in ESLint v10.0.0. These flags are removed each major release, and further use of them throws an error.

A feature may move from unstable to being enabled by default without a major release if it is a non-breaking change.

The following policies apply to `unstable_` flags.

- When the feature is stabilized
    - If enabling the feature by default would be a breaking change, a new `v##_` flag is added as active, and the `unstable_` flag becomes inactive. Further use of the `unstable_` flag automatically enables the `v##_` flag but emits a warning.
    - Otherwise, the feature is enabled by default, and the `unstable_` flag becomes inactive. Further use of the `unstable_` flag emits a warning.
- If the feature is abandoned, the `unstable_` flag becomes inactive. Further use of it throws an error.
- All inactive `unstable_` flags are removed each major release, and further use of them throws an error.

## Active Flags

The following flags are currently available for use in ESLint.

<table>
    <thead>
        <tr>
            <th>Flag</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
{%- for name, desc in flags.active -%}
        <tr><td><code>{{name}}</code></td><td>{{desc}}</td></tr>
{%- endfor -%}
    </tbody>
</table>

## Inactive Flags

The following flags were once used but are no longer active.

<table>
    <thead>
        <tr>
            <th>Flag</th>
            <th>Description</th>
            <th>Inactivity Reason</th>
        </tr>
    </thead>
    <tbody>
{%- for name, data in flags.inactive -%}
        <tr><td><code>{{name}}</code></td><td>{{data.description}}</td><td>{{data.inactivityReason}}</td></tr>
{%- endfor -%}
    </tbody>
</table>

## How to Use Feature Flags

Because feature flags are strictly opt-in, you need to manually enable the flags that you want.

### Enable Feature Flags with the CLI

On the command line, you can specify feature flags using the `--flag` option. You can specify as many flags as you'd like:

{{ npx_tabs({
    package: "eslint",
    args: ["--flag", "flag_one", "--flag", "flag_two", "file.js"]
}) }}

### Enable Feature Flags with Environment Variables

You can also set feature flags using the `ESLINT_FLAGS` environment variable. Multiple flags can be specified as a comma-separated list and are merged with any flags passed on the CLI or in the API. For example, here's how you can add feature flags to your `.bashrc` or `.bash_profile` files:

```bash
export ESLINT_FLAGS="flag_one,flag_two"
```

This approach is especially useful in CI/CD pipelines or when you want to enable the same flags across multiple ESLint commands.

### Enable Feature Flags with the API

When using the API, you can pass a `flags` array to both the `ESLint` and `Linter` classes:

```js
const { ESLint, Linter } = require("eslint");

const eslint = new ESLint({
	flags: ["flag_one", "flag_two"],
});

const linter = new Linter({
	flags: ["flag_one", "flag_two"],
});
```

::: tip
The `ESLint` class also reads the `ESLINT_FLAGS` environment variable to set flags.
:::

### Enable Feature Flags in VS Code

To enable flags in the VS Code ESLint Extension for the editor, specify the flags you'd like in the `eslint.options` setting in your [`settings.json`](https://code.visualstudio.com/docs/configure/settings#_settings-json-file) file:

```json
{
	"eslint.options": { "flags": ["flag_one", "flag_two"] }
}
```

To enable flags in the VS Code ESLint Extension for a lint task, specify the `eslint.lintTask.options` settings:

```json
{
	"eslint.lintTask.options": "--flag flag_one --flag flag_two ."
}
```

{# <!-- markdownlint-disable-file MD046 --> #}
