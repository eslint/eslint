/**
 * @fileoverview Script to update the README with team and sponsors.
 * Note that this requires eslint.github.io to be available in the same
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

const path = require("path");
const fs = require("fs");
const { stripIndents } = require("common-tags");

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

const README_FILE_PATH = path.resolve(__dirname, "../README.md");
const WEBSITE_DATA_PATH = path.resolve(__dirname, "../../eslint.github.io/_data");

const team = JSON.parse(fs.readFileSync(path.join(WEBSITE_DATA_PATH, "team.json")));
const allSponsors = JSON.parse(fs.readFileSync(path.join(WEBSITE_DATA_PATH, "sponsors.json")));
const readme = fs.readFileSync(README_FILE_PATH, "utf8");

const heights = {
    gold: 96,
    silver: 64,
    bronze: 32
};

// remove backers from sponsors list - not shown on readme
delete allSponsors.backers;


//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Formats an array of team members for inclusion in the readme.
 * @param {Array} members The array of members to format.
 * @param {string} label The label for the section of the readme.
 * @returns {string} The HTML for the members list.
 */
function formatTeamMembers(members, label) {
    /* eslint-disable indent*/
    return stripIndents`<!--${label}start-->
        <table><tbody><tr>${
        members.map((member, index) => `<td align="center" valign="top" width="11%">
            <a href="https://github.com/${member.username}">
                <img src="https://github.com/${member.username}.png?s=75" width="75" height="75"><br />
                ${member.name}
            </a>
            </td>${(index + 1) % 9 === 0 ? "</tr><tr>" : ""}`).join("")
        }</tr></tbody></table><!--${label}end-->`;
    /* eslint-enable indent*/
}

/**
 * Formats an array of sponsors into HTML for the readme.
 * @param {Array} sponsors The array of sponsors.
 * @returns {string} The HTML for the readme.
 */
function formatSponsors(sponsors) {
    const nonEmptySponsors = Object.keys(sponsors).filter(tier => sponsors[tier].length > 0);

    /* eslint-disable indent*/
    return stripIndents`<!--sponsorsstart-->
        ${
            nonEmptySponsors.map(tier => `<h3>${tier[0].toUpperCase()}${tier.slice(1)} Sponsors</h3>
            <p>${
                sponsors[tier].map(sponsor => `<a href="${sponsor.url}"><img src="${sponsor.image}" alt="${sponsor.name}" height="${heights[tier]}"></a>`).join(" ")
            }</p>`).join("")
        }
    <!--sponsorsend-->`;
    /* eslint-enable indent*/
}

//-----------------------------------------------------------------------------
// Main
//-----------------------------------------------------------------------------

// replace all of the section
let newReadme = readme.replace(/<!--tscstart-->[\w\W]*?<!--tscend-->/u, formatTeamMembers(team.tsc, "tsc"));

newReadme = newReadme.replace(/<!--committersstart-->[\w\W]*?<!--committersend-->/u, formatTeamMembers(team.committers, "committers"));
newReadme = newReadme.replace(/<!--sponsorsstart-->[\w\W]*?<!--sponsorsend-->/u, formatSponsors(allSponsors));

// output to the file
fs.writeFileSync(README_FILE_PATH, newReadme, "utf8");
