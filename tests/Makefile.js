/**
 * @fileoverview Release tests for the Makefile.js
 * @author Victor Hom
 */

"use strict";

const assert = require("chai").assert;
const shell = require("shelljs");
const os = require("os");
const fs = require("fs");
const path = require("path");
const ConfigFile = require("../lib/config/config-file")
const Linter = require("../lib/linter");
const Config = require("../lib/config");

const find = shell.find;
const ls = shell.ls;
const rm = shell.rm;
const mkdir = shell.mkdir;
const Makefile = require(`${__dirname}/../Makefile.js`);

describe("Makefile.js", () => {

    describe("getTestFilesPatterns", () => {
        const mockFs = require("mock-fs");

        before(() => {
            mockFs({
                "tests/lib/": {
                    "code-path-analysis": {},
                    "config": {},
                    "bin": {},
                    "tools": {},
                    "rules": {}
                }
            });
        });

        after(() => {
            mockFs.restore();
        });

        it("should return a list of test file patterns", () => {
            const filePatterns = Makefile.getTestFilePatterns().split(" ");

            // first 5 patterns comes from the default getTestFilePatterns
            const pattern = [
                "tests/lib/rules/**/*.js",
                "tests/lib/*.js",
                "tests/templates/*.js",
                "tests/bin/**/*.js",
                "tests/tools/*.js",
                "\"tests/lib/bin/**/*.js\"",
                "\"tests/lib/code-path-analysis/**/*.js\"",
                "\"tests/lib/config/**/*.js\"",
                "\"tests/lib/tools/**/*.js\""
            ];

            assert.sameOrderedMembers(filePatterns, pattern);
            assert.equal(filePatterns.length, 9);
        });
    });

    describe("validateJsonFile", () => {
        const mockFs = require("mock-fs");
        
        before(() => {
            mockFs({
                "conf/": {
                    "blank-script.json": '{"type": "Program", "body": [], "sourceType": "script"}',
                    "category-list.json": "{}",
                    "replacements.json": "{}",
                    "bad-json.json": "{"
                }
            });
        });

        after(() => {
            mockFs.restore();
        });

        it("should parse the contents and return undefined", () => {
            assert.equal(Makefile.validateJsonFile("conf/blank-script.json"), undefined);
            assert.equal(Makefile.validateJsonFile("conf/category-list.json"), undefined);
            assert.equal(Makefile.validateJsonFile("conf/replacements.json"), undefined);
        });

        it("throw an error if it's invalid JSON", () => {
            assert.throws(() => {Makefile.validateJsonFile("conf/bad-json.json")}, SyntaxError, "Unexpected end of JSON input");
        });

        it("throw an error if file does not exist", () => {
            assert.throws(() => {Makefile.validateJsonFile("conf/nofile.json")}, Error, "ENOENT, no such file or directory 'conf/nofile.json'");
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
        const mockFs = require("mock-fs");
        
        before(() => {
            mockFs({
                "fixtures/": {
                    "rules": {
                        "custom-rule.js": "",
                        "fixture-rule.js": "",
                        "syntax-rule.js": "",
                        "multi-rulesdirs.js": ""
                    }
                }
            });
        });

        after(() => {
            mockFs.restore();
        });

        it("generates a file that exports a method that returns a rules object", () => {
            Makefile.generateRulesIndex("fixtures/");
            
            // cannot require the file with mock-fs
            const generatedRulesExport = fs.readFileSync("fixtures/load-rules.js", "utf8");

            assert.include(generatedRulesExport, "var rules = Object.create(null);");
            assert.include(generatedRulesExport, 'rules["custom-rule"] = require("./rules/custom-rule");');
            assert.include(generatedRulesExport, 'rules["fixture-rule"] = require("./rules/fixture-rule");');
            assert.include(generatedRulesExport, 'rules["syntax-rule"] = require("./rules/syntax-rule");');
            assert.include(generatedRulesExport, 'rules["multi-rulesdirs"] = require("./rules/multi-rulesdirs");');
            assert.include(generatedRulesExport, "return rules;")
        });
    });

    describe("execSilent", () => {
        it("executes a command and returns the output", () => {
            assert.include(Makefile.execSilent("node --version"), process.versions.node);
        });
    });

    describe("generateBlogPost", () => {
        const mockFs = require("mock-fs");
        
        before(() => {
            mockFs({
                "eslint.github.io/_posts/": {},
                "templates/": {
                    "blogpost.md.ejs": fs.readFileSync("./templates/blogpost.md.ejs")
                },
                "lib/rules": {
                    "custom-rule.js": "custom-rule-text",
                    "fixture-rule.js": "fixture-rule-text",
                    "syntax-rule.js": "syntax-rule-text",
                    "multi-rulesdirs.js": "multi-rulesdirs-text"
                }
            });
        });

        after(() => {
            mockFs.restore();
        });

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
        fileName = `eslint.github.io/_posts/${now.getFullYear()}-${
            month < 10 ? `0${month}` : month}-${
            day < 10 ? `0${day}` : day}-eslint-v${
            releaseInfo.version}-released.md`;

        it("generates a release blog post for eslint.org", () => {
            Makefile.generateBlogPost(releaseInfo, "eslint.github.io/");
            const blogPost = fs.readFileSync(fileName, "utf8");

            assert.isTrue(fs.existsSync(fileName));
            assert.include(blogPost, "test");
            assert.include(blogPost, "7777777");
            assert.include(blogPost, "dedbeef");
        });
    });

    describe("generateFormatterExamples", () => {
        const mockFs = require("mock-fs");
        
        before(() => {
            mockFs({
                "eslint.github.io/_posts/": {},
                "eslint.github.io/docs/user-guide/formatters/": {},
                "eslint.github.io/docs/test_prerelease/user-guide/formatters/": {},
                "templates/": {
                    "formatter-examples.md.ejs": fs.readFileSync("./templates/formatter-examples.md.ejs")
                }
            });
        });

        after(() => {
            mockFs.restore();
        });

        const formatterResults = {
            html: {
                result: "result"
            }
        }

        // need to mock/use Makefile.getFormatterResults for the first parameters to test existence of other file
        // name is htmlFilename in the generateFormmatterExamples method
        it("generates a doc page without a prerelease", () => {
            Makefile.generateFormatterExamples({formatterResults: formatterResults}, "", "eslint.github.io/");

            const filename = fs.readFileSync("eslint.github.io/docs/user-guide/formatters/index.md", "utf8");

            assert.include(filename, "title: Documentation");
        });

        it("generates a doc page with a prerelease", () => {
            Makefile.generateFormatterExamples({formatterResults: formatterResults}, "test_prerelease", "eslint.github.io/");
            
            const filename = fs.readFileSync("eslint.github.io/docs/test_prerelease/user-guide/formatters/index.md", "utf8")
            
            assert.include(filename, "title: Documentation");
        });
    });

    describe("generateRuleIndexPage", () => {
        const mockFs = require("mock-fs");
        
        before(() => {
            mockFs({
                "estlint.github.io/_data/": {
                    "rules.yml": ""
                },
                "conf/": {
                    "category-list.json": require("../conf/category-list.json")
                },
                "lib/rules/": {
                    // 'accessor-pairs.js': require('../lib/rules/accessor-pairs.js'),
                    // 'arrow-parens.js': require('../lib/rules/arrow-parens')
                }
            });
        });
        
        after(() => {
            mockFs.restore();
        });

        it("generate a rules index page", () => {

            // Makefile.generateRuleIndexPage('./', 'eslint.github.io/');
            // const file = fs.readFileSync('estlint.github.io/_data/rules.yml', 'utf8');
            // // TODO
            assert.isTrue(true);
            
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
