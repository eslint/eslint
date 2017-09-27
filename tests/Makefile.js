/**
 * @fileoverview Release tests for the Makefile.js
 * @author Victor Hom
 */

"use strict";

const assert = require("chai").assert;
const shell = require("shelljs");
const os = require("os");
const fs = require("fs");
const mock = require("mock-fs"); // VICTOR - need to use mock somewhere
const path = require("path");
const ConfigFile = require("../lib/config/config-file")
const Linter = require("../lib/linter");
const Config = require("../lib/config");

const find = shell.find;
const ls = shell.ls;
const rm = shell.rm;
const mkdir = shell.mkdir;

const Makefile = require(`${__dirname}/../Makefile.js`);
const JSON_FILES = find("conf/").filter(Makefile.fileType("json"));
const SITE_DIR = "../eslint.github.io/";
const POST_DIR = path.join(os.tmpdir(), "_posts");

describe("Makefile.js", () => {

    describe("getTestFilesPatterns", () => {
        it("should return a string of string delimited test file patterns", () => {
            const filePatterns = Makefile.getTestFilePatterns().split(" ");
            const pattern = [
                "tests/lib/rules/**/*.js",
                "tests/lib/*.js",
                "tests/templates/*.js",
                "tests/bin/**/*.js",
                "tests/tools/*.js",
                "\"tests/lib/code-path-analysis/**/*.js\"",
                "\"tests/lib/config/**/*.js\"",
                "\"tests/lib/formatters/**/*.js\"",
                "\"tests/lib/internal-rules/**/*.js\"",
                "\"tests/lib/testers/**/*.js\"",
                "\"tests/lib/util/**/*.js\""
            ];
            assert.sameOrderedMembers(filePatterns, pattern);
            assert.equal(filePatterns.length, 11);
        });
    });

    describe("validateJsonFile", () => {

        it("should parse the contents", () => {
            assert.equal(JSON_FILES.length, 3);
            assert.sameOrderedMembers(JSON_FILES,
                [
                    'conf/blank-script.json',
                    'conf/category-list.json',
                    'conf/replacements.json'
                ]
            );
            JSON_FILES.forEach((filepath) => {
                Makefile.validateJsonFile(filepath);
            });
        });

        it("throw an error if it's invalid JSON", () => {
            const invalidJson = `${__dirname}/fixtures/conf/invalid-conf.json`;
            function testfun() {
                Makefile.validateJsonFile(invalidJson);
            }
            assert.throws(testfun, SyntaxError, "Unexpected token / in JSON at position 0");
        });
    });

    describe("fileType", () => {
        const fileTypeMatcher = Makefile.fileType("json");

        it("returns a function", () => {
            assert.isFunction(fileTypeMatcher);
        });

        it("returns true if file type matches", () => {
            assert.isTrue(fileTypeMatcher("test.json"), true);
        })

        it("returns false if the file type does not match", () => {
            assert.isFalse(fileTypeMatcher("test.xyz"));
            assert.isFalse(fileTypeMatcher("noExtensionFile"));
            assert.isFalse(fileTypeMatcher(""));
        });
    });

    describe("parentDirectory", () => {
        const parentDirectoryMatcher = Makefile.parentDirectory("rules");

        it("returns a function", () => {
            assert.isFunction(parentDirectoryMatcher);
        });

        it("returns true if parent directory name matches", () => {
            assert.isTrue(parentDirectoryMatcher("./test/rules/filename.js"));
        });

        it("returns false if parent directory name does not match", () => {
            assert.isFalse(parentDirectoryMatcher("./rulesbreaker/filename.js"));
        });
    });

    describe("generateRuleIndex", () => {
        it("generates a file that exports a method that returns a rules object", () => {
            const fixturesDir = `${__dirname}/fixtures/`;
            const loadRulesPath = `${fixturesDir}load-rules.js`;
            const ruleKeys = ["custom-rule", "fixture-rule", "make-syntax-error-rule", "test-multi-rulesdirs"];

            fs.writeFile(loadRulesPath, '');
            Makefile.generateRulesIndex(fixturesDir);

            const generatedRulesExport = require(loadRulesPath);
            const generatedRulesIndex = generatedRulesExport();

            assert.isFunction(generatedRulesExport);
            assert.isObject(generatedRulesIndex);
            assert.containsAllKeys(generatedRulesIndex, ruleKeys);
        });
    });

    describe("execSilent", () => {
        it("executes a command and returns the output", () => {
            assert.include(Makefile.execSilent("node --version"), process.versions.node);
        });
    });
    // need to clean up definitely
    describe("generateBlogPost", () => {
        const releaseInfo = {
            version: 1,
            type: "test",
            changelog: {
                new: ["7777777", "dedbeef"]
            }
        };
        const now = new Date(),
        month = now.getMonth() + 1,
        day = now.getDate(),
        fileName = `${os.tmpdir()}/_posts/${now.getFullYear()}-${
            month < 10 ? `0${month}` : month}-${
            day < 10 ? `0${day}` : day}-eslint-v${
            releaseInfo.version}-released.md`;

        // assumes the eslint.github.io project is at same level as eslint project
        it("generates a release blog post for eslint.org", () => {
            rm("-rf", POST_DIR);
            mkdir(POST_DIR);
            Makefile.generateBlogPost(releaseInfo, os.tmpdir()+"/");

            assert.isTrue(fs.existsSync(fileName));

            rm(fileName);
            rm("-rf", POST_DIR);
        });
    });

    describe("generateFormatterExamples", () => {
        it("generates a doc page", () => {

            // const formatterResults = {
            //     html: {
            //         result: "result"
            //     }
            // }

            // Makefile.generateFormatterExamples({formatterResults: formatterResults}, "", SITE_DIR);
            assert.isTrue(true);
        });
    });

    describe("generateRuleIndexPage", () => {
        it("generate a rules index page", () => {
            Makefile.generateRuleIndexPage(process.cwd(), SITE_DIR);

            // TODO
            assert.isFalse(false);
        });
    });

    describe("publishSite", () => {
        it("commits the change and publishes to github", () => {

            // TODO
            // This mutates inside the method; hard to test
            assert.isTrue(true);
        });
    });

    describe("release", () => {
        it("creates a release versin tag and pushes to github", () => {

            // TODO
            // This mutates inside the method; hard to test
            assert.isTrue(true);
        });
    });

    describe("prerelease", () => {
        it("creates a prerelease versin tag and pushes to github", () => {

            // TODO
            // This mutates inside the method; hard to test
            assert.isTrue(true);
        });
    });

    describe("splitCommandResultToLines", () => {
        it("splits a command result into separate lines", () => {
            const nodeVersion = Makefile.execSilent("node --version");
            const splitCommands = Makefile.splitCommandResultToLines(nodeVersion);

            assert.include(nodeVersion, "\n");
            assert.isArray(splitCommands);
            assert.include(splitCommands[0], process.versions.node)
        });
    });

    // Need advice on general testing of commands that make use of git commands
    describe("getFirstCommitOfFile", () => {
        const filePath = "makefile_test.html";
        const testBranch = "pr/victor_hom_makefile_branch_test";
        const currentBranchName = Makefile.execSilent("git rev-parse --abbrev-ref HEAD");

        it("returns sha of the given file", () => {

            // Suggestion? Is there a way to mock git commands
            // Makefile.execSilent(`git checkout -b ${testBranch}`);
            // Makefile.execSilent(`touch ${filePath}`);
            // Makefile.execSilent(`git add ${filePath}`);
            // Makefile.execSilent("git commit -m 'add makefile for hasBranch test'");
            // assert.isOk(Makefile.getFirstCommitOfFile(filePath));
            // Makefile.execSilent("git reset HEAD~");
            // Makefile.execSilent(`rm {filePath}`);
            // Makefile.execSilent(`git checkout ${currentBranchName}`);
            // Makefile.execSilent(`git branch -D ${testBranch}`);
            assert.isTrue(true);
        });
    });

    describe("getTagOfFirstOccurence", () => {
        assert.isTrue(true);
    });

    describe("getCommitDeletingFile", () => {
        assert.isTrue(true);
    });

    describe("getFirstVersionOfDeletion", () => {
        assert.isTrue(true);
    });

    describe("getBranches", () => {
        it("returns array of branch names", () => {
            const branches = Makefile.getBranches();

            // if branch was committed, branches length is at least 1
            assert.isAbove(branches.length, 1);
        });
    });

    describe("lintMarkdown", () => {
        const md = `${__dirname}/fixtures/docs/`;

        it("returns code 0 if valid", () => {
            const validFile = find(md + "valid").concat(ls(".")).filter(Makefile.fileType("md"));

            assert.equal(Makefile.lintMarkdown(validFile).code, 0);
        });

        it("returns code 1 if a file did not pass linter", () => {
            const invalidFile = find(md + "invalid").concat(ls(".")).filter(Makefile.fileType("md"));

            assert.equal(Makefile.lintMarkdown(invalidFile).code, 1);
        });
    });

    describe("hasBranch", () => {
        const testBranch = "pr/victor_hom_makefile_branch_test";
        const currentBranchName = Makefile.execSilent("git rev-parse --abbrev-ref HEAD");

        it ("has branch name", () => {
            // Suggestion? Is there a way to mock git commands
            // Makefile.execSilent(`git checkout -b ${testBranch}`);
            // Makefile.execSilent("touch makefile_test.html");
            // Makefile.execSilent("git add makefile_test.html");
            // Makefile.execSilent("git commit -m 'add makefile for hasBranch test'");
            // assert.isTrue(Makefile.hasBranch(testBranch));
            // Makefile.execSilent("git reset HEAD~");
            // Makefile.execSilent("rm makefile_test.html");
            // Makefile.execSilent(`git checkout ${currentBranchName}`);
            // Makefile.execSilent(`git branch -D ${testBranch}`);
            assert.isTrue(true);
        });
    });

    describe("getFormatterResults", () => {
        it("gets configurations", () => {
            const formatterResults = Makefile.getFormatterResults().formatterResults;

            assert.equal(Object.keys(formatterResults).length, 12);
            assert.isDefined(formatterResults['checkstyle']['result']);
            assert.isDefined(formatterResults['codeframe']['result']);
            assert.isDefined(formatterResults['compact']['result']);
            assert.isDefined(formatterResults['html']['result']);
            assert.isDefined(formatterResults['jslint-xml']['result']);
            assert.isDefined(formatterResults['json']['result']);
            assert.isDefined(formatterResults['junit']['result']);
            assert.isDefined(formatterResults['stylish']['result']);
            assert.isDefined(formatterResults['table']['result']);
            assert.isDefined(formatterResults['tap']['result']);
            assert.isDefined(formatterResults['unix']['result']);
            assert.isDefined(formatterResults['visualstudio']['result']);
        });
    });

    describe("downloadMultifilesTestTarget", () => {
        const PERF_TMP_DIR = path.join(os.tmpdir(), "eslint", "performance", "eslint")

        it("creates a eslint/performance/eslint if it does not exist", () => {
            // unclear on testing the else branch of downloadMultiflesTestTarget
            Makefile.downloadMultifilesTestTarget(() => {});
            rm("-rf", PERF_TMP_DIR);
        });
    });

    describe("createConfigForPerformanceTest", () => {
        const PERF_TMP_DIR = path.join(os.tmpdir(), "eslint", "performance")

        it("creates a eslintrc.yml under performance/eslint", () => {
            mkdir("-p", PERF_TMP_DIR);
            Makefile.createConfigForPerformanceTest()
            const config = ConfigFile.load(PERF_TMP_DIR+"/eslintrc.yml", new Config({}, new Linter()));
            assert.isObject(config);
            assert.isNotEmpty(config.rules);
            rm("-rf", os.tmpdir()+"/eslint");
        });
    });

    describe("time", () => {
        it("runs cmd passed in", () => {

            // unable to consistently see the Performance Run #...
            // TODO
            assert.isTrue(true);
        });

    });

    describe("runPerformanceTest", () => {
        // TODO
        assert.isTrue(true);
    });

    describe("loadPerformance", () => {
        // TODO
        assert.isTrue(true);
    });

    // Tasks
    // functions added to target
    // { all: [Function],
    //     lint: [Function],
    //     fuzz: [Function],
    //     test: [Function],
    //     docs: [Function],
    //     gensite: [Function],
    //     browserify: [Function],
    //     checkRuleFiles: [Function],
    //     checkLicenses: [Function],
    //     checkGitCommit: [Function],
    //     perf: [Function],
    //     release: [Function],
    //     ciRelease: [Function],
    //     publishsite: [Function],
    //     prerelease: [Function] }
});
