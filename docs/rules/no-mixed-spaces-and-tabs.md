# Disallow mixed spaces and tabs for indentation (no-mixed-spaces-and-tabs)

Most code conventions require either tabs or spaces be used for indentation. As such, it's usually an error if a single line of code is indented with both tabs and spaces.

## Rule Details

The `no-mixed-spaces-and-tabs` rule is aimed at flagging any lines of code that are indented with a mixture of tabs and spaces.

### Options

* Smart Tabs

This option suppresses warnings about mixed tabs and spaces when the latter are used for alignment only. This technique is called [SmartTabs](http://www.emacswiki.org/emacs/SmartTabs). The option is turned off by default.

You can enable this option by using the following configuration:

```json
"no-mixed-spaces-and-tabs": [2, "smart-tabs"]
```

The following patterns are considered problems:

```js
/*eslint no-mixed-spaces-and-tabs: 2*/

function add(x, y) {
// --->..return x + y;

      return x + y;    /*error Mixed spaces and tabs.*/
}

function main() {
// --->var x = 5,
// --->....y = 7;

    var x = 5,
        y = 7;         /*error Mixed spaces and tabs.*/
}
```

The following patterns are not considered problems:

```js
/*eslint no-mixed-spaces-and-tabs: 2*/

function add(x, y) {
// --->return x + y;
    return x + y;
}
```

When the SmartTabs option is enabled the following does not produce a warning:

```js
/*eslint no-mixed-spaces-and-tabs: [2, "smart-tabs"]*/

function main() {
// --->var x = 5,
// --->....y = 7;

    var x = 5,
        y = 7;
}
```


## Further Reading

* [Smart Tabs](http://www.emacswiki.org/emacs/SmartTabs)
