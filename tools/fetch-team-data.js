/**
 * @fileoverview Script to fetch team data from GitHub. Call using:
 *     node fetch-team-data.js ../eslint.github.io/_data/team.json
 * @author Nicholas C. Zakas
 */

/* eslint camelcase: [error, { properties: never }] */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const fs = require("fs");
const octokit = require("@octokit/rest")();

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

// filename to to output to is passed on the command line
const [,, filename = "./team.json"] = process.argv;

// retrieve token from environment
const { ESLINT_GITHUB_TOKEN } = process.env;

// exit early if no token is available
if (!ESLINT_GITHUB_TOKEN) {
    throw new Error("Missing ESLINT_GITHUB_TOKEN.");
}

// Github IDs for teams
const ALUMNI_TEAM_ID = "3005888";
const TSC_TEAM_ID = "2060414";
const COMMITTERS_TEAM_ID = "1054435";

// lookup table mapping Github team IDs to JSON keys
const teamIds = {
    [TSC_TEAM_ID]: "tsc",
    [COMMITTERS_TEAM_ID]: "committers",
    [ALUMNI_TEAM_ID]: "alumni"
};

// final data structure
const team = {
    tsc: [],
    alumni: [],
    committers: []
};

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

(async() => {

    octokit.authenticate({
        type: "oauth",
        token: ESLINT_GITHUB_TOKEN
    });

    for (const teamId of [TSC_TEAM_ID, ALUMNI_TEAM_ID, COMMITTERS_TEAM_ID]) {
        const { data: result } = await octokit.teams.listMembers({
            team_id: teamId,
            per_page: 100
        });

        // this user only has login, need to fetch the full profile for useful data
        for (const user of result) {
            const { data: profile } = await octokit.users.getByUsername({ username: user.login });

            team[teamIds[teamId]].push({
                username: user.login,
                name: profile.name,
                website: profile.blog,
                avatar_url: profile.avatar_url
            });
        }

    }

    // filter out TSC members from committers list
    team.committers = team.committers.filter(user => !team.tsc.find(tscmember => tscmember.username === user.username));

    fs.writeFileSync(filename, JSON.stringify(team, null, "    "), { encoding: "utf8" });
})();
