# Disallow specific global variables (no-restricted-globals)

Disallowing usage of specific global variables can be useful if you want to allow a set of global
variables by enabling an environment, but still want to disallow some of those.

For instance, early Internet Explorer versions exposed the current DOM event as a global variable
`event`, but using this variable has been considered as a bad practice for a long time. Restricting
this will make sure this variable isn't used in browser code.

## Rule Details

This rule allows you to specify global variable names that you don't want to use in your application.

## Options

This rule takes a list of strings which are the global variable names.

Examples of **incorrect** code for sample `"event", "fdescribe"` global variable names:

```js
/*global event, fdescribe*/
/*eslint no-restricted-globals: [2, "event", "fdescribe"]*/

function onClick() {
    console.log(event);
}

fdescribe("foo", function() {
});
```

Examples of **correct** code for a sample `"event"` global variable name:

```js
/*global event*/
/*eslint no-restricted-globals: [2, "event"]*/

import event from "event-module";
```

```js
/*global event*/
/*eslint no-restricted-globals: [2, "event"]*/

var event = 1;
```
