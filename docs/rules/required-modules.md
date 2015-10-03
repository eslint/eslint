# Require Node modules (required-modules)

This rule can be used to mandate the usage of specific node modules in every file. For example, a project may wish to require that all test files load a particular module that performs specific runtime checks prior to program termination.

## Rule Details

This rule allows you to specify modules that must be loaded in every file.

### Options

The syntax to specify required modules looks like this:

```json
"required-modules": [2, <...moduleNames>]
```

### Examples

To require the use of a module named `common`:

```json
    "required-modules": [2, "common"],
```
