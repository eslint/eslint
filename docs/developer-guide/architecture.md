# Architecture

At a high level, there are a few key parts to ESLint:

* `bin/eslint.js` - this is the file that actually gets executed with the command line utility. It's a dumb wrapper that does nothing more than bootstrap ESLint, passing the command line arguments to `cli`. This is intentionally small so as not to require heavy testing.
* `lib/cli.js` - this is the heart of the ESLint CLI. It takes an array of arguments and then uses `eslint` to execute the commands. By keeping this as a separate utility, it allows others to effectively call ESLint from within another Node.js program as if it were done on the command line. The main call is `cli.execute()`. This is also the part that does all the file reading, directory traversing, input, and output.
* `lib/linter.js` - this is the core Linter class that does code verifying based on configuration options. This file does no file I/O and does not interact with the `console` at all. For other Node.js programs that have JavaScript text to verify, they would be able to use this interface directly.
* `lib/api.js` - this exposes an object that contains Linter, CLIEngine, RuleTester, and SourceCode.
* `lib/testers/rule-tester.js` - this is a wrapper around Mocha, so that rules can be unit tested. This class lets us write consistently formatted tests for each rule that is implemented and be confident that each of the rules work. The RuleTester interface was modeled after Mocha and works with Mocha's global testing methods. RuleTester can also be modified to work with other testing frameworks.
* `lib/util/source-code.js` - this contains a SourceCode class that is used to represent the parsed source code. It takes in source code and the Program node of the AST representing the code.

## The `cli` object

The `cli` object is the API for the command line interface. Literally, the `bin/eslint.js` file simply passes arguments to the `cli` object and then sets `process.exitCode` to the returned exit code.

The main method is `cli.execute()`, which accepts an array of strings that represent the command line options (as if `process.argv` were passed without the first two arguments). If you want to run ESLint from inside of another program and have it act like the CLI, then `cli` is the object to use.

This object's responsibilities include:

* Interpreting command line arguments
* Reading from the file system
* Outputting to the console
* Outputting to the filesystem
* Use a formatter
* Returning the correct exit code

This object may not:

* Call `process.exit()` directly
* Perform any asynchronous operations

## The `CLIEngine` object

The `CLIEngine` type represents the core functionality of the CLI except that it reads nothing from the command line and doesn't output anything by default. Instead, it accepts many (but not all) of the arguments that are passed into the CLI. It reads both configuration and source files as well as managing the environment that is passed into the `eslint` object.

The main method of the `CLIEngine` is `executeOnFiles()`, which accepts an array of file and directory names to run the linter on.

This object's responsibilities include:

* Managing the execution environment for `eslint`
* Reading from the file system
* Loading rule definitions
* Reading configuration information from config files (including `.eslintrc` and `package.json`)

This object may not:

* Call `process.exit()` directly
* Perform any asynchronous operations
* Output to the console
* Use formatters

## The `eslint` object

The main method of the `eslint` object is `verify()` and accepts two arguments: the source text to verify and a configuration object (the baked configuration of the given configuration file plus command line options). The method first parses the given text with `espree` (or whatever the configured parser is) and retrieves the AST. The AST is produced with both line/column and range locations which are useful for reporting location of issues and retrieving the source text related to an AST node, respectively.

Once the AST is available, `estraverse` is used to traverse the AST from top to bottom. At each node, the `eslint` object emits an event that has the same name as the node type (i.e., "Identifier", "WithStatement", etc.). On the way back up the subtree, an event is emitted with the AST type name and suffixed with ":exit", such as "Identifier:exit" - this allows rules to take action both on the way down and on the way up in the traversal. Each event is emitted with the appropriate AST node available.

This object's responsibilities include:

* Inspecting JavaScript code strings
* Creating an AST for the code
* Executing rules on the AST
* Reporting back the results of the execution

This object may not:

* Call `process.exit()` directly
* Perform any asynchronous operations
* Use Node.js-specific features
* Access the file system
* Call `console.log()` or any other similar method

## Rules

Individual rules are the most specialized part of the ESLint architecture. Rules can do very little, they are simply a set of instructions executed against an AST that is provided. They do get some context information passed in, but the primary responsibility of a rule is to inspect the AST and report warnings.

These objects' responsibilities are:

* Inspect the AST for specific patterns
* Reporting warnings when certain patterns are found

These objects may not:

* Call `process.exit()` directly
* Perform any asynchronous operations
* Use Node.js-specific features
* Access the file system
* Call `console.log()` or any other similar method
