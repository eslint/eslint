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
const poweredByLink = document.querySelector('.search_powered-by-wrapper');
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
 * Clears the search results from the display.
 * If the removeEventListener flag is true, removes the click event listener from the document.
 * @param {boolean} [removeEventListener=false] - Optional flag to indicate if the click event listener should be removed. Default is false.
 * @returns {void} - This function doesn't return anything.
 */
function clearSearchResults(removeEventListener = false) {
    resultsElement.innerHTML = "";
    if (removeEventListener && document.clickEventAdded) {
        document.removeEventListener('click', handleDocumentClick);
        document.clickEventAdded = false;
    }
}

/**
 * Displays a "No results found" message in both the live region and results display area.
 * This is typically used when no matching results are found in the search.
 * @returns {void} - This function doesn't return anything.
 */
function showNoResults() {
    resultsLiveRegion.innerHTML = "No results found.";
    resultsElement.innerHTML = "No results found.";
    resultsElement.setAttribute('data-results', 'false');
}

/**
 * Clears any "No results found" message from the live region and results display area.
 * @returns {void} - This function doesn't return anything.
 */
function clearNoResults() {
    resultsLiveRegion.innerHTML = "";
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
        showNoResults();
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

/**
 * Debounced function to fetch search results after 300ms of inactivity.
 * Calls `fetchSearchResults` to retrieve data and `displaySearchResults` to show them.
 * If an error occurs, clears the search results.
 * @param {string} query - The search query.
 * @returns {void} - No return value.
 * @see debounce - Limits the number of requests during rapid typing.
 */
const debouncedFetchSearchResults = debounce((query) => {
    fetchSearchResults(query)
        .then(displaySearchResults)
        .catch(() => { clearSearchResults(true) });
}, 300);


/**
 * Handles the document click event to clear search results if the user clicks outside of the search input or results element.
 * @param {MouseEvent} e - The event object representing the click event.
 * @returns {void} - This function does not return any value. It directly interacts with the UI by clearing search results.
 */
const handleDocumentClick = (e) => {
    if (e.target !== resultsElement && e.target !== searchInput) {
        clearSearchResults(true);
    }
}


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
            if (!document.clickEventAdded) {
                document.addEventListener('click', handleDocumentClick);
                document.clickEventAdded = true;
            }
        } else {
            clearSearchResults(true);
        }

        searchQuery = query

    });


if (searchClearBtn)
    searchClearBtn.addEventListener('click', function (e) {
        searchInput.value = '';
        searchInput.focus();
        clearSearchResults(true);
        searchClearBtn.setAttribute('hidden', '');
    });

if (poweredByLink) {
    poweredByLink.addEventListener('focus', function () {
       clearSearchResults();
    });
}

document.addEventListener('keydown', function (e) {

    const searchResults = Array.from(document.querySelectorAll('.search-results__item'));

    if (e.key === "Escape") {
        e.preventDefault();
        if (searchResults.length) {
            clearSearchResults(true);
            searchInput.focus();
        } else if (
            document.activeElement === searchInput
        ) {
            clearNoResults();
            searchInput.blur();
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
