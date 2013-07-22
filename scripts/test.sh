#!/bin/bash

#--------------------------------------------------
# Runs all tests and checks code coverage
#
# Must be run:
# 1. From top-level of project.
# 2. After the tag for the next version is created.
#--------------------------------------------------

istanbul=./node_modules/istanbul/lib/cli.js
vows=./node_modules/vows/bin/vows
testfiles=`find tests/ -name '*.js'`
thresholds='--statement 90 --branch 88 --function 90'

npm run-script lint && node $istanbul cover --print both $vows -- --spec $testfiles && node $istanbul check-coverage $thresholds
