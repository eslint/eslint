---
title: Rule 
---

The rule component is a macro defined in `/components/rule.macro.html`. The macro accepts a set of parameters used to render the rule.

A rule has a:

* name
* description
* a flag to indicate whether it's deprecated or removed: `deprecated` and `removed` respectively
* a replacedBy value indicating the rule it has been replaced with (if applicable)
* a categories object indicating the rule's category

## Usage

```html
<!-- import the macro -->
{ % from 'components/rule.macro.html' import rule % }

<!-- use the macro -->
 { { rule({
    name: "rule-name",
    deprecated: true, // or removed: true
    replacedBy: "name-of-replacement-rule"
    description: 'Example: Enforce `return` statements in getters.',
    categories: {
        recommended: true,
        fixable: true,
        hasSuggestions: false
    }
}) } }
```

## Examples

{% from 'components/rule.macro.html' import rule %}

 {{ rule({
    name: "getter-return",
    deprecated: true,
    description: 'Enforce `return` statements in getters.',
    categories: {
        recommended: true,
        fixable: true,
        hasSuggestions: false
    }
}) }}

 {{ rule({
    name: "getter-return",
    removed: true,
    description: 'Enforce `return` statements in getters.',
    replacedBy: "other-rule-here",
    categories: {
        recommended: true,
        fixable: true,
        hasSuggestions: false
    }
}) }}

{{ rule({
    name: "getter-return",
    deprecated: false,
    description: 'Enforce `return` statements in getters.',
    categories: {
        recommended: true,
        fixable: false,
        hasSuggestions: false
    }

}) }}
