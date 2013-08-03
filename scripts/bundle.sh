bundleFile=eslint-min.js

# generate a module that lists all rules in the rules directory
rulesFile=lib/rules/index.js
rules=lib/rules/*.js
for ruleFile in $rules; do
    if [ $ruleFile '!=' $rulesFile ]; then
        ruleFile=${ruleFile#lib/rules/}
        ruleName=${ruleFile%.js}
        echo "exports[\"$ruleName\"] = require(\"./$ruleFile\");" >> $rulesFile
    fi
done

# bundle
node_modules/.bin/cjsify \
    --minify \
    --export eslint \
    -a /lib/load-rules.js:/lib/rules/index.js \
    lib/eslint.js > $bundleFile

# clean up
rm $rulesFile
