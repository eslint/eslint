---
title: no-unused-private-class-members
layout: doc
edit_link: https://github.com/eslint/eslint/edit/main/docs/src/rules/no-unused-private-class-members.md
rule_type: problem
---

Disallows unused private class members.

Private class members that are declared and not used anywhere in the code are most likely an error due to incomplete refactoring. Such class members take up space in the code and can lead to confusion by readers.

## Rule Details

This rule reports unused private class members.

* A private field or method is considered to be unused if its value is never read.
* A private accessor is considered to be unused if it is never accessed (read or write).

Examples of **incorrect** code for this rule:

```js
/*eslint no-unused-private-class-members: "error"*/

class Foo {
    #unusedMember = 5;
}

class Foo {
    #usedOnlyInWrite = 5;
    method() {
        this.#usedOnlyInWrite = 42;
    }
}

class Foo {
    #usedOnlyToUpdateItself = 5;
    method() {
        this.#usedOnlyToUpdateItself++;
    }
}

class Foo {
    #unusedMethod() {}
}

class Foo {
    get #unusedAccessor() {}
    set #unusedAccessor(value) {}
}
```

Examples of **correct** code for this rule:

```js
/*eslint no-unused-private-class-members: "error"*/

class Foo {
    #usedMember = 42;
    method() {
        return this.#usedMember;
    }
}

class Foo {
    #usedMethod() {
        return 42;
    }
    anotherMethod() {
        return this.#usedMethod();
    }
}

class Foo {
    get #usedAccessor() {}
    set #usedAccessor(value) {}
    
    method() {
        this.#usedAccessor = 42;
    }
}
```

## When Not To Use It

If you don't want to be notified about unused private class members, you can safely turn this rule off.
