# Disallow Unused Private Class Members (no-unused-private-class-members)

Private class members that are declared and not used anywhere in the code are most likely an error due to incomplete refactoring. Such class members take up space in the code and can lead to confusion by readers.

## Rule Details

A private class member `#foo` is considered to be used if any of the following are true:

* It is called (`this.#foo()`)
* It is read (`this.#foo`)
* It is passed into a function as an argument (`doSomething(this.#foo)`)

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
    #unusedMethod() {}
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
```

## When Not To Use It

If you don't want to be notified about unused private class members, you can safely turn this rule off.
