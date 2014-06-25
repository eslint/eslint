# Disallow mixed spaces and tabs for indentation (no-mixed-spaces-and-tabs)

To ensure code is displayed correctly regardless of the viewer's tab size, this rule enforces only tabs or only spaces may be used for indenting code blocks.

The following patterns are considered warnings:

```js
function add(x, y) {
--->..return x + y;
}

function main() {
--->var x = 5,
--->....y = 7;
}
```

The following patterns are not warnings:

```js
function add(x, y) {
--->return x + y;
}

/* 
 * When the SmartTabs option is enabled the following 
 * does not produce a warning.
 */
function main() {
--->var x = 5,
--->....y = 7;
}
```

### Options

- SmartTabs

This option suppresses warnings about mixed tabs and spaces when the latter are
used for alignment only. This technique is called [SmartTabs](http://www.emacswiki.org/emacs/SmartTabs). The option is turned off by default.

You can enable this option by using the following configuration:
```json
"no-mixed-spaces-and-tabs": [2, true]
```

## Further Reading

[Click here](http://www.emacswiki.org/emacs/SmartTabs) to learn more about SmartTabs. 