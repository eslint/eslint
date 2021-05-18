# Disallow Use of Alert (no-alert)

JavaScript's `alert`, `confirm`, and `prompt` functions are widely considered to be obtrusive as UI elements and should be replaced by a more appropriate custom UI implementation. Furthermore, `alert` is often used while debugging code, which should be removed before deployment to production.

```js
alert("here!");
```

## Rule Details

This rule is aimed at catching debugging code that should be removed and popup UI elements that should be replaced with less obtrusive, custom UIs. As such, it will warn when it encounters `alert`, `prompt`, and `confirm` function calls which are not shadowed.

Examples of **incorrect** code for this rule:

```js
/*eslint no-alert: "error"*/

alert("here!");

confirm("Are you sure?");

prompt("What's your name?", "John Doe");
```

Examples of **correct** code for this rule:

```js
/*eslint no-alert: "error"*/

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
