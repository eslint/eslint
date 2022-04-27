module.exports = {
    /**
     * Returns some attributes based on whether the link is active or
     * a parent of an active item
     *
     * @param {String} itemUrl is the link in question
     * @param {String} pageUrl is the page context
     * @returns {String} is the attributes or empty
     */
    getLinkActiveState: function(itemUrl, pageUrl) {
        let response = '';

        if (itemUrl === pageUrl) {
            response = ' aria-current="page" ';
        }

        if (itemUrl.length > 1 && pageUrl.indexOf(itemUrl) === 0) {
            response += ' data-current="true" ';
        }

        return response;
    },
    excludeThis: function(arr, pageUrl) {
        var newArray = [];
        arr.forEach(item => {
            if(item.url !== pageUrl) newArray.push(item);
        });
        return newArray;
    }

};
