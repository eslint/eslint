# Enforces that a return statement is present in property getters (getter-return)

The get syntax binds an object property to a function that will be called when that property is looked up. It is firstly introduced in ECMAScript 5:

```js
    var p = {
        get name(){
            return "nicholas";
        }
    };

    Object.defineProperty(p, "age", {
        get: function (){
            return 17;
        }
    });
```

Note that every `getter` is expected to return a value.

## Rule Details

This rule enforces that a return statement is present in property getters.

Examples of **incorrect** code for this rule:

```js
/*eslint getter-return: "error"*/

p = {
    get name(){
        // no returns.
    }
};

Object.defineProperty(p, "age", {
    get: function (){
        // no returns.
    }
});

class P{
    get name(){
        // no returns.
    }
}
```

Examples of **correct** code for this rule:

```js
/*eslint getter-return: "error"*/

p = {
    get name(){
        return "nicholas";
    }
};

Object.defineProperty(p, "age", {
    get: function (){
        return 18;
    }
});

class P{
    get name(){
        return "nicholas";
    }
}
```

## When Not To Use It

If your project will not be using getter you do not need this rule.

## Further Reading

* [MDN: Functions getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get)
* [Understanding ES6: Accessor Properties](https://leanpub.com/understandinges6/read/#leanpub-auto-accessor-properties)
