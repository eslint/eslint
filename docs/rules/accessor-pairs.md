# Enforces getter/setter pairs in objects (accessor-pairs)

It's a common mistake in JavaScript to create an object with just a setter for a property but never have a corresponding getter defined for it. Without a getter, you cannot read the property, so it ends up not being used.

Here are some examples:

```js
// Bad
var o = {
    set a(value) {
        this.val = value;
    }
};

// Good
var o = {
    set a(value) {
        this.val = value;
    },
    get a() {
        return this.val;
    }
};

```

This rule warns if setters are defined without getters. Using an option `getWithoutSet`, it will warn if you have a getter without a setter also.

## Rule Details

This rule enforces a style where it requires to have a getter for every property which has a setter defined.

By activating the option `getWithoutSet` it enforces the presence of a setter for every property which has a getter defined.

### Options

`getWithoutSet` set to `true` will warn for getters without setters (Default `false`).
`setWithoutGet` set to `true` will warn for setters without getters (Default `true`).

#### Usage

By default `setWithoutGet` option is always set to `true`.

```json
{
    "accessor-pairs": [2, {"getWithoutSet": true}]
}
```

The following patterns are considered problems by default:

```js
/*eslint accessor-pairs: 2*/

var o = {                       /*error Getter is not present*/
    set a(value) {
        this.val = value;
    }
};

var o = {d: 1};
Object.defineProperty(o, 'c', { /*error Getter is not present*/
    set: function(value) {
        this.val = value;
    }
});
```

The following patterns are not considered problems by default:

```js
/*eslint accessor-pairs: 2*/

var o = {
    set a(value) {
        this.val = value;
    },
    get a() {
        return this.val;
    }
};

var o = {d: 1};
Object.defineProperty(o, 'c', {
    set: function(value) {
        this.val = value;
    },
    get: function() {
        return this.val;
    }
});

```

#### getWithoutSet

The following patterns are considered problems with option `getWithoutSet` set:

```js
/*eslint accessor-pairs: [2, { getWithoutSet: true }]*/

var o = {                       /*error Getter is not present*/
    set a(value) {
        this.val = value;
    }
};

var o = {                       /*error Setter is not present*/
    get a() {
        return this.val;
    }
};

var o = {d: 1};
Object.defineProperty(o, 'c', { /*error Getter is not present*/
    set: function(value) {
        this.val = value;
    }
});

var o = {d: 1};
Object.defineProperty(o, 'c', { /*error Setter is not present*/
    get: function() {
        return this.val;
    }
});
```

The following patterns are not considered problems with option `getWithoutSet` set:

```js
/*eslint accessor-pairs: [2, { getWithoutSet: true }]*/
var o = {
    set a(value) {
        this.val = value;
    },
    get a() {
        return this.val;
    }
};

var o = {d: 1};
Object.defineProperty(o, 'c', {
    set: function(value) {
        this.val = value;
    },
    get: function() {
        return this.val;
    }
});

```

## When Not To Use It

You can turn this rule off if you are not concerned with the simultaneous presence of setters and getters on objects.

## Further Reading

* [Object Setters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set)
* [Object Getters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get)
* [Working with Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects)
