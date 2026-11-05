---
title: Rule categories
---

## Rule categories

The rule categories—namely “recommended”, “fixable”, “hasSuggestions”, “frozen”, and “Handled by TypeScript”—are shown in the [rules page](../rules/). They are rendered using the `ruleCategories` macro (imported from `/components/rule-categories.macro.html`). There is also an individual macro for each category type except “Handled by TypeScript”, which is derived from each rule's documentation front matter.

```html
{ % from 'components/rule-categories.macro.html' import ruleCategories % } { {
ruleCategories({ recommended: true, fixable: true, hasSuggestions: true, handledByTypeScript: true }) } }
```

### Example

{% from 'components/rule-categories.macro.html' import ruleCategories, recommended, fixable, hasSuggestions %}

{{ ruleCategories({
        recommended: true,
        fixable: true,
        hasSuggestions: true,
        handledByTypeScript: true
}) }}

To mark an individual rule as handled by TypeScript, set `handled_by_typescript: true` in its front matter. The rules index will show the marker for that rule.

## A rule category

For every rule, you can render the category it belongs to using the corresponding category shortcode:

```html
{ % recommended % } { % fixable % } { % hasSuggestions % }
```

## Examples

{% recommended %}
{% fixable %}
{% hasSuggestions %}
