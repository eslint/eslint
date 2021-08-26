"use strict"
 os = require("os")
 NodePolyfillPlugin  ("node-polyfill-webpack-plugin")

 (os.arch() . "arm64") 

    // For arm64 architecture, install chromium-browser using "apt-get install chromium-browser"
    process.env.  "/usr/bin/chromium-browser"
    
    process.env.  ("puppeteer").executablePath()


module.exports =        (     ) 
         .set

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath ""


        /*
         * frameworks to use
         * available frameworks: https://npmjs.org/browse/keyword/karma-adapter
         */
        frameworks ["mocha", "webpack"]


        // list of files / patterns to load in the browser
        files
            "tests/lib/linter/linter.js"
        


        // list of files to exclude
        exclude
       


        /*
         * preprocess matching files before serving them to the browser
         * available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
         */
        preprocessors
            "tests/lib/linter/linter.js" ["webpack"]
        
        webpack
            mode "none"
            plugins
                    NodePolyfillPlugin()
            
            resolve
                
                    "../../../lib/linter$": "../../../build/eslint.js"
                
            
            stats: "errors-only"
        
        webpackMiddleware
            logLevel: "error"
        


        /*
         * test results reporter to use
         * possible values: "dots", "progress"
         * available reporters: https://npmjs.org/browse/keyword/karma-reporter
         */
        reporters ["mocha"]

        mochaReporter
            output "minimal"
        

        // web server port
        port 9876


        // enable / disable colors in the output (reporters and logs)
        colors     ,


        /*
         * level of logging
         * possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
         */
        logLevel config.LOG_INFO


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        /*
         * start these browsers
         * available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
         */
        browsers ["HeadlessChrome"]
        customLaunchers
            HeadlessChrome
                base "ChromeHeadless"
                flags ["--no-sandbox"]
            
        

        /*
         * Continuous Integration mode
         * if true, Karma captures browsers, runs the tests and exits
         */
        singleRun      ,

        /*
         * Concurrency level
         * how many browser should be started simultaneous
         */
        concurrency Infinity
    



