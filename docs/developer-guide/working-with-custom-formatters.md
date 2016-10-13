# Working with Custom Formatters

Writing an ESlint custom formatter is simple. All that is needed is a module that exports a function that will receive the results from the execution of ESLint.

The simplest formatter will be something like:

```javascript
//my-awesome-formatter.js
module.exports = function (results) {
    console.log(JSON.stringify(results, null, 2));
}
```

And to run `eslint` with this custom formatter:

```bash
eslint -f './my-awesome-formatter.js' src/
```

The output of the previous command will be something like this

```javascript
[
    {
        "filePath": "path/to/file.js",
        "messages": [
            {
                "ruleId": "curly",
                "severity": 2,
                "message": "Expected { after 'if' condition.",
                "line": 2,
                "column": 1,
                "nodeType": "IfStatement",
                "source": "if (err) console.log('failed tests: ' + err);"
            },
            {
                "ruleId": "no-process-exit",
                "severity": 2,
                "message": "Don't use process.exit(); throw an error instead.",
                "line": 3,
                "column": 1,
                "nodeType": "CallExpression",
                "source": "process.exit(1);"
            }
        ],
        "errorCount": 2,
        "warningCount": 0,
        "source": "var err = doStuff();\nif (err) console.log('failed tests: ' + err);\nprocess.exit(1);\n"
    },
    {
        "filePath": "Gruntfile.js",
        "messages": [],
        "errorCount": 0,
        "warningCount": 0
    }
]
```

As you can see the argument passed to the custom formatter function is just a list of results objects.

## Description of the results

### the result object

You will receive a result object from each file `eslint` validates, each one of them containing
the list of messages for `errors` and/or `warnings`.

The following are the fields of the result object:

- **filePath**: The path to the file relative to the current working directory (the path from which eslint was executed).
- **messages**: An array of message objects. See below for more info about messages.
- **errorCount**: The number of errors for the given file.
- **warningCount**: The number of warnings for the given file.
- **source**: The source code for the given file. This property is omitted if this file has no errors/warnings or if the `output` property is present.
- **output**: The source code for the given file with as many fixes applied as possible. This property is omitted if no fix is available.

### The message object

- **ruleId**: the id of the rule that produced the error or warning.
- **severity**: the severity of the failure, `1` for warnings and `2` for errors.
- **message**: the human readable description of the error.
- **line**: the line where where the issue is located.
- **column**: the colum where the issue is located.
- **nodeType**: the type of the node in the [AST](https://github.com/estree/estree/blob/master/spec.md#node-objects)
- **source**: a extract of the code the line where the failure happened.

**Please note**: the `source` property will be removed from the message object in an upcoming breaking release. If you depend on this property, you should now use the `source` or `output` properties from [the result object](#the-result-object) instead.

## Examples

### Summary formatter

A formatter that only cares about the total count of errors and warnings will look like this:

```javascript
module.exports = function ( results ) {
    var results = results || [ ];

    // accumulate the errors and warnings
    var summary = results.reduce( function ( seq, current ) {
        seq.errors += current.errorCount;
        seq.warnings += current.warningCount;
        return seq;
    }, { errors: 0, warnings: 0 } );

    if ( summary.errors > 0 || summary.warnings > 0 ) {
        console.log( 'Errors: ' + summary.errors + ', Warnings: ' + summary.warnings + '\n' );
    }
};
```

Running `eslint` with the previous custom formatter,

```bash
eslint -f './my-awesome-formatter.js' src/
```

Will produce the following output:

```bash
Errors: 2, Warnings: 4
```

### Detailed formatter

A more complex report will look something like this:

```javascript
module.exports = function ( results ) {
    var results = results || [ ];

    var summary = results.reduce( function ( seq, current ) {

        current.messages.forEach( function ( msg ) {
            var logMessage = {
                filePath: current.filePath,
                ruleId: msg.ruleId,
                message: msg.message,
                line: msg.line,
                column: msg.column,
                source: msg.source
            };

            if ( msg.severity === 1 ) {
                logMessage.type = 'warning';
                seq.warnings.push( logMessage );
            }
            if ( msg.severity === 2 ) {
                logMessage.type = 'error';
                seq.errors.push( logMessage );
            }
        } );
        return seq;
    }, {
        errors: [],
        warnings: []
    } );

    if ( summary.errors.length > 0 || summary.warnings.length > 0 ) {
        var lines = summary.errors.concat( summary.warnings ).map( function ( msg ) {
            return '\n' + msg.type + ' ' + msg.ruleId + '\n  ' + msg.filePath + ':' + msg.line + ':' + msg.column;
        } ).join( '\n' );

        return lines + '\n';
    }
};
```

So running `eslint` with this custom formatter:

```bash
eslint -f './my-awesome-formatter.js' src/
```

The output will be

```bash
error space-infix-ops
  src/configs/bundler.js:6:8
error semi
  src/configs/bundler.js:6:10
warning no-unused-vars
  src/configs/bundler.js:5:6
warning no-unused-vars
  src/configs/bundler.js:6:6
warning no-shadow
  src/configs/bundler.js:65:32
warning no-unused-vars
  src/configs/clean.js:3:6
```

## Passing arguments to formatters:

### Using environment variables:

Let's say we want to show only the messages that are actual errors and discard the warnings.

```javascript
module.exports = function ( results ) {
    var skipWarnings = process.env.AF_SKIP_WARNINGS === 'true'; //af stands for awesome-formatter

    var results = results || [ ];
    var summary = results.reduce( function ( seq, current ) {
        current.messages.forEach( function ( msg ) {
            var logMessage = {
                filePath: current.filePath,
                ruleId: msg.ruleId,
                message: msg.message,
                line: msg.line,
                column: msg.column,
                source: msg.source
            };

            if ( msg.severity === 1 ) {
                logMessage.type = 'warning';
                seq.warnings.push( logMessage );
            }
            if ( msg.severity === 2 ) {
                logMessage.type = 'error';
                seq.errors.push( logMessage );
            }
        } );
        return seq;
    }, {
        errors: [],
        warnings: []
    } );

    if ( summary.errors.length > 0 || summary.warnings.length > 0 ) {
        var warnings = !skipWarnings ? summary.warnings : [ ]; // skip the warnings in that case

        var lines = summary.errors.concat( warnings ).map( function ( msg ) {
            return '\n' + msg.type + ' ' + msg.ruleId + '\n  ' + msg.filePath + ':' + msg.line + ':' + msg.column;
        } ).join( '\n' );

        return lines + '\n';
    }
};
```

So running `eslint` with this custom formatter:

```bash
AF_SKIP_WARNINGS=true eslint -f './my-awesome-formatter.js' src/
```

The output will not print the warnings

```bash
error space-infix-ops
  src/configs/bundler.js:6:8

error semi
  src/configs/bundler.js:6:10
```

### Using a JSON formatter first

It is a bit more complicated, but using a simple formatter we can get the raw output to stdout

```javascript
// json.js
module.exports = function ( results ) {
    console.log( JSON.stringify( results ) );
}
```

And then the formatter can read from stdin

```bash
eslint -f './json.js' | ./my-awesome-formatter-cli.js --skip-warnings
```

And the the content of **my-awesome-formatter-cli.js** would be something like:

```javascript
#!/usr/bin/env node
var stdin = process.stdin;
var stdout = process.stdout;
var strChunks = [ ];

stdin.resume();
stdin.setEncoding( 'utf8' );

stdin.on( 'data', function ( chunk ) {
    strChunks.push( chunk );
} );

stdin.on( 'end', function () {
    var inputJSON = strChunks.join();
    var eslintResults = JSON.parse( inputJSON );
    var skipWarnings = process.argv.indexOf( '--skip-warnings' ) > -1;

    var result = require( './my-awesome-formatter' )( eslintResults, {
        skipWarnings: skipWarnings
    } );

    stdout.write( result );
} );
```

## Final words

More complex formatters could be written by grouping differently the errors and warnings and/or grouping the data by the ruleIds.

When printing the files a recommended format will be something like this:

```bash
file:line:column
```

Since that allows modern fancy terminals (like [iTerm2](https://www.iterm2.com/) or [Guake](http://guake-project.org/)) to make them link to files that open in your favorite text editor.
