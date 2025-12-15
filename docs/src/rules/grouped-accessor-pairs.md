---
title: grouped-accessor-pairs
rule_type: suggestion
related_rules:
- accessor-pairs
- no-dupe-keys
- no-dupe-class-members
further_reading:
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
---


A getter and setter for the same property don't necessarily have to be defined adjacent to each other.

For example, the following statements would create the same object:

```js
const o = {
    get a() {
        return this.val;
    },
    set a(value) {
        this.val = value;
    },
    b: 1
};

const o1 = {
    get a() {
        return this.val;
    },
    b: 1,
    set a(value) {
        this.val = value;
    }
};
```

While it is allowed to define the pair for a getter or a setter anywhere in an object or class definition, it's considered a best practice to group accessor functions for the same property.

In other words, if a property has a getter and a setter, the setter should be defined right after the getter, or vice versa.

## Rule Details

This rule requires grouped definitions of accessor functions for the same property in object literals, class declarations and class expressions.

Optionally, this rule can also enforce consistent order (`getBeforeSet` or `setBeforeGet`).

This rule does not enforce the existence of the pair for a getter or a setter. See [accessor-pairs](accessor-pairs) if you also want to enforce getter/setter pairs.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint grouped-accessor-pairs: "error"*/

const foo = {
    get a() {
        return this.val;
    },
    b: 1,
    set a(value) {
        this.val = value;
    }
};

const bar = {
    set b(value) {
        this.val = value;
    },
    a: 1,
    get b() {
        return this.val;
    }
}

class Foo {
    set a(value) {
        this.val = value;
    }
    b(){}
    get a() {
        return this.val;
    }
}

const Bar = class {
    static get a() {
        return this.val;
    }
    b(){}
    static set a(value) {
        this.val = value;
    }
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint grouped-accessor-pairs: "error"*/

const foo = {
    get a() {
        return this.val;
    },
    set a(value) {
        this.val = value;
    },
    b: 1
};

const bar = {
    set b(value) {
        this.val = value;
    },
    get b() {
        return this.val;
    },
    a: 1
}

class Foo {
    set a(value) {
        this.val = value;
    }
    get a() {
        return this.val;
    }
    b(){}
}

const Bar = class {
    static get a() {
        return this.val;
    }
    static set a(value) {
        this.val = value;
    }
    b(){}
}
```

:::

## Options

This rule has a primary string and an optional secondary object option.
The string option specifies the order:
* `"anyOrder"` (default) does not enforce order.
* `"getBeforeSet"` if a property has both getter and setter, requires the getter to be defined before the setter.
* `"setBeforeGet"` if a property has both getter and setter, requires the setter to be defined before the getter.

The optional object option allows opting-in to check additional object-likes:
* `enforceForTSTypes`: also check TypeScript types (interfaces and type literals)

### getBeforeSet

Examples of **incorrect** code for this rule with the `"getBeforeSet"` option:

::: incorrect

```js
/*eslint grouped-accessor-pairs: ["error", "getBeforeSet"]*/

const foo = {
    set a(value) {
        this.val = value;
    },
    get a() {
        return this.val;
    }
};

class Foo {
    set a(value) {
        this.val = value;
    }
    get a() {
        return this.val;
    }
}

const Bar = class {
    static set a(value) {
        this.val = value;
    }
    static get a() {
        return this.val;
    }
}
```

:::

Examples of **correct** code for this rule with the `"getBeforeSet"` option:

::: correct

```js
/*eslint grouped-accessor-pairs: ["error", "getBeforeSet"]*/

const foo = {
    get a() {
        return this.val;
    },
    set a(value) {
        this.val = value;
    }
};

class Foo {
    get a() {
        return this.val;
    }
    set a(value) {
        this.val = value;
    }
}

const Bar = class {
    static get a() {
        return this.val;
    }
    static set a(value) {
        this.val = value;
    }
}
```

:::

### setBeforeGet

Examples of **incorrect** code for this rule with the `"setBeforeGet"` option:

::: incorrect

```js
/*eslint grouped-accessor-pairs: ["error", "setBeforeGet"]*/

const foo = {
    get a() {
        return this.val;
    },
    set a(value) {
        this.val = value;
    }
};

class Foo {
    get a() {
        return this.val;
    }
    set a(value) {
        this.val = value;
    }
}

const Bar = class {
    static get a() {
        return this.val;
    }
    static set a(value) {
        this.val = value;
    }
}
```

:::

Examples of **correct** code for this rule with the `"setBeforeGet"` option:

::: correct

```js
/*eslint grouped-accessor-pairs: ["error", "setBeforeGet"]*/

const foo = {
    set a(value) {
        this.val = value;
    },
    get a() {
        return this.val;
    }
};

class Foo {
    set a(value) {
        this.val = value;
    }
    get a() {
        return this.val;
    }
}

const Bar = class {
    static set a(value) {
        this.val = value;
    }
    static get a() {
        return this.val;
    }
}
```

:::
### enforceForTSTypes

Examples of **incorrect** code for this rule with `["anyOrder", { enforceForTSTypes: true }]`:

::: incorrect

```ts
/*eslint grouped-accessor-pairs: ["error", "anyOrder", { enforceForTSTypes: true }] */

interface I {
    get a(): string,
    between: true,
    set a(value: string): void
}

type T = {
    get a(): string,
    between: true,
    set a(value: string): void
};
```

:::

Examples of **correct** code for this rule with `["anyOrder", { enforceForTSTypes: true }]`:

::: correct

```ts
/*eslint grouped-accessor-pairs: ["error", "anyOrder", { enforceForTSTypes: true }] */

interface I {
    get a(): string,
    set a(value: string): void,
}

type T = {
    set a(value: string): void,
    get a(): string,
};
```

:::

## Known Limitations

Due to the limits of static analysis, this rule does not account for possible side effects and in certain cases
might require or miss to require grouping or order for getters/setters that have a computed key, like in the following example:

```js
/*eslint grouped-accessor-pairs: "error"*/

let a = 1;

// false warning (false positive)
const foo = {
    get [a++]() {
        return this.val;
    },
    b: 1,
    set [a++](value) {
        this.val = value;
    }
};

// missed warning (false negative)
const bar = {
    get [++a]() {
        return this.val;
    },
    b: 1,
    set [a](value) {
        this.val = value;
    }
};
```

Also, this rule does not report any warnings for properties that have duplicate getters or setters.

See [no-dupe-keys](no-dupe-keys) if you also want to disallow duplicate keys in object literals.

See [no-dupe-class-members](no-dupe-class-members) if you also want to disallow duplicate names in class definitions.
