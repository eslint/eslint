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
    name: "array-bracket-newline",
    deprecated: true,
    description: 'Enforces line breaks after opening and before closing array brackets.',
    categories: {
        recommended: true,
        fixable: true,
        hasSuggestions: false
    }
}) }}

 {{ rule({
    name: "no-arrow-condition",
    removed: true,
    description: 'Disallows arrow functions where test conditions are expected.',
    replacedBy: ["no-confusing-arrow", "no-constant-condition"],
    categories: {
        recommended: false,
        fixable: false,
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
