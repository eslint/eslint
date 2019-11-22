# disallow inline comments after code (no-inline-comments)

Some style guides disallow comments on the same line as code. Code can become difficult to read if comments immediately follow the code on the same line.
On the other hand, it is sometimes faster and more obvious to put comments immediately following code.

## Rule Details

This rule disallows comments on the same line as code.

Examples of **incorrect** code for this rule:

```js
/*eslint no-inline-comments: "error"*/

var a = 1; // declaring a to 1

function getRandomNumber(){
    return 4; // chosen by fair dice roll.
              // guaranteed to be random.
}

/* A block comment before code */ var b = 2;

var c = 3; /* A block comment after code */
```

Examples of **correct** code for this rule:

```js
/*eslint no-inline-comments: "error"*/

// This is a comment above a line of code
var foo = 5;

var bar = 5;
//This is a comment below a line of code
```

### JSX exception

Comments inside the curly braces in JSX are allowed to be on the same line as the braces, but only if they are not on the same line with other code, and the braces do not enclose an actual expression.

Examples of **incorrect** code for this rule:

```js
/*eslint no-inline-comments: "error"*/

var foo = <div>{ /* On the same line with other code */ }<h1>Some heading</h1></div>;

var bar = (
    <div>
    {   // These braces are not just for the comment, so it can't be on the same line
        baz
    }
    </div>
);
```

Examples of **correct** code for this rule:

```js
/*eslint no-inline-comments: "error"*/

var foo = (
    <div>
      {/* These braces are just for this comment and there is nothing else on this line */}
      <h1>Some heading</h1>
    </div>
)

var bar = (
    <div>
    {
        // There is nothing else on this line
        baz
    }
    </div>
);

var quux = (
    <div>
      {/*
        Multiline
        comment
      */}
      <h1>Some heading</h1>
    </div>
)
```
