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
let activeIndex = -1;
let searchQuery;

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
 * @returns {void}
 */
function clearSearchResults() {
    while (resultsElement.firstChild) {
        resultsElement.removeChild(resultsElement.firstChild);
    }
    resultsElement.innerHTML = "";
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
        activeIndex = -1;

        for (const result of results) {
            const listItem = document.createElement('li');
            listItem.classList.add('search-results__item');
            const maxLvl = Math.max(...Object.keys(result._highlightResult.hierarchy).map(k => Number(k.substring(3))));
            listItem.innerHTML = `
                <h2 class="search-results__item__title"><a href="${result.url}">${result.hierarchy.lvl0}</a></h2>
                <p class="search-results__item__context">${typeof result._highlightResult.content !== 'undefined' ? result._highlightResult.content.value : result._highlightResult.hierarchy[`lvl${maxLvl}`].value}</p>
            `.trim();
            list.append(listItem);
        }

    } else {
        resultsLiveRegion.innerHTML = "No results found.";
        resultsElement.innerHTML = "No results found.";
        resultsElement.setAttribute('data-results', 'false');
    }

}


// Check if an element is currently scrollable
function isScrollable(element) {
    return element && element.clientHeight < element.scrollHeight;
}

// Ensure given child element is within the parent's visible scroll area
function maintainScrollVisibility(activeElement, scrollParent) {
    const { offsetHeight, offsetTop } = activeElement;
    const { offsetHeight: parentOffsetHeight, scrollTop } = scrollParent;

    const isAbove = offsetTop < scrollTop;
    const isBelow = (offsetTop + offsetHeight) > (scrollTop + parentOffsetHeight);

    if (isAbove) {
        scrollParent.scrollTo(0, offsetTop);
    }
    else if (isBelow) {
        scrollParent.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight);
    }

}

/**
 * Debounces the provided callback with a given delay.
 * @param {Function} callback The callback that needs to be debounced.
 * @param {Number} delay Time in ms that the timer should wait before the callback is executed.
 * @returns {Function} Returns the new debounced function.
 */
function debounce(callback, delay) {
    let timer;
    return (...args) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => callback.apply(this, args), delay);
    }
}

const debouncedFetchSearchResults = debounce((query) => {
    fetchSearchResults(query)
        .then(displaySearchResults)
        .catch(clearSearchResults);
}, 300);

//-----------------------------------------------------------------------------
// Event Handlers
//-----------------------------------------------------------------------------

// listen for input changes
if (searchInput)
    searchInput.addEventListener('keyup', function (e) {
        const query = searchInput.value;

        if (query === searchQuery) return;

        if (query.length) searchClearBtn.removeAttribute('hidden');
        else searchClearBtn.setAttribute('hidden', '');

        if (query.length > 2) {

            debouncedFetchSearchResults(query);

            document.addEventListener('click', function (e) {
                if (e.target !== resultsElement) clearSearchResults();
            });
        } else {
            clearSearchResults();
        }

        searchQuery = query

    });


if (searchClearBtn)
    searchClearBtn.addEventListener('click', function (e) {
        searchInput.value = '';
        searchInput.focus();
        clearSearchResults();
        searchClearBtn.setAttribute('hidden', '');
    });

document.addEventListener('keydown', function (e) {

    const searchResults = Array.from(document.querySelectorAll('.search-results__item'));

    if (e.key === 'Escape') {
        e.preventDefault();
        if (searchResults.length) {
            clearSearchResults();
            searchInput.focus();
        }
    }

    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
        document.querySelector('.search').scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (!searchResults.length) return;

    switch (e.key) {
        case "ArrowUp":
            e.preventDefault();
            activeIndex = activeIndex - 1 < 0 ? searchResults.length - 1 : activeIndex - 1;
            break;
        case "ArrowDown":
            e.preventDefault();
            activeIndex = activeIndex + 1 < searchResults.length ? activeIndex + 1 : 0;
            break;
    }

    if (activeIndex === -1) return;
    const activeSearchResult = searchResults[activeIndex];
    activeSearchResult.querySelector('a').focus();
    if (isScrollable(resultsElement)) {
        maintainScrollVisibility(activeSearchResult, resultsElement);
    }
});
