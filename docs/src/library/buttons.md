---
title: Buttons 
---

{% from 'components/button.macro.html' import button %}

There are three types of buttons: primary, secondary, and "ghost". The button styles can be applied to buttons and/or links that look like buttons.

To render the proper semantic element, provide the kind of behavior that is expected: `action` or `link` value. If the button performs an action, it is rendered as a `button`. If the button links somewhere, it renders as a `<a>`.

The button macro will default to `link`, which will render an <code>&lt;a&gt;</code> tag that looks like a button. If you provide `action` as a value for `behavior`, it indicates that it is a button _that performs an action_ and is therefore rendered as a `<button type="button">`.

## Usage

```html

<!-- import the macro in the page(s) you want to render the button(s) in -->
{% from 'components/button.macro.html' import button %}

<!-- use the macro -->

{ { button({ behavior: "action", type: "primary", text: "Do Something" }) } }

<!-- defaults to behavior: link -->
{ { button({ type: "primary", text: "Go somewhere", url: "/url/to/somewhere/" }) } }
```

## Examples

{{ button({ behavior: "action", type: "primary" }) }}
{{ button({ behavior: "action", text: "I perform an action", type: "secondary" }) }}
{{ button({ behavior: "action", text: "I perform an action", type: "ghost" }) }}

{{ button({ type: "primary", text: "I link somewhere", url: "#" }) }}
{{ button({ type: "secondary", text: "Secondary Button", url:"#" }) }}
{{ button({ type: "ghost", text: "Ghost Button", url:"#" }) }}
