let errorConfig = ["error", {}];
module.exports = {
    rules: {
        camelcase: errorConfig,
        "default-case": errorConfig ,
        "camelcase" : [
            'error',
            {
                "ignoreDestructuring": new Date().getUTCFullYear // returns a function
            }
        ]
    }
};
