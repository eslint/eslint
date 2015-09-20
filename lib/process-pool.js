"use strict";

/* eslint no-shadow: 0, no-invalid-this: 0 */

var os = require("os"),
    cp = require("child_process");

var numCPUs = os.cpus().length;

module.exports = function pool(module, callback) {
    var processes = {};
    var usedProcesses = 0;
    this.pendingTasks = [];

    this.initializePool = function() {
        var process = cp.fork(module);
        processes[process.pid] = {inUse: false, process: process};
        // console.log("Starting new thread with ID " + process.pid);
        var me = this;
        process.on("message", function(message) {
            if (message === "done") {
                // console.log("Got new done message ", message, process.pid);
                processes[process.pid].inUse = false;
                processes[process.pid].callback = null;
                usedProcesses--;
                if (me.pendingTasks.length > 0) {
                    // console.log("Adding task from the queue");
                    var task = me.pendingTasks.shift();
                    // console.log("Found empty process. Adding task");
                    me.addTask(task.message, task.callback);
                } else {
                    if (usedProcesses === 0) {
                        me.done();
                    }
                }
            } else {
                me.sendMessage(processes[process.pid], message);
            }
        });
        process.on("exit", function() {
            // console.log("Exiting thread");
        });
    };

    this.done = function() {
        callback();
    };

    this.addTask = function(message, callback) {
        var keys = Object.keys(processes);
        var foundAvailable = false;
        for (var i = 0, l = keys.length; i < l; i++) {
            var key = keys[i];
            if (!processes[key].inUse) {
                processes[key].callback = callback;
                processes[key].process.send(message);
                processes[key].inUse = true;
                foundAvailable = true;
                usedProcesses++;
                break;
            }
        }
        if (!foundAvailable) {
            // console.log("All processes are busy queuing up task");
            this.pendingTasks.push({message: message, callback: callback});
        }
    };

    this.sendMessage = function(process, message) {
        process.callback(message);
    };

    for (var i = 0; i < numCPUs; i++) {
        this.initializePool();
    }
};
