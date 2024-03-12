---
title: Stats Data
eleventyNavigation:
    key: Stats Data
    parent: extend eslint
    title: Stats Data
---

While an analysis of the overall rule performance for an ESLint run can be carried out by setting the [TIMING](./custom-rules#profile_rule_performance) environment variable, it can sometimes be useful to acquire more *granular* timing data (lint time per file per rule) or collect other measures of interest. In particular, when developing new [custom plugins](./plugins) and evalulating/benchmarking new languages or rule sets.

For such use cases, the **stats** option has been provided. It adds a series of detailed performance statistics (see [Stats type](#-stats-type)) such as the *parse*-, *fix*- and *lint*-times (time per rule) of a given file or the number of fix passes on top of your [LintResult](../integrate/nodejs-api.md#-lintresult-type).

As such, it is not available via stdout but made easily ingestible via a formatter using the CLI or via the Node.js API to cater to your specific needs.

## ◆ Stats type

The `Stats` value is the timing information of each lint run. The `stats` property of the [LintResult] type contains it. It has the following properties:

* `fixPasses` (`number`)<br>
  The number of times ESLint has applied at least one fix after linting.
* `times` (`TimePass[]`)<br>
  The times spent on (parsing, fixing, linting) a file, where the linting refers to the timing information for each rule.
    * `TimePass` (`{ parse: ParseTime, rules: Record<string, RuleTime> fix: FixTime }`)<br>
    An array containing the times spent on (parsing, fixing, linting)
    * `ParseTime` (`{ total: number }`)<br>
      The total time that is spent when parsing a file.
    * `RuleTime` (`{ total: number }`)<br>
      The total time that is spent on a rule.
    * `FixTime` (`{ total: number }`)<br>
      The total time that is spent on applying fixes to the code.

### CLI usage

Let's consider the following example:

```js [file-to-fix.js]
/*eslint no-regex-spaces: "error", wrap-regex: "error"*/

function a() {
    return / foo/.test("bar");
}
```

Run ESLint with the *stats* option (`--stats`) and outputting to JSON via a [built-in formatter](../use/formatters/) (`-f json`):

```sh
eslint file-to-fix.js --stats -f json
```

This yields the following `stats` entry as part of the formatted lint results object:

```json
"stats": {
    "times": {
        "passes": [
            {
                "parse": {
                    "total": 3.888125
                },
                "rules": {
                    "no-regex-spaces": {
                        "total": 0.15470899999999999
                    },
                    "wrap-regex": {
                        "total": 0.389583
                    }
                },
                "fix": {
                    "total": 0
                },
                "total": 12.266667
            }
        ]
    },
    "fixPasses": 0
}
```

Note, that for the simple example above, the stats time data in `rules` should be directly comparable to the averages of the first column of the TIMING output. Running the same command with `TIMING=all`, you can verify this:

```bash
$ TIMING:all eslint file-to-fix.js --stats -f json
...
Rule            | Time (ms) | Relative
:---------------|----------:|--------:
wrap-regex      |     0.390 |    71.6%
no-regex-spaces |     0.155 |    28.4%
```

### API Usage

Similarly to the example for the [CLI usage](#cli-usage), we can achieve the same thing using the Node.js API, turning on the *stats* option (`stats: true`) as follows:

```js
const { ESLint } = require("eslint");

(async function main() {
    // 1. Create an instance.
    const eslint = new ESLint({ stats: true });

    // 2. Lint files.
    const results = await eslint.lintFiles(["file-to-fix.js"]);

    // 3. Format the results.
    const formatter = await eslint.loadFormatter("json");
    const resultText = formatter.format(results);

    // 4. Output it.
    console.log(resultText);
})().catch((error) => {
    process.exitCode = 1;
    console.error(error);
});
```
