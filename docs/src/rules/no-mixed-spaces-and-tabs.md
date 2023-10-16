---
title: no-mixed-spaces-and-tabs
rule_type: layout
further_reading:
- https://www.emacswiki.org/emacs/SmartTabs
---



Most code conventions require either tabs or spaces be used for indentation. As such, it's usually an error if a single line of code is indented with both tabs and spaces.

## Rule Details

This rule disallows mixed spaces and tabs for indentation.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-mixed-spaces-and-tabs: "error"*/

function add(x, y) {
<<TAB>>  return x + y;
}

function main() {
<<TAB>>var x = 5,
<<TAB>>    y = 7;
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-mixed-spaces-and-tabs: "error"*/

function add(x, y) {
<<TAB>>return x + y;
}
```

:::

## Options

This rule has a string option.

* `"smart-tabs"` allows mixed tabs and spaces when the spaces are used for alignment.

### smart-tabs

Examples of **correct** code for this rule with the `"smart-tabs"` option:

::: correct

```js
/*eslint no-mixed-spaces-and-tabs: ["error", "smart-tabs"]*/

function main() {
<<TAB>>var x = 5,
<<TAB>>    y = 7;
}
```

:::
