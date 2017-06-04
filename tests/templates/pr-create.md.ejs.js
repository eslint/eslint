/**
 * @fileoverview Tests for pr-create.md.ejs
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    fs = require("fs"),
    path = require("path"),
    ejs = require("ejs");

//------------------------------------------------------------------------------
// Data
//------------------------------------------------------------------------------

const TEMPLATE_TEXT = fs.readFileSync(path.resolve(__dirname, "../../templates/pr-create.md.ejs"), "utf8");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("pr-create.md.ejs", () => {

    it("should say LGTM when there are no problems with the pull request", () => {
        const result = ejs.render(TEMPLATE_TEXT, {
            payload: {
                action: "opened",
                sender: {
                    login: "nzakas"
                },
                pull_request: {
                    title: "Fix: foo (fixes #9012)"
                }
            }
        });

        assert.equal(result.trim(), "LGTM");
    });

    it("should say LGTM when the pull request title has been edited", () => {
        const result = ejs.render(TEMPLATE_TEXT, {
            payload: {
                action: "edited",
                sender: {
                    login: "nzakas"
                },
                pull_request: {
                    title: "Fix: foo (fixes #9012)"
                },
                changes: {
                    title: {
                        from: "Fix foo"
                    }
                }
            }
        });

        assert.equal(result.trim(), "LGTM");
    });

    it("should not leave a response when the pull request title stays the same", () => {
        const result = ejs.render(TEMPLATE_TEXT, {
            payload: {
                action: "edited",
                sender: {
                    login: "nzakas"
                },
                pull_request: {
                    title: "Fix: foo (fixes #9012)"
                },
                changes: {
                    title: {
                        from: "Fix: foo (fixes #9012)"
                    }
                }
            }
        });

        assert.strictEqual(result.trim(), "");
    });

    it("should not leave a response when new commits are pushed to the pull request", () => {
        const result = ejs.render(TEMPLATE_TEXT, {
            payload: {
                action: "synchronized",
                sender: {
                    login: "nzakas"
                },
                pull_request: {
                    title: "Fix: foo (fixes #9012)"
                }
            }
        });

        assert.strictEqual(result.trim(), "");
    });

    it("should mention commit message format when there's one commit and an invalid commit message is found", () => {
        const result = ejs.render(TEMPLATE_TEXT, {
            payload: {
                action: "opened",
                sender: {
                    login: "nzakas"
                },
                pull_request: {
                    title: "Foo bar"
                }
            }
        });

        assert.ok(result.indexOf("begin with a tag") > -1);
    });

    it("should mention commit message length when the title is longer than 72 characters", () => {
        const result = ejs.render(TEMPLATE_TEXT, {
            payload: {
                action: "opened",
                sender: {
                    login: "nzakas"
                },
                pull_request: {
                    title: "Fix:56789012345678901234567890123456789012345678901234567890(fixes #9012)"
                }
            }
        });

        assert.ok(result.indexOf("72 characters") > -1);
    });

    ["Breaking", "Build", "Chore", "Docs", "Fix", "New", "Update", "Upgrade"].forEach(type => {
        it(`should not mention missing issue or length check when the PR title has ${type}`, () => {
            const result = ejs.render(TEMPLATE_TEXT, {
                payload: {
                    action: "opened",
                    sender: {
                        login: "nzakas"
                    },
                    pull_request: {
                        title: `${type}: foo bar`
                    }
                }
            });

            assert.equal(result.trim(), "LGTM");
        });
    });

});
