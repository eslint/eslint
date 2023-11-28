---
title: no-mixed-spaces-and-tabs
rule_type: layout
further_reading:
- https://www.emacswiki.org/emacs/SmartTabs
---

This rule was **deprecated** in ESLint v8.53.0. Please use the corresponding rule in [`@stylistic/eslint-plugin-js`](https://eslint.style/packages/js).

Most code conventions require either tabs or spaces be used for indentation. As such, it's usually an error if a single line of code is indented with both tabs and spaces.

## Rule Details

This rule disallows mixed spaces and tabs for indentation.

Examples of **incorrect** code for this rule:

<!-- markdownlint-capture -->
<!-- markdownlint-disable MD010 -->
::: incorrect

```js
/*eslint no-mixed-spaces-and-tabs: "error"*/

function add(x, y) {
	  return x + y;
}

function main() {
	var x = 5,
	    y = 7;
}
```

:::
<!-- markdownlint-restore -->

Examples of **correct** code for this rule:

<!-- markdownlint-capture -->
<!-- markdownlint-disable MD010 -->
::: correct

```js
/*eslint no-mixed-spaces-and-tabs: "error"*/

function add(x, y) {
	return x + y;
}
```

:::
<!-- markdownlint-restore -->

## Options

This rule has a string option.

* `"smart-tabs"` allows mixed tabs and spaces when the spaces are used for alignment.

### smart-tabs

Examples of **correct** code for this rule with the `"smart-tabs"` option:

<!-- markdownlint-capture -->
<!-- markdownlint-disable MD010 -->
::: correct

```js
/*eslint no-mixed-spaces-and-tabs: ["error", "smart-tabs"]*/

function main() {
	var x = 5,
	    y = 7;
}
```

:::
<!-- markdownlint-restore -->
