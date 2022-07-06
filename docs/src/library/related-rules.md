---
title: Related rules 
---

The `related_rules` shortcode is used to add one or more related rules to a rule.

## Usage

The shortcode expects an array of rule names.

```html
{ % related_rules ["no-extra-semi", "no-unexpected-multiline", "semi-spacing"] % }
```

## Example

{% related_rules ["no-extra-semi", "no-unexpected-multiline", "semi-spacing"] %}
