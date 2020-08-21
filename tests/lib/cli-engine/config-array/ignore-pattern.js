/*
 * STOP!!! DO NOT MODIFY.
 *
 * This file is part of the ongoing work to move the eslintrc-style config
 * system into the @eslint/eslintrc package. This file needs to remain
 * unchanged in order for this work to proceed.
 *
 * If you think you need to change this file, please contact @nzakas first.
 *
 * Thanks in advance for your cooperation.
 */

/**
 * @fileoverview Tests for IgnorePattern class.
 * @author Toru Nagashima <https://github.com/mysticatea>
 */
"use strict";

const assert = require("assert");
const path = require("path");
const sinon = require("sinon");
const { IgnorePattern } = require("../../../../lib/cli-engine/config-array/ignore-pattern");

describe("IgnorePattern", () => {
    describe("constructor(patterns, basePath)", () => {
        it("should bind the first argument to 'patterns' property.", () => {
            const p = new IgnorePattern(["a.js"], process.cwd());

            assert.deepStrictEqual(p.patterns, ["a.js"]);
        });

        it("should bind the second argument to 'basePath' property.", () => {
            const p = new IgnorePattern(["a.js"], process.cwd());

            assert.strictEqual(p.basePath, process.cwd());
        });

        it("should throw an error if the second argument was not an absolute path.", () => {
            assert.throws(() => new IgnorePattern([], "a.js"), "");
        });
    });

    describe("getPatternsRelativeTo(newBasePath)", () => {
        it("should return 'patterns' as-is if the argument is the same as 'basePath'.", () => {
            const basePath1 = path.join(process.cwd(), "foo/bar");
            const p = new IgnorePattern(["a.js", "/b.js", "!c.js", "!/d.js"], basePath1);

            assert.deepStrictEqual(
                p.getPatternsRelativeTo(basePath1),
                ["a.js", "/b.js", "!c.js", "!/d.js"]
            );
        });

        it("should return modified 'patterns' if the argument is different from 'basePath'.", () => {
            const basePath1 = path.join(process.cwd(), "foo/bar");
            const basePath2 = process.cwd();
            const p = new IgnorePattern(["a.js", "/b.js", "!c.js", "!/d.js"], basePath1);

            assert.deepStrictEqual(
                p.getPatternsRelativeTo(basePath2),
                ["/foo/bar/**/a.js", "/foo/bar/b.js", "!/foo/bar/**/c.js", "!/foo/bar/d.js"]
            );
        });
    });

    describe("static createIgnore(ignorePatterns)", () => {
        describe("with two patterns should return a function, and the function", () => {

            /**
             * performs static createIgnre assertions against the cwd.
             * @param {string} cwd cwd to be the base path for assertions
             * @returns {void}
             */
            function assertions(cwd) {
                const basePath1 = path.join(cwd, "foo/bar");
                const basePath2 = path.join(cwd, "abc/");
                const ignores = IgnorePattern.createIgnore([
                    new IgnorePattern(["*.js", "/*.ts", "!a.*", "!/b.*"], basePath1),
                    new IgnorePattern(["*.js", "/*.ts", "!a.*", "!/b.*"], basePath2)
                ]);
                const patterns = [
                    ["a.js", false],
                    ["a.ts", false],
                    ["b.js", false],
                    ["b.ts", false],
                    ["c.js", false],
                    ["c.ts", false],
                    ["dir/a.js", false],
                    ["dir/a.ts", false],
                    ["dir/b.js", false],
                    ["dir/b.ts", false],
                    ["dir/c.js", false],
                    ["dir/c.ts", false],
                    ["foo/bar/a.js", false],
                    ["foo/bar/a.ts", false],
                    ["foo/bar/b.js", false],
                    ["foo/bar/b.ts", false],
                    ["foo/bar/c.js", true],
                    ["foo/bar/c.ts", true],
                    ["foo/bar/dir/a.js", false],
                    ["foo/bar/dir/a.ts", false],
                    ["foo/bar/dir/b.js", true],
                    ["foo/bar/dir/b.ts", false],
                    ["foo/bar/dir/c.js", true],
                    ["foo/bar/dir/c.ts", false],
                    ["abc/a.js", false],
                    ["abc/a.ts", false],
                    ["abc/b.js", false],
                    ["abc/b.ts", false],
                    ["abc/c.js", true],
                    ["abc/c.ts", true],
                    ["abc/dir/a.js", false],
                    ["abc/dir/a.ts", false],
                    ["abc/dir/b.js", true],
                    ["abc/dir/b.ts", false],
                    ["abc/dir/c.js", true],
                    ["abc/dir/c.ts", false]
                ];

                for (const [filename, expected] of patterns) {
                    it(`should return ${expected} if '${filename}' was given.`, () => {
                        assert.strictEqual(ignores(path.join(cwd, filename)), expected);
                    });
                }

                it("should return false if '.dot.js' and false was given.", () => {
                    assert.strictEqual(ignores(path.join(cwd, ".dot.js"), false), true);
                });

                it("should return true if '.dot.js' and true were given.", () => {
                    assert.strictEqual(ignores(path.join(cwd, ".dot.js"), true), false);
                });

                it("should return false if '.dot/foo.js' and false was given.", () => {
                    assert.strictEqual(ignores(path.join(cwd, ".dot/foo.js"), false), true);
                });

                it("should return true if '.dot/foo.js' and true were given.", () => {
                    assert.strictEqual(ignores(path.join(cwd, ".dot/foo.js"), true), false);
                });
            }

            assertions(process.cwd());

            /*
             * This will catch regressions of Windows specific issue #12850 when run on CI nodes.
             * This runs the full set of assertions for the function returned from IgnorePattern.createIgnore.
             * When run on Windows CI nodes the .root drive i.e C:\ will be supplied
             *  forcing getCommonAncestors to resolve to the root of the drive thus catching any regrssion of 12850.
             * When run on *nix CI nodes provides additional coverage on this OS too.
             *  assertions when run on Windows CI nodes and / on *nix OS
             */
            assertions(path.parse(process.cwd()).root);
        });
    });

    describe("static createIgnore(ignorePatterns)", () => {

        /*
         * This test will catch regressions of Windows specific issue #12850 when run on your local dev box
         * irrespective of if you are running a Windows or *nix style OS.
         * When running on *nix sinon is used to emulate Windows behaviors of path and platform APIs
         * thus ensuring that the Windows specific fix is exercised and any regression is caught.
         */
        it("with common ancestor of drive root on windows should not throw", () => {
            try {

                /*
                 * When not on Windows return win32 values so local runs on *nix hit the same code path as on Windows
                 * thus enabling developers with *nix style OS to catch and debug any future regression of #12850 without
                 * requiring a Windows based OS.
                 */
                if (process.platform !== "win32") {
                    sinon.stub(process, "platform").value("win32");
                    sinon.stub(path, "sep").value(path.win32.sep);
                    sinon.replace(path, "isAbsolute", path.win32.isAbsolute);
                }

                const ignores = IgnorePattern.createIgnore([
                    new IgnorePattern(["*.js"], "C:\\foo\\bar"),
                    new IgnorePattern(["*.js"], "C:\\abc\\")
                ]);

                // calls to this should not throw when getCommonAncestor returns root of drive
                ignores("C:\\abc\\contract.d.ts");
            } finally {
                sinon.restore();
            }
        });
    });
});
