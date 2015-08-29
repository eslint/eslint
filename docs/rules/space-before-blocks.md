# Require Or Disallow Space Before Blocks (space-before-blocks)

Consistency is an important part of any style guide.
While it is a personal preference where to put the opening brace of blocks,
it should be consistent across a whole project.
Having an inconsistent style distracts the reader from seeing the important parts of the code.

## Rule Details

This rule will enforce consistency of spacing before blocks. It is only applied on blocks that don’t begin on a new line.

This rule takes one argument. If it is `"always"` then blocks must always have at least one preceding space. If `"never"`
then all blocks should never have any preceding space. The default is `"always"`.

The following patterns are considered warnings when configured `"always"`:

```js
/*eslint space-before-blocks: 2*/

if (a){           /*error Missing space before opening brace.*/
    b();
}

if (a) {
    b();
} else{           /*error Missing space before opening brace.*/
    c();
}

function a(){}    /*error Missing space before opening brace.*/

for (;;){         /*error Missing space before opening brace.*/
    b();
}

try {} catch(a){} /*error Missing space before opening brace.*/
```

The following patterns are not considered warnings when configured `"always"`:

```js
/*eslint space-before-blocks: 2*/

if (a) {
    b();
}

function a() {}

for (;;) {
    b();
}

try {} catch(a) {}
```

The following patterns are considered warnings when configured `"never"`:

```js
/*eslint space-before-blocks: [2, "never"]*/

if (a) {           /*error Unexpected space before opening brace.*/
    b();
}

function a() {}    /*error Unexpected space before opening brace.*/

for (;;) {         /*error Unexpected space before opening brace.*/
    b();
}

try {} catch(a) {} /*error Unexpected space before opening brace.*/
```

The following patterns are not considered warnings when configured `"never"`:

```js
/*eslint space-before-blocks: [2, "never"]*/

if (a){
    b();
}

function a(){}

for (;;){
    b();
}

try{} catch(a){}
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing before blocks or if you are using the `space-after-keywords` rule set to `"never"`.

## Related Rules

* [space-after-keywords](space-after-keywords.md)
* [brace-style](brace-style.md)
