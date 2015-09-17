# Disallow Use of Alert (no-alert)

JavaScripts' alert, confirm, and prompt functions are widely considered to be obtrusive as UI elements and should be replaced by a more appropriate custom UI implementation. Furthermore, alert is often used while debugging code, which should be removed before deployment to production.

```js
alert("here!");
```

## Rule Details

This rule is aimed at catching debugging code that should be removed and popup UI elements that should be replaced with less obtrusive, custom UIs. As such, it will warn when it encounters `alert`, `prompt`, and `confirm` function calls which are not shadowed.

The following patterns are considered problems:

```js
/*eslint no-alert: 2*/

alert("here!");                          /*error Unexpected alert.*/

confirm("Are you sure?");                /*error Unexpected confirm.*/

prompt("What's your name?", "John Doe"); /*error Unexpected prompt.*/
```

The following patterns are not considered problems:

```js
/*eslint no-alert: 2*/

customAlert("Something happened!");

customConfirm("Are you sure?");

customPrompt("Who are you?");

function foo() {
    var alert = myCustomLib.customAlert;
    alert();
}
```

## Related Rules

* [no-console](no-console.md)
* [no-debugger](no-debugger.md)
