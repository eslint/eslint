---
title: Rule categories
---

## Rule categories

The rule categories—namely “recommended”, “fixable”, and “hasSuggestions”—are shown in the [rules page](/rules/). They are rendered using the `ruleCategories` macro (imported from `/components/rule-categories.macro.html`). There is also an individual macro for each category type.

```html
{ % from 'components/rule-categories.macro.html' import ruleCategories % }

{ { ruleCategories({
        recommended: true,
        fixable: true,
        hasSuggestions: true
}) } }
```

### Example

{% from 'components/rule-categories.macro.html' import ruleCategories, recommended, fixable, hasSuggestions %}

{{ ruleCategories({
        recommended: true,
        fixable: true,
        hasSuggestions: true
}) }}

## A rule category

For every rule, you can render the category it belongs to using the corresponding category shortcode:

```html
{ % recommended % }
{ % fixable % }
{ % hasSuggestions % }
```

## Examples

{% recommended %}
{% fixable %}
{% hasSuggestions %}
