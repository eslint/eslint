# Disallow lexical declarations in case/default clauses (no-case-declarations)

This rule disallows lexical declarations (`let`, `const`, `function` and `class`)
in `case`/`default` clauses. The reason is that the lexical declaration is visible
in the entire switch block but it only gets initialized when it is assigned, which
will only happen if the case where it is defined is reached.

```js
switch (foo) {
    case 1:
        let x = 1;
        break;
    case 2:
        const y = 2;
        break;
    case 3:
        function f() {}
        break;
    default:
        class C {}
}
```

To ensure that the lexical declaration only applies to the current case clause
wrap your clauses in blocks.

```js
switch (foo) {
    case 1: {
        let x = 1;
        break;
    }
    case 2: {
        const y = 2;
        break;
    }
    case 3: {
        function f() {}
        break;
    }
    default: {
        class C {}
    }
}
```

## Rule Details

This rule aims to prevent access to uninitialized lexical bindings as well as accessing hoisted functions across case clauses.

```js
/*eslint no-case-declarations: 2*/

switch (foo) {
    case 1:
        let x = 1;  /*error Unexpected lexical declaration in case block.*/
        break;
    case 2:
        const y = 2;  /*error Unexpected lexical declaration in case block.*/
        break;
    case 3:
        function f() {}  /*error Unexpected lexical declaration in case block.*/
        break;
    default:
        class C {}  /*error Unexpected lexical declaration in case block.*/
}
```

## When Not To Use It

If you depend on fall through behavior and want access to bindings introduced in the case block.

## Related Rules

* [no-fallthrough](no-fallthrough.md)
