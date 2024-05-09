/**
 * @fileoverview Script to update the README with team and sponsors.
 * Note that this requires eslint/website to be available in the same
 * directory as the eslint repo.
 *
 *   node tools/update-readme.js
 *
 * @author Nicholas C. Zakas
 */
"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const fs = require("node:fs");
const { stripIndents } = require("common-tags");
const ejs = require("ejs");
const got = require("got");

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

const SPONSORS_URL = "https://raw.githubusercontent.com/eslint/eslint.org/main/src/_data/sponsors.json";
const TEAM_URL = "https://raw.githubusercontent.com/eslint/eslint.org/main/src/_data/team.json";
const README_FILE_PATH = "./README.md";

const readme = fs.readFileSync(README_FILE_PATH, "utf8");

const heights = {
    gold: 96,
    silver: 64,
    bronze: 32
};

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Fetches the latest sponsors data from the website.
 * @returns {Object} The sponsors data object.
 */
async function fetchSponsorsData() {
    const data = await got(SPONSORS_URL).json();

    // remove backers from sponsors list - not shown on readme
    delete data.backers;

    return data;
}

/**
 * Fetches the latest team data from the website.
 * @returns {Object} The sponsors data object.
 */
async function fetchTeamData() {
    return got(TEAM_URL).json();
}

/**
 * Formats an array of team members for inclusion in the readme.
 * @param {Array} members The array of members to format.
 * @returns {string} The HTML for the members list.
 */
function formatTeamMembers(members) {
    /* eslint-disable indent -- Allow deeper template substitution indent */
    return stripIndents`
        <table><tbody><tr>${
        members.map((member, index) => `<td align="center" valign="top" width="11%">
            <a href="https://github.com/${member.username}">
                <img src="https://github.com/${member.username}.png?s=75" width="75" height="75" alt="${member.name.trim()}'s Avatar"><br />
                ${member.name.trim()}
            </a>
            </td>${(index + 1) % 9 === 0 ? "</tr><tr>" : ""}`).join("")
        }</tr></tbody></table>`;
    /* eslint-enable indent -- Allow deeper template substitution indent */
}

/**
 * Formats an array of sponsors into HTML for the readme.
 * @param {Array} sponsors The array of sponsors.
 * @returns {string} The HTML for the readme.
 */
function formatSponsors(sponsors) {
    const nonEmptySponsors = Object.keys(sponsors).filter(tier => sponsors[tier].length > 0);

    /* eslint-disable indent -- Allow deeper template substitution indent */
    return stripIndents`<!--sponsorsstart-->
        ${
            nonEmptySponsors.map(tier => `<h3>${tier[0].toUpperCase()}${tier.slice(1)} Sponsors</h3>
            <p>${
                sponsors[tier].map(sponsor => `<a href="${sponsor.url || "#"}"><img src="${sponsor.image}" alt="${sponsor.name}" height="${heights[tier]}"></a>`).join(" ")
            }</p>`).join("")
        }
    <!--sponsorsend-->`;
    /* eslint-enable indent -- Allow deeper template substitution indent */
}

//-----------------------------------------------------------------------------
// Main
//-----------------------------------------------------------------------------

const HTML_TEMPLATE = stripIndents`

    <!--teamstart-->

    ### Technical Steering Committee (TSC)

    The people who manage releases, review feature requests, and meet regularly to ensure ESLint is properly maintained.

    <%- formatTeamMembers(team.tsc) %>

    <% if (team.reviewers.length > 0) { %>
    ### Reviewers

    The people who review and implement new features.

    <%- formatTeamMembers(team.reviewers) %>

    <% } %>

    <% if (team.committers.length > 0) { %>
    ### Committers

    The people who review and fix bugs and help triage issues.

    <%- formatTeamMembers(team.committers) %>

    <% } %>

    <% if (team.website.length > 0) { %>
    ### Website Team

    Team members who focus specifically on eslint.org

    <%- formatTeamMembers(team.website) %>

    <% } %>
    <!--teamend-->
`;

(async () => {

    const [allSponsors, team] = await Promise.all([
        fetchSponsorsData(),
        fetchTeamData()
    ]);

    // replace all of the section
    let newReadme = readme.replace(/<!--teamstart-->[\w\W]*?<!--teamend-->/u, ejs.render(HTML_TEMPLATE, {
        team,
        formatTeamMembers
    }));

    newReadme = newReadme.replace(/<!--sponsorsstart-->[\w\W]*?<!--sponsorsend-->/u, formatSponsors(allSponsors));

    // replace multiple consecutive blank lines with just one blank line
    newReadme = newReadme.replace(/(?<=^|\n)\n{2,}/gu, "\n");

    // output to the file
    fs.writeFileSync(README_FILE_PATH, newReadme, "utf8");

})();
