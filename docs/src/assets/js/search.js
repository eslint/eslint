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
const resultsElement = document.querySelector('#search-results');
const resultsLiveRegion = document.querySelector('#search-results-announcement');
const searchInput = document.querySelector('#search');
const searchClearBtn = document.querySelector('#search__clear-btn');

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
        // facetFilters: ["tags:docs"]
    }).then(({ hits }) => hits);
}

/**
 * Removes any current search results from the display.
 * @returns {void}
 */
function clearSearchResults() {
    while (resultsElement.firstChild) {
        resultsElement.removeChild(resultsElement.firstChild);
    }
    resultsElement.innerHTML = "";
    searchClearBtn.setAttribute('hidden', '');
}

/**
 * Displays the given search results in the page.
 * @param {Array<object>} results The search results to display.
 * @returns {void}
 */
function displaySearchResults(results) {

    clearSearchResults();

    if (results.length) {

        const list = document.createElement("ul");
        list.setAttribute('role', 'list');
        list.classList.add('search-results__list');
        resultsElement.append(list);
        resultsElement.setAttribute('data-results', 'true');

        for (const result of results) {
            const listItem = document.createElement('li');
            listItem.classList.add('search-results__item');
            listItem.innerHTML = `
                <h2 class="search-results__item__title"><a href="${result.url}">${result.hierarchy.lvl0}</a></h2>
                <p class="search-results__item__context">${result._highlightResult.hierarchy.lvl0.value}</p>
            `.trim();
            list.append(listItem);
        }
        searchClearBtn.removeAttribute('hidden');

    } else {
        resultsLiveRegion.innerHTML = "No results found.";
        resultsElement.innerHTML = "No results found.";
        resultsElement.setAttribute('data-results', 'false');
        searchClearBtn.setAttribute('hidden', '');
    }

}

//-----------------------------------------------------------------------------
// Event Handlers
//-----------------------------------------------------------------------------

// listen for input changes
if(searchInput)
    searchInput.addEventListener('keyup', function (e) {
        const query = searchInput.value;

        if(query.length) searchClearBtn.removeAttribute('hidden');
        else searchClearBtn.setAttribute('hidden', '');

        if (query.length > 2) {
            fetchSearchResults(query)
                .then(displaySearchResults)
                .catch(clearSearchResults);

            document.addEventListener('click', function(e) {
                if(e.target !== resultsElement) clearSearchResults();
            });
        } else {
            clearSearchResults();
        }
    });

if(resultsElement)
    resultsElement.addEventListener('keydown', function(e) {
        if(e.key === "Escape") {
            clearSearchResults();
        }
    }, true);

if(searchClearBtn)
    searchClearBtn.addEventListener('click', function(e) {
        searchInput.value = '';
        searchInput.focus();
        clearSearchResults();
    });
