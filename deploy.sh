##!/usr/bin/env bash
echo -e "Testing deploy"

echo -e "$VARNAME"
echo -e "Pull req"
echo -e "$TRAVIS_PULL_REQUEST"
echo -e "travis:"
echo -e "$TRAVIS"

#if this isn't a pull req set default github token
if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then

    if [ "$TRAVIS" == "true" ]; then
        git config --global user.email "katja@neontribe.co.uk"
        git config --global user.name "katjam"
    fi
echo -e "Git Hub token"
echo -e "$GH_TOKEN"

#checkout gh_pages branch and update with contents of build folder
git checkout gh-pages
cp -r build/* .
git add .
git commit -m "Travis build $TRAVIS_BUILD_NUMBER pushed to Github Pages"
git push origin gh-pages
fi
