/**
 * @fileoverview Search functionality
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import algoliasearch from "./algoliasearch.js";

//-----------------------------------------------------------------------------
// Initialization
//-----------------------------------------------------------------------------

// search
const client = algoliasearch('L633P0C2IR', 'bb6bbd2940351f3afc18844a6b06a6e8');
const index = client.initIndex('eslint');

// page
const searchInputs = document.querySelectorAll('input.search__input');

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Executes a search against the Algolia index.
 * @param {string} query The search query to execute. 
 * @returns {Promise<Array<object>>} The search results.
 */
function fetchSearchResults(query) {
    return index.search(query, {
        facetFilters: ["tags:docs"]
    }).then(({ hits }) => hits);
}

/**
 * Removes any current search results from the display.
 * @param {Element} resultsElement The HTML element used to display search results.
 * @returns {void}
 */
function clearSearchResults(resultsElement) {
    while (resultsElement.firstChild) {
        resultsElement.removeChild(resultsElement.firstChild);
    }
}

/**
 * Displays the given search results in the page.
 * @param {Array<object>} results The search results to display.
 * @param {Element} resultsElement The HTML element used to display search results.
 * @returns {void}
 */
function displaySearchResults(results,resultsElement) {
    clearSearchResults(resultsElement);

    if (results.length) {

        const list = document.createElement("ul");
        resultsElement.append(list);
    
        for (const result of results) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <a href="${result.url}">${result.hierarchy.lvl0}</a><br>
                ${result._highlightResult.hierarchy.lvl0.value}
            `.trim();
            list.append(listItem);
        }
    } else {
        resultsElement.innerHTML = "No results found.";
    }

}

//-----------------------------------------------------------------------------
// Event Handlers
//-----------------------------------------------------------------------------




// listen for input changes
searchInputs.forEach((searchInput) => {
    const resultsElement = document.querySelector(`#${searchInput.id}-results`);
    searchInput.addEventListener('keyup', function (event) {
        const query = searchInput.value;
        if (query.length > 2) {
            fetchSearchResults(query)
                .then(function (results) { displaySearchResults(results, resultsElement) })
                .catch(function () {
                    clearSearchResults(resultsElement);
                });
        } else {
            clearSearchResults(resultsElement);
        }
    });
});

    // add an event listenrer for a click on the search link
    //   btnHandler('#search-link', function(){

    //     // get the data
    //     fetch('/search.json').then(function(response) {
    //       return response.json();
    //     }).then(function(response) {

    //       searchIndex = response.search;

    //     });

    //     searchUI.toggleAttribute('hidden');
    //     searchInput.focus();

    //     // listen for input changes
    //     searchInput.addEventListener('keyup', function(event) {
    //       const str = searchInput.value;
    //       if(str.length > 2) {
    //         find(str);
    //       } else {
    //         clearResults();
    //       }
    //     });

    //   });
