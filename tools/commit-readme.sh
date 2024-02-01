#!/bin/bash

#------------------------------------------------------------------------------
# Commits the data files if any have changed
#------------------------------------------------------------------------------

if [ -z "$(git status --porcelain)" ]; then 
	echo "Data did not change."
else
	echo "Data changed!"

	# commit the result
	git add README.md
	git commit -m "docs: Update README"

	# push back to source control
	git push origin HEAD  
fi
