---
title: Feature Flags
permalink: /flags/index.html
eleventyNavigation:
    key: feature flags
    parent: use eslint
    title: Feature Flags
    order: 6
---

ESLint ships experimental and future breaking changes behind feature flags to let users opt-in to behavior they want. Flags are used in these situations:

1. When a feature is experimental and not ready to be enabled for everyone.
1. When a feature is a breaking change that will be formally merged in the next major release, but users may opt-in to that behavior prior to the next major release.

## Flag Prefixes

The prefix of a flag indicates its status:

* `unstable_` indicates that the feature is experimental and the implementation may change before the feature is stabilized. This is a "use at your own risk" feature.
* `v##_` indicates that the feature is stabilized and will be available in the next major release. For example, `v10_some_feature` indicates that this is a breaking change that will be formally released in ESLint v10.0.0. These flags are removed each major release.

A feature may move from unstable to stable without a major release if it is a non-breaking change.

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
        </tr>
    </thead>
    <tbody>
{%- for name, desc in flags.inactive -%}
        <tr><td><code>{{name}}</code></td><td>{{desc}}</td></tr>
{%- endfor -%}
    </tbody>
</table>

## How to Use Feature Flags

Because feature flags are strictly opt-in, you need to manually enable the flags that you want.

### Enable Feature Flags with the CLI

On the command line, you can specify feature flags using the `--flag` option. You can specify as many flags as you'd like:

```shell
npx eslint --flag flag_one --flag flag_two file.js
```

### Enable Feature Flags with the API

When using the API, you can pass a `flags` array to both the `ESLint` and `Linter` classes:

```js
const { ESLint, Linter } = require("eslint");

const eslint = new ESLint({
    flags: ["flag_one", "flag_two"]
});

const linter = new Linter({
    flags: ["flag_one", "flag_two"]
});
```

### Enable Feature Flags in VS Code

To enable flags in the VS Code ESLint Extension for the editor, specify the flags you'd like in the `eslint.options` setting in your `settings.json` file:

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
