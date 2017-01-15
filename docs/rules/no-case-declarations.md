# Disallow lexical declarations in case/default clauses (no-case-declarations)

This rule disallows lexical declarations (`let`, `const`, `function` and `class`)
in `case`/`default` clauses. The reason is that the lexical declaration is visible
in the entire switch block but it only gets initialized when it is assigned, which
will only happen if the case where it is defined is reached.

To ensure that the lexical declaration only applies to the current case clause
wrap your clauses in blocks.

## Rule Details

This rule aims to prevent access to uninitialized lexical bindings as well as accessing hoisted functions across case clauses.

Examples of **incorrect** code for this rule:

```js
/*eslint no-case-declarations: "error"*/
/*eslint-env es6*/

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

Examples of **correct** code for this rule:

```js
/*eslint no-case-declarations: "error"*/
/*eslint-env es6*/

// Declarations outside switch-statements are valid
const a = 0;

switch (foo) {
    // The following case clauses are wrapped into blocks using brackets
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
    case 4:
        // Declarations using var without brackets are valid due to function-scope hoisting
        var z = 4;
        break;
    default: {
        class C {}
    }
}
```

## When Not To Use It

If you depend on fall through behavior and want access to bindings introduced in the case block.

## Related Rules

* [no-fallthrough](no-fallthrough.md)
