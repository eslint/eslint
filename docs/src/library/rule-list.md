---
title: Rule list
---

The rule list is a macro defined in `components/rule-list.macro.html`. The macro accepts a list of rule names and renders comma-separated links.

## Usage

{% raw %}

```html
<!-- import the macro -->
{% from 'components/rule-list.macro.html' import replacementRuleList %}

<!-- use the macro -->
{{ replacementRuleList({ specifiers: [{ rule: { name: 'global-require', url: '...' }, plugin: { name: '@eslint-comunnity/eslint-plugin-n', url: '...' } }] }) }}
```

{% endraw %}

## Examples

{% from 'components/rule-list.macro.html' import replacementRuleList %}

{{ replacementRuleList({ specifiers: [{ rule: { name: 'global-require', url: '...' }, plugin: { name: '@eslint-comunnity/eslint-plugin-n', url: '...' } }] }) }}
