---
title: ESLint
layout: default
---
# Architecture

At a high level, there are a few key parts to ESLint:

* `bin/eslint.js` - this is the file that actually gets executed with the command line utility. It's a dumb wrapper that does nothing more than bootstrap ESLint, passing the command line arguments to `cli`. This is intentionally small so as not to require heavy testing.
* `lib/cli.js` - this is the heart of the ESLint CLI. It takes an array of arguments and then uses `eslint` to execute the commands. By keeping this as a separate utility, it allows others to effectively call ESLint from within another Node.js program as if it were done on the command line. The main call is `cli.execute()`. This is also the part that does all the file reading, directory traversing, input, and output.
* `lib/eslint.js` - this is the core `eslint` object that does code verifying based on configuration options. This file does not file I/O and does not interact with the `console` at all. For other Node.js programs that have JavaScript text to verify, they would be able to use this interface directly.

## The cli Object

TODO

## The eslint Object

The main method of the `eslint` object is `verify()` and accepts two arguments: the source text to verify and a configuration object (the baked configuration of the given configuration file plus command line options). The method first parses the given text with Esprima and retrieves the AST. The AST is produced with both line/column and range locations which are useful for reporting location of issues and retrieving the source text related to an AST node, respectively.

Once the AST is available, `estraverse` is used to traverse the AST from top to bottom. At each node, the `eslint` object emits an event that has the same name as the node type (i.e., "Identifier", "WithStatement", etc.). On the way back up the subtree, an event is emitted with the AST type name and suffixed with ":after", such as "Identifier:after" - this allows rules to take action both on the way down and on the way up in the traversal. Each event is emitted with the appropriate AST node available.
