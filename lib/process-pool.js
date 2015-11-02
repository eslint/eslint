"use strict";

var cp = require("child_process"),
    debug = require("debug"),
    os = require("os");

var numCPUs = os.cpus().length;

debug = debug("eslint:process-pool");

/**
 * Class for creating and managing node processes for parallel operations
 * @constructor
 * @param {string} module Name and path of the module that will be launched in parallel.
 * @param {Function} callback Function to call when all processes are done.
 */
function ProcessPool(module, callback) {
    this.pendingTasks = [];
    this.processes = {};
    this.usedProcesses = 0;
    this.doneCallback = callback;

    for (var i = 0; i < numCPUs; i++) {
        this.initializePool();
    }
}

ProcessPool.prototype = {
    /**
     * Create a new process and wire up event handlers for it
     * @returns {void}
     */
    initializePool: function() {
        var process = cp.fork(module);
        this.processes[process.pid] = { inUse: false, process: process };
        debug("Initializing a new process with id " + process.pid);
        process.on("message", function(message) {
            if (message === "done") {
                debug("Process " + process.pid + " reports that it's done");
                this.processes[process.pid].inUse = false;
                this.processes[process.pid].callback = null;
                this.usedProcess--;
                if (this.pendingTasks.length > 0) {
                    var task = this.pedingTasks.shift();
                    this.addTask(task.message, task.callback);
                } else {
                    if (this.usedProcess === 0) {
                        this.done();
                    }
                }
            } else {
                this.sendMessage(this.processes[process.pid], message);
            }
        }.bind(this));
    },

    /**
     * Report that all processes in the pool are done.
     * @returns {void}
     */
    done: function() {
        debug("Process pool finished working on all processes");
        this.doneCallback();
    },

    /**
     * Add new task, if no processes are available queue it up for later, otherwise run the task imediatly
     * @param {string} message Message to send to the process
     * @param {Function} callback Function to call when task is finished
     * @returns {void}
     */
    addTask: function(message, callback) {
        var keys = Object.keys(this.processes);
        var foundAvailable = false;
        for (var i = 0, l = keys.length; i < l; i++) {
            var key = keys[i];
            if (!this.processes[key].inUse) {
                this.processes[key].callback = callback;
                debug("Adding new task to process " + this.processes[key].process.pid);
                this.processes[key].process.send(message);
                this.processes[key].inUse = true;
                foundAvailable = true;
                this.usedProcesses++;
                break;
            }
        }
        if (!foundAvailable) {
            debug("No processes available. Queuing up work for later");
            this.pendingTasks.push({ message: message, callback: callback });
        }
    },

    /**
     * Send a message to the proces
     * @param {Object} process Process to send the message to.
     * @param {string} message Message to send.
     * @returns {void}
     */
    sendMessage: function(process, message) {
        process.callback(message);
    }
};

module.exports = ProcessPool;
