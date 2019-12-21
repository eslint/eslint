/**
 * @fileoverview Tests for IgnorePattern class.
 * @author Toru Nagashima <https://github.com/mysticatea>
 */
"use strict";

const assert = require("assert");
const path = require("path");
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
            const cwd = process.cwd();
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
        });
    });
});
