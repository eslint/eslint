#!/bin/bash

#--------------------------------------------------
# Update CHANGELOG.md with changes since last tag.
#
# Must be run:
# 1. From top-level of project.
# 2. After the tag for the next version is created.
#--------------------------------------------------

# Get last two tags
tags=(`git tag | tail -n2`)

# Create tag range for log
range="${tags[0]}..${tags[1]}"

# Get current date
now=`date +"%B %d, %Y"`

# Output section header
echo -e "${tags[1]} - ${now}\n" > /tmp/out

# Output changes between last two tags
git log --pretty=format:'* %s (%an)' $range | grep -v "Merge pull request" | grep -v "Merge branch" >> /tmp/out

# Extra line of separation
echo -e "\n" >> /tmp/out

# Prepend to changelog
cat CHANGELOG.md >> /tmp/out
mv /tmp/out CHANGELOG.md

# Update commit
git add CHANGELOG.md
git commit --amend --no-edit
