# Enforce spacing before and after semicolons (semi-spacing)

JavaScript allows you to place unnecessary spaces before or after a semicolon.

Disallowing or enforcing space around a semicolon can improve the readability of your program.

```js
var a = "b" ;

var c = "d";var e = "f";
```

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule aims to enforce spacing around a semicolon. This rule prevents the use of spaces before a semicolon in expressions.

This rule doesn't check spacing in the following cases:

* The spacing after the semicolon if it is the first token in the line.

* The spacing before the semicolon if it is after an opening parenthesis (`(` or `{`), or the spacing after the semicolon if it is before a closing parenthesis (`)` or `}`). That spacing is checked by `space-in-parens` or `block-spacing`.

* The spacing around the semicolon in a for loop with an empty condition (`for(;;)`).

## Options

The rule takes one option, an object, which has two keys `before` and `after` having boolean values `true` or `false`.
If `before` is `true`, space is enforced before semicolons and if it's `false`, space is disallowed before semicolons.
If `after` is `true`, space is enforced after semicolons and if it's `false`, space is disallowed after semicolons.
The `after` option will be only applied if a semicolon is not at the end of line.

The default is `{"before": false, "after": true}`.

```json
    "semi-spacing": [2, {"before": false, "after": true}]
```

### `{"before": false, "after": true}`

This is the default option. It enforces spacing after semicolons and disallows spacing before semicolons.

The following patterns are considered problems:

```js
/*eslint semi-spacing: 2*/

var foo ;                      /*error Unexpected whitespace before semicolon.*/
var foo;var bar;               /*error Missing whitespace after semicolon.*/
throw new Error("error") ;     /*error Unexpected whitespace before semicolon.*/
while (a) { break ; }          /*error Unexpected whitespace before semicolon.*/
for (i = 0 ; i < 10 ; i++) {}  /*error Unexpected whitespace before semicolon.*/
for (i = 0;i < 10;i++) {}      /*error Missing whitespace after semicolon.*/
```

The following patterns are not considered problems:

```js
/*eslint semi-spacing: 2*/

var foo;
var foo; var bar;
throw new Error("error");
while (a) { break; }
for (i = 0; i < 10; i++) {}
for (;;) {}
if (true) {;}
;foo();
```

### `{"before": true, "after": false}`

This option enforces spacing before semicolons and disallows spacing after semicolons.

The following patterns are considered problems:

```js
/*eslint semi-spacing: [2, { "before": true, "after": false }]*/

var foo;                    /*error Missing whitespace before semicolon.*/
var foo ; var bar;          /*error Missing whitespace before semicolon.*/ /*error Unexpected whitespace after semicolon.*/
throw new Error("error");   /*error Missing whitespace before semicolon.*/
while (a) { break; }        /*error Missing whitespace before semicolon.*/ /*error Unexpected whitespace after semicolon.*/
for (i = 0;i < 10;i++) {}   /*error Missing whitespace before semicolon.*/
for (i = 0; i < 10; i++) {} /*error Missing whitespace before semicolon.*/ /*error Unexpected whitespace after semicolon.*/
```

The following patterns are not considered problems:

```js
/*eslint semi-spacing: [2, { "before": true, "after": false }]*/

var foo ;
var foo ;var bar ;
throw new Error("error") ;
while (a) {break ;}
for (i = 0 ;i < 10 ;i++) {}
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing before or after semicolons.

## Related Rules

* [semi](semi.md)
* [no-extra-semi](no-extra-semi.md)
* [comma-spacing](comma-spacing.md)
* [block-spacing](block-spacing.md)
* [space-in-parens](space-in-parens.md)
