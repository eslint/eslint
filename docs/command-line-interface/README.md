# Command line Interface

To run ESLint on Node.js, you must have npm installed. If npm is not installed, follow the instructions here: http://npmjs.org/

Once npm is installed, run the following

    npm i -g eslint

This installs the ESLint CLI from the npm repository. To run ESLint, use the following format:

    eslint [options] [file|dir]*

Such as:

    eslint file1.js file2.js

## Options

The command line utility has several options. You can view the options by running `eslint -h`.

```
eslint [options] file.js [file.js] [dir]

Options:
  -h, --help                 Show help.
  -c, --config path::String  Load configuration data from this file.
  --rulesdir [path::String]  Load additional rules from this directory.
  -f, --format String        Use a specific output format. - default: stylish
  -v, --version              Outputs the version number.
  --reset                    Set all default rules to off.
  --eslintrc                 Enable loading .eslintrc configuration. - default: true
  --env [String]             Specify environments.
  --force                    Allow linting of otherwise ignored files.
  --global [String]          Define global variables.
  --rule Object              Specify rules.
```

### `-h`, `--help`

This option outputs the help menu, displaying all of the available options. All other flags are ignored when this is present.

### `-c`, `--config`

This option allows you to specify an alternate configuration file for ESLint (see [Configuring ESLint](../configuring) for more). By default, ESLint uses its own configuration file located at `conf/eslint.json`.

Example:

    eslint -c ~/my-eslint.json file.js

This example uses the configuration file at `~/my-eslint.json` instead of the default.

### `-f`, `--format`

This option specifies the output format for the console. Possible formats are "stylish" (the default), "compact", "checkstyle", "jslint-xml", "junit" and "tap".

Example:

    eslint -f compact file.js

When specified, the given format is output to the console. If you'd like to save that output into a file, you can do so on the command line like so:

    eslint -f compact file.js > results.txt

This saves the output into the `results.txt` file.

### `--rulesdir`

This option allows you to specify a second directory from which to load rules files. This allows you to dynamically loading new rules at run time. This is useful when you have custom rules that aren't suitable for being bundled with ESLint.

Example:

    eslint --rulesdir my-rules/ file.js

The rules in your custom rules directory must follow the same format as bundled rules to work properly. You can also specify multiple locations for custom rules by including multiple `--rulesdir` flags:

    eslint --rulesdir my-rules/ --rulesdir my-other-rules/ file.js

### `--reset`

This option turns off all rules enabled in ESLint's default configuration file located at `conf/eslint.json`. ESLint will still report syntax errors.

Example:

    eslint --reset file.js

### `--eslintrc`

This option, on by default, enables automatically loading `.eslintrc` configuration files. Use as `--no-eslintrc` to disable.

Example

    eslint --no-eslintrc file.js

### `--env`

This option enables specific environments. Details about the global variables defined by each environment are available on the [configuration](../configuring) documentation. This flag only enables environments; it does not disable environments set in other configuration files. To specify multiple environments, separate them using commas, or use the flag multiple times.

Example

    eslint --env browser,node file.js
    eslint --env browser --env node file.js

### `--force`

This option allows you to override the ignore rules defined in `.eslintignore` files and always lint each file passed to eslint. Without this option enabled, ignored files will not be linted even if specifically listed in the list of files.

Example

    eslint --force an-ignored-file.js

### `--global`

This option defines global variables so that they will not be flagged as undefined by the `no-undef` rule. Global variables are read-only by default, but appending `:true` to a variable's name makes it writable. To define multiple variables, separate them using commas, or use the flag multiple times.

Example:

    eslint --global require,exports:true file.js
    eslint --global require --global exports:true

### `--rule`

This option specifies rules to be used. They will be merged into any previously defined rules. To start fresh, simply combine with the `--reset` flag. To define multiple rules, separate them using commas, or use the flag multiple times. The [levn](https://github.com/gkz/levn#levn--) format is used for specifying the rules.

Example:

    eslint --rule 'quotes: [2, double]'
    eslint --rule 'guard-for-in: 2' --rule 'brace-style: [2, 1tbs]'

### `-v`, `--version`

This option outputs the current ESLint version onto the console. All other options are ignored when present.

Example:

    eslint -v

## Ignoring files from linting

ESLint supports `.eslintignore` files to exclude files from the linting process when eslint operates on a directory. Files given as individual CLI arguments will be exempt from exclusion. The `.eslintignore` file is a plain text file containing one pattern per line. It can be located in any of the target directory's ancestors; it will affect files in its containing directory as well as all sub-directories. Here's a simple example of a `.eslintignore` file:

```text
node_modules/*
**/vendor/*.js
```

**Deprecation notice**: The `.eslintignore` file can also be a JSON file that contains an array of globs. This works identically to the plain text version, but the JSON format is deprecated and will be removed in a future release.
