# Code Conventions

Programming language style guides are important for the long-term maintainability of software. This guide is based on the [Code Conventions for the Java Programming Language](https://java.sun.com/docs/codeconv/) and [Douglas Crockford's Code Conventions for the JavaScript Programming Language](http://javascript.crockford.com/code.html). Modifications have been made due to my personal experience and preferences.

## File Format

Each file has this same basic format:

```js
/**
 * @fileoverview Description of the file
 * @author Your Name
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// require() statements

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

// private methods/data

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

// exported objects/methods
module.exports = {

};
```

The `@author` field gives you credit for having created the file.

## Indentation

Each indentation level is made up of four spaces. Do not use tabs.

    // Good
    if (true) {
        doSomething();
    }

## Primitive Literals

Strings should always use double quotes (never single quotes) and should always appear on a single line. Never use a slash to create a new line in a string.

    // Good
    var name = "Nicholas";

    // Bad: Single quotes
    var name = 'Nicholas';

    // Bad: Wrapping to second line
    var longString = "Here's the story, of a man \
    named Brady.";

Numbers should be written as decimal integers, e-notation integers, hexadecimal integers or floating-point decimals with at least one digit before and one digit after the decimal point. Never use octal literals.

    // Good
    var count = 10;

    // Good
    var price = 10.0;
    var price = 10.00;

    // Good
    var num = 0xA2;

    // Good
    var num = 1e23;

    // Bad: Hanging decimal point
    var price = 10.;

    // Bad: Leading decimal point
    var price = .1;

    // Bad: Octal (base 8) is deprecated
    var num = 010;

The special value `null` should be used only in the following situations:

1. To initialize a variable that may later be assign an object value.
1. To compare against an initialized variable that may or may not have an object value.
1. To pass into a function where an object is expected.
1. To return from a function where an object is expected.

Examples:

    // Good
    var person = null;

    // Good
    function getPerson() {
        if (condition) {
            return new Person("Nicholas");
        } else {
            return null;
        }
    }

    // Good
    var person = getPerson();
    if (person !== null){
        doSomething();
    }

    // Bad: Testing against uninitialized variable
    var person;
    if (person != null){
        doSomething();
    }

    // Bad: Testing to see if an argument was passed
    function doSomething(arg1, arg2, arg3, arg4){
        if (arg4 != null){
            doSomethingElse();
        }
    }

Never use the special value `undefined`. To see if a variable has been defined, use the `typeof` operator:

    // Good
    if (typeof variable == "undefined") {
        // do something
    }

    // Bad: Using undefined literal
    if (variable == undefined) {
        // do something
    }

## Operator Spacing

Operators with two operands must be preceded and followed by a single space to make the expression clear. Operators include assignments and logical operators.

    // Good
    var found = (values[i] === item);

    // Good
    if (found && (count > 10)) {
        doSomething();
    }

    // Good
    for (i = 0; i < count; i++) {
        process(i);
    }

    // Bad: Missing spaces
    var found = (values[i]===item);

    // Bad: Missing spaces
    if (found&&(count>10)) {
        doSomething();
    }

    // Bad: Missing spaces
    for (i=0; i<count; i++) {
        process(i);
    }

## Parentheses Spacing

When parentheses are used, there should be no whitespace immediately after the opening paren or immediately before the closing paren.

    // Good
    var found = (values[i] === item);

    // Good
    if (found && (count > 10)) {
        doSomething();
    }

    // Good
    for (i = 0; i < count; i++) {
        process(i);
    }

    // Bad: Extra space after opening paren
    var found = ( values[i] === item);

    // Bad: Extra space before closing paren
    if (found && (count > 10) ) {
        doSomething();
    }

    // Bad: Extra space around argument
    for (i = 0; i < count; i++) {
        process( i );
    }

## Object Literals

Object literals should have the following format:

* The opening brace should be on the same line as the containing statement.
* Each property-value pair should be indented one level with the first property appearing on the next line after the opening brace.
* Each property-value pair should have an unquoted property name, followed by a colon (no space preceding it), followed by the value.
* If the value is a function, it should wrap under the property name and should have a blank line both before and after the function.
* Additional empty lines may be inserted to group related properties or otherwise improve readability.
* The closing brace should be on a separate line.

Examples:

    // Good
    var object = {

        key1: value1,
        key2: value2,

        func: function() {
            // do something
        },

        key3: value3
    };

    // Bad: Improper indentation
    var object = {
                    key1: value1,
                    key2: value2
                };

    // Bad: Missing blank lines around function
    var object = {

        key1: value1,
        key2: value2,
        func: function() {
            // do something
        },
        key3: value3
    };

When an object literal is passed to a function, the opening brace should be on the same line as if the value is a variable. All other formatting rules from above still apply.

    // Good
    doSomething({
        key1: value1,
        key2: value2
    });

    // Bad: All on one line
    doSomething({ key1: value1, key2: value2 });

## Comments

Make frequent use of comments to aid others in understanding your code. Use comments when:

* Code is difficult to understand.
* The code might be mistaken for an error.
* Browser-specific code is necessary but not obvious.
* Documentation generation is necessary for an object, method, or property (use appropriate documentation comments).

### Single-Line Comments

Single-line comments should be used to document one line of code or a group of related lines of code. A single-line comment may be used in three ways:

1. On a separate line, describing the code beneath it.
1. At the end of a line, describing the code before it.
1. On multiple lines, to comment out sections of code.

When on a separate line, a single-line comment should be at the same indentation level as the code it describes and be preceded by a single line. Never use multiple single-line comments on consecutive lines, use a multi-line comment instead.

    // Good
    if (condition){

        // if you made it here, then all security checks passed
        allowed();
    }

    // Bad: No empty line preceding comment
    if (condition){
        // if you made it here, then all security checks passed
        allowed();
    }

    // Bad: Wrong indentation
    if (condition){

    // if you made it here, then all security checks passed
        allowed();
    }

    // Bad: This should be a multi-line comment
    // This next piece of code is quite difficult, so let me explain.
    // What you want to do is determine if the condition is true
    // and only then allow the user in. The condition is calculated
    // from several different functions and may change during the
    // lifetime of the session.
    if (condition){
        // if you made it here, then all security checks passed
        allowed();
    }

For single-line comments at the end of a line, ensure there is at least one indentation level between the end of the code and the beginning of the comment:

    // Good
    var result = something + somethingElse;    // somethingElse will never be null

    // Bad: Not enough space between code and comment
    var result = something + somethingElse;// somethingElse will never be null

The only acceptable time to have multiple single-line comments on successive lines is to comment out large sections of code. Multi-line comments should not be used for this purpose.

    // Good
    // if (condition){
    //    doSomething();
    //    thenDoSomethingElse();
    // }

### Multi-Line Comments

Multi-line comments should be used to document code that requires more explanation. Each multi-line comment should have at least three lines:

1. The first line contains only the `/*` comment opening. No further text is allowed on this line.
1. The next line(s) have a `*` aligned with the `*` in the first line. Text is allowed on these lines.
1. The last line has the `*/` comment opening aligned with the preceding lines. No other text is allowed on this line.

The first line of multi-comments should be indented to the same level as the code it describes. Each subsequent line should have the same indentation plus one space (for proper alignment of the `*` characters). Each multi-line comment should be preceded by one empty line.

    // Good
    if (condition){

        /*
         * if you made it here,
         * then all security checks passed
         */
        allowed();
    }

    // Bad: No empty line preceding comment
    if (condition){
        /*
         * if you made it here,
         * then all security checks passed
         */
        allowed();
    }

    // Bad: Missing a space after asterisk
    if (condition){

        /*
         *if you made it here,
         *then all security checks passed
         */
        allowed();
    }

    // Bad: Wrong indentation
    if (condition){

    /*
     * if you made it here,
     * then all security checks passed
     */
        allowed();
    }

    // Bad: Don't use multi-line comments for trailing comments
    var result = something + somethingElse;    /*somethingElse will never be null*/

### Comment Annotations

Comments may be used to annotate pieces of code with additional information. These annotations take the form of a single word followed by a colon. The acceptable annotations are:

* `TODO` - indicates that the code is not yet complete. Information about the next steps should be included.
* `HACK` - indicates that the code is using a shortcut. Information about why the hack is being used should be included. This may also indicate that it would be nice to come up with a better way to solve the problem.
* `XXX` - indicates that the code is problematic and should be fixed as soon as possible.
* `FIXME` - indicates that the code is problematic and should be fixed soon. Less important than `XXX`.
* `REVIEW` - indicates that the code needs to be reviewed for potential changes.

These annotations may be used with either single-line or multi-line comments and should follow the same formatting rules as the general comment type. Examples:

    // Good
    // TODO: I'd like to find a way to make this faster
    doSomething();

    // Good
    /*
     * HACK: Have to do this for IE. I plan on revisiting in
     * the future when I have more time. This probably should
     * get replaced before v1.2.
     */
    if (document.all) {
        doSomething();
    }

    // Good
    // REVIEW: Is there a better way to do this?
    if (document.all) {
        doSomething();
    }

    // Bad: Annotation spacing is incorrect
    // TODO : I'd like to find a way to make this faster
    doSomething();

    // Bad: Comment should be at the same indentation as code
        // REVIEW: Is there a better way to do this?
    if (document.all) {
        doSomething();
    }


## Variable Declarations

All variables should be declared before they are used. Variable declarations should take place at the beginning of a function using a single `var` statement with one variable per line. All lines after the first should be indented one level so the variable names line up. Variables should be initialized when declared if applicable and the equals operator should be at a consistent indentation level. Initialized variables should come first followed by uninitialized variables.

    // Good
    var count   = 10,
        name    = "Nicholas",
        found   = false,
        empty;

    // Bad: Improper initialization alignment
    var count = 10,
        name = "Nicholas",
        found= false,
        empty;

    // Bad: Incorrect indentation
    var count   = 10,
    name    = "Nicholas",
    found   = false,
    empty;

    // Bad: Multiple declarations on one line
    var count   = 10, name = "Nicholas",
        found   = false, empty;

    // Bad: Uninitialized variables first
    var empty,
        count   = 10,
        name    = "Nicholas",
        found   = false;

    // Bad: Multiple var statements
    var count   = 10,
        name    = "Nicholas";

    var found   = false,
        empty;

Always declare variables. Implied globals should not be used.

## Function Declarations

Functions should be declared before they are used. When a function is not a method (not attached to an object) it should be defined using function declaration format (not function expression format nor using the `Function` constructor). There should be no space between the function name and the opening parentheses. There should be one space between the closing parentheses and the right brace. The right brace should be on the same line as the `function` keyword. There should be no space after the opening parentheses or before the closing parentheses. Named arguments should have a space after the comma but not before it. The function body should be indented one level.

    // Good
    function doSomething(arg1, arg2) {
        return arg1 + arg2;
    }

    // Bad: Improper spacing of first line
    function doSomething (arg1, arg2){
        return arg1 + arg2;
    }

    // Bad: Function expression
    var doSomething = function(arg1, arg2) {
        return arg1 + arg2;
    };

    // Bad: Left brace on wrong line
    function doSomething(arg1, arg2)
    {
        return arg1 + arg2;
    }

    // Bad: Using Function constructor
    var doSomething = new Function("arg1", "arg2", "return arg1 + arg2");

Functions declared inside of other functions should be declared immediately after the `var` statement.

    // Good
    function outer() {

        var count   = 10,
            name    = "Nicholas",
            found   = false,
            empty;

        function inner() {
            // code
        }

        // code that uses inner()
    }

    // Bad: Inner function declared before variables
    function outer() {

        function inner() {
            // code
        }

        var count   = 10,
            name    = "Nicholas",
            found   = false,
            empty;

        // code that uses inner()
    }

Anonymous functions may be used for assignment of object methods or as arguments to other functions. There should be no space between the `function` keyword and the opening parentheses.

    // Good
    object.method = function() {
        // code
    };

    // Bad: Incorrect spacing
    object.method = function () {
        // code
    };

Immediately-invoked functions should surround the entire function call with parentheses.

    // Good
    var value = (function() {

        // function body

        return {
            message: "Hi"
        }
    }());

    // Bad: No parentheses around function call
    var value = function() {

        // function body

        return {
            message: "Hi"
        }
    }();

    // Bad: Improper parentheses placement
    var value = (function() {

        // function body

        return {
            message: "Hi"
        }
    })();

## Naming

Care should be taken to name variables and functions properly. Names should be limited to alphanumeric characters and, in some cases, the underscore character. Do not use the dollar sign (`$`) or back slash (`\`) characters in any names.

Variable names should be formatted in camel case with the first letter being lowercase and the first letter of each subsequent word being uppercase. The first word of a variable name should be a noun (not a verb) to avoid confusion with functions. Do not use underscore for variable names.

    // Good
    var accountNumber = "8401-1";

    // Bad: Begins with uppercase letter
    var AccountNumber = "8401-1";

    // Bad: Begins with verb
    var getAccountNumber = "8401-1";

    // Bad: Uses underscore
    var account_number = "8401-1";

Function names should also be formatted using camel case. The first word of a function name should be a verb (not a noun) to avoid confusion with variables. Do not use underscore for function names.

    // Good
    function doSomething() {
        // code
    }

    // Bad: Begins with uppercase letter
    function DoSomething() {
        // code
    }

    // Bad: Begins with noun
    function car() {
        // code
    }

    // Bad: Uses underscores
    function do_something() {
        // code
    }

Constructor functions, those functions used with the `new` operator to create new objects, should be formatted in camel case but must begin with an uppercase letter. Constructor function names should begin with a non-verb because `new` is the action of creating an object instance.

    // Good
    function MyObject() {
        // code
    }

    // Bad: Begins with lowercase letter
    function myObject() {
        // code
    }

    // Bad: Uses underscores
    function My_Object() {
        // code
    }

    // Bad: Begins with verb
    function getMyObject() {
        // code
    }

Variables that act as constants (values that won't be changed) should be formatted using all uppercase letters with words separated by a single underscore.

    // Good
    var TOTAL_COUNT = 10;

    // Bad: Camel case
    var totalCount = 10;

    // Bad: Mixed case
    var total_COUNT = 10;

Object properties follow the same naming conventions as variables. Object methods follow the same naming conventions as functions. If a property or method is meant to be private, then it should be prefixed with an underscore character.

    // Good
    var object = {
        _count: 10,

        _getCount: function () {
            return this._count;
        }
    };

## Strict Mode

Strict mode should be used in all modules, specified below the file overview comment and above everything else:

    // Bad: Strict mode in functions
    function doSomething() {
        "use strict";

        // code
    }

    // Bad: Strict mode in global scope and redundant strict mode directive in function
    "use strict";       // This one is good

    function doSomething() {
        "use strict";   // This one is bad

        // code
    }

    // Good: Global strict mode
    "use strict";

    function doSomething() {
        // no "use strict" here

        // code
    }

## Assignments

When assigning a value to a variable, use parentheses around a right-side expression that contains a comparison.

    // Good
    var flag = (i < count);

    // Bad: Missing parentheses
    var flag = i < count;

## Equality Operators

Use `===` and `!==` instead of `==` and `!=`. This avoids type coercion errors.

    // Good
    var same = (a === b);

    // Bad: Using ==
    var same = (a == b);

## Ternary Operator

The ternary operator should be used only for assigning values conditionally and never as a shortcut for an `if` statement.

    // Good
    var value = condition ? value1 : value2;

    // Bad: no assignment, should be an if statement
    condition ? doSomething() : doSomethingElse();

## Statements

### Simple Statements

Each line should contain at most one statement. All simple statements should end with a semicolon (`;`).

    // Good
    count++;
    a = b;

    // Bad: Multiple statements on one line
    count++; a = b;

### return Statement

A return statement with a value should not use parentheses unless they make the return value more obvious in some way. Example:

    return;

    return collection.size();

    return (size > 0 ? size : defaultSize);

### Compound Statements

Compound statements are lists of statements enclosed inside of braces.

* The enclosed statements should be indented one more level than the compound statement.
* The opening brace should be at the end of the line that begins the compound statement; the closing brace should begin a line and be indented to the beginning of the compound statement.
* Braces are used around all statements, even single statements, when they are part of a control structure, such as a `if` or `for` statement. This makes it easier to add statements without accidentally introducing bugs due to forgetting to add braces.
* The statement beginning keyword, such as `if`, should be followed by one space and the opening brace should be preceded by a space.

### if Statement

The `if` class of statements should have the following form:

    if (condition) {
        statements
    }

    if (condition) {
        statements
    } else {
        statements
    }

    if (condition) {
        statements
    } else if (condition) {
        statements
    } else {
        statements
    }

It is never permissible to omit the braces in any part of an `if` statement.

    // Good
    if (condition) {
        doSomething();
    }

    // Bad: Improper spacing
    if(condition){
        doSomething();
    }

    // Bad: Missing braces
    if (condition)
        doSomething();

    // Bad: All on one line
    if (condition) { doSomething(); }

    // Bad: All on one line without braces
    if (condition) doSomething();

### for Statement

The `for` class of statements should have the following form:

    for (initialization; condition; update) {
        statements
    }

    for (variable in object) {
        statements
    }

Variables should not be declared in the initialization section of a `for` statement.

    // Good
    var i,
        len;

    for (i=0, len=10; i < len; i++) {
        // code
    }

    // Bad: Variables declared during initialization
    for (var i=0, len=10; i < len; i++) {
        // code
    }

    // Bad: Variables declared during initialization
    for (var prop in object) {
        // code
    }

When using a `for-in` statement, double-check whether or not you need to use `hasOwnProperty()` to filter out object members.

### while Statement

The `while` class of statements should have the following form:

    while (condition) {
        statements
    }

### do Statement

The `do` class of statements should have the following form:

    do {
        statements
    } while (condition);

Note the use of a semicolon as the final part of this statement. There should be a space before and after the `while` keyword.

### switch Statement

The `switch` class of statements should have the following form:

    switch (expression) {
        case expression:
            statements

        default:
            statements
    }

Each `case` is indented one level under the `switch`. Each `case` after the first, including `default`, should be preceded by a single empty line.

Each group of statements (except the default) should end with `break`, `return`, `throw`, or a comment indicating fall through.

    // Good
    switch (value) {
        case 1:
            /* falls through */

        case 2:
            doSomething();
            break;

        case 3:
            return true;

        default:
            throw new Error("This shouldn't happen.);
    }

If a `switch` doesn't have a `default` case, then it should be indicated with a comment.

    // Good
    switch (value) {
        case 1:
            /*falls through*/

        case 2:
            doSomething();
            break;

        case 3:
            return true;

        // no default
    }

### try Statement

The `try` class of statements should have the following form:

    try {
        statements
    } catch (variable) {
        statements
    }

    try {
        statements
    } catch (variable) {
        statements
    } finally {
        statements
    }

## Whitespace

Blank lines improve readability by setting off sections of code that are logically related.

Two blank lines should always be used in the following circumstances:

* Between sections of a source file
* Between class and interface definitions

One blank line should always be used in the following circumstances:

* Between methods
* Between the local variables in a method and its first statement
* Before a multi-line or single-line comment
* Between logical sections inside a method to improve readability

Blank spaces should be used in the following circumstances:

* A keyword followed by a parenthesis should be separated by a space.
* A blank space should appear after commas in argument lists.
* All binary operators except dot (`.`) should be separated from their operands by spaces. Blank spaces should never separate unary operators such as unary minus, increment (`++`), and decrement (`--`) from their operands.
* The expressions in a `for` statement should be separated by blank spaces. Blank spaces should only be used after semicolons, not before.

## Things to Avoid

* Never use the primitive wrapper types, such as `String`, to create new objects.
* Never use `eval()`.
* Never use the `with` statement. This statement isn't available in strict mode and likely won't be available in future ECMAScript editions.
