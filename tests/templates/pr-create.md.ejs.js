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

describe("pr-create.md.ejs", function() {

    it("should say LGTM when there are no problems with the pull request", function() {
        const result = ejs.render(TEMPLATE_TEXT, {
            payload: {
                sender: {
                    login: "nzakas"
                },
                commits: 1
            },
            meta: {}
        });

        assert.equal(result.trim(), "LGTM");
    });

    it("should mention commit message format when there's one commit and an invalid commit message is found", function() {
        const result = ejs.render(TEMPLATE_TEXT, {
            payload: {
                sender: {
                    login: "nzakas"
                },
                commits: 1
            },
            meta: {
                cla: true,
                commits: [
                    {
                        commit: {
                            message: "Foo bar"
                        }
                    }
                ]
            }
        });

        assert.ok(result.indexOf("begin with a tag") > -1);
        assert.ok(result.indexOf("require an issue") > -1);
    });

    it("should mention commit message length when there's a message longer than 72 characters", function() {
        const result = ejs.render(TEMPLATE_TEXT, {
            payload: {
                sender: {
                    login: "nzakas"
                },
                commits: 1
            },
            meta: {
                cla: true,
                commits: [
                    {
                        commit: {
                            message: "Fix:56789012345678901234567890123456789012345678901234567890(fixes #9012)"
                        }
                    }
                ]
            }
        });

        assert.ok(result.indexOf("72 characters") > -1);
        assert.ok(result.indexOf("require an issue") === -1);
    });

    it("should not mention commit message length when there's a multi-line message with first line not over 72 characters", function() {
        const result = ejs.render(TEMPLATE_TEXT, {
            payload: {
                sender: {
                    login: "nzakas"
                },
                commits: 1
            },
            meta: {
                cla: true,
                commits: [
                    {
                        commit: {
                            message: "Fix:56789012345678901234567890123456789012345678901234567890(fixes #901)\r\n1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"
                        }
                    }
                ]
            }
        });

        assert.equal(result.trim(), "LGTM");
        assert.ok(result.indexOf("require an issue") === -1);
    });

    it("should not mention missing issue when there's one documentation commit", function() {
        const result = ejs.render(TEMPLATE_TEXT, {
            payload: {
                sender: {
                    login: "nzakas"
                },
                commits: 1
            },
            meta: {
                cla: true,
                commits: [
                    {
                        commit: {
                            message: "Docs: Foo bar"
                        }
                    }
                ]
            }
        });

        assert.equal(result.trim(), "LGTM");
        assert.ok(result.indexOf("require an issue") === -1);
    });

    ["Breaking", "Build", "Chore", "Docs", "Fix", "New", "Update", "Upgrade"].forEach(function(type) {
        it("should not mention missing issue or length check when there's one " + type + " commit", function() {
            const result = ejs.render(TEMPLATE_TEXT, {
                payload: {
                    sender: {
                        login: "nzakas"
                    },
                    commits: 1
                },
                meta: {
                    cla: true,
                    commits: [
                        {
                            commit: {
                                message: type + ": Foo bar (fixes #1234)\nSome really long string. abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz"
                            }
                        }
                    ]
                }
            });

            assert.equal(result.trim(), "LGTM");
            assert.ok(result.indexOf("require an issue") === -1);
        });
    });

    it("should mention missing issue when there's a missing closing paren", function() {
        const result = ejs.render(TEMPLATE_TEXT, {
            payload: {
                sender: {
                    login: "nzakas"
                },
                commits: 1
            },
            meta: {
                cla: true,
                commits: [
                    {
                        commit: {
                            message: "Fix: Foo bar (fixes #1234"
                        }
                    }
                ]
            }
        });

        assert.ok(result.indexOf("require an issue") > -1);
    });

});
