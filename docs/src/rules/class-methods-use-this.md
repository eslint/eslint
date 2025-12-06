---
title: class-methods-use-this
rule_type: suggestion
further_reading:
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static
---

[Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) are often used to encapsulate reusable logic, especially stateful logic, into an object where each instance's state is accessed via `this`. When an API is written with an instance method, it signals to consumers:

- The method's outcome is related to the object on which it's invoked, including possibly its state.

	```js
	const array1 = [1, 2, 3];
	const array2 = [4, 5, 6];

    // Using the `includes()` method on different objects gives different results:
	array1.includes(1); // true
	array2.includes(1); // false

	// Modifying the state of an object may change the outcome of its instance methods:
	array2.push(1);
	array2.includes(1); // true
	```

- The method doesn't make sense to be used without an associated object. (For example, it doesn't make sense to call `Array#includes()` without an array to operate on.)

It's possible to have a class method which doesn't use `this`, such as:

```js
class Person {
    sayHi() {
        console.log("Hi!");
    }
}

const person = new Person();
person.sayHi(); // => "Hi!"
```

If a class instance method does not use `this`, that normally means that it does not access any instance state and therefore doesn't need to be a method.
Therefore, it can *sometimes* be refactored into an [ordinary function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions) or a [static method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static), which may better communicate intent to users of the API.

In the example above, the `sayHi` method doesn't use `this`, so we can make it an ordinary function:

```js
// Ordinary function
function sayHi() {
	console.log("Hi!");
}

// No need for `Person` class or any instance thereof
sayHi(); // => "Hi!"

// Alternately, a static method may be used if it offers a more natural API
class Person {
    static sayHi() {
        console.log("Hi!");
    }
}

Person.sayHi(); // => "Hi!"

// Keep in mind that, either way, the following now throws an error,
// since sayHi() is no longer an instance method!
//
// const person = new Person();
// person.sayHi();
```

It's also possible the author forgot to use some piece of instance data that they intended to include.

```js
class Person {
	constructor(name) {
		this.name = name;
	}

	sayHi() {
		console.log(`Hi from ${this.name}!`);
	}
}

const alice = new Person('Alice');
alice.sayHi(); // => 'Hi from Alice!'

const bob = new Person('Bob');
bob.sayHi(); // => 'Hi from Bob!'
```

## Rule Details

This rule flags class instance methods that do not use `this`.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint class-methods-use-this: "error"*/

class A {
    foo() {
        console.log("Hello World"); /* error Expected 'this' to be used by class method 'foo'. */
    }
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint class-methods-use-this: "error"*/

class A {
    foo() {
        this.bar = "Hello World"; // OK, `this` is used
    }
}

class B {
    constructor() {
        // OK. constructor is exempt
    }
}

class C {
    static foo() {
        // OK. static methods aren't expected to use this.
    }

    static {
        // OK. static blocks are exempt.
    }
}
```

:::

## Options

This rule has four options:

- `"exceptMethods"` allows specified method names to be ignored with this rule.
- `"enforceForClassFields"` enforces that arrow functions and function expressions used as instance field initializers utilize `this`. This also applies to auto-accessor fields (fields declared with the `accessor` keyword) which are part of the [stage 3 decorators proposal](https://github.com/tc39/proposal-decorators). (default: `true`)
- `"ignoreOverrideMethods"` ignores members that are marked with the [`override` modifier](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html#override-and-the---noimplicitoverride-flag). (TypeScript only, default: `false`)
- `"ignoreClassesWithImplements"` ignores class members that are defined within a class that [`implements`](https://www.typescriptlang.org/docs/handbook/2/classes.html#implements-clauses) an interface. (TypeScript only)

### exceptMethods

```ts
"class-methods-use-this": [<enabled>, { "exceptMethods": [<...exceptions>] }]
```

The `"exceptMethods"` option allows you to pass an array of method names for which you would like to ignore warnings. For example, you might have a spec from an external library that requires you to overwrite a method as a regular function (and not as a static method) and does not use `this` inside the function body. In this case, you can add that method to ignore in the warnings.

Examples of **incorrect** code for this rule when used without `"exceptMethods"`:

::: incorrect

```js
/*eslint class-methods-use-this: "error"*/

class A {
    foo() {
    }
}
```

:::

Examples of **correct** code for this rule when used with exceptMethods:

::: correct

```js
/*eslint class-methods-use-this: ["error", { "exceptMethods": ["foo", "#bar"] }] */

class A {
    foo() {
    }
    #bar() {
    }
}
```

:::

### enforceForClassFields

```ts
"class-methods-use-this": [<enabled>, { "enforceForClassFields": true | false }]
```

The `enforceForClassFields` option enforces that arrow functions and function expressions used as instance field initializers utilize `this`. This also applies to auto-accessor fields (fields declared with the `accessor` keyword) which are part of the [stage 3 decorators proposal](https://github.com/tc39/proposal-decorators). (default: `true`)

Examples of **incorrect** code for this rule with the `{ "enforceForClassFields": true }` option (default):

::: incorrect

```js
/*eslint class-methods-use-this: ["error", { "enforceForClassFields": true }] */

class A {
    foo = () => {}
}
```

:::

Examples of **correct** code for this rule with the `{ "enforceForClassFields": true }` option (default):

::: correct

```js
/*eslint class-methods-use-this: ["error", { "enforceForClassFields": true }] */

class A {
    foo = () => {this;}
}
```

:::

Examples of **correct** code for this rule with the `{ "enforceForClassFields": false }` option:

::: correct

```js
/*eslint class-methods-use-this: ["error", { "enforceForClassFields": false }] */

class A {
    foo = () => {}
}
```

:::

Examples of **incorrect** TypeScript code for this rule with the `{ "enforceForClassFields": true }` option (default):

::: incorrect

```ts
/*eslint class-methods-use-this: ["error", { "enforceForClassFields": true }] */

class A {
    foo = () => {}
    accessor bar = () => {}
}
```

:::

Examples of **correct** TypeScript code for this rule with the `{ "enforceForClassFields": true }` option (default):

::: correct

```ts
/*eslint class-methods-use-this: ["error", { "enforceForClassFields": true }] */

class A {
    foo = () => {this;}
    accessor bar = () => {this;}
}
```

:::

Examples of **correct** TypeScript code for this rule with the `{ "enforceForClassFields": false }` option:

::: correct

```ts
/*eslint class-methods-use-this: ["error", { "enforceForClassFields": false }] */

class A {
    foo = () => {}
    accessor bar = () => {}
}
```

:::

### ignoreOverrideMethods

```ts
"class-methods-use-this": [<enabled>, { "ignoreOverrideMethods": true | false }]
```

The `ignoreOverrideMethods` option ignores members that are marked with the `override` modifier. (default: `false`)

Examples of **incorrect** TypeScript code for this rule with the `{ "ignoreOverrideMethods": false }` option (default):

::: incorrect

```ts
/*eslint class-methods-use-this: ["error", { "ignoreOverrideMethods": false }] */

abstract class Base {
    abstract method(): void;
    abstract property: () => void;
}

class Derived extends Base {
    override method() {}
    override property = () => {};
}
```

:::

Examples of **correct** TypeScript code for this rule with the `{ "ignoreOverrideMethods": false }` option (default):

::: correct

```ts
/*eslint class-methods-use-this: ["error", { "ignoreOverrideMethods": false }] */

abstract class Base {
    abstract method(): void;
    abstract property: () => void;
}

class Derived extends Base {
    override method() {
        this.foo = "Hello World";
    };
    override property = () => {
        this;
    };
}
```

:::

Examples of **correct** TypeScript code for this rule with the `{ "ignoreOverrideMethods": true }` option:

::: correct

```ts
/*eslint class-methods-use-this: ["error", { "ignoreOverrideMethods": true }] */

abstract class Base {
    abstract method(): void;
    abstract property: () => void;
}

class Derived extends Base {
    override method() {}
    override property = () => {};
}
```

:::

### ignoreClassesWithImplements

```ts
"class-methods-use-this": [<enabled>, { "ignoreClassesWithImplements": "all" | "public-fields" }]
```

The `ignoreClassesWithImplements` ignores class members that are defined within a class that `implements` an interface. The option accepts two possible values:

- `"all"` - Ignores all classes that implement interfaces
- `"public-fields"` - Only ignores public fields in classes that implement interfaces

Examples of **incorrect** TypeScript code for this rule with the `{ "ignoreClassesWithImplements": "all" }`:

::: incorrect

```ts
/*eslint class-methods-use-this: ["error", { "ignoreClassesWithImplements": "all" }] */

class Standalone {
    method() {}
    property = () => {};
}
```

:::

Examples of **correct** TypeScript code for this rule with the `{ "ignoreClassesWithImplements": "all" }` option:

::: correct

```ts
/*eslint class-methods-use-this: ["error", { "ignoreClassesWithImplements": "all" }] */

interface Base {
    method(): void;
}

class Derived implements Base {
    method() {}
    property = () => {};
}
```

:::

Examples of **incorrect** TypeScript code for this rule with the `{ "ignoreClassesWithImplements": "public-fields" }` option:

::: incorrect

```ts
/*eslint class-methods-use-this: ["error", { "ignoreClassesWithImplements": "public-fields" }] */

interface Base {
    method(): void;
}

class Derived implements Base {
    method() {}
    property = () => {};

    private privateMethod() {}
    private privateProperty = () => {};

    protected protectedMethod() {}
    protected protectedProperty = () => {};
}
```

:::

Examples of **correct** TypeScript code for this rule with the `{ "ignoreClassesWithImplements": "public-fields" }` option:

::: correct

```ts
/*eslint class-methods-use-this: ["error", { "ignoreClassesWithImplements": "public-fields" }] */

interface Base {
    method(): void;
}

class Derived implements Base {
    method() {}
    property = () => {};
}
```

:::


## When Not To Use It

Fixing violations of this rule almost always is a breaking change, since it requires a change at every usage of the affected method.
Therefore, if your project has downstream consumers you cannot break, or you do not wish to make invasive changes to every call site of a method, it likely does not make sense to address violations of this rule.
