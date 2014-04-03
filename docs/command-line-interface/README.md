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
  --rulesdir path::String    Load additional rules from this directory.
  -f, --format String        Use a specific output format. - default: stylish
  -v, --version              Outputs the version number.
  --reset                    Set all default rules to off.
  --eslintrc                 Enable loading .eslintrc configuration. - default: true
  --env [String]             Specify environments.
  --global [String]          Define global variables.
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

The rules in your custom rules directory must follow the same format as bundled rules to work properly.

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

### `--global`

This option defines global variables so that they will not be flagged as undefined by the `no-undef` rule. Global variables are read-only by default, but appending `:true` to a variable's name makes it writable. To define multiple variables, separate them using commas, or use the flag multiple times.

Example:

    eslint --global require,exports:true file.js
    eslint --global require --global exports:true

### `-v`, `--version`

This option outputs the current ESLint version onto the console. All other options are ignored when present.

Example:

    eslint -v

## Ignoring files from linting

ESLint supports `.eslintignore` files to exclude files from the linting process when eslint operates on a directory. Files given as individual CLI arguments will be exempt from exclusion. The `.eslintignore` file is a JSON file that contains an array of globs. It can be located in any of the target directory's ancestors; it will affect files in its containing directory as well as all sub-directories. Here's a simple example of a `.eslintignore` file:

```json
[
  "node_modules/*",
  "**/vendor/*.js"
]
```
