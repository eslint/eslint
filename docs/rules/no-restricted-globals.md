# Disallow specific global variables (no-restricted-globals)

Disallowing usage of specific global variables can be useful if you want to allow a set of global
variables by enabling an environment, but still want to disallow some of those.

For instance, early Internet Explorer versions exposed the current DOM event as a global variable
`event`, but using this variable has been considered as a bad practice for a long time. Restricting
this will make sure this variable isn't used in browser code.

## Rule Details

This rule allows you to specify global variable names that you don't want to use in your application.

## Options

This rule takes a list of strings, where each string is a global to be restricted:

```json
{
    "rules": {
        "no-restricted-globals": ["error", "event", "fdescribe"]
    }
}
```

Alternatively, the rule also accepts objects, where the global name and an optional custom message are specified:

```json
{
    "rules": {
        "no-restricted-globals": [
            "error",
            {
                "name": "event",
                "message": "Use local parameter instead."
            },
            {
                "name": "fdescribe",
                "message": "Do not commit fdescribe. Use describe instead."
            }
        ]
    }
}
```

Examples of **incorrect** code for sample `"event", "fdescribe"` global variable names:

```js
/*global event, fdescribe*/
/*eslint no-restricted-globals: ["error", "event", "fdescribe"]*/

function onClick() {
    console.log(event);
}

fdescribe("foo", function() {
});
```

Examples of **correct** code for a sample `"event"` global variable name:

```js
/*global event*/
/*eslint no-restricted-globals: ["error", "event"]*/

import event from "event-module";
```

```js
/*global event*/
/*eslint no-restricted-globals: ["error", "event"]*/

var event = 1;
```

Examples of **incorrect** code for a sample `"event"` global variable name, along with a custom error message:

```js
/*global event*/
/* eslint no-restricted-globals: ["error", { name: "error", message: "Use local parameter instead." }] */

function onClick() {
    console.log(event);    // Unexpected global variable 'event'. Use local parameter instead.
}
```

## Related Rules

* [no-restricted-properties](no-restricted-properties.md)
* [no-restricted-syntax](no-restricted-syntax.md)
