"use strict";

module.exports = {

    /**
     * Returns some attributes based on whether the link is active or
     * a parent of an active item
     * @param {string} itemUrl is the link in question
     * @param {string} pageUrl is the page context
     * @returns {string} is the attributes or empty
     */
    getLinkActiveState(itemUrl, pageUrl) {
        let response = "";

        if (itemUrl === pageUrl) {
            response = ' aria-current="page" ';
        }

        if (itemUrl.length > 1 && pageUrl.indexOf(itemUrl) === 0) {
            response += ' data-current="true" ';
        }

        return response;
    },
    excludeThis(arr, pageUrl) {
        const newArray = [];

        arr.forEach(item => {
            if (item.url !== pageUrl) {
                newArray.push(item);
            }
        });
        return newArray;
    }

};
