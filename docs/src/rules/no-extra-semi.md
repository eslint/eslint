---
title: no-extra-semi
layout: doc
edit_link: https://github.com/eslint/eslint/edit/main/docs/src/rules/no-extra-semi.md
rule_type: suggestion
related_rules:
- semi
- semi-spacing
---

<!--RECOMMENDED-->

<!--FIXABLE-->

Disallows unnecessary semicolons.

Typing mistakes and misunderstandings about where semicolons are required can lead to semicolons that are unnecessary. While not technically an error, extra semicolons can cause confusion when reading code.

## Rule Details

This rule disallows unnecessary semicolons.

Examples of **incorrect** code for this rule:

```js
/*eslint no-extra-semi: "error"*/

var x = 5;;

function foo() {
    // code
};

class C {
    field;;

    method() {
        // code
    };

    static {
        // code
    };
};
```

Examples of **correct** code for this rule:

```js
/*eslint no-extra-semi: "error"*/

var x = 5;

function foo() {
    // code
}

var bar = function() {
    // code
};

class C {
    field;

    method() {
        // code
    }

    static {
        // code
    }
}
```

## When Not To Use It

If you intentionally use extra semicolons then you can disable this rule.
