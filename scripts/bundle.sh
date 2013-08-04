outputDir=build
bundleFile=$outputDir/eslint-min.js

# generate a module that lists all rules in the rules directory
rulesFile=lib/rules/index.js
echo 'module.exports = function() {' > $rulesFile
echo '  var rules = Object.create(null);' >> $rulesFile
for ruleFile in lib/rules/*.js; do
    if [ $ruleFile '!=' $rulesFile ]; then
        ruleFile=${ruleFile#lib/rules/}
        ruleName=${ruleFile%.js}
        echo "  rules[\"$ruleName\"] = require(\"./$ruleFile\");" >> $rulesFile
    fi
done
echo '  return rules;' >> $rulesFile
echo '};' >> $rulesFile

if [ ! -d $outputDir ]; then
    mkdir $outputDir
fi

# bundle, using our generated rule module instead of dynamic loader in /lib/load-rules.js
node_modules/.bin/cjsify \
    --minify \
    --export eslint \
    --inline-sources --source-map $bundleFile.map \
    --alias /lib/load-rules.js:/lib/rules/index.js \
    lib/eslint.js > $bundleFile

# clean up
rm $rulesFile
