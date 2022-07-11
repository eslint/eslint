---
title: Rule list
---

The rule list is a macro defined in `components/rule-list.macro.html`. The macro accepts a list of rule names and renders comma-separated links.

## Usage

{% raw %}

```html
<!-- import the macro -->
{% from 'components/rule-list.macro.html' import ruleList %}

<!-- use the macro -->
{{ ruleList({ rules: ['accessor-pairs', 'no-undef'] }) }}
```

{% endraw %}

## Examples

{% from 'components/rule-list.macro.html' import ruleList %}

{{ ruleList({ rules: ['accessor-pairs', 'no-undef'] }) }}
