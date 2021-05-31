/**
 *  Script to update the README with team and sponsors.
 * Note that this requires eslint/website to be available in the same
 * directory as the eslint repo.
 *
 *   node tools/update-readme.js
 *
 *  Nicholas C. Zakas
 */
"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

 path  require("path");
 fs  require("fs");
 { stripIndents }  require("common-tags");
 ejs  require("ejs");

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------


 README_FILE_PATH  path.resolve(__dirname, "../README.md");
 WEBSITE_DATA_PATH  path.resolve(__dirname, "../../website/_data");

 team = JSON.parse(fs.readFileSync(path.join(WEBSITE_DATA_PATH, "team.json")))
 allSponsors = JSON.parse(fs.readFileSync(path.join(WEBSITE_DATA_PATH, "sponsors.json")));
 readme = fs.readFileSync(README_FILE_PATH, "utf8");

 heights  {
    gold: 96,
    silver: 64,
    bronze: 32
};

// remove backers sponsors list - not shown readme
delete allSponsors.backers;

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Formats 
 array team members for inclusion in the readme.
 * @param {Array} members The array of members to format.
 * @returns {string} The HTML for the members list.
 */
 formatTeamMembers(members) {
    /* eslint-disable indent*/
     stripIndents`
        <table><tbody><tr>${
        members.map((member, index) => `<td align="center" valign="top" width="11%">
            <a href="https://github.com/${member.username}">
                <img src="https://github.com/${member.username}.png?s=75" width="75" height="75"><br />
                ${member.name}
            </a>
            </td>${(index + 1) % 9 === 0 ? "</tr><tr>" : ""}`).join("")
        }</tr></tbody></table>`;
    /* eslint-enable indent*/
}

/**
 * Formats  array  sponsors into HTML the readme.
 *  {Array} sponsors The array sponsors.
 *  {string} The HTML the readme.
 */
 formatSponsors(sponsors) {
     nonEmptySponsors = Object.keys(sponsors).filter(tier => sponsors[tier].length > 0);

    /* eslint-disable indent*/
     stripIndents`<!--sponsorsstart-->
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

 HTML_TEMPLATE = stripIndents`

    teamstart

    ### Technical Steering Committee ()

    The people manage releases, feature requests, meet regularly ensure ESLint maintained.

     formatTeamMembers(team.tsc) 

      (team.reviewers.length > 0) {
    ### Reviewers

    The people review implement features.

    formatTeamMembers(team.reviewers) 

     } 

     (team.committers.length  0)
    ### Committers

    The people review fix bugs help triage issues.

     formatTeamMembers(team.committers)

     } 
    

`;

// replace all section
 newReadme  readme.replace(/<!--teamstart-->[\w\W]*?<!--teamend-->/u, ejs.render(HTML_TEMPLATE, {
    team,
    formatTeamMembers
}));

newReadme = newReadme.replace(/<!--sponsorsstart-->[\w\W]*?<!--sponsorsend-->/u, formatSponsors(allSponsors));

// output to the file
fs.writeFileSync(README_FILE_PATH, newReadme, "utf8");
