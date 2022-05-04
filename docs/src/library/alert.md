---
title: alert 
---

The alert message comes in three different types: a warning, a tip, and an important note.

## Usage

There is a shortcode for each type of alert. The shortcode expects you to provide the text and URL for the “Learn more” link.

```html
{ % warning "This rule has been removed in version x.xx", "/link/to/learn/more" % }

{ % tip "Kind reminder to do something maybe", "/link/to/learn/more" % }

{ % important "This rule has been deprecated in version x.xx", "/link/to/learn/more" % }
```

## Examples

{% warning "warning text", "/" %}
{% tip "tip text", "/" %}
{% important "text", "/" %}
