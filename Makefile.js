/**
 * @fileoverview Build file
 * @author nzakas
 */

/* global cat, cd, cp, echo, exec, exit, find, ls, mkdir, pwd, rm, target, test*/
/* eslint no-use-before-define: "off", no-console: "off" */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

require("shelljs/make");

var lodash = require("lodash"),
    checker = require("npm-license"),
    ReleaseOps = require("eslint-release"),
    dateformat = require("dateformat"),
    fs = require("fs"),
    glob = require("glob"),
    markdownlint = require("markdownlint"),
    nodeCLI = require("shelljs-nodecli"),
    os = require("os"),
    path = require("path"),
    semver = require("semver"),
    ejs = require("ejs"),
    loadPerf = require("load-perf");

//------------------------------------------------------------------------------
// Settings
//------------------------------------------------------------------------------

/*
 * A little bit fuzzy. My computer has a first CPU speed of 3392 and the perf test
 * always completes in < 3800ms. However, Travis is less predictable due to
 * multiple different VM types. So I'm fudging this for now in the hopes that it
 * at least provides some sort of useful signal.
 */
var PERF_MULTIPLIER = 13e6;

var OPEN_SOURCE_LICENSES = [
    /MIT/, /BSD/, /Apache/, /ISC/, /WTF/, /Public Domain/
];

//------------------------------------------------------------------------------
// Data
//------------------------------------------------------------------------------

var NODE = "node ", // intentional extra space
    NODE_MODULES = "./node_modules/",
    TEMP_DIR = "./tmp/",
    BUILD_DIR = "./build/",
    DOCS_DIR = "../eslint.github.io/docs",
    SITE_DIR = "../eslint.github.io/",
    PERF_TMP_DIR = path.join(os.tmpdir(), "eslint", "performance"),

    // Utilities - intentional extra space at the end of each string
    MOCHA = NODE_MODULES + "mocha/bin/_mocha ",
    ESLINT = NODE + " bin/eslint.js ",

    // Files
    MAKEFILE = "./Makefile.js",
    JS_FILES = find("lib/", "conf/").filter(fileType("js")).join(" "),
    JSON_FILES = find("conf/").filter(fileType("json")),
    MARKDOWN_FILES_ARRAY = find("docs/").concat(ls(".")).filter(fileType("md")),
    TEST_FILES = getTestFilePatterns(),
    PERF_ESLINTRC = path.join(PERF_TMP_DIR, "eslintrc.yml"),
    PERF_MULTIFILES_TARGET_DIR = path.join(PERF_TMP_DIR, "eslint"),
    PERF_MULTIFILES_TARGETS = PERF_MULTIFILES_TARGET_DIR + path.sep + "{lib,tests" + path.sep + "lib}" + path.sep + "**" + path.sep + "*.js",

    // Regex
    TAG_REGEX = /^(?:Breaking|Build|Chore|Docs|Fix|New|Update|Upgrade):/,
    ISSUE_REGEX = /\((?:fixes|refs) #\d+(?:.*(?:fixes|refs) #\d+)*\)$/,

    // Settings
    MOCHA_TIMEOUT = 10000;

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Generates file patterns for test files
 * @returns {string} test file patterns
 * @private
 */
function getTestFilePatterns() {
    var testLibPath = "tests/lib/",
        testTemplatesPath = "tests/templates/";

    return ls(testLibPath).filter(function(pathToCheck) {
        return test("-d", testLibPath + pathToCheck);
    }).reduce(function(initialValue, currentValues) {
        if (currentValues !== "rules") {
            initialValue.push(testLibPath + currentValues + "/**/*.js");
        }
        return initialValue;
    }, [testLibPath + "rules/**/*.js", testLibPath + "*.js", testTemplatesPath + "*.js"]).join(" ");
}

/**
 * Simple JSON file validation that relies on ES JSON parser.
 * @param {string} filePath Path to JSON.
 * @throws Error If file contents is invalid JSON.
 * @returns {undefined}
 */
function validateJsonFile(filePath) {
    var contents;

    contents = fs.readFileSync(filePath, "utf8");

    JSON.parse(contents);
}

/**
 * Generates a function that matches files with a particular extension.
 * @param {string} extension The file extension (i.e. "js")
 * @returns {Function} The function to pass into a filter method.
 * @private
 */
function fileType(extension) {
    return function(filename) {
        return filename.substring(filename.lastIndexOf(".") + 1) === extension;
    };
}

/**
 * Generates a static file that includes each rule by name rather than dynamically
 * looking up based on directory. This is used for the browser version of ESLint.
 * @param {string} basedir The directory in which to look for code.
 * @returns {void}
 */
function generateRulesIndex(basedir) {
    var output = "module.exports = function() {\n";

    output += "    var rules = Object.create(null);\n";

    find(basedir + "rules/").filter(fileType("js")).forEach(function(filename) {
        var basename = path.basename(filename, ".js");

        output += "    rules[\"" + basename + "\"] = require(\"./rules/" + basename + "\");\n";
    });

    output += "\n    return rules;\n};";
    output.to(basedir + "load-rules.js");
}

/**
 * Executes a command and returns the output instead of printing it to stdout.
 * @param {string} cmd The command string to execute.
 * @returns {string} The result of the executed command.
 */
function execSilent(cmd) {
    return exec(cmd, { silent: true }).output;
}

/**
 * Generates a release blog post for eslint.org
 * @param {Object} releaseInfo The release metadata.
 * @returns {void}
 * @private
 */
function generateBlogPost(releaseInfo) {
    var output = ejs.render(cat("./templates/blogpost.md.ejs"), releaseInfo),
        now = new Date(),
        month = now.getMonth() + 1,
        day = now.getDate(),
        filename = "../eslint.github.io/_posts/" + now.getFullYear() + "-" +
            (month < 10 ? "0" + month : month) + "-" +
            (day < 10 ? "0" + day : day) + "-eslint-v" + releaseInfo.version +
            "-released.md";

    output.to(filename);
}

/**
 * Generates a doc page with formatter result examples
 * @param  {Object} formatterInfo Linting results from each formatter
 * @param  {string} [prereleaseVersion] The version used for a prerelease. This
 *      changes where the output is stored.
 * @returns {void}
 */
function generateFormatterExamples(formatterInfo, prereleaseVersion) {
    var output = ejs.render(cat("./templates/formatter-examples.md.ejs"), formatterInfo),
        filename = "../eslint.github.io/docs/user-guide/formatters/index.md",
        htmlFilename = "../eslint.github.io/docs/user-guide/formatters/html-formatter-example.html";

    if (prereleaseVersion) {
        filename = filename.replace("/docs", "/docs/" + prereleaseVersion);
        htmlFilename = htmlFilename.replace("/docs", "/docs/" + prereleaseVersion);
    }

    output.to(filename);
    formatterInfo.formatterResults.html.result.to(htmlFilename);
}

/**
 * Creates a release version tag and pushes to origin.
 * @returns {void}
 */
function release() {

    var releaseInfo = ReleaseOps.release();

    echo("Generating site");
    target.gensite();
    generateBlogPost(releaseInfo);
    target.publishsite();

    echo("Site has been published");
}

/**
 * Creates a prerelease version tag and pushes to origin.
 * @param {string} prereleaseId The prerelease identifier (alpha, beta, etc.)
 * @returns {void}
 */
function prerelease(prereleaseId) {

    var releaseInfo = ReleaseOps.release(prereleaseId);

    echo("Generating site");

    // always write docs into the next major directory (so 2.0.0-alpha.0 writes to 2.0.0)
    target.gensite(semver.inc(releaseInfo.version, "major"));
    generateBlogPost(releaseInfo);
    echo("Site has not been pushed, please update blog post and push manually.");
}


/**
 * Splits a command result to separate lines.
 * @param {string} result The command result string.
 * @returns {array} The separated lines.
 */
function splitCommandResultToLines(result) {
    return result.trim().split("\n");
}

/**
 * Gets the first commit sha of the given file.
 * @param {string} filePath The file path which should be checked.
 * @returns {string} The commit sha.
 */
function getFirstCommitOfFile(filePath) {
    var commits = execSilent("git rev-list HEAD -- " + filePath);

    commits = splitCommandResultToLines(commits);
    return commits[commits.length - 1].trim();
}

/**
 * Gets the tag name where a given file was introduced first.
 * @param {string} filePath The file path to check.
 * @returns {string} The tag name.
 */
function getTagOfFirstOccurrence(filePath) {
    var firstCommit = getFirstCommitOfFile(filePath),
        tags = execSilent("git tag --contains " + firstCommit);

    tags = splitCommandResultToLines(tags);
    return tags.reduce(function(list, version) {
        version = semver.valid(version.trim());
        if (version) {
            list.push(version);
        }
        return list;
    }, []).sort(semver.compare)[0];
}

/**
 * Gets the version number where a given file was introduced first.
 * @param {string} filePath The file path to check.
 * @returns {string} The version number.
 */
function getFirstVersionOfFile(filePath) {
    return getTagOfFirstOccurrence(filePath);
}

/**
 * Gets the commit that deleted a file.
 * @param {string} filePath The path to the deleted file.
 * @returns {string} The commit sha.
 */
function getCommitDeletingFile(filePath) {
    var commits = execSilent("git rev-list HEAD -- " + filePath);

    return splitCommandResultToLines(commits)[0];
}

/**
 * Gets the first version number where a given file is no longer present.
 * @param {string} filePath The path to the deleted file.
 * @returns {string} The version number.
 */
function getFirstVersionOfDeletion(filePath) {
    var deletionCommit = getCommitDeletingFile(filePath),
        tags = execSilent("git tag --contains " + deletionCommit);

    return splitCommandResultToLines(tags)
        .map(function(version) {
            return semver.valid(version.trim());
        })
        .filter(function(version) {
            return version;
        })
        .sort(semver.compare)[0];
}


/**
 * Returns all the branch names
 * @returns {string[]} branch names
 * @private
 */
function getBranches() {
    var branchesRaw = splitCommandResultToLines(execSilent("git branch --list")),
        branches = [],
        branchName;

    for (var i = 0; i < branchesRaw.length; i++) {
        branchName = branchesRaw[i].replace(/^\*(.*)/, "$1").trim();
        branches.push(branchName);
    }
    return branches;
}

/**
 * Lints Markdown files.
 * @param {array} files Array of file names to lint.
 * @returns {object} exec-style exit code object.
 * @private
 */
function lintMarkdown(files) {
    var config = {
            default: true,

            // Exclusions for deliberate/widespread violations
            MD001: false, // Header levels should only increment by one level at a time
            MD002: false, // First header should be a h1 header
            MD007: {      // Unordered list indentation
                indent: 4
            },
            MD012: false, // Multiple consecutive blank lines
            MD013: false, // Line length
            MD014: false, // Dollar signs used before commands without showing output
            MD019: false, // Multiple spaces after hash on atx style header
            MD021: false, // Multiple spaces inside hashes on closed atx style header
            MD024: false, // Multiple headers with the same content
            MD026: false, // Trailing punctuation in header
            MD029: false, // Ordered list item prefix
            MD030: false, // Spaces after list markers
            MD033: false, // Allow inline HTML
            MD034: false, // Bare URL used
            MD040: false, // Fenced code blocks should have a language specified
            MD041: false  // First line in file should be a top level header
        },
        result = markdownlint.sync({
            files: files,
            config: config
        }),
        resultString = result.toString(),
        returnCode = resultString ? 1 : 0;

    if (resultString) {
        console.error(resultString);
    }
    return { code: returnCode };
}

/**
 * Check if the branch name is valid
 * @param {string} branchName Branch name to check
 * @returns {boolean} true is branch exists
 * @private
 */
function hasBranch(branchName) {
    var branches = getBranches();

    return branches.indexOf(branchName) !== -1;
}

/**
 * Gets linting results from every formatter, based on a hard-coded snippet and config
 * @returns {Object} Output from each formatter
 */
function getFormatterResults() {
    var CLIEngine = require("./lib/cli-engine"),
        chalk = require("chalk");

    var formatterFiles = fs.readdirSync("./lib/formatters/"),
        cli = new CLIEngine({
            useEslintrc: false,
            baseConfig: { extends: "eslint:recommended" },
            rules: {
                "no-else-return": 1,
                indent: [1, 4],
                "space-unary-ops": 2,
                semi: [1, "always"],
                "consistent-return": 2
            }
        }),
        codeString = [
            "function addOne(i) {",
            "    if (i != NaN) {",
            "        return i ++",
            "    } else {",
            "      return",
            "    }",
            "};"
        ].join("\n"),
        rawMessages = cli.executeOnText(codeString, "fullOfProblems.js");

    return formatterFiles.reduce(function(data, filename) {
        var fileExt = path.extname(filename),
            name = path.basename(filename, fileExt);

        if (fileExt === ".js") {
            data.formatterResults[name] = {
                result: chalk.stripColor(cli.getFormatter(name)(rawMessages.results))
            };
        }
        return data;
    }, { formatterResults: {} });
}

//------------------------------------------------------------------------------
// Tasks
//------------------------------------------------------------------------------

target.all = function() {
    target.test();
};

target.lint = function() {
    var errors = 0,
        makeFileCache = " ",
        jsCache = " ",
        testCache = " ",
        lastReturn;

    // using the cache locally to speed up linting process
    if (!process.env.TRAVIS) {
        makeFileCache = " --cache --cache-file .cache/makefile_cache ";
        jsCache = " --cache --cache-file .cache/js_cache ";
        testCache = " --cache --cache-file .cache/test_cache ";
    }

    echo("Validating Makefile.js");
    lastReturn = exec(ESLINT + makeFileCache + MAKEFILE);
    if (lastReturn.code !== 0) {
        errors++;
    }

    echo("Validating JSON Files");
    lodash.forEach(JSON_FILES, validateJsonFile);

    echo("Validating Markdown Files");
    lastReturn = lintMarkdown(MARKDOWN_FILES_ARRAY);
    if (lastReturn.code !== 0) {
        errors++;
    }

    echo("Validating JavaScript files");
    lastReturn = exec(ESLINT + jsCache + JS_FILES);
    if (lastReturn.code !== 0) {
        errors++;
    }

    echo("Validating JavaScript test files");
    lastReturn = exec(ESLINT + testCache + TEST_FILES);
    if (lastReturn.code !== 0) {
        errors++;
    }

    if (errors) {
        exit(1);
    }
};

target.test = function() {
    target.lint();
    target.checkRuleFiles();
    var errors = 0,
        lastReturn;

    // exec(ISTANBUL + " cover " + MOCHA + "-- -c " + TEST_FILES);
    lastReturn = nodeCLI.exec("istanbul", "cover", MOCHA, "-- -R progress -t " + MOCHA_TIMEOUT, "-c", TEST_FILES);
    if (lastReturn.code !== 0) {
        errors++;
    }

    // exec(ISTANBUL + "check-coverage --statement 99 --branch 98 --function 99 --lines 99");
    lastReturn = nodeCLI.exec("istanbul", "check-coverage", "--statement 99 --branch 98 --function 99 --lines 99");
    if (lastReturn.code !== 0) {
        errors++;
    }

    target.browserify();

    lastReturn = nodeCLI.exec("karma", "start karma.conf.js");
    if (lastReturn.code !== 0) {
        errors++;
    }

    if (errors) {
        exit(1);
    }

    target.checkLicenses();
};

target.docs = function() {
    echo("Generating documentation");
    nodeCLI.exec("jsdoc", "-d jsdoc lib");
    echo("Documentation has been output to /jsdoc");
};

target.gensite = function(prereleaseVersion) {
    echo("Generating eslint.org");

    var docFiles = [
        "/rules/",
        "/user-guide/",
        "/maintainer-guide/",
        "/developer-guide/",
        "/about/"
    ];

    // append version
    if (prereleaseVersion) {
        docFiles = docFiles.map(function(docFile) {
            return "/" + prereleaseVersion + docFile;
        });
    }

    // 1. create temp and build directory
    if (!test("-d", TEMP_DIR)) {
        mkdir(TEMP_DIR);
    }

    // 2. remove old files from the site
    docFiles.forEach(function(filePath) {
        var fullPath = path.join(DOCS_DIR, filePath),
            htmlFullPath = fullPath.replace(".md", ".html");

        if (test("-f", fullPath)) {

            rm("-r", fullPath);

            if (filePath.indexOf(".md") >= 0 && test("-f", htmlFullPath)) {
                rm("-r", htmlFullPath);
            }
        }
    });

    // 3. Copy docs folder to a temporary directory
    cp("-rf", "docs/*", TEMP_DIR);

    var versions = test("-f", "./versions.json") ? JSON.parse(cat("./versions.json")) : {};

    if (!versions.added) {
        versions = {
            added: versions,
            removed: {}
        };
    }

    // Map from rule id to exported meta object
    var metaRules = find("lib/rules").filter(function(filename) {
        return test("-f", filename) && fileType("js")(filename);
    }).reduce(function(object, filename) {
        object[path.basename(filename, ".js")] = require("./" + filename).meta;
        return object;
    }, {});

    // 4. Loop through all files in temporary directory
    // 5. Prepend page title and layout variables at the top of rules
    // 6. Remove .md extension for links and change README to empty string
    // 7. Check if there's a trailing white line at the end of the file, if there isn't one, add it
    // 8. Append first version of ESLint rule was added at.
    find(TEMP_DIR).filter(function(filename) {
        return test("-f", filename) && fileType("md")(filename);
    }).forEach(function(filename) {
        var rulesUrl = "https://github.com/eslint/eslint/tree/master/lib/rules/",
            docsUrl = "https://github.com/eslint/eslint/tree/master/docs/rules/",
            linesDoc = cat(filename).replace(/\.md(.*?\))/g, ")").replace("README.html", "").trim().split("\n"),
            docBaseName = path.basename(filename),
            sourceBaseName = path.basename(filename, ".md") + ".js",
            sourcePath = path.join("lib/rules", sourceBaseName);

        // Regular expressions to match lines of markdown
        var regexpH1 = /^# (.+)/;
        var regexpH2 = /^## (.+)/;
        var regexpItem = /^(\* )/;
        var regexpRecommended = /^\(recommended\) /;
        var regexpFixable = /^\(fixable\) /;

        // Helpers

        /**
         * Link to a rule doc from another doc in the same directory.
         * @param {string} id Rule identifier.
         * @returns {string} Link in markdown.
         */
        function linkRule(id) {
            return "[" + id + "](" + id + ")";
        }

        /**
         * Index of the first line matched by a regular expression.
         * Similar to indexOf.
         * @param {string[]} lines Lines of markdown.
         * @param {RegExp} regexp Matches a line.
         * @param {number} [indexStart] Index to start from.
         * @returns {number} Index of the first line matched; otherwise -1.
         */
        function indexAt(lines, regexp, indexStart) {
            var length = lines.length;
            var index = indexStart || 0;

            while (index < length) {
                if (regexp.test(lines[index])) {
                    return index;
                }
                index += 1;
            }

            return -1;
        }

        /**
         * Index after any lines that match one or more regular expressions.
         * To skip automatically generated content that is already in the input.
         * Assume that an empty line separates the lines that match.
         * None of the patterns are required to match a line.
         * @param {string[]} lines Lines of markdown.
         * @param {RegExp[]} regexps Match lines.
         * @param {number} [indexStart] Index to start from.
         * @returns {number} Index after the last line matched.
         */
        function indexAfter(lines, regexps, indexStart) {
            var length = lines.length;

            return regexps.reduce(function(index, regexp, i) {
                if (i === 0) {

                    // The first line matches the first regexp.
                    if (index < length && regexp.test(lines[index])) {
                        return index + 1;
                    }
                } else {

                    // The current line is empty and the next line matches the current regexp.
                    if (index + 1 < length && lines[index] === "" && regexp.test(lines[index + 1])) {
                        return index + 2;
                    }
                }
                return index;
            }, indexStart || 0);
        }

        /**
         * Lines of Jekyll front matter prepended to a doc.
         * @param {Object} props Properties (for example, title, layout).
         * @returns {string[]} Lines of markdown.
         */
        function linesFrontMatter(props) {
            return [].concat(
                "---",
                Object.keys(props).map(function(key) {
                    return key + ": " + props[key];
                }),
                "---",
                "<!-- Note: No pull requests accepted for this file. See README.md in the root directory for details. -->",
                "" // empty line
            );
        }

        /**
         * Lines for kramdown to generate a table of contents.
         * Precedes the first paragraph of edited content.
         * @param {boolean} hasTOC The doc needs to have a TOC.
         * @returns {string[]} Lines of markdown.
         */
        function linesTOC(hasTOC) {
            if (hasTOC) {
                return [
                    "", // empty line
                    "* placeholder for table of contents", // ul
                    "{:toc}"
                ];
            }
            return [];
        }

        /**
         * Lines for a recommended rule.
         * @param {boolean} recommended The rule is recommended.
         * @param {boolean} removed The rule has been removed.
         * @returns {string[]} Lines of markdown.
         */
        function linesRecommended(recommended, removed) {
            if (recommended && !removed) {
                return [
                    "", // empty line
                    "(recommended) The `\"extends\": \"eslint:recommended\"` property in a [configuration file](../user-guide/configuring#extending-configuration-files) enables this rule."
                ];
            }
            return [];
        }

        /**
         * Lines for a fixable rule.
         * @param {boolean} fixable The rule is fixable.
         * @param {boolean} removed The rule has been removed.
         * @returns {string[]} Lines of markdown.
         */
        function linesFixable(fixable, removed) {
            if (fixable) {
                return [
                    "", // empty line
                    "(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically " +
                        (removed ? "fixed" : "fixes") +
                        " problems reported by this rule."
                ];
            }
            return [];
        }

        /**
         * Lines of active rules in a category for the rules index.
         * @param {string} category The section heading.
         * @returns {string[]} Lines of markdown.
         */
        function linesActiveRules(category) {
            return Object.keys(metaRules)
                .filter(function(id) {
                    return metaRules[id].docs.category === category;
                })
                .sort()
                .map(function(id) {
                    var meta = metaRules[id];
                    var docs = meta.docs;

                    return "|" + (docs.recommended ? "(recommended)" : "") +
                        "|" + (meta.fixable ? "(fixable)" : "") +
                        "|" + linkRule(id) +
                        "|" + docs.description;
                });
        }

        /**
         * Lines for the rules index.
         * @param {string[]} lines Lines of markdown input.
         * @returns {string[]} Lines of markdown output.
         */
        function linesRulesIndex(lines) {
            var index,
                category,
                linesTable;

            // Delete this filter after list items have been deleted from the README.md file.
            // Keep a line if neither of the following is true:
            // It is a list item.
            // It is empty and the next line is a list item.
            lines = lines.filter(function(line, i) {
                return !(regexpItem.test(line) || (line === "" && i + 1 < lines.length && regexpItem.test(lines[i + 1])));
            });

            index = indexAt(lines, regexpH2);
            while (index !== -1) {
                category = regexpH2.exec(lines[index])[1];
                index = indexAt(lines, regexpH2, index + 1);

                // Will also insert rows for removed rules after we decide on meta data structure.
                if (category !== "Removed") {
                    linesTable = linesActiveRules(category);
                    if (index === -1) {
                        lines = lines.concat(
                            "", // empty line
                            linesTable
                        );
                    } else {
                        lines = [].concat(
                            lines.slice(0, index),
                            linesTable,
                            "", // empty line
                            lines.slice(index)
                        );
                        index += (linesTable.length + 1);
                    }
                }
            }

            return [].concat(
                linesFrontMatter({
                    title: "Rules",
                    layout: "rules"
                }),
                lines
            );
        }

        /**
         * Lines for a removed rule doc.
         * We need to decide on meta data structure for removed rules!
         * @param {string[]} lines Lines of markdown input.
         * @returns {string[]} Lines of markdown output.
         */
        function linesRemovedRule(lines) {
            return lines;
        }

        /**
         * Lines for an active rule doc.
         * @param {string[]} lines Lines of markdown input.
         * @param {string} id Rule identifier.
         * @returns {string[]} Lines of markdown output.
         */
        function linesActiveRule(lines, id) {
            var meta = metaRules[id],
                docs = meta.docs;

            return [].concat(
                "# " + id + ": " + docs.description,
                linesRecommended(docs.recommended, false),
                linesFixable(meta.fixable, false),
                lines.slice(indexAfter(lines, [regexpH1, regexpRecommended, regexpFixable]))
            );
        }

        /**
         * Lines appended to a rule doc.
         * @param {string} id Rule identifier.
         * @param {string} added Version in which the rule was added.
         * @param {string} [removed] Version in which the rule was removed.
         * @returns {string[]} Lines of markdown.
         */
        function linesRuleVersionResources(id, added, removed) {
            return [
                "", // empty line
                "## Version",
                "", // empty line
                "This rule was introduced in ESLint " + added + (removed
                    ? " and removed in " + removed + "."
                    : "."),
                "", // empty line
                "## Resources",
                "" // empty line
            ].concat(
                removed ? [] : ["* [Rule source](" + rulesUrl + id + ".js)"],
                "* [Documentation source](" + docsUrl + id + ".md)"
            );
        }

        /**
         * Lines for a rule doc.
         * @param {string[]} lines Lines of markdown input.
         * @param {string} id Rule identifier.
         * @param {string} added Version in which the rule was added.
         * @param {string} [removed] Version in which the rule was removed.
         * @returns {string[]} Lines of markdown output.
         */
        function linesRuleDoc(lines, id, added, removed) {
            return [].concat(
                linesFrontMatter({
                    title: "Rule " + id,
                    layout: "rule"
                }),
                removed
                    ? linesRemovedRule(lines, id, removed)
                    : linesActiveRule(lines, id),
                linesRuleVersionResources(id, added, removed)
            );
        }

        /**
         * Lines for any doc that is not in the rules directory.
         * @param {string[]} lines Lines of markdown input.
         * @returns {string[]} Lines of markdown output.
         */
        function linesOtherDoc(lines) {
            var match = lines[0].match(regexpH1),
                title = match ? match[1].trim() : "Documentation",
                indexAfterH1 = indexAfter(lines, [regexpH1]),
                countH2 = lines.reduce(function(count, line) {
                    return count + (regexpH2.test(line) ? 1 : 0);
                }, 0);

            return [].concat(
                linesFrontMatter({
                    title: title,
                    layout: "doc"
                }),
                lines.slice(0, indexAfterH1),
                linesTOC(countH2 > 1),
                lines.slice(indexAfterH1)
            );
        }

        // Task

        if (path.basename(path.dirname(filename)) === "rules") {
            if (docBaseName === "README.md") {
                linesDoc = linesRulesIndex(linesDoc);
            } else {
                if (!versions.added[docBaseName]) {
                    versions.added[docBaseName] = getFirstVersionOfFile(sourcePath);
                }
                if (!versions.removed[docBaseName] && !fs.existsSync(sourcePath)) {
                    versions.removed[docBaseName] = getFirstVersionOfDeletion(sourcePath);
                }
                linesDoc = linesRuleDoc(linesDoc,
                    path.basename(filename, ".md"), // identifier
                    versions.added[docBaseName],
                    versions.removed[docBaseName]);
            }
        } else {
            linesDoc = linesOtherDoc(linesDoc);
        }

        // 9. Update content of the file with changes
        (linesDoc.join("\n") + "\n").to(filename.replace("README.md", "index.md"));
    });
    JSON.stringify(versions).to("./versions.json");

    // 10. Copy temorary directory to site's docs folder
    var outputDir = DOCS_DIR;

    if (prereleaseVersion) {
        outputDir += "/" + prereleaseVersion;
    }
    cp("-rf", TEMP_DIR + "*", outputDir);

    // 11. Delete temporary directory
    rm("-r", TEMP_DIR);

    // 12. Update demos, but only for non-prereleases
    if (!prereleaseVersion) {
        cp("-f", "build/eslint.js", SITE_DIR + "js/app/eslint.js");
        cp("-f", "conf/eslint.json", SITE_DIR + "js/app/eslint.json");
    }

    // 13. Create Example Formatter Output Page
    generateFormatterExamples(getFormatterResults(), prereleaseVersion);
};

target.publishsite = function() {
    var currentDir = pwd();

    cd(SITE_DIR);
    exec("git add -A .");
    exec("git commit -m \"Autogenerated new docs and demo at " + dateformat(new Date()) + "\"");
    exec("git fetch origin && git rebase origin/master");
    exec("git push origin master");
    cd(currentDir);
};

target.browserify = function() {

    // 1. create temp and build directory
    if (!test("-d", TEMP_DIR)) {
        mkdir(TEMP_DIR);
    }

    if (!test("-d", BUILD_DIR)) {
        mkdir(BUILD_DIR);
    }

    // 2. copy files into temp directory
    cp("-r", "lib/*", TEMP_DIR);

    // 3. delete the load-rules.js file
    rm(TEMP_DIR + "load-rules.js");

    // 4. create new load-rule.js with hardcoded requires
    generateRulesIndex(TEMP_DIR);

    // 5. browserify the temp directory
    nodeCLI.exec("browserify", "-x espree", TEMP_DIR + "eslint.js", "-o", BUILD_DIR + "eslint.js", "-s eslint");

    // 6. Browserify espree
    nodeCLI.exec("browserify", "-r espree", "-o", TEMP_DIR + "espree.js");

    // 7. Concatenate the two files together
    cat(TEMP_DIR + "espree.js", BUILD_DIR + "eslint.js").to(BUILD_DIR + "eslint.js");

    // 8. remove temp directory
    rm("-r", TEMP_DIR);
};

target.checkRuleFiles = function() {

    echo("Validating rules");

    var eslintConf = require("./conf/eslint.json").rules;

    var ruleFiles = find("lib/rules/").filter(fileType("js")),
        rulesIndexText = cat("docs/rules/README.md"),
        errors = 0;

    ruleFiles.forEach(function(filename) {
        var basename = path.basename(filename, ".js");
        var docFilename = "docs/rules/" + basename + ".md";

        var indexLine = new RegExp("\\* \\[" + basename + "\\].*").exec(rulesIndexText);

        indexLine = indexLine ? indexLine[0] : "";

        /**
         * Check if basename is present in eslint conf
         * @returns {boolean} true if present
         * @private
         */
        function isInConfig() {
            return eslintConf.hasOwnProperty(basename);
        }

        /**
         * Check if rule is off in eslint conf
         * @returns {boolean} true if off
         * @private
         */
        function isOffInConfig() {
            var rule = eslintConf[basename];

            return rule === "off" || (rule && rule[0] === "off");
        }

        /**
         * Check if rule is on in eslint conf
         * @returns {boolean} true if on
         * @private
         */
        function isOnInConfig() {
            return !isOffInConfig();
        }

        /**
         * Check if rule is not recommended by eslint
         * @returns {boolean} true if not recommended
         * @private
         */
        function isNotRecommended() {
            return indexLine.indexOf("(recommended)") === -1;
        }

        /**
         * Check if rule is recommended by eslint
         * @returns {boolean} true if recommended
         * @private
         */
        function isRecommended() {
            return !isNotRecommended();
        }

        /**
         * Check if id is present in title
         * @param {string} id id to check for
         * @returns {boolean} true if present
         * @private
         */
        function hasIdInTitle(id) {
            var docText = cat(docFilename);
            var idOldAtEndOfTitleRegExp = new RegExp("^# (.*?) \\(" + id + "\\)"); // original format
            var idNewAtBeginningOfTitleRegExp = new RegExp("^# " + id + ": "); // new format is same as rules index
            // 1. Added support for new format.
            // 2. Will remove support for old format after all docs files have new format.
            // 3. Will remove this check when the main heading is automatically generated from rule metadata.

            return idNewAtBeginningOfTitleRegExp.test(docText) || idOldAtEndOfTitleRegExp.test(docText);
        }

        // check for docs
        if (!test("-f", docFilename)) {
            console.error("Missing documentation for rule %s", basename);
            errors++;
        } else {

            // check for entry in docs index
            if (rulesIndexText.indexOf("(" + basename + ".md)") === -1) {
                console.error("Missing link to documentation for rule %s in index", basename);
                errors++;
            }

            // check for proper doc format
            if (!hasIdInTitle(basename)) {
                console.error("Missing id in the doc page's title of rule %s", basename);
                errors++;
            }
        }

        // check for default configuration
        if (!isInConfig()) {
            console.error("Missing default setting for %s in eslint.json", basename);
            errors++;
        }

        // check that rule is not recommended in docs but off in default config
        if (isRecommended() && isOffInConfig()) {
            console.error("Rule documentation says that %s is recommended, but it is disabled in eslint.json.", basename);
            errors++;
        }

        //  check that rule is not on in default config but not recommended
        if (isOnInConfig("default") && isNotRecommended("default")) {
            console.error("Missing '(recommended)' for rule %s in index", basename);
            errors++;
        }

        // check for tests
        if (!test("-f", "tests/lib/rules/" + basename + ".js")) {
            console.error("Missing tests for rule %s", basename);
            errors++;
        }

    });

    if (errors) {
        exit(1);
    }

};

target.checkLicenses = function() {

    /**
     * Check if a dependency is eligible to be used by us
     * @param {object} dependency dependency to check
     * @returns {boolean} true if we have permission
     * @private
     */
    function isPermissible(dependency) {
        var licenses = dependency.licenses;

        if (Array.isArray(licenses)) {
            return licenses.some(function(license) {
                return isPermissible({
                    name: dependency.name,
                    licenses: license
                });
            });
        }

        return OPEN_SOURCE_LICENSES.some(function(license) {
            return license.test(licenses);
        });
    }

    echo("Validating licenses");

    checker.init({
        start: __dirname
    }, function(deps) {
        var impermissible = Object.keys(deps).map(function(dependency) {
            return {
                name: dependency,
                licenses: deps[dependency].licenses
            };
        }).filter(function(dependency) {
            return !isPermissible(dependency);
        });

        if (impermissible.length) {
            impermissible.forEach(function(dependency) {
                console.error("%s license for %s is impermissible.",
                    dependency.licenses,
                    dependency.name
                );
            });
            exit(1);
        }
    });
};

target.checkGitCommit = function() {
    var commitMsgs,
        failed;

    if (hasBranch("master")) {
        commitMsgs = splitCommandResultToLines(execSilent("git log HEAD --not master --format=format:%s --no-merges"));
    } else {
        commitMsgs = [execSilent("git log -1 --format=format:%s --no-merges")];
    }

    echo("Validating Commit Message");

    // No commit since master should not cause test to fail
    if (commitMsgs[0] === "") {
        return;
    }

    // Check for more than one commit
    if (commitMsgs.length > 1) {
        echo(" - More than one commit found, please squash.");
        failed = true;
    }

    // Only check non-release messages
    if (!semver.valid(commitMsgs[0]) && !/^Revert /.test(commitMsgs[0])) {
        if (commitMsgs[0].split(/\r?\n/)[0].length > 72) {
            echo(" - First line of commit message must not exceed 72 characters");
            failed = true;
        }

        // Check for tag at start of message
        if (!TAG_REGEX.test(commitMsgs[0])) {
            echo([" - Commit summary must start with one of:",
                "    'Fix:'",
                "    'Update:'",
                "    'Breaking:'",
                "    'Docs:'",
                "    'Build:'",
                "    'New:'",
                "    'Upgrade:'",
                "    'Chore:'",
                "   Please refer to the contribution guidelines for more details."].join("\n"));
            failed = true;
        }

        // Check for an issue reference at end (unless it's a documentation commit)
        if (!/^Docs:/.test(commitMsgs[0])) {
            if (!ISSUE_REGEX.test(commitMsgs[0])) {
                echo([" - Commit summary must end with with one of:",
                    "    '(fixes #1234)'",
                    "    '(refs #1234)'",
                    "   Where '1234' is the issue being addressed.",
                    "   Please refer to the contribution guidelines for more details."].join("\n"));
                failed = true;
            }
        }
    }

    if (failed) {
        exit(1);
    }
};

/**
 * Downloads a repository which has many js files to test performance with multi files.
 * Here, it's eslint@1.10.3 (450 files)
 * @param {function} cb - A callback function.
 * @returns {void}
 */
function downloadMultifilesTestTarget(cb) {
    if (test("-d", PERF_MULTIFILES_TARGET_DIR)) {
        process.nextTick(cb);
    } else {
        mkdir("-p", PERF_MULTIFILES_TARGET_DIR);
        echo("Downloading the repository of multi-files performance test target.");
        exec("git clone -b v1.10.3 --depth 1 https://github.com/eslint/eslint.git \"" + PERF_MULTIFILES_TARGET_DIR + "\"", {silent: true}, cb);
    }
}

/**
 * Creates a config file to use performance tests.
 * This config is turning all core rules on.
 * @returns {void}
 */
function createConfigForPerformanceTest() {
    var content = [
        "root: true",
        "env:",
        "    node: true",
        "    es6: true",
        "rules:"
    ];

    content.push.apply(
        content,
        ls("lib/rules").map(function(fileName) {
            return "    " + path.basename(fileName, ".js") + ": 1";
        })
    );

    content.join("\n").to(PERF_ESLINTRC);
}

/**
 * Calculates the time for each run for performance
 * @param {string} cmd cmd
 * @param {int} runs Total number of runs to do
 * @param {int} runNumber Current run number
 * @param {int[]} results Collection results from each run
 * @param {function} cb Function to call when everything is done
 * @returns {int[]} calls the cb with all the results
 * @private
 */
function time(cmd, runs, runNumber, results, cb) {
    var start = process.hrtime();

    exec(cmd, { silent: true }, function(code, stdout, stderr) {
        var diff = process.hrtime(start),
            actual = (diff[0] * 1e3 + diff[1] / 1e6); // ms

        if (code) {
            echo("  Performance Run #" + runNumber + " failed.");
            if (stdout) {
                echo("STDOUT:\n" + stdout + "\n\n");
            }

            if (stderr) {
                echo("STDERR:\n" + stderr + "\n\n");
            }
            return cb(null);
        }

        results.push(actual);
        echo("  Performance Run #" + runNumber + ":  %dms", actual);
        if (runs > 1) {
            return time(cmd, runs - 1, runNumber + 1, results, cb);
        } else {
            return cb(results);
        }
    });

}

/**
 * Run a performance test.
 *
 * @param {string} title - A title.
 * @param {string} targets - Test targets.
 * @param {number} multiplier - A multiplier for limitation.
 * @param {function} cb - A callback function.
 * @returns {void}
 */
function runPerformanceTest(title, targets, multiplier, cb) {
    var cpuSpeed = os.cpus()[0].speed,
        max = multiplier / cpuSpeed,
        cmd = ESLINT + "--config \"" + PERF_ESLINTRC + "\" --no-eslintrc --no-ignore " + targets;

    echo("");
    echo(title);
    echo("  CPU Speed is %d with multiplier %d", cpuSpeed, multiplier);

    time(cmd, 5, 1, [], function(results) {
        if (!results || results.length === 0) {  // No results? Something is wrong.
            throw new Error("Performance test failed.");
        }

        results.sort(function(a, b) {
            return a - b;
        });

        var median = results[~~(results.length / 2)];

        echo("");
        if (median > max) {
            echo("  Performance budget exceeded: %dms (limit: %dms)", median, max);
        } else {
            echo("  Performance budget ok:  %dms (limit: %dms)", median, max);
        }
        echo("");
        cb();
    });
}

/**
 * Run the load performance for eslint
 * @returns {void}
 * @private
 */
function loadPerformance() {
    echo("");
    echo("Loading:");

    var results = [];

    for (var cnt = 0; cnt < 5; cnt++) {
        var loadPerfData = loadPerf({
            checkDependencies: false
        });

        echo("  Load performance Run #" + (cnt + 1) + ":  %dms", loadPerfData.loadTime);
        results.push(loadPerfData.loadTime);
    }

    results.sort(function(a, b) {
        return a - b;
    });
    var median = results[~~(results.length / 2)];

    echo("");
    echo("  Load Performance median:  %dms", median);
    echo("");
}

target.perf = function() {
    downloadMultifilesTestTarget(function() {
        createConfigForPerformanceTest();

        loadPerformance();

        runPerformanceTest(
            "Single File:",
            "tests/performance/jshint.js",
            PERF_MULTIPLIER,
            function() {

                // Count test target files.
                var count = glob.sync(
                    process.platform === "win32"
                        ? PERF_MULTIFILES_TARGETS.slice(2).replace("\\", "/")
                        : PERF_MULTIFILES_TARGETS
                ).length;

                runPerformanceTest(
                    "Multi Files (" + count + " files):",
                    PERF_MULTIFILES_TARGETS,
                    3 * PERF_MULTIPLIER,
                    function() {}
                );
            }
        );
    });
};

target.release = function() {
    release();
};

target.prerelease = function(args) {
    prerelease(args[0]);
};
